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
        signatureFields: signingRequest.signature_fields || [],
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
