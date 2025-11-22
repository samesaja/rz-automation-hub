'use client'

import { Database } from 'lucide-react'

export default function DatabasePage() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Database className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Database Settings</h2>
            <p className="text-gray-500 mb-6">
                Database configuration is managed through the main RZ Data automation Admin UI.
            </p>
        </div>
    )
}
