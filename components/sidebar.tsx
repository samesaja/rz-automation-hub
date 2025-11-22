'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Zap,
  Workflow,
  Sparkles,
  ScrollText,
  Layers,
  LogOut,
  Users,
  Database,
  TableProperties,
  Table,
  Activity,
  Shield,
  Folder,
  FileText,
  Lock,
  HardDrive,
  Webhook,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { pb } from '@/lib/pocketbase'

interface MenuItem {
  name: string
  href?: string
  icon: any
  adminOnly?: boolean
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/users', icon: Users, adminOnly: true },
  {
    name: 'Data Platform',
    icon: Database,
    children: [
      { name: 'Schemas', href: '/dashboard/data/schemas', icon: TableProperties },
      { name: 'Data Browser', href: '/dashboard/data/browser', icon: Table },
      { name: 'Realtime Monitor', href: '/dashboard/data/monitor', icon: Activity },
      { name: 'Access Control', href: '/dashboard/data/access', icon: Shield },
      { name: 'Database', href: '/dashboard/data/database', icon: Database },
      { name: 'Collections', href: '/dashboard/data/collections', icon: Folder },
      { name: 'Records', href: '/dashboard/data/records', icon: FileText },
      { name: 'Auth', href: '/dashboard/data/auth', icon: Lock },
      { name: 'Storage', href: '/dashboard/data/storage', icon: HardDrive },
      { name: 'Webhooks', href: '/dashboard/data/webhooks', icon: Webhook },
    ]
  },
  { name: 'API Playground', href: '/dashboard/api-playground', icon: Zap },
  { name: 'Workflows', href: '/dashboard/workflows', icon: Workflow },
  { name: 'AI Studio', href: '/dashboard/ai-studio', icon: Sparkles },
  { name: 'Logs', href: '/dashboard/logs', icon: ScrollText },
  { name: 'Showcase', href: '/dashboard/showcase', icon: Layers },
]

interface SidebarProps {
  user?: any
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const isAdmin = user?.role === 'admin'
  const [expandedItems, setExpandedItems] = useState<string[]>(['Data Platform'])

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  return (
    <aside className="w-64 border-r border-gray-200 glass-panel p-4 space-y-4 flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-6 flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-900">RZ Hub</h2>
        <p className="text-xs text-gray-500 mt-1">Automation Platform</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null

          const Icon = item.icon
          const isActive = pathname === item.href
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.includes(item.name)

          if (hasChildren) {
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors',
                    isActive && 'bg-blue-50 text-blue-600'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isExpanded ? "transform rotate-180" : ""
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="pl-4 space-y-1">
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon
                      const isChildActive = pathname === child.href

                      return (
                        <Link key={child.name} href={child.href || '#'}>
                          <div
                            className={cn(
                              'flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors',
                              isChildActive && 'bg-blue-50 text-blue-600'
                            )}
                          >
                            <ChildIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{child.name}</span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link key={item.name} href={item.href || '#'}>
              <div
                className={cn(
                  'sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors',
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
      <div className="flex-shrink-0 space-y-4 pt-4">
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
