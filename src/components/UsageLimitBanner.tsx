'use client'

import React from 'react'
import Link from 'next/link'
import { AlertTriangle, Lock, Zap, ArrowRight, Crown } from 'lucide-react'

interface UsageLimitBannerProps {
  remainingUses: number
  totalLimit: number
  type: 'sign' | 'verify' | 'invoice'
  hasReachedLimit: boolean
}

// Helper function to get type-specific text
const getTypeText = (type: 'sign' | 'verify' | 'invoice', plural: boolean = false) => {
  switch (type) {
    case 'sign':
      return plural ? 'signings' : 'signing'
    case 'verify':
      return plural ? 'verifications' : 'verification'
    case 'invoice':
      return plural ? 'invoices' : 'invoice'
  }
}

const getTypeTextFull = (type: 'sign' | 'verify' | 'invoice') => {
  switch (type) {
    case 'sign':
      return 'document signings'
    case 'verify':
      return 'verifications'
    case 'invoice':
      return 'invoice creations'
  }
}

export const UsageLimitBanner: React.FC<UsageLimitBannerProps> = ({
  remainingUses,
  totalLimit,
  type,
  hasReachedLimit
}) => {
  const usedCount = totalLimit - remainingUses
  const percentage = (usedCount / totalLimit) * 100

  if (hasReachedLimit) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Free Limit Reached!
            </h2>
            <p className="text-white/90">
              You've used all {totalLimit} free {getTypeTextFull(type)}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 mb-6 border border-primary-100">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-6 h-6 text-primary-500" />
                <span className="font-bold text-gray-900">Upgrade to Lifetime Access</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-500" />
                  Unlimited document signing
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-500" />
                  Unlimited PDF verification
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-500" />
                  Unlimited invoice creation
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-500" />
                  Lifetime updates - No recurring fees
                </li>
              </ul>
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-bold text-muted-foreground line-through">$120</span>
                <span className="text-5xl font-bold text-primary-600">$27</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">One-time payment</p>
            </div>

            {/* CTA Button */}
            <Link
              href="/pricing"
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary-500/30 transition-all transform hover:scale-[1.02]"
            >
              Get Lifetime Access
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Secure payment via Stripe
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Warning banner when approaching limit
  if (remainingUses <= 2) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-orange-900">
              {remainingUses === 0 ? 'No free uses left!' : `Only ${remainingUses} free ${getTypeText(type, remainingUses !== 1)} remaining`}
            </h4>
            <p className="text-sm text-orange-700 mt-1">
              Upgrade to lifetime access for unlimited {getTypeText(type, true)} - just $27
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 mt-2"
            >
              Upgrade Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-orange-700 mb-1">
            <span>{usedCount} of {totalLimit} free uses</span>
            <span>{remainingUses} left</span>
          </div>
          <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Normal usage indicator
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary-500" />
          <span className="text-sm text-gray-600">
            Free Plan: <span className="font-semibold text-gray-900">{remainingUses}</span> of {totalLimit} {getTypeText(type, true)} left
          </span>
        </div>
        <Link
          href="/pricing"
          className="text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          Upgrade
        </Link>
      </div>
      {/* Progress bar */}
      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default UsageLimitBanner
