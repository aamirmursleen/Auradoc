import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    const effectiveUserId = userId || 'demo-user'

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      )
    }

    const { documentName, documentUrl, signers, signatureFields, templateProps } = body

    if (!documentUrl) {
      return NextResponse.json(
        { success: false, message: 'No document to share. Please upload a document first.' },
        { status: 400 }
      )
    }

    const clerkUserName = user ? ((user.firstName || '') + ' ' + (user.lastName || '')).trim() : ''
    const senderName = clerkUserName || 'MamaSign User'
    const senderEmail = user?.emailAddresses?.[0]?.emailAddress || 'noreply@mamasign.com'

    // Generate a unique share token
    const shareToken = crypto.randomUUID()

    // Build signers with tokens - include a public share signer
    const signersWithTokens = (signers || []).map((s: any) => ({
      name: s.name || 'Signer',
      email: s.email || '',
      order: s.order || 1,
      is_self: s.is_self || false,
      status: 'pending',
      signedAt: null,
      token: crypto.randomUUID()
    }))

    // Add the public share signer entry
    signersWithTokens.push({
      name: 'Public Signer',
      email: 'public@share',
      order: signersWithTokens.length + 1,
      is_self: false,
      status: 'pending',
      signedAt: null,
      token: shareToken
    })

    // Create a new signing request with status 'pending' so it's accessible via /s/token
    const signingRequestId = crypto.randomUUID()

    const { data, error } = await supabaseAdmin
      .from('signing_requests')
      .insert({
        id: signingRequestId,
        user_id: effectiveUserId,
        document_name: documentName || 'Shared Document',
        document_url: documentUrl,
        sender_name: senderName,
        sender_email: senderEmail,
        signers: signersWithTokens,
        signature_fields: signatureFields || [],
        message: templateProps ? JSON.stringify({ _templateProps: templateProps }) : null,
        status: 'pending',
        current_signer_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Share document error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to create share link' },
        { status: 500 }
      )
    }

    const shareUrl = `${APP_URL}/s/${shareToken}`

    return NextResponse.json({
      success: true,
      shareUrl,
      documentId: signingRequestId
    })

  } catch (error) {
    console.error('Error sharing document:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
