import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rate-limit'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const rateLimited = rateLimit(req, { limit: 3, windowSeconds: 60 })
  if (rateLimited) return rateLimited

  try {
    const body = await req.json()
    const { to, subject, message } = body

    if (!to) {
      return NextResponse.json(
        { success: false, message: 'Email address is required' },
        { status: 400 }
      )
    }

    // Send test email
    const result = await resend.emails.send({
      from: 'MamaSign <noreply@mamasign.com>', // Using Resend's test domain
      to: to,
      subject: subject || 'Test Email from MamaSign',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 560px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 32px; text-align: center; }
            .header h1 { color: white; font-size: 24px; font-weight: 600; margin: 0; }
            .content { padding: 40px 32px; }
            .message { color: #4a5568; font-size: 15px; margin: 0 0 24px 0; }
            .footer { padding: 24px 32px; background: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer p { font-size: 12px; color: #94a3b8; margin: 4px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📝 MamaSign Test Email</h1>
            </div>
            <div class="content">
              <p class="message">${message || 'This is a test email from MamaSign. If you received this, email functionality is working correctly!'}</p>
              <p class="message">Timestamp: ${new Date().toLocaleString()}</p>
            </div>
            <div class="footer">
              <p>Powered by MamaSign</p>
              <p>Secure document signing made simple</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })


    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      emailId: result.data?.id,
    })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send email', error: String(error) },
      { status: 500 }
    )
  }
}
