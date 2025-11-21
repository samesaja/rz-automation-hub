import { NextResponse } from 'next/server'
import { n8nClient } from '@/lib/n8n'

export async function GET() {
  try {
    const workflows = await n8nClient.listWorkflows()
    return NextResponse.json(workflows)
  } catch (e) {
    const error = e as Error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


