# Audit: Issues, Evidence & Fix Plan

> Comprehensive audit of the AuraDoc/MamaSign codebase.

---

## Do-Not-Touch / Fragile Areas

| Area | Reason | Files |
|------|--------|-------|
| Coordinate system (percentage-based positioning) | Recently fixed, complex Y-axis inversion math | `pdf-generator.ts`, `download/route.ts`, `sign-document/page.tsx` |
| Signing request flow (create → send → sign → complete) | Multi-step DB + email workflow, hard to test | `signing-requests/` API routes, `email.ts` |
| PDF field embedding (signature/text/checkbox/stamp) | Pixel-precise alignment, recently tuned offsets | `pdf-generator.ts:drawText`, `download/route.ts:176-186` |
| Supabase RLS / auth patterns | Auth is optional by design, changing could lock users out | `middleware.ts`, `supabase.ts` |
| Template/resume data files | 200KB+ static data, no logic to break but massive files | `data/templates.ts`, `data/resume-templates.ts` |
| Email templates (HTML) | Inline HTML with Odoo-style formatting, fragile | `lib/email.ts` |

---

## Issues Found

### P0 — Critical (Fix Immediately)

#### P0-1: Static Images are 15 MB Total
- **Evidence:** `public/hero-features.png` (5.4 MB), `public/mamasign-logo.png` (4.7 MB), `public/mamasign-logo-full.png` (4.7 MB)
- **Impact:** Homepage LCP destroyed. Users on mobile download 5.4 MB hero image.
- **Fix:** Convert to WebP/AVIF, resize to max 1920px wide, use Next.js `<Image>` with responsive sizes. Compress logos to <100 KB.
- **Effort:** Low | **Risk:** None (visual only) | **Rollback:** Restore original files

#### P0-2: Zero Security Headers
- **Evidence:** `next.config.js` has no `headers()` export. No CSP, HSTS, X-Frame-Options, etc.
- **Impact:** Vulnerable to clickjacking, MIME sniffing, missing HSTS.
- **Fix:** Add security headers in `next.config.js` `headers()`. Start CSP in report-only mode.
- **Effort:** Low | **Risk:** Low (CSP report-only won't break anything) | **Rollback:** Remove headers config

#### P0-3: No Rate Limiting on API Endpoints
- **Evidence:** All `/api/` routes accept unlimited requests. No middleware throttling.
- **Impact:** Abuse risk: email spam via `/api/send-signature-request`, brute-force on `/api/signing-requests/by-token/[token]`.
- **Fix:** Add rate limiting middleware (e.g., `next-rate-limit` or custom using Map/Redis).
- **Effort:** Medium | **Risk:** Low | **Rollback:** Remove middleware

---

### P1 — High Priority

#### P1-1: Homepage CTA Overload (4+ Competing Destinations)
- **Evidence:** `src/app/page.tsx` has CTAs pointing to `/sign-document`, `/pricing`, `/templates`, `/create-invoice`, `/verify`, `/sign-up` with 3 floating overlays (AnnouncementBar, FloatingLifetimeDeal, FloatingMobileCTA)
- **Impact:** Decision fatigue. Users don't know what to click first.
- **Fix:** Designate ONE primary CTA ("Start Signing Free" → `/sign-document`) + ONE secondary ("View Pricing"). Keep lifetime deal accessible but less aggressive.
- **Effort:** Medium | **Risk:** Low (copy/layout only) | **Rollback:** Revert JSX

#### P1-2: Homepage has 13 Sections, Multiple Scroll Listeners
- **Evidence:** `src/app/page.tsx` (1,003 lines) + `HeroSection.tsx` (285 lines). Multiple `useEffect` scroll handlers.
- **Impact:** Long page, poor INP, confusing hierarchy.
- **Fix:** Consolidate to: Hero → How it Works (3 steps) → Proof (stats + testimonials) → Product Buckets → Final CTA. Remove duplicate sections.
- **Effort:** Medium | **Risk:** Low (layout restructure, no logic) | **Rollback:** Revert to previous layout

#### P1-3: Heavy Bundle Sizes on Tool Pages (276-378 kB First Load)
- **Evidence:** Build output shows `/tools/watermark-pdf` at 378 kB, `/tools/word-to-pdf` at 357 kB.
- **Impact:** Slow initial load on mobile, poor Lighthouse scores.
- **Fix:** Dynamic import pdf-lib, jspdf, mammoth, docx. Use `next/dynamic` with `ssr: false`. Split template data into chunks.
- **Effort:** Medium | **Risk:** Low (lazy loading, tools work the same) | **Rollback:** Revert imports

#### P1-4: All Pages are 'use client' — No SSR for Content Pages
- **Evidence:** Every page.tsx has `'use client'` directive, including static content pages like `/about`, `/privacy`, `/terms`, `/faq`.
- **Impact:** No SSR benefits for SEO, slower FCP, larger bundles.
- **Fix:** Convert static content pages to server components. Keep interactive pages as client.
- **Effort:** Medium | **Risk:** Medium (must verify Clerk/theme compatibility) | **Rollback:** Add 'use client' back

#### P1-5: Missing Accessibility (alt text, ARIA, focus, contrast)
- **Evidence:** HeroSection.tsx line 136 (logo no alt), line 160/214/271/324 (mockup images no alt), FloatingLifetimeDeal small dismiss button, lime-on-white contrast issues in dark mode.
- **Impact:** Excludes screen reader users, fails WCAG 2.1 AA.
- **Fix:** Add alt text, ARIA labels, ensure 4.5:1 contrast, add skip-link, ensure 44px touch targets.
- **Effort:** Low-Medium | **Risk:** None | **Rollback:** N/A (additive)

#### P1-6: Client-Side Usage Limits (Bypassable)
- **Evidence:** `src/lib/usageLimit.ts` uses `localStorage` for free tier limits (5 docs). Can be cleared to bypass.
- **Impact:** No real enforcement of free tier.
- **Fix:** Move to server-side tracking (Supabase table keyed by IP/fingerprint or Clerk user). Keep client-side as UX hint only.
- **Effort:** High | **Risk:** Medium (new DB table, migration) | **Rollback:** Revert to client-only

---

### P2 — Medium Priority

#### P2-1: Tool Pages Lack SEO Content (How it Works, FAQs)
- **Evidence:** Tool pages like `/tools/pdf-merge` are pure UI — no explanatory content, no FAQ, no internal links, no structured data.
- **Impact:** Poor organic search ranking for valuable keywords.
- **Fix:** Add "How it Works" (3-5 steps), FAQ section with schema markup, internal links to related tools. Keep tool functionality identical.
- **Effort:** Medium | **Risk:** None (additive content) | **Rollback:** Remove content blocks

#### P2-2: Invoice Tax Label "DPH%" is Czech-Specific
- **Evidence:** `src/app/create-invoice/page.tsx` uses "DPH%" label.
- **Impact:** Confusing for international users.
- **Fix:** Replace with "Tax %" default. Add locale dropdown (VAT/GST/Sales Tax) that changes label only — NO calculation changes.
- **Effort:** Low | **Risk:** None (label only) | **Rollback:** Revert label

#### P2-3: No Test Framework Configured
- **Evidence:** `package.json` has no test dependencies (no jest, vitest, playwright, cypress).
- **Impact:** Cannot verify regressions automatically.
- **Fix:** Add vitest for unit/integration tests, playwright for E2E. Add test scripts to package.json.
- **Effort:** Medium | **Risk:** None (additive) | **Rollback:** Remove dependencies

#### P2-4: Per-Page Meta Tags Missing
- **Evidence:** Most pages rely on root layout's default meta. Tool pages, template pages have no specific titles/descriptions.
- **Impact:** Poor SEO — all pages show same title in search results.
- **Fix:** Add `export const metadata` or `generateMetadata()` to each page.
- **Effort:** Low | **Risk:** None | **Rollback:** Remove metadata exports

#### P2-5: Blog Posts in Sitemap But No Blog Route
- **Evidence:** `src/app/sitemap.ts` includes 9 blog post URLs but no `/blog` route exists.
- **Impact:** 404 errors for crawlers following sitemap links.
- **Fix:** Either create blog pages or remove blog entries from sitemap.
- **Effort:** Low | **Risk:** None | **Rollback:** Revert sitemap

#### P2-6: Security Wording Inconsistencies
- **Evidence:** Various pages claim "256-bit SSL encryption", "SOC 2 compliance", "HIPAA compliance" — need verification against actual implementation.
- **Impact:** Overclaiming could be legally problematic.
- **Fix:** Audit all security claims. Replace "256-bit SSL" with "TLS 1.3 in transit + AES-256 at rest" only if true. Remove unverifiable compliance claims or mark as "in progress".
- **Effort:** Low | **Risk:** Low (copy changes only) | **Rollback:** Revert text

#### P2-7: Duplicate Logo Files (9.4 MB Wasted)
- **Evidence:** `mamasign-logo.png` and `mamasign-logo-full.png` are identical 4.7 MB files.
- **Fix:** Remove duplicate, optimize remaining to <100 KB.
- **Effort:** Low | **Risk:** None | **Rollback:** Restore file

#### P2-8: Developer API Docs Page Loading Issues
- **Evidence:** `/api-docs` page is client-rendered. If Clerk or any dependency fails to load, may get stuck.
- **Impact:** Developer experience degraded.
- **Fix:** Add timeout, error state, retry button. Consider making it a server component.
- **Effort:** Low | **Risk:** None | **Rollback:** Revert component

---

### P3 — Low Priority (Polish)

#### P3-1: No Skip Navigation Link
- **Fix:** Add `<a href="#main" className="sr-only focus:not-sr-only">Skip to main content</a>` in layout

#### P3-2: No Breadcrumb Navigation
- **Fix:** Add breadcrumbs to tool pages, template pages for SEO + UX

#### P3-3: No Error Boundaries
- **Fix:** Add `error.tsx` and `loading.tsx` to key route segments

#### P3-4: PWA Manifest Incomplete
- **Evidence:** `manifest.json` exists but minimal (623 bytes)
- **Fix:** Complete manifest with icons, theme colors, proper name

#### P3-5: Google Analytics Could Use Consent Management
- **Evidence:** GA loaded unconditionally in layout
- **Fix:** Add cookie consent banner, defer GA until consent

---

## Fix Priority Matrix

| Priority | Count | Effort | Risk |
|----------|-------|--------|------|
| P0 (Critical) | 3 | Low-Medium | Low |
| P1 (High) | 6 | Low-High | Low-Medium |
| P2 (Medium) | 8 | Low-Medium | None-Low |
| P3 (Low) | 5 | Low | None |

**Recommended order:**
1. P0-1: Optimize images (immediate LCP win)
2. P0-2: Add security headers (immediate security win)
3. P2-3: Set up test framework (enables safe changes)
4. P1-5: Fix accessibility (quick wins: alt text, ARIA)
5. P1-3: Dynamic imports for heavy pages (bundle size)
6. P1-1: Homepage CTA cleanup (UX)
7. P2-1: Tool pages SEO content (organic traffic)
8. P2-4: Per-page meta tags (SEO)
9. P2-2: Invoice tax label (i18n)
10. Everything else

---

## Implementation Safety Rules

1. Every change gets its own commit with before/after verification
2. No changes to: coordinate math, PDF embedding logic, email templates, DB schema
3. All layout/copy changes must preserve existing routes
4. Security headers start in report-only mode
5. Test framework added before any behavioral changes
6. Image optimization verified visually before committing
