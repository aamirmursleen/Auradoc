import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

/**
 * Creates a signed upload URL for direct client-to-Supabase uploads
 * This bypasses Vercel's 4.5MB body limit completely
 */
export async function POST(req: NextRequest) {
  try {
    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      )
    }

    const { fileName, contentType } = body

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: 'File name is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // Generate unique path
    const ext = fileName.split('.').pop() || 'pdf'
    const uniqueName = `signing/${crypto.randomUUID()}.${ext}`

    // Create signed upload URL (valid for 60 minutes)
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUploadUrl(uniqueName)

    if (error) {
      console.error('Signed URL error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create upload URL' },
        { status: 500 }
      )
    }

    // Get the public URL for after upload
    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(uniqueName)

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: uniqueName,
      publicUrl: publicUrlData.publicUrl
    })

  } catch (error: any) {
    console.error('Upload URL error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
