'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import * as pdfjsLib from 'pdfjs-dist'
import {
  FileText,
  Check,
  Loader2,
  PenTool,
  AlertCircle,
  Shield,
  Clock,
  CheckCircle,
  X,
  Lock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  RotateCcw
} from 'lucide-react'

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

const SignatureCanvas = dynamic(() => import('@/components/signature/SignatureCanvas'), {
  ssr: false,
  loading: () => <div className="h-40 bg-[#252525] rounded-xl animate-pulse" />
})

interface SignerInfo {
  name: string
  email: string
  order: number
  status: string
}

interface SignatureFieldInfo {
  id: string
  signerOrder: number
  x: number
  y: number
  width: number
  height: number
  type: string
  label: string
  pageNumber?: number
  page?: number // Support both field names
}

interface DocumentData {
  id: string
  documentName: string
  documentUrl: string
  senderName: string
  senderEmail: string
  message?: string
  dueDate?: string
  signers: SignerInfo[]
  signatureFields: SignatureFieldInfo[]
  currentSignerIndex: number
}

export default function SignDocumentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const documentId = params.id as string
  const signerEmail = searchParams.get('email')
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [documentData, setDocumentData] = useState<DocumentData | null>(null)
  const [currentSigner, setCurrentSigner] = useState<SignerInfo | null>(null)
  const [myFields, setMyFields] = useState<SignatureFieldInfo[]>([])

  // PDF state
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [pageHeights, setPageHeights] = useState<number[]>([])
  const [pageWidths, setPageWidths] = useState<number[]>([])

  // Signing state
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [signedFields, setSignedFields] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)

  const pagesContainerRef = useRef<HTMLDivElement>(null)
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const documentContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/signing-requests/${documentId}?email=${signerEmail}&token=${token}`)
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Failed to load document')
        setDocumentData(data.data)
        const signer = data.data.signers.find((s: SignerInfo) => s.email.toLowerCase() === signerEmail?.toLowerCase())
        setCurrentSigner(signer || null)
        const fields = data.data.signatureFields.filter((f: SignatureFieldInfo) => f.signerOrder === signer?.order)
        setMyFields(fields)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    if (documentId && signerEmail) fetchDocument()
    else { setError('Invalid signing link'); setLoading(false) }
  }, [documentId, signerEmail, token])

  useEffect(() => {
    const loadPdf = async () => {
      if (!documentData?.documentUrl) {
        setPdfError('No document data available')
        return
      }
      try {
        setPdfLoading(true)
        setPdfError(null)

        // Handle different document URL formats
        let pdfSource: string | { data: Uint8Array } = documentData.documentUrl

        // If it's a base64 string without data URL prefix, convert it
        if (documentData.documentUrl.startsWith('data:application/pdf;base64,')) {
          // Already a data URL, use as-is
          pdfSource = documentData.documentUrl
        } else if (documentData.documentUrl.startsWith('data:')) {
          // Other data URL format
          pdfSource = documentData.documentUrl
        } else if (!documentData.documentUrl.startsWith('http') && !documentData.documentUrl.startsWith('/')) {
          // Likely raw base64 - convert to data URL
          pdfSource = `data:application/pdf;base64,${documentData.documentUrl}`
        }

        const loadingTask = pdfjsLib.getDocument({
          url: pdfSource,
          cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/standard_fonts/`,
        })
        const pdf = await loadingTask.promise
        setPdfDoc(pdf)
        setTotalPages(pdf.numPages)
        canvasRefs.current = new Array(pdf.numPages).fill(null)
      } catch (err) {
        console.error('Error loading PDF:', err)
        setPdfError('Failed to load PDF document. Please contact the sender.')
      } finally {
        setPdfLoading(false)
      }
    }
    loadPdf()
  }, [documentData?.documentUrl])

  const renderAllPages = useCallback(async () => {
    if (!pdfDoc) return
    const heights: number[] = []
    const widths: number[] = []
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const canvas = canvasRefs.current[i - 1]
      if (!canvas) continue
      try {
        const page = await pdfDoc.getPage(i)
        const viewport = page.getViewport({ scale })
        canvas.height = viewport.height
        canvas.width = viewport.width
        heights.push(viewport.height)
        widths.push(viewport.width)
        const context = canvas.getContext('2d')
        if (context) await page.render({ canvasContext: context, viewport }).promise
      } catch (err) { console.error('Error rendering page', i, err) }
    }
    setPageHeights(heights)
    setPageWidths(widths)
  }, [pdfDoc, scale])

  useEffect(() => {
    if (pdfDoc && canvasRefs.current.length === pdfDoc.numPages) {
      const timer = setTimeout(() => renderAllPages(), 100)
      return () => clearTimeout(timer)
    }
  }, [pdfDoc, renderAllPages, totalPages])

  useEffect(() => { if (pdfDoc) renderAllPages() }, [scale, pdfDoc, renderAllPages])

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3))
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))
  const fitToWidth = () => setScale(1.0)

  const handleSignatureCreated = (sig: string | null) => {
    if (sig && activeFieldId) {
      setSignature(sig)
      setSignedFields(prev => new Set([...Array.from(prev), activeFieldId]))
      setShowSignaturePad(false)
      setActiveFieldId(null)
    }
  }

  const handleFieldClick = (fieldId: string) => {
    if (signedFields.has(fieldId)) return
    setActiveFieldId(fieldId)
    setShowSignaturePad(true)
  }

  const removeSignature = (fieldId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSignedFields(prev => {
      const newSet = new Set(prev)
      newSet.delete(fieldId)
      return newSet
    })
  }

  const handleSubmit = async () => {
    if (!signature || signedFields.size !== myFields.length) { setError('Please sign all required fields'); return }
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch(`/api/signing-requests/${documentId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerEmail, token, signature, signedFields: Array.from(signedFields) })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to submit signature')
      setIsComplete(true)
    } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred') }
    finally { setIsSubmitting(false) }
  }

  const getFieldPosition = (field: SignatureFieldInfo) => {
    // Support both 'page' and 'pageNumber' field names
    const pageNum = field.page || field.pageNumber || 1
    let topOffset = 0
    for (let i = 0; i < pageNum - 1; i++) topOffset += (pageHeights[i] || 842) + 16

    // Fields are stored in original PDF coordinate space (when zoom=1 in sign-document)
    // Scale them according to current viewing scale
    return {
      left: field.x * scale,
      top: topOffset + (field.y * scale),
      width: field.width * scale,
      height: field.height * scale,
      pageNum
    }
  }

  if (loading) return (<div className="min-h-screen bg-gradient-to-br bg-[#1e1e1e] flex items-center justify-center"><div className="text-center"><Loader2 className="w-12 h-12 animate-spin text-[#c4ff0e] mx-auto mb-4" /><p className="text-gray-300">Loading document...</p></div></div>)

  if (error && !documentData) return (<div className="min-h-screen bg-gradient-to-br bg-[#1e1e1e] flex items-center justify-center p-4"><div className="card max-w-md w-full p-8 text-center"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-8 h-8 text-red-600" /></div><h1 className="text-xl font-bold text-white mb-2">Unable to Load Document</h1><p className="text-gray-300 mb-4">{error}</p><p className="text-sm text-gray-400">This link may have expired or is invalid. Please contact the sender.</p></div></div>)

  if (isComplete) return (<div className="min-h-screen bg-gradient-to-br bg-[#1e1e1e] flex items-center justify-center p-4"><div className="card max-w-md w-full p-8 text-center"><div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-600" /></div><h1 className="text-2xl font-bold text-white mb-2">Document Signed!</h1><p className="text-gray-300 mb-6">Thank you for signing. {documentData?.senderName} has been notified.</p><div className="bg-[#252525] rounded-xl p-4 mb-6 text-left"><p className="text-sm text-gray-400 mb-1">Document</p><p className="font-medium text-white">{documentData?.documentName}</p><p className="text-sm text-gray-400 mt-3 mb-1">Signed at</p><p className="font-medium text-white">{new Date().toLocaleString()}</p></div><div className="flex items-center justify-center gap-4 text-sm text-gray-400"><div className="flex items-center gap-1"><Shield className="w-4 h-4 text-green-600" /><span>Legally Binding</span></div><div className="flex items-center gap-1"><Lock className="w-4 h-4 text-green-600" /><span>Secured</span></div></div></div></div>)

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#1e1e1e]">
      <header className="bg-[#1F1F1F] border-b border-[#2a2a2a] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#c4ff0e]/20 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#c4ff0e]" />
              </div>
              <div>
                <h1 className="font-semibold text-white">{documentData?.documentName}</h1>
                <p className="text-sm text-gray-400">From {documentData?.senderName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Lock className="w-4 h-4" />
              <span>Secure Signing</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-6">
              <h3 className="font-semibold text-white mb-4">Signing as</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#c4ff0e]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#c4ff0e] font-bold text-lg">{currentSigner?.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium text-white">{currentSigner?.name}</p>
                  <p className="text-sm text-gray-400">{currentSigner?.email}</p>
                </div>
              </div>
            </div>

            {documentData?.message && (
              <div className="card p-6 bg-yellow-50 border-yellow-500/30">
                <h3 className="font-semibold text-white mb-2">Message from sender</h3>
                <p className="text-gray-300 text-sm italic">&quot;{documentData.message}&quot;</p>
              </div>
            )}

            <div className="card p-6">
              <h3 className="font-semibold text-white mb-4">Required Signatures ({signedFields.size}/{myFields.length})</h3>
              <div className="space-y-2">
                {myFields.map((field) => (
                  <div key={field.id} className={'flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ' + (signedFields.has(field.id) ? 'bg-green-50 border-green-400' : 'bg-[#252525] border-[#2a2a2a] hover:border-[#c4ff0e]')} onClick={() => handleFieldClick(field.id)}>
                    {signedFields.has(field.id) ? <CheckCircle className="w-5 h-5 text-green-600" /> : <PenTool className="w-5 h-5 text-gray-300" />}
                    <span className={'font-medium flex-1 ' + (signedFields.has(field.id) ? 'text-green-400' : 'text-gray-300')}>{field.type === 'signature' ? 'Signature' : field.type === 'initials' ? 'Initials' : 'Date'}</span>
                    {signedFields.has(field.id) ? (
                      <button
                        onClick={(e) => removeSignature(field.id, e)}
                        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                        title="Re-sign"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleSubmit} disabled={signedFields.size !== myFields.length || isSubmitting} className="w-full py-4 bg-gradient-to-r from-[#c4ff0e] to-[#c4ff0e] text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:from-[#b3e60d] hover:to-[#b3e60d] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (<><Loader2 className="w-6 h-6 animate-spin" />Submitting...</>) : (<><Check className="w-6 h-6" />Complete Signing</>)}
            </button>

            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}

            <div className="card p-4 bg-[#252525]">
              <div className="flex items-center justify-around text-xs text-gray-400">
                <div className="flex items-center gap-1"><Shield className="w-4 h-4 text-green-600" /><span>Encrypted</span></div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-green-600" /><span>Timestamped</span></div>
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-600" /><span>Legal</span></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card p-3 mb-4 flex items-center justify-between sticky top-20 z-40 bg-[#1F1F1F]">
              <div className="flex items-center gap-2"><span className="text-sm font-medium text-gray-300">{totalPages} {totalPages === 1 ? 'page' : 'pages'}</span></div>
              <div className="flex items-center gap-2">
                <button onClick={zoomOut} disabled={scale <= 0.5} className="p-2 hover:bg-[#252525] rounded-lg disabled:opacity-50" title="Zoom out"><ZoomOut className="w-5 h-5" /></button>
                <span className="text-sm font-medium text-gray-300 min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
                <button onClick={zoomIn} disabled={scale >= 3} className="p-2 hover:bg-[#252525] rounded-lg disabled:opacity-50" title="Zoom in"><ZoomIn className="w-5 h-5" /></button>
                <button onClick={fitToWidth} className="p-2 hover:bg-[#252525] rounded-lg" title="Reset zoom"><Maximize2 className="w-5 h-5" /></button>
              </div>
            </div>

            <div ref={documentContainerRef} className="card p-4 bg-[#2a2a2a] max-h-[80vh] overflow-auto">
              {pdfLoading ? (<div className="bg-[#1F1F1F] rounded-lg shadow-lg flex items-center justify-center mx-auto" style={{ width: '595px', height: '842px' }}><div className="text-center"><Loader2 className="w-12 h-12 animate-spin text-[#c4ff0e] mx-auto mb-4" /><p className="text-gray-300">Loading PDF...</p></div></div>)
              : pdfError ? (<div className="bg-[#1F1F1F] rounded-lg shadow-lg flex items-center justify-center mx-auto" style={{ width: '595px', height: '842px' }}><div className="text-center"><AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" /><p className="text-gray-300">{pdfError}</p></div></div>)
              : (
                <div ref={pagesContainerRef} className="flex flex-col items-center gap-4 relative">
                  {Array.from({ length: totalPages }, (_, i) => (<div key={i} className="relative"><canvas ref={(el) => { canvasRefs.current[i] = el }} className="bg-[#1F1F1F] rounded-lg shadow-lg" /><div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Page {i + 1} of {totalPages}</div></div>))}
                  {myFields.map((field) => {
                    const pos = getFieldPosition(field)
                    // Use actual page width instead of hardcoded 595
                    const pageIndex = (pos.pageNum || 1) - 1
                    const actualPageWidth = pageWidths[pageIndex] || 595 * scale
                    const leftCalc = 'calc(50% - ' + (actualPageWidth / 2) + 'px + ' + pos.left + 'px)'
                    return (
                      <div key={field.id} onClick={() => handleFieldClick(field.id)} className={'absolute border-2 rounded-lg cursor-pointer transition-all z-10 group ' + (signedFields.has(field.id) ? 'border-green-500 bg-green-50/90' : 'border-dashed border-[#c4ff0e] bg-[#c4ff0e]/20 hover:bg-[#c4ff0e]/20 animate-pulse')} style={{ left: leftCalc, top: pos.top, width: pos.width, height: pos.height }}>
                        {signedFields.has(field.id) && signature ? (
                          <>
                            <img src={signature} alt="Your signature" className="w-full h-full object-contain p-1" />
                            {/* Delete/Re-sign button */}
                            <button
                              onClick={(e) => removeSignature(field.id, e)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg z-20"
                              title="Remove signature"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[#c4ff0e] font-medium text-sm flex items-center gap-1"><PenTool className="w-4 h-4" />Click to sign</span>
                          </div>
                        )}
                        {!signedFields.has(field.id) && (<div className="absolute -top-6 left-0"><span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-500 text-white whitespace-nowrap animate-bounce">Sign here</span></div>)}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSignaturePad && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F1F1F] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Create Your Signature</h3>
                <button onClick={() => { setShowSignaturePad(false); setActiveFieldId(null) }} className="p-2 hover:bg-[#252525] rounded-lg transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <SignatureCanvas
                onSignatureChange={handleSignatureCreated}
                onCancel={() => { setShowSignaturePad(false); setActiveFieldId(null) }}
                showDoneButton={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
