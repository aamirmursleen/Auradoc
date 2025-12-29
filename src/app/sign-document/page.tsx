'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  FileSignature,
  Upload,
  PenTool,
  Type,
  AtSign,
  Phone,
  Building2,
  Calendar,
  CheckSquare,
  List,
  AlignLeft,
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
  Circle,
  Stamp,
  Strikethrough,
  ChevronDown,
  Mail
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { incrementSignCount } from '@/lib/usageLimit'

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
    <div className="flex items-center justify-center h-full bg-gray-50/80">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  )
})

// Field Types - Left Column
const LEFT_COLUMN_FIELDS = [
  { id: 'signature', name: 'Signature', icon: PenTool },
  { id: 'name', name: 'Name', icon: User },
  { id: 'phone', name: 'Phone', icon: Phone },
  { id: 'text', name: 'Text', icon: Type },
  { id: 'checkbox', name: 'Checkbox', icon: CheckSquare },
  { id: 'selection', name: 'Selection', icon: List },
  { id: 'strikethrough', name: 'Strikethrough', icon: Strikethrough },
]

// Field Types - Right Column
const RIGHT_COLUMN_FIELDS = [
  { id: 'initials', name: 'Initials', icon: FileSignature },
  { id: 'email', name: 'Email', icon: AtSign },
  { id: 'company', name: 'Company', icon: Building2 },
  { id: 'multiline', name: 'Multiline', icon: AlignLeft },
  { id: 'radio', name: 'Radio', icon: Circle },
  { id: 'date', name: 'Date', icon: Calendar },
  { id: 'stamp', name: 'Stamp', icon: Stamp },
]

// All field types combined
const ALL_FIELD_TYPES = [...LEFT_COLUMN_FIELDS, ...RIGHT_COLUMN_FIELDS]

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
}

interface TemplateProperties {
  name: string
  tags: string[]
  workspace: string
  redirectUrl: string
  authorizedUsers: string[]
}

const SignDocumentPage: React.FC = () => {
  const { user } = useUser()

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

  // UI state
  const [zoom, setZoom] = useState(1)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')

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

  // Remove signer
  const removeSigner = (signerId: string) => {
    if (signers.length <= 1) return

    const filteredSigners = signers.filter(s => s.id !== signerId)
    // Re-order signers
    const reorderedSigners = filteredSigners.map((s, idx) => ({
      ...s,
      order: idx + 1,
      name: `Signer ${idx + 1}`
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

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
      const isValidType = validTypes.includes(file.type) || file.name.toLowerCase().match(/\.(pdf|png|jpg|jpeg)$/)

      if (!isValidType) {
        setError('Please upload a PDF, PNG, or JPG file')
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
      width: draggedFieldType === 'signature' ? 200 : draggedFieldType === 'checkbox' || draggedFieldType === 'radio' ? 30 : 150,
      height: draggedFieldType === 'signature' ? 60 : draggedFieldType === 'multiline' ? 80 : draggedFieldType === 'checkbox' || draggedFieldType === 'radio' ? 30 : 40,
      page: currentPage,
      signerId: activeSigner.id,
      signerColor: activeSigner.color,
      mandatory: true,
      placeholder: '',
      tip: '',
      label: fieldType.name
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
  const handleResizeStart = useCallback((e: React.MouseEvent, fieldId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const field = placedFields.find(f => f.id === fieldId)
    if (!field) return

    setSelectedFieldId(fieldId)
    setIsResizing(true)
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    resizeStartSize.current = { width: field.width, height: field.height }
  }, [placedFields])

  // Handle resize move
  const handleResizeMove = useCallback((e: React.MouseEvent) => {
    if (!isResizing || !selectedFieldId) return

    const deltaX = (e.clientX - dragStartPos.current.x) / zoom
    const deltaY = (e.clientY - dragStartPos.current.y) / zoom

    setPlacedFields(prev => prev.map(field =>
      field.id === selectedFieldId
        ? {
            ...field,
            width: Math.max(30, resizeStartSize.current.width + deltaX),
            height: Math.max(20, resizeStartSize.current.height + deltaY)
          }
        : field
    ))
  }, [isResizing, selectedFieldId, zoom])

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

  // PDF page rendered callback
  const handlePdfPageRendered = useCallback((imageUrl: string) => {
    setPdfPageImage(imageUrl)
  }, [])

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
        page: field.page
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
            order: s.order
          })),
          signatureFields,
          message: emailMessage || undefined,
          subject: emailSubject || undefined
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
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-900"
              style={{ backgroundColor: field.signerColor }}
            >
              {fieldSigner?.name || 'Signer'}
            </div>

            {/* Resize handle */}
            {isSelected && (
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-br-md cursor-se-resize flex items-center justify-center"
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
              <X className="w-3 h-3 text-gray-900" />
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

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      onMouseMove={isDragging ? handleMouseMove : isResizing ? handleResizeMove : undefined}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileSignature className="w-6 h-6 text-primary-500" />
            {templateProps.name || 'New Template'}
          </h1>

          {document && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{document.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Template Properties</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            disabled={!document}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>

          <button
            onClick={() => setIsSaving(true)}
            disabled={!document || isSaving}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="text-sm font-medium">Save</span>
          </button>

          <button
            onClick={() => setShowSendModal(true)}
            disabled={!document || placedFields.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="text-sm font-medium">Send</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Signers & Field Types */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {/* Signers List */}
            {signers.map((signer, idx) => (
              <div key={signer.id} className="border-b border-gray-200">
                {/* Signer Header */}
                <div
                  className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                    activeSignerId === signer.id ? 'bg-gray-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveSignerId(signer.id)
                    setExpandedSignerId(expandedSignerId === signer.id ? null : signer.id)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm"
                      style={{ backgroundColor: signer.color }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{signer.name}</p>
                      <p className="text-xs text-gray-600">
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
                        className="p-1 hover:bg-red-900/50 rounded text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 transition-transform ${
                        expandedSignerId === signer.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Signer Content */}
                {expandedSignerId === signer.id && (
                  <div className="px-3 pb-4 space-y-3">
                    {/* Email Input */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <input
                        type="email"
                        placeholder="Enter email address..."
                        value={signer.email}
                        onChange={(e) => updateSigner(signer.id, 'email', e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    {/* Two Column Field Layout */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Left Column */}
                      <div className="space-y-2">
                        {LEFT_COLUMN_FIELDS.map(field => renderFieldButton(field))}
                      </div>
                      {/* Right Column */}
                      <div className="space-y-2">
                        {RIGHT_COLUMN_FIELDS.map(field => renderFieldButton(field))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Signer Button */}
            <button
              onClick={addSigner}
              className="w-full flex items-center justify-center gap-2 p-4 text-cyan-600 hover:bg-cyan-100 dark:bg-cyan-900/50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Signer</span>
            </button>
          </div>
        </div>

        {/* Center - Document Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Toolbar */}
          {document && (
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <span className="text-sm text-gray-700 min-w-[80px] text-center">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
                  className="p-1.5 hover:bg-gray-100 rounded"
                >
                  <ZoomOut className="w-5 h-5 text-gray-700" />
                </button>
                <span className="text-sm text-gray-700 min-w-[50px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                  className="p-1.5 hover:bg-gray-100 rounded"
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="p-1.5 hover:bg-gray-100 rounded"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{placedFields.length} fields</span>
              </div>
            </div>
          )}

          {/* Document Area */}
          <div
            className="flex-1 overflow-auto p-6 flex justify-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDocumentDrop}
          >
            {!document ? (
              <label className="w-full max-w-2xl bg-gray-50 border border-gray-200 rounded-2xl border-2 border-dashed border-gray-200 hover:border-cyan-500/50 transition-colors cursor-pointer flex flex-col items-center justify-center p-12">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-20 h-20 bg-cyan-100 dark:bg-cyan-900/50 rounded-2xl flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload a PDF Template
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Drag and drop your document here, or click to browse
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" /> PDF
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" /> PNG, JPG
                  </span>
                  <span>Max 25MB</span>
                </div>
              </label>
            ) : (
              <div
                ref={documentContainerRef}
                className="relative bg-gray-50/80 shadow-xl"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
              >
                {isPDF ? (
                  <PDFViewer
                    file={document}
                    zoom={1}
                    onPageClick={() => {}}
                    signatureOverlay={FieldsOverlay}
                    onPageRendered={handlePdfPageRendered}
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

        {/* Right Sidebar - Field Properties */}
        {showPropertiesPanel && selectedField && (
          <div className="w-72 bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Field Properties</h2>
              <button
                onClick={() => setShowPropertiesPanel(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Field Type Display */}
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
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
                        <p className="font-medium text-gray-900 capitalize">{selectedField.type}</p>
                        <p className="text-xs text-gray-600">Field Type</p>
                      </div>
                    </>
                  )
                })()}
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Label</label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={(e) => updateFieldProperty('label', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Assigned Signer */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Assigned To</label>
                <select
                  value={selectedField.signerId}
                  onChange={(e) => {
                    const signer = signers.find(s => s.id === e.target.value)
                    updateFieldProperty('signerId', e.target.value)
                    if (signer) updateFieldProperty('signerColor', signer.color)
                  }}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  {signers.map((signer) => (
                    <option key={signer.id} value={signer.id}>{signer.name}</option>
                  ))}
                </select>
              </div>

              {/* Mandatory Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-600">Required</label>
                <button
                  onClick={() => updateFieldProperty('mandatory', !selectedField.mandatory)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    selectedField.mandatory ? 'bg-cyan-500' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                    selectedField.mandatory ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Placeholder</label>
                <input
                  type="text"
                  value={selectedField.placeholder}
                  onChange={(e) => updateFieldProperty('placeholder', e.target.value)}
                  placeholder="Enter placeholder text..."
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Tip */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tooltip</label>
                <input
                  type="text"
                  value={selectedField.tip}
                  onChange={(e) => updateFieldProperty('tip', e.target.value)}
                  placeholder="Help text for signer..."
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Size</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Width</label>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateFieldProperty('width', Math.max(30, selectedField.width - 10))}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="flex-1 text-center text-sm">{Math.round(selectedField.width)}</span>
                      <button
                        onClick={() => updateFieldProperty('width', selectedField.width + 10)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Height</label>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateFieldProperty('height', Math.max(20, selectedField.height - 10))}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="flex-1 text-center text-sm">{Math.round(selectedField.height)}</span>
                      <button
                        onClick={() => updateFieldProperty('height', selectedField.height + 10)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Position</label>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-100 rounded-lg p-2 text-center text-gray-900">
                    <span className="text-gray-600">X:</span> {Math.round(selectedField.x)}
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2 text-center text-gray-900">
                    <span className="text-gray-600">Y:</span> {Math.round(selectedField.y)}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              <button
                onClick={duplicateSelectedField}
                className="w-full flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm font-medium">Duplicate</span>
              </button>
              <button
                onClick={deleteSelectedField}
                className="w-full flex items-center justify-center gap-2 py-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Delete</span>
              </button>
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-600" />
                Template Properties
              </h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Template Name</label>
                <input
                  type="text"
                  value={templateProps.name}
                  onChange={(e) => setTemplateProps(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Enter template name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="Add tags (comma separated)..."
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Signed Document Workspace
                </label>
                <select className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                  <option value="default">Default Workspace</option>
                  <option value="contracts">Contracts</option>
                  <option value="agreements">Agreements</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <Link2 className="w-4 h-4 inline mr-1" />
                  Redirect Link (after signing)
                </label>
                <input
                  type="url"
                  value={templateProps.redirectUrl}
                  onChange={(e) => setTemplateProps(prev => ({ ...prev, redirectUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Authorized Users
                </label>
                <input
                  type="text"
                  placeholder="Enter user emails (comma separated)..."
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <p className="text-xs text-gray-600 mt-1">Leave empty to allow all users</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all"
              >
                Save Properties
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-cyan-600" />
                Send for Signatures
              </h3>
              <button
                onClick={() => setShowSendModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-cyan-600" />
                  <div>
                    <p className="font-medium text-gray-900">{templateProps.name || 'Untitled Template'}</p>
                    <p className="text-sm text-gray-600">{placedFields.length} fields configured</p>
                  </div>
                </div>
              </div>

              {/* Signers with their emails */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Signers</label>
                <div className="space-y-2">
                  {signers.map((signer, idx) => {
                    const signerFields = placedFields.filter(f => f.signerId === signer.id)
                    return (
                      <div key={signer.id} className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: signer.color }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <input
                            type="email"
                            placeholder={`${signer.name} email...`}
                            value={signer.email}
                            onChange={(e) => updateSigner(signer.id, 'email', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500"
                          />
                        </div>
                        <span className="text-xs text-gray-600">{signerFields.length} fields</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email Subject</label>
                <input
                  type="text"
                  value={emailSubject || `Please sign: ${templateProps.name}`}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Message (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Add a personal message..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowSendModal(false)}
                disabled={isSending}
                className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendForSigning}
                disabled={isSending}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all flex items-center gap-2 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-cyan-600" />
                Share Template
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-700">
                Create a public link that anyone can use to sign this document.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value="https://auradoc.com/sign/abc123"
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-sm text-yellow-400">
                  Anyone with this link can sign the document. Share carefully.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default SignDocumentPage
