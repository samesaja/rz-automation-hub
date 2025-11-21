'use client'

import { useState } from 'react'
import { Play, Zap, CheckCircle, XCircle } from 'lucide-react'

const workflows = [
  { id: 'data-sync', name: 'Data Sync Workflow', description: 'Synchronize data between systems' },
  { id: 'email-automation', name: 'Email Automation', description: 'Automated email campaigns' },
  { id: 'report-generation', name: 'Report Generation', description: 'Generate daily reports' },
]

export default function WorkflowTrigger() {
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, any>>({})

  const triggerWorkflow = async (workflowId: string, payload: any = {}) => {
    setLoading(workflowId)
    try {
      const res = await fetch(`/api/trigger/${workflowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setResults(prev => ({ ...prev, [workflowId]: { success: true, data } }))
    } catch (error: any) {
      setResults(prev => ({ ...prev, [workflowId]: { success: false, error: error.message } }))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="macos-card p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Workflow Triggers</h2>
          <p className="text-sm text-gray-600">Execute your n8n workflows</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {workflows.map((workflow) => {
          const result = results[workflow.id]
          const isLoading = loading === workflow.id

          return (
            <div key={workflow.id} className="glass-panel rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                <p className="text-sm text-gray-600">{workflow.description}</p>
              </div>

              <button
                onClick={() => triggerWorkflow(workflow.id)}
                disabled={isLoading}
                className="btn-macos w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  'Running...'
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Trigger
                  </>
                )}
              </button>

              {result && (
                <div className={`flex items-center gap-2 text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.success ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Success
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Failed
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
