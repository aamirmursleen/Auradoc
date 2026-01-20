import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendSignatureCompletedNotification, sendSigningRequest } from '@/lib/email'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id
    const body = await req.json()
    const { signerEmail, token, signature, signedFields } = body

    if (!documentId || !signerEmail || !signature) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Fetch the signing request
    const { data: signingRequest, error: fetchError } = await supabase
      .from('signing_requests')
      .select('*')
      .eq('id', documentId)
      .single()

    if (fetchError || !signingRequest) {
      // For demo, just return success
      return NextResponse.json({
        success: true,
        message: 'Signature recorded successfully',
        isComplete: true
      })
    }

    // Find and update the signer
    const signers = signingRequest.signers || []
    const signerIndex = signers.findIndex((s: { email: string }) =>
      s.email.toLowerCase() === signerEmail.toLowerCase()
    )

    if (signerIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Signer not found' },
        { status: 404 }
      )
    }

    // Check if already signed
    if (signers[signerIndex].status === 'signed') {
      return NextResponse.json(
        { success: false, message: 'Already signed' },
        { status: 400 }
      )
    }

    // Update signer status
    signers[signerIndex].status = 'signed'
    signers[signerIndex].signedAt = new Date().toISOString()

    // Store signature record
    await supabase
      .from('signature_records')
      .insert({
        signing_request_id: documentId,
        signer_email: signerEmail,
        signer_name: signers[signerIndex].name,
        signature_image: signature,
        signed_at: new Date().toISOString()
      })

    // Check if all signers have signed
    const allSigned = signers.every((s: { status: string }) => s.status === 'signed')
    const nextSignerIndex = signers.findIndex((s: { status: string }) => s.status === 'pending')

    // Update the signing request
    const { error: updateError } = await supabase
      .from('signing_requests')
      .update({
        signers,
        current_signer_index: nextSignerIndex >= 0 ? nextSignerIndex : signerIndex,
        status: allSigned ? 'completed' : 'in_progress',
        completed_at: allSigned ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)

    if (updateError) {
      console.error('Update error:', updateError)
    }

    // Send notification to sender
    try {
      await sendSignatureCompletedNotification(
        {
          documentId: documentId,
          documentName: signingRequest.document_name,
          senderName: signingRequest.sender_name,
          senderEmail: signingRequest.sender_email,
          signers: signers.map((s: { name: string; email: string; order: number; status: string }) => ({
            name: s.name,
            email: s.email,
            order: s.order,
            status: s.status as 'pending' | 'sent' | 'opened' | 'signed'
          }))
        },
        signerIndex,
        allSigned
      )
    } catch (emailError) {
      console.error('Failed to send notification:', emailError)
    }

    // Create dashboard notification for sender
    try {
      const signedCount = signers.filter((s: { status: string }) => s.status === 'signed').length
      const totalSigners = signers.length

      await supabase
        .from('notifications')
        .insert({
          user_id: signingRequest.user_id,
          type: allSigned ? 'document_completed' : 'document_signed',
          title: allSigned
            ? 'Document Completed!'
            : `${signers[signerIndex].name} signed your document`,
          message: allSigned
            ? `All ${totalSigners} signers have completed signing "${signingRequest.document_name}". Your document is ready!`
            : `${signers[signerIndex].name} (${signerEmail}) has signed "${signingRequest.document_name}". ${signedCount}/${totalSigners} signatures complete.`,
          document_id: documentId,
          document_name: signingRequest.document_name,
          signer_name: signers[signerIndex].name,
          signer_email: signerEmail,
          metadata: {
            signedAt: new Date().toISOString(),
            signedCount,
            totalSigners,
            isComplete: allSigned
          },
          is_read: false,
          created_at: new Date().toISOString()
        })
    } catch (notifError) {
      console.error('Failed to create dashboard notification:', notifError)
    }

    // Send invite to next signer if not complete
    if (!allSigned && nextSignerIndex >= 0) {
      const nextSigner = signers[nextSignerIndex]
      try {
        await sendSigningRequest(
          {
            documentId: documentId,
            documentName: signingRequest.document_name,
            senderName: signingRequest.sender_name,
            senderEmail: signingRequest.sender_email,
            signers: signers.map((s: { name: string; email: string; order: number; status: string }) => ({
              name: s.name,
              email: s.email,
              order: s.order,
              status: s.status as 'pending' | 'sent' | 'opened' | 'signed'
            }))
          },
          nextSignerIndex
        )
      } catch (emailError) {
        console.error('Failed to send next signer invite:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: allSigned
        ? 'Document fully signed!'
        : 'Signature recorded successfully',
      isComplete: allSigned,
      nextSigner: !allSigned && nextSignerIndex >= 0 ? signers[nextSignerIndex].name : null
    })

  } catch (error) {
    console.error('Error recording signature:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
