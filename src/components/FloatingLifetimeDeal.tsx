'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

const STORAGE_KEY = 'auradoc_deal_shown'

const FloatingLifetimeDeal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [hasBeenShown, setHasBeenShown] = useState(true) // Start true to prevent flash
  const { theme } = useTheme()
  const isDark = theme === 'dark'

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
          className="absolute -top-3 -right-3 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg z-10 transition-colors active:scale-95 bg-secondary hover:bg-secondary/80"
          aria-label="Dismiss"
        >
          <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
        </button>

        {/* Main CTA */}
        <Link href="/pricing" className="block group">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl transition-all duration-300 hover:scale-[1.02] shadow-primary/30 hover:shadow-primary/50">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white" />
            <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 animate-gradient-x bg-gradient-to-r from-primary via-primary/70 to-primary" />
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl border transition-colors border-primary/30 group-hover:border-primary/50" />

            <div className="relative px-3 py-2.5 sm:px-5 sm:py-4 flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <span className="text-xl sm:text-3xl animate-bounce-slow">🔥</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <span className="font-bold text-xs sm:text-base whitespace-nowrap text-foreground">Lifetime Deal</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-primary-foreground text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse bg-gradient-to-r from-primary to-primary/70">
                    Ending Soon
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="font-bold text-lg sm:text-2xl text-foreground">$27</span>
                  <span className="text-[10px] sm:text-sm hidden xs:inline text-muted-foreground">once</span>
                  <span className="text-[10px] sm:text-sm line-through text-muted-foreground">$270</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 sm:pl-4 sm:border-l sm:border-border">
                <span className="hidden sm:block font-bold text-xl text-foreground">$27</span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg bg-primary shadow-primary/30">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
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
