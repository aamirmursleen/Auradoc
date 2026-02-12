import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rate-limit'

const resend = new Resend(process.env.RESEND_API_KEY)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mamasign.com'
const FROM_EMAIL = 'MamaSign <noreply@mamasign.com>'

export async function POST(req: NextRequest) {
  const rateLimited = rateLimit(req, { limit: 5, windowSeconds: 60 })
  if (rateLimited) return rateLimited

  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Email service not configured. Please contact support.' },
        { status: 500 }
      )
    }

    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to send documents' },
        { status: 401 }
      )
    }

    let body
    try {
      body = await req.json()
    } catch (e) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }
    const { recipients, subject, message, documentName, fields } = body

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please add at least one recipient' },
        { status: 400 }
      )
    }

    const senderName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Someone'
    const senderEmail = user.emailAddresses[0]?.emailAddress || ''

    // Prepare emails for all recipients
    const emailsToSend = recipients.map((recipientEmail: string) => ({
      from: FROM_EMAIL,
      to: recipientEmail,
      replyTo: senderEmail,
      subject: subject || `${senderName} sent you a document to sign`,
      html: getEmailTemplate({
        recipientEmail,
        senderName,
        documentName: documentName || 'Document',
        message: message || '',
        fieldsCount: fields || 0,
      }),
      text: `Hello,\n\n${senderName} has sent you a document to sign.\n\nDocument: ${documentName || 'Document'}\n\n${message ? `Message: ${message}\n\n` : ''}Please check your inbox for further instructions.\n\n- MamaSign`,
    }))

    let emailsSent = 0
    let emailErrors: string[] = []

    // Send emails
    if (emailsToSend.length > 0) {
      try {
        if (emailsToSend.length === 1) {
          await resend.emails.send(emailsToSend[0])
          emailsSent = 1
        } else {
          const result = await resend.batch.send(emailsToSend)
          if (result.data) {
            emailsSent = Array.isArray(result.data) ? result.data.length : 1
          }
        }
      } catch (emailError: any) {
        console.error('Email send error:', emailError)

        // Try individual sends if batch fails
        for (const email of emailsToSend) {
          try {
            await resend.emails.send(email)
            emailsSent++
          } catch (e: any) {
            emailErrors.push(`Failed to send to ${email.to}: ${e.message}`)
          }
        }
      }
    }

    if (emailsSent === 0 && emailErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: emailErrors[0] },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Email${emailsSent > 1 ? 's' : ''} sent successfully!`,
      emailsSent,
      emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
    })

  } catch (error: any) {
    console.error('Error sending signature request:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}

function getEmailTemplate(params: {
  recipientEmail: string
  senderName: string
  documentName: string
  message: string
  fieldsCount: number
}) {
  const { recipientEmail, senderName, documentName, message, fieldsCount } = params

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
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">MamaSign</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Secure Document Signing</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Hello,</p>
              <p style="margin: 0 0 25px 0; font-size: 15px; color: #555555; line-height: 1.6;">
                <strong>${senderName}</strong> has requested your signature on a document.
              </p>

              ${message ? `
              <div style="background-color: #f0fdfa; border-left: 4px solid #0d9488; padding: 15px 20px; margin: 0 0 25px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 14px; color: #555555; font-style: italic;">"${message}"</p>
              </div>
              ` : ''}

              <!-- Document Card -->
              <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 12px; padding: 20px; margin: 0 0 30px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="50" valign="top">
                      <div style="width: 44px; height: 44px; background-color: #0d9488; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: #ffffff; font-size: 20px;">📄</span>
                      </div>
                    </td>
                    <td style="padding-left: 15px;">
                      <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">${documentName}</p>
                      <p style="margin: 0; font-size: 13px; color: #666666;">From: ${senderName}</p>
                      ${fieldsCount > 0 ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #888888;">${fieldsCount} signature field${fieldsCount > 1 ? 's' : ''} to complete</p>` : ''}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${APP_URL}" style="display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; padding: 16px 50px; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(13, 148, 136, 0.3);">
                  View Document
                </a>
              </div>

              <p style="margin: 25px 0 0 0; font-size: 13px; color: #888888; text-align: center;">
                🔒 Your document is encrypted and securely stored.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 25px 40px; border-top: 1px solid #e0e0e0; text-align: center;">
              <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 600; color: #0d9488;">MamaSign</p>
              <p style="margin: 0; font-size: 12px; color: #888888;">Secure document signing made simple</p>
            </td>
          </tr>
        </table>

        <p style="margin: 20px 0 0 0; font-size: 11px; color: #999999; text-align: center;">
          © ${new Date().getFullYear()} MamaSign. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
