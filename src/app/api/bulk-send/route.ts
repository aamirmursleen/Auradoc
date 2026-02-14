import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import { rateLimit } from '@/lib/rate-limit'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_EMAIL = 'MamaSign <noreply@mamasign.com>'

// Send a single email via Resend API
async function sendEmail(params: {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
        reply_to: params.replyTo,
        headers: {
          'X-Entity-Ref-ID': uniqueId,
          'Message-ID': `<${uniqueId}@mamasign.com>`,
          'List-Unsubscribe': '<mailto:unsubscribe@mamasign.com?subject=Unsubscribe>',
        },
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return { success: false, error: data.message || `HTTP ${response.status}` }
    }
    return { success: true, id: data.id }
  } catch (error: any) {
    return { success: false, error: error.message || String(error) }
  }
}

// Simple email template for bulk send
function getEmailHtml(recipientName: string, senderName: string, documentName: string, signingLink: string, message?: string, expiresAt?: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#ffffff;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
<tr><td align="center" style="padding:30px 20px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:14px;color:#333;line-height:1.6;">Hi ${recipientName},</p></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${senderName} has shared a document with you for signature:</p></td></tr>
<tr><td style="padding:15px;background-color:#f7f7f7;border-radius:4px;">
<p style="margin:0 0 5px 0;font-size:14px;font-weight:bold;color:#333;">${documentName}</p>
<p style="margin:0;font-size:13px;color:#666;">Sent by: ${senderName}</p>
${expiresAt ? `<p style="margin:5px 0 0 0;font-size:12px;color:#888;">Due by: ${new Date(expiresAt).toLocaleDateString()}</p>` : ''}
</td></tr>
${message ? `<tr><td style="padding:20px 0 0 0;"><p style="margin:0;font-size:13px;color:#666;font-style:italic;">"${message}"</p></td></tr>` : ''}
<tr><td style="padding:25px 0;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
<td style="background-color:#0066cc;border-radius:4px;">
<a href="${signingLink}" style="display:inline-block;padding:12px 30px;color:#fff;text-decoration:none;font-size:14px;font-weight:bold;">Review and Sign</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:12px;color:#888;line-height:1.5;">
If the button doesn't work, copy and paste this link:<br>
<a href="${signingLink}" style="color:#0066cc;word-break:break-all;">${signingLink}</a>
</p></td></tr>
<tr><td style="padding:20px 0 0 0;border-top:1px solid #eee;"><p style="margin:0;font-size:11px;color:#999;line-height:1.5;">
This email was sent by MamaSign on behalf of ${senderName}.<br>
MamaSign - Kickstart 58A2, Gulberg, Lahore, Pakistan
</p></td></tr>
</table></td></tr></table></body></html>`
}

function getEmailText(recipientName: string, senderName: string, documentName: string, signingLink: string, message?: string) {
  return `Hi ${recipientName},\n\n${senderName} has shared a document with you for signature:\n\nDocument: ${documentName}\n${message ? `Message: "${message}"\n` : ''}\nTo review and sign: ${signingLink}\n\n---\nMamaSign`
}

export async function POST(req: NextRequest) {
  const rateLimited = rateLimit(req, { limit: 5, windowSeconds: 60 })
  if (rateLimited) return rateLimited

  try {
    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      )
    }

    const { documentName, documentData, recipients, message, dueDate, senderName: providedSenderName } = body

    if (!documentName || !documentData || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (documentName, documentData, recipients)' },
        { status: 400 }
      )
    }

    if (recipients.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Maximum 500 recipients per batch' },
        { status: 400 }
      )
    }

    // Auth with timeout fallback
    let userId: string | null = null
    let user: any = null
    try {
      const authPromise = Promise.all([auth(), currentUser()])
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve([{ userId: null }, null]), 3000))
      const [authResult, userResult] = await Promise.race([authPromise, timeoutPromise]) as [{ userId: string | null }, any]
      userId = authResult?.userId || null
      user = userResult
    } catch {
      // Continue without auth
    }

    const clerkUserName = user ? ((user.firstName || '') + ' ' + (user.lastName || '')).trim() : ''
    const senderName = providedSenderName?.trim() || clerkUserName || 'MamaSign User'
    const senderEmail = user?.emailAddresses?.[0]?.emailAddress || 'noreply@mamasign.com'
    const effectiveUserId = userId || 'demo-user'

    console.log(`📧 Bulk send: ${recipients.length} recipients for "${documentName}"`)

    // Create all signing requests in DB at once
    const results: Array<{ email: string; name: string; status: 'sent' | 'failed'; error?: string }> = []

    // Process in batches of 10 to avoid overwhelming the API
    const BATCH_SIZE = 10
    const MAX_RETRIES = 2

    for (let batchStart = 0; batchStart < recipients.length; batchStart += BATCH_SIZE) {
      const batch = recipients.slice(batchStart, batchStart + BATCH_SIZE)

      const batchPromises = batch.map(async (recipient: { name: string; email: string }) => {
        const signingRequestId = crypto.randomUUID()
        const signerToken = crypto.randomUUID()

        const signerData = [{
          name: recipient.name,
          email: recipient.email,
          order: 1,
          is_self: false,
          status: 'pending',
          signedAt: null,
          token: signerToken,
        }]

        // Insert signing request into DB
        const { error: insertError } = await supabaseAdmin
          .from('signing_requests')
          .insert({
            id: signingRequestId,
            user_id: effectiveUserId,
            document_name: documentName,
            document_url: documentData,
            sender_name: senderName,
            sender_email: senderEmail,
            signers: signerData,
            signature_fields: [],
            message: message || null,
            due_date: dueDate || null,
            status: 'pending',
            current_signer_index: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (insertError) {
          console.error(`❌ DB error for ${recipient.email}:`, insertError.message)
          return { email: recipient.email, name: recipient.name, status: 'failed' as const, error: 'Database error' }
        }

        // Send email with retry
        const signingLink = `${APP_URL}/s/${signerToken}`
        let emailResult: { success: boolean; error?: string } = { success: false }

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          emailResult = await sendEmail({
            to: recipient.email,
            subject: `${senderName} shared "${documentName}" for your signature`,
            html: getEmailHtml(recipient.name, senderName, documentName, signingLink, message, dueDate),
            text: getEmailText(recipient.name, senderName, documentName, signingLink, message),
            replyTo: senderEmail,
          })

          if (emailResult.success) break

          // Wait before retry (exponential backoff)
          if (attempt < MAX_RETRIES) {
            await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
          }
        }

        if (emailResult.success) {
          console.log(`✅ Sent to ${recipient.email}`)
          return { email: recipient.email, name: recipient.name, status: 'sent' as const }
        } else {
          console.error(`❌ Failed ${recipient.email}: ${emailResult.error}`)
          return { email: recipient.email, name: recipient.name, status: 'failed' as const, error: emailResult.error }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
    }

    const sentCount = results.filter(r => r.status === 'sent').length
    const failedCount = results.filter(r => r.status === 'failed').length

    console.log(`📧 Bulk send complete: ${sentCount} sent, ${failedCount} failed`)

    return NextResponse.json({
      success: true,
      sentCount,
      failedCount,
      total: recipients.length,
      results,
    })

  } catch (error) {
    console.error('Bulk send error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
