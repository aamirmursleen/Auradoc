import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const requestId = params.id

    // Fetch signing request
    const { data: signingRequest, error: reqError } = await supabaseAdmin
      .from('signing_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (reqError || !signingRequest) {
      return NextResponse.json(
        { success: false, message: 'Signing request not found' },
        { status: 404 }
      )
    }

    // Verify the user owns this signing request
    if (signingRequest.user_id !== userId) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to view this document' },
        { status: 403 }
      )
    }

    // Fetch signature records (audit trail)
    const { data: signatureRecords } = await supabaseAdmin
      .from('signature_records')
      .select('*')
      .eq('signing_request_id', requestId)
      .order('signed_at', { ascending: true })

    // Fetch notifications for this signing request
    const { data: notifications } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('document_id', requestId)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      success: true,
      data: {
        signingRequest,
        signatureRecords: signatureRecords || [],
        notifications: notifications || [],
      }
    })
  } catch (error) {
    console.error('Error fetching track data:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
