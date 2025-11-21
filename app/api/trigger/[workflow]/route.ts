import { NextRequest, NextResponse } from 'next/server'
import { n8nClient } from '@/lib/n8n'

export async function POST(
  request: NextRequest,
  { params }: { params: { workflow: string } }
) {
  try {
    const workflowId = params.workflow
    const payload = await request.json()

    const result = await n8nClient.triggerWorkflow(workflowId, payload)

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
