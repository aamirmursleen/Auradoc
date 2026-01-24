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
import { useTheme } from '@/components/ThemeProvider'

const VerifyPage: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

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
      'CRITICAL': 'bg-red-900/30 text-red-400 border-red-800',
      'HIGH': 'bg-orange-900/30 text-orange-400 border-orange-800',
      'MEDIUM': 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
      'LOW': 'bg-blue-900/30 text-blue-400 border-blue-800',
      'INFO': `${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} ${isDark ? 'text-gray-300' : 'text-gray-600'} ${isDark ? 'border-[#3a3a3a]' : 'border-gray-300'}`
    }
    return colors[severity] || `${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} ${isDark ? 'text-gray-300' : 'text-gray-600'} ${isDark ? 'border-[#3a3a3a]' : 'border-gray-300'}`
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
    <div className={`min-h-screen bg-gradient-to-br ${isDark ? 'from-[#1e1e1e] to-[#1F1F1F]' : 'from-white to-gray-50'}`}>
      <header className={`${isDark ? 'bg-[#1F1F1F]/80' : 'bg-gray-50/80'} backdrop-blur-xl border-b ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className={`p-2 ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#EDE5FF]'} rounded-xl transition-colors`}>
                <Home className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </Link>
              <div className="flex items-center gap-3">
                <div className={`p-3 ${isDark ? 'bg-[#c4ff0e] shadow-[#c4ff0e]/25' : 'bg-[#4C00FF] shadow-[#4C00FF]/25'} rounded-xl shadow-lg`}>
                  <Shield className={`w-7 h-7 ${isDark ? 'text-black' : 'text-white'}`} />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>PDF Edit Detector</h1>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Detect any modifications or tampering</p>
                </div>
              </div>
            </div>
            {uploadedFile && analysisResult && (
              <button onClick={clearUpload} className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#252525]' : 'bg-[#EDE5FF] text-[#26065D] hover:bg-white hover:border hover:border-gray-200'} rounded-xl transition-colors`}>
                <RefreshCw className="w-4 h-4" />Analyze Another
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {!uploadedFile && (
          <div className="space-y-8">
            <div className={`${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-50'} border-2 border-dashed rounded-3xl shadow-xl transition-all ${dragActive ? `${isDark ? 'border-[#c4ff0e] bg-[#c4ff0e]/10' : 'border-[#4C00FF] bg-[#4C00FF]/10'} scale-[1.02]` : `${isDark ? 'border-[#2a2a2a] hover:border-[#c4ff0e]/50' : 'border-gray-300 hover:border-[#4C00FF]/50'}`}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
              <div className="p-12 text-center">
                <div className={`w-24 h-24 ${isDark ? 'bg-[#c4ff0e] shadow-[#c4ff0e]/30' : 'bg-[#4C00FF] shadow-[#4C00FF]/30'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <FileUp className={`w-12 h-12 ${isDark ? 'text-black' : 'text-white'}`} />
                </div>
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-3`}>Upload Your PDF</h2>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-8 max-w-md mx-auto text-lg`}>Drop any PDF here to detect if it has been edited, modified, or tampered with</p>
                <input type="file" className="hidden" id="file-upload" accept=".pdf,application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file) }} />
                <label htmlFor="file-upload" className={`inline-flex items-center gap-3 px-10 py-5 ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#b8f000] shadow-[#c4ff0e]/30 hover:shadow-[#c4ff0e]/40' : 'bg-[#4C00FF] text-white hover:bg-[#3d00cc] shadow-[#4C00FF]/30 hover:shadow-[#4C00FF]/40'} rounded-2xl font-bold text-lg cursor-pointer transition-all shadow-xl hover:shadow-2xl hover:scale-105`}>
                  <Upload className="w-6 h-6" />Select PDF File
                </label>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-6`}>Works with any PDF from any source</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${isDark ? 'bg-[#1F1F1F] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} rounded-2xl p-6 shadow-lg border`}>
                <div className={`w-12 h-12 ${isDark ? 'bg-[#c4ff0e]/20' : 'bg-[#4C00FF]/20'} rounded-xl flex items-center justify-center mb-4`}><Settings className={`w-6 h-6 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} /></div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-2`}>Editing Software Detection</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Detects 50+ PDF editors including iLovePDF, SmallPDF, Adobe Acrobat, and more</p>
              </div>
              <div className={`${isDark ? 'bg-[#1F1F1F] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} rounded-2xl p-6 shadow-lg border`}>
                <div className={`w-12 h-12 ${isDark ? 'bg-[#c4ff0e]/20' : 'bg-[#4C00FF]/20'} rounded-xl flex items-center justify-center mb-4`}><History className={`w-6 h-6 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} /></div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-2`}>Modification History</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tracks all saves, edits, and changes made to the document over time</p>
              </div>
              <div className={`${isDark ? 'bg-[#1F1F1F] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} rounded-2xl p-6 shadow-lg border`}>
                <div className={`w-12 h-12 ${isDark ? 'bg-[#c4ff0e]/20' : 'bg-[#4C00FF]/20'} rounded-xl flex items-center justify-center mb-4`}><PenTool className={`w-6 h-6 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} /></div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-2`}>Annotation Detection</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Finds highlights, stamps, text additions, redactions, and drawings</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className={`${isDark ? 'bg-[#1F1F1F] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} rounded-3xl shadow-xl p-12 text-center border`}>
            <div className={`w-20 h-20 ${isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]'} rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse`}>
              <Loader2 className={`w-10 h-10 ${isDark ? 'text-black' : 'text-white'} animate-spin`} />
            </div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-2`}>Analyzing PDF...</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Scanning for edits, modifications, and tampering signs</p>
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
              <div className={`${isDark ? 'bg-[#1F1F1F] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} rounded-3xl shadow-xl border overflow-hidden`}>
                <div className={`p-6 ${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-white border-gray-200'} border-b`}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-6 h-6 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                      <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>Detected Modifications ({analysisResult.modifications.length})</h3>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-red-900/30 text-red-400 text-sm font-medium rounded-full border border-red-800">{analysisResult.modifications.filter(m => m.severity === 'CRITICAL').length} Critical</span>
                      <span className="px-3 py-1 bg-orange-900/30 text-orange-400 text-sm font-medium rounded-full border border-orange-800">{analysisResult.modifications.filter(m => m.severity === 'HIGH').length} High</span>
                      <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 text-sm font-medium rounded-full border border-yellow-800">{analysisResult.modifications.filter(m => m.severity === 'MEDIUM').length} Medium</span>
                    </div>
                  </div>
                </div>
                <div className={`divide-y ${isDark ? 'divide-[#2a2a2a]' : 'divide-gray-200'}`}>
                  {analysisResult.modifications.map((mod, idx) => {
                    const Icon = getModificationIcon(mod.type)
                    const isExpanded = expandedModifications.has(idx)
                    return (
                      <div key={idx} className={`p-5 ${isDark ? 'hover:bg-[#252525]' : 'hover:bg-white'} transition-colors cursor-pointer`} onClick={() => toggleModification(idx)}>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${getSeverityColor(mod.severity).replace('text-', 'bg-').replace('-700', '-100')}`}>
                            <Icon className={`w-5 h-5 ${getSeverityColor(mod.severity).split(' ')[1]}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{mod.title}</h4>
                                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getSeverityColor(mod.severity)}`}>{mod.severity}</span>
                                </div>
                                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{mod.description}</p>
                              </div>
                              <button className={`p-2 ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#EDE5FF]'} rounded-lg transition-colors flex-shrink-0`}>
                                {isExpanded ? <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} /> : <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />}
                              </button>
                            </div>
                            {isExpanded && mod.details && (
                              <div className={`mt-4 p-4 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} rounded-xl`}>
                                <pre className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} whitespace-pre-wrap font-mono`}>{mod.details}</pre>
                                {mod.timestamp && <div className={`mt-3 flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}><Clock className="w-4 h-4" />{mod.timestamp}</div>}
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
              <div className={`${isDark ? 'bg-[#1F1F1F] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} rounded-3xl shadow-xl border p-8 text-center`}>
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-800"><CheckCircle2 className="w-8 h-8 text-green-400" /></div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-2`}>No Modification Signs Detected</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-md mx-auto`}>This PDF appears to be in its original state. No editing software signatures, incremental updates, or other modification indicators were found.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${isDark ? 'bg-[#1F1F1F] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} rounded-2xl shadow-lg border overflow-hidden`}>
                <button onClick={() => setShowMetadata(!showMetadata)} className={`w-full p-4 flex items-center justify-between ${isDark ? 'hover:bg-[#252525]' : 'hover:bg-white'} transition-colors`}>
                  <div className="flex items-center gap-3"><Info className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} /><span className={`font-bold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>Document Metadata</span></div>
                  {showMetadata ? <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} /> : <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />}
                </button>
                {showMetadata && (
                  <div className="p-4 pt-0 space-y-3">
                    {Object.entries(analysisResult.metadata).map(([key, value]) => value && (
                      <div key={key} className={`flex justify-between items-start gap-4 py-2 border-b ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} last:border-0`}>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} capitalize`}>{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className={`text-sm ${isDark ? 'text-white' : 'text-[#26065D]'} text-right font-mono max-w-[60%] break-all`}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={`${isDark ? 'bg-[#1F1F1F] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} rounded-2xl shadow-lg border overflow-hidden`}>
                <button onClick={() => setShowStructure(!showStructure)} className={`w-full p-4 flex items-center justify-between ${isDark ? 'hover:bg-[#252525]' : 'hover:bg-white'} transition-colors`}>
                  <div className="flex items-center gap-3"><Layers className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} /><span className={`font-bold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>PDF Structure</span></div>
                  {showStructure ? <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} /> : <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />}
                </button>
                {showStructure && (
                  <div className="p-4 pt-0 grid grid-cols-2 gap-3">
                    <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} rounded-lg`}><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>PDF Version</p><p className={`font-bold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{analysisResult.structureInfo.pdfVersion || 'Unknown'}</p></div>
                    <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} rounded-lg`}><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pages</p><p className={`font-bold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{analysisResult.structureInfo.pageCount}</p></div>
                    <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} rounded-lg`}><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Saves</p><p className={`font-bold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{analysisResult.structureInfo.incrementalUpdateCount}</p></div>
                    <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} rounded-lg`}><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Encrypted</p><p className={`font-bold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{analysisResult.structureInfo.isEncrypted ? 'Yes' : 'No'}</p></div>
                  </div>
                )}
              </div>
            </div>

            {(analysisResult.editingHistory.software.length > 0 || analysisResult.editingHistory.editDates.length > 0) && (
              <div className={`${isDark ? 'bg-[#1F1F1F] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} rounded-2xl shadow-lg border p-6`}>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-4 flex items-center gap-2`}><History className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />Editing History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysisResult.editingHistory.software.length > 0 && (
                    <div><p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Software Used</p>
                      <div className="flex flex-wrap gap-2">{analysisResult.editingHistory.software.map((sw, idx) => <span key={idx} className={`px-3 py-1.5 ${isDark ? 'bg-[#2a2a2a] text-gray-300' : 'bg-[#EDE5FF] text-gray-600'} rounded-lg text-sm`}>{sw}</span>)}</div>
                    </div>
                  )}
                  {analysisResult.editingHistory.editDates.length > 0 && (
                    <div><p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Edit Dates</p>
                      <div className="space-y-1">{analysisResult.editingHistory.editDates.slice(0, 5).map((date, idx) => <div key={idx} className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}><Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />{date}</div>)}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={clearUpload} className={`inline-flex items-center gap-3 px-8 py-4 ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#b8f000] shadow-[#c4ff0e]/25' : 'bg-[#4C00FF] text-white hover:bg-[#3d00cc] shadow-[#4C00FF]/25'} rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl`}>
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
