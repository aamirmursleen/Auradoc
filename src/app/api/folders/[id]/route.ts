import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

// PATCH - Update folder
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const updates: Record<string, unknown> = {}
    if (body.name !== undefined) updates.name = body.name.trim()
    if (body.color !== undefined) updates.color = body.color
    if (body.parentId !== undefined) updates.parent_id = body.parentId

    const { data: folder, error } = await supabaseAdmin
      .from('folders')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Database error updating folder:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to update folder' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: folder })

  } catch (error) {
    console.error('Error updating folder:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete folder
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const { error } = await supabaseAdmin
      .from('folders')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Database error deleting folder:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to delete folder' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting folder:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
