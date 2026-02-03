# Baseline Metrics

> Captured before any "100x" improvements. Date: 2026-02-03

---

## 1. Build Output Summary

**Next.js 14.2.25 Production Build**

### Shared JS (loaded on every page)
| Chunk | Size |
|-------|------|
| `fd9d1056` (framework) | 53.6 kB |
| `2117` (shared) | 31.9 kB |
| Other shared chunks | 2.44 kB |
| **Total Shared** | **88 kB** |

### Page Sizes (First Load JS)

**Heaviest pages (>200 kB First Load):**

| Page | Page JS | First Load JS | Issue |
|------|---------|---------------|-------|
| `/tools/watermark-pdf` | 11 kB | **378 kB** | pdf-lib + jspdf bundle |
| `/tools/word-to-pdf` | 125 kB | **357 kB** | mammoth + jspdf (125 kB page JS!) |
| `/resume-templates` | 3.81 kB | **323 kB** | 80KB+ resume-templates data |
| `/resume-templates/[id]` | 2.97 kB | **322 kB** | Same data bundle |
| `/sign-document` | 29 kB | **322 kB** | pdf-lib + pdfjs + signature libs |
| `/templates/[cat]/[id]` | 6.58 kB | **320 kB** | 200KB+ templates data |
| `/templates/[category]` | 4.81 kB | **315 kB** | Same templates data |
| `/templates` | 7.77 kB | **312 kB** | Same templates data |
| `/create-invoice` | 14 kB | **306 kB** | jspdf + html2canvas |
| `/tools/image-to-pdf` | 3.73 kB | **276 kB** | pdf-lib bundle |
| `/tools/pdf-compressor` | 3.65 kB | **276 kB** | pdf-lib bundle |
| `/tools/pdf-merge` | 3.84 kB | **276 kB** | pdf-lib bundle |
| `/tools/pdf-split` | 4.54 kB | **277 kB** | pdf-lib bundle |
| `/documents/[id]/edit` | 24.9 kB | **237 kB** | react-dnd + editor |
| `/verify` | 14.1 kB | **206 kB** | pdfjs-dist |
| `/tools/pdf-to-word` | 96.9 kB | **201 kB** | pdfjs-dist + docx (97 kB page JS!) |
| `/sign/[id]` | 14.9 kB | **200 kB** | signing UI + pdf-lib |
| `/documents` | 54.3 kB | **188 kB** | dashboard (54 kB page JS) |

**Lighter pages (<150 kB First Load):**

| Page | First Load JS |
|------|---------------|
| `/` (homepage) | 166 kB |
| `/sign` | 137 kB |
| `/sign-in`, `/sign-up` | 131 kB |
| `/about`, `/contact`, `/careers`, etc. | ~101-103 kB |
| `/s/[token]` | 89.5 kB |

### Static Assets

| File | Size | Issue |
|------|------|-------|
| `hero-features.png` | **5.4 MB** | Unoptimized PNG, no WebP/AVIF |
| `mamasign-logo.png` | **4.7 MB** | Massively oversized logo |
| `mamasign-logo-full.png` | **4.7 MB** | Duplicate of above |
| `logo.png` | 102 KB | Acceptable |
| **Total public/** | **~15 MB** | Should be <500 KB |

### Middleware
- Size: 74.6 kB (Clerk middleware)

---

## 2. Core Web Vitals Proxy (Estimated from Build)

> Note: Without running Lighthouse in a browser, these are estimates based on bundle analysis.

### Homepage (`/`)
- **First Load JS**: 166 kB
- **Estimated LCP**: Poor (5.4 MB hero image unoptimized)
- **Estimated INP**: Moderate (multiple scroll listeners, floating element state updates)
- **Estimated CLS**: Poor (no image dimensions set, floating elements appear after scroll)

### `/tools/pdf-merge` (representative tool page)
- **First Load JS**: 276 kB
- **Estimated LCP**: Moderate (no large images, but heavy JS)
- **Estimated INP**: Good (simple interaction model)
- **Estimated CLS**: Good (upload-based UI, minimal layout shift)

### `/sign-document`
- **First Load JS**: 322 kB
- **Estimated LCP**: Poor (heavy JS blocks rendering)
- **Estimated INP**: Moderate (drag-drop + canvas interactions)
- **Estimated CLS**: Moderate (PDF viewer loads asynchronously)

### `/create-invoice`
- **First Load JS**: 306 kB
- **Estimated LCP**: Moderate
- **Estimated INP**: Good (form-based)
- **Estimated CLS**: Good (static form layout)

### `/pricing`
- **First Load JS**: 102 kB
- **Estimated LCP**: Good (lightweight page)
- **Estimated INP**: Good
- **Estimated CLS**: Moderate (floating deal popups)

---

## 3. Accessibility Summary

### Issues Found (Manual Scan)

| Category | Count | Severity |
|----------|-------|----------|
| Missing alt text on images | 5+ | High |
| Missing ARIA labels on interactive elements | 5+ | High |
| Color contrast concerns (lime on white in dark mode) | 3+ | Medium |
| Missing form labels | 2+ | Medium |
| Small tap targets (<44px) on dismiss buttons | 2+ | Medium |
| Heading hierarchy jumps | Multiple | Medium |
| Emoji used as meaningful content without alternatives | 3+ | Low |
| Missing visible focus indicators on custom buttons | Multiple | Low |

### Keyboard Navigation
- Header navigation: Functional but no skip-link
- Floating elements: Dismissible but focus not trapped/managed
- PDF tools: Upload areas not keyboard-accessible (drag-drop only)
- Form fields: Standard HTML inputs, generally accessible

---

## 4. SEO Summary

### Implemented
- Meta title/description on root layout
- Open Graph tags (og:title, og:description, og:image)
- Twitter card tags
- JSON-LD Organization + WebApplication schema
- robots.txt (blocks /api/, /dashboard/, /admin/)
- sitemap.xml with 26 URLs
- Canonical URL set to mamasign.com

### Missing/Issues
- Per-page meta titles/descriptions (most pages use template default)
- Tool pages lack FAQ structured data
- No breadcrumb structured data
- Blog posts listed in sitemap but no /blog route exists
- Hero image is 5.4 MB PNG (blocks LCP, hurts PageSpeed)
- All pages are 'use client' (no SSR/ISR for content pages)

---

## 5. Security Headers

| Header | Status |
|--------|--------|
| Strict-Transport-Security (HSTS) | **MISSING** |
| Content-Security-Policy (CSP) | **MISSING** |
| X-Frame-Options | **MISSING** |
| X-Content-Type-Options | **MISSING** |
| Referrer-Policy | **MISSING** |
| Permissions-Policy | **MISSING** |
| Rate Limiting | **MISSING** |

---

## 6. Test Coverage

| Area | Tests | Status |
|------|-------|--------|
| Unit tests | 0 | No test framework configured |
| Integration tests | 0 | No test framework configured |
| E2E tests | 0 | No Playwright/Cypress |
| Visual regression | 0 | None |
| CI/CD | Unknown | No test scripts in package.json beyond `lint` |
