export interface SignatureData {
  id: string
  signature: string // Base64 encoded signature image
  signedAt: string // ISO timestamp
  ipAddress?: string
  userAgent?: string
}

export interface SignerInfo {
  name: string
  email: string
  company?: string
  title?: string
}

export interface DocumentData {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  content?: string // Base64 encoded document
}

export interface SignedDocument {
  id: string
  document: DocumentData
  signer: SignerInfo
  signature: SignatureData
  status: 'pending' | 'signed' | 'completed'
  createdAt: string
  completedAt?: string
  auditTrail: AuditEvent[]
}

export interface AuditEvent {
  id: string
  action: 'created' | 'viewed' | 'signed' | 'downloaded' | 'sent'
  timestamp: string
  ipAddress?: string
  userAgent?: string
  details?: string
}

export interface SignatureRequest {
  document: File | null
  signer: SignerInfo
  signature: string | null
}

export interface SignatureResponse {
  success: boolean
  documentId?: string
  message?: string
  signedDocument?: SignedDocument
}
