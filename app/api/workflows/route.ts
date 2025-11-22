import { NextResponse } from 'next/server'
import { n8nClient } from '@/lib/n8n'
import { logActivity } from '@/lib/logger'

export async function GET() {
  const start = Date.now()
  try {
    const workflows = await n8nClient.listWorkflows()

    // Transform n8n data to match frontend interface
    const mappedWorkflows = workflows.map((w: any) => ({
      id: w.id,
      name: w.name,
      status: w.active ? 'running' : 'idle',
      lastRun: w.updatedAt || w.createdAt,
      executions: 0, // Default value as n8n list API doesn't provide this
      successRate: 100, // Default value
      created: w.createdAt,
      updated: w.updatedAt
    }))

    await logActivity('API: List Workflows', 'success', `Fetched ${workflows.length} workflows`, Date.now() - start)
    return NextResponse.json(mappedWorkflows)
  } catch (e) {
    const error = e as Error
    await logActivity('API: List Workflows', 'failed', error.message, Date.now() - start)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const start = Date.now()
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Workflow name is required' },
        { status: 400 }
      )
    }

    const result = await n8nClient.createWorkflow(name)

    if (!result.success) {
      await logActivity('API: Create Workflow', 'failed', result.error || 'Unknown error', Date.now() - start)
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Map the single created workflow as well
    const w = result.data
    const mappedWorkflow = {
      id: w.id,
      name: w.name,
      status: w.active ? 'running' : 'idle',
      lastRun: w.updatedAt || w.createdAt,
      executions: 0,
      successRate: 100,
      created: w.createdAt,
      updated: w.updatedAt
    }

    await logActivity('API: Create Workflow', 'success', `Created workflow ${name}`, Date.now() - start)
    return NextResponse.json(mappedWorkflow)
  } catch (error: any) {
    console.error('Failed to create workflow:', error)
    await logActivity('API: Create Workflow', 'failed', error.message, Date.now() - start)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const start = Date.now()
  try {
    const body = await request.json()
    const { id, name, status } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (status) updateData.active = status === 'running'

    const result = await n8nClient.updateWorkflow(id, updateData)

    if (!result.success) {
      await logActivity('API: Update Workflow', 'failed', result.error || 'Unknown error', Date.now() - start)
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    await logActivity('API: Update Workflow', 'success', `Updated workflow ${id}`, Date.now() - start)
    return NextResponse.json(result.data)
  } catch (error: any) {
    console.error('Failed to update workflow:', error)
    await logActivity('API: Update Workflow', 'failed', error.message, Date.now() - start)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}


