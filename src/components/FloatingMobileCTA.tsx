'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileSignature, X } from 'lucide-react'

const FloatingMobileCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900">
      <div className="relative max-w-sm mx-auto">
        {/* Dismiss button - smaller on mobile */}
        <button
          onClick={handleDismiss}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md z-10 active:scale-95"
          aria-label="Dismiss"
        >
          <X className="w-2.5 h-2.5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* CTA Button - Compact mobile size, 44px min tap target maintained */}
        <Link
          href="/sign-document"
          className="flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/30 active:scale-[0.98] transition-transform"
        >
          <FileSignature className="w-4 h-4" />
          <span>Start Signing Free</span>
          <span className="ml-0.5 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">No signup</span>
        </Link>
      </div>
    </div>
  )
}

export default FloatingMobileCTA
