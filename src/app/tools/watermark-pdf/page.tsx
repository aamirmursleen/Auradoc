'use client'

import React, { useState, useCallback } from 'react'
import { Droplets, Upload, Download, Loader2, FileText, CheckCircle, ArrowRight, X, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib'

export default function WatermarkPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)

  // Watermark options
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL')
  const [fontSize, setFontSize] = useState(60)
  const [opacity, setOpacity] = useState(0.3)
  const [rotation, setRotation] = useState(-45)
  const [color, setColor] = useState('#ff0000')
  const [position, setPosition] = useState<'center' | 'tile'>('center')

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
      setProcessed(false)
      setPdfBlob(null)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setProcessed(false)
      setPdfBlob(null)
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

  const handleWatermark = async () => {
    if (!file || !watermarkText.trim()) return
    setProcessing(true)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pages = pdf.getPages()
      const font = await pdf.embedFont(StandardFonts.HelveticaBold)

      const { r, g, b } = hexToRgb(color)

      for (const page of pages) {
        const { width, height } = page.getSize()

        if (position === 'center') {
          // Single centered watermark
          const textWidth = font.widthOfTextAtSize(watermarkText, fontSize)
          const textHeight = fontSize

          page.drawText(watermarkText, {
            x: (width - textWidth) / 2,
            y: (height - textHeight) / 2,
            size: fontSize,
            font,
            color: rgb(r, g, b),
            opacity: opacity,
            rotate: degrees(rotation),
          })
        } else {
          // Tiled watermarks
          const textWidth = font.widthOfTextAtSize(watermarkText, fontSize)
          const spacing = Math.max(textWidth + 50, 200)

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
        }
      }

      const pdfBytes = await pdf.save()
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
      setPdfBlob(blob)
      setProcessed(true)
    } catch (error) {
      console.error('Error adding watermark:', error)
      alert('Error adding watermark. The file may be corrupted or password-protected.')
    } finally {
      setProcessing(false)
    }
  }

  const downloadPDF = () => {
    if (!pdfBlob || !file) return
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `watermarked-${file.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setFile(null)
    setProcessed(false)
    setPdfBlob(null)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  const presetTexts = ['CONFIDENTIAL', 'DRAFT', 'SAMPLE', 'COPY', 'DO NOT COPY', 'PRIVATE']

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#2a2a2a] text-[#c4ff0e] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Droplets className="w-4 h-4" />
            Free PDF Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Watermark PDF
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Add custom text watermarks to your PDF documents.
            Protect your content with professional watermarks.
          </p>

          <div
            className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-8 transition-all ${
              dragActive
                ? 'border-[#c4ff0e] bg-[#252525]'
                : 'border-[#3a3a3a] hover:border-[#c4ff0e] bg-[#1F1F1F]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-[#c4ff0e]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Drop your PDF here
                </h3>
                <p className="text-gray-400 mb-4">or click to browse</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#c4ff0e] text-black font-medium rounded-lg cursor-pointer hover:bg-[#d4ff3e] transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Select PDF File
                </label>
              </div>
            ) : !processed ? (
              <div>
                <div className="flex items-center gap-3 p-3 bg-[#252525] rounded-lg border border-[#2a2a2a] mb-6">
                  <div className="w-10 h-10 bg-[#2a2a2a] rounded flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#c4ff0e]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                  </div>
                  <button
                    onClick={clearAll}
                    className="p-1 hover:bg-red-900/20 rounded text-gray-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Watermark Settings */}
                <div className="space-y-4 mb-6 text-left">
                  {/* Watermark Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-3 py-2 border border-[#3a3a3a] rounded-lg focus:ring-2 focus:ring-[#c4ff0e] focus:border-[#c4ff0e]"
                      placeholder="Enter watermark text"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {presetTexts.map(text => (
                        <button
                          key={text}
                          onClick={() => setWatermarkText(text)}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            watermarkText === text
                              ? 'border-[#c4ff0e] bg-[#252525] text-[#c4ff0e]'
                              : 'border-[#2a2a2a] hover:border-[#3a3a3a] text-gray-400'
                          }`}
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Position
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setPosition('center')}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                          position === 'center'
                            ? 'border-[#c4ff0e] bg-[#252525] text-[#c4ff0e]'
                            : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                        }`}
                      >
                        Centered
                      </button>
                      <button
                        onClick={() => setPosition('tile')}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                          position === 'tile'
                            ? 'border-[#c4ff0e] bg-[#252525] text-[#c4ff0e]'
                            : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                        }`}
                      >
                        Tiled
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Font Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Font Size: {fontSize}px
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="120"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-cyan-600"
                      />
                    </div>

                    {/* Opacity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Opacity: {Math.round(opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={opacity * 100}
                        onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
                        className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-cyan-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Rotation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Rotation: {rotation}°
                      </label>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-cyan-600"
                      />
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-[#2a2a2a]"
                        />
                        <div className="flex gap-1">
                          {['#ff0000', '#0000ff', '#808080', '#000000'].map(c => (
                            <button
                              key={c}
                              onClick={() => setColor(c)}
                              className={`w-8 h-8 rounded border-2 ${color === c ? 'border-[#c4ff0e]' : 'border-[#2a2a2a]'}`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-400 mb-2">Preview</p>
                    <div
                      className="inline-block font-bold"
                      style={{
                        fontSize: `${Math.min(fontSize / 2, 32)}px`,
                        color: color,
                        opacity: opacity,
                        transform: `rotate(${rotation}deg)`,
                      }}
                    >
                      {watermarkText}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 text-gray-400 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                    disabled={processing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWatermark}
                    disabled={processing || !watermarkText.trim()}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#c4ff0e] text-black font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Adding Watermark...
                      </>
                    ) : (
                      <>
                        <Droplets className="w-5 h-5" />
                        Add Watermark
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-[#c4ff0e]">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Watermark Added Successfully!</span>
                </div>

                <button
                  onClick={downloadPDF}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#c4ff0e] text-black font-medium rounded-lg hover:bg-[#d4ff3e] transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Watermarked PDF
                </button>
                <button
                  onClick={clearAll}
                  className="block mx-auto text-sm text-gray-400 hover:text-gray-300"
                >
                  Watermark another PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#1F1F1F]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Use PDF Watermarks?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Instant Processing', desc: 'Add watermarks instantly in your browser' },
              { icon: Shield, title: '100% Private', desc: 'Files never leave your device' },
              { icon: Clock, title: 'No Limits', desc: 'Watermark any PDF regardless of size' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-[#252525]">
                <div className="w-12 h-12 bg-[#2a2a2a] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-[#c4ff0e]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#252525]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need More PDF Tools?
          </h2>
          <p className="text-gray-300 mb-8">
            Explore our complete suite of free PDF tools
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F1F1F] text-[#c4ff0e] font-medium rounded-lg hover:shadow-lg transition-all"
          >
            View All Tools
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
