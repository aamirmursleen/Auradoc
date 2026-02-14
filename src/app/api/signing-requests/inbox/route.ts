import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email parameter required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('signing_requests')
      .select('*')
      .contains('signers', [{ email }])
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching inbox:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch inbox' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Error in inbox API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
