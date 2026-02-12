// Documents Service - Supabase CRUD Operations

import { supabase } from './supabase'
import {
  Document,
  DocumentEvent,
  EmailNotification,
  Signature,
  CreateDocument,
  CreateDocumentEvent,
  CreateEmailNotification,
  CreateSignature,
  DocumentStatus
} from './types'

// ============ DOCUMENTS ============

// Get all documents for a user
export async function getUserDocuments(userId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching documents:', error)
    throw error
  }

  return data || []
}

// Signer interface for signing requests
export interface SigningRequestSigner {
  name: string
  email: string
  order: number
  status: 'pending' | 'sent' | 'opened' | 'signed'
  signedAt?: string
  token?: string
  is_self?: boolean
}

// Signing Request interface
export interface SigningRequest {
  id: string
  user_id: string
  document_name: string
  document_url: string
  sender_name: string
  sender_email: string
  signers: SigningRequestSigner[]
  message?: string
  due_date?: string
  status: 'pending' | 'in_progress' | 'completed' | 'declined' | 'expired' | 'voided'
  current_signer_index: number
  declined_by?: string
  declined_reason?: string
  declined_at?: string
  completed_at?: string
  voided_at?: string
  voided_by?: string
  void_reason?: string
  created_at: string
  updated_at: string
}

// Get all signing requests for a user
export async function getUserSigningRequests(userId: string): Promise<SigningRequest[]> {
  const { data, error } = await supabase
    .from('signing_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching signing requests:', error)
    throw error
  }

  return data || []
}

// Get single signing request by ID
export async function getSigningRequest(requestId: string): Promise<SigningRequest | null> {
  const { data, error } = await supabase
    .from('signing_requests')
    .select('*')
    .eq('id', requestId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching signing request:', error)
    throw error
  }

  return data
}

// Delete signing request
export async function deleteSigningRequest(requestId: string): Promise<void> {
  const { error } = await supabase
    .from('signing_requests')
    .delete()
    .eq('id', requestId)

  if (error) {
    console.error('Error deleting signing request:', error)
    throw error
  }
}

// Get single document by ID
export async function getDocument(documentId: string): Promise<Document | null> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching document:', error)
    throw error
  }

  return data
}

// Create new document
export async function createDocument(document: CreateDocument): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
    .single()

  if (error) {
    console.error('Error creating document:', error)
    throw error
  }

  return data
}

// Update document
export async function updateDocument(
  documentId: string,
  updates: Partial<Document>
): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', documentId)
    .select()
    .single()

  if (error) {
    console.error('Error updating document:', error)
    throw error
  }

  return data
}

// Update document status
export async function updateDocumentStatus(
  documentId: string,
  status: DocumentStatus
): Promise<Document> {
  return updateDocument(documentId, { status })
}

// Delete document
export async function deleteDocument(documentId: string): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)

  if (error) {
    console.error('Error deleting document:', error)
    throw error
  }
}

// Get signing requests where user is a signer (inbox)
export async function getInboxSigningRequests(userEmail: string): Promise<SigningRequest[]> {
  const { data, error } = await supabase
    .from('signing_requests')
    .select('*')
    .contains('signers', [{ email: userEmail }])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching inbox signing requests:', error)
    throw error
  }

  return data || []
}

// ============ DOCUMENT EVENTS (Audit Trail) ============

// Get all events for a document
export async function getDocumentEvents(documentId: string): Promise<DocumentEvent[]> {
  const { data, error } = await supabase
    .from('document_events')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching document events:', error)
    throw error
  }

  return data || []
}

// Create document event
export async function createDocumentEvent(event: CreateDocumentEvent): Promise<DocumentEvent> {
  const { data, error } = await supabase
    .from('document_events')
    .insert(event)
    .select()
    .single()

  if (error) {
    console.error('Error creating document event:', error)
    throw error
  }

  return data
}

// ============ EMAIL NOTIFICATIONS ============

// Get all notifications for a document
export async function getDocumentNotifications(documentId: string): Promise<EmailNotification[]> {
  const { data, error } = await supabase
    .from('email_notifications')
    .select('*')
    .eq('document_id', documentId)
    .order('sent_at', { ascending: false })

  if (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }

  return data || []
}

// Create email notification
export async function createEmailNotification(
  notification: CreateEmailNotification
): Promise<EmailNotification> {
  const { data, error } = await supabase
    .from('email_notifications')
    .insert(notification)
    .select()
    .single()

  if (error) {
    console.error('Error creating notification:', error)
    throw error
  }

  return data
}

// ============ SIGNATURES ============

// Get all signatures for a document
export async function getDocumentSignatures(documentId: string): Promise<Signature[]> {
  const { data, error } = await supabase
    .from('signatures')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching signatures:', error)
    throw error
  }

  return data || []
}

// Create signature
export async function createSignature(signature: CreateSignature): Promise<Signature> {
  const { data, error } = await supabase
    .from('signatures')
    .insert(signature)
    .select()
    .single()

  if (error) {
    console.error('Error creating signature:', error)
    throw error
  }

  return data
}

// ============ COMBINED OPERATIONS ============

// Get document with all related data
export async function getDocumentWithDetails(documentId: string) {
  const [document, events, notifications, signatures] = await Promise.all([
    getDocument(documentId),
    getDocumentEvents(documentId),
    getDocumentNotifications(documentId),
    getDocumentSignatures(documentId)
  ])

  if (!document) return null

  return {
    ...document,
    events,
    notifications,
    signatures
  }
}

// Create document with initial event
export async function createDocumentWithEvent(
  document: CreateDocument,
  initialDescription: string = 'Document created and ready for sending'
): Promise<{ document: Document; event: DocumentEvent }> {
  // Create document
  const newDocument = await createDocument(document)

  // Create initial event
  const event = await createDocumentEvent({
    document_id: newDocument.id,
    status: 'created',
    description: initialDescription
  })

  return { document: newDocument, event }
}

// Send document (update status + create event + create notification)
export async function sendDocument(
  documentId: string,
  recipientEmail: string
): Promise<void> {
  // Update status
  await updateDocumentStatus(documentId, 'delivered')

  // Create event
  await createDocumentEvent({
    document_id: documentId,
    status: 'delivered',
    description: `Document delivered to ${recipientEmail}`
  })

  // Create notification
  await createEmailNotification({
    document_id: documentId,
    type: 'Document Delivered',
    recipient: recipientEmail
  })
}

// Mark document as opened
export async function markDocumentOpened(
  documentId: string,
  recipientName: string,
  senderEmail: string,
  ipAddress?: string,
  device?: string
): Promise<void> {
  // Update status
  await updateDocumentStatus(documentId, 'opened')

  // Create event
  await createDocumentEvent({
    document_id: documentId,
    status: 'opened',
    description: `Document opened by ${recipientName}`,
    ip_address: ipAddress,
    device: device
  })

  // Create notification to sender
  await createEmailNotification({
    document_id: documentId,
    type: 'Document Opened',
    recipient: senderEmail
  })
}

// Sign document
export async function signDocument(
  documentId: string,
  userId: string,
  recipientName: string,
  senderEmail: string,
  signatureData?: CreateSignature,
  ipAddress?: string,
  device?: string
): Promise<void> {
  // Create signature if provided
  if (signatureData) {
    await createSignature(signatureData)
  }

  // Create signed event
  await createDocumentEvent({
    document_id: documentId,
    status: 'signed',
    description: `Document signed by ${recipientName}`,
    ip_address: ipAddress,
    device: device
  })

  // Update to completed
  await updateDocumentStatus(documentId, 'completed')

  // Create completed event
  await createDocumentEvent({
    document_id: documentId,
    status: 'completed',
    description: 'All parties have signed. Document completed.'
  })

  // Create notification
  await createEmailNotification({
    document_id: documentId,
    type: 'Document Signed',
    recipient: senderEmail
  })
}
