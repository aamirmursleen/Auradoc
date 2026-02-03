# Critical Flows & Invariants

> These are the behaviors that MUST NOT break during any improvement work.

---

## 1. E-Sign Flow (End-to-End)

**Route:** `/sign-document`

**Steps:**
1. User uploads PDF/PNG/JPG document
2. PDFViewer renders document with zoom controls
3. User adds signers (name, email, color) via signer panel
4. User drags fields onto document pages (signature, initials, text, date, email, name, checkbox, stamp)
5. Fields positioned using percentage-based coordinates (`xPercent`, `yPercent`, `widthPercent`, `heightPercent`)
6. User fills field values (draw/type/upload signature, type text, check boxes)
7. Preview generates PDF via `pdf-generator.ts` → `generateFinalPdf()`
8. Send triggers `/api/signing-requests` POST → creates DB record → sends email via Resend
9. Recipient opens `/s/[token]` → resolves via `/api/signing-requests/by-token/[token]` → redirects to `/sign/[id]`
10. Signer completes fields → POST `/api/signing-requests/[id]/sign` → updates status → triggers next signer or completion email
11. Download via GET `/api/signing-requests/[id]/download` → embeds signatures into PDF with pdf-lib

**Invariants:**
- Field coordinates must be percentage-based (0-1 range) and survive zoom/device changes
- Y-axis inversion formula: `pdfY = pageH - ((yPct + hPct) * pageH)`
- Signature images must be aspect-ratio preserved within field bounds
- Text fields use 6pt left padding, fontSize * 0.22 baseline offset
- Multi-signer sequential flow: signer N must complete before signer N+1 gets email
- Audit trail events (created/delivered/opened/signed/completed) must be recorded
- Download route must handle: base64 data URLs, HTTP URLs, and raw base64 document sources

**Verify manually:** Upload PDF → add 2 signers → place signature + text + date fields → send → sign as each signer → download → check field positions match preview

---

## 2. PDF Tools (3 Representative Tools)

### 2a. PDF Merge (`/tools/pdf-merge`)

**Steps:**
1. User uploads 2+ PDF files via drag-drop
2. Files shown in reorderable list (drag to reorder)
3. Click "Merge" → uses pdf-lib to copy pages from each PDF into new document
4. Result offered as download

**Invariants:**
- Page order must match user's arranged order
- All pages from all source PDFs must be included
- Output is valid PDF openable in any viewer
- Processing is client-side (no server upload)

### 2b. PDF Compressor (`/tools/pdf-compressor`)

**Steps:**
1. User uploads single PDF
2. Compression runs client-side
3. Before/after file size displayed
4. Compressed PDF offered as download

**Invariants:**
- Output must be valid, openable PDF
- File size must be <= original size
- Visual quality must remain acceptable
- Processing is client-side

### 2c. PDF to Word (`/tools/pdf-to-word`)

**Steps:**
1. User uploads PDF
2. Text extracted via pdfjs-dist
3. DOCX generated via `docx` library
4. Result downloaded as .docx

**Invariants:**
- Text content from PDF must appear in DOCX output
- Output must be valid .docx openable in Word/LibreOffice
- Processing is client-side

---

## 3. Invoice Generator (`/create-invoice`)

**Route:** `/create-invoice`

**Steps:**
1. User fills business info (name, email, address, logo)
2. User fills client info
3. User adds line items (description, quantity, rate)
4. Tax percentage applied
5. Totals calculated: subtotal, tax amount, total
6. PDF generated and downloadable
7. Optional: email invoice to client

**Invariants (Golden Examples):**
- Line item total = quantity * rate
- Subtotal = sum of all line item totals
- Tax amount = subtotal * (taxPercent / 100)
- Total = subtotal + tax amount
- Currency formatting must be consistent
- Tax label shows "Tax %" (was "DPH%")
- PDF output must contain all entered data accurately

**Golden test case:**
```
Item 1: qty=2, rate=100 → total=200
Item 2: qty=1, rate=50 → total=50
Subtotal: 250
Tax (10%): 25
Total: 275
```

---

## 4. Resume Templates (`/resume-templates`)

**Steps:**
1. User browses templates by category (popular/simple/modern/creative)
2. User selects template → navigates to `/resume-templates/[templateId]`
3. User fills in personal info, experience, education, skills
4. Live preview updates in real-time
5. User downloads as PDF

**Invariants:**
- All entered data must appear in downloaded PDF
- Template styling must match preview
- PDF must be valid and openable
- No data loss between preview and download

---

## 5. Verify PDF (`/verify`)

**Steps:**
1. User uploads PDF
2. Analysis runs via `pdf-analysis.ts` → `analyzePDF()`
3. Results display: overall status, modifications list, metadata, structure info

**Invariants:**
- Must extract metadata via pdfjs-dist (handles compressed streams)
- Falls back to regex extraction for uncompressed PDFs
- Must detect: incremental updates (%%EOF count), editing software signatures, annotations, form fields, digital signatures, XMP metadata
- Status determination: CRITICAL → DEFINITELY_MODIFIED, 2+ HIGH → DEFINITELY_MODIFIED, 1 HIGH or 2+ MEDIUM → LIKELY_MODIFIED

---

## 6. API Endpoints (Key Contracts)

| Endpoint | Method | Input | Output | Auth |
|----------|--------|-------|--------|------|
| `/api/signing-requests` | POST | `{document_name, document_url, signers, signature_fields}` | `{success, signingRequest}` | Optional Clerk |
| `/api/signing-requests/[id]/sign` | POST | `{signerEmail, signatureImage, fieldValues}` | `{success, message}` | Public (token-based) |
| `/api/signing-requests/[id]/download` | GET | URL param `id` | PDF binary (application/pdf) | Public |
| `/api/signing-requests/by-token/[token]` | GET | URL param `token` | `{signingRequest, signerEmail, signerOrder}` | Public |
| `/api/upload-url` | POST | `{fileName, fileType}` | `{uploadUrl, publicUrl}` | Public |

---

## 7. Routes That Must Not 404

All 34 page routes and 22 API routes listed in the codebase map must remain accessible. Key public routes:
- `/`, `/sign-document`, `/create-invoice`, `/verify`, `/tools/*`, `/templates/*`, `/resume-templates/*`
- `/sign/[id]`, `/s/[token]` (signing links sent via email)
- `/pricing`, `/about`, `/contact`, `/features`, `/faq`
- `/sign-in`, `/sign-up` (Clerk auth)
