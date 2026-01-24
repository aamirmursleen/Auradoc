'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, X, Check, CheckCheck, FileCheck, FileText, Eye, XCircle, Clock, Wifi, WifiOff } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useRealtimeNotifications, RealtimeNotification } from '@/hooks/useRealtimeNotifications'
import { useToastContext } from '@/contexts/ToastContext'

interface Notification {
  id: string
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

const NotificationBell: React.FC = () => {
  const { user } = useUser()
  const { addToast } = useToastContext()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch('/api/notifications?limit=20')
      const data = await response.json()

      if (data.success) {
        setNotifications(data.data || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }, [user])

  // Handle new realtime notification
  const handleNewNotification = useCallback((notification: RealtimeNotification) => {
    // Add to local state
    setNotifications(prev => [notification, ...prev])
    setUnreadCount(prev => prev + 1)

    // Show toast notification
    addToast({
      type: notification.type as any,
      title: notification.title,
      message: notification.message,
      documentName: notification.document_name || undefined,
      signerName: notification.signer_name || undefined,
      duration: 6000
    })
  }, [addToast])

  // Handle connection status changes
  const handleConnectionChange = useCallback((connected: boolean) => {
    if (connected) {
      // Resync data when reconnecting
      fetchNotifications()
    }
  }, [fetchNotifications])

  // Setup realtime subscription
  const { isConnected } = useRealtimeNotifications({
    userId: user?.id,
    onNotification: handleNewNotification,
    onConnectionChange: handleConnectionChange
  })

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Fallback polling every 30 seconds (backup for missed events)
  useEffect(() => {
    if (!user) return
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [user, fetchNotifications])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] })
      })

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      })

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'document_completed':
        return <FileCheck className="w-5 h-5 text-green-400" />
      case 'document_signed':
        return <Check className="w-5 h-5 text-[#c4ff0e]" />
      case 'document_viewed':
        return <Eye className="w-5 h-5 text-blue-400" />
      case 'document_declined':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'reminder_sent':
        return <Clock className="w-5 h-5 text-yellow-400" />
      default:
        return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {/* Connection indicator */}
        <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl shadow-2xl z-[100] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#c4ff0e]" />
              Notifications
              {/* Live indicator */}
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3" />
                    Live
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3" />
                    Offline
                  </>
                )}
              </span>
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={isLoading}
                className="text-xs text-[#c4ff0e] hover:underline disabled:opacity-50 flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No notifications yet</p>
                <p className="text-sm mt-1">You'll see updates here when documents are signed</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-[#2a2a2a] hover:bg-[#252525] cursor-pointer transition-colors ${
                    !notification.is_read ? 'bg-[#252525]/50' : ''
                  }`}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.id)
                    }
                    if (notification.document_id) {
                      window.location.href = `/documents`
                    }
                  }}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${notification.is_read ? 'text-gray-400' : 'text-white'}`}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-[#c4ff0e] rounded-full flex-shrink-0 mt-1.5 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-600">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                        {notification.document_name && (
                          <span className="text-xs text-[#c4ff0e] bg-[#c4ff0e]/10 px-2 py-0.5 rounded">
                            {notification.document_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-[#2a2a2a] bg-[#1a1a1a]">
              <a
                href="/documents"
                className="block text-center text-sm text-[#c4ff0e] hover:underline"
              >
                View all documents
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
