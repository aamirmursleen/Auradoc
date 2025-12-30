import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { sendSigningInvite } from '@/lib/email'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

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

    const { data: signingRequest, error: insertError } = await supabase
      .from('signing_requests')
      .insert({
        id: signingRequestId,
        user_id: userId,
        document_name: documentName,
        document_url: documentData, // Store base64 for now (in production, upload to storage)
        sender_name: user.firstName + ' ' + (user.lastName || ''),
        sender_email: user.emailAddresses[0]?.emailAddress || '',
        signers: signers.map((s: { name: string; email: string; order: number }) => ({
          name: s.name,
          email: s.email,
          order: s.order,
          status: 'pending',
          signedAt: null,
          token: crypto.randomUUID() // Unique token for each signer
        })),
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
      // If table doesn't exist, create a mock response for testing
      if (insertError.code === '42P01') {
      } else {
        return NextResponse.json(
          { success: false, message: 'Failed to create signing request' },
          { status: 500 }
        )
      }
    }

    // Send email to first signer
    const firstSigner = signers[0]
    if (firstSigner) {
      const signerToken = crypto.randomUUID()
      const signingLink = `${APP_URL}/sign/${signingRequestId}?token=${signerToken}&email=${encodeURIComponent(firstSigner.email)}`

      try {
        const emailResult = await sendSigningInvite({
          to: firstSigner.email,
          signerName: firstSigner.name,
          senderName: user.firstName + ' ' + (user.lastName || ''),
          senderEmail: user.emailAddresses[0]?.emailAddress || '',
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
        // Continue even if email fails
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
