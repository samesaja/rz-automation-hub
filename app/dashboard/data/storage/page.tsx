'use client'

import { HardDrive, AlertCircle } from 'lucide-react'

export default function StoragePage() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <HardDrive className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Storage Management</h2>
            <p className="text-gray-500 max-w-md mb-6">
                File storage in PocketBase is managed at the record level.
                To manage files, please navigate to the <strong>Records</strong> view and select a collection that has file fields.
            </p>

            <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl text-left max-w-md">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-medium mb-1">Did you know?</p>
                    <p>PocketBase supports S3-compatible storage providers. You can configure this in the main PocketBase Admin UI settings.</p>
                </div>
            </div>
        </div>
    )
}
