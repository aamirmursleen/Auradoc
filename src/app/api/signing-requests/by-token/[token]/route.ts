import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Missing token' },
        { status: 400 }
      )
    }

    // Use Supabase JSONB containment to find the signing request with this token
    // This is much more efficient than fetching all records
    const { data: signingRequests, error } = await supabaseAdmin
      .from('signing_requests')
      .select('id, signers')
      .filter('signers', 'cs', JSON.stringify([{ token }]))
      .limit(1)

    if (error) {
      // Fallback: if containment query fails, search all records
      console.error('Containment query failed, falling back to scan:', error)
      const { data: allRequests, error: fallbackError } = await supabaseAdmin
        .from('signing_requests')
        .select('id, signers')
        .not('signers', 'is', null)

      if (fallbackError) {
        return NextResponse.json(
          { success: false, message: 'Internal server error' },
          { status: 500 }
        )
      }

      let foundRequest = null
      let foundSigner = null

      for (const request of (allRequests || [])) {
        const signers = request.signers || []
        const signer = signers.find((s: { token: string }) => s.token === token)
        if (signer) {
          foundRequest = request
          foundSigner = signer
          break
        }
      }

      if (!foundRequest || !foundSigner) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired signing link' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          documentId: foundRequest.id,
          email: foundSigner.email,
          token: token
        }
      })
    }

    if (!signingRequests || signingRequests.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired signing link' },
        { status: 404 }
      )
    }

    const request = signingRequests[0]
    const signers = request.signers || []
    const signer = signers.find((s: { token: string }) => s.token === token)

    if (!signer) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired signing link' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        documentId: request.id,
        email: signer.email,
        token: token
      }
    })

  } catch (error) {
    console.error('Error looking up token:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
