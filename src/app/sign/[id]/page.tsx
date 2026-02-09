'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import * as pdfjsLib from 'pdfjs-dist'
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
  Lock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  RotateCcw,
  Type,
  Calendar,
  CheckSquare,
  User,
  Mail,
  Phone,
  Building,
  AlignLeft,
  ChevronDown,
  Strikethrough,
  Stamp,
  Bold,
  Italic,
  Camera,
  Upload,
  Palette,
  Move,
  Maximize,
  Plus,
  Minus
} from 'lucide-react'

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

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
  pageNumber?: number
  page?: number // Support both field names
  fontSize?: number // Font size set by document creator
  fontFamily?: string // Font family set by document creator
  fontBold?: boolean // Bold set by document creator
  // Ownership/signed metadata from API
  isMine?: boolean
  signerStatus?: string
  signedValue?: string | null
  signerName?: string
  signerColor?: string
  // Percentage-based positioning
  xPercent?: number
  yPercent?: number
  widthPercent?: number
  heightPercent?: number
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
  const [otherFields, setOtherFields] = useState<SignatureFieldInfo[]>([])

  // PDF state
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [pageHeights, setPageHeights] = useState<number[]>([])
  const [pageWidths, setPageWidths] = useState<number[]>([])
  const [pageImages, setPageImages] = useState<string[]>([])

  // Image document state
  const [fileType, setFileType] = useState<'pdf' | 'image' | 'unknown'>('unknown')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)

  // Signing state
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [signedFields, setSignedFields] = useState<Set<string>>(new Set())
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)
  const [showTextInput, setShowTextInput] = useState(false)
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showSelection, setShowSelection] = useState(false)
  const [showStampPicker, setShowStampPicker] = useState(false)
  const [showStrikethroughPicker, setShowStrikethroughPicker] = useState(false)
  const [textInputValue, setTextInputValue] = useState('')
  const [stampImage, setStampImage] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [processingStamp, setProcessingStamp] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stampFileInputRef = useRef<HTMLInputElement>(null)

  // Stamp options
  const stampOptions = ['APPROVED', 'DRAFT', 'CONFIDENTIAL', 'REVIEWED', 'FINAL', 'COPY']

  // Remove background from stamp image
  const removeBackground = (imageData: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(imageData); return }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imgData.data

        // Get background color from corners (average of corner pixels)
        const corners = [
          [0, 0], [canvas.width - 1, 0],
          [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1]
        ]
        let bgR = 0, bgG = 0, bgB = 0
        corners.forEach(([x, y]) => {
          const idx = (y * canvas.width + x) * 4
          bgR += data[idx]
          bgG += data[idx + 1]
          bgB += data[idx + 2]
        })
        bgR = Math.round(bgR / 4)
        bgG = Math.round(bgG / 4)
        bgB = Math.round(bgB / 4)

        // Remove pixels similar to background
        const threshold = 60
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2]
          const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB)
          if (diff < threshold) {
            data[i + 3] = 0 // Make transparent
          }
        }

        ctx.putImageData(imgData, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = imageData
    })
  }

  // Handle stamp file upload
  const handleStampUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProcessingStamp(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      const imageData = event.target?.result as string
      const processedImage = await removeBackground(imageData)
      setStampImage(processedImage)
      setProcessingStamp(false)
    }
    reader.readAsDataURL(file)
  }

  // Start camera for stamp capture
  const startCamera = async () => {
    setShowCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera error:', err)
      setShowCamera(false)
    }
  }

  // Capture stamp from camera
  const captureStamp = async () => {
    if (!videoRef.current) return

    setProcessingStamp(true)
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0)
      const imageData = canvas.toDataURL('image/png')
      const processedImage = await removeBackground(imageData)
      setStampImage(processedImage)
    }

    // Stop camera
    const stream = videoRef.current.srcObject as MediaStream
    stream?.getTracks().forEach(track => track.stop())
    setShowCamera(false)
    setProcessingStamp(false)
  }

  // Save stamp image
  const handleStampImageSave = () => {
    if (activeFieldId && stampImage) {
      setFieldValues(prev => ({ ...prev, [activeFieldId]: stampImage }))
      setSignedFields(prev => new Set([...Array.from(prev), activeFieldId]))
    }
    setShowStampPicker(false)
    setActiveFieldId(null)
    setStampImage(null)
    setShowCamera(false)
  }

  // Field editing state (position, size, formatting)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [showFormatting, setShowFormatting] = useState(false)
  const [fieldPositions, setFieldPositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({})
  const [fieldFormatting, setFieldFormatting] = useState<Record<string, { fontSize: number; fontFamily: string; bold: boolean; italic: boolean; color: string }>>({})
  const [signatureScales, setSignatureScales] = useState<Record<string, number>>({})
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number; fieldX: number; fieldY: number } | null>(null)
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

  const pagesContainerRef = useRef<HTMLDivElement>(null)
  const documentContainerRef = useRef<HTMLDivElement>(null)
  const textEditorPopupRef = useRef<HTMLDivElement>(null)
  const [popupFlipped, setPopupFlipped] = useState(false)

  // Ensure text editor popup is always visible below the field
  useEffect(() => {
    if (!editingFieldId) {
      setPopupFlipped(false)
      return
    }
    // Always show popup below - scroll it into view if needed
    setPopupFlipped(false)
    const rafId = requestAnimationFrame(() => {
      if (textEditorPopupRef.current) {
        const rect = textEditorPopupRef.current.getBoundingClientRect()
        if (rect.bottom > window.innerHeight) {
          textEditorPopupRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }
    })
    return () => cancelAnimationFrame(rafId)
  }, [editingFieldId])

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/signing-requests/${documentId}?email=${signerEmail}&token=${token}`)

        // Safe JSON parsing - prevents "Unexpected token" errors
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server error. Please try again.')
        }

        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Failed to load document')

        // Debug logging - track document loading
        console.log('📄 Document loaded:', {
          id: data.data.id,
          name: data.data.documentName,
          urlPrefix: data.data.documentUrl?.substring(0, 100),
          fieldsCount: data.data.signatureFields?.length,
          signersCount: data.data.signers?.length
        })

        setDocumentData(data.data)
        const signer = data.data.signers.find((s: SignerInfo) => s.email.toLowerCase() === signerEmail?.toLowerCase())
        setCurrentSigner(signer || null)
        // Separate my fields from other signers' fields
        const allFields = data.data.signatureFields || []
        const mine = allFields.filter((f: SignatureFieldInfo) => f.isMine !== false && f.signerOrder === signer?.order)
        const others = allFields.filter((f: SignatureFieldInfo) => f.isMine === false || f.signerOrder !== signer?.order)
        setMyFields(mine)
        setOtherFields(others)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    if (documentId && signerEmail) fetchDocument()
    else { setError('Invalid signing link'); setLoading(false) }
  }, [documentId, signerEmail, token])

  // Helper function to detect file type from URL
  const getFileTypeFromUrl = (url: string): 'pdf' | 'image' | 'unknown' => {
    const lowerUrl = url.toLowerCase()
    if (lowerUrl.includes('.pdf') || lowerUrl.includes('application/pdf')) return 'pdf'
    if (lowerUrl.match(/\.(png|jpg|jpeg|gif|webp|bmp)/) || lowerUrl.includes('image/')) return 'image'
    // Default to PDF for data URLs without clear type
    if (lowerUrl.startsWith('data:') && !lowerUrl.includes('image/')) return 'pdf'
    return 'unknown'
  }

  useEffect(() => {
    const loadDocument = async () => {
      if (!documentData?.documentUrl) {
        setPdfError('No document data available')
        return
      }

      const detectedType = getFileTypeFromUrl(documentData.documentUrl)
      setFileType(detectedType)

      if (detectedType === 'image') {
        // Load image document
        try {
          setPdfLoading(true)
          setPdfError(null)
          setImageUrl(documentData.documentUrl)
          setTotalPages(1)

          // Load image to get dimensions
          const img = new Image()
          img.onload = () => {
            setImageDimensions({ width: img.width, height: img.height })
            setPageWidths([img.width * scale])
            setPageHeights([img.height * scale])
            setPdfLoading(false)
          }
          img.onerror = () => {
            setPdfError('Failed to load image document.')
            setPdfLoading(false)
          }
          img.src = documentData.documentUrl
        } catch (err) {
          console.error('Error loading image:', err)
          setPdfError('Failed to load image document.')
          setPdfLoading(false)
        }
      } else {
        // Load PDF document
        try {
          setPdfLoading(true)
          setPdfError(null)

          console.log('Loading PDF, URL type:', documentData.documentUrl.substring(0, 50))

          let pdfData: Uint8Array

          if (documentData.documentUrl.startsWith('data:')) {
            // Extract base64 from data URL
            const base64Match = documentData.documentUrl.match(/base64,(.*)/)
            if (base64Match) {
              const base64 = base64Match[1]
              const binaryString = atob(base64)
              pdfData = new Uint8Array(binaryString.length)
              for (let i = 0; i < binaryString.length; i++) {
                pdfData[i] = binaryString.charCodeAt(i)
              }
            } else {
              throw new Error('Invalid data URL format')
            }
          } else if (documentData.documentUrl.startsWith('http') || documentData.documentUrl.startsWith('/')) {
            // Fetch PDF as binary data (avoids CORS issues with pdf.js)
            const pdfResponse = await fetch(documentData.documentUrl)
            if (!pdfResponse.ok) throw new Error('Failed to download document')
            const arrayBuffer = await pdfResponse.arrayBuffer()
            pdfData = new Uint8Array(arrayBuffer)
          } else {
            // Assume raw base64
            const binaryString = atob(documentData.documentUrl)
            pdfData = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
              pdfData[i] = binaryString.charCodeAt(i)
            }
          }

          const loadingTask = pdfjsLib.getDocument({
            data: pdfData,
            cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
            cMapPacked: true,
            standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/standard_fonts/`,
            useSystemFonts: true,
            disableFontFace: false,
          })
          const pdf = await loadingTask.promise
          console.log('PDF loaded successfully, pages:', pdf.numPages)
          setPdfDoc(pdf)
          setTotalPages(pdf.numPages)
        } catch (err) {
          console.error('Error loading PDF:', err)
          setPdfError('Failed to load document. Please contact the sender.')
        } finally {
          setPdfLoading(false)
        }
      }
    }
    loadDocument()
  }, [documentData?.documentUrl, scale])

  const renderAllPages = useCallback(async () => {
    if (!pdfDoc) return
    const renderScale = 1.5 // Fixed scale for rendering quality
    const numPages = pdfDoc.numPages

    // Initialize arrays with placeholders for progressive display
    const initialImages = new Array(numPages).fill('')
    const initialHeights = new Array(numPages).fill(842 * scale)
    const initialWidths = new Array(numPages).fill(595 * scale)
    setPageImages(initialImages)
    setPageHeights(initialHeights)
    setPageWidths(initialWidths)

    // Render all pages in parallel using Promise.all
    const renderPage = async (pageNum: number) => {
      try {
        const page = await pdfDoc.getPage(pageNum)
        const viewport = page.getViewport({ scale: renderScale })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) return { pageNum, image: '', height: 842 * scale, width: 595 * scale }

        canvas.width = viewport.width
        canvas.height = viewport.height

        context.setTransform(1, 0, 0, 1, 0, 0)
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)

        await page.render({
          canvasContext: context,
          viewport: viewport,
          background: 'white'
        }).promise

        const imageUrl = canvas.toDataURL('image/png')
        return {
          pageNum,
          image: imageUrl,
          height: (viewport.height / renderScale) * scale,
          width: (viewport.width / renderScale) * scale
        }
      } catch (err) {
        console.error('Error rendering page', pageNum, err)
        return { pageNum, image: '', height: 842 * scale, width: 595 * scale }
      }
    }

    const pagePromises = Array.from({ length: numPages }, (_, i) => renderPage(i + 1))
    const results = await Promise.all(pagePromises)

    // Sort by page number and set state
    results.sort((a, b) => a.pageNum - b.pageNum)
    setPageImages(results.map(r => r.image))
    setPageHeights(results.map(r => r.height))
    setPageWidths(results.map(r => r.width))
  }, [pdfDoc, scale])

  useEffect(() => {
    if (pdfDoc) {
      const timer = setTimeout(() => renderAllPages(), 100)
      return () => clearTimeout(timer)
    }
  }, [pdfDoc, renderAllPages])

  // Re-render when scale changes
  useEffect(() => {
    if (pdfDoc) {
      renderAllPages()
    }
  }, [scale])

  // Update image dimensions when scale changes
  useEffect(() => {
    if (fileType === 'image' && imageDimensions) {
      setPageWidths([imageDimensions.width * scale])
      setPageHeights([imageDimensions.height * scale])
    }
  }, [scale, fileType, imageDimensions])

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3))
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))
  const fitToWidth = () => setScale(1.0)

  // Clear error when fields are filled
  useEffect(() => {
    if (error === 'Please fill all required fields' || error === 'Please provide your signature') {
      setError(null)
    }
  }, [signedFields.size])

  const handleSignatureCreated = (sig: string | null) => {
    if (sig && activeFieldId) {
      setSignature(sig)
      setSignedFields(prev => new Set([...Array.from(prev), activeFieldId]))
      setShowSignaturePad(false)
      setActiveFieldId(null)
    }
  }

  // Helper functions to identify field types
  const isSignatureType = (type: string) => type === 'signature' || type === 'initials'
  const isTextType = (type: string) => ['text', 'name', 'firstName', 'lastName', 'title', 'email', 'phone', 'company', 'multiline'].includes(type)
  const isCheckboxType = (type: string) => type === 'checkbox'
  // Radio type removed
  const isDateType = (type: string) => type === 'date'
  const isSelectionType = (type: string) => type === 'selection'
  const isStrikethroughType = (type: string) => type === 'strikethrough'
  const isStampType = (type: string) => type === 'stamp'

  const getFieldLabel = (type: string) => {
    const labels: Record<string, string> = {
      signature: 'Sign here',
      initials: 'Initial here',
      text: 'Enter text',
      name: 'Enter name',
      firstName: 'Enter first name',
      lastName: 'Enter last name',
      title: 'Enter title',
      email: 'Enter email',
      phone: 'Enter phone',
      company: 'Enter company',
      multiline: 'Enter text',
      date: 'Select date',
      checkbox: 'Check',
      selection: 'Select option',
      strikethrough: 'Strikethrough',
      stamp: 'Add stamp'
    }
    return labels[type] || 'Click to fill'
  }

  const handleFieldClick = (fieldId: string) => {
    if (signedFields.has(fieldId)) return
    const field = myFields.find(f => f.id === fieldId)
    if (!field) return

    setActiveFieldId(fieldId)

    if (isSignatureType(field.type)) {
      setShowSignaturePad(true)
    } else if (isTextType(field.type)) {
      // Edit directly on document
      setEditingFieldId(fieldId)
      setFieldValues(prev => ({ ...prev, [fieldId]: prev[fieldId] || '' }))
    } else if (isDateType(field.type)) {
      setTextInputValue(fieldValues[fieldId] || '')
      setShowDatePicker(true)
    } else if (isCheckboxType(field.type)) {
      // Toggle checkbox directly
      const newValue = fieldValues[fieldId] === 'checked' ? '' : 'checked'
      setFieldValues(prev => ({ ...prev, [fieldId]: newValue }))
      if (newValue === 'checked') {
        setSignedFields(prev => new Set([...Array.from(prev), fieldId]))
      } else {
        setSignedFields(prev => {
          const newSet = new Set(prev)
          newSet.delete(fieldId)
          return newSet
        })
      }
      setActiveFieldId(null)
    } else if (isSelectionType(field.type)) {
      setTextInputValue(fieldValues[fieldId] || '')
      setShowSelection(true)
    } else if (isStrikethroughType(field.type)) {
      // Show strikethrough color picker
      setShowStrikethroughPicker(true)
    } else if (isStampType(field.type)) {
      setShowStampPicker(true)
    }
  }

  const handleTextInputSave = () => {
    if (activeFieldId && textInputValue.trim()) {
      setFieldValues(prev => ({ ...prev, [activeFieldId]: textInputValue }))
      setSignedFields(prev => new Set([...Array.from(prev), activeFieldId]))
    }
    setShowTextInput(false)
    setShowDatePicker(false)
    setActiveFieldId(null)
    setTextInputValue('')
  }

  // Save inline text editing
  const handleInlineTextSave = (fieldId: string) => {
    const value = fieldValues[fieldId]
    if (value && value.trim()) {
      setSignedFields(prev => new Set([...Array.from(prev), fieldId]))
    }
    setEditingFieldId(null)
    setActiveFieldId(null)
  }

  // Handle inline text change
  const handleInlineTextChange = (fieldId: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleDateSave = () => {
    if (activeFieldId && textInputValue) {
      setFieldValues(prev => ({ ...prev, [activeFieldId]: textInputValue }))
      setSignedFields(prev => new Set([...Array.from(prev), activeFieldId]))
    }
    setShowDatePicker(false)
    setActiveFieldId(null)
    setTextInputValue('')
  }

  const handleSelectionSave = (value: string) => {
    if (activeFieldId && value) {
      setFieldValues(prev => ({ ...prev, [activeFieldId]: value }))
      setSignedFields(prev => new Set([...Array.from(prev), activeFieldId]))
    }
    setShowSelection(false)
    setActiveFieldId(null)
    setTextInputValue('')
  }

  const handleStampSave = (stamp: string) => {
    if (activeFieldId && stamp) {
      setFieldValues(prev => ({ ...prev, [activeFieldId]: stamp }))
      setSignedFields(prev => new Set([...Array.from(prev), activeFieldId]))
    }
    setShowStampPicker(false)
    setActiveFieldId(null)
  }

  // Get field position (custom or original)
  const getCustomFieldPosition = (field: SignatureFieldInfo) => {
    if (fieldPositions[field.id]) {
      return fieldPositions[field.id]
    }
    return { x: field.x, y: field.y, width: field.width, height: field.height }
  }

  // Get field formatting
  const getFieldFormatting = (fieldId: string, field?: SignatureFieldInfo) => {
    const defaultFontSize = field?.fontSize || 14
    const defaultFontFamily = field?.fontFamily || 'Arial'
    const defaultBold = field?.fontBold || false
    return fieldFormatting[fieldId] || { fontSize: defaultFontSize, fontFamily: defaultFontFamily, bold: defaultBold, italic: false, color: '#000000' }
  }

  // Handle drag start - works for all fields (signed and unsigned)
  const handleDragStart = (e: React.MouseEvent, fieldId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const field = myFields.find(f => f.id === fieldId)
    if (!field) return
    const pos = getCustomFieldPosition(field)
    setSelectedFieldId(fieldId)
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY, fieldX: pos.x, fieldY: pos.y })
  }

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, fieldId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const field = myFields.find(f => f.id === fieldId)
    if (!field) return
    const pos = getCustomFieldPosition(field)
    setSelectedFieldId(fieldId)
    setIsResizing(true)
    setResizeStart({ x: e.clientX, y: e.clientY, width: pos.width, height: pos.height })
  }

  // Handle mouse move for drag/resize
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedFieldId) return

    if (isDragging && dragStart) {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      setFieldPositions(prev => ({
        ...prev,
        [selectedFieldId]: {
          ...getCustomFieldPosition(myFields.find(f => f.id === selectedFieldId)!),
          x: dragStart.fieldX + deltaX / scale,
          y: dragStart.fieldY + deltaY / scale
        }
      }))
    }

    if (isResizing && resizeStart) {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      const newWidth = Math.max(50, resizeStart.width + deltaX / scale)
      const newHeight = Math.max(20, resizeStart.height + deltaY / scale)
      setFieldPositions(prev => ({
        ...prev,
        [selectedFieldId]: {
          ...getCustomFieldPosition(myFields.find(f => f.id === selectedFieldId)!),
          width: newWidth,
          height: newHeight
        }
      }))
    }
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setDragStart(null)
    setResizeStart(null)
  }

  // Update field formatting
  const updateFieldFormatting = (fieldId: string, updates: Partial<{ fontSize: number; fontFamily: string; bold: boolean; italic: boolean; color: string }>) => {
    const field = myFields.find(f => f.id === fieldId)
    setFieldFormatting(prev => ({
      ...prev,
      [fieldId]: { ...getFieldFormatting(fieldId, field), ...updates }
    }))
  }

  const removeSignature = (fieldId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSignedFields(prev => {
      const newSet = new Set(prev)
      newSet.delete(fieldId)
      return newSet
    })
    // Also clear the field value
    setFieldValues(prev => {
      const newValues = { ...prev }
      delete newValues[fieldId]
      return newValues
    })
  }

  const handleSubmit = async () => {
    // Check if all fields are filled
    if (signedFields.size !== myFields.length) {
      setError('Please fill all required fields')
      return
    }
    // Check if signature is required and provided
    const hasSignatureField = myFields.some(f => isSignatureType(f.type))
    if (hasSignatureField && !signature) {
      setError('Please provide your signature')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      // Build custom positions map - only include fields that were resized
      const customPositions: Record<string, { x: number; y: number; width: number; height: number }> = {}
      Object.entries(fieldPositions).forEach(([fieldId, pos]) => {
        const field = myFields.find(f => f.id === fieldId)
        if (field && (pos.width !== field.width || pos.height !== field.height || pos.x !== field.x || pos.y !== field.y)) {
          customPositions[fieldId] = pos
        }
      })

      // Build custom formatting map - only include fields with changed formatting
      const customFormatting: Record<string, { fontSize: number; fontFamily: string; bold: boolean; italic: boolean; color: string }> = {}
      Object.entries(fieldFormatting).forEach(([fieldId, fmt]) => {
        const field = myFields.find(f => f.id === fieldId)
        if (field) {
          const defaultSize = field.fontSize || 14
          const defaultFamily = field.fontFamily || 'Arial'
          const defaultBold = field.fontBold || false
          if (fmt.fontSize !== defaultSize || fmt.fontFamily !== defaultFamily || fmt.bold !== defaultBold || fmt.italic || fmt.color !== '#000000') {
            customFormatting[fieldId] = fmt
          }
        }
      })

      const response = await fetch(`/api/signing-requests/${documentId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signerEmail,
          token,
          signature: signature || 'no-signature-field',
          signedFields: Array.from(signedFields),
          fieldValues: fieldValues,
          fieldPositions: customPositions,
          signatureScales: Object.keys(signatureScales).length > 0 ? signatureScales : undefined,
          fieldFormatting: Object.keys(customFormatting).length > 0 ? customFormatting : undefined
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to submit')
      setIsComplete(true)
    } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred') }
    finally { setIsSubmitting(false) }
  }

  const getFieldPosition = (field: SignatureFieldInfo) => {
    // Support both 'page' and 'pageNumber' field names
    const pageNum = field.page || field.pageNumber || 1
    let topOffset = 0
    for (let i = 0; i < pageNum - 1; i++) topOffset += (pageHeights[i] || 842) + 4

    // Fields are stored in original PDF coordinate space (when zoom=1 in sign-document)
    // Scale them according to current viewing scale
    return {
      left: field.x * scale,
      top: topOffset + (field.y * scale),
      width: field.width * scale,
      height: field.height * scale,
      pageNum
    }
  }

  if (loading) return (<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" /><p className="text-gray-600">Loading document...</p></div></div>)

  if (error && !documentData) return (<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-8 h-8 text-red-600" /></div><h1 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Document</h1><p className="text-gray-600 mb-4">{error}</p><p className="text-sm text-gray-500">This link may have expired or is invalid. Please contact the sender.</p></div></div>)

  if (isComplete) return (<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center"><div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-600" /></div><h1 className="text-2xl font-bold text-gray-900 mb-2">Document Signed!</h1><p className="text-gray-600 mb-6">Thank you for signing. {documentData?.senderName} has been notified.</p><div className="bg-gray-50 rounded-xl p-4 mb-6 text-left"><p className="text-sm text-gray-500 mb-1">Document</p><p className="font-medium text-gray-900">{documentData?.documentName}</p><p className="text-sm text-gray-500 mt-3 mb-1">Signed at</p><p className="font-medium text-gray-900">{new Date().toLocaleString()}</p></div><div className="flex items-center justify-center gap-4 text-sm text-gray-500"><div className="flex items-center gap-1"><Shield className="w-4 h-4 text-green-600" /><span>Legally Binding</span></div><div className="flex items-center gap-1"><Lock className="w-4 h-4 text-green-600" /><span>Secured</span></div></div></div></div>)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
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
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Signing as</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">{currentSigner?.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentSigner?.name}</p>
                  <p className="text-sm text-gray-500">{currentSigner?.email}</p>
                </div>
              </div>
            </div>

            {documentData?.message && (
              <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Message from sender</h3>
                <p className="text-gray-600 text-sm italic">&quot;{documentData.message}&quot;</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Required Fields ({signedFields.size}/{myFields.length})</h3>
              <div className="space-y-2">
                {myFields.map((field) => {
                  const getSidebarIcon = (type: string) => {
                    const icons: Record<string, React.ReactNode> = {
                      signature: <PenTool className="w-5 h-5" />,
                      initials: <Type className="w-5 h-5" />,
                      text: <AlignLeft className="w-5 h-5" />,
                      name: <User className="w-5 h-5" />,
                      firstName: <User className="w-5 h-5" />,
                      lastName: <User className="w-5 h-5" />,
                      title: <Type className="w-5 h-5" />,
                      email: <Mail className="w-5 h-5" />,
                      phone: <Phone className="w-5 h-5" />,
                      company: <Building className="w-5 h-5" />,
                      multiline: <AlignLeft className="w-5 h-5" />,
                      date: <Calendar className="w-5 h-5" />,
                      checkbox: <CheckSquare className="w-5 h-5" />,
                      selection: <ChevronDown className="w-5 h-5" />,
                      strikethrough: <Strikethrough className="w-5 h-5" />,
                      stamp: <Stamp className="w-5 h-5" />
                    }
                    return icons[type] || <PenTool className="w-5 h-5" />
                  }
                  const getSidebarLabel = (type: string) => {
                    const labels: Record<string, string> = {
                      signature: 'Signature',
                      initials: 'Initials',
                      text: 'Text',
                      name: 'Name',
                      firstName: 'First Name',
                      lastName: 'Last Name',
                      title: 'Title',
                      email: 'Email',
                      phone: 'Phone',
                      company: 'Company',
                      multiline: 'Multiline',
                      date: 'Date',
                      checkbox: 'Checkbox',
                      selection: 'Selection',
                      strikethrough: 'Strikethrough',
                      stamp: 'Stamp'
                    }
                    return labels[type] || field.label || 'Field'
                  }
                  return (
                    <div key={field.id} className={'flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ' + (signedFields.has(field.id) ? 'bg-green-50 border-green-400' : 'bg-gray-100 border-gray-200 hover:border-blue-500')} onClick={() => handleFieldClick(field.id)}>
                      <span className={signedFields.has(field.id) ? 'text-green-600' : 'text-gray-600'}>
                        {signedFields.has(field.id) ? <CheckCircle className="w-5 h-5" /> : getSidebarIcon(field.type)}
                      </span>
                      <span className={'font-medium flex-1 ' + (signedFields.has(field.id) ? 'text-green-600' : 'text-gray-600')}>{getSidebarLabel(field.type)}</span>
                      {signedFields.has(field.id) ? (
                        <button
                          onClick={(e) => removeSignature(field.id, e)}
                          className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                          title="Re-do"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>

            <button onClick={handleSubmit} disabled={signedFields.size !== myFields.length || isSubmitting} className="w-full py-4 bg-blue-600 text-gray-900 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (<><Loader2 className="w-6 h-6 animate-spin" />Submitting...</>) : (<><Check className="w-6 h-6" />Complete Signing</>)}
            </button>

            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-around text-xs text-gray-500">
                <div className="flex items-center gap-1"><Shield className="w-4 h-4 text-green-600" /><span>Encrypted</span></div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-green-600" /><span>Timestamped</span></div>
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-600" /><span>Legal</span></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-4 flex items-center justify-between sticky top-20 z-40">
              <div className="flex items-center gap-2"><span className="text-sm font-medium text-gray-600">{totalPages} {totalPages === 1 ? 'page' : 'pages'}</span></div>
              <div className="flex items-center gap-2">
                <button onClick={zoomOut} disabled={scale <= 0.5} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 text-gray-600" title="Zoom out"><ZoomOut className="w-5 h-5" /></button>
                <span className="text-sm font-medium text-gray-600 min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
                <button onClick={zoomIn} disabled={scale >= 3} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 text-gray-600" title="Zoom in"><ZoomIn className="w-5 h-5" /></button>
                <button onClick={fitToWidth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Reset zoom"><Maximize2 className="w-5 h-5" /></button>
              </div>
            </div>

            <div
              ref={documentContainerRef}
              className="bg-gray-100 rounded-xl p-4 max-h-[80vh] overflow-auto"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={(e) => {
                // Deselect field when clicking outside any field
                const target = e.target as HTMLElement
                if (!target.closest('[data-field-id]')) {
                  setSelectedFieldId(null)
                }
              }}
            >
              {pdfLoading ? (<div className="bg-white rounded-lg shadow-lg flex items-center justify-center mx-auto" style={{ width: '595px', height: '842px' }}><div className="text-center"><Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" /><p className="text-gray-600">Loading document...</p></div></div>)
              : pdfError ? (<div className="bg-white rounded-lg shadow-lg flex items-center justify-center mx-auto" style={{ width: '595px', height: '842px' }}><div className="text-center"><AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" /><p className="text-gray-600">{pdfError}</p></div></div>)
              : (
                <div ref={pagesContainerRef} className="flex flex-col items-center gap-1 relative" data-signing-pages="true">
                  {fileType === 'image' && imageUrl ? (
                    <div className="relative" data-pdf-page="true" style={{ width: pageWidths[0] || 595 * scale, height: pageHeights[0] || 842 * scale }}>
                      <img src={imageUrl} alt="Document" className="w-full h-full rounded-lg shadow-lg bg-white" draggable={false} />
                      <div className="absolute bottom-2 right-2 bg-black/50 text-gray-900 text-xs px-2 py-1 rounded">Page 1 of 1</div>
                    </div>
                  ) : (
                    pageImages.map((imgUrl, i) => (
                      <div key={i} className="relative" data-pdf-page="true" style={{ width: pageWidths[i] || 595 * scale, height: pageHeights[i] || 842 * scale }}>
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={`Page ${i + 1}`}
                            className="w-full h-full rounded-lg shadow-lg bg-white"
                            style={{ display: 'block' }}
                            draggable={false}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/50 text-gray-900 text-xs px-2 py-1 rounded">Page {i + 1} of {totalPages}</div>
                      </div>
                    ))
                  )}
                  {/* Other signers' signed fields - rendered as read-only locked overlays */}
                  {otherFields.filter(f => f.signerStatus === 'signed' && f.signedValue).map((field) => {
                    const originalPos = getFieldPosition(field)
                    const pageIndex = ((field.page || field.pageNumber || 1)) - 1
                    const actualPageWidth = pageWidths[pageIndex] || 595 * scale
                    const leftCalc = 'calc(50% - ' + (actualPageWidth / 2) + 'px + ' + (field.x * scale) + 'px)'
                    const signerColor = field.signerColor || '#9CA3AF'

                    return (
                      <div
                        key={`other-${field.id}`}
                        className="absolute pointer-events-none z-[5]"
                        style={{
                          left: leftCalc,
                          top: originalPos.top,
                          width: field.width * scale,
                          height: field.height * scale,
                          border: `1px solid ${signerColor}40`,
                          borderRadius: '4px',
                          backgroundColor: `${signerColor}05`,
                          opacity: 0.9,
                        }}
                      >
                        {/* Lock icon */}
                        <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-gray-400 rounded-full flex items-center justify-center z-10">
                          <Lock className="w-2 h-2 text-white" />
                        </div>
                        {/* Signer name tag */}
                        <div
                          className="absolute -top-5 left-3 px-1.5 py-0.5 rounded text-[9px] font-medium text-white whitespace-nowrap"
                          style={{ backgroundColor: signerColor }}
                        >
                          {field.signerName}
                        </div>
                        {/* Render signed value */}
                        <div className="w-full h-full flex items-center justify-center overflow-hidden p-0.5">
                          {(field.type === 'signature' || field.type === 'initials') && field.signedValue?.startsWith('data:') ? (
                            <img src={field.signedValue} alt={`${field.signerName}'s signature`} className="w-full h-full object-contain" style={{ mixBlendMode: 'multiply', opacity: 0.8 }} draggable={false} />
                          ) : field.type === 'checkbox' && field.signedValue === 'checked' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : field.type === 'date' && field.signedValue ? (
                            <span className="text-xs text-gray-700">{new Date(field.signedValue).toLocaleDateString()}</span>
                          ) : field.type === 'stamp' && field.signedValue?.startsWith('data:') ? (
                            <img src={field.signedValue} alt="Stamp" className="w-full h-full object-contain" style={{ mixBlendMode: 'multiply', opacity: 0.8 }} draggable={false} />
                          ) : field.signedValue ? (
                            <span className="text-xs text-gray-700 truncate px-1" style={{ fontSize: `${Math.min(field.fontSize || 12, field.height * scale * 0.6)}px` }}>{field.signedValue}</span>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                  {myFields.map((field) => {
                    const originalPos = getFieldPosition(field)
                    const customPos = getCustomFieldPosition(field)
                    // Use actual page width instead of hardcoded 595
                    const pageIndex = (originalPos.pageNum || 1) - 1
                    const actualPageWidth = pageWidths[pageIndex] || 595 * scale
                    const leftCalc = 'calc(50% - ' + (actualPageWidth / 2) + 'px + ' + (customPos.x * scale) + 'px)'

                    // Get appropriate icon for field type
                    const getFieldIcon = (type: string) => {
                      const icons: Record<string, React.ReactNode> = {
                        signature: <PenTool className="w-4 h-4" />,
                        initials: <Type className="w-4 h-4" />,
                        text: <AlignLeft className="w-4 h-4" />,
                        name: <User className="w-4 h-4" />,
                        firstName: <User className="w-4 h-4" />,
                        lastName: <User className="w-4 h-4" />,
                        title: <Type className="w-4 h-4" />,
                        email: <Mail className="w-4 h-4" />,
                        phone: <Phone className="w-4 h-4" />,
                        company: <Building className="w-4 h-4" />,
                        multiline: <AlignLeft className="w-4 h-4" />,
                        date: <Calendar className="w-4 h-4" />,
                        checkbox: <CheckSquare className="w-4 h-4" />,
                        selection: <ChevronDown className="w-4 h-4" />,
                        strikethrough: <Strikethrough className="w-4 h-4" />,
                        stamp: <Stamp className="w-4 h-4" />
                      }
                      return icons[type] || <PenTool className="w-4 h-4" />
                    }

                    const fieldIcon = getFieldIcon(field.type)
                    const fieldLabel = getFieldLabel(field.type)
                    const isSigType = isSignatureType(field.type)
                    const isTxtType = isTextType(field.type)
                    const isChkType = isCheckboxType(field.type)
                    const isDtType = isDateType(field.type)
                    const isSelType = isSelectionType(field.type)
                    const isStrkType = isStrikethroughType(field.type)
                    const isStmpType = isStampType(field.type)
                    const hasValue = signedFields.has(field.id)
                    const fieldValue = fieldValues[field.id]
                    const isSelected = selectedFieldId === field.id
                    const isEditing = editingFieldId === field.id
                    const formatting = getFieldFormatting(field.id, field)
                    const canFormat = isTxtType || isDtType || isSelType

                    // Text style based on formatting
                    const textStyle: React.CSSProperties = {
                      fontSize: `${formatting.fontSize}px`,
                      fontFamily: formatting.fontFamily || 'Arial',
                      fontWeight: formatting.bold ? 'bold' : 'normal',
                      fontStyle: formatting.italic ? 'italic' : 'normal',
                      color: formatting.color
                    }

                    return (
                      <div
                        key={field.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          // If already selected, open signing modal (double-click behavior on single click)
                          if (isSelected && !hasValue) {
                            handleFieldClick(field.id)
                          } else {
                            // First click always selects the field (for resize/move)
                            setSelectedFieldId(field.id)
                          }
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          // Double-click opens signing/editing modal
                          if (isTxtType && hasValue) {
                            setEditingFieldId(field.id)
                            setActiveFieldId(field.id)
                            setSelectedFieldId(null)
                          } else if (!hasValue) {
                            handleFieldClick(field.id)
                          }
                        }}
                        onMouseDown={(e) => handleDragStart(e, field.id)}
                        className={'absolute border-2 rounded transition-all z-10 group ' +
                          (isEditing
                            ? 'border-blue-500 ring-2 ring-blue-400 bg-white/90'
                            : isSelected
                              ? 'border-blue-500 ring-2 ring-blue-300 cursor-move'
                              : hasValue
                                ? 'border-blue-400/50 cursor-move hover:border-blue-500'
                                : 'border-dashed border-blue-500 hover:border-blue-600 cursor-pointer'
                          )}
                        data-editing={isEditing}
                        data-field-id={field.id}
                        style={{
                          left: leftCalc,
                          top: originalPos.top + ((customPos.y - field.y) * scale),
                          width: customPos.width * scale,
                          height: customPos.height * scale,
                          zIndex: isEditing ? 200 : (isSelected ? 100 : 10),
                          backgroundColor: isEditing ? 'rgba(255,255,255,0.95)' : 'transparent'
                        }}
                      >
                        {/* Inline editing for text fields - with font size popup */}
                        {isEditing && isTxtType ? (
                          <>
                            {/* Text Editor - Floating popup */}
                            <div
                              ref={textEditorPopupRef}
                              className="absolute z-[300] flex flex-col bg-white shadow-2xl rounded-lg border border-gray-300"
                              style={{
                                ...(popupFlipped
                                  ? { bottom: '100%', marginBottom: '8px' }
                                  : { top: '100%', marginTop: '8px' }),
                                left: '0',
                                minWidth: '320px',
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Text Formatting Toolbar */}
                              <div className="flex items-center gap-1.5 px-2.5 py-2 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                                {field.type === 'title' ? (
                                  <>
                                    {/* Title: H1-H4 Size Buttons */}
                                    <div className="flex items-center gap-1 shrink-0">
                                      {[
                                        { label: 'H1', size: 32 },
                                        { label: 'H2', size: 24 },
                                        { label: 'H3', size: 20 },
                                        { label: 'H4', size: 16 },
                                      ].map((item) => (
                                        <button
                                          key={item.size}
                                          onClick={() => updateFieldFormatting(field.id, { fontSize: item.size })}
                                          className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                                            formatting.fontSize === item.size
                                              ? 'bg-blue-600 text-white shadow-md'
                                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-500'
                                          }`}
                                        >
                                          {item.label}
                                        </button>
                                      ))}
                                    </div>
                                    {/* Separator */}
                                    <div className="w-px h-6 bg-gray-300 shrink-0"></div>
                                    {/* Font Family for Title */}
                                    <select
                                      value={formatting.fontFamily || 'Arial'}
                                      onChange={(e) => updateFieldFormatting(field.id, { fontFamily: e.target.value })}
                                      className="h-8 w-[90px] px-1.5 pr-5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md outline-none cursor-pointer hover:border-blue-500 transition-colors appearance-none truncate"
                                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                                    >
                                      <option value="Arial">Arial</option>
                                      <option value="Times New Roman">Times New Roman</option>
                                      <option value="Georgia">Georgia</option>
                                      <option value="Verdana">Verdana</option>
                                      <option value="Courier New">Courier New</option>
                                      <option value="Trebuchet MS">Trebuchet MS</option>
                                      <option value="Tahoma">Tahoma</option>
                                    </select>
                                    {/* Separator */}
                                    <div className="w-px h-6 bg-gray-300 shrink-0"></div>
                                    {/* Bold for Title */}
                                    <button
                                      onClick={() => updateFieldFormatting(field.id, { bold: !formatting.bold })}
                                      className={`h-8 w-8 shrink-0 flex items-center justify-center rounded-md border transition-colors ${
                                        formatting.bold
                                          ? 'bg-blue-600 text-white border-blue-600'
                                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                      }`}
                                      title="Bold"
                                    >
                                      <Bold className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {/* Non-title: Font Family + Size +/- + Bold */}
                                    <select
                                      value={formatting.fontFamily || 'Arial'}
                                      onChange={(e) => updateFieldFormatting(field.id, { fontFamily: e.target.value })}
                                      className="h-8 w-[100px] px-1.5 pr-6 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md outline-none cursor-pointer hover:border-blue-500 transition-colors appearance-none truncate"
                                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                                    >
                                      <option value="Arial">Arial</option>
                                      <option value="Times New Roman">Times New Roman</option>
                                      <option value="Georgia">Georgia</option>
                                      <option value="Verdana">Verdana</option>
                                      <option value="Courier New">Courier New</option>
                                      <option value="Trebuchet MS">Trebuchet MS</option>
                                      <option value="Tahoma">Tahoma</option>
                                    </select>
                                    {/* Separator */}
                                    <div className="w-px h-6 bg-gray-300 shrink-0"></div>
                                    {/* Font Size - / + Controls */}
                                    <div className="flex items-center shrink-0">
                                      <button
                                        onClick={() => updateFieldFormatting(field.id, { fontSize: Math.max(formatting.fontSize - 1, 8) })}
                                        className="h-8 w-7 flex items-center justify-center text-gray-600 bg-white border border-gray-300 rounded-l-md hover:bg-gray-100 transition-colors"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </button>
                                      <input
                                        type="number"
                                        value={formatting.fontSize}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value)
                                          if (val >= 8 && val <= 72) updateFieldFormatting(field.id, { fontSize: val })
                                        }}
                                        className="h-8 w-9 text-center text-xs font-semibold text-gray-700 border-t border-b border-gray-300 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      />
                                      <button
                                        onClick={() => updateFieldFormatting(field.id, { fontSize: Math.min(formatting.fontSize + 1, 72) })}
                                        className="h-8 w-7 flex items-center justify-center text-gray-600 bg-white border border-gray-300 rounded-r-md hover:bg-gray-100 transition-colors"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                    </div>
                                    {/* Separator */}
                                    <div className="w-px h-6 bg-gray-300 shrink-0"></div>
                                    {/* Bold Button */}
                                    <button
                                      onClick={() => updateFieldFormatting(field.id, { bold: !formatting.bold })}
                                      className={`h-8 w-8 shrink-0 flex items-center justify-center rounded-md border transition-colors ${
                                        formatting.bold
                                          ? 'bg-blue-600 text-white border-blue-600'
                                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                      }`}
                                      title="Bold"
                                    >
                                      <Bold className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                              {/* Input */}
                              <input
                                type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                                value={fieldValue || ''}
                                onChange={(e) => handleInlineTextChange(field.id, e.target.value)}
                                placeholder={field.type === 'name' ? 'Type name...' : field.type === 'email' ? 'Type email...' : field.type === 'phone' ? 'Type phone...' : `Type ${field.label || 'here'}...`}
                                className="w-full px-3 py-3 border-none outline-none"
                                style={{
                                  color: '#000000',
                                  backgroundColor: '#ffffff',
                                  fontSize: `${Math.max(formatting.fontSize, 14)}px`,
                                  fontFamily: formatting.fontFamily || 'Arial',
                                  fontWeight: formatting.bold ? 'bold' : 'normal',
                                  fontStyle: formatting.italic ? 'italic' : 'normal'
                                }}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleInlineTextSave(field.id)
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingFieldId(null)
                                    setActiveFieldId(null)
                                  }
                                }}
                              />
                              {/* Done button */}
                              <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-lg">
                                <button
                                  onClick={() => handleInlineTextSave(field.id)}
                                  className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                  Done
                                </button>
                              </div>
                              {/* Arrow pointing to field */}
                              {popupFlipped ? (
                                <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white border-r border-b border-gray-300 transform rotate-45"></div>
                              ) : (
                                <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-l border-t border-gray-300 transform rotate-45"></div>
                              )}
                            </div>
                            {/* Show typed value or placeholder inside the field during editing */}
                            <div className="w-full h-full flex items-center px-2" style={{ overflow: 'hidden' }}>
                              {fieldValue ? (
                                <span style={{
                                  color: '#000000',
                                  fontSize: `${Math.max(12, Math.min(formatting.fontSize, (customPos.height * scale * 0.6)))}px`,
                                  fontFamily: formatting.fontFamily || 'Arial',
                                  fontWeight: formatting.bold ? 'bold' : 'normal',
                                  fontStyle: formatting.italic ? 'italic' : 'normal',
                                  whiteSpace: 'nowrap'
                                }}>{fieldValue}</span>
                              ) : (
                                <span className="text-blue-500 text-sm font-medium">{field.label || 'Click to fill'}</span>
                              )}
                            </div>
                          </>
                        ) : hasValue ? (
                          <>
                            {/* Signature/Initials - show signature image with transparent bg */}
                            {isSigType && signature && (
                              <img
                                src={signature}
                                alt="Your signature"
                                className="w-full h-full object-contain"
                                style={{
                                  filter: formatting.bold ? 'contrast(1.8) brightness(0.7)' : 'none',
                                  mixBlendMode: 'multiply',
                                  transform: `scale(${signatureScales[field.id] || 1})`,
                                  transformOrigin: 'center center'
                                }}
                              />
                            )}
                            {/* Text fields - show the entered value */}
                            {isTxtType && fieldValue && (
                              <div className="w-full h-full flex items-center px-2" onClick={() => setEditingFieldId(field.id)}>
                                <span style={{
                                  color: '#000000',
                                  fontSize: `${Math.max(12, Math.min(formatting.fontSize, (customPos.height * scale * 0.6)))}px`,
                                  fontFamily: formatting.fontFamily || 'Arial',
                                  fontWeight: formatting.bold ? 'bold' : 'normal',
                                  fontStyle: formatting.italic ? 'italic' : 'normal',
                                  lineHeight: '1.2',
                                  wordBreak: 'break-word'
                                }}>{fieldValue}</span>
                              </div>
                            )}
                            {/* Date field - show the selected date */}
                            {isDtType && fieldValue && (
                              <div className="w-full h-full flex items-center px-1">
                                <span className="w-full text-left text-black" style={{
                                  fontSize: `${Math.min(formatting.fontSize, (customPos.height * scale * 0.7))}px`,
                                  fontFamily: formatting.fontFamily || 'Arial',
                                  fontWeight: formatting.bold ? 'bold' : 'normal',
                                  fontStyle: formatting.italic ? 'italic' : 'normal'
                                }}>{new Date(fieldValue).toLocaleDateString()}</span>
                              </div>
                            )}
                            {/* Checkbox - show checkmark */}
                            {isChkType && fieldValue === 'checked' && (
                              <div className="w-full h-full flex items-center justify-center">
                                <CheckSquare className="w-5 h-5 text-green-600" />
                              </div>
                            )}
                            {/* Selection - show selected value */}
                            {isSelType && fieldValue && (
                              <div className="w-full h-full flex items-center px-1">
                                <span className="w-full text-left text-black" style={{
                                  fontSize: `${Math.min(formatting.fontSize, (customPos.height * scale * 0.7))}px`,
                                  fontFamily: formatting.fontFamily || 'Arial',
                                  fontWeight: formatting.bold ? 'bold' : 'normal',
                                  fontStyle: formatting.italic ? 'italic' : 'normal'
                                }}>{fieldValue}</span>
                              </div>
                            )}
                            {/* Strikethrough - horizontal line through text */}
                            {isStrkType && fieldValue && (
                              <div className="w-full h-full flex items-center justify-center pointer-events-none">
                                <div className="w-full h-[3px] rounded shadow-sm" style={{ backgroundColor: fieldValue.startsWith('#') ? fieldValue : '#dc2626' }} />
                              </div>
                            )}
                            {/* Stamp - show stamp image or text */}
                            {isStmpType && fieldValue && (
                              fieldValue.startsWith('data:image') ? (
                                <img src={fieldValue} alt="Stamp" className="w-full h-full object-contain" style={{ display: 'block', mixBlendMode: 'multiply' }} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                  <span className="text-red-600 font-bold border-2 border-red-600 px-2 py-0.5 rounded transform -rotate-12" style={{ fontSize: `${Math.min(formatting.fontSize, (customPos.height * scale * 0.6))}px` }}>{fieldValue}</span>
                                </div>
                              )
                            )}

                            {/* Formatting toolbar - show when selected (for ALL field types) */}
                            {isSelected && hasValue && (
                              <div className="absolute -top-12 left-0 flex items-center gap-1 bg-white rounded-lg p-1.5 shadow-xl border border-gray-200 z-30">
                                {/* Size controls - works for all fields */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const pos = getCustomFieldPosition(field)
                                    setFieldPositions(prev => ({
                                      ...prev,
                                      [field.id]: { ...pos, width: Math.max(30, pos.width - 10), height: Math.max(20, pos.height - 5) }
                                    }))
                                  }}
                                  className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium"
                                  title="Make smaller"
                                >
                                  <ZoomOut className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const pos = getCustomFieldPosition(field)
                                    setFieldPositions(prev => ({
                                      ...prev,
                                      [field.id]: { ...pos, width: pos.width + 10, height: pos.height + 5 }
                                    }))
                                  }}
                                  className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium"
                                  title="Make larger"
                                >
                                  <ZoomIn className="w-4 h-4" />
                                </button>
                                {/* Signature scale controls */}
                                {isSigType && (
                                  <>
                                    <div className="w-px h-6 bg-gray-300 mx-1" />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        const current = signatureScales[field.id] || 1
                                        setSignatureScales(prev => ({ ...prev, [field.id]: Math.max(0.5, current - 0.1) }))
                                      }}
                                      className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                                      title="Decrease signature size"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-xs font-medium text-gray-500 min-w-[28px] text-center">{Math.round((signatureScales[field.id] || 1) * 100)}%</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        const current = signatureScales[field.id] || 1
                                        setSignatureScales(prev => ({ ...prev, [field.id]: Math.min(1.5, current + 0.1) }))
                                      }}
                                      className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                                      title="Increase signature size"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </>
                                )}
                                {/* Bold - for text and signature */}
                                <div className="w-px h-6 bg-gray-300 mx-1" />
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateFieldFormatting(field.id, { bold: !formatting.bold }) }}
                                  className={`w-8 h-8 flex items-center justify-center rounded font-bold ${formatting.bold ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                  title="Bold"
                                >
                                  <Bold className="w-4 h-4" />
                                </button>
                                {/* Text-specific options */}
                                {canFormat && (
                                  <>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); updateFieldFormatting(field.id, { italic: !formatting.italic }) }}
                                      className={`w-8 h-8 flex items-center justify-center rounded ${formatting.italic ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                      title="Italic"
                                    >
                                      <Italic className="w-4 h-4" />
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1" />
                                    <input
                                      type="color"
                                      value={formatting.color}
                                      onChange={(e) => { e.stopPropagation(); updateFieldFormatting(field.id, { color: e.target.value }) }}
                                      className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                                      title="Text color"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </>
                                )}
                              </div>
                            )}

                            {/* Delete/Re-do button - only for signed fields */}
                            {hasValue && (
                              <button
                                onClick={(e) => removeSignature(field.id, e)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-gray-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg z-20"
                                title="Remove and redo"
                                style={{ display: isSelected ? 'none' : undefined }}
                              >
                                <RotateCcw className="w-3 h-3" />
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm flex items-center gap-1">{fieldIcon}{(isChkType || isStrkType) ? 'Click' : (isSelected ? 'Double-click to fill' : 'Click to select')}</span>
                          </div>
                        )}

                        {/* Move indicator - shows for ALL selected fields */}
                        {isSelected && (
                          <div className="absolute -top-2 -left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-30">
                            <Move className="w-3 h-3 text-gray-900" />
                          </div>
                        )}

                        {/* Resize handles - shows for ALL selected fields */}
                        {isSelected && (
                          <>
                            {/* Bottom-right resize handle */}
                            <div
                              onMouseDown={(e) => handleResizeStart(e, field.id)}
                              className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center cursor-se-resize shadow-lg z-30"
                              title="Drag to resize"
                            >
                              <Maximize className="w-3 h-3 text-gray-900" />
                            </div>
                            {/* Sign/Fill button for unsigned fields */}
                            {!hasValue && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleFieldClick(field.id)
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-gray-900 rounded-full flex items-center justify-center hover:bg-green-600 shadow-lg z-30"
                                title="Click to sign/fill"
                              >
                                <PenTool className="w-3 h-3" />
                              </button>
                            )}
                          </>
                        )}

                        {/* Field label for unsigned fields */}
                        {!hasValue && !isSelected && (<div className="absolute -top-6 left-0"><span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-500 text-gray-900 whitespace-nowrap animate-bounce">{fieldLabel}</span></div>)}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSignaturePad && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Create Your Signature</h3>
                <button onClick={() => { setShowSignaturePad(false); setActiveFieldId(null) }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <SignatureCanvas
                onSignatureChange={handleSignatureCreated}
                onCancel={() => { setShowSignaturePad(false); setActiveFieldId(null) }}
                showDoneButton={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Text Input Modal - Pad Style */}
      {showTextInput && activeFieldId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {(() => {
                    const field = myFields.find(f => f.id === activeFieldId)
                    const labels: Record<string, string> = {
                      name: 'Enter Your Name',
                      email: 'Enter Your Email',
                      phone: 'Enter Phone Number',
                      company: 'Enter Company Name',
                      text: 'Enter Text',
                      multiline: 'Enter Text'
                    }
                    return labels[field?.type || 'text'] || 'Enter Value'
                  })()}
                </h3>
                <button onClick={() => { setShowTextInput(false); setActiveFieldId(null); setTextInputValue('') }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
              </div>

              {/* Preview Area */}
              <div className="bg-white rounded-xl p-6 mb-4 min-h-[120px] flex items-center justify-center border-2 border-dashed border-gray-300">
                {textInputValue ? (
                  <span className="text-2xl text-black font-medium">{textInputValue}</span>
                ) : (
                  <span className="text-gray-500 text-lg">Your text will appear here...</span>
                )}
              </div>

              {/* Input Area */}
              <div className="space-y-4">
                {(() => {
                  const field = myFields.find(f => f.id === activeFieldId)
                  const isMultiline = field?.type === 'multiline'
                  const placeholders: Record<string, string> = {
                    name: 'Type your full name...',
                    email: 'Type your email address...',
                    phone: 'Type your phone number...',
                    company: 'Type company name...',
                    text: 'Type here...',
                    multiline: 'Type your text here...'
                  }
                  return isMultiline ? (
                    <textarea
                      value={textInputValue}
                      onChange={(e) => setTextInputValue(e.target.value)}
                      placeholder={placeholders[field?.type || 'text'] || 'Type here...'}
                      className="w-full px-4 py-4 bg-gray-100 border-2 border-gray-300 rounded-xl text-gray-900 text-lg placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={4}
                      autoFocus
                    />
                  ) : (
                    <input
                      type={field?.type === 'email' ? 'email' : field?.type === 'phone' ? 'tel' : 'text'}
                      value={textInputValue}
                      onChange={(e) => setTextInputValue(e.target.value)}
                      placeholder={placeholders[field?.type || 'text'] || 'Type here...'}
                      className="w-full px-4 py-4 bg-gray-100 border-2 border-gray-300 rounded-xl text-gray-900 text-lg placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') handleTextInputSave() }}
                    />
                  )
                })()}

                <p className="text-sm text-gray-500 text-center">After saving, you can drag to move, resize, and format the text on the document</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowTextInput(false); setActiveFieldId(null); setTextInputValue('') }}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTextInputSave}
                    disabled={!textInputValue.trim()}
                    className="flex-1 py-4 bg-blue-500 text-black rounded-xl font-semibold hover:bg-[#b3e60d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal - Pad Style */}
      {showDatePicker && activeFieldId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Select Date</h3>
                <button onClick={() => { setShowDatePicker(false); setActiveFieldId(null); setTextInputValue('') }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
              </div>

              {/* Preview Area */}
              <div className="bg-white rounded-xl p-6 mb-4 min-h-[120px] flex items-center justify-center border-2 border-dashed border-gray-300">
                {textInputValue ? (
                  <span className="text-2xl text-black font-medium">{new Date(textInputValue).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                ) : (
                  <span className="text-gray-500 text-lg">Selected date will appear here...</span>
                )}
              </div>

              <div className="space-y-4">
                <input
                  type="date"
                  value={textInputValue}
                  onChange={(e) => setTextInputValue(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-100 border-2 border-gray-300 rounded-xl text-gray-900 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />

                <p className="text-sm text-gray-500 text-center">After saving, you can drag to move, resize, and format the date on the document</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowDatePicker(false); setActiveFieldId(null); setTextInputValue('') }}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDateSave}
                    disabled={!textInputValue}
                    className="flex-1 py-4 bg-blue-500 text-black rounded-xl font-semibold hover:bg-[#b3e60d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selection Dropdown Modal */}
      {showSelection && activeFieldId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Select Option</h3>
                <button onClick={() => { setShowSelection(false); setActiveFieldId(null); setTextInputValue('') }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <div className="space-y-4">
                <select
                  value={textInputValue}
                  onChange={(e) => setTextInputValue(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                >
                  <option value="">Select an option...</option>
                  <option value="Option 1">Option 1</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="N/A">N/A</option>
                </select>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowSelection(false); setActiveFieldId(null); setTextInputValue('') }}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSelectionSave(textInputValue)}
                    disabled={!textInputValue}
                    className="flex-1 py-3 bg-blue-500 text-black rounded-xl font-semibold hover:bg-[#b3e60d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strikethrough Color Picker Modal */}
      {showStrikethroughPicker && activeFieldId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Strikethrough</h3>
                <button onClick={() => { setShowStrikethroughPicker(false); setActiveFieldId(null) }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
              </div>

              {/* Preview */}
              <div className="bg-white rounded-xl p-4 mb-4 relative">
                <p className="text-gray-600 text-center">Sample Text Preview</p>
                <div
                  className="absolute inset-x-4 h-[3px] top-1/2 -translate-y-1/2 rounded"
                  style={{ backgroundColor: fieldValues[activeFieldId]?.startsWith('#') ? fieldValues[activeFieldId] : '#dc2626' }}
                />
              </div>

              {/* Color Options */}
              <p className="text-sm text-gray-500 mb-2">Select line color:</p>
              <div className="flex justify-center gap-3 mb-4">
                {[
                  { color: '#dc2626', name: 'Red' },
                  { color: '#000000', name: 'Black' },
                  { color: '#2563eb', name: 'Blue' },
                  { color: '#16a34a', name: 'Green' },
                  { color: '#9333ea', name: 'Purple' }
                ].map(({ color, name }) => (
                  <button
                    key={color}
                    onClick={() => setFieldValues(prev => ({ ...prev, [activeFieldId!]: color }))}
                    className={`w-10 h-10 rounded-full border-4 transition-transform hover:scale-110 ${fieldValues[activeFieldId] === color ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                    title={name}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setFieldValues(prev => { const n = {...prev}; delete n[activeFieldId!]; return n })
                    setSignedFields(prev => { const s = new Set(prev); s.delete(activeFieldId!); return s })
                    setShowStrikethroughPicker(false)
                    setActiveFieldId(null)
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={() => {
                    if (!fieldValues[activeFieldId]) {
                      setFieldValues(prev => ({ ...prev, [activeFieldId!]: '#dc2626' }))
                    }
                    setSignedFields(prev => new Set([...Array.from(prev), activeFieldId!]))
                    setShowStrikethroughPicker(false)
                    setActiveFieldId(null)
                  }}
                  className="flex-1 py-3 bg-blue-500 text-black rounded-xl font-semibold hover:bg-[#b3e60d] transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stamp Picker Modal */}
      {showStampPicker && activeFieldId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Add Stamp</h3>
                <button onClick={() => { setShowStampPicker(false); setActiveFieldId(null); setStampImage(null); setShowCamera(false) }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
              </div>

              {/* Upload & Camera Options */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">Upload or capture your stamp</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => stampFileInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-blue-600" />
                    <span className="text-sm text-gray-600">Upload Image</span>
                  </button>
                  <button
                    onClick={startCamera}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-blue-600" />
                    <span className="text-sm text-gray-600">Take Photo</span>
                  </button>
                </div>
                <input
                  ref={stampFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleStampUpload}
                  className="hidden"
                />
              </div>

              {/* Camera View */}
              {showCamera && (
                <div className="mb-6">
                  <div className="relative bg-black rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                      <button
                        onClick={captureStamp}
                        className="px-4 py-2 bg-blue-500 text-black rounded-lg font-medium hover:bg-[#b3e60d]"
                      >
                        Capture
                      </button>
                      <button
                        onClick={() => {
                          const stream = videoRef.current?.srcObject as MediaStream
                          stream?.getTracks().forEach(track => track.stop())
                          setShowCamera(false)
                        }}
                        className="px-4 py-2 bg-red-500 text-gray-900 rounded-lg font-medium hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Indicator */}
              {processingStamp && (
                <div className="mb-6 flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-xl">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-gray-600">Removing background...</span>
                </div>
              )}

              {/* Stamp Preview */}
              {stampImage && !processingStamp && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Preview (background removed)</p>
                  <div className="bg-white rounded-xl p-4 flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
                    <img src={stampImage} alt="Stamp preview" className="max-h-32 object-contain" />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setStampImage(null)}
                      className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleStampImageSave}
                      className="flex-1 py-2 bg-blue-500 text-black rounded-lg font-semibold hover:bg-[#b3e60d]"
                    >
                      Use This Stamp
                    </button>
                  </div>
                </div>
              )}

              {/* Text Stamp Options */}
              {!stampImage && !showCamera && (
                <>
                  <div className="border-t border-gray-300 my-4 pt-4">
                    <p className="text-sm text-gray-500 mb-3">Or choose a text stamp</p>
                    <div className="grid grid-cols-3 gap-2">
                      {stampOptions.map((stamp) => (
                        <button
                          key={stamp}
                          onClick={() => handleStampSave(stamp)}
                          className="p-3 bg-gray-100 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                        >
                          <span className="text-red-500 font-bold text-xs border border-red-500 px-2 py-0.5 rounded">{stamp}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={() => { setShowStampPicker(false); setActiveFieldId(null); setStampImage(null); setShowCamera(false) }}
                className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
