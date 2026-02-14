import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id
    const email = req.nextUrl.searchParams.get('email')
    const token = req.nextUrl.searchParams.get('token')

    if (!documentId || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Fetch the signing request - exclude document_url to keep response small and fast
    // PDF data is fetched separately via /api/signing-requests/[id]/pdf
    const { data: signingRequest, error } = await supabaseAdmin
      .from('signing_requests')
      .select('id, user_id, document_name, sender_name, sender_email, signers, signature_fields, message, due_date, status, current_signer_index, created_at, updated_at')
      .eq('id', documentId)
      .single()

    if (error || !signingRequest) {
      console.error('Database error fetching signing request:', error)
      return NextResponse.json(
        { success: false, message: 'Document not found or has expired. Please contact the sender for a new link.' },
        { status: 404 }
      )
    }

    // Verify the signer exists in the document
    const signers = signingRequest.signers || []
    const signer = signers.find((s: { email: string }) =>
      s.email.toLowerCase() === email.toLowerCase()
    )

    if (!signer) {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to sign this document' },
        { status: 403 }
      )
    }

    // Check if already signed
    if (signer.status === 'signed') {
      return NextResponse.json(
        { success: false, message: 'You have already signed this document' },
        { status: 400 }
      )
    }

    // Debug logging
    console.log('📄 Returning document metadata for signing:', {
      id: signingRequest.id,
      documentName: signingRequest.document_name,
      signerEmail: email
    })

    // Return ALL fields with ownership metadata so the signing page can show
    // other signers' completed fields as locked/read-only overlays
    const allFields = signingRequest.signature_fields || []
    const allSigners = signingRequest.signers || []

    const enrichedFields = allFields.map((field: { signerOrder: number; id: string; [key: string]: any }) => {
      const fieldOwner = allSigners.find((s: { order: number }) => s.order === field.signerOrder)
      const isMine = field.signerOrder === signer.order
      const signerStatus = fieldOwner?.status || 'pending'

      // Get signed value from fieldOwner's fieldValues if they've signed
      let signedValue = null
      if (fieldOwner?.status === 'signed' && fieldOwner.fieldValues) {
        signedValue = fieldOwner.fieldValues[field.id] || null
      }

      return {
        ...field,
        isMine,
        signerStatus,
        signedValue,
        signerName: fieldOwner?.name || 'Unknown',
        signerColor: isMine ? undefined : (fieldOwner?.is_self ? '#8B5CF6' : undefined)
      }
    })

    // Return document metadata for signing (PDF data loaded separately via /pdf endpoint)
    return NextResponse.json({
      success: true,
      data: {
        id: signingRequest.id,
        documentName: signingRequest.document_name,
        pdfUrl: `/api/signing-requests/${documentId}/pdf?email=${encodeURIComponent(email)}${token ? `&token=${token}` : ''}`,
        senderName: signingRequest.sender_name,
        senderEmail: signingRequest.sender_email,
        message: signingRequest.message,
        dueDate: signingRequest.due_date,
        signers: signingRequest.signers,
        signatureFields: enrichedFields,
        currentSignerIndex: signingRequest.current_signer_index,
        status: signingRequest.status
      }
    })

  } catch (error) {
    console.error('Error fetching signing request:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
