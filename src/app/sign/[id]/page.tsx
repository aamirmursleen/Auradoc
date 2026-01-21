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
  Circle,
  ChevronDown,
  Strikethrough,
  Stamp,
  Bold,
  Italic,
  Palette,
  Move,
  Maximize
} from 'lucide-react'

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

const SignatureCanvas = dynamic(() => import('@/components/signature/SignatureCanvas'), {
  ssr: false,
  loading: () => <div className="h-40 bg-[#252525] rounded-xl animate-pulse" />
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

  // PDF state
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [pageHeights, setPageHeights] = useState<number[]>([])
  const [pageWidths, setPageWidths] = useState<number[]>([])

  // Signing state
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [signedFields, setSignedFields] = useState<Set<string>>(new Set())
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)
  const [showTextInput, setShowTextInput] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showSelection, setShowSelection] = useState(false)
  const [showStampPicker, setShowStampPicker] = useState(false)
  const [textInputValue, setTextInputValue] = useState('')

  // Stamp options
  const stampOptions = ['APPROVED', 'DRAFT', 'CONFIDENTIAL', 'REVIEWED', 'FINAL', 'COPY']

  // Field editing state (position, size, formatting)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [showFormatting, setShowFormatting] = useState(false)
  const [fieldPositions, setFieldPositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({})
  const [fieldFormatting, setFieldFormatting] = useState<Record<string, { fontSize: number; bold: boolean; italic: boolean; color: string }>>({})
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number; fieldX: number; fieldY: number } | null>(null)
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

  const pagesContainerRef = useRef<HTMLDivElement>(null)
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const documentContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/signing-requests/${documentId}?email=${signerEmail}&token=${token}`)
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Failed to load document')
        setDocumentData(data.data)
        const signer = data.data.signers.find((s: SignerInfo) => s.email.toLowerCase() === signerEmail?.toLowerCase())
        setCurrentSigner(signer || null)
        const fields = data.data.signatureFields.filter((f: SignatureFieldInfo) => f.signerOrder === signer?.order)
        setMyFields(fields)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    if (documentId && signerEmail) fetchDocument()
    else { setError('Invalid signing link'); setLoading(false) }
  }, [documentId, signerEmail, token])

  useEffect(() => {
    const loadPdf = async () => {
      if (!documentData?.documentUrl) {
        setPdfError('No document data available')
        return
      }
      try {
        setPdfLoading(true)
        setPdfError(null)

        // Handle different document URL formats
        let pdfSource: string | { data: Uint8Array } = documentData.documentUrl

        // If it's a base64 string without data URL prefix, convert it
        if (documentData.documentUrl.startsWith('data:application/pdf;base64,')) {
          // Already a data URL, use as-is
          pdfSource = documentData.documentUrl
        } else if (documentData.documentUrl.startsWith('data:')) {
          // Other data URL format
          pdfSource = documentData.documentUrl
        } else if (!documentData.documentUrl.startsWith('http') && !documentData.documentUrl.startsWith('/')) {
          // Likely raw base64 - convert to data URL
          pdfSource = `data:application/pdf;base64,${documentData.documentUrl}`
        }

        const loadingTask = pdfjsLib.getDocument({
          url: pdfSource,
          cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/standard_fonts/`,
          useSystemFonts: true,
          disableFontFace: false,
        })
        const pdf = await loadingTask.promise
        setPdfDoc(pdf)
        setTotalPages(pdf.numPages)
        canvasRefs.current = new Array(pdf.numPages).fill(null)
      } catch (err) {
        console.error('Error loading PDF:', err)
        setPdfError('Failed to load PDF document. Please contact the sender.')
      } finally {
        setPdfLoading(false)
      }
    }
    loadPdf()
  }, [documentData?.documentUrl])

  const renderAllPages = useCallback(async () => {
    if (!pdfDoc) return
    const heights: number[] = []
    const widths: number[] = []
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const canvas = canvasRefs.current[i - 1]
      if (!canvas) continue
      try {
        const page = await pdfDoc.getPage(i)
        const viewport = page.getViewport({ scale })
        canvas.height = viewport.height
        canvas.width = viewport.width
        heights.push(viewport.height)
        widths.push(viewport.width)
        const context = canvas.getContext('2d')
        if (context) await page.render({ canvasContext: context, viewport }).promise
      } catch (err) { console.error('Error rendering page', i, err) }
    }
    setPageHeights(heights)
    setPageWidths(widths)
  }, [pdfDoc, scale])

  useEffect(() => {
    if (pdfDoc && canvasRefs.current.length === pdfDoc.numPages) {
      const timer = setTimeout(() => renderAllPages(), 100)
      return () => clearTimeout(timer)
    }
  }, [pdfDoc, renderAllPages, totalPages])

  useEffect(() => { if (pdfDoc) renderAllPages() }, [scale, pdfDoc, renderAllPages])

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3))
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))
  const fitToWidth = () => setScale(1.0)

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
  const isTextType = (type: string) => ['text', 'name', 'email', 'phone', 'company', 'multiline'].includes(type)
  const isCheckboxType = (type: string) => type === 'checkbox'
  const isRadioType = (type: string) => type === 'radio'
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
      email: 'Enter email',
      phone: 'Enter phone',
      company: 'Enter company',
      multiline: 'Enter text',
      date: 'Select date',
      checkbox: 'Check',
      radio: 'Select',
      selection: 'Select option',
      strikethrough: 'Strikethrough',
      stamp: 'Add stamp'
    }
    return labels[type] || 'Fill here'
  }

  const handleFieldClick = (fieldId: string) => {
    if (signedFields.has(fieldId)) return
    const field = myFields.find(f => f.id === fieldId)
    if (!field) return

    setActiveFieldId(fieldId)

    if (isSignatureType(field.type)) {
      setShowSignaturePad(true)
    } else if (isTextType(field.type)) {
      setTextInputValue(fieldValues[fieldId] || '')
      setShowTextInput(true)
    } else if (isDateType(field.type)) {
      setTextInputValue(fieldValues[fieldId] || '')
      setShowDatePicker(true)
    } else if (isCheckboxType(field.type) || isRadioType(field.type)) {
      // Toggle checkbox/radio directly
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
      // Toggle strikethrough directly
      const newValue = fieldValues[fieldId] === 'strikethrough' ? '' : 'strikethrough'
      setFieldValues(prev => ({ ...prev, [fieldId]: newValue }))
      if (newValue === 'strikethrough') {
        setSignedFields(prev => new Set([...Array.from(prev), fieldId]))
      } else {
        setSignedFields(prev => {
          const newSet = new Set(prev)
          newSet.delete(fieldId)
          return newSet
        })
      }
      setActiveFieldId(null)
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
  const getFieldFormatting = (fieldId: string) => {
    return fieldFormatting[fieldId] || { fontSize: 14, bold: false, italic: false, color: '#000000' }
  }

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, fieldId: string) => {
    if (!signedFields.has(fieldId)) return
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
  const updateFieldFormatting = (fieldId: string, updates: Partial<{ fontSize: number; bold: boolean; italic: boolean; color: string }>) => {
    setFieldFormatting(prev => ({
      ...prev,
      [fieldId]: { ...getFieldFormatting(fieldId), ...updates }
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
      const response = await fetch(`/api/signing-requests/${documentId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signerEmail,
          token,
          signature,
          signedFields: Array.from(signedFields),
          fieldValues: fieldValues
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
    for (let i = 0; i < pageNum - 1; i++) topOffset += (pageHeights[i] || 842) + 16

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

  if (loading) return (<div className="min-h-screen bg-gradient-to-br bg-[#1e1e1e] flex items-center justify-center"><div className="text-center"><Loader2 className="w-12 h-12 animate-spin text-[#c4ff0e] mx-auto mb-4" /><p className="text-gray-300">Loading document...</p></div></div>)

  if (error && !documentData) return (<div className="min-h-screen bg-gradient-to-br bg-[#1e1e1e] flex items-center justify-center p-4"><div className="card max-w-md w-full p-8 text-center"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-8 h-8 text-red-600" /></div><h1 className="text-xl font-bold text-white mb-2">Unable to Load Document</h1><p className="text-gray-300 mb-4">{error}</p><p className="text-sm text-gray-400">This link may have expired or is invalid. Please contact the sender.</p></div></div>)

  if (isComplete) return (<div className="min-h-screen bg-gradient-to-br bg-[#1e1e1e] flex items-center justify-center p-4"><div className="card max-w-md w-full p-8 text-center"><div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-600" /></div><h1 className="text-2xl font-bold text-white mb-2">Document Signed!</h1><p className="text-gray-300 mb-6">Thank you for signing. {documentData?.senderName} has been notified.</p><div className="bg-[#252525] rounded-xl p-4 mb-6 text-left"><p className="text-sm text-gray-400 mb-1">Document</p><p className="font-medium text-white">{documentData?.documentName}</p><p className="text-sm text-gray-400 mt-3 mb-1">Signed at</p><p className="font-medium text-white">{new Date().toLocaleString()}</p></div><div className="flex items-center justify-center gap-4 text-sm text-gray-400"><div className="flex items-center gap-1"><Shield className="w-4 h-4 text-green-600" /><span>Legally Binding</span></div><div className="flex items-center gap-1"><Lock className="w-4 h-4 text-green-600" /><span>Secured</span></div></div></div></div>)

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#1e1e1e]">
      <header className="bg-[#1F1F1F] border-b border-[#2a2a2a] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#c4ff0e]/20 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#c4ff0e]" />
              </div>
              <div>
                <h1 className="font-semibold text-white">{documentData?.documentName}</h1>
                <p className="text-sm text-gray-400">From {documentData?.senderName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Lock className="w-4 h-4" />
              <span>Secure Signing</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-6">
              <h3 className="font-semibold text-white mb-4">Signing as</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#c4ff0e]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#c4ff0e] font-bold text-lg">{currentSigner?.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium text-white">{currentSigner?.name}</p>
                  <p className="text-sm text-gray-400">{currentSigner?.email}</p>
                </div>
              </div>
            </div>

            {documentData?.message && (
              <div className="card p-6 bg-yellow-50 border-yellow-500/30">
                <h3 className="font-semibold text-white mb-2">Message from sender</h3>
                <p className="text-gray-300 text-sm italic">&quot;{documentData.message}&quot;</p>
              </div>
            )}

            <div className="card p-6">
              <h3 className="font-semibold text-white mb-4">Required Fields ({signedFields.size}/{myFields.length})</h3>
              <div className="space-y-2">
                {myFields.map((field) => {
                  const getSidebarIcon = (type: string) => {
                    const icons: Record<string, React.ReactNode> = {
                      signature: <PenTool className="w-5 h-5" />,
                      initials: <Type className="w-5 h-5" />,
                      text: <AlignLeft className="w-5 h-5" />,
                      name: <User className="w-5 h-5" />,
                      email: <Mail className="w-5 h-5" />,
                      phone: <Phone className="w-5 h-5" />,
                      company: <Building className="w-5 h-5" />,
                      multiline: <AlignLeft className="w-5 h-5" />,
                      date: <Calendar className="w-5 h-5" />,
                      checkbox: <CheckSquare className="w-5 h-5" />,
                      radio: <Circle className="w-5 h-5" />,
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
                      email: 'Email',
                      phone: 'Phone',
                      company: 'Company',
                      multiline: 'Multiline',
                      date: 'Date',
                      checkbox: 'Checkbox',
                      radio: 'Radio',
                      selection: 'Selection',
                      strikethrough: 'Strikethrough',
                      stamp: 'Stamp'
                    }
                    return labels[type] || field.label || 'Field'
                  }
                  return (
                    <div key={field.id} className={'flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ' + (signedFields.has(field.id) ? 'bg-green-50 border-green-400' : 'bg-[#252525] border-[#2a2a2a] hover:border-[#c4ff0e]')} onClick={() => handleFieldClick(field.id)}>
                      <span className={signedFields.has(field.id) ? 'text-green-600' : 'text-gray-300'}>
                        {signedFields.has(field.id) ? <CheckCircle className="w-5 h-5" /> : getSidebarIcon(field.type)}
                      </span>
                      <span className={'font-medium flex-1 ' + (signedFields.has(field.id) ? 'text-green-400' : 'text-gray-300')}>{getSidebarLabel(field.type)}</span>
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

            <button onClick={handleSubmit} disabled={signedFields.size !== myFields.length || isSubmitting} className="w-full py-4 bg-gradient-to-r from-[#c4ff0e] to-[#c4ff0e] text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:from-[#b3e60d] hover:to-[#b3e60d] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (<><Loader2 className="w-6 h-6 animate-spin" />Submitting...</>) : (<><Check className="w-6 h-6" />Complete Signing</>)}
            </button>

            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}

            <div className="card p-4 bg-[#252525]">
              <div className="flex items-center justify-around text-xs text-gray-400">
                <div className="flex items-center gap-1"><Shield className="w-4 h-4 text-green-600" /><span>Encrypted</span></div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-green-600" /><span>Timestamped</span></div>
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-600" /><span>Legal</span></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card p-3 mb-4 flex items-center justify-between sticky top-20 z-40 bg-[#1F1F1F]">
              <div className="flex items-center gap-2"><span className="text-sm font-medium text-gray-300">{totalPages} {totalPages === 1 ? 'page' : 'pages'}</span></div>
              <div className="flex items-center gap-2">
                <button onClick={zoomOut} disabled={scale <= 0.5} className="p-2 hover:bg-[#252525] rounded-lg disabled:opacity-50" title="Zoom out"><ZoomOut className="w-5 h-5" /></button>
                <span className="text-sm font-medium text-gray-300 min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
                <button onClick={zoomIn} disabled={scale >= 3} className="p-2 hover:bg-[#252525] rounded-lg disabled:opacity-50" title="Zoom in"><ZoomIn className="w-5 h-5" /></button>
                <button onClick={fitToWidth} className="p-2 hover:bg-[#252525] rounded-lg" title="Reset zoom"><Maximize2 className="w-5 h-5" /></button>
              </div>
            </div>

            <div
              ref={documentContainerRef}
              className="card p-4 bg-[#2a2a2a] max-h-[80vh] overflow-auto"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {pdfLoading ? (<div className="bg-[#1F1F1F] rounded-lg shadow-lg flex items-center justify-center mx-auto" style={{ width: '595px', height: '842px' }}><div className="text-center"><Loader2 className="w-12 h-12 animate-spin text-[#c4ff0e] mx-auto mb-4" /><p className="text-gray-300">Loading PDF...</p></div></div>)
              : pdfError ? (<div className="bg-[#1F1F1F] rounded-lg shadow-lg flex items-center justify-center mx-auto" style={{ width: '595px', height: '842px' }}><div className="text-center"><AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" /><p className="text-gray-300">{pdfError}</p></div></div>)
              : (
                <div ref={pagesContainerRef} className="flex flex-col items-center gap-4 relative">
                  {Array.from({ length: totalPages }, (_, i) => (<div key={i} className="relative"><canvas ref={(el) => { canvasRefs.current[i] = el }} className="bg-[#1F1F1F] rounded-lg shadow-lg" /><div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Page {i + 1} of {totalPages}</div></div>))}
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
                        email: <Mail className="w-4 h-4" />,
                        phone: <Phone className="w-4 h-4" />,
                        company: <Building className="w-4 h-4" />,
                        multiline: <AlignLeft className="w-4 h-4" />,
                        date: <Calendar className="w-4 h-4" />,
                        checkbox: <CheckSquare className="w-4 h-4" />,
                        radio: <Circle className="w-4 h-4" />,
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
                    const isRadType = isRadioType(field.type)
                    const isDtType = isDateType(field.type)
                    const isSelType = isSelectionType(field.type)
                    const isStrkType = isStrikethroughType(field.type)
                    const isStmpType = isStampType(field.type)
                    const hasValue = signedFields.has(field.id)
                    const fieldValue = fieldValues[field.id]
                    const isSelected = selectedFieldId === field.id
                    const formatting = getFieldFormatting(field.id)
                    const canFormat = isTxtType || isDtType || isSelType

                    // Text style based on formatting
                    const textStyle: React.CSSProperties = {
                      fontSize: `${formatting.fontSize}px`,
                      fontWeight: formatting.bold ? 'bold' : 'normal',
                      fontStyle: formatting.italic ? 'italic' : 'normal',
                      color: formatting.color
                    }

                    return (
                      <div
                        key={field.id}
                        onClick={(e) => {
                          if (hasValue) {
                            e.stopPropagation()
                            setSelectedFieldId(field.id)
                          } else {
                            handleFieldClick(field.id)
                          }
                        }}
                        onMouseDown={(e) => hasValue && handleDragStart(e, field.id)}
                        className={'absolute border-2 rounded-lg transition-all z-10 group ' +
                          (hasValue
                            ? (isSelected ? 'border-blue-500 bg-white/95 ring-2 ring-blue-300 cursor-move' : 'border-green-500 bg-green-50/90 cursor-move')
                            : 'border-dashed border-[#c4ff0e] bg-[#c4ff0e]/20 hover:bg-[#c4ff0e]/20 animate-pulse cursor-pointer'
                          )}
                        style={{
                          left: leftCalc,
                          top: originalPos.top + ((customPos.y - field.y) * scale),
                          width: customPos.width * scale,
                          height: customPos.height * scale,
                          zIndex: isSelected ? 100 : 10
                        }}
                      >
                        {hasValue ? (
                          <>
                            {/* Signature/Initials - show signature image */}
                            {isSigType && signature && (
                              <img src={signature} alt="Your signature" className="w-full h-full object-contain p-1" />
                            )}
                            {/* Text fields - show the entered value */}
                            {isTxtType && fieldValue && (
                              <div className="w-full h-full flex items-center justify-center p-1 overflow-hidden">
                                <span className="truncate" style={textStyle}>{fieldValue}</span>
                              </div>
                            )}
                            {/* Date field - show the selected date */}
                            {isDtType && fieldValue && (
                              <div className="w-full h-full flex items-center justify-center p-1">
                                <span style={textStyle}>{new Date(fieldValue).toLocaleDateString()}</span>
                              </div>
                            )}
                            {/* Checkbox - show checkmark */}
                            {isChkType && fieldValue === 'checked' && (
                              <div className="w-full h-full flex items-center justify-center">
                                <CheckSquare className="w-5 h-5 text-green-600" />
                              </div>
                            )}
                            {/* Radio - show filled circle */}
                            {isRadType && fieldValue === 'checked' && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-green-600 border-2 border-green-600" />
                              </div>
                            )}
                            {/* Selection - show selected value */}
                            {isSelType && fieldValue && (
                              <div className="w-full h-full flex items-center justify-center p-1">
                                <span className="truncate" style={textStyle}>{fieldValue}</span>
                              </div>
                            )}
                            {/* Strikethrough - show line */}
                            {isStrkType && fieldValue === 'strikethrough' && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-full h-0.5 bg-red-500" />
                              </div>
                            )}
                            {/* Stamp - show stamp text */}
                            {isStmpType && fieldValue && (
                              <div className="w-full h-full flex items-center justify-center p-1">
                                <span className="text-red-600 font-bold border-2 border-red-600 px-2 py-0.5 rounded transform -rotate-12" style={{ fontSize: `${formatting.fontSize}px` }}>{fieldValue}</span>
                              </div>
                            )}

                            {/* Formatting toolbar - show when selected and can format */}
                            {isSelected && canFormat && (
                              <div className="absolute -top-12 left-0 flex items-center gap-1 bg-[#1F1F1F] rounded-lg p-1.5 shadow-xl z-30">
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateFieldFormatting(field.id, { fontSize: Math.max(8, formatting.fontSize - 2) }) }}
                                  className="w-7 h-7 flex items-center justify-center rounded bg-[#252525] hover:bg-[#3a3a3a] text-white text-xs"
                                  title="Decrease font size"
                                >
                                  A-
                                </button>
                                <span className="text-white text-xs px-1">{formatting.fontSize}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateFieldFormatting(field.id, { fontSize: Math.min(48, formatting.fontSize + 2) }) }}
                                  className="w-7 h-7 flex items-center justify-center rounded bg-[#252525] hover:bg-[#3a3a3a] text-white text-xs"
                                  title="Increase font size"
                                >
                                  A+
                                </button>
                                <div className="w-px h-5 bg-gray-600 mx-1" />
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateFieldFormatting(field.id, { bold: !formatting.bold }) }}
                                  className={`w-7 h-7 flex items-center justify-center rounded ${formatting.bold ? 'bg-[#c4ff0e] text-black' : 'bg-[#252525] hover:bg-[#3a3a3a] text-white'}`}
                                  title="Bold"
                                >
                                  <Bold className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateFieldFormatting(field.id, { italic: !formatting.italic }) }}
                                  className={`w-7 h-7 flex items-center justify-center rounded ${formatting.italic ? 'bg-[#c4ff0e] text-black' : 'bg-[#252525] hover:bg-[#3a3a3a] text-white'}`}
                                  title="Italic"
                                >
                                  <Italic className="w-4 h-4" />
                                </button>
                                <div className="w-px h-5 bg-gray-600 mx-1" />
                                <input
                                  type="color"
                                  value={formatting.color}
                                  onChange={(e) => { e.stopPropagation(); updateFieldFormatting(field.id, { color: e.target.value }) }}
                                  className="w-7 h-7 rounded cursor-pointer bg-transparent"
                                  title="Text color"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}

                            {/* Move indicator when selected */}
                            {isSelected && (
                              <div className="absolute -top-2 -left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                <Move className="w-3 h-3 text-white" />
                              </div>
                            )}

                            {/* Resize handle - bottom right */}
                            {isSelected && (
                              <div
                                onMouseDown={(e) => handleResizeStart(e, field.id)}
                                className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center cursor-se-resize shadow-lg z-30"
                                title="Resize"
                              >
                                <Maximize className="w-3 h-3 text-white" />
                              </div>
                            )}

                            {/* Delete/Re-do button */}
                            <button
                              onClick={(e) => removeSignature(field.id, e)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg z-20"
                              title="Remove and redo"
                              style={{ display: isSelected ? 'none' : undefined }}
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[#c4ff0e] font-medium text-sm flex items-center gap-1">{fieldIcon}{(isChkType || isRadType || isStrkType) ? 'Click' : 'Click to fill'}</span>
                          </div>
                        )}
                        {!hasValue && (<div className="absolute -top-6 left-0"><span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-500 text-white whitespace-nowrap animate-bounce">{fieldLabel}</span></div>)}
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
          <div className="bg-[#1F1F1F] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Create Your Signature</h3>
                <button onClick={() => { setShowSignaturePad(false); setActiveFieldId(null) }} className="p-2 hover:bg-[#252525] rounded-lg transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
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

      {/* Text Input Modal */}
      {showTextInput && activeFieldId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F1F1F] rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {(() => {
                    const field = myFields.find(f => f.id === activeFieldId)
                    return field ? getFieldLabel(field.type).replace('Enter ', '') : 'Enter Value'
                  })()}
                </h3>
                <button onClick={() => { setShowTextInput(false); setActiveFieldId(null); setTextInputValue('') }} className="p-2 hover:bg-[#252525] rounded-lg transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                {(() => {
                  const field = myFields.find(f => f.id === activeFieldId)
                  const isMultiline = field?.type === 'multiline'
                  return isMultiline ? (
                    <textarea
                      value={textInputValue}
                      onChange={(e) => setTextInputValue(e.target.value)}
                      placeholder={`Enter ${field?.type || 'text'}...`}
                      className="w-full px-4 py-3 bg-[#252525] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#c4ff0e] focus:border-[#c4ff0e] resize-none"
                      rows={4}
                      autoFocus
                    />
                  ) : (
                    <input
                      type={field?.type === 'email' ? 'email' : field?.type === 'phone' ? 'tel' : 'text'}
                      value={textInputValue}
                      onChange={(e) => setTextInputValue(e.target.value)}
                      placeholder={`Enter ${field?.type || 'text'}...`}
                      className="w-full px-4 py-3 bg-[#252525] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#c4ff0e] focus:border-[#c4ff0e]"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') handleTextInputSave() }}
                    />
                  )
                })()}
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowTextInput(false); setActiveFieldId(null); setTextInputValue('') }}
                    className="flex-1 py-3 bg-[#252525] text-gray-300 rounded-xl font-medium hover:bg-[#3a3a3a] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTextInputSave}
                    disabled={!textInputValue.trim()}
                    className="flex-1 py-3 bg-[#c4ff0e] text-black rounded-xl font-semibold hover:bg-[#b3e60d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && activeFieldId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F1F1F] rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Select Date</h3>
                <button onClick={() => { setShowDatePicker(false); setActiveFieldId(null); setTextInputValue('') }} className="p-2 hover:bg-[#252525] rounded-lg transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <input
                  type="date"
                  value={textInputValue}
                  onChange={(e) => setTextInputValue(e.target.value)}
                  className="w-full px-4 py-3 bg-[#252525] border border-[#3a3a3a] rounded-xl text-white focus:ring-2 focus:ring-[#c4ff0e] focus:border-[#c4ff0e]"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowDatePicker(false); setActiveFieldId(null); setTextInputValue('') }}
                    className="flex-1 py-3 bg-[#252525] text-gray-300 rounded-xl font-medium hover:bg-[#3a3a3a] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDateSave}
                    disabled={!textInputValue}
                    className="flex-1 py-3 bg-[#c4ff0e] text-black rounded-xl font-semibold hover:bg-[#b3e60d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
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
          <div className="bg-[#1F1F1F] rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Select Option</h3>
                <button onClick={() => { setShowSelection(false); setActiveFieldId(null); setTextInputValue('') }} className="p-2 hover:bg-[#252525] rounded-lg transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <select
                  value={textInputValue}
                  onChange={(e) => setTextInputValue(e.target.value)}
                  className="w-full px-4 py-3 bg-[#252525] border border-[#3a3a3a] rounded-xl text-white focus:ring-2 focus:ring-[#c4ff0e] focus:border-[#c4ff0e]"
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
                    className="flex-1 py-3 bg-[#252525] text-gray-300 rounded-xl font-medium hover:bg-[#3a3a3a] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSelectionSave(textInputValue)}
                    disabled={!textInputValue}
                    className="flex-1 py-3 bg-[#c4ff0e] text-black rounded-xl font-semibold hover:bg-[#b3e60d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stamp Picker Modal */}
      {showStampPicker && activeFieldId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F1F1F] rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Select Stamp</h3>
                <button onClick={() => { setShowStampPicker(false); setActiveFieldId(null) }} className="p-2 hover:bg-[#252525] rounded-lg transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {stampOptions.map((stamp) => (
                  <button
                    key={stamp}
                    onClick={() => handleStampSave(stamp)}
                    className="p-4 bg-[#252525] border-2 border-[#3a3a3a] rounded-xl hover:border-[#c4ff0e] transition-colors group"
                  >
                    <span className="text-red-500 font-bold text-sm border-2 border-red-500 px-3 py-1 rounded transform inline-block group-hover:scale-105 transition-transform">{stamp}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => { setShowStampPicker(false); setActiveFieldId(null) }}
                  className="w-full py-3 bg-[#252525] text-gray-300 rounded-xl font-medium hover:bg-[#3a3a3a] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
