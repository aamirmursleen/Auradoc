import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { PDFDocument, rgb } from 'pdf-lib'

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

    // Build map: signerOrder -> signer data (including fieldValues and signatureImage)
    const signerByOrder: Record<number, any> = {}
    for (const signer of signers) {
      signerByOrder[signer.order] = signer
      console.log('📄 Signer:', signer.email, 'order:', signer.order, 'status:', signer.status,
        'hasFieldValues:', !!signer.fieldValues, 'hasSignature:', !!signer.signatureImage)
    }

    // Embed each field into the PDF
    for (const field of signatureFields) {
      const signer = signerByOrder[field.signerOrder]
      if (!signer || signer.status !== 'signed') {
        console.log('📄 Skip field', field.id, '- signer not signed')
        continue
      }

      const fieldValues = signer.fieldValues || {}
      const signatureImage = signer.signatureImage

      const pageNum = field.page || field.pageNumber || 1
      const pageIndex = pageNum - 1
      if (pageIndex < 0 || pageIndex >= pages.length) continue

      const page = pages[pageIndex]
      const { width: pageW, height: pageH } = page.getSize()

      // Field coords are stored in pixel space at scale=1
      // which maps directly to PDF points for standard rendering
      const pdfX = field.x
      const pdfWidth = field.width
      const pdfHeight = field.height
      // Y-axis inversion: UI top-down -> PDF bottom-up
      const pdfY = pageH - field.y - field.height

      const fieldType = field.type
      const value = fieldValues[field.id]

      console.log('📄 Field:', field.id, 'type:', fieldType, 'value:', value ? 'YES' : 'NO',
        'coords:', { x: pdfX, y: pdfY, w: pdfWidth, h: pdfHeight })

      try {
        if ((fieldType === 'signature' || fieldType === 'initials') && signatureImage) {
          await embedImageIntoPdf(pdfDoc, page, signatureImage, { x: pdfX, y: pdfY, width: pdfWidth, height: pdfHeight })
        } else if (fieldType === 'checkbox' && value === 'checked') {
          page.drawRectangle({
            x: pdfX, y: pdfY, width: pdfWidth, height: pdfHeight,
            color: rgb(0.086, 0.639, 0.290),
          })
          const cx = pdfX + pdfWidth / 2, cy = pdfY + pdfHeight / 2
          const sz = Math.min(pdfWidth, pdfHeight) * 0.6
          page.drawLine({ start: { x: cx - sz * 0.4, y: cy }, end: { x: cx - sz * 0.1, y: cy - sz * 0.3 }, thickness: 2, color: rgb(1, 1, 1) })
          page.drawLine({ start: { x: cx - sz * 0.1, y: cy - sz * 0.3 }, end: { x: cx + sz * 0.4, y: cy + sz * 0.3 }, thickness: 2, color: rgb(1, 1, 1) })
        } else if (fieldType === 'stamp' && value) {
          if (value.startsWith('data:image')) {
            await embedImageIntoPdf(pdfDoc, page, value, { x: pdfX, y: pdfY, width: pdfWidth, height: pdfHeight })
          } else {
            const fontSize = Math.min(pdfHeight * 0.5, 16)
            page.drawText(value, {
              x: pdfX + 4, y: pdfY + (pdfHeight - fontSize) / 2,
              size: fontSize, color: rgb(0.863, 0.149, 0.149),
            })
          }
        } else if (fieldType === 'strikethrough' && value) {
          const lineY = pdfY + pdfHeight / 2
          const color = value.startsWith('#') ? hexToRgb(value) : rgb(0.863, 0.149, 0.149)
          page.drawLine({
            start: { x: pdfX, y: lineY }, end: { x: pdfX + pdfWidth, y: lineY },
            thickness: 3, color,
          })
        } else if (value && fieldType !== 'checkbox') {
          let displayValue = value
          if (fieldType === 'date') {
            try { displayValue = new Date(value).toLocaleDateString() } catch { displayValue = value }
          }
          const fontSize = Math.min(field.fontSize || 14, pdfHeight * 0.7)
          page.drawText(displayValue, {
            x: pdfX + 4, y: pdfY + (pdfHeight - fontSize) / 2,
            size: fontSize, color: rgb(0, 0, 0), maxWidth: pdfWidth - 8,
          })
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

async function embedImageIntoPdf(
  pdfDoc: PDFDocument, page: any, imageDataUrl: string,
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
