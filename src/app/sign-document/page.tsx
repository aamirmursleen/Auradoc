'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  FileSignature,
  Upload,
  PenTool,
  Type,
  AtSign,
  Building2,
  Calendar,
  CheckSquare,
  User,
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
  Camera
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { incrementSignCount } from '@/lib/usageLimit'
import { useTheme } from '@/components/ThemeProvider'

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
  { id: 'signature', name: 'Signature', icon: PenTool },
  { id: 'initials', name: 'Initial', icon: FileSignature },
  { id: 'stamp', name: 'Stamp', icon: Stamp },
  { id: 'date', name: 'Date Signed', icon: Calendar },
]

// Field Types - Contact/Identity Fields
const CONTACT_FIELDS = [
  { id: 'name', name: 'Name', icon: User },
  { id: 'firstName', name: 'First Name', icon: User },
  { id: 'lastName', name: 'Last Name', icon: User },
  { id: 'email', name: 'Email Address', icon: AtSign },
  { id: 'company', name: 'Company', icon: Building2 },
  { id: 'title', name: 'Title', icon: Type },
]

// Field Types - Other Fields
const OTHER_FIELDS = [
  { id: 'text', name: 'Text', icon: Type },
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
  const [pdfPageImage, setPdfPageImage] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

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
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string>('se')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
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
  const fieldStartPos = useRef({ x: 0, y: 0 })
  const resizeStartSize = useRef({ width: 0, height: 0 })

  const isPDF = document?.type === 'application/pdf' || document?.name.toLowerCase().endsWith('.pdf')
  const selectedField = placedFields.find(f => f.id === selectedFieldId)
  const activeSigner = signers.find(s => s.id === activeSignerId)

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

  // File upload handler - PDF only
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const isValidType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

      if (!isValidType) {
        setError('Please upload a PDF file only')
        return
      }

      if (file.size > 25 * 1024 * 1024) {
        setError('File size must be less than 25MB')
        return
      }

      setDocument(file)
      setTemplateProps(prev => ({ ...prev, name: file.name.replace(/\.[^/.]+$/, '') }))
      setError(null)
      setPlacedFields([])
      setSelectedFieldId(null)
    }
  }

  // Handle dropping a field type onto the document
  const handleDocumentDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!draggedFieldType || !documentContainerRef.current || !activeSigner) return

    const rect = documentContainerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    const fieldType = ALL_FIELD_TYPES.find(f => f.id === draggedFieldType)
    if (!fieldType) return

    const newField: PlacedField = {
      id: generateUUID(),
      type: draggedFieldType,
      x: Math.max(0, x - 75),
      y: Math.max(0, y - 20),
      width: draggedFieldType === 'signature' ? 200 : draggedFieldType === 'checkbox' ? 30 : 150,
      height: draggedFieldType === 'signature' ? 60 : draggedFieldType === 'checkbox' ? 30 : 40,
      page: currentPage,
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
    setDraggedFieldType(null)
    setShowPropertiesPanel(true)
  }, [draggedFieldType, zoom, currentPage, activeSigner])

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
    fieldStartPos.current = { x: field.x, y: field.y }
    setShowPropertiesPanel(true)
  }, [placedFields])

  // Handle mouse move for dragging fields
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedFieldId) return

    const deltaX = (e.clientX - dragStartPos.current.x) / zoom
    const deltaY = (e.clientY - dragStartPos.current.y) / zoom

    setPlacedFields(prev => prev.map(field =>
      field.id === selectedFieldId
        ? {
            ...field,
            x: Math.max(0, fieldStartPos.current.x + deltaX),
            y: Math.max(0, fieldStartPos.current.y + deltaY)
          }
        : field
    ))
  }, [isDragging, selectedFieldId, zoom])

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

      return { ...field, width: newWidth, height: newHeight, x: newX, y: newY }
    }))
  }, [isResizing, selectedFieldId, zoom, resizeDirection])

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

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

  // Update field value (for inline editing)
  const updateFieldValue = (fieldId: string, value: string) => {
    setPlacedFields(prev => prev.map(field =>
      field.id === fieldId ? { ...field, value } : field
    ))
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

  // Generate preview with signatures overlaid
  const generatePreview = useCallback(async () => {
    if (!document) return

    setIsGeneratingPreview(true)
    setPreviewImages([])

    try {
      // Import pdfjs
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      // Load PDF
      const arrayBuffer = await document.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/standard_fonts/`,
      }).promise

      const images: string[] = []

      // First get the base page dimensions (at scale 1)
      const firstPage = await pdf.getPage(1)
      const baseViewport = firstPage.getViewport({ scale: 1 })

      // Field coordinates are stored relative to the displayed page size (original * zoom)
      // Use current zoom value (default 1) instead of hardcoded 1.5
      const viewerWidth = baseViewport.width * zoom
      const viewerHeight = baseViewport.height * zoom

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const previewScale = 2 // High quality for preview
        const viewport = page.getViewport({ scale: previewScale })

        // Create canvas
        const canvas = window.document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) continue

        canvas.width = viewport.width
        canvas.height = viewport.height

        // Reset transforms and clear canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Fill with white background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Render PDF page
        await page.render({
          canvasContext: ctx,
          viewport: viewport,
          background: 'white'
        }).promise

        // Overlay fields for this page
        const fieldsOnPage = placedFields.filter(f => f.page === pageNum)

        // Calculate scale factor from viewer coordinates to preview coordinates
        const scaleX = viewport.width / viewerWidth
        const scaleY = viewport.height / viewerHeight

        for (const field of fieldsOnPage) {
          if (!field.value) continue

          // Field positions are in pixels relative to the viewer display
          // Convert to preview canvas coordinates
          const x = field.x * scaleX
          const y = field.y * scaleY
          const width = field.width * scaleX
          const height = field.height * scaleY

          if (field.type === 'signature' || field.type === 'initials') {
            // Draw signature image
            const img = new window.Image()
            img.crossOrigin = 'anonymous'
            await new Promise<void>((resolve) => {
              img.onload = () => {
                ctx.drawImage(img, x, y, width, height)
                resolve()
              }
              img.onerror = () => resolve()
              img.src = field.value!
            })
          } else if (field.type === 'checkbox') {
            if (field.value === 'checked') {
              ctx.fillStyle = '#7C3AED'
              ctx.fillRect(x, y, width, height)
              ctx.fillStyle = 'white'
              ctx.font = `${height * 0.7}px Arial`
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              ctx.fillText('✓', x + width / 2, y + height / 2)
            }
          } else {
            // Text fields
            ctx.fillStyle = '#1e293b'
            ctx.font = `${Math.min(height * 0.6, 24)}px Arial`
            ctx.textAlign = 'left'
            ctx.textBaseline = 'middle'
            ctx.fillText(field.value || '', x + 4, y + height / 2, width - 8)
          }
        }

        images.push(canvas.toDataURL('image/png'))
      }

      setPreviewImages(images)
      setShowPreviewModal(true)
    } catch (err) {
      console.error('Error generating preview:', err)
      setError('Failed to generate preview')
    } finally {
      setIsGeneratingPreview(false)
    }
  }, [document, placedFields, zoom])

  // Download signed document
  const handleDownload = useCallback(async () => {
    if (!document) return

    setIsDownloading(true)

    try {
      const pdfjsLib = await import('pdfjs-dist')
      const { jsPDF } = await import('jspdf')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const arrayBuffer = await document.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/standard_fonts/`,
      }).promise

      // Get base dimensions for scaling
      const firstPage = await pdf.getPage(1)
      const baseViewport = firstPage.getViewport({ scale: 1 })
      const viewerWidth = baseViewport.width * zoom
      const viewerHeight = baseViewport.height * zoom

      // Helper function to render fields on a canvas
      const renderFieldsOnCanvas = async (ctx: CanvasRenderingContext2D, pageNum: number, scaleX: number, scaleY: number) => {
        const fieldsOnPage = placedFields.filter(f => f.page === pageNum)
        for (const field of fieldsOnPage) {
          if (!field.value) continue

          const x = field.x * scaleX
          const y = field.y * scaleY
          const width = field.width * scaleX
          const height = field.height * scaleY

          if (field.type === 'signature' || field.type === 'initials' || (field.type === 'stamp' && field.value.startsWith('data:image'))) {
            const img = new window.Image()
            img.crossOrigin = 'anonymous'
            await new Promise<void>((resolve) => {
              img.onload = () => {
                ctx.drawImage(img, x, y, width, height)
                resolve()
              }
              img.onerror = () => resolve()
              img.src = field.value!
            })
          } else if (field.type === 'checkbox') {
            if (field.value === 'checked') {
              ctx.fillStyle = '#16a34a'
              ctx.fillRect(x, y, width, height)
              ctx.fillStyle = 'white'
              ctx.font = `${height * 0.7}px Arial`
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              ctx.fillText('✓', x + width / 2, y + height / 2)
            }
          } else if (field.type === 'stamp' && !field.value.startsWith('data:image')) {
            // Text stamp
            ctx.save()
            ctx.translate(x + width / 2, y + height / 2)
            ctx.rotate(-12 * Math.PI / 180)
            ctx.strokeStyle = '#dc2626'
            ctx.lineWidth = 2
            ctx.font = `bold ${Math.min(height * 0.5, 16)}px Arial`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.strokeText(field.value, 0, 0)
            ctx.fillStyle = '#dc2626'
            ctx.fillText(field.value, 0, 0)
            ctx.restore()
          } else {
            // Text fields (name, email, date, etc.)
            ctx.fillStyle = '#000000'
            const fontSize = field.fontSize || 14
            ctx.font = `${Math.min(fontSize * scaleX, height * 0.8)}px Arial`
            ctx.textAlign = 'left'
            ctx.textBaseline = 'middle'
            ctx.fillText(field.value || '', x + 4, y + height / 2, width - 8)
          }
        }
      }

      // Single page - download as PNG
      if (pdf.numPages === 1) {
        const page = await pdf.getPage(1)
        const previewScale = 2
        const viewport = page.getViewport({ scale: previewScale })

        const canvas = window.document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('No canvas context')

        canvas.width = viewport.width
        canvas.height = viewport.height

        // Reset transforms and fill white background
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        await page.render({ canvasContext: ctx, viewport, background: 'white' }).promise

        const scaleX = viewport.width / viewerWidth
        const scaleY = viewport.height / viewerHeight

        await renderFieldsOnCanvas(ctx, 1, scaleX, scaleY)

        const link = window.document.createElement('a')
        link.download = `${templateProps.name || 'signed-document'}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      } else {
        // Multiple pages - create PDF with all pages
        const previewScale = 2
        const firstViewport = firstPage.getViewport({ scale: previewScale })

        // Create jsPDF with first page dimensions
        const pdfDoc = new jsPDF({
          orientation: firstViewport.width > firstViewport.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [firstViewport.width, firstViewport.height]
        })

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum)
          const viewport = page.getViewport({ scale: previewScale })

          const canvas = window.document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) continue

          canvas.width = viewport.width
          canvas.height = viewport.height

          // Reset transforms and fill white background
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          await page.render({ canvasContext: ctx, viewport, background: 'white' }).promise

          // Get page-specific dimensions for field scaling
          const pageBaseViewport = page.getViewport({ scale: 1 })
          const pageViewerWidth = pageBaseViewport.width * zoom
          const pageViewerHeight = pageBaseViewport.height * zoom
          const scaleX = viewport.width / pageViewerWidth
          const scaleY = viewport.height / pageViewerHeight

          await renderFieldsOnCanvas(ctx, pageNum, scaleX, scaleY)

          const imgData = canvas.toDataURL('image/png')

          if (pageNum > 1) {
            pdfDoc.addPage([viewport.width, viewport.height])
          }

          pdfDoc.addImage(imgData, 'PNG', 0, 0, viewport.width, viewport.height)
        }

        pdfDoc.save(`${templateProps.name || 'signed-document'}.pdf`)
      }
    } catch (err) {
      console.error('Error downloading:', err)
      setError('Failed to download document')
    } finally {
      setIsDownloading(false)
    }
  }, [document, placedFields, templateProps.name, zoom])

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
      // Convert document to base64
      let documentData = ''
      if (document) {
        const reader = new FileReader()
        documentData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(document)
        })
      }

      // Prepare signature fields data
      const signatureFields = placedFields.map(field => ({
        id: field.id,
        signerOrder: signers.find(s => s.id === field.signerId)?.order || 1,
        x: field.x,
        y: field.y,
        width: field.width,
        height: field.height,
        type: field.type,
        label: field.label,
        mandatory: field.mandatory,
        page: field.page,
        fontSize: field.fontSize
      }))

      // Send to API
      const response = await fetch('/api/signing-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: templateProps.name || document?.name || 'Untitled Document',
          documentData,
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
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send document')
      }

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
              left: field.x,
              top: field.y,
              width: field.width,
              height: field.height,
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

    const newField: PlacedField = {
      id: generateUUID(),
      type: mobileFieldToPlace,
      x: Math.max(0, x - 75),
      y: Math.max(0, y - 20),
      width: mobileFieldToPlace === 'signature' ? 180 : mobileFieldToPlace === 'checkbox' ? 30 : 140,
      height: mobileFieldToPlace === 'signature' ? 50 : mobileFieldToPlace === 'checkbox' ? 30 : 36,
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
            onClick={() => setShowShareModal(true)}
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

          <button
            onClick={handleDownload}
            disabled={!document || isDownloading || placedFields.filter(f => f.value).length === 0}
            className="hidden md:flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span className="text-sm font-medium hidden md:inline">Download</span>
          </button>

          <button
            onClick={() => setIsSaving(true)}
            disabled={!document || isSaving}
            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a]' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="text-sm font-medium hidden lg:inline">Save</span>
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

                <div className={`hidden md:flex items-center gap-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  <span>{totalPages} page{totalPages !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>{placedFields.length} fields</span>
                  <span>•</span>
                  <span>Scroll to view all</span>
                </div>

                {/* Mobile info */}
                <div className={`md:hidden flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  <span>{totalPages}p</span>
                  <span>•</span>
                  <span>{placedFields.length} fields</span>
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
            {!document ? (
              <label className={`w-full max-w-2xl rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-8 md:p-12 my-auto mx-4 md:mx-0 active:scale-[0.99] ${isDark ? 'bg-[#252525] border-[#3a3a3a] hover:border-[#c4ff0e]/50 hover:bg-[#2a2a2a]' : 'bg-white border-gray-300 hover:border-[#4C00FF]/50 hover:bg-gray-50'}`}>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
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
                  <span className="hidden md:inline">Drag and drop your PDF here, or click to browse</span>
                  <span className="md:hidden">Tap here to select your PDF</span>
                </p>
                <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-[#2a2a2a]">
                    <FileText className="w-3 h-3" /> PDF Only
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
                    onPageClick={(e, pageNum) => {
                      // Handle both desktop drag-drop and mobile tap-to-place
                      const fieldTypeToPlace = draggedFieldType || mobileFieldToPlace
                      if (fieldTypeToPlace && activeSigner) {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = e.clientX - rect.left
                        const y = e.clientY - rect.top

                        const fieldType = ALL_FIELD_TYPES.find(f => f.id === fieldTypeToPlace)
                        if (!fieldType) return

                        // Slightly smaller sizes for mobile
                        const isMobile = window.innerWidth < 768
                        const newField: PlacedField = {
                          id: generateUUID(),
                          type: fieldTypeToPlace,
                          x: Math.max(0, x - (isMobile ? 60 : 75)),
                          y: Math.max(0, y - (isMobile ? 15 : 20)),
                          width: fieldTypeToPlace === 'signature' ? (isMobile ? 160 : 200) : fieldTypeToPlace === 'checkbox' ? 30 : (isMobile ? 130 : 150),
                          height: fieldTypeToPlace === 'signature' ? (isMobile ? 45 : 60) : fieldTypeToPlace === 'checkbox' ? 30 : (isMobile ? 32 : 40),
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
                        setDraggedFieldType(null)
                        setMobileFieldToPlace(null)
                        setShowPropertiesPanel(true)
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
                            className={`pointer-events-auto absolute transition-all group
                              ${isEditing ? 'z-[200]' : ''}
                            `}
                            style={{
                              left: field.x,
                              top: field.y,
                              width: field.width,
                              height: field.height,
                              zIndex: isEditing ? 200 : (isSelected ? 100 : 50)
                            }}
                          >
                            {/* Yellow Left Border - Drag Handle */}
                            <div
                              className="absolute left-0 top-0 bottom-0 w-2 cursor-move rounded-l"
                              style={{ backgroundColor: '#D4A017' }}
                              onMouseDown={(e) => {
                                if (!isEditing) handleFieldMouseDown(e, field.id)
                              }}
                              title="Drag to move"
                            />

                            {/* Main Field Content */}
                            <div
                              className={`absolute left-2 top-0 right-0 bottom-0 border-2 rounded-r cursor-pointer
                                ${isSelected ? 'border-gray-400' : 'border-gray-300'}
                              `}
                              style={{
                                backgroundColor: hasValue || isSelected ? '#FFF9C4' : '#FFFDE7'
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
                                // Open modal for signature/initials/stamp, inline for others
                                if (field.type === 'signature' || field.type === 'initials') {
                                  setSignatureModalFieldId(field.id)
                                } else if (field.type === 'stamp') {
                                  setStampModalFieldId(field.id)
                                } else {
                                  setEditingFieldId(field.id)
                                }
                              }}
                            >
                            {/* Editing Mode - Skip for signature types */}
                            {isEditing && !isSignatureType ? (
                              <div className="w-full h-full rounded-md" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>

                                {/* Text Editor - Direct inline editing with size control */}
                                {isTextType && (
                                  <div className="w-full h-full flex flex-col bg-white" onClick={(e) => e.stopPropagation()}>
                                    {/* Size Control */}
                                    <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-200 bg-gray-50">
                                      <span className="text-[10px] text-gray-500">Size:</span>
                                      {[10, 12, 14, 16, 18, 20, 24].map((size) => (
                                        <button
                                          key={size}
                                          onClick={() => updateFieldFontSize(field.id, size)}
                                          className={`px-1.5 py-0.5 text-[10px] rounded ${field.fontSize === size ? 'bg-[#4C00FF] text-white font-bold' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                        >
                                          {size}
                                        </button>
                                      ))}
                                    </div>
                                    {/* Input */}
                                    <input
                                      type={field.type === 'email' ? 'email' : 'text'}
                                      value={field.value || ''}
                                      onChange={(e) => updateFieldValue(field.id, e.target.value)}
                                      placeholder={field.placeholder || `Type ${field.label}...`}
                                      className="flex-1 w-full px-2 border-none outline-none"
                                      style={{ color: '#000000', backgroundColor: '#ffffff', fontSize: `${field.fontSize || 14}px` }}
                                      autoFocus
                                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingFieldId(null) }}
                                    />
                                    {/* Done button */}
                                    <div className="px-2 py-1 border-t border-gray-200 bg-gray-50 flex justify-end">
                                      <button onClick={() => setEditingFieldId(null)} className="px-3 py-1 bg-[#4C00FF] text-white text-xs font-medium rounded">Done</button>
                                    </div>
                                  </div>
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
                                  <div className="w-full h-full flex items-center justify-center bg-white" onClick={(e) => e.stopPropagation()}>
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
                              </div>
                            ) : (
                              /* Display Mode */
                              <>
                                {/* Show saved value or placeholder */}
                                <div className="w-full h-full flex items-center p-1 overflow-hidden">
                                  {hasValue ? (
                                    <>
                                      {/* Signature/Initials Display */}
                                      {isSignatureType && field.value && (
                                        <div className="w-full h-full flex flex-col">
                                          <span className="text-[10px] text-gray-500">Signed by:</span>
                                          <img
                                            src={field.value}
                                            alt="Signature"
                                            className="max-w-full max-h-full object-contain flex-1"
                                          />
                                        </div>
                                      )}
                                      {/* Text Fields Display */}
                                      {isTextType && (
                                        <span style={{ color: '#000000', fontSize: `${field.fontSize || 14}px` }}>{field.value}</span>
                                      )}
                                      {/* Checkbox Display */}
                                      {isCheckboxType && field.value === 'checked' && (
                                        <CheckSquare className="w-5 h-5 text-green-600" />
                                      )}
                                      {/* Date Display */}
                                      {isDateType && field.value && (
                                        <span style={{ color: '#000000', fontSize: `${field.fontSize || 14}px`, fontWeight: '500' }}>
                                          {new Date(field.value).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                        </span>
                                      )}
                                      {/* Stamp Display */}
                                      {field.type === 'stamp' && field.value && (
                                        field.value.startsWith('data:image') ? (
                                          <img src={field.value} alt="Stamp" className="max-w-full max-h-full object-contain" />
                                        ) : (
                                          <span className="text-red-600 font-bold border border-red-600 px-1 rounded transform -rotate-12 text-xs">{field.value}</span>
                                        )
                                      )}
                                    </>
                                  ) : (
                                    /* Empty Field Placeholder */
                                    <div className="flex items-center justify-center gap-2 text-gray-600">
                                      <FieldIcon className="w-4 h-4" />
                                      <span className="text-sm font-medium">{field.label}</span>
                                    </div>
                                  )}
                                </div>

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
                ) : documentPreview && (
                  <div className="relative">
                    <img
                      src={documentPreview}
                      alt="Document"
                      className="max-w-none"
                      draggable={false}
                    />
                    {FieldsOverlay}
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
            <PenTool className={`w-4 h-4 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
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
                onClick={() => setShowTemplateModal(false)}
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
            className={`rounded-t-2xl md:rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto ${isDark ? 'bg-[#252525] border border-[#2a2a2a]' : 'bg-white border border-gray-200'}`}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Mobile Handle */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
            </div>

            <div className={`flex items-center justify-between px-4 md:p-5 py-3 md:py-5 ${isDark ? 'border-b border-[#2a2a2a]' : 'border-b border-gray-200'}`}>
              <h3 className={`text-lg md:text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
                <Send className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                Send for Signatures
              </h3>
              <button
                onClick={() => setShowSendModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            <div className="px-4 md:p-5 py-4 space-y-4">
              <div className={`rounded-xl p-4 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'}`}>
                <div className="flex items-center gap-3">
                  <FileText className={`w-8 h-8 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{templateProps.name || 'Untitled Template'}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{placedFields.length} fields configured</p>
                  </div>
                </div>
              </div>

              {/* Your Name (Sender) */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name (shown in email)..."
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50'}`}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>This name will appear as the sender in the email</p>
              </div>

              {/* Signers with their names and emails */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Signers</label>
                <div className="space-y-3">
                  {signers.map((signer, idx) => {
                    const signerFields = placedFields.filter(f => f.signerId === signer.id)
                    return (
                      <div key={signer.id} className={`p-3 rounded-lg space-y-2 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{ backgroundColor: signer.color }}
                          >
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Signer name..."
                              value={signer.name}
                              onChange={(e) => updateSigner(signer.id, 'name', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#3a3a3a] border border-[#3a3a3a] text-white focus:ring-[#c4ff0e]/50' : 'bg-white border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50'}`}
                            />
                          </div>
                          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{signerFields.length} fields</span>
                        </div>
                        <div className="pl-10">
                          <input
                            type="email"
                            placeholder="Email address..."
                            value={signer.email}
                            onChange={(e) => updateSigner(signer.id, 'email', e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#3a3a3a] border border-[#3a3a3a] text-white focus:ring-[#c4ff0e]/50' : 'bg-white border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50'}`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email Subject</label>
                <input
                  type="text"
                  value={emailSubject || `Please sign: ${templateProps.name}`}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Message (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Add a personal message..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 resize-none ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-white focus:ring-[#c4ff0e]/50' : 'bg-gray-50 border border-gray-200 text-[#26065D] focus:ring-[#4C00FF]/50'}`}
                />
              </div>
            </div>

            <div className={`flex items-center justify-end gap-3 p-5 rounded-b-2xl ${isDark ? 'border-t border-[#2a2a2a] bg-[#252525]' : 'border-t border-gray-200 bg-white'}`}>
              <button
                onClick={() => setShowSendModal(false)}
                disabled={isSending}
                className={`px-4 py-2 font-medium rounded-lg transition-colors disabled:opacity-50 ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a]' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSendForSigning}
                disabled={isSending}
                className={`px-6 py-2 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#b8f206]' : 'bg-[#4C00FF] text-white hover:bg-[#3d00cc]'}`}
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4">
          <div className={`rounded-2xl shadow-2xl max-w-md w-full ${isDark ? 'bg-[#252525] border border-[#2a2a2a]' : 'bg-white border border-gray-200'}`}>
            <div className={`flex items-center justify-between p-5 ${isDark ? 'border-b border-[#2a2a2a]' : 'border-b border-gray-200'}`}>
              <h3 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
                <Share2 className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                Share Template
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Create a public link that anyone can use to sign this document.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value="https://mamasign.com/sign/abc123"
                  readOnly
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-[#2a2a2a] border border-[#2a2a2a] text-gray-300' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}
                />
                <button className={`px-4 py-2 font-medium rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#b8f206]' : 'bg-[#4C00FF] text-white hover:bg-[#3d00cc]'}`}>
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className={`rounded-lg p-3 ${isDark ? 'bg-yellow-900/30 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  Anyone with this link can sign the document. Share carefully.
                </p>
              </div>
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
                {previewImages.map((img, idx) => (
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
                ))}
              </div>
            </div>

            <div className={`p-4 flex justify-between items-center ${isDark ? 'border-t border-[#2a2a2a] bg-[#252525]' : 'border-t border-gray-200 bg-gray-50'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {previewImages.length} page{previewImages.length !== 1 ? 's' : ''} • Right-click to save individual pages
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

          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          const font = signatureFonts[fontIndex] || signatureFonts[0]
          ctx.fillStyle = '#1a1a1a'
          ctx.font = `${font.style} 32px ${font.name}, cursive`
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'

          const text = isInitials ? initials : name
          ctx.fillText(text, 20, 45)

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

              {/* Name Inputs */}
              <div className="px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
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
                    Initials <span className="text-red-500">*</span>
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
                    <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
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
                    // Generate signature from style if using style tab
                    if (signatureTab === 'style' && signatureFullName) {
                      const signatureData = generateStyledSignature(signatureFullName, signatureInitials, signatureStyle)
                      updateFieldValue(signatureModalFieldId, signatureData)
                    }
                    setSignatureModalFieldId(null)
                    setSelectedFieldId(signatureModalFieldId)
                  }}
                  disabled={!signatureFullName || !signatureInitials}
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
