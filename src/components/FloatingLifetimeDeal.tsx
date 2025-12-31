'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'

const STORAGE_KEY = 'mamasign_deal_shown'

const FloatingLifetimeDeal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [hasBeenShown, setHasBeenShown] = useState(true) // Start true to prevent flash

  // Check localStorage on mount
  useEffect(() => {
    const alreadyShown = localStorage.getItem(STORAGE_KEY)
    if (alreadyShown) {
      setHasBeenShown(true)
      setIsDismissed(true)
    } else {
      setHasBeenShown(false)
    }
  }, [])

  // Listen for scroll to middle of page
  useEffect(() => {
    if (hasBeenShown || isDismissed) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100

      // Show popup when user scrolls to 50% of the page
      if (scrollPercent >= 50 && !isVisible && !isDismissed) {
        setIsVisible(true)
        localStorage.setItem(STORAGE_KEY, 'true')
        setHasBeenShown(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasBeenShown, isDismissed, isVisible])

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDismissed(true)
    setIsVisible(false)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-2rem)] sm:max-w-none" style={{ paddingBottom: 'env(safe-area-inset-bottom)', paddingRight: 'env(safe-area-inset-right)' }}>
      <div className="animate-slide-up">
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center shadow-lg z-10 transition-colors active:scale-95"
          aria-label="Dismiss"
        >
          <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
        </button>

        {/* Main CTA */}
        <Link href="/pricing" className="block group">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />
            <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-gradient-x" />
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-orange-500/30 group-hover:border-orange-500/50 transition-colors" />

            <div className="relative px-3 py-2.5 sm:px-5 sm:py-4 flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <span className="text-xl sm:text-3xl animate-bounce-slow">🔥</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <span className="text-white font-bold text-xs sm:text-base whitespace-nowrap">Lifetime Deal</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse">
                    Ending Soon
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-white font-bold text-lg sm:text-2xl">$27</span>
                  <span className="text-gray-400 text-[10px] sm:text-sm hidden xs:inline">once</span>
                  <span className="text-gray-500 text-[10px] sm:text-sm line-through">$270</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 sm:pl-4 sm:border-l sm:border-gray-700">
                <span className="hidden sm:block text-white font-bold text-xl">$27</span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 bg-[#c4ff0e] rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-[#c4ff0e]/30">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; background-size: 200% 100%; }
          50% { background-position: 100% 50%; background-size: 200% 100%; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-gradient-x { animation: gradient-x 2s ease infinite; background-size: 200% 100%; }
        .animate-bounce-slow { animation: bounce-slow 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export default FloatingLifetimeDeal
