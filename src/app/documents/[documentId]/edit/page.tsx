'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import * as pdfjsLib from 'pdfjs-dist'
import {
  ArrowLeft,
  Send,
  Loader2,
  Users,
  LayoutGrid,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react'
import { DocumentField, FieldType, Signer, FIELD_CONFIGS, SIGNER_COLORS } from '@/types/signing'
import FieldPalette from '@/components/signing/FieldPalette'
import SignerManager from '@/components/signing/SignerManager'
import DraggableFieldOnDocument from '@/components/signing/DraggableFieldOnDocument'

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

// Main Editor Component (wrapped with DndProvider at export)
const DocumentEditorInner: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const documentId = params.documentId as string

  // State
  const [document, setDocument] = useState<any>(null)
  const [fields, setFields] = useState<DocumentField[]>([])
  const [signers, setSigners] = useState<Signer[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<'fields' | 'signers'>('signers')
  const [selectedSignerId, setSelectedSignerId] = useState<string | null>(null)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  // PDF state for continuous scroll
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [pageHeights, setPageHeights] = useState<number[]>([])
  const [pageWidth, setPageWidth] = useState(612)
  const [pdfRendered, setPdfRendered] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const pagesContainerRef = useRef<HTMLDivElement>(null)
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])

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
        const loadingTask = pdfjsLib.getDocument(document.file_url)
        const pdf = await loadingTask.promise
        setPdfDoc(pdf)
        setTotalPages(pdf.numPages)
        canvasRefs.current = new Array(pdf.numPages).fill(null)
      } catch (err) {
        console.error('Error loading PDF:', err)
        setError('Failed to load PDF')
      }
    }

    loadPdf()
  }, [document?.file_url])

  // Render all pages
  const renderAllPages = useCallback(async () => {
    if (!pdfDoc || !pagesContainerRef.current) return

    const heights: number[] = []
    let width = 612

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const canvas = canvasRefs.current[i - 1]
      if (!canvas) continue

      try {
        const page = await pdfDoc.getPage(i)
        const viewport = page.getViewport({ scale })

        canvas.height = viewport.height
        canvas.width = viewport.width
        width = viewport.width

        const context = canvas.getContext('2d')
        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise
        }

        heights.push(viewport.height)
      } catch (err) {
        console.error(`Error rendering page ${i}:`, err)
        heights.push(792 * scale)
      }
    }

    setPageHeights(heights)
    setPageWidth(width)
    setPdfRendered(true)
  }, [pdfDoc, scale])

  // Render pages when PDF is loaded or scale changes
  useEffect(() => {
    if (pdfDoc && canvasRefs.current.length === pdfDoc.numPages) {
      const timer = setTimeout(() => {
        renderAllPages()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [pdfDoc, scale, renderAllPages])

  // Calculate cumulative heights for field positioning
  const getCumulativeHeight = (pageIndex: number): number => {
    let height = 0
    for (let i = 0; i < pageIndex; i++) {
      height += (pageHeights[i] || 792 * scale) + 24 // 24px gap between pages
    }
    return height
  }

  // Get page number from Y position
  const getPageFromY = (y: number): number => {
    let cumHeight = 0
    for (let i = 0; i < pageHeights.length; i++) {
      const pageH = pageHeights[i] || 792 * scale
      if (y < cumHeight + pageH) {
        return i + 1
      }
      cumHeight += pageH + 24
    }
    return pageHeights.length || 1
  }

  // Drop handler
  const [, drop] = useDrop(() => ({
    accept: ['new-field', 'existing-field'],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset()
      const containerRect = pagesContainerRef.current?.getBoundingClientRect()
      const scrollTop = scrollContainerRef.current?.scrollTop || 0

      if (!offset || !containerRect) return

      const relativeX = offset.x - containerRect.left
      const relativeY = offset.y - containerRect.top + scrollTop

      // Determine which page
      const pageNum = getPageFromY(relativeY)
      const pageTopOffset = getCumulativeHeight(pageNum - 1)
      const pageHeight = pageHeights[pageNum - 1] || 792 * scale

      // Position within that page as percentage
      const xPercent = (relativeX / pageWidth) * 100
      const yInPage = relativeY - pageTopOffset
      const yPercent = (yInPage / pageHeight) * 100

      if (item.type === 'new-field') {
        handleAddField(item.fieldType, xPercent, yPercent, pageNum)
      } else if (item.type === 'existing-field') {
        handleUpdateField(item.fieldId, { x: xPercent, y: yPercent, page_number: pageNum })
      }
    },
  }), [pageHeights, pageWidth, scale])

  // Add field
  const handleAddField = async (fieldType: FieldType, x?: number, y?: number, pageNum?: number) => {
    if (!selectedSignerId) {
      alert('Please select a signer first')
      return
    }

    const config = FIELD_CONFIGS[fieldType]

    try {
      const response = await fetch('/api/signing/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: documentId,
          signer_id: selectedSignerId,
          field_type: fieldType,
          page_number: pageNum || 1,
          x: x ?? 10,
          y: y ?? 10,
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
  const handleAddSigner = async (name: string, email: string, isSelf?: boolean) => {
    try {
      const response = await fetch('/api/signing/signers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: documentId,
          name,
          email,
          is_self: isSelf || false,
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
      <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#c4ff0e] mx-auto mb-3" />
          <p className="text-gray-400">Loading document...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-white font-medium mb-2">Error loading document</p>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/documents')}
            className="px-4 py-2 bg-[#c4ff0e] text-black rounded-lg hover:bg-[#b3e60d]"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex flex-col">
      {/* Header */}
      <header className="h-16 bg-[#1F1F1F] border-b border-[#2a2a2a] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/documents')}
            className="p-2 text-gray-400 hover:bg-[#252525] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-white">{document?.name}</h1>
            <p className="text-xs text-gray-400">
              {totalPages} page{totalPages !== 1 ? 's' : ''} • {signers.length} signer{signers.length !== 1 ? 's' : ''} • {fields.length} field{fields.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSend}
            disabled={sending || signers.length === 0 || fields.length === 0}
            className="px-5 py-2.5 bg-[#c4ff0e] text-black rounded-lg hover:bg-[#b3e60d] transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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
        <div className="w-80 bg-[#1F1F1F] border-r border-[#2a2a2a] flex flex-col shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-[#2a2a2a]">
            <button
              onClick={() => setActiveTab('fields')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors
                ${activeTab === 'fields'
                  ? 'text-[#c4ff0e] border-b-2 border-[#c4ff0e] bg-[#c4ff0e]/10'
                  : 'text-gray-400 hover:text-white hover:bg-[#252525]'
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
                  ? 'text-[#c4ff0e] border-b-2 border-[#c4ff0e] bg-[#c4ff0e]/10'
                  : 'text-gray-400 hover:text-white hover:bg-[#252525]'
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
                currentUserName={user?.fullName || user?.firstName || 'You'}
                currentUserEmail={user?.primaryEmailAddress?.emailAddress}
                onUpdateSigner={handleUpdateSigner}
                onRemoveSigner={handleRemoveSigner}
              />
            )}
          </div>
        </div>

        {/* Document Viewer - Continuous Scroll */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Zoom Toolbar */}
          <div className="h-12 bg-[#1F1F1F] border-b border-[#2a2a2a] flex items-center justify-center px-4 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale(prev => Math.max(0.5, prev - 0.25))}
                className="p-1.5 rounded hover:bg-[#252525] text-gray-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-300 w-14 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale(prev => Math.min(2, prev + 0.25))}
                className="p-1.5 rounded hover:bg-[#252525] text-gray-300"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => setScale(1)}
                className="p-1.5 rounded hover:bg-[#252525] text-gray-300"
                title="Reset Zoom"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <span className="ml-4 text-sm text-gray-400">
                {totalPages} page{totalPages !== 1 ? 's' : ''} • Scroll to view all
              </span>
            </div>
          </div>

          {/* Scrollable PDF Container */}
          <div
            ref={(el) => {
              scrollContainerRef.current = el
              drop(el)
            }}
            className="flex-1 overflow-auto bg-[#252525] p-6"
            onClick={() => setSelectedFieldId(null)}
          >
            <div
              ref={pagesContainerRef}
              className="flex flex-col items-center gap-6"
              style={{ minHeight: '100%' }}
            >
              {/* Render all pages */}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1
                const pageHeight = pageHeights[index] || 792 * scale
                const fieldsOnPage = fields.filter(f => f.page_number === pageNum)

                return (
                  <div
                    key={pageNum}
                    className="relative bg-white shadow-xl"
                    style={{
                      width: pageWidth,
                      height: pageHeight,
                    }}
                  >
                    {/* Page number indicator */}
                    <div className="absolute -top-6 left-0 text-xs text-gray-500 font-medium">
                      Page {pageNum}
                    </div>

                    {/* Canvas for PDF page */}
                    <canvas
                      ref={(el) => {
                        canvasRefs.current[index] = el
                      }}
                      className="block"
                    />

                    {/* Fields overlay for this page */}
                    <div className="absolute inset-0 pointer-events-none">
                      {fieldsOnPage.map(field => (
                        <div
                          key={field.id}
                          className="pointer-events-auto"
                          style={{
                            position: 'absolute',
                            left: `${field.x}%`,
                            top: `${field.y}%`,
                            width: `${field.width}%`,
                            height: `${field.height}%`,
                          }}
                        >
                          <DraggableFieldOnDocument
                            field={field}
                            signerColor={getSignerColor(field.signer_id)}
                            signerName={getSignerName(field.signer_id)}
                            isSelected={selectedFieldId === field.id}
                            isEditable={true}
                            containerWidth={pageWidth}
                            containerHeight={pageHeight}
                            onSelect={() => setSelectedFieldId(field.id)}
                            onUpdate={(updates) => handleUpdateField(field.id, updates)}
                            onDelete={() => handleDeleteField(field.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Loading state */}
              {totalPages === 0 && (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}
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
