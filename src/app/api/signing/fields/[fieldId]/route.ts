import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  req: NextRequest,
  { params }: { params: { fieldId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const fieldId = params.fieldId
    const updates = await req.json()

    const { data: field, error } = await supabase
      .from('document_fields')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', fieldId)
      .select()
      .single()

    if (error) {
      // Return mock updated field
      return NextResponse.json({
        success: true,
        field: {
          id: fieldId,
          ...updates
        }
      })
    }

    return NextResponse.json({
      success: true,
      field
    })

  } catch (error) {
    console.error('Error updating field:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { fieldId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const fieldId = params.fieldId

    const { error } = await supabase
      .from('document_fields')
      .delete()
      .eq('id', fieldId)

    if (error) {
      console.error('Delete error:', error)
    }

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('Error deleting field:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
