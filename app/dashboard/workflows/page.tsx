'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RefreshCw, Clock, CheckCircle, XCircle, Pencil, ExternalLink } from 'lucide-react'

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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [creating, setCreating] = useState(false)

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null)
  const [editWorkflowName, setEditWorkflowName] = useState('')
  const [updating, setUpdating] = useState(false)

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWorkflowName.trim()) return

    setCreating(true)
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWorkflowName })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create workflow')
      }

      setNewWorkflowName('')
      setIsCreateModalOpen(false)
      fetchWorkflows()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create workflow')
    } finally {
      setCreating(false)
    }
  }

  const openEditModal = (workflow: Workflow) => {
    setEditingWorkflow(workflow)
    setEditWorkflowName(workflow.name)
    setIsEditModalOpen(true)
  }

  const handleUpdateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingWorkflow || !editWorkflowName.trim()) return

    setUpdating(true)
    try {
      const response = await fetch('/api/workflows', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingWorkflow.id, name: editWorkflowName })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update workflow')
      }

      setIsEditModalOpen(false)
      setEditingWorkflow(null)
      fetchWorkflows()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update workflow')
    } finally {
      setUpdating(false)
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Create Workflow
          </button>
          <button
            onClick={fetchWorkflows}
            className="btn-macos flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Create Workflow Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">New Workflow</h2>
            <p className="text-gray-500 mb-6">Give your automation pipeline a name.</p>

            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Workflow Name</label>
                <input
                  type="text"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  placeholder="e.g., Daily Report Generator"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newWorkflowName.trim()}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {creating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Workflow'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Workflow Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Workflow</h2>
            <p className="text-gray-500 mb-6">Rename your automation pipeline.</p>

            <form onSubmit={handleUpdateWorkflow} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Workflow Name</label>
                <input
                  type="text"
                  value={editWorkflowName}
                  onChange={(e) => setEditWorkflowName(e.target.value)}
                  placeholder="e.g., Daily Report Generator"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating || !editWorkflowName.trim()}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${workflow.status === 'running'
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
                        <span className={`text-sm font-medium ${workflow.successRate >= 99 ? 'text-teal-600' :
                          workflow.successRate >= 95 ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                          {workflow.successRate}% success
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`${process.env.NEXT_PUBLIC_N8N_URL?.replace(/\/$/, '')}/workflow/${workflow.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-macos px-4 py-2 text-gray-600 hover:text-teal-600"
                      title="Open in n8n Editor"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => openEditModal(workflow)}
                      className="btn-macos px-4 py-2"
                      title="Rename workflow"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={fetchWorkflows}
                      className="btn-macos px-4 py-2"
                      title="Refresh workflow"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(workflow.id, workflow.status)}
                      className={`btn-macos px-6 py-2 ${workflow.status === 'running' ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'
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
