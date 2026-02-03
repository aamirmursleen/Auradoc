import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { rateLimit } from '@/lib/rate-limit'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface TemplateField {
  name: string
  label: string
  type: string
}

export async function POST(req: NextRequest) {
  const rateLimited = rateLimit(req, { limit: 5, windowSeconds: 60 })
  if (rateLimited) return rateLimited

  try {
    const { prompt, category, fields } = await req.json()

    if (!prompt || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing prompt or category' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Build the system prompt based on category
    const systemPrompt = getSystemPrompt(category, fields)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })

    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      return NextResponse.json(
        { success: false, error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Parse the JSON response
    const generatedContent = JSON.parse(responseContent)

    return NextResponse.json({
      success: true,
      data: generatedContent
    })

  } catch (error: any) {
    console.error('AI Generation Error:', error)

    // Check for specific OpenAI errors
    if (error?.code === 'insufficient_quota') {
      return NextResponse.json(
        { success: false, error: 'OpenAI quota exceeded. Please check your API key.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate content' },
      { status: 500 }
    )
  }
}

function getSystemPrompt(category: string, fields: TemplateField[]): string {
  const fieldNames = fields?.map(f => f.name).join(', ') || ''

  const baseInstruction = `You are a professional document generator. Generate content in JSON format with the following field names: ${fieldNames}.

  Return ONLY valid JSON with the field names as keys and generated content as values. Make the content professional, detailed, and realistic.`

  switch (category) {
    case 'resume':
      return `${baseInstruction}

You are generating a professional resume. The user will describe their background or the type of job they want.
Generate realistic, professional content including:
- Full name (realistic name)
- Job title
- Contact details (use example.com for emails)
- Professional summary (2-3 sentences highlighting key strengths)
- Work experience with bullet points of achievements
- Education details
- Relevant skills

Make it impressive and tailored to the user's request. Use action verbs and quantify achievements where possible.`

    case 'letters':
      return `${baseInstruction}

You are generating a professional cover letter or business letter.
Generate compelling content that:
- Has a strong opening that captures attention
- Highlights relevant qualifications and experience
- Shows enthusiasm and cultural fit
- Has a professional closing

Make it personalized based on the user's request.`

    case 'business':
      return `${baseInstruction}

You are generating a professional business proposal.
Include:
- Clear executive summary
- Problem statement
- Proposed solution with details
- Deliverables list
- Timeline
- Investment/pricing breakdown
- Why choose us section

Make it persuasive and professional.`

    case 'contracts':
      return `${baseInstruction}

You are generating a professional contract or agreement.
Include:
- Clear party names and details
- Project/service description
- Terms and conditions
- Payment details
- Timeline/dates
- Professional language

Make it legally-sounding and comprehensive.`

    case 'invoices':
      return `${baseInstruction}

You are generating a professional invoice.
Include:
- Company details
- Client details
- Invoice number (format: INV-2024-XXX)
- Line items with descriptions and amounts
- Payment terms
- Professional notes

Use realistic amounts and descriptions.`

    case 'hr':
      return `${baseInstruction}

You are generating HR documents like offer letters or employment contracts.
Include:
- Company information
- Position details
- Compensation and benefits
- Start date and terms
- Professional HR language

Make it formal and comprehensive.`

    case 'agreements':
      return `${baseInstruction}

You are generating a professional agreement document.
Include:
- Party information
- Agreement terms and conditions
- Obligations of each party
- Duration and termination clauses
- Professional legal language

Make it comprehensive and formal.`

    default:
      return `${baseInstruction}

Generate professional, well-structured content based on the user's request. Make it realistic and ready to use.`
  }
}
