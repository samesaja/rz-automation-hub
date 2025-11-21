import Link from 'next/link'
import { Cpu, Activity, TrendingUp, Database } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl w-full mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-gray-900">Overview</h1>
          <p className="text-lg text-gray-500">Welcome to your automation control center</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-8">
          <div className="macos-card p-8 flex flex-col items-start space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-2">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">API Calls</p>
            <p className="text-2xl font-semibold text-gray-900">1,248</p>
            <p className="text-xs text-gray-500">+12.5% from last week</p>
          </div>
          <div className="macos-card p-8 flex flex-col items-start space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-2">
              <Cpu className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Active Workflows</p>
            <p className="text-2xl font-semibold text-gray-900">12</p>
            <p className="text-xs text-gray-500">3 running now</p>
          </div>
          <div className="macos-card p-8 flex flex-col items-start space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-rose-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">AI Requests</p>
            <p className="text-2xl font-semibold text-gray-900">847</p>
            <p className="text-xs text-gray-500">+28.3% from last week</p>
          </div>
          <div className="macos-card p-8 flex flex-col items-start space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center mb-2">
              <Database className="w-6 h-6 text-teal-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Success Rate</p>
            <p className="text-2xl font-semibold text-gray-900">98.7%</p>
            <p className="text-xs text-gray-500">Excellent performance</p>
          </div>
        </div>
        
        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/dashboard/workflows" className="macos-card p-8 flex flex-col h-full group space-y-6 hover:shadow-xl transition cursor-pointer no-underline">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Automation Controls</h3>
            <p className="text-sm text-gray-600">
              Manage and trigger your n8n workflows, monitor execution, and control pipelines.
            </p>
            <span className="flex items-center gap-2 text-orange-600 text-sm font-medium pt-2 group-hover:gap-3 transition-all">
              Manage Workflows <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
          
          <Link href="/dashboard/ai" className="macos-card p-8 flex flex-col h-full group space-y-6 hover:shadow-xl transition cursor-pointer no-underline">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">AI Tools</h3>
            <p className="text-sm text-gray-600">
              Access Gemini Flash 2.5 for content generation, analysis, and automation.
            </p>
            <span className="flex items-center gap-2 text-rose-600 text-sm font-medium pt-2 group-hover:gap-3 transition-all">
              Open AI Studio <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
          
          <Link href="/dashboard/logs" className="macos-card p-8 flex flex-col h-full group space-y-6 hover:shadow-xl transition cursor-pointer no-underline">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Database className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Logs & Monitoring</h3>
            <p className="text-sm text-gray-600">Track logs, monitor performance, and troubleshoot workflows.</p>
            <span className="flex items-center gap-2 text-teal-600 text-sm font-medium pt-2 group-hover:gap-3 transition-all">
              View Logs <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
        
        {/* Quick Actions */}
        <div className="macos-card p-8 space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/dashboard/api-playground" className="btn-macos w-full flex items-center gap-4 justify-between no-underline">
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
            </Link>
            <Link href="/dashboard/showcase" className="btn-macos w-full flex items-center gap-4 justify-between no-underline">
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
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
