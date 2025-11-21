'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Zap, Workflow, Sparkles, ScrollText, Layers, LogOut, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { pb } from '@/lib/pocketbase'

const menuItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/users', icon: Users, adminOnly: true },
  { name: 'API Playground', href: '/dashboard/api-playground', icon: Zap },
  { name: 'Workflows', href: '/dashboard/workflows', icon: Workflow },
  { name: 'AI Studio', href: '/dashboard/ai', icon: Sparkles },
  { name: 'Logs', href: '/dashboard/logs', icon: ScrollText },
  { name: 'Showcase', href: '/dashboard/showcase', icon: Layers },
]

interface SidebarProps {
  user?: any
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const isAdmin = user?.role === 'admin'

  return (
    <aside className="w-64 border-r border-gray-200 glass-panel p-4 space-y-4">
      {/* Logo */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-900">RZ Hub</h2>
        <p className="text-xs text-gray-500 mt-1">Automation Platform</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null

          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  'sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer',
                  isActive && 'active'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4 space-y-4">
        <div className="glass-panel rounded-xl p-4 space-y-2">
          <p className="text-xs font-medium text-gray-700">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-600">All systems operational</span>
          </div>
        </div>

        <button
          onClick={() => {
            pb.authStore.clear()
            document.cookie = 'pb_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
            window.location.href = '/login'
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
