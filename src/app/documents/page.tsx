'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  Bell,
  ChevronDown,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react'
import NotificationBell from '@/components/notifications/NotificationBell'
import { getUserDocuments, deleteDocument, getUserSigningRequests, deleteSigningRequest, SigningRequest } from '@/lib/documents'
import { Document, DocumentStatus } from '@/lib/types'
import { useRealtimeNotifications, SigningRequestUpdate } from '@/hooks/useRealtimeNotifications'
import { useToastContext } from '@/contexts/ToastContext'

// Status configuration
const statusConfig: Record<DocumentStatus, {
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
}> = {
  created: {
    label: 'Draft',
    icon: FileText,
    color: 'text-gray-300',
    bgColor: 'bg-[#2a2a2a]'
  },
  delivered: {
    label: 'Sent',
    icon: Send,
    color: 'text-[#c4ff0e]',
    bgColor: 'bg-[#c4ff0e]/20'
  },
  opened: {
    label: 'Viewed',
    icon: Eye,
    color: 'text-[#c4ff0e]',
    bgColor: 'bg-[#c4ff0e]/20'
  },
  signed: {
    label: 'Signed',
    icon: CheckCircle2,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-[#c4ff0e]',
    bgColor: 'bg-[#c4ff0e]/20'
  }
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

// Format relative time
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
  const { user, isLoaded } = useUser()
  const { addToast } = useToastContext()
  const [documents, setDocuments] = useState<Document[]>([])
  const [signingRequests, setSigningRequests] = useState<SigningRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load documents and signing requests from Supabase
  const loadDocuments = useCallback(async (showLoader = true) => {
    if (!isLoaded || !user) return

    try {
      if (showLoader) setLoading(true)
      const [docs, requests] = await Promise.all([
        getUserDocuments(user.id),
        getUserSigningRequests(user.id)
      ])
      setDocuments(docs)
      setSigningRequests(requests)
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      if (showLoader) setLoading(false)
    }
  }, [isLoaded, user])

  // Handle signing request realtime updates
  const handleSigningRequestUpdate = useCallback((updatedRequest: SigningRequestUpdate) => {
    setSigningRequests(prev => prev.map(req => {
      if (req.id === updatedRequest.id) {
        // Check if there's a new signer who just signed
        const oldSignedCount = req.signers.filter(s => s.status === 'signed').length
        const newSignedCount = updatedRequest.signers.filter(s => s.status === 'signed').length

        if (newSignedCount > oldSignedCount) {
          // Find the newly signed signer
          const newlySigned = updatedRequest.signers.find(
            (s, i) => s.status === 'signed' && req.signers[i]?.status !== 'signed'
          )

          if (newlySigned) {
            // Show toast for the new signature
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

  // Handle connection status changes
  const handleConnectionChange = useCallback((connected: boolean) => {
    if (connected) {
      // Resync data when reconnecting
      loadDocuments(false)
    }
  }, [loadDocuments])

  // Setup realtime subscription for signing requests
  const { isConnected } = useRealtimeNotifications({
    userId: user?.id,
    onSigningRequestUpdate: handleSigningRequestUpdate,
    onConnectionChange: handleConnectionChange
  })

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  // Auto-refresh every 15 seconds as backup (reduced from 5s since we have realtime)
  useEffect(() => {
    if (!user) return
    const interval = setInterval(() => {
      loadDocuments(false) // Don't show loader on auto-refresh
    }, 15000)
    return () => clearInterval(interval)
  }, [user, loadDocuments])

  // Manual refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await loadDocuments(false)
    setIsRefreshing(false)
  }

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.recipient_email?.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Delete document
  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id)
      setDocuments(prev => prev.filter(doc => doc.id !== id))
      setActiveMenu(null)
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  // Create new document
  const handleCreateNew = () => {
    router.push('/track')
  }

  // Stats - combining both documents and signing requests
  const stats = {
    total: documents.length + signingRequests.length,
    pending: documents.filter(d => ['created', 'delivered', 'opened'].includes(d.status)).length +
             signingRequests.filter(r => ['pending', 'in_progress'].includes(r.status)).length,
    completed: documents.filter(d => d.status === 'completed').length +
               signingRequests.filter(r => r.status === 'completed').length,
    awaitingSignature: documents.filter(d => d.status === 'opened').length +
                       signingRequests.filter(r => r.status === 'in_progress').length
  }

  // Filter signing requests
  const filteredSigningRequests = signingRequests.filter(req => {
    const matchesSearch = req.document_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  // Delete signing request
  const handleDeleteSigningRequest = async (id: string) => {
    try {
      await deleteSigningRequest(id)
      setSigningRequests(prev => prev.filter(req => req.id !== id))
      setActiveMenu(null)
    } catch (error) {
      console.error('Error deleting signing request:', error)
    }
  }

  // Download signed document (with signatures embedded)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadDropdownId, setDownloadDropdownId] = useState<string | null>(null)
  const downloadDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
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

      // Fetch the signed PDF from the download API
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
        // Convert PDF pages to images
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

      addToast({
        type: 'document_completed',
        title: 'Download Started',
        message: `Downloading signed "${req.document_name}" as ${format.toUpperCase()}`,
        duration: 3000
      })
    } catch (error) {
      console.error('Error downloading document:', error)
      addToast({
        type: 'document_declined',
        title: 'Download Failed',
        message: error instanceof Error ? error.message : 'Could not download the document',
        duration: 5000
      })
    } finally {
      setDownloadingId(null)
    }
  }

  // Get signer progress
  const getSignerProgress = (signers: SigningRequest['signers']) => {
    const signed = signers.filter(s => s.status === 'signed').length
    return { signed, total: signers.length }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#c4ff0e] mx-auto mb-4" />
          <p className="text-gray-400">Loading documents...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to view your documents</p>
          <Link href="/sign-in" className="text-[#c4ff0e] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      {/* Header */}
      <header className="bg-[#1F1F1F] border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                Documents
                {/* Live connection indicator */}
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  isConnected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {isConnected ? (
                    <>
                      <Wifi className="w-3 h-3" />
                      Live
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3" />
                      Connecting...
                    </>
                  )}
                </span>
              </h1>
              <p className="text-gray-400 mt-1">Manage and track all your documents in real-time</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Refresh button */}
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <NotificationBell />
              <button
                onClick={handleCreateNew}
                className="px-6 py-3 bg-[#c4ff0e] hover:bg-[#b3e60d] text-black rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-[#c4ff0e]/25"
              >
                <Plus className="w-5 h-5" />
                New Document
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1F1F1F] rounded-xl p-5 border border-[#2a2a2a] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Documents</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-[#252525] rounded-xl">
                <FileText className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-[#1F1F1F] rounded-xl p-5 border border-[#2a2a2a] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-[#c4ff0e] mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-[#252525] rounded-xl">
                <Clock className="w-6 h-6 text-[#c4ff0e]" />
              </div>
            </div>
          </div>

          <div className="bg-[#1F1F1F] rounded-xl p-5 border border-[#2a2a2a] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Awaiting Signature</p>
                <p className="text-2xl font-bold text-[#c4ff0e] mt-1">{stats.awaitingSignature}</p>
              </div>
              <div className="p-3 bg-[#252525] rounded-xl">
                <Eye className="w-6 h-6 text-[#c4ff0e]" />
              </div>
            </div>
          </div>

          <div className="bg-[#1F1F1F] rounded-xl p-5 border border-[#2a2a2a] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-500 mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 bg-[#252525] rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1F1F1F] rounded-xl border border-[#2a2a2a] shadow-sm mb-6">
          <div className="p-4 flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-0 sm:min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#252525] border border-[#3a3a3a] text-white rounded-lg focus:ring-2 focus:ring-[#c4ff0e] focus:border-[#c4ff0e] outline-none placeholder-gray-400"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-300" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'all')}
                className="px-4 py-2.5 bg-[#252525] border border-[#3a3a3a] text-white rounded-lg focus:ring-2 focus:ring-[#c4ff0e] focus:border-[#c4ff0e] outline-none"
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
          <div className="bg-[#1F1F1F] rounded-xl border border-[#2a2a2a] shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full min-w-0">
              <thead className="bg-[#252525] border-b border-[#2a2a2a]">
                <tr>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-sm font-medium text-gray-400">Document</th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Recipient</th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-sm font-medium text-gray-400 hidden lg:table-cell">Last Updated</th>
                  <th className="text-right px-3 md:px-6 py-3 md:py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {filteredDocuments.map((doc) => {
                  const status = statusConfig[doc.status]
                  const StatusIcon = status.icon

                  return (
                    <tr key={doc.id} className="hover:bg-[#252525] transition-colors">
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="p-1.5 md:p-2 bg-[#252525] rounded-lg shrink-0">
                            <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/track?id=${doc.id}`}
                              className="font-medium text-white hover:text-[#c4ff0e] transition-colors text-sm md:text-base truncate block"
                            >
                              {doc.name}
                            </Link>
                            <p className="text-xs md:text-sm text-gray-400 font-mono">{doc.id.slice(0, 8)}...</p>
                            <p className="text-xs text-gray-400 md:hidden mt-0.5">{doc.recipient_name || doc.recipient_email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 hidden md:table-cell">
                        <div>
                          <p className="font-medium text-white">{doc.recipient_name || '-'}</p>
                          <p className="text-sm text-gray-400">{doc.recipient_email || '-'}</p>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <span className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${status.bgColor} ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">{status.label}</span>
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 hidden lg:table-cell">
                        <p className="text-white">{formatRelativeTime(doc.updated_at)}</p>
                        <p className="text-sm text-gray-400">{formatDate(doc.created_at)}</p>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/track?id=${doc.id}`}
                            className="p-2 text-gray-400 hover:text-[#c4ff0e] hover:bg-[#252525] rounded-lg transition-colors"
                            title="View Details"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Link>

                          <div className="relative">
                            <button
                              onClick={() => setActiveMenu(activeMenu === doc.id ? null : doc.id)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {activeMenu === doc.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-[#2a2a2a] rounded-xl shadow-lg border border-[#3a3a3a] py-1 z-10">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/track?id=${doc.id}`)
                                    setActiveMenu(null)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#252525] flex items-center gap-2"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Link
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#252525] flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#252525] flex items-center gap-2"
                                >
                                  <Share2 className="w-4 h-4" />
                                  Share
                                </button>
                                <hr className="my-1 border-[#3a3a3a]" />
                                <button
                                  onClick={() => handleDelete(doc.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-900/20 flex items-center gap-2"
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
          <div className="bg-[#1F1F1F] rounded-xl border border-[#2a2a2a] shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-[#252525] rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : 'Create your first document to start tracking signatures and interactions.'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#c4ff0e] hover:bg-[#b3e60d] text-black rounded-xl font-medium transition-colors"
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
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-[#c4ff0e]" />
              Signing Requests ({filteredSigningRequests.length})
            </h2>
            <div className="space-y-4">
              {filteredSigningRequests.map((req) => {
                const progress = getSignerProgress(req.signers)
                const isExpanded = expandedDoc === req.id

                return (
                  <div
                    key={req.id}
                    className="bg-[#1F1F1F] rounded-xl border border-[#2a2a2a] shadow-sm overflow-hidden"
                  >
                    {/* Main Row */}
                    <div
                      className="p-4 cursor-pointer hover:bg-[#252525] transition-colors"
                      onClick={() => setExpandedDoc(isExpanded ? null : req.id)}
                    >
                      <div className="flex items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                          <div className="p-2 sm:p-3 bg-[#252525] rounded-xl shrink-0">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#c4ff0e]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm sm:text-base truncate">{req.document_name}</h3>
                            <p className="text-xs sm:text-sm text-gray-400 truncate">
                              Sent by {req.sender_name} • {formatRelativeTime(req.created_at)}
                            </p>
                            {/* Signers preview */}
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 flex-wrap">
                              {req.signers.map((signer, idx) => (
                                <span
                                  key={idx}
                                  className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 ${
                                    signer.status === 'signed'
                                      ? 'bg-green-500/20 text-green-400'
                                      : 'bg-gray-600/30 text-gray-400'
                                  }`}
                                >
                                  {signer.status === 'signed' ? (
                                    <CheckCircle2 className="w-3 h-3" />
                                  ) : (
                                    <Clock className="w-3 h-3" />
                                  )}
                                  <span className="truncate max-w-[60px] sm:max-w-none">{signer.name}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                          {/* Progress */}
                          <div className="text-right hidden sm:block">
                            <div className="flex items-center gap-2">
                              <div className="w-16 sm:w-24 h-2 bg-[#252525] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#c4ff0e] rounded-full transition-all"
                                  style={{ width: `${(progress.signed / progress.total) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-white">
                                {progress.signed}/{progress.total}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {progress.signed === progress.total ? 'Complete' : 'Signatures'}
                            </p>
                          </div>

                          {/* Status Badge */}
                          <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
                            req.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : req.status === 'declined'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-[#c4ff0e]/20 text-[#c4ff0e]'
                          }`}>
                            {req.status === 'completed' ? 'Completed' :
                             req.status === 'in_progress' ? 'In Progress' :
                             req.status === 'declined' ? 'Declined' :
                             req.status === 'expired' ? 'Expired' : 'Pending'}
                          </span>

                          {/* Expand Arrow */}
                          <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-[#2a2a2a] p-4 bg-[#1a1a1a]">
                        {/* Signer Progress Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Signers ({progress.signed}/{progress.total} signed)
                          </h4>
                          {progress.signed === progress.total && (
                            <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              All Signed
                            </span>
                          )}
                        </div>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="h-2 bg-[#252525] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#c4ff0e] to-green-500 rounded-full transition-all duration-500"
                              style={{ width: `${(progress.signed / progress.total) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Signer cards */}
                        <div className="space-y-3">
                          {req.signers.map((signer, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                                signer.status === 'signed'
                                  ? 'bg-green-500/5 border-green-500/30'
                                  : 'bg-[#252525] border-[#2a2a2a]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${
                                  signer.status === 'signed'
                                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                                    : 'bg-gradient-to-br from-gray-600 to-gray-700'
                                }`}>
                                  {signer.status === 'signed' ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                  ) : (
                                    idx + 1
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-white flex items-center gap-2">
                                    {signer.name}
                                    {signer.is_self && (
                                      <span className="text-xs px-1.5 py-0.5 bg-[#c4ff0e]/20 text-[#c4ff0e] rounded">You</span>
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-400">{signer.email}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                {signer.status === 'signed' ? (
                                  <div>
                                    <div className="flex items-center gap-2 text-green-400">
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span className="text-sm font-medium">Signed</span>
                                    </div>
                                    {signer.signedAt && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {formatDate(signer.signedAt)} at {new Date(signer.signedAt).toLocaleTimeString()}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <div>
                                    <div className="flex items-center gap-2 text-yellow-400">
                                      <Clock className="w-4 h-4 animate-pulse" />
                                      <span className="text-sm font-medium">Awaiting</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Waiting for signature
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#2a2a2a]">
                          {req.status === 'completed' && (
                            <div className="relative" ref={downloadDropdownId === req.id ? downloadDropdownRef : undefined}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDownloadDropdownId(downloadDropdownId === req.id ? null : req.id)
                                }}
                                disabled={downloadingId === req.id}
                                className="px-4 py-2 bg-[#c4ff0e] text-black rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-[#b3e60d] transition-colors disabled:opacity-50"
                              >
                                {downloadingId === req.id ? (
                                  <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
                                ) : (
                                  <><Download className="w-4 h-4" />Download<ChevronDown className="w-3 h-3" /></>
                                )}
                              </button>
                              {downloadDropdownId === req.id && (
                                <div className="absolute bottom-full left-0 mb-1 w-44 bg-[#252525] border border-[#3a3a3a] rounded-xl shadow-xl py-1 z-50">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDownloadSignedDocument(req, 'pdf') }}
                                    className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-[#2a2a2a] text-gray-300 transition-colors"
                                  >
                                    <span className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-red-400">PDF</span>
                                    Download PDF
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDownloadSignedDocument(req, 'png') }}
                                    className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-[#2a2a2a] text-gray-300 transition-colors"
                                  >
                                    <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-blue-400">PNG</span>
                                    Download PNG
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDownloadSignedDocument(req, 'jpg') }}
                                    className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-[#2a2a2a] text-gray-300 transition-colors"
                                  >
                                    <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-green-400">JPG</span>
                                    Download JPG
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              // Copy short URL for the first pending signer, or first signer
                              const pendingSigner = req.signers.find(s => s.status === 'pending') || req.signers[0]
                              const signerToken = (pendingSigner as any)?.token
                              const link = signerToken
                                ? `${window.location.origin}/s/${signerToken}`
                                : `${window.location.origin}/sign/${req.id}?email=${encodeURIComponent(pendingSigner?.email || '')}`
                              navigator.clipboard.writeText(link)
                              addToast({
                                type: 'document_completed',
                                title: 'Link Copied',
                                message: 'Signing link copied to clipboard',
                                duration: 2000
                              })
                            }}
                            className="px-4 py-2 bg-[#252525] text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-[#2a2a2a] transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Signing Link
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSigningRequest(req.id)
                            }}
                            className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
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
            href="/sign"
            className="bg-[#1F1F1F] rounded-xl border border-[#2a2a2a] shadow-sm p-6 hover:border-[#c4ff0e] hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-[#252525] rounded-xl group-hover:bg-[#2a2a2a] transition-colors">
                <FileText className="w-6 h-6 text-[#c4ff0e]" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#c4ff0e] transition-colors" />
            </div>
            <h3 className="font-semibold text-white mt-4">Sign Document</h3>
            <p className="text-sm text-gray-400 mt-1">Upload and sign a new document</p>
          </Link>

          <Link
            href="/templates"
            className="bg-[#1F1F1F] rounded-xl border border-[#2a2a2a] shadow-sm p-6 hover:border-[#c4ff0e] hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-[#252525] rounded-xl group-hover:bg-[#2a2a2a] transition-colors">
                <Sparkles className="w-6 h-6 text-[#c4ff0e]" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#c4ff0e] transition-colors" />
            </div>
            <h3 className="font-semibold text-white mt-4">Use Template</h3>
            <p className="text-sm text-gray-400 mt-1">Choose from professional templates</p>
          </Link>

          <Link
            href="/track"
            className="bg-[#1F1F1F] rounded-xl border border-[#2a2a2a] shadow-sm p-6 hover:border-[#c4ff0e] hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-[#252525] rounded-xl group-hover:bg-[#2a2a2a] transition-colors">
                <Eye className="w-6 h-6 text-green-500" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#c4ff0e] transition-colors" />
            </div>
            <h3 className="font-semibold text-white mt-4">Track Document</h3>
            <p className="text-sm text-gray-400 mt-1">View audit trail and status</p>
          </Link>
        </div>
      </div>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  )
}

export default DocumentsPage
