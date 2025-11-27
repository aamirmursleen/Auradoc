// Email Service using Resend API
// Handles all email notifications for document signing workflow

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email sender configuration
const FROM_EMAIL = 'AuraDoc <noreply@auradoc.com>'
const COMPANY_NAME = 'AuraDoc'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Types for email service
export interface Signer {
  name: string
  email: string
  order: number // 1, 2, 3... for sequential signing
  status: 'pending' | 'sent' | 'opened' | 'signed'
  signedAt?: string
}

export interface DocumentEmailData {
  documentId: string
  documentName: string
  senderName: string
  senderEmail: string
  signers: Signer[]
  message?: string // Optional personal message
  dueDate?: string
}

// ============================================
// EMAIL TEMPLATES (Beautiful Minimalist Design)
// ============================================

function getBaseStyles() {
  return `
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 560px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 32px; text-align: center; }
    .header h1 { color: white; font-size: 24px; font-weight: 600; margin: 0; }
    .header p { color: rgba(255,255,255,0.9); font-size: 14px; margin: 8px 0 0 0; }
    .content { padding: 40px 32px; }
    .greeting { font-size: 18px; font-weight: 600; color: #1a1a1a; margin: 0 0 16px 0; }
    .message { color: #4a5568; font-size: 15px; margin: 0 0 24px 0; }
    .document-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .document-name { font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0 0 8px 0; }
    .document-meta { font-size: 13px; color: #64748b; margin: 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 24px 0; }
    .cta-button:hover { opacity: 0.9; }
    .progress-bar { background: #e2e8f0; border-radius: 4px; height: 8px; margin: 16px 0; overflow: hidden; }
    .progress-fill { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); height: 100%; border-radius: 4px; }
    .signer-list { margin: 16px 0; }
    .signer-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
    .signer-status { width: 24px; height: 24px; border-radius: 50%; margin-right: 12px; display: flex; align-items: center; justify-content: center; font-size: 12px; }
    .status-signed { background: #dcfce7; color: #16a34a; }
    .status-current { background: #dbeafe; color: #2563eb; }
    .status-pending { background: #f1f5f9; color: #94a3b8; }
    .footer { padding: 24px 32px; background: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { font-size: 12px; color: #94a3b8; margin: 4px 0; }
    .footer a { color: #4F46E5; text-decoration: none; }
    .personal-message { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0; }
    .personal-message p { margin: 0; color: #92400e; font-size: 14px; font-style: italic; }
  `
}

function emailWrapper(content: string, preheader: string = '') {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AuraDoc</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
  <div class="container">
    ${content}
  </div>
</body>
</html>
`
}

// ============================================
// EMAIL SENDING FUNCTIONS
// ============================================

/**
 * Send signing invite to a signer (new simpler interface)
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

  const content = `
    <div class="header">
      <h1>📝 Document Ready for Signature</h1>
      <p>From ${senderName}</p>
    </div>
    <div class="content">
      <p class="greeting">Hi ${signerName},</p>
      <p class="message">${senderName} has sent you a document to sign. Please review and sign at your earliest convenience.</p>

      ${message ? `
        <div class="personal-message">
          <p>"${message}"</p>
        </div>
      ` : ''}

      <div class="document-card">
        <p class="document-name">📄 ${documentName}</p>
        <p class="document-meta">From: ${senderName} (${senderEmail})</p>
        ${expiresAt ? `<p class="document-meta">Expires: ${new Date(expiresAt).toLocaleDateString()}</p>` : ''}
      </div>

      <div style="text-align: center;">
        <a href="${signingLink}" class="cta-button">Review & Sign Document</a>
      </div>

      <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 24px;">
        This link is unique to you. Do not share it with others.
      </p>
    </div>
    <div class="footer">
      <p>Powered by ${COMPANY_NAME}</p>
      <p>Secure document signing made simple</p>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${senderName} sent you "${documentName}" to sign`,
      html: emailWrapper(content, `Please sign: ${documentName}`),
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
  const position = signerIndex + 1
  const total = data.signers.length

  const content = `
    <div class="header">
      <h1>📝 Document Ready for Signature</h1>
      <p>From ${data.senderName}</p>
    </div>
    <div class="content">
      <p class="greeting">Hi ${signer.name},</p>
      <p class="message">${data.senderName} has sent you a document to sign. Please review and sign at your earliest convenience.</p>

      ${data.message ? `
        <div class="personal-message">
          <p>"${data.message}"</p>
        </div>
      ` : ''}

      <div class="document-card">
        <p class="document-name">📄 ${data.documentName}</p>
        <p class="document-meta">From: ${data.senderName} (${data.senderEmail})</p>
        ${data.dueDate ? `<p class="document-meta">Due: ${new Date(data.dueDate).toLocaleDateString()}</p>` : ''}
        ${total > 1 ? `<p class="document-meta">You are signer ${position} of ${total}</p>` : ''}
      </div>

      ${total > 1 ? `
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${((signerIndex) / total) * 100}%"></div>
        </div>
        <p style="font-size: 13px; color: #64748b; text-align: center;">${signerIndex} of ${total} signatures complete</p>
      ` : ''}

      <div style="text-align: center;">
        <a href="${signUrl}" class="cta-button">Review & Sign Document</a>
      </div>

      <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 24px;">
        This link is unique to you. Do not share it with others.
      </p>
    </div>
    <div class="footer">
      <p>Powered by ${COMPANY_NAME}</p>
      <p>Secure document signing made simple</p>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: signer.email,
      subject: `${data.senderName} sent you "${data.documentName}" to sign`,
      html: emailWrapper(content, `Please sign: ${data.documentName}`),
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send signing request:', error)
    return { success: false, error }
  }
}

/**
 * Notify sender when document is opened
 */
export async function sendDocumentOpenedNotification(data: DocumentEmailData, signerIndex: number) {
  const signer = data.signers[signerIndex]
  if (!signer) return { success: false, error: 'Signer not found' }

  const content = `
    <div class="header" style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);">
      <h1>👀 Document Viewed</h1>
      <p>${data.documentName}</p>
    </div>
    <div class="content">
      <p class="greeting">Hi ${data.senderName},</p>
      <p class="message"><strong>${signer.name}</strong> just opened your document "${data.documentName}". They may be reviewing it now.</p>

      <div class="document-card">
        <p class="document-name">📄 ${data.documentName}</p>
        <p class="document-meta">Opened by: ${signer.name} (${signer.email})</p>
        <p class="document-meta">Opened at: ${new Date().toLocaleString()}</p>
      </div>

      <p style="font-size: 14px; color: #64748b;">
        You'll receive another notification when they complete their signature.
      </p>
    </div>
    <div class="footer">
      <p>Powered by ${COMPANY_NAME}</p>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.senderEmail,
      subject: `${signer.name} viewed "${data.documentName}"`,
      html: emailWrapper(content, `${signer.name} is reviewing your document`),
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send opened notification:', error)
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
  const progress = Math.round((signedCount / total) * 100)

  const content = `
    <div class="header" style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);">
      <h1>${isComplete ? '🎉 All Signatures Complete!' : '✅ Signature Received'}</h1>
      <p>${data.documentName}</p>
    </div>
    <div class="content">
      <p class="greeting">Hi ${data.senderName},</p>
      <p class="message">
        ${isComplete
          ? `Great news! All signers have completed signing "${data.documentName}". The document is now fully executed.`
          : `<strong>${signer.name}</strong> has signed "${data.documentName}". ${total - signedCount} signature${total - signedCount === 1 ? '' : 's'} remaining.`
        }
      </p>

      <div class="document-card">
        <p class="document-name">📄 ${data.documentName}</p>
        <p class="document-meta">Signed by: ${signer.name} (${signer.email})</p>
        <p class="document-meta">Signed at: ${new Date().toLocaleString()}</p>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
      <p style="font-size: 13px; color: #64748b; text-align: center;">${signedCount} of ${total} signatures complete (${progress}%)</p>

      ${isComplete ? `
        <div style="text-align: center;">
          <a href="${APP_URL}/documents/${data.documentId}" class="cta-button">Download Signed Document</a>
        </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>Powered by ${COMPANY_NAME}</p>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.senderEmail,
      subject: isComplete
        ? `✅ "${data.documentName}" is fully signed!`
        : `${signer.name} signed "${data.documentName}" (${signedCount}/${total})`,
      html: emailWrapper(content, isComplete ? 'All signatures complete!' : `${signedCount} of ${total} signatures`),
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

  const content = `
    <div class="header" style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);">
      <h1>✅ Signature Confirmed</h1>
      <p>Thank you for signing</p>
    </div>
    <div class="content">
      <p class="greeting">Hi ${signer.name},</p>
      <p class="message">
        Your signature on "${data.documentName}" has been recorded.
        ${isComplete
          ? 'All parties have now signed, and the document is complete.'
          : 'We\'ll notify you when all parties have signed and the document is complete.'
        }
      </p>

      <div class="document-card">
        <p class="document-name">📄 ${data.documentName}</p>
        <p class="document-meta">Sent by: ${data.senderName}</p>
        <p class="document-meta">Signed at: ${new Date().toLocaleString()}</p>
      </div>

      ${isComplete ? `
        <div style="text-align: center;">
          <a href="${APP_URL}/documents/${data.documentId}/download" class="cta-button">Download Your Copy</a>
        </div>
      ` : `
        <p style="font-size: 14px; color: #64748b; text-align: center;">
          Waiting for other signatures...
        </p>
      `}
    </div>
    <div class="footer">
      <p>Powered by ${COMPANY_NAME}</p>
      <p>Keep this email for your records</p>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: signer.email,
      subject: `Your signature on "${data.documentName}" is confirmed`,
      html: emailWrapper(content, 'Your signature has been recorded'),
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send signer confirmation:', error)
    return { success: false, error }
  }
}

/**
 * Send document completed notification to ALL signers
 */
export async function sendDocumentCompletedToAll(data: DocumentEmailData) {
  const results = []

  for (const signer of data.signers) {
    const content = `
      <div class="header" style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);">
        <h1>🎉 Document Complete!</h1>
        <p>All signatures collected</p>
      </div>
      <div class="content">
        <p class="greeting">Hi ${signer.name},</p>
        <p class="message">
          Great news! "${data.documentName}" has been signed by all parties and is now complete.
        </p>

        <div class="document-card">
          <p class="document-name">📄 ${data.documentName}</p>
          <p class="document-meta">Completed: ${new Date().toLocaleString()}</p>
        </div>

        <div class="signer-list">
          <p style="font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 8px;">ALL SIGNERS:</p>
          ${data.signers.map(s => `
            <div style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
              <span style="width: 20px; height: 20px; background: #dcfce7; color: #16a34a; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; margin-right: 10px;">✓</span>
              <span style="font-size: 14px; color: #374151;">${s.name}</span>
            </div>
          `).join('')}
        </div>

        <div style="text-align: center;">
          <a href="${APP_URL}/documents/${data.documentId}/download" class="cta-button">Download Signed Document</a>
        </div>
      </div>
      <div class="footer">
        <p>Powered by ${COMPANY_NAME}</p>
        <p>This document is legally binding</p>
      </div>
    `

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: signer.email,
        subject: `✅ "${data.documentName}" is complete - Download your copy`,
        html: emailWrapper(content, 'Your document is ready for download'),
      })
      results.push({ email: signer.email, success: true, data: result })
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
  reminderNumber: number // 1, 2, 3...
) {
  const signer = data.signers[signerIndex]
  if (!signer) return { success: false, error: 'Signer not found' }

  const signUrl = `${APP_URL}/sign/${data.documentId}?signer=${signer.email}`

  const urgencyLevel = reminderNumber >= 3 ? 'urgent' : reminderNumber >= 2 ? 'reminder' : 'gentle'

  const headerColors = {
    gentle: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
    reminder: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    urgent: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
  }

  const messages = {
    gentle: `Just a friendly reminder that "${data.documentName}" is waiting for your signature.`,
    reminder: `Your signature is still needed on "${data.documentName}". ${data.senderName} is waiting for you to complete this document.`,
    urgent: `Urgent: "${data.documentName}" requires your immediate attention. This document has been waiting for your signature.`
  }

  const content = `
    <div class="header" style="background: ${headerColors[urgencyLevel]};">
      <h1>${urgencyLevel === 'urgent' ? '⚠️' : '⏰'} Signature Reminder</h1>
      <p>Action needed</p>
    </div>
    <div class="content">
      <p class="greeting">Hi ${signer.name},</p>
      <p class="message">${messages[urgencyLevel]}</p>

      <div class="document-card">
        <p class="document-name">📄 ${data.documentName}</p>
        <p class="document-meta">From: ${data.senderName}</p>
        ${data.dueDate ? `<p class="document-meta" style="color: ${urgencyLevel === 'urgent' ? '#dc2626' : '#64748b'};">Due: ${new Date(data.dueDate).toLocaleDateString()}</p>` : ''}
      </div>

      <div style="text-align: center;">
        <a href="${signUrl}" class="cta-button" style="${urgencyLevel === 'urgent' ? 'background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);' : ''}">
          Sign Now
        </a>
      </div>

      <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 24px;">
        If you have questions, please contact ${data.senderEmail}
      </p>
    </div>
    <div class="footer">
      <p>Powered by ${COMPANY_NAME}</p>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: signer.email,
      subject: urgencyLevel === 'urgent'
        ? `⚠️ Urgent: Your signature is needed on "${data.documentName}"`
        : `Reminder: "${data.documentName}" awaits your signature`,
      html: emailWrapper(content, `Reminder ${reminderNumber}: Please sign ${data.documentName}`),
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

  const content = `
    <div class="header" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);">
      <h1>❌ Document Declined</h1>
      <p>${data.documentName}</p>
    </div>
    <div class="content">
      <p class="greeting">Hi ${data.senderName},</p>
      <p class="message">
        Unfortunately, <strong>${signer.name}</strong> has declined to sign "${data.documentName}".
      </p>

      ${reason ? `
        <div class="personal-message" style="background: #fef2f2; border-left-color: #dc2626;">
          <p style="color: #991b1b;"><strong>Reason:</strong> "${reason}"</p>
        </div>
      ` : ''}

      <div class="document-card">
        <p class="document-name">📄 ${data.documentName}</p>
        <p class="document-meta">Declined by: ${signer.name} (${signer.email})</p>
        <p class="document-meta">Declined at: ${new Date().toLocaleString()}</p>
      </div>

      <p style="font-size: 14px; color: #64748b;">
        You may want to reach out to ${signer.name} to discuss their concerns, or create a new document with revisions.
      </p>

      <div style="text-align: center;">
        <a href="${APP_URL}/documents" class="cta-button" style="background: #64748b;">View Documents</a>
      </div>
    </div>
    <div class="footer">
      <p>Powered by ${COMPANY_NAME}</p>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.senderEmail,
      subject: `❌ ${signer.name} declined to sign "${data.documentName}"`,
      html: emailWrapper(content, `${signer.name} declined your document`),
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send declined notification:', error)
    return { success: false, error }
  }
}
