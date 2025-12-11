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
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  delivered: {
    label: 'Sent',
    icon: Send,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  opened: {
    label: 'Viewed',
    icon: Eye,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  },
  signed: {
    label: 'Signed',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100'
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your documents</p>
          <Link href="/sign-in" className="text-primary-500 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
              <p className="text-gray-500 mt-1">Manage and track all your documents</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-gray-900 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary-500/25"
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
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Awaiting Signature</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.awaitingSignature}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="p-4 flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'all')}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
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
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Document</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Recipient</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Last Updated</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDocuments.map((doc) => {
                  const status = statusConfig[doc.status]
                  const StatusIcon = status.icon

                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <FileText className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <Link
                              href={`/track?id=${doc.id}`}
                              className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                            >
                              {doc.name}
                            </Link>
                            <p className="text-sm text-gray-500 font-mono">{doc.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{doc.recipient_name || '-'}</p>
                          <p className="text-sm text-gray-500">{doc.recipient_email || '-'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{formatRelativeTime(doc.updated_at)}</p>
                        <p className="text-sm text-gray-500">{formatDate(doc.created_at)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/track?id=${doc.id}`}
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Link>

                          <div className="relative">
                            <button
                              onClick={() => setActiveMenu(activeMenu === doc.id ? null : doc.id)}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {activeMenu === doc.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/track?id=${doc.id}`)
                                    setActiveMenu(null)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Link
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Share2 className="w-4 h-4" />
                                  Share
                                </button>
                                <hr className="my-1 border-gray-100" />
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
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : 'Create your first document to start tracking signatures and interactions.'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-gray-900 rounded-xl font-medium transition-colors"
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
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:border-primary-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition-colors">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-primary-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mt-4">Sign Document</h3>
            <p className="text-sm text-gray-500 mt-1">Upload and sign a new document</p>
          </Link>

          <Link
            href="/templates"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:border-primary-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-accent-100 rounded-xl group-hover:bg-accent-200 transition-colors">
                <Sparkles className="w-6 h-6 text-accent-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-primary-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mt-4">Use Template</h3>
            <p className="text-sm text-gray-500 mt-1">Choose from professional templates</p>
          </Link>

          <Link
            href="/track"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:border-primary-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-primary-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mt-4">Track Document</h3>
            <p className="text-sm text-gray-500 mt-1">View audit trail and status</p>
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
