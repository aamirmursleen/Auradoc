'use client'

import React, { useState, useCallback } from 'react'
import { Scissors, Upload, Download, Loader2, FileText, CheckCircle, ArrowRight, X, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import { PDFDocument } from 'pdf-lib'

interface PageSelection {
  pageNum: number
  selected: boolean
}

export default function PDFSplitPage() {
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
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
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
          const blob = new Blob([pdfBytes], { type: 'application/pdf' })
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Scissors className="w-4 h-4" />
            Free PDF Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PDF Split
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Extract specific pages or split a PDF into individual pages.
            Select exactly what you need.
          </p>

          <div
            className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-8 transition-all ${
              dragActive
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 hover:border-orange-400 bg-white'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-orange-600" />
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-medium rounded-lg cursor-pointer hover:bg-orange-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Select PDF File
                </label>
              </div>
            ) : !processed ? (
              <div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatSize(file.size)} - {totalPages} pages</p>
                  </div>
                  <button
                    onClick={clearAll}
                    className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Split Mode Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Split Mode</label>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setSplitMode('extract')}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        splitMode === 'extract'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Extract Selected Pages
                    </button>
                    <button
                      onClick={() => setSplitMode('split-all')}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        splitMode === 'split-all'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-gray-300'
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter page range (e.g., 1-5, 8, 10-12)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={rangeInput}
                          onChange={(e) => setRangeInput(e.target.value)}
                          placeholder="1-5, 8, 10-12"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <button
                          onClick={selectRange}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 justify-center mb-4">
                      <button onClick={selectAll} className="text-sm text-orange-600 hover:underline">
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button onClick={deselectAll} className="text-sm text-orange-600 hover:underline">
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
                              ? 'border-orange-500 bg-orange-500 text-white'
                              : 'border-gray-200 hover:border-orange-300 text-gray-700'
                          }`}
                        >
                          {page.pageNum}
                        </button>
                      ))}
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                      {selectedCount} of {totalPages} pages selected
                    </p>
                  </>
                )}

                <div className="flex justify-center gap-3">
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSplit}
                    disabled={processing || (splitMode === 'extract' && selectedCount === 0)}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
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
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">PDF Split Successfully!</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {splitBlobs.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <button
                        onClick={() => downloadFile(item.blob, item.name)}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>

                {splitBlobs.length > 1 && (
                  <button
                    onClick={downloadAll}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download All ({splitBlobs.length} files)
                  </button>
                )}

                {splitBlobs.length === 1 && (
                  <button
                    onClick={() => downloadFile(splitBlobs[0].blob, splitBlobs[0].name)}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                )}

                <button
                  onClick={clearAll}
                  className="block mx-auto text-sm text-gray-500 hover:text-gray-700"
                >
                  Split another PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Use Our PDF Splitter?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Instant Split', desc: 'Split PDFs instantly in your browser' },
              { icon: Shield, title: '100% Private', desc: 'Files never leave your device' },
              { icon: Clock, title: 'No Limits', desc: 'Split any PDF regardless of size' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need to Merge PDFs?
          </h2>
          <p className="text-orange-100 mb-8">
            Combine multiple PDF files into one document
          </p>
          <Link
            href="/tools/pdf-merge"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-medium rounded-lg hover:shadow-lg transition-all"
          >
            Merge PDFs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
