import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const MAMASIGN_SYSTEM_PROMPT = `You are "Mamasign AI Support Agent", a friendly and helpful support assistant for the Mamasign document signing platform.

YOUR PERSONALITY:
- Speak in simple, easy English
- Be friendly, calm, and professional
- Use short sentences
- Use bullet points for lists
- Be patient and helpful

MAMASIGN FEATURE KNOWLEDGE BASE:
================================

WHAT IS MAMASIGN?
- Mamasign is an online document signing platform
- Users can upload documents, add signature fields, and send them for signing
- It works on any device - computer, tablet, or phone
- No software installation needed - works in browser

MAIN FEATURES:

1. SIGN DOCUMENTS
   - Upload PDF or image files (PNG, JPG)
   - Maximum file size: 25MB
   - Add signature fields by dragging them onto the document
   - Double-click on signature field to draw your signature
   - You can adjust signature size using Smaller/Larger buttons
   - Signature appears on document instantly (live preview)
   - After signing, panel closes automatically

2. SEND FOR SIGNATURE
   - Add multiple signers (up to 10 people)
   - Enter signer name and email
   - Each signer gets a unique link via email
   - Signers can sign in order (sequential signing)
   - Track who has signed and who hasn't

3. FIELD TYPES
   - Signature: For drawing signature
   - Initials: For adding initials
   - Date: Auto-fills current date
   - Text: For typing text
   - Checkbox: For yes/no options
   - Name: For full name
   - Email: For email address
   - Company: For company name

4. SIGNATURE OPTIONS
   - Draw: Draw signature with mouse or finger
   - Upload: Upload an image of your signature
   - Camera: Take photo of handwritten signature
   - Background is automatically removed from uploaded images

5. DOCUMENT MANAGEMENT
   - View all sent documents in dashboard
   - See signing status (pending, completed)
   - Download signed documents
   - Preview how document will look after signing

COMMON ISSUES AND SOLUTIONS:

Issue: "I cannot upload my document"
Solutions:
• Check file format - only PDF, PNG, JPG allowed
• Check file size - must be under 25MB
• Try a different browser (Chrome recommended)
• Clear browser cache and try again

Issue: "Signer did not receive email"
Solutions:
• Check if email address is correct
• Ask signer to check spam/junk folder
• Resend the signing request
• Make sure email is not blocked

Issue: "Signature is not appearing on document"
Solutions:
• Make sure you drew the signature (not just opened the pad)
• Try clearing and signing again
• Check if signature field is selected
• Refresh the page and try again

Issue: "I cannot move/resize the signature field"
Solutions:
• Click on the field to select it first
• Use Smaller/Larger buttons to resize
• Drag the field to move it
• Make sure the signature panel is closed

Issue: "Document preview shows signature in wrong position"
Solutions:
• The preview uses the exact position where you placed the field
• Drag the field to correct position before signing
• Use zoom to see better placement
• Position is saved when you send for signature

Issue: "I want to edit my signature after saving"
Solutions:
• Click on the signed field
• Signature panel will open again
• Clear and redraw your signature
• Click Done to save

ACCOUNT RELATED:

Sign Up / Login:
- Sign up with email or Google
- Free account available
- Password must be at least 8 characters

Billing:
- Free plan: Limited signatures per month
- Paid plans: More signatures and features
- Contact support@mamasign.com for billing issues

BROWSER SUPPORT:
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers supported

SECURITY:
- All documents are encrypted
- Secure HTTPS connection
- Documents auto-delete after completion (optional)
- Only authorized signers can access documents

RESPONSE FORMAT (ALWAYS USE THIS):

When helping users:
1. First understand their problem
2. Explain WHY the issue might be happening
3. Give step-by-step solution
4. Use bullet points
5. Keep it simple

If you don't know something, say:
"I don't have information about that. Please contact support@mamasign.com for help."

NEVER:
- Ask for passwords or OTPs
- Make up features that don't exist
- Give technical jargon without explaining
- Be rude or impatient`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, message: 'Messages are required' },
        { status: 400 }
      )
    }

    // If no OpenAI key, use fallback responses
    if (!OPENAI_API_KEY) {
      const fallbackResponse = getFallbackResponse(messages[messages.length - 1]?.content || '')
      return NextResponse.json({
        success: true,
        message: fallbackResponse
      })
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: MAMASIGN_SYSTEM_PROMPT },
          ...messages.slice(-10) // Keep last 10 messages for context
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const fallbackResponse = getFallbackResponse(messages[messages.length - 1]?.content || '')
      return NextResponse.json({
        success: true,
        message: fallbackResponse
      })
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.'

    return NextResponse.json({
      success: true,
      message: assistantMessage
    })

  } catch (error) {
    console.error('Support chat error:', error)
    return NextResponse.json({
      success: true,
      message: 'Sorry, I am having trouble connecting right now. Please try again in a moment, or contact support@mamasign.com for help.'
    })
  }
}

// Fallback responses when OpenAI is not available
function getFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  // Upload issues
  if (lowerMessage.includes('upload') || lowerMessage.includes('file')) {
    return `Here's how to upload documents on Mamasign:

• Supported formats: PDF, PNG, JPG
• Maximum file size: 25MB
• Click "Upload" or drag and drop your file

If upload is not working:
1. Check your file format (PDF, PNG, JPG only)
2. Make sure file is under 25MB
3. Try a different browser (Chrome works best)
4. Clear your browser cache

Still having issues? Email us at support@mamasign.com`
  }

  // Signature issues
  if (lowerMessage.includes('sign') || lowerMessage.includes('signature')) {
    return `Here's how to add signatures on Mamasign:

To sign a document:
1. Drag a "Signature" field onto your document
2. Double-click on the field
3. Draw your signature in the pad
4. Signature appears on document automatically
5. Use Smaller/Larger buttons to adjust size

Tips:
• You can also upload or take photo of signature
• Click on signed field to edit it
• Drag field to change position

Need more help? Email support@mamasign.com`
  }

  // Email/sending issues
  if (lowerMessage.includes('email') || lowerMessage.includes('send') || lowerMessage.includes('receive')) {
    return `About sending documents for signature:

To send a document:
1. Add signer name and email
2. Place signature fields for each signer
3. Click "Send for Signature"
4. Signers receive email with signing link

If signer didn't receive email:
• Check email address is correct
• Ask them to check spam/junk folder
• Try resending the request
• Make sure their email isn't blocking us

Questions? Email support@mamasign.com`
  }

  // Position/move issues
  if (lowerMessage.includes('position') || lowerMessage.includes('move') || lowerMessage.includes('drag')) {
    return `How to move and position fields:

To move a field:
1. Click on the field to select it
2. Drag it to the new position
3. Field should follow your cursor

To resize a field:
1. Select the field
2. Use Smaller/Larger buttons in the signature panel
3. Or drag the resize handle in corner

If you can't move the field:
• Make sure it's selected (click on it first)
• Close the signature panel
• Try refreshing the page

Need help? Email support@mamasign.com`
  }

  // Account issues
  if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('password')) {
    return `Account Help:

To create account:
• Click "Sign Up"
• Enter your email and password
• Or sign up with Google

Forgot password?
• Click "Forgot Password" on login page
• Enter your email
• Check inbox for reset link

Account issues?
• Email support@mamasign.com
• Include your account email
• We'll help you within 24 hours`
  }

  // Default response
  return `Hello! I'm the Mamasign Support Agent.

I can help you with:
• Uploading documents
• Adding signatures
• Sending documents for signing
• Account questions
• Troubleshooting errors

Please describe your question or issue, and I'll do my best to help!

For urgent matters, email support@mamasign.com`
}
