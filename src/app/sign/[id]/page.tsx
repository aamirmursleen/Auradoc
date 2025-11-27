'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  FileText,
  Check,
  Loader2,
  PenTool,
  AlertCircle,
  Shield,
  Clock,
  CheckCircle,
  X,
  Download,
  Eye,
  Lock
} from 'lucide-react'

const SignatureCanvas = dynamic(() => import('@/components/signature/SignatureCanvas'), {
  ssr: false,
  loading: () => <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
})

interface SignerInfo {
  name: string
  email: string
  order: number
  status: string
}

interface SignatureFieldInfo {
  id: string
  signerOrder: number
  x: number
  y: number
  width: number
  height: number
  type: string
  label: string
}

interface DocumentData {
  id: string
  documentName: string
  documentUrl: string
  senderName: string
  senderEmail: string
  message?: string
  dueDate?: string
  signers: SignerInfo[]
  signatureFields: SignatureFieldInfo[]
  currentSignerIndex: number
}

export default function SignDocumentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const documentId = params.id as string
  const signerEmail = searchParams.get('email')
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [documentData, setDocumentData] = useState<DocumentData | null>(null)
  const [currentSigner, setCurrentSigner] = useState<SignerInfo | null>(null)
  const [myFields, setMyFields] = useState<SignatureFieldInfo[]>([])

  // Signing state
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [signedFields, setSignedFields] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)

  const documentContainerRef = useRef<HTMLDivElement>(null)

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/signing-requests/${documentId}?email=${signerEmail}&token=${token}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load document')
        }

        setDocumentData(data.data)

        // Find current signer
        const signer = data.data.signers.find(
          (s: SignerInfo) => s.email.toLowerCase() === signerEmail?.toLowerCase()
        )
        setCurrentSigner(signer || null)

        // Get fields for this signer
        const fields = data.data.signatureFields.filter(
          (f: SignatureFieldInfo) => f.signerOrder === signer?.order
        )
        setMyFields(fields)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (documentId && signerEmail) {
      fetchDocument()
    } else {
      setError('Invalid signing link')
      setLoading(false)
    }
  }, [documentId, signerEmail, token])

  // Handle signature creation
  const handleSignatureCreated = (sig: string | null) => {
    if (sig && activeFieldId) {
      setSignature(sig)
      setSignedFields(prev => new Set([...prev, activeFieldId]))
      setShowSignaturePad(false)
      setActiveFieldId(null)
    }
  }

  // Click on a field to sign it
  const handleFieldClick = (fieldId: string) => {
    if (signedFields.has(fieldId)) return // Already signed
    setActiveFieldId(fieldId)
    setShowSignaturePad(true)
  }

  // Submit all signatures
  const handleSubmit = async () => {
    if (!signature || signedFields.size !== myFields.length) {
      setError('Please sign all required fields')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/signing-requests/${documentId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signerEmail,
          token,
          signature,
          signedFields: Array.from(signedFields)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit signature')
      }

      setIsComplete(true)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !documentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Document</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            This link may have expired or is invalid. Please contact the sender.
          </p>
        </div>
      </div>
    )
  }

  // Completion state
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Signed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for signing. {documentData?.senderName} has been notified.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-500 mb-1">Document</p>
            <p className="font-medium text-gray-900">{documentData?.documentName}</p>
            <p className="text-sm text-gray-500 mt-3 mb-1">Signed at</p>
            <p className="font-medium text-gray-900">{new Date().toLocaleString()}</p>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Legally Binding</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-green-600" />
              <span>Secured</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main signing view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{documentData?.documentName}</h1>
                <p className="text-sm text-gray-500">From {documentData?.senderName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Secure Signing</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Signer Info */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Signing as</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-lg">
                    {currentSigner?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentSigner?.name}</p>
                  <p className="text-sm text-gray-500">{currentSigner?.email}</p>
                </div>
              </div>
            </div>

            {/* Message from sender */}
            {documentData?.message && (
              <div className="card p-6 bg-yellow-50 border-yellow-200">
                <h3 className="font-semibold text-gray-900 mb-2">Message from sender</h3>
                <p className="text-gray-700 text-sm italic">"{documentData.message}"</p>
              </div>
            )}

            {/* Fields to sign */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Required Signatures ({signedFields.size}/{myFields.length})
              </h3>
              <div className="space-y-2">
                {myFields.map((field) => (
                  <div
                    key={field.id}
                    className={'flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ' +
                      (signedFields.has(field.id)
                        ? 'bg-green-50 border-green-400'
                        : 'bg-gray-50 border-gray-200 hover:border-primary-300')
                    }
                    onClick={() => handleFieldClick(field.id)}
                  >
                    {signedFields.has(field.id) ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <PenTool className="w-5 h-5 text-gray-400" />
                    )}
                    <span className={'font-medium ' + (signedFields.has(field.id) ? 'text-green-700' : 'text-gray-700')}>
                      {field.type === 'signature' ? 'Signature' : field.type === 'initials' ? 'Initials' : 'Date'}
                    </span>
                    {signedFields.has(field.id) && (
                      <span className="ml-auto text-xs text-green-600">Signed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={signedFields.size !== myFields.length || isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-6 h-6" />
                  Complete Signing
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Trust badges */}
            <div className="card p-4 bg-gray-50">
              <div className="flex items-center justify-around text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span>Timestamped</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Legal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="lg:col-span-2">
            <div
              ref={documentContainerRef}
              className="card p-4 bg-gray-200 min-h-[700px] relative overflow-auto"
            >
              <div
                className="bg-white rounded-lg shadow-lg mx-auto relative"
                style={{ width: '595px', minHeight: '842px' }}
              >
                {/* Document placeholder */}
                <div className="h-full min-h-[842px] flex items-center justify-center p-8">
                  <div className="text-center">
                    <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">{documentData?.documentName}</p>
                    <p className="text-sm text-gray-400 mt-2">Document preview</p>
                  </div>
                </div>

                {/* Signature Fields */}
                {myFields.map((field) => (
                  <div
                    key={field.id}
                    onClick={() => handleFieldClick(field.id)}
                    className={'absolute border-2 rounded-lg cursor-pointer transition-all ' +
                      (signedFields.has(field.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-dashed border-primary-400 bg-primary-50 hover:bg-primary-100 animate-pulse')
                    }
                    style={{
                      left: field.x,
                      top: field.y,
                      width: field.width,
                      height: field.height,
                    }}
                  >
                    {signedFields.has(field.id) && signature ? (
                      <img
                        src={signature}
                        alt="Your signature"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm flex items-center gap-1">
                          <PenTool className="w-4 h-4" />
                          Click to sign
                        </span>
                      </div>
                    )}
                    {!signedFields.has(field.id) && (
                      <div className="absolute -top-6 left-0">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-500 text-white whitespace-nowrap">
                          Sign here
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Create Your Signature
                </h3>
                <button
                  onClick={() => {
                    setShowSignaturePad(false)
                    setActiveFieldId(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <SignatureCanvas onSignatureChange={handleSignatureCreated} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
