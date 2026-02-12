import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Fallback templates for when DB table doesn't exist
const fallbackTemplates = [
  { id: 1, name: 'Non-Disclosure Agreement (NDA)', description: 'Standard mutual NDA template for protecting confidential business information between parties.', category: 'business', downloads: 12500, rating: 4.9, popular: true },
  { id: 2, name: 'Employment Contract', description: 'Comprehensive employment agreement template covering terms, compensation, and conditions.', category: 'hr', downloads: 9800, rating: 4.8, popular: true },
  { id: 3, name: 'Residential Lease Agreement', description: 'Complete rental agreement for residential properties with all standard clauses.', category: 'real-estate', downloads: 8500, rating: 4.7, popular: true },
  { id: 4, name: 'Independent Contractor Agreement', description: 'Template for hiring contractors with clear scope of work and payment terms.', category: 'business', downloads: 7200, rating: 4.8, popular: false },
  { id: 5, name: 'Medical Consent Form', description: 'HIPAA-compliant patient consent form for medical procedures and treatments.', category: 'healthcare', downloads: 6100, rating: 4.9, popular: false },
  { id: 6, name: 'Invoice Template', description: 'Professional invoice template with itemized billing and payment terms.', category: 'finance', downloads: 15000, rating: 4.6, popular: true },
  { id: 7, name: 'Purchase Order', description: 'Standard purchase order form for business procurement and vendor management.', category: 'business', downloads: 5400, rating: 4.7, popular: false },
  { id: 8, name: 'Vehicle Sale Agreement', description: 'Complete bill of sale template for private vehicle transactions.', category: 'automotive', downloads: 4200, rating: 4.8, popular: false },
  { id: 9, name: 'Student Enrollment Form', description: 'Educational institution enrollment and registration template.', category: 'education', downloads: 3800, rating: 4.5, popular: false },
  { id: 10, name: 'Power of Attorney', description: 'Legal document granting authority to act on someone\'s behalf.', category: 'legal', downloads: 6800, rating: 4.9, popular: true },
  { id: 11, name: 'Employee Onboarding Checklist', description: 'Comprehensive checklist for new employee orientation and setup.', category: 'hr', downloads: 4500, rating: 4.6, popular: false },
  { id: 12, name: 'Commercial Lease Agreement', description: 'Professional commercial property lease with business-specific terms.', category: 'real-estate', downloads: 5100, rating: 4.7, popular: false },
]

// GET - Fetch a single template (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: template, error } = await supabaseAdmin
      .from('templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !template) {
      // Try fallback by numeric ID
      const numId = parseInt(id)
      const fallback = fallbackTemplates.find(t => t.id === numId)
      if (fallback) {
        return NextResponse.json({
          success: true,
          data: fallback,
          fallback: true,
        })
      }
      return NextResponse.json(
        { success: false, message: 'Template not found' },
        { status: 404 }
      )
    }

    // Increment download count
    await supabaseAdmin
      .from('templates')
      .update({ downloads: (template.downloads || 0) + 1 })
      .eq('id', id)

    return NextResponse.json({
      success: true,
      data: template
    })

  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
