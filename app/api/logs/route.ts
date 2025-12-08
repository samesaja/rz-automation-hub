import { NextRequest, NextResponse } from 'next/server'
import { n8nClient } from '@/lib/n8n'
import { getDb } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    // 1. Fetch n8n executions
    const executionsPromise = n8nClient.listExecutions(50)

    // 2. Fetch App API logs from MongoDB
    const dbPromise = getDb().then(db =>
      db.collection('app_logs')
        .find({})
        .sort({ created: -1 })
        .limit(50)
        .toArray()
    )

    const [executions, appLogsDocs] = await Promise.all([
      executionsPromise,
      dbPromise.catch(() => [])
    ])

    // Map n8n logs
    const n8nLogs = executions.map((exec: any) => {
      const startTime = new Date(exec.startedAt).getTime()
      const endTime = exec.stoppedAt ? new Date(exec.stoppedAt).getTime() : Date.now()
      const duration = endTime - startTime

      let status = 'running'
      if (exec.finished) {
        status = exec.data?.resultData?.error ? 'failed' : 'success'
      }

      return {
        id: exec.id,
        timestamp: exec.startedAt,
        workflow: exec.workflowName || 'Unknown Workflow',
        status,
        duration,
        message: exec.data?.resultData?.error?.message || `Execution ${status} in ${duration}ms`,
        source: 'n8n'
      }
    })

    // Map App logs
    const appLogs = appLogsDocs.map((log: any) => ({
      id: log._id.toString(),
      timestamp: log.created,
      workflow: log.workflow,
      status: log.status,
      duration: log.duration,
      message: log.message,
      source: 'api'
    }))

    // Merge and Sort
    const allLogs = [...n8nLogs, ...appLogs].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    return NextResponse.json({
      logs: allLogs.slice(0, 50), // Return top 50 combined
      total: allLogs.length,
    })
  } catch (error: any) {
    console.error('Failed to fetch logs:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}
