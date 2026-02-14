import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Returns raw PDF binary data for fast streaming to the client
// This avoids sending huge base64 data inside a JSON response
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id
    const email = req.nextUrl.searchParams.get('email')
    const token = req.nextUrl.searchParams.get('token')

    if (!documentId || !email) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 })
    }

    // Fetch only the document_url and signers columns (minimal query)
    const { data: signingRequest, error } = await supabaseAdmin
      .from('signing_requests')
      .select('document_url, signers')
      .eq('id', documentId)
      .single()

    if (error || !signingRequest) {
      return NextResponse.json({ success: false, message: 'Document not found' }, { status: 404 })
    }

    // Verify the signer
    const signers = signingRequest.signers || []
    const signer = signers.find((s: { email: string }) =>
      s.email.toLowerCase() === email.toLowerCase()
    )
    if (!signer) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 })
    }

    const documentUrl = signingRequest.document_url
    if (!documentUrl) {
      return NextResponse.json({ success: false, message: 'No document data' }, { status: 404 })
    }

    // Convert base64 data URL to binary
    let pdfBytes: Uint8Array

    if (documentUrl.startsWith('data:')) {
      const base64Match = documentUrl.match(/base64,(.*)/)
      if (base64Match) {
        const binaryString = atob(base64Match[1])
        pdfBytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          pdfBytes[i] = binaryString.charCodeAt(i)
        }
      } else {
        return NextResponse.json({ success: false, message: 'Invalid document format' }, { status: 400 })
      }
    } else if (documentUrl.startsWith('http')) {
      const pdfResponse = await fetch(documentUrl)
      if (!pdfResponse.ok) {
        return NextResponse.json({ success: false, message: 'Failed to fetch document' }, { status: 500 })
      }
      const arrayBuffer = await pdfResponse.arrayBuffer()
      pdfBytes = new Uint8Array(arrayBuffer)
    } else {
      // Raw base64
      const binaryString = atob(documentUrl)
      pdfBytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        pdfBytes[i] = binaryString.charCodeAt(i)
      }
    }

    // Return raw PDF bytes with proper headers for fast streaming
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBytes.length.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    })

  } catch (error) {
    console.error('Error streaming PDF:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
