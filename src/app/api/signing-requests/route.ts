import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { sendSigningInvite } from '@/lib/email'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    // Demo mode: Allow sending without being logged in
    const senderName = user ? (user.firstName || '') + ' ' + (user.lastName || '').trim() || 'MamaSign User' : 'MamaSign User'
    const senderEmail = user?.emailAddresses?.[0]?.emailAddress || 'noreply@mamasign.com'
    const effectiveUserId = userId || 'demo-user'

    const body = await req.json()
    const { documentName, documentData, signers, signatureFields, message, dueDate } = body

    // Validate required fields
    if (!documentName || !documentData || !signers || signers.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create signing request in database
    const signingRequestId = crypto.randomUUID()

    const signersWithTokens = signers.map((s: { name: string; email: string; order: number }) => ({
      name: s.name,
      email: s.email,
      order: s.order,
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

    // Send email to first signer
    const firstSigner = signersWithTokens[0]
    if (firstSigner) {
      const signingLink = APP_URL + '/sign/' + signingRequestId + '?token=' + firstSigner.token + '&email=' + encodeURIComponent(firstSigner.email)

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

        if (!emailResult.success) {
          console.error('Email send failed:', emailResult.error)
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Document sent for signing',
      documentId: signingRequestId,
      signerCount: signers.length
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
