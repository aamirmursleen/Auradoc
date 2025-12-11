'use client'

import React, { useState, useCallback } from 'react'
import { Image as ImageIcon, Upload, Download, Loader2, FileText, CheckCircle, ArrowRight, Zap, Shield, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { PDFDocument } from 'pdf-lib'

export default function ImageToPDFPage() {
  const [files, setFiles] = useState<File[]>([])
  const [converting, setConverting] = useState(false)
  const [converted, setConverted] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)

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
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    )
    addFiles(droppedFiles)
  }, [])

  const addFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles])
    setConverted(false)
    setPdfBlob(null)

    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    addFiles(selectedFiles)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleConvert = async () => {
    if (files.length === 0) return
    setConverting(true)

    try {
      const pdfDoc = await PDFDocument.create()

      for (const file of files) {
        const imageBytes = await file.arrayBuffer()

        let image
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(imageBytes)
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(imageBytes)
        } else {
          // For other formats, convert to PNG first using canvas
          const img = new window.Image()
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          await new Promise<void>((resolve) => {
            img.onload = () => {
              canvas.width = img.width
              canvas.height = img.height
              ctx?.drawImage(img, 0, 0)
              resolve()
            }
            img.src = URL.createObjectURL(file)
          })

          const pngDataUrl = canvas.toDataURL('image/png')
          const pngBytes = await fetch(pngDataUrl).then(res => res.arrayBuffer())
          image = await pdfDoc.embedPng(pngBytes)
        }

        const page = pdfDoc.addPage([image.width, image.height])
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
      setPdfBlob(blob)
      setConverted(true)
    } catch (error) {
      console.error('Error creating PDF:', error)
      alert('Error creating PDF. Please try again.')
    } finally {
      setConverting(false)
    }
  }

  const downloadPdf = () => {
    if (!pdfBlob) return
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'images-to-pdf.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setFiles([])
    setPreviews([])
    setConverted(false)
    setPdfBlob(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ImageIcon className="w-4 h-4" />
            Free PDF Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Image to PDF Converter
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Convert JPG, PNG, and other images to PDF.
            Combine multiple images into a single PDF document.
          </p>

          {/* Upload Area */}
          <div
            className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-8 transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-400 bg-white'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {files.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your images here
                </h3>
                <p className="text-gray-500 mb-4">or click to browse</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Select Images
                </label>
                <p className="text-sm text-gray-400 mt-4">JPG, PNG, GIF, WebP supported</p>
              </div>
            ) : (
              <div>
                {/* Image Previews */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
                  {previews.map((preview, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeFile(idx)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        {idx + 1}
                      </div>
                    </div>
                  ))}

                  {/* Add More Button */}
                  <label
                    htmlFor="image-upload-more"
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Add</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload-more"
                  />
                </div>

                <p className="text-sm text-gray-500 mb-4 text-center">
                  {files.length} image{files.length > 1 ? 's' : ''} selected
                </p>

                {!converted ? (
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={handleConvert}
                      disabled={converting}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {converting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Creating PDF...
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          Create PDF
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">PDF Created Successfully!</span>
                    </div>
                    <button
                      onClick={downloadPdf}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </button>
                    <button
                      onClick={clearAll}
                      className="block mx-auto text-sm text-gray-500 hover:text-gray-700"
                    >
                      Convert more images
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ImageIcon, title: 'Multiple Images', desc: 'Combine multiple images into one PDF' },
              { icon: Zap, title: 'Instant Conversion', desc: 'Get your PDF in seconds' },
              { icon: Shield, title: 'Privacy First', desc: 'Images processed in your browser' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need to Verify a PDF?
          </h2>
          <p className="text-indigo-100 mb-8">
            Check if a document has been tampered with using our verification tool
          </p>
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:shadow-lg transition-all"
          >
            Verify PDF
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
