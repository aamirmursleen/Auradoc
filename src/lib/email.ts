// Email Service using Resend API
// Handles all email notifications for document signing workflow
// Updated with Odoo-style email templates

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email sender configuration - Using verified mamasign.com domain for better deliverability
const FROM_EMAIL = 'MamaSign <noreply@mamasign.com>'
const COMPANY_NAME = 'MamaSign'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mamasign.com'

// Types for email service
export interface Signer {
  name: string
  email: string
  order: number
  status: 'pending' | 'sent' | 'opened' | 'signed'
  signedAt?: string
  token?: string
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

// Clean professional email template - optimized to avoid spam filters
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
  <title>Document for signature</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 30px 20px;">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px;">
          <tr>
            <td style="padding: 0 0 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.6;">
                Hi ${recipientName},
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 0 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.6;">
                ${senderName} has shared a document with you for signature:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 15px; background-color: #f7f7f7; border-radius: 4px;">
              <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #333333;">${documentName}</p>
              <p style="margin: 0; font-size: 13px; color: #666666;">Sent by: ${senderName}</p>
              ${expiresAt ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #888888;">Due by: ${new Date(expiresAt).toLocaleDateString()}</p>` : ''}
            </td>
          </tr>
          ${message ? `
          <tr>
            <td style="padding: 20px 0 0 0;">
              <p style="margin: 0; font-size: 13px; color: #666666; font-style: italic;">"${message}"</p>
            </td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 25px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="background-color: #0066cc; border-radius: 4px;">
                    <a href="${signingLink}" style="display: inline-block; padding: 12px 30px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: bold;">Review and Sign</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 0 20px 0;">
              <p style="margin: 0; font-size: 12px; color: #888888; line-height: 1.5;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${signingLink}" style="color: #0066cc; word-break: break-all;">${signingLink}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0 0 0; border-top: 1px solid #eeeeee;">
              <p style="margin: 0; font-size: 11px; color: #999999; line-height: 1.5;">
                This email was sent by MamaSign on behalf of ${senderName}.<br>
                MamaSign - Kickstart 58A2, Gulberg, Lahore, Pakistan<br>
                <a href="mailto:support@mamasign.com" style="color: #999999;">Contact Support</a>
              </p>
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

  let text = `Hi ${recipientName},

${senderName} has shared a document with you for signature:

Document: ${documentName}
Sent by: ${senderName}
`

  if (expiresAt) {
    text += `Due by: ${new Date(expiresAt).toLocaleDateString()}
`
  }

  if (message) {
    text += `
Message: "${message}"
`
  }

  text += `
To review and sign, visit:
${signingLink}

---
This email was sent by MamaSign on behalf of ${senderName}.
MamaSign - Kickstart 58A2, Gulberg, Lahore, Pakistan
Contact: support@mamasign.com
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
    // Generate unique message ID to prevent spam filters from grouping emails
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: senderEmail,
      subject: `${senderName} shared "${documentName}" for your signature`,
      html,
      text,
      headers: {
        'X-Entity-Ref-ID': uniqueId,
        'Message-ID': `<${uniqueId}@mamasign.com>`,
        'References': `<doc-${documentName.replace(/[^a-z0-9]/gi, '')}-${Date.now()}@mamasign.com>`,
        'List-Unsubscribe': '<mailto:unsubscribe@mamasign.com?subject=Unsubscribe>',
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

  // Use short URL if token is available, otherwise fall back to full URL
  const signUrl = signer.token
    ? `${APP_URL}/s/${signer.token}`
    : `${APP_URL}/sign/${data.documentId}?email=${encodeURIComponent(signer.email)}`

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
        'Message-ID': `<signing-request-${data.documentId}-${signerIndex}-${Date.now()}@mamasign.com>`,
        'List-Unsubscribe': '<mailto:unsubscribe@mamasign.com>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Feedback-ID': 'mamasign:notification',
      },
      // Disable tracking to improve deliverability
      // @ts-ignore - tracking option may not be in types but works in API
      tracking: {
        clicks: false,
        opens: false,
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
          <tr>
            <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
              <div style="font-size: 40px; margin-bottom: 10px;">${isComplete ? '🎉' : '✅'}</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">${isComplete ? 'All Signatures Complete!' : 'New Signature Received'}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Hello <strong>${data.senderName}</strong>,</p>
              <p style="margin: 0 0 25px 0; font-size: 15px; color: #555555; line-height: 1.7;">${isComplete ? `Great news! All signers have completed signing "<strong>${data.documentName}</strong>". The document is now fully executed and ready for download.` : `<strong>${signer.name}</strong> has signed "<strong>${data.documentName}</strong>".`}</p>
              <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 0 0 25px 0;">
                <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #000000; text-transform: uppercase; letter-spacing: 1px;">Signature Details</h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><span style="font-size: 13px; color: #666666;">Document:</span></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;"><span style="font-size: 14px; color: #000000; font-weight: 500;">${data.documentName}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><span style="font-size: 13px; color: #666666;">Signed by:</span></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;"><span style="font-size: 14px; color: #000000; font-weight: 500;">${signer.name}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><span style="font-size: 13px; color: #666666;">Email:</span></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;"><span style="font-size: 14px; color: #333333;">${signer.email}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><span style="font-size: 13px; color: #666666;">Signed at:</span></td>
                    <td style="padding: 8px 0; text-align: right;"><span style="font-size: 14px; color: #333333;">${new Date().toLocaleString()}</span></td>
                  </tr>
                </table>
              </div>
              ${total > 1 ? `<div style="margin: 0 0 25px 0;"><p style="font-size: 13px; color: #666666; margin-bottom: 8px;">Signing Progress: <strong style="color: #000000;">${signedCount}/${total} Complete</strong></p><div style="background-color: #e0e0e0; border-radius: 10px; height: 10px; overflow: hidden;"><div style="background-color: #000000; width: ${Math.round((signedCount / total) * 100)}%; height: 100%; border-radius: 10px;"></div></div></div>` : ''}
              <div style="text-align: center; margin: 30px 0;">
                <a href="${downloadLink}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">${isComplete ? 'Download Signed Document' : 'View Document Status'}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 25px 40px; border-top: 1px solid #e0e0e0; text-align: center;">
              <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 600; color: #000000;">${COMPANY_NAME}</p>
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

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.senderEmail,
      subject: isComplete ? `"${data.documentName}" is fully signed!` : `${signer.name} signed "${data.documentName}" (${signedCount}/${total})`,
      html,
      headers: {
        'X-Entity-Ref-ID': `signature-notification-${data.documentId}-${Date.now()}`,
        'Message-ID': `<signature-notification-${data.documentId}-${Date.now()}@mamasign.com>`,
        'List-Unsubscribe': '<mailto:unsubscribe@mamasign.com>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Feedback-ID': 'mamasign:notification',
      },
      // Disable tracking to improve deliverability
      // @ts-ignore - tracking option may not be in types but works in API
      tracking: {
        clicks: false,
        opens: false,
      },
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
          <tr>
            <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
              <div style="font-size: 40px; margin-bottom: 10px;">✅</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">Signature Confirmed!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Hello <strong>${signer.name}</strong>,</p>
              <p style="margin: 0 0 25px 0; font-size: 15px; color: #555555; line-height: 1.7;">Your signature on "<strong>${data.documentName}</strong>" has been successfully recorded. ${isComplete ? 'All parties have now signed, and the document is complete. You can download your copy below.' : 'We will notify you when all parties have signed and the document is complete.'}</p>
              <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 0 0 25px 0;">
                <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #000000;">${data.documentName}</p>
                <p style="margin: 0; font-size: 13px; color: #666666;">Signed on ${new Date().toLocaleString()}</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #888888;">Requested by: ${data.senderName}</p>
              </div>
              ${isComplete ? `<div style="text-align: center; margin: 30px 0;"><a href="${downloadLink}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">Download Your Copy</a></div>` : '<div style="text-align: center; padding: 20px; background-color: #f9f9f9; border-radius: 8px;"><p style="margin: 0; font-size: 14px; color: #666666;">⏳ Waiting for other signatures...</p></div>'}
              <p style="margin: 25px 0 0 0; font-size: 13px; color: #888888; text-align: center;">Please keep this email for your records.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 25px 40px; border-top: 1px solid #e0e0e0; text-align: center;">
              <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 600; color: #000000;">${COMPANY_NAME}</p>
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

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: signer.email,
      subject: `Your signature on "${data.documentName}" is confirmed`,
      html,
      headers: {
        'X-Entity-Ref-ID': `signer-confirmation-${data.documentId}-${Date.now()}`,
        'Message-ID': `<signer-confirmation-${data.documentId}-${Date.now()}@mamasign.com>`,
        'List-Unsubscribe': '<mailto:unsubscribe@mamasign.com>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Feedback-ID': 'mamasign:notification',
      },
      // Disable tracking to improve deliverability
      // @ts-ignore - tracking option may not be in types but works in API
      tracking: {
        clicks: false,
        opens: false,
      },
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
          <tr>
            <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
              <div style="font-size: 40px; margin-bottom: 10px;">👀</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">Document Viewed</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333;">Hi <strong>${data.senderName}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.7;"><strong>${signer.name}</strong> just opened your document "<strong>${data.documentName}</strong>". They may be reviewing it now.</p>
              <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #666666;">Viewer: <strong style="color: #000000;">${signer.email}</strong><br>Opened at: <strong style="color: #000000;">${new Date().toLocaleString()}</strong></p>
              </div>
              <p style="margin: 20px 0 0 0; font-size: 14px; color: #888888;">You'll receive another notification when they complete their signature.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 12px; color: #888888;">Powered by <strong style="color: #000000;">${COMPANY_NAME}</strong></p>
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

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.senderEmail,
      subject: `${signer.name} viewed "${data.documentName}"`,
      html,
      headers: {
        'X-Entity-Ref-ID': `opened-notification-${data.documentId}-${Date.now()}`,
        'Message-ID': `<opened-notification-${data.documentId}-${Date.now()}@mamasign.com>`,
        'List-Unsubscribe': '<mailto:unsubscribe@mamasign.com>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Feedback-ID': 'mamasign:notification',
      },
      // Disable tracking to improve deliverability
      // @ts-ignore - tracking option may not be in types but works in API
      tracking: {
        clicks: false,
        opens: false,
      },
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

  // Use short URL if token is available, otherwise fall back to full URL
  const signUrl = signer.token
    ? `${APP_URL}/s/${signer.token}`
    : `${APP_URL}/sign/${data.documentId}?email=${encodeURIComponent(signer.email)}`
  const isUrgent = reminderNumber >= 3

  const html = `
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
              <div style="font-size: 40px; margin-bottom: 10px;">${isUrgent ? '⚠️' : '⏰'}</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">${isUrgent ? 'Urgent: Signature Required' : 'Reminder: Signature Needed'}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333;">Hi <strong>${signer.name}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.7;">${isUrgent ? `This is an urgent reminder that "<strong>${data.documentName}</strong>" requires your immediate attention.` : `Just a friendly reminder that "<strong>${data.documentName}</strong>" is still waiting for your signature.`}</p>
              <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e0e0e0;">
                <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #000000;">${data.documentName}</p>
                <p style="margin: 0; font-size: 13px; color: #666666;">From: ${data.senderName}</p>
                ${data.dueDate ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #888888;">Due: ${new Date(data.dueDate).toLocaleDateString()}</p>` : ''}
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${signUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 50px; border-radius: 6px; font-size: 16px; font-weight: 600;">Sign Now</a>
              </div>
              <p style="margin: 20px 0 0 0; font-size: 13px; color: #888888; text-align: center;">If you have questions, please contact ${data.senderEmail}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 12px; color: #888888;">Powered by <strong style="color: #000000;">${COMPANY_NAME}</strong></p>
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
        'Message-ID': `<signing-reminder-${data.documentId}-${signerIndex}-${reminderNumber}-${Date.now()}@mamasign.com>`,
        'List-Unsubscribe': '<mailto:unsubscribe@mamasign.com>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Feedback-ID': 'mamasign:notification',
      },
      // Disable tracking to improve deliverability
      // @ts-ignore - tracking option may not be in types but works in API
      tracking: {
        clicks: false,
        opens: false,
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
          <tr>
            <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
              <div style="font-size: 40px; margin-bottom: 10px;">❌</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">Document Declined</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333;">Hi <strong>${data.senderName}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.7;">Unfortunately, <strong>${signer.name}</strong> has declined to sign "<strong>${data.documentName}</strong>".</p>
              ${reason ? `<div style="background-color: #f9f9f9; border-left: 4px solid #000000; padding: 15px 20px; margin: 20px 0;"><p style="margin: 0; font-size: 14px; color: #333333;"><strong>Reason:</strong> "${reason}"</p></div>` : ''}
              <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #666666;">Document: <strong style="color: #000000;">${data.documentName}</strong><br>Declined by: <strong style="color: #000000;">${signer.name}</strong> (${signer.email})<br>Declined at: <strong style="color: #000000;">${new Date().toLocaleString()}</strong></p>
              </div>
              <p style="margin: 20px 0; font-size: 14px; color: #666666;">You may want to reach out to ${signer.name} to discuss their concerns, or create a new document with revisions.</p>
              <div style="text-align: center; margin: 25px 0;">
                <a href="${APP_URL}/documents" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-size: 15px; font-weight: 600;">View Documents</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 12px; color: #888888;">Powered by <strong style="color: #000000;">${COMPANY_NAME}</strong></p>
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

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.senderEmail,
      subject: `${signer.name} declined to sign "${data.documentName}"`,
      html,
      headers: {
        'X-Entity-Ref-ID': `declined-notification-${data.documentId}-${Date.now()}`,
        'Message-ID': `<declined-notification-${data.documentId}-${Date.now()}@mamasign.com>`,
        'List-Unsubscribe': '<mailto:unsubscribe@mamasign.com>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Feedback-ID': 'mamasign:notification',
      },
      // Disable tracking to improve deliverability
      // @ts-ignore - tracking option may not be in types but works in API
      tracking: {
        clicks: false,
        opens: false,
      },
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send declined notification:', error)
    return { success: false, error }
  }
}
