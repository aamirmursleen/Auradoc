'use client'

import React, { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import {
  Upload,
  FileText,
  Users,
  Send,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  Download,
  Table,
  ChevronRight,
  ArrowLeft,
  Trash2,
  Edit2,
  FileSpreadsheet,
} from 'lucide-react'

interface Recipient {
  name: string
  email: string
  status: 'pending' | 'sending' | 'sent' | 'failed'
  error?: string
}

interface CSVRow {
  [key: string]: string
}

type Step = 'upload' | 'csv' | 'map' | 'review' | 'sending' | 'done'

export default function BulkSendPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // Step state
  const [step, setStep] = useState<Step>('upload')

  // Document state
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [documentData, setDocumentData] = useState<string | null>(null)
  const [documentName, setDocumentName] = useState('')

  // CSV state
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvRows, setCsvRows] = useState<CSVRow[]>([])
  const [nameColumn, setNameColumn] = useState<string>('')
  const [emailColumn, setEmailColumn] = useState<string>('')

  // Recipients & sending
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [message, setMessage] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [sendingProgress, setSendingProgress] = useState(0)
  const [sendResults, setSendResults] = useState<{ sent: number; failed: number }>({ sent: 0, failed: 0 })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)

  // Handle PDF upload
  const handleDocumentUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      alert('File size must be under 25MB')
      return
    }

    setDocumentFile(file)
    setDocumentName(file.name.replace('.pdf', ''))

    const reader = new FileReader()
    reader.onload = (ev) => {
      setDocumentData(ev.target?.result as string)
      setStep('csv')
    }
    reader.readAsDataURL(file)
  }, [])

  // Parse CSV
  const parseCSV = useCallback((text: string): { headers: string[]; rows: CSVRow[] } => {
    const lines = text.split(/\r?\n/).filter(line => line.trim())
    if (lines.length < 2) return { headers: [], rows: [] }

    // Parse header
    const headers = parseCSVLine(lines[0])
    const rows: CSVRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length === 0) continue
      const row: CSVRow = {}
      headers.forEach((h, idx) => {
        row[h] = values[idx] || ''
      })
      rows.push(row)
    }

    return { headers, rows }
  }, [])

  // Parse a single CSV line handling quoted fields
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  // Handle CSV upload
  const handleCSVUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const { headers, rows } = parseCSV(text)

      if (headers.length === 0 || rows.length === 0) {
        alert('Invalid CSV file. Make sure it has headers and at least one data row.')
        return
      }

      setCsvHeaders(headers)
      setCsvRows(rows)

      // Auto-detect columns
      const nameLower = headers.map(h => h.toLowerCase())
      const nameIdx = nameLower.findIndex(h => h === 'name' || h === 'full name' || h === 'fullname' || h === 'recipient name' || h === 'signer name' || h === 'first name')
      const emailIdx = nameLower.findIndex(h => h === 'email' || h === 'email address' || h === 'e-mail' || h === 'recipient email' || h === 'signer email')

      if (nameIdx >= 0) setNameColumn(headers[nameIdx])
      if (emailIdx >= 0) setEmailColumn(headers[emailIdx])

      setStep('map')
    }
    reader.readAsText(file)
  }, [parseCSV])

  // Build recipients from mapped columns
  const buildRecipients = useCallback(() => {
    if (!nameColumn || !emailColumn) {
      alert('Please map both Name and Email columns')
      return
    }

    const validRecipients: Recipient[] = []
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    csvRows.forEach(row => {
      const name = row[nameColumn]?.trim()
      const email = row[emailColumn]?.trim()

      if (name && email && emailRegex.test(email)) {
        validRecipients.push({ name, email, status: 'pending' })
      }
    })

    if (validRecipients.length === 0) {
      alert('No valid recipients found. Check that Name and Email columns have data with valid email addresses.')
      return
    }

    setRecipients(validRecipients)
    setStep('review')
  }, [nameColumn, emailColumn, csvRows])

  // Remove a recipient
  const removeRecipient = (idx: number) => {
    setRecipients(prev => prev.filter((_, i) => i !== idx))
  }

  // Send all signing requests
  const handleBulkSend = useCallback(async () => {
    if (recipients.length === 0 || !documentData) return

    setStep('sending')
    setSendingProgress(0)
    let sent = 0
    let failed = 0

    const senderName = user ? ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || 'MamaSign User' : 'MamaSign User'

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i]

      // Update status to sending
      setRecipients(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'sending' } : r))

      try {
        const res = await fetch('/api/signing-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentName: documentName,
            documentData: documentData,
            signers: [{ name: recipient.name, email: recipient.email, order: 1 }],
            signatureFields: [],
            message: message || undefined,
            dueDate: dueDate || undefined,
            senderName: senderName,
          }),
        })

        const json = await res.json()

        if (json.success) {
          sent++
          setRecipients(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'sent' } : r))
        } else {
          failed++
          setRecipients(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'failed', error: json.message } : r))
        }
      } catch (err) {
        failed++
        setRecipients(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'failed', error: 'Network error' } : r))
      }

      setSendingProgress(Math.round(((i + 1) / recipients.length) * 100))

      // Small delay between requests to avoid rate limiting
      if (i < recipients.length - 1) {
        await new Promise(r => setTimeout(r, 500))
      }
    }

    setSendResults({ sent, failed })
    setStep('done')
  }, [recipients, documentData, documentName, message, dueDate, user])

  // Download sample CSV
  const downloadSampleCSV = () => {
    const csv = 'Name,Email\nJohn Smith,john@example.com\nJane Doe,jane@example.com\nBob Wilson,bob@example.com'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bulk-send-sample.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
          <p className="text-muted-foreground">Please sign in to use Bulk Send.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/documents')}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Documents
        </button>
        <h1 className="text-2xl font-bold text-foreground">Bulk Send</h1>
        <p className="text-muted-foreground mt-1">Send a document to multiple recipients at once via CSV upload.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {[
          { key: 'upload', label: 'Upload PDF', num: 1 },
          { key: 'csv', label: 'Upload CSV', num: 2 },
          { key: 'map', label: 'Map Columns', num: 3 },
          { key: 'review', label: 'Review & Send', num: 4 },
        ].map((s, i) => {
          const stepOrder = ['upload', 'csv', 'map', 'review', 'sending', 'done']
          const currentIdx = stepOrder.indexOf(step)
          const thisIdx = stepOrder.indexOf(s.key)
          const isCompleted = currentIdx > thisIdx
          const isCurrent = step === s.key || (step === 'sending' && s.key === 'review') || (step === 'done' && s.key === 'review')

          return (
            <React.Fragment key={s.key}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                  isCompleted ? 'bg-primary text-primary-foreground' :
                  isCurrent ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-sm whitespace-nowrap ${isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </div>
              {i < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step 1: Upload PDF */}
      {step === 'upload' && (
        <div className="border border-border rounded-xl p-8 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Upload Your Document</h2>
          <p className="text-muted-foreground mb-6">Upload the PDF document you want to send to multiple recipients.</p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleDocumentUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Upload className="w-5 h-5" />
            Choose PDF File
          </button>
          <p className="text-xs text-muted-foreground mt-3">Maximum file size: 25MB</p>
        </div>
      )}

      {/* Step 2: Upload CSV */}
      {step === 'csv' && (
        <div className="space-y-6">
          {/* Document summary */}
          <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
            <FileText className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{documentFile?.name}</p>
              <p className="text-xs text-muted-foreground">{((documentFile?.size || 0) / 1024).toFixed(1)} KB</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          </div>

          <div className="border border-border rounded-xl p-8 text-center">
            <FileSpreadsheet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Upload Recipients CSV</h2>
            <p className="text-muted-foreground mb-6">Upload a CSV file with recipient names and email addresses.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
              <button
                onClick={() => csvInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Upload className="w-5 h-5" />
                Choose CSV File
              </button>
              <button
                onClick={downloadSampleCSV}
                className="inline-flex items-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download Sample CSV
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">CSV must have headers. Required: Name and Email columns.</p>
          </div>
        </div>
      )}

      {/* Step 3: Map Columns */}
      {step === 'map' && (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-1">Map CSV Columns</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Select which columns contain the recipient name and email. Found {csvRows.length} rows.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name Column</label>
                <select
                  value={nameColumn}
                  onChange={e => setNameColumn(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Select column...</option>
                  {csvHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Column</label>
                <select
                  value={emailColumn}
                  onChange={e => setEmailColumn(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Select column...</option>
                  {csvHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">#</th>
                      {csvHeaders.map(h => (
                        <th
                          key={h}
                          className={`px-3 py-2 text-left font-medium ${
                            h === nameColumn ? 'text-primary bg-primary/5' :
                            h === emailColumn ? 'text-primary bg-primary/5' :
                            'text-muted-foreground'
                          }`}
                        >
                          {h}
                          {h === nameColumn && <span className="ml-1 text-xs">(Name)</span>}
                          {h === emailColumn && <span className="ml-1 text-xs">(Email)</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {csvRows.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/50">
                        <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                        {csvHeaders.map(h => (
                          <td
                            key={h}
                            className={`px-3 py-2 ${
                              h === nameColumn || h === emailColumn ? 'font-medium' : ''
                            }`}
                          >
                            {row[h]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {csvRows.length > 10 && (
                <div className="px-3 py-2 bg-muted text-xs text-muted-foreground text-center">
                  Showing first 10 of {csvRows.length} rows
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep('csv')}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={buildRecipients}
              disabled={!nameColumn || !emailColumn}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Send */}
      {step === 'review' && (
        <div className="space-y-6">
          {/* Document info */}
          <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
            <FileText className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{documentName}.pdf</p>
              <p className="text-xs text-muted-foreground">Sending to {recipients.length} recipients</p>
            </div>
          </div>

          {/* Optional message & due date */}
          <div className="border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold">Options</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Message to recipients (optional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Please review and sign this document at your earliest convenience."
                rows={2}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due date (optional)</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              />
            </div>
          </div>

          {/* Recipients list */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-muted flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Recipients ({recipients.length})
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {recipients.map((r, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.email}</p>
                  </div>
                  <button
                    onClick={() => removeRecipient(idx)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove recipient"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep('map')}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={handleBulkSend}
              disabled={recipients.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Send to {recipients.length} Recipients
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Sending Progress */}
      {step === 'sending' && (
        <div className="border border-border rounded-xl p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Sending Documents...</h2>
          <p className="text-muted-foreground mb-6">{sendingProgress}% complete</p>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto bg-muted rounded-full h-3 mb-6">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${sendingProgress}%` }}
            />
          </div>

          {/* Live status list */}
          <div className="max-h-48 overflow-y-auto text-left max-w-md mx-auto">
            {recipients.map((r, idx) => (
              <div key={idx} className="flex items-center gap-2 py-1 text-sm">
                {r.status === 'pending' && <div className="w-4 h-4 rounded-full bg-muted" />}
                {r.status === 'sending' && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                {r.status === 'sent' && <CheckCircle className="w-4 h-4 text-green-600" />}
                {r.status === 'failed' && <AlertCircle className="w-4 h-4 text-destructive" />}
                <span className={r.status === 'sent' ? 'text-muted-foreground' : ''}>{r.name}</span>
                <span className="text-muted-foreground text-xs ml-auto">{r.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 6: Done */}
      {step === 'done' && (
        <div className="border border-border rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Bulk Send Complete</h2>
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{sendResults.sent}</p>
              <p className="text-xs text-muted-foreground">Sent</p>
            </div>
            {sendResults.failed > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{sendResults.failed}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            )}
          </div>

          {/* Show failed recipients */}
          {sendResults.failed > 0 && (
            <div className="max-w-md mx-auto mb-6 text-left">
              <p className="text-sm font-medium text-destructive mb-2">Failed recipients:</p>
              {recipients.filter(r => r.status === 'failed').map((r, idx) => (
                <div key={idx} className="text-sm py-1">
                  <span>{r.name}</span> - <span className="text-muted-foreground">{r.email}</span>
                  {r.error && <span className="text-xs text-destructive ml-2">({r.error})</span>}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => router.push('/documents')}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              View Documents
            </button>
            <button
              onClick={() => {
                setStep('upload')
                setDocumentFile(null)
                setDocumentData(null)
                setDocumentName('')
                setCsvHeaders([])
                setCsvRows([])
                setNameColumn('')
                setEmailColumn('')
                setRecipients([])
                setMessage('')
                setDueDate('')
                setSendingProgress(0)
                setSendResults({ sent: 0, failed: 0 })
              }}
              className="px-6 py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
            >
              Send Another Batch
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
