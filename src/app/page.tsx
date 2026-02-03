'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  CheckCircle,
  Star,
  ArrowRight,
  Download,
  Sparkles,
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
      <div className="relative w-full h-full min-h-[400px] bg-white rounded-2xl p-8 shadow-2xl border border-[#4C00FF]/20 hover:border-[#4C00FF]/40 transition-all duration-300 cursor-pointer group">
        <div className="bg-white backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-gray-200 group-hover:border-[#4C00FF]/30 transition-all">
          <div className="bg-gradient-to-r from-[#4C00FF] to-[#8B5CF6] p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Resume Templates</span>
            </div>
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="p-6 grid grid-cols-2 gap-4 bg-gray-50">
            {templates.map((template, idx) => (
              <div key={idx} className="cursor-pointer block">
                <div className="bg-white rounded-lg p-3 border-2 border-gray-200 group-hover:border-[#4C00FF]/50 transition-all duration-300 transform group-hover:scale-[1.02]">
                  <div className="h-28 mb-2">
                    <ResumePreview type={template.name} color={template.color} />
                  </div>
                  <p className="text-xs font-medium text-[#26065D] text-center">{template.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 bg-gray-50">
            <div className="block w-full bg-gradient-to-r from-[#4C00FF] to-[#8B5CF6] text-white py-3 rounded-lg font-medium group-hover:shadow-lg group-hover:shadow-[#4C00FF]/30 transition-all text-center">
              Choose Template
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#4C00FF] to-[#8B5CF6] text-white px-4 py-2 rounded-full shadow-lg shadow-[#4C00FF]/30 flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold">ATS-Friendly</span>
        </div>
      </div>
    </Link>
  )
}

const SignDocumentMockup = () => {
  return (
    <Link href="/sign-document" className="block">
      <div className="relative w-full h-full min-h-[400px] bg-white rounded-2xl p-8 shadow-2xl border border-[#EC4899]/20 hover:border-[#EC4899]/40 transition-all duration-300 cursor-pointer group">
        <div className="bg-white backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-gray-200 group-hover:border-[#EC4899]/30 transition-all">
          <div className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileSignature className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Sign Document</span>
            </div>
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="p-6 bg-gray-50">
            <div className="bg-white rounded-lg p-6 border-2 border-dashed border-[#EC4899]/30 min-h-[200px] relative">
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="absolute bottom-6 right-6 bg-gradient-to-r from-[#EC4899]/10 to-[#8B5CF6]/10 border-2 border-[#EC4899]/50 rounded-lg p-4 w-40 group-hover:border-[#EC4899] transition-all">
                <div className="flex items-center justify-center space-x-2">
                  <FileSignature className="w-5 h-5 text-[#EC4899]" />
                  <span className="text-xs font-medium text-[#EC4899]">Sign Here</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-[#26065D]">John Doe</span>
                </div>
                <span className="text-xs text-green-600 font-medium">Signed</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-sm text-[#6B7280]">Jane Smith</span>
                </div>
                <span className="text-xs text-[#6B7280] font-medium">Pending</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white px-4 py-2 rounded-full shadow-lg shadow-[#EC4899]/30 flex items-center space-x-2">
          <Bell className="w-4 h-4" />
          <span className="text-sm font-semibold">Live Tracking</span>
        </div>
      </div>
    </Link>
  )
}

const InvoiceMockup = () => {
  return (
    <Link href="/create-invoice" className="block">
      <div className="relative w-full h-full min-h-[400px] bg-white rounded-2xl p-8 shadow-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer group">
        <div className="bg-white backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-gray-200 group-hover:border-emerald-500/30 transition-all">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Invoice #1234</span>
            </div>
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#26065D]">Your Company</p>
                  <p className="text-xs text-[#6B7280]">Professional Invoices</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6B7280]">Date</p>
                <p className="text-sm font-semibold text-[#26065D]">Dec 11, 2024</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between bg-white p-3 rounded border border-gray-200">
                <span className="text-sm text-[#26065D]">Service Item 1</span>
                <span className="text-sm font-medium text-[#26065D]">$500.00</span>
              </div>
              <div className="flex justify-between bg-white p-3 rounded border border-gray-200">
                <span className="text-sm text-[#26065D]">Service Item 2</span>
                <span className="text-sm font-medium text-[#26065D]">$750.00</span>
              </div>
            </div>
            <div className="border-t-2 border-gray-200 pt-3">
              <div className="flex justify-between items-center bg-gradient-to-r from-emerald-500 to-green-500 p-4 rounded-lg shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">Total</span>
                </div>
                <span className="text-2xl font-bold text-white">$1,250.00</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full shadow-lg shadow-emerald-500/30 flex items-center space-x-2">
          <Calculator className="w-4 h-4" />
          <span className="text-sm font-semibold">Auto-Calculate</span>
        </div>
      </div>
    </Link>
  )
}

const VerifyMockup = () => {
  return (
    <Link href="/verify" className="block">
      <div className="relative w-full h-full min-h-[400px] bg-white rounded-2xl p-8 shadow-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 cursor-pointer group">
        <div className="bg-white backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-gray-200 group-hover:border-orange-500/30 transition-all">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">PDF Verification</span>
            </div>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="p-6 bg-gray-50">
            <div className="bg-orange-50 rounded-lg p-6 border-2 border-dashed border-orange-500/30 mb-6 group-hover:border-orange-400/50 transition-all">
              <div className="flex flex-col items-center justify-center space-y-3">
                <FileCheck className="w-12 h-12 text-orange-600" />
                <p className="text-sm font-medium text-[#26065D]">document.pdf</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-[#26065D]">Hash Verified</p>
                    <p className="text-xs text-[#6B7280]">SHA-256 Match</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-[#26065D]">No Modifications</p>
                    <p className="text-xs text-[#6B7280]">Document Intact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg shadow-orange-500/30 flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-semibold">SHA-256</span>
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
    { name: 'PDF to Word', href: '/tools/pdf-to-word', icon: FileType, color: 'bg-blue-500', desc: 'Convert PDF to editable Word' },
    { name: 'PDF Compressor', href: '/tools/pdf-compressor', icon: Minimize2, color: 'bg-green-500', desc: 'Reduce PDF file size' },
    { name: 'Image to PDF', href: '/tools/image-to-pdf', icon: Image, color: 'bg-indigo-500', desc: 'Convert images to PDF' },
    { name: 'Signature Generator', href: '/tools/signature-generator', icon: PenTool, color: 'bg-pink-500', desc: 'Create digital signatures' },
    { name: 'PDF Merge', href: '/tools/pdf-merge', icon: Layers, color: 'bg-purple-500', desc: 'Combine multiple PDFs' },
    { name: 'PDF Split', href: '/tools/pdf-split', icon: Scissors, color: 'bg-red-500', desc: 'Split PDF into pages' },
    { name: 'Word to PDF', href: '/tools/word-to-pdf', icon: FileText, color: 'bg-cyan-500', desc: 'Convert Word to PDF' },
    { name: 'Watermark PDF', href: '/tools/watermark-pdf', icon: Droplets, color: 'bg-teal-500', desc: 'Add watermarks to PDFs' },
  ]

  const features = [
    {
      title: 'Resume Templates',
      subtitle: 'Professional Resume Builder',
      description: 'Create stunning resumes that get noticed by recruiters and pass ATS systems with ease.',
      href: '/templates',
      gradient: 'from-[#4C00FF] to-[#8B5CF6]',
      bgGradient: 'from-[#4C00FF]/10 to-[#8B5CF6]/10',
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
      gradient: 'from-[#EC4899] to-[#8B5CF6]',
      bgGradient: 'from-[#EC4899]/10 to-[#8B5CF6]/10',
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
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-500/10 to-green-500/10',
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
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10',
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
    {
      quote: "As a small business owner, MamaSign has been a game-changer. Professional invoices, easy contracts, all in one place. Highly recommend!",
      author: 'David Kim',
      role: 'Founder & CEO',
      company: 'Startup Labs',
      rating: 5,
      image: 'DK'
    },
    {
      quote: "The resume templates helped me land my dream job! ATS-friendly and beautiful designs. The whole platform is incredibly user-friendly.",
      author: 'Jessica Williams',
      role: 'Marketing Manager',
      company: 'Global Brands Inc.',
      rating: 5,
      image: 'JW'
    },
    {
      quote: "We process hundreds of documents monthly. MamaSign handles it all effortlessly. Customer support is also fantastic - always quick to help.",
      author: 'Robert Anderson',
      role: 'HR Director',
      company: 'Enterprise Corp',
      rating: 5,
      image: 'RA'
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

      {/* Trust Badges */}
      <section className={`py-6 border-y ${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-gray-50 border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {trustBadges.map((badge, index) => (
              <div key={index} className={`flex items-center justify-center gap-2 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                <badge.icon className={`w-5 h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                <span className="text-xs sm:text-sm font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-12 md:py-16 border-b ${isDark ? 'bg-[#1F1F1F] border-[#2a2a2a]' : 'bg-white border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={index} animation="scroll-reveal-scale" delay={index * 0.1}>
                <div className={`text-center p-4 md:p-6 rounded-xl transition-all duration-300 ${isDark ? 'hover:bg-[#c4ff0e]/10' : 'hover:bg-[#EDE5FF]/30'}`}>
                  <div className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Comparison Section */}
      <section className={`py-16 md:py-20 ${isDark ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 border ${isDark ? 'bg-green-900/30 text-green-400 border-green-700' : 'bg-green-100 text-green-700 border-green-200'}`}>
              <TrendingUp className="w-4 h-4" />
              Save 98% vs Competitors
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
              Why choose MamaSign over HelloSign & Adobe Sign?
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
              Get all premium features at a fraction of the cost. One-time payment, lifetime access.
            </p>
          </div>

          {/* Comparison Table - Desktop */}
          <div className="max-w-4xl mx-auto mb-12 hidden md:block">
            <div className={`rounded-2xl border-2 shadow-xl overflow-hidden ${isDark ? 'bg-[#252525] border-[#c4ff0e]' : 'bg-white border-[#4C00FF]'}`}>
              {/* Table Header */}
              <div className={`grid grid-cols-4 border-b ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`p-4 font-semibold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>Feature</div>
                <div className={`p-4 text-center border-x ${isDark ? 'bg-[#c4ff0e]/10 border-[#c4ff0e]/20' : 'bg-[#4C00FF]/10 border-[#4C00FF]/20'}`}>
                  <div className={`font-bold ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>MamaSign</div>
                  <div className={`text-xs ${isDark ? 'text-[#c4ff0e]/70' : 'text-[#4C00FF]/70'}`}>Recommended</div>
                </div>
                <div className={`p-4 text-center font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>HelloSign</div>
                <div className={`p-4 text-center font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Adobe Sign</div>
              </div>

              {/* Price Row */}
              <div className={`grid grid-cols-4 border-b ${isDark ? 'border-[#3a3a3a] bg-gradient-to-r from-green-900/20 to-[#252525]' : 'border-gray-100 bg-gradient-to-r from-green-50 to-white'}`}>
                <div className={`p-4 font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
                  Price
                </div>
                <div className={`p-4 text-center border-x ${isDark ? 'bg-[#c4ff0e]/5 border-[#c4ff0e]/10' : 'bg-[#4C00FF]/5 border-[#4C00FF]/10'}`}>
                  <div className={`text-2xl font-bold ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>$27</div>
                  <div className="text-xs text-green-600 font-semibold">LIFETIME</div>
                </div>
                <div className="p-4 text-center">
                  <div className={`text-xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>$180</div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>/year</div>
                </div>
                <div className="p-4 text-center">
                  <div className={`text-xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>$156</div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>/year</div>
                </div>
              </div>

              {/* Feature Rows */}
              {comparisonFeatures.map((row, index) => (
                <div key={row.feature} className={`grid grid-cols-4 border-b last:border-b-0 ${isDark ? (index % 2 === 0 ? 'bg-[#252525]' : 'bg-[#2a2a2a]/50') + ' border-[#3a3a3a]' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50') + ' border-gray-100'}`}>
                  <div className={`p-4 font-medium ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{row.feature}</div>
                  <div className={`p-4 flex items-center justify-center border-x ${isDark ? 'bg-[#c4ff0e]/5 border-[#c4ff0e]/10' : 'bg-[#4C00FF]/5 border-[#4C00FF]/10'}`}>
                    {typeof row.auradoc === 'boolean' ? (
                      row.auradoc ? (
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                          <Check className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                      ) : (
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDark ? 'bg-red-900/50' : 'bg-red-100'}`}>
                          <X className={`h-4 w-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                        </div>
                      )
                    ) : (
                      <span className={`text-sm font-medium ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>{row.auradoc}</span>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-center">
                    {typeof row.hellosign === 'boolean' ? (
                      row.hellosign ? (
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                          <Check className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                      ) : (
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDark ? 'bg-red-900/50' : 'bg-red-100'}`}>
                          <X className={`h-4 w-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                        </div>
                      )
                    ) : (
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{row.hellosign}</span>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-center">
                    {typeof row.adobesign === 'boolean' ? (
                      row.adobesign ? (
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                          <Check className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                      ) : (
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDark ? 'bg-red-900/50' : 'bg-red-100'}`}>
                          <X className={`h-4 w-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                        </div>
                      )
                    ) : (
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{row.adobesign}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table - Mobile */}
          <div className="md:hidden mb-12 space-y-4">
            {/* Price Cards Mobile */}
            <div className="grid grid-cols-3 gap-2">
              <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white'}`}>
                <div className="text-xs font-medium opacity-80">MamaSign</div>
                <div className="text-2xl font-bold">$27</div>
                <div className={`text-xs font-semibold ${isDark ? 'text-green-700' : 'text-green-300'}`}>LIFETIME</div>
              </div>
              <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`}>
                <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>HelloSign</div>
                <div className={`text-xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>$180</div>
                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>/year</div>
              </div>
              <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`}>
                <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Adobe Sign</div>
                <div className={`text-xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>$156</div>
                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>/year</div>
              </div>
            </div>

            {/* Feature List Mobile */}
            <div className={`rounded-2xl border shadow-lg overflow-hidden ${isDark ? 'bg-[#252525] border-[#3a3a3a]' : 'bg-white border-gray-200'}`}>
              {comparisonFeatures.map((row, index) => (
                <div key={row.feature} className={`p-4 border-b last:border-b-0 ${isDark ? (index % 2 === 0 ? 'bg-[#252525]' : 'bg-[#2a2a2a]') + ' border-[#3a3a3a]' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50') + ' border-gray-100'}`}>
                  <div className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{row.feature}</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="flex flex-col items-center">
                      <span className={`font-medium mb-1 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>MamaSign</span>
                      {typeof row.auradoc === 'boolean' ? (
                        row.auradoc ? (
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                            <Check className={`h-3 w-3 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                          </div>
                        ) : (
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center ${isDark ? 'bg-red-900/50' : 'bg-red-100'}`}>
                            <X className={`h-3 w-3 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                          </div>
                        )
                      ) : (
                        <span className={`font-medium ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>{row.auradoc}</span>
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>HelloSign</span>
                      {typeof row.hellosign === 'boolean' ? (
                        row.hellosign ? (
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                            <Check className={`h-3 w-3 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                          </div>
                        ) : (
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center ${isDark ? 'bg-red-900/50' : 'bg-red-100'}`}>
                            <X className={`h-3 w-3 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                          </div>
                        )
                      ) : (
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{row.hellosign}</span>
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Adobe</span>
                      {typeof row.adobesign === 'boolean' ? (
                        row.adobesign ? (
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                            <Check className={`h-3 w-3 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                          </div>
                        ) : (
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center ${isDark ? 'bg-red-900/50' : 'bg-red-100'}`}>
                            <X className={`h-3 w-3 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                          </div>
                        )
                      ) : (
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{row.adobesign}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 sm:p-8 text-center text-white">
              <div className="text-base sm:text-lg font-medium mb-2">5-Year Cost Comparison</div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white/20 rounded-xl p-3 sm:p-4">
                  <div className="text-xl sm:text-3xl font-bold">$27</div>
                  <div className="text-xs sm:text-sm opacity-90">MamaSign</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold">$900</div>
                  <div className="text-xs sm:text-sm opacity-80">HelloSign</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold">$780</div>
                  <div className="text-xs sm:text-sm opacity-80">Adobe Sign</div>
                </div>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                Save $753+ with MamaSign
              </div>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-white text-green-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base">
                Get Lifetime Access - $27
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Switching Banner */}
          <div className="max-w-3xl mx-auto mt-6 sm:mt-8">
            <div className={`rounded-xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left border ${isDark ? 'bg-[#c4ff0e]/10 border-[#c4ff0e]/20' : 'bg-[#EDE5FF] border-[#4C00FF]/20'}`}>
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#c4ff0e]/10' : 'bg-[#4C00FF]/10'}`}>
                  <Zap className={`h-5 w-5 sm:h-6 sm:w-6 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                </div>
                <div>
                  <div className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-[#26065D]'}`}>Switching from HelloSign or Adobe?</div>
                  <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Import all your templates in one click.</div>
                </div>
              </div>
              <Link href="/sign-up" className={`w-full md:w-auto inline-flex items-center justify-center gap-2 border px-4 py-2.5 rounded-lg font-medium transition-colors text-sm ${isDark ? 'border-[#c4ff0e]/30 text-[#c4ff0e] hover:bg-[#c4ff0e]/10' : 'border-[#4C00FF]/30 text-[#4C00FF] hover:bg-[#4C00FF]/10'}`}>
                Start Migration
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Free PDF Tools Section */}
      <section className={`py-12 md:py-16 ${isDark ? 'bg-[#252525]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 border ${isDark ? 'bg-[#c4ff0e]/10 text-[#c4ff0e] border-[#c4ff0e]/30' : 'bg-[#4C00FF]/10 text-[#4C00FF] border-[#4C00FF]/30'}`}>
              <Zap className="w-4 h-4" />
              100% Free - No Sign Up Required
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
              Free PDF Tools
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
              Powerful PDF tools that work directly in your browser. No uploads to servers, your files stay private.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {pdfTools.map((tool, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <Link
                  href={tool.href}
                  className={`group block p-4 md:p-6 rounded-xl border transition-all duration-300 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a] hover:border-[#c4ff0e]/50 hover:shadow-lg hover:shadow-[#c4ff0e]/10' : 'bg-white border-gray-200 hover:border-[#4C00FF]/50 hover:shadow-lg hover:shadow-[#4C00FF]/10'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]'}`}>
                    <tool.icon className={`w-6 h-6 ${isDark ? 'text-black' : 'text-white'}`} />
                  </div>
                  <h3 className={`font-semibold mb-1 transition-colors ${isDark ? 'text-white group-hover:text-[#c4ff0e]' : 'text-[#26065D] group-hover:text-[#4C00FF]'}`}>
                    {tool.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>{tool.desc}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className={`py-12 md:py-20 ${isDark ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12 md:mb-20">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
              Everything You Need in
              <span className={isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}> One Platform</span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
              Powerful tools designed to streamline your document workflow, from resume building to e-signatures to invoicing.
            </p>
          </ScrollReveal>

          <div className="space-y-16 md:space-y-24 lg:space-y-32">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0
              const MockupComponent = feature.mockup

              return (
                <div key={index} className="relative">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
                    <ScrollReveal
                      animation={isEven ? 'scroll-reveal-left' : 'scroll-reveal-right'}
                      className={`${!isEven ? 'lg:col-start-2' : ''} order-2 lg:order-none`}
                    >
                      <div className="mb-6 text-center lg:text-left">
                        <div className={`inline-block bg-gradient-to-r ${feature.gradient} text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg`}>
                          {feature.subtitle}
                        </div>
                        <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
                          {feature.title}
                        </h3>
                        <p className={`text-base md:text-lg mb-6 md:mb-8 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                          {feature.description}
                        </p>
                      </div>

                      <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start">
                            <div className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center mt-0.5 ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                              <CheckCircle className={`w-3 h-3 md:w-4 md:h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                            </div>
                            <span className={`ml-3 text-sm md:text-base lg:text-lg ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="text-center lg:text-left">
                        <Link
                          href={feature.href}
                          className={`inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-medium text-white bg-gradient-to-r ${feature.gradient} rounded-lg hover:shadow-lg hover:shadow-[#4C00FF]/30 transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-1`}
                        >
                          Try {feature.title}
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
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

                  <div className={`absolute top-1/2 -translate-y-1/2 -z-10 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r ${feature.bgGradient} rounded-full blur-3xl opacity-30 ${isEven ? '-left-32 md:-left-48' : '-right-32 md:-right-48'} hidden sm:block`}></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-12 md:py-20 border-y ${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-gray-50 border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-10 md:mb-16">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
              Trusted by 50,000+ Businesses Worldwide
            </h2>
            <p className={`text-base md:text-xl max-w-2xl mx-auto px-4 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
              See what our customers have to say about MamaSign.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className={`rounded-2xl p-6 md:p-8 border transition-all duration-500 ease-out transform hover:-translate-y-2 h-full ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a] hover:border-[#c4ff0e]/50 hover:shadow-xl hover:shadow-[#c4ff0e]/10' : 'bg-white border-gray-200 hover:border-[#4C00FF]/50 hover:shadow-xl hover:shadow-[#4C00FF]/10'}`}>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className={`mb-6 text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white'}`}>
                      {testimonial.image}
                    </div>
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{testimonial.author}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={`py-12 md:py-20 ${isDark ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
              Why Choose MamaSign?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`text-center p-6 rounded-2xl border transition-shadow ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a] hover:shadow-lg hover:shadow-[#c4ff0e]/10' : 'bg-white border-gray-200 hover:shadow-lg hover:shadow-[#4C00FF]/10'}`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${isDark ? 'bg-[#c4ff0e] shadow-[#c4ff0e]/30' : 'bg-[#4C00FF] shadow-[#4C00FF]/30'}`}>
                <Zap className={`w-8 h-8 ${isDark ? 'text-black' : 'text-white'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>Lightning Fast</h3>
              <p className={isDark ? 'text-gray-400' : 'text-[#6B7280]'}>Get documents signed in minutes, not days. Our streamlined process saves you time.</p>
            </div>
            <div className={`text-center p-6 rounded-2xl border transition-shadow ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a] hover:shadow-lg hover:shadow-[#c4ff0e]/10' : 'bg-white border-gray-200 hover:shadow-lg hover:shadow-[#4C00FF]/10'}`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${isDark ? 'bg-[#c4ff0e] shadow-[#c4ff0e]/30' : 'bg-[#4C00FF] shadow-[#4C00FF]/30'}`}>
                <Lock className={`w-8 h-8 ${isDark ? 'text-black' : 'text-white'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>Bank-Level Security</h3>
              <p className={isDark ? 'text-gray-400' : 'text-[#6B7280]'}>AES-256 encryption at rest, TLS in transit, and GDPR-ready infrastructure. Your documents are safe with us.</p>
            </div>
            <div className={`text-center p-6 rounded-2xl border transition-shadow ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a] hover:shadow-lg hover:shadow-[#c4ff0e]/10' : 'bg-white border-gray-200 hover:shadow-lg hover:shadow-[#4C00FF]/10'}`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${isDark ? 'bg-[#c4ff0e] shadow-[#c4ff0e]/30' : 'bg-[#4C00FF] shadow-[#4C00FF]/30'}`}>
                <Award className={`w-8 h-8 ${isDark ? 'text-black' : 'text-white'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>Legally Binding</h3>
              <p className={isDark ? 'text-gray-400' : 'text-[#6B7280]'}>Our e-signatures are legally valid in 180+ countries under ESIGN Act and eIDAS.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-12 md:py-20 relative overflow-hidden ${isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]'}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-10 left-10 w-48 md:w-72 h-48 md:h-72 rounded-full blur-3xl ${isDark ? 'bg-black/10' : 'bg-white/10'}`}></div>
          <div className={`absolute bottom-10 right-10 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl ${isDark ? 'bg-black/10' : 'bg-white/10'}`}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-black' : 'text-white'}`}>
            Ready to Transform Your Document Workflow?
          </h2>
          <p className={`text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto px-4 ${isDark ? 'text-black/70' : 'text-white/80'}`}>
            Join 50,000+ businesses who trust MamaSign for their document needs.
            Get started for free today - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Link
              href="/sign-document"
              className={`w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-medium rounded-lg shadow-lg transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-1 ${isDark ? 'text-[#c4ff0e] bg-black hover:bg-gray-900' : 'text-[#4C00FF] bg-white hover:bg-gray-100'}`}
            >
              Start Signing Free
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Link>
            <Link
              href="/templates"
              className={`w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-medium border-2 rounded-lg transition-all duration-500 ease-out ${isDark ? 'text-black border-black/30 hover:bg-black/10' : 'text-white border-white/30 hover:bg-white/10'}`}
            >
              Build Your Resume
            </Link>
          </div>
          <p className={`text-sm mt-6 ${isDark ? 'text-black/60' : 'text-white/60'}`}>No credit card required · Free plan available</p>
        </div>
      </section>

      {/* Floating Mobile CTA - Hidden on mobile since we have bottom nav */}
      <FloatingMobileCTA />
      </div>
    </>
  )
}

export default HomePage
