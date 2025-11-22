'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { pb } from '@/lib/pocketbase'
import {
    Table as TableIcon,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Loader2
} from 'lucide-react'

export default function RecordsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const collectionName = searchParams.get('collection')

    const [records, setRecords] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [collections, setCollections] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    // Fetch available collections for the dropdown
    useEffect(() => {
        fetch('/api/collections')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter out system collections
                    const filtered = data.filter((c: any) => !c.name.startsWith('_'))
                    setCollections(filtered)
                }
            })
            .catch(console.error)
    }, [])

    // Fetch records when collection or page changes
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
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to fetch records')
            }
            const result = await response.json()
            setRecords(result.items)
            setTotalPages(result.totalPages)
            setTotalItems(result.totalItems)
        } catch (err: any) {
            console.error('Failed to fetch records:', err)
            alert(err.message || 'Failed to fetch records')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!collectionName || !confirm('Are you sure you want to delete this record?')) return
        try {
            const response = await fetch(`/api/records?collection=${collectionName}&id=${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to delete record')
            }

            fetchRecords()
        } catch (err: any) {
            console.error('Failed to delete record:', err)
            alert(err.message || 'Failed to delete record')
        }
    }

    const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value
        if (name) {
            router.push(`/dashboard/data/records?collection=${name}`)
        } else {
            router.push('/dashboard/data/records')
        }
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 glass-panel rounded-xl">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative">
                        <TableIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                            value={collectionName || ''}
                            onChange={handleCollectionChange}
                            className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px] appearance-none"
                        >
                            <option value="">Select Collection</option>
                            {collections.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="h-6 w-px bg-gray-200 hidden md:block" />

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{totalItems}</span> records
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                        onClick={fetchRecords}
                        disabled={!collectionName || loading}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="btn-macos bg-gray-900 text-white flex items-center gap-2 px-4 py-2">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Record</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col min-h-0">
                {!collectionName ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <TableIcon className="w-12 h-12 mb-4 opacity-50" />
                        <p>Select a collection to view records</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">ID</th>
                                        <th className="px-6 py-3 font-medium">Created</th>
                                        <th className="px-6 py-3 font-medium">Updated</th>
                                        <th className="px-6 py-3 font-medium">Data Preview</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading && records.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : records.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-3 font-mono text-xs text-gray-500">{record.id}</td>
                                            <td className="px-6 py-3 text-gray-500">
                                                {new Date(record.created).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-3 text-gray-500">
                                                {new Date(record.updated).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="max-w-xs truncate text-gray-600 font-mono text-xs">
                                                    {JSON.stringify(record, (key, value) => {
                                                        if (['id', 'created', 'updated', 'collectionId', 'collectionName'].includes(key)) return undefined
                                                        return value
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(record.id)}
                                                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="text-xs text-gray-500">
                                Page {page} of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-1.5 hover:bg-white rounded-lg disabled:opacity-50 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-1.5 hover:bg-white rounded-lg disabled:opacity-50 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
