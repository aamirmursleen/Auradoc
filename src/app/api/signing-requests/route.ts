import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { sendSigningInvite } from '@/lib/email'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    let body
    try {
      body = await req.json()
    } catch (e) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data. If file is large, please try again.' },
        { status: 400 }
      )
    }
    const { documentName, documentData, signers, signatureFields, message, dueDate, senderName: providedSenderName } = body

    // Use provided sender name, or fallback to Clerk user name, or default
    const clerkUserName = user ? ((user.firstName || '') + ' ' + (user.lastName || '')).trim() : ''
    const senderName = providedSenderName?.trim() || clerkUserName || 'MamaSign User'
    const senderEmail = user?.emailAddresses?.[0]?.emailAddress || 'noreply@mamasign.com'
    const effectiveUserId = userId || 'demo-user'

    // Validate required fields
    if (!documentName || !documentData || !signers || signers.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create signing request in database
    const signingRequestId = crypto.randomUUID()

    const signersWithTokens = signers.map((s: { name: string; email: string; order: number; is_self?: boolean }) => ({
      name: s.name,
      email: s.email,
      order: s.order,
      is_self: s.is_self || false,
      status: 'pending',
      signedAt: null,
      token: crypto.randomUUID()
    }))

    const { data: signingRequest, error: insertError } = await supabase
      .from('signing_requests')
      .insert({
        id: signingRequestId,
        user_id: effectiveUserId,
        document_name: documentName,
        document_url: documentData,
        sender_name: senderName,
        sender_email: senderEmail,
        signers: signersWithTokens,
        signature_fields: signatureFields,
        message: message || null,
        due_date: dueDate || null,
        status: 'pending',
        current_signer_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
    }

    // Find self-signer and all non-self signers
    const selfSigner = signersWithTokens.find((s: { is_self?: boolean }) => s.is_self)
    const nonSelfSigners = signersWithTokens.filter((s: { is_self?: boolean }) => !s.is_self)

    // Helper function for delay (prevents spam filter triggers)
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    // Send email to ALL non-self signers (parallel signing)
    // Add delay between emails to prevent spam filters
    for (let i = 0; i < nonSelfSigners.length; i++) {
      const signer = nonSelfSigners[i]
      const signingLink = APP_URL + '/sign/' + signingRequestId + '?token=' + signer.token + '&email=' + encodeURIComponent(signer.email)

      try {
        const emailResult = await sendSigningInvite({
          to: signer.email,
          signerName: signer.name,
          senderName: senderName,
          senderEmail: senderEmail,
          documentName: documentName,
          signingLink: signingLink,
          message: message,
          expiresAt: dueDate
        })

        if (!emailResult.success) {
          console.error('Email send failed for', signer.email, ':', emailResult.error)
        }

        // Add 2 second delay between emails to prevent spam filters
        if (i < nonSelfSigners.length - 1) {
          await delay(2000)
        }
      } catch (emailError) {
        console.error('Failed to send email to', signer.email, ':', emailError)
      }
    }

    // Generate self-signing link if user added themselves as signer
    const selfSigningLink = selfSigner
      ? APP_URL + '/sign/' + signingRequestId + '?token=' + selfSigner.token + '&email=' + encodeURIComponent(selfSigner.email)
      : null

    return NextResponse.json({
      success: true,
      message: 'Document sent for signing',
      documentId: signingRequestId,
      signerCount: signers.length,
      selfSigningLink
    })

  } catch (error) {
    console.error('Error creating signing request:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: signingRequests, error } = await supabase
      .from('signing_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch signing requests' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: signingRequests || []
    })

  } catch (error) {
    console.error('Error fetching signing requests:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
