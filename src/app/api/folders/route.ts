import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - List user folders
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: folders, error } = await supabaseAdmin
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) {
      // Table doesn't exist - return empty
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({ success: true, data: [] })
      }
      console.error('Database error fetching folders:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch folders' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: folders || []
    })

  } catch (error) {
    console.error('Error fetching folders:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a folder
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, color, parentId } = await req.json()

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Folder name is required' },
        { status: 400 }
      )
    }

    const { data: folder, error } = await supabaseAdmin
      .from('folders')
      .insert({
        user_id: userId,
        name: name.trim(),
        color: color || '#0d9488',
        parent_id: parentId || null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { success: false, message: 'Folders table not set up. Please run migration 009_folders.sql' },
          { status: 503 }
        )
      }
      console.error('Database error creating folder:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to create folder' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: folder
    })

  } catch (error) {
    console.error('Error creating folder:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
