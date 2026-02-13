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
import { apiPost, apiGet, safeFetch } from '@/lib/api'

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

// Helper function to detect file type from URL
const getFileType = (url: string): 'pdf' | 'image' | 'unknown' => {
  const lowerUrl = url.toLowerCase()
  // Check file extension
  if (lowerUrl.includes('.pdf') || lowerUrl.includes('application/pdf')) return 'pdf'
  if (lowerUrl.match(/\.(png|jpg|jpeg|gif|webp|bmp)/)) return 'image'
  if (lowerUrl.includes('image/')) return 'image'
  // Check for common image hosting patterns
  if (lowerUrl.includes('blob:') || lowerUrl.includes('data:image')) return 'image'
  // Default to PDF for unknown types (legacy behavior)
  return 'unknown'
}

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

  // File type and rendering state
  const [fileType, setFileType] = useState<'pdf' | 'image' | 'unknown'>('unknown')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)

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
        // Use safe API helper (prevents JSON parse errors)
        const result = await apiGet(`/api/signing/documents/${documentId}`)

        if (!result.success) {
          throw new Error(result.error || 'Failed to load document')
        }

        setDocument(result.data.document)
        setFields(result.data.document.fields || [])
        setSigners(result.data.document.signers || [])

        if (result.data.document.signers?.length > 0) {
          setSelectedSignerId(result.data.document.signers[0].id)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load document')
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [documentId])

  // Load PDF or Image
  useEffect(() => {
    const loadDocument = async () => {
      if (!document?.file_url) return

      // Use document's stored mime_type if available, otherwise detect from URL
      let detectedFileType: 'pdf' | 'image' | 'unknown' = 'unknown'

      if (document.mime_type) {
        if (document.mime_type.includes('pdf')) {
          detectedFileType = 'pdf'
        } else if (document.mime_type.includes('image')) {
          detectedFileType = 'image'
        }
      }

      // Fallback to URL detection if mime_type not available
      if (detectedFileType === 'unknown') {
        detectedFileType = getFileType(document.file_url)
      }

      console.log('Document file_url:', document.file_url)
      console.log('Document mime_type:', document.mime_type)
      console.log('Detected file type:', detectedFileType)

      setFileType(detectedFileType)

      if (detectedFileType === 'pdf') {
        // Load PDF with PDF.js
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
      } else if (detectedFileType === 'image') {
        // Load Image - wait for dimensions before setting totalPages
        try {
          const img = new Image()
          img.onload = () => {
            // Set image URL and dimensions FIRST
            setImageUrl(document.file_url)
            setImageDimensions({ width: img.width, height: img.height })
            // Set page dimensions based on actual image size
            const imgWidth = Math.max(img.width, 400) // minimum width
            const imgHeight = Math.max(img.height, 400) // minimum height
            setPageWidth(imgWidth * scale)
            setPageHeights([imgHeight * scale])
            // NOW set totalPages to trigger render with correct dimensions
            setTotalPages(1)
            setPdfRendered(true)
          }
          img.onerror = () => {
            console.error('Error loading image')
            setError('Failed to load image')
          }
          img.src = document.file_url
        } catch (err) {
          console.error('Error loading image:', err)
          setError('Failed to load image')
        }
      } else {
        // For unknown type, try to load as image first (since images are more common)
        console.log('Unknown file type, trying to load as image...')
        try {
          const img = new Image()
          img.onload = () => {
            console.log('Successfully loaded as image')
            setFileType('image')
            setImageUrl(document.file_url)
            setImageDimensions({ width: img.width, height: img.height })
            const imgWidth = Math.max(img.width, 400)
            const imgHeight = Math.max(img.height, 400)
            setPageWidth(imgWidth * scale)
            setPageHeights([imgHeight * scale])
            setTotalPages(1)
            setPdfRendered(true)
          }
          img.onerror = () => {
            console.log('Failed to load as image, trying PDF...')
            // Try loading as PDF
            pdfjsLib.getDocument(document.file_url).promise.then(pdf => {
              setFileType('pdf')
              setPdfDoc(pdf)
              setTotalPages(pdf.numPages)
              canvasRefs.current = new Array(pdf.numPages).fill(null)
            }).catch(() => {
              setError('Unsupported file type. Please upload a PDF or image file.')
            })
          }
          img.src = document.file_url
        } catch (err) {
          setError('Unsupported file type. Please upload a PDF or image file.')
        }
      }
    }

    loadDocument()
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
    if (fileType === 'pdf' && pdfDoc && canvasRefs.current.length === pdfDoc.numPages) {
      const timer = setTimeout(() => {
        renderAllPages()
      }, 100)
      return () => clearTimeout(timer)
    } else if (fileType === 'image' && imageDimensions) {
      // Update image dimensions when scale changes
      const imgWidth = Math.max(imageDimensions.width, 400)
      const imgHeight = Math.max(imageDimensions.height, 400)
      setPageWidth(imgWidth * scale)
      setPageHeights([imgHeight * scale])
    }
  }, [pdfDoc, scale, renderAllPages, fileType, imageDimensions])

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

  // Drop handler - hit-test individual page elements for reliable multi-page positioning
  const [, drop] = useDrop(() => ({
    accept: ['new-field', 'existing-field'],
    canDrop: () => pdfRendered && pageHeights.length > 0,
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset()
      if (!offset || !pdfRendered) return

      // Find which page element the cursor is over by checking each page's visual rect
      // This avoids all scroll offset issues since getBoundingClientRect on individual
      // page elements always returns their correct visual position
      const pageElements = pagesContainerRef.current?.querySelectorAll('[data-page-num]')
      if (!pageElements || pageElements.length === 0) return

      let targetPageNum: number | null = null
      let relativeX = 0
      let relativeY = 0
      let targetPageHeight = 0

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i] as HTMLElement
        const rect = pageEl.getBoundingClientRect()

        if (offset.x >= rect.left && offset.x <= rect.right &&
            offset.y >= rect.top && offset.y <= rect.bottom) {
          targetPageNum = parseInt(pageEl.dataset.pageNum || '1')
          relativeX = offset.x - rect.left
          relativeY = offset.y - rect.top
          targetPageHeight = rect.height
          break
        }
      }

      // If cursor isn't directly over a page, find the nearest page
      if (targetPageNum === null) {
        let minDist = Infinity
        for (let i = 0; i < pageElements.length; i++) {
          const pageEl = pageElements[i] as HTMLElement
          const rect = pageEl.getBoundingClientRect()
          const centerY = (rect.top + rect.bottom) / 2
          const dist = Math.abs(offset.y - centerY)
          if (dist < minDist) {
            minDist = dist
            targetPageNum = parseInt(pageEl.dataset.pageNum || '1')
            relativeX = Math.max(0, Math.min(offset.x - rect.left, rect.width))
            relativeY = Math.max(0, Math.min(offset.y - rect.top, rect.height))
            targetPageHeight = rect.height
          }
        }
      }

      if (!targetPageNum) return

      const xPercent = Math.max(0, Math.min(100, (relativeX / pageWidth) * 100))
      const yPercent = Math.max(0, Math.min(100, (relativeY / targetPageHeight) * 100))

      if (item.type === 'new-field') {
        handleAddField(item.fieldType, xPercent, yPercent, targetPageNum)
      } else if (item.type === 'existing-field') {
        handleUpdateField(item.fieldId, { x: xPercent, y: yPercent, page_number: targetPageNum })
      }
    },
  }), [pageHeights, pageWidth, scale, pdfRendered, selectedSignerId])

  // Add field
  const handleAddField = async (fieldType: FieldType, x?: number, y?: number, pageNum?: number) => {
    if (!selectedSignerId) {
      alert('Please select a signer first')
      return
    }

    const config = FIELD_CONFIGS[fieldType]

    try {
      const result = await apiPost('/api/signing/fields', {
        document_id: documentId,
        signer_id: selectedSignerId,
        field_type: fieldType,
        page_number: pageNum || 1,
        x: x ?? 10,
        y: y ?? 10,
        width: config.defaultWidth,
        height: config.defaultHeight,
        required: true,
      })

      if (result.success && result.data?.field) {
        setFields(prev => [...prev, result.data.field])
        setSelectedFieldId(result.data.field.id)
      } else {
        throw new Error(result.error || 'Failed to add field')
      }
    } catch (err: any) {
      console.error('Error adding field:', err)
      alert('Failed to add field: ' + err.message)
    }
  }

  // Update field
  const handleUpdateField = async (fieldId: string, updates: Partial<DocumentField>) => {
    try {
      const result = await apiPost(`/api/signing/fields/${fieldId}`, updates)
      if (result.success && result.data?.field) {
        setFields(prev => prev.map(f => f.id === fieldId ? result.data.field : f))
      }
    } catch (err) {
      console.error('Error updating field:', err)
    }
  }

  // Delete field
  const handleDeleteField = async (fieldId: string) => {
    try {
      const result = await safeFetch(`/api/signing/fields/${fieldId}`, { method: 'DELETE' })
      if (result.success) {
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
      const result = await apiPost('/api/signing/signers', {
        document_id: documentId,
        name,
        email,
        is_self: isSelf || false,
      })

      if (result.success && result.data?.signer) {
        setSigners(prev => [...prev, result.data.signer])
        setSelectedSignerId(result.data.signer.id)
      } else {
        throw new Error(result.error || 'Failed to add signer')
      }
    } catch (err: any) {
      console.error('Error adding signer:', err)
      alert('Failed to add signer: ' + err.message)
    }
  }

  // Update signer
  const handleUpdateSigner = async (signerId: string, updates: Partial<Signer>) => {
    try {
      const result = await apiPost(`/api/signing/signers/${signerId}`, updates)
      if (result.success && result.data?.signer) {
        setSigners(prev => prev.map(s => s.id === signerId ? result.data.signer : s))
      }
    } catch (err) {
      console.error('Error updating signer:', err)
    }
  }

  // Remove signer
  const handleRemoveSigner = async (signerId: string) => {
    try {
      const result = await safeFetch(`/api/signing/signers/${signerId}`, { method: 'DELETE' })
      if (result.success) {
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
      // Use safe API helper (prevents JSON parse errors)
      const result = await apiPost('/api/signing/send', { document_id: documentId })

      if (result.success) {
        alert('Document sent for signing!')
        router.push('/documents')
      } else {
        throw new Error(result.error || 'Failed to send')
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
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-gray-400">Loading document...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-foreground font-medium mb-2">Error loading document</p>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/documents')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/documents')}
            className="p-2 text-gray-400 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-foreground">{document?.name}</h1>
            <p className="text-xs text-gray-400">
              {totalPages} page{totalPages !== 1 ? 's' : ''} • {signers.length} signer{signers.length !== 1 ? 's' : ''} • {fields.length} field{fields.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSend}
            disabled={sending || signers.length === 0 || fields.length === 0}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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
        <div className="w-80 bg-white border-r border-border flex flex-col shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('fields')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors
                ${activeTab === 'fields'
                  ? 'text-primary border-b-2 border-primary bg-primary/10'
                  : 'text-gray-400 hover:text-foreground hover:bg-secondary'
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
                  ? 'text-primary border-b-2 border-primary bg-primary/10'
                  : 'text-gray-400 hover:text-foreground hover:bg-secondary'
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
          <div className="h-12 bg-white border-b border-border flex items-center justify-center px-4 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale(prev => Math.max(0.5, prev - 0.25))}
                className="p-1.5 rounded hover:bg-secondary text-gray-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-300 w-14 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale(prev => Math.min(2, prev + 0.25))}
                className="p-1.5 rounded hover:bg-secondary text-gray-300"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => setScale(1)}
                className="p-1.5 rounded hover:bg-secondary text-gray-300"
                title="Reset Zoom"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <span className="ml-4 text-sm text-gray-400">
                {totalPages} page{totalPages !== 1 ? 's' : ''} • Scroll to view all
              </span>
            </div>
          </div>

          {/* Scrollable Document Container */}
          <div
            ref={(el) => {
              scrollContainerRef.current = el
              drop(el)
            }}
            className="flex-1 overflow-auto bg-secondary p-6"
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
                    data-page-num={pageNum}
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

                    {/* Render PDF page or Image */}
                    {fileType === 'pdf' ? (
                      <canvas
                        ref={(el) => {
                          canvasRefs.current[index] = el
                        }}
                        className="block"
                      />
                    ) : fileType === 'image' && imageUrl && imageDimensions ? (
                      <img
                        src={imageUrl}
                        alt="Document"
                        style={{
                          width: pageWidth,
                          height: pageHeight,
                          display: 'block',
                          objectFit: 'fill',
                          pointerEvents: 'none',
                        }}
                        draggable={false}
                      />
                    ) : null}

                    {/* Fields overlay for this page - only show when document is ready */}
                    {pdfRendered && (
                      <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
                        {fieldsOnPage.map(field => (
                          <DraggableFieldOnDocument
                            key={field.id}
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
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Loading/Debug state */}
              {totalPages === 0 && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
                  <p className="text-gray-400 text-sm">Loading document...</p>
                  <p className="text-gray-500 text-xs mt-2">
                    File type: {fileType} | URL: {document?.file_url ? 'Yes' : 'No'}
                  </p>
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
