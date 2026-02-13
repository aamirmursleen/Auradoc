import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Load user preferences
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: preferences, error } = await supabaseAdmin
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // Table doesn't exist or no row found
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return NextResponse.json({
          success: true,
          data: null,
        })
      }
      console.error('Database error fetching preferences:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: preferences,
    })

  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Save/update user preferences
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()

    const fields: Record<string, unknown> = {
      user_id: userId,
      updated_at: new Date().toISOString(),
    }

    // Map camelCase from frontend to snake_case DB columns
    if (body.emailNotificationsEnabled !== undefined) fields.email_notifications_enabled = body.emailNotificationsEnabled
    if (body.notifyOnView !== undefined) fields.notify_on_view = body.notifyOnView
    if (body.notifyOnSign !== undefined) fields.notify_on_sign = body.notifyOnSign
    if (body.notifyOnComplete !== undefined) fields.notify_on_complete = body.notifyOnComplete
    if (body.defaultReminderEnabled !== undefined) fields.default_reminder_enabled = body.defaultReminderEnabled
    if (body.defaultReminderIntervalDays !== undefined) fields.default_reminder_interval_days = body.defaultReminderIntervalDays
    if (body.defaultExpirationDays !== undefined) fields.default_expiration_days = body.defaultExpirationDays
    if (body.companyName !== undefined) fields.company_name = body.companyName
    if (body.companyLogo !== undefined) fields.company_logo = body.companyLogo
    if (body.signatureImage !== undefined) fields.signature_image = body.signatureImage

    // Upsert - insert if not exists, update if exists
    const { data: preferences, error } = await supabaseAdmin
      .from('user_preferences')
      .upsert(fields, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      console.error('Database error saving preferences:', error)
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { success: false, message: 'Preferences table not set up. Please run migration 008_user_preferences.sql' },
          { status: 503 }
        )
      }
      return NextResponse.json(
        { success: false, message: 'Failed to save preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: preferences,
    })

  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
