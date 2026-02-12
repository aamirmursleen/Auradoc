# MamaSign Landing Page - Lovable Specification

## 🎯 PROJECT CONTEXT

Build a **Notion-inspired landing page** for MamaSign (e-signature platform) that makes users feel they're buying a **$10,000/year enterprise product for just $27**. The page should be as lengthy as CalendarJet.com (15+ sections) with MASSIVE whitespace, vibrant colors, and interactive components (NOT screenshots).

---

## 📋 CORE REQUIREMENTS

### Primary Goal
Create a landing page that generates the "WOW" reaction through:
- **Notion-level design perfection**
- **Generous spacing** (users complained about cramped design)
- **Direct response copywriting** (pain → solution → benefit)
- **Fully interactive components** for every feature
- **CalendarJet length** (15+ scrollable sections)

### User Psychology
Make $27 feel like an **insane bargain** for enterprise features that competitors charge $10,000/year for.

---

## 🎨 DESIGN SYSTEM

### Color Palette (Notion's Vibrant Approach)

**Primary Colors by Section:**
- Hero: Purple gradient (#8b5cf6 → #a78bfa)
- Signatures: Teal (#14b8a6)
- Resume Builder: Blue (#3b82f6)
- Invoice Generator: Amber/Orange (#f59e0b)
- Document Verification: Red (#ef4444)
- Custom Domain: Green (#10b981)
- Analytics: Indigo (#6366f1)
- Team Collaboration: Pink (#ec4899)

**Base Colors:**
- Background (Light): #FFFFFF
- Background (Dark): #0a0a0a
- Text (Light): #141414
- Text (Dark): #FFFFFF
- Secondary Text (Light): #666666
- Secondary Text (Dark): #999999

### Typography (Research-Based)

**Font Stack:**
```css
--font-heading: 'Inter', -apple-system, sans-serif;
--font-body: 'Inter', -apple-system, sans-serif;
```

**Font Sizes (Golden Ratio φ = 1.618):**
- Heading 1 (Hero): 76px (clamp: 44px → 76px)
- Heading 2 (Section): 48px (clamp: 32px → 48px)
- Heading 3 (Card): 28px
- Body Large: 24px
- Body Regular: 18px (minimum 16px for mobile)
- Body Small: 14px

**Line Heights (Research: 130-150%):**
- Headings: 1.1 (tight)
- Body: 1.6 (generous, 160%)
- Subheadings: 1.4

**Letter Spacing:**
- Large Headings: -0.04em (tighter)
- Body: normal
- Uppercase Labels: 0.1em (wider)

### Spacing System (4pt/8pt Grid)

**Scale:**
```
4px   = xs (micro spacing)
8px   = sm (small gaps)
16px  = md (element padding)
24px  = lg (card padding)
32px  = xl (between groups)
48px  = 2xl (between sub-sections)
64px  = 3xl (within sections)
96px  = 4xl (BETWEEN SECTIONS - CRITICAL!)
128px = 5xl (major section breaks)
```

**Critical Rule:** MINIMUM 96px vertical padding between major sections!

### Component Spacing Rules
- Card padding: 32px (2xl)
- Section padding vertical: 96px minimum (4xl)
- Section padding horizontal: 48px desktop, 24px mobile
- Gap between cards: 24px
- Gap between columns: 48px desktop
- Button padding: 20px vertical, 40px horizontal
- Line gap in lists: 16px

---

## 📝 DIRECT RESPONSE COPYWRITING FRAMEWORK

### Formula: Problem → Agitate → Solution

**Example Pattern:**
```
HEADLINE: [Pain Point]. [Desired Outcome].
SUBHEAD: [How it was before] → [How it is now]
CTA: [Specific action with benefit]
```

### Section-by-Section Copy

#### Section 1: Hero
**Headline:** "Stop paying $10,000/year for e-signatures."
**Subhead:** "What used to cost enterprises thousands now costs $27. Once. Forever. Same features. Same security. 99.7% less expensive."
**CTA Primary:** "Get Enterprise Access — $27"
**CTA Secondary:** "See it in action (2-min demo)"

#### Section 3: Live Signature Demo
**Headline:** "Sign documents. Actually sign them."
**Pain Point:** "DocuSign charges $180/month. For what? A signature field?"
**Solution:** "Draw your signature below. Send for signing. Get it back in minutes. That's it."
**Benefit Bullets:**
- "What took 3 days now takes 3 minutes"
- "Stop printing, scanning, mailing"
- "Mobile-friendly. Sign anywhere, anytime"

#### Section 4: Resume Builder
**Headline:** "Land your next job in 5 minutes, not 5 hours."
**Pain:** "Spending hours tweaking resume layouts in Word?"
**Solution:** "Choose template. Type your info. Download PDF. Done."

#### Section 5: Invoice Generator
**Headline:** "Get paid faster. Stop chasing invoices."
**Benefit:** "Professional invoices in 60 seconds. Auto-calculate taxes. Send instantly. Track payments."

#### Section 6: Custom Domain
**Headline:** "Your domain. Your brand. Zero 'Powered by' badges."
**Value:** "sign.yourcompany.com — Looks like you built it yourself. Because branding matters."

### Pricing Copy (Critical!)
**Headline:** "Pay $27 once. Not $10,000/year."
**Subhead:** "DocuSign Enterprise: $10,000/year. HelloSign Business: $3,600/year. Adobe Sign: $2,400/year. MamaSign: $27. Once. Lifetime."
**Scarcity:** "This deal won't last. Lock in $27 now before it goes back to $497."

### Social Proof Examples
- "4,891 teams switched from DocuSign this month"
- "Saved $14,000 in year one" - Sarah Chen, VP Ops
- "ROI was 2 weeks" - Michael Rodriguez, CEO

---

## 🏗️ WEBSITE STRUCTURE (15+ SECTIONS)

### Section 1: Hero
- **Layout:** Full viewport height, centered content
- **Elements:**
  - Eyebrow badge: "More elegant than DocuSign, more affordable than HelloSign"
  - Headline: "Stop paying $10,000/year for e-signatures"
  - Subheadline: Pain → Solution messaging
  - 2 CTAs (primary + secondary)
  - Trust line: "No credit card • Free forever"
- **Spacing:** 96px top/bottom padding
- **Animation:** Subtle floating gradient orb (pulsing)

### Section 2: Trusted By
- **Layout:** Horizontal logo carousel
- **Elements:** 8+ company logos (Figma, Vercel, OpenAI, etc.)
- **Copy:** "TRUSTED BY TEAMS AT"
- **Spacing:** 48px top/bottom padding
- **Background:** Light gray (#fafafa)

### Section 3: Live Signature Demo (INTERACTIVE!)
- **Layout:** 2-column grid (50/50)
- **Left Column:**
  - Badge: "REPLACES DOCUSIGN ($2,160/YEAR)"
  - Headline: "Sign documents. Actually sign them."
  - Benefit bullets (5 items)
  - CTA button
- **Right Column:**
  - Browser window mockup
  - LIVE HTML5 Canvas for signature drawing
  - Custom domain in URL bar: "sign.yourcompany.com"
  - Clear button
  - Sign & Send button (disabled until signature drawn)
  - Success message on sign
- **Interactivity:**
  ```javascript
  // Canvas setup
  const canvas = document.getElementById('signature-canvas')
  const ctx = canvas.getContext('2d')

  // Mouse drawing
  let isDrawing = false
  canvas.addEventListener('mousedown', startDrawing)
  canvas.addEventListener('mousemove', draw)
  canvas.addEventListener('mouseup', stopDrawing)

  function startDrawing(e) {
    isDrawing = true
    ctx.beginPath()
    ctx.moveTo(e.offsetX, e.offsetY)
  }

  function draw(e) {
    if (!isDrawing) return
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.strokeStyle = '#8b5cf6' // Purple for light mode
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  function stopDrawing() {
    isDrawing = false
  }

  // Enable sign button when signature exists
  // Show success message on click
  ```
- **Spacing:** 128px top/bottom padding, 64px gap between columns
- **Background:** Teal accent (#14b8a6/10 opacity)

### Section 4: Live Resume Builder (INTERACTIVE!)
- **Layout:** 2-column grid (LEFT: demo, RIGHT: copy)
- **Left Column:**
  - Live input fields for Name and Job Title
  - Template switcher (3 buttons: Modern, Professional, Creative)
  - LIVE resume preview that updates as user types
  - Color changes with template selection
  - Download PDF button
- **Right Column:**
  - Badge: "REPLACES RESUME.IO ($99/YEAR)"
  - Headline: "Land your dream job in 5 minutes, not 5 hours."
  - Copy: "What used to take 2 hours now takes 5 minutes"
  - Benefit bullets
- **Interactivity:**
  ```javascript
  // Real-time name update
  document.getElementById('name-input').addEventListener('input', (e) => {
    document.getElementById('preview-name').textContent = e.target.value
  })

  // Template switcher
  const templates = [
    { color: '#8b5cf6', emoji: '✨' },
    { color: '#3b82f6', emoji: '💼' },
    { color: '#10b981', emoji: '🎨' }
  ]

  templateButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      document.getElementById('resume-header').style.background = templates[index].color
      document.getElementById('resume-emoji').textContent = templates[index].emoji
    })
  })
  ```
- **Spacing:** 128px padding, 64px column gap
- **Background:** Blue accent (#3b82f6/10)

### Section 5: Live Invoice Calculator (INTERACTIVE!)
- **Layout:** 2-column grid (LEFT: copy, RIGHT: demo)
- **Right Column:**
  - Invoice header with number
  - Line items list (editable amounts)
  - "+ Add Item" button (adds new row)
  - Subtotal calculation
  - Tax calculation (10% auto)
  - Grand total with animation
  - Remove item on hover (X button)
- **Interactivity:**
  ```javascript
  let items = [
    { name: 'Web Design', amount: 3500 },
    { name: 'Branding', amount: 1200 }
  ]

  function calculateTotal() {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const tax = Math.round(subtotal * 0.1)
    const total = subtotal + tax

    document.getElementById('subtotal').textContent = '$' + subtotal.toLocaleString()
    document.getElementById('tax').textContent = '$' + tax.toLocaleString()
    document.getElementById('grand-total').textContent = '$' + total.toLocaleString()
  }

  function addItem() {
    items.push({ name: `Service ${items.length + 1}`, amount: 1000 })
    renderItems()
    calculateTotal()
  }

  function removeItem(index) {
    items.splice(index, 1)
    renderItems()
    calculateTotal()
  }
  ```
- **Spacing:** 128px padding
- **Background:** Amber accent (#f59e0b/10)

### Section 6: Live Custom Domain (INTERACTIVE!)
- **Layout:** Centered, single column
- **Elements:**
  - Headline: "Your domain. Your brand. Your rules."
  - Text input for domain name
  - Browser window mockup showing: "sign.[YOUR-INPUT].com"
  - Updates in REAL-TIME as user types
- **Interactivity:**
  ```javascript
  document.getElementById('domain-input').addEventListener('input', (e) => {
    const domain = e.target.value.replace(/[^a-z0-9]/gi, '')
    document.getElementById('live-domain').textContent = `sign.${domain || 'yourcompany'}.com`
  })
  ```
- **Spacing:** 128px padding
- **Background:** Green accent (#10b981/10)

### Section 7: Document Verification (INTERACTIVE!)
- **Layout:** 2-column grid
- **Right Column:**
  - Drag & drop zone for PDF upload
  - Progress bar with percentage (animates 0% → 100%)
  - Verification badges (Hash Match, No Tampering, etc.)
  - "Verify Another" button
- **Interactivity:**
  ```javascript
  const dropZone = document.getElementById('drop-zone')

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.classList.add('drag-active')
  })

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      simulateVerification(file.name)
    }
  })

  function simulateVerification(filename) {
    let progress = 0
    const interval = setInterval(() => {
      progress += 2
      document.getElementById('progress-bar').style.width = progress + '%'
      document.getElementById('progress-text').textContent = progress + '%'

      if (progress >= 100) {
        clearInterval(interval)
        showVerifiedState()
      }
    }, 30)
  }
  ```
- **Spacing:** 128px padding
- **Background:** Red accent (#ef4444/10)

### Section 8: Analytics Dashboard (INTERACTIVE!)
- **Layout:** 2-column grid
- **Right Column:**
  - 3 animated progress bars (Documents Sent, Conversion Rate, Team Efficiency)
  - Bars continuously animate 0% → 100% and loop
  - Stats cards with numbers
- **Interactivity:**
  ```javascript
  let animationProgress = 0

  setInterval(() => {
    animationProgress = (animationProgress + 1) % 100

    document.getElementById('progress-1').style.width = animationProgress + '%'
    document.getElementById('progress-2').style.width = (animationProgress * 0.8) + '%'
    document.getElementById('progress-3').style.width = (animationProgress * 0.6) + '%'
  }, 50)
  ```
- **Spacing:** 128px padding
- **Background:** Indigo accent (#6366f1/10)

### Section 9: Team Collaboration
- **Layout:** 2-column grid
- **Elements:**
  - Team member cards with avatars
  - Active status indicators (green dot pulsing)
  - Role badges
- **Spacing:** 128px padding
- **Background:** Pink accent (#ec4899/10)

### Section 10: API Integration
- **Layout:** 2-column grid
- **Right Column:**
  - Code editor mockup with syntax highlighting
  - Tabs for different languages (JavaScript, Python, cURL)
  - Copy code button
- **Interactivity:**
  ```javascript
  const codeSamples = {
    javascript: `const response = await fetch('/api/documents/send', {
  method: 'POST',
  body: JSON.stringify({ signer: 'john@example.com' })
})`,
    python: `response = requests.post('/api/documents/send',
  json={'signer': 'john@example.com'}
)`,
    curl: `curl -X POST https://api.mamasign.com/documents/send \\
  -d '{"signer":"john@example.com"}'`
  }

  // Tab switching updates code display
  ```
- **Spacing:** 128px padding
- **Background:** Purple accent (#8b5cf6/10)

### Section 11: Pricing Comparison Table
- **Layout:** Centered table, 3 columns
- **Columns:** Feature | MamaSign | DocuSign
- **Rows:**
  - Price: $27 once vs $10,000/year
  - Unlimited signatures: ✓ vs ✓
  - Custom domain: ✓ vs $ Extra
  - White-label: ✓ vs $ Extra
  - API access: ✓ vs $ Extra
- **Visual:**
  - MamaSign column highlighted in green
  - DocuSign prices in red
  - Animated savings counter at bottom
- **Spacing:** 128px padding
- **Background:** White

### Section 12: Social Proof / Testimonials
- **Layout:** 3-column grid
- **Each Card:**
  - 5-star rating
  - Quote in italic
  - Avatar (initials in colored circle)
  - Name, role, company
  - Metric badge (e.g., "Saved $14,000/year")
- **Spacing:** 128px padding, 24px gap between cards
- **Background:** Light gray (#fafafa)

### Section 13: Feature Bento Grid (Notion-style)
- **Layout:** Asymmetric bento grid (various card sizes)
- **Cards:** 2x2 large, 1x1 small, 1x2 vertical, 2x1 horizontal
- **Each Card:**
  - Icon (64px)
  - Title
  - Description
  - Hover: Scale 1.02, shadow increase
- **Features:**
  1. Unlimited Signatures (large card)
  2. Team Collaboration (large card)
  3. Security & Compliance
  4. Template Library
  5. Mobile Apps
  6. Audit Logs
- **Spacing:** 24px gaps, 128px section padding
- **Background:** White

### Section 14: FAQ Accordion
- **Layout:** Centered, single column (max-width: 800px)
- **Elements:**
  - 8-10 expandable questions
  - Smooth expand/collapse animation
  - Chevron rotates on click
- **Interactivity:**
  ```javascript
  faqItems.forEach(item => {
    item.querySelector('.faq-header').addEventListener('click', () => {
      const isOpen = item.classList.contains('open')

      // Close all others
      faqItems.forEach(i => i.classList.remove('open'))

      // Toggle this one
      if (!isOpen) {
        item.classList.add('open')
        item.querySelector('.faq-body').style.maxHeight = item.querySelector('.faq-body').scrollHeight + 'px'
      }
    })
  })
  ```
- **Spacing:** 128px padding, 16px gap between questions
- **Background:** Light gray

### Section 15: Final CTA
- **Layout:** Centered, full-width
- **Elements:**
  - Headline: "Ready to stop overpaying?"
  - Subhead: Reinforcement of value
  - Large CTA button
  - Trust badges below (30-day guarantee, etc.)
- **Spacing:** 160px padding (extra large for impact)
- **Background:** Gradient (purple)

---

## 🎬 ANIMATION SPECIFICATIONS

### Continuous Animations (Never Stop!)

**1. Floating Gradient Orbs:**
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); opacity: 0.2; }
  50% { transform: translateY(-30px); opacity: 0.3; }
}

.gradient-orb {
  animation: float 10s ease-in-out infinite;
}
```

**2. Progress Bar Loop:**
```javascript
// Continuously animate from 0-100% and restart
function loopProgressBar() {
  let progress = 0
  setInterval(() => {
    progress = (progress + 1) % 101
    updateProgressBar(progress)
  }, 50)
}
```

**3. Pulsing Elements:**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.pulse-element {
  animation: pulse 3s ease-in-out infinite;
}
```

**4. Text Gradient Shift:**
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.gradient-text {
  background: linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease infinite;
}
```

---

## 🎯 INTERACTIVE COMPONENTS (Detailed Specs)

### Component A: Signature Canvas

**HTML Structure:**
```html
<div class="signature-section">
  <div class="browser-window">
    <div class="browser-chrome">
      <div class="browser-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="url-bar">
        <span class="lock-icon">🔒</span>
        <span class="url">sign.yourcompany.com</span>
      </div>
    </div>
    <div class="browser-content">
      <div class="document-header">
        <div class="doc-icon">📄</div>
        <div class="doc-info">
          <p class="doc-name">Enterprise_Agreement.pdf</p>
          <p class="doc-meta">Ready to sign</p>
        </div>
        <button class="clear-btn">Clear</button>
      </div>
      <canvas id="signature-canvas" width="600" height="200"></canvas>
      <p class="hint-text">✍️ Draw your signature with mouse or finger</p>
      <button id="sign-btn" class="primary-btn" disabled>
        ✓ Sign & Send
      </button>
      <div id="success-message" class="success-msg hidden">
        ✓ Document signed successfully!
      </div>
    </div>
  </div>
</div>
```

**Styling:**
```css
.signature-section {
  padding: 128px 48px;
  background: rgba(20, 184, 166, 0.05);
}

.browser-window {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.1);
  border: 1px solid #e5e5e5;
}

.browser-chrome {
  background: #f5f5f5;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  gap: 16px;
  align-items: center;
}

.browser-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ff5f57; }
.dot.yellow { background: #febc2e; }
.dot.green { background: #28c840; }

.url-bar {
  flex: 1;
  text-align: center;
  background: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
}

#signature-canvas {
  width: 100%;
  background: white;
  border: 2px dashed #8b5cf6;
  border-radius: 12px;
  cursor: crosshair;
}

.primary-btn {
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 18px;
  background: #000;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.primary-btn:hover:not(:disabled) {
  transform: scale(1.02);
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Component B: Resume Live Editor

**State Management:**
```javascript
let resumeState = {
  name: 'Sarah Johnson',
  title: 'Senior Product Designer',
  templateIndex: 0
}

const templates = [
  { name: 'Modern', color: '#8b5cf6', emoji: '✨' },
  { name: 'Professional', color: '#3b82f6', emoji: '💼' },
  { name: 'Creative', color: '#10b981', emoji: '🎨' }
]

function updateResume() {
  document.getElementById('preview-name').textContent = resumeState.name || 'Your Name'
  document.getElementById('preview-title').textContent = resumeState.title || 'Your Title'
  document.getElementById('preview-title').style.color = templates[resumeState.templateIndex].color
  document.getElementById('resume-header').style.background = templates[resumeState.templateIndex].color
}

// Auto-update on input
document.getElementById('name-input').oninput = (e) => {
  resumeState.name = e.target.value
  updateResume()
}
```

### Component C: Invoice Calculator

**Auto-Calculate Logic:**
```javascript
function renderInvoice() {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax

  // Update UI with smooth number animation
  animateNumber('subtotal-display', subtotal)
  animateNumber('tax-display', tax)
  animateNumber('total-display', total)
}

function animateNumber(elementId, targetValue) {
  const element = document.getElementById(elementId)
  const currentValue = parseInt(element.textContent.replace(/[$,]/g, '')) || 0
  const increment = (targetValue - currentValue) / 20
  let current = currentValue

  const timer = setInterval(() => {
    current += increment
    if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
      element.textContent = '$' + targetValue.toLocaleString()
      clearInterval(timer)
    } else {
      element.textContent = '$' + Math.floor(current).toLocaleString()
    }
  }, 20)
}
```

---

## 💬 DIRECT RESPONSE COPYWRITING (Section by Section)

### Pricing Section Copy
**Headline:** "Pay $27 once. Not $10,000/year."

**Comparison Table Copy:**
| Feature | DocuSign Enterprise | MamaSign |
|---------|-------------------|----------|
| **Price** | **$10,000/year** | **$27 once** |
| **Setup time** | 2 weeks | 2 minutes |
| **Signature limit** | Unlimited | Unlimited |
| **Team seats** | $50/user/month | Unlimited free |
| **Custom domain** | $200/month extra | Included |
| **White-label** | Enterprise only | Included |
| **API access** | $500/month extra | Included |

**Savings Copy:**
"Save $9,973 in year one. Save $49,973 over 5 years. That's enough to hire a developer, run ad campaigns, or actually grow your business."

### Testimonial Copy Examples

**Format:** [Specific metric] + [Emotional benefit] + [Authority]

1. "Switched from DocuSign. Saved $14,000 in year one. Same features, zero regrets. The one-time payment is a game-changer." — Sarah Chen, VP Operations, TechFlow Inc.

2. "ROI was 2 weeks. TWO WEEKS. We were paying DocuSign $180/month for 3 users. MamaSign gave us unlimited seats for $27 total." — Michael Rodriguez, CEO, GrowthLabs

3. "The custom branding alone justified the switch. Our clients see OUR brand, not 'Powered by MamaSign'. Feels premium." — Emily Park, Legal Director, Innovate Corp

### Feature Benefit Copy (Use This Pattern)

**Pattern:** [What it is] + [Why it matters] + [Specific outcome]

- **Unlimited signatures** → "Sign as many documents as you need" → "No limits. No overage fees. No surprises."

- **Custom domain** → "sign.yourcompany.com looks professional" → "Your clients never know you use MamaSign. That's the point."

- **Team collaboration** → "Unlimited seats at no extra cost" → "Add your entire company. 5 people or 500 people, same price: $27."

- **Analytics** → "See who opened, when, from where" → "Know exactly where deals get stuck. Fix bottlenecks. Close faster."

### CTA Copy (Specific, Action-Oriented)

**Primary CTAs:**
- "Get Enterprise for $27 — Save $9,973/year"
- "Start signing free — No card required"
- "Lock in $27 before price increases"

**Secondary CTAs:**
- "See it work (2-min demo)"
- "Compare to DocuSign"
- "Calculate your savings"

**Micro-Copy (Trust Builders):**
- "4,891 teams switched this month"
- "30-day money-back guarantee"
- "Price increases to $497 soon"
- "⚡ Most teams migrate in under 20 minutes"

---

## 📐 LAYOUT SPECIFICATIONS

### Grid System
- **Desktop:** 12-column grid, 24px gutters
- **Tablet:** 8-column grid, 16px gutters
- **Mobile:** 4-column grid, 16px gutters

### Container Widths
```css
.container {
  max-width: 1200px; /* Main content */
  margin: 0 auto;
  padding: 0 48px; /* Desktop */
}

.container-narrow {
  max-width: 800px; /* For focused content like FAQ */
}

.container-wide {
  max-width: 1400px; /* For feature showcases */
}

@media (max-width: 768px) {
  .container {
    padding: 0 24px; /* Mobile */
  }
}
```

### Section Padding (CRITICAL!)
```css
.section {
  padding: 128px 0; /* Large sections */
}

.section-medium {
  padding: 96px 0;
}

.section-small {
  padding: 64px 0; /* Logo carousel, etc. */
}
```

### Component Spacing
```css
.card {
  padding: 32px; /* Internal card padding */
  margin-bottom: 24px;
}

.grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px; /* Generous gap! */
}

.grid-3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
```

---

## 🎨 VISUAL HIERARCHY

### Emphasis Levels (Top to Bottom)
1. **Main Headline** (Hero): 76px, font-weight: 900, tight letter-spacing
2. **Section Headlines**: 48px, font-weight: 800
3. **Card Titles**: 28px, font-weight: 700
4. **Body Large**: 24px (subheadings)
5. **Body Regular**: 18px (descriptions)
6. **Body Small**: 14px (metadata, captions)

### Color Usage by Priority
1. **Primary Action** (CTAs): Solid black or accent color
2. **Secondary Action**: Outline button
3. **Tertiary**: Text link with arrow
4. **Disabled**: 40% opacity

---

## 🔧 TECHNICAL IMPLEMENTATION NOTES

### Performance
- Lazy load sections below fold
- Optimize images (WebP format, lazy loading)
- Minimize JavaScript (vanilla JS, no frameworks)
- Use CSS transforms for animations (GPU-accelerated)

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Alt text on all images
- Color contrast WCAG AA minimum

### Mobile Responsiveness
- Stack 2-column layouts on mobile
- Minimum touch target: 44x44px
- Font sizes scale down gracefully (clamp())
- Horizontal scroll prevented

---

## 📊 SUCCESS CRITERIA

The page is successful if:
1. ✅ First viewport has **massive whitespace** (not cramped)
2. ✅ User can **draw actual signature** on canvas
3. ✅ Resume updates **in real-time** as user types
4. ✅ Invoice totals **recalculate live** when items added/removed
5. ✅ Custom domain **changes instantly** when user types
6. ✅ Copy makes user think **"This is worth $10,000/year!"**
7. ✅ At least **15 scrollable sections**
8. ✅ **Every feature is interactive** (no screenshots!)
9. ✅ Spacing feels **Apple-quality** (generous, elegant)
10. ✅ User says **"WOW!"** when they see it

---

## 🚀 LOVABLE BUILD INSTRUCTIONS

### Step 1: Set Up Base HTML
Create index.html with semantic structure, meta tags, viewport settings

### Step 2: Implement Design System
CSS variables for colors, typography scale, spacing scale

### Step 3: Build Sections 1-5
Hero → Trusted By → Live Signature → Live Resume → Live Invoice

### Step 4: Build Sections 6-10
Custom Domain → Verification → Analytics → Team → API

### Step 5: Build Sections 11-15
Pricing Table → Testimonials → Bento Grid → FAQ → Final CTA

### Step 6: Add Interactivity
Canvas drawing, live inputs, animations, tab switching

### Step 7: Polish & Test
Spacing audit, copy review, mobile testing, animation smoothness

---

## ⚡ PRIORITY FEATURES

**Must-Have (P0):**
1. Live signature canvas that actually works
2. 96px+ spacing between ALL major sections
3. Direct response copy (pain → solution)
4. Custom domain feature (live typing)
5. 15+ sections total

**Nice-to-Have (P1):**
1. Smooth scroll animations
2. Video backgrounds (like Notion)
3. Carousel for testimonials
4. Dark mode toggle

---

## 📚 REFERENCE MATERIALS

Use these as inspiration:
- **Notion.com** - Clean design, vibrant colors, generous whitespace
- **CalendarJet.com** - Pricing comparison, direct response copy, length
- **Linear.app** - Typography, spacing, animations
- **Stripe.com** - Clean layouts, trust-building
- **Apple.com** - Whitespace mastery, product showcases

---

## ✅ FINAL CHECKLIST

Before considering the page complete:
- [ ] Can user draw signature and see success message?
- [ ] Can user edit resume name and see it update instantly?
- [ ] Can user add/remove invoice items and see totals recalculate?
- [ ] Can user type domain name and see it in URL bar?
- [ ] Is there AT LEAST 96px padding between every major section?
- [ ] Is body text minimum 18px (16px mobile)?
- [ ] Is line-height at least 1.5 for body text?
- [ ] Does copy focus on PAIN and BENEFITS, not just features?
- [ ] Are there 15+ scrollable sections?
- [ ] Does it feel worth $10,000/year for $27?
- [ ] Would user say "WOW!" when seeing it?

---

**BUILD THIS EXACTLY AS SPECIFIED. Every detail matters. Make it PERFECT.**
