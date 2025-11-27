'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  FileText,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  Mail,
  User,
  Calendar,
  Download,
  Share2,
  ArrowLeft,
  Bell,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  Shield,
  X
} from 'lucide-react'
import Link from 'next/link'

// Document status types
type DocumentStatus = 'created' | 'delivered' | 'opened' | 'signed' | 'completed'

interface AuditEvent {
  id: string
  status: DocumentStatus
  timestamp: Date
  description: string
  email?: string
  ipAddress?: string
  device?: string
}

interface DocumentTrackingData {
  id: string
  name: string
  createdAt: Date
  sender: {
    name: string
    email: string
  }
  recipient: {
    name: string
    email: string
  }
  currentStatus: DocumentStatus
  events: AuditEvent[]
  emailNotifications: {
    id: string
    type: string
    sentAt: Date
    recipient: string
    status: 'sent' | 'delivered' | 'opened'
  }[]
}

// Status configuration
const statusConfig: Record<DocumentStatus, {
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
}> = {
  created: {
    label: 'Created',
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300'
  },
  delivered: {
    label: 'Delivered',
    icon: Send,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300'
  },
  opened: {
    label: 'Opened',
    icon: Eye,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300'
  },
  signed: {
    label: 'Signed',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300'
  },
  completed: {
    label: 'Completed',
    icon: Shield,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
    borderColor: 'border-primary-300'
  }
}

// Generate random ID
const generateId = () => Math.random().toString(36).substring(2, 15)

// Format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

// Format relative time
const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const TrackDocumentPage: React.FC = () => {
  const searchParams = useSearchParams()
  const [documentData, setDocumentData] = useState<DocumentTrackingData | null>(null)
  const [showEmailSimulation, setShowEmailSimulation] = useState(false)
  const [emailContent, setEmailContent] = useState<{ subject: string; body: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  // Initialize or load document data
  useEffect(() => {
    const docId = searchParams.get('id') || generateId()
    const storedData = localStorage.getItem(`auradoc_tracking_${docId}`)

    if (storedData) {
      const parsed = JSON.parse(storedData)
      // Convert date strings back to Date objects
      parsed.createdAt = new Date(parsed.createdAt)
      parsed.events = parsed.events.map((e: AuditEvent) => ({
        ...e,
        timestamp: new Date(e.timestamp)
      }))
      parsed.emailNotifications = parsed.emailNotifications.map((n: DocumentTrackingData['emailNotifications'][0]) => ({
        ...n,
        sentAt: new Date(n.sentAt)
      }))
      setDocumentData(parsed)
    } else {
      // Create new document tracking
      const newDoc: DocumentTrackingData = {
        id: docId,
        name: 'Sample Contract Agreement',
        createdAt: new Date(),
        sender: {
          name: 'You',
          email: 'sender@example.com'
        },
        recipient: {
          name: 'John Smith',
          email: 'john.smith@example.com'
        },
        currentStatus: 'created',
        events: [
          {
            id: generateId(),
            status: 'created',
            timestamp: new Date(),
            description: 'Document created and ready for sending'
          }
        ],
        emailNotifications: []
      }

      localStorage.setItem(`auradoc_tracking_${docId}`, JSON.stringify(newDoc))
      setDocumentData(newDoc)
    }
  }, [searchParams])

  // Save document data whenever it changes
  useEffect(() => {
    if (documentData) {
      localStorage.setItem(`auradoc_tracking_${documentData.id}`, JSON.stringify(documentData))
    }
  }, [documentData])

  // Simulate sending document
  const handleSendDocument = () => {
    if (!documentData || documentData.currentStatus !== 'created') return

    setIsSimulating(true)

    setTimeout(() => {
      const newEvent: AuditEvent = {
        id: generateId(),
        status: 'delivered',
        timestamp: new Date(),
        description: `Document delivered to ${documentData.recipient.email}`,
        email: documentData.recipient.email
      }

      const emailNotification = {
        id: generateId(),
        type: 'Document Delivered',
        sentAt: new Date(),
        recipient: documentData.recipient.email,
        status: 'sent' as const
      }

      setDocumentData(prev => prev ? {
        ...prev,
        currentStatus: 'delivered',
        events: [...prev.events, newEvent],
        emailNotifications: [...prev.emailNotifications, emailNotification]
      } : null)

      // Show email simulation
      setEmailContent({
        subject: `Document "${documentData.name}" is ready for your signature`,
        body: `Hi ${documentData.recipient.name},\n\n${documentData.sender.name} has sent you a document to review and sign.\n\nDocument: ${documentData.name}\n\nClick here to view and sign the document.\n\nBest regards,\nAuraDoc Team`
      })
      setShowEmailSimulation(true)
      setIsSimulating(false)
    }, 1500)
  }

  // Simulate opening document
  const handleOpenDocument = () => {
    if (!documentData || documentData.currentStatus !== 'delivered') return

    setIsSimulating(true)

    setTimeout(() => {
      const newEvent: AuditEvent = {
        id: generateId(),
        status: 'opened',
        timestamp: new Date(),
        description: `Document opened by ${documentData.recipient.name}`,
        email: documentData.recipient.email,
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        device: 'Chrome on Windows'
      }

      const emailNotification = {
        id: generateId(),
        type: 'Document Opened',
        sentAt: new Date(),
        recipient: documentData.sender.email,
        status: 'sent' as const
      }

      setDocumentData(prev => prev ? {
        ...prev,
        currentStatus: 'opened',
        events: [...prev.events, newEvent],
        emailNotifications: [...prev.emailNotifications, emailNotification]
      } : null)

      // Show email simulation
      setEmailContent({
        subject: `${documentData.recipient.name} opened "${documentData.name}"`,
        body: `Hi ${documentData.sender.name},\n\n${documentData.recipient.name} has opened the document you sent.\n\nDocument: ${documentData.name}\nOpened at: ${formatDate(new Date())}\n\nYou'll be notified when they sign.\n\nBest regards,\nAuraDoc Team`
      })
      setShowEmailSimulation(true)
      setIsSimulating(false)
    }, 1000)
  }

  // Simulate signing document
  const handleSignDocument = () => {
    if (!documentData || documentData.currentStatus !== 'opened') return

    setIsSimulating(true)

    setTimeout(() => {
      const signEvent: AuditEvent = {
        id: generateId(),
        status: 'signed',
        timestamp: new Date(),
        description: `Document signed by ${documentData.recipient.name}`,
        email: documentData.recipient.email,
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        device: 'Chrome on Windows'
      }

      const completedEvent: AuditEvent = {
        id: generateId(),
        status: 'completed',
        timestamp: new Date(Date.now() + 1000),
        description: 'All parties have signed. Document completed.'
      }

      const emailNotification = {
        id: generateId(),
        type: 'Document Signed',
        sentAt: new Date(),
        recipient: documentData.sender.email,
        status: 'sent' as const
      }

      setDocumentData(prev => prev ? {
        ...prev,
        currentStatus: 'completed',
        events: [...prev.events, signEvent, completedEvent],
        emailNotifications: [...prev.emailNotifications, emailNotification]
      } : null)

      // Show email simulation
      setEmailContent({
        subject: `"${documentData.name}" has been signed!`,
        body: `Hi ${documentData.sender.name},\n\nGreat news! ${documentData.recipient.name} has signed the document.\n\nDocument: ${documentData.name}\nSigned at: ${formatDate(new Date())}\n\nAll parties have signed. The document is now complete.\n\nYou can download the signed document from your dashboard.\n\nBest regards,\nAuraDoc Team`
      })
      setShowEmailSimulation(true)
      setIsSimulating(false)
    }, 1500)
  }

  // Reset demo
  const handleResetDemo = () => {
    if (documentData) {
      localStorage.removeItem(`auradoc_tracking_${documentData.id}`)
      window.location.reload()
    }
  }

  // Copy tracking link
  const handleCopyLink = () => {
    const link = `${window.location.origin}/track?id=${documentData?.id}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!documentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  const statusOrder: DocumentStatus[] = ['created', 'delivered', 'opened', 'signed', 'completed']
  const currentStatusIndex = statusOrder.indexOf(documentData.currentStatus)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Track Document</h1>
                <p className="text-sm text-gray-500">{documentData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={handleResetDemo}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Progress Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Document Status</h2>

              {/* Progress Steps */}
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {statusOrder.map((status, index) => {
                    const config = statusConfig[status]
                    const Icon = config.icon
                    const isCompleted = index <= currentStatusIndex
                    const isCurrent = index === currentStatusIndex

                    return (
                      <div key={status} className="flex flex-col items-center">
                        <div
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                            ${isCompleted
                              ? isCurrent
                                ? `${config.bgColor} ${config.borderColor} border-2 ring-4 ring-${config.color.split('-')[1]}-100`
                                : 'bg-green-500 border-green-500'
                              : 'bg-gray-100 border-gray-200 border-2'
                            }
                          `}
                        >
                          <Icon
                            className={`w-5 h-5 ${isCompleted ? (isCurrent ? config.color : 'text-white') : 'text-gray-400'}`}
                          />
                        </div>
                        <span
                          className={`mt-2 text-sm font-medium ${isCompleted ? config.color : 'text-gray-400'}`}
                        >
                          {config.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                {documentData.currentStatus === 'created' && (
                  <button
                    onClick={handleSendDocument}
                    disabled={isSimulating}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Document
                      </>
                    )}
                  </button>
                )}

                {documentData.currentStatus === 'delivered' && (
                  <button
                    onClick={handleOpenDocument}
                    disabled={isSimulating}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Opening...
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5" />
                        Simulate: Recipient Opens
                      </>
                    )}
                  </button>
                )}

                {documentData.currentStatus === 'opened' && (
                  <button
                    onClick={handleSignDocument}
                    disabled={isSimulating}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Signing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Simulate: Recipient Signs
                      </>
                    )}
                  </button>
                )}

                {documentData.currentStatus === 'completed' && (
                  <div className="flex items-center gap-3 px-6 py-3 bg-green-50 text-green-700 rounded-xl">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Document Complete - All parties have signed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Trail Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                Audit Trail
              </h2>

              <div className="space-y-1">
                {documentData.events.slice().reverse().map((event, index) => {
                  const config = statusConfig[event.status]
                  const Icon = config.icon

                  return (
                    <div key={event.id} className="relative pl-8 pb-6">
                      {/* Timeline line */}
                      {index !== documentData.events.length - 1 && (
                        <div className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-gray-200" />
                      )}

                      {/* Timeline dot */}
                      <div
                        className={`absolute left-0 top-1 w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center`}
                      >
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className="ml-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{config.label}</h3>
                            <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatRelativeTime(event.timestamp)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(event.timestamp)}
                            </p>
                          </div>
                        </div>

                        {/* Additional details */}
                        {(event.ipAddress || event.device) && (
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                            {event.ipAddress && (
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                IP: {event.ipAddress}
                              </span>
                            )}
                            {event.device && (
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                {event.device}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Details</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Document Name</p>
                    <p className="font-medium text-gray-900">{documentData.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">{formatDate(documentData.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium text-gray-900">{documentData.sender.name}</p>
                    <p className="text-sm text-gray-500">{documentData.sender.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-medium text-gray-900">{documentData.recipient.name}</p>
                    <p className="text-sm text-gray-500">{documentData.recipient.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Document ID</p>
                    <p className="font-mono text-sm text-gray-900">{documentData.id}</p>
                  </div>
                </div>
              </div>

              {documentData.currentStatus === 'completed' && (
                <button className="w-full mt-6 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                  <Download className="w-5 h-5" />
                  Download Signed Document
                </button>
              )}
            </div>

            {/* Email Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary-500" />
                Email Notifications
              </h2>

              {documentData.emailNotifications.length > 0 ? (
                <div className="space-y-3">
                  {documentData.emailNotifications.slice().reverse().map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-primary-500" />
                          <span className="font-medium text-sm text-gray-900">
                            {notification.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(notification.sentAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Sent to: {notification.recipient}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">Delivered</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Mail className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No notifications sent yet</p>
                </div>
              )}
            </div>

            {/* Help Box */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Demo Mode</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This is a simulation of the audit trail feature. Click the action buttons to simulate document workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Simulation Modal */}
      {showEmailSimulation && emailContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-in">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Sent</h3>
                  <p className="text-sm text-gray-500">Notification delivered</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailSimulation(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <p className="text-sm text-gray-500">Subject:</p>
                  <p className="font-medium text-gray-900">{emailContent.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Body:</p>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {emailContent.body}
                  </pre>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                <Check className="w-4 h-4" />
                <span>Email notification simulated successfully</span>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowEmailSimulation(false)}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackDocumentPage
