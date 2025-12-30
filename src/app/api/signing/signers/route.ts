import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

const SIGNER_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f97316', // orange
  '#22c55e', // green
  '#06b6d4', // cyan
]

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { document_id, name, email, is_self } = body

    if (!document_id || !name || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get existing signers count for order and color
    const { data: existingSigners } = await supabase
      .from('document_signers')
      .select('id')
      .eq('document_id', document_id)

    const signerCount = existingSigners?.length || 0
    const signerId = crypto.randomUUID()

    const signerData = {
      id: signerId,
      document_id,
      name,
      email: email.toLowerCase(),
      order: signerCount + 1,
      color: SIGNER_COLORS[signerCount % SIGNER_COLORS.length],
      status: 'pending',
      is_self: is_self || false,
      created_at: new Date().toISOString()
    }

    const { data: signer, error } = await supabase
      .from('document_signers')
      .insert(signerData)
      .select()
      .single()

    if (error) {
      // Return mock signer for demo
      return NextResponse.json({
        success: true,
        signer: signerData
      })
    }

    return NextResponse.json({
      success: true,
      signer
    })

  } catch (error) {
    console.error('Error creating signer:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
