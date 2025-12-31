'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  FileSignature,
  Upload,
  PenTool,
  CheckCircle,
  Download,
  Share2,
  Shield,
  Clock,
  AlertCircle,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Trash2,
  X,
  Loader2,
  FileText,
  Image as ImageIcon,
  Eye,
  Plus,
  Send,
  Mail,
  User,
  MessageSquare,
  Calendar
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import SignatureCanvas from '@/components/signature/SignatureCanvas'

// Dynamically import PDF viewer (client-side only)
const PDFViewer = dynamic(() => import('@/components/signature/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px] bg-gray-50/80 rounded-xl">
      <Loader2 className="w-8 h-8 animate-spin text-[#c4ff0e]" />
    </div>
  )
})

interface PlacedSignature {
  id: string
  signatureImage: string
  x: number
  y: number
  width: number
  height: number
  page: number
  isConfirmed: boolean
}

interface SignedDocumentResult {
  id: string
  documentName: string
  signedAt: string
  downloadUrl: string
  signedImageUrl: string
}

interface Signer {
  id: string
  name: string
  email: string
  order: number
}

const SignPage: React.FC = () => {
  const { user } = useUser()
  const router = useRouter()

  const [document, setDocument] = useState<File | null>(null)
  const [documentPreview, setDocumentPreview] = useState<string | null>(null)
  const [currentSignature, setCurrentSignature] = useState<string | null>(null) // Current signature being placed
  const [placedSignatures, setPlacedSignatures] = useState<PlacedSignature[]>([]) // All placed signatures
  const [activeSignatureId, setActiveSignatureId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signedDocument, setSignedDocument] = useState<SignedDocumentResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isComplete, setIsComplete] = useState(false)
  const [pdfPageImage, setPdfPageImage] = useState<string | null>(null)

  // Send for Signatures Modal State
  const [showSendModal, setShowSendModal] = useState(false)
  const [signers, setSigners] = useState<Signer[]>([
    { id: crypto.randomUUID(), name: '', email: '', order: 1 }
  ])
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [ccEmails, setCcEmails] = useState('')
  const [isSending, setIsSending] = useState(false)

  const documentContainerRef = useRef<HTMLDivElement>(null)
  const signatureRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const signatureStartPos = useRef({ x: 0, y: 0 })

  // Get the current unconfirmed signature (being placed)
  const currentPlacingSignature = placedSignatures.find(s => !s.isConfirmed)
  // Get all confirmed signatures
  const confirmedSignatures = placedSignatures.filter(s => s.isConfirmed)

  const isPDF = document?.type === 'application/pdf' || document?.name.toLowerCase().endsWith('.pdf')

  // Generate document preview for images
  useEffect(() => {
    if (document && !isPDF) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setDocumentPreview(e.target?.result as string)
      }
      reader.readAsDataURL(document)
    } else {
      setDocumentPreview(null)
    }
  }, [document, isPDF])

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
      const isValidType = validTypes.includes(file.type) ||
        file.name.toLowerCase().match(/\.(pdf|png|jpg|jpeg)$/)

      if (!isValidType) {
        setError('Please upload a PDF, PNG, or JPG file')
        return
      }

      if (file.size > 25 * 1024 * 1024) {
        setError('File size must be less than 25MB')
        return
      }

      setDocument(file)
      setError(null)
      setCurrentSignature(null)
      setPlacedSignatures([])
      setActiveSignatureId(null)
      setPdfPageImage(null)
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file) {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
      const isValidType = validTypes.includes(file.type) ||
        file.name.toLowerCase().match(/\.(pdf|png|jpg|jpeg)$/)

      if (!isValidType) {
        setError('Please upload a PDF, PNG, or JPG file')
        return
      }

      setDocument(file)
      setError(null)
      setCurrentSignature(null)
      setPlacedSignatures([])
      setActiveSignatureId(null)
      setPdfPageImage(null)
    }
  }

  // Generate signed document image with all confirmed signatures
  const generateSignedDocument = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = window.document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      // Get document image
      const docImage = new Image()
      docImage.crossOrigin = 'anonymous'

      docImage.onload = async () => {
        // Set canvas size to document size
        canvas.width = docImage.width
        canvas.height = docImage.height

        // Draw document
        ctx.drawImage(docImage, 0, 0)

        // Draw all confirmed signatures
        if (confirmedSignatures.length > 0) {
          const scaleX = docImage.width / (isPDF ? 595 : docImage.naturalWidth)
          const scaleY = docImage.height / (isPDF ? 842 : docImage.naturalHeight)

          // Load and draw each signature
          for (const sig of confirmedSignatures) {
            await new Promise<void>((resolveInner, rejectInner) => {
              const sigImage = new Image()
              sigImage.crossOrigin = 'anonymous'

              sigImage.onload = () => {
                const sigX = sig.x * scaleX
                const sigY = sig.y * scaleY
                const sigWidth = sig.width * scaleX
                const sigHeight = sig.height * scaleY

                ctx.drawImage(sigImage, sigX, sigY, sigWidth, sigHeight)
                resolveInner()
              }

              sigImage.onerror = () => rejectInner(new Error('Failed to load signature'))
              sigImage.src = sig.signatureImage
            })
          }
        }

        // Convert to data URL
        const signedImageUrl = canvas.toDataURL('image/png')
        resolve(signedImageUrl)
      }

      docImage.onerror = () => reject(new Error('Failed to load document'))

      // Use PDF page image or document preview
      if (isPDF && pdfPageImage) {
        docImage.src = pdfPageImage
      } else if (documentPreview) {
        docImage.src = documentPreview
      } else {
        reject(new Error('No document preview available'))
      }
    })
  }

  const handleSubmit = async () => {
    if (!document || confirmedSignatures.length === 0) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Generate signed document image
      const signedImageUrl = await generateSignedDocument()

      // Send to API
      const formData = new FormData()
      formData.append('document', document)
      // Send the first confirmed signature's image as the main signature (API expects this field)
      formData.append('signature', confirmedSignatures[0].signatureImage)
      formData.append('signaturePositions', JSON.stringify(confirmedSignatures))
      formData.append('signerName', 'Document Signer')
      formData.append('signerEmail', 'signer@example.com')

      const response = await fetch('/api/signatures', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to sign document')
      }

      setSignedDocument({
        id: result.documentId,
        documentName: document.name,
        signedAt: new Date().toISOString(),
        downloadUrl: result.downloadUrl || '#',
        signedImageUrl: signedImageUrl
      })
      setIsComplete(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while signing the document')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = () => {
    if (!signedDocument?.signedImageUrl) return

    const link = window.document.createElement('a')
    link.download = `signed_${signedDocument.documentName.replace(/\.[^/.]+$/, '')}.png`
    link.href = signedDocument.signedImageUrl
    link.click()
  }

  const handleStartOver = () => {
    setDocument(null)
    setDocumentPreview(null)
    setCurrentSignature(null)
    setPlacedSignatures([])
    setActiveSignatureId(null)
    setSignedDocument(null)
    setError(null)
    setShowSignaturePad(false)
    setZoom(1)
    setIsComplete(false)
    setPdfPageImage(null)
  }

  // When user creates a new signature from pad
  const handleSignatureCreated = (sig: string | null) => {
    if (sig) {
      setCurrentSignature(sig)
      setShowSignaturePad(false)

      // Create a new placed signature (unconfirmed)
      const newSig: PlacedSignature = {
        id: crypto.randomUUID(),
        signatureImage: sig,
        x: 100,
        y: 400,
        width: 200,
        height: 80,
        page: 1,
        isConfirmed: false
      }
      setPlacedSignatures(prev => [...prev, newSig])
      setActiveSignatureId(newSig.id)
    }
  }

  // Confirm the current signature placement (Done button)
  const confirmCurrentSignature = () => {
    if (!currentPlacingSignature) return

    setPlacedSignatures(prev => prev.map(sig =>
      sig.id === currentPlacingSignature.id
        ? { ...sig, isConfirmed: true }
        : sig
    ))
    setCurrentSignature(null)
    setActiveSignatureId(null)
  }

  // Add another signature - opens signature pad again
  const addAnotherSignature = () => {
    setShowSignaturePad(true)
  }

  // Remove a signature (both confirmed and unconfirmed)
  const removeSignature = (sigId: string) => {
    const sig = placedSignatures.find(s => s.id === sigId)
    setPlacedSignatures(prev => prev.filter(s => s.id !== sigId))

    if (sig && !sig.isConfirmed) {
      setCurrentSignature(null)
    }

    if (activeSignatureId === sigId) {
      setActiveSignatureId(null)
    }
  }

  // Callback to receive PDF page image from PDFViewer
  const handlePdfPageRendered = useCallback((imageUrl: string) => {
    setPdfPageImage(imageUrl)
  }, [])

  // Document click is now handled differently - only for dragging current signature
  const handleDocumentClick = useCallback((e: React.MouseEvent<HTMLDivElement>, pageNumber?: number) => {
    // Don't add new signatures on click - user must use "Add Another Signature" button
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent, sigId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const sig = placedSignatures.find(s => s.id === sigId)
    if (!sig) return

    // Only allow dragging unconfirmed signatures
    if (sig.isConfirmed) return

    setActiveSignatureId(sigId)
    setIsDragging(true)
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    signatureStartPos.current = { x: sig.x, y: sig.y }
  }, [placedSignatures])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !activeSignatureId) return

    const deltaX = (e.clientX - dragStartPos.current.x) / zoom
    const deltaY = (e.clientY - dragStartPos.current.y) / zoom

    setPlacedSignatures(prev => prev.map(sig =>
      sig.id === activeSignatureId
        ? {
            ...sig,
            x: Math.max(0, signatureStartPos.current.x + deltaX),
            y: Math.max(0, signatureStartPos.current.y + deltaY)
          }
        : sig
    ))
  }, [isDragging, activeSignatureId, zoom])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const removeDocument = () => {
    setDocument(null)
    setDocumentPreview(null)
    setCurrentSignature(null)
    setPlacedSignatures([])
    setActiveSignatureId(null)
    setPdfPageImage(null)
  }

  // Signer management functions
  const addSigner = () => {
    const newOrder = signers.length + 1
    setSigners([...signers, {
      id: crypto.randomUUID(),
      name: '',
      email: '',
      order: newOrder
    }])
  }

  const removeSigner = (id: string) => {
    if (signers.length === 1) return
    const filtered = signers.filter(s => s.id !== id)
    // Re-order signers
    const reordered = filtered.map((s, idx) => ({ ...s, order: idx + 1 }))
    setSigners(reordered)
  }

  const updateSigner = (id: string, field: 'name' | 'email', value: string) => {
    setSigners(signers.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  // Send for signatures
  const handleSendForSignatures = async () => {
    // Validate signers
    const validSigners = signers.filter(s => s.email.trim() !== '')
    if (validSigners.length === 0) {
      setError('Please add at least one signer with a valid email')
      return
    }

    if (!document) {
      setError('Please upload a document first')
      return
    }

    setIsSending(true)
    setError(null)

    try {
      // Convert document to base64
      const documentBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(document)
      })

      const response = await fetch('/api/signing-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: document.name,
          documentData: documentBase64,
          senderName: user?.fullName || user?.firstName || 'Document Sender',
          senderEmail: user?.primaryEmailAddress?.emailAddress || 'sender@example.com',
          signers: validSigners.map(s => ({
            name: s.name || s.email.split('@')[0],
            email: s.email,
            order: s.order
          })),
          signatureFields: confirmedSignatures.map((sig, idx) => ({
            id: sig.id,
            signerOrder: Math.min(idx + 1, validSigners.length),
            x: sig.x,
            y: sig.y,
            width: sig.width,
            height: sig.height,
            type: 'signature',
            label: `Signature ${idx + 1}`
          })),
          message: emailMessage,
          subject: emailSubject || `Please sign: ${document.name}`,
          ccEmails: ccEmails.split(',').map(e => e.trim()).filter(e => e)
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send signing request')
      }

      // Success - close modal and show success message
      setShowSendModal(false)
      setSigners([{ id: crypto.randomUUID(), name: '', email: '', order: 1 }])
      setEmailSubject('')
      setEmailMessage('')
      setCcEmails('')

      // Navigate to track page or show success
      router.push('/track?sent=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send signing request')
    } finally {
      setIsSending(false)
    }
  }

  // Open send modal
  const openSendModal = () => {
    if (!document) {
      setError('Please upload a document first')
      return
    }
    setEmailSubject(`Please sign: ${document.name}`)
    setShowSendModal(true)
  }

  // Signature overlay component for all signatures
  const SignaturesOverlay = placedSignatures.length > 0 ? (
    <>
      {placedSignatures.map((sig, index) => (
        <div
          key={sig.id}
          ref={sig.id === activeSignatureId ? signatureRef : undefined}
          className={`absolute border-2 rounded-lg shadow-xl group select-none
            ${sig.isConfirmed
              ? 'border-green-500 bg-gray-50/80/90 cursor-default'
              : isDragging && activeSignatureId === sig.id
                ? 'border-primary-500 bg-gray-50/80/95 cursor-grabbing shadow-2xl scale-105'
                : 'border-[#c4ff0e] border-dashed bg-gray-50/80/95 cursor-grab hover:border-primary-500 hover:shadow-2xl'
            }
            transition-shadow duration-200
          `}
          style={{
            left: sig.x,
            top: sig.y,
            width: sig.width,
            height: sig.height,
            zIndex: activeSignatureId === sig.id ? 60 : 50,
          }}
          onMouseDown={(e) => !sig.isConfirmed && handleMouseDown(e, sig.id)}
          onClick={(e) => {
            e.stopPropagation()
            if (!sig.isConfirmed) {
              setActiveSignatureId(sig.id)
            }
          }}
        >
          <img
            src={sig.signatureImage}
            alt={`Signature ${index + 1}`}
            className="w-full h-full object-contain p-2 pointer-events-none"
            draggable={false}
          />
          {/* Move icon - only for unconfirmed signatures */}
          {!sig.isConfirmed && (
            <div className="absolute -top-3 -left-3 w-7 h-7 bg-[#c4ff0e] rounded-full flex items-center justify-center shadow-lg">
              <Move className="w-4 h-4 text-white" />
            </div>
          )}
          {/* Confirmed checkmark */}
          {sig.isConfirmed && (
            <div className="absolute -top-3 -left-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
          {/* Delete button - only for unconfirmed */}
          {!sig.isConfirmed && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeSignature(sig.id)
              }}
              className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          )}
          {/* Number badge for multiple signatures */}
          {confirmedSignatures.length > 0 && (
            <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 text-white text-xs px-2 py-0.5 rounded-full ${sig.isConfirmed ? 'bg-green-600' : 'bg-gray-700'}`}>
              {index + 1}
            </div>
          )}
          {/* Helper text */}
          {!sig.isConfirmed && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Drag to position
            </div>
          )}
        </div>
      ))}
    </>
  ) : null

  // Completed state with signed document preview
  if (isComplete && signedDocument) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Document Signed Successfully!
            </h1>
            <p className="text-gray-300">
              Your document has been signed and is ready to download.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left - Document Details */}
            <div className="lg:col-span-1 space-y-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="font-semibold text-white mb-4">Document Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Document</span>
                      <span className="font-medium text-white truncate max-w-[150px]">
                        {signedDocument.documentName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Signed At</span>
                      <span className="font-medium text-white">
                        {new Date(signedDocument.signedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Document ID</span>
                      <span className="font-mono text-xs text-gray-300">
                        {signedDocument.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleDownload}
                className="w-full py-4 px-4 bg-gradient-to-r from-[#c4ff0e] to-[#c4ff0e] text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:from-[#b3e60d] hover:to-[#b3e60d] shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="w-5 h-5" />
                Download Signed Document
              </button>

              <button
                onClick={handleStartOver}
                className="w-full py-3 px-4 bg-gray-50/80 border border-[#3a3a3a] text-gray-300 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#252525] transition-colors"
              >
                <FileSignature className="w-5 h-5" />
                Sign Another Document
              </button>

              {/* Trust Badges */}
              <div className="card bg-green-50 border-green-200">
                <div className="card-body py-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-green-700">
                      <Shield className="w-4 h-4" />
                      <span>Legally Binding Signature</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-700">
                      <Clock className="w-4 h-4" />
                      <span>Timestamped & Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>Audit Trail Created</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Signed Document Preview */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="card-header flex items-center justify-between">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[#c4ff0e]" />
                    Signed Document Preview
                  </h3>
                </div>
                <div className="card-body p-0">
                  <div className="bg-[#252525] p-4 flex justify-center overflow-auto" style={{ maxHeight: '600px' }}>
                    {signedDocument.signedImageUrl && (
                      <img
                        src={signedDocument.signedImageUrl}
                        alt="Signed document"
                        className="shadow-xl bg-gray-50/80 max-w-full"
                        style={{ maxHeight: '550px' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#1e1e1e] py-8 px-4"
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Sign Your Document
          </h1>
          <p className="text-gray-300">
            Upload a document, create your signature, and place it where needed.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Upload Card */}
            <div className="card">
              <div className="card-body">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#c4ff0e]" />
                  Upload Document
                </h3>

                {document ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          {isPDF ? (
                            <FileText className="w-5 h-5 text-green-600" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm truncate max-w-[150px]">
                            {document.name}
                          </p>
                          <p className="text-xs text-gray-300">
                            {(document.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeDocument}
                        className="p-1 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-300" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    className="border-2 border-dashed border-[#3a3a3a] rounded-xl p-6 text-center cursor-pointer hover:border-[#c4ff0e] hover:bg-[#252525] transition-all block"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-300 font-medium">
                      Click or drag file
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      PDF, PNG, JPG (max 25MB)
                    </p>
                  </label>
                )}
              </div>
            </div>

            {/* Create Signature Card */}
            <div className="card border-2 border-primary-200 bg-gradient-to-br from-[#1F1F1F] to-[#1F1F1F]">
              <div className="card-body">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-[#c4ff0e]" />
                  Your Signature
                </h3>

                {/* Show current signature being placed (unconfirmed) */}
                {currentPlacingSignature ? (
                  <div className="space-y-3">
                    <div className="bg-gray-50/80 border-2 border-[#c4ff0e] rounded-xl p-3">
                      <img
                        src={currentPlacingSignature.signatureImage}
                        alt="Current signature"
                        className="max-h-16 mx-auto"
                      />
                    </div>

                    <p className="text-sm text-[#c4ff0e] font-medium text-center">
                      Drag signature on document to position
                    </p>

                    {/* Done Button - Confirms current signature */}
                    <button
                      onClick={confirmCurrentSignature}
                      className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Done - Confirm Position
                    </button>

                    {/* Cancel current signature */}
                    <button
                      onClick={() => removeSignature(currentPlacingSignature.id)}
                      className="w-full py-2 px-4 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Show confirmed signatures count */}
                    {confirmedSignatures.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          {confirmedSignatures.length} signature{confirmedSignatures.length > 1 ? 's' : ''} confirmed
                        </p>
                      </div>
                    )}

                    {/* Add Another Signature Button or Create First Signature */}
                    <button
                      onClick={addAnotherSignature}
                      disabled={!document}
                      className={`w-full py-4 px-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all
                        ${document
                          ? confirmedSignatures.length > 0
                            ? 'border-2 border-dashed border-[#c4ff0e] text-[#c4ff0e] hover:bg-[#c4ff0e]/10 hover:border-[#c4ff0e]'
                            : 'bg-gradient-to-r from-[#c4ff0e] to-[#c4ff0e] text-white hover:from-[#b3e60d] hover:to-[#b3e60d] shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                          : 'bg-[#252525] text-gray-300 cursor-not-allowed'
                        }
                      `}
                    >
                      {confirmedSignatures.length > 0 ? (
                        <>
                          <Plus className="w-5 h-5" />
                          Add Another Signature
                        </>
                      ) : (
                        <>
                          <PenTool className="w-5 h-5" />
                          Create Signature
                        </>
                      )}
                    </button>

                    {/* Complete Signing Button - Only show when at least one signature is confirmed */}
                    {confirmedSignatures.length > 0 && (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-4 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Signing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Complete Signing
                          </>
                        )}
                      </button>
                    )}

                    {/* Send for Signatures Button */}
                    {document && (
                      <button
                        onClick={openSendModal}
                        className="w-full py-3 px-4 bg-gradient-to-r from-[#c4ff0e] to-[#c4ff0e] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-[#b3e60d] hover:to-[#b3e60d] shadow-md hover:shadow-lg transition-all"
                      >
                        <Send className="w-5 h-5" />
                        Send for Signatures
                      </button>
                    )}
                  </div>
                )}

                {!document && (
                  <p className="text-xs text-gray-300 text-center mt-2">
                    Upload a document first
                  </p>
                )}
              </div>
            </div>

            {/* Zoom Controls */}
            {document && (
              <div className="card">
                <div className="card-body">
                  <h3 className="font-semibold text-white mb-3 text-sm">Zoom</h3>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                      className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
                    >
                      <ZoomOut className="w-5 h-5 text-gray-300" />
                    </button>
                    <span className="text-sm font-medium text-gray-300 min-w-[60px] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                      className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
                    >
                      <ZoomIn className="w-5 h-5 text-gray-300" />
                    </button>
                    <button
                      onClick={() => setZoom(1)}
                      className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
                      title="Reset"
                    >
                      <RotateCcw className="w-5 h-5 text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Right Side - Document Preview */}
          <div className="lg:col-span-2">
            <div className="card h-full">
              <div className="card-body p-0">
                {!document ? (
                  <label
                    className="flex flex-col items-center justify-center h-[600px] cursor-pointer hover:bg-[#252525] transition-colors rounded-2xl"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-50/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-10 h-10 text-gray-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">
                        Drop your document here
                      </h3>
                      <p className="text-gray-300 mb-4">
                        or click to browse
                      </p>
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          PDF
                        </span>
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-4 h-4" />
                          PNG, JPG
                        </span>
                      </div>
                    </div>
                  </label>
                ) : (
                  <div className="border-2 border-[#2a2a2a]/50 rounded-xl overflow-hidden bg-gray-50/80">
                    {/* PDF Document */}
                    {isPDF && (
                      <div
                        ref={documentContainerRef}
                        className="relative"
                      >
                        <PDFViewer
                          file={document}
                          zoom={zoom}
                          onPageClick={handleDocumentClick}
                          signatureOverlay={SignaturesOverlay}
                          onPageRendered={handlePdfPageRendered}
                        />
                      </div>
                    )}

                    {/* Image Document */}
                    {!isPDF && documentPreview && (
                      <div
                        ref={documentContainerRef}
                        className="overflow-auto relative bg-gray-300 p-4 flex justify-center"
                        style={{ maxHeight: '600px' }}
                        onClick={(e) => handleDocumentClick(e)}
                      >
                        <div
                          className="relative inline-block"
                          style={{
                            transform: `scale(${zoom})`,
                            transformOrigin: 'top center',
                            cursor: currentPlacingSignature ? 'crosshair' : 'default'
                          }}
                        >
                          <img
                            src={documentPreview}
                            alt="Document preview"
                            className="shadow-lg bg-gray-50/80"
                            draggable={false}
                          />
                          {SignaturesOverlay}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Instructions */}
                {document && placedSignatures.length === 0 && (
                  <div className="p-4 bg-blue-50 border-t border-blue-100">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                      <PenTool className="w-4 h-4" />
                      Click "Create Signature" button to add your signature
                    </p>
                  </div>
                )}

                {document && currentPlacingSignature && (
                  <div className="p-4 bg-primary-50 border-t border-primary-100">
                    <p className="text-sm text-[#c4ff0e] flex items-center gap-2">
                      <Move className="w-4 h-4" />
                      Drag signature to position, then click "Done - Confirm Position"
                    </p>
                  </div>
                )}

                {document && !currentPlacingSignature && confirmedSignatures.length > 0 && (
                  <div className="p-4 bg-green-50 border-t border-green-100">
                    <p className="text-sm text-green-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {confirmedSignatures.length} signature{confirmedSignatures.length > 1 ? 's' : ''} placed. Add more or click "Complete Signing"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-gray-300">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm">256-bit Encryption</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm">Legally Binding</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-sm">Full Audit Trail</span>
          </div>
        </div>

        {/* Signature Pad Modal */}
        {showSignaturePad && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-50/80 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Create Your Signature
                  </h3>
                  <button
                    onClick={() => setShowSignaturePad(false)}
                    className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
                <SignatureCanvas onSignatureChange={handleSignatureCreated} />
              </div>
            </div>
          </div>
        )}

        {/* Send for Signatures Modal - Odoo Style */}
        {showSendModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-50/80 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]/50">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#c4ff0e]" />
                  New Signature Request
                </h3>
                <button
                  onClick={() => setShowSendModal(false)}
                  className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                {/* Document Info */}
                <div className="bg-gray-50/80 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#c4ff0e]/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#c4ff0e]" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{document?.name}</p>
                    <p className="text-xs text-gray-300">
                      {document && (document.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {/* Signers */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Signers *
                  </label>
                  <div className="space-y-2">
                    {signers.map((signer, index) => (
                      <div key={signer.id} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#c4ff0e]/20 rounded-full flex items-center justify-center text-[#c4ff0e] font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            placeholder="Name (optional)"
                            value={signer.name}
                            onChange={(e) => updateSigner(signer.id, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 border border-[#3a3a3a] rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                          <input
                            type="email"
                            placeholder="Email *"
                            value={signer.email}
                            onChange={(e) => updateSigner(signer.id, 'email', e.target.value)}
                            className="flex-1 px-3 py-2 border border-[#3a3a3a] rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                        {signers.length > 1 && (
                          <button
                            onClick={() => removeSigner(signer.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addSigner}
                    className="mt-2 text-sm text-[#c4ff0e] hover:text-[#c4ff0e] font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add another signer
                  </button>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Email subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-[#3a3a3a] rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* CC */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CC (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="cc@example.com, another@example.com"
                    value={ccEmails}
                    onChange={(e) => setCcEmails(e.target.value)}
                    className="w-full px-3 py-2 border border-[#3a3a3a] rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Message (optional)
                  </label>
                  <textarea
                    placeholder="Add a personal message to the signer(s)..."
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-[#3a3a3a] rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-5 border-t border-[#2a2a2a]/50 bg-gray-50/80 rounded-b-2xl">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="px-4 py-2 text-gray-300 font-medium rounded-lg hover:bg-[#252525] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendForSignatures}
                  disabled={isSending}
                  className="px-6 py-2 bg-gradient-to-r from-[#c4ff0e] to-[#c4ff0e] text-white font-semibold rounded-lg hover:from-[#b3e60d] hover:to-[#b3e60d] shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SignPage
