// Database Types for Supabase

export type DocumentStatus = 'created' | 'delivered' | 'opened' | 'signed' | 'completed'

export interface User {
  id: string
  clerk_id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  name: string
  file_url: string | null
  status: DocumentStatus
  sender_name: string | null
  sender_email: string | null
  recipient_name: string | null
  recipient_email: string | null
  created_at: string
  updated_at: string
}

export interface DocumentEvent {
  id: string
  document_id: string
  status: DocumentStatus
  description: string | null
  ip_address: string | null
  device: string | null
  created_at: string
}

export interface EmailNotification {
  id: string
  document_id: string
  type: string
  recipient: string
  status: string
  sent_at: string
}

export interface Signature {
  id: string
  document_id: string
  user_id: string
  signature_image: string | null
  x_position: number | null
  y_position: number | null
  width: number | null
  height: number | null
  page_number: number
  created_at: string
}

// Insert Types (for creating new records)
export interface CreateDocument {
  user_id: string
  name: string
  file_url?: string
  status?: DocumentStatus
  sender_name?: string
  sender_email?: string
  recipient_name?: string
  recipient_email?: string
}

export interface CreateDocumentEvent {
  document_id: string
  status: DocumentStatus
  description?: string
  ip_address?: string
  device?: string
}

export interface CreateEmailNotification {
  document_id: string
  type: string
  recipient: string
  status?: string
}

export interface CreateSignature {
  document_id: string
  user_id: string
  signature_image?: string
  x_position?: number
  y_position?: number
  width?: number
  height?: number
  page_number?: number
}
