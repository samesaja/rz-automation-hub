'use client'

import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'
import { Search, ArrowRight, Upload, FileJson } from 'lucide-react'
import 'swagger-ui-react/swagger-ui.css'

// Dynamically import SwaggerUI to avoid SSR issues with it
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiPlaygroundPage() {
  const [url, setUrl] = useState('/swagger.json')
  const [inputValue, setInputValue] = useState('/swagger.json')
  const [spec, setSpec] = useState<object | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue) {
      setUrl(inputValue)
      setSpec(null) // Clear spec when loading from URL
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)

        // Basic validation for OpenAPI/Swagger
        const isSwagger = json.swagger || json.openapi
        const isPostman = json.info?._postman_id || json.info?.schema?.includes('postman')

        if (isPostman) {
          alert('Postman collections are not currently supported. Please upload an OpenAPI (Swagger) specification file.')
          return
        }

        if (!isSwagger) {
          alert('Invalid API specification. File must contain "swagger": "2.0" or "openapi": "3.x.x" field.')
          return
        }

        setSpec(json)
        setUrl('') // Clear URL to indicate we are using spec
        setInputValue(file.name) // Show filename in input
      } catch (error) {
        console.error('Invalid JSON', error)
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-gray-900">API Playground</h1>
          <p className="text-gray-600">Explore and test the RZ Automation Hub API or external specs</p>
        </div>

        <form onSubmit={handleLoad} className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm w-full md:w-auto md:min-w-[500px]">
          <div className="pl-3 text-gray-400">
            {spec ? <FileJson className="w-5 h-5 text-orange-500" /> : <Search className="w-5 h-5" />}
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter OpenAPI/Swagger URL..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 text-sm"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            title="Upload JSON"
          >
            <Upload className="w-4 h-4" />
          </button>

          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            Load <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[2.5rem] overflow-hidden p-8">
        <div className="swagger-wrapper">
          <SwaggerUI url={spec ? undefined : url} spec={spec || undefined} />
        </div>
      </div>

      <style jsx global>{`
        .swagger-wrapper .swagger-ui .wrapper {
          padding: 0;
        }
        .swagger-wrapper .swagger-ui .info {
          margin: 20px 0;
        }
        .swagger-wrapper .swagger-ui .scheme-container {
          background: transparent;
          box-shadow: none;
        }
      `}</style>
    </div>
  )
}
