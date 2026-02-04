'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  FileSignature,
  Upload,
  PenLine,
  Type,
  Building2,
  CalendarCheck,
  CheckSquare,
  User,
  CircleUserRound,
  UserRound,
  Users,
  Fingerprint,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Settings,
  Send,
  Share2,
  Copy,
  Trash2,
  X,
  Save,
  FileText,
  Loader2,
  Link2,
  Lock,
  Tag,
  AlertCircle,
  Plus,
  Minus,
  Stamp,
  ChevronDown,
  Mail,
  Eye,
  Download,
  Camera,
  Briefcase,
  AlignLeft
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { incrementSignCount } from '@/lib/usageLimit'
import { apiPost } from '@/lib/api'
import { useTheme } from '@/components/ThemeProvider'
import {
  generateFinalPdf,
  convertPlacedFieldToSignatureField,
  type SignatureField,
  type PlacedFieldInput
} from '@/lib/pdf-generator'

// UUID generator with fallback for browsers that don't support crypto.randomUUID
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Dynamically import PDF viewer
const PDFViewer = dynamic(() => import('@/components/signature/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-[#252525]/80">
      <Loader2 className="w-8 h-8 animate-spin text-[#4C00FF] dark:text-[#c4ff0e]" />
    </div>
  )
})

// Dynamically import SignatureCanvas
const SignatureCanvas = dynamic(() => import('@/components/signature/SignatureCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-6 h-6 animate-spin text-[#4C00FF] dark:text-[#c4ff0e]" />
    </div>
  )
})

// Dynamically import MobileSignDocument for mobile view
const MobileSignDocument = dynamic(() => import('@/components/mobile/MobileSignDocument'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-[#4C00FF]" />
    </div>
  )
})

// Field Types - Signature Fields
const SIGNATURE_FIELDS = [
  { id: 'signature', name: 'Signature', icon: PenLine },
  { id: 'initials', name: 'Initial', icon: Fingerprint },
  { id: 'stamp', name: 'Stamp', icon: Stamp },
  { id: 'date', name: 'Date Signed', icon: CalendarCheck },
]

// Field Types - Contact/Identity Fields
const CONTACT_FIELDS = [
  { id: 'name', name: 'Name', icon: CircleUserRound },
  { id: 'firstName', name: 'First Name', icon: UserRound },
  { id: 'lastName', name: 'Last Name', icon: Users },
  { id: 'email', name: 'Email Address', icon: Mail },
  { id: 'company', name: 'Company', icon: Building2 },
  { id: 'title', name: 'Title', icon: Briefcase },
]

// Field Types - Other Fields
const OTHER_FIELDS = [
  { id: 'text', name: 'Text', icon: AlignLeft },
  { id: 'checkbox', name: 'Checkbox', icon: CheckSquare },
]

// All field types combined
const ALL_FIELD_TYPES = [...SIGNATURE_FIELDS, ...CONTACT_FIELDS, ...OTHER_FIELDS]

// Signer colors
const SIGNER_COLORS = [
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
]

interface Signer {
  id: string
  name: string
  email: string
  color: string
  order: number
  is_self?: boolean
}

interface PlacedField {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  page: number
  signerId: string
  signerColor: string
  mandatory: boolean
  placeholder: string
  tip: string
  label: string
  value?: string // For storing user input (text, signature image, etc.)
  fontSize?: number // Font size for text fields
  options?: string[] // For selection field dropdown options
  // Percentage-based positioning for accurate preview/download
  xPercent?: number
  yPercent?: number
  widthPercent?: number
  heightPercent?: number
  // Store page dimensions at placement time for consistent calculations
  pageBaseWidth?: number
  pageBaseHeight?: number
}

interface TemplateProperties {
  name: string
  tags: string[]
  workspace: string
  redirectUrl: string
  authorizedUsers: string[]
}

const SignDocumentPage: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { user } = useUser()
  const router = useRouter()

  // Mobile detection - start with null to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  // Document state
  const [document, setDocument] = useState<File | null>(null)
  const [documentPreview, setDocumentPreview] = useState<string | null>(null)
  const [documentDataUrl, setDocumentDataUrl] = useState<string | null>(null) // For persistence
  const [preUploadedUrl, setPreUploadedUrl] = useState<string | null>(null) // Pre-uploaded to Supabase
  const [documentName, setDocumentName] = useState<string>('') // Store filename
  const [pdfPageImage, setPdfPageImage] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [imageDimensions, setImageDimensions] = useState<{width: number; height: number} | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Signers state
  const [signers, setSigners] = useState<Signer[]>([
    { id: generateUUID(), name: 'Signer 1', email: '', color: SIGNER_COLORS[0], order: 1 }
  ])
  const [activeSignerId, setActiveSignerId] = useState<string>('')
  const [expandedSignerId, setExpandedSignerId] = useState<string | null>(null)

  // Set initial active signer
  useEffect(() => {
    if (signers.length > 0 && !activeSignerId) {
      setActiveSignerId(signers[0].id)
      setExpandedSignerId(signers[0].id)
    }
  }, [signers, activeSignerId])

  // Pre-upload document to Supabase Storage in background (makes Send instant)
  useEffect(() => {
    if (!document || preUploadedUrl) return
    const preUpload = async () => {
      try {
        const uploadUrlResult = await apiPost('/api/upload-url', {
          fileName: document.name || 'document.pdf',
          contentType: document.type || 'application/pdf'
        })
        if (uploadUrlResult.success && uploadUrlResult.data?.signedUrl) {
          const uploadRes = await fetch(uploadUrlResult.data.signedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': document.type || 'application/pdf' },
            body: document
          })
          if (uploadRes.ok) {
            setPreUploadedUrl(uploadUrlResult.data.publicUrl)
            console.log('Document pre-uploaded successfully')
          }
        }
      } catch (err) {
        console.warn('Pre-upload failed, will upload on send:', err)
      }
    }
    preUpload()
  }, [document])

  // Field state
  const [placedFields, setPlacedFields] = useState<PlacedField[]>([])
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [draggedFieldType, setDraggedFieldType] = useState<string | null>(null)
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null) // For inline editing
  const [signatureModalFieldId, setSignatureModalFieldId] = useState<string | null>(null) // For signature modal
  const [signatureTab, setSignatureTab] = useState<'style' | 'draw' | 'upload'>('style')
  const [signatureFullName, setSignatureFullName] = useState('')
  const [signatureInitials, setSignatureInitials] = useState('')
  const [signatureStyle, setSignatureStyle] = useState(0)
  const [stampImage, setStampImage] = useState<string | null>(null)
  const [stampModalFieldId, setStampModalFieldId] = useState<string | null>(null)
  const [showStampCamera, setShowStampCamera] = useState(false)
  const [processingStamp, setProcessingStamp] = useState(false)
  const stampVideoRef = useRef<HTMLVideoElement>(null)
  const stampFileInputRef = useRef<HTMLInputElement>(null)
  const signatureFileInputRef = useRef<HTMLInputElement>(null)

  // UI state
  const [zoom, setZoom] = useState(1)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isGeneratingShare, setIsGeneratingShare] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false)
  const downloadDropdownRef = useRef<HTMLDivElement>(null)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string>('se')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [draftId, setDraftId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [senderName, setSenderName] = useState('')

  // Template properties
  const [templateProps, setTemplateProps] = useState<TemplateProperties>({
    name: '',
    tags: [],
    workspace: 'default',
    redirectUrl: '',
    authorizedUsers: []
  })

  // Refs
  const documentContainerRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const fieldStartPos = useRef<{ x: number; y: number; xPercent?: number; yPercent?: number }>({ x: 0, y: 0 })
  const resizeStartSize = useRef({ width: 0, height: 0 })

  const isPDF = document?.type === 'application/pdf' || document?.name.toLowerCase().endsWith('.pdf')
  const selectedField = placedFields.find(f => f.id === selectedFieldId)
  const activeSigner = signers.find(s => s.id === activeSignerId)

  // Generate document preview for images and capture dimensions
  // Close download dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(e.target as Node)) {
        setShowDownloadDropdown(false)
      }
    }
    window.document.addEventListener('mousedown', handleClickOutside)
    return () => window.document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (document && !isPDF) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        setDocumentPreview(dataUrl)

        // Load image to get dimensions
        const img = new window.Image()
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height })
        }
        img.src = dataUrl
      }
      reader.readAsDataURL(document)
    } else {
      setDocumentPreview(null)
      setImageDimensions(null)
    }
  }, [document, isPDF])

  // Save document to localStorage when it changes
  useEffect(() => {
    if (document && typeof window !== 'undefined') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        setDocumentDataUrl(dataUrl)
        setDocumentName(document.name)
        try {
          localStorage.setItem('signDocument_dataUrl', dataUrl)
          localStorage.setItem('signDocument_name', document.name)
          localStorage.setItem('signDocument_type', document.type)
        } catch (err) {
          console.warn('Could not save document to localStorage:', err)
        }
      }
      reader.readAsDataURL(document)
    }
  }, [document])

  // Save placed fields to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && placedFields.length > 0) {
      try {
        localStorage.setItem('signDocument_fields', JSON.stringify(placedFields))
      } catch (err) {
        console.warn('Could not save fields to localStorage:', err)
      }
    }
  }, [placedFields])

  // Load document and fields from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedDataUrl = localStorage.getItem('signDocument_dataUrl')
        const savedName = localStorage.getItem('signDocument_name')
        const savedType = localStorage.getItem('signDocument_type')
        const savedFields = localStorage.getItem('signDocument_fields')

        if (savedDataUrl && savedName && savedType) {
          // Convert data URL back to File
          fetch(savedDataUrl)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], savedName, { type: savedType })
              setDocument(file)
              setDocumentDataUrl(savedDataUrl)
              setDocumentName(savedName)
            })
            .catch(err => {
              console.warn('Could not restore document:', err)
              clearSavedDocument()
            })
        }

        if (savedFields) {
          const fields = JSON.parse(savedFields)
          setPlacedFields(fields)
        }

        const savedTemplateProps = localStorage.getItem('signDocument_templateProps')
        if (savedTemplateProps) {
          setTemplateProps(JSON.parse(savedTemplateProps))
        }

        const savedSigners = localStorage.getItem('signDocument_signers')
        if (savedSigners) {
          setSigners(JSON.parse(savedSigners))
        }

        const savedDraftId = localStorage.getItem('signDocument_draftId')
        if (savedDraftId) {
          setDraftId(savedDraftId)
        }
      } catch (err) {
        console.warn('Could not load saved document:', err)
      }
    }
  }, [])

  // Clear saved document from localStorage
  const clearSavedDocument = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('signDocument_dataUrl')
      localStorage.removeItem('signDocument_name')
      localStorage.removeItem('signDocument_type')
      localStorage.removeItem('signDocument_fields')
      localStorage.removeItem('signDocument_templateProps')
      localStorage.removeItem('signDocument_signers')
      localStorage.removeItem('signDocument_draftId')
    }
    setDraftId(null)
  }

  // Handle Save button click - save draft to Supabase database
  const handleSave = async () => {
    if (!document) return
    setIsSaving(true)
    setSaveSuccess(false)
    setError(null)
    try {
      // Use pre-uploaded URL if available, otherwise fallback to base64
      let docUrl = preUploadedUrl || ''
      if (!docUrl && documentDataUrl) {
        docUrl = documentDataUrl
      }

      const result = await apiPost('/api/save-draft', {
        draftId: draftId,
        documentName: templateProps.name || document.name || 'Untitled Document',
        documentUrl: docUrl,
        signers: signers.map(s => ({
          id: s.id,
          name: s.name,
          email: s.email,
          color: s.color,
          order: s.order,
          is_self: s.is_self || false
        })),
        signatureFields: placedFields,
        templateProps: templateProps
      })

      if (result.success && result.data?.draftId) {
        setDraftId(result.data.draftId)
        // Also save draftId to localStorage for page reload recovery
        localStorage.setItem('signDocument_draftId', result.data.draftId)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 2000)
      } else {
        setError(result.error || 'Failed to save document')
      }
    } catch (err) {
      console.warn('Could not save document:', err)
      setError('Failed to save document. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Share - save document and generate share URL
  const handleShare = async () => {
    if (!document) return
    setIsGeneratingShare(true)
    setShareUrl(null)
    setShareCopied(false)
    try {
      let docUrl = preUploadedUrl || ''
      if (!docUrl && documentDataUrl) {
        docUrl = documentDataUrl
      }

      const result = await apiPost('/api/share-document', {
        documentName: templateProps.name || document.name || 'Untitled Document',
        documentUrl: docUrl,
        signers: signers.map(s => ({
          name: s.name,
          email: s.email,
          order: s.order,
          is_self: s.is_self || false
        })),
        signatureFields: placedFields,
        templateProps: templateProps
      })

      if (result.success && result.data?.shareUrl) {
        setShareUrl(result.data.shareUrl)
      } else {
        setError(result.error || 'Failed to generate share link')
      }
    } catch (err) {
      console.warn('Could not generate share link:', err)
      setError('Failed to generate share link')
    } finally {
      setIsGeneratingShare(false)
    }
  }

  const copyShareUrl = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = window.document.createElement('textarea')
      textArea.value = shareUrl
      window.document.body.appendChild(textArea)
      textArea.select()
      window.document.execCommand('copy')
      window.document.body.removeChild(textArea)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }

  // Upload new document (clear current and reset)
  const uploadNewDocument = () => {
    setDocument(null)
    setDocumentPreview(null)
    setDocumentDataUrl(null)
    setDocumentName('')
    setPlacedFields([])
    setSelectedFieldId(null)
    setPdfPageImage(null)
    setTotalPages(1)
    setCurrentPage(1)
    setImageDimensions(null)
    clearSavedDocument()
  }

  // Add new signer
  const addSigner = () => {
    const newOrder = signers.length + 1
    const newSigner: Signer = {
      id: generateUUID(),
      name: `Signer ${newOrder}`,
      email: '',
      color: SIGNER_COLORS[(newOrder - 1) % SIGNER_COLORS.length],
      order: newOrder
    }
    setSigners([...signers, newSigner])
    setActiveSignerId(newSigner.id)
    setExpandedSignerId(newSigner.id)
  }

  // Add current user as signer (self-sign)
  const addMyselfAsSigner = () => {
    // Check if already added
    const alreadyAdded = signers.some(s => s.is_self)
    if (alreadyAdded) {
      setError('You have already added yourself as a signer')
      return
    }

    const newOrder = signers.length + 1
    const userName = user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || 'Me'
    const userEmail = user?.primaryEmailAddress?.emailAddress || ''

    const newSigner: Signer = {
      id: generateUUID(),
      name: userName,
      email: userEmail,
      color: SIGNER_COLORS[(newOrder - 1) % SIGNER_COLORS.length],
      order: newOrder,
      is_self: true
    }
    setSigners([...signers, newSigner])
    setActiveSignerId(newSigner.id)
    setExpandedSignerId(newSigner.id)
  }

  // Remove signer
  const removeSigner = (signerId: string) => {
    if (signers.length <= 1) return

    const filteredSigners = signers.filter(s => s.id !== signerId)
    // Re-order signers (keep original names)
    const reorderedSigners = filteredSigners.map((s, idx) => ({
      ...s,
      order: idx + 1
    }))
    setSigners(reorderedSigners)

    // Remove fields assigned to this signer
    setPlacedFields(prev => prev.filter(f => f.signerId !== signerId))

    // Set new active signer
    if (activeSignerId === signerId && reorderedSigners.length > 0) {
      setActiveSignerId(reorderedSigners[0].id)
      setExpandedSignerId(reorderedSigners[0].id)
    }
  }

  // Update signer
  const updateSigner = (signerId: string, field: keyof Signer, value: string) => {
    setSigners(prev => prev.map(s =>
      s.id === signerId ? { ...s, [field]: value } : s
    ))
  }

  // File upload handler - PDF and images
  // Images (PNG/JPG) are automatically converted to PDF for consistent positioning
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const isPdfType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      const isImageType = file.type.startsWith('image/') &&
        (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' ||
         file.name.toLowerCase().endsWith('.png') || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg'))

      if (!isPdfType && !isImageType) {
        setError('Please upload a PDF, PNG, JPG, or JPEG file')
        return
      }

      if (file.size > 25 * 1024 * 1024) {
        setError('File size must be less than 25MB')
        return
      }

      setError(null)
      setPlacedFields([])
      setSelectedFieldId(null)

      // If it's an image, convert to PDF for consistent positioning
      if (isImageType) {
        try {
          setIsLoading(true)

          // Load the image
          const imageDataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })

          // Get image dimensions
          const img = new window.Image()
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = reject
            img.src = imageDataUrl
          })

          // Import jsPDF dynamically
          const { jsPDF } = await import('jspdf')

          // Create PDF with image dimensions (in mm, assuming 96 DPI)
          // A4 is 210x297mm, but we'll use the actual image aspect ratio
          const imgWidth = img.width
          const imgHeight = img.height

          // Convert pixels to mm (assuming 96 DPI: 1 inch = 25.4mm, 96 pixels = 1 inch)
          const pxToMm = 25.4 / 96
          const pdfWidth = imgWidth * pxToMm
          const pdfHeight = imgHeight * pxToMm

          // Create PDF with custom page size matching the image
          const pdf = new jsPDF({
            orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
            unit: 'mm',
            format: [pdfWidth, pdfHeight]
          })

          // Add the image to fill the entire page
          pdf.addImage(imageDataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight)

          // Convert to Blob and then to File
          const pdfBlob = pdf.output('blob')
          const pdfFile = new File([pdfBlob], file.name.replace(/\.[^/.]+$/, '.pdf'), {
            type: 'application/pdf'
          })

          setDocument(pdfFile)
          setTemplateProps(prev => ({ ...prev, name: file.name.replace(/\.[^/.]+$/, '') }))
          setTotalPages(1)
          setCurrentPage(1)
          setIsLoading(false)
        } catch (err) {
          console.error('Error converting image to PDF:', err)
          setError('Failed to process image. Please try again.')
          setIsLoading(false)
        }
      } else {
        // It's already a PDF
        setDocument(file)
        setTemplateProps(prev => ({ ...prev, name: file.name.replace(/\.[^/.]+$/, '') }))
        setTotalPages(1)
        setCurrentPage(1)
      }
    }
  }

  // Handle dropping a field type onto the document
  const handleDocumentDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!draggedFieldType || !activeSigner) return

    const fieldType = ALL_FIELD_TYPES.find(f => f.id === draggedFieldType)
    if (!fieldType) return

    // Calculate field dimensions based on type
    const fieldWidth = draggedFieldType === 'signature' ? 200 : draggedFieldType === 'checkbox' ? 30 : draggedFieldType === 'email' ? 250 : 150
    const fieldHeight = draggedFieldType === 'signature' ? 60 : draggedFieldType === 'checkbox' ? 30 : 40

    let x: number, y: number
    let xPercent: number | undefined
    let yPercent: number | undefined
    let widthPercent: number | undefined
    let heightPercent: number | undefined
    let pageBaseWidth: number | undefined
    let pageBaseHeight: number | undefined

    // For IMAGES: Get position relative to the CONTAINER element
    // (not the img, as img may have different rendered size)
    if (!isPDF && imageDimensions) {
      const imageContainer = window.document.querySelector('[data-image-container="true"]') as HTMLElement
      if (!imageContainer) return

      const containerRect = imageContainer.getBoundingClientRect()

      // Drop position relative to the CONTAINER
      const dropX = e.clientX - containerRect.left
      const dropY = e.clientY - containerRect.top

      // Use ACTUAL rendered container dimensions (robust against CSS constraints)
      const expectedWidth = containerRect.width
      const expectedHeight = containerRect.height

      // Calculate percentage of where user dropped
      const xPct = dropX / expectedWidth
      const yPct = dropY / expectedHeight

      // Field dimensions as percentages of base image
      pageBaseWidth = imageDimensions.width
      pageBaseHeight = imageDimensions.height
      widthPercent = fieldWidth / pageBaseWidth
      heightPercent = fieldHeight / pageBaseHeight

      // Store percentage (clamped, centered on drop)
      xPercent = Math.max(0, Math.min(1 - widthPercent, xPct - widthPercent / 2))
      yPercent = Math.max(0, Math.min(1 - heightPercent, yPct - heightPercent / 2))

      // Base coordinates
      x = xPercent * pageBaseWidth + fieldWidth / 2
      y = yPercent * pageBaseHeight + fieldHeight / 2
    } else {
      // For PDFs: find the actual page element at drop position for accurate coordinates
      const pageElement = (e.target as HTMLElement).closest('[data-pdf-page="true"]') as HTMLElement
      if (pageElement) {
        const pageRect = pageElement.getBoundingClientRect()
        // Use actual rendered page dimensions (same approach as onPageClick)
        const dropXPct = (e.clientX - pageRect.left) / pageRect.width
        const dropYPct = (e.clientY - pageRect.top) / pageRect.height

        pageBaseWidth = pageRect.width / zoom
        pageBaseHeight = pageRect.height / zoom
        widthPercent = fieldWidth / pageBaseWidth
        heightPercent = fieldHeight / pageBaseHeight

        xPercent = Math.max(0, Math.min(1 - widthPercent, dropXPct - widthPercent / 2))
        yPercent = Math.max(0, Math.min(1 - heightPercent, dropYPct - heightPercent / 2))

        x = xPercent * pageBaseWidth + fieldWidth / 2
        y = yPercent * pageBaseHeight + fieldHeight / 2
      } else {
        // Fallback: use documentContainerRef
        if (!documentContainerRef.current) return
        const rect = documentContainerRef.current.getBoundingClientRect()
        x = (e.clientX - rect.left) / zoom
        y = (e.clientY - rect.top) / zoom

        pageBaseWidth = 612
        pageBaseHeight = 792
        widthPercent = fieldWidth / pageBaseWidth
        heightPercent = fieldHeight / pageBaseHeight
        xPercent = Math.max(0, (x - fieldWidth / 2)) / pageBaseWidth
        yPercent = Math.max(0, (y - fieldHeight / 2)) / pageBaseHeight
      }
    }

    const newField: PlacedField = {
      id: generateUUID(),
      type: draggedFieldType,
      x: Math.max(0, x - fieldWidth / 2),
      y: Math.max(0, y - fieldHeight / 2),
      width: fieldWidth,
      height: fieldHeight,
      page: currentPage,
      signerId: activeSigner.id,
      signerColor: activeSigner.color,
      mandatory: true,
      placeholder: '',
      tip: '',
      label: fieldType.name,
      value: undefined,
      xPercent,
      yPercent,
      widthPercent,
      heightPercent,
      pageBaseWidth,
      pageBaseHeight
    }

    setPlacedFields(prev => [...prev, newField])
    setSelectedFieldId(newField.id)
    setDraggedFieldType(null)
    setShowPropertiesPanel(true)
  }, [draggedFieldType, zoom, currentPage, activeSigner, imageDimensions, isPDF])

  // Handle field drag start from sidebar
  const handleFieldDragStart = (fieldType: string) => {
    setDraggedFieldType(fieldType)
  }

  // Handle placed field mouse down (for moving)
  const handleFieldMouseDown = useCallback((e: React.MouseEvent, fieldId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const field = placedFields.find(f => f.id === fieldId)
    if (!field) return

    setSelectedFieldId(fieldId)
    setIsDragging(true)
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    // Store both pixel positions and percentages for drag calculation
    fieldStartPos.current = {
      x: field.x,
      y: field.y,
      xPercent: field.xPercent,
      yPercent: field.yPercent
    }
    setShowPropertiesPanel(true)
  }, [placedFields])

  // Handle mouse move for dragging fields
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedFieldId) return

    setPlacedFields(prev => prev.map(field => {
      if (field.id !== selectedFieldId) return field

      // For images: calculate delta as percentage (same approach as placement)
      if (!isPDF && imageDimensions) {
        // Use ACTUAL rendered container dimensions (robust against CSS constraints)
        const imageContainer = window.document.querySelector('[data-image-container="true"]') as HTMLElement
        const containerRect = imageContainer?.getBoundingClientRect()
        const containerWidth = containerRect?.width || imageDimensions.width * zoom
        const containerHeight = containerRect?.height || imageDimensions.height * zoom

        // Calculate movement as percentage of actual container
        const deltaPctX = (e.clientX - dragStartPos.current.x) / containerWidth
        const deltaPctY = (e.clientY - dragStartPos.current.y) / containerHeight

        // Use stored start percentages, or calculate from position
        const startXPct = fieldStartPos.current.xPercent ?? (fieldStartPos.current.x / imageDimensions.width)
        const startYPct = fieldStartPos.current.yPercent ?? (fieldStartPos.current.y / imageDimensions.height)
        const widthPct = field.widthPercent ?? (field.width / imageDimensions.width)
        const heightPct = field.heightPercent ?? (field.height / imageDimensions.height)

        const newXPct = Math.max(0, Math.min(1 - widthPct, startXPct + deltaPctX))
        const newYPct = Math.max(0, Math.min(1 - heightPct, startYPct + deltaPctY))

        return {
          ...field,
          // Update both pixel values (for compatibility) and percentages
          x: newXPct * imageDimensions.width,
          y: newYPct * imageDimensions.height,
          xPercent: newXPct,
          yPercent: newYPct
        }
      }

      // PDF: use zoom-based calculation and UPDATE PERCENTAGES
      const deltaX = (e.clientX - dragStartPos.current.x) / zoom
      const deltaY = (e.clientY - dragStartPos.current.y) / zoom

      const newX = Math.max(0, fieldStartPos.current.x + deltaX)
      const newY = Math.max(0, fieldStartPos.current.y + deltaY)

      // IMPORTANT: Also update percentages so preview positioning stays accurate
      // Use the stored pageBaseWidth/Height from when the field was created
      const baseWidth = field.pageBaseWidth || 612 // fallback to US Letter width
      const baseHeight = field.pageBaseHeight || 792 // fallback to US Letter height

      return {
        ...field,
        x: newX,
        y: newY,
        // Update percentages to match new position
        xPercent: newX / baseWidth,
        yPercent: newY / baseHeight
      }
    }))
  }, [isDragging, selectedFieldId, zoom, isPDF, imageDimensions])

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent, fieldId: string, direction: string = 'se') => {
    e.preventDefault()
    e.stopPropagation()

    const field = placedFields.find(f => f.id === fieldId)
    if (!field) return

    setSelectedFieldId(fieldId)
    setIsResizing(true)
    setResizeDirection(direction)
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    resizeStartSize.current = { width: field.width, height: field.height }
    fieldStartPos.current = { x: field.x, y: field.y }
  }, [placedFields])

  // Handle resize move
  const handleResizeMove = useCallback((e: React.MouseEvent) => {
    if (!isResizing || !selectedFieldId) return

    const deltaX = (e.clientX - dragStartPos.current.x) / zoom
    const deltaY = (e.clientY - dragStartPos.current.y) / zoom

    setPlacedFields(prev => prev.map(field => {
      if (field.id !== selectedFieldId) return field

      let newWidth = resizeStartSize.current.width
      let newHeight = resizeStartSize.current.height
      let newX = fieldStartPos.current.x
      let newY = fieldStartPos.current.y

      // Handle different resize directions
      if (resizeDirection.includes('e')) {
        newWidth = Math.max(50, resizeStartSize.current.width + deltaX)
      }
      if (resizeDirection.includes('w')) {
        newWidth = Math.max(50, resizeStartSize.current.width - deltaX)
        newX = fieldStartPos.current.x + deltaX
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(30, resizeStartSize.current.height + deltaY)
      }
      if (resizeDirection.includes('n')) {
        newHeight = Math.max(30, resizeStartSize.current.height - deltaY)
        newY = fieldStartPos.current.y + deltaY
      }

      // Also update percentages in real-time during resize
      // (needed for CSS percentage-based field display to show correct size)
      const baseWidth = (!isPDF && imageDimensions) ? imageDimensions.width : (field.pageBaseWidth || 612)
      const baseHeight = (!isPDF && imageDimensions) ? imageDimensions.height : (field.pageBaseHeight || 792)

      return {
        ...field,
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
        widthPercent: newWidth / baseWidth,
        heightPercent: newHeight / baseHeight,
        xPercent: newX / baseWidth,
        yPercent: newY / baseHeight,
      }
    }))
  }, [isResizing, selectedFieldId, zoom, resizeDirection, isPDF, imageDimensions])

  // Handle mouse up - recalculate percentages after drag/resize
  const handleMouseUp = useCallback(() => {
    if ((isDragging || isResizing) && selectedFieldId) {
      // Recalculate percentage values for the moved/resized field
      setPlacedFields(prev => prev.map(field => {
        if (field.id !== selectedFieldId) return field

        // Determine the base dimensions to use for percentage calculation
        // Use pageBaseWidth/Height if set, otherwise fall back to imageDimensions (for images)
        let baseWidth = field.pageBaseWidth
        let baseHeight = field.pageBaseHeight

        if (!baseWidth || !baseHeight) {
          // For images without pageBase set, use imageDimensions
          if (!isPDF && imageDimensions) {
            baseWidth = imageDimensions.width
            baseHeight = imageDimensions.height
          } else {
            // For PDFs, use US Letter as fallback
            baseWidth = 612
            baseHeight = 792
          }
        }

        const newXPercent = Math.max(0, field.x / baseWidth)
        const newYPercent = Math.max(0, field.y / baseHeight)
        const newWidthPercent = field.width / baseWidth
        const newHeightPercent = field.height / baseHeight

        console.log('Field drag/resize complete - recalculating percentages:', {
          fieldId: field.id,
          fieldX: field.x,
          fieldY: field.y,
          baseWidth,
          baseHeight,
          newYPercent: `${(newYPercent * 100).toFixed(2)}%`,
        })

        return {
          ...field,
          xPercent: newXPercent,
          yPercent: newYPercent,
          widthPercent: newWidthPercent,
          heightPercent: newHeightPercent,
          // Also update pageBaseWidth/Height if they weren't set
          pageBaseWidth: baseWidth,
          pageBaseHeight: baseHeight
        }
      }))
    }
    setIsDragging(false)
    setIsResizing(false)
  }, [isDragging, isResizing, selectedFieldId, isPDF, imageDimensions])

  // Update field property
  const updateFieldProperty = (property: keyof PlacedField, value: any) => {
    if (!selectedFieldId) return

    setPlacedFields(prev => prev.map(field =>
      field.id === selectedFieldId
        ? { ...field, [property]: value }
        : field
    ))
  }

  // Delete selected field
  const deleteSelectedField = () => {
    if (!selectedFieldId) return
    setPlacedFields(prev => prev.filter(f => f.id !== selectedFieldId))
    setSelectedFieldId(null)
    setShowPropertiesPanel(false)
  }

  // Duplicate selected field
  const duplicateSelectedField = () => {
    if (!selectedField) return

    const newField: PlacedField = {
      ...selectedField,
      id: generateUUID(),
      x: selectedField.x + 20,
      y: selectedField.y + 20
    }

    setPlacedFields(prev => [...prev, newField])
    setSelectedFieldId(newField.id)
  }

  // Update field value (for inline editing) - auto-expand width for text fields
  const updateFieldValue = (fieldId: string, value: string) => {
    setPlacedFields(prev => prev.map(field => {
      if (field.id !== fieldId) return field
      const updated = { ...field, value }

      // Auto-expand width for text-type fields if content is wider than field
      const isTextType = ['text', 'name', 'firstName', 'lastName', 'email', 'company', 'title'].includes(field.type)
      if (isTextType && value) {
        const fontSize = field.fontSize || 14
        const estimatedWidth = value.length * fontSize * 0.62 + 16
        if (estimatedWidth > field.width) {
          updated.width = estimatedWidth
          const baseW = field.pageBaseWidth || 612
          updated.widthPercent = estimatedWidth / baseW
        }
      }

      return updated
    }))
  }

  // Update field font size
  const updateFieldFontSize = (fieldId: string, fontSize: number) => {
    setPlacedFields(prev => prev.map(field =>
      field.id === fieldId ? { ...field, fontSize } : field
    ))
  }

  // Handle signature save from SignatureCanvas
  const handleSignatureSave = (fieldId: string, signatureData: string) => {
    updateFieldValue(fieldId, signatureData)
    setEditingFieldId(null)
  }

  // Stamp functions
  const removeStampBackground = (imageData: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = globalThis.document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(imageData); return }
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imgData.data
        const corners = [[0, 0], [canvas.width - 1, 0], [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1]]
        let bgR = 0, bgG = 0, bgB = 0
        corners.forEach(([x, y]) => {
          const idx = (y * canvas.width + x) * 4
          bgR += data[idx]; bgG += data[idx + 1]; bgB += data[idx + 2]
        })
        bgR = Math.round(bgR / 4); bgG = Math.round(bgG / 4); bgB = Math.round(bgB / 4)
        for (let i = 0; i < data.length; i += 4) {
          const diff = Math.abs(data[i] - bgR) + Math.abs(data[i + 1] - bgG) + Math.abs(data[i + 2] - bgB)
          if (diff < 60) data[i + 3] = 0
        }
        ctx.putImageData(imgData, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = imageData
    })
  }

  const handleStampUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProcessingStamp(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      const processed = await removeStampBackground(event.target?.result as string)
      setStampImage(processed)
      setProcessingStamp(false)
    }
    reader.readAsDataURL(file)
  }

  const startStampCamera = async () => {
    setShowStampCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (stampVideoRef.current) stampVideoRef.current.srcObject = stream
    } catch (err) {
      console.error('Camera error:', err)
      setShowStampCamera(false)
    }
  }

  const captureStampImage = async () => {
    if (!stampVideoRef.current) return
    setProcessingStamp(true)
    const canvas = globalThis.document.createElement('canvas')
    canvas.width = stampVideoRef.current.videoWidth
    canvas.height = stampVideoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(stampVideoRef.current, 0, 0)
      const processed = await removeStampBackground(canvas.toDataURL('image/png'))
      setStampImage(processed)
    }
    const stream = stampVideoRef.current.srcObject as MediaStream
    stream?.getTracks().forEach(track => track.stop())
    setShowStampCamera(false)
    setProcessingStamp(false)
  }

  const saveStampToField = (fieldId: string) => {
    if (stampImage) {
      updateFieldValue(fieldId, stampImage)
    }
    setStampImage(null)
    setEditingFieldId(null)
  }

  // PDF page rendered callback
  const handlePdfPageRendered = useCallback((imageUrl: string) => {
    setPdfPageImage(imageUrl)
  }, [])

  // Generate preview using the EXACT same pipeline as download
  // This guarantees preview matches the downloaded PDF pixel-for-pixel
  const generatePreview = useCallback(async () => {
    if (!document) return

    setIsGeneratingPreview(true)
    setPreviewImages([])

    try {
      // For IMAGE documents: use HTML rendering in the modal (same rendering as editor = pixel-perfect match)
      if (!isPDF && documentPreview && imageDimensions) {
        // No canvas needed - the preview modal renders HTML directly
        setShowPreviewModal(true)
      } else {
        // For PDF documents: use the pdf-lib pipeline
        const ab = await document.arrayBuffer()
        const pdfData = new Uint8Array(ab)

        // Build SignatureFields from placed fields
        const signatureFields: SignatureField[] = placedFields
          .filter(f => f.value)
          .map(field => {
            let xPct: number | undefined = field.xPercent
            let yPct: number | undefined = field.yPercent
            let wPct: number | undefined = field.widthPercent
            let hPct: number | undefined = field.heightPercent

            const baseW = field.pageBaseWidth || 612
            const baseH = field.pageBaseHeight || 792

            if (xPct === undefined || yPct === undefined) {
              if (baseW && baseH) {
                xPct = field.x / baseW
                yPct = field.y / baseH
              } else {
                return null
              }
            }

            if (wPct === undefined || wPct === null || isNaN(wPct)) {
              wPct = field.width / baseW
            }
            if (hPct === undefined || hPct === null || isNaN(hPct)) {
              hPct = field.height / baseH
            }

            return {
              id: field.id,
              type: field.type,
              pageNumber: field.page,
              xPct,
              yPct,
              wPct,
              hPct,
              value: field.value,
              fontSize: field.fontSize,
            } as SignatureField
          })
          .filter((f): f is SignatureField => f !== null)

        const { pdfBytes: finalPdfBytes } = await generateFinalPdf(pdfData, signatureFields)

        // Render using pdf.js
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

        const finalPdf = await pdfjsLib.getDocument({ data: finalPdfBytes }).promise
        const images: string[] = []
        const previewScale = 2

        for (let pageNum = 1; pageNum <= finalPdf.numPages; pageNum++) {
          const page = await finalPdf.getPage(pageNum)
          const viewport = page.getViewport({ scale: previewScale })

          const canvas = window.document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) continue

          canvas.width = viewport.width
          canvas.height = viewport.height

          ctx.setTransform(1, 0, 0, 1, 0, 0)
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          await page.render({
            canvasContext: ctx,
            viewport: viewport,
            background: 'white'
          }).promise

          images.push(canvas.toDataURL('image/png'))
        }

        setPreviewImages(images)
        setShowPreviewModal(true)
      }
    } catch (err) {
      console.error('Error generating preview:', err)
      setError('Failed to generate preview')
    } finally {
      setIsGeneratingPreview(false)
    }
  }, [document, placedFields, isPDF, documentPreview, imageDimensions])

  // Build signed PDF bytes (shared by all download formats)
  const buildSignedPdf = useCallback(async (): Promise<Uint8Array | null> => {
    if (!document) return null

    let pdfData: Uint8Array

    // For images (PNG/JPG), convert to PDF first using pdf-lib
    if (!isPDF && documentPreview && imageDimensions) {
      const { PDFDocument: PDFDoc } = await import('pdf-lib')
      const imgPdfDoc = await PDFDoc.create()

      const imgResponse = await fetch(documentPreview)
      const imgBytes = new Uint8Array(await imgResponse.arrayBuffer())

      let embeddedImg
      const docType = document.type || ''
      if (docType.includes('png') || documentPreview.includes('data:image/png')) {
        embeddedImg = await imgPdfDoc.embedPng(imgBytes)
      } else {
        try {
          embeddedImg = await imgPdfDoc.embedJpg(imgBytes)
        } catch {
          embeddedImg = await imgPdfDoc.embedPng(imgBytes)
        }
      }

      const DPI_RATIO = 72 / 96
      const pageW = imageDimensions.width * DPI_RATIO
      const pageH = imageDimensions.height * DPI_RATIO

      const page = imgPdfDoc.addPage([pageW, pageH])
      page.drawImage(embeddedImg, { x: 0, y: 0, width: pageW, height: pageH })

      pdfData = await imgPdfDoc.save()
    } else {
      const ab = await document.arrayBuffer()
      pdfData = new Uint8Array(ab)
    }

    // Convert PlacedFields to SignatureFields
    const signatureFields: SignatureField[] = placedFields
      .filter(f => f.value)
      .map(field => {
        let xPct: number | undefined = field.xPercent
        let yPct: number | undefined = field.yPercent
        let wPct: number | undefined = field.widthPercent
        let hPct: number | undefined = field.heightPercent

        const baseW = field.pageBaseWidth || ((!isPDF && imageDimensions) ? imageDimensions.width : 612)
        const baseH = field.pageBaseHeight || ((!isPDF && imageDimensions) ? imageDimensions.height : 792)

        if (xPct === undefined || yPct === undefined) {
          if (baseW && baseH) {
            xPct = field.x / baseW
            yPct = field.y / baseH
          } else {
            return null
          }
        }

        if (wPct === undefined || wPct === null || isNaN(wPct)) {
          wPct = field.width / baseW
        }
        if (hPct === undefined || hPct === null || isNaN(hPct)) {
          hPct = field.height / baseH
        }

        return {
          id: field.id,
          type: field.type,
          pageNumber: field.page,
          xPct, yPct, wPct, hPct,
          value: field.value,
          fontSize: field.fontSize,
        } as SignatureField
      })
      .filter((f): f is SignatureField => f !== null)

    const { pdfBytes: finalPdfBytes } = await generateFinalPdf(pdfData, signatureFields)
    return new Uint8Array(finalPdfBytes)
  }, [document, placedFields, isPDF, documentPreview, imageDimensions])

  // Download signed document in specified format
  const handleDownload = useCallback(async (format: 'pdf' | 'jpg' | 'png' = 'pdf') => {
    if (!document) return

    setIsDownloading(true)
    setShowDownloadDropdown(false)

    try {
      const finalPdfBytes = await buildSignedPdf()
      if (!finalPdfBytes) throw new Error('Failed to build PDF')

      const baseName = templateProps.name || 'signed-document'

      if (format === 'pdf') {
        const blob = new Blob([finalPdfBytes as BlobPart], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = window.document.createElement('a')
        link.href = url
        link.download = `${baseName}.pdf`
        link.click()
        URL.revokeObjectURL(url)
      } else {
        // Convert PDF pages to images using pdfjs-dist
        const pdfjsLib = await import('pdfjs-dist')
        const pdf = await pdfjsLib.getDocument({ data: finalPdfBytes }).promise
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
    } catch (err) {
      console.error('Error downloading:', err)
      setError('Failed to download document')
    } finally {
      setIsDownloading(false)
    }
  }, [document, buildSignedPdf, templateProps.name])

  // Send document for signing
  const handleSendForSigning = async () => {
    // Validate emails
    const invalidSigners = signers.filter(s => !s.email || !s.email.includes('@'))
    if (invalidSigners.length > 0) {
      setError('Please enter valid email addresses for all signers')
      return
    }

    // Check if all signers have at least one field
    const signersWithoutFields = signers.filter(s => !placedFields.some(f => f.signerId === s.id))
    if (signersWithoutFields.length > 0) {
      setError(`${signersWithoutFields.map(s => s.name).join(', ')} have no fields assigned`)
      return
    }

    setIsSending(true)
    setError(null)

    try {
      // Use pre-uploaded URL if available (instant!), otherwise upload now
      let documentUrl = preUploadedUrl || ''

      if (!documentUrl && document) {
        try {
          const uploadUrlResult = await apiPost('/api/upload-url', {
            fileName: document.name || 'document.pdf',
            contentType: document.type || 'application/pdf'
          })

          if (uploadUrlResult.success && uploadUrlResult.data?.signedUrl) {
            const uploadRes = await fetch(uploadUrlResult.data.signedUrl, {
              method: 'PUT',
              headers: { 'Content-Type': document.type || 'application/pdf' },
              body: document
            })
            if (uploadRes.ok) {
              documentUrl = uploadUrlResult.data.publicUrl
            } else {
              throw new Error('Upload failed')
            }
          } else {
            throw new Error(uploadUrlResult.error || 'Failed to get upload URL')
          }
        } catch (uploadErr) {
          // Fallback: use base64 for small files (<3MB)
          console.warn('Storage upload failed, trying base64 fallback:', uploadErr)
          if (document.size < 3 * 1024 * 1024) {
            const reader = new FileReader()
            documentUrl = await new Promise((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(document)
            })
          } else {
            throw new Error('File too large. Please try with a smaller file or try again.')
          }
        }
      }

      // Prepare signature fields data
      const signatureFields = placedFields.map(field => ({
        id: field.id,
        signerOrder: signers.find(s => s.id === field.signerId)?.order || 1,
        x: field.x,
        y: field.y,
        width: field.width,
        height: field.height,
        // Percentage-based coordinates for accurate PDF alignment
        xPercent: field.xPercent,
        yPercent: field.yPercent,
        widthPercent: field.widthPercent,
        heightPercent: field.heightPercent,
        pageBaseWidth: field.pageBaseWidth,
        pageBaseHeight: field.pageBaseHeight,
        type: field.type,
        label: field.label,
        mandatory: field.mandatory,
        page: field.page,
        fontSize: field.fontSize
      }))

      // Send to API - only URL, not full document data (prevents "Request too large")
      const result = await apiPost('/api/signing-requests', {
        documentName: templateProps.name || document?.name || 'Untitled Document',
        documentData: documentUrl,
        signers: signers.map(s => ({
          name: s.name,
          email: s.email,
          order: s.order,
          is_self: s.is_self || false
        })),
        signatureFields,
        message: emailMessage || undefined,
        subject: emailSubject || undefined,
        senderName: senderName.trim() || undefined
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to send document')
      }

      const data = result.data

      setSendSuccess(true)

      // Increment usage count after successful send
      if (user?.id) {
        incrementSignCount(user.id)
      }
      setShowSendModal(false)

      // If there's a self-signing link, redirect to sign
      if (data.selfSigningLink) {
        router.push(data.selfSigningLink)
        return
      }

      // Show success message
      setTimeout(() => setSendSuccess(false), 5000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send document')
    } finally {
      setIsSending(false)
    }
  }

  // Get field icon component
  const getFieldIcon = (fieldType: string) => {
    const field = ALL_FIELD_TYPES.find(f => f.id === fieldType)
    return field?.icon || Type
  }

  // Fields overlay for PDF viewer
  const FieldsOverlay = placedFields.filter(f => f.page === currentPage).length > 0 ? (
    <>
      {placedFields.filter(f => f.page === currentPage).map((field) => {
        const FieldIcon = getFieldIcon(field.type)
        const isSelected = field.id === selectedFieldId
        const fieldSigner = signers.find(s => s.id === field.signerId)

        return (
          <div
            key={field.id}
            className={`absolute border-2 rounded-md cursor-move transition-all group
              ${isSelected ? 'border-primary-500 shadow-lg ring-2 ring-primary-200' : 'border-dashed hover:border-primary-400'}
            `}
            style={{
              left: field.x * zoom,
              top: field.y * zoom,
              width: field.width * zoom,
              height: field.height * zoom,
              backgroundColor: `${field.signerColor}15`,
              borderColor: isSelected ? undefined : field.signerColor,
              zIndex: isSelected ? 100 : 50
            }}
            onMouseDown={(e) => handleFieldMouseDown(e, field.id)}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedFieldId(field.id)
              setShowPropertiesPanel(true)
            }}
          >
            {/* Field content */}
            <div className="w-full h-full flex items-center justify-center p-1 overflow-hidden">
              <div className="flex items-center gap-1 text-xs font-medium" style={{ color: field.signerColor }}>
                <FieldIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{field.label}</span>
              </div>
            </div>

            {/* Mandatory indicator */}
            {field.mandatory && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" title="Required" />
            )}

            {/* Signer indicator */}
            <div
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
              style={{ backgroundColor: field.signerColor }}
            >
              {fieldSigner?.name || 'Signer'}
            </div>

            {/* Resize handle */}
            {isSelected && (
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-br-md cursor-se-resize flex items-center justify-center ${isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]'}`}
                onMouseDown={(e) => handleResizeStart(e, field.id)}
              >
                <div className="w-2 h-2 border-r-2 border-b-2 border-white" />
              </div>
            )}

            {/* Delete button on hover */}
            <button
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:flex"
              onClick={(e) => {
                e.stopPropagation()
                setPlacedFields(prev => prev.filter(f => f.id !== field.id))
                if (selectedFieldId === field.id) {
                  setSelectedFieldId(null)
                  setShowPropertiesPanel(false)
                }
              }}
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        )
      })}
    </>
  ) : null

  // Render field button
  const renderFieldButton = (fieldType: { id: string; name: string; icon: any }) => {
    const Icon = fieldType.icon
    return (
      <div
        key={fieldType.id}
        draggable
        onDragStart={() => handleFieldDragStart(fieldType.id)}
        onDragEnd={() => setDraggedFieldType(null)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:scale-105"
        style={{
          backgroundColor: activeSigner ? `${activeSigner.color}15` : '#F3E8FF',
          color: activeSigner?.color || '#7C3AED'
        }}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{fieldType.name}</span>
      </div>
    )
  }

  // Mobile state
  const [showMobileFields, setShowMobileFields] = useState(false)
  const [mobileFieldToPlace, setMobileFieldToPlace] = useState<string | null>(null)

  // Touch event handlers for mobile field placement
  const handleTouchFieldPlace = useCallback((e: React.TouchEvent<HTMLDivElement>, pageNum: number) => {
    if (!mobileFieldToPlace || !activeSigner) return

    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (touch.clientX - rect.left) / zoom
    const y = (touch.clientY - rect.top) / zoom

    const fieldType = ALL_FIELD_TYPES.find(f => f.id === mobileFieldToPlace)
    if (!fieldType) return

    // Calculate field dimensions based on type
    const fieldWidth = mobileFieldToPlace === 'signature' ? 180 : mobileFieldToPlace === 'checkbox' ? 30 : 140
    const fieldHeight = mobileFieldToPlace === 'signature' ? 50 : mobileFieldToPlace === 'checkbox' ? 30 : 36

    const newField: PlacedField = {
      id: generateUUID(),
      type: mobileFieldToPlace,
      x: Math.max(0, x - fieldWidth / 2),
      y: Math.max(0, y - fieldHeight / 2),
      width: fieldWidth,
      height: fieldHeight,
      page: pageNum,
      signerId: activeSigner.id,
      signerColor: activeSigner.color,
      mandatory: true,
      placeholder: '',
      tip: '',
      label: fieldType.name,
      value: undefined
    }

    setPlacedFields(prev => [...prev, newField])
    setSelectedFieldId(newField.id)
    setMobileFieldToPlace(null)
    setShowMobileFields(false)
  }, [mobileFieldToPlace, zoom, activeSigner])

  // Mobile detection effect - MUST BE AFTER ALL OTHER HOOKS
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // EARLY RETURNS - Must be after all hooks
  // Show loading while detecting device
  if (isMobile === null) {
    return (
      <div className={`h-screen flex items-center justify-center ${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-50'}`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
      </div>
    )
  }

  // Render mobile component for mobile users
  if (isMobile) {
    return <MobileSignDocument isDark={isDark} />
  }

  return (
    <div
      className={`h-screen flex flex-col overflow-hidden ${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-50'}`}
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      onMouseMove={isDragging ? handleMouseMove : isResizing ? handleResizeMove : undefined}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Toolbar - Mobile: DocuSign-style */}
      <div className={`${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-white border-gray-200'} border-b px-3 md:px-4 py-2 md:py-3 flex items-center justify-between sticky top-0 z-50`}>
        {/* Mobile Header - When document exists */}
        {document ? (
          <>
            {/* Left - Back & Title */}
            <div className="md:hidden flex items-center gap-2 flex-1 min-w-0">
              <button
                onClick={() => setDocument(null)}
                className={`p-1.5 -ml-1 rounded-lg ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a]' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {document.name.length > 20 ? document.name.slice(0, 20) + '...' : document.name}
              </span>
            </div>
            {/* Right - Finish & Menu */}
            <div className="md:hidden flex items-center gap-1">
              <button
                onClick={() => setShowSendModal(true)}
                disabled={placedFields.length === 0}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 ${isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white'}`}
              >
                Finish
              </button>
              <button
                onClick={() => setShowTemplateModal(true)}
                className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a]' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          /* Mobile Header - No document */
          <div className="md:hidden flex items-center gap-2">
            <FileSignature className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>Sign Document</span>
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden md:flex items-center gap-4 min-w-0">
          <FileSignature className={`w-6 h-6 flex-shrink-0 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
          <span className={`text-xl font-bold truncate ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
            {templateProps.name || 'New Template'}
          </span>
        </div>

        {/* Desktop Right side - Actions */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">

          {/* Desktop buttons */}
          <button
            onClick={() => setShowTemplateModal(true)}
            className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-[#26065D]'}`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Properties</span>
          </button>

          <button
            onClick={() => { setShowShareModal(true); handleShare(); }}
            disabled={!document}
            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-[#26065D]'}`}
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium hidden lg:inline">Share</span>
          </button>

          <button
            onClick={generatePreview}
            disabled={!document || isGeneratingPreview || placedFields.filter(f => f.value).length === 0}
            className={`hidden md:flex items-center gap-2 px-2 md:px-3 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-[#26065D]'}`}
            title="Preview"
          >
            {isGeneratingPreview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm font-medium hidden lg:inline">Preview</span>
          </button>

          <div className="relative hidden md:block" ref={downloadDropdownRef}>
            <button
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              disabled={!document || isDownloading || placedFields.filter(f => f.value).length === 0}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download"
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span className="text-sm font-medium hidden md:inline">Download</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showDownloadDropdown && (
              <div className={`absolute top-full right-0 mt-1 w-40 ${isDark ? 'bg-[#252525] border-[#3a3a3a]' : 'bg-white border-gray-200'} border rounded-xl shadow-xl py-1 z-50`}>
                <button
                  onClick={() => handleDownload('pdf')}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${isDark ? 'hover:bg-[#2a2a2a] text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-xs font-bold text-red-600">PDF</span>
                  Download PDF
                </button>
                <button
                  onClick={() => handleDownload('png')}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${isDark ? 'hover:bg-[#2a2a2a] text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600">PNG</span>
                  Download PNG
                </button>
                <button
                  onClick={() => handleDownload('jpg')}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${isDark ? 'hover:bg-[#2a2a2a] text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-xs font-bold text-green-600">JPG</span>
                  Download JPG
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={!document || isSaving}
            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${saveSuccess ? 'text-green-500' : isDark ? 'text-gray-400 hover:bg-[#2a2a2a]' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckSquare className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span className="text-sm font-medium hidden lg:inline">{saveSuccess ? 'Saved!' : 'Save'}</span>
          </button>

          <button
            onClick={() => setShowSendModal(true)}
            disabled={!document || placedFields.length === 0}
            className={`hidden md:flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 font-medium rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#b8f206]' : 'bg-[#4C00FF] text-white hover:bg-[#3d00cc]'}`}
          >
            <Send className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Send</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Signers & Field Types (Hidden on mobile) */}
        <div className={`hidden md:flex w-64 lg:w-80 flex-col overflow-hidden ${isDark ? 'bg-[#252525] border-r border-[#2a2a2a]' : 'bg-white border-r border-gray-200'}`}>
          <div className="flex-1 overflow-y-auto">
            {/* Signers List */}
            {signers.map((signer, idx) => (
              <div key={signer.id} className={`${isDark ? 'border-b border-[#2a2a2a]' : 'border-b border-gray-200'}`}>
                {/* Signer Header */}
                <div
                  className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                    activeSignerId === signer.id
                      ? (isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]')
                      : (isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-50')
                  }`}
                  onClick={() => {
                    setActiveSignerId(signer.id)
                    setExpandedSignerId(expandedSignerId === signer.id ? null : signer.id)
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: signer.color }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Enter name..."
                          value={signer.name}
                          onChange={(e) => {
                            e.stopPropagation()
                            updateSigner(signer.id, 'name', e.target.value)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`font-semibold bg-transparent outline-none border-b border-transparent transition-colors w-full max-w-[140px] ${isDark ? 'text-white hover:border-[#3a3a3a] focus:border-[#c4ff0e] placeholder-gray-500' : 'text-[#26065D] hover:border-gray-300 focus:border-[#4C00FF] placeholder-gray-400'}`}
                        />
                        {signer.is_self && (
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${isDark ? 'bg-[#c4ff0e]/20 text-[#c4ff0e]' : 'bg-[#4C00FF]/20 text-[#4C00FF]'}`}>Me</span>
                        )}
                      </div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {placedFields.filter(f => f.signerId === signer.id).length} fields
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {signers.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeSigner(signer.id)
                        }}
                        className={`p-1 rounded text-red-400 ${isDark ? 'hover:bg-red-900/50' : 'hover:bg-red-50'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${isDark ? 'text-gray-400' : 'text-gray-500'} ${
                        expandedSignerId === signer.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Signer Content */}
                {expandedSignerId === signer.id && (
                  <div className="px-3 pb-4 space-y-3">
                    {/* Name Input */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a]' : 'bg-gray-50 border border-gray-200'}`}>
                      <User className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="text"
                        placeholder="Enter signer name..."
                        value={signer.name}
                        onChange={(e) => updateSigner(signer.id, 'name', e.target.value)}
                        className={`flex-1 bg-transparent text-sm outline-none ${isDark ? 'text-white placeholder-gray-500' : 'text-[#26065D] placeholder-gray-400'}`}
                      />
                    </div>
                    {/* Email Input */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a]' : 'bg-gray-50 border border-gray-200'}`}>
                      <Mail className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="email"
                        placeholder="Enter email address..."
                        value={signer.email}
                        onChange={(e) => updateSigner(signer.id, 'email', e.target.value)}
                        className={`flex-1 bg-transparent text-sm outline-none ${isDark ? 'text-white placeholder-gray-500' : 'text-[#26065D] placeholder-gray-400'}`}
                      />
                    </div>

                    {/* Fields Section */}
                    <div className="space-y-3">
                      {/* Signature Fields */}
                      <div>
                        <p className={`text-xs font-semibold mb-2 uppercase tracking-wide ${isDark ? 'text-purple-400' : 'text-[#4C00FF]'}`}>Fields</p>
                        <div className="space-y-1">
                          {SIGNATURE_FIELDS.map(field => renderFieldButton(field))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className={`border-t ${isDark ? 'border-[#3a3a3a]' : 'border-gray-200'}`} />

                      {/* Contact Fields */}
                      <div>
                        <div className="space-y-1">
                          {CONTACT_FIELDS.map(field => renderFieldButton(field))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className={`border-t ${isDark ? 'border-[#3a3a3a]' : 'border-gray-200'}`} />

                      {/* Other Fields */}
                      <div>
                        <div className="space-y-1">
                          {OTHER_FIELDS.map(field => renderFieldButton(field))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Signer Buttons */}
            <div className={`flex flex-col gap-2 p-3 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
              <button
                onClick={addMyselfAsSigner}
                disabled={signers.some(s => s.is_self)}
                className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-[#c4ff0e]/10 text-[#c4ff0e] hover:bg-[#c4ff0e]/20 border border-[#c4ff0e]/20' : 'bg-[#4C00FF]/10 text-[#4C00FF] hover:bg-[#4C00FF]/20 border border-[#4C00FF]/20'}`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Add Myself</span>
              </button>
              <button
                onClick={addSigner}
                className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${isDark ? 'text-[#c4ff0e] hover:bg-[#c4ff0e]/10' : 'text-[#4C00FF] hover:bg-[#4C00FF]/10'}`}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Other Signer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center - Document Viewer */}
        <div className={`flex-1 flex flex-col overflow-hidden ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
          {/* Toolbar - Responsive */}
          {document && (
            <div className={`px-2 md:px-4 py-2 flex items-center justify-between md:justify-center ${isDark ? 'bg-[#252525] border-b border-[#2a2a2a]' : 'bg-gray-50 border-b border-gray-200'}`}>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
                    className={`p-1.5 rounded ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'}`}
                  >
                    <ZoomOut className={`w-4 h-4 md:w-5 md:h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                  <span className={`text-xs md:text-sm min-w-[40px] md:min-w-[50px] text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                    className={`p-1.5 rounded ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'}`}
                  >
                    <ZoomIn className={`w-4 h-4 md:w-5 md:h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                  <button
                    onClick={() => setZoom(1)}
                    className={`p-1.5 rounded hidden md:block ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'}`}
                    title="Reset Zoom"
                  >
                    <RotateCcw className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                </div>

                <button
                  onClick={uploadNewDocument}
                  className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isDark
                      ? 'bg-[#2a2a2a] hover:bg-[#333] text-gray-300 border border-[#3a3a3a]'
                      : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                  title="Upload New Document"
                >
                  <Upload className="w-4 h-4" />
                  <span>New Document</span>
                </button>

                {/* Mobile info */}
                <div className={`md:hidden flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  <span>{totalPages}p</span>
                  <span>•</span>
                  <span>{placedFields.length} fields</span>
                </div>

                {/* Mobile Compact Signer Tabs */}
                <div className={`md:hidden flex items-center gap-1 ml-2`}>
                  {signers.map((signer, idx) => {
                    const isActive = activeSignerId === signer.id
                    const fieldCount = placedFields.filter(f => f.signerId === signer.id).length
                    return (
                      <button
                        key={signer.id}
                        onClick={() => {
                          setActiveSignerId(signer.id)
                          setExpandedSignerId(signer.id)
                        }}
                        className="relative flex items-center justify-center rounded-full transition-all"
                        style={{
                          width: '28px',
                          height: '28px',
                          backgroundColor: isActive ? signer.color : `${signer.color}30`,
                          boxShadow: isActive ? `0 0 0 2px white, 0 0 0 3px ${signer.color}` : 'none',
                        }}
                        title={signer.name}
                      >
                        <span
                          className="font-bold text-xs"
                          style={{ color: isActive ? '#fff' : signer.color }}
                        >
                          {idx + 1}
                        </span>
                        {fieldCount > 0 && (
                          <span
                            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                            style={{ backgroundColor: '#10B981' }}
                          >
                            {fieldCount}
                          </span>
                        )}
                      </button>
                    )
                  })}
                  {/* Add Signer button for mobile */}
                  <button
                    onClick={addSigner}
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${isDark ? 'bg-[#2a2a2a] text-gray-400' : 'bg-gray-100 text-gray-500'}`}
                    title="Add Signer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Document Area - Full screen on mobile */}
          <div
            className="flex-1 overflow-auto p-2 md:p-6 flex justify-center items-start"
            style={{ WebkitOverflowScrolling: 'touch' }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDocumentDrop}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center my-auto">
                <Loader2 className={`w-12 h-12 animate-spin mb-4 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                <p className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Converting image to PDF...
                </p>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  This ensures perfect field positioning
                </p>
              </div>
            ) : !document ? (
              <label className={`w-full max-w-2xl rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-8 md:p-12 my-auto mx-4 md:mx-0 active:scale-[0.99] ${isDark ? 'bg-[#252525] border-[#3a3a3a] hover:border-[#c4ff0e]/50 hover:bg-[#2a2a2a]' : 'bg-white border-gray-300 hover:border-[#4C00FF]/50 hover:bg-gray-50'}`}>
                <input
                  type="file"
                  accept=".pdf,application/pdf,image/png,image/jpeg,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-[#c4ff0e]/20' : 'bg-[#4C00FF]/10'}`}>
                  <Upload className={`w-10 h-10 md:w-12 md:h-12 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                </div>
                <h3 className={`text-xl md:text-2xl font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
                  Upload Document
                </h3>
                <p className={`text-center text-sm md:text-base mb-4 max-w-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className="hidden md:inline">Drag and drop your document here, or click to browse</span>
                  <span className="md:hidden">Tap here to select your document</span>
                </p>
                <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-[#2a2a2a]">
                    <FileText className="w-3 h-3" /> PDF, PNG, JPG
                  </span>
                  <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-[#2a2a2a]">Max 25MB</span>
                </div>
              </label>
            ) : (
              <div
                ref={documentContainerRef}
                className={`relative max-h-full overflow-auto pb-20 md:pb-0 mx-auto shadow-lg ${isDark ? 'bg-[#252525]' : 'bg-white'}`}
              >
                {isPDF ? (
                  <PDFViewer
                    file={document}
                    zoom={zoom}
                    continuousScroll={true}
                    onTotalPagesChange={setTotalPages}
                    onPageClick={(e, pageNum, pdfPageWidth, pdfPageHeight) => {
                      // Handle both desktop drag-drop and mobile tap-to-place
                      const fieldTypeToPlace = draggedFieldType || mobileFieldToPlace
                      if (fieldTypeToPlace && activeSigner) {
                        const rect = e.currentTarget.getBoundingClientRect()
                        // Use ACTUAL rendered dimensions for robust coordinate calculation
                        // This handles CSS constraints (max-width) that may cause container
                        // to be smaller than pdfPageWidth * zoom
                        const clickXPct = (e.clientX - rect.left) / rect.width
                        const clickYPct = (e.clientY - rect.top) / rect.height
                        // Convert percentage to base PDF points
                        const x = clickXPct * pdfPageWidth
                        const y = clickYPct * pdfPageHeight

                        const fieldType = ALL_FIELD_TYPES.find(f => f.id === fieldTypeToPlace)
                        if (!fieldType) return

                        // Calculate field dimensions based on type and device (in base space)
                        const isMobileDevice = window.innerWidth < 768
                        const fieldWidth = fieldTypeToPlace === 'signature' ? (isMobileDevice ? 160 : 200) : fieldTypeToPlace === 'checkbox' ? 30 : (isMobileDevice ? 130 : 150)
                        const fieldHeight = fieldTypeToPlace === 'signature' ? (isMobileDevice ? 45 : 60) : fieldTypeToPlace === 'checkbox' ? 30 : (isMobileDevice ? 32 : 40)

                        const pageBaseWidth = pdfPageWidth
                        const pageBaseHeight = pdfPageHeight

                        // Calculate percentage using PDF page dimensions
                        const xPercent = Math.max(0, (x - fieldWidth / 2) / pageBaseWidth)
                        const yPercent = Math.max(0, (y - fieldHeight / 2) / pageBaseHeight)

                        const newField: PlacedField = {
                          id: generateUUID(),
                          type: fieldTypeToPlace,
                          x: Math.max(0, x - fieldWidth / 2),
                          y: Math.max(0, y - fieldHeight / 2),
                          width: fieldWidth,
                          height: fieldHeight,
                          page: pageNum,
                          signerId: activeSigner.id,
                          signerColor: activeSigner.color,
                          mandatory: true,
                          placeholder: '',
                          tip: '',
                          label: fieldType.name,
                          value: undefined,
                          // Store percentage position for preview
                          xPercent: Math.max(0, xPercent),
                          yPercent: Math.max(0, yPercent),
                          widthPercent: fieldWidth / pageBaseWidth,
                          heightPercent: fieldHeight / pageBaseHeight,
                          // Store page dimensions for recalculating percentages on drag
                          pageBaseWidth,
                          pageBaseHeight
                        }

                        setPlacedFields(prev => [...prev, newField])
                        setSelectedFieldId(newField.id)
                        setDraggedFieldType(null)
                        setMobileFieldToPlace(null)
                        setShowPropertiesPanel(true)

                        // Auto-open editing for text fields, signature/stamp modals for those types
                        const textTypes = ['text', 'name', 'firstName', 'lastName', 'email', 'company', 'title']
                        if (textTypes.includes(fieldTypeToPlace)) {
                          setEditingFieldId(newField.id)
                        } else if (fieldTypeToPlace === 'signature' || fieldTypeToPlace === 'initials') {
                          setSignatureModalFieldId(newField.id)
                        } else if (fieldTypeToPlace === 'stamp') {
                          setStampModalFieldId(newField.id)
                        }
                      }
                    }}
                    renderFieldsForPage={(pageNum, pageWidth, pageHeight) => {
                      const fieldsOnPage = placedFields.filter(f => f.page === pageNum)
                      if (fieldsOnPage.length === 0) return null

                      return fieldsOnPage.map((field) => {
                        const FieldIcon = getFieldIcon(field.type)
                        const isSelected = field.id === selectedFieldId
                        const isEditing = field.id === editingFieldId
                        const fieldSigner = signers.find(s => s.id === field.signerId)
                        const hasValue = !!field.value

                        // Check if this is a signature/initials type field
                        const isSignatureType = field.type === 'signature' || field.type === 'initials'
                        const isTextType = ['text', 'name', 'firstName', 'lastName', 'email', 'company', 'title'].includes(field.type)
                        const isCheckboxType = field.type === 'checkbox'
                        const isDateType = field.type === 'date'

                        // If signature field has value, show clean display
                        const isSignedField = isSignatureType && hasValue
                        const isCleanField = isSignedField

                        return (
                          <div
                            key={field.id}
                            className={`pointer-events-auto absolute transition-all group cursor-move
                              ${isEditing ? 'z-[200]' : ''}
                            `}
                            style={{
                              // CSS percentage positioning: robust against CSS constraints
                              // pageWidth/pageHeight = page.width * zoom / page.height * zoom
                              // field.x is in base (unzoomed) PDF points
                              // Percentage = field.x / pageBaseWidth = field.x / (pageWidth / zoom)
                              left: field.xPercent !== undefined
                                ? `${field.xPercent * 100}%`
                                : `${(field.x / (pageWidth / zoom)) * 100}%`,
                              top: field.yPercent !== undefined
                                ? `${field.yPercent * 100}%`
                                : `${(field.y / (pageHeight / zoom)) * 100}%`,
                              width: field.widthPercent
                                ? `${field.widthPercent * 100}%`
                                : `${(field.width / (pageWidth / zoom)) * 100}%`,
                              height: field.heightPercent
                                ? `${field.heightPercent * 100}%`
                                : `${(field.height / (pageHeight / zoom)) * 100}%`,
                              zIndex: isEditing ? 200 : (isSelected ? 100 : 50),
                              border: (hasValue && !isEditing) ? 'none' : `2px ${isSelected ? 'solid' : 'dashed'} ${field.signerColor}`,
                              backgroundColor: (hasValue && !isEditing) ? 'transparent' : `${field.signerColor}10`,
                              borderRadius: '6px',
                            }}
                            onMouseDown={(e) => {
                              if (!isEditing) handleFieldMouseDown(e, field.id)
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!isEditing) {
                                setSelectedFieldId(field.id)
                                setShowPropertiesPanel(true)
                              }
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation()
                              setSelectedFieldId(field.id)
                              if (field.type === 'signature' || field.type === 'initials') {
                                setSignatureModalFieldId(field.id)
                              } else if (field.type === 'stamp') {
                                setStampModalFieldId(field.id)
                              } else {
                                setEditingFieldId(field.id)
                              }
                            }}
                          >
                            {/* Field Content - NO offset, fills entire field */}
                            <div className="w-full h-full relative" style={{ overflow: (hasValue && !isEditing) ? 'hidden' : undefined, borderRadius: '6px' }}>
                            {/* Editing Mode - Skip for signature types */}
                            {isEditing && !isSignatureType ? (
                              <>
                                {/* Text Editor - Floating popup above the field */}
                                {isTextType && (
                                  <>
                                  <div
                                    className="absolute z-[300] flex flex-col bg-white shadow-2xl rounded-lg border border-gray-300"
                                    style={{
                                      bottom: '100%',
                                      left: '0',
                                      marginBottom: '8px',
                                      minWidth: '320px',
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* Size Control Header */}
                                    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                                      <span className="text-sm font-bold text-gray-700 mr-2">Size:</span>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        {(field.type === 'title' ? [
                                          { label: 'H1', size: 32 },
                                          { label: 'H2', size: 24 },
                                          { label: 'H3', size: 20 },
                                          { label: 'H4', size: 16 },
                                        ] : [
                                          { label: '10', size: 10 },
                                          { label: '12', size: 12 },
                                          { label: '14', size: 14 },
                                          { label: '16', size: 16 },
                                          { label: '18', size: 18 },
                                          { label: '20', size: 20 },
                                          { label: '24', size: 24 },
                                        ]).map((item) => (
                                          <button
                                            key={item.size}
                                            onClick={() => updateFieldFontSize(field.id, item.size)}
                                            className={`px-2.5 py-1.5 text-sm font-semibold rounded-md transition-all ${
                                              field.fontSize === item.size
                                                ? 'bg-[#4C00FF] text-white shadow-md'
                                                : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-[#4C00FF]/10 hover:border-[#4C00FF]'
                                            }`}
                                          >
                                            {item.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    {/* Input */}
                                    <input
                                      type={field.type === 'email' ? 'email' : 'text'}
                                      value={field.value || ''}
                                      onChange={(e) => updateFieldValue(field.id, e.target.value)}
                                      placeholder={field.placeholder || `Type ${field.label}...`}
                                      className="w-full px-3 py-3 border-none outline-none"
                                      style={{ color: '#000000', backgroundColor: '#ffffff', fontSize: `${Math.max(field.fontSize || 14, 14)}px`, fontWeight: field.type === 'title' ? '600' : '400' }}
                                      autoFocus
                                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingFieldId(null) }}
                                    />
                                    {/* Done button */}
                                    <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-lg">
                                      <button onClick={() => setEditingFieldId(null)} className="px-5 py-2 bg-[#4C00FF] text-white text-sm font-semibold rounded-md hover:bg-[#3d00cc] transition-colors shadow-sm">Done</button>
                                    </div>
                                    {/* Arrow pointing down to field */}
                                    <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white border-r border-b border-gray-300 transform rotate-45"></div>
                                  </div>
                                  {/* Show typed value or placeholder inside the field during editing */}
                                  <div className="w-full h-full flex items-center px-2" style={{ overflow: 'hidden' }}>
                                    {field.value ? (
                                      <span style={{
                                        color: '#000000',
                                        fontSize: `${field.fontSize || 14}px`,
                                        fontWeight: field.type === 'title' ? '600' : '400',
                                        whiteSpace: 'nowrap'
                                      }}>{field.value}</span>
                                    ) : (
                                      <div className="flex items-center gap-1" style={{ color: field.signerColor }}>
                                        <FieldIcon className="w-4 h-4" />
                                        <span className="text-xs font-medium">{field.label}</span>
                                      </div>
                                    )}
                                  </div>
                                  </>
                                )}

                                {/* Checkbox/Radio Editor */}
                                {isCheckboxType && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        updateFieldValue(field.id, field.value === 'checked' ? '' : 'checked')
                                        setEditingFieldId(null)
                                      }}
                                      className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors
                                        ${field.value === 'checked' ? 'bg-[#4C00FF] border-[#4C00FF]' : 'border-gray-500 hover:border-[#4C00FF]/60'}
                                      `}
                                    >
                                      {field.value === 'checked' && (
                                        <CheckSquare className="w-4 h-4 text-white" />
                                      )}
                                    </button>
                                  </div>
                                )}

                                {/* Date Editor - Simple date picker */}
                                {isDateType && (
                                  <div className="w-full h-full flex items-center justify-center bg-white" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="date"
                                      value={field.value || ''}
                                      onChange={(e) => {
                                        updateFieldValue(field.id, e.target.value)
                                        // Auto close after selecting date
                                        if (e.target.value) {
                                          setTimeout(() => setEditingFieldId(null), 100)
                                        }
                                      }}
                                      className="w-full h-full px-2 text-sm border-none outline-none bg-transparent"
                                      style={{ fontSize: `${field.fontSize || 14}px` }}
                                      autoFocus
                                    />
                                  </div>
                                )}

                                {/* Stamp Editor */}
                                {field.type === 'stamp' && (
                                  <div className="w-full h-full flex flex-col p-2 bg-white overflow-auto" onClick={(e) => e.stopPropagation()}>
                                    {/* Upload & Camera */}
                                    {!stampImage && !showStampCamera && !processingStamp && (
                                      <div className="flex gap-2 mb-2">
                                        <button
                                          onClick={() => stampFileInputRef.current?.click()}
                                          className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#4C00FF] text-white rounded text-xs hover:bg-[#3d00cc]"
                                        >
                                          <Upload className="w-3 h-3" /> Upload
                                        </button>
                                        <button
                                          onClick={startStampCamera}
                                          className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#4C00FF] text-white rounded text-xs hover:bg-[#3d00cc]"
                                        >
                                          <Camera className="w-3 h-3" /> Camera
                                        </button>
                                        <input
                                          ref={stampFileInputRef}
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleStampUpload(e, field.id)}
                                          className="hidden"
                                        />
                                      </div>
                                    )}

                                    {/* Camera View */}
                                    {showStampCamera && (
                                      <div className="relative mb-2">
                                        <video ref={stampVideoRef} autoPlay playsInline className="w-full h-24 object-cover rounded" />
                                        <div className="flex gap-1 mt-1">
                                          <button onClick={captureStampImage} className="flex-1 py-1 bg-[#4C00FF] text-white rounded text-xs font-medium">Capture</button>
                                          <button onClick={() => { const s = stampVideoRef.current?.srcObject as MediaStream; s?.getTracks().forEach(t => t.stop()); setShowStampCamera(false) }} className="flex-1 py-1 bg-red-500 text-white rounded text-xs">Cancel</button>
                                        </div>
                                      </div>
                                    )}

                                    {/* Processing */}
                                    {processingStamp && (
                                      <div className="flex items-center justify-center gap-1 py-4">
                                        <Loader2 className="w-4 h-4 animate-spin text-[#4C00FF]" />
                                        <span className="text-xs text-gray-500">Processing...</span>
                                      </div>
                                    )}

                                    {/* Preview */}
                                    {stampImage && !processingStamp && (
                                      <div className="mb-2">
                                        <div className="bg-gray-100 rounded p-2 flex justify-center" style={{ backgroundImage: 'linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)', backgroundSize: '10px 10px' }}>
                                          <img src={stampImage} alt="Stamp" className="max-h-16 object-contain" />
                                        </div>
                                        <div className="flex gap-1 mt-1">
                                          <button onClick={() => setStampImage(null)} className="flex-1 py-1 bg-gray-200 text-gray-700 rounded text-xs">Clear</button>
                                          <button onClick={() => saveStampToField(field.id)} className="flex-1 py-1 bg-[#4C00FF] text-white rounded text-xs font-medium">Use</button>
                                        </div>
                                      </div>
                                    )}

                                    {/* Text Stamps */}
                                    {!stampImage && !showStampCamera && !processingStamp && (
                                      <>
                                        <p className="text-[10px] text-gray-500 mb-1">Or text stamp:</p>
                                        <div className="grid grid-cols-3 gap-1">
                                          {['APPROVED', 'DRAFT', 'FINAL', 'COPY', 'VOID', 'PAID'].map((s) => (
                                            <button key={s} onClick={() => { updateFieldValue(field.id, s); setEditingFieldId(null) }} className="py-1 bg-gray-100 hover:bg-gray-200 rounded text-[9px] font-bold text-red-500 border border-red-300">{s}</button>
                                          ))}
                                        </div>
                                      </>
                                    )}

                                    <button onClick={() => { setEditingFieldId(null); setStampImage(null); setShowStampCamera(false) }} className="mt-2 py-1 bg-gray-300 text-gray-700 rounded text-xs">Cancel</button>
                                  </div>
                                )}
                              </>
                            ) : (
                              /* Display Mode - NO padding, fills entire field */
                              <>
                                {hasValue ? (
                                  <>
                                    {/* Signature/Initials Display - FILLS ENTIRE FIELD */}
                                    {isSignatureType && field.value && (
                                      <img
                                        src={field.value}
                                        alt="Signature"
                                        className="w-full h-full object-contain"
                                        style={{ display: 'block' }}
                                      />
                                    )}
                                    {/* Text Fields Display */}
                                    {isTextType && (
                                      <div className="w-full h-full flex items-center px-2" style={{ overflow: 'hidden' }}>
                                        <span style={{
                                          color: '#000000',
                                          fontSize: `${field.fontSize || 14}px`,
                                          fontWeight: field.type === 'title' ? '600' : '400',
                                          whiteSpace: 'nowrap'
                                        }}>{field.value}</span>
                                      </div>
                                    )}
                                    {/* Checkbox Display */}
                                    {isCheckboxType && field.value === 'checked' && (
                                      <div className="w-full h-full flex items-center justify-center bg-green-500 rounded">
                                        <CheckSquare className="w-5 h-5 text-white" />
                                      </div>
                                    )}
                                    {/* Date Display */}
                                    {isDateType && field.value && (
                                      <div className="w-full h-full flex items-center px-2">
                                        <span style={{ color: '#000000', fontSize: `${field.fontSize || 14}px`, fontWeight: '500' }}>
                                          {new Date(field.value).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                        </span>
                                      </div>
                                    )}
                                    {/* Stamp Display */}
                                    {field.type === 'stamp' && field.value && (
                                      field.value.startsWith('data:image') ? (
                                        <img src={field.value} alt="Stamp" className="w-full h-full object-fill" style={{ display: 'block' }} />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <span className="text-red-600 font-bold border border-red-600 px-1 rounded transform -rotate-12 text-xs">{field.value}</span>
                                        </div>
                                      )
                                    )}
                                  </>
                                ) : (
                                  /* Empty Field Placeholder - Purple theme like first image */
                                  <div className="w-full h-full flex flex-col items-center justify-center" style={{ color: field.signerColor }}>
                                    <FieldIcon className="w-5 h-5 mb-1" />
                                    <span className="text-xs font-medium">{field.label}</span>
                                  </div>
                                )}
                              </>
                            )}
                            </div>

                            {/* Gray Corner Handles - DocuSign Style */}
                            {isSelected && (
                              <>
                                {/* Top-Left Handle */}
                                <div
                                  className="absolute -top-2 -left-2 w-4 h-4 bg-gray-400 rounded-full cursor-nw-resize border-2 border-white shadow"
                                  onMouseDown={(e) => handleResizeStart(e, field.id, 'nw')}
                                />
                                {/* Top-Right Handle */}
                                <div
                                  className="absolute -top-2 -right-2 w-4 h-4 bg-gray-400 rounded-full cursor-ne-resize border-2 border-white shadow"
                                  onMouseDown={(e) => handleResizeStart(e, field.id, 'ne')}
                                />
                                {/* Bottom-Left Handle */}
                                <div
                                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-gray-400 rounded-full cursor-sw-resize border-2 border-white shadow"
                                  onMouseDown={(e) => handleResizeStart(e, field.id, 'sw')}
                                />
                                {/* Bottom-Right Handle */}
                                <div
                                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-gray-400 rounded-full cursor-se-resize border-2 border-white shadow"
                                  onMouseDown={(e) => handleResizeStart(e, field.id, 'se')}
                                />
                              </>
                            )}

                            {/* Red X Delete Button - DocuSign Style */}
                            {isSelected && (
                              <button
                                className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 z-10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPlacedFields(prev => prev.filter(f => f.id !== field.id))
                                  if (selectedFieldId === field.id) {
                                    setSelectedFieldId(null)
                                    setShowPropertiesPanel(false)
                                  }
                                }}
                              >
                                <X className="w-4 h-4 text-white" />
                              </button>
                            )}
                          </div>
                        )
                      })
                    }}
                  />
                ) : documentPreview && imageDimensions && (
                  <div
                    className="relative"
                    data-image-container="true"
                    style={{
                      width: imageDimensions.width * zoom,
                      height: imageDimensions.height * zoom
                    }}
                    onClick={(e) => {
                      // Handle field placement on click for images
                      const fieldTypeToPlace = draggedFieldType || mobileFieldToPlace

                      if (fieldTypeToPlace && activeSigner && imageDimensions) {
                        const fieldType = ALL_FIELD_TYPES.find(f => f.id === fieldTypeToPlace)
                        if (!fieldType) return

                        // Calculate field dimensions based on type and device
                        const isMobileDevice = window.innerWidth < 768
                        const fieldWidth = fieldTypeToPlace === 'signature' ? (isMobileDevice ? 160 : 200) : fieldTypeToPlace === 'checkbox' ? 30 : (isMobileDevice ? 130 : 150)
                        const fieldHeight = fieldTypeToPlace === 'signature' ? (isMobileDevice ? 45 : 60) : fieldTypeToPlace === 'checkbox' ? 30 : (isMobileDevice ? 32 : 40)

                        // Get container's bounding rect
                        const rect = e.currentTarget.getBoundingClientRect()

                        // Click position relative to the container
                        const clickX = e.clientX - rect.left
                        const clickY = e.clientY - rect.top

                        // Use ACTUAL rendered container dimensions (from getBoundingClientRect)
                        // This is robust against CSS constraints (max-width, height:auto, etc.)
                        // that might cause actual size to differ from styled size
                        const xPct = clickX / rect.width
                        const yPct = clickY / rect.height

                        // Field dimensions as percentages
                        const pageBaseWidth = imageDimensions.width
                        const pageBaseHeight = imageDimensions.height
                        const widthPercent = fieldWidth / pageBaseWidth
                        const heightPercent = fieldHeight / pageBaseHeight

                        // Store percentage (clamped, centered on click)
                        const xPercent = Math.max(0, Math.min(1 - widthPercent, xPct - widthPercent / 2))
                        const yPercent = Math.max(0, Math.min(1 - heightPercent, yPct - heightPercent / 2))

                        const newField: PlacedField = {
                          id: generateUUID(),
                          type: fieldTypeToPlace,
                          // Store BASE coordinates (calculated from percentage)
                          x: xPercent * pageBaseWidth,
                          y: yPercent * pageBaseHeight,
                          width: fieldWidth,
                          height: fieldHeight,
                          page: 1,
                          signerId: activeSigner.id,
                          signerColor: activeSigner.color,
                          mandatory: true,
                          placeholder: '',
                          tip: '',
                          label: fieldType.name,
                          value: undefined,
                          // Store percentage position for preview
                          xPercent,
                          yPercent,
                          widthPercent,
                          heightPercent,
                          // Store page dimensions for recalculating percentages on drag
                          pageBaseWidth,
                          pageBaseHeight
                        }

                        setPlacedFields(prev => [...prev, newField])
                        setSelectedFieldId(newField.id)
                        setDraggedFieldType(null)
                        setMobileFieldToPlace(null)
                        setShowPropertiesPanel(true)

                        // Auto-open editing for text fields, signature/stamp modals for those types
                        const textTypes = ['text', 'name', 'firstName', 'lastName', 'email', 'company', 'title']
                        if (textTypes.includes(fieldTypeToPlace)) {
                          setEditingFieldId(newField.id)
                        } else if (fieldTypeToPlace === 'signature' || fieldTypeToPlace === 'initials') {
                          setSignatureModalFieldId(newField.id)
                        } else if (fieldTypeToPlace === 'stamp') {
                          setStampModalFieldId(newField.id)
                        }
                      }
                    }}
                  >
                    <img
                      src={documentPreview}
                      alt="Document"
                      className="max-w-none"
                      style={{
                        width: imageDimensions.width * zoom,
                        height: imageDimensions.height * zoom
                      }}
                      draggable={false}
                    />
                    {/* Fields overlay for images */}
                    {placedFields.filter(f => f.page === 1).map((field, index) => {
                      const FieldIcon = getFieldIcon(field.type)
                      const isSelected = field.id === selectedFieldId
                      const isEditing = field.id === editingFieldId
                      const fieldSigner = signers.find(s => s.id === field.signerId)
                      const hasValue = !!field.value
                      const isSignatureType = field.type === 'signature' || field.type === 'initials'

                      // CSS percentage positioning: robust against CSS constraints
                      // Instead of calculating pixel positions (which can mismatch if CSS
                      // constrains the container), use percentages that are always relative
                      // to the container's ACTUAL rendered dimensions.
                      const displayLeft = field.xPercent !== undefined
                        ? `${field.xPercent * 100}%`
                        : `${(field.x / imageDimensions.width) * 100}%`
                      const displayTop = field.yPercent !== undefined
                        ? `${field.yPercent * 100}%`
                        : `${(field.y / imageDimensions.height) * 100}%`
                      const displayWidth = `${((field.widthPercent || field.width / imageDimensions.width) * 100)}%`
                      const displayHeight = `${((field.heightPercent || field.height / imageDimensions.height) * 100)}%`


                      return (
                        <div
                          key={field.id}
                          className={`absolute cursor-move transition-all group
                            ${isSelected ? 'ring-2 ring-offset-2' : 'hover:ring-1 hover:ring-offset-1'}
                          `}
                          style={{
                            left: displayLeft,
                            top: displayTop,
                            width: displayWidth,
                            height: displayHeight,
                            backgroundColor: hasValue ? 'transparent' : `${field.signerColor}15`,
                            borderWidth: hasValue ? 0 : 2,
                            borderStyle: isSelected ? 'solid' : 'dashed',
                            borderColor: field.signerColor,
                            borderRadius: '0.375rem',
                            // @ts-ignore - CSS custom property for Tailwind ring color
                            '--tw-ring-color': field.signerColor,
                            zIndex: isSelected ? 100 : 50
                          } as React.CSSProperties}
                          onMouseDown={(e) => {
                            if (!isEditing) handleFieldMouseDown(e, field.id)
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (isSignatureType && !hasValue) {
                              setSignatureModalFieldId(field.id)
                              setSignatureTab('style')
                            } else if (field.type === 'stamp' && !hasValue) {
                              setStampModalFieldId(field.id)
                            } else if (field.type === 'checkbox') {
                              setPlacedFields(prev => prev.map(f =>
                                f.id === field.id ? { ...f, value: f.value === 'checked' ? undefined : 'checked' } : f
                              ))
                            } else if (!isSignatureType && field.type !== 'stamp' && field.type !== 'checkbox') {
                              setEditingFieldId(field.id)
                            }
                            setSelectedFieldId(field.id)
                            setShowPropertiesPanel(true)
                          }}
                        >
                          {hasValue ? (
                            <>
                              {(field.type === 'signature' || field.type === 'initials') && (
                                <img
                                  src={field.value}
                                  alt={field.type}
                                  className="w-full h-full object-contain"
                                  draggable={false}
                                />
                              )}
                              {field.type === 'stamp' && field.value?.startsWith('data:image') && (
                                <img
                                  src={field.value}
                                  alt="Stamp"
                                  className="w-full h-full object-fill"
                                  style={{ display: 'block' }}
                                  draggable={false}
                                />
                              )}
                              {field.type === 'checkbox' && field.value === 'checked' && (
                                <div className="w-full h-full bg-green-500 rounded flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {field.type !== 'signature' && field.type !== 'initials' && field.type !== 'stamp' && field.type !== 'checkbox' && (
                                <div className="w-full h-full flex items-center px-2" style={{ fontSize: (field.fontSize || 14) * zoom, overflow: 'hidden' }}>
                                  <span className="text-gray-800" style={{ whiteSpace: 'nowrap' }}>{field.value}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {isEditing && !isSignatureType && field.type !== 'checkbox' && field.type !== 'stamp' ? (
                                <input
                                  type="text"
                                  autoFocus
                                  className="w-full h-full px-2 text-sm bg-white border-0 outline-none"
                                  style={{ fontSize: (field.fontSize || 14) * zoom }}
                                  placeholder={field.placeholder || field.label}
                                  onBlur={(e) => {
                                    const value = e.target.value.trim()
                                    if (value) {
                                      setPlacedFields(prev => prev.map(f =>
                                        f.id === field.id ? { ...f, value } : f
                                      ))
                                    }
                                    setEditingFieldId(null)
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const value = (e.target as HTMLInputElement).value.trim()
                                      if (value) {
                                        setPlacedFields(prev => prev.map(f =>
                                          f.id === field.id ? { ...f, value } : f
                                        ))
                                      }
                                      setEditingFieldId(null)
                                    }
                                  }}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center p-1 overflow-hidden">
                                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: field.signerColor }}>
                                    <FieldIcon className="w-4 h-4 flex-shrink-0" style={{ transform: `scale(${Math.min(zoom, 1.5)})` }} />
                                    <span className="truncate" style={{ fontSize: 12 * Math.min(zoom, 1.5) }}>{field.label}</span>
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {/* Signer indicator */}
                          {!hasValue && (
                            <div
                              className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-medium text-white whitespace-nowrap"
                              style={{ backgroundColor: field.signerColor, transform: `translateX(-50%) scale(${Math.min(zoom, 1.5)})` }}
                            >
                              {fieldSigner?.name || 'Signer'}
                            </div>
                          )}

                          {/* Mandatory indicator */}
                          {field.mandatory && !hasValue && (
                            <div
                              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                              title="Required"
                              style={{ transform: `scale(${Math.min(zoom, 1.5)})` }}
                            />
                          )}

                          {/* Resize handle */}
                          {isSelected && (
                            <>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-br-md cursor-se-resize ${isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]'}`}
                                onMouseDown={(e) => handleResizeStart(e, field.id, 'se')}
                              />
                            </>
                          )}

                          {/* Red X Delete Button */}
                          {isSelected && (
                            <button
                              className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 z-10"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPlacedFields(prev => prev.filter(f => f.id !== field.id))
                                if (selectedFieldId === field.id) {
                                  setSelectedFieldId(null)
                                  setShowPropertiesPanel(false)
                                }
                              }}
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Field Properties (Desktop) / Bottom Sheet (Mobile) */}
        {showPropertiesPanel && selectedField && (
          <div className={`
            fixed md:relative inset-x-0 bottom-0 md:inset-auto
            md:w-64 lg:w-72 flex flex-col
            max-h-[60vh] md:max-h-none md:h-full
            z-40 md:z-auto
            rounded-t-2xl md:rounded-none
            shadow-2xl md:shadow-none
            ${isDark ? 'bg-[#252525] border-t md:border-t-0 md:border-l border-[#2a2a2a]' : 'bg-white border-t md:border-t-0 md:border-l border-gray-200'}
          `}>
            <div className={`p-4 flex items-center justify-between ${isDark ? 'border-b border-[#2a2a2a]' : 'border-b border-gray-200'}`}>
              <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>Field Properties</h2>
              <button
                onClick={() => setShowPropertiesPanel(false)}
                className={`p-1 rounded ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Field Type Display */}
              <div className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-50'}`}>
                {(() => {
                  const Icon = getFieldIcon(selectedField.type)
                  return (
                    <>
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${selectedField.signerColor}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: selectedField.signerColor }} />
                      </div>
                      <div>
                        <p className={`font-medium capitalize ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{selectedField.type}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Field Type</p>
                      </div>
                    </>
                  )
                })()}
              </div>

              {/* Label */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Label</label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={(e) => updateFieldProperty('label', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50 focus:border-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50 focus:border-[#4C00FF]/50'}`}
                />
              </div>

              {/* Assigned Signer */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Assigned To</label>
                <select
                  value={selectedField.signerId}
                  onChange={(e) => {
                    const signer = signers.find(s => s.id === e.target.value)
                    updateFieldProperty('signerId', e.target.value)
                    if (signer) updateFieldProperty('signerColor', signer.color)
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50 focus:border-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50 focus:border-[#4C00FF]/50'}`}
                >
                  {signers.map((signer) => (
                    <option key={signer.id} value={signer.id}>{signer.name}</option>
                  ))}
                </select>
              </div>

              {/* Mandatory Toggle */}
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Required</label>
                <button
                  onClick={() => updateFieldProperty('mandatory', !selectedField.mandatory)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    selectedField.mandatory ? (isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]') : (isDark ? 'bg-[#3a3a3a]' : 'bg-gray-300')
                  }`}
                >
                  <div className={`absolute w-4 h-4 rounded-full top-1 transition-transform ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'} ${
                    selectedField.mandatory ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Placeholder */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Placeholder</label>
                <input
                  type="text"
                  value={selectedField.placeholder}
                  onChange={(e) => updateFieldProperty('placeholder', e.target.value)}
                  placeholder="Enter placeholder text..."
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50 focus:border-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50 focus:border-[#4C00FF]/50'}`}
                />
              </div>

              {/* Tip */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tooltip</label>
                <input
                  type="text"
                  value={selectedField.tip}
                  onChange={(e) => updateFieldProperty('tip', e.target.value)}
                  placeholder="Help text for signer..."
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50 focus:border-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50 focus:border-[#4C00FF]/50'}`}
                />
              </div>

              {/* Size */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Size</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Width</label>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateFieldProperty('width', Math.max(30, selectedField.width - 10))}
                        className={`p-1 rounded ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
                      >
                        <Minus className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      </button>
                      <span className={`flex-1 text-center text-sm ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{Math.round(selectedField.width)}</span>
                      <button
                        onClick={() => updateFieldProperty('width', selectedField.width + 10)}
                        className={`p-1 rounded ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
                      >
                        <Plus className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Height</label>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateFieldProperty('height', Math.max(20, selectedField.height - 10))}
                        className={`p-1 rounded ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
                      >
                        <Minus className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      </button>
                      <span className={`flex-1 text-center text-sm ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{Math.round(selectedField.height)}</span>
                      <button
                        onClick={() => updateFieldProperty('height', selectedField.height + 10)}
                        className={`p-1 rounded ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
                      >
                        <Plus className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Position */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Position</label>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className={`rounded-lg p-2 text-center ${isDark ? 'bg-[#2a2a2a] text-white' : 'bg-gray-50 text-[#26065D]'}`}>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>X:</span> {Math.round(selectedField.x)}
                  </div>
                  <div className={`rounded-lg p-2 text-center ${isDark ? 'bg-[#2a2a2a] text-white' : 'bg-gray-50 text-[#26065D]'}`}>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Y:</span> {Math.round(selectedField.y)}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`p-4 space-y-2 ${isDark ? 'border-t border-[#2a2a2a]' : 'border-t border-gray-200'}`}>
              <button
                onClick={duplicateSelectedField}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a]' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm font-medium">Duplicate</span>
              </button>
              <button
                onClick={deleteSelectedField}
                className={`w-full flex items-center justify-center gap-2 py-2 text-red-400 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-50'}`}
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Floating Fields Button - Right Side */}
        {document && !showMobileFields && (
          <button
            onClick={() => setShowMobileFields(true)}
            className={`md:hidden fixed right-3 z-40 flex items-center gap-1.5 px-3 py-2.5 rounded-full shadow-lg transition-all active:scale-95 ${isDark ? 'bg-[#333] text-white' : 'bg-white text-gray-700 shadow-md border border-gray-200'}`}
            style={{ bottom: 'calc(60px + env(safe-area-inset-bottom))' }}
          >
            <PenLine className={`w-4 h-4 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
            <span className="text-sm font-medium">Fields</span>
          </button>
        )}

        {/* Mobile field placement indicator - Top banner */}
        {mobileFieldToPlace && (
          <div
            className={`md:hidden fixed top-14 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between ${isDark ? 'bg-[#4C00FF]' : 'bg-[#4C00FF]'}`}
          >
            <span className="text-white text-sm font-medium">
              Tap on document to place {ALL_FIELD_TYPES.find(f => f.id === mobileFieldToPlace)?.name}
            </span>
            <button
              onClick={() => setMobileFieldToPlace(null)}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Mobile Bottom Bar - Page info & Send */}
        {document && (
          <div
            className={`md:hidden fixed bottom-0 left-0 right-0 z-20 ${isDark ? 'bg-[#1e1e1e] border-t border-[#2a2a2a]' : 'bg-gray-100 border-t border-gray-200'}`}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="flex items-center justify-between px-4 py-2">
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                <span className="font-medium">{document.name.split('.')[0]}</span>
                <span className="mx-2">•</span>
                <span>{currentPage} of {totalPages}</span>
              </div>
              <button
                onClick={() => setShowSendModal(true)}
                disabled={placedFields.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white'}`}
              >
                <Mail className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        )}

        {/* Mobile Fields Popup - Small Compact Box */}
        {showMobileFields && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Transparent backdrop */}
            <div className="absolute inset-0" onClick={() => setShowMobileFields(false)} />

            {/* Small popup - positioned above Fields button */}
            <div
              className={`absolute right-2 rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-white shadow-xl'}`}
              style={{
                bottom: 'calc(110px + env(safe-area-inset-bottom))',
                width: '280px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Arrow pointing to button */}
              <div
                className={`absolute -bottom-2 right-8 w-4 h-4 rotate-45 ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}
              />

              {/* Grid - 4x3 */}
              <div className="grid grid-cols-4">
                {/* Row 1 */}
                {SIGNATURE_FIELDS.map((field) => (
                  <button
                    key={field.id}
                    onClick={() => { setMobileFieldToPlace(field.id); setShowMobileFields(false); }}
                    className={`flex flex-col items-center py-3 ${isDark ? 'active:bg-[#333]' : 'active:bg-gray-100'}`}
                  >
                    <field.icon className={`w-6 h-6 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} strokeWidth={1.5} />
                    <span className={`text-[10px] mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{field.name}</span>
                  </button>
                ))}
                {/* Row 2 */}
                {CONTACT_FIELDS.slice(0, 4).map((field) => (
                  <button
                    key={field.id}
                    onClick={() => { setMobileFieldToPlace(field.id); setShowMobileFields(false); }}
                    className={`flex flex-col items-center py-3 ${isDark ? 'active:bg-[#333]' : 'active:bg-gray-100'}`}
                  >
                    <field.icon className={`w-6 h-6 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} strokeWidth={1.5} />
                    <span className={`text-[10px] mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{field.name}</span>
                  </button>
                ))}
                {/* Row 3 */}
                {[...CONTACT_FIELDS.slice(4), ...OTHER_FIELDS].map((field) => (
                  <button
                    key={field.id}
                    onClick={() => { setMobileFieldToPlace(field.id); setShowMobileFields(false); }}
                    className={`flex flex-col items-center py-3 ${isDark ? 'active:bg-[#333]' : 'active:bg-gray-100'}`}
                  >
                    <field.icon className={`w-6 h-6 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} strokeWidth={1.5} />
                    <span className={`text-[10px] mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{field.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      {sendSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-900/80 border border-green-500/30 rounded-xl p-4 flex items-center gap-3 shadow-lg z-50">
          <div className="w-8 h-8 bg-green-900/50 rounded-full flex items-center justify-center">
            <Send className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="font-medium text-green-300">Document Sent!</p>
            <p className="text-sm text-green-400">Email sent to {signers.length} signer(s)</p>
          </div>
          <button onClick={() => setSendSuccess(false)} className="p-1 hover:bg-green-800 rounded">
            <X className="w-4 h-4 text-green-400" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/80 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 shadow-lg z-50">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
          <button onClick={() => setError(null)} className="p-1 hover:bg-red-800 rounded">
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      {/* Template Properties Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4">
          <div className={`rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto ${isDark ? 'bg-[#252525] border border-[#2a2a2a]' : 'bg-white border border-gray-200'}`}>
            <div className={`flex items-center justify-between p-5 ${isDark ? 'border-b border-[#2a2a2a]' : 'border-b border-gray-200'}`}>
              <h3 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
                <Settings className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                Template Properties
              </h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Template Name</label>
                <input
                  type="text"
                  value={templateProps.name}
                  onChange={(e) => setTemplateProps(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50 focus:border-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50 focus:border-[#4C00FF]/50'}`}
                  placeholder="Enter template name..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Tag className="w-4 h-4 inline mr-1" />
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="Add tags (comma separated)..."
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50 focus:border-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50 focus:border-[#4C00FF]/50'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Signed Document Workspace
                </label>
                <select className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50 focus:border-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50 focus:border-[#4C00FF]/50'}`}>
                  <option value="default">Default Workspace</option>
                  <option value="contracts">Contracts</option>
                  <option value="agreements">Agreements</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Link2 className="w-4 h-4 inline mr-1" />
                  Redirect Link (after signing)
                </label>
                <input
                  type="url"
                  value={templateProps.redirectUrl}
                  onChange={(e) => setTemplateProps(prev => ({ ...prev, redirectUrl: e.target.value }))}
                  placeholder="https://..."
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50 focus:border-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50 focus:border-[#4C00FF]/50'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Lock className="w-4 h-4 inline mr-1" />
                  Authorized Users
                </label>
                <input
                  type="text"
                  placeholder="Enter user emails (comma separated)..."
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50 focus:border-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50 focus:border-[#4C00FF]/50'}`}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Leave empty to allow all users</p>
              </div>
            </div>

            <div className={`flex items-center justify-end gap-3 p-5 rounded-b-2xl ${isDark ? 'border-t border-[#2a2a2a] bg-[#252525]' : 'border-t border-gray-200 bg-white'}`}>
              <button
                onClick={() => setShowTemplateModal(false)}
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a]' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.setItem('signDocument_templateProps', JSON.stringify(templateProps))
                  } catch (err) {
                    console.warn('Could not save template properties:', err)
                  }
                  setShowTemplateModal(false)
                }}
                className={`px-6 py-2 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#b8f206]' : 'bg-[#4C00FF] text-white hover:bg-[#3d00cc]'}`}
              >
                Save Properties
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-[200] md:p-4">
          <div
            className={`rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-h-[80vh] overflow-auto ${isDark ? 'bg-[#252525] border border-[#2a2a2a]' : 'bg-white border border-gray-200'}`}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)', maxWidth: '480px' }}
          >
            {/* Mobile Handle */}
            <div className="md:hidden flex justify-center pt-2 pb-1">
              <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
            </div>

            <div className={`flex items-center justify-between px-4 py-2.5 ${isDark ? 'border-b border-[#2a2a2a]' : 'border-b border-gray-200'}`}>
              <h3 className={`text-base font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
                <Send className={`w-4 h-4 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                Send for Signatures
              </h3>
              <button
                onClick={() => setShowSendModal(false)}
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            <div className="px-4 py-3 space-y-3">
              {/* Document Info - Compact */}
              <div className={`rounded-lg p-2.5 flex items-center gap-2.5 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'}`}>
                <FileText className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                <div className="min-w-0">
                  <p className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{templateProps.name || 'Untitled Template'}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{placedFields.length} fields</p>
                </div>
              </div>

              {/* Your Name (Sender) */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50'}`}
                />
              </div>

              {/* Signers - Compact */}
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Signers</label>
                <div className="space-y-2 max-h-[30vh] overflow-auto">
                  {signers.map((signer, idx) => {
                    const signerFields = placedFields.filter(f => f.signerId === signer.id)
                    return (
                      <div key={signer.id} className={`p-2 rounded-lg space-y-1.5 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                            style={{ backgroundColor: signer.color }}
                          >
                            {idx + 1}
                          </div>
                          <input
                            type="text"
                            placeholder="Name..."
                            value={signer.name}
                            onChange={(e) => updateSigner(signer.id, 'name', e.target.value)}
                            className={`flex-1 px-2 py-1 rounded text-sm focus:ring-1 ${isDark ? 'bg-[#3a3a3a] border border-[#3a3a3a] text-white focus:ring-[#c4ff0e]/50' : 'bg-white border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50'}`}
                          />
                          <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{signerFields.length} fields</span>
                        </div>
                        <div className="pl-8">
                          <input
                            type="email"
                            placeholder="Email..."
                            value={signer.email}
                            onChange={(e) => updateSigner(signer.id, 'email', e.target.value)}
                            className={`w-full px-2 py-1 rounded text-sm focus:ring-1 ${isDark ? 'bg-[#3a3a3a] border border-[#3a3a3a] text-white focus:ring-[#c4ff0e]/50' : 'bg-white border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50'}`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email Subject</label>
                <input
                  type="text"
                  value={emailSubject || `Please sign: ${templateProps.name}`}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Message (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Add a personal message..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg text-sm focus:ring-2 resize-none ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50'}`}
                />
              </div>
            </div>

            <div className={`flex items-center justify-end gap-2 px-4 py-3 rounded-b-2xl ${isDark ? 'border-t border-[#2a2a2a] bg-[#252525]' : 'border-t border-gray-200 bg-white'}`}>
              <button
                onClick={() => setShowSendModal(false)}
                disabled={isSending}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a]' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSendForSigning}
                disabled={isSending}
                className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 disabled:opacity-50 ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#b8f206]' : 'bg-[#4C00FF] text-white hover:bg-[#3d00cc]'}`}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4">
          <div className={`rounded-2xl shadow-2xl max-w-md w-full ${isDark ? 'bg-[#252525] border border-[#2a2a2a]' : 'bg-white border border-gray-200'}`}>
            <div className={`flex items-center justify-between p-5 ${isDark ? 'border-b border-[#2a2a2a]' : 'border-b border-gray-200'}`}>
              <h3 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
                <Share2 className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                Share Document
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {isGeneratingShare && (
                <div className="flex items-center justify-center gap-2 py-6">
                  <Loader2 className={`w-5 h-5 animate-spin ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Generating share link...</span>
                </div>
              )}

              {!isGeneratingShare && !shareUrl && (
                <div className={`text-center py-4`}>
                  <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Failed to generate share link. Please try again.</p>
                  <button
                    onClick={handleShare}
                    className={`mt-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isDark ? 'bg-[#2a2a2a] text-white hover:bg-[#333]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Retry
                  </button>
                </div>
              )}

              {shareUrl && (
                <>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Anyone with this link can sign the document.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className={`flex-1 px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-gray-300' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}
                    />
                    <button
                      onClick={copyShareUrl}
                      className={`px-4 py-2 font-medium rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${shareCopied ? 'bg-green-500 text-white' : isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#b8f206]' : 'bg-[#4C00FF] text-white hover:bg-[#3d00cc]'}`}
                    >
                      {shareCopied ? <CheckSquare className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div>
                    <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Share via</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Please sign this document: ${shareUrl}`)}`, '_blank')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#25D366] hover:bg-[#1da851] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </button>
                      <button
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#1877F2] hover:bg-[#0d65d9] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        Facebook
                      </button>
                      <button
                        onClick={() => window.open(`mailto:?subject=${encodeURIComponent(`Please sign: ${templateProps.name || 'Document'}`)}&body=${encodeURIComponent(`Please sign this document using the link below:\n\n${shareUrl}`)}`, '_self')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md ${isDark ? 'bg-[#2a2a2a] text-white hover:bg-[#333]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={`flex items-center justify-end gap-3 p-5 rounded-b-2xl ${isDark ? 'border-t border-[#2a2a2a] bg-[#252525]' : 'border-t border-gray-200 bg-white'}`}>
              <button
                onClick={() => setShowShareModal(false)}
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a]' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
          <div className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-4 ${isDark ? 'border-b border-[#2a2a2a] bg-[#252525]' : 'border-b border-gray-200 bg-gray-50'}`}>
              <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
                <Eye className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                Preview - How Document Will Look After Signing
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // Download all preview images
                    previewImages.forEach((img, idx) => {
                      const link = window.document.createElement('a')
                      link.download = `${templateProps.name || 'signed-document'}-page-${idx + 1}.png`
                      link.href = img
                      link.click()
                    })
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Download All</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'}`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>
            </div>

            <div className={`flex-1 overflow-auto p-6 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-200'}`}>
              <div className="flex flex-col items-center gap-6">
                {/* IMAGE documents: HTML rendering (same as editor = pixel-perfect) */}
                {!isPDF && documentPreview && imageDimensions ? (
                  <div className="relative" data-sign-preview="true">
                    <div className={`absolute -top-6 left-0 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Page 1 of 1
                    </div>
                    <div
                      className="relative shadow-xl bg-white"
                      style={{
                        width: imageDimensions.width,
                        height: imageDimensions.height,
                      }}
                    >
                      <img
                        src={documentPreview}
                        alt="Document"
                        style={{
                          width: imageDimensions.width,
                          height: imageDimensions.height,
                          display: 'block',
                        }}
                        draggable={false}
                      />
                      {/* Render fields - CSS percentage positioning (matches editor) */}
                      {placedFields.filter(f => f.value && f.page === 1).map(field => {
                        const pLeft = field.xPercent !== undefined
                          ? `${field.xPercent * 100}%`
                          : `${(field.x / imageDimensions.width) * 100}%`
                        const pTop = field.yPercent !== undefined
                          ? `${field.yPercent * 100}%`
                          : `${(field.y / imageDimensions.height) * 100}%`
                        const pWidth = `${((field.widthPercent || field.width / imageDimensions.width) * 100)}%`
                        const pHeight = `${((field.heightPercent || field.height / imageDimensions.height) * 100)}%`

                        return (
                          <div
                            key={field.id}
                            style={{
                              position: 'absolute',
                              left: pLeft,
                              top: pTop,
                              width: pWidth,
                              height: pHeight,
                              pointerEvents: 'none',
                            }}
                          >
                            {(field.type === 'signature' || field.type === 'initials') && field.value && (
                              <img
                                src={field.value}
                                alt={field.type}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                draggable={false}
                              />
                            )}
                            {field.type === 'stamp' && field.value?.startsWith('data:image') && (
                              <img
                                src={field.value}
                                alt="Stamp"
                                style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
                                draggable={false}
                              />
                            )}
                            {field.type === 'checkbox' && field.value === 'checked' && (
                              <div className="w-full h-full bg-green-500 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            {field.type !== 'signature' && field.type !== 'initials' && field.type !== 'stamp' && field.type !== 'checkbox' && field.value && (
                              <span className="text-black" style={{ fontSize: field.fontSize || 14 }}>{field.value}</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  /* PDF documents: rendered canvas images */
                  previewImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -top-6 left-0 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Page {idx + 1} of {previewImages.length}
                      </div>
                      <img
                        src={img}
                        alt={`Page ${idx + 1}`}
                        className={`shadow-xl max-w-full ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}
                        style={{ maxHeight: '80vh' }}
                      />
                      <button
                        onClick={() => {
                          const link = window.document.createElement('a')
                          link.download = `${templateProps.name || 'signed-document'}-page-${idx + 1}.png`
                          link.href = img
                          link.click()
                        }}
                        className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/70 text-white rounded-lg hover:bg-black/80 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download Page</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={`p-4 flex justify-between items-center ${isDark ? 'border-t border-[#2a2a2a] bg-[#252525]' : 'border-t border-gray-200 bg-gray-50'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {isPDF ? previewImages.length : 1} page{(isPDF ? previewImages.length : 1) !== 1 ? 's' : ''} • Right-click to save individual pages
              </p>
              <button
                onClick={() => setShowPreviewModal(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a]' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DocuSign-Style Signature/Initials Modal */}
      {signatureModalFieldId && (() => {
        const modalField = placedFields.find(f => f.id === signatureModalFieldId)
        if (!modalField) return null

        const isInitials = modalField.type === 'initials'
        const title = isInitials ? 'Adopt Your Initials' : 'Adopt Your Signature'

        // Signature font styles
        const signatureFonts = [
          { name: 'Brush Script MT', style: 'italic' },
          { name: 'Lucida Handwriting', style: 'normal' },
          { name: 'Segoe Script', style: 'normal' },
          { name: 'Comic Sans MS', style: 'italic' },
        ]

        // Generate signature from typed name
        const generateStyledSignature = (name: string, initials: string, fontIndex: number) => {
          const canvas = window.document.createElement('canvas')
          canvas.width = 300
          canvas.height = 80
          const ctx = canvas.getContext('2d')
          if (!ctx) return ''

          ctx.clearRect(0, 0, canvas.width, canvas.height)

          const font = signatureFonts[fontIndex] || signatureFonts[0]
          ctx.fillStyle = '#1a1a1a'
          ctx.font = `${font.style} 32px ${font.name}, cursive`
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'

          const text = isInitials ? initials : name
          ctx.fillText(text, 20, 40)

          return canvas.toDataURL('image/png')
        }

        // Handle file upload for signature
        const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0]
          if (!file) return

          const reader = new FileReader()
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string
            updateFieldValue(signatureModalFieldId, dataUrl)
          }
          reader.readAsDataURL(file)
        }

        // Auto-generate initials from full name
        const autoGenerateInitials = (name: string) => {
          const parts = name.trim().split(' ').filter(p => p.length > 0)
          if (parts.length === 0) return ''
          if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
          return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
        }

        return (
          <div className="fixed inset-0 z-[400] flex items-end md:items-center justify-center bg-black/50 md:p-4 overflow-y-auto" onClick={() => setSignatureModalFieldId(null)}>
            <div
              className="w-full md:w-[580px] max-h-[90vh] bg-white rounded-t-2xl md:rounded-lg shadow-2xl overflow-y-auto"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Handle */}
              <div className="md:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Confirm your name, initials, and signature.</p>
                </div>
                <button
                  onClick={() => setSignatureModalFieldId(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Name Inputs - Optional */}
              <div className="px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={signatureFullName}
                    onChange={(e) => {
                      setSignatureFullName(e.target.value)
                      setSignatureInitials(autoGenerateInitials(e.target.value))
                    }}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initials <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={signatureInitials}
                    onChange={(e) => setSignatureInitials(e.target.value.toUpperCase())}
                    placeholder="Initials"
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="px-4 md:px-6 border-b border-gray-200 overflow-x-auto">
                <div className="flex gap-4 md:gap-6 min-w-max">
                  {[
                    { id: 'style', label: 'STYLE' },
                    { id: 'draw', label: 'DRAW' },
                    { id: 'upload', label: 'UPLOAD' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSignatureTab(tab.id as any)}
                      className={`py-3 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        signatureTab === tab.id
                          ? 'text-blue-600 border-blue-600'
                          : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="px-4 md:px-6 py-4">
                {/* SELECT STYLE Tab */}
                {signatureTab === 'style' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs md:text-sm font-medium text-gray-500">PREVIEW</span>
                      <button
                        onClick={() => setSignatureStyle((prev) => (prev + 1) % signatureFonts.length)}
                        className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Change Style
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 md:p-4 bg-gray-50">
                      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                        {/* Signature Preview */}
                        <div className="flex-1">
                          <div className="border-l-4 border-blue-200 pl-3">
                            <p className="text-xs text-gray-400 mb-1">Signed by:</p>
                            <p
                              className="text-xl md:text-2xl text-gray-800 break-words"
                              style={{ fontFamily: `${signatureFonts[signatureStyle].name}, cursive`, fontStyle: signatureFonts[signatureStyle].style }}
                            >
                              {signatureFullName || 'Your Name'}
                            </p>
                          </div>
                        </div>
                        {/* Initials Preview */}
                        <div className="w-auto md:w-24">
                          <div className="border-l-4 border-blue-200 pl-3">
                            <p className="text-xs text-gray-400 mb-1">Initials</p>
                            <p
                              className="text-xl md:text-2xl text-gray-800"
                              style={{ fontFamily: `${signatureFonts[signatureStyle].name}, cursive`, fontStyle: signatureFonts[signatureStyle].style }}
                            >
                              {signatureInitials || 'AB'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* DRAW Tab */}
                {signatureTab === 'draw' && (
                  <div>
                    <p className="text-xs md:text-sm text-gray-500 mb-3">Draw your signature below:</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white">
                      <SignatureCanvas
                        onSave={(data) => {
                          if (data) {
                            updateFieldValue(signatureModalFieldId, data)
                          }
                        }}
                        onClear={() => {}}
                        onCancel={() => {}}
                        initialSignature={modalField.value?.startsWith('data:image') ? modalField.value : undefined}
                        compact={false}
                        height={150}
                        showDoneButton={false}
                      />
                    </div>
                  </div>
                )}

                {/* UPLOAD Tab */}
                {signatureTab === 'upload' && (
                  <div>
                    <input
                      ref={signatureFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="hidden"
                    />
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                      onClick={() => signatureFileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center">
                        <Stamp className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mb-3 md:mb-4" />
                        <p className="text-sm md:text-lg font-medium text-gray-600 mb-1">
                          <span className="hidden md:inline">Drag & drop signature image here</span>
                          <span className="md:hidden">Tap to upload signature</span>
                        </p>
                        <p className="text-xs md:text-sm text-gray-400 hidden md:block">or use <span className="font-semibold">UPLOAD IMAGE</span> to browse and select</p>
                      </div>
                    </div>
                    <button
                      onClick={() => signatureFileInputRef.current?.click()}
                      className="mt-3 md:mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 w-full md:w-auto"
                    >
                      UPLOAD IMAGE
                    </button>
                    {modalField.value?.startsWith('data:image') && (
                      <div className="mt-3 md:mt-4 p-3 md:p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-500 mb-2">Uploaded signature:</p>
                        <img src={modalField.value} alt="Uploaded signature" className="max-h-16 md:max-h-20 object-contain" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Legal Text */}
              <div className="px-4 md:px-6 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-[10px] md:text-xs text-blue-600 leading-relaxed">
                  By selecting Adopt and Sign, I agree that this mark will be the electronic representation of my signature or initials whenever I use it.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="px-4 md:px-6 py-4 flex flex-col-reverse md:flex-row gap-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Generate signature from style if using style tab and has name
                    if (signatureTab === 'style' && signatureFullName) {
                      const signatureData = generateStyledSignature(signatureFullName, signatureInitials, signatureStyle)
                      updateFieldValue(signatureModalFieldId, signatureData)
                    }
                    setSignatureModalFieldId(null)
                    setSelectedFieldId(signatureModalFieldId)
                  }}
                  disabled={signatureTab === 'style' && !signatureFullName && !modalField.value}
                  className="flex-1 md:flex-none px-6 py-3 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg md:rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adopt and Sign
                </button>
                <button
                  onClick={() => setSignatureModalFieldId(null)}
                  className="flex-1 md:flex-none px-6 py-3 md:py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg md:rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* DocuSign-Style Stamp Modal */}
      {stampModalFieldId && (() => {
        const modalField = placedFields.find(f => f.id === stampModalFieldId)
        if (!modalField) return null

        const handleStampFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0]
          if (!file) return

          const reader = new FileReader()
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string
            updateFieldValue(stampModalFieldId, dataUrl)
          }
          reader.readAsDataURL(file)
        }

        return (
          <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={() => setStampModalFieldId(null)}>
            <div
              className="w-[500px] max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-y-auto my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Adopt Stamp</h2>
                  <p className="text-sm text-gray-500 mt-1">Adopt a stamp to finish this document.</p>
                </div>
                <button
                  onClick={() => setStampModalFieldId(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Upload Button */}
              <div className="px-6 pt-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleStampFileUpload}
                  className="hidden"
                  id="stamp-file-input"
                />
                <label
                  htmlFor="stamp-file-input"
                  className="inline-block px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  UPLOAD IMAGE
                </label>
              </div>

              {/* Drag & Drop Area */}
              <div className="px-6 py-6">
                <label
                  htmlFor="stamp-file-input"
                  className="block border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
                >
                  <div className="flex flex-col items-center">
                    <Stamp className="w-20 h-20 text-red-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600 mb-2">Drag & drop stamp image here</p>
                    <p className="text-sm text-gray-400">or use <span className="font-semibold">UPLOAD IMAGE</span> to browse and select</p>
                  </div>
                </label>
              </div>

              {/* Preview if uploaded */}
              {modalField.value?.startsWith('data:image') && (
                <div className="px-6 pb-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-2">Uploaded stamp:</p>
                    <div className="flex items-center justify-center">
                      <img src={modalField.value} alt="Stamp" className="max-h-24 object-contain" />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="px-6 py-4 flex gap-3 border-t border-gray-200 bg-yellow-50">
                <button
                  onClick={() => {
                    setStampModalFieldId(null)
                    setSelectedFieldId(stampModalFieldId)
                  }}
                  disabled={!modalField.value}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adopt Stamp
                </button>
                <button
                  onClick={() => setStampModalFieldId(null)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )
      })()}

    </div>
  )
}

export default SignDocumentPage
