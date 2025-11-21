'use client'

import { useState } from 'react'
import { Play, Pause, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function WorkflowsPage() {
  const [workflows] = useState([
    {
      id: 1,
      name: 'Data Sync Pipeline',
      status: 'running',
      lastRun: '2 minutes ago',
      executions: 1248,
      successRate: 98.5
    },
    {
      id: 2,
      name: 'Email Automation',
      status: 'idle',
      lastRun: '1 hour ago',
      executions: 847,
      successRate: 99.2
    },
    {
      id: 3,
      name: 'Report Generator',
      status: 'running',
      lastRun: '5 minutes ago',
      executions: 523,
      successRate: 97.8
    },
    {
      id: 4,
      name: 'Backup Service',
      status: 'idle',
      lastRun: '3 hours ago',
      executions: 342,
      successRate: 100
    }
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold text-gray-900">Automation Workflows</h1>
        <p className="text-gray-600">Manage and monitor your n8n workflows</p>
      </div>

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
            {(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">Performance metric</p>
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Active Workflows</h2>
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
                        Last run: {workflow.lastRun}
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
                  <button className="btn-macos px-4 py-2">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className={`btn-macos px-6 py-2 ${
                    workflow.status === 'running' ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'
                  }`}>
                    {workflow.status === 'running' ? 'Stop' : 'Start'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
