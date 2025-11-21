import { NextRequest, NextResponse } from 'next/server'
import { generateId } from '@/lib/utils'

// Mock logs data - in production, this would come from a database
const mockLogs = [
  {
    id: generateId(),
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    workflow: 'Data Sync Workflow',
    status: 'success',
    duration: 1243,
    message: 'Successfully synchronized 1,248 records from source database to destination',
  },
  {
    id: generateId(),
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    workflow: 'Email Automation',
    status: 'success',
    duration: 892,
    message: 'Sent 45 automated emails to customers. All deliveries confirmed.',
  },
  {
    id: generateId(),
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    workflow: 'Report Generation',
    status: 'running',
    duration: 0,
    message: 'Generating daily analytics report. Processing 3,421 data points...',
  },
  {
    id: generateId(),
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    workflow: 'Data Sync Workflow',
    status: 'failed',
    duration: 5234,
    message: 'Connection timeout: Unable to connect to source database after 30 seconds',
  },
  {
    id: generateId(),
    timestamp: new Date(Date.now() - 65 * 60000).toISOString(),
    workflow: 'API Integration',
    status: 'success',
    duration: 456,
    message: 'Successfully fetched and processed data from external API endpoint',
  },
  {
    id: generateId(),
    timestamp: new Date(Date.now() - 125 * 60000).toISOString(),
    workflow: 'Email Automation',
    status: 'success',
    duration: 1102,
    message: 'Campaign completed. 98.7% delivery rate, 24.3% open rate.',
  },
  {
    id: generateId(),
    timestamp: new Date(Date.now() - 185 * 60000).toISOString(),
    workflow: 'Report Generation',
    status: 'success',
    duration: 2843,
    message: 'Monthly report generated and saved to cloud storage',
  },
  {
    id: generateId(),
    timestamp: new Date(Date.now() - 245 * 60000).toISOString(),
    workflow: 'Data Sync Workflow',
    status: 'success',
    duration: 1567,
    message: 'Incremental sync completed. 342 records updated, 15 new records added',
  },
]

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database with filters, pagination, etc.
    return NextResponse.json({
      logs: mockLogs,
      total: mockLogs.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}
