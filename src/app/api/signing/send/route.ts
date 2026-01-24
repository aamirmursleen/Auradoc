import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mamasign.com'

// Use verified mamasign.com domain for all emails
const FROM_EMAIL = 'MamaSign <noreply@mamasign.com>'

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

    // Send email to signers in parallel (excluding self-signers who will sign directly)
    let emailsSent = 0
    let emailErrors: string[] = []

    const emailPromises = signersWithTokens
      .filter((signer: any) => !signer.is_self)
      .map(async (signer: any) => {
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
            // Update signer status in background (don't wait)
            supabase
              .from('document_signers')
              .update({ status: 'sent' })
              .eq('id', signer.id)
              .then(() => {})
              .catch((err: any) => console.error('Failed to update signer status:', err))
          }
          return { success: true, email: signer.email }
        } catch (emailError: any) {
          console.error(`Failed to send email to ${signer.email}:`, emailError)
          emailErrors.push(`Failed to send to ${signer.email}: ${emailError.message}`)
          return { success: false, email: signer.email, error: emailError.message }
        }
      })

    // Wait for all emails to be sent in parallel
    await Promise.all(emailPromises)

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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
          <tr>
            <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">MamaSign</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Hello <strong>${recipientName}</strong>,</p>
              <p style="margin: 0 0 25px 0; font-size: 15px; color: #555555; line-height: 1.6;"><strong>${senderName}</strong> has sent you a document to sign. Please review and sign the document at your earliest convenience.</p>
              ${message ? `<div style="background-color: #f9f9f9; border-left: 4px solid #000000; padding: 15px 20px; margin: 0 0 25px 0;"><p style="margin: 0; font-size: 14px; color: #555555; font-style: italic;">"${message}"</p></div>` : ''}
              <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
                <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #000000;">📄 ${documentName}</p>
                <p style="margin: 0; font-size: 13px; color: #666666;">From: ${senderName}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${signingLink}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 50px; border-radius: 6px; font-size: 16px; font-weight: 600;">Sign Document</a>
              </div>
              <p style="margin: 25px 0 0 0; font-size: 13px; color: #888888; text-align: center;">🔒 This document is encrypted and securely stored.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 25px 40px; border-top: 1px solid #e0e0e0; text-align: center;">
              <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 600; color: #000000;">MamaSign</p>
              <p style="margin: 0; font-size: 12px; color: #888888;">Secure document signing made simple</p>
            </td>
          </tr>
        </table>
        <p style="margin: 20px 0 0 0; font-size: 11px; color: #999999; text-align: center;">© ${new Date().getFullYear()} MamaSign. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
