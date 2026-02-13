'use client'

import React, { useState, useCallback, useEffect } from 'react'
import DashboardSidebar from './DashboardSidebar'
import DashboardTopbar from './DashboardTopbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleMenuToggle = useCallback(() => {
    if (isDesktop) {
      setSidebarCollapsed(prev => !prev)
    } else {
      setMobileMenuOpen(prev => !prev)
    }
  }, [isDesktop])

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar - Desktop (collapsible with slide animation) */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 bottom-0 z-40 transition-transform duration-300 ease-in-out ${
          sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <DashboardSidebar />
      </aside>

      {/* Sidebar - Mobile overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden">
            <DashboardSidebar />
          </div>
        </>
      )}

      {/* Main content area */}
      <div
        className={`min-h-screen flex flex-col transition-[margin-left] duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-[260px]'
        }`}
      >
        <DashboardTopbar onMenuToggle={handleMenuToggle} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
