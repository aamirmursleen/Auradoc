import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - List user's saved resumes
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: resumes, error } = await supabaseAdmin
      .from('user_resumes')
      .select('id, template_id, name, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Database error fetching resumes:', error)
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          success: true,
          data: [],
          setupRequired: true,
        })
      }
      return NextResponse.json(
        { success: false, message: 'Failed to fetch resumes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: resumes || []
    })

  } catch (error) {
    console.error('Error fetching resumes:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new resume
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { templateId, name, data } = body

    if (!templateId) {
      return NextResponse.json(
        { success: false, message: 'Missing template ID' },
        { status: 400 }
      )
    }

    const { data: resume, error } = await supabaseAdmin
      .from('user_resumes')
      .insert({
        user_id: userId,
        template_id: templateId,
        name: name || 'Untitled Resume',
        data: data || {},
      })
      .select()
      .single()

    if (error) {
      console.error('Database error creating resume:', error)
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { success: false, message: 'Resumes table not set up. Please run migration 006_user_resumes.sql' },
          { status: 503 }
        )
      }
      return NextResponse.json(
        { success: false, message: 'Failed to create resume' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: resume
    })

  } catch (error) {
    console.error('Error creating resume:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
