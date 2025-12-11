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
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
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
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Droplets className="w-4 h-4" />
            Free PDF Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Watermark PDF
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Add custom text watermarks to your PDF documents.
            Protect your content with professional watermarks.
          </p>

          <div
            className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-8 transition-all ${
              dragActive
                ? 'border-cyan-500 bg-cyan-50'
                : 'border-gray-300 hover:border-cyan-400 bg-white'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your PDF here
                </h3>
                <p className="text-gray-500 mb-4">or click to browse</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg cursor-pointer hover:bg-cyan-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Select PDF File
                </label>
              </div>
            ) : !processed ? (
              <div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                  <div className="w-10 h-10 bg-cyan-100 rounded flex items-center justify-center">
                    <FileText className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                  </div>
                  <button
                    onClick={clearAll}
                    className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Watermark Settings */}
                <div className="space-y-4 mb-6 text-left">
                  {/* Watermark Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="Enter watermark text"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {presetTexts.map(text => (
                        <button
                          key={text}
                          onClick={() => setWatermarkText(text)}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            watermarkText === text
                              ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setPosition('center')}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                          position === 'center'
                            ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        Centered
                      </button>
                      <button
                        onClick={() => setPosition('tile')}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                          position === 'tile'
                            ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        Tiled
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Font Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size: {fontSize}px
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="120"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                      />
                    </div>

                    {/* Opacity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opacity: {Math.round(opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={opacity * 100}
                        onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Rotation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rotation: {rotation}°
                      </label>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                      />
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-200"
                        />
                        <div className="flex gap-1">
                          {['#ff0000', '#0000ff', '#808080', '#000000'].map(c => (
                            <button
                              key={c}
                              onClick={() => setColor(c)}
                              className={`w-8 h-8 rounded border-2 ${color === c ? 'border-cyan-500' : 'border-gray-200'}`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-500 mb-2">Preview</p>
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
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={processing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWatermark}
                    disabled={processing || !watermarkText.trim()}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
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
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Watermark Added Successfully!</span>
                </div>

                <button
                  onClick={downloadPDF}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Watermarked PDF
                </button>
                <button
                  onClick={clearAll}
                  className="block mx-auto text-sm text-gray-500 hover:text-gray-700"
                >
                  Watermark another PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Use PDF Watermarks?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Instant Processing', desc: 'Add watermarks instantly in your browser' },
              { icon: Shield, title: '100% Private', desc: 'Files never leave your device' },
              { icon: Clock, title: 'No Limits', desc: 'Watermark any PDF regardless of size' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-cyan-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need More PDF Tools?
          </h2>
          <p className="text-cyan-100 mb-8">
            Explore our complete suite of free PDF tools
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-600 font-medium rounded-lg hover:shadow-lg transition-all"
          >
            View All Tools
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
