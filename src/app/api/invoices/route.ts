import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - List user's invoices
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
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabaseAdmin
      .from('invoices')
      .select('id, invoice_number, status, total, currency, client_name, client_email, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: invoices, error } = await query

    if (error) {
      console.error('Database error fetching invoices:', error)
      // If table doesn't exist, return empty array with a hint
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          success: true,
          data: [],
          setupRequired: true,
          message: 'Invoices table not found. Please run the migration: supabase/migrations/005_invoices.sql'
        })
      }
      return NextResponse.json(
        { success: false, message: 'Failed to fetch invoices' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: invoices || []
    })

  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new invoice
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
    const { invoiceData, status = 'draft' } = body

    if (!invoiceData) {
      return NextResponse.json(
        { success: false, message: 'Missing invoice data' },
        { status: 400 }
      )
    }

    // Calculate total from items
    const items = invoiceData.items || []
    const subtotal = items.reduce((sum: number, item: { quantity: number; price: number }) => sum + (item.quantity * item.price), 0)
    const totalTax = items.reduce((sum: number, item: { quantity: number; price: number; tax: number }) => sum + (item.quantity * item.price * ((item.tax || 0) / 100)), 0)
    const discountAmount = subtotal * ((invoiceData.discount || 0) / 100)
    const shippingAmount = invoiceData.shipping || 0
    const total = subtotal + totalTax - discountAmount + shippingAmount

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .insert({
        user_id: userId,
        invoice_number: invoiceData.invoiceNumber || null,
        status,
        data: invoiceData,
        total,
        currency: invoiceData.currency || 'USD',
        client_name: invoiceData.clientName || null,
        client_email: invoiceData.clientEmail || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error creating invoice:', error)
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { success: false, message: 'Invoices table not set up. Please run migration 005_invoices.sql in your Supabase SQL Editor.' },
          { status: 503 }
        )
      }
      return NextResponse.json(
        { success: false, message: 'Failed to create invoice' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: invoice
    })

  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
