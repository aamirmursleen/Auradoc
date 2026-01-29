'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Droplets, Upload, Download, Loader2, FileText, CheckCircle, ArrowRight, X, Zap, Shield, Clock, Eye, Type, Image, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import { useTheme } from '@/components/ThemeProvider'

// Set worker source
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

export default function WatermarkPDFPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)

  // Preview states
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewPages, setPreviewPages] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(0)

  // Watermark type
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text')

  // Page selection for watermark
  const [pageSelection, setPageSelection] = useState<'all' | 'custom'>('all')
  const [selectedPages, setSelectedPages] = useState<string>('') // e.g., "1,3,5" or "1-5"

  // Text Watermark options
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL')
  const [fontSize, setFontSize] = useState(60)
  const [opacity, setOpacity] = useState(0.3)
  const [rotation, setRotation] = useState(-45)
  const [color, setColor] = useState('#ff0000')
  const [position, setPosition] = useState<'center' | 'tile' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom'>('center')

  // Custom position for draggable watermark (percentage based)
  const [customX, setCustomX] = useState(50) // percentage from left
  const [customY, setCustomY] = useState(50) // percentage from top
  const [isDraggingWatermark, setIsDraggingWatermark] = useState(false)
  const [isResizingWatermark, setIsResizingWatermark] = useState(false)
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
  const [startFontSize, setStartFontSize] = useState(60)

  // Image Watermark options
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null)
  const [imageOpacity, setImageOpacity] = useState(0.3)
  const [imageScale, setImageScale] = useState(0.3)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const droppedFile = Array.from(e.dataTransfer.files).find(
      file => file.type === 'application/pdf'
    )
    if (droppedFile) {
      setFile(droppedFile)
      setPdfBlob(null)
      setPreviewPages([])
      loadPdfPreview(droppedFile)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setPdfBlob(null)
      setPreviewPages([])
      loadPdfPreview(selectedFile)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setWatermarkImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Parse page selection string like "1,3,5" or "1-5" or "1,3-5,7"
  const parsePageSelection = (input: string, totalPages: number): number[] => {
    if (!input.trim()) return []

    const pages = new Set<number>()
    const parts = input.split(',').map(p => p.trim())

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()))
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
            pages.add(i)
          }
        }
      } else {
        const num = parseInt(part)
        if (!isNaN(num) && num >= 1 && num <= totalPages) {
          pages.add(num)
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b)
  }

  // Render PDF pages to images using pdfjs-dist - ALL PAGES in one scroll
  const loadPdfPreview = async (pdfFile: File) => {
    setPreviewLoading(true)
    try {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages
      setTotalPages(numPages)

      const pages: string[] = []

      // Render ALL pages
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const scale = 1.5
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise

        pages.push(canvas.toDataURL('image/png'))
      }

      setPreviewPages(pages)
    } catch (error) {
      console.error('Error loading PDF preview:', error)
    } finally {
      setPreviewLoading(false)
    }
  }

  // Render watermarked PDF to preview - ALL PAGES
  const renderWatermarkedPreview = async (pdfBytes: Uint8Array) => {
    setPreviewLoading(true)
    try {
      const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise
      const numPages = pdf.numPages
      setTotalPages(numPages)

      const pages: string[] = []

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const scale = 1.5
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise

        pages.push(canvas.toDataURL('image/png'))
      }

      setPreviewPages(pages)
    } catch (error) {
      console.error('Error rendering watermarked preview:', error)
    } finally {
      setPreviewLoading(false)
    }
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 1, g: 0, b: 0 }
  }

  // Generate preview with watermark
  const generatePreview = async () => {
    if (!file) return
    if (watermarkType === 'text' && !watermarkText.trim()) return
    if (watermarkType === 'image' && !watermarkImage) return

    setPreviewLoading(true)

    try {
      const pdfBytes = await applyWatermark()
      if (!pdfBytes) return

      // Store blob for download
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
      setPdfBlob(blob)

      // Render watermarked pages to preview
      await renderWatermarkedPreview(pdfBytes)
    } catch (error) {
      console.error('Error generating preview:', error)
      alert('Error generating preview. Please try again.')
    } finally {
      setPreviewLoading(false)
    }
  }

  // Apply watermark to PDF (with page selection support)
  const applyWatermark = async (): Promise<Uint8Array | null> => {
    if (!file) return null

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pages = pdf.getPages()

      // Determine which pages to watermark
      let pagesToWatermark: number[] = []
      if (pageSelection === 'all') {
        pagesToWatermark = pages.map((_, i) => i + 1) // All pages (1-indexed)
      } else {
        pagesToWatermark = parsePageSelection(selectedPages, pages.length)
      }

      if (watermarkType === 'text') {
        const font = await pdf.embedFont(StandardFonts.HelveticaBold)
        const { r, g, b } = hexToRgb(color)

        for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
          // Skip if this page is not in the selection
          if (!pagesToWatermark.includes(pageIndex + 1)) continue

          const page = pages[pageIndex]
          const { width, height } = page.getSize()

          if (position === 'center') {
            const textWidth = font.widthOfTextAtSize(watermarkText, fontSize)
            page.drawText(watermarkText, {
              x: (width - textWidth) / 2,
              y: height / 2,
              size: fontSize,
              font,
              color: rgb(r, g, b),
              opacity: opacity,
              rotate: degrees(rotation),
            })
          } else if (position === 'tile') {
            const textWidth = font.widthOfTextAtSize(watermarkText, fontSize)
            const spacing = Math.max(textWidth + 100, 250)

            for (let x = -spacing; x < width + spacing; x += spacing) {
              for (let y = -spacing; y < height + spacing; y += spacing) {
                page.drawText(watermarkText, {
                  x,
                  y,
                  size: fontSize,
                  font,
                  color: rgb(r, g, b),
                  opacity: opacity,
                  rotate: degrees(rotation),
                })
              }
            }
          } else if (position === 'custom') {
            // Custom position from drag (percentage-based)
            const textWidth = font.widthOfTextAtSize(watermarkText, fontSize)
            // Convert percentage to PDF coordinates
            // Note: PDF coordinates have origin at bottom-left
            const x = (customX / 100) * width - textWidth / 2
            const y = height - (customY / 100) * height - fontSize / 2

            page.drawText(watermarkText, {
              x: Math.max(0, x),
              y: Math.max(0, Math.min(height - fontSize, y)),
              size: fontSize,
              font,
              color: rgb(r, g, b),
              opacity: opacity,
              rotate: degrees(rotation),
            })
          } else {
            // Corner positions
            const textWidth = font.widthOfTextAtSize(watermarkText, fontSize)
            const padding = 30
            let x = padding
            let y = padding

            if (position === 'top-left') {
              x = padding
              y = height - padding - fontSize
            } else if (position === 'top-right') {
              x = width - textWidth - padding
              y = height - padding - fontSize
            } else if (position === 'bottom-left') {
              x = padding
              y = padding
            } else if (position === 'bottom-right') {
              x = width - textWidth - padding
              y = padding
            }

            page.drawText(watermarkText, {
              x,
              y,
              size: fontSize,
              font,
              color: rgb(r, g, b),
              opacity: opacity,
              rotate: degrees(0), // No rotation for corner positions
            })
          }
        }
      } else if (watermarkType === 'image' && watermarkImage) {
        // Image watermark
        const imageBytes = await fetch(watermarkImage).then(res => res.arrayBuffer())
        let embeddedImage

        if (watermarkImage.includes('image/png')) {
          embeddedImage = await pdf.embedPng(imageBytes)
        } else {
          embeddedImage = await pdf.embedJpg(imageBytes)
        }

        const imgDims = embeddedImage.scale(imageScale)

        for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
          // Skip if this page is not in the selection
          if (!pagesToWatermark.includes(pageIndex + 1)) continue

          const page = pages[pageIndex]
          const { width, height } = page.getSize()
          const x = (width - imgDims.width) / 2
          const y = (height - imgDims.height) / 2

          page.drawImage(embeddedImage, {
            x,
            y,
            width: imgDims.width,
            height: imgDims.height,
            opacity: imageOpacity,
          })
        }
      }

      return await pdf.save()
    } catch (error) {
      console.error('Error applying watermark:', error)
      return null
    }
  }

  // Remove watermark (reset to original)
  const removeWatermark = async () => {
    if (!file) return
    setPdfBlob(null)
    // Reload original file preview
    await loadPdfPreview(file)
  }

  // Download watermarked PDF
  const downloadPDF = async () => {
    if (!file) return

    setProcessing(true)
    try {
      let blob = pdfBlob

      if (!blob) {
        const pdfBytes = await applyWatermark()
        if (pdfBytes) {
          blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
          setPdfBlob(blob)
        }
      }

      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `watermarked-${file.name}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error downloading:', error)
      alert('Error downloading PDF')
    } finally {
      setProcessing(false)
    }
  }

  const clearAll = () => {
    setFile(null)
    setPdfBlob(null)
    setPreviewPages([])
    setTotalPages(0)
    setWatermarkImage(null)
    setPageSelection('all')
    setSelectedPages('')
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  const presetTexts = ['CONFIDENTIAL', 'DRAFT', 'SAMPLE', 'COPY', 'DO NOT COPY', 'PRIVATE', 'APPROVED', 'VOID']

  // Watermark drag handlers for custom positioning
  const handleWatermarkDragStart = (e: React.MouseEvent, containerRect: DOMRect) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingWatermark(true)
    setIsResizingWatermark(false)
    setDragStartPos({ x: e.clientX, y: e.clientY })
    setPosition('custom')
  }

  const handleWatermarkResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizingWatermark(true)
    setIsDraggingWatermark(false)
    setDragStartPos({ x: e.clientX, y: e.clientY })
    setStartFontSize(fontSize)
    setPosition('custom')
  }

  const handleWatermarkMouseMove = (e: React.MouseEvent, containerRect: DOMRect) => {
    if (isDraggingWatermark) {
      const deltaX = e.clientX - dragStartPos.x
      const deltaY = e.clientY - dragStartPos.y

      const newX = Math.max(5, Math.min(95, customX + (deltaX / containerRect.width) * 100))
      const newY = Math.max(5, Math.min(95, customY + (deltaY / containerRect.height) * 100))

      setCustomX(newX)
      setCustomY(newY)
      setDragStartPos({ x: e.clientX, y: e.clientY })
    }

    if (isResizingWatermark) {
      const deltaX = e.clientX - dragStartPos.x
      const newSize = Math.max(20, Math.min(150, startFontSize + deltaX * 0.5))
      setFontSize(Math.round(newSize))
    }
  }

  const handleWatermarkDragEnd = () => {
    setIsDraggingWatermark(false)
    setIsResizingWatermark(false)
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'} px-4 py-2 rounded-full text-sm font-medium mb-4`}>
              <Droplets className="w-4 h-4" />
              Free PDF Tool
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-2`}>
              Watermark PDF
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-2xl mx-auto`}>
              Add or remove custom text/image watermarks to your PDF documents.
            </p>
          </div>

          {/* Main Content */}
          {!file ? (
            /* Upload Area */
            <div
              className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-12 transition-all ${
                dragActive
                  ? `${isDark ? 'border-[#c4ff0e]' : 'border-[#4C00FF]'} ${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'}`
                  : `${isDark ? 'border-[#3a3a3a]' : 'border-gray-300'} ${isDark ? 'hover:border-[#c4ff0e]' : 'hover:border-[#4C00FF]'} ${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-50'}`
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className={`w-16 h-16 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Upload className={`w-8 h-8 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                </div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-2`}>
                  Drop your PDF here
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>or click to browse</p>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className={`inline-flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#d4ff3e]' : 'bg-[#4C00FF] text-white hover:bg-[#3a00cc]'} font-medium rounded-lg cursor-pointer transition-colors`}
                >
                  <Upload className="w-5 h-5" />
                  Select PDF File
                </label>
              </div>
            </div>
          ) : (
            /* Editor Layout */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel - Settings */}
              <div className="lg:col-span-1 space-y-4">
                {/* File Info */}
                <div className={`${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'} rounded-xl p-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} rounded flex items-center justify-center`}>
                      <FileText className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#26065D]'} truncate`}>{file.name}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatSize(file.size)} • {totalPages} page{totalPages !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                      onClick={clearAll}
                      className={`p-2 hover:bg-red-900/20 rounded ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:text-red-400`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Watermark Type Toggle */}
                <div className={`${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'} rounded-xl p-4`}>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                    Watermark Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setWatermarkType('text')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        watermarkType === 'text'
                          ? `${isDark ? 'border-[#c4ff0e] bg-[#2a2a2a] text-[#c4ff0e]' : 'border-[#4C00FF] bg-[#EDE5FF] text-[#4C00FF]'}`
                          : `${isDark ? 'border-[#3a3a3a] text-gray-400 hover:border-[#4a4a4a]' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`
                      }`}
                    >
                      <Type className="w-5 h-5" />
                      Text
                    </button>
                    <button
                      onClick={() => setWatermarkType('image')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        watermarkType === 'image'
                          ? `${isDark ? 'border-[#c4ff0e] bg-[#2a2a2a] text-[#c4ff0e]' : 'border-[#4C00FF] bg-[#EDE5FF] text-[#4C00FF]'}`
                          : `${isDark ? 'border-[#3a3a3a] text-gray-400 hover:border-[#4a4a4a]' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`
                      }`}
                    >
                      <Image className="w-5 h-5" />
                      Image
                    </button>
                  </div>
                </div>

                {/* Page Selection */}
                <div className={`${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'} rounded-xl p-4`}>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                    Apply Watermark To
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPageSelection('all')}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          pageSelection === 'all'
                            ? `${isDark ? 'border-[#c4ff0e] bg-[#2a2a2a] text-[#c4ff0e]' : 'border-[#4C00FF] bg-[#EDE5FF] text-[#4C00FF]'}`
                            : `${isDark ? 'border-[#3a3a3a] text-gray-400 hover:border-[#4a4a4a]' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`
                        }`}
                      >
                        All Pages
                      </button>
                      <button
                        onClick={() => setPageSelection('custom')}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          pageSelection === 'custom'
                            ? `${isDark ? 'border-[#c4ff0e] bg-[#2a2a2a] text-[#c4ff0e]' : 'border-[#4C00FF] bg-[#EDE5FF] text-[#4C00FF]'}`
                            : `${isDark ? 'border-[#3a3a3a] text-gray-400 hover:border-[#4a4a4a]' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`
                        }`}
                      >
                        Custom Pages
                      </button>
                    </div>
                    {pageSelection === 'custom' && (
                      <div>
                        <input
                          type="text"
                          value={selectedPages}
                          onChange={(e) => setSelectedPages(e.target.value)}
                          placeholder="e.g., 1,3,5 or 1-5 or 1,3-5,7"
                          className={`w-full px-3 py-2 ${isDark ? 'bg-[#1e1e1e] border-[#3a3a3a] text-white' : 'bg-gray-50 border-gray-300 text-[#26065D]'} border rounded-lg text-sm focus:ring-2 ${isDark ? 'focus:ring-[#c4ff0e] focus:border-[#c4ff0e]' : 'focus:ring-[#4C00FF] focus:border-[#4C00FF]'}`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Total: {totalPages} pages
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Watermark Settings */}
                {watermarkType === 'text' && (
                  <div className={`${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'} rounded-xl p-4 space-y-4`}>
                    {/* Watermark Text */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                        Watermark Text
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className={`w-full px-3 py-2 ${isDark ? 'bg-[#1e1e1e] border-[#3a3a3a] text-white' : 'bg-gray-50 border-gray-300 text-[#26065D]'} border rounded-lg focus:ring-2 ${isDark ? 'focus:ring-[#c4ff0e] focus:border-[#c4ff0e]' : 'focus:ring-[#4C00FF] focus:border-[#4C00FF]'}`}
                        placeholder="Enter watermark text"
                      />
                      <div className="flex flex-wrap gap-1 mt-2">
                        {presetTexts.map(text => (
                          <button
                            key={text}
                            onClick={() => setWatermarkText(text)}
                            className={`px-2 py-1 text-xs rounded border transition-colors ${
                              watermarkText === text
                                ? `${isDark ? 'border-[#c4ff0e] bg-[#2a2a2a] text-[#c4ff0e]' : 'border-[#4C00FF] bg-[#EDE5FF] text-[#4C00FF]'}`
                                : `${isDark ? 'border-[#3a3a3a] hover:border-[#4a4a4a] text-gray-400' : 'border-gray-300 hover:border-gray-400 text-gray-500'}`
                            }`}
                          >
                            {text}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Position */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                        Position
                      </label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {[
                          { id: 'top-left', label: '↖' },
                          { id: 'center', label: '⊕' },
                          { id: 'top-right', label: '↗' },
                          { id: 'bottom-left', label: '↙' },
                          { id: 'tile', label: '⊞' },
                          { id: 'bottom-right', label: '↘' },
                        ].map(pos => (
                          <button
                            key={pos.id}
                            onClick={() => setPosition(pos.id as any)}
                            className={`px-3 py-2 rounded-lg border-2 text-lg transition-all ${
                              position === pos.id
                                ? `${isDark ? 'border-[#c4ff0e] bg-[#2a2a2a] text-[#c4ff0e]' : 'border-[#4C00FF] bg-[#EDE5FF] text-[#4C00FF]'}`
                                : `${isDark ? 'border-[#3a3a3a] text-gray-400 hover:border-[#4a4a4a]' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                      {/* Custom drag option */}
                      <button
                        onClick={() => setPosition('custom')}
                        className={`w-full px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          position === 'custom'
                            ? `${isDark ? 'border-[#c4ff0e] bg-[#2a2a2a] text-[#c4ff0e]' : 'border-[#4C00FF] bg-[#EDE5FF] text-[#4C00FF]'}`
                            : `${isDark ? 'border-[#3a3a3a] text-gray-400 hover:border-[#4a4a4a]' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`
                        }`}
                      >
                        ✋ Drag to Position (Custom)
                      </button>
                      {position === 'custom' && (
                        <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          Drag the watermark text on the preview to position it
                        </p>
                      )}
                    </div>

                    {/* Font Size */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                        Font Size: {fontSize}px
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="150"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className={`w-full h-2 ${isDark ? 'bg-[#3a3a3a]' : 'bg-gray-200'} rounded-lg appearance-none cursor-pointer ${isDark ? 'accent-[#c4ff0e]' : 'accent-[#4C00FF]'}`}
                      />
                    </div>

                    {/* Opacity */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                        Opacity: {Math.round(opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={opacity * 100}
                        onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
                        className={`w-full h-2 ${isDark ? 'bg-[#3a3a3a]' : 'bg-gray-200'} rounded-lg appearance-none cursor-pointer ${isDark ? 'accent-[#c4ff0e]' : 'accent-[#4C00FF]'}`}
                      />
                    </div>

                    {/* Rotation */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                        Rotation: {rotation}°
                      </label>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className={`w-full h-2 ${isDark ? 'bg-[#3a3a3a]' : 'bg-gray-200'} rounded-lg appearance-none cursor-pointer ${isDark ? 'accent-[#c4ff0e]' : 'accent-[#4C00FF]'}`}
                      />
                    </div>

                    {/* Color */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                        Color
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className={`w-10 h-10 rounded cursor-pointer border ${isDark ? 'border-[#3a3a3a]' : 'border-gray-300'}`}
                        />
                        <div className="flex gap-1">
                          {['#ff0000', '#0000ff', '#808080', '#000000', '#008000'].map(c => (
                            <button
                              key={c}
                              onClick={() => setColor(c)}
                              className={`w-8 h-8 rounded border-2 ${color === c ? (isDark ? 'border-[#c4ff0e]' : 'border-[#4C00FF]') : (isDark ? 'border-[#3a3a3a]' : 'border-gray-300')}`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Watermark Settings */}
                {watermarkType === 'image' && (
                  <div className={`${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'} rounded-xl p-4 space-y-4`}>
                    {/* Image Upload */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                        Watermark Image
                      </label>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {watermarkImage ? (
                        <div className="relative">
                          <img
                            src={watermarkImage}
                            alt="Watermark"
                            className={`w-full h-32 object-contain ${isDark ? 'bg-[#1e1e1e] border-[#3a3a3a]' : 'bg-gray-50 border-gray-300'} rounded-lg border`}
                          />
                          <button
                            onClick={() => setWatermarkImage(null)}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => imageInputRef.current?.click()}
                          className={`w-full py-8 border-2 border-dashed ${isDark ? 'border-[#3a3a3a] text-gray-400 hover:border-[#c4ff0e] hover:text-[#c4ff0e]' : 'border-gray-300 text-gray-500 hover:border-[#4C00FF] hover:text-[#4C00FF]'} rounded-lg transition-colors`}
                        >
                          <Image className="w-8 h-8 mx-auto mb-2" />
                          <span>Click to upload image</span>
                        </button>
                      )}
                    </div>

                    {/* Image Opacity */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                        Opacity: {Math.round(imageOpacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={imageOpacity * 100}
                        onChange={(e) => setImageOpacity(parseInt(e.target.value) / 100)}
                        className={`w-full h-2 ${isDark ? 'bg-[#3a3a3a]' : 'bg-gray-200'} rounded-lg appearance-none cursor-pointer ${isDark ? 'accent-[#c4ff0e]' : 'accent-[#4C00FF]'}`}
                      />
                    </div>

                    {/* Image Scale */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                        Size: {Math.round(imageScale * 100)}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={imageScale * 100}
                        onChange={(e) => setImageScale(parseInt(e.target.value) / 100)}
                        className={`w-full h-2 ${isDark ? 'bg-[#3a3a3a]' : 'bg-gray-200'} rounded-lg appearance-none cursor-pointer ${isDark ? 'accent-[#c4ff0e]' : 'accent-[#4C00FF]'}`}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={generatePreview}
                    disabled={previewLoading || (watermarkType === 'text' && !watermarkText.trim()) || (watermarkType === 'image' && !watermarkImage)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${isDark ? 'bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white' : 'bg-gray-200 hover:bg-gray-300 text-[#26065D]'} font-medium rounded-lg transition-colors disabled:opacity-50`}
                  >
                    {previewLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5" />
                        Preview Your File
                      </>
                    )}
                  </button>

                  <button
                    onClick={downloadPDF}
                    disabled={processing || (watermarkType === 'text' && !watermarkText.trim()) || (watermarkType === 'image' && !watermarkImage)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${isDark ? 'bg-[#c4ff0e] hover:bg-[#d4ff3e] text-black' : 'bg-[#4C00FF] hover:bg-[#3a00cc] text-white'} font-medium rounded-lg transition-colors disabled:opacity-50`}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download Your File
                      </>
                    )}
                  </button>

                  {pdfBlob && (
                    <button
                      onClick={removeWatermark}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                      Remove Watermark
                    </button>
                  )}
                </div>
              </div>

              {/* Right Panel - Preview */}
              <div className={`lg:col-span-2 ${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'} rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#26065D]'} flex items-center gap-2`}>
                    <Eye className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                    Preview
                  </h3>
                  <div className="flex items-center gap-2">
                    {pdfBlob && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        Watermark Applied
                      </span>
                    )}
                  </div>
                </div>

                <div className={`${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'} rounded-lg overflow-hidden`} style={{ minHeight: '500px' }}>
                  {previewLoading ? (
                    <div className="flex items-center justify-center h-[500px]">
                      <div className="text-center">
                        <Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'} mx-auto mb-4`} />
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading preview...</p>
                      </div>
                    </div>
                  ) : previewPages.length > 0 ? (
                    <div className="flex flex-col">
                      {/* Page Count Header */}
                      <div className={`flex items-center justify-center gap-4 py-3 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-[#EDE5FF] border-gray-200'} border-b`}>
                        <span className={`${isDark ? 'text-white' : 'text-[#26065D]'} text-sm`}>
                          {previewPages.length} Page{previewPages.length !== 1 ? 's' : ''} • Scroll to view all
                        </span>
                      </div>

                      {/* All Pages Display - Continuous Scroll */}
                      <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: '600px' }}>
                        {previewPages.map((pageImg, index) => (
                          <div
                            key={index}
                            className="relative"
                            onMouseMove={(e) => {
                              if (position === 'custom' && (isDraggingWatermark || isResizingWatermark)) {
                                const rect = e.currentTarget.getBoundingClientRect()
                                handleWatermarkMouseMove(e, rect)
                              }
                            }}
                            onMouseUp={handleWatermarkDragEnd}
                            onMouseLeave={handleWatermarkDragEnd}
                          >
                            {/* Page number badge */}
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
                              Page {index + 1}
                            </div>
                            <img
                              src={pageImg}
                              alt={`Page ${index + 1}`}
                              className={`w-full object-contain shadow-xl rounded border ${isDark ? 'border-[#3a3a3a]' : 'border-gray-300'}`}
                            />
                            {/* Draggable & Resizable Watermark Overlay - for custom position & text mode */}
                            {watermarkType === 'text' && position === 'custom' && (
                              <div
                                className="absolute cursor-move select-none z-10 group"
                                style={{
                                  left: `${customX}%`,
                                  top: `${customY}%`,
                                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                                  fontSize: `${fontSize * 0.5}px`,
                                  color: color,
                                  opacity: Math.max(opacity, 0.5), // Make it more visible for dragging
                                  fontWeight: 'bold',
                                  textShadow: '0 0 10px rgba(255,255,255,0.8)',
                                  whiteSpace: 'nowrap',
                                  border: '2px dashed rgba(0,100,255,0.5)',
                                  padding: '8px 16px',
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(255,255,255,0.1)'
                                }}
                                onMouseDown={(e) => {
                                  const rect = e.currentTarget.parentElement?.getBoundingClientRect()
                                  if (rect) handleWatermarkDragStart(e, rect)
                                }}
                              >
                                {watermarkText}
                                {/* Resize handle - bottom right corner */}
                                <div
                                  className="absolute -bottom-3 -right-3 w-6 h-6 bg-blue-500 rounded-full cursor-se-resize flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
                                  onMouseDown={handleWatermarkResizeStart}
                                  title="Drag to resize"
                                >
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                  </svg>
                                </div>
                                {/* Info tooltip */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                  Drag to move • Corner to resize
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[500px] text-center text-gray-500">
                      <div>
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Upload a PDF to see preview</p>
                      </div>
                    </div>
                  )}
                </div>

                {pdfBlob && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Watermark applied! Click "Download Your File" to save.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-12 px-4 ${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl font-bold text-center ${isDark ? 'text-white' : 'text-[#26065D]'} mb-8`}>
            Why Use Our PDF Watermark Tool?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Instant Processing', desc: 'Add watermarks instantly in your browser' },
              { icon: Shield, title: '100% Private', desc: 'Files never leave your device' },
              { icon: Clock, title: 'No Limits', desc: 'Watermark any PDF regardless of size' },
            ].map((feature, idx) => (
              <div key={idx} className={`text-center p-6 rounded-xl ${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'}`}>
                <div className={`w-12 h-12 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`w-6 h-6 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                </div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-2`}>{feature.title}</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-12 px-4 ${isDark ? 'bg-[#252525]' : 'bg-white border-t border-gray-200'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-4`}>
            Need More PDF Tools?
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-500'} mb-6`}>
            Explore our complete suite of free PDF tools
          </p>
          <Link
            href="/tools"
            className={`inline-flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-[#1F1F1F] text-[#c4ff0e]' : 'bg-[#EDE5FF] text-[#4C00FF]'} font-medium rounded-lg hover:shadow-lg transition-all`}
          >
            View All Tools
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
