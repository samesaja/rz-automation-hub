import { NextResponse } from 'next/server'
import { n8nClient } from '@/lib/n8n'
import { getAdminPb } from '@/lib/pocketbase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // 1. Fetch n8n workflows to get active count
        const workflows = await n8nClient.listWorkflows()
        const activeWorkflows = workflows.filter((w: any) => w.active).length
        const runningWorkflows = 0 // n8n API doesn't easily give us "currently running" without polling executions, setting to 0 or mock for now

        // 2. Fetch Logs from PocketBase for API Calls & Success Rate
        const pb = await getAdminPb()

        // We need total count, so we request 1 item but look at totalItems
        const logsResult = await pb.collection('app_logs').getList(1, 1, {
            sort: '-id',
        })
        const totalApiCalls = logsResult.totalItems

        // To calculate success rate and AI requests, we might need a sample of recent logs
        // Fetching last 100 logs to estimate trends
        const recentLogs = await pb.collection('app_logs').getList(1, 100, {
            sort: '-id',
        })

        const successCount = recentLogs.items.filter((log: any) => log.status === 'success').length
        const totalRecent = recentLogs.items.length
        const successRate = totalRecent > 0 ? (successCount / totalRecent) * 100 : 100

        // Estimate AI requests - assuming they are tagged or have specific workflow names
        // For now, let's count logs where workflow name contains "ai" or "gpt" or "gemini"
        const aiRequestsCount = recentLogs.items.filter((log: any) => {
            const name = (log.workflow || '').toLowerCase()
            return name.includes('ai') || name.includes('gpt') || name.includes('gemini') || name.includes('llm')
        }).length

        // Extrapolating AI requests to total if needed, or just showing recent count. 
        // Let's try to get a total count if possible, otherwise use the sample ratio * total
        const aiRatio = totalRecent > 0 ? aiRequestsCount / totalRecent : 0
        const estimatedTotalAiRequests = Math.round(totalApiCalls * aiRatio)

        return NextResponse.json({
            apiCalls: {
                total: totalApiCalls,
                trend: 12.5 // Mock trend for now, or calculate from previous day if we had history
            },
            activeWorkflows: {
                total: workflows.length,
                active: activeWorkflows,
                running: runningWorkflows
            },
            aiRequests: {
                total: estimatedTotalAiRequests,
                trend: 28.3 // Mock trend
            },
            successRate: {
                value: parseFloat(successRate.toFixed(1)),
                label: successRate >= 98 ? 'Excellent' : successRate >= 90 ? 'Good' : 'Needs Attention'
            }
        })

    } catch (error: any) {
        console.error('Failed to fetch stats:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch stats' },
            { status: 500 }
        )
    }
}
