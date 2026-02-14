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
  ChevronRight,
  ArrowLeft,
  Trash2,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  UserPlus,
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

type Step = 'upload' | 'recipients' | 'review' | 'sending' | 'done'

export default function BulkSendPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // Step state
  const [step, setStep] = useState<Step>('upload')

  // Document state
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [documentData, setDocumentData] = useState<string | null>(null)
  const [documentName, setDocumentName] = useState('')

  // Recipients
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [message, setMessage] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [sendingProgress, setSendingProgress] = useState(0)
  const [sendResults, setSendResults] = useState<{ sent: number; failed: number }>({ sent: 0, failed: 0 })

  // Manual add
  const [manualName, setManualName] = useState('')
  const [manualEmail, setManualEmail] = useState('')
  const [duplicateWarning, setDuplicateWarning] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
      setStep('recipients')
    }
    reader.readAsDataURL(file)
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

  // Handle CSV upload - auto-detect columns and build recipients directly
  const handleCSVUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.split(/\r?\n/).filter(line => line.trim())
      if (lines.length < 2) {
        alert('CSV file must have headers and at least one data row.')
        return
      }

      const headers = parseCSVLine(lines[0])
      const rows: CSVRow[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i])
        if (values.length === 0) continue
        const row: CSVRow = {}
        headers.forEach((h, idx) => { row[h] = values[idx] || '' })
        rows.push(row)
      }

      if (rows.length === 0) {
        alert('No data rows found in CSV.')
        return
      }

      // Auto-detect name and email columns
      const headersLower = headers.map(h => h.toLowerCase().trim())
      const nameIdx = headersLower.findIndex(h =>
        h === 'name' || h === 'full name' || h === 'fullname' ||
        h === 'recipient name' || h === 'signer name' || h === 'first name' ||
        h === 'recipient' || h === 'signer'
      )
      const emailIdx = headersLower.findIndex(h =>
        h === 'email' || h === 'email address' || h === 'e-mail' ||
        h === 'recipient email' || h === 'signer email' || h === 'mail'
      )

      if (nameIdx < 0 || emailIdx < 0) {
        alert(`Could not detect Name and Email columns.\n\nFound columns: ${headers.join(', ')}\n\nPlease make sure your CSV has columns named "Name" and "Email".`)
        return
      }

      const nameCol = headers[nameIdx]
      const emailCol = headers[emailIdx]

      // Build recipients with deduplication
      const seenEmails = new Set(recipients.map(r => r.email.toLowerCase()))
      const newRecipients: Recipient[] = []
      let skippedDuplicates = 0
      let skippedInvalid = 0

      rows.forEach(row => {
        const name = row[nameCol]?.trim()
        const email = row[emailCol]?.trim()

        if (!name || !email || !emailRegex.test(email)) {
          skippedInvalid++
          return
        }

        const emailLower = email.toLowerCase()
        if (seenEmails.has(emailLower)) {
          skippedDuplicates++
          return
        }

        seenEmails.add(emailLower)
        newRecipients.push({ name, email, status: 'pending' })
      })

      if (newRecipients.length === 0) {
        alert('No valid new recipients found in CSV.')
        return
      }

      setRecipients(prev => [...prev, ...newRecipients])

      let msg = `Added ${newRecipients.length} recipients from CSV.`
      if (skippedDuplicates > 0) msg += ` (${skippedDuplicates} duplicates skipped)`
      if (skippedInvalid > 0) msg += ` (${skippedInvalid} invalid rows skipped)`
      setDuplicateWarning(msg)
      setTimeout(() => setDuplicateWarning(''), 5000)

      // Reset CSV input
      if (csvInputRef.current) csvInputRef.current.value = ''
    }
    reader.readAsText(file)
  }, [recipients])

  // Add recipient manually
  const addManualRecipient = useCallback(() => {
    const name = manualName.trim()
    const email = manualEmail.trim()

    if (!name || !email) return

    if (!emailRegex.test(email)) {
      setDuplicateWarning('Please enter a valid email address')
      setTimeout(() => setDuplicateWarning(''), 3000)
      return
    }

    // Check duplicates
    if (recipients.some(r => r.email.toLowerCase() === email.toLowerCase())) {
      setDuplicateWarning(`${email} is already in the list`)
      setTimeout(() => setDuplicateWarning(''), 3000)
      return
    }

    setRecipients(prev => [...prev, { name, email, status: 'pending' }])
    setManualName('')
    setManualEmail('')
    setDuplicateWarning('')
  }, [manualName, manualEmail, recipients])

  // Remove a recipient
  const removeRecipient = (idx: number) => {
    setRecipients(prev => prev.filter((_, i) => i !== idx))
  }

  // Send all via bulk API
  const handleBulkSend = useCallback(async () => {
    if (recipients.length === 0 || !documentData) return

    setStep('sending')
    setSendingProgress(0)

    const senderName = user ? ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || 'MamaSign User' : 'MamaSign User'

    // Mark all as sending
    setRecipients(prev => prev.map(r => ({ ...r, status: 'sending' as const })))

    try {
      // Use progress simulation while waiting for API
      const progressInterval = setInterval(() => {
        setSendingProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 15
        })
      }, 500)

      const res = await fetch('/api/bulk-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName,
          documentData,
          recipients: recipients.map(r => ({ name: r.name, email: r.email })),
          message: message || undefined,
          dueDate: dueDate || undefined,
          senderName,
        }),
      })

      clearInterval(progressInterval)

      const json = await res.json()

      if (json.success && json.results) {
        // Update each recipient status from API response
        const resultMap = new Map<string, { status: string; error?: string }>()
        json.results.forEach((r: any) => {
          resultMap.set(r.email.toLowerCase(), r)
        })

        setRecipients(prev => prev.map(r => {
          const result = resultMap.get(r.email.toLowerCase())
          if (result) {
            return {
              ...r,
              status: result.status === 'sent' ? 'sent' as const : 'failed' as const,
              error: result.error,
            }
          }
          return { ...r, status: 'failed' as const, error: 'No response from server' }
        }))

        setSendResults({ sent: json.sentCount || 0, failed: json.failedCount || 0 })
      } else {
        // Whole request failed
        setRecipients(prev => prev.map(r => ({
          ...r,
          status: 'failed' as const,
          error: json.message || 'Server error',
        })))
        setSendResults({ sent: 0, failed: recipients.length })
      }

      setSendingProgress(100)
      setStep('done')

    } catch (err) {
      // Network error
      setRecipients(prev => prev.map(r => ({
        ...r,
        status: 'failed' as const,
        error: 'Network error - please check your connection',
      })))
      setSendResults({ sent: 0, failed: recipients.length })
      setSendingProgress(100)
      setStep('done')
    }
  }, [recipients, documentData, documentName, message, dueDate, user])

  // Retry failed only
  const retryFailed = useCallback(async () => {
    const failedRecipients = recipients.filter(r => r.status === 'failed')
    if (failedRecipients.length === 0 || !documentData) return

    setStep('sending')
    setSendingProgress(0)

    const senderName = user ? ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || 'MamaSign User' : 'MamaSign User'

    // Mark failed ones as sending again
    setRecipients(prev => prev.map(r =>
      r.status === 'failed' ? { ...r, status: 'sending' as const, error: undefined } : r
    ))

    try {
      const progressInterval = setInterval(() => {
        setSendingProgress(prev => prev >= 90 ? prev : prev + Math.random() * 15)
      }, 500)

      const res = await fetch('/api/bulk-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName,
          documentData,
          recipients: failedRecipients.map(r => ({ name: r.name, email: r.email })),
          message: message || undefined,
          dueDate: dueDate || undefined,
          senderName,
        }),
      })

      clearInterval(progressInterval)

      const json = await res.json()

      if (json.success && json.results) {
        const resultMap = new Map<string, { status: string; error?: string }>()
        json.results.forEach((r: any) => {
          resultMap.set(r.email.toLowerCase(), r)
        })

        setRecipients(prev => prev.map(r => {
          if (r.status !== 'sending') return r
          const result = resultMap.get(r.email.toLowerCase())
          if (result) {
            return {
              ...r,
              status: result.status === 'sent' ? 'sent' as const : 'failed' as const,
              error: result.error,
            }
          }
          return { ...r, status: 'failed' as const, error: 'No response' }
        }))

        // Recalculate totals
        const newSent = (sendResults.sent || 0) + (json.sentCount || 0)
        const newFailed = (json.failedCount || 0)
        setSendResults({ sent: newSent, failed: newFailed })
      }

      setSendingProgress(100)
      setStep('done')
    } catch {
      setRecipients(prev => prev.map(r =>
        r.status === 'sending' ? { ...r, status: 'failed' as const, error: 'Network error' } : r
      ))
      setSendingProgress(100)
      setStep('done')
    }
  }, [recipients, documentData, documentName, message, dueDate, user, sendResults])

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

  // Reset everything
  const resetAll = () => {
    setStep('upload')
    setDocumentFile(null)
    setDocumentData(null)
    setDocumentName('')
    setRecipients([])
    setMessage('')
    setDueDate('')
    setSendingProgress(0)
    setSendResults({ sent: 0, failed: 0 })
    setManualName('')
    setManualEmail('')
    setDuplicateWarning('')
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
        <p className="text-muted-foreground mt-1">Send a document to multiple recipients at once.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {[
          { key: 'upload', label: 'Upload PDF', num: 1 },
          { key: 'recipients', label: 'Add Recipients', num: 2 },
          { key: 'review', label: 'Review & Send', num: 3 },
        ].map((s, i) => {
          const stepOrder = ['upload', 'recipients', 'review', 'sending', 'done']
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
              {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
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

      {/* Step 2: Add Recipients (CSV + Manual) */}
      {step === 'recipients' && (
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

          {/* CSV Upload */}
          <div className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold">Import from CSV</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a CSV file with <strong>Name</strong> and <strong>Email</strong> columns. Duplicates are automatically removed.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
              <button
                onClick={() => csvInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload CSV
              </button>
              <button
                onClick={downloadSampleCSV}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Sample CSV
              </button>
            </div>
          </div>

          {/* Manual Add */}
          <div className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold">Add Manually</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={manualName}
                onChange={e => setManualName(e.target.value)}
                placeholder="Name"
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                onKeyDown={e => e.key === 'Enter' && addManualRecipient()}
              />
              <input
                type="email"
                value={manualEmail}
                onChange={e => setManualEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                onKeyDown={e => e.key === 'Enter' && addManualRecipient()}
              />
              <button
                onClick={addManualRecipient}
                disabled={!manualName.trim() || !manualEmail.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Status message */}
          {duplicateWarning && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              duplicateWarning.includes('already') || duplicateWarning.includes('valid')
                ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800'
                : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800'
            }`}>
              {duplicateWarning.includes('already') || duplicateWarning.includes('valid')
                ? <AlertCircle className="w-4 h-4 shrink-0" />
                : <CheckCircle className="w-4 h-4 shrink-0" />
              }
              {duplicateWarning}
            </div>
          )}

          {/* Recipients list */}
          {recipients.length > 0 && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-muted flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Recipients ({recipients.length})
                </h3>
                <button
                  onClick={() => setRecipients([])}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-border">
                {recipients.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.email}</p>
                    </div>
                    <button
                      onClick={() => removeRecipient(idx)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setStep('upload')}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={() => setStep('review')}
              disabled={recipients.length === 0}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue ({recipients.length} recipients)
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Send */}
      {step === 'review' && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-base font-semibold">Send Summary</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Document</p>
                  <p className="text-sm font-medium truncate">{documentName}.pdf</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Users className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Recipients</p>
                  <p className="text-sm font-medium">{recipients.length} people</p>
                </div>
              </div>
            </div>

            {/* Optional message */}
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

            {/* Due date */}
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

          {/* Recipients preview */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-muted">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Recipients ({recipients.length})
              </h3>
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-border">
              {recipients.map((r, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">{r.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{r.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep('recipients')}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={handleBulkSend}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Send className="w-4 h-4" />
              Send to {recipients.length} Recipients
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Sending Progress */}
      {step === 'sending' && (
        <div className="border border-border rounded-xl p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Sending to {recipients.length} Recipients...</h2>
          <p className="text-muted-foreground mb-6">{Math.round(sendingProgress)}% complete</p>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto bg-muted rounded-full h-3 mb-4">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(sendingProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Emails are being sent in parallel. This may take a moment.
          </p>
        </div>
      )}

      {/* Step 5: Done */}
      {step === 'done' && (
        <div className="border border-border rounded-xl p-8 text-center">
          {sendResults.failed === 0 ? (
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          ) : sendResults.sent > 0 ? (
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          ) : (
            <X className="w-16 h-16 text-destructive mx-auto mb-4" />
          )}

          <h2 className="text-xl font-semibold mb-2">
            {sendResults.failed === 0 ? 'All Sent Successfully!' :
             sendResults.sent > 0 ? 'Partially Sent' : 'Sending Failed'}
          </h2>

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

          {/* Failed recipients with retry */}
          {sendResults.failed > 0 && (
            <div className="max-w-md mx-auto mb-6 text-left">
              <p className="text-sm font-medium text-destructive mb-2">Failed recipients:</p>
              {recipients.filter(r => r.status === 'failed').map((r, idx) => (
                <div key={idx} className="text-sm py-1 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                  <span className="font-medium">{r.name}</span>
                  <span className="text-muted-foreground">{r.email}</span>
                  {r.error && <span className="text-xs text-destructive ml-auto">({r.error})</span>}
                </div>
              ))}

              <button
                onClick={retryFailed}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Failed ({sendResults.failed})
              </button>
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
              onClick={resetAll}
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
