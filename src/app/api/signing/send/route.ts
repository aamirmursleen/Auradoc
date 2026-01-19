import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Use onboarding.resend.dev for testing, or verified domain for production
const FROM_EMAIL = process.env.NODE_ENV === 'production'
  ? 'MamaSign <noreply@mamasign.com>'
  : 'MamaSign <onboarding@resend.dev>'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { document_id } = body

    if (!document_id) {
      return NextResponse.json(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // Fetch document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .eq('user_id', userId)
      .single()

    // Fetch signers
    const { data: signers, error: signersError } = await supabase
      .from('document_signers')
      .select('*')
      .eq('document_id', document_id)
      .order('order', { ascending: true })

    // Fetch fields
    const { data: fields } = await supabase
      .from('document_fields')
      .select('*')
      .eq('document_id', document_id)

    if (!signers || signers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please add at least one signer' },
        { status: 400 }
      )
    }

    if (!fields || fields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please add at least one field' },
        { status: 400 }
      )
    }

    const senderName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Someone'
    const senderEmail = user.emailAddresses[0]?.emailAddress || ''
    const documentName = document?.name || 'Document'

    // Create signing request
    const signingRequestId = crypto.randomUUID()

    const signersWithTokens = signers.map((signer: any) => ({
      ...signer,
      token: crypto.randomUUID(),
      status: 'pending'
    }))

    await supabase
      .from('signing_requests')
      .insert({
        id: signingRequestId,
        document_id,
        user_id: userId,
        document_name: documentName,
        document_url: document?.file_url,
        sender_name: senderName,
        sender_email: senderEmail,
        signers: signersWithTokens,
        signature_fields: fields,
        status: 'pending',
        current_signer_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    // Update document status
    await supabase
      .from('documents')
      .update({ status: 'sent', updated_at: new Date().toISOString() })
      .eq('id', document_id)

    // Send email to signers (excluding self-signers who will sign directly)
    let emailsSent = 0
    let emailErrors: string[] = []

    for (const signer of signersWithTokens) {
      // Skip if this is a self-signer (uploader signing themselves)
      if (signer.is_self) {
        continue
      }

      const signingLink = `${APP_URL}/sign/${signingRequestId}?token=${signer.token}&email=${encodeURIComponent(signer.email)}`

      try {
        const result = await resend.emails.send({
          from: FROM_EMAIL,
          replyTo: senderEmail,
          to: signer.email,
          subject: `${senderName} sent you "${documentName}" to sign`,
          html: getEmailTemplate({
            recipientName: signer.name || 'there',
            senderName,
            documentName,
            signingLink
          }),
          text: `Hello ${signer.name || 'there'},\n\n${senderName} has sent you a document to sign.\n\nDocument: ${documentName}\n\nPlease click the link below to sign:\n${signingLink}\n\nThis document is encrypted and securely stored. Your signature will be legally binding.\n\n- MamaSign`,
          headers: {
            'X-Entity-Ref-ID': crypto.randomUUID()
          }
        })

        if (result.data?.id) {
          emailsSent++
          // Update signer status
          await supabase
            .from('document_signers')
            .update({ status: 'sent' })
            .eq('id', signer.id)
        }
      } catch (emailError: any) {
        console.error(`Failed to send email to ${signer.email}:`, emailError)
        emailErrors.push(`Failed to send to ${signer.email}: ${emailError.message}`)
      }
    }

    // Check if there's a self-signer
    const selfSigner = signersWithTokens.find((s: any) => s.is_self)
    const selfSigningLink = selfSigner
      ? `${APP_URL}/sign/${signingRequestId}?token=${selfSigner.token}&email=${encodeURIComponent(selfSigner.email)}`
      : null

    return NextResponse.json({
      success: true,
      message: emailErrors.length > 0
        ? `Document sent with ${emailErrors.length} email error(s)`
        : 'Document sent for signing!',
      signingRequestId,
      emailsSent,
      emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
      selfSigningLink // Return this so uploader can sign immediately
    })

  } catch (error: any) {
    console.error('Error sending document:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

function getEmailTemplate(params: {
  recipientName: string
  senderName: string
  documentName: string
  signingLink: string
  message?: string
}) {
  const { recipientName, senderName, documentName, signingLink, message } = params

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #1e1e1e; border-radius: 16px; overflow: hidden; border: 1px solid #2a2a2a;">
          <tr>
            <td style="background-color: #1e1e1e; padding: 30px 40px; text-align: center; border-bottom: 1px solid #2a2a2a;">
              <h1 style="margin: 0; color: #c4ff0e; font-size: 28px; font-weight: 700;">MamaSign</h1>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 14px;">Secure Document Signing</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; background-color: #1e1e1e;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #e0e0e0;">Hello <strong style="color: #ffffff;">${recipientName}</strong>,</p>
              <p style="margin: 0 0 25px 0; font-size: 15px; color: #9ca3af; line-height: 1.6;"><strong style="color: #ffffff;">${senderName}</strong> has sent you a document to sign. Please review and sign the document at your earliest convenience.</p>
              ${message ? `<div style="background-color: #2a2a2a; border-left: 4px solid #c4ff0e; padding: 15px 20px; margin: 0 0 25px 0; border-radius: 0 8px 8px 0;"><p style="margin: 0; font-size: 14px; color: #e0e0e0; font-style: italic;">"${message}"</p></div>` : ''}
              <div style="background-color: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 12px; padding: 20px; margin: 0 0 30px 0;">
                <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #ffffff;">${documentName}</p>
                <p style="margin: 0; font-size: 13px; color: #9ca3af;">From: ${senderName}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${signingLink}" style="display: inline-block; background-color: #c4ff0e; color: #000000; text-decoration: none; padding: 16px 50px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(196, 255, 14, 0.3);">Sign Document</a>
              </div>
              <div style="background-color: rgba(196, 255, 14, 0.1); border: 1px solid rgba(196, 255, 14, 0.2); border-radius: 8px; padding: 15px; margin: 25px 0 0 0;">
                <p style="margin: 0; font-size: 13px; color: #c4ff0e; text-align: center;">This document is encrypted and securely stored. Your signature will be legally binding.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #252525; padding: 25px 40px; border-top: 1px solid #2a2a2a; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #c4ff0e;">MamaSign</p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Secure document signing made simple</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
