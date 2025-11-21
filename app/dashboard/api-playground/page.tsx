'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import 'swagger-ui-react/swagger-ui.css'

// Dynamically import SwaggerUI to avoid SSR issues with it
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiPlaygroundPage() {
  const [url, setUrl] = useState('/swagger.json')
  const [inputValue, setInputValue] = useState('/swagger.json')

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue) {
      setUrl(inputValue)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-gray-900">API Playground</h1>
          <p className="text-gray-600">Explore and test the RZ Automation Hub API or external specs</p>
        </div>

        <form onSubmit={handleLoad} className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm w-full md:w-auto md:min-w-[400px]">
          <div className="pl-3 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter OpenAPI/Swagger URL..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 text-sm"
          />
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
          <SwaggerUI url={url} />
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
