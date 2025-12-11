'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  ArrowLeft,
  Save,
  Send,
  Loader2,
  FileText,
  Users,
  LayoutGrid,
  Settings,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react'
import { DocumentField, FieldType, Signer, FIELD_CONFIGS, SIGNER_COLORS } from '@/types/signing'
import FieldPalette from '@/components/signing/FieldPalette'
import SignerManager from '@/components/signing/SignerManager'
import DraggableFieldOnDocument from '@/components/signing/DraggableFieldOnDocument'

// Main Editor Component (wrapped with DndProvider at export)
const DocumentEditorInner: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const documentId = params.documentId as string

  // State
  const [document, setDocument] = useState<any>(null)
  const [fields, setFields] = useState<DocumentField[]>([])
  const [signers, setSigners] = useState<Signer[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<'fields' | 'signers' | 'settings'>('fields')
  const [selectedSignerId, setSelectedSignerId] = useState<string | null>(null)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [pdfDimensions, setPdfDimensions] = useState({ width: 612, height: 792 }) // Default letter size

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pdfDocRef = useRef<any>(null)

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/signing/documents/${documentId}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error)
        }

        setDocument(data.document)
        setFields(data.document.fields || [])
        setSigners(data.document.signers || [])

        // Select first signer by default if exists
        if (data.document.signers?.length > 0) {
          setSelectedSignerId(data.document.signers[0].id)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load document')
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [documentId])

  // Load PDF
  useEffect(() => {
    const loadPdf = async () => {
      if (!document?.file_url) return

      try {
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

        const loadingTask = pdfjsLib.getDocument(document.file_url)
        const pdf = await loadingTask.promise
        pdfDocRef.current = pdf

        // Update document page count if different
        if (pdf.numPages !== document.page_count) {
          setDocument((prev: any) => ({ ...prev, page_count: pdf.numPages }))
        }

        // Render first page
        renderPage(1)
      } catch (err) {
        console.error('Error loading PDF:', err)
      }
    }

    loadPdf()
  }, [document?.file_url])

  // Render PDF page
  const renderPage = async (pageNum: number) => {
    if (!pdfDocRef.current || !canvasRef.current) return

    try {
      const page = await pdfDocRef.current.getPage(pageNum)
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (!context) return

      const containerWidth = containerRef.current?.clientWidth || 800
      const viewport = page.getViewport({ scale: 1 })
      const baseScale = (containerWidth - 80) / viewport.width
      const finalScale = baseScale * scale

      const scaledViewport = page.getViewport({ scale: finalScale })

      canvas.height = scaledViewport.height
      canvas.width = scaledViewport.width

      setPdfDimensions({
        width: scaledViewport.width,
        height: scaledViewport.height,
      })

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      }

      await page.render(renderContext).promise
    } catch (err) {
      console.error('Error rendering page:', err)
    }
  }

  // Re-render on page or scale change
  useEffect(() => {
    renderPage(currentPage)
  }, [currentPage, scale])

  // Drop handler for new fields
  const [, drop] = useDrop(() => ({
    accept: ['new-field', 'existing-field'],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset()
      const containerRect = containerRef.current?.getBoundingClientRect()

      if (!offset || !containerRect) return

      // Calculate position as percentage
      const x = ((offset.x - containerRect.left) / pdfDimensions.width) * 100
      const y = ((offset.y - containerRect.top) / pdfDimensions.height) * 100

      if (item.type === 'new-field') {
        handleAddField(item.fieldType, x, y)
      } else if (item.type === 'existing-field') {
        handleUpdateField(item.fieldId, { x, y })
      }
    },
  }), [pdfDimensions, currentPage, selectedSignerId])

  // Add field
  const handleAddField = async (fieldType: FieldType, x?: number, y?: number) => {
    if (!selectedSignerId) {
      alert('Please select a signer first')
      return
    }

    const config = FIELD_CONFIGS[fieldType]
    const fieldX = x ?? 10
    const fieldY = y ?? 10

    try {
      const response = await fetch('/api/signing/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: documentId,
          signer_id: selectedSignerId,
          field_type: fieldType,
          page_number: currentPage,
          x: fieldX,
          y: fieldY,
          width: config.defaultWidth,
          height: config.defaultHeight,
          required: true,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setFields(prev => [...prev, data.field])
        setSelectedFieldId(data.field.id)
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      console.error('Error adding field:', err)
      alert('Failed to add field: ' + err.message)
    }
  }

  // Update field
  const handleUpdateField = async (fieldId: string, updates: Partial<DocumentField>) => {
    try {
      const response = await fetch(`/api/signing/fields/${fieldId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()
      if (data.success) {
        setFields(prev => prev.map(f => f.id === fieldId ? data.field : f))
      }
    } catch (err) {
      console.error('Error updating field:', err)
    }
  }

  // Delete field
  const handleDeleteField = async (fieldId: string) => {
    try {
      const response = await fetch(`/api/signing/fields/${fieldId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        setFields(prev => prev.filter(f => f.id !== fieldId))
        setSelectedFieldId(null)
      }
    } catch (err) {
      console.error('Error deleting field:', err)
    }
  }

  // Add signer
  const handleAddSigner = async (name: string, email: string) => {
    try {
      const response = await fetch('/api/signing/signers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: documentId,
          name,
          email,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSigners(prev => [...prev, data.signer])
        setSelectedSignerId(data.signer.id)
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      console.error('Error adding signer:', err)
      alert('Failed to add signer: ' + err.message)
    }
  }

  // Update signer
  const handleUpdateSigner = async (signerId: string, updates: Partial<Signer>) => {
    try {
      const response = await fetch(`/api/signing/signers/${signerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()
      if (data.success) {
        setSigners(prev => prev.map(s => s.id === signerId ? data.signer : s))
      }
    } catch (err) {
      console.error('Error updating signer:', err)
    }
  }

  // Remove signer
  const handleRemoveSigner = async (signerId: string) => {
    try {
      const response = await fetch(`/api/signing/signers/${signerId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        setSigners(prev => prev.filter(s => s.id !== signerId))
        // Remove fields assigned to this signer
        setFields(prev => prev.filter(f => f.signer_id !== signerId))
        if (selectedSignerId === signerId) {
          setSelectedSignerId(signers.length > 1 ? signers[0].id : null)
        }
      }
    } catch (err) {
      console.error('Error removing signer:', err)
    }
  }

  // Send for signing
  const handleSend = async () => {
    if (signers.length === 0) {
      alert('Please add at least one signer')
      return
    }

    if (fields.length === 0) {
      alert('Please add at least one field')
      return
    }

    // Check all fields have signers
    const unassignedFields = fields.filter(f => !f.signer_id)
    if (unassignedFields.length > 0) {
      alert(`${unassignedFields.length} field(s) are not assigned to any signer`)
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/signing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: documentId }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Document sent for signing!')
        router.push('/documents')
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      console.error('Error sending document:', err)
      alert('Failed to send: ' + err.message)
    } finally {
      setSending(false)
    }
  }

  // Get fields for current page
  const pageFields = fields.filter(f => f.page_number === currentPage)

  // Get signer color
  const getSignerColor = (signerId: string | undefined | null) => {
    if (!signerId) return '#6366f1'
    const index = signers.findIndex(s => s.id === signerId)
    return signers[index]?.color || SIGNER_COLORS[index % SIGNER_COLORS.length]?.border.replace('border-', '#') || '#6366f1'
  }

  const getSignerName = (signerId: string | undefined | null) => {
    if (!signerId) return undefined
    return signers.find(s => s.id === signerId)?.name
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-3" />
          <p className="text-gray-500">Loading document...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-900 font-medium mb-2">Error loading document</p>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => router.push('/documents')}
            className="px-4 py-2 bg-primary-500 text-gray-900 rounded-lg hover:bg-primary-600"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/documents')}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-gray-900">{document?.name}</h1>
            <p className="text-xs text-gray-500">
              {document?.page_count} page{document?.page_count !== 1 ? 's' : ''} • {signers.length} signer{signers.length !== 1 ? 's' : ''} • {fields.length} field{fields.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSend}
            disabled={sending || signers.length === 0 || fields.length === 0}
            className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-700 text-gray-900 rounded-lg hover:from-primary-600 hover:to-primary-800 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send for Signing
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('fields')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors
                ${activeTab === 'fields'
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <LayoutGrid className="w-4 h-4" />
              Fields
            </button>
            <button
              onClick={() => setActiveTab('signers')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors
                ${activeTab === 'signers'
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Users className="w-4 h-4" />
              Signers
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'fields' && (
              <FieldPalette
                onAddField={handleAddField}
                selectedSignerId={selectedSignerId}
                signers={signers.map((s, i) => ({
                  id: s.id,
                  name: s.name,
                  color: s.color || SIGNER_COLORS[i % SIGNER_COLORS.length]?.border.replace('border-', '#') || '#6366f1',
                }))}
              />
            )}
            {activeTab === 'signers' && (
              <SignerManager
                signers={signers}
                selectedSignerId={selectedSignerId}
                onSelectSigner={setSelectedSignerId}
                onAddSigner={handleAddSigner}
                onUpdateSigner={handleUpdateSigner}
                onRemoveSigner={handleRemoveSigner}
              />
            )}
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {document?.page_count || 1}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(document?.page_count || 1, prev + 1))}
                disabled={currentPage >= (document?.page_count || 1)}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale(prev => Math.max(0.5, prev - 0.25))}
                className="p-1.5 rounded hover:bg-gray-100"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600 w-14 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale(prev => Math.min(2, prev + 0.25))}
                className="p-1.5 rounded hover:bg-gray-100"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => setScale(1)}
                className="p-1.5 rounded hover:bg-gray-100"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div
            ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
            className="flex-1 overflow-auto p-6 flex justify-center"
            onClick={() => setSelectedFieldId(null)}
          >
            <div
              ref={containerRef}
              className="relative bg-white shadow-xl rounded-lg overflow-hidden"
              style={{
                width: pdfDimensions.width,
                height: pdfDimensions.height,
              }}
            >
              <canvas ref={canvasRef} className="block" />

              {/* Fields Overlay */}
              <div className="absolute inset-0">
                {pageFields.map(field => (
                  <DraggableFieldOnDocument
                    key={field.id}
                    field={field}
                    signerColor={getSignerColor(field.signer_id)}
                    signerName={getSignerName(field.signer_id)}
                    isSelected={selectedFieldId === field.id}
                    isEditable={true}
                    containerWidth={pdfDimensions.width}
                    containerHeight={pdfDimensions.height}
                    onSelect={() => setSelectedFieldId(field.id)}
                    onUpdate={(updates) => handleUpdateField(field.id, updates)}
                    onDelete={() => handleDeleteField(field.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export with DndProvider wrapper
const DocumentEditorPage: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DocumentEditorInner />
    </DndProvider>
  )
}

export default DocumentEditorPage
