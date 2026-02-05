import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendSignatureCompletedNotification, sendSigningRequest } from '@/lib/email'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id
    const body = await req.json()
    const { signerEmail, token, signature, signedFields, fieldValues, fieldPositions } = body

    // Capture IP and User Agent for audit trail
    const forwardedFor = req.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    console.log('📝 Sign request received:', { documentId, signerEmail, hasSignature: !!signature, signedFieldsCount: signedFields?.length })

    if (!documentId || !signerEmail) {
      console.error('❌ Missing required fields:', { documentId, signerEmail })
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Fetch the signing request
    const { data: signingRequest, error: fetchError } = await supabaseAdmin
      .from('signing_requests')
      .select('*')
      .eq('id', documentId)
      .single()

    if (fetchError) {
      console.error('❌ Error fetching signing request:', fetchError)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch signing request: ' + fetchError.message },
        { status: 500 }
      )
    }

    if (!signingRequest) {
      console.error('❌ Signing request not found:', documentId)
      return NextResponse.json(
        { success: false, message: 'Signing request not found' },
        { status: 404 }
      )
    }

    console.log('✅ Signing request found:', {
      id: signingRequest.id,
      status: signingRequest.status,
      signersCount: signingRequest.signers?.length
    })

    // Find and update the signer - create a deep copy to avoid reference issues
    const signers = JSON.parse(JSON.stringify(signingRequest.signers || []))
    const signerIndex = signers.findIndex((s: { email: string }) =>
      s.email.toLowerCase() === signerEmail.toLowerCase()
    )

    console.log('🔍 Signer lookup:', {
      signerEmail,
      signerIndex,
      signersEmails: signers.map((s: { email: string }) => s.email),
      currentStatuses: signers.map((s: { email: string; status: string }) => ({ email: s.email, status: s.status }))
    })

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

    // Update signer status and store their field values + signature + custom positions
    const signedAt = new Date().toISOString()
    signers[signerIndex].status = 'signed'
    signers[signerIndex].signedAt = signedAt
    signers[signerIndex].signatureImage = signature && signature !== 'no-signature-field' ? signature : null
    signers[signerIndex].fieldValues = fieldValues || {}
    signers[signerIndex].fieldPositions = fieldPositions || {} // Store custom field positions (resized by signer)

    console.log('📝 Updated signer in array:', {
      signerIndex,
      newStatus: signers[signerIndex].status,
      signedAt,
      allSigners: signers.map((s: { email: string; status: string }) => ({ email: s.email, status: s.status }))
    })

    // Store signature record with audit trail
    const { error: recordError } = await supabaseAdmin
      .from('signature_records')
      .insert({
        signing_request_id: documentId,
        signer_email: signerEmail,
        signer_name: signers[signerIndex].name,
        signature_image: signature && signature !== 'no-signature-field' ? signature : null,
        signature_type: signature && signature !== 'no-signature-field' ? 'draw' : 'fields_only',
        ip_address: ipAddress,
        user_agent: userAgent,
        consent_given: true,
        consent_text: 'I agree to sign this document electronically',
        signed_at: signedAt,
        field_values: { values: fieldValues || {}, positions: fieldPositions || {} }
      })

    if (recordError) {
      console.error('⚠️ Error storing signature record:', recordError)
      // Don't fail the request, signature record is for audit
    }

    // Check if all signers have signed
    const allSigned = signers.every((s: { status: string }) => s.status === 'signed')
    const nextSignerIndex = signers.findIndex((s: { status: string }) => s.status === 'pending')

    console.log('📊 Signing progress:', {
      allSigned,
      nextSignerIndex,
      signedCount: signers.filter((s: { status: string }) => s.status === 'signed').length,
      totalSigners: signers.length
    })

    // Update the signing request
    const updatePayload = {
      signers,
      current_signer_index: nextSignerIndex >= 0 ? nextSignerIndex : signerIndex,
      status: allSigned ? 'completed' : 'in_progress',
      updated_at: new Date().toISOString()
    }

    console.log('💾 Updating signing_requests with:', {
      documentId,
      status: updatePayload.status,
      signersCount: updatePayload.signers.length,
      signersStatuses: updatePayload.signers.map((s: { email: string; status: string }) => ({ email: s.email, status: s.status }))
    })

    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('signing_requests')
      .update(updatePayload)
      .eq('id', documentId)
      .select()

    if (updateError) {
      console.error('❌ Update error:', updateError)
      return NextResponse.json(
        { success: false, message: 'Failed to update signing status: ' + updateError.message },
        { status: 500 }
      )
    }

    console.log('✅ Signing request updated successfully:', {
      id: updateData?.[0]?.id,
      status: updateData?.[0]?.status,
      signersStatuses: updateData?.[0]?.signers?.map((s: { email: string; status: string }) => ({ email: s.email, status: s.status }))
    })

    // Also update document_signers table if signer has an id (for consistency)
    const signerId = signers[signerIndex].id
    if (signerId) {
      const { error: signerUpdateError } = await supabaseAdmin
        .from('document_signers')
        .update({
          status: 'signed',
          signed_at: signedAt,
          updated_at: new Date().toISOString()
        })
        .eq('id', signerId)

      if (signerUpdateError) {
        console.error('⚠️ Error updating document_signers:', signerUpdateError)
      } else {
        console.log('✅ document_signers table updated for signer:', signerId)
      }
    }

    // Update document status if all signed
    if (allSigned && signingRequest.document_id) {
      const { error: docUpdateError } = await supabaseAdmin
        .from('documents')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', signingRequest.document_id)

      if (docUpdateError) {
        console.error('⚠️ Error updating document status:', docUpdateError)
      } else {
        console.log('✅ Document status updated to completed')
      }
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

      await supabaseAdmin
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
            isComplete: allSigned,
            ipAddress: ipAddress,
            userAgent: userAgent.substring(0, 100) // Truncate for storage
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
            signers: signers.map((s: { name: string; email: string; order: number; status: string; token?: string }) => ({
              name: s.name,
              email: s.email,
              order: s.order,
              status: s.status as 'pending' | 'sent' | 'opened' | 'signed',
              token: s.token
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
