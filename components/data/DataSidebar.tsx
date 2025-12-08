"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
    Table,
    Users,
    TableProperties,
    Plus,
    Search,
    Database,
    Loader2,
    Settings,
    X,
    Code,
    Shield,
    Lock,
    HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Collection {
    id: string;
    name: string;
    type: string;
    system: boolean;
    schema: any[];
}

export function DataSidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentCollection = searchParams.get("collection");

    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Create Modal State
    const [newCollectionName, setNewCollectionName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const res = await fetch('/api/collections');
            const data = await res.json();
            if (Array.isArray(data)) {
                const sorted = data.sort((a, b) => {
                    if (a.name === 'users') return -1;
                    if (b.name === 'users') return 1;
                    return a.name.localeCompare(b.name);
                });
                setCollections(sorted);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const response = await fetch('/api/collections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newCollectionName,
                    type: 'base',
                    schema: []
                })
            });

            if (!response.ok) throw new Error('Failed to create');

            const newCol = await response.json();
            await fetchCollections();
            setIsCreateModalOpen(false);
            setNewCollectionName('');
            router.push(`/dashboard/data/records?collection=${newCol.name}`);
        } catch (err) {
            alert('Failed to create collection');
        } finally {
            setIsCreating(false);
        }
    };

    const filteredCollections = collections.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-64 border-r border-gray-200 bg-white flex flex-col h-full relative">
            {/* Create Collection Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">New Collection</h3>
                            <button onClick={() => setIsCreateModalOpen(false)}>
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCollection} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newCollectionName}
                                    onChange={e => setNewCollectionName(e.target.value)}
                                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. products"
                                    pattern="[a-zA-Z0-9_]+"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                            >
                                {isCreating ? 'Creating...' : 'Create Collection'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-2 font-semibold text-gray-900">
                <Database className="w-5 h-5 text-gray-500" />
                <span>Data Platform</span>
            </div>

            {/* Search & Add */}
            <div className="p-3 border-b border-gray-100 space-y-3">
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Collections</span>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Filter..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border-none rounded-md focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {loading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                ) : filteredCollections.map(collection => (
                    <button
                        key={collection.id}
                        onClick={() => router.push(`/dashboard/data/records?collection=${collection.name}`)}
                        className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between group",
                            currentCollection === collection.name
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <div className="flex items-center gap-2 truncate">
                            {collection.name === 'users' ? <Users className="w-4 h-4 opacity-70" /> : <TableProperties className="w-4 h-4 opacity-70" />}
                            <span className="truncate">{collection.name}</span>
                        </div>
                        {collection.system && <Settings className="w-3 h-3 opacity-30" />}
                    </button>
                ))}


                {filteredCollections.length === 0 && !loading && (
                    <div className="text-center py-8 text-xs text-gray-400">
                        No collections found
                    </div>
                )}
            </div>

            {/* System Configuration */}
            <div className="p-3 border-t border-gray-200 space-y-0.5">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Configuration
                </div>
                <Link href="/dashboard/data/api" className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname.includes('/data/api') ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}>
                    <Code className="w-4 h-4 opacity-70" />
                    <span>API Docs</span>
                </Link>
                <Link href="/dashboard/data/access" className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname.includes('/data/access') ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}>
                    <Shield className="w-4 h-4 opacity-70" />
                    <span>Permissions</span>
                </Link>
                <Link href="/dashboard/data/auth" className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname.includes('/data/auth') ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}>
                    <Lock className="w-4 h-4 opacity-70" />
                    <span>Authentication</span>
                </Link>
                <Link href="/dashboard/data/storage" className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname.includes('/data/storage') ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}>
                    <HardDrive className="w-4 h-4 opacity-70" />
                    <span>Storage</span>
                </Link>
            </div>
        </div>
    );
}

