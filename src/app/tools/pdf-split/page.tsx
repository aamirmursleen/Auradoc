'use client'

import React, { useState, useCallback } from 'react'
import { Scissors, Upload, Download, Loader2, FileText, CheckCircle, ArrowRight, X, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'
import Breadcrumbs from '@/components/Breadcrumbs'

interface PageSelection {
  pageNum: number
  selected: boolean
}

export default function PDFSplitPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [pages, setPages] = useState<PageSelection[]>([])
  const [splitMode, setSplitMode] = useState<'extract' | 'split-all'>('extract')
  const [splitBlobs, setSplitBlobs] = useState<{ name: string; blob: Blob }[]>([])
  const [rangeInput, setRangeInput] = useState('')

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
      processFile(droppedFile)
    }
  }, [])

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile)
    setProcessed(false)
    setSplitBlobs([])

    try {
      const { PDFDocument } = await import('pdf-lib')
      const arrayBuffer = await selectedFile.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pageCount = pdf.getPageCount()
      setTotalPages(pageCount)
      setPages(
        Array.from({ length: pageCount }, (_, i) => ({
          pageNum: i + 1,
          selected: false
        }))
      )
    } catch (error) {
      console.error('Error loading PDF:', error)
      alert('Error loading PDF. The file may be corrupted or password-protected.')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      processFile(selectedFile)
    }
  }

  const togglePage = (pageNum: number) => {
    setPages(prev =>
      prev.map(p =>
        p.pageNum === pageNum ? { ...p, selected: !p.selected } : p
      )
    )
  }

  const selectAll = () => {
    setPages(prev => prev.map(p => ({ ...p, selected: true })))
  }

  const deselectAll = () => {
    setPages(prev => prev.map(p => ({ ...p, selected: false })))
  }

  const selectRange = () => {
    // Parse range input like "1-5, 8, 10-12"
    const ranges = rangeInput.split(',').map(s => s.trim())
    const selectedPages = new Set<number>()

    ranges.forEach(range => {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(n => parseInt(n.trim()))
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
            selectedPages.add(i)
          }
        }
      } else {
        const num = parseInt(range)
        if (!isNaN(num) && num >= 1 && num <= totalPages) {
          selectedPages.add(num)
        }
      }
    })

    setPages(prev =>
      prev.map(p => ({
        ...p,
        selected: selectedPages.has(p.pageNum)
      }))
    )
  }

  const handleSplit = async () => {
    if (!file) return
    setProcessing(true)

    try {
      const { PDFDocument } = await import('pdf-lib')
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const results: { name: string; blob: Blob }[] = []

      if (splitMode === 'extract') {
        // Extract selected pages into a single PDF
        const selectedPageNums = pages.filter(p => p.selected).map(p => p.pageNum - 1)
        if (selectedPageNums.length === 0) {
          alert('Please select at least one page to extract.')
          setProcessing(false)
          return
        }

        const newPdf = await PDFDocument.create()
        const copiedPages = await newPdf.copyPages(pdf, selectedPageNums)
        copiedPages.forEach(page => newPdf.addPage(page))

        const pdfBytes = await newPdf.save()
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
        results.push({
          name: `extracted-pages.pdf`,
          blob
        })
      } else {
        // Split into individual pages
        for (let i = 0; i < pdf.getPageCount(); i++) {
          const newPdf = await PDFDocument.create()
          const [copiedPage] = await newPdf.copyPages(pdf, [i])
          newPdf.addPage(copiedPage)

          const pdfBytes = await newPdf.save()
          const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
          results.push({
            name: `page-${i + 1}.pdf`,
            blob
          })
        }
      }

      setSplitBlobs(results)
      setProcessed(true)
    } catch (error) {
      console.error('Error splitting PDF:', error)
      alert('Error splitting PDF. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const downloadFile = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadAll = async () => {
    // Download each file with a small delay
    for (const { blob, name } of splitBlobs) {
      downloadFile(blob, name)
      await new Promise(resolve => setTimeout(resolve, 300))
    }
  }

  const clearAll = () => {
    setFile(null)
    setProcessed(false)
    setSplitBlobs([])
    setTotalPages(0)
    setPages([])
    setRangeInput('')
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  const selectedCount = pages.filter(p => p.selected).length

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'PDF Tools', href: '/tools' },
            { label: 'Split PDF' },
          ]} />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 ${isDark ? 'bg-[#2a2a2a] text-[#c4ff0e]' : 'bg-[#EDE5FF] text-[#4C00FF]'} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
            <Scissors className="w-4 h-4" />
            Free PDF Tool
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-4`}>
            PDF Split
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-8 max-w-2xl mx-auto`}>
            Extract specific pages or split a PDF into individual pages.
            Select exactly what you need.
          </p>

          <div
            className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-8 transition-all ${
              dragActive
                ? `${isDark ? 'border-[#c4ff0e] bg-[#252525]' : 'border-[#4C00FF] bg-white border border-gray-200'}`
                : `${isDark ? 'border-[#3a3a3a] hover:border-[#c4ff0e] bg-[#1F1F1F]' : 'border-gray-300 hover:border-[#4C00FF] bg-gray-50'}`
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="text-center py-8">
                <div className={`w-16 h-16 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Upload className={`w-8 h-8 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                </div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-2`}>
                  Drop your PDF here
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>or click to browse</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className={`inline-flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#d4ff3e]' : 'bg-[#4C00FF] text-white hover:bg-[#3D00CC]'} font-medium rounded-lg cursor-pointer transition-colors`}
                >
                  <Upload className="w-5 h-5" />
                  Select PDF File
                </label>
              </div>
            ) : !processed ? (
              <div>
                <div className={`flex items-center gap-3 p-3 ${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-white border border-gray-200'} rounded-lg border mb-6`}>
                  <div className={`w-10 h-10 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} rounded flex items-center justify-center`}>
                    <FileText className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#26065D]'} truncate`}>{file.name}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatSize(file.size)} - {totalPages} pages</p>
                  </div>
                  <button
                    onClick={clearAll}
                    className={`p-1 hover:bg-red-900/20 rounded ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:text-red-400`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Split Mode Selection */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>Split Mode</label>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setSplitMode('extract')}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        splitMode === 'extract'
                          ? `${isDark ? 'border-[#c4ff0e] bg-[#252525] text-[#c4ff0e]' : 'border-[#4C00FF] bg-white border border-gray-200 text-[#4C00FF]'}`
                          : `${isDark ? 'border-[#2a2a2a] hover:border-[#3a3a3a]' : 'border-gray-200 hover:border-gray-300'}`
                      }`}
                    >
                      Extract Selected Pages
                    </button>
                    <button
                      onClick={() => setSplitMode('split-all')}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        splitMode === 'split-all'
                          ? `${isDark ? 'border-[#c4ff0e] bg-[#252525] text-[#c4ff0e]' : 'border-[#4C00FF] bg-white border border-gray-200 text-[#4C00FF]'}`
                          : `${isDark ? 'border-[#2a2a2a] hover:border-[#3a3a3a]' : 'border-gray-200 hover:border-gray-300'}`
                      }`}
                    >
                      Split All Pages
                    </button>
                  </div>
                </div>

                {splitMode === 'extract' && (
                  <>
                    {/* Range Input */}
                    <div className="mb-4">
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                        Enter page range (e.g., 1-5, 8, 10-12)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={rangeInput}
                          onChange={(e) => setRangeInput(e.target.value)}
                          placeholder="1-5, 8, 10-12"
                          className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 ${isDark ? 'border-[#3a3a3a] bg-[#1e1e1e] text-white focus:ring-[#c4ff0e] focus:border-[#c4ff0e]' : 'border-gray-300 bg-white text-[#26065D] focus:ring-[#4C00FF] focus:border-[#4C00FF]'}`}
                        />
                        <button
                          onClick={selectRange}
                          className={`px-4 py-2 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white' : 'bg-[#EDE5FF] hover:bg-[#DDD5EF] text-[#4C00FF]'} rounded-lg text-sm font-medium`}
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 justify-center mb-4">
                      <button onClick={selectAll} className={`text-sm ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'} hover:underline`}>
                        Select All
                      </button>
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-400'}`}>|</span>
                      <button onClick={deselectAll} className={`text-sm ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'} hover:underline`}>
                        Deselect All
                      </button>
                    </div>

                    {/* Page Grid */}
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-6 max-h-48 overflow-y-auto p-2">
                      {pages.map(page => (
                        <button
                          key={page.pageNum}
                          onClick={() => togglePage(page.pageNum)}
                          className={`aspect-square rounded-lg border-2 text-sm font-medium transition-all ${
                            page.selected
                              ? `${isDark ? 'border-[#c4ff0e] bg-orange-500 text-white' : 'border-[#4C00FF] bg-[#4C00FF] text-white'}`
                              : `${isDark ? 'border-[#2a2a2a] hover:border-orange-300 text-gray-300' : 'border-gray-200 hover:border-[#4C00FF] text-gray-600'}`
                          }`}
                        >
                          {page.pageNum}
                        </button>
                      ))}
                    </div>

                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                      {selectedCount} of {totalPages} pages selected
                    </p>
                  </>
                )}

                <div className="flex justify-center gap-3">
                  <button
                    onClick={clearAll}
                    className={`px-4 py-2 ${isDark ? 'text-gray-400 hover:bg-[#2a2a2a]' : 'text-gray-500 hover:bg-gray-100'} rounded-lg transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSplit}
                    disabled={processing || (splitMode === 'extract' && selectedCount === 0)}
                    className={`inline-flex items-center gap-2 px-8 py-3 ${isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white'} font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50`}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Scissors className="w-5 h-5" />
                        {splitMode === 'extract' ? `Extract ${selectedCount} Pages` : `Split ${totalPages} Pages`}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className={`flex items-center justify-center gap-2 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">PDF Split Successfully!</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {splitBlobs.map((item, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-2 ${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'} rounded-lg`}>
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.name}</span>
                      <button
                        onClick={() => downloadFile(item.blob, item.name)}
                        className={`${isDark ? 'text-[#c4ff0e] hover:text-[#c4ff0e]' : 'text-[#4C00FF] hover:text-[#3D00CC]'} text-sm font-medium`}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>

                {splitBlobs.length > 1 && (
                  <button
                    onClick={downloadAll}
                    className={`inline-flex items-center gap-2 px-8 py-3 ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#d4ff3e]' : 'bg-[#4C00FF] text-white hover:bg-[#3D00CC]'} font-medium rounded-lg transition-colors`}
                  >
                    <Download className="w-5 h-5" />
                    Download All ({splitBlobs.length} files)
                  </button>
                )}

                {splitBlobs.length === 1 && (
                  <button
                    onClick={() => downloadFile(splitBlobs[0].blob, splitBlobs[0].name)}
                    className={`inline-flex items-center gap-2 px-8 py-3 ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#d4ff3e]' : 'bg-[#4C00FF] text-white hover:bg-[#3D00CC]'} font-medium rounded-lg transition-colors`}
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                )}

                <button
                  onClick={clearAll}
                  className={`block mx-auto text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}
                >
                  Split another PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={`py-16 px-4 ${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-[#26065D]'} mb-12`}>
            Why Use Our PDF Splitter?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Instant Split', desc: 'Split PDFs instantly in your browser' },
              { icon: Shield, title: '100% Private', desc: 'Files never leave your device' },
              { icon: Clock, title: 'No Limits', desc: 'Split any PDF regardless of size' },
            ].map((feature, idx) => (
              <div key={idx} className={`text-center p-6 rounded-2xl ${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'}`}>
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

      <section className={`py-16 px-4 ${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-4`}>
            Need to Merge PDFs?
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-500'} mb-8`}>
            Combine multiple PDF files into one document
          </p>
          <Link
            href="/tools/pdf-merge"
            className={`inline-flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-[#1F1F1F] text-[#c4ff0e]' : 'bg-gray-50 text-[#4C00FF] border border-gray-200'} font-medium rounded-lg hover:shadow-lg transition-all`}
          >
            Merge PDFs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
