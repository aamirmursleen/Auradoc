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

    // Fetch the signing request
    const { data: signingRequest, error } = await supabaseAdmin
      .from('signing_requests')
      .select('*')
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
    console.log('📄 Returning document for signing:', {
      id: signingRequest.id,
      documentName: signingRequest.document_name,
      documentUrlLength: signingRequest.document_url?.length || 0,
      documentUrlPrefix: signingRequest.document_url?.substring(0, 100),
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

    // Return document data for signing
    return NextResponse.json({
      success: true,
      data: {
        id: signingRequest.id,
        documentName: signingRequest.document_name,
        documentUrl: signingRequest.document_url,
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
