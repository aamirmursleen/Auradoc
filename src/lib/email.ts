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

// Odoo-style email template
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #714B67 0%, #875A7B 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">MamaSign</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Secure Document Signing</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Hello <strong>${recipientName}</strong>,</p>
              <p style="margin: 0 0 25px 0; font-size: 15px; color: #555555; line-height: 1.6;"><strong>${senderName}</strong> has sent you a document to sign. Please review and sign the document at your earliest convenience.</p>
              ${message ? `<div style="background-color: #FFF8E7; border-left: 4px solid #F0AD4E; padding: 15px 20px; margin: 0 0 25px 0; border-radius: 0 6px 6px 0;"><p style="margin: 0; font-size: 14px; color: #8A6D3B; font-style: italic;">"${message}"</p></div>` : ''}
              <div style="background-color: #F8F9FA; border: 1px solid #E9ECEF; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
                <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #333333;">${documentName}</p>
                <p style="margin: 0; font-size: 13px; color: #888888;">From: ${senderName}</p>
                ${expiresAt ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #DC3545;">Expires: ${new Date(expiresAt).toLocaleDateString()}</p>` : ''}
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${signingLink}" style="display: inline-block; background: linear-gradient(135deg, #714B67 0%, #875A7B 100%); color: #ffffff; text-decoration: none; padding: 16px 50px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(113, 75, 103, 0.3);">Sign Document</a>
              </div>
              <div style="background-color: #E8F5E9; border-radius: 6px; padding: 15px; margin: 25px 0 0 0;">
                <p style="margin: 0; font-size: 13px; color: #2E7D32; text-align: center;">This document is encrypted and securely stored. Your signature will be legally binding.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8F9FA; padding: 25px 40px; border-top: 1px solid #E9ECEF; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #714B67;">${COMPANY_NAME}</p>
              <p style="margin: 0; font-size: 12px; color: #999999;">Secure document signing made simple</p>
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

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${senderName} sent you "${documentName}" to sign`,
      html,
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

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: signer.email,
      subject: `${data.senderName} sent you "${data.documentName}" to sign`,
      html,
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, ${isComplete ? '#28A745' : '#17A2B8'} 0%, ${isComplete ? '#20C997' : '#20C997'} 100%); padding: 30px 40px; text-align: center;">
              <div style="font-size: 50px; margin-bottom: 10px;">${isComplete ? '🎉' : '✅'}</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">${isComplete ? 'All Signatures Complete!' : 'New Signature Received'}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Hello <strong>${data.senderName}</strong>,</p>
              <p style="margin: 0 0 25px 0; font-size: 15px; color: #555555; line-height: 1.6;">${isComplete ? `Great news! All signers have completed signing "<strong>${data.documentName}</strong>". The document is now fully executed and ready for download.` : `<strong>${signer.name}</strong> has signed "<strong>${data.documentName}</strong>".`}</p>
              <div style="background-color: #F8F9FA; border: 1px solid #E9ECEF; border-radius: 8px; padding: 20px; margin: 0 0 25px 0;">
                <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">Signature Details</h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #E9ECEF;"><span style="font-size: 13px; color: #888888;">Document:</span></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #E9ECEF; text-align: right;"><span style="font-size: 14px; color: #333333; font-weight: 500;">${data.documentName}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #E9ECEF;"><span style="font-size: 13px; color: #888888;">Signed by:</span></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #E9ECEF; text-align: right;"><span style="font-size: 14px; color: #333333; font-weight: 500;">${signer.name}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #E9ECEF;"><span style="font-size: 13px; color: #888888;">Email:</span></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #E9ECEF; text-align: right;"><span style="font-size: 14px; color: #333333;">${signer.email}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><span style="font-size: 13px; color: #888888;">Signed at:</span></td>
                    <td style="padding: 8px 0; text-align: right;"><span style="font-size: 14px; color: #333333;">${new Date().toLocaleString()}</span></td>
                  </tr>
                </table>
              </div>
              ${total > 1 ? `<div style="margin: 0 0 25px 0;"><p style="font-size: 13px; color: #666666; margin-bottom: 8px;">Signing Progress: <strong>${signedCount}/${total} Complete</strong></p><div style="background-color: #E9ECEF; border-radius: 10px; height: 10px; overflow: hidden;"><div style="background: linear-gradient(135deg, ${isComplete ? '#28A745' : '#714B67'} 0%, ${isComplete ? '#20C997' : '#875A7B'} 100%); width: ${Math.round((signedCount / total) * 100)}%; height: 100%; border-radius: 10px;"></div></div></div>` : ''}
              <div style="text-align: center; margin: 30px 0;">
                <a href="${downloadLink}" style="display: inline-block; background: linear-gradient(135deg, ${isComplete ? '#28A745' : '#714B67'} 0%, ${isComplete ? '#20C997' : '#875A7B'} 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">${isComplete ? 'Download Signed Document' : 'View Document Status'}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8F9FA; padding: 25px 40px; border-top: 1px solid #E9ECEF; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #714B67;">${COMPANY_NAME}</p>
              <p style="margin: 0; font-size: 12px; color: #999999;">Secure document signing made simple</p>
            </td>
          </tr>
        </table>
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #28A745 0%, #20C997 100%); padding: 30px 40px; text-align: center;">
              <div style="font-size: 50px; margin-bottom: 10px;">✅</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Signature Confirmed!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Hello <strong>${signer.name}</strong>,</p>
              <p style="margin: 0 0 25px 0; font-size: 15px; color: #555555; line-height: 1.6;">Your signature on "<strong>${data.documentName}</strong>" has been successfully recorded. ${isComplete ? 'All parties have now signed, and the document is complete. You can download your copy below.' : 'We will notify you when all parties have signed and the document is complete.'}</p>
              <div style="background-color: #E8F5E9; border: 1px solid #C8E6C9; border-radius: 8px; padding: 20px; margin: 0 0 25px 0;">
                <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #2E7D32;">${data.documentName}</p>
                <p style="margin: 0; font-size: 13px; color: #4CAF50;">Signed on ${new Date().toLocaleString()}</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666666;">Requested by: ${data.senderName}</p>
              </div>
              ${isComplete ? `<div style="text-align: center; margin: 30px 0;"><a href="${downloadLink}" style="display: inline-block; background: linear-gradient(135deg, #28A745 0%, #20C997 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">Download Your Copy</a></div>` : '<div style="text-align: center; padding: 20px; background-color: #FFF8E7; border-radius: 6px;"><p style="margin: 0; font-size: 14px; color: #8A6D3B;">Waiting for other signatures...</p></div>'}
              <p style="margin: 25px 0 0 0; font-size: 13px; color: #999999; text-align: center;">Please keep this email for your records.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8F9FA; padding: 25px 40px; border-top: 1px solid #E9ECEF; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #714B67;">${COMPANY_NAME}</p>
              <p style="margin: 0; font-size: 12px; color: #999999;">Secure document signing made simple</p>
            </td>
          </tr>
        </table>
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #17A2B8 0%, #20C997 100%); padding: 30px 40px; text-align: center;">
              <div style="font-size: 40px; margin-bottom: 10px;">👀</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600;">Document Viewed</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333;">Hi <strong>${data.senderName}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;"><strong>${signer.name}</strong> just opened your document "<strong>${data.documentName}</strong>". They may be reviewing it now.</p>
              <div style="background-color: #F8F9FA; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #666666;">Viewer: <strong>${signer.email}</strong><br>Opened at: <strong>${new Date().toLocaleString()}</strong></p>
              </div>
              <p style="margin: 20px 0 0 0; font-size: 14px; color: #888888;">You'll receive another notification when they complete their signature.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8F9FA; padding: 20px 40px; text-align: center; border-top: 1px solid #E9ECEF;">
              <p style="margin: 0; font-size: 12px; color: #999999;">Powered by <strong style="color: #714B67;">${COMPANY_NAME}</strong></p>
            </td>
          </tr>
        </table>
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, ${isUrgent ? '#DC3545' : '#FFC107'} 0%, ${isUrgent ? '#C82333' : '#E0A800'} 100%); padding: 30px 40px; text-align: center;">
              <div style="font-size: 40px; margin-bottom: 10px;">${isUrgent ? '⚠️' : '⏰'}</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600;">${isUrgent ? 'Urgent: Signature Required' : 'Reminder: Signature Needed'}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333;">Hi <strong>${signer.name}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">${isUrgent ? `This is an urgent reminder that "<strong>${data.documentName}</strong>" requires your immediate attention.` : `Just a friendly reminder that "<strong>${data.documentName}</strong>" is still waiting for your signature.`}</p>
              <div style="background-color: #F8F9FA; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #333333;">${data.documentName}</p>
                <p style="margin: 0; font-size: 13px; color: #666666;">From: ${data.senderName}</p>
                ${data.dueDate ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: ${isUrgent ? '#DC3545' : '#666666'};">Due: ${new Date(data.dueDate).toLocaleDateString()}</p>` : ''}
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${signUrl}" style="display: inline-block; background: linear-gradient(135deg, ${isUrgent ? '#DC3545' : '#714B67'} 0%, ${isUrgent ? '#C82333' : '#875A7B'} 100%); color: #ffffff; text-decoration: none; padding: 16px 50px; border-radius: 6px; font-size: 16px; font-weight: 600;">Sign Now</a>
              </div>
              <p style="margin: 20px 0 0 0; font-size: 13px; color: #999999; text-align: center;">If you have questions, please contact ${data.senderEmail}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8F9FA; padding: 20px 40px; text-align: center; border-top: 1px solid #E9ECEF;">
              <p style="margin: 0; font-size: 12px; color: #999999;">Powered by <strong style="color: #714B67;">${COMPANY_NAME}</strong></p>
            </td>
          </tr>
        </table>
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
      subject: isUrgent ? `Urgent: Your signature is needed on "${data.documentName}"` : `Reminder: "${data.documentName}" awaits your signature`,
      html,
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #DC3545 0%, #C82333 100%); padding: 30px 40px; text-align: center;">
              <div style="font-size: 40px; margin-bottom: 10px;">❌</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600;">Document Declined</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333;">Hi <strong>${data.senderName}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Unfortunately, <strong>${signer.name}</strong> has declined to sign "<strong>${data.documentName}</strong>".</p>
              ${reason ? `<div style="background-color: #FEE2E2; border-left: 4px solid #DC3545; padding: 15px 20px; margin: 20px 0; border-radius: 0 6px 6px 0;"><p style="margin: 0; font-size: 14px; color: #991B1B;"><strong>Reason:</strong> "${reason}"</p></div>` : ''}
              <div style="background-color: #F8F9FA; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #666666;">Document: <strong>${data.documentName}</strong><br>Declined by: <strong>${signer.name}</strong> (${signer.email})<br>Declined at: <strong>${new Date().toLocaleString()}</strong></p>
              </div>
              <p style="margin: 20px 0; font-size: 14px; color: #666666;">You may want to reach out to ${signer.name} to discuss their concerns, or create a new document with revisions.</p>
              <div style="text-align: center; margin: 25px 0;">
                <a href="${APP_URL}/documents" style="display: inline-block; background: #6C757D; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-size: 15px; font-weight: 600;">View Documents</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8F9FA; padding: 20px 40px; text-align: center; border-top: 1px solid #E9ECEF;">
              <p style="margin: 0; font-size: 12px; color: #999999;">Powered by <strong style="color: #714B67;">${COMPANY_NAME}</strong></p>
            </td>
          </tr>
        </table>
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
