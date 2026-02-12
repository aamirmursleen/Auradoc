'use client'

import React, { useState, useCallback } from 'react'
import { Minimize2, Upload, Download, Loader2, FileText, CheckCircle, ArrowRight, Zap, Shield, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function PDFCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [compressed, setCompressed] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [result, setResult] = useState<{ original: number; compressed: number } | null>(null)
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null)

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
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile)
      setCompressed(false)
      setResult(null)
      setCompressedBlob(null)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setCompressed(false)
      setResult(null)
      setCompressedBlob(null)
    }
  }

  const handleCompress = async () => {
    if (!file) return
    setCompressing(true)

    try {
      const { PDFDocument } = await import('pdf-lib')
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      // Remove metadata to reduce size
      pdfDoc.setTitle('')
      pdfDoc.setAuthor('')
      pdfDoc.setSubject('')
      pdfDoc.setKeywords([])
      pdfDoc.setProducer('')
      pdfDoc.setCreator('')

      // Save with optimization options
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      })

      const blob = new Blob([new Uint8Array(compressedBytes)], { type: 'application/pdf' })
      setCompressedBlob(blob)

      setResult({
        original: file.size,
        compressed: blob.size
      })
      setCompressed(true)
    } catch (error) {
      console.error('Error compressing PDF:', error)
      alert('Error compressing PDF. The file may be corrupted or password-protected.')
    } finally {
      setCompressing(false)
    }
  }

  const downloadCompressed = () => {
    if (!compressedBlob || !file) return
    const url = URL.createObjectURL(compressedBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `compressed-${file.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  const clearFile = () => {
    setFile(null)
    setCompressed(false)
    setResult(null)
    setCompressedBlob(null)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'PDF Tools', href: '/tools' },
            { label: 'Compress PDF' },
          ]} />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-muted text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Minimize2 className="w-4 h-4" />
            Free PDF Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            PDF Optimizer
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Optimize your PDF files by removing metadata and unused objects.
            Processing happens entirely in your browser.
          </p>

          {/* Upload Area */}
          <div
            className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-12 transition-all ${
              dragActive
                ? 'border-primary bg-secondary'
                : 'border-border hover:border-primary bg-white'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drop your PDF here
                </h3>
                <p className="text-muted-foreground mb-4">or click to browse</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg cursor-pointer hover:opacity-90 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Select PDF File
                </label>
                <p className="text-sm text-muted-foreground mt-4">Max file size: 50MB</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium text-foreground mb-1">{file.name}</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Original size: {formatSize(file.size)}
                </p>

                {!compressed ? (
                  <button
                    onClick={handleCompress}
                    disabled={compressing}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {compressing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Minimize2 className="w-5 h-5" />
                        Optimize PDF
                      </>
                    )}
                  </button>
                ) : result && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Optimization Complete!</span>
                    </div>

                    {/* Results */}
                    <div className="bg-secondary rounded-xl p-4 max-w-sm mx-auto border border-border">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Original:</span>
                        <span className="font-medium">{formatSize(result.original)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Optimized:</span>
                        <span className="font-medium text-primary">{formatSize(result.compressed)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-border">
                        <span className="text-muted-foreground">
                          {result.compressed < result.original ? 'Saved:' : 'Change:'}
                        </span>
                        <span className={`font-bold ${result.compressed < result.original ? 'text-primary' : 'text-muted-foreground'}`}>
                          {result.compressed < result.original
                            ? `${Math.round((1 - result.compressed / result.original) * 100)}%`
                            : 'Already optimized'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={downloadCompressed}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Optimized PDF
                    </button>
                  </div>
                )}

                <button
                  onClick={clearFile}
                  className="block mx-auto mt-4 text-sm text-muted-foreground hover:text-foreground"
                >
                  Upload different file
                </button>
              </div>
            )}
          </div>

          {/* Info Note */}
          <div className="max-w-2xl mx-auto mt-6 p-4 bg-secondary rounded-xl border border-border">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-left text-sm text-muted-foreground">
                <p className="font-medium mb-1">How it works</p>
                <p>This tool removes metadata and optimizes the PDF structure. For PDFs with large images, consider using dedicated image compression tools for better results.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Use Our PDF Optimizer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Fast Processing', desc: 'Optimize PDFs in seconds with browser-based processing' },
              { icon: Shield, title: '100% Private', desc: 'Files never leave your device - processed locally' },
              { icon: Clock, title: 'No Limits', desc: 'Optimize as many PDFs as you want, completely free' },
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

      {/* CTA */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Need to Sign Documents?
          </h2>
          <p className="text-muted-foreground mb-8">
            Try our free e-signature tool for legally binding signatures
          </p>
          <Link
            href="/sign-document"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary border border-border font-medium rounded-lg hover:shadow-lg transition-all"
          >
            Sign Documents Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
