'use client'

import React from 'react'
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
  AlertTriangle,
  FileCheck,
  Clock,
} from 'lucide-react'
import HeroSection from '@/components/home/HeroSection'

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
      {/* Header with photo placeholder */}
      <div className={`${c.header} h-8 relative`}>
        <div className="absolute -bottom-3 left-2 w-6 h-6 bg-gray-300 rounded-full border-2 border-white"></div>
      </div>
      {/* Content */}
      <div className="p-2 pt-4">
        {/* Name */}
        <div className="h-1.5 bg-gray-100 rounded w-16 mb-1"></div>
        <div className="h-1 bg-gray-400 rounded w-12 mb-2"></div>
        {/* Section */}
        <div className={`h-1 ${c.accent} rounded w-10 mb-1`}></div>
        <div className="space-y-0.5 mb-2">
          <div className="h-0.5 bg-gray-300 rounded w-full"></div>
          <div className="h-0.5 bg-gray-300 rounded w-11/12"></div>
          <div className="h-0.5 bg-gray-300 rounded w-full"></div>
        </div>
        {/* Another Section */}
        <div className={`h-1 ${c.accent} rounded w-8 mb-1`}></div>
        <div className="space-y-0.5">
          <div className="h-0.5 bg-gray-300 rounded w-full"></div>
          <div className="h-0.5 bg-gray-300 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  )
}

// Mockup Components - Dark Theme
const TemplatesMockup = () => {
  const templates = [
    { name: 'Modern', color: 'cyan' },
    { name: 'Professional', color: 'purple' },
    { name: 'Creative', color: 'emerald' },
    { name: 'Executive', color: 'orange' },
  ]

  return (
    <Link href="/templates" className="block">
      <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-gray-100 to-white rounded-2xl p-8 shadow-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer group">
        <div className="bg-gray-100/80 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-gray-200/50 group-hover:border-cyan-500/30 transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-900" />
              <span className="text-gray-900 font-semibold">Resume Templates</span>
            </div>
            <Download className="w-5 h-5 text-gray-900" />
          </div>

          {/* Template Grid with Realistic Previews */}
          <div className="p-6 grid grid-cols-2 gap-4">
            {templates.map((template, idx) => (
              <div key={idx} className="cursor-pointer block">
                <div className="bg-gray-50/50 rounded-lg p-3 border-2 border-gray-600 group-hover:border-cyan-400/50 transition-all duration-300 transform group-hover:scale-[1.02]">
                  <div className="h-28 mb-2">
                    <ResumePreview type={template.name} color={template.color} />
                  </div>
                  <p className="text-xs font-medium text-gray-700 text-center">{template.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="px-6 pb-6">
            <div className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-gray-900 py-3 rounded-lg font-medium group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all text-center">
              Choose Template
            </div>
          </div>
        </div>

        {/* Floating Badge */}
        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-gray-900 px-4 py-2 rounded-full shadow-lg shadow-cyan-500/30 flex items-center space-x-2">
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
      <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-gray-100 to-white rounded-2xl p-8 shadow-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer group">
        <div className="bg-gray-100/80 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-gray-200/50 group-hover:border-purple-500/30 transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileSignature className="w-5 h-5 text-gray-900" />
              <span className="text-gray-900 font-semibold">Sign Document</span>
            </div>
            <Users className="w-5 h-5 text-gray-900" />
          </div>

          {/* Document Preview */}
          <div className="p-6">
            <div className="bg-gray-50/50 rounded-lg p-6 border-2 border-dashed border-purple-500/30 min-h-[200px] relative">
              <div className="space-y-3">
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              </div>

              {/* Signature Placeholder */}
              <div className="absolute bottom-6 right-6 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-500/50 rounded-lg p-4 w-40 group-hover:border-purple-400 transition-all">
                <div className="flex items-center justify-center space-x-2">
                  <FileSignature className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Sign Here</span>
                </div>
              </div>
            </div>

            {/* Signers */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between bg-purple-100 p-3 rounded-lg border border-purple-500/20">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">John Doe</span>
                </div>
                <span className="text-xs text-purple-600 font-medium">Signed</span>
              </div>
              <div className="flex items-center justify-between bg-gray-100/50 p-3 rounded-lg border border-gray-200/50">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Jane Smith</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Badge */}
        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-gray-900 px-4 py-2 rounded-full shadow-lg shadow-purple-500/30 flex items-center space-x-2">
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
      <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-gray-100 to-white rounded-2xl p-8 shadow-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer group">
        <div className="bg-gray-100/80 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-gray-200/50 group-hover:border-emerald-500/30 transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-gray-900" />
              <span className="text-gray-900 font-semibold">Invoice #1234</span>
            </div>
            <Download className="w-5 h-5 text-gray-900" />
          </div>

          {/* Invoice Content */}
          <div className="p-6">
            {/* Company Branding */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Palette className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Your Company</p>
                  <p className="text-xs text-gray-600">Professional Invoices</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-semibold text-gray-700">Dec 11, 2024</p>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between bg-gray-50/50 p-3 rounded border border-gray-200/50">
                <span className="text-sm text-gray-700">Service Item 1</span>
                <span className="text-sm font-medium text-gray-900">$500.00</span>
              </div>
              <div className="flex justify-between bg-gray-50/50 p-3 rounded border border-gray-200/50">
                <span className="text-sm text-gray-700">Service Item 2</span>
                <span className="text-sm font-medium text-gray-900">$750.00</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-200 pt-3">
              <div className="flex justify-between items-center bg-gradient-to-r from-emerald-500 to-green-500 p-4 rounded-lg shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-gray-900" />
                  <span className="text-gray-900 font-semibold">Total</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">$1,250.00</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4 flex justify-center">
              <div className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/30">
                Ready to Send
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Calculate Badge */}
        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-green-500 text-gray-900 px-4 py-2 rounded-full shadow-lg shadow-emerald-500/30 flex items-center space-x-2">
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
      <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-gray-100 to-white rounded-2xl p-8 shadow-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 cursor-pointer group">
        <div className="bg-gray-100/80 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-gray-200/50 group-hover:border-orange-500/30 transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-gray-900" />
              <span className="text-gray-900 font-semibold">PDF Verification</span>
            </div>
            <Shield className="w-5 h-5 text-gray-900" />
          </div>

          {/* Verification Process */}
          <div className="p-6">
            {/* Upload Area */}
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-lg p-6 border-2 border-dashed border-orange-500/30 mb-6 group-hover:border-orange-400/50 transition-all">
              <div className="flex flex-col items-center justify-center space-y-3">
                <FileCheck className="w-12 h-12 text-orange-600" />
                <p className="text-sm font-medium text-gray-700">document.pdf</p>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full w-full"></div>
                </div>
                <p className="text-xs text-gray-500">Analyzing...</p>
              </div>
            </div>

            {/* Verification Results */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-emerald-100 p-4 rounded-lg border border-emerald-500/30">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hash Verified</p>
                    <p className="text-xs text-gray-600">SHA-256 Match</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-emerald-100 p-4 rounded-lg border border-emerald-500/30">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">No Modifications</p>
                    <p className="text-xs text-gray-600">Document Intact</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-orange-900/30 p-4 rounded-lg border border-orange-500/30">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Timestamp</p>
                    <p className="text-xs text-gray-600">Dec 11, 2024 10:30 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-gray-900 px-4 py-2 rounded-full shadow-lg shadow-orange-500/30 flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-semibold">SHA-256</span>
        </div>
      </div>
    </Link>
  )
}

const HomePage: React.FC = () => {
  const stats = [
    { value: '10M+', label: 'Documents Signed' },
    { value: '50K+', label: 'Happy Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '150+', label: 'Countries' },
  ]

  const features = [
    {
      title: 'Resume Templates',
      subtitle: 'Professional Resume Builder',
      description: 'Create stunning resumes that get noticed by recruiters and pass ATS systems with ease.',
      href: '/templates',
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-500/10 to-blue-600/10',
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
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
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
      quote: "MamaSign has transformed how we handle contracts. What used to take days now takes minutes.",
      author: 'Sarah Johnson',
      rating: 5,
    },
    {
      quote: "The best e-signature solution we've used. Simple, secure, and incredibly fast.",
      author: 'Michael Chen',
      rating: 5,
    },
    {
      quote: "Finally, an e-signature platform that just works. Our team loves it!",
      author: 'Emily Rodriguez',
      rating: 5,
    },
  ]

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gray-50/50 border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 md:p-6 rounded-xl hover:bg-gray-100/30 transition-all duration-300">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase Section - Dark Theme */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"> One Platform</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Powerful tools designed to streamline your document workflow, from resume building to e-signatures to invoicing.
            </p>
          </div>

          <div className="space-y-16 md:space-y-24 lg:space-y-32">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0
              const MockupComponent = feature.mockup

              return (
                <div key={index} className="relative">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
                    {/* Content Side */}
                    <div className={`${!isEven ? 'lg:col-start-2' : ''} order-2 lg:order-none`}>
                      <div className="mb-6 text-center lg:text-left">
                        <div className={`inline-block bg-gradient-to-r ${feature.gradient} text-gray-900 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg`}>
                          {feature.subtitle}
                        </div>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                          {feature.title}
                        </h3>
                        <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
                          {feature.description}
                        </p>
                      </div>

                      <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start">
                            <div className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mt-0.5 shadow-lg`}>
                              <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-gray-900" />
                            </div>
                            <span className="ml-3 text-gray-700 text-sm md:text-base lg:text-lg">{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="text-center lg:text-left">
                        <Link
                          href={feature.href}
                          className={`inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-medium text-gray-900 bg-gradient-to-r ${feature.gradient} rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-1`}
                        >
                          Try {feature.title}
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                        </Link>
                      </div>
                    </div>

                    {/* Mockup Side */}
                    <div className={`${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''} order-1 lg:order-none`}>
                      <div className="relative max-w-md mx-auto lg:max-w-none">
                        <MockupComponent />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Background Element */}
                  <div className={`absolute top-1/2 -translate-y-1/2 -z-10 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r ${feature.bgGradient} rounded-full blur-3xl opacity-30 ${isEven ? '-left-32 md:-left-48' : '-right-32 md:-right-48'} hidden sm:block`}></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-gray-50/50 border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Businesses Worldwide
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              See what our customers have to say about MamaSign.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-100/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-gray-200/50 hover:border-cyan-500/30 hover:bg-gray-100/70 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-500 ease-out transform hover:-translate-y-2"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-48 md:w-72 h-48 md:h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-base md:text-xl text-gray-900/80 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of businesses who trust MamaSign for their document needs.
            Get started for free today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Link
              href="/sign-document"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-medium text-gray-900 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-1"
            >
              Start Signing Free
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Link>
            <Link
              href="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-medium text-gray-900 border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-500 ease-out"
            >
              Build Your Resume
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
