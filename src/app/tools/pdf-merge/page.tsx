'use client'

import React, { useState, useCallback } from 'react'
import { Layers, Upload, Download, Loader2, FileText, CheckCircle, ArrowRight, X, GripVertical, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

interface PDFFile {
  file: File
  id: string
}

export default function PDFMergePage() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [merging, setMerging] = useState(false)
  const [merged, setMerged] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

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
      file => file.type === 'application/pdf'
    )
    addFiles(droppedFiles)
  }, [])

  const addFiles = (newFiles: File[]) => {
    const newPDFFiles = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7)
    }))
    setFiles(prev => [...prev, ...newPDFFiles])
    setMerged(false)
    setMergedBlob(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      file => file.type === 'application/pdf'
    )
    addFiles(selectedFiles)
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    setMerged(false)
    setMergedBlob(null)
  }

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) return

    const newFiles = [...files]
    const draggedIndex = newFiles.findIndex(f => f.id === draggedItem)
    const targetIndex = newFiles.findIndex(f => f.id === targetId)

    const [removed] = newFiles.splice(draggedIndex, 1)
    newFiles.splice(targetIndex, 0, removed)
    setFiles(newFiles)
  }

  const handleMerge = async () => {
    if (files.length < 2) return
    setMerging(true)

    try {
      const { PDFDocument } = await import('pdf-lib')
      const mergedPdf = await PDFDocument.create()

      for (const { file } of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const mergedBytes = await mergedPdf.save()
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: 'application/pdf' })
      setMergedBlob(blob)
      setMerged(true)
    } catch (error) {
      console.error('Error merging PDFs:', error)
      alert('Error merging PDFs. Some files may be corrupted or password-protected.')
    } finally {
      setMerging(false)
    }
  }

  const downloadMerged = () => {
    if (!mergedBlob) return
    const url = URL.createObjectURL(mergedBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'merged-document.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setFiles([])
    setMerged(false)
    setMergedBlob(null)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'PDF Tools', href: '/tools' },
            { label: 'Merge PDF' },
          ]} />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-muted text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Layers className="w-4 h-4" />
            Free PDF Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            PDF Merge
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Combine multiple PDF files into one document.
            Drag to reorder pages before merging.
          </p>

          <div
            className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-8 transition-all ${
              dragActive
                ? 'border-primary bg-secondary'
                : 'border-border hover:border-primary bg-white'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {files.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drop your PDFs here
                </h3>
                <p className="text-muted-foreground mb-4">or click to browse</p>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg cursor-pointer transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Select PDF Files
                </label>
                <p className="text-sm text-muted-foreground mt-4">Select 2 or more PDFs to merge</p>
              </div>
            ) : (
              <div>
                <div className="space-y-2 mb-6">
                  {files.map((item, index) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      onDragOver={(e) => handleDragOver(e, item.id)}
                      onDragEnd={() => setDraggedItem(null)}
                      className={`flex items-center gap-3 p-3 bg-secondary border-border rounded-lg border cursor-move ${
                        draggedItem === item.id ? 'opacity-50' : ''
                      }`}
                    >
                      <GripVertical className="w-5 h-5 text-muted-foreground" />
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatSize(item.file.size)}</p>
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <button
                        onClick={() => removeFile(item.id)}
                        className="p-1 hover:bg-red-900/20 rounded text-muted-foreground hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="pdf-upload-more"
                  />
                  <label
                    htmlFor="pdf-upload-more"
                    className="text-primary hover:text-primary/80 text-sm font-medium cursor-pointer"
                  >
                    + Add more PDFs
                  </label>
                </div>

                {!merged ? (
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={handleMerge}
                      disabled={merging || files.length < 2}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {merging ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Merging...
                        </>
                      ) : (
                        <>
                          <Layers className="w-5 h-5" />
                          Merge {files.length} PDFs
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">PDFs Merged Successfully!</span>
                    </div>
                    <button
                      onClick={downloadMerged}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Merged PDF
                    </button>
                    <button
                      onClick={clearAll}
                      className="block mx-auto text-sm text-muted-foreground hover:text-foreground"
                    >
                      Merge more PDFs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Use Our PDF Merger?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Fast Processing', desc: 'Merge PDFs instantly in your browser' },
              { icon: Shield, title: '100% Private', desc: 'Files never leave your device' },
              { icon: Clock, title: 'No Limits', desc: 'Merge as many PDFs as you want' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-secondary">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Need to Split a PDF?
          </h2>
          <p className="text-muted-foreground mb-8">
            Extract specific pages or split large PDFs into smaller files
          </p>
          <Link
            href="/tools/pdf-split"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary border border-border font-medium rounded-lg hover:shadow-lg transition-all"
          >
            Split PDF
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
