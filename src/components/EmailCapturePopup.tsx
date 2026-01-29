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
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal - Small & Centered */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-72 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 bg-black/10 hover:bg-black/20 rounded-full text-white z-10 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header - Compact */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-4 text-center text-white">
          <Gift className="w-6 h-6 mx-auto mb-1.5 opacity-90" />
          <h2 className="text-base font-bold">90% Off Pro Plan!</h2>
        </div>

        {/* Content - Compact */}
        <div className="p-3">
          {/* Discount Code */}
          <div
            onClick={handleCopyCode}
            className="relative bg-violet-50 dark:bg-violet-900/30 border border-dashed border-violet-300 dark:border-violet-600 rounded-lg py-2.5 px-3 text-center cursor-pointer hover:border-violet-400 transition-all"
          >
            <p className="text-xl font-bold text-violet-600 dark:text-violet-400 tracking-wide">
              {DISCOUNT_CODE}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-1">
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Tap to copy'}
            </p>
          </div>

          {/* Benefits - Inline */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Unlimited signs
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              All PDF tools
            </span>
          </div>

          <button
            onClick={handleClose}
            className="w-full mt-3 py-2 text-sm bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}
