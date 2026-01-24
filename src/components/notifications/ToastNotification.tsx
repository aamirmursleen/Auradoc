'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { X, CheckCircle, FileCheck, Eye, XCircle, Clock, Bell } from 'lucide-react'

export interface Toast {
  id: string
  type: 'document_signed' | 'document_completed' | 'document_viewed' | 'document_declined' | 'reminder_sent' | 'info' | 'success' | 'error'
  title: string
  message: string
  documentName?: string
  signerName?: string
  duration?: number
}

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const duration = toast.duration || 5000
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onDismiss(toast.id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onDismiss])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => onDismiss(toast.id), 300)
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'document_signed':
        return <CheckCircle className="w-5 h-5 text-[#c4ff0e]" />
      case 'document_completed':
        return <FileCheck className="w-5 h-5 text-green-400" />
      case 'document_viewed':
        return <Eye className="w-5 h-5 text-blue-400" />
      case 'document_declined':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'reminder_sent':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Bell className="w-5 h-5 text-[#c4ff0e]" />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case 'document_signed':
        return 'border-l-[#c4ff0e]'
      case 'document_completed':
        return 'border-l-green-500'
      case 'document_viewed':
        return 'border-l-blue-500'
      case 'document_declined':
        return 'border-l-red-500'
      case 'reminder_sent':
        return 'border-l-yellow-500'
      case 'success':
        return 'border-l-green-500'
      case 'error':
        return 'border-l-red-500'
      default:
        return 'border-l-[#c4ff0e]'
    }
  }

  return (
    <div
      className={`
        flex items-start gap-3 bg-[#1e1e1e] border border-[#2a2a2a] border-l-4 ${getBorderColor()}
        rounded-lg p-4 shadow-2xl min-w-[320px] max-w-[420px]
        transform transition-all duration-300 ease-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm">{toast.title}</p>
        <p className="text-gray-400 text-xs mt-1">{toast.message}</p>
        {toast.documentName && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-[#c4ff0e] bg-[#c4ff0e]/10 px-2 py-0.5 rounded">
              {toast.documentName}
            </span>
            {toast.signerName && (
              <span className="text-xs text-gray-500">by {toast.signerName}</span>
            )}
          </div>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 hover:bg-[#2a2a2a] rounded transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  )
}

// Toast container component
interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    addToast,
    dismissToast,
    clearToasts,
    ToastContainer: () => <ToastContainer toasts={toasts} onDismiss={dismissToast} />
  }
}

export default ToastContainer
