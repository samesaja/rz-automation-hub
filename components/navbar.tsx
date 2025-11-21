'use client'

import { Bell, Search, User } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 glass-panel">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="input-macos w-full pl-10 pr-4"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-700" />
          </button>
          <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center hover:bg-gray-100 transition-colors">
            <User className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  )
}
