import { NextResponse } from 'next/server'
import { n8nClient } from '@/lib/n8n'
import { getDb } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // 1. Fetch n8n workflows to get active count
        const workflows = await n8nClient.listWorkflows()
        const activeWorkflows = workflows.filter((w: any) => w.active).length
        const runningWorkflows = 0 // Polling n8n for running is expensive, leaving as 0

        // 2. Fetch Logs from MongoDB for API Calls & Success Rate
        const db = await getDb()
        const logsCollection = db.collection('app_logs')

        // Total API Calls
        const totalApiCalls = await logsCollection.countDocuments({})

        // Recent stats (last 100)
        const recentLogs = await logsCollection.find({})
            .sort({ created: -1 }) // or _id: -1
            .limit(100)
            .toArray()

        const successCount = recentLogs.filter((log: any) => log.status === 'success').length
        const totalRecent = recentLogs.length
        const successRate = totalRecent > 0 ? (successCount / totalRecent) * 100 : 100

        // Estimate AI requests
        const aiRequestsCount = recentLogs.filter((log: any) => {
            const name = (log.workflow || '').toLowerCase()
            return name.includes('ai') || name.includes('gpt') || name.includes('gemini') || name.includes('llm')
        }).length

        const aiRatio = totalRecent > 0 ? aiRequestsCount / totalRecent : 0
        const estimatedTotalAiRequests = Math.round(totalApiCalls * aiRatio)

        return NextResponse.json({
            apiCalls: {
                total: totalApiCalls,
                trend: 12.5
            },
            activeWorkflows: {
                total: workflows.length,
                active: activeWorkflows,
                running: runningWorkflows
            },
            aiRequests: {
                total: estimatedTotalAiRequests,
                trend: 28.3
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
