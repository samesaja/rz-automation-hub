'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, AlertCircle } from 'lucide-react'

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

    const fetchRules = async () => {
        try {
            const response = await fetch('/api/collections')
            if (!response.ok) throw new Error('Failed to fetch collections')
            const result = await response.json()
            setCollections(result as unknown as CollectionRules[])
        } catch (err) {
            console.error('Failed to fetch collections:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRules()
    }, [])

    const toggleRule = async (collectionId: string, ruleName: string, currentValue: string | null) => {
        // Simple Logic: 
        // If current is NULL (Admin Only) -> Set to "" (Public)
        // If current is "" (Public) -> Set to NULL (Admin Only)
        // If current is specific string -> Set to NULL (Admin Only) - assuming toggle means "Enable Public Access"

        const newValue = currentValue === null ? "" : null;

        try {
            const response = await fetch(`/api/collections/${collectionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [ruleName]: newValue }),
            })

            if (!response.ok) throw new Error('Failed to update rules')

            // Optimistic update
            setCollections(prev => prev.map(c => {
                if (c.id === collectionId) {
                    return { ...c, [ruleName]: newValue }
                }
                return c
            }))

        } catch (error) {
            console.error('Error saving rules:', error)
            alert('Failed to save changes')
            fetchRules() // Revert on error
        }
    }

    const PermissionToggle = ({
        active,
        onClick
    }: {
        active: boolean,
        onClick: () => void
    }) => (
        <button
            onClick={onClick}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${active ? 'bg-red-500' : 'bg-gray-200'
                }`}
        >
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${active ? 'translate-x-6' : 'translate-x-0'
                }`} />
        </button>
    )

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">API Access & Permissions</h2>
                    <p className="text-sm text-gray-500 mt-1">Configure public access rules for your collections</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Public Access</span>
                    <span className="w-2 h-2 rounded-full bg-gray-300 ml-2" />
                    <span>Admin Only</span>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Collection</th>
                                <th className="px-6 py-4 text-center w-32">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">GET</span>
                                    <div className="text-[10px] uppercase mt-1 font-normal">List/Search</div>
                                </th>
                                <th className="px-6 py-4 text-center w-32">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">GET</span>
                                    <div className="text-[10px] uppercase mt-1 font-normal">View One</div>
                                </th>
                                <th className="px-6 py-4 text-center w-32">
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">POST</span>
                                    <div className="text-[10px] uppercase mt-1 font-normal">Create</div>
                                </th>
                                <th className="px-6 py-4 text-center w-32">
                                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold">PATCH</span>
                                    <div className="text-[10px] uppercase mt-1 font-normal">Update</div>
                                </th>
                                <th className="px-6 py-4 text-center w-32">
                                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">DELETE</span>
                                    <div className="text-[10px] uppercase mt-1 font-normal">Delete</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {collections.map((col) => {
                                // Active if rule is NOT null (meaning it has some public/custom access)
                                // In this simplified UI, we treat "" (public) as Active, and null (admin) as Inactive.
                                // Complex rules are also treated as Active but maybe color coded differently in a future iteration.
                                return (
                                    <tr key={col.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 border-r border-dashed border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <Shield className={`w-4 h-4 ${col.type === 'auth' ? 'text-purple-500' : 'text-gray-400'}`} />
                                                {col.name}
                                                {col.type === 'auth' && <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">Auth</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                <PermissionToggle
                                                    active={col.listRule !== null}
                                                    onClick={() => toggleRule(col.id, 'listRule', col.listRule)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                <PermissionToggle
                                                    active={col.viewRule !== null}
                                                    onClick={() => toggleRule(col.id, 'viewRule', col.viewRule)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                <PermissionToggle
                                                    active={col.createRule !== null}
                                                    onClick={() => toggleRule(col.id, 'createRule', col.createRule)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                <PermissionToggle
                                                    active={col.updateRule !== null}
                                                    onClick={() => toggleRule(col.id, 'updateRule', col.updateRule)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                <PermissionToggle
                                                    active={col.deleteRule !== null}
                                                    onClick={() => toggleRule(col.id, 'deleteRule', col.deleteRule)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
