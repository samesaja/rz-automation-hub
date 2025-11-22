'use client'

import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import {
    TableProperties,
    Search,
    Plus,
    Save,
    Trash2,
    AlertTriangle,
    Check,
    X,
    Loader2,
    Settings,
    Type,
    List
} from 'lucide-react'

interface SchemaField {
    id: string
    name: string
    type: string
    required: boolean
    presentable: boolean
    system: boolean
    options?: any
}

interface Collection {
    id: string
    name: string
    type: string
    schema: SchemaField[]
    system: boolean
}

const FIELD_TYPES = [
    'text', 'number', 'bool', 'email', 'url', 'date', 'select', 'json', 'file', 'relation', 'user'
]

export default function SchemasPage() {
    const [collections, setCollections] = useState<Collection[]>([])
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Editor State
    const [editedSchema, setEditedSchema] = useState<SchemaField[]>([])
    const [hasChanges, setHasChanges] = useState(false)

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [newCollectionName, setNewCollectionName] = useState('')
    const [newCollectionType, setNewCollectionType] = useState('base')
    const [isCreating, setIsCreating] = useState(false)

    useEffect(() => {
        fetchCollections()
    }, [])

    useEffect(() => {
        if (selectedCollectionId) {
            const collection = collections.find(c => c.id === selectedCollectionId)
            if (collection) {
                // Deep copy schema to avoid direct mutation
                setEditedSchema(JSON.parse(JSON.stringify(collection.schema || [])))
                setHasChanges(false)
            }
        } else {
            setEditedSchema([])
            setHasChanges(false)
        }
    }, [selectedCollectionId, collections])

    const fetchCollections = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/collections')
            if (!response.ok) throw new Error('Failed to fetch collections')
            const result = await response.json()

            setCollections(result as unknown as Collection[])
            if (!selectedCollectionId && result.length > 0) {
                setSelectedCollectionId(result[0].id)
            }
        } catch (err) {
            console.error('Failed to fetch collections:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateCollection = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreating(true)
        try {
            const response = await fetch('/api/collections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newCollectionName,
                    type: newCollectionType,
                    schema: []
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create collection')
            }

            const newCollection = await response.json()

            await fetchCollections()
            setSelectedCollectionId(newCollection.id)
            setIsCreateModalOpen(false)
            setNewCollectionName('')
            setNewCollectionType('base')
            alert('Collection created successfully')
        } catch (err: any) {
            console.error('Failed to create collection:', err)
            alert(err.message || 'Failed to create collection')
        } finally {
            setIsCreating(false)
        }
    }

    const handleFieldChange = (index: number, field: Partial<SchemaField>) => {
        const newSchema = [...editedSchema]
        newSchema[index] = { ...newSchema[index], ...field }
        setEditedSchema(newSchema)
        setHasChanges(true)
    }

    const handleAddField = () => {
        const newField: SchemaField = {
            id: `new_${Math.random().toString(36).substr(2, 9)}`,
            name: 'new_field',
            type: 'text',
            required: false,
            presentable: false,
            system: false,
            options: {}
        }
        setEditedSchema([...editedSchema, newField])
        setHasChanges(true)
    }

    const handleDeleteField = (index: number) => {
        const newSchema = editedSchema.filter((_, i) => i !== index)
        setEditedSchema(newSchema)
        setHasChanges(true)
    }

    const handleSave = async () => {
        if (!selectedCollectionId) return

        if (!confirm('WARNING: Modifying the schema can result in data loss. Are you sure you want to proceed?')) {
            return
        }

        setSaving(true)
        try {
            const response = await fetch(`/api/collections/${selectedCollectionId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    schema: editedSchema
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update schema')
            }

            await fetchCollections() // Refresh to get server state
            alert('Schema updated successfully')
        } catch (err: any) {
            console.error('Failed to update schema:', err)
            alert(err.message || 'Failed to update schema')
        } finally {
            setSaving(false)
        }
    }

    const filteredCollections = collections
        .filter(c => !c.name.startsWith('_')) // Hide system collections
        .filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id.toLowerCase().includes(searchTerm.toLowerCase())
        )

    const selectedCollection = collections.find(c => c.id === selectedCollectionId)

    return (
        <div className="h-full flex gap-6 overflow-hidden relative">
            {/* Create Collection Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">New Collection</h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCollection} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newCollectionName}
                                    onChange={e => setNewCollectionName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                                    placeholder="e.g. products"
                                    pattern="[a-zA-Z0-9_]+"
                                    title="Only letters, numbers, and underscores allowed"
                                />
                                <p className="text-xs text-gray-500">No spaces or special characters.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Type</label>
                                <select
                                    value={newCollectionType}
                                    onChange={e => setNewCollectionType(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all bg-white"
                                >
                                    <option value="base">Base (Regular)</option>
                                    <option value="auth">Auth (Users)</option>
                                    <option value="view">View (Read-only)</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sidebar - Collection List */}
            <div className="w-64 flex flex-col glass-panel rounded-xl overflow-hidden flex-shrink-0">
                <div className="p-4 border-b border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                            <TableProperties className="w-5 h-5" />
                            Collections
                        </h2>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                            title="New Collection"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : filteredCollections.map(collection => (
                        <button
                            key={collection.id}
                            onClick={() => setSelectedCollectionId(collection.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${selectedCollectionId === collection.id
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span className="truncate">{collection.name}</span>
                            {collection.system && (
                                <Settings className="w-3 h-3 opacity-50" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content - Schema Editor */}
            <div className="flex-1 flex flex-col glass-panel rounded-xl overflow-hidden min-w-0">
                {!selectedCollection ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <TableProperties className="w-12 h-12 mb-4 opacity-50" />
                        <p>Select a collection to edit its schema</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{selectedCollection.name}</h1>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${selectedCollection.system ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        {selectedCollection.type}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 font-mono">{selectedCollection.id}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {hasChanges && (
                                    <span className="text-sm text-amber-600 flex items-center gap-1 animate-pulse">
                                        <AlertTriangle className="w-4 h-4" />
                                        Unsaved Changes
                                    </span>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={!hasChanges || saving}
                                    className="btn-macos bg-gray-900 text-white flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {/* Schema Editor */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {/* Fields List */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
                                        <div className="col-span-1"></div>
                                        <div className="col-span-3">Name</div>
                                        <div className="col-span-3">Type</div>
                                        <div className="col-span-2 text-center">Required</div>
                                        <div className="col-span-2 text-center">System</div>
                                        <div className="col-span-1"></div>
                                    </div>

                                    <div className="divide-y divide-gray-100">
                                        {editedSchema.map((field, index) => (
                                            <div key={field.id || index} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors group">
                                                <div className="col-span-1 flex justify-center text-gray-400">
                                                    <List className="w-4 h-4 cursor-move" />
                                                </div>

                                                <div className="col-span-3">
                                                    <input
                                                        type="text"
                                                        value={field.name}
                                                        onChange={(e) => handleFieldChange(index, { name: e.target.value })}
                                                        disabled={field.system}
                                                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                    />
                                                </div>

                                                <div className="col-span-3">
                                                    <div className="relative">
                                                        <Type className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                                        <select
                                                            value={field.type}
                                                            onChange={(e) => handleFieldChange(index, { type: e.target.value })}
                                                            disabled={field.system}
                                                            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 appearance-none bg-white"
                                                        >
                                                            {FIELD_TYPES.map(type => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 flex justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={field.required}
                                                        onChange={(e) => handleFieldChange(index, { required: e.target.checked })}
                                                        disabled={field.system}
                                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                                    />
                                                </div>

                                                <div className="col-span-2 flex justify-center">
                                                    {field.system ? (
                                                        <Check className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <span className="text-gray-300">-</span>
                                                    )}
                                                </div>

                                                <div className="col-span-1 flex justify-end">
                                                    {!field.system && (
                                                        <button
                                                            onClick={() => handleDeleteField(index)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Add Field Button */}
                                <button
                                    onClick={handleAddField}
                                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add New Field
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
