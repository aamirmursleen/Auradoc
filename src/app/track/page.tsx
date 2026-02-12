'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
  ArrowLeft,
  Bell,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  Shield,
  XCircle,
  Users,
} from 'lucide-react'
import Link from 'next/link'

// Types matching the Supabase schema
interface Signer {
  name: string
  email: string
  order: number
  status: 'pending' | 'sent' | 'opened' | 'signed'
  signedAt?: string
  token?: string
  is_self?: boolean
}

interface SigningRequest {
  id: string
  user_id: string
  document_name: string
  document_url: string
  sender_name: string
  sender_email: string
  signers: Signer[]
  message?: string
  due_date?: string
  status: string
  current_signer_index: number
  declined_by?: string
  declined_reason?: string
  declined_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

interface SignatureRecord {
  id?: string
  signing_request_id: string
  signer_email: string
  signer_name: string
  signature_type: string
  ip_address: string
  user_agent: string
  consent_given: boolean
  signed_at: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  signer_name?: string
  signer_email?: string
  created_at: string
}

// Map signing request status to a progress step
function getProgressStep(status: string, signers: Signer[]): number {
  const signedCount = signers.filter(s => s.status === 'signed').length
  const totalSigners = signers.length

  if (status === 'completed') return 4
  if (signedCount > 0 && signedCount < totalSigners) return 3
  if (status === 'in_progress') return 2
  if (status === 'pending' && signers.some(s => s.status === 'sent' || s.status === 'opened')) return 1
  if (status === 'pending') return 0
  return 0
}

const statusSteps = [
  { key: 'created', label: 'Created', icon: FileText, color: 'text-muted-foreground', bg: 'bg-muted' },
  { key: 'sent', label: 'Sent', icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'in_progress', label: 'In Progress', icon: Eye, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'signing', label: 'Signing', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'completed', label: 'Completed', icon: Shield, color: 'text-primary', bg: 'bg-primary/10' },
]

// Format date
const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(dateStr))
}

// Format relative time
const formatRelativeTime = (dateStr: string) => {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

// Parse user agent to a readable device string
const parseDevice = (ua: string) => {
  if (!ua || ua === 'unknown') return null
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  return 'Browser'
}

const TrackDocumentPageInner: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [signingRequest, setSigningRequest] = useState<SigningRequest | null>(null)
  const [signatureRecords, setSignatureRecords] = useState<SignatureRecord[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isResending, setIsResending] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const requestId = searchParams.get('id')

  // Fetch tracking data
  useEffect(() => {
    if (!requestId) {
      setError('No document ID provided. Go to Documents to select a document to track.')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/track/${requestId}`)
        const json = await res.json()

        if (!res.ok || !json.success) {
          setError(json.message || 'Failed to load tracking data')
          return
        }

        setSigningRequest(json.data.signingRequest)
        setSignatureRecords(json.data.signatureRecords || [])
        setNotifications(json.data.notifications || [])
      } catch (err) {
        setError('Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Poll every 30 seconds for updates
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [requestId])

  // Copy tracking link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/track?id=${requestId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download signed document
  const handleDownload = async () => {
    if (!requestId) return
    setIsDownloading(true)
    try {
      const res = await fetch(`/api/signing-requests/${requestId}/download`)
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${signingRequest?.document_name || 'document'}-signed.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  // Resend invite to a specific signer
  const handleResend = async (signerEmail: string) => {
    if (!requestId) return
    setIsResending(signerEmail)
    try {
      const res = await fetch(`/api/signing-requests/${requestId}/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerEmail })
      })
      // Even if the resend route doesn't exist yet, show feedback
      if (res.ok) {
        alert('Signing invite resent successfully!')
      }
    } catch (err) {
      console.error('Resend error:', err)
    } finally {
      setIsResending(null)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading tracking data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !signingRequest) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Unable to Load Document</h2>
          <p className="text-muted-foreground mb-6">{error || 'Document not found'}</p>
          <Link
            href="/documents"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Documents
          </Link>
        </div>
      </div>
    )
  }

  const signers = signingRequest.signers || []
  const progressStep = getProgressStep(signingRequest.status, signers)
  const signedCount = signers.filter(s => s.status === 'signed').length
  const totalSigners = signers.length

  // Build audit trail from real data
  const auditEvents: {
    id: string
    type: string
    label: string
    description: string
    timestamp: string
    icon: React.ElementType
    color: string
    bg: string
    ipAddress?: string
    device?: string
  }[] = []

  // 1. Document created
  auditEvents.push({
    id: 'created',
    type: 'created',
    label: 'Created',
    description: `Document "${signingRequest.document_name}" created and sent for signing`,
    timestamp: signingRequest.created_at,
    icon: FileText,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
  })

  // 2. Add signature records as audit events
  signatureRecords.forEach((record, idx) => {
    auditEvents.push({
      id: `sig-${idx}`,
      type: 'signed',
      label: 'Signed',
      description: `${record.signer_name} (${record.signer_email}) signed the document`,
      timestamp: record.signed_at,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
      ipAddress: record.ip_address !== 'unknown' ? record.ip_address : undefined,
      device: parseDevice(record.user_agent) || undefined,
    })
  })

  // 3. Document completed
  if (signingRequest.status === 'completed' && signingRequest.completed_at) {
    auditEvents.push({
      id: 'completed',
      type: 'completed',
      label: 'Completed',
      description: 'All parties have signed. Document completed.',
      timestamp: signingRequest.completed_at,
      icon: Shield,
      color: 'text-primary',
      bg: 'bg-primary/10',
    })
  } else if (signingRequest.status === 'completed') {
    auditEvents.push({
      id: 'completed',
      type: 'completed',
      label: 'Completed',
      description: 'All parties have signed. Document completed.',
      timestamp: signingRequest.updated_at,
      icon: Shield,
      color: 'text-primary',
      bg: 'bg-primary/10',
    })
  }

  // 4. Document declined
  if (signingRequest.status === 'declined' && signingRequest.declined_by) {
    auditEvents.push({
      id: 'declined',
      type: 'declined',
      label: 'Declined',
      description: `${signingRequest.declined_by} declined to sign${signingRequest.declined_reason ? `: ${signingRequest.declined_reason}` : ''}`,
      timestamp: signingRequest.declined_at || signingRequest.updated_at,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    })
  }

  // Sort by timestamp
  auditEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Page Header - only visible outside dashboard layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/documents"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Track Document</h1>
              <p className="text-sm text-muted-foreground">{signingRequest.document_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Progress Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Document Status</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  signingRequest.status === 'completed' ? 'bg-primary/10 text-primary' :
                  signingRequest.status === 'declined' ? 'bg-red-50 text-red-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {signingRequest.status === 'completed' ? 'Completed' :
                   signingRequest.status === 'declined' ? 'Declined' :
                   `${signedCount}/${totalSigners} signed`}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="relative">
                <div className="absolute top-6 left-6 right-6 h-1 bg-muted rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(progressStep / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = index <= progressStep
                    const isCurrent = index === progressStep

                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                            ${isCompleted
                              ? isCurrent
                                ? `${step.bg} border-2 ring-4 ring-opacity-20 ring-current ${step.color}`
                                : 'bg-green-100 border-green-300 border-2'
                              : 'bg-muted border-border border-2'
                            }
                          `}
                        >
                          <Icon className={`w-5 h-5 ${isCompleted ? (isCurrent ? step.color : 'text-green-600') : 'text-muted-foreground'}`} />
                        </div>
                        <span className={`mt-2 text-xs font-medium ${isCompleted ? step.color : 'text-muted-foreground'}`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Completed message */}
              {signingRequest.status === 'completed' && (
                <div className="mt-6 flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl border border-primary/20">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">All {totalSigners} signer{totalSigners > 1 ? 's' : ''} have completed signing</span>
                </div>
              )}

              {signingRequest.status === 'declined' && (
                <div className="mt-6 flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-200">
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">
                    {signingRequest.declined_by} declined to sign
                    {signingRequest.declined_reason && `: ${signingRequest.declined_reason}`}
                  </span>
                </div>
              )}
            </div>

            {/* Signers */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Signers ({signedCount}/{totalSigners})
              </h2>

              <div className="space-y-3">
                {signers.map((signer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        signer.status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                      }`}>
                        {signer.status === 'signed' ? <Check className="w-5 h-5" /> : index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {signer.name}
                          {signer.is_self && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">{signer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {signer.status === 'signed' ? (
                        <div className="text-right">
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Signed</span>
                          {signer.signedAt && (
                            <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(signer.signedAt)}</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Awaiting</span>
                          <button
                            onClick={() => handleResend(signer.email)}
                            disabled={isResending === signer.email}
                            className="text-xs text-primary hover:text-primary/80 font-medium disabled:opacity-50"
                          >
                            {isResending === signer.email ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              'Resend'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Audit Trail
              </h2>

              <div className="space-y-1">
                {auditEvents.slice().reverse().map((event, index) => {
                  const Icon = event.icon
                  return (
                    <div key={event.id} className="relative pl-10 pb-6">
                      {index !== auditEvents.length - 1 && (
                        <div className="absolute left-[17px] top-10 bottom-0 w-0.5 bg-border" />
                      )}
                      <div className={`absolute left-0 top-1 w-9 h-9 rounded-full ${event.bg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${event.color}`} />
                      </div>
                      <div className="ml-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">{event.label}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">{event.description}</p>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <p className="text-sm font-medium text-foreground">{formatRelativeTime(event.timestamp)}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(event.timestamp)}</p>
                          </div>
                        </div>
                        {(event.ipAddress || event.device) && (
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            {event.ipAddress && (
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
                                IP: {event.ipAddress}
                              </span>
                            )}
                            {event.device && (
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
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
            {/* Document Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Document Details</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Document Name</p>
                    <p className="font-medium text-foreground text-sm">{signingRequest.document_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="font-medium text-foreground text-sm">{formatDate(signingRequest.created_at)}</p>
                  </div>
                </div>

                {signingRequest.due_date && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="font-medium text-foreground text-sm">{formatDate(signingRequest.due_date)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Sender</p>
                    <p className="font-medium text-foreground text-sm">{signingRequest.sender_name}</p>
                    <p className="text-xs text-muted-foreground">{signingRequest.sender_email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Document ID</p>
                    <p className="font-mono text-xs text-muted-foreground break-all">{signingRequest.id}</p>
                  </div>
                </div>
              </div>

              {signingRequest.status === 'completed' && (
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full mt-6 px-4 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download Signed Document
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Activity
              </h2>

              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm text-foreground leading-snug">
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatRelativeTime(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No activity yet</p>
                </div>
              )}
            </div>

            {/* Message */}
            {signingRequest.message && (
              <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Message to Signers
                </h2>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{signingRequest.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const TrackDocumentPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    }>
      <TrackDocumentPageInner />
    </Suspense>
  )
}

export default TrackDocumentPage
