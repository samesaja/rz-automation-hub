import { NextResponse } from 'next/server'
import { n8nClient } from '@/lib/n8n'

export async function GET() {
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

    return NextResponse.json(mappedWorkflows)
  } catch (e) {
    const error = e as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    return NextResponse.json(mappedWorkflow)
  } catch (error: any) {
    console.error('Failed to create workflow:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
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
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error: any) {
    console.error('Failed to update workflow:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}


