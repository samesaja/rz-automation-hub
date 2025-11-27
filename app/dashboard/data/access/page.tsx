'use client'

import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { Shield, Check, X, Lock, Globe, Edit2, Save, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
    const router = useRouter()
    const [collections, setCollections] = useState<CollectionRules[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Partial<CollectionRules>>({})
    const [saving, setSaving] = useState(false)

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

    const handleEdit = (col: CollectionRules) => {
        setEditingId(col.id)
        setEditForm({
            listRule: col.listRule,
            viewRule: col.viewRule,
            createRule: col.createRule,
            updateRule: col.updateRule,
            deleteRule: col.deleteRule,
        })
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditForm({})
    }

    const handleSave = async (id: string) => {
        setSaving(true)
        try {
            const response = await fetch(`/api/collections/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm),
            })

            if (!response.ok) {
                throw new Error('Failed to update rules')
            }

            await fetchRules()
            setEditingId(null)
            setEditForm({})
        } catch (error) {
            console.error('Error saving rules:', error)
            alert('Failed to save changes')
        } finally {
            setSaving(false)
        }
    }

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

    const RuleInput = ({ value, onChange, placeholder }: { value: string | null | undefined, onChange: (val: string | null) => void, placeholder: string }) => {
        const [inputValue, setInputValue] = useState(value === null ? 'null' : value)

        useEffect(() => {
            setInputValue(value === null ? 'null' : value || '')
        }, [value])

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value
            setInputValue(val)
            if (val === 'null') {
                onChange(null)
            } else {
                onChange(val)
            }
        }

        return (
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    className={`w-full text-xs px-2 py-1.5 rounded border focus:ring-2 focus:ring-teal-500 outline-none ${inputValue === 'null' ? 'bg-red-50 text-red-700 border-red-200' :
                        inputValue === '' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-white border-gray-200'
                        }`}
                    placeholder={placeholder}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">
                    {inputValue === 'null' ? 'Admin' : inputValue === '' ? 'Public' : 'Custom'}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">API Rules & Access Control</h2>
                    <p className="text-sm text-gray-500">Manage who can access and modify your data</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Type 'null' for Admin Only, leave empty for Public</span>
                </div>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden bg-white/50 border border-white/50 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 font-medium">Collection</th>
                                <th className="px-4 py-3 font-medium w-32">List</th>
                                <th className="px-4 py-3 font-medium w-32">View</th>
                                <th className="px-4 py-3 font-medium w-32">Create</th>
                                <th className="px-4 py-3 font-medium w-32">Update</th>
                                <th className="px-4 py-3 font-medium w-32">Delete</th>
                                <th className="px-4 py-3 font-medium w-20">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                            Loading rules...
                                        </div>
                                    </td>
                                </tr>
                            ) : collections.map((col) => {
                                const isEditing = editingId === col.id
                                return (
                                    <tr key={col.id} className={`transition-colors ${isEditing ? 'bg-teal-50/30' : 'hover:bg-gray-50/50'}`}>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${col.type === 'auth' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                                                {col.name}
                                            </div>
                                        </td>

                                        {isEditing ? (
                                            <>
                                                <td className="px-4 py-4"><RuleInput value={editForm.listRule} onChange={(v) => setEditForm({ ...editForm, listRule: v })} placeholder="List Rule" /></td>
                                                <td className="px-4 py-4"><RuleInput value={editForm.viewRule} onChange={(v) => setEditForm({ ...editForm, viewRule: v })} placeholder="View Rule" /></td>
                                                <td className="px-4 py-4"><RuleInput value={editForm.createRule} onChange={(v) => setEditForm({ ...editForm, createRule: v })} placeholder="Create Rule" /></td>
                                                <td className="px-4 py-4"><RuleInput value={editForm.updateRule} onChange={(v) => setEditForm({ ...editForm, updateRule: v })} placeholder="Update Rule" /></td>
                                                <td className="px-4 py-4"><RuleInput value={editForm.deleteRule} onChange={(v) => setEditForm({ ...editForm, deleteRule: v })} placeholder="Delete Rule" /></td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleSave(col.id)}
                                                            disabled={saving}
                                                            className="p-1.5 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors disabled:opacity-50"
                                                            title="Save"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            disabled={saving}
                                                            className="p-1.5 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-4"><RuleBadge rule={col.listRule} /></td>
                                                <td className="px-4 py-4"><RuleBadge rule={col.viewRule} /></td>
                                                <td className="px-4 py-4"><RuleBadge rule={col.createRule} /></td>
                                                <td className="px-4 py-4"><RuleBadge rule={col.updateRule} /></td>
                                                <td className="px-4 py-4"><RuleBadge rule={col.deleteRule} /></td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => handleEdit(col)}
                                                        className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-all"
                                                        title="Edit Rules"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </>
                                        )}
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
