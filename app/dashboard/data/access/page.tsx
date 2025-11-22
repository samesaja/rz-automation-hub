'use client'

import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { Shield, Check, X, Lock, Globe } from 'lucide-react'

interface CollectionRules {
    id: string
    name: string
    listRule: string | null
    viewRule: string | null
    createRule: string | null
    updateRule: string | null
    deleteRule: string | null
    type: string
}

export default function AccessControlPage() {
    const [collections, setCollections] = useState<CollectionRules[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const result = await pb.collections.getFullList({
                    sort: 'name',
                })
                setCollections(result as unknown as CollectionRules[])
            } catch (err) {
                console.error('Failed to fetch collections:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchRules()
    }, [])

    const RuleBadge = ({ rule }: { rule: string | null }) => {
        if (rule === null) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                    <Lock className="w-3 h-3" />
                    Admin Only
                </span>
            )
        }
        if (rule === '') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                    <Globe className="w-3 h-3" />
                    Public
                </span>
            )
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100 font-mono max-w-[150px] truncate" title={rule}>
                <Shield className="w-3 h-3" />
                {rule}
            </span>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">API Rules & Access Control</h2>
                <p className="text-sm text-gray-500">Overview of access rules for your collections</p>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 font-medium">Collection</th>
                                <th className="px-6 py-3 font-medium">List</th>
                                <th className="px-6 py-3 font-medium">View</th>
                                <th className="px-6 py-3 font-medium">Create</th>
                                <th className="px-6 py-3 font-medium">Update</th>
                                <th className="px-6 py-3 font-medium">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Loading rules...
                                    </td>
                                </tr>
                            ) : collections.map((col) => (
                                <tr key={col.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${col.type === 'auth' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                                            {col.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><RuleBadge rule={col.listRule} /></td>
                                    <td className="px-6 py-4"><RuleBadge rule={col.viewRule} /></td>
                                    <td className="px-6 py-4"><RuleBadge rule={col.createRule} /></td>
                                    <td className="px-6 py-4"><RuleBadge rule={col.updateRule} /></td>
                                    <td className="px-6 py-4"><RuleBadge rule={col.deleteRule} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
