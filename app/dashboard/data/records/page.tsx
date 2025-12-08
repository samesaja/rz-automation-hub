'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
    Table as TableIcon,
    Search,
    Plus,
    Trash2,
    Settings,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Loader2,
    Pencil,
    Filter,
    ArrowUpDown,
    MoreHorizontal,
    Type,
    Check,
    X,
    EyeOff,
    Download
} from 'lucide-react'
import { RecordForm } from '@/components/data/RecordForm'

const FIELD_TYPES = [
    { type: 'text', icon: Type, label: 'Text' },
    { type: 'number', icon: ArrowUpDown, label: 'Number' },
    { type: 'bool', icon: Check, label: 'Boolean' },
    { type: 'date', icon: TableIcon, label: 'Date' },
    { type: 'email', icon: Type, label: 'Email' },
    { type: 'url', icon: Type, label: 'URL' },
    { type: 'json', icon: Code, label: 'JSON' },
    { type: 'file', icon: File, label: 'File' },
] as const;

import { Code, File } from 'lucide-react'

export default function RecordsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const collectionName = searchParams.get('collection')

    const [records, setRecords] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [collections, setCollections] = useState<any[]>([])
    const [currentCollection, setCurrentCollection] = useState<any>(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState<any>(null)

    // Schema Editing State
    const [isFieldModalOpen, setIsFieldModalOpen] = useState(false)
    const [editingField, setEditingField] = useState<any>(null) // null = new field
    const [newFieldData, setNewFieldData] = useState({ name: '', type: 'text', required: false })

    // Fetch collections
    useEffect(() => {
        fetch('/api/collections')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCollections(data)
                }
            })
            .catch(console.error)
    }, [])

    // Update current collection context
    useEffect(() => {
        if (collectionName && collections.length > 0) {
            const found = collections.find(c => c.name === collectionName)
            setCurrentCollection(found || null)
        }
    }, [collectionName, collections])

    // Fetch records
    useEffect(() => {
        if (collectionName) {
            fetchRecords()
        } else {
            setRecords([])
        }
    }, [collectionName, page])

    const fetchRecords = async () => {
        if (!collectionName) return
        setLoading(true)
        try {
            const response = await fetch(`/api/records?collection=${collectionName}&page=${page}&perPage=20&sort=-created`)
            if (!response.ok) throw new Error('Failed to fetch records')
            const result = await response.json()
            setRecords(result.items)
            setTotalPages(result.totalPages)
            setTotalItems(result.totalItems)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveRecord = async (data: any) => {
        if (!collectionName) return
        const isEdit = !!editingRecord
        const url = isEdit
            ? `/api/records?collection=${collectionName}&id=${editingRecord.id}`
            : `/api/records?collection=${collectionName}`
        const method = isEdit ? 'PATCH' : 'POST'
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        setIsFormOpen(false)
        setEditingRecord(null)
        fetchRecords()
    }

    const handleDeleteRecord = async (id: string) => {
        if (!confirm('Are you sure?')) return
        await fetch(`/api/records?collection=${collectionName}&id=${id}`, { method: 'DELETE' })
        fetchRecords()
    }

    // Schema Management
    const handleSaveField = async () => {
        if (!currentCollection) return

        let newSchema = [...(currentCollection.schema || [])]
        if (editingField) {
            // Update existing
            const index = newSchema.findIndex(f => f.name === editingField.name)
            if (index !== -1) {
                newSchema[index] = { ...newSchema[index], ...newFieldData }
            }
        } else {
            // New field
            newSchema.push({
                ...newFieldData,
                id: `f_${Date.now()}`,
                system: false,
                presentable: false,
                options: {}
            })
        }

        try {
            const res = await fetch(`/api/collections/${currentCollection.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schema: newSchema })
            })
            if (!res.ok) throw new Error('Failed to update schema')

            // Refresh collections to update local schema state
            const updated = await res.json()
            setCurrentCollection(updated) // Optimistic update mechanism usually better but simple reload works
            setIsFieldModalOpen(false)
            setEditingField(null)
            setNewFieldData({ name: '', type: 'text', required: false })

            // Refetch records as well in case mapping changes
            fetchRecords()
        } catch (e) {
            console.error(e)
            alert('Failed to update schema')
        }
    }

    const handleDeleteField = async (fieldName: string) => {
        if (!currentCollection || !confirm(`Delete column "${fieldName}"? Data will be lost.`)) return

        const newSchema = currentCollection.schema.filter((f: any) => f.name !== fieldName)

        try {
            await fetch(`/api/collections/${currentCollection.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schema: newSchema })
            })
            // Update local state by forcing a fetch or manually updating
            // Simplified: just reload page or fetch collections again
            window.location.reload()
        } catch (e) {
            alert('Error deleting field')
        }
    }

    const openAddField = () => {
        setEditingField(null)
        setNewFieldData({ name: '', type: 'text', required: false })
        setIsFieldModalOpen(true)
    }

    const openEditField = (field: any) => {
        setEditingField(field)
        setNewFieldData({ name: field.name, type: field.type, required: field.required })
        setIsFieldModalOpen(true)
    }

    const getIconForType = (type: string) => {
        return FIELD_TYPES.find(f => f.type === type)?.icon || Type
    }

    if (!collectionName) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
                <TableIcon className="w-16 h-16 mb-4 opacity-10" />
                <p>Select a collection to view data</p>
            </div>
        )
    }

    const schema = currentCollection?.schema || []

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Toolbar */}
            <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-gray-900">{currentCollection?.name}</span>
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                            Grid View
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="h-8 flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <button className="px-3 text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5">
                            <Filter className="w-3.5 h-3.5" /> Filter
                        </button>
                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        <button className="px-3 text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5">
                            <ArrowUpDown className="w-3.5 h-3.5" /> Sort
                        </button>
                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        <button className="px-3 text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5">
                            <EyeOff className="w-3.5 h-3.5" /> Hide
                        </button>
                    </div>

                    <div className="w-px h-6 bg-gray-200 mx-2"></div>

                    <button
                        onClick={() => { setEditingRecord(null); setIsFormOpen(true); }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Record
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto bg-white">
                <table className="w-full border-collapse text-sm text-left">
                    <thead className="text-xs font-semibold text-gray-500 bg-gray-50/80 backdrop-blur sticky top-0 z-10 border-b border-gray-200 shadow-sm">
                        <tr>
                            <th className="px-4 py-2 w-16 text-center border-r border-gray-200">
                                #
                            </th>
                            {/* Schema Columns */}
                            {schema.map((field: any) => {
                                const Icon = getIconForType(field.type)
                                return (
                                    <th key={field.name} className="px-3 py-2 border-r border-gray-200 min-w-[150px] group">
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => openEditField(field)}
                                                className="flex items-center gap-2 hover:bg-gray-200 px-1 py-0.5 rounded transition-colors"
                                            >
                                                <Icon className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-gray-700">{field.name}</span>
                                            </button>
                                            {!field.system && (
                                                <button
                                                    onClick={() => handleDeleteField(field.name)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-red-500 rounded"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </th>
                                )
                            })}

                            {/* Add Column Button */}
                            <th className="px-2 py-2 w-10 border-r border-gray-200">
                                <button
                                    onClick={openAddField}
                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-700"
                                    title="Add new column"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </th>
                            <th className="px-4 py-2 w-24">Created</th>
                            <th className="px-4 py-2 w-24">Updated</th>
                            <th className="px-4 py-2 w-20 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {records.length === 0 && !loading ? (
                            <tr>
                                <td colSpan={schema.length + 5} className="py-20 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Database className="w-10 h-10 opacity-20" />
                                        <span>No records yet. Click "New Record" to add one.</span>
                                    </div>
                                </td>
                            </tr>
                        ) : records.map((record, i) => (
                            <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-4 py-2 text-center text-gray-400 border-r border-gray-100 text-xs">
                                    {i + 1}
                                </td>
                                {schema.map((field: any) => (
                                    <td key={field.name + record.id} className="px-3 py-2 border-r border-gray-100 max-w-[200px] truncate">
                                        {typeof record[field.name] === 'object'
                                            ? JSON.stringify(record[field.name])
                                            : String(record[field.name] ?? '')}
                                    </td>
                                ))}
                                {/* Empty cell for Add Column alignment */}
                                <td className="border-r border-gray-100"></td>

                                <td className="px-4 py-2 text-xs text-gray-400 whitespace-nowrap">
                                    {new Date(record.created).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 text-xs text-gray-400 whitespace-nowrap">
                                    {new Date(record.updated).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setEditingRecord(record); setIsFormOpen(true); }}
                                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRecord(record.id)}
                                            className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Add Row Button at bottom of list */}
                <div
                    onClick={() => { setEditingRecord(null); setIsFormOpen(true); }}
                    className="border-b border-gray-100 p-2 flex items-center gap-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors text-sm group"
                >
                    <Plus className="w-4 h-4" />
                    <span className="group-hover:translate-x-0.5 transition-transform">Add new row</span>
                </div>

                <div className="h-12"></div> {/* Spacer */}

                {/* Field Editor Modal */}
                {isFieldModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px] p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 ring-1 ring-black/5">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h3 className="font-semibold text-gray-900">
                                    {editingField ? 'Edit Column' : 'Add New Column'}
                                </h3>
                                <button onClick={() => setIsFieldModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5 space-y-5">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Column Name</label>
                                    <input
                                        type="text"
                                        value={newFieldData.name}
                                        onChange={e => setNewFieldData({ ...newFieldData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="e.g., status, category, email"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Column Type</label>
                                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                        {FIELD_TYPES.map(t => {
                                            const Icon = t.icon
                                            const isSelected = newFieldData.type === t.type
                                            return (
                                                <button
                                                    key={t.type}
                                                    onClick={() => setNewFieldData({ ...newFieldData, type: t.type })}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm border transition-all duration-200 ${isSelected
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                                                            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
                                                        }`}
                                                >
                                                    <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`} />
                                                    <span>{t.label}</span>
                                                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-blue-500" />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${newFieldData.required ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white group-hover:border-blue-400'}`}>
                                            {newFieldData.required && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={newFieldData.required}
                                            onChange={e => setNewFieldData({ ...newFieldData, required: e.target.checked })}
                                        />
                                        <span className="text-sm text-gray-700">Required field</span>
                                    </label>
                                </div>
                            </div>

                            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                                <button
                                    onClick={() => setIsFieldModalOpen(false)}
                                    className="flex-1 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveField}
                                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none"
                                    disabled={!newFieldData.name}
                                >
                                    {editingField ? 'Save Changes' : 'Create Column'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Record Form Modal */}
                {isFormOpen && currentCollection && (
                    <RecordForm
                        collectionName={collectionName}
                        schema={schema}
                        initialData={editingRecord}
                        onSave={handleSaveRecord}
                        onCancel={() => setIsFormOpen(false)}
                    />
                )}
            </div>
        </div>
    )
}

import { Database } from 'lucide-react'
