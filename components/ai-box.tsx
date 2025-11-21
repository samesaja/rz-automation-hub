'use client'

import { useState } from 'react'
import { Send, Sparkles, Trash2 } from 'lucide-react'

const models = [
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
]

export default function AiBox() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState(models[0].id)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model })
      })
      const data = await res.json()
      setOutput(data.response || data.error || 'No response')
    } catch (error: any) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setPrompt('')
    setOutput('')
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="macos-card p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Prompt</h2>
            <p className="text-sm text-gray-600">Enter your AI request</p>
          </div>
        </div>

        {/* Model Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="input-macos w-full"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything..."
            className="input-macos w-full min-h-[300px] resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading || !prompt.trim()}
            className="btn-primary-macos flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              'Generating...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
          <button
            onClick={handleClear}
            className="btn-macos flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="macos-card p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Output</h2>

        {output ? (
          <div className="glass-panel rounded-2xl p-6 min-h-[400px] max-h-[600px] overflow-auto">
            <pre className="text-sm whitespace-pre-wrap text-gray-800 leading-relaxed">
              {output}
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-gray-400 glass-panel rounded-2xl">
            <div className="text-center space-y-2">
              <Sparkles className="w-12 h-12 mx-auto opacity-50" />
              <p className="text-sm">AI response will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
