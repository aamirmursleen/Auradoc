'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  CheckCircle,
  Star,
  ArrowRight,
  Download,
  FileSignature,
  Users,
  Bell,
  Shield,
  Calculator,
  CreditCard,
  Palette,
  ShieldCheck,
  FileCheck,
  Clock,
  Lock,
  Zap,
  Globe,
  Award,
  FileType,
  Image,
  Minimize2,
  PenTool,
  Layers,
  Scissors,
  Droplets,
  TrendingUp,
  X,
  Check,
} from 'lucide-react'
import HeroSection from '@/components/home/HeroSection'
import FloatingMobileCTA from '@/components/FloatingMobileCTA'
import { useTheme } from '@/components/ThemeProvider'
import MobileAppShell from '@/components/mobile/MobileAppShell'
import MobileHomeDashboard from '@/components/mobile/MobileHomeDashboard'

// Scroll Reveal Component
const ScrollReveal = ({
  children,
  className = '',
  animation = 'scroll-reveal',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  animation?: 'scroll-reveal' | 'scroll-reveal-left' | 'scroll-reveal-right' | 'scroll-reveal-scale'
  delay?: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${animation} ${isRevealed ? 'revealed' : ''} ${className}`}
      style={{ transitionDelay: delay ? `${delay}s` : undefined }}
    >
      {children}
    </div>
  )
}

// Realistic Resume Preview Component
const ResumePreview = ({ type, color }: { type: string; color: string }) => {
  const colors: { [key: string]: { header: string; accent: string } } = {
    cyan: { header: 'bg-cyan-500', accent: 'bg-cyan-400' },
    purple: { header: 'bg-purple-500', accent: 'bg-purple-400' },
    emerald: { header: 'bg-emerald-500', accent: 'bg-emerald-400' },
    orange: { header: 'bg-orange-500', accent: 'bg-orange-400' },
  }
  const c = colors[color] || colors.cyan

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
      <div className={`${c.header} h-8 relative`}>
        <div className="absolute -bottom-3 left-2 w-6 h-6 bg-gray-300 rounded-full border-2 border-white"></div>
      </div>
      <div className="p-2 pt-4">
        <div className="h-1.5 bg-gray-100 rounded w-16 mb-1"></div>
        <div className="h-1 bg-gray-400 rounded w-12 mb-2"></div>
        <div className={`h-1 ${c.accent} rounded w-10 mb-1`}></div>
        <div className="space-y-0.5 mb-2">
          <div className="h-0.5 bg-gray-300 rounded w-full"></div>
          <div className="h-0.5 bg-gray-300 rounded w-11/12"></div>
          <div className="h-0.5 bg-gray-300 rounded w-full"></div>
        </div>
        <div className={`h-1 ${c.accent} rounded w-8 mb-1`}></div>
        <div className="space-y-0.5">
          <div className="h-0.5 bg-gray-300 rounded w-full"></div>
          <div className="h-0.5 bg-gray-300 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  )
}

// Mockup Components
const TemplatesMockup = () => {
  const templates = [
    { name: 'Modern', color: 'cyan' },
    { name: 'Professional', color: 'purple' },
    { name: 'Creative', color: 'emerald' },
    { name: 'Executive', color: 'orange' },
  ]

  return (
    <Link href="/templates" className="block">
      <div className="relative w-full h-full min-h-[400px] bg-white rounded-xl p-8 border border-[#E8E0F0] hover:shadow-lg transition-all duration-300 cursor-pointer group" style={{ boxShadow: '0 1px 3px rgba(19,0,50,0.08)' }}>
        <div className="bg-white rounded-xl overflow-hidden border border-[#E8E0F0]">
          <div className="bg-[#4C00FF] p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Resume Templates</span>
            </div>
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="p-6 grid grid-cols-2 gap-4 bg-[#FAFAFA]">
            {templates.map((template, idx) => (
              <div key={idx} className="cursor-pointer block">
                <div className="bg-white rounded-lg p-3 border border-[#E8E0F0] group-hover:border-[#4C00FF]/30 transition-all duration-300">
                  <div className="h-28 mb-2">
                    <ResumePreview type={template.name} color={template.color} />
                  </div>
                  <p className="text-xs font-medium text-[#130032] text-center">{template.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 bg-[#FAFAFA]">
            <div className="block w-full bg-[#4C00FF] text-white py-3 rounded-lg font-medium text-center">
              Choose Template
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const SignDocumentMockup = () => {
  return (
    <Link href="/sign-document" className="block">
      <div className="relative w-full h-full min-h-[400px] bg-white rounded-xl p-8 border border-[#E8E0F0] hover:shadow-lg transition-all duration-300 cursor-pointer group" style={{ boxShadow: '0 1px 3px rgba(19,0,50,0.08)' }}>
        <div className="bg-white rounded-xl overflow-hidden border border-[#E8E0F0]">
          <div className="bg-[#4C00FF] p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileSignature className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Sign Document</span>
            </div>
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="p-6 bg-[#FAFAFA]">
            <div className="bg-white rounded-lg p-6 border-2 border-dashed border-[#4C00FF]/20 min-h-[200px] relative">
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="absolute bottom-6 right-6 bg-[#4C00FF]/5 border-2 border-[#4C00FF]/30 rounded-lg p-4 w-40 group-hover:border-[#4C00FF] transition-all">
                <div className="flex items-center justify-center space-x-2">
                  <FileSignature className="w-5 h-5 text-[#4C00FF]" />
                  <span className="text-xs font-medium text-[#4C00FF]">Sign Here</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-[#130032]">John Doe</span>
                </div>
                <span className="text-xs text-green-600 font-medium">Signed</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Jane Smith</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const InvoiceMockup = () => {
  return (
    <Link href="/create-invoice" className="block">
      <div className="relative w-full h-full min-h-[400px] bg-white rounded-xl p-8 border border-[#E8E0F0] hover:shadow-lg transition-all duration-300 cursor-pointer group" style={{ boxShadow: '0 1px 3px rgba(19,0,50,0.08)' }}>
        <div className="bg-white rounded-xl overflow-hidden border border-[#E8E0F0]">
          <div className="bg-emerald-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Invoice #1234</span>
            </div>
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="p-6 bg-[#FAFAFA]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#130032]">Your Company</p>
                  <p className="text-xs text-gray-500">Professional Invoices</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-semibold text-[#130032]">Dec 11, 2024</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between bg-white p-3 rounded border border-gray-200">
                <span className="text-sm text-[#130032]">Service Item 1</span>
                <span className="text-sm font-medium text-[#130032]">$500.00</span>
              </div>
              <div className="flex justify-between bg-white p-3 rounded border border-gray-200">
                <span className="text-sm text-[#130032]">Service Item 2</span>
                <span className="text-sm font-medium text-[#130032]">$750.00</span>
              </div>
            </div>
            <div className="border-t-2 border-gray-200 pt-3">
              <div className="flex justify-between items-center bg-emerald-600 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">Total</span>
                </div>
                <span className="text-2xl font-bold text-white">$1,250.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const VerifyMockup = () => {
  return (
    <Link href="/verify" className="block">
      <div className="relative w-full h-full min-h-[400px] bg-white rounded-xl p-8 border border-[#E8E0F0] hover:shadow-lg transition-all duration-300 cursor-pointer group" style={{ boxShadow: '0 1px 3px rgba(19,0,50,0.08)' }}>
        <div className="bg-white rounded-xl overflow-hidden border border-[#E8E0F0]">
          <div className="bg-orange-500 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">PDF Verification</span>
            </div>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="p-6 bg-[#FAFAFA]">
            <div className="bg-orange-50 rounded-lg p-6 border-2 border-dashed border-orange-300 mb-6">
              <div className="flex flex-col items-center justify-center space-y-3">
                <FileCheck className="w-12 h-12 text-orange-600" />
                <p className="text-sm font-medium text-[#130032]">document.pdf</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-[#130032]">Hash Verified</p>
                    <p className="text-xs text-gray-500">SHA-256 Match</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-[#130032]">No Modifications</p>
                    <p className="text-xs text-gray-500">Document Intact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const HomePage: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const stats = [
    { value: '10M+', label: 'Documents Signed' },
    { value: '50K+', label: 'Happy Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '150+', label: 'Countries' },
  ]

  const trustBadges = [
    { icon: Lock, label: 'AES-256 Encrypted' },
    { icon: Shield, label: 'GDPR Compliant' },
    { icon: Award, label: 'Secure Infrastructure' },
    { icon: Globe, label: 'Available Worldwide' },
  ]

  const pdfTools = [
    { name: 'PDF to Word', href: '/tools/pdf-to-word', icon: FileType, desc: 'Convert PDF to editable Word' },
    { name: 'PDF Compressor', href: '/tools/pdf-compressor', icon: Minimize2, desc: 'Reduce PDF file size' },
    { name: 'Image to PDF', href: '/tools/image-to-pdf', icon: Image, desc: 'Convert images to PDF' },
    { name: 'Signature Generator', href: '/tools/signature-generator', icon: PenTool, desc: 'Create digital signatures' },
    { name: 'PDF Merge', href: '/tools/pdf-merge', icon: Layers, desc: 'Combine multiple PDFs' },
    { name: 'PDF Split', href: '/tools/pdf-split', icon: Scissors, desc: 'Split PDF into pages' },
    { name: 'Word to PDF', href: '/tools/word-to-pdf', icon: FileText, desc: 'Convert Word to PDF' },
    { name: 'Watermark PDF', href: '/tools/watermark-pdf', icon: Droplets, desc: 'Add watermarks to PDFs' },
  ]

  const features = [
    {
      title: 'Resume Templates',
      subtitle: 'Professional Resume Builder',
      description: 'Create stunning resumes that get noticed by recruiters and pass ATS systems with ease.',
      href: '/templates',
      mockup: TemplatesMockup,
      benefits: [
        'Multiple professional designs',
        'Easy customization',
        'Instant PDF download',
        'ATS-friendly formats',
        'Mobile responsive editing',
      ],
    },
    {
      title: 'Sign Documents',
      subtitle: 'E-Signature Platform',
      description: 'Get documents signed faster with our secure, legally-binding electronic signature solution.',
      href: '/sign-document',
      mockup: SignDocumentMockup,
      benefits: [
        'Drag & drop signature fields',
        'Multiple signers support',
        'Real-time tracking & notifications',
        'Legally binding signatures',
        'Secure document storage',
      ],
    },
    {
      title: 'Create Invoice',
      subtitle: 'Professional Invoicing',
      description: 'Generate professional invoices in minutes with automatic calculations and custom branding.',
      href: '/create-invoice',
      mockup: InvoiceMockup,
      benefits: [
        'Professional invoice templates',
        'Auto-calculate totals & taxes',
        'Add your company branding',
        'Download as PDF',
        'Track payment status',
      ],
    },
    {
      title: 'Verify PDFs',
      subtitle: 'Document Verification',
      description: 'Ensure document integrity with cryptographic hash verification and tampering detection.',
      href: '/verify',
      mockup: VerifyMockup,
      benefits: [
        'SHA-256 hash verification',
        'Detect any modifications',
        'Register original documents',
        'Instant verification results',
        'Detailed tampering reports',
      ],
    },
  ]

  const testimonials = [
    {
      quote: "MamaSign has transformed how we handle contracts. What used to take days now takes minutes. The interface is intuitive and our clients love how easy it is to sign.",
      author: 'Sarah Johnson',
      role: 'Operations Director',
      company: 'TechFlow Solutions',
      rating: 5,
      image: 'SJ'
    },
    {
      quote: "The best e-signature solution we've used. Simple, secure, and incredibly fast. We've reduced our document turnaround time by 80% since switching to MamaSign.",
      author: 'Michael Chen',
      role: 'Legal Counsel',
      company: 'Chen & Associates',
      rating: 5,
      image: 'MC'
    },
    {
      quote: "Finally, an e-signature platform that just works. Our team loves it! The PDF tools are a bonus - we use the compressor daily for client deliverables.",
      author: 'Emily Rodriguez',
      role: 'Project Manager',
      company: 'Creative Agency Co.',
      rating: 5,
      image: 'ER'
    },
  ]

  // Comparison data for HelloSign and Adobe Sign
  const comparisonFeatures = [
    { feature: 'E-Signatures (Sign Documents)', auradoc: true, hellosign: true, adobesign: true },
    { feature: 'Unlimited Documents', auradoc: true, hellosign: '3/month', adobesign: '2/month' },
    { feature: 'Document Verification (SHA-256)', auradoc: true, hellosign: false, adobesign: false },
    { feature: 'PDF Watermarking', auradoc: true, hellosign: false, adobesign: 'Paid add-on' },
    { feature: 'Audit Trail & Certificates', auradoc: true, hellosign: true, adobesign: true },
    { feature: 'Multiple Signers', auradoc: true, hellosign: 'Paid only', adobesign: 'Paid only' },
    { feature: 'Templates', auradoc: 'Unlimited', hellosign: '5 max', adobesign: '5 max' },
    { feature: 'Free PDF Tools (7+ tools)', auradoc: true, hellosign: false, adobesign: false },
    { feature: 'Invoice Generator', auradoc: true, hellosign: false, adobesign: false },
    { feature: 'Resume Builder', auradoc: true, hellosign: false, adobesign: false },
    { feature: 'One-Time Payment', auradoc: true, hellosign: false, adobesign: false },
  ]

  const renderCheckOrX = (value: boolean | string, highlight?: boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
          <Check className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
        </div>
      ) : (
        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDark ? 'bg-red-900/50' : 'bg-red-100'}`}>
          <X className={`h-4 w-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
        </div>
      )
    }
    return <span className={`text-sm font-medium ${highlight ? (isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]') : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>{value}</span>
  }

  return (
    <>
      {/* Mobile App View - SaaS App UX */}
      <MobileAppShell>
        {/* Hero Section for Mobile */}
        <HeroSection variant="mobile" />
        {/* Mobile Dashboard Content */}
        <MobileHomeDashboard />
      </MobileAppShell>

      {/* Desktop Marketing View */}
      <div className={`hidden md:block overflow-hidden ${isDark ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
      {/* Hero Section */}
      <HeroSection variant="desktop" />

      {/* Trust Badges - Scrolling Logo Carousel */}
      <section className="py-6" style={{
        backgroundColor: isDark ? '#252525' : '#FFFFFF',
        borderTop: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0',
        borderBottom: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0',
      }}>
        <div className="marquee-container">
          <div className="marquee-track">
            {[...trustBadges, ...trustBadges, ...trustBadges, ...trustBadges].map((badge, index) => (
              <div key={index} className="flex items-center gap-2 mx-8 flex-shrink-0"
                style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19, 0, 50, 0.55)' }}>
                <badge.icon className="w-5 h-5 flex-shrink-0" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                <span className="text-sm font-medium whitespace-nowrap">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-24" style={{ backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={index} animation="scroll-reveal-scale" delay={index * 0.1}>
                <div className="text-center p-6">
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: isDark ? '#c4ff0e' : '#4C00FF', letterSpacing: '-1px' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19, 0, 50, 0.55)' }}>{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Comparison Section */}
      <section className="py-20 md:py-24" style={{ backgroundColor: isDark ? '#252525' : '#F8F5FF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>
              Compare Plans
            </p>
            <h2 className="text-3xl md:text-[2.5rem] font-bold mb-6" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px', lineHeight: '1.15' }}>
              Why choose MamaSign over HelloSign & Adobe Sign?
            </h2>
            <p className="text-lg" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19, 0, 50, 0.65)' }}>
              Get all premium features at a fraction of the cost. One-time payment, lifetime access.
            </p>
          </div>

          {/* Comparison Table - Desktop */}
          <div className="max-w-4xl mx-auto mb-16 hidden md:block">
            <div className="rounded-xl overflow-hidden" style={{
              border: isDark ? '1px solid #3a3a3a' : '1px solid #E8E0F0',
              boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 1px 3px rgba(19,0,50,0.08)',
            }}>
              {/* Table Header */}
              <div className="grid grid-cols-4" style={{
                backgroundColor: isDark ? '#2a2a2a' : '#FAFAFA',
                borderBottom: isDark ? '1px solid #3a3a3a' : '1px solid #E8E0F0',
              }}>
                <div className="p-5 font-semibold" style={{ color: isDark ? '#fff' : '#130032' }}>Feature</div>
                <div className="p-5 text-center" style={{
                  backgroundColor: isDark ? 'rgba(196,255,14,0.08)' : 'rgba(76,0,255,0.04)',
                  borderLeft: isDark ? '1px solid rgba(196,255,14,0.15)' : '1px solid rgba(76,0,255,0.1)',
                  borderRight: isDark ? '1px solid rgba(196,255,14,0.15)' : '1px solid rgba(76,0,255,0.1)',
                }}>
                  <div className="font-bold" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>MamaSign</div>
                  <div className="text-xs mt-0.5" style={{ color: isDark ? 'rgba(196,255,14,0.6)' : 'rgba(76,0,255,0.5)' }}>Recommended</div>
                </div>
                <div className="p-5 text-center font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19,0,50,0.55)' }}>HelloSign</div>
                <div className="p-5 text-center font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19,0,50,0.55)' }}>Adobe Sign</div>
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-4" style={{
                borderBottom: isDark ? '1px solid #3a3a3a' : '1px solid #E8E0F0',
              }}>
                <div className="p-5 font-semibold flex items-center gap-2" style={{ color: isDark ? '#fff' : '#130032' }}>
                  Price
                </div>
                <div className="p-5 text-center" style={{
                  backgroundColor: isDark ? 'rgba(196,255,14,0.05)' : 'rgba(76,0,255,0.02)',
                  borderLeft: isDark ? '1px solid rgba(196,255,14,0.1)' : '1px solid rgba(76,0,255,0.08)',
                  borderRight: isDark ? '1px solid rgba(196,255,14,0.1)' : '1px solid rgba(76,0,255,0.08)',
                }}>
                  <div className="text-2xl font-bold" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>$27</div>
                  <div className="text-xs text-green-600 font-semibold">LIFETIME</div>
                </div>
                <div className="p-5 text-center">
                  <div className="text-xl font-bold" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(19,0,50,0.7)' }}>$180</div>
                  <div className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)' }}>/year</div>
                </div>
                <div className="p-5 text-center">
                  <div className="text-xl font-bold" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(19,0,50,0.7)' }}>$156</div>
                  <div className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)' }}>/year</div>
                </div>
              </div>

              {/* Feature Rows */}
              {comparisonFeatures.map((row, index) => (
                <div key={row.feature} className="grid grid-cols-4" style={{
                  backgroundColor: isDark
                    ? index % 2 === 0 ? '#252525' : 'rgba(42,42,42,0.5)'
                    : index % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                  borderBottom: index < comparisonFeatures.length - 1 ? (isDark ? '1px solid #3a3a3a' : '1px solid #E8E0F0') : 'none',
                }}>
                  <div className="p-5 font-medium" style={{ color: isDark ? '#fff' : '#130032' }}>{row.feature}</div>
                  <div className="p-5 flex items-center justify-center" style={{
                    backgroundColor: isDark ? 'rgba(196,255,14,0.03)' : 'rgba(76,0,255,0.02)',
                    borderLeft: isDark ? '1px solid rgba(196,255,14,0.08)' : '1px solid rgba(76,0,255,0.05)',
                    borderRight: isDark ? '1px solid rgba(196,255,14,0.08)' : '1px solid rgba(76,0,255,0.05)',
                  }}>
                    {renderCheckOrX(row.auradoc, true)}
                  </div>
                  <div className="p-5 flex items-center justify-center">
                    {renderCheckOrX(row.hellosign)}
                  </div>
                  <div className="p-5 flex items-center justify-center">
                    {renderCheckOrX(row.adobesign)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table - Mobile */}
          <div className="md:hidden mb-12 space-y-4">
            {/* Price Cards Mobile */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: isDark ? '#c4ff0e' : '#4C00FF', color: isDark ? '#000' : '#fff' }}>
                <div className="text-xs font-medium opacity-80">MamaSign</div>
                <div className="text-2xl font-bold">$27</div>
                <div className="text-xs font-semibold" style={{ color: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)' }}>LIFETIME</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: isDark ? '#2a2a2a' : '#F3F4F6' }}>
                <div className="text-xs font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)' }}>HelloSign</div>
                <div className="text-xl font-bold" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(19,0,50,0.7)' }}>$180</div>
                <div className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)' }}>/year</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: isDark ? '#2a2a2a' : '#F3F4F6' }}>
                <div className="text-xs font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)' }}>Adobe Sign</div>
                <div className="text-xl font-bold" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(19,0,50,0.7)' }}>$156</div>
                <div className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)' }}>/year</div>
              </div>
            </div>

            {/* Feature List Mobile */}
            <div className="rounded-xl overflow-hidden" style={{ border: isDark ? '1px solid #3a3a3a' : '1px solid #E8E0F0' }}>
              {comparisonFeatures.map((row, index) => (
                <div key={row.feature} className="p-4" style={{
                  backgroundColor: isDark
                    ? index % 2 === 0 ? '#252525' : '#2a2a2a'
                    : index % 2 === 0 ? '#fff' : '#FAFAFA',
                  borderBottom: index < comparisonFeatures.length - 1 ? (isDark ? '1px solid #3a3a3a' : '1px solid #E8E0F0') : 'none',
                }}>
                  <div className="text-sm font-semibold mb-3" style={{ color: isDark ? '#fff' : '#130032' }}>{row.feature}</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="flex flex-col items-center">
                      <span className="font-medium mb-1" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>MamaSign</span>
                      {renderCheckOrX(row.auradoc, true)}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="mb-1" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)' }}>HelloSign</span>
                      {renderCheckOrX(row.hellosign)}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="mb-1" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)' }}>Adobe</span>
                      {renderCheckOrX(row.adobesign)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="max-w-2xl mx-auto">
            <div className="rounded-xl p-8 text-center" style={{
              backgroundColor: isDark ? '#c4ff0e' : '#4C00FF',
              color: isDark ? '#000' : '#fff',
            }}>
              <div className="text-lg font-medium mb-2" style={{ opacity: 0.8 }}>5-Year Cost Comparison</div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="rounded-lg p-4" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)' }}>
                  <div className="text-3xl font-bold">$27</div>
                  <div className="text-sm" style={{ opacity: 0.8 }}>MamaSign</div>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}>
                  <div className="text-2xl font-bold">$900</div>
                  <div className="text-sm" style={{ opacity: 0.7 }}>HelloSign</div>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}>
                  <div className="text-2xl font-bold">$780</div>
                  <div className="text-sm" style={{ opacity: 0.7 }}>Adobe Sign</div>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-6">
                Save $753+ with MamaSign
              </div>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors text-base"
                style={{
                  backgroundColor: isDark ? '#000' : '#fff',
                  color: isDark ? '#c4ff0e' : '#4C00FF',
                }}>
                Get Lifetime Access - $27
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Free PDF Tools Section */}
      <section className="py-20 md:py-24" style={{ backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>
              100% Free - No Sign Up Required
            </p>
            <h2 className="text-3xl md:text-[2.5rem] font-bold mb-6" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px', lineHeight: '1.15' }}>
              Free PDF Tools
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19, 0, 50, 0.65)' }}>
              Powerful PDF tools that work directly in your browser. No uploads to servers, your files stay private.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {pdfTools.map((tool, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <Link
                  href={tool.href}
                  className="group block p-6 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: isDark ? '#2a2a2a' : '#EDE5FF',
                    border: isDark ? '1px solid #3a3a3a' : '1px solid #CBC2FF',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 2rem 4rem rgba(19,0,50,0.2)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1 text-[15px]" style={{ color: isDark ? '#fff' : '#130032' }}>
                    {tool.name}
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19, 0, 50, 0.55)' }}>{tool.desc}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-20 md:py-24" style={{ backgroundColor: isDark ? '#252525' : '#F8F5FF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-[2.5rem] font-bold mb-6" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px', lineHeight: '1.15' }}>
              Everything You Need in
              <span style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}> One Platform</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19, 0, 50, 0.65)' }}>
              Powerful tools designed to streamline your document workflow, from resume building to e-signatures to invoicing.
            </p>
          </ScrollReveal>

          <div className="space-y-24 lg:space-y-32">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0
              const MockupComponent = feature.mockup

              return (
                <div key={index} className="relative">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
                    <ScrollReveal
                      animation={isEven ? 'scroll-reveal-left' : 'scroll-reveal-right'}
                      className={`${!isEven ? 'lg:col-start-2' : ''} order-2 lg:order-none`}
                    >
                      <div className="mb-6 text-center lg:text-left">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>
                          {feature.subtitle}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px' }}>
                          {feature.title}
                        </h3>
                        <p className="text-base md:text-lg mb-8" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19, 0, 50, 0.65)' }}>
                          {feature.description}
                        </p>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: isDark ? 'rgba(34,197,94,0.2)' : 'rgba(16,185,129,0.1)' }}>
                              <CheckCircle className="w-3.5 h-3.5" style={{ color: isDark ? '#22C55E' : '#10B981' }} />
                            </div>
                            <span className="ml-3 text-base" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19, 0, 50, 0.65)' }}>{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="text-center lg:text-left">
                        <Link
                          href={feature.href}
                          className="inline-flex items-center text-base font-medium transition-colors duration-200"
                          style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}
                        >
                          Try {feature.title}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </ScrollReveal>

                    <ScrollReveal
                      animation={isEven ? 'scroll-reveal-right' : 'scroll-reveal-left'}
                      delay={0.2}
                      className={`${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''} order-1 lg:order-none`}
                    >
                      <div className="relative max-w-md mx-auto lg:max-w-none">
                        <MockupComponent />
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-24" style={{ backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-[2.5rem] font-bold mb-6" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px', lineHeight: '1.15' }}>
              Trusted by Businesses Worldwide
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19, 0, 50, 0.65)' }}>
              See what our customers have to say about MamaSign.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="rounded-xl p-8 h-full transition-all duration-200" style={{
                  backgroundColor: isDark ? '#2a2a2a' : '#EDE5FF',
                  border: isDark ? '1px solid #3a3a3a' : '1px solid #CBC2FF',
                }}>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="mb-8 text-base leading-relaxed italic" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19, 0, 50, 0.65)' }}>
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{
                      backgroundColor: isDark ? '#c4ff0e' : '#4C00FF',
                      color: isDark ? '#000' : '#fff',
                    }}>
                      {testimonial.image}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: isDark ? '#fff' : '#130032' }}>{testimonial.author}</p>
                      <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19, 0, 50, 0.45)' }}>{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-24" style={{ backgroundColor: isDark ? '#252525' : '#F8F5FF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-[2.5rem] font-bold mb-6" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px', lineHeight: '1.15' }}>
              Why Choose MamaSign?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Get documents signed in minutes, not days. Our streamlined process saves you time.' },
              { icon: Lock, title: 'Bank-Level Security', desc: 'AES-256 encryption at rest, TLS in transit, and GDPR-ready infrastructure.' },
              { icon: Award, title: 'Legally Binding', desc: 'Our e-signatures are legally valid in 180+ countries under ESIGN Act and eIDAS.' },
            ].map((item, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="text-center p-8 rounded-xl transition-all duration-200" style={{
                  backgroundColor: isDark ? '#2a2a2a' : '#FFFFFF',
                  border: isDark ? '1px solid #3a3a3a' : '1px solid #E8E0F0',
                  boxShadow: '0 1px 3px rgba(19,0,50,0.08)',
                }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5" style={{
                    backgroundColor: isDark ? '#c4ff0e' : '#4C00FF',
                  }}>
                    <item.icon className="w-7 h-7" style={{ color: isDark ? '#000' : '#fff' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: isDark ? '#fff' : '#130032' }}>{item.title}</h3>
                  <p className="text-base leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19, 0, 50, 0.65)' }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24" style={{ backgroundColor: isDark ? '#1F1F1F' : '#130032' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-[2.5rem] font-bold mb-6" style={{ color: '#fff', letterSpacing: '-0.5px', lineHeight: '1.15' }}>
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Join 50,000+ businesses who trust MamaSign for their document needs.
            Get started for free today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-document"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg transition-all duration-200"
              style={{
                backgroundColor: isDark ? '#c4ff0e' : '#FFFFFF',
                color: isDark ? '#000' : '#130032',
              }}
            >
              Start Signing Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg transition-all duration-200"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                backgroundColor: 'transparent',
              }}
            >
              Build Your Resume
            </Link>
          </div>
          <p className="text-sm mt-6" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>No credit card required</p>
        </div>
      </section>

      {/* Floating Mobile CTA - Hidden on mobile since we have bottom nav */}
      <FloatingMobileCTA />
      </div>
    </>
  )
}

export default HomePage
