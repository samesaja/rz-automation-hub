'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Workflow {
  id: string
  name: string
  status: string
  lastRun: string
  executions: number
  successRate: number
  description?: string
  created: string
  updated: string
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchWorkflows = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/workflows')
      if (!response.ok) throw new Error('Failed to fetch workflows')
      const data = await response.json()
      setWorkflows(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflows')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'running' ? 'idle' : 'running'
    try {
      const response = await fetch('/api/workflows', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update workflow')
      fetchWorkflows()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update workflow')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-gray-900">Automation Workflows</h1>
          <p className="text-gray-600">Manage and monitor your n8n workflows</p>
        </div>
        <button 
          onClick={fetchWorkflows}
          className="btn-macos flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="macos-card p-4 bg-rose-50 border-rose-200">
          <p className="text-sm text-rose-600">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="macos-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Total Workflows</p>
            <RefreshCw className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{workflows.length}</p>
          <p className="text-xs text-gray-500">Active pipelines</p>
        </div>

        <div className="macos-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Running</p>
            <Play className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {workflows.filter(w => w.status === 'running').length}
          </p>
          <p className="text-xs text-gray-500">Currently executing</p>
        </div>

        <div className="macos-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Total Executions</p>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {workflows.reduce((sum, w) => sum + w.executions, 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">All time</p>
        </div>

        <div className="macos-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Avg Success Rate</p>
            <CheckCircle className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {workflows.length > 0 
              ? (workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length).toFixed(1)
              : '0.0'
            }%
          </p>
          <p className="text-xs text-gray-500">Performance metric</p>
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Active Workflows</h2>
        {loading ? (
          <div className="macos-card p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading workflows...</p>
          </div>
        ) : workflows.length === 0 ? (
          <div className="macos-card p-12 text-center">
            <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No workflows found</p>
            <p className="text-sm text-gray-400">Run `npm run seed` to add sample data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workflows.map((workflow) => (
            <div key={workflow.id} className="macos-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    workflow.status === 'running' 
                      ? 'bg-rose-100' 
                      : 'bg-gray-100'
                  }`}>
                    {workflow.status === 'running' ? (
                      <Play className="w-6 h-6 text-rose-600" />
                    ) : (
                      <Pause className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500">
                        Last run: {formatTimeAgo(workflow.lastRun)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {workflow.executions.toLocaleString()} executions
                      </span>
                      <span className={`text-sm font-medium ${
                        workflow.successRate >= 99 ? 'text-teal-600' : 
                        workflow.successRate >= 95 ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {workflow.successRate}% success
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={fetchWorkflows}
                    className="btn-macos px-4 py-2"
                    title="Refresh workflow"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(workflow.id, workflow.status)}
                    className={`btn-macos px-6 py-2 ${
                      workflow.status === 'running' ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'
                    }`}
                  >
                    {workflow.status === 'running' ? 'Stop' : 'Start'}
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
