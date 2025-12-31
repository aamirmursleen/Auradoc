'use client'

import React, { useState, useEffect } from 'react'
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
  Loader2
} from 'lucide-react'
import { getUserDocuments, deleteDocument } from '@/lib/documents'
import { Document, DocumentStatus } from '@/lib/types'

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
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  // Load documents from Supabase
  useEffect(() => {
    const loadDocuments = async () => {
      if (!isLoaded || !user) return

      try {
        setLoading(true)
        const docs = await getUserDocuments(user.id)
        setDocuments(docs)
      } catch (error) {
        console.error('Error loading documents:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()
  }, [user, isLoaded])

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

  // Stats
  const stats = {
    total: documents.length,
    pending: documents.filter(d => ['created', 'delivered', 'opened'].includes(d.status)).length,
    completed: documents.filter(d => d.status === 'completed').length,
    awaitingSignature: documents.filter(d => d.status === 'opened').length
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
              <h1 className="text-2xl font-bold text-white">Documents</h1>
              <p className="text-gray-400 mt-1">Manage and track all your documents</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-[#c4ff0e] hover:bg-[#b3e60d] text-black rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-[#c4ff0e]/25"
            >
              <Plus className="w-5 h-5" />
              New Document
            </button>
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
            <div className="flex-1 min-w-[200px] relative">
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
          <div className="bg-[#1F1F1F] rounded-xl border border-[#2a2a2a] shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#252525] border-b border-[#2a2a2a]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Document</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Recipient</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Last Updated</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {filteredDocuments.map((doc) => {
                  const status = statusConfig[doc.status]
                  const StatusIcon = status.icon

                  return (
                    <tr key={doc.id} className="hover:bg-[#252525] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#252525] rounded-lg">
                            <FileText className="w-5 h-5 text-gray-300" />
                          </div>
                          <div>
                            <Link
                              href={`/track?id=${doc.id}`}
                              className="font-medium text-white hover:text-[#c4ff0e] transition-colors"
                            >
                              {doc.name}
                            </Link>
                            <p className="text-sm text-gray-400 font-mono">{doc.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">{doc.recipient_name || '-'}</p>
                          <p className="text-sm text-gray-400">{doc.recipient_email || '-'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{formatRelativeTime(doc.updated_at)}</p>
                        <p className="text-sm text-gray-400">{formatDate(doc.created_at)}</p>
                      </td>
                      <td className="px-6 py-4">
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
