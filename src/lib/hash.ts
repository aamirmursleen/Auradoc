// Document Hash Generation Utility
// Uses SHA-256 for collision-resistant hash generation

export interface DocumentMetadata {
  fileName: string
  fileSize: number
  fileType: string
  lastModified: number
  pageCount?: number
}

export interface HashResult {
  hash: string
  metadata: DocumentMetadata
  rawDataHash: string
  metadataHash: string
  combinedHash: string
}

// Generate SHA-256 hash from ArrayBuffer
async function sha256(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Generate hash from string
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  return sha256(data)
}

// Extract PDF page count (basic extraction)
async function extractPDFPageCount(buffer: ArrayBuffer): Promise<number> {
  try {
    const uint8Array = new Uint8Array(buffer)
    const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array)

    // Method 1: Count /Type /Page occurrences (excluding /Pages)
    const pageMatches = text.match(/\/Type\s*\/Page[^s]/g)
    if (pageMatches && pageMatches.length > 0) {
      return pageMatches.length
    }

    // Method 2: Look for /Count in /Pages dictionary
    const countMatch = text.match(/\/Pages[^>]*\/Count\s+(\d+)/)
    if (countMatch) {
      return parseInt(countMatch[1], 10)
    }

    // Method 3: Look for /N in linearized PDFs
    const nMatch = text.match(/\/N\s+(\d+)/)
    if (nMatch) {
      return parseInt(nMatch[1], 10)
    }

    return 1 // Default to 1 if unable to determine
  } catch {
    return 1
  }
}

// Main function to generate comprehensive document hash
export async function generateDocumentHash(file: File): Promise<HashResult> {
  // Read file as ArrayBuffer
  const buffer = await file.arrayBuffer()

  // Generate raw data hash (primary integrity check)
  const rawDataHash = await sha256(buffer)

  // Extract metadata
  const metadata: DocumentMetadata = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || getFileTypeFromName(file.name),
    lastModified: file.lastModified,
  }

  // Get page count for PDFs
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    metadata.pageCount = await extractPDFPageCount(buffer)
  }

  // Generate metadata hash
  const metadataString = JSON.stringify({
    size: metadata.fileSize,
    type: metadata.fileType,
    pageCount: metadata.pageCount
  })
  const metadataHash = await hashString(metadataString)

  // Generate combined hash (raw + metadata for extra security)
  const combinedHash = await hashString(rawDataHash + metadataHash)

  return {
    hash: rawDataHash, // Primary hash for comparison
    metadata,
    rawDataHash,
    metadataHash,
    combinedHash
  }
}

// Get file type from filename
function getFileTypeFromName(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop()
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }
  return mimeTypes[ext || ''] || 'application/octet-stream'
}

// Compare two hashes and analyze differences
export interface ComparisonResult {
  isTampered: boolean
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  hashMatch: boolean
  sizeMatch: boolean
  typeMatch: boolean
  pageCountMatch: boolean | null
  differences: DifferenceDetail[]
  summary: string
}

export interface DifferenceDetail {
  type: 'HASH' | 'SIZE' | 'TYPE' | 'PAGE_COUNT' | 'METADATA'
  description: string
  originalValue: string | number
  newValue: string | number
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
}

export function compareDocuments(
  original: HashResult,
  uploaded: HashResult
): ComparisonResult {
  const differences: DifferenceDetail[] = []

  // Check hash match (most critical)
  const hashMatch = original.hash === uploaded.hash
  if (!hashMatch) {
    differences.push({
      type: 'HASH',
      description: 'Document content has been modified. The cryptographic hash does not match the original.',
      originalValue: original.hash.substring(0, 16) + '...',
      newValue: uploaded.hash.substring(0, 16) + '...',
      severity: 'CRITICAL'
    })
  }

  // Check file size
  const sizeMatch = original.metadata.fileSize === uploaded.metadata.fileSize
  if (!sizeMatch) {
    const sizeDiff = uploaded.metadata.fileSize - original.metadata.fileSize
    differences.push({
      type: 'SIZE',
      description: `File size ${sizeDiff > 0 ? 'increased' : 'decreased'} by ${Math.abs(sizeDiff)} bytes. This indicates content modification.`,
      originalValue: original.metadata.fileSize,
      newValue: uploaded.metadata.fileSize,
      severity: 'HIGH'
    })
  }

  // Check file type
  const typeMatch = original.metadata.fileType === uploaded.metadata.fileType
  if (!typeMatch) {
    differences.push({
      type: 'TYPE',
      description: 'File type has changed. Document may have been converted or re-exported.',
      originalValue: original.metadata.fileType,
      newValue: uploaded.metadata.fileType,
      severity: 'HIGH'
    })
  }

  // Check page count (for PDFs)
  let pageCountMatch: boolean | null = null
  if (original.metadata.pageCount !== undefined && uploaded.metadata.pageCount !== undefined) {
    pageCountMatch = original.metadata.pageCount === uploaded.metadata.pageCount
    if (!pageCountMatch) {
      differences.push({
        type: 'PAGE_COUNT',
        description: `Page count changed from ${original.metadata.pageCount} to ${uploaded.metadata.pageCount}. Pages may have been added or removed.`,
        originalValue: original.metadata.pageCount,
        newValue: uploaded.metadata.pageCount,
        severity: 'CRITICAL'
      })
    }
  }

  // Determine if tampered
  const isTampered = !hashMatch

  // Calculate confidence level
  let confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH'
  if (differences.length === 0) {
    confidenceLevel = 'HIGH' // High confidence it's NOT tampered
  } else if (differences.some(d => d.severity === 'CRITICAL')) {
    confidenceLevel = 'HIGH' // High confidence it IS tampered
  } else if (differences.some(d => d.severity === 'HIGH')) {
    confidenceLevel = 'HIGH'
  } else {
    confidenceLevel = 'MEDIUM'
  }

  // Generate summary
  let summary: string
  if (!isTampered) {
    summary = 'Document integrity verified. The uploaded document matches the original exactly. No modifications detected.'
  } else {
    const criticalCount = differences.filter(d => d.severity === 'CRITICAL').length
    const highCount = differences.filter(d => d.severity === 'HIGH').length
    summary = `Document has been TAMPERED. Detected ${differences.length} inconsistencies (${criticalCount} critical, ${highCount} high severity). The document content does not match the original.`
  }

  return {
    isTampered,
    confidenceLevel,
    hashMatch,
    sizeMatch,
    typeMatch,
    pageCountMatch,
    differences,
    summary
  }
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
