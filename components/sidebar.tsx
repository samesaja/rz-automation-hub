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
  ChevronDown,
  PenTool,
  PanelLeftClose,
  PanelLeftOpen
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
  { name: 'Low-code No-code', href: '/dashboard/ui-builder', icon: PenTool },
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
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleExpand = (name: string) => {
    if (isCollapsed) return
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  return (
    <aside className={cn(
      "border-r border-gray-200 glass-panel flex flex-col h-full transition-all duration-300",
      isCollapsed ? "w-20 p-2" : "w-64 p-4"
    )}>
      {/* Logo */}
      <div className={cn("flex items-center justify-between mb-6", isCollapsed ? "flex-col gap-4 px-2" : "px-4")}>
        {!isCollapsed && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900">RZ Hub</h2>
            <p className="text-xs text-gray-500 mt-1">Automation Platform</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1 overflow-y-auto overflow-x-hidden">
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
                  onClick={() => !isCollapsed && toggleExpand(item.name)}
                  className={cn(
                    'w-full flex items-center justify-between rounded-xl cursor-pointer hover:bg-gray-50 transition-colors',
                    isCollapsed ? 'p-3 justify-center' : 'px-4 py-3',
                    isActive && 'bg-blue-50 text-blue-600'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isExpanded ? "transform rotate-180" : ""
                      )}
                    />
                  )}
                </button>

                {!isCollapsed && isExpanded && (
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
                  'sidebar-item flex items-center rounded-xl cursor-pointer hover:bg-gray-50 transition-colors',
                  isCollapsed ? 'p-3 justify-center' : 'px-4 py-3 gap-3',
                  isActive && 'active'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 space-y-4 pt-4">
        {!isCollapsed && (
          <div className="glass-panel rounded-xl p-4 space-y-2">
            <p className="text-xs font-medium text-gray-700">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-600">All systems operational</span>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            pb.authStore.clear()
            document.cookie = 'pb_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
            window.location.href = '/login'
          }}
          className={cn(
            "w-full flex items-center rounded-xl cursor-pointer text-red-600 hover:bg-red-50 transition-colors",
            isCollapsed ? "p-3 justify-center" : "px-4 py-3 gap-3"
          )}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
