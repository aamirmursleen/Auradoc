import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Fetch a single invoice
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

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !invoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: invoice
    })

  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update an invoice
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
    const { invoiceData, status } = body

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('invoices')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      )
    }

    const updateFields: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (invoiceData) {
      updateFields.data = invoiceData
      updateFields.invoice_number = invoiceData.invoiceNumber || null
      updateFields.currency = invoiceData.currency || 'USD'
      updateFields.client_name = invoiceData.clientName || null
      updateFields.client_email = invoiceData.clientEmail || null

      // Recalculate total
      const items = invoiceData.items || []
      const subtotal = items.reduce((sum: number, item: { quantity: number; price: number }) => sum + (item.quantity * item.price), 0)
      const totalTax = items.reduce((sum: number, item: { quantity: number; price: number; tax: number }) => sum + (item.quantity * item.price * ((item.tax || 0) / 100)), 0)
      const discountAmount = subtotal * ((invoiceData.discount || 0) / 100)
      const shippingAmount = invoiceData.shipping || 0
      updateFields.total = subtotal + totalTax - discountAmount + shippingAmount
    }

    if (status) {
      updateFields.status = status
    }

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error updating invoice:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to update invoice' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: invoice
    })

  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an invoice
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
      .from('invoices')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      )
    }

    const { error } = await supabaseAdmin
      .from('invoices')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error deleting invoice:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to delete invoice' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted'
    })

  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
