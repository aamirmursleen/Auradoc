'use client'

import { useState } from 'react'
import { X, Sparkles, FileSignature, Shield, CheckCircle, Loader2, Zap } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature: 'sign' | 'verify'
  usedCount: number
  limit: number
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function UpgradeModal({ isOpen, onClose, feature, usedCount, limit }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  if (!isOpen) return null

  const handleCheckout = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else if (data.sessionId) {
        // Use Stripe.js to redirect
        const stripe = await stripePromise
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId })
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const featureTitle = feature === 'sign' ? 'Sign Documents' : 'Verify PDFs'
  const featureIcon = feature === 'sign' ? FileSignature : Shield

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              {<featureIcon className="w-6 h-6" />}
            </div>
            <h2 className="text-xl font-bold">Upgrade to Pro</h2>
          </div>
          <p className="text-white/80 text-sm">
            You've used {usedCount} of {limit} free {feature === 'sign' ? 'signatures' : 'verifications'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 -mt-3">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-400 to-red-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (usedCount / limit) * 100)}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-purple-50 px-4 py-2 rounded-full border border-cyan-100 mb-3">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Lifetime Access</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold text-gray-900">$19</span>
              <div className="text-left">
                <span className="block text-sm text-gray-500 line-through">$49</span>
                <span className="block text-xs text-emerald-600 font-medium">Save 61%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-1">One-time payment, no subscription</p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>Unlimited document signing</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>Unlimited PDF verification</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>Priority email support</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>All future updates included</span>
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          {/* CTA Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Get Lifetime Access - $19
              </>
            )}
          </button>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Secure Payment
            </span>
            <span>|</span>
            <span>Powered by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  )
}
