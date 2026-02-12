import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Fetch a single resume
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const { data: resume, error } = await supabaseAdmin
      .from('user_resumes')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !resume) {
      return NextResponse.json(
        { success: false, message: 'Resume not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: resume
    })

  } catch (error) {
    console.error('Error fetching resume:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update a resume
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const { name, data } = body

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('user_resumes')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Resume not found' },
        { status: 404 }
      )
    }

    const updateFields: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateFields.name = name
    if (data !== undefined) updateFields.data = data

    const { data: resume, error } = await supabaseAdmin
      .from('user_resumes')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error updating resume:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to update resume' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: resume
    })

  } catch (error) {
    console.error('Error updating resume:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a resume
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('user_resumes')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Resume not found' },
        { status: 404 }
      )
    }

    const { error } = await supabaseAdmin
      .from('user_resumes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error deleting resume:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to delete resume' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Resume deleted'
    })

  } catch (error) {
    console.error('Error deleting resume:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
