'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface PDFViewerProps {
  file: File
  zoom: number
  onPageClick?: (e: React.MouseEvent<HTMLDivElement>, pageNumber: number, pageBaseWidth: number, pageBaseHeight: number) => void
  signatureOverlay?: React.ReactNode
  onPageRendered?: (imageUrl: string) => void
  continuousScroll?: boolean
  onTotalPagesChange?: (totalPages: number) => void
  onCurrentPageChange?: (currentPage: number) => void
  renderFieldsForPage?: (pageNumber: number, pageWidth: number, pageHeight: number) => React.ReactNode
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  zoom,
  onPageClick,
  signatureOverlay,
  onPageRendered,
  continuousScroll = false,
  onTotalPagesChange,
  onCurrentPageChange,
  renderFieldsForPage
}) => {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageImageUrl, setPageImageUrl] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 })

  // For continuous scroll mode
  const [allPages, setAllPages] = useState<{ url: string; width: number; height: number }[]>([])
  const [pagesLoading, setPagesLoading] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null)

  // Load PDF document
  useEffect(() => {
    let isMounted = true

    const loadPdf = async () => {
      try {
        setLoading(true)
        setPagesLoading(true)
        setError(null)

        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()

        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
        const pdf = await loadingTask.promise

        if (!isMounted) return

        pdfDocRef.current = pdf
        setNumPages(pdf.numPages)
        setCurrentPage(1)

        if (onTotalPagesChange) {
          onTotalPagesChange(pdf.numPages)
        }

        if (continuousScroll) {
          // Render all pages for continuous scroll
          await renderAllPages(pdf, isMounted)
        }

      } catch (err) {
        console.error('PDF load error:', err)
        if (isMounted) {
          setError('Failed to load PDF. Please try another file.')
        }
      }
    }

    loadPdf()

    return () => {
      isMounted = false
    }
  }, [file, continuousScroll])

  // Render all pages for continuous scroll mode
  const renderAllPages = async (pdf: pdfjsLib.PDFDocumentProxy, isMounted: boolean) => {
    const pages: { url: string; width: number; height: number }[] = []
    const scale = 1.5

    for (let i = 1; i <= pdf.numPages; i++) {
      if (!isMounted) return

      try {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        if (!context) continue

        canvas.width = viewport.width
        canvas.height = viewport.height

        // Reset transforms and clear canvas
        context.setTransform(1, 0, 0, 1, 0, 0)
        context.clearRect(0, 0, canvas.width, canvas.height)

        // Fill with white background before rendering
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)

        await page.render({
          canvasContext: context,
          viewport: viewport,
          background: 'white'
        }).promise

        const imageUrl = canvas.toDataURL('image/png')
        const pageWidth = viewport.width / scale
        const pageHeight = viewport.height / scale
        console.log(`PDFViewer page ${i}: naturalWidth=${pageWidth}, naturalHeight=${pageHeight}, viewportWidth=${viewport.width}, scale=${scale}`)
        pages.push({
          url: imageUrl,
          width: pageWidth,
          height: pageHeight
        })
      } catch (err) {
        console.error(`Error rendering page ${i}:`, err)
      }
    }

    if (isMounted) {
      setAllPages(pages)
      setPagesLoading(false)
      setLoading(false)
    }
  }

  // Render single page (for paginated mode)
  useEffect(() => {
    if (continuousScroll) return // Skip for continuous scroll mode

    let isMounted = true

    const renderPage = async () => {
      if (!pdfDocRef.current) return

      try {
        setLoading(true)

        const page = await pdfDocRef.current.getPage(currentPage)
        const scale = 1.5
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        if (!context) {
          throw new Error('Could not get canvas context')
        }

        canvas.width = viewport.width
        canvas.height = viewport.height

        // Reset transforms and clear canvas
        context.setTransform(1, 0, 0, 1, 0, 0)
        context.clearRect(0, 0, canvas.width, canvas.height)

        // Fill with white background
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)

        await page.render({
          canvasContext: context,
          viewport: viewport,
          background: 'white'
        }).promise

        if (!isMounted) return

        const imageUrl = canvas.toDataURL('image/png')
        setPageImageUrl(imageUrl)
        setPageSize({ width: viewport.width / scale, height: viewport.height / scale })
        setLoading(false)

        if (onPageRendered) {
          onPageRendered(imageUrl)
        }

      } catch (err) {
        console.error('Page render error:', err)
        if (isMounted) {
          setError('Failed to render page.')
          setLoading(false)
        }
      }
    }

    if (pdfDocRef.current) {
      renderPage()
    }

    return () => {
      isMounted = false
    }
  }, [currentPage, numPages, onPageRendered, continuousScroll])

  const goToPrevPage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newPage = Math.max(1, currentPage - 1)
    setCurrentPage(newPage)
    if (onCurrentPageChange) onCurrentPageChange(newPage)
  }

  const goToNextPage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newPage = Math.min(numPages, currentPage + 1)
    setCurrentPage(newPage)
    if (onCurrentPageChange) onCurrentPageChange(newPage)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, pageNum?: number) => {
    if (onPageClick) {
      // Pass page dimensions for coordinate calculations
      onPageClick(e, pageNum || currentPage, pageSize.width, pageSize.height)
    }
  }

  // Loading state
  if (loading && !pageImageUrl && allPages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[500px] bg-gray-100 rounded-xl">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
        <p className="text-gray-600">Loading PDF...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[500px] bg-red-50 rounded-xl">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    )
  }

  // Continuous Scroll Mode
  if (continuousScroll) {
    return (
      <div className="flex flex-col">
        <div
          ref={containerRef}
          className="flex flex-col gap-6"
        >
            {pagesLoading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
              </div>
            ) : (
              allPages.map((page, index) => {
                const pageNum = index + 1
                return (
                  <div key={pageNum} className="relative w-fit mx-auto">
                    {/* Page number label - outside the clickable area */}
                    <div className="text-xs text-gray-500 font-medium mb-1.5">
                      Page {pageNum}
                    </div>
                    {/* Page container with precise dimensions */}
                    <div
                      className="relative bg-white shadow-xl"
                      data-pdf-page="true"
                      data-page-number={pageNum}
                      style={{
                        width: page.width * zoom,
                        height: page.height * zoom,
                      }}
                      onClick={(e) => {
                        // Pass exact page dimensions to ensure consistent coordinate calculations
                        if (onPageClick) {
                          onPageClick(e, pageNum, page.width, page.height)
                        }
                      }}
                    >
                      {/* Page image */}
                      <img
                        src={page.url}
                        alt={`Page ${pageNum}`}
                        className="w-full h-full"
                        style={{ display: 'block' }}
                        draggable={false}
                      />

                      {/* Fields overlay - NO pointer-events-none so fields can be touched/dragged */}
                      {renderFieldsForPage && (
                        <div className="absolute inset-0 overflow-visible">
                          {renderFieldsForPage(pageNum, page.width * zoom, page.height * zoom)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
        </div>
      </div>
    )
  }

  // Paginated Mode (original behavior)
  return (
    <div className="flex flex-col">
      {/* PDF Container */}
      <div
        ref={containerRef}
        className="relative bg-gray-300 overflow-auto flex justify-center p-2 md:p-4"
        style={{ minHeight: 'min(300px, 60vh)', maxHeight: 'calc(100vh - 120px)' }}
        onClick={(e) => handleClick(e)}
      >
        <div
          className="relative inline-block"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            cursor: 'crosshair'
          }}
        >
          {pageImageUrl && (
            <img
              src={pageImageUrl}
              alt={`Page ${currentPage}`}
              className="shadow-lg bg-white"
              style={{
                width: pageSize.width,
                height: pageSize.height,
                display: 'block'
              }}
              draggable={false}
            />
          )}

          {/* Signature Overlay */}
          {signatureOverlay}
        </div>
      </div>

      {/* Page Navigation */}
      {numPages > 1 && (
        <div className="flex items-center justify-center gap-4 p-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {numPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Loading indicator for page changes */}
      {loading && pageImageUrl && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      )}
    </div>
  )
}

export default PDFViewer
