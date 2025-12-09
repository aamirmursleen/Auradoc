'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { UsageLimitBanner } from './UsageLimitBanner'
import {
  canSignDocument,
  canVerifyDocument,
  canCreateInvoice,
  getRemainingSignUses,
  getRemainingVerifyUses,
  getRemainingInvoiceUses,
  incrementSignCount,
  incrementVerifyCount,
  incrementInvoiceCount,
  FREE_LIMIT
} from '@/lib/usageLimit'

interface UsageLimitWrapperProps {
  children: React.ReactNode
  type: 'sign' | 'verify' | 'invoice'
  onAction?: () => void
}

export const UsageLimitWrapper: React.FC<UsageLimitWrapperProps> = ({
  children,
  type,
  onAction
}) => {
  const { user, isLoaded } = useUser()
  const [remainingUses, setRemainingUses] = useState(FREE_LIMIT)
  const [hasReachedLimit, setHasReachedLimit] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      if (user?.id) {
        if (type === 'sign') {
          const remaining = getRemainingSignUses(user.id)
          setRemainingUses(remaining)
          setHasReachedLimit(!canSignDocument(user.id))
        } else if (type === 'verify') {
          const remaining = getRemainingVerifyUses(user.id)
          setRemainingUses(remaining)
          setHasReachedLimit(!canVerifyDocument(user.id))
        } else if (type === 'invoice') {
          const remaining = getRemainingInvoiceUses(user.id)
          setRemainingUses(remaining)
          setHasReachedLimit(!canCreateInvoice(user.id))
        }
      }
      setIsChecked(true)
    }
  }, [isLoaded, user?.id, type])

  // Function to increment usage after successful action
  const handleUsageIncrement = () => {
    if (user?.id) {
      if (type === 'sign') {
        incrementSignCount(user.id)
        const remaining = getRemainingSignUses(user.id)
        setRemainingUses(remaining)
        setHasReachedLimit(!canSignDocument(user.id))
      } else if (type === 'verify') {
        incrementVerifyCount(user.id)
        const remaining = getRemainingVerifyUses(user.id)
        setRemainingUses(remaining)
        setHasReachedLimit(!canVerifyDocument(user.id))
      } else if (type === 'invoice') {
        incrementInvoiceCount(user.id)
        const remaining = getRemainingInvoiceUses(user.id)
        setRemainingUses(remaining)
        setHasReachedLimit(!canCreateInvoice(user.id))
      }
    }
  }

  if (!isLoaded || !isChecked) {
    return <>{children}</>
  }

  return (
    <>
      {/* Show banner when limit is reached */}
      {hasReachedLimit && (
        <UsageLimitBanner
          remainingUses={remainingUses}
          totalLimit={FREE_LIMIT}
          type={type}
          hasReachedLimit={hasReachedLimit}
        />
      )}

      {/* Show warning banner when approaching limit */}
      {!hasReachedLimit && remainingUses <= 2 && remainingUses > 0 && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 max-w-lg w-full px-4">
          <UsageLimitBanner
            remainingUses={remainingUses}
            totalLimit={FREE_LIMIT}
            type={type}
            hasReachedLimit={false}
          />
        </div>
      )}

      {children}
    </>
  )
}

export default UsageLimitWrapper
