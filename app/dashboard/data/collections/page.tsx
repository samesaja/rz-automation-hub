'use client'

import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { Folder, Table, Lock, Clock, MoreHorizontal, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Collection {
    id: string
    name: string
    type: string
    created: string
    updated: string
    system: boolean
}

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)

    const fetchCollections = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/collections')
            const data = await response.json()

            if (Array.isArray(data)) {
                // Filter out system collections
                const filtered = data.filter((c: any) => !c.name.startsWith('_'))
                setCollections(filtered)
            }
        } catch (err) {
            console.error('Failed to fetch collections:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCollections()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Collections</h2>
                <button
                    onClick={fetchCollections}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((collection) => (
                    <Link
                        key={collection.id}
                        href={`/dashboard/data/records?collection=${collection.name}`}
                        className="group"
                    >
                        <div className="macos-card p-4 hover:border-blue-300 transition-all cursor-pointer h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-2 rounded-lg ${collection.system ? 'bg-gray-100' : 'bg-blue-50'}`}>
                                    {collection.type === 'auth' ? (
                                        <Lock className={`w-5 h-5 ${collection.system ? 'text-gray-500' : 'text-blue-600'}`} />
                                    ) : (
                                        <Folder className={`w-5 h-5 ${collection.system ? 'text-gray-500' : 'text-blue-600'}`} />
                                    )}
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${collection.system ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {collection.type}
                                </span>
                            </div>

                            <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {collection.name}
                            </h3>
                            <p className="text-xs text-gray-500 font-mono mb-4">{collection.id}</p>

                            <div className="flex items-center gap-2 text-xs text-gray-400 pt-4 border-t border-gray-50">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(collection.updated).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
