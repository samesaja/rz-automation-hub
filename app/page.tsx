import Link from 'next/link'
import { Cpu, Activity, TrendingUp, Database } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold text-gray-900">Overview</h1>
        <p className="text-gray-600">Welcome to your automation control center</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="macos-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">API Calls</p>
            <Activity className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">1,248</p>
          <p className="text-xs text-gray-500">+12.5% from last week</p>
        </div>
        <div className="macos-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Active Workflows</p>
            <Cpu className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">12</p>
          <p className="text-xs text-gray-500">3 running now</p>
        </div>
        <div className="macos-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">AI Requests</p>
            <TrendingUp className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">847</p>
          <p className="text-xs text-gray-500">+28.3% from last week</p>
        </div>
        <div className="macos-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
            <Database className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">98.7%</p>
          <p className="text-xs text-gray-500">Excellent performance</p>
        </div>
      </div>

      {/* Main Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/dashboard/workflows">
          <div className="macos-card p-8 h-full space-y-4 cursor-pointer hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Automation Controls</h3>
            <p className="text-sm text-gray-600">Manage and trigger your n8n workflows, monitor execution, and control pipelines.</p>
            <div className="flex items-center gap-2 text-orange-600 text-sm font-medium pt-2 group-hover:gap-3 transition-all">
              Manage Workflows <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/ai">
          <div className="macos-card p-8 h-full space-y-4 cursor-pointer hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">AI Tools</h3>
            <p className="text-sm text-gray-600">Access Gemini Flash 2.5 for content generation, analysis, and automation.</p>
            <div className="flex items-center gap-2 text-rose-600 text-sm font-medium pt-2 group-hover:gap-3 transition-all">
              Open AI Studio <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/logs">
          <div className="macos-card p-8 h-full space-y-4 cursor-pointer hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Database className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Logs & Monitoring</h3>
            <p className="text-sm text-gray-600">Track logs, monitor performance, and troubleshoot workflows.</p>
            <div className="flex items-center gap-2 text-teal-600 text-sm font-medium pt-2 group-hover:gap-3 transition-all">
              View Logs <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="macos-card p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/dashboard/api-playground">
            <button className="btn-macos w-full text-left flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Test API</p>
                  <p className="text-xs text-gray-500">Quick API testing</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </Link>
          <Link href="/dashboard/showcase">
            <button className="btn-macos w-full text-left flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">View Projects</p>
                  <p className="text-xs text-gray-500">Browse showcase</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
