'use client'

import React, { useState, useEffect } from 'react'
import { X, Gift, CheckCircle, Copy } from 'lucide-react'

const DISCOUNT_CODE = 'MAMA90'

export default function EmailCapturePopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('mamasign_popup_seen')

    if (hasSeenPopup) return

    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 30000)

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasSeenPopup) {
        setIsVisible(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('mamasign_popup_seen', 'true')
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - click to close */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal - Compact Size */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-xs w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close button - More visible */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full text-gray-500 hover:text-gray-700 z-10 shadow-sm transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Compact header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-5 text-center text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Gift className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold mb-1">Get 90% Off!</h2>
          <p className="text-purple-100 text-xs">
            Limited time offer - Pro Plan
          </p>
        </div>

        {/* Compact Content */}
        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
            Use this exclusive discount code at checkout
          </p>

          {/* Discount Code Display */}
          <div
            onClick={handleCopyCode}
            className="relative bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 border-2 border-dashed border-violet-300 dark:border-violet-600 rounded-lg p-4 text-center cursor-pointer hover:border-violet-500 transition-all group"
          >
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 tracking-wider">
              {DISCOUNT_CODE}
            </p>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <Copy className="w-3 h-3" />
              <span>{copied ? 'Copied!' : 'Click to copy'}</span>
            </div>
            {copied && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Copied!
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <ul className="space-y-1.5">
              {[
                '90% off Pro Plan',
                'Unlimited signatures',
                'All PDF tools included',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleClose}
            className="w-full mt-4 py-2.5 text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Start Using MamaSign
          </button>
        </div>
      </div>
    </div>
  )
}
