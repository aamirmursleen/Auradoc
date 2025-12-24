// Comprehensive PDF Modification Detection Library
// Analyzes PDFs to detect edits, modifications, and tampering

export interface PDFModification {
  type: 'METADATA_CHANGE' | 'INCREMENTAL_UPDATE' | 'EDITING_SOFTWARE' | 'ANNOTATION' | 'FORM_FIELD' | 'CONTENT_STREAM' | 'REDACTION' | 'DIGITAL_SIGNATURE' | 'EMBEDDED_FILE' | 'PAGE_MODIFICATION' | 'XMP_METADATA' | 'FONT_CHANGE' | 'IMAGE_MODIFICATION'
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  title: string
  description: string
  details?: string
  location?: string
  timestamp?: string
}

export interface PDFAnalysisResult {
  isModified: boolean
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  overallStatus: 'ORIGINAL' | 'LIKELY_MODIFIED' | 'DEFINITELY_MODIFIED'
  modifications: PDFModification[]
  metadata: {
    title?: string
    author?: string
    subject?: string
    keywords?: string
    creator?: string
    producer?: string
    creationDate?: string
    modificationDate?: string
    trapped?: string
  }
  structureInfo: {
    pdfVersion?: string
    pageCount: number
    hasIncrementalUpdates: boolean
    incrementalUpdateCount: number
    hasAnnotations: boolean
    hasFormFields: boolean
    hasDigitalSignatures: boolean
    hasEmbeddedFiles: boolean
    hasJavaScript: boolean
    hasXMPMetadata: boolean
    fileSize: number
    isLinearized: boolean
    isEncrypted: boolean
  }
  editingHistory: {
    software: string[]
    possibleEditors: string[]
    editDates: string[]
  }
  summary: string
}

// Known PDF editing software signatures
const EDITING_SOFTWARE_SIGNATURES: Record<string, { name: string; severity: 'HIGH' | 'MEDIUM' | 'LOW' }> = {
  // Online editors - HIGH severity (commonly used for quick edits)
  'iLovePDF': { name: 'iLovePDF (Online Editor)', severity: 'HIGH' },
  'ilovepdf': { name: 'iLovePDF (Online Editor)', severity: 'HIGH' },
  'SmallPDF': { name: 'SmallPDF (Online Editor)', severity: 'HIGH' },
  'Smallpdf': { name: 'SmallPDF (Online Editor)', severity: 'HIGH' },
  'smallpdf': { name: 'SmallPDF (Online Editor)', severity: 'HIGH' },
  'PDF24': { name: 'PDF24 (Online Editor)', severity: 'HIGH' },
  'pdf24': { name: 'PDF24 (Online Editor)', severity: 'HIGH' },
  'Sejda': { name: 'Sejda PDF Editor', severity: 'HIGH' },
  'sejda': { name: 'Sejda PDF Editor', severity: 'HIGH' },
  'PDFEscape': { name: 'PDFEscape Online', severity: 'HIGH' },
  'pdfescape': { name: 'PDFEscape Online', severity: 'HIGH' },
  'DocHub': { name: 'DocHub Online Editor', severity: 'HIGH' },
  'dochub': { name: 'DocHub Online Editor', severity: 'HIGH' },
  'PDFfiller': { name: 'PDFfiller', severity: 'HIGH' },
  'pdffiller': { name: 'PDFfiller', severity: 'HIGH' },
  'Soda PDF': { name: 'Soda PDF', severity: 'HIGH' },
  'sodapdf': { name: 'Soda PDF', severity: 'HIGH' },
  'Xodo': { name: 'Xodo PDF Editor', severity: 'HIGH' },
  'xodo': { name: 'Xodo PDF Editor', severity: 'HIGH' },
  'PDFelement': { name: 'Wondershare PDFelement', severity: 'HIGH' },
  'pdfelement': { name: 'Wondershare PDFelement', severity: 'HIGH' },
  'Foxit': { name: 'Foxit PDF Editor', severity: 'MEDIUM' },
  'foxit': { name: 'Foxit PDF Editor', severity: 'MEDIUM' },
  'Nitro': { name: 'Nitro PDF', severity: 'MEDIUM' },
  'nitro': { name: 'Nitro PDF', severity: 'MEDIUM' },
  'PDF-XChange': { name: 'PDF-XChange Editor', severity: 'MEDIUM' },
  'pdf-xchange': { name: 'PDF-XChange Editor', severity: 'MEDIUM' },
  'pdfxchange': { name: 'PDF-XChange Editor', severity: 'MEDIUM' },
  'Canva': { name: 'Canva', severity: 'HIGH' },
  'canva': { name: 'Canva', severity: 'HIGH' },

  // Adobe products - MEDIUM severity (professional tools)
  'Adobe Acrobat': { name: 'Adobe Acrobat', severity: 'MEDIUM' },
  'Acrobat': { name: 'Adobe Acrobat', severity: 'MEDIUM' },
  'Acrobat Pro': { name: 'Adobe Acrobat Pro', severity: 'MEDIUM' },
  'Acrobat DC': { name: 'Adobe Acrobat DC', severity: 'MEDIUM' },
  'Adobe InDesign': { name: 'Adobe InDesign', severity: 'LOW' },
  'Adobe Illustrator': { name: 'Adobe Illustrator', severity: 'LOW' },
  'Adobe Photoshop': { name: 'Adobe Photoshop', severity: 'HIGH' },

  // Office software - LOW severity (usually for creation)
  'Microsoft Word': { name: 'Microsoft Word', severity: 'LOW' },
  'Microsoft Office': { name: 'Microsoft Office', severity: 'LOW' },
  'LibreOffice': { name: 'LibreOffice', severity: 'LOW' },
  'OpenOffice': { name: 'OpenOffice', severity: 'LOW' },
  'Google': { name: 'Google Docs/Drive', severity: 'MEDIUM' },
  'Docs': { name: 'Google Docs', severity: 'MEDIUM' },

  // Programming libraries - INFO
  'PyPDF': { name: 'PyPDF (Python Library)', severity: 'HIGH' },
  'pypdf': { name: 'PyPDF (Python Library)', severity: 'HIGH' },
  'PyPDF2': { name: 'PyPDF2 (Python Library)', severity: 'HIGH' },
  'pypdf2': { name: 'PyPDF2 (Python Library)', severity: 'HIGH' },
  'pdf-lib': { name: 'pdf-lib (JavaScript)', severity: 'HIGH' },
  'PDFKit': { name: 'PDFKit', severity: 'HIGH' },
  'pdfkit': { name: 'PDFKit', severity: 'HIGH' },
  'iText': { name: 'iText (Java Library)', severity: 'HIGH' },
  'itext': { name: 'iText (Java Library)', severity: 'HIGH' },
  'FPDF': { name: 'FPDF (PHP Library)', severity: 'HIGH' },
  'fpdf': { name: 'FPDF (PHP Library)', severity: 'HIGH' },
  'TCPDF': { name: 'TCPDF (PHP Library)', severity: 'HIGH' },
  'tcpdf': { name: 'TCPDF (PHP Library)', severity: 'HIGH' },
  'ReportLab': { name: 'ReportLab (Python)', severity: 'LOW' },
  'reportlab': { name: 'ReportLab (Python)', severity: 'LOW' },
  'wkhtmltopdf': { name: 'wkhtmltopdf', severity: 'LOW' },
  'Puppeteer': { name: 'Puppeteer/Chrome', severity: 'LOW' },
  'puppeteer': { name: 'Puppeteer/Chrome', severity: 'LOW' },
  'Chrome': { name: 'Chrome Print to PDF', severity: 'LOW' },
  'Chromium': { name: 'Chromium Print to PDF', severity: 'LOW' },
  'HeadlessChrome': { name: 'Headless Chrome', severity: 'LOW' },

  // Print drivers - LOW
  'Print': { name: 'Print Driver', severity: 'LOW' },
  'PDFCreator': { name: 'PDFCreator', severity: 'LOW' },
  'CutePDF': { name: 'CutePDF', severity: 'LOW' },
  'Bullzip': { name: 'Bullzip PDF Printer', severity: 'LOW' },

  // Mobile - MEDIUM
  'iOS': { name: 'iOS Device', severity: 'MEDIUM' },
  'Android': { name: 'Android Device', severity: 'MEDIUM' },
  'iPhone': { name: 'iPhone', severity: 'MEDIUM' },
  'iPad': { name: 'iPad', severity: 'MEDIUM' },
}

// Parse PDF date format
function parsePDFDate(dateStr: string): Date | null {
  if (!dateStr) return null

  // PDF date format: D:YYYYMMDDHHmmSS+HH'mm' or D:YYYYMMDDHHmmSS-HH'mm' or D:YYYYMMDDHHmmSSZ
  const match = dateStr.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?([+-Z])?(\d{2})?'?(\d{2})?'?/)
  if (match) {
    const [, year, month, day, hour = '00', min = '00', sec = '00'] = match
    try {
      return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`)
    } catch {
      return null
    }
  }

  // Try standard date parsing
  try {
    return new Date(dateStr)
  } catch {
    return null
  }
}

// Format date for display
function formatDate(date: Date | null): string {
  if (!date || isNaN(date.getTime())) return 'Unknown'
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  })
}

// Extract string between delimiters
function extractBetween(text: string, start: string, end: string): string | null {
  const startIdx = text.indexOf(start)
  if (startIdx === -1) return null
  const endIdx = text.indexOf(end, startIdx + start.length)
  if (endIdx === -1) return null
  return text.substring(startIdx + start.length, endIdx).trim()
}

// Extract PDF metadata from raw text
function extractMetadata(text: string): PDFAnalysisResult['metadata'] {
  const metadata: PDFAnalysisResult['metadata'] = {}

  // Extract from Info dictionary
  const infoMatch = text.match(/<<[^>]*\/Title[^>]*>>/s) || text.match(/\/Info\s+\d+\s+\d+\s+R/s)

  // Title
  const titleMatch = text.match(/\/Title\s*\(([^)]*)\)/s) || text.match(/\/Title\s*<([^>]*)>/s)
  if (titleMatch) metadata.title = decodeURIComponent(titleMatch[1].replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8))))

  // Author
  const authorMatch = text.match(/\/Author\s*\(([^)]*)\)/s) || text.match(/\/Author\s*<([^>]*)>/s)
  if (authorMatch) metadata.author = authorMatch[1]

  // Subject
  const subjectMatch = text.match(/\/Subject\s*\(([^)]*)\)/s)
  if (subjectMatch) metadata.subject = subjectMatch[1]

  // Keywords
  const keywordsMatch = text.match(/\/Keywords\s*\(([^)]*)\)/s)
  if (keywordsMatch) metadata.keywords = keywordsMatch[1]

  // Creator (application that created the original document)
  const creatorMatch = text.match(/\/Creator\s*\(([^)]*)\)/s) || text.match(/\/Creator\s*<([^>]*)>/s)
  if (creatorMatch) metadata.creator = creatorMatch[1]

  // Producer (PDF producer/converter)
  const producerMatch = text.match(/\/Producer\s*\(([^)]*)\)/s) || text.match(/\/Producer\s*<([^>]*)>/s)
  if (producerMatch) metadata.producer = producerMatch[1]

  // Creation Date
  const creationMatch = text.match(/\/CreationDate\s*\(([^)]*)\)/s)
  if (creationMatch) metadata.creationDate = creationMatch[1]

  // Modification Date
  const modMatch = text.match(/\/ModDate\s*\(([^)]*)\)/s)
  if (modMatch) metadata.modificationDate = modMatch[1]

  // Trapped
  const trappedMatch = text.match(/\/Trapped\s*\/(\w+)/s)
  if (trappedMatch) metadata.trapped = trappedMatch[1]

  return metadata
}

// Detect editing software from metadata
function detectEditingSoftware(metadata: PDFAnalysisResult['metadata']): { software: string[]; possibleEditors: string[] } {
  const software: string[] = []
  const possibleEditors: string[] = []

  const checkString = (str: string | undefined) => {
    if (!str) return

    for (const [key, value] of Object.entries(EDITING_SOFTWARE_SIGNATURES)) {
      if (str.toLowerCase().includes(key.toLowerCase())) {
        if (!software.includes(value.name)) {
          software.push(value.name)
        }
        if (value.severity === 'HIGH' && !possibleEditors.includes(value.name)) {
          possibleEditors.push(value.name)
        }
      }
    }
  }

  checkString(metadata.creator)
  checkString(metadata.producer)

  return { software, possibleEditors }
}

// Count incremental updates (%%EOF markers)
function countIncrementalUpdates(text: string): number {
  const eofMatches = text.match(/%%EOF/g)
  return eofMatches ? eofMatches.length : 0
}

// Check for various PDF features
function analyzeStructure(text: string, fileSize: number): PDFAnalysisResult['structureInfo'] {
  // PDF Version
  const versionMatch = text.match(/%PDF-(\d+\.\d+)/)
  const pdfVersion = versionMatch ? versionMatch[1] : undefined

  // Page count
  const pageMatches = text.match(/\/Type\s*\/Page[^s]/g)
  const countMatch = text.match(/\/Count\s+(\d+)/)
  const pageCount = pageMatches?.length || (countMatch ? parseInt(countMatch[1]) : 1)

  // Incremental updates
  const incrementalUpdateCount = countIncrementalUpdates(text)
  const hasIncrementalUpdates = incrementalUpdateCount > 1

  // Annotations
  const hasAnnotations = /\/Type\s*\/Annot/.test(text) || /\/Annots\s*\[/.test(text)

  // Form fields
  const hasFormFields = /\/Type\s*\/AcroForm/.test(text) || /\/FT\s*\//.test(text)

  // Digital signatures
  const hasDigitalSignatures = /\/Type\s*\/Sig/.test(text) || /\/SigFlags/.test(text)

  // Embedded files
  const hasEmbeddedFiles = /\/Type\s*\/EmbeddedFile/.test(text) || /\/EmbeddedFiles/.test(text)

  // JavaScript
  const hasJavaScript = /\/JS\s*\(/.test(text) || /\/JavaScript/.test(text) || /\/S\s*\/JavaScript/.test(text)

  // XMP Metadata
  const hasXMPMetadata = /<x:xmpmeta/.test(text) || /<rdf:RDF/.test(text)

  // Linearized
  const isLinearized = /\/Linearized/.test(text)

  // Encrypted
  const isEncrypted = /\/Encrypt/.test(text)

  return {
    pdfVersion,
    pageCount,
    hasIncrementalUpdates,
    incrementalUpdateCount,
    hasAnnotations,
    hasFormFields,
    hasDigitalSignatures,
    hasEmbeddedFiles,
    hasJavaScript,
    hasXMPMetadata,
    fileSize,
    isLinearized,
    isEncrypted
  }
}

// Extract XMP metadata dates
function extractXMPDates(text: string): string[] {
  const dates: string[] = []

  // xmp:ModifyDate
  const modifyMatch = text.match(/<xmp:ModifyDate>([^<]+)<\/xmp:ModifyDate>/g)
  if (modifyMatch) {
    modifyMatch.forEach(m => {
      const date = m.match(/>([^<]+)</)?.[1]
      if (date) dates.push(date)
    })
  }

  // xmp:CreateDate
  const createMatch = text.match(/<xmp:CreateDate>([^<]+)<\/xmp:CreateDate>/g)
  if (createMatch) {
    createMatch.forEach(m => {
      const date = m.match(/>([^<]+)</)?.[1]
      if (date) dates.push(date)
    })
  }

  // xmp:MetadataDate
  const metaMatch = text.match(/<xmp:MetadataDate>([^<]+)<\/xmp:MetadataDate>/g)
  if (metaMatch) {
    metaMatch.forEach(m => {
      const date = m.match(/>([^<]+)</)?.[1]
      if (date) dates.push(date)
    })
  }

  // pdf:Producer history
  const historyMatch = text.match(/<stEvt:when>([^<]+)<\/stEvt:when>/g)
  if (historyMatch) {
    historyMatch.forEach(m => {
      const date = m.match(/>([^<]+)</)?.[1]
      if (date) dates.push(date)
    })
  }

  return [...new Set(dates)]
}

// Main analysis function
export async function analyzePDF(file: File): Promise<PDFAnalysisResult> {
  const buffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(buffer)
  const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array)

  // Extract metadata
  const metadata = extractMetadata(text)

  // Analyze structure
  const structureInfo = analyzeStructure(text, file.size)

  // Detect editing software
  const { software, possibleEditors } = detectEditingSoftware(metadata)

  // Extract edit dates
  const xmpDates = extractXMPDates(text)
  const editDates: string[] = []

  if (metadata.creationDate) {
    const parsed = parsePDFDate(metadata.creationDate)
    if (parsed) editDates.push(formatDate(parsed))
  }
  if (metadata.modificationDate) {
    const parsed = parsePDFDate(metadata.modificationDate)
    if (parsed) editDates.push(formatDate(parsed))
  }
  xmpDates.forEach(d => {
    try {
      const date = new Date(d)
      if (!isNaN(date.getTime())) {
        editDates.push(formatDate(date))
      }
    } catch {}
  })

  // Build modifications list
  const modifications: PDFModification[] = []

  // Check for date discrepancy
  const creationDate = parsePDFDate(metadata.creationDate || '')
  const modificationDate = parsePDFDate(metadata.modificationDate || '')

  if (creationDate && modificationDate && modificationDate > creationDate) {
    const diffMs = modificationDate.getTime() - creationDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    let timeDesc = ''
    if (diffDays > 0) {
      timeDesc = `${diffDays} day${diffDays > 1 ? 's' : ''}`
    } else if (diffHours > 0) {
      timeDesc = `${diffHours} hour${diffHours > 1 ? 's' : ''}`
    } else {
      timeDesc = `${diffMins} minute${diffMins > 1 ? 's' : ''}`
    }

    modifications.push({
      type: 'METADATA_CHANGE',
      severity: diffDays > 1 ? 'HIGH' : 'MEDIUM',
      title: 'Document Modified After Creation',
      description: `This PDF was modified ${timeDesc} after it was originally created.`,
      details: `Created: ${formatDate(creationDate)}\nModified: ${formatDate(modificationDate)}`,
      timestamp: formatDate(modificationDate)
    })
  }

  // Check for incremental updates
  if (structureInfo.hasIncrementalUpdates) {
    modifications.push({
      type: 'INCREMENTAL_UPDATE',
      severity: structureInfo.incrementalUpdateCount > 2 ? 'HIGH' : 'MEDIUM',
      title: `${structureInfo.incrementalUpdateCount - 1} Incremental Update${structureInfo.incrementalUpdateCount > 2 ? 's' : ''} Detected`,
      description: 'The PDF has been saved/modified multiple times. Each save adds an incremental update.',
      details: `Number of save operations detected: ${structureInfo.incrementalUpdateCount - 1}`
    })
  }

  // Check for editing software
  possibleEditors.forEach(editor => {
    const sig = Object.entries(EDITING_SOFTWARE_SIGNATURES).find(([_, v]) => v.name === editor)
    modifications.push({
      type: 'EDITING_SOFTWARE',
      severity: sig?.[1].severity || 'HIGH',
      title: `Edited with ${editor}`,
      description: `This PDF shows signs of being processed by ${editor}.`,
      details: `Producer: ${metadata.producer || 'Unknown'}\nCreator: ${metadata.creator || 'Unknown'}`
    })
  })

  // Check for annotations
  if (structureInfo.hasAnnotations) {
    // Check for specific annotation types
    const hasHighlight = /\/Subtype\s*\/Highlight/.test(text)
    const hasStrikeout = /\/Subtype\s*\/StrikeOut/.test(text)
    const hasUnderline = /\/Subtype\s*\/Underline/.test(text)
    const hasTextAnnot = /\/Subtype\s*\/Text/.test(text) || /\/Subtype\s*\/FreeText/.test(text)
    const hasStamp = /\/Subtype\s*\/Stamp/.test(text)
    const hasInk = /\/Subtype\s*\/Ink/.test(text)
    const hasLink = /\/Subtype\s*\/Link/.test(text)
    const hasRedact = /\/Subtype\s*\/Redact/.test(text)

    const annotTypes: string[] = []
    if (hasHighlight) annotTypes.push('Highlights')
    if (hasStrikeout) annotTypes.push('Strikeouts')
    if (hasUnderline) annotTypes.push('Underlines')
    if (hasTextAnnot) annotTypes.push('Text Notes')
    if (hasStamp) annotTypes.push('Stamps')
    if (hasInk) annotTypes.push('Drawings/Ink')
    if (hasLink) annotTypes.push('Links')
    if (hasRedact) annotTypes.push('Redactions')

    if (annotTypes.length > 0) {
      modifications.push({
        type: 'ANNOTATION',
        severity: hasRedact || hasStrikeout ? 'HIGH' : 'MEDIUM',
        title: 'Annotations Detected',
        description: `This PDF contains annotations that may have been added after creation.`,
        details: `Types found: ${annotTypes.join(', ')}`
      })
    }
  }

  // Check for form fields
  if (structureInfo.hasFormFields) {
    // Check if forms are filled
    const hasFilledFields = /\/V\s*\(/.test(text) || /\/V\s*</.test(text)

    modifications.push({
      type: 'FORM_FIELD',
      severity: hasFilledFields ? 'MEDIUM' : 'LOW',
      title: 'Form Fields Present',
      description: hasFilledFields
        ? 'This PDF has form fields that have been filled in.'
        : 'This PDF has interactive form fields.',
      details: hasFilledFields ? 'Form data has been entered' : 'Form fields are present but may be empty'
    })
  }

  // Check for redaction
  if (/\/Subtype\s*\/Redact/.test(text) || /\/Redact/.test(text)) {
    modifications.push({
      type: 'REDACTION',
      severity: 'CRITICAL',
      title: 'Redaction Detected',
      description: 'This PDF contains redacted (blacked out) content. Information has been intentionally hidden.',
      details: 'Redaction marks found in document'
    })
  }

  // Check for digital signatures
  if (structureInfo.hasDigitalSignatures) {
    modifications.push({
      type: 'DIGITAL_SIGNATURE',
      severity: 'INFO',
      title: 'Digital Signature Present',
      description: 'This PDF has been digitally signed.',
      details: 'Digital signature found - document may be certified'
    })
  }

  // Check for embedded files
  if (structureInfo.hasEmbeddedFiles) {
    modifications.push({
      type: 'EMBEDDED_FILE',
      severity: 'MEDIUM',
      title: 'Embedded Files Detected',
      description: 'This PDF contains embedded files or attachments.',
      details: 'Files have been attached to this document'
    })
  }

  // Check for JavaScript
  if (structureInfo.hasJavaScript) {
    modifications.push({
      type: 'CONTENT_STREAM',
      severity: 'HIGH',
      title: 'JavaScript Detected',
      description: 'This PDF contains JavaScript code which could indicate modifications or potential security risks.',
      details: 'Active JavaScript content found'
    })
  }

  // Check XMP history
  if (structureInfo.hasXMPMetadata) {
    const historyEvents = text.match(/<stEvt:action>([^<]+)<\/stEvt:action>/g)
    if (historyEvents && historyEvents.length > 1) {
      const actions = historyEvents.map(h => h.match(/>([^<]+)</)?.[1]).filter(Boolean)
      modifications.push({
        type: 'XMP_METADATA',
        severity: 'MEDIUM',
        title: 'Document History Found',
        description: `XMP metadata shows ${historyEvents.length} recorded actions on this document.`,
        details: `Actions: ${[...new Set(actions)].join(', ')}`
      })
    }
  }

  // Check for content stream modifications (text edits)
  const contentStreamCount = (text.match(/stream[\r\n]/g) || []).length
  const objectCount = (text.match(/\d+\s+\d+\s+obj/g) || []).length

  // If producer differs significantly from creator, likely modified
  if (metadata.creator && metadata.producer &&
      !metadata.producer.toLowerCase().includes(metadata.creator.toLowerCase().split(' ')[0]) &&
      !metadata.creator.toLowerCase().includes(metadata.producer.toLowerCase().split(' ')[0])) {
    modifications.push({
      type: 'CONTENT_STREAM',
      severity: 'MEDIUM',
      title: 'Different Creator and Producer',
      description: 'The software that created the original document differs from the PDF producer, suggesting conversion or modification.',
      details: `Creator: ${metadata.creator}\nProducer: ${metadata.producer}`
    })
  }

  // Determine overall status
  let isModified = false
  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW'
  let overallStatus: 'ORIGINAL' | 'LIKELY_MODIFIED' | 'DEFINITELY_MODIFIED' = 'ORIGINAL'

  const criticalCount = modifications.filter(m => m.severity === 'CRITICAL').length
  const highCount = modifications.filter(m => m.severity === 'HIGH').length
  const mediumCount = modifications.filter(m => m.severity === 'MEDIUM').length

  if (criticalCount > 0) {
    isModified = true
    confidence = 'HIGH'
    overallStatus = 'DEFINITELY_MODIFIED'
  } else if (highCount >= 2 || (highCount >= 1 && mediumCount >= 2)) {
    isModified = true
    confidence = 'HIGH'
    overallStatus = 'DEFINITELY_MODIFIED'
  } else if (highCount >= 1 || mediumCount >= 2) {
    isModified = true
    confidence = 'MEDIUM'
    overallStatus = 'LIKELY_MODIFIED'
  } else if (mediumCount >= 1) {
    isModified = true
    confidence = 'LOW'
    overallStatus = 'LIKELY_MODIFIED'
  }

  // Generate summary
  let summary = ''
  if (overallStatus === 'DEFINITELY_MODIFIED') {
    summary = `This PDF has been MODIFIED. ${modifications.length} modification indicator${modifications.length > 1 ? 's' : ''} found including ${criticalCount > 0 ? 'critical' : 'high'} severity issues.`
  } else if (overallStatus === 'LIKELY_MODIFIED') {
    summary = `This PDF shows signs of modification. ${modifications.length} indicator${modifications.length > 1 ? 's' : ''} suggest the document may have been edited.`
  } else {
    summary = 'No significant modification indicators detected. This PDF appears to be in its original state.'
  }

  return {
    isModified,
    confidence,
    overallStatus,
    modifications,
    metadata,
    structureInfo,
    editingHistory: {
      software,
      possibleEditors,
      editDates: [...new Set(editDates)]
    },
    summary
  }
}
