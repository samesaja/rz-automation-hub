'use client'

import { useState, useEffect, useRef } from 'react'
import { pb } from '@/lib/pocketbase'
import { Activity, Play, Pause, Trash2, Filter, ArrowDown } from 'lucide-react'

interface LogEvent {
    id: string
    timestamp: Date
    action: string
    collection: string
    recordId: string
    data: any
}

export default function RealtimeMonitorPage() {
    const [logs, setLogs] = useState<LogEvent[]>([])
    const [isPaused, setIsPaused] = useState(false)
    const logsEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isPaused) return

        // Subscribe to all events
        pb.realtime.subscribe('*', (e) => {
            const newLog: LogEvent = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date(),
                action: e.action,
                collection: e.collection, // This might be empty for some events, but usually present for record events
                recordId: e.record?.id || 'N/A',
                data: e.record
            }

            setLogs(prev => [newLog, ...prev].slice(0, 100)) // Keep last 100 logs
        })

        return () => {
            pb.realtime.unsubscribe('*')
        }
    }, [isPaused])

    const clearLogs = () => setLogs([])

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* Controls */}
            <div className="flex items-center justify-between p-4 glass-panel rounded-xl">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-gray-400' : 'bg-green-500 animate-pulse'}`} />
                        <span className="font-medium text-gray-900">
                            {isPaused ? 'Monitoring Paused' : 'Live Monitoring'}
                        </span>
                    </div>
                    <div className="h-4 w-px bg-gray-200" />
                    <span className="text-sm text-gray-500">{logs.length} events captured</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isPaused
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                            }`}
                    >
                        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                        onClick={clearLogs}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <p className="text-gray-500">
                            Watch RZ Data automation events in realtime.
                        </p>
                    </button>
                </div>
            </div>

            {/* Logs Feed */}
            <div className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500 uppercase">
                    <div className="w-24">Time</div>
                    <div className="w-24">Action</div>
                    <div className="w-32">Collection</div>
                    <div className="w-32">Record ID</div>
                    <div className="flex-1">Data Payload</div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {logs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Activity className="w-12 h-12 mb-4 opacity-50" />
                            <p>Waiting for realtime events...</p>
                            <p className="text-sm mt-2">Try creating or updating a record in another window</p>
                        </div>
                    ) : (
                        logs.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 text-sm font-mono"
                            >
                                <div className="w-24 text-gray-500 flex-shrink-0">
                                    {log.timestamp.toLocaleTimeString()}
                                </div>
                                <div className="w-24 flex-shrink-0">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.action === 'create' ? 'bg-green-100 text-green-700' :
                                        log.action === 'update' ? 'bg-blue-100 text-blue-700' :
                                            log.action === 'delete' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {log.action}
                                    </span>
                                </div>
                                <div className="w-32 text-gray-700 truncate flex-shrink-0" title={log.collection}>
                                    {log.collection}
                                </div>
                                <div className="w-32 text-gray-500 truncate flex-shrink-0" title={log.recordId}>
                                    {log.recordId}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap break-all">
                                        {JSON.stringify(log.data, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={logsEndRef} />
                </div>
            </div>
        </div>
    )
}
