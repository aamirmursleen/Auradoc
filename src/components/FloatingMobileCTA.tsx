'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileSignature, X } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

const FloatingMobileCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    // Show CTA after scrolling past hero section
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight * 0.7

      if (scrollY > heroHeight && !isDismissed) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDismissed(true)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-white via-white to-transparent">
      <div className="relative max-w-sm mx-auto">
        {/* Dismiss button - smaller on mobile */}
        <button
          onClick={handleDismiss}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10 active:scale-95 border bg-secondary border-border"
          aria-label="Dismiss"
        >
          <X className="w-2.5 h-2.5 text-muted-foreground" />
        </button>

        {/* CTA Button - Compact mobile size, 44px min tap target maintained */}
        <Link
          href="/sign-document"
          className="flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 px-4 text-sm font-semibold rounded-xl shadow-lg active:scale-[0.98] transition-transform bg-primary text-primary-foreground shadow-primary/30"
        >
          <FileSignature className="w-4 h-4" />
          <span>Start Signing Free</span>
          <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">No signup</span>
        </Link>
      </div>
    </div>
  )
}

export default FloatingMobileCTA
