'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Shield, ShieldCheck, ShieldX, ShieldAlert, Upload, FileText, CheckCircle2, XCircle,
  AlertTriangle, Clock, Loader2, Info, X, FileUp, Calendar, Settings, Edit3,
  FileWarning, Layers, PenTool, Lock, Paperclip, Code, History, ChevronDown,
  ChevronUp, RefreshCw, Home
} from 'lucide-react'
import { analyzePDF, PDFAnalysisResult, PDFModification } from '@/lib/pdf-analysis'
import { formatFileSize } from '@/lib/hash'

const VerifyPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<PDFAnalysisResult | null>(null)
  const [expandedModifications, setExpandedModifications] = useState<Set<number>>(new Set())
  const [showMetadata, setShowMetadata] = useState(false)
  const [showStructure, setShowStructure] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }, [])

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file')
      return
    }
    setUploadedFile(file)
    setLoading(true)
    setAnalysisResult(null)
    try {
      const result = await analyzePDF(file)
      setAnalysisResult(result)
    } catch (error) {
      console.error('Error analyzing PDF:', error)
      alert('Error analyzing PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const clearUpload = () => {
    setUploadedFile(null)
    setAnalysisResult(null)
    setExpandedModifications(new Set())
  }

  const toggleModification = (index: number) => {
    const newExpanded = new Set(expandedModifications)
    if (newExpanded.has(index)) newExpanded.delete(index)
    else newExpanded.add(index)
    setExpandedModifications(newExpanded)
  }

  const getModificationIcon = (type: PDFModification['type']) => {
    const icons: Record<string, any> = {
      'METADATA_CHANGE': Calendar, 'INCREMENTAL_UPDATE': Layers, 'EDITING_SOFTWARE': Settings,
      'ANNOTATION': PenTool, 'FORM_FIELD': Edit3, 'CONTENT_STREAM': Code, 'REDACTION': XCircle,
      'DIGITAL_SIGNATURE': Lock, 'EMBEDDED_FILE': Paperclip, 'PAGE_MODIFICATION': FileWarning,
      'XMP_METADATA': History
    }
    return icons[type] || AlertTriangle
  }

  const getSeverityColor = (severity: PDFModification['severity']) => {
    const colors: Record<string, string> = {
      'CRITICAL': 'bg-red-100 text-red-700 border-red-300',
      'HIGH': 'bg-orange-100 text-orange-700 border-orange-300',
      'MEDIUM': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'LOW': 'bg-blue-100 text-blue-700 border-blue-300',
      'INFO': 'bg-gray-100 text-gray-700 border-gray-300'
    }
    return colors[severity] || 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const getStatusColors = (status: PDFAnalysisResult['overallStatus']) => {
    const statuses: Record<string, any> = {
      'DEFINITELY_MODIFIED': { bg: 'bg-gradient-to-br from-red-500 to-red-600', icon: ShieldX, text: 'MODIFIED', subtitle: 'This PDF has been edited' },
      'LIKELY_MODIFIED': { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', icon: ShieldAlert, text: 'LIKELY MODIFIED', subtitle: 'Signs of editing detected' },
      'ORIGINAL': { bg: 'bg-gradient-to-br from-green-500 to-green-600', icon: ShieldCheck, text: 'APPEARS ORIGINAL', subtitle: 'No modification signs found' }
    }
    return statuses[status]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl shadow-lg shadow-cyan-500/25">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">PDF Edit Detector</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Detect any modifications or tampering</p>
                </div>
              </div>
            </div>
            {uploadedFile && analysisResult && (
              <button onClick={clearUpload} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <RefreshCw className="w-4 h-4" />Analyze Another
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {!uploadedFile && (
          <div className="space-y-8">
            <div className={`bg-white dark:bg-gray-900 border-2 border-dashed rounded-3xl shadow-xl transition-all ${dragActive ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 scale-[1.02]' : 'border-gray-300 dark:border-gray-700 hover:border-cyan-500/50'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
                  <FileUp className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Upload Your PDF</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">Drop any PDF here to detect if it has been edited, modified, or tampered with</p>
                <input type="file" className="hidden" id="file-upload" accept=".pdf,application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file) }} />
                <label htmlFor="file-upload" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-bold text-lg cursor-pointer hover:from-cyan-600 hover:to-purple-700 transition-all shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-105">
                  <Upload className="w-6 h-6" />Select PDF File
                </label>
                <p className="text-sm text-gray-500 mt-6">Works with any PDF from any source</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-xl flex items-center justify-center mb-4"><Settings className="w-6 h-6 text-cyan-600" /></div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Editing Software Detection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Detects 50+ PDF editors including iLovePDF, SmallPDF, Adobe Acrobat, and more</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4"><History className="w-6 h-6 text-purple-600" /></div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Modification History</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tracks all saves, edits, and changes made to the document over time</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-4"><PenTool className="w-6 h-6 text-orange-600" /></div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Annotation Detection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Finds highlights, stamps, text additions, redactions, and drawings</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-12 text-center border border-gray-200 dark:border-gray-800">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analyzing PDF...</h2>
            <p className="text-gray-600 dark:text-gray-400">Scanning for edits, modifications, and tampering signs</p>
          </div>
        )}

        {analysisResult && uploadedFile && !loading && (
          <div className="space-y-6">
            {(() => {
              const status = getStatusColors(analysisResult.overallStatus)
              const StatusIcon = status.icon
              return (
                <div className={`${status.bg} rounded-3xl p-8 shadow-2xl text-white`}>
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm"><StatusIcon className="w-12 h-12" /></div>
                      <div><h2 className="text-3xl font-black mb-1">{status.text}</h2><p className="text-white/80 text-lg">{status.subtitle}</p></div>
                    </div>
                    <div className="text-right"><p className="text-white/60 text-sm">Confidence</p><p className="text-2xl font-bold">{analysisResult.confidence}</p></div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="flex items-center gap-3 flex-wrap">
                      <FileText className="w-5 h-5 text-white/60" />
                      <span className="font-medium">{uploadedFile.name}</span>
                      <span className="text-white/60">•</span>
                      <span className="text-white/80">{formatFileSize(uploadedFile.size)}</span>
                      <span className="text-white/60">•</span>
                      <span className="text-white/80">{analysisResult.structureInfo.pageCount} pages</span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm"><p className="text-white/90">{analysisResult.summary}</p></div>
                </div>
              )
            })()}

            {analysisResult.modifications.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-orange-500" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detected Modifications ({analysisResult.modifications.length})</h3>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">{analysisResult.modifications.filter(m => m.severity === 'CRITICAL').length} Critical</span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">{analysisResult.modifications.filter(m => m.severity === 'HIGH').length} High</span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">{analysisResult.modifications.filter(m => m.severity === 'MEDIUM').length} Medium</span>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {analysisResult.modifications.map((mod, idx) => {
                    const Icon = getModificationIcon(mod.type)
                    const isExpanded = expandedModifications.has(idx)
                    return (
                      <div key={idx} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => toggleModification(idx)}>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${getSeverityColor(mod.severity).replace('text-', 'bg-').replace('-700', '-100')}`}>
                            <Icon className={`w-5 h-5 ${getSeverityColor(mod.severity).split(' ')[1]}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                  <h4 className="font-bold text-gray-900 dark:text-white">{mod.title}</h4>
                                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getSeverityColor(mod.severity)}`}>{mod.severity}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">{mod.description}</p>
                              </div>
                              <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0">
                                {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                              </button>
                            </div>
                            {isExpanded && mod.details && (
                              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">{mod.details}</pre>
                                {mod.timestamp && <div className="mt-3 flex items-center gap-2 text-sm text-gray-500"><Clock className="w-4 h-4" />{mod.timestamp}</div>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {analysisResult.modifications.length === 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8 text-green-600" /></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Modification Signs Detected</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">This PDF appears to be in its original state. No editing software signatures, incremental updates, or other modification indicators were found.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button onClick={() => setShowMetadata(!showMetadata)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3"><Info className="w-5 h-5 text-cyan-500" /><span className="font-bold text-gray-900 dark:text-white">Document Metadata</span></div>
                  {showMetadata ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                {showMetadata && (
                  <div className="p-4 pt-0 space-y-3">
                    {Object.entries(analysisResult.metadata).map(([key, value]) => value && (
                      <div key={key} className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm text-gray-900 dark:text-white text-right font-mono max-w-[60%] break-all">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button onClick={() => setShowStructure(!showStructure)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3"><Layers className="w-5 h-5 text-purple-500" /><span className="font-bold text-gray-900 dark:text-white">PDF Structure</span></div>
                  {showStructure ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                {showStructure && (
                  <div className="p-4 pt-0 grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"><p className="text-xs text-gray-500">PDF Version</p><p className="font-bold text-gray-900 dark:text-white">{analysisResult.structureInfo.pdfVersion || 'Unknown'}</p></div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"><p className="text-xs text-gray-500">Pages</p><p className="font-bold text-gray-900 dark:text-white">{analysisResult.structureInfo.pageCount}</p></div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"><p className="text-xs text-gray-500">Saves</p><p className="font-bold text-gray-900 dark:text-white">{analysisResult.structureInfo.incrementalUpdateCount}</p></div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"><p className="text-xs text-gray-500">Encrypted</p><p className="font-bold text-gray-900 dark:text-white">{analysisResult.structureInfo.isEncrypted ? 'Yes' : 'No'}</p></div>
                  </div>
                )}
              </div>
            </div>

            {(analysisResult.editingHistory.software.length > 0 || analysisResult.editingHistory.editDates.length > 0) && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><History className="w-5 h-5 text-purple-500" />Editing History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysisResult.editingHistory.software.length > 0 && (
                    <div><p className="text-sm text-gray-500 mb-2">Software Used</p>
                      <div className="flex flex-wrap gap-2">{analysisResult.editingHistory.software.map((sw, idx) => <span key={idx} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm">{sw}</span>)}</div>
                    </div>
                  )}
                  {analysisResult.editingHistory.editDates.length > 0 && (
                    <div><p className="text-sm text-gray-500 mb-2">Edit Dates</p>
                      <div className="space-y-1">{analysisResult.editingHistory.editDates.slice(0, 5).map((date, idx) => <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><Clock className="w-4 h-4 text-gray-400" />{date}</div>)}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={clearUpload} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-bold hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-xl">
                <RefreshCw className="w-5 h-5" />Analyze Another PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyPage
