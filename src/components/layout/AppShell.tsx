'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

// Routes that should use the dashboard layout (sidebar + topbar)
const dashboardRoutes = [
  '/documents',
  '/sign-document',
  '/create-invoice',
  '/track',
  '/verify',
  '/tools',
  '/templates',
  '/template-library',
  '/resume-templates',
  '/s/',
  '/settings',
  '/bulk-send',
  '/agreement-templates',
  '/drafts',
]

// Routes that should have NO header/footer (clean pages)
const cleanRoutes = [
  '/sign-in',
  '/sign-up',
  '/sign/',
]

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()

  const isDashboardRoute = dashboardRoutes.some((route) => pathname.startsWith(route))
  const isCleanRoute = cleanRoutes.some((route) => pathname.startsWith(route))

  // Dashboard pages: sidebar + topbar, no header/footer
  if (isDashboardRoute) {
    return <DashboardLayout>{children}</DashboardLayout>
  }

  // Auth pages: no header/footer
  if (isCleanRoute) {
    return <>{children}</>
  }

  // Public pages (homepage, pricing, about, etc.): header + footer
  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-grow" role="main">
        {children}
      </main>
      <Footer />
    </div>
  )
}
