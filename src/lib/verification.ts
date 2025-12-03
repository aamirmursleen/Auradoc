// Document Verification Service - Supabase Operations

import { supabase } from './supabase'
import { generateDocumentHash, compareDocuments, HashResult, ComparisonResult, DocumentMetadata } from './hash'

// Types
export interface DocumentVerification {
  id: string
  user_id: string
  document_name: string
  original_hash: string
  file_size: number
  file_type: string
  page_count: number | null
  metadata: DocumentMetadata
  created_at: string
}

export interface VerificationCheck {
  id: string
  verification_id: string
  uploaded_hash: string
  is_tampered: boolean
  confidence_level: string
  differences: ComparisonResult['differences']
  checked_at: string
}

export interface RegisterDocumentResult {
  verification: DocumentVerification
  hashResult: HashResult
}

export interface VerifyDocumentResult {
  verification: DocumentVerification
  check: VerificationCheck
  comparison: ComparisonResult
  uploadedHashResult: HashResult
}

// ============ REGISTER ORIGINAL DOCUMENT ============

export async function registerOriginalDocument(
  file: File,
  userId: string
): Promise<RegisterDocumentResult> {
  // Generate hash for the document
  const hashResult = await generateDocumentHash(file)

  // Store in Supabase
  const { data, error } = await supabase
    .from('document_verifications')
    .insert({
      user_id: userId,
      document_name: file.name,
      original_hash: hashResult.hash,
      file_size: hashResult.metadata.fileSize,
      file_type: hashResult.metadata.fileType,
      page_count: hashResult.metadata.pageCount || null,
      metadata: hashResult.metadata
    })
    .select()
    .single()

  if (error) {
    console.error('Error registering document:', error)
    throw new Error('Failed to register document for verification')
  }

  return {
    verification: data,
    hashResult
  }
}

// ============ VERIFY DOCUMENT AGAINST ORIGINAL ============

export async function verifyDocument(
  file: File,
  verificationId: string
): Promise<VerifyDocumentResult> {
  // Get original verification record
  const { data: verification, error: fetchError } = await supabase
    .from('document_verifications')
    .select('*')
    .eq('id', verificationId)
    .single()

  if (fetchError || !verification) {
    throw new Error('Original document record not found')
  }

  // Generate hash for uploaded document
  const uploadedHashResult = await generateDocumentHash(file)

  // Reconstruct original hash result for comparison
  const originalHashResult: HashResult = {
    hash: verification.original_hash,
    metadata: verification.metadata as DocumentMetadata,
    rawDataHash: verification.original_hash,
    metadataHash: '',
    combinedHash: ''
  }

  // Compare documents
  const comparison = compareDocuments(originalHashResult, uploadedHashResult)

  // Store verification check in database
  const { data: check, error: checkError } = await supabase
    .from('verification_checks')
    .insert({
      verification_id: verificationId,
      uploaded_hash: uploadedHashResult.hash,
      is_tampered: comparison.isTampered,
      confidence_level: comparison.confidenceLevel,
      differences: comparison.differences
    })
    .select()
    .single()

  if (checkError) {
    console.error('Error storing verification check:', checkError)
    throw new Error('Failed to store verification result')
  }

  return {
    verification,
    check,
    comparison,
    uploadedHashResult
  }
}

// ============ GET USER'S REGISTERED DOCUMENTS ============

export async function getUserVerifications(userId: string): Promise<DocumentVerification[]> {
  try {
    const { data, error } = await supabase
      .from('document_verifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      // If table doesn't exist or permission denied, return empty array
      if (error.code === '42P01' || error.code === 'PGRST116' || error.code === '42501') {
        console.warn('Verifications table not accessible:', error.message)
        return []
      }
      console.error('Error fetching verifications:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error fetching verifications:', err)
    return []
  }
}

// ============ GET SINGLE VERIFICATION ============

export async function getVerification(verificationId: string): Promise<DocumentVerification | null> {
  const { data, error } = await supabase
    .from('document_verifications')
    .select('*')
    .eq('id', verificationId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching verification:', error)
    throw error
  }

  return data
}

// ============ GET VERIFICATION HISTORY ============

export async function getVerificationHistory(verificationId: string): Promise<VerificationCheck[]> {
  const { data, error } = await supabase
    .from('verification_checks')
    .select('*')
    .eq('verification_id', verificationId)
    .order('checked_at', { ascending: false })

  if (error) {
    console.error('Error fetching verification history:', error)
    throw error
  }

  return data || []
}

// ============ DELETE VERIFICATION ============

export async function deleteVerification(verificationId: string): Promise<void> {
  const { error } = await supabase
    .from('document_verifications')
    .delete()
    .eq('id', verificationId)

  if (error) {
    console.error('Error deleting verification:', error)
    throw error
  }
}

// ============ QUICK VERIFY (without registration) ============

export async function quickVerifyByHash(
  file: File,
  originalHash: string
): Promise<{ isTampered: boolean; uploadedHash: string; match: boolean }> {
  const hashResult = await generateDocumentHash(file)

  return {
    isTampered: hashResult.hash !== originalHash,
    uploadedHash: hashResult.hash,
    match: hashResult.hash === originalHash
  }
}

// ============ GENERATE VERIFICATION REPORT ============

export interface VerificationReport {
  documentName: string
  originalHash: string
  uploadedHash: string
  verificationDate: string
  status: 'VERIFIED' | 'TAMPERED'
  confidenceLevel: string
  summary: string
  details: {
    hashComparison: {
      match: boolean
      original: string
      uploaded: string
    }
    sizeComparison: {
      match: boolean
      original: number
      uploaded: number
      difference: number
    }
    typeComparison: {
      match: boolean
      original: string
      uploaded: string
    }
    pageCountComparison?: {
      match: boolean
      original: number
      uploaded: number
    }
  }
  differences: ComparisonResult['differences']
  recommendation: string
}

export function generateVerificationReport(
  verification: DocumentVerification,
  comparison: ComparisonResult,
  uploadedHashResult: HashResult
): VerificationReport {
  const report: VerificationReport = {
    documentName: verification.document_name,
    originalHash: verification.original_hash,
    uploadedHash: uploadedHashResult.hash,
    verificationDate: new Date().toISOString(),
    status: comparison.isTampered ? 'TAMPERED' : 'VERIFIED',
    confidenceLevel: comparison.confidenceLevel,
    summary: comparison.summary,
    details: {
      hashComparison: {
        match: comparison.hashMatch,
        original: verification.original_hash,
        uploaded: uploadedHashResult.hash
      },
      sizeComparison: {
        match: comparison.sizeMatch,
        original: verification.file_size,
        uploaded: uploadedHashResult.metadata.fileSize,
        difference: uploadedHashResult.metadata.fileSize - verification.file_size
      },
      typeComparison: {
        match: comparison.typeMatch,
        original: verification.file_type,
        uploaded: uploadedHashResult.metadata.fileType
      }
    },
    differences: comparison.differences,
    recommendation: ''
  }

  // Add page count comparison if available
  if (verification.page_count !== null && uploadedHashResult.metadata.pageCount !== undefined) {
    report.details.pageCountComparison = {
      match: comparison.pageCountMatch || false,
      original: verification.page_count,
      uploaded: uploadedHashResult.metadata.pageCount
    }
  }

  // Generate recommendation
  if (comparison.isTampered) {
    report.recommendation = 'WARNING: This document has been modified since its original registration. Do NOT accept this document as authentic. Request the original unmodified document from the source.'
  } else {
    report.recommendation = 'This document is verified as authentic and unchanged from the original. It is safe to accept and use this document.'
  }

  return report
}
