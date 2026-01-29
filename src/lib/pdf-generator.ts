/**
 * PDF Generator Utility - DocuSign-like Signature Embedding
 *
 * This module handles proper coordinate transformation for embedding signatures
 * into PDFs with pixel-perfect accuracy across all zoom levels and devices.
 *
 * COORDINATE SYSTEM:
 * - UI coordinates: Origin at TOP-LEFT, measured in normalized percentages (0-1)
 * - PDF coordinates: Origin at BOTTOM-LEFT, measured in points (1/72 inch)
 *
 * The critical Y-axis inversion formula:
 *   yPt = pageHeightPt - ((yPct + hPct) * pageHeightPt)
 *
 * This ensures signatures appear at the EXACT position where they were placed
 * in the UI, regardless of zoom level, device, or PDF viewer.
 */

import { PDFDocument, PDFPage, rgb } from 'pdf-lib'

/**
 * Field data with normalized coordinates (0-1 range, top-left origin)
 */
export interface SignatureField {
  id: string
  type: 'signature' | 'initials' | 'text' | 'date' | 'checkbox' | 'stamp' | string
  pageNumber: number // 1-based page number

  // Normalized coordinates (0-1 range, relative to page dimensions)
  // Origin is TOP-LEFT of the page (UI coordinate system)
  xPct: number
  yPct: number
  wPct: number
  hPct: number

  // The actual value to embed
  value?: string // For signature/initials: data URL; for text: string value

  // Optional styling
  fontSize?: number
}

/**
 * Result from generateFinalPdf
 */
export interface GeneratedPdfResult {
  pdfBytes: Uint8Array
  pdfDataUrl: string
}

/**
 * Convert a data URL to Uint8Array bytes
 */
function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1]
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

/**
 * Convert normalized UI coordinates to PDF points with Y-axis inversion
 *
 * @param xPct - X position as percentage (0-1), from left edge
 * @param yPct - Y position as percentage (0-1), from TOP edge (UI origin)
 * @param wPct - Width as percentage (0-1)
 * @param hPct - Height as percentage (0-1)
 * @param pageWidthPt - PDF page width in points
 * @param pageHeightPt - PDF page height in points
 * @returns PDF coordinates with origin at BOTTOM-LEFT
 */
export function normalizedToPdfCoords(
  xPct: number,
  yPct: number,
  wPct: number,
  hPct: number,
  pageWidthPt: number,
  pageHeightPt: number
): { x: number; y: number; width: number; height: number } {
  const x = xPct * pageWidthPt
  const width = wPct * pageWidthPt
  const height = hPct * pageHeightPt

  // CRITICAL: Y-axis inversion from top-left to bottom-left origin
  // yPct is measured from TOP, but PDF y is measured from BOTTOM
  // The field's TOP-LEFT corner in UI = field's BOTTOM-LEFT corner in PDF adjusted
  const y = pageHeightPt - ((yPct + hPct) * pageHeightPt)

  return { x, y, width, height }
}

/**
 * Generate the final PDF with all signatures embedded using pdf-lib
 *
 * This function directly modifies the PDF to embed signatures at the correct
 * positions, maintaining vector quality and ensuring consistent rendering
 * across all PDF viewers (Adobe Reader, browsers, mobile apps).
 *
 * @param originalPdfBytes - The original PDF file as Uint8Array or ArrayBuffer
 * @param fields - Array of fields with normalized coordinates and values
 * @returns The final PDF bytes and data URL
 */
export async function generateFinalPdf(
  originalPdfBytes: Uint8Array | ArrayBuffer,
  fields: SignatureField[]
): Promise<GeneratedPdfResult> {
  // Load the original PDF
  const pdfDoc = await PDFDocument.load(originalPdfBytes, {
    ignoreEncryption: true,
  })

  const pages = pdfDoc.getPages()

  // Group fields by page
  const fieldsByPage = new Map<number, SignatureField[]>()
  for (const field of fields) {
    if (!field.value) continue // Skip fields without values

    const pageFields = fieldsByPage.get(field.pageNumber) || []
    pageFields.push(field)
    fieldsByPage.set(field.pageNumber, pageFields)
  }

  // Process each page
  for (const [pageNum, pageFields] of fieldsByPage) {
    const pageIndex = pageNum - 1 // Convert to 0-based index
    if (pageIndex < 0 || pageIndex >= pages.length) continue

    const page = pages[pageIndex]
    const { width: pageWidthPt, height: pageHeightPt } = page.getSize()

    console.log(`pdf-generator: Page ${pageNum} actual PDF size: ${pageWidthPt}pt x ${pageHeightPt}pt`)

    for (const field of pageFields) {
      console.log(`pdf-generator: Field ${field.id} (${field.type}) input:`, {
        xPct: field.xPct,
        yPct: field.yPct,
        wPct: field.wPct,
        hPct: field.hPct,
        // Show what position this represents visually
        visualTopFromTop: `${(field.yPct * 100).toFixed(1)}%`,
        visualLeftFromLeft: `${(field.xPct * 100).toFixed(1)}%`
      })

      // IMPORTANT: Use percentages to calculate positions relative to ACTUAL PDF dimensions
      // This ensures the visual position in PDF matches the visual position in UI
      const x = field.xPct * pageWidthPt
      const width = field.wPct * pageWidthPt
      const height = field.hPct * pageHeightPt

      // Y-axis inversion: convert from top-origin to bottom-origin
      // field.yPct = distance from TOP as percentage
      // We need: distance from BOTTOM for the field's BOTTOM edge
      // Field bottom from top = (yPct + hPct) * pageHeight
      // Field bottom from bottom = pageHeight - (yPct + hPct) * pageHeight
      const y = pageHeightPt - ((field.yPct + field.hPct) * pageHeightPt)

      const pdfCoords = { x, y, width, height }

      console.log(`pdf-generator: Field ${field.id} PDF coords:`, {
        x: pdfCoords.x.toFixed(1),
        y: pdfCoords.y.toFixed(1),
        width: pdfCoords.width.toFixed(1),
        height: pdfCoords.height.toFixed(1),
        // Verify: top edge should match yPct from top
        calculatedTopFromBottom: (pdfCoords.y + pdfCoords.height).toFixed(1),
        expectedTopFromBottom: (pageHeightPt * (1 - field.yPct)).toFixed(1)
      })

      if (field.type === 'signature' || field.type === 'initials' ||
          (field.type === 'stamp' && field.value?.startsWith('data:image'))) {
        // Embed image (signature, initials, or image stamp)
        await embedImage(pdfDoc, page, field.value!, pdfCoords)
      } else if (field.type === 'checkbox') {
        // Draw checkbox
        if (field.value === 'checked') {
          drawCheckbox(page, pdfCoords)
        }
      } else if (field.type === 'stamp' && field.value && !field.value.startsWith('data:image')) {
        // Text stamp
        drawTextStamp(page, field.value, pdfCoords)
      } else {
        // Text field (text, date, name, email, etc.)
        if (field.value) {
          drawText(page, field.value, pdfCoords, field.fontSize || 12)
        }
      }
    }
  }

  // Save the modified PDF
  const pdfBytes = await pdfDoc.save()

  // Create data URL for preview
  const base64 = btoa(String.fromCharCode(...pdfBytes))
  const pdfDataUrl = `data:application/pdf;base64,${base64}`

  return { pdfBytes, pdfDataUrl }
}

/**
 * Embed an image (signature/initials) into the PDF page
 */
async function embedImage(
  pdfDoc: PDFDocument,
  page: PDFPage,
  imageDataUrl: string,
  coords: { x: number; y: number; width: number; height: number }
): Promise<void> {
  try {
    const imageBytes = dataUrlToBytes(imageDataUrl)

    // Determine image type and embed accordingly
    let image
    if (imageDataUrl.includes('image/png')) {
      image = await pdfDoc.embedPng(imageBytes)
    } else if (imageDataUrl.includes('image/jpeg') || imageDataUrl.includes('image/jpg')) {
      image = await pdfDoc.embedJpg(imageBytes)
    } else {
      // Try PNG first, fall back to JPG
      try {
        image = await pdfDoc.embedPng(imageBytes)
      } catch {
        image = await pdfDoc.embedJpg(imageBytes)
      }
    }

    // Calculate dimensions to fit inside the field box while maintaining aspect ratio
    const imageAspect = image.width / image.height
    const boxAspect = coords.width / coords.height

    let drawWidth: number
    let drawHeight: number
    let drawX: number
    let drawY: number

    if (imageAspect > boxAspect) {
      // Image is wider than box - fit to width
      drawWidth = coords.width
      drawHeight = coords.width / imageAspect
      drawX = coords.x
      drawY = coords.y + (coords.height - drawHeight) / 2 // Center vertically
    } else {
      // Image is taller than box - fit to height
      drawHeight = coords.height
      drawWidth = coords.height * imageAspect
      drawX = coords.x + (coords.width - drawWidth) / 2 // Center horizontally
      drawY = coords.y
    }

    page.drawImage(image, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    })
  } catch (error) {
    console.error('Error embedding image:', error)
    // Draw a placeholder rectangle on error
    page.drawRectangle({
      x: coords.x,
      y: coords.y,
      width: coords.width,
      height: coords.height,
      borderColor: rgb(1, 0, 0),
      borderWidth: 1,
    })
  }
}

/**
 * Draw a checked checkbox
 */
function drawCheckbox(
  page: PDFPage,
  coords: { x: number; y: number; width: number; height: number }
): void {
  // Draw green background
  page.drawRectangle({
    x: coords.x,
    y: coords.y,
    width: coords.width,
    height: coords.height,
    color: rgb(0.086, 0.639, 0.290), // #16a34a
  })

  // Draw checkmark
  const centerX = coords.x + coords.width / 2
  const centerY = coords.y + coords.height / 2
  const size = Math.min(coords.width, coords.height) * 0.6

  // Simple checkmark using lines
  page.drawLine({
    start: { x: centerX - size * 0.4, y: centerY },
    end: { x: centerX - size * 0.1, y: centerY - size * 0.3 },
    thickness: 2,
    color: rgb(1, 1, 1),
  })
  page.drawLine({
    start: { x: centerX - size * 0.1, y: centerY - size * 0.3 },
    end: { x: centerX + size * 0.4, y: centerY + size * 0.3 },
    thickness: 2,
    color: rgb(1, 1, 1),
  })
}

/**
 * Draw a text stamp (rotated)
 */
function drawTextStamp(
  page: PDFPage,
  text: string,
  coords: { x: number; y: number; width: number; height: number }
): void {
  const fontSize = Math.min(coords.height * 0.5, 16)
  const centerX = coords.x + coords.width / 2
  const centerY = coords.y + coords.height / 2

  // Note: pdf-lib doesn't support rotation for text easily,
  // so we draw it normally for now. For proper rotation,
  // you'd need to use a graphics state transformation.
  page.drawText(text, {
    x: centerX - (text.length * fontSize * 0.3),
    y: centerY - fontSize / 2,
    size: fontSize,
    color: rgb(0.863, 0.149, 0.149), // #dc2626
  })
}

/**
 * Draw text field value
 */
function drawText(
  page: PDFPage,
  text: string,
  coords: { x: number; y: number; width: number; height: number },
  fontSize: number
): void {
  // Adjust font size to fit height
  const adjustedFontSize = Math.min(fontSize, coords.height * 0.8)

  page.drawText(text, {
    x: coords.x + 4, // Small padding from left
    y: coords.y + (coords.height - adjustedFontSize) / 2, // Center vertically
    size: adjustedFontSize,
    color: rgb(0, 0, 0),
    maxWidth: coords.width - 8,
  })
}

/**
 * Get the native PDF page dimensions in points for all pages
 * This is used by the UI to store coordinates correctly
 */
export async function getPdfPageDimensions(
  pdfBytes: Uint8Array | ArrayBuffer
): Promise<Array<{ pageNumber: number; widthPt: number; heightPt: number }>> {
  const pdfDoc = await PDFDocument.load(pdfBytes, {
    ignoreEncryption: true,
  })

  const pages = pdfDoc.getPages()
  return pages.map((page, index) => {
    const { width, height } = page.getSize()
    return {
      pageNumber: index + 1,
      widthPt: width,
      heightPt: height,
    }
  })
}

/**
 * Convert PlacedField format to SignatureField format
 * This is a helper for the sign-document page
 */
export interface PlacedFieldInput {
  id: string
  type: string
  page: number
  xPercent?: number
  yPercent?: number
  widthPercent?: number
  heightPercent?: number
  x?: number
  y?: number
  width?: number
  height?: number
  pageBaseWidth?: number
  pageBaseHeight?: number
  value?: string
  fontSize?: number
}

export function convertPlacedFieldToSignatureField(
  field: PlacedFieldInput
): SignatureField | null {
  // Use stored percentages if available
  let xPct: number
  let yPct: number
  let wPct: number
  let hPct: number

  if (field.xPercent !== undefined && field.yPercent !== undefined &&
      field.widthPercent !== undefined && field.heightPercent !== undefined) {
    xPct = field.xPercent
    yPct = field.yPercent
    wPct = field.widthPercent
    hPct = field.heightPercent
    console.log(`convertPlacedFieldToSignatureField: Using stored percentages for field ${field.id}`)
  } else if (field.pageBaseWidth && field.pageBaseHeight) {
    // Calculate from pixel values and stored page dimensions
    xPct = (field.x || 0) / field.pageBaseWidth
    yPct = (field.y || 0) / field.pageBaseHeight
    wPct = (field.width || 0) / field.pageBaseWidth
    hPct = (field.height || 0) / field.pageBaseHeight
    console.log(`convertPlacedFieldToSignatureField: Calculated percentages for field ${field.id}`, {
      x: field.x,
      y: field.y,
      width: field.width,
      height: field.height,
      pageBaseWidth: field.pageBaseWidth,
      pageBaseHeight: field.pageBaseHeight,
      xPct,
      yPct,
      wPct,
      hPct
    })
  } else {
    console.warn('Field missing coordinate data:', field.id)
    return null
  }

  console.log(`convertPlacedFieldToSignatureField: Result for field ${field.id}:`, {
    xPct,
    yPct,
    wPct,
    hPct
  })

  return {
    id: field.id,
    type: field.type as SignatureField['type'],
    pageNumber: field.page,
    xPct,
    yPct,
    wPct,
    hPct,
    value: field.value,
    fontSize: field.fontSize,
  }
}
