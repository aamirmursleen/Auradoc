'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Shield,
  ShieldCheck,
  ShieldX,
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Hash,
  HardDrive,
  FileType,
  BookOpen,
  Clock,
  Trash2,
  Eye,
  Copy,
  Check,
  Loader2,
  ArrowRight,
  Info,
  AlertCircle,
  X,
  FileUp,
  Zap
} from 'lucide-react'
import {
  DocumentVerification
} from '@/lib/verification'

interface VerificationReport {
  status: 'VERIFIED' | 'TAMPERED'
  summary: string
  differences: Array<{ severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'; description: string }>
  recommendation: string
}
import { formatFileSize, ComparisonResult, generateDocumentHash, HashResult, DifferenceDetail } from '@/lib/hash'

const VerifyPage: React.FC = () => {
  // States
  const [verifications, setVerifications] = useState<DocumentVerification[]>([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // Upload states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploadedHash, setUploadedHash] = useState<HashResult | null>(null)

  // Verification states
  const [selectedVerification, setSelectedVerification] = useState<DocumentVerification | null>(null)
  const [verificationResult, setVerificationResult] = useState<{
    report: VerificationReport
    comparison: ComparisonResult
  } | null>(null)

  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)

  // No automatic loading - verifications will be empty for demo
  // Users can still upload and verify documents locally

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    setVerificationResult(null)
    setSelectedVerification(null)

    // Generate hash
    setProcessing(true)
    try {
      const hash = await generateDocumentHash(file)
      setUploadedHash(hash)

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => setFilePreview(e.target?.result as string)
        reader.readAsDataURL(file)
      } else {
        setFilePreview(null)
      }
    } catch (error) {
      console.error('Error processing file:', error)
    } finally {
      setProcessing(false)
    }
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  // Register as original document
  const handleRegisterDocument = async () => {
    if (!uploadedFile || !uploadedHash) return

    try {
      setProcessing(true)
      // Create a local verification record
      const newVerification: DocumentVerification = {
        id: crypto.randomUUID(),
        user_id: 'local-user',
        document_name: uploadedFile.name,
        original_hash: uploadedHash.hash,
        file_size: uploadedFile.size,
        file_type: uploadedFile.type,
        page_count: uploadedHash.metadata.pageCount || null,
        metadata: uploadedHash.metadata,
        created_at: new Date().toISOString()
      }
      setVerifications(prev => [newVerification, ...prev])
      setShowRegisterModal(false)

      // Clear upload
      setUploadedFile(null)
      setUploadedHash(null)
      setFilePreview(null)
    } catch (error) {
      console.error('Error registering document:', error)
    } finally {
      setProcessing(false)
    }
  }

  // Verify against selected original
  const handleVerify = async (verificationToUse?: DocumentVerification) => {
    const targetVerification = verificationToUse || selectedVerification || verifications[0]
    if (!targetVerification || !uploadedFile || !uploadedHash) return

    try {
      setProcessing(true)
      setSelectedVerification(targetVerification)

      // Local verification - compare hashes directly
      const isMatch = uploadedHash.hash === targetVerification.original_hash

      const comparison: ComparisonResult = {
        isTampered: !isMatch,
        confidenceLevel: 'HIGH',
        hashMatch: isMatch,
        sizeMatch: uploadedFile.size === targetVerification.file_size,
        typeMatch: uploadedFile.type === targetVerification.file_type,
        pageCountMatch: uploadedHash.metadata.pageCount === targetVerification.page_count,
        differences: isMatch ? [] : [{
          type: 'HASH' as const,
          description: 'Document hash does not match the original',
          originalValue: targetVerification.original_hash.substring(0, 16) + '...',
          newValue: uploadedHash.hash.substring(0, 16) + '...',
          severity: 'CRITICAL' as const
        }],
        summary: isMatch
          ? 'Document integrity verified. No modifications detected.'
          : 'Document has been TAMPERED. The hash does not match the original.'
      }

      const report: VerificationReport = {
        status: isMatch ? 'VERIFIED' : 'TAMPERED',
        summary: isMatch
          ? 'Document is authentic and matches the original.'
          : 'Document has been modified or is different from the original.',
        differences: isMatch ? [] : [{
          severity: 'CRITICAL' as const,
          description: 'The document hash does not match the registered original. This document may have been tampered with.'
        }],
        recommendation: isMatch
          ? 'This document is safe to use.'
          : 'Do not trust this document. Request the original from a trusted source.'
      }

      setVerificationResult({ report, comparison })
      setShowResultModal(true)
    } catch (error) {
      console.error('Error verifying document:', error)
    } finally {
      setProcessing(false)
    }
  }

  // Delete verification
  const handleDelete = (id: string) => {
    setVerifications(prev => prev.filter(v => v.id !== id))
    if (selectedVerification?.id === id) {
      setSelectedVerification(null)
    }
  }

  // Copy hash
  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  // Clear upload
  const clearUpload = () => {
    setUploadedFile(null)
    setUploadedHash(null)
    setFilePreview(null)
    setVerificationResult(null)
    setSelectedVerification(null)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-50/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-100 rounded-xl">
                <Shield className="w-8 h-8 text-cyan-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Verification</h1>
                <p className="text-gray-600">Detect any tampering or modifications instantly</p>
              </div>
            </div>

            {/* TOP RIGHT - Verify Document Button */}
            {uploadedFile && selectedVerification && !verificationResult && (
              <button
                onClick={() => handleVerify()}
                disabled={processing}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Verify Document
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE - Upload & Preview */}
          <div className="lg:col-span-2 space-y-6">

            {/* Upload Area */}
            {!uploadedFile ? (
              <div
                className={`bg-gray-50 border border-gray-200 rounded-2xl shadow-lg border-2 border-dashed transition-all ${
                  dragActive
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-cyan-500/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileUp className="w-10 h-10 text-cyan-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Upload Your Document
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Drop your document here to check if it has been modified or tampered with
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold cursor-pointer hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-cyan-500/25"
                  >
                    <Upload className="w-5 h-5" />
                    Select Document
                  </label>
                  <p className="text-sm text-gray-600 mt-4">
                    Supports: PDF, DOC, DOCX, PNG, JPG (Max 25MB)
                  </p>
                </div>
              </div>
            ) : (
              /* Document Preview */
              <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                {/* Preview Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <FileText className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(uploadedFile.size)}
                        {uploadedHash?.metadata.pageCount && ` • ${uploadedHash.metadata.pageCount} pages`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearUpload}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Preview Content */}
                <div className="p-6">
                  {processing ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
                      <p className="text-gray-700">Analyzing document...</p>
                    </div>
                  ) : (
                    <>
                      {/* Image Preview */}
                      {filePreview && (
                        <div className="mb-6 flex justify-center">
                          <img
                            src={filePreview}
                            alt="Document preview"
                            className="max-h-64 rounded-lg shadow-md"
                          />
                        </div>
                      )}

                      {/* PDF Preview Placeholder */}
                      {uploadedFile.type === 'application/pdf' && (
                        <div className="mb-6 bg-gray-100 rounded-xl p-8 text-center">
                          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-700">PDF Document</p>
                        </div>
                      )}

                      {/* Hash Info */}
                      {uploadedHash && (
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            Document Hash (SHA-256)
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 font-mono text-gray-700 truncate">
                              {uploadedHash.hash}
                            </code>
                            <button
                              onClick={() => copyHash(uploadedHash.hash)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {copiedHash === uploadedHash.hash ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            )}

            {/* How It Works */}
            {!uploadedFile && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Upload Document</p>
                      <p className="text-sm text-gray-600">Drop any document you want to verify</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Select Original</p>
                      <p className="text-sm text-gray-600">Choose from your registered originals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Get Results</p>
                      <p className="text-sm text-gray-600">Instantly know if document is modified</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE - Verify Panel */}
          <div className="space-y-6">

            {/* Direct Verify Button */}
            {uploadedFile && !verificationResult && verifications.length > 0 && (
              <button
                onClick={() => handleVerify()}
                disabled={processing}
                className="w-full py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-bold text-xl hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6" />
                    VERIFY
                  </>
                )}
              </button>
            )}

            {/* No registered documents message */}
            {uploadedFile && !verificationResult && verifications.length === 0 && (
              <div className="bg-yellow-100 border border-yellow-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-3 text-yellow-600">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">No original documents registered yet. Register this document first to verify future copies.</p>
                </div>
              </div>
            )}

            {/* Register New Option */}
            {uploadedFile && !selectedVerification && !verificationResult && (
              <div className="bg-gray-50 rounded-2xl shadow-sm p-6 border-2 border-dashed border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">New Document?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If this is an original document, register it for future verification.
                </p>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="w-full py-3 border-2 border-cyan-500 text-cyan-600 rounded-xl font-medium hover:bg-cyan-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Register as Original
                </button>
              </div>
            )}

            {/* Registered Documents List */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  Your Registered Documents ({verifications.length})
                </h3>
                <p className="text-sm text-gray-600">
                  {uploadedFile ? 'Select one to verify against' : 'Original documents for comparison'}
                </p>
              </div>

              {verifications.length > 0 ? (
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {verifications.map((verification) => (
                    <div
                      key={verification.id}
                      className={`p-4 transition-colors cursor-pointer ${
                        selectedVerification?.id === verification.id
                          ? 'bg-cyan-100 border-l-4 border-cyan-500'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => uploadedFile && setSelectedVerification(verification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedVerification?.id === verification.id
                              ? 'bg-cyan-100'
                              : 'bg-gray-100'
                          }`}>
                            <FileText className={`w-5 h-5 ${
                              selectedVerification?.id === verification.id
                                ? 'text-cyan-600'
                                : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {verification.document_name}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatFileSize(verification.file_size)}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatDate(verification.created_at)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(verification.id)
                          }}
                          className="p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {selectedVerification?.id === verification.id && (
                        <div className="mt-3 flex items-center gap-2 text-cyan-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Selected for comparison</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Shield className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No registered documents yet</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Upload a document and register it as original
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-100 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-300">
                    <strong>SHA-256 Hash</strong> is used to detect even the smallest change in a document -
                    even a single character modification will produce a completely different hash.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && uploadedFile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-100 rounded-xl">
                  <Shield className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Register Original Document</h3>
                  <p className="text-sm text-gray-600">Save this document's hash for future verification</p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-10 h-10 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegisterDocument}
                  disabled={processing}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Register
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERIFICATION RESULT POPUP MODAL */}
      {showResultModal && verificationResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className={`bg-gray-50 border border-gray-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200`}>
            {/* Status Header */}
            <div className={`p-6 ${
              verificationResult.report.status === 'TAMPERED'
                ? 'bg-gradient-to-br from-red-500 to-red-600'
                : 'bg-gradient-to-br from-green-500 to-green-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    {verificationResult.report.status === 'TAMPERED' ? (
                      <ShieldX className="w-10 h-10 text-gray-900" />
                    ) : (
                      <ShieldCheck className="w-10 h-10 text-gray-900" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {verificationResult.report.status === 'TAMPERED'
                        ? 'DOCUMENT TAMPERED!'
                        : 'DOCUMENT VERIFIED!'}
                    </h2>
                    <p className="text-gray-900/80">
                      {verificationResult.report.status === 'TAMPERED'
                        ? 'This document has been modified'
                        : 'This document is authentic'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-900" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Summary */}
              <div className={`p-4 rounded-xl mb-4 ${
                verificationResult.report.status === 'TAMPERED'
                  ? 'bg-red-100 border border-red-500/30'
                  : 'bg-green-100 border border-green-500/30'
              }`}>
                <p className={`text-sm ${
                  verificationResult.report.status === 'TAMPERED'
                    ? 'text-red-700'
                    : 'text-green-700'
                }`}>
                  {verificationResult.report.summary}
                </p>
              </div>

              {/* Differences (if tampered) */}
              {verificationResult.report.differences.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Detected Issues
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {verificationResult.report.differences.map((diff, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 bg-gray-100 rounded-lg p-3 border border-gray-200"
                      >
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          diff.severity === 'CRITICAL'
                            ? 'bg-red-100 text-red-600'
                            : diff.severity === 'HIGH'
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {diff.severity}
                        </span>
                        <p className="text-sm text-gray-600 flex-1">{diff.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div className={`p-4 rounded-xl ${
                verificationResult.report.status === 'TAMPERED'
                  ? 'bg-red-100 border border-red-500/30'
                  : 'bg-green-100 border border-green-500/30'
              }`}>
                <h4 className={`font-semibold mb-1 ${
                  verificationResult.report.status === 'TAMPERED'
                    ? 'text-red-700'
                    : 'text-green-700'
                }`}>
                  Recommendation
                </h4>
                <p className={`text-sm ${
                  verificationResult.report.status === 'TAMPERED'
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}>
                  {verificationResult.report.recommendation}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowResultModal(false)
                  clearUpload()
                }}
                className={`w-full mt-4 py-3 rounded-xl font-semibold transition-colors ${
                  verificationResult.report.status === 'TAMPERED'
                    ? 'bg-red-500 hover:bg-red-600 text-gray-900'
                    : 'bg-green-500 hover:bg-green-600 text-gray-900'
                }`}
              >
                Close & Verify Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerifyPage
