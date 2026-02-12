import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendSigningReminder } from '@/lib/email'

// Cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET

// POST - Send reminders for overdue signing requests
// This route is called by Vercel Cron or manually
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret (skip in development)
    if (CRON_SECRET) {
      const authHeader = req.headers.get('authorization')
      if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    // Find all pending/in_progress signing requests that need reminders
    const { data: requests, error } = await supabaseAdmin
      .from('signing_requests')
      .select('*')
      .in('status', ['pending', 'in_progress'])
      .not('due_date', 'is', null)

    if (error) {
      console.error('Error fetching signing requests for reminders:', error)
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      )
    }

    if (!requests || requests.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending requests found',
        reminders_sent: 0,
      })
    }

    const now = new Date()
    let remindersSent = 0
    const errors: string[] = []

    for (const request of requests) {
      try {
        const signers = request.signers || []
        const createdAt = new Date(request.created_at)
        const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

        // Default reminder interval: every 3 days
        const reminderInterval = 3

        // Only send reminder if enough days have passed
        if (daysSinceCreated < reminderInterval) continue

        // Calculate reminder number
        const reminderNumber = Math.floor(daysSinceCreated / reminderInterval)

        // Find pending signers who need reminders
        for (let i = 0; i < signers.length; i++) {
          const signer = signers[i]
          if (signer.status === 'pending' || signer.status === 'sent') {
            // Send reminder
            const result = await sendSigningReminder(
              {
                documentId: request.id,
                documentName: request.document_name,
                senderName: request.sender_name,
                senderEmail: request.sender_email,
                signers: signers.map((s: { name: string; email: string; token?: string }) => ({
                  name: s.name,
                  email: s.email,
                  token: s.token,
                })),
                message: request.message,
                dueDate: request.due_date,
              },
              i,
              reminderNumber
            )

            if (result.success) {
              remindersSent++

              // Create notification for the sender
              await supabaseAdmin
                .from('notifications')
                .insert({
                  user_id: request.user_id,
                  type: 'reminder_sent',
                  title: 'Reminder sent',
                  message: `Reminder #${reminderNumber} sent to ${signer.name} for "${request.document_name}"`,
                  document_id: request.id,
                  document_name: request.document_name,
                  signer_name: signer.name,
                  signer_email: signer.email,
                  metadata: { reminderNumber },
                  is_read: false,
                  created_at: new Date().toISOString(),
                })
            } else {
              errors.push(`Failed to send reminder to ${signer.email}: ${JSON.stringify(result.error)}`)
            }
          }
        }

        // Check if document is expired
        if (request.due_date) {
          const dueDate = new Date(request.due_date)
          if (dueDate < now) {
            // Auto-expire the document
            await supabaseAdmin
              .from('signing_requests')
              .update({
                status: 'expired',
                updated_at: new Date().toISOString(),
              })
              .eq('id', request.id)
          }
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err)
        errors.push(`Error processing request ${request.id}: ${errMsg}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${requests.length} requests`,
      reminders_sent: remindersSent,
      errors: errors.length > 0 ? errors : undefined,
    })

  } catch (error) {
    console.error('Error in send-reminders cron:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Also support GET for Vercel Cron (which uses GET by default)
export async function GET(req: NextRequest) {
  return POST(req)
}
