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

    console.log('📄 Download: signatureFields count:', signatureFields.length)
    console.log('📄 Download: signers:', signers.map((s: any) => ({ email: s.email, order: s.order, status: s.status })))
    console.log('📄 Download: signature_records count:', signatureRecords?.length || 0)

    // Build a map of signer email -> signature records
    const signerRecordMap: Record<string, any> = {}
    for (const record of (signatureRecords || [])) {
      signerRecordMap[record.signer_email.toLowerCase()] = record
      console.log('📄 Download: record for', record.signer_email, {
        hasSignatureImage: !!record.signature_image,
        hasFieldValues: !!record.field_values,
        fieldValueKeys: record.field_values ? Object.keys(record.field_values) : []
      })
    }

    // Embed each field's value into the PDF
    for (const field of signatureFields) {
      console.log('📄 Download: processing field', field.id, {
        type: field.type,
        signerOrder: field.signerOrder,
        x: field.x, y: field.y, width: field.width, height: field.height,
        page: field.page || field.pageNumber
      })

      // Find which signer this field belongs to
      const signer = signers.find((s: any) => s.order === field.signerOrder)
      if (!signer) {
        console.log('📄 Download: no signer found for order', field.signerOrder)
        continue
      }

      const record = signerRecordMap[signer.email.toLowerCase()]
      if (!record) {
        console.log('📄 Download: no signature record for', signer.email)
        continue
      }

      const fieldValues = record.field_values || {}
      const signatureImage = record.signature_image

      // Determine page
      const pageNum = field.page || field.pageNumber || 1
      const pageIndex = pageNum - 1
      if (pageIndex < 0 || pageIndex >= pages.length) continue

      const page = pages[pageIndex]
      const { width: pageW, height: pageH } = page.getSize()

      // Field coordinates stored in pixel space at scale=1
      const fieldX = field.x
      const fieldY = field.y
      const fieldWidth = field.width
      const fieldHeight = field.height

      // Convert pixel coordinates to PDF coordinates
      // Fields are in pixel space where page renders at its native PDF size
      const xPct = fieldX / pageW
      const yPct = fieldY / pageH
      const wPct = fieldWidth / pageW
      const hPct = fieldHeight / pageH

      // Convert to actual PDF coordinates
      const pdfX = xPct * pageW  // = fieldX (same coordinate space)
      const pdfWidth = wPct * pageW  // = fieldWidth
      const pdfHeight = hPct * pageH  // = fieldHeight
      // Y-axis inversion: UI is top-down, PDF is bottom-up
      const pdfY = pageH - ((yPct + hPct) * pageH)

      const fieldType = field.type
      const value = fieldValues[field.id]

      console.log('📄 Download: field', field.id, 'value:', value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'NO VALUE', 'signatureImage:', signatureImage ? 'YES' : 'NO')

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
