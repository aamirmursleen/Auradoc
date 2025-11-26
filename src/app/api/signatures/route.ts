import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// In-memory storage for demo purposes
// In production, use a database like PostgreSQL, MongoDB, etc.
const signedDocuments: Map<string, SignedDocumentRecord> = new Map()

interface SignedDocumentRecord {
  id: string
  documentName: string
  documentType: string
  documentSize: number
  documentBase64: string
  signatureBase64: string
  signerName: string
  signerEmail: string
  signerCompany?: string
  signerTitle?: string
  signedAt: string
  ipAddress: string
  userAgent: string
  auditTrail: AuditEntry[]
}

interface AuditEntry {
  action: string
  timestamp: string
  ipAddress: string
  userAgent: string
  details?: string
}

// Helper to get client info
function getClientInfo(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  const ipAddress = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return { ipAddress, userAgent }
}

// Helper to convert File to Base64
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  let binary = ''
  uint8Array.forEach(byte => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

// POST - Create a new signed document
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const document = formData.get('document') as File | null
    const signature = formData.get('signature') as string | null
    const signerName = formData.get('signerName') as string | null
    const signerEmail = formData.get('signerEmail') as string | null
    const signerCompany = formData.get('signerCompany') as string | null
    const signerTitle = formData.get('signerTitle') as string | null

    // Validation
    if (!document) {
      return NextResponse.json(
        { success: false, message: 'Document is required' },
        { status: 400 }
      )
    }

    if (!signature) {
      return NextResponse.json(
        { success: false, message: 'Signature is required' },
        { status: 400 }
      )
    }

    if (!signerName || !signerEmail) {
      return NextResponse.json(
        { success: false, message: 'Signer name and email are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(signerEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      )
    }

    // File type validation
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(document.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Allowed: PDF, PNG, JPG' },
        { status: 400 }
      )
    }

    // File size validation (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (document.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    const { ipAddress, userAgent } = getClientInfo(request)
    const documentId = uuidv4()
    const signedAt = new Date().toISOString()

    // Convert document to base64 for storage
    const documentBase64 = await fileToBase64(document)

    // Create signed document record
    const signedDocument: SignedDocumentRecord = {
      id: documentId,
      documentName: document.name,
      documentType: document.type,
      documentSize: document.size,
      documentBase64,
      signatureBase64: signature,
      signerName,
      signerEmail,
      signerCompany: signerCompany || undefined,
      signerTitle: signerTitle || undefined,
      signedAt,
      ipAddress,
      userAgent,
      auditTrail: [
        {
          action: 'document_uploaded',
          timestamp: signedAt,
          ipAddress,
          userAgent,
          details: `Document "${document.name}" uploaded`,
        },
        {
          action: 'document_signed',
          timestamp: signedAt,
          ipAddress,
          userAgent,
          details: `Document signed by ${signerName} (${signerEmail})`,
        },
      ],
    }

    // Store the signed document
    signedDocuments.set(documentId, signedDocument)

    // In production, you would:
    // 1. Save to database
    // 2. Generate a signed PDF with the signature embedded
    // 3. Send confirmation email to the signer
    // 4. Store document in secure cloud storage (AWS S3, etc.)

    console.log(`Document signed: ${documentId} by ${signerName}`)

    return NextResponse.json({
      success: true,
      documentId,
      message: 'Document signed successfully',
      signedAt,
      downloadUrl: `/api/signatures/${documentId}/download`,
    })
  } catch (error) {
    console.error('Error signing document:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to sign document' },
      { status: 500 }
    )
  }
}

// GET - List all signed documents (for dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    let documents = Array.from(signedDocuments.values())

    // Filter by email if provided
    if (email) {
      documents = documents.filter(doc => doc.signerEmail === email)
    }

    // Return sanitized list (without base64 data for performance)
    const documentList = documents.map(doc => ({
      id: doc.id,
      documentName: doc.documentName,
      documentType: doc.documentType,
      documentSize: doc.documentSize,
      signerName: doc.signerName,
      signerEmail: doc.signerEmail,
      signerCompany: doc.signerCompany,
      signedAt: doc.signedAt,
    }))

    return NextResponse.json({
      success: true,
      documents: documentList,
      total: documentList.length,
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}
