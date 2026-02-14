import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { PDFDocument, rgb, degrees, PDFPage } from 'pdf-lib'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id

    // Fetch signing request - contains everything we need
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
      const binaryString = atob(documentUrl)
      pdfBytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        pdfBytes[i] = binaryString.charCodeAt(i)
      }
    }

    // Load PDF with pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
    const pages = pdfDoc.getPages()

    const signatureFields = signingRequest.signature_fields || []
    const signers = signingRequest.signers || []

    console.log('📄 Download: fields count:', signatureFields.length, 'signers:', signers.length)

    // Build map: signerOrder -> signer data (including fieldValues, signatureImage, and fieldPositions)
    const signerByOrder: Record<number, any> = {}
    for (const signer of signers) {
      signerByOrder[signer.order] = signer
      console.log('📄 Signer:', signer.email, 'order:', signer.order, 'status:', signer.status,
        'hasFieldValues:', !!signer.fieldValues, 'hasSignature:', !!signer.signatureImage,
        'hasFieldPositions:', !!signer.fieldPositions)
    }

    // Embed each field into the PDF using percentage-based coordinates
    for (const field of signatureFields) {
      const signer = signerByOrder[field.signerOrder]
      if (!signer || signer.status !== 'signed') {
        console.log('📄 Skip field', field.id, '- signer not signed')
        continue
      }

      const fieldValues = signer.fieldValues || {}
      const signatureImage = signer.signatureImage
      const fieldPositions = signer.fieldPositions || {}
      const signatureScales = signer.signatureScales || {}
      const signerFormatting = signer.fieldFormatting || {}

      const pageNum = field.page || field.pageNumber || 1
      const pageIndex = pageNum - 1
      if (pageIndex < 0 || pageIndex >= pages.length) continue

      const page = pages[pageIndex]
      const { width: pageW, height: pageH } = page.getSize()

      // Check if signer has custom position for this field (resized by signer)
      const customPos = fieldPositions[field.id]

      // Use percentage-based coordinates for accurate positioning
      let xPct: number, yPct: number, wPct: number, hPct: number

      if (customPos) {
        if (customPos.xPct !== undefined && customPos.yPct !== undefined) {
          xPct = customPos.xPct
          yPct = customPos.yPct
          wPct = customPos.wPct
          hPct = customPos.hPct
        } else if (field.pageBaseWidth && field.pageBaseHeight) {
          xPct = customPos.x / field.pageBaseWidth
          yPct = customPos.y / field.pageBaseHeight
          wPct = customPos.width / field.pageBaseWidth
          hPct = customPos.height / field.pageBaseHeight
        } else {
          xPct = customPos.x / pageW
          yPct = customPos.y / pageH
          wPct = customPos.width / pageW
          hPct = customPos.height / pageH
        }
      } else if (field.xPercent !== undefined && field.yPercent !== undefined &&
          field.widthPercent !== undefined && field.heightPercent !== undefined) {
        xPct = field.xPercent
        yPct = field.yPercent
        wPct = field.widthPercent
        hPct = field.heightPercent
      } else if (field.pageBaseWidth && field.pageBaseHeight) {
        xPct = field.x / field.pageBaseWidth
        yPct = field.y / field.pageBaseHeight
        wPct = field.width / field.pageBaseWidth
        hPct = field.height / field.pageBaseHeight
      } else {
        xPct = field.x / pageW
        yPct = field.y / pageH
        wPct = field.width / pageW
        hPct = field.height / pageH
      }

      // Convert percentage coordinates to PDF points
      const pdfX = xPct * pageW
      const pdfWidth = wPct * pageW
      const pdfHeight = hPct * pageH
      // Y-axis inversion: UI top-down (yPct from top) -> PDF bottom-up
      const pdfY = pageH - ((yPct + hPct) * pageH)

      const fieldType = field.type
      const value = fieldValues[field.id]

      console.log('📄 Field:', field.id, 'type:', fieldType, 'value:', value ? 'YES' : 'NO',
        'pct:', { xPct: xPct.toFixed(4), yPct: yPct.toFixed(4), wPct: wPct.toFixed(4), hPct: hPct.toFixed(4) },
        'coords:', { x: pdfX.toFixed(1), y: pdfY.toFixed(1), w: pdfWidth.toFixed(1), h: pdfHeight.toFixed(1) })

      try {
        // For signature/initials: use per-field value first (if it's an image), then signatureImage
        if (fieldType === 'signature' || fieldType === 'initials') {
          // Priority: per-field image value > shared signatureImage
          const perFieldImage = value && typeof value === 'string' && value.startsWith('data:image') ? value : null
          const sigImageSrc = perFieldImage || signatureImage || null

          if (sigImageSrc) {
            const sigScale = signatureScales[field.id] || field.signatureScale || 1
            const scaledW = pdfWidth * sigScale
            const scaledH = pdfHeight * sigScale
            const scaledX = pdfX + (pdfWidth - scaledW) / 2
            const scaledY = pdfY + (pdfHeight - scaledH) / 2
            await embedImageIntoPdf(pdfDoc, page, sigImageSrc, { x: scaledX, y: scaledY, width: scaledW, height: scaledH })
          }
        } else if (fieldType === 'checkbox' && value === 'checked') {
          page.drawRectangle({
            x: pdfX, y: pdfY, width: pdfWidth, height: pdfHeight,
            color: rgb(0.133, 0.773, 0.369),
          })
          const cx = pdfX + pdfWidth / 2, cy = pdfY + pdfHeight / 2
          const sz = Math.min(pdfWidth, pdfHeight) * 0.6
          page.drawLine({ start: { x: cx - sz * 0.4, y: cy }, end: { x: cx - sz * 0.1, y: cy - sz * 0.3 }, thickness: 2, color: rgb(1, 1, 1) })
          page.drawLine({ start: { x: cx - sz * 0.1, y: cy - sz * 0.3 }, end: { x: cx + sz * 0.4, y: cy + sz * 0.3 }, thickness: 2, color: rgb(1, 1, 1) })
        } else if (fieldType === 'stamp' && value) {
          if (value.startsWith('data:image')) {
            // Image stamp - render as image exactly as uploaded (tilted, any shape)
            await embedImageIntoPdf(pdfDoc, page, value, { x: pdfX, y: pdfY, width: pdfWidth, height: pdfHeight })
          } else {
            // Text stamp (APPROVED, PAID, etc.) - render with rotation and red border like preview
            drawTextStamp(page, value, { x: pdfX, y: pdfY, width: pdfWidth, height: pdfHeight })
          }
        } else if (fieldType === 'strikethrough' && value) {
          const lineY = pdfY + pdfHeight / 2
          const color = value.startsWith('#') ? hexToRgb(value) : rgb(0.863, 0.149, 0.149)
          page.drawLine({
            start: { x: pdfX, y: lineY }, end: { x: pdfX + pdfWidth, y: lineY },
            thickness: 3, color,
          })
        } else if (value && fieldType !== 'checkbox') {
          // If value is a base64 image, embed as image
          if (typeof value === 'string' && value.startsWith('data:image')) {
            await embedImageIntoPdf(pdfDoc, page, value, { x: pdfX, y: pdfY, width: pdfWidth, height: pdfHeight })
          } else {
            let displayValue = value
            if (fieldType === 'date') {
              try { displayValue = new Date(value).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) } catch { displayValue = value }
            }
            const customFmt = signerFormatting[field.id]
            const baseFontSize = customFmt?.fontSize || field.fontSize || 14
            const fontSize = Math.min(baseFontSize, pdfHeight * 0.8)
            page.drawText(displayValue, {
              x: pdfX + 4, y: pdfY + (pdfHeight - fontSize) / 2 + fontSize * 0.28,
              size: fontSize, color: rgb(0, 0, 0), maxWidth: pdfWidth - 8,
            })
          }
        }
      } catch (fieldError) {
        console.error(`Error embedding field ${field.id}:`, fieldError)
      }
    }

    // Save final PDF
    const finalPdfBytes = await pdfDoc.save()

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

// Draw a text stamp with red border and -12 degree rotation (matches CSS transform -rotate-12)
function drawTextStamp(
  page: PDFPage, text: string,
  coords: { x: number; y: number; width: number; height: number }
) {
  const stampColor = rgb(0.863, 0.149, 0.149) // Red (#DC2626)
  const rotationAngle = -12 // Match CSS -rotate-12

  // Center of the stamp box
  const cx = coords.x + coords.width / 2
  const cy = coords.y + coords.height / 2

  // Calculate font size to fit within the box (with padding)
  const maxTextWidth = coords.width * 0.85
  const maxTextHeight = coords.height * 0.6
  const charWidth = 0.6
  const estimatedFontSize = Math.min(
    maxTextWidth / (text.length * charWidth),
    maxTextHeight
  )
  const fontSize = Math.max(6, Math.min(estimatedFontSize, 24))

  // Draw rotated red border rectangle
  const borderPadX = coords.width * 0.1
  const borderPadY = coords.height * 0.15
  const borderW = coords.width - borderPadX * 2
  const borderH = coords.height - borderPadY * 2

  // pdf-lib drawRectangle with rotate: the x,y is bottom-left of the unrotated rectangle,
  // but rotation happens around x,y. We want rotation around center.
  // So we position the rectangle at its center and use the rotate option.
  page.drawRectangle({
    x: cx - borderW / 2,
    y: cy - borderH / 2,
    width: borderW,
    height: borderH,
    borderColor: stampColor,
    borderWidth: 2,
    rotate: degrees(rotationAngle),
  })

  // Draw the rotated text centered in the box
  const textWidth = text.length * fontSize * charWidth
  const textX = cx - textWidth / 2
  const textY = cy - fontSize / 3

  page.drawText(text, {
    x: textX,
    y: textY,
    size: fontSize,
    color: stampColor,
    rotate: degrees(rotationAngle),
  })
}

async function embedImageIntoPdf(
  pdfDoc: PDFDocument, page: PDFPage, imageDataUrl: string,
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

  // Preserve aspect ratio - fit image within the box
  const imgAspect = image.width / image.height
  const boxAspect = coords.width / coords.height
  let drawW, drawH, drawX, drawY

  if (imgAspect > boxAspect) {
    drawW = coords.width; drawH = coords.width / imgAspect
    drawX = coords.x; drawY = coords.y + (coords.height - drawH) / 2
  } else {
    drawH = coords.height; drawW = coords.height * imgAspect
    drawX = coords.x + (coords.width - drawW) / 2; drawY = coords.y
  }

  page.drawImage(image, { x: drawX, y: drawY, width: drawW, height: drawH })
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return rgb(parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255)
  }
  return rgb(0.863, 0.149, 0.149)
}
