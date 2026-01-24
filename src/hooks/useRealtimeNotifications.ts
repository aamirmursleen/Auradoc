'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface RealtimeNotification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  document_id: string | null
  document_name: string | null
  signer_name: string | null
  signer_email: string | null
  metadata: Record<string, unknown>
  is_read: boolean
  created_at: string
}

export interface SigningRequestUpdate {
  id: string
  document_name: string
  status: string
  signers: Array<{
    name: string
    email: string
    status: string
    signedAt?: string
  }>
  updated_at: string
}

interface UseRealtimeNotificationsOptions {
  userId: string | null | undefined
  onNotification?: (notification: RealtimeNotification) => void
  onSigningRequestUpdate?: (request: SigningRequestUpdate) => void
  onConnectionChange?: (connected: boolean) => void
}

export function useRealtimeNotifications({
  userId,
  onNotification,
  onSigningRequestUpdate,
  onConnectionChange
}: UseRealtimeNotificationsOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const signingChannelRef = useRef<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle connection status changes
  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected)
    onConnectionChange?.(connected)
  }, [onConnectionChange])

  // Setup realtime subscription
  const setupSubscription = useCallback(() => {
    if (!userId) return

    const supabase = getSupabase()

    // Clean up existing channels
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }
    if (signingChannelRef.current) {
      supabase.removeChannel(signingChannelRef.current)
    }

    // Subscribe to notifications table for this user
    const notificationChannel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('🔔 New notification received:', payload)
          const notification = payload.new as RealtimeNotification
          onNotification?.(notification)
        }
      )
      .on('presence', { event: 'sync' }, () => {
        handleConnectionChange(true)
      })
      .subscribe((status) => {
        console.log('Notification channel status:', status)
        if (status === 'SUBSCRIBED') {
          handleConnectionChange(true)
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          handleConnectionChange(false)
          // Attempt reconnection after 5 seconds
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...')
            setupSubscription()
          }, 5000)
        }
      })

    channelRef.current = notificationChannel

    // Subscribe to signing_requests updates for this user
    const signingChannel = supabase
      .channel(`signing_requests:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'signing_requests',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('📝 Signing request updated:', payload)
          const request = payload.new as SigningRequestUpdate
          onSigningRequestUpdate?.(request)
        }
      )
      .subscribe((status) => {
        console.log('Signing requests channel status:', status)
      })

    signingChannelRef.current = signingChannel

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
      if (signingChannelRef.current) {
        supabase.removeChannel(signingChannelRef.current)
      }
    }
  }, [userId, onNotification, onSigningRequestUpdate, handleConnectionChange])

  // Setup subscription on mount
  useEffect(() => {
    const cleanup = setupSubscription()
    return () => {
      cleanup?.()
    }
  }, [setupSubscription])

  // Force refresh data on reconnection
  const forceRefresh = useCallback(async () => {
    // This triggers a re-sync from the server
    // The parent component should implement this to refetch data
    console.log('Force refreshing data after reconnection...')
  }, [])

  return {
    isConnected,
    forceRefresh
  }
}

export default useRealtimeNotifications
