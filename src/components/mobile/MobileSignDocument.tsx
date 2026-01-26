'use client'

/**
 * MobileSignDocument - DocuSign-style field placement on documents
 *
 * Features:
 * - Signature fields: draw/camera/upload options
 * - Text fields: keyboard input
 * - Date fields: date picker
 * - Checkbox: toggle
 * - Full drag support on mobile
 */

import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  PenTool,
  FileSignature,
  Calendar,
  User,
  AtSign,
  Building2,
  Type,
  CheckSquare,
  X,
  ChevronLeft,
  Upload,
  FileText,
  Loader2,
  ZoomIn,
  ZoomOut,
  Stamp,
  Edit3,
  Trash2,
  Camera,
  Image,
  Check,
  Share2,
  Download,
  Mail,
  UserPlus,
  Send
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import PDF viewer
const PDFViewer = dynamic(() => import('@/components/signature/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 animate-spin text-[#4C00FF]" />
    </div>
  )
})

// Field type definitions
const FIELD_TYPES = [
  { id: 'signature', name: 'Signature', icon: PenTool, inputType: 'signature' },
  { id: 'initials', name: 'Initial', icon: FileSignature, inputType: 'signature' },
  { id: 'stamp', name: 'Stamp', icon: Stamp, inputType: 'signature' }, // Stamp like signature - draw/upload
  { id: 'date', name: 'Date', icon: Calendar, inputType: 'date' },
  { id: 'name', name: 'Name', icon: User, inputType: 'text' },
  { id: 'firstName', name: 'First Name', icon: User, inputType: 'text' },
  { id: 'lastName', name: 'Last Name', icon: User, inputType: 'text' },
  { id: 'email', name: 'Email', icon: AtSign, inputType: 'email' },
  { id: 'company', name: 'Company', icon: Building2, inputType: 'text' },
  { id: 'title', name: 'Title', icon: Type, inputType: 'text' },
  { id: 'text', name: 'Text', icon: Type, inputType: 'text' },
  { id: 'checkbox', name: 'Checkbox', icon: CheckSquare, inputType: 'checkbox' },
]

// Default field sizes in PAGE UNITS
const FIELD_DEFAULTS: Record<string, { w: number; h: number }> = {
  signature: { w: 150, h: 50 },
  initials: { w: 60, h: 40 },
  stamp: { w: 80, h: 80 }, // Stamp is usually square
  date: { w: 100, h: 30 },
  name: { w: 120, h: 30 },
  firstName: { w: 100, h: 30 },
  lastName: { w: 100, h: 30 },
  email: { w: 150, h: 30 },
  company: { w: 120, h: 30 },
  title: { w: 100, h: 30 },
  text: { w: 120, h: 30 },
  checkbox: { w: 24, h: 24 },
}

// Signer colors for visual distinction
const SIGNER_COLORS = [
  { bg: '#4C00FF', light: '#EDE5FF', text: '#4C00FF' },
  { bg: '#10B981', light: '#D1FAE5', text: '#059669' },
  { bg: '#F59E0B', light: '#FEF3C7', text: '#D97706' },
  { bg: '#EF4444', light: '#FEE2E2', text: '#DC2626' },
  { bg: '#8B5CF6', light: '#EDE9FE', text: '#7C3AED' },
]

// Signer interface
interface Signer {
  id: string
  name: string
  email: string
  color: typeof SIGNER_COLORS[0]
}

// Field interface
interface PlacedField {
  id: string
  type: string
  pageIndex: number
  x: number
  y: number
  w: number
  h: number
  required: boolean
  label: string
  value?: string
  signerId?: string // Which signer this field belongs to
}

interface MobileSignDocumentProps {
  isDark?: boolean
  onFinish?: (fields: PlacedField[]) => void
}

const MobileSignDocument: React.FC<MobileSignDocumentProps> = ({
  isDark = false,
  onFinish
}) => {
  // Document state
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(1)

  // Field state
  const [fields, setFields] = useState<PlacedField[]>([])
  const [activeToolId, setActiveToolId] = useState<string | null>(null)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [showPalette, setShowPalette] = useState(false)

  // Input modal state
  const [inputModalField, setInputModalField] = useState<PlacedField | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [signatureTab, setSignatureTab] = useState<'draw' | 'camera' | 'upload'>('draw')

  // Email & Signers state
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailTo, setEmailTo] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [signers, setSigners] = useState<Signer[]>([])
  const [activeSignerId, setActiveSignerId] = useState<string | null>(null) // Currently selected signer for placing fields
  const [showAddSigner, setShowAddSigner] = useState(false)
  const [newSignerName, setNewSignerName] = useState('')
  const [newSignerEmail, setNewSignerEmail] = useState('')

  // Drag state - using refs for better performance
  const dragStateRef = useRef({
    isDragging: false,
    fieldId: null as string | null,
    startX: 0,
    startY: 0,
    fieldStartX: 0,
    fieldStartY: 0,
  })
  const [, forceUpdate] = useState(0)

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Canvas state
  const isDrawingRef = useRef(false)
  const lastPosRef = useRef({ x: 0, y: 0 })
  const canvasInitializedRef = useRef(false)

  // Initialize canvas for signature
  useEffect(() => {
    if (inputModalField && (inputModalField.type === 'signature' || inputModalField.type === 'initials' || inputModalField.type === 'stamp') && signatureTab === 'draw') {
      // Small delay to ensure canvas is rendered
      const timer = setTimeout(() => {
        const canvas = canvasRef.current
        if (canvas && !canvasInitializedRef.current) {
          const rect = canvas.getBoundingClientRect()
          const dpr = window.devicePixelRatio || 1

          // Set canvas size for retina
          canvas.width = rect.width * dpr
          canvas.height = rect.height * dpr

          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.scale(dpr, dpr)
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.strokeStyle = isDark ? '#ffffff' : '#000000'
            ctx.lineWidth = 3
            canvasInitializedRef.current = true
          }
        }
      }, 100)
      return () => clearTimeout(timer)
    } else {
      canvasInitializedRef.current = false
    }
  }, [inputModalField, signatureTab, isDark])

  // Get canvas position accounting for scaling
  const getCanvasPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()

    let clientX: number, clientY: number
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX
      clientY = (e as React.MouseEvent).clientY
    } else {
      return { x: 0, y: 0 }
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDrawingRef.current = true
    const pos = getCanvasPos(e)
    lastPosRef.current = pos

    // Draw a dot at start position
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingRef.current) return
    e.preventDefault()
    e.stopPropagation()

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const pos = getCanvasPos(e)
    ctx.beginPath()
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPosRef.current = pos
  }

  const stopDrawing = (e?: React.TouchEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    isDrawingRef.current = false
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const dpr = window.devicePixelRatio || 1
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)
      }
    }
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPdfFile(file)
      setFields([])
      setSelectedFieldId(null)
      setActiveToolId(null)
    }
  }

  // Handle image upload for signature
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && inputModalField) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setFields(prev => prev.map(f =>
          f.id === inputModalField.id ? { ...f, value: dataUrl } : f
        ))
        closeInputModal()
      }
      reader.readAsDataURL(file)
    }
  }

  // Convert page coordinates
  const pageToScreen = useCallback((pageX: number, pageY: number) => {
    return { x: pageX * zoom, y: pageY * zoom }
  }, [zoom])

  const screenToPage = useCallback((screenX: number, screenY: number, pageRect: DOMRect) => {
    return {
      x: (screenX - pageRect.left) / zoom,
      y: (screenY - pageRect.top) / zoom
    }
  }, [zoom])

  // Handle tap on document to place field
  const handleDocumentTap = useCallback((e: React.MouseEvent, pageNum: number, pageRect: DOMRect) => {
    if (!activeToolId) return
    if (dragStateRef.current.isDragging) return

    const pageCoords = screenToPage(e.clientX, e.clientY, pageRect)
    const defaults = FIELD_DEFAULTS[activeToolId] || { w: 100, h: 30 }

    const newField: PlacedField = {
      id: generateId(),
      type: activeToolId,
      pageIndex: pageNum,
      x: Math.max(0, Math.min(pageCoords.x - defaults.w / 2, 612 - defaults.w)),
      y: Math.max(0, Math.min(pageCoords.y - defaults.h / 2, 792 - defaults.h)),
      w: defaults.w,
      h: defaults.h,
      required: true,
      label: FIELD_TYPES.find(f => f.id === activeToolId)?.name || activeToolId,
      signerId: activeSignerId || undefined, // Assign to active signer if one is selected
    }

    setFields(prev => [...prev, newField])
    setSelectedFieldId(newField.id)
    setActiveToolId(null)
  }, [activeToolId, screenToPage, activeSignerId])

  // Keep fields in a ref so drag handlers always have latest state
  const fieldsRef = useRef(fields)
  useEffect(() => {
    fieldsRef.current = fields
  }, [fields])

  // DRAG HANDLERS - Using TOUCH events for reliable mobile tracking
  const handleFieldDragStart = useCallback((clientX: number, clientY: number, fieldId: string) => {
    const field = fieldsRef.current.find(f => f.id === fieldId)
    if (!field) return

    dragStateRef.current = {
      isDragging: true,
      fieldId: fieldId,
      startX: clientX,
      startY: clientY,
      fieldStartX: field.x,
      fieldStartY: field.y,
    }
    setSelectedFieldId(fieldId)
    forceUpdate(n => n + 1)
  }, [])

  // Global touch/mouse move handler
  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!dragStateRef.current.isDragging || !dragStateRef.current.fieldId) return
      e.preventDefault() // Prevent scroll while dragging
      e.stopPropagation()

      const touch = e.touches[0]
      if (!touch) return

      const deltaX = (touch.clientX - dragStateRef.current.startX) / zoom
      const deltaY = (touch.clientY - dragStateRef.current.startY) / zoom

      setFields(prev => prev.map(f => {
        if (f.id !== dragStateRef.current.fieldId) return f
        return {
          ...f,
          x: Math.max(0, Math.min(dragStateRef.current.fieldStartX + deltaX, 612 - f.w)),
          y: Math.max(0, Math.min(dragStateRef.current.fieldStartY + deltaY, 792 - f.h)),
        }
      }))
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!dragStateRef.current.isDragging || !dragStateRef.current.fieldId) return
      e.preventDefault()

      const deltaX = (e.clientX - dragStateRef.current.startX) / zoom
      const deltaY = (e.clientY - dragStateRef.current.startY) / zoom

      setFields(prev => prev.map(f => {
        if (f.id !== dragStateRef.current.fieldId) return f
        return {
          ...f,
          x: Math.max(0, Math.min(dragStateRef.current.fieldStartX + deltaX, 612 - f.w)),
          y: Math.max(0, Math.min(dragStateRef.current.fieldStartY + deltaY, 792 - f.h)),
        }
      }))
    }

    const handleGlobalEnd = () => {
      if (dragStateRef.current.isDragging) {
        dragStateRef.current.isDragging = false
        dragStateRef.current.fieldId = null
        forceUpdate(n => n + 1)
      }
    }

    // Add global listeners - touch events for mobile, mouse for desktop
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
    document.addEventListener('touchend', handleGlobalEnd)
    document.addEventListener('touchcancel', handleGlobalEnd)
    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleGlobalEnd)

    return () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove)
      document.removeEventListener('touchend', handleGlobalEnd)
      document.removeEventListener('touchcancel', handleGlobalEnd)
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalEnd)
    }
  }, [zoom])

  // Open input modal for field
  const openFieldInput = (field: PlacedField) => {
    setInputModalField(field)
    setInputValue(field.value || '')
    setSignatureTab('draw')
  }

  // Check if canvas has any drawing
  const isCanvasEmpty = () => {
    const canvas = canvasRef.current
    if (!canvas) return true
    const ctx = canvas.getContext('2d')
    if (!ctx) return true
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    // Check if any pixel has non-zero alpha (meaning something was drawn)
    for (let i = 3; i < pixelData.length; i += 4) {
      if (pixelData[i] > 0) return false
    }
    return true
  }

  // Save field value
  const saveFieldValue = () => {
    if (!inputModalField) return

    const fieldType = FIELD_TYPES.find(f => f.id === inputModalField.type)

    if (fieldType?.inputType === 'signature') {
      if (signatureTab === 'draw') {
        const canvas = canvasRef.current
        if (canvas && !isCanvasEmpty()) {
          const dataUrl = canvas.toDataURL('image/png')
          setFields(prev => prev.map(f =>
            f.id === inputModalField.id ? { ...f, value: dataUrl } : f
          ))
        }
      }
      // For upload tab, the value is already set in handleImageUpload
    } else if (fieldType?.inputType === 'checkbox') {
      setFields(prev => prev.map(f =>
        f.id === inputModalField.id ? { ...f, value: inputValue === 'true' ? '' : 'true' } : f
      ))
    } else {
      setFields(prev => prev.map(f =>
        f.id === inputModalField.id ? { ...f, value: inputValue } : f
      ))
    }

    // Close modal
    closeInputModal()
  }

  // Close modal handler
  const closeInputModal = () => {
    canvasInitializedRef.current = false
    setInputModalField(null)
  }

  // Delete selected field
  const deleteSelectedField = () => {
    if (selectedFieldId) {
      setFields(prev => prev.filter(f => f.id !== selectedFieldId))
      setSelectedFieldId(null)
    }
  }

  // Render field on document - YELLOW BORDER, DRAGGABLE
  const renderField = (field: PlacedField) => {
    const isSelected = selectedFieldId === field.id
    const isDragging = dragStateRef.current.fieldId === field.id
    const screenPos = pageToScreen(field.x, field.y)
    const screenSize = { w: field.w * zoom, h: field.h * zoom }
    const FieldIcon = FIELD_TYPES.find(f => f.id === field.type)?.icon || Type
    const hasValue = !!field.value

    // YELLOW/GOLD border color for visibility - always yellow so user can see and drag
    const borderColor = '#FFB800' // Gold/Yellow
    const bgColor = isDragging ? 'rgba(255, 184, 0, 0.3)' : 'rgba(255, 184, 0, 0.15)'

    return (
      <div
        key={field.id}
        className={`absolute select-none ${isSelected ? 'z-20' : 'z-10'}`}
        style={{
          left: screenPos.x,
          top: screenPos.y,
          width: screenSize.w,
          height: screenSize.h,
          backgroundColor: bgColor,
          border: isDragging
            ? `4px solid ${borderColor}`
            : `3px solid ${borderColor}`,
          borderRadius: 6,
          touchAction: 'none',
          cursor: 'move',
          boxShadow: isDragging
            ? `0 6px 20px rgba(255, 184, 0, 0.5), 0 0 0 4px rgba(255, 184, 0, 0.3)`
            : `0 2px 8px rgba(255, 184, 0, 0.4)`,
          transform: isDragging ? 'scale(1.08)' : 'scale(1)',
          opacity: isDragging ? 0.95 : 1,
          transition: isDragging ? 'none' : 'transform 0.2s, box-shadow 0.2s',
          // Ensure this element captures touch
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
        // Touch events for mobile drag - MUST preventDefault to stop scroll
        onTouchStart={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const touch = e.touches[0]
          if (touch) {
            handleFieldDragStart(touch.clientX, touch.clientY, field.id)
          }
        }}
        // Mouse events for desktop drag
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleFieldDragStart(e.clientX, e.clientY, field.id)
        }}
        // Double click/tap to edit
        onDoubleClick={() => openFieldInput(field)}
      >
        {/* Inner content - NO pointer events so parent captures all touches */}
        <div
          className="flex items-center justify-center h-full overflow-hidden p-1"
          style={{ pointerEvents: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          {field.value ? (
            field.type === 'signature' || field.type === 'initials' || field.type === 'stamp' ? (
              <img
                src={field.value}
                alt=""
                className="max-w-full max-h-full object-contain"
                draggable={false}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              />
            ) : field.type === 'checkbox' ? (
              <Check className="w-full h-full text-green-600" style={{ pointerEvents: 'none' }} />
            ) : (
              <span
                className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {field.value}
              </span>
            )
          ) : (
            <>
              <FieldIcon className="w-4 h-4 flex-shrink-0 text-amber-600" style={{ pointerEvents: 'none' }} />
              <span className="text-[9px] ml-1 truncate text-amber-700" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {field.label}
              </span>
            </>
          )}
        </div>

        {/* Drag handle - top right corner */}
        <div
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: borderColor,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ pointerEvents: 'none' }}>
            <circle cx="3" cy="3" r="1.5" fill="white"/>
            <circle cx="7" cy="3" r="1.5" fill="white"/>
            <circle cx="3" cy="7" r="1.5" fill="white"/>
            <circle cx="7" cy="7" r="1.5" fill="white"/>
          </svg>
        </div>
      </div>
    )
  }

  // Get field input type
  const getFieldInputType = () => {
    if (!inputModalField) return null
    return FIELD_TYPES.find(f => f.id === inputModalField.type)?.inputType
  }

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`px-3 py-2 ${isDark ? 'bg-[#252525] border-b border-[#333]' : 'bg-white border-b border-gray-200'}`}>
        {pdfFile ? (
          <>
            {/* Top Row - Back, Title, Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <button onClick={() => setPdfFile(null)} className={`p-1 rounded-lg ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-100'}`}>
                  <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
                <span className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {pdfFile.name}
                </span>
              </div>

              {/* Action Icons - All Purple */}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: pdfFile.name, text: 'Check this document' })
                    }
                  }}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#333]' : 'hover:bg-purple-50'}`}
                >
                  <Share2 className="w-5 h-5 text-[#4C00FF]" />
                </button>

                <button
                  onClick={() => {
                    const url = URL.createObjectURL(pdfFile)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = pdfFile.name
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#333]' : 'hover:bg-purple-50'}`}
                >
                  <Download className="w-5 h-5 text-[#4C00FF]" />
                </button>

                <button
                  onClick={() => {
                    setEmailSubject(`Please sign: ${pdfFile.name}`)
                    setEmailMessage('Please review and sign the attached document.')
                    setShowEmailModal(true)
                  }}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#333]' : 'hover:bg-purple-50'}`}
                >
                  <Mail className="w-5 h-5 text-[#4C00FF]" />
                </button>
              </div>
            </div>

            {/* Signers Row - Click to select for field placement */}
            {signers.length > 0 && (
              <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
                {signers.map((signer, idx) => {
                  const isActive = activeSignerId === signer.id
                  return (
                    <button
                      key={signer.id}
                      onClick={() => setActiveSignerId(isActive ? null : signer.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        backgroundColor: isActive ? signer.color.bg : signer.color.light,
                        color: isActive ? '#fff' : signer.color.text,
                        boxShadow: isActive ? `0 0 0 2px white, 0 0 0 4px ${signer.color.bg}` : 'none',
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : signer.color.bg, color: '#fff' }}
                      >
                        {idx + 1}
                      </div>
                      <span className="truncate max-w-[60px]">{signer.name || `Signer ${idx + 1}`}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (activeSignerId === signer.id) setActiveSignerId(null)
                          setSigners(s => s.filter(sg => sg.id !== signer.id))
                        }}
                        className="ml-0.5 opacity-60 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <FileSignature className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Sign Document</span>
          </div>
        )}
      </div>

      {/* Active Tool Banner */}
      {activeToolId && (() => {
        const activeSigner = activeSignerId ? signers.find(s => s.id === activeSignerId) : null
        const bannerColor = activeSigner?.color.bg || '#4C00FF'
        const signerLabel = activeSigner ? `Signer ${signers.findIndex(s => s.id === activeSignerId) + 1}` : null
        return (
          <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: bannerColor }}>
            <span className="text-white text-sm">
              Tap to place {FIELD_TYPES.find(f => f.id === activeToolId)?.name}
              {signerLabel && <span className="opacity-80"> for {signerLabel}</span>}
            </span>
            <button onClick={() => setActiveToolId(null)} className="text-white/80"><X className="w-5 h-5" /></button>
          </div>
        )
      })()}

      {/* Main Content */}
      <div className="flex-1 overflow-auto" ref={containerRef}>
        {!pdfFile ? (
          <div className="flex items-center justify-center h-full p-4">
            <label className={`w-full max-w-md rounded-2xl border-2 border-dashed p-8 flex flex-col items-center cursor-pointer ${isDark ? 'bg-[#252525] border-[#444]' : 'bg-white border-gray-300'}`}>
              <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-[#333]' : 'bg-[#4C00FF]/10'}`}>
                <Upload className={`w-8 h-8 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Upload Document</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tap to select PDF</p>
            </label>
          </div>
        ) : (
          <PDFViewer
            file={pdfFile}
            zoom={zoom}
            continuousScroll={true}
            onTotalPagesChange={setTotalPages}
            onCurrentPageChange={setCurrentPage}
            onPageClick={(e, pageNum) => {
              const pageRect = e.currentTarget.getBoundingClientRect()
              handleDocumentTap(e, pageNum, pageRect)
            }}
            renderFieldsForPage={(pageNum) => (
              <>{fields.filter(f => f.pageIndex === pageNum).map(renderField)}</>
            )}
          />
        )}
      </div>

      {/* Bottom Bar */}
      {pdfFile && (
        <div className={`flex items-center justify-between px-4 py-2 ${isDark ? 'bg-[#252525] border-t border-[#333]' : 'bg-white border-t border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Page {currentPage}/{totalPages}
            </span>
            {signers.length > 0 ? (
              <div className="flex items-center gap-1">
                {signers.map((signer, idx) => {
                  const signerFieldCount = fields.filter(f => f.signerId === signer.id).length
                  return (
                    <span
                      key={signer.id}
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: signer.color.light, color: signer.color.text }}
                    >
                      S{idx + 1}: {signerFieldCount}
                    </span>
                  )
                })}
              </div>
            ) : (
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                | {fields.length} fields
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className={`p-1.5 rounded ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-100'}`}>
              <ZoomOut className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <span className={`text-xs w-10 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.25))} className={`p-1.5 rounded ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-100'}`}>
              <ZoomIn className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      )}

      {/* Signer Selection Indicator */}
      {pdfFile && activeSignerId && !activeToolId && (() => {
        const activeSigner = signers.find(s => s.id === activeSignerId)
        const signerIndex = signers.findIndex(s => s.id === activeSignerId) + 1
        if (!activeSigner) return null
        return (
          <div
            className="fixed left-3 right-3 z-30 flex items-center justify-between px-3 py-2 rounded-full shadow-lg"
            style={{ bottom: 'calc(120px + env(safe-area-inset-bottom))', backgroundColor: activeSigner.color.light, border: `2px solid ${activeSigner.color.bg}` }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: activeSigner.color.bg }}
              >
                {signerIndex}
              </div>
              <span className="text-sm font-medium" style={{ color: activeSigner.color.text }}>
                Placing fields for Signer {signerIndex}
              </span>
            </div>
            <button
              onClick={() => setActiveSignerId(null)}
              className="p-1 rounded-full"
              style={{ backgroundColor: activeSigner.color.bg + '20' }}
            >
              <X className="w-4 h-4" style={{ color: activeSigner.color.text }} />
            </button>
          </div>
        )
      })()}

      {/* Floating Buttons - Fields & Add Signer */}
      {pdfFile && !activeToolId && !showPalette && (
        <div className="fixed right-3 z-40 flex flex-col gap-2" style={{ bottom: 'calc(56px + env(safe-area-inset-bottom))' }}>
          {/* Add Signer Button */}
          <button
            onClick={() => setShowAddSigner(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg ${isDark ? 'bg-[#333] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            <UserPlus className={`w-4 h-4 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
            <span className="text-sm font-medium">Add Signer</span>
          </button>

          {/* Fields Button */}
          <button
            onClick={() => setShowPalette(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg ${isDark ? 'bg-[#333] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            <PenTool className={`w-4 h-4 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
            <span className="text-sm font-medium">Fields</span>
          </button>
        </div>
      )}

      {/* Field Palette */}
      {showPalette && (
        <div className="fixed inset-0 z-50" onClick={() => setShowPalette(false)}>
          <div
            className={`absolute right-3 rounded-lg shadow-2xl ${isDark ? 'bg-[#252525] border border-[#333]' : 'bg-white border border-gray-200'}`}
            style={{ bottom: 'calc(100px + env(safe-area-inset-bottom))', width: '160px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`text-[9px] text-center py-1 border-b ${isDark ? 'text-gray-500 border-[#333]' : 'text-gray-400 border-gray-100'}`}>
              Select Field
            </div>
            <div className="overflow-y-auto max-h-[180px] p-1">
              <div className="grid grid-cols-3 gap-0.5">
                {FIELD_TYPES.map((field) => (
                  <button
                    key={field.id}
                    onClick={() => { setActiveToolId(field.id); setShowPalette(false); }}
                    className={`flex flex-col items-center py-1.5 rounded ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-100'}`}
                  >
                    <field.icon className={`w-4 h-4 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                    <span className={`text-[7px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{field.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons when field selected */}
      {selectedFieldId && !activeToolId && (() => {
        const field = fields.find(f => f.id === selectedFieldId)
        if (!field) return null
        return (
          <div className="fixed left-3 z-40 flex gap-2" style={{ bottom: 'calc(56px + env(safe-area-inset-bottom))' }}>
            <button
              onClick={() => openFieldInput(field)}
              className={`p-2.5 rounded-full shadow-lg ${isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white'}`}
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button onClick={deleteSelectedField} className="p-2.5 rounded-full shadow-lg bg-red-500 text-white">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )
      })()}

      {/* INPUT MODAL */}
      {inputModalField && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => closeInputModal()}>
          <div
            className={`w-full rounded-t-2xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}
            style={{ maxHeight: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center py-2">
              <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-[#444]' : 'bg-gray-300'}`} />
            </div>

            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-2 border-b ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {inputModalField.label}
              </span>
              <button onClick={() => closeInputModal()} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-100'}`}>
                <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Content based on field type */}
            <div className="p-4">
              {/* SIGNATURE INPUT */}
              {getFieldInputType() === 'signature' && (
                <>
                  {/* Tabs */}
                  <div className={`flex rounded-lg p-1 mb-4 ${isDark ? 'bg-[#252525]' : 'bg-gray-100'}`}>
                    {[
                      { id: 'draw', label: 'Draw', icon: PenTool },
                      { id: 'camera', label: 'Camera', icon: Camera },
                      { id: 'upload', label: 'Upload', icon: Image },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSignatureTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${
                          signatureTab === tab.id
                            ? (isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white')
                            : (isDark ? 'text-gray-400' : 'text-gray-600')
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Draw Tab */}
                  {signatureTab === 'draw' && (
                    <div>
                      <canvas
                        ref={canvasRef}
                        className={`w-full h-40 rounded-xl border-2 border-dashed ${isDark ? 'bg-[#252525] border-[#444]' : 'bg-gray-50 border-gray-300'}`}
                        style={{ touchAction: 'none' }}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                      <p className={`text-xs text-center mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Draw your {inputModalField.type === 'initials' ? 'initials' : inputModalField.type === 'stamp' ? 'stamp' : 'signature'} above
                      </p>
                      <button
                        onClick={clearCanvas}
                        className={`w-full mt-2 py-2 rounded-lg text-sm ${isDark ? 'bg-[#333] text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        Clear
                      </button>
                    </div>
                  )}

                  {/* Camera Tab */}
                  {signatureTab === 'camera' && (
                    <div className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed ${isDark ? 'bg-[#252525] border-[#444]' : 'bg-gray-50 border-gray-300'}`}>
                      <Camera className={`w-12 h-12 mb-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                      <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Camera not available</p>
                      <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>Use Draw or Upload instead</p>
                    </div>
                  )}

                  {/* Upload Tab */}
                  {signatureTab === 'upload' && (
                    <label className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed cursor-pointer ${isDark ? 'bg-[#252525] border-[#444] hover:border-[#c4ff0e]' : 'bg-gray-50 border-gray-300 hover:border-[#4C00FF]'}`}>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Upload className={`w-12 h-12 mb-2 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                      <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-700'}`}>Tap to upload image</p>
                    </label>
                  )}
                </>
              )}

              {/* TEXT INPUT */}
              {(getFieldInputType() === 'text' || getFieldInputType() === 'email') && (
                <input
                  type={getFieldInputType() === 'email' ? 'email' : 'text'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Enter ${inputModalField.label.toLowerCase()}`}
                  autoFocus
                  className={`w-full px-4 py-3 rounded-xl text-base border ${isDark ? 'bg-[#252525] border-[#333] text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'}`}
                />
              )}

              {/* DATE INPUT */}
              {getFieldInputType() === 'date' && (
                <input
                  type="date"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl text-base border ${isDark ? 'bg-[#252525] border-[#333] text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                />
              )}

              {/* CHECKBOX INPUT */}
              {getFieldInputType() === 'checkbox' && (
                <button
                  onClick={() => setInputValue(inputValue === 'true' ? '' : 'true')}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border ${isDark ? 'bg-[#252525] border-[#333]' : 'bg-gray-50 border-gray-200'}`}
                >
                  <span className={`text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>Checked</span>
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${inputValue === 'true' ? (isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]') : (isDark ? 'bg-[#333]' : 'bg-gray-300')}`}>
                    {inputValue === 'true' && <Check className={`w-4 h-4 ${isDark ? 'text-black' : 'text-white'}`} />}
                  </div>
                </button>
              )}

            </div>

            {/* Footer */}
            <div className={`flex gap-3 px-4 py-4 border-t ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
              <button
                onClick={() => closeInputModal()}
                className={`flex-1 py-3 rounded-xl text-sm font-medium ${isDark ? 'bg-[#333] text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Cancel
              </button>
              <button
                onClick={saveFieldValue}
                className={`flex-1 py-3 rounded-xl text-sm font-medium ${isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white'}`}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SIGNER MODAL */}
      {showAddSigner && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowAddSigner(false)}>
          <div
            className={`w-full rounded-t-2xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center py-2">
              <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-[#444]' : 'bg-gray-300'}`} />
            </div>

            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-2 border-b ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Add Signer
              </span>
              <button onClick={() => setShowAddSigner(false)} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-100'}`}>
                <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Name
                </label>
                <input
                  type="text"
                  value={newSignerName}
                  onChange={(e) => setNewSignerName(e.target.value)}
                  placeholder="Signer name"
                  className={`w-full px-4 py-3 rounded-xl text-base border ${isDark ? 'bg-[#252525] border-[#333] text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={newSignerEmail}
                  onChange={(e) => setNewSignerEmail(e.target.value)}
                  placeholder="signer@email.com"
                  className={`w-full px-4 py-3 rounded-xl text-base border ${isDark ? 'bg-[#252525] border-[#333] text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'}`}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={`flex gap-3 px-4 py-4 border-t ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
              <button
                onClick={() => setShowAddSigner(false)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium ${isDark ? 'bg-[#333] text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newSignerEmail.trim()) {
                    const newSigner: Signer = {
                      id: generateId(),
                      name: newSignerName.trim(),
                      email: newSignerEmail.trim(),
                      color: SIGNER_COLORS[signers.length % SIGNER_COLORS.length],
                    }
                    setSigners(prev => [...prev, newSigner])
                    setActiveSignerId(newSigner.id) // Auto-select new signer
                    setNewSignerName('')
                    setNewSignerEmail('')
                    setShowAddSigner(false)
                  }
                }}
                disabled={!newSignerEmail.trim()}
                className={`flex-1 py-3 rounded-xl text-sm font-medium ${isDark ? 'bg-[#c4ff0e] text-black disabled:opacity-50' : 'bg-[#4C00FF] text-white disabled:opacity-50'}`}
              >
                Add Signer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowEmailModal(false)}>
          <div
            className={`w-full rounded-t-2xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}
            style={{ maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center py-2">
              <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-[#444]' : 'bg-gray-300'}`} />
            </div>

            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-2 border-b ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Send for Signature
              </span>
              <button onClick={() => setShowEmailModal(false)} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-100'}`}>
                <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              {/* Recipients */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  To
                </label>
                {signers.length > 0 ? (
                  <div className={`flex flex-wrap gap-2 p-3 rounded-xl border ${isDark ? 'bg-[#252525] border-[#333]' : 'bg-gray-50 border-gray-200'}`}>
                    {signers.map((signer, idx) => {
                      const fieldCount = fields.filter(f => f.signerId === signer.id).length
                      return (
                        <div
                          key={signer.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs"
                          style={{ backgroundColor: signer.color.light, color: signer.color.text }}
                        >
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                            style={{ backgroundColor: signer.color.bg }}
                          >
                            {idx + 1}
                          </div>
                          <span className="font-medium">{signer.name || signer.email}</span>
                          <span className="opacity-70">({fieldCount} fields)</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="recipient@email.com"
                    className={`w-full px-4 py-3 rounded-xl text-base border ${isDark ? 'bg-[#252525] border-[#333] text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'}`}
                  />
                )}
              </div>

              {/* Subject */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Document signing request"
                  className={`w-full px-4 py-3 rounded-xl text-base border ${isDark ? 'bg-[#252525] border-[#333] text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'}`}
                />
              </div>

              {/* Message */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Please review and sign the attached document."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl text-base border resize-none ${isDark ? 'bg-[#252525] border-[#333] text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'}`}
                />
              </div>

              {/* Document Preview */}
              <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-[#252525]' : 'bg-gray-50'}`}>
                <div className={`p-2 rounded-lg ${isDark ? 'bg-[#333]' : 'bg-white'}`}>
                  <FileText className={`w-6 h-6 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {pdfFile?.name}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {fields.length} fields added
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`flex gap-3 px-4 py-4 border-t ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
              <button
                onClick={() => setShowEmailModal(false)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium ${isDark ? 'bg-[#333] text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const recipients = signers.length > 0 ? signers.map(s => s.email) : [emailTo]
                  if (recipients.filter(Boolean).length === 0) {
                    alert('Please add at least one recipient')
                    return
                  }
                  try {
                    // Call API to send email
                    const response = await fetch('/api/send-signature-request', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        recipients,
                        subject: emailSubject,
                        message: emailMessage,
                        documentName: pdfFile?.name,
                        fields: fields.length,
                      }),
                    })
                    if (response.ok) {
                      alert('Email sent successfully!')
                      setShowEmailModal(false)
                      setEmailTo('')
                    } else {
                      const data = await response.json()
                      alert(data.error || 'Failed to send email')
                    }
                  } catch (error) {
                    alert('Failed to send email. Please try again.')
                  }
                }}
                disabled={signers.length === 0 && !emailTo.trim()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium ${isDark ? 'bg-[#c4ff0e] text-black disabled:opacity-50' : 'bg-[#4C00FF] text-white disabled:opacity-50'}`}
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileSignDocument
