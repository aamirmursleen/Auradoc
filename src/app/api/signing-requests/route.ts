import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendSigningInvite } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
  const rateLimited = rateLimit(req, { limit: 10, windowSeconds: 60 })
  if (rateLimited) return rateLimited

  try {
    // Parse body first (fast), then auth (can be slow)
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

    // Run auth calls in parallel with timeout fallback (don't block on slow auth)
    let userId: string | null = null
    let user: any = null
    try {
      const authPromise = Promise.all([auth(), currentUser()])
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve([{ userId: null }, null]), 3000))
      const [authResult, userResult] = await Promise.race([authPromise, timeoutPromise]) as [{ userId: string | null }, any]
      userId = authResult?.userId || null
      user = userResult
    } catch (authError) {
      console.warn('Auth check failed, continuing without user:', authError)
    }

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

    // Log document details for debugging
    console.log('📄 Creating signing request:', {
      id: signingRequestId,
      documentName: documentName,
      documentDataLength: documentData?.length || 0,
      documentDataPrefix: documentData?.substring(0, 100),
      signersCount: signersWithTokens.length,
      fieldsCount: signatureFields?.length || 0
    })

    const { data: signingRequest, error: insertError } = await supabaseAdmin
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
      console.error('❌ Database error:', insertError)
      return NextResponse.json(
        { success: false, message: 'Failed to create signing request: ' + insertError.message },
        { status: 500 }
      )
    }

    console.log('✅ Signing request created successfully:', signingRequestId)

    // Find self-signer and all non-self signers
    const selfSigner = signersWithTokens.find((s: { is_self?: boolean }) => s.is_self)
    const nonSelfSigners = signersWithTokens.filter((s: { is_self?: boolean }) => !s.is_self)

    // Generate self-signing link FIRST (so we can return immediately)
    // Use short URL format: /s/TOKEN
    const selfSigningLink = selfSigner
      ? APP_URL + '/s/' + selfSigner.token
      : null

    // INSTANT RESPONSE - Return immediately, send emails in background
    // This makes the UI show "Document sent!" within 1 second
    const response = NextResponse.json({
      success: true,
      message: 'Document sent for signing',
      documentId: signingRequestId,
      signerCount: signers.length,
      selfSigningLink
    })

    // Send email only to the FIRST non-self signer (sequential signing)
    // Next signers will get their email after the previous signer completes
    if (nonSelfSigners.length > 0) {
      const firstSigner = nonSelfSigners.sort((a: any, b: any) => a.order - b.order)[0]
      const signingLink = APP_URL + '/s/' + firstSigner.token

      console.log('📧 Attempting to send email to:', firstSigner.email)
      console.log('📧 Signing link:', signingLink)

      // Send email synchronously to catch errors
      try {
        const emailResult = await sendSigningInvite({
          to: firstSigner.email,
          signerName: firstSigner.name,
          senderName: senderName,
          senderEmail: senderEmail,
          documentName: documentName,
          signingLink: signingLink,
          message: message,
          expiresAt: dueDate
        })

        if (emailResult.success) {
          console.log('✅ Email sent successfully to:', firstSigner.email, 'ID:', emailResult.id)
        } else {
          console.error('❌ Email failed:', emailResult.error)
        }
      } catch (emailError) {
        console.error('❌ Email exception:', emailError)
      }
    }

    return response

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

    const { data: signingRequests, error } = await supabaseAdmin
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
