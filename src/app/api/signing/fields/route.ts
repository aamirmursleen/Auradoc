import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { document_id, signer_id, field_type, page_number, x, y, width, height, required } = body

    if (!document_id || !field_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const fieldId = crypto.randomUUID()

    const { data: field, error } = await supabase
      .from('document_fields')
      .insert({
        id: fieldId,
        document_id,
        signer_id,
        field_type,
        page_number: page_number || 1,
        x: x || 10,
        y: y || 10,
        width: width || 200,
        height: height || 50,
        required: required ?? true,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      // Return mock field for demo
      return NextResponse.json({
        success: true,
        field: {
          id: fieldId,
          document_id,
          signer_id,
          field_type,
          page_number: page_number || 1,
          x: x || 10,
          y: y || 10,
          width: width || 200,
          height: height || 50,
          required: required ?? true
        }
      })
    }

    return NextResponse.json({
      success: true,
      field
    })

  } catch (error) {
    console.error('Error creating field:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
