'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  FileSignature, CheckCircle, Star, ArrowRight, Download, Shield, Lock, Zap,
  Globe, Award, Users, Check, Eye, BarChart3, Clock, Sparkles, ShieldCheck,
  Send, CreditCard, FileText, PenTool, X, Code, Webhook, Box, Layers,
  Settings, Bell, Target, TrendingUp, Heart, MousePointerClick
} from 'lucide-react'

// ─── Cal.com Style: Grayscale + Purple Accent ───
// Colors: #141414 (dark), #F4F4F4 (light bg), #8b5cf6 (purple accent)

// ─── HERO SECTION (Cal.com Style) ───
const CalcomHero = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `
          linear-gradient(#141414 1px, transparent 1px),
          linear-gradient(90deg, #141414 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
      }} />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        {/* Main Headline - Cal Sans style */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 tracking-tight" style={{
          color: '#141414',
          letterSpacing: '-0.03em',
        }}>
          The Open Alternative to
          <br />
          <span style={{ color: '#8b5cf6' }}>DocuSign Enterprise</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          More affordable than DocuSign. More flexible than HelloSign.
          <br />
          MamaSign works and it feels just right.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/sign-up"
            className="px-8 py-4 rounded-lg font-semibold text-lg bg-[#141414] text-white hover:bg-[#2a2a2a] transition-colors"
          >
            Get started free
          </Link>
          <Link
            href="/demo"
            className="px-8 py-4 rounded-lg font-semibold text-lg text-[#141414] border-2 border-[#141414] hover:bg-[#F4F4F4] transition-colors"
          >
            Book a demo
          </Link>
        </div>

        <p className="text-sm text-gray-500">
          No credit card required • Free forever for individuals
        </p>
      </div>
    </section>
  )
}

// ─── SOCIAL PROOF QUOTE ───
const SocialProofQuote = () => (
  <section className="py-16 bg-[#F4F4F4]">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <div className="flex justify-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-6 h-6 fill-[#8b5cf6] text-[#8b5cf6]" />
        ))}
      </div>
      <blockquote className="text-2xl lg:text-3xl font-medium text-[#141414] mb-6 italic">
        "More elegant than DocuSign, more affordable than HelloSign.
        <br />
        MamaSign works and it feels just right."
      </blockquote>
      <cite className="text-gray-600 not-italic">
        — Sarah Chen, VP of Operations at TechFlow
      </cite>
    </div>
  </section>
)

// ─── BENTO GRID FEATURES (Cal.com's signature layout) ───
const BentoGridFeatures = () => {
  const [activeDemo, setActiveDemo] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo(d => (d + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black mb-6" style={{ color: '#141414', letterSpacing: '-0.02em' }}>
            Everything you need. <span style={{ color: '#8b5cf6' }}>Nothing you don't.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The complete e-signature platform. Built for teams who value simplicity.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Large Feature Card - Signature Demo */}
          <div className="lg:col-span-2 lg:row-span-2 p-8 rounded-2xl bg-[#F4F4F4] border border-gray-200 hover:border-[#8b5cf6] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#8b5cf6] flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#141414]">Sign anywhere, anytime</h3>
                <p className="text-gray-600 text-sm">Draw, type, or upload signatures</p>
              </div>
            </div>

            {/* Interactive Canvas Demo */}
            <div className="rounded-xl bg-white p-6 border border-gray-200">
              <p className="text-gray-500 text-sm mb-4">Document: Client_Agreement.pdf</p>
              <div className="h-32 rounded-lg bg-gray-50 border-2 border-dashed border-[#8b5cf6]/30 flex items-center justify-center mb-4">
                <p className="text-gray-400 text-sm">Click to sign</p>
              </div>
              <button className="w-full px-6 py-3 rounded-lg font-semibold bg-[#141414] text-white hover:bg-[#2a2a2a] transition-colors">
                Apply Signature
              </button>
            </div>
          </div>

          {/* Medium Cards */}
          <div className="p-6 rounded-2xl bg-[#F4F4F4] border border-gray-200 hover:border-[#8b5cf6] transition-all">
            <Users className="w-10 h-10 text-[#8b5cf6] mb-4" />
            <h3 className="text-lg font-bold text-[#141414] mb-2">Unlimited team</h3>
            <p className="text-gray-600 text-sm">No per-seat pricing. Ever.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4F4F4] border border-gray-200 hover:border-[#8b5cf6] transition-all">
            <Globe className="w-10 h-10 text-[#8b5cf6] mb-4" />
            <h3 className="text-lg font-bold text-[#141414] mb-2">Custom domain</h3>
            <p className="text-gray-600 text-sm">sign.yourcompany.com</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4F4F4] border border-gray-200 hover:border-[#8b5cf6] transition-all">
            <Sparkles className="w-10 h-10 text-[#8b5cf6] mb-4" />
            <h3 className="text-lg font-bold text-[#141414] mb-2">White-label</h3>
            <p className="text-gray-600 text-sm">Your brand, not ours</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4F4F4] border border-gray-200 hover:border-[#8b5cf6] transition-all">
            <Code className="w-10 h-10 text-[#8b5cf6] mb-4" />
            <h3 className="text-lg font-bold text-[#141414] mb-2">Full API</h3>
            <p className="text-gray-600 text-sm">Build anything</p>
          </div>

          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#F4F4F4] border border-gray-200 hover:border-[#8b5cf6] transition-all">
            <BarChart3 className="w-10 h-10 text-[#8b5cf6] mb-4" />
            <h3 className="text-lg font-bold text-[#141414] mb-3">Advanced analytics</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Sent', value: '1,247' },
                { label: 'Signed', value: '1,089' },
                { label: 'Pending', value: '158' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-3 rounded-lg bg-white">
                  <p className="text-2xl font-black text-[#141414]">{stat.value}</p>
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── INTEGRATIONS SECTION ───
const IntegrationsSection = () => {
  const integrations = [
    'Salesforce', 'HubSpot', 'Slack', 'Gmail', 'Drive', 'Dropbox',
    'Zapier', 'Notion', 'Airtable', 'Stripe', 'QuickBooks', 'Xero'
  ]

  return (
    <section className="py-24 bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black mb-6 text-[#141414]">
            Connects with everything you use
          </h2>
          <p className="text-xl text-gray-600">
            1,000+ integrations. Native connections to all major platforms.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {integrations.map((app, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-white border border-gray-200 hover:border-[#8b5cf6] hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <p className="font-semibold text-gray-700 text-center">{app}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/integrations"
            className="inline-flex items-center gap-2 text-[#8b5cf6] font-semibold hover:underline"
          >
            View all 1,000+ integrations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── WHY MAMASIGN SECTION ───
const WhyMamaSign = () => {
  const reasons = [
    {
      icon: Heart,
      title: 'Transparent pricing',
      desc: 'No hidden fees. No seat limits. $27 once, yours forever.',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise security',
      desc: 'SOC 2 Type II, GDPR, HIPAA-ready. Bank-level encryption.',
    },
    {
      icon: Code,
      title: 'API-first',
      desc: 'Full REST API. Webhooks. Build custom workflows.',
    },
    {
      icon: Globe,
      title: 'Works worldwide',
      desc: 'Legally binding in 180+ countries. Multi-language support.',
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black mb-6 text-[#141414]">
            Why teams choose MamaSign
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You're in charge of your documents, workflow, and appearance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, i) => (
            <div key={i} className="p-8 rounded-2xl bg-[#F4F4F4] hover:bg-white hover:shadow-xl border border-transparent hover:border-gray-200 transition-all duration-300">
              <reason.icon className="w-12 h-12 text-[#8b5cf6] mb-6" />
              <h3 className="text-2xl font-bold text-[#141414] mb-4">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── EMBED/IMPLEMENTATION SECTION ───
const ImplementationSection = () => {
  const [activeTab, setActiveTab] = useState(0)
  const methods = ['Embed', 'API', 'Zapier']

  return (
    <section className="py-24 bg-[#F4F4F4]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black mb-6 text-[#141414]">
            Multiple ways to use MamaSign
          </h2>
          <p className="text-xl text-gray-600">
            Embed in your site. Integrate via API. Connect with Zapier.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {methods.map((method, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === i
                  ? 'bg-[#141414] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-2xl bg-white border border-gray-200 p-8">
          {activeTab === 0 && (
            <div className="font-mono text-sm">
              <pre className="bg-[#141414] text-[#c4ff0e] p-6 rounded-lg overflow-x-auto">
{`<iframe
  src="https://sign.yourcompany.com/embed"
  width="100%"
  height="600"
></iframe>`}
              </pre>
            </div>
          )}
          {activeTab === 1 && (
            <div className="font-mono text-sm">
              <pre className="bg-[#141414] text-[#c4ff0e] p-6 rounded-lg overflow-x-auto">
{`const response = await fetch('/api/documents', {
  method: 'POST',
  body: JSON.stringify({
    signer: 'john@example.com',
    template: 'nda'
  })
})`}
              </pre>
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <p className="text-gray-600 mb-4">
                Connect MamaSign to 5,000+ apps without code. Automate your workflows.
              </p>
              <Link
                href="/integrations/zapier"
                className="inline-flex items-center gap-2 text-[#8b5cf6] font-semibold hover:underline"
              >
                View Zapier integration
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── CUSTOMIZATION SECTION ───
const CustomizationSection = () => {
  const [brandColor, setBrandColor] = useState('#8b5cf6')

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-[#141414]">
              Make it yours
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Custom branding. Your domain. Your logo. Your colors.
              <br />
              White-label everything.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                'Custom domain (sign.yourcompany.com)',
                'Upload your logo and favicon',
                'Match your brand colors',
                'Custom email templates',
                'Remove all MamaSign branding',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#8b5cf6] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/features/branding"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-[#141414] text-white hover:bg-[#2a2a2a] transition-colors"
            >
              Explore branding options
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Live Color Customizer */}
          <div className="rounded-2xl bg-[#F4F4F4] p-8 border border-gray-200">
            <div className="mb-6">
              <label className="block text-[#141414] font-semibold mb-3">
                Pick your brand color
              </label>
              <div className="flex gap-3">
                {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setBrandColor(color)}
                    className={`w-12 h-12 rounded-full transition-all ${
                      brandColor === color ? 'ring-4 ring-offset-2 ring-gray-400' : ''
                    }`}
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="rounded-xl bg-white p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg transition-all duration-300" style={{ background: brandColor }}>
                  <FileSignature className="w-5 h-5 text-white m-auto mt-2" />
                </div>
                <div>
                  <p className="font-bold text-[#141414]">Your Company</p>
                  <p className="text-gray-500 text-sm">sign.yourcompany.com</p>
                </div>
              </div>
              <button
                className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300"
                style={{ background: brandColor }}
              >
                Sign Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SECURITY & COMPLIANCE ───
const SecurityCompliance = () => (
  <section className="py-24 bg-[#F4F4F4]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-black mb-6 text-[#141414]">
          Enterprise-grade security
        </h2>
        <p className="text-xl text-gray-600">
          Built for teams who take compliance seriously.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: ShieldCheck, label: 'SOC 2 Type II', desc: 'Certified' },
          { icon: Lock, label: 'GDPR', desc: 'Compliant' },
          { icon: Shield, label: 'HIPAA', desc: 'Ready' },
          { icon: Award, label: 'ESIGN Act', desc: 'Certified' },
        ].map((item, i) => (
          <div key={i} className="p-8 rounded-2xl bg-white border border-gray-200 text-center">
            <item.icon className="w-12 h-12 text-[#8b5cf6] mx-auto mb-4" />
            <h3 className="font-bold text-[#141414] text-lg mb-2">{item.label}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── PRICING SECTION ───
const PricingSection = () => (
  <section className="py-24 lg:py-32 bg-white">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-black mb-6 text-[#141414]">
          Simple, transparent pricing
        </h2>
        <p className="text-xl text-gray-600">
          Pay once. Own forever. No surprises.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Tier */}
        <div className="p-8 rounded-2xl bg-[#F4F4F4] border border-gray-200">
          <h3 className="text-2xl font-bold text-[#141414] mb-2">Free</h3>
          <p className="text-4xl font-black text-[#141414] mb-6">$0</p>
          <ul className="space-y-3 mb-8">
            {['3 docs/month', 'Basic templates', 'Email support'].map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-600">
                <Check className="w-4 h-4 text-[#8b5cf6]" />
                {f}
              </li>
            ))}
          </ul>
          <button className="w-full px-6 py-3 rounded-lg font-semibold border-2 border-[#141414] text-[#141414] hover:bg-[#F4F4F4] transition-colors">
            Start free
          </button>
        </div>

        {/* Pro Tier */}
        <div className="p-8 rounded-2xl bg-[#8b5cf6] text-white relative overflow-hidden">
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
            BEST VALUE
          </div>
          <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
          <p className="text-5xl font-black mb-6">$27</p>
          <p className="text-white/80 mb-6">One-time payment</p>
          <ul className="space-y-3 mb-8">
            {['Unlimited docs', 'All features', 'Priority support', 'Custom domain', 'White-label', 'Full API'].map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                {f}
              </li>
            ))}
          </ul>
          <button className="w-full px-6 py-3 rounded-lg font-semibold bg-white text-[#8b5cf6] hover:bg-gray-100 transition-colors">
            Get enterprise
          </button>
        </div>

        {/* Teams */}
        <div className="p-8 rounded-2xl bg-[#F4F4F4] border border-gray-200">
          <h3 className="text-2xl font-bold text-[#141414] mb-2">Custom</h3>
          <p className="text-4xl font-black text-[#141414] mb-6">Let's talk</p>
          <ul className="space-y-3 mb-8">
            {['Volume pricing', 'Dedicated support', 'Custom features'].map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-600">
                <Check className="w-4 h-4 text-[#8b5cf6]" />
                {f}
              </li>
            ))}
          </ul>
          <button className="w-full px-6 py-3 rounded-lg font-semibold border-2 border-[#141414] text-[#141414] hover:bg-white transition-colors">
            Contact sales
          </button>
        </div>
      </div>
    </div>
  </section>
)

// ─── TESTIMONIALS ───
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Switched from DocuSign and never looked back. Same features, 99% less cost.",
      author: "Alex Kim",
      role: "CEO, StartupCo",
      avatar: "AK"
    },
    {
      quote: "The API is clean, docs are clear, support is fast. Everything just works.",
      author: "Maria Rodriguez",
      role: "CTO, DevTools",
      avatar: "MR"
    },
    {
      quote: "Custom domain was game-changer. Our clients see our brand, not MamaSign.",
      author: "James Wilson",
      role: "Legal Director",
      avatar: "JW"
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black mb-6 text-[#141414]">
            Loved by thousands
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 rounded-2xl bg-[#F4F4F4]">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#8b5cf6] text-[#8b5cf6]" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-[#141414] text-sm">{t.author}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ SECTION ───
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { q: 'Is MamaSign really free?', a: 'Yes. Free tier includes 3 documents per month. Upgrade to Enterprise for $27 one-time for unlimited everything.' },
    { q: 'Are signatures legally binding?', a: 'Yes. Compliant with ESIGN Act, eIDAS, and laws in 180+ countries. Full audit trail included.' },
    { q: 'Can I use my own domain?', a: 'Yes. Custom domain (sign.yourcompany.com) included in Enterprise plan.' },
    { q: 'Do you offer refunds?', a: '30-day money-back guarantee. No questions asked.' },
  ]

  return (
    <section className="py-24 bg-[#F4F4F4]">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl lg:text-5xl font-black mb-12 text-center text-[#141414]">
          Frequently asked questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl bg-white border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-[#141414]">{faq.q}</span>
                <ArrowRight
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-90' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-96 pb-5' : 'max-h-0'
                }`}
              >
                <p className="px-6 text-gray-600">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FINAL CTA ───
const FinalCTA = () => (
  <section className="py-24 lg:py-32 bg-white">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <h2 className="text-5xl lg:text-6xl font-black mb-8 text-[#141414]">
        Ready to get started?
      </h2>
      <p className="text-2xl text-gray-600 mb-12">
        Join 4,000+ teams using MamaSign.
        <br />
        Sign up in seconds.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/sign-up"
          className="px-10 py-5 rounded-lg font-bold text-xl bg-[#141414] text-white hover:bg-[#2a2a2a] transition-colors"
        >
          Get started free
        </Link>
        <Link
          href="/pricing"
          className="px-10 py-5 rounded-lg font-bold text-xl text-[#141414] border-2 border-[#141414] hover:bg-[#F4F4F4] transition-colors"
        >
          View pricing
        </Link>
      </div>

      <p className="text-gray-500 mt-8">
        No credit card required • 30-day money-back guarantee
      </p>
    </div>
  </section>
)

// ─── MAIN PAGE ───
export default function CalcomStylePage() {
  return (
    <main className="bg-white">
      <CalcomHero />
      <SocialProofQuote />
      <BentoGridFeatures />
      <IntegrationsSection />
      <WhyMamaSign />
      <ImplementationSection />
      <CustomizationSection />
      <SecurityCompliance />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
    </main>
  )
}
