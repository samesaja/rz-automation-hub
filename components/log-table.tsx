'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Log {
  id: string
  timestamp: string
  workflow: string
  status: 'success' | 'failed' | 'running'
  duration: number
  message: string
}

export default function LogTable() {
  const [logs, setLogs] = useState<Log[]>([])
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/logs')
      const data = await res.json()
      setLogs(data.logs)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'running':
        return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      success: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      running: 'bg-blue-100 text-blue-700'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="macos-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Workflow
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.workflow}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {log.duration}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="macos-card max-w-2xl w-full p-8 space-y-6 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Log Details</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedLog.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedLog.status)}`}>
                  {selectedLog.status}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Workflow</p>
                <p className="text-gray-900">{selectedLog.workflow}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Timestamp</p>
                <p className="text-gray-900">{new Date(selectedLog.timestamp).toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Duration</p>
                <p className="text-gray-900">{selectedLog.duration}ms</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Message</p>
                <div className="glass-panel rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedLog.message}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="btn-macos w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
