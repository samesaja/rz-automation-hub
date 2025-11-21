'use client'

import AiBox from '@/components/ai-box'
import { Sparkles } from 'lucide-react'

export default function AiPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-semibold text-gray-900">AI Studio</h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-panel">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span className="text-xs font-medium text-gray-700">Gemini Flash 2.5</span>
          </div>
        </div>
        <p className="text-gray-600">Interact with advanced AI models for your automation needs</p>
      </div>

      <AiBox />
    </div>
  )
}
