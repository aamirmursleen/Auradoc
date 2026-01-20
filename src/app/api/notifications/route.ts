import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch user notifications
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const { data: notifications, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch notifications' },
        { status: 500 }
      )
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    return NextResponse.json({
      success: true,
      data: notifications || [],
      unreadCount: unreadCount || 0
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a notification (internal use)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, type, title, message, documentId, documentName, signerName, signerEmail, metadata } = body

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        document_id: documentId || null,
        document_name: documentName || null,
        signer_name: signerName || null,
        signer_email: signerEmail || null,
        metadata: metadata || {},
        is_read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to create notification' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: notification
    })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Mark notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { notificationIds, markAllRead } = body

    if (markAllRead) {
      // Mark all notifications as read
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { success: false, message: 'Failed to update notifications' },
          { status: 500 }
        )
      }
    } else if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .in('id', notificationIds)

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { success: false, message: 'Failed to update notifications' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications updated'
    })

  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
