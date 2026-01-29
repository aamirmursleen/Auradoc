import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { PDFDocument, rgb } from 'pdf-lib'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id

    // Fetch signing request with document and fields
    const { data: signingRequest, error } = await supabaseAdmin
      .from('signing_requests')
      .select('*')
      .eq('id', documentId)
      .single()

    if (error || !signingRequest) {
      return NextResponse.json(
        { success: false, message: 'Document not found' },
        { status: 404 }
      )
    }

    // Fetch all signature records for this document
    const { data: signatureRecords, error: sigError } = await supabaseAdmin
      .from('signature_records')
      .select('*')
      .eq('signing_request_id', documentId)

    if (sigError) {
      console.error('Error fetching signature records:', sigError)
    }

    // Get the original document
    const documentUrl = signingRequest.document_url
    if (!documentUrl) {
      return NextResponse.json(
        { success: false, message: 'Document file not available' },
        { status: 404 }
      )
    }

    // Load original PDF bytes
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
        return NextResponse.json(
          { success: false, message: 'Invalid document format' },
          { status: 400 }
        )
      }
    } else if (documentUrl.startsWith('http')) {
      const pdfResponse = await fetch(documentUrl)
      if (!pdfResponse.ok) {
        return NextResponse.json(
          { success: false, message: 'Failed to fetch document' },
          { status: 500 }
        )
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

    // Load PDF with pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
    const pages = pdfDoc.getPages()

    // Get signature fields from signing request
    const signatureFields = signingRequest.signature_fields || []
    const signers = signingRequest.signers || []

    // Build a map of signer email -> signature records
    const signerRecordMap: Record<string, any> = {}
    for (const record of (signatureRecords || [])) {
      signerRecordMap[record.signer_email.toLowerCase()] = record
    }

    // Embed each field's value into the PDF
    for (const field of signatureFields) {
      // Find which signer this field belongs to
      const signer = signers.find((s: any) => s.order === field.signerOrder)
      if (!signer) continue

      const record = signerRecordMap[signer.email.toLowerCase()]
      if (!record) continue // Signer hasn't signed yet

      const fieldValues = record.field_values || {}
      const signatureImage = record.signature_image

      // Determine page
      const pageNum = field.page || field.pageNumber || 1
      const pageIndex = pageNum - 1
      if (pageIndex < 0 || pageIndex >= pages.length) continue

      const page = pages[pageIndex]
      const { width: pageW, height: pageH } = page.getSize()

      // Field coordinates are stored in pixel space relative to zoom=1
      // We need to convert to percentage of page, then to PDF points
      // The signing page renders at a base scale, fields store x,y,width,height in pixels
      // We need the page dimensions that were used when fields were placed

      // Get field position in PDF points
      const fieldX = field.x
      const fieldY = field.y
      const fieldWidth = field.width
      const fieldHeight = field.height

      // The fields are stored in pixel coordinates at scale=1
      // PDF page at scale=1 renders at its native size
      // For standard A4: 595 x 842 points
      // We need to map pixel coords to PDF coords

      // Calculate the scale factor between pixel coords and PDF points
      // The sign page renders PDF at a renderScale of 1.5, then displays at viewport scale
      // But fields are stored in the coordinate space BEFORE the renderScale
      // Fields x,y are relative to the displayed page dimensions at zoom=1

      // Convert pixel coordinates to percentages based on typical page size
      const basePageWidth = 595  // Standard PDF width in points
      const basePageHeight = 842 // Standard A4 height in points

      const xPct = fieldX / basePageWidth
      const yPct = fieldY / basePageHeight
      const wPct = fieldWidth / basePageWidth
      const hPct = fieldHeight / basePageHeight

      // Convert to actual PDF coordinates
      const pdfX = xPct * pageW
      const pdfWidth = wPct * pageW
      const pdfHeight = hPct * pageH
      // Y-axis inversion: UI is top-down, PDF is bottom-up
      const pdfY = pageH - ((yPct + hPct) * pageH)

      const fieldType = field.type
      const value = fieldValues[field.id]

      try {
        if ((fieldType === 'signature' || fieldType === 'initials') && signatureImage && signatureImage !== 'no-signature-field') {
          // Embed signature image
          await embedImageIntoPdf(pdfDoc, page, signatureImage, { x: pdfX, y: pdfY, width: pdfWidth, height: pdfHeight })
        } else if (fieldType === 'checkbox' && value === 'checked') {
          // Draw checkbox
          page.drawRectangle({
            x: pdfX, y: pdfY, width: pdfWidth, height: pdfHeight,
            color: rgb(0.086, 0.639, 0.290),
          })
          // Checkmark
          const cx = pdfX + pdfWidth / 2
          const cy = pdfY + pdfHeight / 2
          const sz = Math.min(pdfWidth, pdfHeight) * 0.6
          page.drawLine({ start: { x: cx - sz * 0.4, y: cy }, end: { x: cx - sz * 0.1, y: cy - sz * 0.3 }, thickness: 2, color: rgb(1, 1, 1) })
          page.drawLine({ start: { x: cx - sz * 0.1, y: cy - sz * 0.3 }, end: { x: cx + sz * 0.4, y: cy + sz * 0.3 }, thickness: 2, color: rgb(1, 1, 1) })
        } else if (fieldType === 'stamp' && value) {
          if (value.startsWith('data:image')) {
            await embedImageIntoPdf(pdfDoc, page, value, { x: pdfX, y: pdfY, width: pdfWidth, height: pdfHeight })
          } else {
            // Text stamp
            const fontSize = Math.min(pdfHeight * 0.5, 16)
            page.drawText(value, {
              x: pdfX + 4,
              y: pdfY + (pdfHeight - fontSize) / 2,
              size: fontSize,
              color: rgb(0.863, 0.149, 0.149),
            })
          }
        } else if (fieldType === 'strikethrough' && value) {
          // Draw strikethrough line
          const lineY = pdfY + pdfHeight / 2
          const color = value.startsWith('#') ? hexToRgb(value) : rgb(0.863, 0.149, 0.149)
          page.drawLine({
            start: { x: pdfX, y: lineY },
            end: { x: pdfX + pdfWidth, y: lineY },
            thickness: 3,
            color,
          })
        } else if (value && fieldType !== 'checkbox') {
          // Text fields (text, name, email, date, etc.)
          let displayValue = value
          if (fieldType === 'date' && value) {
            try {
              displayValue = new Date(value).toLocaleDateString()
            } catch { displayValue = value }
          }
          const fontSize = Math.min(field.fontSize || 14, pdfHeight * 0.7)
          page.drawText(displayValue, {
            x: pdfX + 4,
            y: pdfY + (pdfHeight - fontSize) / 2,
            size: fontSize,
            color: rgb(0, 0, 0),
            maxWidth: pdfWidth - 8,
          })
        }
      } catch (fieldError) {
        console.error(`Error embedding field ${field.id}:`, fieldError)
      }
    }

    // Save final PDF
    const finalPdfBytes = await pdfDoc.save()

    // Return as downloadable PDF
    return new NextResponse(Buffer.from(finalPdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${signingRequest.document_name.replace(/\.[^/.]+$/, '')}_signed.pdf"`,
      },
    })

  } catch (error) {
    console.error('Error generating signed PDF:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to generate signed document' },
      { status: 500 }
    )
  }
}

// Helper: embed image into PDF
async function embedImageIntoPdf(
  pdfDoc: PDFDocument,
  page: any,
  imageDataUrl: string,
  coords: { x: number; y: number; width: number; height: number }
) {
  const base64 = imageDataUrl.split(',')[1]
  if (!base64) return

  const binaryString = atob(base64)
  const imageBytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    imageBytes[i] = binaryString.charCodeAt(i)
  }

  let image
  if (imageDataUrl.includes('image/png')) {
    image = await pdfDoc.embedPng(imageBytes)
  } else if (imageDataUrl.includes('image/jpeg') || imageDataUrl.includes('image/jpg')) {
    image = await pdfDoc.embedJpg(imageBytes)
  } else {
    try { image = await pdfDoc.embedPng(imageBytes) } catch { image = await pdfDoc.embedJpg(imageBytes) }
  }

  // Maintain aspect ratio
  const imgAspect = image.width / image.height
  const boxAspect = coords.width / coords.height
  let drawW, drawH, drawX, drawY

  if (imgAspect > boxAspect) {
    drawW = coords.width
    drawH = coords.width / imgAspect
    drawX = coords.x
    drawY = coords.y + (coords.height - drawH) / 2
  } else {
    drawH = coords.height
    drawW = coords.height * imgAspect
    drawX = coords.x + (coords.width - drawW) / 2
    drawY = coords.y
  }

  page.drawImage(image, { x: drawX, y: drawY, width: drawW, height: drawH })
}

// Helper: convert hex color to pdf-lib rgb
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return rgb(
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    )
  }
  return rgb(0.863, 0.149, 0.149) // Default red
}
