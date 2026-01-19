// Email Service using Resend API
// Handles all email notifications for document signing workflow
// Updated with Odoo-style email templates

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email sender configuration - Using Resend's test domain for now
const FROM_EMAIL = process.env.NODE_ENV === 'production' ? 'MamaSign <noreply@mamasign.com>' : 'MamaSign <onboarding@resend.dev>'
const COMPANY_NAME = 'MamaSign'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Types for email service
export interface Signer {
  name: string
  email: string
  order: number
  status: 'pending' | 'sent' | 'opened' | 'signed'
  signedAt?: string
}

export interface DocumentEmailData {
  documentId: string
  documentName: string
  senderName: string
  senderEmail: string
  signers: Signer[]
  message?: string
  dueDate?: string
}

// MamaSign Dark Theme Email Template - Matches website theme
function getOdooStyleTemplate(params: {
  recipientName: string
  senderName: string
  documentName: string
  message?: string
  signingLink: string
  expiresAt?: string
}) {
  const { recipientName, senderName, documentName, message, signingLink, expiresAt } = params

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
          <!-- Header -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 35px 40px; text-align: center; border-bottom: 1px solid #2a2a2a;">
              <h1 style="margin: 0; color: #c4ff0e; font-size: 32px; font-weight: 700; letter-spacing: -1px;">MamaSign</h1>
              <p style="margin: 8px 0 0 0; color: #9CA3AF; font-size: 14px;">Secure Document Signing</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #ffffff;">Hello <strong style="color: #c4ff0e;">${recipientName}</strong>,</p>
              <p style="margin: 0 0 25px 0; font-size: 15px; color: #9CA3AF; line-height: 1.7;"><strong style="color: #ffffff;">${senderName}</strong> has sent you a document to sign. Please review and sign the document at your earliest convenience.</p>
              ${message ? `<div style="background-color: #2a2a2a; border-left: 4px solid #c4ff0e; padding: 15px 20px; margin: 0 0 25px 0; border-radius: 0 8px 8px 0;"><p style="margin: 0; font-size: 14px; color: #9CA3AF; font-style: italic;">"${message}"</p></div>` : ''}
              <!-- Document Card -->
              <div style="background-color: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 12px; padding: 20px; margin: 0 0 30px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="50" valign="top">
                      <div style="width: 44px; height: 44px; background-color: #c4ff0e; border-radius: 10px; text-align: center; line-height: 44px;">
                        <span style="font-size: 20px;">📄</span>
                      </div>
                    </td>
                    <td style="padding-left: 15px;">
                      <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #ffffff;">${documentName}</p>
                      <p style="margin: 0; font-size: 13px; color: #9CA3AF;">From: ${senderName}</p>
                      ${expiresAt ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #ef4444;">Expires: ${new Date(expiresAt).toLocaleDateString()}</p>` : ''}
                    </td>
                  </tr>
                </table>
              </div>
              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${signingLink}" style="display: inline-block; background-color: #c4ff0e; color: #000000; text-decoration: none; padding: 16px 50px; border-radius: 8px; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">Sign Document</a>
              </div>
              <!-- Security Note -->
              <div style="background-color: rgba(196, 255, 14, 0.1); border: 1px solid rgba(196, 255, 14, 0.2); border-radius: 8px; padding: 15px; margin: 25px 0 0 0;">
                <p style="margin: 0; font-size: 13px; color: #c4ff0e; text-align: center;">🔒 This document is encrypted and securely stored. Your signature will be legally binding.</p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 25px 40px; border-top: 1px solid #2a2a2a; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #c4ff0e;">${COMPANY_NAME}</p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Secure document signing made simple</p>
            </td>
          </tr>
        </table>
        <!-- Bottom Text -->
        <p style="margin: 20px 0 0 0; font-size: 11px; color: #6b7280; text-align: center;">© ${new Date().getFullYear()} MamaSign. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

/**
 * Generate plain text version of signing invite email
 */
function getPlainTextInvite(params: {
  recipientName: string
  senderName: string
  documentName: string
  signingLink: string
  message?: string
  expiresAt?: string
}): string {
  const { recipientName, senderName, documentName, signingLink, message, expiresAt } = params

  let text = `Hello ${recipientName},

${senderName} has sent you a document to sign. Please review and sign the document at your earliest convenience.

`
  if (message) {
    text += `Message from ${senderName}:
"${message}"

`
  }

  text += `Document: ${documentName}
From: ${senderName}
`

  if (expiresAt) {
    text += `Expires: ${new Date(expiresAt).toLocaleDateString()}
`
  }

  text += `
To sign this document, click the link below:
${signingLink}

This document is encrypted and securely stored. Your signature will be legally binding.

---
${COMPANY_NAME}
Secure document signing made simple
`

  return text
}

/**
 * Send signing invite to a signer (Odoo-style template)
 */
export async function sendSigningInvite(params: {
  to: string
  signerName: string
  senderName: string
  senderEmail: string
  documentName: string
  signingLink: string
  message?: string
  expiresAt?: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const { to, signerName, senderName, senderEmail, documentName, signingLink, message, expiresAt } = params

  const html = getOdooStyleTemplate({
    recipientName: signerName,
    senderName,
    documentName,
    message,
    signingLink,
    expiresAt
  })

  const text = getPlainTextInvite({
    recipientName: signerName,
    senderName,
    documentName,
    signingLink,
    message,
    expiresAt
  })

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: senderEmail,
      subject: `${senderName} sent you "${documentName}" to sign`,
      html,
      text,
      headers: {
        'X-Entity-Ref-ID': `signing-invite-${Date.now()}`,
      },
    })

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Failed to send signing invite:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Send signing request to the next signer in sequence
 */
export async function sendSigningRequest(data: DocumentEmailData, signerIndex: number) {
  const signer = data.signers[signerIndex]
  if (!signer) return { success: false, error: 'Signer not found' }

  const signUrl = `${APP_URL}/sign/${data.documentId}?signer=${signer.email}`

  const html = getOdooStyleTemplate({
    recipientName: signer.name,
    senderName: data.senderName,
    documentName: data.documentName,
    message: data.message,
    signingLink: signUrl,
    expiresAt: data.dueDate
  })

  const text = getPlainTextInvite({
    recipientName: signer.name,
    senderName: data.senderName,
    documentName: data.documentName,
    signingLink: signUrl,
    message: data.message,
    expiresAt: data.dueDate
  })

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: signer.email,
      replyTo: data.senderEmail,
      subject: `${data.senderName} sent you "${data.documentName}" to sign`,
      html,
      text,
      headers: {
        'X-Entity-Ref-ID': `signing-request-${data.documentId}-${signerIndex}`,
      },
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send signing request:', error)
    return { success: false, error }
  }
}

/**
 * Notify sender when a signer completes their signature
 */
export async function sendSignatureCompletedNotification(
  data: DocumentEmailData,
  signerIndex: number,
  isComplete: boolean
) {
  const signer = data.signers[signerIndex]
  if (!signer) return { success: false, error: 'Signer not found' }

  const signedCount = signerIndex + 1
  const total = data.signers.length
  const downloadLink = `${APP_URL}/documents/${data.documentId}`

  const html = `
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
            <td style="background-color: #0a0a0a; padding: 35px 40px; text-align: center; border-bottom: 1px solid #2a2a2a;">
              <div style="font-size: 50px; margin-bottom: 10px;">${isComplete ? '🎉' : '✅'}</div>
              <h1 style="margin: 0; color: #c4ff0e; font-size: 24px; font-weight: 700;">${isComplete ? 'All Signatures Complete!' : 'New Signature Received'}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #ffffff;">Hello <strong style="color: #c4ff0e;">${data.senderName}</strong>,</p>
              <p style="margin: 0 0 25px 0; font-size: 15px; color: #9CA3AF; line-height: 1.7;">${isComplete ? `Great news! All signers have completed signing "<strong style="color: #ffffff;">${data.documentName}</strong>". The document is now fully executed and ready for download.` : `<strong style="color: #ffffff;">${signer.name}</strong> has signed "<strong style="color: #ffffff;">${data.documentName}</strong>".`}</p>
              <div style="background-color: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 12px; padding: 20px; margin: 0 0 25px 0;">
                <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #c4ff0e; text-transform: uppercase; letter-spacing: 1px;">Signature Details</h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #3a3a3a;"><span style="font-size: 13px; color: #9CA3AF;">Document:</span></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #3a3a3a; text-align: right;"><span style="font-size: 14px; color: #ffffff; font-weight: 500;">${data.documentName}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #3a3a3a;"><span style="font-size: 13px; color: #9CA3AF;">Signed by:</span></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #3a3a3a; text-align: right;"><span style="font-size: 14px; color: #ffffff; font-weight: 500;">${signer.name}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #3a3a3a;"><span style="font-size: 13px; color: #9CA3AF;">Email:</span></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #3a3a3a; text-align: right;"><span style="font-size: 14px; color: #ffffff;">${signer.email}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><span style="font-size: 13px; color: #9CA3AF;">Signed at:</span></td>
                    <td style="padding: 8px 0; text-align: right;"><span style="font-size: 14px; color: #ffffff;">${new Date().toLocaleString()}</span></td>
                  </tr>
                </table>
              </div>
              ${total > 1 ? `<div style="margin: 0 0 25px 0;"><p style="font-size: 13px; color: #9CA3AF; margin-bottom: 8px;">Signing Progress: <strong style="color: #c4ff0e;">${signedCount}/${total} Complete</strong></p><div style="background-color: #2a2a2a; border-radius: 10px; height: 10px; overflow: hidden;"><div style="background-color: #c4ff0e; width: ${Math.round((signedCount / total) * 100)}%; height: 100%; border-radius: 10px;"></div></div></div>` : ''}
              <div style="text-align: center; margin: 30px 0;">
                <a href="${downloadLink}" style="display: inline-block; background-color: #c4ff0e; color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 700;">${isComplete ? 'Download Signed Document' : 'View Document Status'}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0a0a0a; padding: 25px 40px; border-top: 1px solid #2a2a2a; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #c4ff0e;">${COMPANY_NAME}</p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Secure document signing made simple</p>
            </td>
          </tr>
        </table>
        <p style="margin: 20px 0 0 0; font-size: 11px; color: #6b7280; text-align: center;">© ${new Date().getFullYear()} MamaSign. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.senderEmail,
      subject: isComplete ? `"${data.documentName}" is fully signed!` : `${signer.name} signed "${data.documentName}" (${signedCount}/${total})`,
      html,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send signature notification:', error)
    return { success: false, error }
  }
}

/**
 * Send confirmation to signer after they sign
 */
export async function sendSignerConfirmation(
  data: DocumentEmailData,
  signerIndex: number,
  isComplete: boolean
) {
  const signer = data.signers[signerIndex]
  if (!signer) return { success: false, error: 'Signer not found' }

  const downloadLink = `${APP_URL}/documents/${data.documentId}/download`

  const html = `
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
            <td style="background-color: #0a0a0a; padding: 35px 40px; text-align: center; border-bottom: 1px solid #2a2a2a;">
              <div style="font-size: 50px; margin-bottom: 10px;">✅</div>
              <h1 style="margin: 0; color: #c4ff0e; font-size: 24px; font-weight: 700;">Signature Confirmed!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #ffffff;">Hello <strong style="color: #c4ff0e;">${signer.name}</strong>,</p>
              <p style="margin: 0 0 25px 0; font-size: 15px; color: #9CA3AF; line-height: 1.7;">Your signature on "<strong style="color: #ffffff;">${data.documentName}</strong>" has been successfully recorded. ${isComplete ? 'All parties have now signed, and the document is complete. You can download your copy below.' : 'We will notify you when all parties have signed and the document is complete.'}</p>
              <div style="background-color: rgba(196, 255, 14, 0.1); border: 1px solid rgba(196, 255, 14, 0.2); border-radius: 12px; padding: 20px; margin: 0 0 25px 0;">
                <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #c4ff0e;">${data.documentName}</p>
                <p style="margin: 0; font-size: 13px; color: #9CA3AF;">Signed on ${new Date().toLocaleString()}</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">Requested by: ${data.senderName}</p>
              </div>
              ${isComplete ? `<div style="text-align: center; margin: 30px 0;"><a href="${downloadLink}" style="display: inline-block; background-color: #c4ff0e; color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 700;">Download Your Copy</a></div>` : '<div style="text-align: center; padding: 20px; background-color: #2a2a2a; border-radius: 8px;"><p style="margin: 0; font-size: 14px; color: #9CA3AF;">⏳ Waiting for other signatures...</p></div>'}
              <p style="margin: 25px 0 0 0; font-size: 13px; color: #6b7280; text-align: center;">Please keep this email for your records.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0a0a0a; padding: 25px 40px; border-top: 1px solid #2a2a2a; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #c4ff0e;">${COMPANY_NAME}</p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Secure document signing made simple</p>
            </td>
          </tr>
        </table>
        <p style="margin: 20px 0 0 0; font-size: 11px; color: #6b7280; text-align: center;">© ${new Date().getFullYear()} MamaSign. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: signer.email,
      subject: `Your signature on "${data.documentName}" is confirmed`,
      html,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send signer confirmation:', error)
    return { success: false, error }
  }
}

/**
 * Notify sender when document is opened
 */
export async function sendDocumentOpenedNotification(data: DocumentEmailData, signerIndex: number) {
  const signer = data.signers[signerIndex]
  if (!signer) return { success: false, error: 'Signer not found' }

  const html = `
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
            <td style="background-color: #0a0a0a; padding: 35px 40px; text-align: center; border-bottom: 1px solid #2a2a2a;">
              <div style="font-size: 40px; margin-bottom: 10px;">👀</div>
              <h1 style="margin: 0; color: #c4ff0e; font-size: 22px; font-weight: 700;">Document Viewed</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #ffffff;">Hi <strong style="color: #c4ff0e;">${data.senderName}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #9CA3AF; line-height: 1.7;"><strong style="color: #ffffff;">${signer.name}</strong> just opened your document "<strong style="color: #ffffff;">${data.documentName}</strong>". They may be reviewing it now.</p>
              <div style="background-color: #2a2a2a; border-radius: 12px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #9CA3AF;">Viewer: <strong style="color: #ffffff;">${signer.email}</strong><br>Opened at: <strong style="color: #ffffff;">${new Date().toLocaleString()}</strong></p>
              </div>
              <p style="margin: 20px 0 0 0; font-size: 14px; color: #6b7280;">You'll receive another notification when they complete their signature.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0a0a0a; padding: 20px 40px; text-align: center; border-top: 1px solid #2a2a2a;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Powered by <strong style="color: #c4ff0e;">${COMPANY_NAME}</strong></p>
            </td>
          </tr>
        </table>
        <p style="margin: 20px 0 0 0; font-size: 11px; color: #6b7280; text-align: center;">© ${new Date().getFullYear()} MamaSign. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.senderEmail,
      subject: `${signer.name} viewed "${data.documentName}"`,
      html,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send opened notification:', error)
    return { success: false, error }
  }
}

/**
 * Send document completed notification to ALL signers
 */
export async function sendDocumentCompletedToAll(data: DocumentEmailData) {
  const results = []

  for (const signer of data.signers) {
    try {
      const result = await sendSignerConfirmation(data, data.signers.indexOf(signer), true)
      results.push({ email: signer.email, success: result.success, data: result })
    } catch (error) {
      results.push({ email: signer.email, success: false, error })
    }
  }

  return results
}

/**
 * Send reminder to current signer
 */
export async function sendSigningReminder(
  data: DocumentEmailData,
  signerIndex: number,
  reminderNumber: number
) {
  const signer = data.signers[signerIndex]
  if (!signer) return { success: false, error: 'Signer not found' }

  const signUrl = `${APP_URL}/sign/${data.documentId}?signer=${signer.email}`
  const isUrgent = reminderNumber >= 3

  const html = `
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
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #1e1e1e; border-radius: 16px; overflow: hidden; border: 1px solid ${isUrgent ? '#ef4444' : '#2a2a2a'};">
          <tr>
            <td style="background-color: #0a0a0a; padding: 35px 40px; text-align: center; border-bottom: 1px solid #2a2a2a;">
              <div style="font-size: 40px; margin-bottom: 10px;">${isUrgent ? '⚠️' : '⏰'}</div>
              <h1 style="margin: 0; color: ${isUrgent ? '#ef4444' : '#c4ff0e'}; font-size: 22px; font-weight: 700;">${isUrgent ? 'Urgent: Signature Required' : 'Reminder: Signature Needed'}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #ffffff;">Hi <strong style="color: #c4ff0e;">${signer.name}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #9CA3AF; line-height: 1.7;">${isUrgent ? `This is an urgent reminder that "<strong style="color: #ffffff;">${data.documentName}</strong>" requires your immediate attention.` : `Just a friendly reminder that "<strong style="color: #ffffff;">${data.documentName}</strong>" is still waiting for your signature.`}</p>
              <div style="background-color: #2a2a2a; border-radius: 12px; padding: 20px; margin: 20px 0; ${isUrgent ? 'border: 1px solid #ef4444;' : ''}">
                <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #ffffff;">${data.documentName}</p>
                <p style="margin: 0; font-size: 13px; color: #9CA3AF;">From: ${data.senderName}</p>
                ${data.dueDate ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: ${isUrgent ? '#ef4444' : '#9CA3AF'};">Due: ${new Date(data.dueDate).toLocaleDateString()}</p>` : ''}
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${signUrl}" style="display: inline-block; background-color: ${isUrgent ? '#ef4444' : '#c4ff0e'}; color: ${isUrgent ? '#ffffff' : '#000000'}; text-decoration: none; padding: 16px 50px; border-radius: 8px; font-size: 16px; font-weight: 700;">Sign Now</a>
              </div>
              <p style="margin: 20px 0 0 0; font-size: 13px; color: #6b7280; text-align: center;">If you have questions, please contact ${data.senderEmail}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0a0a0a; padding: 20px 40px; text-align: center; border-top: 1px solid #2a2a2a;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Powered by <strong style="color: #c4ff0e;">${COMPANY_NAME}</strong></p>
            </td>
          </tr>
        </table>
        <p style="margin: 20px 0 0 0; font-size: 11px; color: #6b7280; text-align: center;">© ${new Date().getFullYear()} MamaSign. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`

  const text = `Hello ${signer.name},

${isUrgent ? `This is an urgent reminder that "${data.documentName}" requires your immediate attention.` : `Just a friendly reminder that "${data.documentName}" is still waiting for your signature.`}

Document: ${data.documentName}
From: ${data.senderName}
${data.dueDate ? `Due: ${new Date(data.dueDate).toLocaleDateString()}` : ''}

To sign this document, click the link below:
${signUrl}

If you have questions, please contact ${data.senderEmail}

---
${COMPANY_NAME}
Secure document signing made simple
`

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: signer.email,
      replyTo: data.senderEmail,
      subject: isUrgent ? `Urgent: Your signature is needed on "${data.documentName}"` : `Reminder: "${data.documentName}" awaits your signature`,
      html,
      text,
      headers: {
        'X-Entity-Ref-ID': `signing-reminder-${data.documentId}-${signerIndex}-${reminderNumber}`,
      },
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send reminder:', error)
    return { success: false, error }
  }
}

/**
 * Send document declined notification
 */
export async function sendDocumentDeclined(
  data: DocumentEmailData,
  signerIndex: number,
  reason?: string
) {
  const signer = data.signers[signerIndex]
  if (!signer) return { success: false, error: 'Signer not found' }

  const html = `
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
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #1e1e1e; border-radius: 16px; overflow: hidden; border: 1px solid #ef4444;">
          <tr>
            <td style="background-color: #0a0a0a; padding: 35px 40px; text-align: center; border-bottom: 1px solid #2a2a2a;">
              <div style="font-size: 40px; margin-bottom: 10px;">❌</div>
              <h1 style="margin: 0; color: #ef4444; font-size: 22px; font-weight: 700;">Document Declined</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #ffffff;">Hi <strong style="color: #c4ff0e;">${data.senderName}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #9CA3AF; line-height: 1.7;">Unfortunately, <strong style="color: #ffffff;">${signer.name}</strong> has declined to sign "<strong style="color: #ffffff;">${data.documentName}</strong>".</p>
              ${reason ? `<div style="background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;"><p style="margin: 0; font-size: 14px; color: #ef4444;"><strong>Reason:</strong> "${reason}"</p></div>` : ''}
              <div style="background-color: #2a2a2a; border-radius: 12px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #9CA3AF;">Document: <strong style="color: #ffffff;">${data.documentName}</strong><br>Declined by: <strong style="color: #ffffff;">${signer.name}</strong> (${signer.email})<br>Declined at: <strong style="color: #ffffff;">${new Date().toLocaleString()}</strong></p>
              </div>
              <p style="margin: 20px 0; font-size: 14px; color: #9CA3AF;">You may want to reach out to ${signer.name} to discuss their concerns, or create a new document with revisions.</p>
              <div style="text-align: center; margin: 25px 0;">
                <a href="${APP_URL}/documents" style="display: inline-block; background-color: #c4ff0e; color: #000000; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-size: 15px; font-weight: 700;">View Documents</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0a0a0a; padding: 20px 40px; text-align: center; border-top: 1px solid #2a2a2a;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Powered by <strong style="color: #c4ff0e;">${COMPANY_NAME}</strong></p>
            </td>
          </tr>
        </table>
        <p style="margin: 20px 0 0 0; font-size: 11px; color: #6b7280; text-align: center;">© ${new Date().getFullYear()} MamaSign. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.senderEmail,
      subject: `${signer.name} declined to sign "${data.documentName}"`,
      html,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send declined notification:', error)
    return { success: false, error }
  }
}
