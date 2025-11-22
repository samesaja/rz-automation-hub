'use client'

import { Lock } from 'lucide-react'

export default function AuthPage() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Auth Providers</h2>
            <p className="text-gray-500 mb-6">
                Authentication providers are configured through the main RZ Data automation Admin UI.
            </p>
        </div>
    )
}
