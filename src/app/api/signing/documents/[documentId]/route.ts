import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const documentId = params.documentId

    // Fetch document from database
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single()

    if (error || !document) {
      // Return demo document for testing
      return NextResponse.json({
        success: true,
        document: {
          id: documentId,
          name: 'Sample Document',
          file_url: null,
          page_count: 1,
          status: 'draft',
          fields: [],
          signers: [],
          user_id: userId,
          created_at: new Date().toISOString()
        }
      })
    }

    // Fetch fields for this document
    const { data: fields } = await supabase
      .from('document_fields')
      .select('*')
      .eq('document_id', documentId)

    // Fetch signers for this document
    const { data: signers } = await supabase
      .from('document_signers')
      .select('*')
      .eq('document_id', documentId)
      .order('order', { ascending: true })

    return NextResponse.json({
      success: true,
      document: {
        ...document,
        fields: fields || [],
        signers: signers || []
      }
    })

  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
