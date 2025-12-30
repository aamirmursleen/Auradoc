import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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
    const { data: signingRequest, error } = await supabase
      .from('signing_requests')
      .select('*')
      .eq('id', documentId)
      .single()

    if (error || !signingRequest) {
      // For demo purposes, return mock data if database not set up
      return NextResponse.json({
        success: true,
        data: {
          id: documentId,
          documentName: 'Sample Agreement',
          documentUrl: null,
          senderName: 'Demo Sender',
          senderEmail: 'sender@demo.com',
          message: 'Please review and sign this document.',
          dueDate: null,
          signers: [
            { name: 'Signer', email: email, order: 1, status: 'pending' }
          ],
          signatureFields: [
            { id: '1', signerOrder: 1, x: 100, y: 600, width: 200, height: 60, type: 'signature', label: 'Sign 1' }
          ],
          currentSignerIndex: 0,
          status: 'pending'
        }
      })
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
