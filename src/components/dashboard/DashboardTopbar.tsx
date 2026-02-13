'use client'

import React from 'react'
import { Search, Bell, Menu } from 'lucide-react'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import NotificationBell from '@/components/notifications/NotificationBell'

interface DashboardTopbarProps {
  onMenuToggle?: () => void
}

export default function DashboardTopbar({ onMenuToggle }: DashboardTopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Mobile menu toggle + Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents, tools..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-3">
        <NotificationBell />

        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9',
              },
            }}
          />
        </SignedIn>

        <SignedOut>
          <Link
            href="/sign-in"
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign In
          </Link>
        </SignedOut>
      </div>
    </header>
  )
}
