# MamaSign Mobile Design System
## Complete Mobile-First Redesign Specification

**Version:** 2.0
**Target:** 360px-430px viewport (first-class mobile UX)
**Standard:** Stripe/Shopify/Notion/GitHub-level quality

---

# PART A: GLOBAL MOBILE DESIGN SYSTEM

## 1. Breakpoints

| Token | Width | Use Case |
|-------|-------|----------|
| `mobile-sm` | 320px-374px | iPhone SE, small Android |
| `mobile` | 375px-479px | Standard phones (primary target) |
| `mobile-lg` | 480px-639px | Large phones, small tablets |
| `tablet` | 640px-767px | Tablets portrait |
| `md` | 768px-1023px | Tablets landscape, small laptops |
| `lg` | 1024px-1279px | Laptops |
| `xl` | 1280px+ | Desktops |

**CSS Approach:** Mobile-first (base styles = mobile, then enhance upward)

```css
/* Base = mobile (360-479px) */
.component { ... }

/* 480px+ */
@media (min-width: 480px) { ... }

/* 768px+ */
@media (min-width: 768px) { ... }

/* 1024px+ */
@media (min-width: 1024px) { ... }
```

---

## 2. Spacing Scale

| Token | Mobile | Desktop | Use Case |
|-------|--------|---------|----------|
| `space-xs` | 4px | 4px | Inline spacing, icons |
| `space-sm` | 8px | 8px | Tight spacing |
| `space-md` | 12px | 16px | Default gap |
| `space-lg` | 16px | 24px | Section padding |
| `space-xl` | 24px | 32px | Section gaps |
| `space-2xl` | 32px | 48px | Major sections |
| `space-3xl` | 48px | 64px | Hero sections |

**Section Padding:**
- Mobile: `padding: 48px 16px` (py-12 px-4)
- Desktop: `padding: 80px 32px` (py-20 px-8)

---

## 3. Typography Scale

```css
/* Mobile-First Typography with clamp() */
:root {
  /* Headings */
  --font-h1: clamp(1.75rem, 6vw + 0.5rem, 3.5rem);    /* 28px → 56px */
  --font-h2: clamp(1.5rem, 4vw + 0.5rem, 2.5rem);     /* 24px → 40px */
  --font-h3: clamp(1.25rem, 2vw + 0.5rem, 1.75rem);   /* 20px → 28px */
  --font-h4: clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem); /* 18px → 24px */

  /* Body */
  --font-body-lg: clamp(1rem, 1vw + 0.5rem, 1.25rem); /* 16px → 20px */
  --font-body: 1rem;                                   /* 16px (no smaller!) */
  --font-body-sm: 0.875rem;                           /* 14px */
  --font-caption: 0.75rem;                            /* 12px */

  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

**Rules:**
- Body text: NEVER below 16px (prevents iOS zoom)
- Line length: max 65 characters on mobile
- Line height: minimum 1.5 for body text

---

## 4. Touch Targets

| Element | Minimum Size | Recommended |
|---------|--------------|-------------|
| Primary buttons | 48x48px | 56x48px |
| Secondary buttons | 44x44px | 48x44px |
| Nav links | 44x44px tap area | Full width on mobile |
| Form inputs | 48px height | 52px height |
| Icon buttons | 44x44px | 48x48px |
| Checkbox/Radio | 24x24px visual, 44x44px tap | - |
| List items | 48px min-height | 56px recommended |

```css
/* Touch target helper */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 5. Button Styles

### Primary Button (Mobile)
```css
.btn-primary-mobile {
  width: 100%;
  min-height: 52px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: var(--color-primary); /* #4C00FF light / #c4ff0e dark */
  color: var(--color-primary-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.btn-primary-mobile:active {
  transform: scale(0.98);
}

@media (min-width: 768px) {
  .btn-primary-mobile {
    width: auto;
    min-width: 160px;
  }
}
```

### Secondary Button (Mobile)
```css
.btn-secondary-mobile {
  width: 100%;
  min-height: 48px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 12px;
  background: transparent;
  border: 2px solid var(--color-border);
  color: var(--color-text);
}
```

### Button Stack Pattern (Mobile)
```css
.btn-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

@media (min-width: 480px) {
  .btn-stack {
    flex-direction: row;
    width: auto;
  }
}
```

---

## 6. Card Styles

### Feature Card (Mobile)
```css
.card-feature-mobile {
  padding: 20px;
  border-radius: 16px;
  background: var(--color-card);
  border: 1px solid var(--color-border);

  /* Icon */
  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    margin-bottom: 16px;
  }

  /* Title */
  .card-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  /* Description */
  .card-desc {
    font-size: 14px;
    line-height: 1.5;
    color: var(--color-text-secondary);
  }
}
```

### Pricing Card (Mobile)
```css
.card-pricing-mobile {
  padding: 24px 20px;
  border-radius: 20px;
  text-align: center;

  .price {
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 700;
  }

  .price-period {
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  .feature-list {
    text-align: left;
    margin: 24px 0;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 0;
    font-size: 14px;
  }
}
```

---

## 7. Header/Navigation (Mobile)

### Mobile Header
```css
.header-mobile {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  padding: 0 16px;
  padding-top: env(safe-area-inset-top);
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### Mobile Menu Drawer
```css
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 100;

  .menu-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .menu-panel {
    position: absolute;
    top: 60px;
    left: 16px;
    right: 16px;
    max-height: 80vh;
    overflow-y: auto;
    background: var(--color-background);
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .menu-item {
    min-height: 48px;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
  }

  .menu-submenu {
    margin-left: 16px;
    padding-left: 16px;
    border-left: 2px solid var(--color-border);
  }
}
```

### Submenu Pattern (Back Navigation)
```css
.submenu-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--color-border);

  .back-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

---

## 8. Footer (Mobile)

```css
.footer-mobile {
  padding: 48px 16px;
  padding-bottom: calc(48px + env(safe-area-inset-bottom));

  .footer-brand {
    margin-bottom: 32px;
    text-align: center;
  }

  .footer-links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 16px;
  }

  .footer-link {
    min-height: 44px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .footer-social {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 32px;

    a {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .footer-legal {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
    text-align: center;
    font-size: 12px;
  }
}
```

---

## 9. Standard Component Patterns

### Hero Section (Mobile)
```css
.hero-mobile {
  padding: 80px 16px 48px; /* Extra top for header */
  text-align: center;

  .hero-badge {
    display: inline-flex;
    padding: 8px 16px;
    border-radius: 50px;
    font-size: 12px;
    margin-bottom: 16px;
  }

  .hero-title {
    font-size: var(--font-h1);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 16px;
  }

  .hero-subtitle {
    font-size: var(--font-body-lg);
    line-height: 1.6;
    color: var(--color-text-secondary);
    margin-bottom: 24px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-cta {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .hero-image {
    margin-top: 32px;
    border-radius: 16px;
    overflow: hidden;
  }
}

@media (min-width: 768px) {
  .hero-mobile {
    padding: 120px 32px 80px;

    .hero-cta {
      flex-direction: row;
      justify-content: center;
    }
  }
}
```

### Feature Grid (Mobile)
```css
.feature-grid-mobile {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 480px) {
  .feature-grid-mobile {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .feature-grid-mobile {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}
```

### Accordion (Mobile)
```css
.accordion-mobile {
  .accordion-item {
    border: 1px solid var(--color-border);
    border-radius: 12px;
    margin-bottom: 8px;
    overflow: hidden;
  }

  .accordion-trigger {
    width: 100%;
    min-height: 56px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    background: var(--color-card);
  }

  .accordion-content {
    padding: 0 16px 16px;
    font-size: 14px;
    line-height: 1.6;
  }
}
```

### Tabs (Mobile)
```css
.tabs-mobile {
  .tab-list {
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 4px;
    padding: 4px;
    background: var(--color-muted);
    border-radius: 12px;
  }

  .tab-trigger {
    flex-shrink: 0;
    min-height: 44px;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
  }

  .tab-trigger[data-state="active"] {
    background: var(--color-background);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .tab-content {
    padding: 24px 0;
  }
}
```

### Testimonial Card (Mobile)
```css
.testimonial-mobile {
  padding: 24px 20px;
  border-radius: 16px;

  .stars {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
  }

  .quote {
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .author-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  .author-name {
    font-weight: 600;
    font-size: 14px;
  }

  .author-role {
    font-size: 12px;
    color: var(--color-text-secondary);
  }
}
```

### FAQ Section (Mobile)
```css
.faq-mobile {
  max-width: 100%;

  .faq-item {
    border-bottom: 1px solid var(--color-border);
  }

  .faq-question {
    width: 100%;
    min-height: 56px;
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    text-align: left;

    .icon {
      flex-shrink: 0;
      margin-left: 16px;
    }
  }

  .faq-answer {
    padding-bottom: 16px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }
}
```

### Tool Card (Mobile)
```css
.tool-card-mobile {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid var(--color-border);

  .tool-icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tool-content {
    flex: 1;
    min-width: 0; /* Prevent text overflow */
  }

  .tool-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .tool-desc {
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.4;
  }
}
```

### Sticky CTA Bar (Mobile)
```css
.sticky-cta-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
  z-index: 40;

  .cta-btn {
    width: 100%;
    min-height: 52px;
  }
}
```

### Docs/API Section (Mobile)
```css
.docs-mobile {
  .docs-toc {
    /* Collapsible on mobile */
    position: sticky;
    top: 60px;
    background: var(--color-background);
    z-index: 20;

    .toc-toggle {
      width: 100%;
      min-height: 48px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--color-border);
    }

    .toc-content {
      max-height: 50vh;
      overflow-y: auto;
      padding: 16px;
    }
  }

  .code-block {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 12px;
    font-size: 13px;

    .copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 36px;
      height: 36px;
    }
  }
}
```

---

## 10. Comparison Table Solutions

### Option A: Cards Per Competitor
```jsx
// Instead of table, show comparison as stacked cards
<div className="comparison-cards">
  {competitors.map(comp => (
    <div className={`comp-card ${comp.recommended ? 'highlighted' : ''}`}>
      <div className="comp-header">
        <span className="comp-name">{comp.name}</span>
        <span className="comp-price">{comp.price}</span>
      </div>
      <ul className="comp-features">
        {features.map(f => (
          <li className="feature-row">
            <span>{f.name}</span>
            {comp.has[f.key] ? <CheckIcon /> : <XIcon />}
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>
```

### Option B: Tabs Per Competitor
```jsx
<Tabs defaultValue="mamasign">
  <TabsList className="grid grid-cols-3">
    <TabsTrigger value="mamasign">MamaSign</TabsTrigger>
    <TabsTrigger value="hellosign">HelloSign</TabsTrigger>
    <TabsTrigger value="adobe">Adobe</TabsTrigger>
  </TabsList>
  {competitors.map(comp => (
    <TabsContent value={comp.id}>
      <PriceDisplay price={comp.price} period={comp.period} />
      <FeatureList features={comp.features} />
    </TabsContent>
  ))}
</Tabs>
```

### Option C: Accordion Rows (Current Implementation - Good)
```jsx
// Current mobile comparison in homepage - already implemented well
<div className="grid grid-cols-3 gap-2">
  {/* Price cards */}
</div>
<div className="space-y-2">
  {features.map(row => (
    <div className="p-4 rounded-xl">
      <div className="font-semibold mb-3">{row.feature}</div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Values for each competitor */}
      </div>
    </div>
  ))}
</div>
```

---

# PART B: PAGE-BY-PAGE MOBILE SPECS

---

## 1. Homepage (`/`)

### Current Risks on Mobile
- [x] Already has `MobileAppShell` wrapper - GOOD
- [x] Desktop content hidden on mobile (`hidden md:block`) - GOOD
- [x] Mobile dashboard exists - GOOD
- [ ] Hero section could be more impactful on mobile
- [ ] Stats section numbers could be larger
- [ ] Feature mockups may be too detailed for mobile

### New Mobile Layout
```
[Header - 60px fixed]
[Hero Section]
  - Badge
  - H1 (28-32px)
  - Subtitle (16px)
  - 2 stacked CTAs
[Trust Badges - horizontal scroll]
[Stats - 2x2 grid]
[Quick Actions Grid - MobileHomeDashboard]
  - Sign Document
  - PDF Tools
  - Templates
  - Invoice
[Social Proof - compact]
[Bottom Nav - fixed]
```

### Interaction Behavior
- Header: Hamburger menu opens slide-down panel
- Products menu: Expandable with chevron
- Quick actions: Tap navigates directly
- No floating CTAs (bottom nav serves this purpose)

### Responsive Rules
| Viewport | Changes |
|----------|---------|
| 360-479px | Single column, stacked buttons, 2x2 stats |
| 480-767px | Same but slightly larger cards |
| 768px+ | Show desktop layout (`hidden md:block`) |

### Conversion Improvements
- Hero CTA: "Start Signing Free" as primary
- Add urgency badge if lifetime deal active
- Quick action cards should have clear visual hierarchy
- Consider adding "Trusted by X users" near CTA

---

## 2. Features Page (`/features`)

### Current Risks on Mobile
- [ ] Feature category cards could be too tall
- [ ] Feature lists (10 items each) very long to scroll
- [ ] PDF tools grid 2-col might feel cramped at 360px
- [ ] Hero could be shorter on mobile

### New Mobile Layout
```
[Header]
[Hero - compact]
  - Badge
  - H1
  - Subtitle
  - Stats row (2x2)
[Why Choose Us - horizontal scroll or 2x2]
[Feature Categories - accordion style]
  - Each category collapsed by default
  - Tap to expand feature list
[PDF Tools Grid - 2 col]
[Testimonial - single card]
[CTA Section]
[Footer]
```

### Interaction Behavior
- Feature categories: Accordion pattern (one open at a time)
- PDF tools: Tap to navigate
- Smooth scroll on stats

### Responsive Rules
| Viewport | Changes |
|----------|---------|
| 360-479px | 1 feature card per row, accordion |
| 480-767px | 2 col PDF tools |
| 768px+ | 2-3 col feature grid, no accordion |

### Conversion Improvements
- Add "Free" badge on PDF tools section
- Feature accordion should show first 3 features with "Show more"
- Sticky CTA at bottom when scrolling features

---

## 3. Pricing Page (`/pricing`)

### Current Risks on Mobile
- [x] Already dark theme focused - consistent
- [ ] Hero badge could be more prominent
- [ ] Price card glow effect may not render well on all devices
- [ ] Feature list (15 items) very long
- [ ] Comparison section works but could be cleaner

### New Mobile Layout
```
[Header]
[Hero Banner - compact]
  - "Limited Time" badge
  - "Lifetime Deal" heading
  - Subtitle
[Main Price Card - centered]
  - SAVE 90% badge
  - Price: $270 crossed / $27 large
  - "One-time payment" text
  - 5 key features (collapsible for more)
  - CTA button
  - 30-day guarantee
[Trust Indicators - horizontal row]
[All Features Grid - 2 col or accordion]
[Comparison Cards - Monthly vs Lifetime]
[Trusted By - logo scroll]
[FAQ - accordion]
[Final CTA - full width]
[Footer]
```

### Interaction Behavior
- Feature list: Show 5, "See all X features" expands
- FAQ: Accordion, one open at a time
- Price card: Fixed shadow, prominent

### Responsive Rules
| Viewport | Changes |
|----------|---------|
| 360-479px | Single col features, larger price font |
| 480-767px | 2 col features |
| 768px+ | 3 col features, side-by-side comparison |

### Conversion Improvements
- Price should be the first thing visible (above fold)
- "SAVE 90%" badge very prominent
- Add countdown timer if deal is time-limited
- Social proof near CTA ("Join 50K+ users")

---

## 4. Tools Page (`/tools`)

### Current Risks on Mobile
- [ ] Hero section adequate
- [ ] Features strip - 3 items could wrap awkwardly
- [ ] Popular tools 3-col goes to 1-col - good
- [ ] Category sections work well

### New Mobile Layout
```
[Header]
[Hero - compact]
  - H1
  - Subtitle
  - 3 trust badges (horizontal scroll)
[Features Strip - horizontal scroll]
[Popular Tools - 1 col cards]
[All Tools by Category]
  - Category header
  - 1-col tool cards with icon left
[E-Signature CTA Banner]
[FAQ Preview - 2 cards]
[Footer]
```

### Interaction Behavior
- Tool cards: Entire card tappable
- Category headers: Sticky while scrolling section

### Responsive Rules
| Viewport | Changes |
|----------|---------|
| 360-479px | 1 col tools, horizontal scroll badges |
| 480-767px | 2 col popular tools |
| 768px+ | 3 col grid |

### Conversion Improvements
- Add "100% Free" badge on each tool card
- Popular tools should have "Most Used" or usage count
- Clear "Try Now" CTA on each card

---

## 5. Individual Tool Pages (`/tools/*`)

### Current Risks on Mobile
- [ ] Upload area may need larger drop zone
- [ ] Preview area could overflow
- [ ] Settings panels need stacking
- [ ] Download buttons need to be full-width

### New Mobile Layout
```
[Header]
[Tool Header]
  - Icon + Tool Name
  - Short description
[Upload Section]
  - Large drop zone (min 200px height)
  - "Drag or tap to upload"
  - File type hints
[Preview Area - if applicable]
  - Responsive canvas
  - Pinch to zoom on images
[Settings Panel - if applicable]
  - Full width inputs
  - Sliders with large touch targets
[Action Button]
  - Full width primary button
  - "Processing..." state
[Result Section]
  - Success message
  - Download button (full width)
  - "Process another" link
[Related Tools - horizontal scroll]
[Footer]
```

### Interaction Behavior
- Upload: Tap opens file picker
- Processing: Show progress indicator, disable interactions
- Download: One-tap download with haptic feedback

### Responsive Rules
| Viewport | Changes |
|----------|---------|
| 360-479px | Stacked layout, full-width controls |
| 480-767px | Same with larger preview |
| 768px+ | Side-by-side preview and settings |

### Conversion Improvements
- Show "No signup required" near upload
- Add "Processed locally - files stay private"
- Related tools for cross-selling

---

## 6. API Docs Page (`/api-docs`)

### Current Risks on Mobile
- [ ] Code blocks will overflow horizontally
- [ ] Side-by-side layout breaks on mobile
- [ ] SDKs grid 3-col needs adjustment
- [ ] Endpoints list description hidden on mobile (already done!)

### New Mobile Layout
```
[Header]
[Hero - compact]
  - "Developer API" badge
  - H1
  - Subtitle
  - 2 stacked CTAs
[Quick Start]
  - Benefit list
  - Code block (horizontal scroll + copy)
[API Features - 2 col grid]
[Endpoints List]
  - Method badge
  - Path
  - Tap to expand description
[Webhooks Section]
  - Event list
  - Payload example (scroll + copy)
[SDKs - 2 col grid]
  - Language icon
  - Install command (copy)
[CTA Section]
[Footer]
```

### Interaction Behavior
- Code blocks: Horizontal scroll with sticky copy button
- Endpoints: Tap to expand/collapse details
- SDK commands: Tap to copy

### Responsive Rules
| Viewport | Changes |
|----------|---------|
| 360-479px | 1 col SDKs, stacked code examples |
| 480-767px | 2 col SDKs, 2 col features |
| 768px+ | Side-by-side code + explanation |

### Code Block Pattern (Mobile)
```css
.code-block-mobile {
  position: relative;
  background: var(--color-code-bg);
  border-radius: 12px;
  overflow: hidden;

  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-border);

    .copy-btn {
      width: 36px;
      height: 36px;
      min-width: 36px;
    }
  }

  pre {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 16px;
    font-size: 13px;
    line-height: 1.5;
  }

  /* Scroll indicator */
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 48px;
    bottom: 0;
    width: 24px;
    background: linear-gradient(to right, transparent, var(--color-code-bg));
    pointer-events: none;
  }
}
```

---

## 7. About Page (`/about`)

### Current Risks on Mobile
- [ ] Team photos grid may need adjustment
- [ ] Mission section text length
- [ ] Timeline/history if present

### New Mobile Layout
```
[Header]
[Hero]
  - H1 "About MamaSign"
  - Mission statement (2-3 sentences)
[Stats Bar - horizontal scroll]
[Our Story - single column]
[Values/Principles - 1 col cards]
[Team Section - 2 col grid]
  - Photo
  - Name
  - Role
[Office Locations - if present]
[CTA - Join us or Contact]
[Footer]
```

### Responsive Rules
| Viewport | Changes |
|----------|---------|
| 360-479px | 2 col team grid |
| 480-767px | 2 col team, larger photos |
| 768px+ | 3-4 col team grid |

---

## 8. Contact Page (`/contact`)

### Current Risks on Mobile
- [x] Contact options 3-col works but could be bigger icons
- [ ] Form + sidebar 2-col layout
- [ ] Office locations 3-col

### New Mobile Layout
```
[Header]
[Hero - compact]
[Contact Options - 1 col stacked]
  - Live Chat card
  - Email card
  - Phone card
[Contact Form - full width]
  - Name/Email side by side on 480+
  - Company
  - Subject dropdown
  - Message textarea
  - Submit button (full width)
[Quick Help - FAQ links]
[Enterprise Sales card]
[Social Links - horizontal]
[Office Locations - 1 col]
[Footer]
```

### Form Optimizations (Mobile)
```css
.contact-form-mobile {
  input, select, textarea {
    width: 100%;
    min-height: 52px;
    padding: 14px 16px;
    font-size: 16px; /* Prevents iOS zoom */
    border-radius: 12px;
  }

  textarea {
    min-height: 150px;
    resize: vertical;
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,..."); /* Custom arrow */
    background-position: right 16px center;
    background-repeat: no-repeat;
    padding-right: 44px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
  }

  .form-row {
    display: grid;
    gap: 16px;

    @media (min-width: 480px) {
      grid-template-columns: 1fr 1fr;
    }
  }
}
```

### Responsive Rules
| Viewport | Changes |
|----------|---------|
| 360-479px | Single col everything |
| 480-767px | 2 col form rows, 2 col offices |
| 768px+ | Form + sidebar layout |

---

## 9. Templates Page (`/templates`)

### New Mobile Layout
```
[Header]
[Hero - compact]
  - H1 "Resume Templates"
  - Subtitle
  - Category filter (horizontal scroll pills)
[Templates Grid - 1 col]
  - Template preview image
  - Template name
  - "Use Template" button
[Why Our Templates section]
[CTA Banner]
[Footer]
```

### Template Card (Mobile)
```css
.template-card-mobile {
  border-radius: 16px;
  overflow: hidden;

  .preview {
    aspect-ratio: 8.5/11; /* Letter paper ratio */
    background: var(--color-muted);
  }

  .info {
    padding: 16px;
  }

  .actions {
    padding: 0 16px 16px;
  }
}
```

---

## 10. Sign Document Page (`/sign-document`)

### Current Risks on Mobile
- [ ] PDF viewer needs responsive canvas
- [ ] Signature placement on small screen
- [ ] Field palette toolbar
- [ ] Multi-signer management

### New Mobile Layout
```
[Header with progress indicator]
[Step 1: Upload]
  - Large drop zone
  - Or select from documents
[Step 2: Add Recipients]
  - Email input
  - Add more button
[Step 3: Place Fields]
  - PDF viewer (pinch zoom)
  - Floating toolbar at bottom
  - Field palette (drawer from bottom)
[Step 4: Review & Send]
  - Summary
  - Send button
```

### PDF Viewer (Mobile)
```css
.pdf-viewer-mobile {
  position: relative;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x pan-y pinch-zoom;

  canvas {
    display: block;
    max-width: 100%;
    height: auto;
  }
}

.field-toolbar-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-around;

  button {
    flex: 1;
    max-width: 80px;
    aspect-ratio: 1;
    border-radius: 12px;
  }
}
```

---

## 11. Auth Pages (`/sign-in`, `/sign-up`)

### New Mobile Layout
```
[Logo centered]
[Auth Card - full width]
  - Heading
  - Social auth buttons (Google, etc.)
  - Divider "or"
  - Email/Password form
  - Submit button (full width)
  - Toggle link (Sign in ↔ Sign up)
[Trust badges at bottom]
```

### Auth Form (Mobile)
```css
.auth-card-mobile {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 24px 16px;

  .social-btns {
    display: flex;
    flex-direction: column;
    gap: 12px;

    button {
      width: 100%;
      min-height: 52px;
    }
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 24px 0;

    &::before, &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--color-border);
    }

    span {
      padding: 0 16px;
      font-size: 14px;
      color: var(--color-text-secondary);
    }
  }
}
```

---

## 12. Legal Pages (`/privacy`, `/terms`, `/security`, `/compliance`)

### New Mobile Layout
```
[Header]
[Page Title]
[Table of Contents - collapsible]
[Content sections]
  - Clear headings
  - Proper spacing
  - Readable paragraphs
[Footer]
```

### Legal Content (Mobile)
```css
.legal-content-mobile {
  padding: 24px 16px 48px;
  max-width: 100%;

  h1 { font-size: 28px; margin-bottom: 16px; }
  h2 { font-size: 22px; margin: 32px 0 16px; }
  h3 { font-size: 18px; margin: 24px 0 12px; }

  p {
    font-size: 16px;
    line-height: 1.7;
    margin-bottom: 16px;
  }

  ul, ol {
    padding-left: 24px;
    margin-bottom: 16px;

    li {
      margin-bottom: 8px;
      line-height: 1.6;
    }
  }

  .toc-mobile {
    position: sticky;
    top: 60px;
    background: var(--color-background);
    border-bottom: 1px solid var(--color-border);
    z-index: 10;

    button {
      width: 100%;
      min-height: 48px;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
```

---

## 13. Dashboard/Documents (`/documents`)

### New Mobile Layout
```
[Header with search icon]
[Quick Actions Row]
  - New Document
  - Upload
[Filter Tabs - horizontal scroll]
  - All | Pending | Completed | Draft
[Document List - 1 col]
  - Document card
    - Title
    - Status badge
    - Date
    - Actions (...)
[Empty State if no docs]
[Bottom Nav]
```

### Document Card (Mobile)
```css
.doc-card-mobile {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--color-border);

  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .doc-title {
    font-size: 16px;
    font-weight: 600;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .doc-status {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 50px;
    flex-shrink: 0;
  }

  .doc-meta {
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  .doc-actions {
    margin-top: 12px;
    display: flex;
    gap: 8px;

    button {
      flex: 1;
      min-height: 40px;
    }
  }
}
```

---

# PART C: IMPLEMENTATION NOTES

## 1. CSS Approach (Mobile-First)

```css
/* globals.css structure */

/* 1. CSS Variables */
:root { ... }
.dark { ... }

/* 2. Base/Reset */
* { box-sizing: border-box; }
html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

/* 3. Mobile-first components */
.btn { /* mobile styles */ }
.card { /* mobile styles */ }

/* 4. Responsive enhancements */
@media (min-width: 480px) { ... }
@media (min-width: 768px) { ... }
@media (min-width: 1024px) { ... }

/* 5. Utilities */
.mobile-only { display: block; }
.desktop-only { display: none; }

@media (min-width: 768px) {
  .mobile-only { display: none; }
  .desktop-only { display: block; }
}
```

## 2. Grid Rules

```css
/* Responsive grid system */
.grid-responsive {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 480px) {
  .grid-responsive { grid-template-columns: repeat(2, 1fr); }
  .grid-responsive-3 { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 768px) {
  .grid-responsive { grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .grid-responsive-3 { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) {
  .grid-responsive { grid-template-columns: repeat(4, 1fr); }
}
```

## 3. Images & Icons

```jsx
// Next.js Image with aspect ratio preservation
<div className="relative aspect-video">
  <Image
    src="/hero.jpg"
    alt="Description"
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover"
    priority // for above-fold images
  />
</div>

// Lazy loading for below-fold
<Image
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**Icon Sizes:**
- Navigation: 24px
- Buttons: 20px
- Cards: 24-32px
- Feature icons: 48px

## 4. Handling Long Labels/Strings

```css
/* Truncate with ellipsis */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Multi-line truncate */
.text-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Word break for long words */
.text-break {
  word-break: break-word;
  overflow-wrap: break-word;
}
```

## 5. Forms & Validation (Mobile)

```jsx
// Form component pattern
<form className="space-y-4">
  <div className="form-group">
    <label htmlFor="email" className="form-label">
      Email *
    </label>
    <input
      type="email"
      id="email"
      name="email"
      required
      autoComplete="email"
      inputMode="email"
      className="form-input"
      placeholder="you@example.com"
    />
    {error && (
      <p className="form-error" role="alert">
        {error}
      </p>
    )}
  </div>
</form>
```

```css
.form-input {
  width: 100%;
  min-height: 52px;
  padding: 14px 16px;
  font-size: 16px; /* CRITICAL: prevents iOS zoom */
  border: 2px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-input-bg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-10);
}

.form-input:invalid:not(:placeholder-shown) {
  border-color: var(--color-error);
}

.form-error {
  margin-top: 8px;
  font-size: 14px;
  color: var(--color-error);
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}
```

## 6. Tables → Cards/Tabs Conversion

```jsx
// Before: Table (desktop only)
<table className="hidden md:table">
  <thead>...</thead>
  <tbody>...</tbody>
</table>

// After: Cards for mobile
<div className="md:hidden space-y-4">
  {data.map(row => (
    <div className="card-mobile p-4 rounded-xl border">
      <div className="font-semibold mb-2">{row.title}</div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        {columns.map(col => (
          <div key={col.key}>
            <dt className="text-muted">{col.label}</dt>
            <dd>{row[col.key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  ))}
</div>
```

## 7. QA Checklist

### Device Widths to Test
- [ ] 320px (iPhone SE)
- [ ] 360px (Small Android)
- [ ] 375px (iPhone X/11/12/13 mini)
- [ ] 390px (iPhone 12/13/14)
- [ ] 412px (Pixel 5/6)
- [ ] 428px (iPhone 12/13/14 Pro Max)
- [ ] 768px (iPad portrait)
- [ ] 1024px (iPad landscape)

### Real Device Testing
- [ ] iOS Safari (iPhone)
- [ ] iOS Chrome (iPhone)
- [ ] Android Chrome (Pixel/Samsung)
- [ ] Android Firefox

### Mobile-Specific Checks
- [ ] Touch targets >= 44px
- [ ] No horizontal scroll on any page
- [ ] Form inputs don't zoom on focus (16px font)
- [ ] Safe area insets (notch, home indicator)
- [ ] Keyboard doesn't cover inputs
- [ ] Scroll performance smooth
- [ ] Images lazy load below fold
- [ ] No CLS (Cumulative Layout Shift)
- [ ] Dark mode works correctly
- [ ] Navigation menu opens/closes properly
- [ ] All CTAs reachable with thumb

### Accessibility Checks
- [ ] Focus states visible
- [ ] Tab order logical
- [ ] Screen reader announces content
- [ ] Color contrast >= 4.5:1 (text) / 3:1 (large text)
- [ ] Links/buttons have accessible names
- [ ] Error messages announced

### Performance Checks
- [ ] Lighthouse mobile score >= 90
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] No layout shifts after load

---

## 8. Tailwind Classes Quick Reference

```jsx
// Responsive visibility
className="block md:hidden"     // Mobile only
className="hidden md:block"     // Desktop only

// Responsive grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"

// Responsive padding
className="p-4 md:p-6 lg:p-8"
className="px-4 md:px-6 lg:px-8"
className="py-12 md:py-20"

// Responsive text
className="text-2xl md:text-4xl lg:text-5xl"

// Touch-friendly
className="min-h-[44px] min-w-[44px]"
className="p-3 md:p-2" // Larger on mobile

// Safe area
className="pb-safe" // Custom utility for safe-area-inset-bottom

// Button stack
className="flex flex-col sm:flex-row gap-3"

// Full width on mobile
className="w-full sm:w-auto"
```

---

## 9. Safe Area Utilities

Add to `tailwind.config.ts`:

```js
module.exports = {
  theme: {
    extend: {
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
}
```

Or CSS utilities:

```css
.pt-safe { padding-top: env(safe-area-inset-top); }
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
.pl-safe { padding-left: env(safe-area-inset-left); }
.pr-safe { padding-right: env(safe-area-inset-right); }
```

---

## 10. Component Migration Priority

### Phase 1 (Critical - Do First)
1. Header/MobileAppShell - Already good
2. Homepage sections
3. Pricing page
4. Sign-document page
5. Tool pages

### Phase 2 (High Priority)
6. Features page
7. Templates page
8. Contact page
9. API docs

### Phase 3 (Medium Priority)
10. About/Careers/FAQ
11. Legal pages (privacy, terms, etc.)
12. Dashboard pages

### Phase 4 (Polish)
13. Error pages (404, 500)
14. Loading states
15. Empty states
16. Animations & micro-interactions

---

**Document maintained by:** Product Design Team
**Last updated:** January 2025
**Next review:** After Phase 1 implementation
