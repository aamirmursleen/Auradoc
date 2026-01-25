'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, LayoutTemplate, Wrench, User } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Templates', href: '/templates', icon: LayoutTemplate },
  { name: 'Tools', href: '/tools', icon: Wrench },
  { name: 'Profile', href: '/profile', icon: User },
]

const MobileBottomNav: React.FC = () => {
  const pathname = usePathname()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Check if current path matches nav item
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t
        ${isDark ? 'bg-[#1e1e1e] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full pt-2 pb-1 transition-colors
                ${active
                  ? isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'
                  : isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${active ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
