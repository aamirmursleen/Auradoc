import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    const { draftId, documentName, documentUrl, signers, signatureFields, templateProps } = body

    if (!documentName && !documentUrl) {
      return NextResponse.json(
        { success: false, message: 'No document data to save' },
        { status: 400 }
      )
    }

    const clerkUserName = user ? ((user.firstName || '') + ' ' + (user.lastName || '')).trim() : ''
    const senderName = clerkUserName || 'MamaSign User'
    const senderEmail = user?.emailAddresses?.[0]?.emailAddress || 'noreply@mamasign.com'

    const draftData = {
      user_id: effectiveUserId,
      document_name: documentName || 'Untitled Document',
      document_url: documentUrl || null,
      sender_name: senderName,
      sender_email: senderEmail,
      signers: signers || [],
      signature_fields: signatureFields || [],
      message: templateProps ? JSON.stringify({ _templateProps: templateProps }) : null,
      status: 'draft',
      updated_at: new Date().toISOString()
    }

    let result

    if (draftId) {
      // Update existing draft
      const { data, error } = await supabaseAdmin
        .from('signing_requests')
        .update(draftData)
        .eq('id', draftId)
        .eq('user_id', effectiveUserId)
        .eq('status', 'draft')
        .select()
        .single()

      if (error) {
        console.error('Draft update error:', error)
        return NextResponse.json(
          { success: false, message: 'Failed to update draft' },
          { status: 500 }
        )
      }
      result = data
    } else {
      // Create new draft
      const { data, error } = await supabaseAdmin
        .from('signing_requests')
        .insert({
          ...draftData,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Draft insert error:', error)
        return NextResponse.json(
          { success: false, message: 'Failed to save draft' },
          { status: 500 }
        )
      }
      result = data
    }

    return NextResponse.json({
      success: true,
      message: draftId ? 'Draft updated' : 'Draft saved',
      draftId: result.id
    })

  } catch (error) {
    console.error('Error saving draft:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
