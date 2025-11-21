'use client'

import LogTable from '@/components/log-table'

export default function LogsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold text-gray-900">Execution Logs</h1>
        <p className="text-gray-600">Monitor and troubleshoot your automation workflows</p>
      </div>

      <LogTable />
    </div>
  )
}
