'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NextImage from 'next/image'
import {
  LayoutDashboard,
  FileSignature,
  PenTool,
  FileText,
  LayoutTemplate,
  Eye,
  Shield,
  Minimize2,
  Layers,
  Scissors,
  Droplets,
  Receipt,
  ChevronDown,
  ChevronRight,
  Home,
  Briefcase,
  Wrench,
  Inbox,
  Send,
  Settings,
  UsersRound,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

interface NavGroup {
  name: string
  icon: React.ElementType
  items: NavItem[]
  defaultOpen?: boolean
}

const navigation: NavGroup[] = [
  {
    name: 'E-Signature',
    icon: FileSignature,
    defaultOpen: true,
    items: [
      { name: 'Sign Document', href: '/sign-document', icon: FileSignature },
      { name: 'Bulk Send', href: '/bulk-send', icon: UsersRound },
      { name: 'Signature Generator', href: '/tools/signature-generator', icon: PenTool },
    ],
  },
  {
    name: 'Documents',
    icon: FileText,
    defaultOpen: true,
    items: [
      { name: 'All Documents', href: '/documents', icon: FileText },
      { name: 'Inbox', href: '/documents?tab=inbox', icon: Inbox },
      { name: 'Sent', href: '/documents?tab=sent', icon: Send },
      { name: 'Templates', href: '/templates', icon: LayoutTemplate },
      { name: 'Track', href: '/track', icon: Eye },
      { name: 'Verify', href: '/verify', icon: Shield },
    ],
  },
  {
    name: 'PDF Tools',
    icon: Wrench,
    defaultOpen: false,
    items: [
      { name: 'PDF Compressor', href: '/tools/pdf-compressor', icon: Minimize2 },
      { name: 'PDF Merge', href: '/tools/pdf-merge', icon: Layers },
      { name: 'PDF Split', href: '/tools/pdf-split', icon: Scissors },
      { name: 'Watermark PDF', href: '/tools/watermark-pdf', icon: Droplets },
    ],
  },
  {
    name: 'Business',
    icon: Briefcase,
    defaultOpen: false,
    items: [
      { name: 'Create Invoice', href: '/create-invoice', icon: Receipt },
      { name: 'Resume Templates', href: '/resume-templates', icon: LayoutTemplate },
    ],
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    navigation.forEach((group) => {
      // Open the group if it's default open or if the current path matches any item
      const hasActiveItem = group.items.some((item) => pathname.startsWith(item.href))
      initial[group.name] = group.defaultOpen || hasActiveItem
    })
    return initial
  })

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const isActive = (href: string) => {
    if (href.includes('?')) {
      // For query param links like /documents?tab=inbox
      const [path, query] = href.split('?')
      if (pathname !== path) return false
      // Check if URL has matching query params
      if (typeof window !== 'undefined') {
        const currentParams = new URLSearchParams(window.location.search)
        const targetParams = new URLSearchParams(query)
        for (const [key, value] of targetParams.entries()) {
          if (currentParams.get(key) !== value) return false
        }
        return true
      }
      return false
    }
    if (href === '/documents') return pathname === '/documents' && (typeof window === 'undefined' || !window.location.search.includes('tab='))
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <NextImage
            src="/logo.png"
            alt="MamaSign"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Dashboard link */}
      <div className="px-3 pt-4 pb-2">
        <Link
          href="/documents"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            pathname === '/documents'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <LayoutDashboard className="w-[18px] h-[18px]" />
          Dashboard
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navigation.map((group) => (
          <div key={group.name} className="mt-1">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.name)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <group.icon className="w-3.5 h-3.5" />
                {group.name}
              </span>
              {openGroups[group.name] ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Group Items */}
            {openGroups[group.name] && (
              <div className="ml-2 space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                        active
                          ? 'bg-secondary text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${active ? 'text-primary' : ''}`} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
            pathname === '/settings'
              ? 'bg-secondary text-primary font-medium'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Homepage
        </Link>
      </div>
    </aside>
  )
}
