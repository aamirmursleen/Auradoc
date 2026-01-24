'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { FileType, Upload, Download, Loader2, FileText, CheckCircle, ArrowRight, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { useTheme } from '@/components/ThemeProvider'

// We'll use pdfjs-dist for text extraction
let pdfjsLib: any = null

export default function PDFToWordPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [converted, setConverted] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [extractedText, setExtractedText] = useState<string>('')
  const [wordBlob, setWordBlob] = useState<Blob | null>(null)
  const [progress, setProgress] = useState(0)

  // Load PDF.js library
  useEffect(() => {
    const loadPdfJs = async () => {
      if (typeof window !== 'undefined') {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
        pdfjsLib = pdfjs
      }
    }
    loadPdfJs()
  }, [])

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
      setConverted(false)
      setExtractedText('')
      setWordBlob(null)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setConverted(false)
      setExtractedText('')
      setWordBlob(null)
    }
  }

  const extractTextFromPDF = async (file: File): Promise<string[]> => {
    if (!pdfjsLib) {
      throw new Error('PDF.js not loaded')
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const textContent: string[] = []

    for (let i = 1; i <= pdf.numPages; i++) {
      setProgress(Math.round((i / pdf.numPages) * 80))
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ')

      if (pageText.trim()) {
        textContent.push(pageText)
      }
    }

    return textContent
  }

  const createWordDocument = async (pages: string[]): Promise<Blob> => {
    const children: Paragraph[] = []

    pages.forEach((pageText, index) => {
      // Add page header
      if (pages.length > 1) {
        children.push(
          new Paragraph({
            text: `Page ${index + 1}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        )
      }

      // Split text into paragraphs (by double newlines or long gaps)
      const paragraphs = pageText.split(/\n\n|\r\n\r\n/).filter(p => p.trim())

      paragraphs.forEach(para => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: para.trim(),
                size: 24, // 12pt
              }),
            ],
            spacing: { after: 200 },
          })
        )
      })

      // Add page break between pages (except last)
      if (index < pages.length - 1) {
        children.push(
          new Paragraph({
            children: [],
            pageBreakBefore: true,
          })
        )
      }
    })

    const doc = new Document({
      sections: [{
        properties: {},
        children: children.length > 0 ? children : [
          new Paragraph({
            children: [
              new TextRun({
                text: 'No text content could be extracted from this PDF.',
                size: 24,
              }),
            ],
          })
        ],
      }],
    })

    const blob = await Packer.toBlob(doc)
    return blob
  }

  const handleConvert = async () => {
    if (!file) return
    setConverting(true)
    setProgress(0)

    try {
      // Extract text from PDF
      setProgress(10)
      const pages = await extractTextFromPDF(file)

      setProgress(85)
      const fullText = pages.join('\n\n--- Page Break ---\n\n')
      setExtractedText(fullText || 'No text content found in PDF.')

      // Create Word document
      setProgress(90)
      const wordDoc = await createWordDocument(pages)
      setWordBlob(wordDoc)

      setProgress(100)
      setConverted(true)
    } catch (error) {
      console.error('Error converting PDF:', error)
      alert('Error converting PDF. The file may be corrupted, password-protected, or contain only images (scanned PDF).')
    } finally {
      setConverting(false)
    }
  }

  const downloadWord = () => {
    if (!wordBlob || !file) return

    const url = URL.createObjectURL(wordBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name.replace('.pdf', '.docx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearFile = () => {
    setFile(null)
    setConverted(false)
    setExtractedText('')
    setWordBlob(null)
    setProgress(0)
  }

  const features = [
    { icon: Zap, title: 'Fast Conversion', desc: 'Convert PDFs in seconds' },
    { icon: Shield, title: 'Secure', desc: 'Files processed in your browser' },
    { icon: Clock, title: 'Free to Use', desc: 'No registration required' },
  ]

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${isDark ? 'bg-[#2a2a2a] text-[#c4ff0e]' : 'bg-[#EDE5FF] text-[#4C00FF]'}`}>
            <FileType className="w-4 h-4" />
            PDF Tool
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
            PDF to Word Converter
          </h1>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Convert PDF files to editable Word documents (.docx).
            Extract text and download as Word format.
          </p>

          {/* Upload Area */}
          <div
            className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-12 transition-all ${
              dragActive
                ? isDark ? 'border-[#c4ff0e] bg-[#252525]' : 'border-[#4C00FF] bg-[#EDE5FF]'
                : isDark ? 'border-[#3a3a3a] hover:border-[#c4ff0e] bg-[#1F1F1F]' : 'border-gray-300 hover:border-[#4C00FF] bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'}`}>
                  <Upload className={`w-8 h-8 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
                  Drop your PDF here
                </h3>
                <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>or click to browse</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg cursor-pointer transition-colors ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#d4ff3e]' : 'bg-[#4C00FF] text-white hover:bg-[#3D00CC]'}`}
                >
                  <Upload className="w-5 h-5" />
                  Select PDF File
                </label>
                <p className={`text-sm mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Max file size: 50MB</p>
              </div>
            ) : (
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'}`}>
                  <FileText className={`w-8 h-8 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                </div>
                <p className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{file.name}</p>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {!converted ? (
                  <div>
                    {converting && (
                      <div className="mb-4">
                        <div className={`w-full rounded-full h-2 mb-2 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'}`}>
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {progress < 80 ? 'Extracting text...' : progress < 95 ? 'Creating Word document...' : 'Finalizing...'}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleConvert}
                      disabled={converting}
                      className={`inline-flex items-center gap-2 px-8 py-3 font-medium rounded-lg transition-all disabled:opacity-50 ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#d4ff3e]' : 'bg-[#4C00FF] text-white hover:bg-[#3D00CC]'}`}
                    >
                      {converting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Converting... {progress}%
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-5 h-5" />
                          Convert to Word
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`flex items-center justify-center gap-2 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Conversion Complete!</span>
                    </div>

                    {/* Preview Box */}
                    <div className={`rounded-xl p-4 text-left border max-h-48 overflow-y-auto ${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Preview (first 500 characters):</p>
                      <pre className={`text-sm whitespace-pre-wrap font-sans ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {extractedText.substring(0, 500)}{extractedText.length > 500 ? '...' : ''}
                      </pre>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={downloadWord}
                      className={`inline-flex items-center gap-2 px-8 py-3 font-medium rounded-lg transition-colors ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#d4ff3e]' : 'bg-[#4C00FF] text-white hover:bg-[#3D00CC]'}`}
                    >
                      <Download className="w-5 h-5" />
                      Download Word Document (.docx)
                    </button>
                  </div>
                )}

                <button
                  onClick={clearFile}
                  className={`block mx-auto mt-4 text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Upload different file
                </button>
              </div>
            )}
          </div>

          {/* Note */}
          <div className={`max-w-2xl mx-auto mt-6 p-4 rounded-xl border ${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <strong>Note:</strong> This tool extracts text from PDFs. For scanned PDFs (images),
              the text extraction may be limited. Best results with text-based PDFs.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`py-16 px-4 ${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
            Why Use Our Converter?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className={`text-center p-6 rounded-2xl ${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'}`}>
                  <feature.icon className={`w-6 h-6 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                </div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{feature.title}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Tools */}
      <section className={`py-16 px-4 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
            Other Tools You Might Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/tools/image-to-pdf" className={`block p-6 rounded-2xl hover:shadow-lg transition-all group border ${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200 hover:border-[#4C00FF]/50'}`}>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white group-hover:text-[#c4ff0e]' : 'text-[#26065D] group-hover:text-[#4C00FF]'}`}>Image to PDF</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Convert images to PDF documents</p>
            </Link>
            <Link href="/tools/pdf-compressor" className={`block p-6 rounded-2xl hover:shadow-lg transition-all group border ${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200 hover:border-[#4C00FF]/50'}`}>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white group-hover:text-[#c4ff0e]' : 'text-[#26065D] group-hover:text-[#4C00FF]'}`}>PDF Optimizer</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Reduce PDF file size</p>
            </Link>
            <Link href="/verify" className={`block p-6 rounded-2xl hover:shadow-lg transition-all group border ${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200 hover:border-[#4C00FF]/50'}`}>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white group-hover:text-[#c4ff0e]' : 'text-[#26065D] group-hover:text-[#4C00FF]'}`}>Verify PDF</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Check document authenticity</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 px-4 ${isDark ? 'bg-[#252525]' : 'bg-[#4C00FF]'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need More PDF Tools?
          </h2>
          <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-white/80'}`}>
            Check out our complete suite of document tools
          </p>
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#d4ff3e]' : 'bg-white text-[#4C00FF] hover:bg-gray-100'}`}
          >
            Explore All Tools
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
