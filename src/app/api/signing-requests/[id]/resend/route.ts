import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendSigningRequest } from '@/lib/email'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const requestId = params.id
    const { signerEmail } = await req.json().catch(() => ({ signerEmail: '' }))

    // Fetch the signing request
    const { data: signingRequest, error: fetchError } = await supabaseAdmin
      .from('signing_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !signingRequest) {
      return NextResponse.json(
        { success: false, message: 'Signing request not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (signingRequest.user_id !== userId) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to resend this document' },
        { status: 403 }
      )
    }

    // Cannot resend completed or voided documents
    if (['completed', 'voided'].includes(signingRequest.status)) {
      return NextResponse.json(
        { success: false, message: `Cannot resend a ${signingRequest.status} document` },
        { status: 400 }
      )
    }

    const signers = signingRequest.signers || []

    // If specific signer email provided, resend only to that signer
    if (signerEmail) {
      const signerIndex = signers.findIndex(
        (s: { email: string; status: string }) =>
          s.email.toLowerCase() === signerEmail.toLowerCase() && s.status !== 'signed'
      )

      if (signerIndex === -1) {
        return NextResponse.json(
          { success: false, message: 'Signer not found or already signed' },
          { status: 404 }
        )
      }

      try {
        await sendSigningRequest(
          {
            documentId: requestId,
            documentName: signingRequest.document_name,
            senderName: signingRequest.sender_name,
            senderEmail: signingRequest.sender_email,
            signers: signers.map((s: { name: string; email: string; order: number; status: string; token?: string }) => ({
              name: s.name,
              email: s.email,
              order: s.order,
              status: s.status as 'pending' | 'sent' | 'opened' | 'signed',
              token: s.token
            })),
            message: signingRequest.message,
            dueDate: signingRequest.due_date
          },
          signerIndex
        )

        return NextResponse.json({
          success: true,
          message: `Resent signing invite to ${signers[signerIndex].name}`
        })
      } catch (emailError) {
        console.error('Failed to resend:', emailError)
        return NextResponse.json(
          { success: false, message: 'Failed to send email' },
          { status: 500 }
        )
      }
    }

    // No specific signer - resend to all pending signers
    const pendingSigners = signers
      .map((s: { status: string }, i: number) => ({ ...s, index: i }))
      .filter((s: { status: string }) => s.status !== 'signed')

    if (pendingSigners.length === 0) {
      return NextResponse.json(
        { success: false, message: 'All signers have already signed' },
        { status: 400 }
      )
    }

    let sentCount = 0
    for (const signer of pendingSigners) {
      try {
        await sendSigningRequest(
          {
            documentId: requestId,
            documentName: signingRequest.document_name,
            senderName: signingRequest.sender_name,
            senderEmail: signingRequest.sender_email,
            signers: signers.map((s: { name: string; email: string; order: number; status: string; token?: string }) => ({
              name: s.name,
              email: s.email,
              order: s.order,
              status: s.status as 'pending' | 'sent' | 'opened' | 'signed',
              token: s.token
            })),
            message: signingRequest.message,
            dueDate: signingRequest.due_date
          },
          signer.index
        )
        sentCount++
      } catch (emailError) {
        console.error(`Failed to resend to ${signer.email}:`, emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Resent signing invites to ${sentCount} signer${sentCount !== 1 ? 's' : ''}`
    })
  } catch (error) {
    console.error('Error resending signing request:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
