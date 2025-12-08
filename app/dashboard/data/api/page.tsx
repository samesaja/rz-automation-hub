"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Code,
    Copy,
    ChevronRight,
    ChevronDown,
    Play,
    Loader2,
    Database,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Field {
    name: string;
    type: string;
    required: boolean;
}

interface Collection {
    id: string;
    name: string;
    schema: Field[];
    type: string;
}

export default function ApiDocsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const collectionName = searchParams.get("collection");

    const [collections, setCollections] = useState<Collection[]>([]);
    const [loadingCollections, setLoadingCollections] = useState(true);
    const [activeMethod, setActiveMethod] = useState<string>("GET");
    const [activeEndpoint, setActiveEndpoint] = useState<string>("list");
    const [response, setResponse] = useState<any>(null);
    const [requestLoading, setRequestLoading] = useState(false);

    // Fetch all collections on mount
    useEffect(() => {
        fetch('/api/collections')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCollections(data);
                    // If no collection selected, select the first one automatically
                    if (!collectionName && data.length > 0) {
                        router.replace(`/dashboard/data/api?collection=${data[0].name}`);
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoadingCollections(false));
    }, []);

    const currentCollection = collections.find(c => c.name === collectionName) || null;

    const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/records` : '/api/records';

    // Define endpoints based on current collection
    const endpoints = currentCollection ? [
        {
            method: 'GET',
            name: 'List Records',
            path: `?collection=${currentCollection.name}`,
            description: `List all records in the ${currentCollection.name} collection. Supports pagination and sorting.`,
            key: 'list',
            params: [
                { name: 'page', type: 'number', desc: 'Page number (default 1)' },
                { name: 'perPage', type: 'number', desc: 'Items per page (default 30)' },
                { name: 'sort', type: 'string', desc: 'Sort field (e.g. -created)' },
                { name: 'filter', type: 'string', desc: 'Filter syntax (e.g. title="test")' }
            ]
        },
        {
            method: 'GET',
            name: 'View Record',
            path: `?collection=${currentCollection.name}&id=:id`,
            description: `Get a single record by ID.`,
            key: 'view',
            params: [
                { name: 'id', type: 'string', required: true, desc: 'Record ID' }
            ]
        },
        {
            method: 'POST',
            name: 'Create Record',
            path: `?collection=${currentCollection.name}`,
            description: `Create a new record in ${currentCollection.name}.`,
            key: 'create',
            body: true
        },
        {
            method: 'PATCH',
            name: 'Update Record',
            path: `?collection=${currentCollection.name}&id=:id`,
            description: `Update an existing record.`,
            key: 'update',
            params: [
                { name: 'id', type: 'string', required: true, desc: 'Record ID' }
            ],
            body: true
        },
        {
            method: 'DELETE',
            name: 'Delete Record',
            path: `?collection=${currentCollection.name}&id=:id`,
            description: `Delete a record by ID.`,
            key: 'delete',
            params: [
                { name: 'id', type: 'string', required: true, desc: 'Record ID' }
            ]
        }
    ] : [];

    const currentEndpoint = endpoints.find(e => e.key === activeEndpoint);

    const handleRun = async () => {
        if (!currentCollection || !currentEndpoint) return;
        setRequestLoading(true);
        setResponse(null);

        try {
            const url = `/api/records?collection=${currentCollection.name}&perPage=5`;
            const res = await fetch(url);
            const data = await res.json();
            setResponse(data);
        } catch (err: any) {
            setResponse({ error: err.message });
        } finally {
            setRequestLoading(false);
        }
    };

    const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value;
        if (name) {
            router.push(`/dashboard/data/api?collection=${name}`);
            setActiveEndpoint("list");
            setResponse(null);
        }
    };

    if (loadingCollections) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading API docs...</span>
            </div>
        );
    }

    return (
        <div className="flex h-full bg-white">
            {/* Sidebar with Collection Switcher */}
            <div className="w-72 border-r border-gray-200 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                        Select Collection
                    </label>
                    <div className="relative">
                        <select
                            value={collectionName || ''}
                            onChange={handleCollectionChange}
                            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8"
                        >
                            <option value="" disabled>Choose...</option>
                            {collections.map(col => (
                                <option key={col.id} value={col.name}>{col.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {endpoints.map(ep => (
                        <button
                            key={ep.key}
                            onClick={() => {
                                setActiveEndpoint(ep.key);
                                setActiveMethod(ep.method);
                                setResponse(null);
                            }}
                            className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                activeEndpoint === ep.key
                                    ? "bg-white shadow-sm ring-1 ring-gray-200 translate-x-1"
                                    : "hover:bg-gray-100 text-gray-600 hover:translate-x-1"
                            )}
                        >
                            <span className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded w-12 text-center shadow-sm",
                                ep.method === 'GET' ? "bg-blue-100 text-blue-700" :
                                    ep.method === 'POST' ? "bg-green-100 text-green-700" :
                                        ep.method === 'PATCH' ? "bg-orange-100 text-orange-700" :
                                            "bg-red-100 text-red-700"
                            )}>{ep.method}</span>
                            <span className="truncate flex-1 text-left font-medium">{ep.name}</span>
                            {activeEndpoint === ep.key && <ArrowRight className="w-3.5 h-3.5 text-blue-500 opacity-50" />}
                        </button>
                    ))}

                    {endpoints.length === 0 && (
                        <div className="p-4 text-center text-sm text-gray-400">
                            Select a collection to view endpoints
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-white">
                {currentCollection && currentEndpoint ? (
                    <div className="p-8 max-w-5xl mx-auto space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={cn(
                                    "text-sm font-bold px-3 py-1 rounded-md shadow-sm",
                                    currentEndpoint.method === 'GET' ? "bg-blue-100 text-blue-700" :
                                        currentEndpoint.method === 'POST' ? "bg-green-100 text-green-700" :
                                            currentEndpoint.method === 'PATCH' ? "bg-orange-100 text-orange-700" :
                                                "bg-red-100 text-red-700"
                                )}>{currentEndpoint.method}</span>
                                <h1 className="text-2xl font-bold text-gray-900">{currentEndpoint.name}</h1>
                            </div>
                            <p className="text-gray-600 mb-6 text-lg">{currentEndpoint.description}</p>

                            <div className="bg-gray-900 rounded-xl p-5 font-mono text-sm text-gray-300 flex items-center justify-between group shadow-lg ring-1 ring-gray-900/5">
                                <span className="break-all flex items-center gap-2">
                                    <span className="text-purple-400 font-bold">{currentEndpoint.method}</span>
                                    <span className="text-gray-100">{baseUrl}{currentEndpoint.path.replace(`?collection=${collectionName}`, '')}</span>
                                </span>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Params */}
                        {currentEndpoint.params && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    Query Parameters
                                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">URL</span>
                                </h3>
                                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                            <tr>
                                                <th className="px-5 py-3 border-b">Parameter</th>
                                                <th className="px-5 py-3 border-b">Type</th>
                                                <th className="px-5 py-3 border-b">Required</th>
                                                <th className="px-5 py-3 border-b">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {currentEndpoint.params.map(p => (
                                                <tr key={p.name} className="hover:bg-gray-50/50">
                                                    <td className="px-5 py-3 font-mono text-blue-600 font-medium">{p.name}</td>
                                                    <td className="px-5 py-3 text-gray-500">{p.type}</td>
                                                    <td className="px-5 py-3">
                                                        {(p as any).required
                                                            ? <span className="text-red-500 font-medium text-xs bg-red-50 px-2 py-0.5 rounded-full">Required</span>
                                                            : <span className="text-gray-400 text-xs">Optional</span>}
                                                    </td>
                                                    <td className="px-5 py-3 text-gray-600">{p.desc}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Request Body */}
                        {currentEndpoint.body && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    Request Body
                                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">JSON</span>
                                </h3>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 font-mono text-sm shadow-inner group relative">
                                    <pre className="text-gray-700 overflow-x-auto">
                                        {`{
${currentCollection.schema.map(f => {
                                            let example: any = '"string"';
                                            if (f.type === 'number') example = 0;
                                            if (f.type === 'bool') example = false;
                                            if (f.type === 'json') example = {};
                                            if (f.type === 'email') example = '"user@example.com"';

                                            return `  "${f.name}": ${example}`;
                                        }).join(',\n')}
}`}
                                    </pre>
                                    <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-200 rounded-lg text-gray-500">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Live Preview */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    Live Preview
                                    <span className="text-xs font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Authenticated</span>
                                </h3>
                                <button
                                    onClick={handleRun}
                                    disabled={activeEndpoint !== 'list' && activeEndpoint !== 'view'}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                >
                                    {requestLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                    Run Request
                                </button>
                            </div>

                            <div className="bg-gray-950 rounded-xl overflow-hidden min-h-[200px] border border-gray-800 shadow-xl">
                                <div className="bg-gray-900/50 px-4 py-3 text-xs text-gray-400 flex items-center justify-between border-b border-gray-800">
                                    <span className="font-mono">Response Preview</span>
                                    {response && <span className="text-green-400 font-mono">Status: 200 OK</span>}
                                </div>
                                <div className="p-4 overflow-auto max-h-[400px]">
                                    {response ? (
                                        <pre className="text-green-400 font-mono text-xs leading-relaxed">{JSON.stringify(response, null, 2)}</pre>
                                    ) : (
                                        <div className="text-gray-600 text-sm italic py-12 text-center flex flex-col items-center gap-2">
                                            <Play className="w-8 h-8 opacity-20" />
                                            <span>Click "Run Request" to execute...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Database className="w-16 h-16 mb-4 opacity-10" />
                        <p className="text-lg font-medium text-gray-500">Select a collection to view API details</p>
                        <p className="text-sm mt-2 max-w-sm text-center">Reference documentation and live playground will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

