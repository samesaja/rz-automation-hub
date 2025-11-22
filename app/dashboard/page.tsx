import Link from 'next/link'
import { Cpu, Activity, TrendingUp, Database, Users, ArrowRight, Zap, Shield, Clock } from 'lucide-react'
import { cookies } from 'next/headers'
import PocketBase from 'pocketbase'
import DashboardStats from '@/components/dashboard-stats'

async function getUser() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('pb_auth')

  if (authCookie) {
    const pb = new PocketBase('http://34.50.111.177:8090')
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`)
    return pb.authStore.model
  }
  return null
}

export default async function DashboardPage() {
  const user = await getUser()
  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">

        {/* Main Cluster Container */}
        <div className="bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[2.5rem] overflow-hidden">

          {/* Header Section */}
          <div className="px-8 py-10 md:px-12 border-b border-gray-200/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Overview</h1>
                <p className="text-lg text-gray-500 mt-2">Welcome back to your automation command center.</p>
              </div>
              <div className="flex items-center gap-3 bg-white/50 px-4 py-2 rounded-full border border-white/50 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-600">System Operational</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <DashboardStats />

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-3 min-h-[500px]">

            {/* Primary Actions (2/3 width) */}
            <div className="md:col-span-2 p-8 md:p-12 space-y-8">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-gray-400" />
                Control Center
              </h2>

              <div className="grid gap-6">
                <Link href="/dashboard/workflows" className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100/50 p-8 border border-orange-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 no-underline">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cpu className="w-32 h-32 text-orange-600" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Automation Workflows</h3>
                    <p className="text-gray-600 max-w-md mb-6">Manage your n8n pipelines, trigger webhooks, and monitor execution status in real-time.</p>
                    <span className="inline-flex items-center gap-2 text-orange-700 font-semibold group-hover:gap-3 transition-all">
                      Manage Pipelines <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>

                <div className="grid md:grid-cols-2 gap-6">
                  <Link href="/dashboard/ai" className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100/50 p-8 border border-rose-100 hover:shadow-lg hover:border-rose-200 transition-all duration-300 no-underline">
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">AI Studio</h3>
                      <p className="text-sm text-gray-600 mb-4">Gemini Flash 2.5 tools</p>
                      <span className="inline-flex items-center gap-2 text-rose-700 text-sm font-semibold group-hover:gap-3 transition-all">
                        Open Studio <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>

                  <Link href="/dashboard/logs" className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 to-teal-100/50 p-8 border border-teal-100 hover:shadow-lg hover:border-teal-200 transition-all duration-300 no-underline">
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
                        <Database className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">System Logs</h3>
                      <p className="text-sm text-gray-600 mb-4">Monitor performance</p>
                      <span className="inline-flex items-center gap-2 text-teal-700 text-sm font-semibold group-hover:gap-3 transition-all">
                        View Logs <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions Sidebar (1/3 width) */}
            <div className="bg-gray-50/50 border-l border-gray-200/50 p-8 md:p-12 space-y-8">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                Quick Access
              </h2>

              <div className="space-y-4">
                {isAdmin && (
                  <Link href="/dashboard/users" className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all group no-underline">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">User Management</p>
                      <p className="text-xs text-gray-500">PocketBase users</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors" />
                  </Link>
                )}

                <Link href="/dashboard/api-playground" className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group no-underline">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">API Playground</p>
                    <p className="text-xs text-gray-500">Test endpoints</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                </Link>

                <Link href="/dashboard/showcase" className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all group no-underline">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Project Showcase</p>
                    <p className="text-xs text-gray-500">View portfolio</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-rose-500 transition-colors" />
                </Link>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20">
                  <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                  <p className="text-indigo-100 text-sm mb-4">Connect your n8n workflows to trigger complex automations directly from this dashboard.</p>
                  <button className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                    Learn more
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
