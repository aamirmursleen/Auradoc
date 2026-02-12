import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendDocumentVoidedNotification } from '@/lib/email'

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
    const { reason } = await req.json().catch(() => ({ reason: '' }))

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
        { success: false, message: 'Not authorized to void this document' },
        { status: 403 }
      )
    }

    // Cannot void already completed or already voided documents
    if (signingRequest.status === 'completed') {
      return NextResponse.json(
        { success: false, message: 'Cannot void a completed document' },
        { status: 400 }
      )
    }

    if (signingRequest.status === 'voided') {
      return NextResponse.json(
        { success: false, message: 'Document is already voided' },
        { status: 400 }
      )
    }

    // Update signing request status to voided
    const { error: updateError } = await supabaseAdmin
      .from('signing_requests')
      .update({
        status: 'voided',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)

    if (updateError) {
      console.error('Error voiding signing request:', updateError)
      return NextResponse.json(
        { success: false, message: 'Failed to void document' },
        { status: 500 }
      )
    }

    // Create notification for the sender (stores void details in metadata)
    try {
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'document_voided',
          title: 'Document Voided',
          message: `You voided "${signingRequest.document_name}"${reason ? `: ${reason}` : ''}`,
          document_id: requestId,
          document_name: signingRequest.document_name,
          metadata: {
            voidedAt: new Date().toISOString(),
            voidedBy: userId,
            reason: reason || null
          },
          is_read: false,
          created_at: new Date().toISOString()
        })
    } catch (notifError) {
      console.error('Failed to create void notification:', notifError)
    }

    // Send void notification emails to all pending signers
    const pendingSigners = (signingRequest.signers || []).filter(
      (s: { status: string }) => s.status !== 'signed'
    )

    if (pendingSigners.length > 0) {
      try {
        await sendDocumentVoidedNotification({
          documentName: signingRequest.document_name,
          senderName: signingRequest.sender_name,
          senderEmail: signingRequest.sender_email,
          signers: pendingSigners,
          voidReason: reason
        })
      } catch (emailError) {
        console.error('Failed to send void notification emails:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Document voided successfully'
    })
  } catch (error) {
    console.error('Error voiding signing request:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
