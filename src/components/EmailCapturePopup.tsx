'use client'

import React, { useState, useEffect } from 'react'
import { X, Mail, Gift, CheckCircle } from 'lucide-react'

export default function EmailCapturePopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user has already seen the popup or subscribed
    const hasSeenPopup = localStorage.getItem('mamasign_popup_seen')
    const hasSubscribed = localStorage.getItem('mamasign_subscribed')

    if (hasSeenPopup || hasSubscribed) return

    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 30000)

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasSeenPopup && !hasSubscribed) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)

    // Simulate API call - In production, connect to email service
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitted(true)
    setLoading(false)
    localStorage.setItem('mamasign_subscribed', 'true')

    // Auto close after 3 seconds
    setTimeout(() => {
      setIsVisible(false)
    }, 3000)
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
          <h2 className="text-lg font-bold mb-1">Get 85% Off!</h2>
          <p className="text-purple-100 text-xs">
            First month discount + free tips
          </p>
        </div>

        {/* Compact Content */}
        <div className="p-4">
          {!submitted ? (
            <>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Join 10,000+ professionals using MamaSign
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Subscribing...' : 'Claim Discount'}
                </button>
              </form>

              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
                No spam. Unsubscribe anytime.
              </p>

              {/* Compact Benefits */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <ul className="space-y-1.5">
                  {[
                    'Exclusive Pro discount',
                    'Weekly productivity tips',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">You&apos;re In!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check your email for your discount code.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
