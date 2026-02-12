'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import {
  FileText,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  ExternalLink,
  Download,
  Share2,
  Copy,
  Inbox,
  Sparkles,
  ArrowRight,
  Loader2,
  ChevronDown,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  Users,
  Ban,
  RotateCw,
  XCircle
} from 'lucide-react'
import { getUserDocuments, deleteDocument, getUserSigningRequests, deleteSigningRequest, getInboxSigningRequests, SigningRequest } from '@/lib/documents'
import { Document, DocumentStatus } from '@/lib/types'
import { useRealtimeNotifications, SigningRequestUpdate } from '@/hooks/useRealtimeNotifications'
import { useToastContext } from '@/contexts/ToastContext'

type DashboardTab = 'all' | 'action_required' | 'waiting' | 'completed' | 'sent' | 'inbox'

const tabConfig: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: FileText },
  { id: 'action_required', label: 'Action Required', icon: AlertCircle },
  { id: 'waiting', label: 'Waiting for Others', icon: Clock },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
]

// Status configuration — light teal theme
const statusConfig: Record<DocumentStatus, {
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
}> = {
  created: {
    label: 'Draft',
    icon: FileText,
    color: 'text-slate-500',
    bgColor: 'bg-slate-100'
  },
  delivered: {
    label: 'Sent',
    icon: Send,
    color: 'text-primary',
    bgColor: 'bg-secondary'
  },
  opened: {
    label: 'Viewed',
    icon: Eye,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  signed: {
    label: 'Signed',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(dateString)
}

const DocumentsPage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()
  const { addToast } = useToastContext()
  const [documents, setDocuments] = useState<Document[]>([])
  const [signingRequests, setSigningRequests] = useState<SigningRequest[]>([])
  const [inboxRequests, setInboxRequests] = useState<SigningRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Tab state from URL param
  const activeTab = (searchParams.get('tab') as DashboardTab) || 'all'
  const setActiveTab = (tab: DashboardTab) => {
    const params = new URLSearchParams(searchParams.toString())
    if (tab === 'all') {
      params.delete('tab')
    } else {
      params.set('tab', tab)
    }
    router.push(`/documents${params.toString() ? '?' + params.toString() : ''}`)
  }

  const userEmail = user?.emailAddresses?.[0]?.emailAddress || ''

  const loadDocuments = useCallback(async (showLoader = true) => {
    if (!isLoaded || !user) return
    try {
      if (showLoader) setLoading(true)
      const email = user.emailAddresses?.[0]?.emailAddress || ''
      const [docs, requests, inbox] = await Promise.all([
        getUserDocuments(user.id),
        getUserSigningRequests(user.id),
        email ? getInboxSigningRequests(email) : Promise.resolve([])
      ])
      setDocuments(docs)
      setSigningRequests(requests)
      // Filter out inbox requests that the user also owns (avoid duplicates)
      const ownedIds = new Set(requests.map(r => r.id))
      setInboxRequests(inbox.filter(r => !ownedIds.has(r.id)))
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      if (showLoader) setLoading(false)
    }
  }, [isLoaded, user])

  const handleSigningRequestUpdate = useCallback((updatedRequest: SigningRequestUpdate) => {
    setSigningRequests(prev => prev.map(req => {
      if (req.id === updatedRequest.id) {
        const oldSignedCount = req.signers.filter(s => s.status === 'signed').length
        const newSignedCount = updatedRequest.signers.filter(s => s.status === 'signed').length

        if (newSignedCount > oldSignedCount) {
          const newlySigned = updatedRequest.signers.find(
            (s, i) => s.status === 'signed' && req.signers[i]?.status !== 'signed'
          )
          if (newlySigned) {
            addToast({
              type: updatedRequest.status === 'completed' ? 'document_completed' : 'document_signed',
              title: updatedRequest.status === 'completed' ? 'Document Complete!' : 'New Signature!',
              message: updatedRequest.status === 'completed'
                ? `All signers have signed "${updatedRequest.document_name}"`
                : `${newlySigned.name} signed "${updatedRequest.document_name}"`,
              documentName: updatedRequest.document_name,
              signerName: newlySigned.name,
              duration: 8000
            })
          }
        }

        return {
          ...req,
          status: updatedRequest.status as SigningRequest['status'],
          signers: updatedRequest.signers as SigningRequest['signers'],
          updated_at: updatedRequest.updated_at
        }
      }
      return req
    }))
  }, [addToast])

  const handleConnectionChange = useCallback((connected: boolean) => {
    if (connected) loadDocuments(false)
  }, [loadDocuments])

  const { isConnected } = useRealtimeNotifications({
    userId: user?.id,
    onSigningRequestUpdate: handleSigningRequestUpdate,
    onConnectionChange: handleConnectionChange
  })

  useEffect(() => { loadDocuments() }, [loadDocuments])

  useEffect(() => {
    if (!user) return
    const interval = setInterval(() => loadDocuments(false), 15000)
    return () => clearInterval(interval)
  }, [user, loadDocuments])

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await loadDocuments(false)
    setIsRefreshing(false)
  }

  const filteredDocuments = documents.filter(doc => {
    // Tab filter
    switch (activeTab) {
      case 'waiting':
        if (!['delivered', 'opened'].includes(doc.status)) return false
        break
      case 'completed':
        if (doc.status !== 'completed') return false
        break
      case 'sent':
        if (!['delivered', 'opened', 'signed', 'completed'].includes(doc.status)) return false
        break
      case 'action_required':
      case 'inbox':
        return false // Documents table doesn't have inbox concept
      // 'all' shows everything
    }
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.recipient_email?.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id)
      setDocuments(prev => prev.filter(doc => doc.id !== id))
      setActiveMenu(null)
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const handleCreateNew = () => router.push('/track')

  // Compute tab counts
  const actionRequiredCount = inboxRequests.filter(r =>
    r.signers.some(s => s.email === userEmail && s.status === 'pending')
  ).length
  const waitingCount = signingRequests.filter(r => ['pending', 'in_progress'].includes(r.status)).length
  const completedCount = documents.filter(d => d.status === 'completed').length +
    signingRequests.filter(r => r.status === 'completed').length
  const sentCount = signingRequests.length
  const inboxCount = inboxRequests.length

  const tabCounts: Record<DashboardTab, number> = {
    all: documents.length + signingRequests.length + inboxRequests.length,
    action_required: actionRequiredCount,
    waiting: waitingCount,
    completed: completedCount,
    sent: sentCount,
    inbox: inboxCount,
  }

  const stats = {
    total: documents.length + signingRequests.length,
    pending: documents.filter(d => ['created', 'delivered', 'opened'].includes(d.status)).length +
             signingRequests.filter(r => ['pending', 'in_progress'].includes(r.status)).length,
    completed: completedCount,
    awaitingSignature: documents.filter(d => d.status === 'opened').length +
                       signingRequests.filter(r => r.status === 'in_progress').length
  }

  // Tab-filtered signing requests from owned requests
  const tabFilteredSigningRequests = signingRequests.filter(req => {
    switch (activeTab) {
      case 'waiting':
        return ['pending', 'in_progress'].includes(req.status)
      case 'completed':
        return req.status === 'completed'
      case 'sent':
        return true // All owned signing requests are "sent"
      case 'action_required':
        return false // Action required comes from inbox, not owned
      case 'inbox':
        return false // Inbox comes from inboxRequests
      default:
        return true // 'all'
    }
  })

  // Tab-filtered inbox requests
  const tabFilteredInboxRequests = inboxRequests.filter(req => {
    switch (activeTab) {
      case 'action_required':
        return req.signers.some(s => s.email === userEmail && s.status === 'pending')
      case 'inbox':
        return true
      case 'completed':
        return req.status === 'completed'
      default:
        return activeTab === 'all'
    }
  })

  // Combine and apply search + status filter
  const allVisibleSigningRequests = [...tabFilteredSigningRequests, ...tabFilteredInboxRequests]

  const filteredSigningRequests = allVisibleSigningRequests.filter(req => {
    const matchesSearch = !searchQuery || req.document_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.signers.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()))
    const statusMap: Record<string, DocumentStatus[]> = {
      'pending': ['created'],
      'in_progress': ['delivered', 'opened'],
      'completed': ['completed', 'signed'],
      'declined': ['created'],
      'expired': ['created']
    }
    const matchesStatus = statusFilter === 'all' ||
      (statusMap[req.status] && statusMap[req.status].includes(statusFilter as DocumentStatus))
    return matchesSearch && (statusFilter === 'all' || matchesStatus)
  })

  const [voidingId, setVoidingId] = useState<string | null>(null)
  const [resendingId, setResendingId] = useState<string | null>(null)
  const [voidConfirmId, setVoidConfirmId] = useState<string | null>(null)

  const handleVoidSigningRequest = async (id: string, reason?: string) => {
    try {
      setVoidingId(id)
      const res = await fetch(`/api/signing-requests/${id}/void`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      const data = await res.json()
      if (data.success) {
        setSigningRequests(prev => prev.map(req =>
          req.id === id ? { ...req, status: 'voided' as any } : req
        ))
        addToast({ type: 'document_completed', title: 'Document Voided', message: data.message, duration: 4000 })
        setVoidConfirmId(null)
      } else {
        addToast({ type: 'document_declined', title: 'Error', message: data.message, duration: 4000 })
      }
    } catch (error) {
      addToast({ type: 'document_declined', title: 'Error', message: 'Failed to void document', duration: 4000 })
    } finally {
      setVoidingId(null)
    }
  }

  const handleResendSigningRequest = async (id: string, signerEmail?: string) => {
    try {
      setResendingId(id)
      const res = await fetch(`/api/signing-requests/${id}/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerEmail })
      })
      const data = await res.json()
      if (data.success) {
        addToast({ type: 'document_completed', title: 'Invite Resent', message: data.message, duration: 4000 })
      } else {
        addToast({ type: 'document_declined', title: 'Error', message: data.message, duration: 4000 })
      }
    } catch (error) {
      addToast({ type: 'document_declined', title: 'Error', message: 'Failed to resend invite', duration: 4000 })
    } finally {
      setResendingId(null)
    }
  }

  const handleDeleteSigningRequest = async (id: string) => {
    try {
      await deleteSigningRequest(id)
      setSigningRequests(prev => prev.filter(req => req.id !== id))
      setActiveMenu(null)
    } catch (error) {
      console.error('Error deleting signing request:', error)
    }
  }

  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadDropdownId, setDownloadDropdownId] = useState<string | null>(null)
  const downloadDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(e.target as Node)) {
        setDownloadDropdownId(null)
      }
    }
    window.document.addEventListener('mousedown', handleClickOutside)
    return () => window.document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDownloadSignedDocument = async (req: SigningRequest, format: 'pdf' | 'png' | 'jpg' = 'pdf') => {
    try {
      setDownloadingId(req.id)
      setDownloadDropdownId(null)
      const response = await fetch(`/api/signing-requests/${req.id}/download`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Download failed' }))
        throw new Error(errorData.message || 'Failed to download')
      }
      const pdfBlob = await response.blob()
      const baseName = req.document_name.replace(/\.[^/.]+$/, '') + '_signed'

      if (format === 'pdf') {
        const url = URL.createObjectURL(pdfBlob)
        const link = window.document.createElement('a')
        link.href = url
        link.download = `${baseName}.pdf`
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        const pdfjsLib = await import('pdfjs-dist')
        if (typeof window !== 'undefined') {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
        }
        const arrayBuffer = await pdfBlob.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        const scale = 2
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale })
          const canvas = window.document.createElement('canvas')
          const context = canvas.getContext('2d')!
          canvas.width = viewport.width
          canvas.height = viewport.height
          context.fillStyle = '#ffffff'
          context.fillRect(0, 0, canvas.width, canvas.height)
          await page.render({ canvasContext: context, viewport }).promise
          const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
          const quality = format === 'jpg' ? 0.95 : undefined
          const dataUrl = canvas.toDataURL(mimeType, quality)
          const link = window.document.createElement('a')
          link.href = dataUrl
          const suffix = pdf.numPages > 1 ? `_page${i}` : ''
          link.download = `${baseName}${suffix}.${format}`
          link.click()
        }
      }
      addToast({ type: 'document_completed', title: 'Download Started', message: `Downloading signed "${req.document_name}" as ${format.toUpperCase()}`, duration: 3000 })
    } catch (error) {
      console.error('Error downloading document:', error)
      addToast({ type: 'document_declined', title: 'Download Failed', message: error instanceof Error ? error.message : 'Could not download the document', duration: 5000 })
    } finally {
      setDownloadingId(null)
    }
  }

  const getSignerProgress = (signers: SigningRequest['signers']) => {
    const signed = signers.filter(s => s.status === 'signed').length
    return { signed, total: signers.length }
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view your documents</p>
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              Dashboard
              <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                isConnected ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}>
                {isConnected ? (
                  <><Wifi className="w-3 h-3" />Live</>
                ) : (
                  <><WifiOff className="w-3 h-3" />Connecting...</>
                )}
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">Manage and track all your documents</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2.5 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 text-muted-foreground hover:text-foreground"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleCreateNew}
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Document
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Documents</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-secondary rounded-xl">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Awaiting Signature</p>
              <p className="text-2xl font-bold text-primary mt-1">{stats.awaitingSignature}</p>
            </div>
            <div className="p-3 bg-secondary rounded-xl">
              <Eye className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex border-b border-border min-w-max">
          {tabConfig.map((tab) => {
            const TabIcon = tab.icon
            const count = tabCounts[tab.id]
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
                {count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border shadow-sm mb-6">
        <div className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-0 sm:min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-muted-foreground text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'all')}
              className="px-4 py-2.5 bg-muted border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
            >
              <option value="all">All Status</option>
              <option value="created">Draft</option>
              <option value="delivered">Sent</option>
              <option value="opened">Viewed</option>
              <option value="signed">Signed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      {filteredDocuments.length > 0 ? (
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full min-w-0">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Document</th>
                <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Recipient</th>
                <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Last Updated</th>
                <th className="text-right px-3 md:px-6 py-3 md:py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDocuments.map((doc) => {
                const status = statusConfig[doc.status]
                const StatusIcon = status.icon

                return (
                  <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2 bg-secondary rounded-lg shrink-0">
                          <FileText className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/track?id=${doc.id}`}
                            className="font-medium text-foreground hover:text-primary transition-colors text-sm md:text-base truncate block"
                          >
                            {doc.name}
                          </Link>
                          <p className="text-xs text-muted-foreground font-mono">{doc.id.slice(0, 8)}...</p>
                          <p className="text-xs text-muted-foreground md:hidden mt-0.5">{doc.recipient_name || doc.recipient_email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 hidden md:table-cell">
                      <div>
                        <p className="font-medium text-foreground">{doc.recipient_name || '-'}</p>
                        <p className="text-sm text-muted-foreground">{doc.recipient_email || '-'}</p>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${status.bgColor} ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">{status.label}</span>
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 hidden lg:table-cell">
                      <p className="text-foreground text-sm">{formatRelativeTime(doc.updated_at)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(doc.created_at)}</p>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/track?id=${doc.id}`}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                          title="View Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === doc.id ? null : doc.id)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenu === doc.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-border py-1 z-10">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/track?id=${doc.id}`)
                                  setActiveMenu(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2"
                              >
                                <Copy className="w-4 h-4" />
                                Copy Link
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2">
                                <Share2 className="w-4 h-4" />
                                Share
                              </button>
                              <hr className="my-1 border-border" />
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'inbox' ? <Inbox className="w-8 h-8 text-primary" /> :
             activeTab === 'action_required' ? <AlertCircle className="w-8 h-8 text-primary" /> :
             <FileText className="w-8 h-8 text-primary" />}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery || statusFilter !== 'all'
              ? 'No documents found'
              : activeTab === 'inbox' ? 'No documents in your inbox'
              : activeTab === 'action_required' ? 'Nothing requires your action'
              : activeTab === 'waiting' ? 'No documents waiting for others'
              : activeTab === 'completed' ? 'No completed documents'
              : activeTab === 'sent' ? 'No sent documents'
              : 'No documents yet'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : activeTab === 'action_required' ? 'Documents that need your signature will appear here.'
              : activeTab === 'inbox' ? 'Documents sent to you for signing will appear here.'
              : activeTab === 'waiting' ? 'Documents you\'ve sent that are awaiting signatures will appear here.'
              : 'Create your first document to start tracking signatures and interactions.'}
          </p>
          {!searchQuery && statusFilter === 'all' && activeTab === 'all' && (
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Document
            </button>
          )}
        </div>
      )}

      {/* Signing Requests Section */}
      {filteredSigningRequests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Signing Requests ({filteredSigningRequests.length})
          </h2>
          <div className="space-y-4">
            {filteredSigningRequests.map((req) => {
              const progress = getSignerProgress(req.signers)
              const isExpanded = expandedDoc === req.id

              return (
                <div key={req.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedDoc(isExpanded ? null : req.id)}
                  >
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <div className="p-2 sm:p-3 bg-secondary rounded-xl shrink-0">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{req.document_name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            Sent by {req.sender_name} &middot; {formatRelativeTime(req.created_at)}
                            {req.due_date && (
                              <span className={`ml-2 ${new Date(req.due_date) < new Date() ? 'text-red-500' : new Date(req.due_date).getTime() - Date.now() < 3 * 86400000 ? 'text-amber-600' : ''}`}>
                                &middot; Due {formatDate(req.due_date)}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 flex-wrap">
                            {req.signers.map((signer, idx) => (
                              <span
                                key={idx}
                                className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 ${
                                  signer.status === 'signed'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {signer.status === 'signed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                <span className="truncate max-w-[60px] sm:max-w-none">{signer.name}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center gap-2">
                            <div className="w-16 sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${(progress.signed / progress.total) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-foreground">
                              {progress.signed}/{progress.total}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {progress.signed === progress.total ? 'Complete' : 'Signatures'}
                          </p>
                        </div>

                        <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
                          req.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-600'
                            : req.status === 'declined'
                            ? 'bg-red-50 text-red-600'
                            : req.status === 'voided'
                            ? 'bg-gray-100 text-gray-500'
                            : req.status === 'expired'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-secondary text-primary'
                        }`}>
                          {req.status === 'completed' ? 'Completed' :
                           req.status === 'in_progress' ? 'In Progress' :
                           req.status === 'declined' ? 'Declined' :
                           req.status === 'voided' ? 'Voided' :
                           req.status === 'expired' ? 'Expired' : 'Pending'}
                        </span>

                        <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border p-4 bg-muted/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Signers ({progress.signed}/{progress.total} signed)
                        </h4>
                        {progress.signed === progress.total && (
                          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            All Signed
                          </span>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${(progress.signed / progress.total) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        {req.signers.map((signer, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                              signer.status === 'signed'
                                ? 'bg-emerald-50/50 border-emerald-200'
                                : 'bg-white border-border'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-foreground text-sm font-bold shadow-sm ${
                                signer.status === 'signed'
                                  ? 'bg-emerald-100'
                                  : 'bg-slate-200'
                              }`}>
                                {signer.status === 'signed' ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                              </div>
                              <div>
                                <p className="font-medium text-foreground flex items-center gap-2">
                                  {signer.name}
                                  {signer.is_self && (
                                    <span className="text-xs px-1.5 py-0.5 bg-secondary text-primary rounded font-medium">You</span>
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground">{signer.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {signer.status === 'signed' ? (
                                <div>
                                  <div className="flex items-center gap-2 text-emerald-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Signed</span>
                                  </div>
                                  {signer.signedAt && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {formatDate(signer.signedAt)} at {new Date(signer.signedAt).toLocaleTimeString()}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center gap-2 text-amber-600">
                                    <Clock className="w-4 h-4 animate-pulse" />
                                    <span className="text-sm font-medium">Awaiting</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">Waiting for signature</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                        {req.status === 'completed' && (
                          <div className="relative" ref={downloadDropdownId === req.id ? downloadDropdownRef : undefined}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setDownloadDropdownId(downloadDropdownId === req.id ? null : req.id)
                              }}
                              disabled={downloadingId === req.id}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                              {downloadingId === req.id ? (
                                <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
                              ) : (
                                <><Download className="w-4 h-4" />Download<ChevronDown className="w-3 h-3" /></>
                              )}
                            </button>
                            {downloadDropdownId === req.id && (
                              <div className="absolute bottom-full left-0 mb-1 w-44 bg-white border border-border rounded-xl shadow-xl py-1 z-50">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDownloadSignedDocument(req, 'pdf') }}
                                  className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-muted text-foreground transition-colors"
                                >
                                  <span className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-xs font-bold text-red-500">PDF</span>
                                  Download PDF
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDownloadSignedDocument(req, 'png') }}
                                  className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-muted text-foreground transition-colors"
                                >
                                  <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-xs font-bold text-blue-500">PNG</span>
                                  Download PNG
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDownloadSignedDocument(req, 'jpg') }}
                                  className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-muted text-foreground transition-colors"
                                >
                                  <span className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-xs font-bold text-emerald-500">JPG</span>
                                  Download JPG
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const pendingSigner = req.signers.find(s => s.status === 'pending') || req.signers[0]
                            const signerToken = (pendingSigner as any)?.token
                            const link = signerToken
                              ? `${window.location.origin}/s/${signerToken}`
                              : `${window.location.origin}/sign/${req.id}?email=${encodeURIComponent(pendingSigner?.email || '')}`
                            navigator.clipboard.writeText(link)
                            addToast({ type: 'document_completed', title: 'Link Copied', message: 'Signing link copied to clipboard', duration: 2000 })
                          }}
                          className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-muted/80 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          Copy Signing Link
                        </button>
                        <Link
                          href={`/track?id=${req.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-muted/80 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Track
                        </Link>
                        {req.status !== 'completed' && req.status !== 'voided' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleResendSigningRequest(req.id)
                            }}
                            disabled={resendingId === req.id}
                            className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-muted/80 transition-colors disabled:opacity-50"
                          >
                            {resendingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
                            Resend
                          </button>
                        )}
                        {req.status !== 'completed' && req.status !== 'voided' && (
                          voidConfirmId === req.id ? (
                            <div className="flex items-center gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                              <span className="text-xs text-muted-foreground">Void this document?</span>
                              <button
                                onClick={() => handleVoidSigningRequest(req.id)}
                                disabled={voidingId === req.id}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                {voidingId === req.id ? 'Voiding...' : 'Yes, Void'}
                              </button>
                              <button
                                onClick={() => setVoidConfirmId(null)}
                                className="px-3 py-1.5 bg-muted text-foreground rounded-lg text-xs font-medium hover:bg-muted/80 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setVoidConfirmId(req.id)
                              }}
                              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ml-auto"
                            >
                              <Ban className="w-4 h-4" />
                              Void
                            </button>
                          )
                        )}
                        {(req.status === 'completed' || req.status === 'voided') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSigningRequest(req.id)
                            }}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/sign-document"
          className="bg-white rounded-xl border border-border shadow-sm p-6 hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-semibold text-foreground mt-4">Sign Document</h3>
          <p className="text-sm text-muted-foreground mt-1">Upload and sign a new document</p>
        </Link>

        <Link
          href="/templates"
          className="bg-white rounded-xl border border-border shadow-sm p-6 hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-semibold text-foreground mt-4">Use Template</h3>
          <p className="text-sm text-muted-foreground mt-1">Choose from professional templates</p>
        </Link>

        <Link
          href="/track"
          className="bg-white rounded-xl border border-border shadow-sm p-6 hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <Eye className="w-6 h-6 text-emerald-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-semibold text-foreground mt-4">Track Document</h3>
          <p className="text-sm text-muted-foreground mt-1">View audit trail and status</p>
        </Link>
      </div>

      {activeMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setActiveMenu(null)} />
      )}
    </div>
  )
}

import { Suspense } from 'react'

function DocumentsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    }>
      <DocumentsPage />
    </Suspense>
  )
}

export default DocumentsPageWrapper
