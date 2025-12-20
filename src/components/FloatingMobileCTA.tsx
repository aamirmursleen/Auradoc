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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 pb-6 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900">
      <div className="relative">
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md z-10"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3 text-gray-600 dark:text-gray-300" />
        </button>

        {/* CTA Button */}
        <Link
          href="/sign-document"
          className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl shadow-cyan-500/40 active:scale-[0.98] transition-transform"
        >
          <FileSignature className="w-5 h-5" />
          <span>Start Signing Free</span>
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">No signup</span>
        </Link>
      </div>
    </div>
  )
}

export default FloatingMobileCTA
