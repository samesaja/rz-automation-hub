'use client'

import { Activity, Cpu, TrendingUp, Zap, Shield } from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DashboardStats() {
    const { data, error, isLoading } = useSWR('/api/stats', fetcher, {
        refreshInterval: 5000, // Poll every 5 seconds
    })

    if (error) return <div>Failed to load stats</div>
    if (isLoading || !data) return <StatsSkeleton />

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200/50 border-b border-gray-200/50">
            <div className="p-8 md:p-10 hover:bg-white/30 transition-colors group">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 group-hover:scale-110 transition-transform">
                        <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">API Calls</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{data.apiCalls.total.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +{data.apiCalls.trend}%
                </p>
            </div>
            <div className="p-8 md:p-10 hover:bg-white/30 transition-colors group">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Active Workflows</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{data.activeWorkflows.active}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">{data.activeWorkflows.total} total</p>
            </div>
            <div className="p-8 md:p-10 hover:bg-white/30 transition-colors group">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 group-hover:scale-110 transition-transform">
                        <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">AI Requests</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{data.aiRequests.total.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +{data.aiRequests.trend}%
                </p>
            </div>
            <div className="p-8 md:p-10 hover:bg-white/30 transition-colors group">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-2.5 rounded-xl bg-teal-100 text-teal-600 group-hover:scale-110 transition-transform">
                        <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Success Rate</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{data.successRate.value}%</p>
                <p className="text-xs text-gray-400 font-medium mt-1">{data.successRate.label}</p>
            </div>
        </div>
    )
}

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200/50 border-b border-gray-200/50 animate-pulse">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="p-8 md:p-10">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-200" />
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="h-8 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    )
}
