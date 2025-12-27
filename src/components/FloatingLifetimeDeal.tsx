'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'

const FloatingLifetimeDeal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isDismissed])

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDismissed(true)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="animate-slide-up">
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center shadow-lg z-10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3 text-gray-400" />
        </button>

        {/* Main CTA */}
        <Link href="/pricing" className="block group">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-[1.02]">
            {/* Dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />

            {/* Fire glow effect at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-gradient-x" />

            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-2xl border border-orange-500/30 group-hover:border-orange-500/50 transition-colors" />

            {/* Content */}
            <div className="relative px-5 py-4 flex items-center gap-4">
              {/* Left - Fire emoji */}
              <div className="relative">
                <span className="text-3xl animate-bounce-slow">🔥</span>
              </div>

              {/* Center - Deal info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-bold text-base">Lifetime Deal</span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse">
                    Ending Soon
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-bold text-2xl">$27</span>
                  <span className="text-gray-400 text-sm">once, forever</span>
                  <span className="text-gray-500 text-sm line-through">$270</span>
                </div>
              </div>

              {/* Right - Price & Arrow */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                <span className="text-white font-bold text-xl">$27</span>
                <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-green-500/30">
                  <ArrowRight className="w-5 h-5 text-gray-900" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
            background-size: 200% 100%;
          }
          50% {
            background-position: 100% 50%;
            background-size: 200% 100%;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-gradient-x {
          animation: gradient-x 2s ease infinite;
          background-size: 200% 100%;
        }

        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default FloatingLifetimeDeal
