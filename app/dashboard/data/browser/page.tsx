'use client'

import { Table } from 'lucide-react'
import Link from 'next/link'

export default function DataBrowserPage() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Table className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Browser</h2>
            <p className="text-gray-500 max-w-md mb-6">
                The Data Browser is available in the Records view.
            </p>
            <Link href="/dashboard/data/records" className="btn-macos bg-gray-900 text-white px-6 py-2">
                Go to Records
            </Link>
        </div>
    )
}
