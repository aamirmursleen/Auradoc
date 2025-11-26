'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react'

interface PDFViewerProps {
  file: File
  zoom: number
  onPageClick?: (e: React.MouseEvent<HTMLDivElement>, pageNumber: number) => void
  signatureOverlay?: React.ReactNode
  onPageRendered?: (imageUrl: string) => void
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  zoom,
  onPageClick,
  signatureOverlay,
  onPageRendered
}) => {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageImageUrl, setPageImageUrl] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pdfDocRef = useRef<any>(null)

  // Load PDF.js library and document
  useEffect(() => {
    let isMounted = true

    const loadPdf = async () => {
      try {
        setLoading(true)
        setError(null)

        // Dynamically import pdfjs-dist
        const pdfjsLib = await import('pdfjs-dist')

        // Set worker from CDN
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()

        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
        const pdf = await loadingTask.promise

        if (!isMounted) return

        pdfDocRef.current = pdf
        setNumPages(pdf.numPages)
        setCurrentPage(1)

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
  }, [file])

  // Render current page
  useEffect(() => {
    let isMounted = true

    const renderPage = async () => {
      if (!pdfDocRef.current) return

      try {
        setLoading(true)

        const page = await pdfDocRef.current.getPage(currentPage)

        // Get viewport at scale 1.5 for good quality
        const scale = 1.5
        const viewport = page.getViewport({ scale })

        // Create offscreen canvas
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        if (!context) {
          throw new Error('Could not get canvas context')
        }

        // Set canvas dimensions
        canvas.width = viewport.width
        canvas.height = viewport.height

        // Render PDF page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        }

        await page.render(renderContext).promise

        if (!isMounted) return

        // Convert canvas to image URL
        const imageUrl = canvas.toDataURL('image/png')
        setPageImageUrl(imageUrl)
        setPageSize({ width: viewport.width / scale, height: viewport.height / scale })
        setLoading(false)

        // Call callback with rendered image
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
  }, [currentPage, numPages, onPageRendered])

  const goToPrevPage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const goToNextPage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentPage(prev => Math.min(numPages, prev + 1))
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onPageClick) {
      onPageClick(e, currentPage)
    }
  }

  if (loading && !pageImageUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-gray-100 rounded-xl">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
        <p className="text-gray-600">Loading PDF...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-red-50 rounded-xl">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* PDF Container */}
      <div
        ref={containerRef}
        className="relative bg-gray-300 overflow-auto flex justify-center p-4"
        style={{ maxHeight: '600px' }}
        onClick={handleClick}
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
