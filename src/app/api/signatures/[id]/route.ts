import { NextRequest, NextResponse } from 'next/server'

// Note: In production, this would be a database lookup
// For demo, we import from the main route (shared in-memory storage)
// This is a simplified example - in production, use a proper database

// GET - Get a specific signed document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id

    // In production, fetch from database
    // For demo purposes, return a mock response
    return NextResponse.json({
      success: true,
      document: {
        id: documentId,
        status: 'signed',
        message: 'Document details would be fetched from database',
      },
    })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch document' },
      { status: 500 }
    )
  }
}
