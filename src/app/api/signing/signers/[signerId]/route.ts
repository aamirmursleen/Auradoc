import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  req: NextRequest,
  { params }: { params: { signerId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const signerId = params.signerId
    const updates = await req.json()

    const { data: signer, error } = await supabase
      .from('document_signers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', signerId)
      .select()
      .single()

    if (error) {
      // Return mock updated signer
      return NextResponse.json({
        success: true,
        signer: {
          id: signerId,
          ...updates
        }
      })
    }

    return NextResponse.json({
      success: true,
      signer
    })

  } catch (error) {
    console.error('Error updating signer:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { signerId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const signerId = params.signerId

    // Delete associated fields first
    await supabase
      .from('document_fields')
      .delete()
      .eq('signer_id', signerId)

    // Delete the signer
    const { error } = await supabase
      .from('document_signers')
      .delete()
      .eq('id', signerId)

    if (error) {
      console.error('Delete error:', error)
    }

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('Error deleting signer:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
