'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, AlertCircle } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

// Sale configuration
const DISCOUNT_PERCENT = 90

const AnnouncementBar: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    setMounted(true)

    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('announcement_dismissed')
    if (dismissed) {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem('announcement_dismissed', 'true')
  }

  if (isDismissed || !mounted) return null

  return (
    <div className="relative z-[101] border-b bg-primary text-primary-foreground border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-2.5 sm:py-3 gap-3 sm:gap-6 flex-wrap">
          {/* Fire emoji + Text */}
          <div className="flex items-center gap-2 text-sm sm:text-base font-medium">
            <span className="text-lg">🔥</span>
            <span className="hidden sm:inline text-primary-foreground">{DISCOUNT_PERCENT}% OFF Yearly Plan</span>
            <span className="sm:hidden text-primary-foreground">{DISCOUNT_PERCENT}% OFF</span>
          </div>

          {/* Limited Time Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 backdrop-blur-sm rounded-full px-3 py-1 bg-white/20">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
            <span className="text-xs sm:text-sm font-bold text-primary-foreground">Limited Time — Ending Soon!</span>
          </div>

          {/* CTA Button */}
          <Link
            href="#pricing"
            className="font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full transition-colors shadow-lg hover:shadow-xl bg-white text-primary hover:bg-gray-100"
          >
            Get Deal
          </Link>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors hover:bg-white/20"
            aria-label="Dismiss announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementBar
