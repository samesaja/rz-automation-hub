'use client'

import { useState } from 'react'
import { Send, Copy, Check } from 'lucide-react'
import JsonViewer from './json-viewer'

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

export default function ApiTester() {
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState('GET')
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}')
  const [body, setBody] = useState('{\n  \n}')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSend = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/api-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          method,
          headers: JSON.parse(headers),
          body: method !== 'GET' ? JSON.parse(body) : undefined
        })
      })
      const data = await res.json()
      setResponse(data)
    } catch (error: any) {
      setResponse({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Request Panel */}
      <div className="macos-card p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Request</h2>

        {/* URL Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">URL</label>
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="input-macos w-32"
            >
              {methods.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="input-macos flex-1"
            />
          </div>
        </div>

        {/* Headers */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Headers</label>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="input-macos w-full min-h-[100px] font-mono text-sm"
            placeholder='{"Content-Type": "application/json"}'
          />
        </div>

        {/* Body */}
        {method !== 'GET' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="input-macos w-full min-h-[150px] font-mono text-sm"
              placeholder='{"key": "value"}'
            />
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={loading || !url}
          className="btn-primary-macos w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            'Sending...'
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Request
            </>
          )}
        </button>
      </div>

      {/* Response Panel */}
      <div className="macos-card p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Response</h2>
          {response && (
            <button
              onClick={handleCopy}
              className="btn-macos flex items-center gap-2 text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>

        {response ? (
          <JsonViewer data={response} />
        ) : (
          <div className="flex items-center justify-center h-96 text-gray-400">
            <div className="text-center space-y-2">
              <Send className="w-12 h-12 mx-auto opacity-50" />
              <p className="text-sm">Send a request to see the response</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
