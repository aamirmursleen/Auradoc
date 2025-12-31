'use client'

import React, { useState, useCallback } from 'react'
import { FileType, Upload, Download, Loader2, FileText, CheckCircle, ArrowRight, X, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import mammoth from 'mammoth'
import { jsPDF } from 'jspdf'

export default function WordToPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [converted, setConverted] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string>('')

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
      file => file.name.endsWith('.docx') || file.name.endsWith('.doc')
    )
    if (droppedFile) {
      setFile(droppedFile)
      setConverted(false)
      setPdfBlob(null)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && (selectedFile.name.endsWith('.docx') || selectedFile.name.endsWith('.doc'))) {
      setFile(selectedFile)
      setConverted(false)
      setPdfBlob(null)
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setConverting(true)
    setProgress(0)

    try {
      setProgress(10)
      const arrayBuffer = await file.arrayBuffer()

      setProgress(30)
      // Convert Word to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer })
      const html = result.value

      setProgress(50)
      // Extract text from HTML for preview
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      const textContent = tempDiv.textContent || tempDiv.innerText || ''
      setPreview(textContent.substring(0, 500) + (textContent.length > 500 ? '...' : ''))

      setProgress(70)
      // Create PDF using jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Parse HTML and add to PDF
      const lines = textContent.split('\n').filter(line => line.trim())

      let y = 20
      const pageHeight = 280
      const lineHeight = 7
      const marginLeft = 20
      const marginRight = 20
      const maxWidth = 170 // A4 width (210) minus margins

      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')

      for (const line of lines) {
        // Split long lines
        const splitLines = pdf.splitTextToSize(line, maxWidth)

        for (const splitLine of splitLines) {
          if (y > pageHeight) {
            pdf.addPage()
            y = 20
          }

          // Check if it looks like a heading
          if (line.length < 100 && line === line.toUpperCase()) {
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(14)
          } else {
            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(11)
          }

          pdf.text(splitLine, marginLeft, y)
          y += lineHeight
        }

        y += 2 // Extra space between paragraphs
      }

      setProgress(90)
      const pdfOutput = pdf.output('blob')
      setPdfBlob(pdfOutput)
      setConverted(true)
      setProgress(100)
    } catch (error) {
      console.error('Error converting:', error)
      alert('Error converting document. Please make sure the file is a valid Word document (.docx).')
    } finally {
      setConverting(false)
    }
  }

  const downloadPDF = () => {
    if (!pdfBlob || !file) return
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name.replace(/\.(docx?|doc)$/i, '.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setFile(null)
    setConverted(false)
    setPdfBlob(null)
    setProgress(0)
    setPreview('')
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#2a2a2a] text-[#c4ff0e] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileType className="w-4 h-4" />
            Free PDF Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Word to PDF
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Convert your Word documents (.docx) to PDF format instantly.
            Preserve formatting and create professional PDFs.
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
                  Drop your Word document here
                </h3>
                <p className="text-gray-400 mb-4">or click to browse</p>
                <input
                  type="file"
                  accept=".docx,.doc"
                  onChange={handleFileChange}
                  className="hidden"
                  id="word-upload"
                />
                <label
                  htmlFor="word-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#c4ff0e] text-black font-medium rounded-lg cursor-pointer hover:bg-[#d4ff3e] transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Select Word File
                </label>
                <p className="text-sm text-gray-400 mt-4">Supports .docx files</p>
              </div>
            ) : !converted ? (
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

                {converting && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Converting...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                      <div
                        className="bg-[#c4ff0e] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 text-gray-400 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                    disabled={converting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConvert}
                    disabled={converting}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#c4ff0e] text-black font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {converting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <FileType className="w-5 h-5" />
                        Convert to PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-[#c4ff0e]">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Converted Successfully!</span>
                </div>

                {preview && (
                  <div className="bg-[#252525] rounded-lg p-4 text-left">
                    <p className="text-xs text-gray-400 mb-2">Preview:</p>
                    <p className="text-sm text-gray-300 line-clamp-4">{preview}</p>
                  </div>
                )}

                <button
                  onClick={downloadPDF}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#c4ff0e] text-black font-medium rounded-lg hover:bg-[#d4ff3e] transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  onClick={clearAll}
                  className="block mx-auto text-sm text-gray-400 hover:text-gray-300"
                >
                  Convert another document
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#1F1F1F]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Convert Word to PDF?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Instant Conversion', desc: 'Convert documents instantly in your browser' },
              { icon: Shield, title: '100% Private', desc: 'Files never leave your device' },
              { icon: Clock, title: 'No Limits', desc: 'Convert as many documents as you need' },
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
            Need to Convert PDF to Word?
          </h2>
          <p className="text-gray-300 mb-8">
            Extract text from PDFs and convert them to editable Word documents
          </p>
          <Link
            href="/tools/pdf-to-word"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F1F1F] text-[#c4ff0e] font-medium rounded-lg hover:shadow-lg transition-all"
          >
            PDF to Word
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
