'use client'

import { useState, useEffect, useRef } from 'react'
import { Sparkles, Send, Settings, Key, Bot, User, Trash2, ChevronDown, Plus, Eraser, Box } from 'lucide-react'

interface CustomModel {
    id: string
    name: string
    apiKey: string
}

const DEFAULT_MODELS = [
    { id: 'gemini-2.0-flash-exp', name: 'Gemini Flash 2.5' },
]

export default function AIStudioPage() {
    const [customModels, setCustomModels] = useState<CustomModel[]>([])
    const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODELS[0].id)
    const [showKeyModal, setShowKeyModal] = useState(false)

    // Modal Form State
    const [newModelId, setNewModelId] = useState('')
    const [newModelName, setNewModelName] = useState('')
    const [newApiKey, setNewApiKey] = useState('')

    const [prompt, setPrompt] = useState('')
    const [output, setOutput] = useState('')
    const [loading, setLoading] = useState(false)
    const [showModelDropdown, setShowModelDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const storedModels = localStorage.getItem('rz_custom_models')
        if (storedModels) {
            try {
                setCustomModels(JSON.parse(storedModels))
            } catch (e) {
                console.error('Failed to parse custom models', e)
            }
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowModelDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const saveCustomModel = () => {
        if (!newModelId || !newApiKey) return

        const model: CustomModel = {
            id: newModelId,
            name: newModelName || newModelId,
            apiKey: newApiKey
        }

        const updated = [...customModels, model]
        setCustomModels(updated)
        localStorage.setItem('rz_custom_models', JSON.stringify(updated))

        // Select the new model
        setSelectedModelId(model.id)

        // Reset and close
        setNewModelId('')
        setNewModelName('')
        setNewApiKey('')
        setShowKeyModal(false)
    }

    const deleteCustomModel = (index: number, e: React.MouseEvent) => {
        e.stopPropagation()
        const updated = customModels.filter((_, i) => i !== index)
        setCustomModels(updated)
        localStorage.setItem('rz_custom_models', JSON.stringify(updated))

        if (selectedModelId === customModels[index].id) {
            setSelectedModelId(DEFAULT_MODELS[0].id)
        }
    }

    const getSelectedModelConfig = () => {
        const custom = customModels.find(m => m.id === selectedModelId)
        if (custom) return custom
        return DEFAULT_MODELS.find(m => m.id === selectedModelId)
    }

    const generateResponse = async () => {
        if (!prompt.trim() || loading) return

        setLoading(true)
        setOutput('')

        const config = getSelectedModelConfig()
        const apiKey = (config as CustomModel)?.apiKey // Only custom models have keys in this object

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: prompt.trim(),
                    apiKey: apiKey || undefined, // If undefined, server uses env var
                    model: selectedModelId,
                    history: []
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response')
            }

            setOutput(data.response)
        } catch (error: any) {
            console.error('Generation error:', error)
            setOutput(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const selectedConfig = getSelectedModelConfig()

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    AI Studio
                </h1>
                <p className="text-sm text-gray-500 mt-1">Interact with advanced AI models for your automation needs</p>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Left Column: Prompt */}
                <div className="glass-panel p-6 flex flex-col space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-200">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Prompt</h2>
                            <p className="text-sm text-gray-500">Enter your AI request</p>
                        </div>
                    </div>

                    <div className="space-y-2 relative" ref={dropdownRef}>
                        <label className="text-sm font-medium text-gray-700">Model</label>
                        <button
                            onClick={() => setShowModelDropdown(!showModelDropdown)}
                            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-gray-900 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        >
                            <span className="flex items-center gap-2">
                                {selectedConfig?.name || selectedModelId}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showModelDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto">
                                <div className="p-1 space-y-1">
                                    <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">Default Models</div>
                                    {DEFAULT_MODELS.map(model => (
                                        <button
                                            key={model.id}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedModelId === model.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                            onClick={() => {
                                                setSelectedModelId(model.id)
                                                setShowModelDropdown(false)
                                            }}
                                        >
                                            {model.name}
                                            {selectedModelId === model.id && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                        </button>
                                    ))}

                                    {customModels.length > 0 && (
                                        <>
                                            <div className="h-px bg-gray-100 my-1" />
                                            <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">My Models</div>
                                            {customModels.map((model, idx) => (
                                                <button
                                                    key={idx}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${selectedModelId === model.id ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => {
                                                        setSelectedModelId(model.id)
                                                        setShowModelDropdown(false)
                                                    }}
                                                >
                                                    <span className="truncate">{model.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        {selectedModelId === model.id && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                                                        <div
                                                            onClick={(e) => deleteCustomModel(idx, e)}
                                                            className="p-1 text-gray-400 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </>
                                    )}

                                    <div className="h-px bg-gray-100 my-1" />
                                    <button
                                        onClick={() => {
                                            setShowKeyModal(true)
                                            setShowModelDropdown(false)
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Custom Model
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">Prompt</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ask anything..."
                            className="flex-1 w-full p-4 bg-gray-50 border-none rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={generateResponse}
                            disabled={!prompt.trim() || loading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Generate
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setPrompt('')
                                setOutput('')
                            }}
                            className="px-4 py-3 text-gray-600 hover:bg-gray-100 font-medium rounded-xl transition-colors flex items-center gap-2"
                        >
                            <Eraser className="w-4 h-4" />
                            Clear
                        </button>
                    </div>
                </div>

                {/* Right Column: Output */}
                <div className="glass-panel p-6 flex flex-col h-full">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Output</h2>
                    <div className="flex-1 bg-gray-50 rounded-2xl p-6 overflow-y-auto">
                        {output ? (
                            <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                                {output}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                                <Sparkles className="w-12 h-12 opacity-20" />
                                <p className="text-sm">AI response will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Model Modal */}
            {showKeyModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md m-4 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Box className="w-5 h-5 text-blue-500" />
                                Add Custom Model
                            </h3>
                            <button
                                onClick={() => setShowKeyModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Model ID</label>
                                <input
                                    type="text"
                                    value={newModelId}
                                    onChange={(e) => setNewModelId(e.target.value)}
                                    placeholder="e.g. gemini-1.5-pro-latest"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    The exact model identifier (e.g. <code className="bg-gray-100 px-1 rounded">gemini-1.5-flash</code>).
                                    <a href="https://ai.google.dev/models" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 ml-1">
                                        View available models &rarr;
                                    </a>
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Display Name (Optional)</label>
                                <input
                                    type="text"
                                    value={newModelName}
                                    onChange={(e) => setNewModelName(e.target.value)}
                                    placeholder="e.g. My Pro Model"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">API Key</label>
                                <input
                                    type="password"
                                    value={newApiKey}
                                    onChange={(e) => setNewApiKey(e.target.value)}
                                    placeholder="sk-..."
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowKeyModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveCustomModel}
                                disabled={!newModelId || !newApiKey}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Model
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
