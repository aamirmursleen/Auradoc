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

// Mockup Components
const TemplatesMockup = () => {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-2xl border border-blue-100">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Resume Templates</span>
          </div>
          <Download className="w-5 h-5 text-white" />
        </div>

        {/* Template Grid */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {['Modern', 'Professional', 'Creative', 'Executive'].map((template, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-400 transition-all transform hover:scale-105">
                <div className="h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded mb-2 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-xs font-medium text-gray-700 text-center">{template}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6">
          <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all">
            Choose Template
          </button>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-semibold">ATS-Friendly</span>
      </div>
    </div>
  )
}

const SignDocumentMockup = () => {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-2xl border border-purple-100">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileSignature className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Sign Document</span>
          </div>
          <Users className="w-5 h-5 text-white" />
        </div>

        {/* Document Preview */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-purple-200 min-h-[200px] relative">
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>

            {/* Signature Placeholder */}
            <div className="absolute bottom-6 right-6 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-lg p-4 w-40">
              <div className="flex items-center justify-center space-x-2">
                <FileSignature className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-medium text-purple-600">Sign Here</span>
              </div>
            </div>
          </div>

          {/* Signers */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-700">John Doe</span>
              </div>
              <span className="text-xs text-purple-600 font-medium">Signed</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Jane Smith</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Badge */}
      <div className="absolute -top-4 -right-4 bg-purple-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
        <Bell className="w-4 h-4" />
        <span className="text-sm font-semibold">Live Tracking</span>
      </div>
    </div>
  )
}

const InvoiceMockup = () => {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-2xl border border-green-100">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Invoice #1234</span>
          </div>
          <Download className="w-5 h-5 text-white" />
        </div>

        {/* Invoice Content */}
        <div className="p-6">
          {/* Company Branding */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Your Company</p>
                <p className="text-xs text-gray-500">Professional Invoices</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-semibold text-gray-900">Dec 9, 2025</p>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between bg-gray-50 p-3 rounded">
              <span className="text-sm text-gray-700">Service Item 1</span>
              <span className="text-sm font-medium text-gray-900">$500.00</span>
            </div>
            <div className="flex justify-between bg-gray-50 p-3 rounded">
              <span className="text-sm text-gray-700">Service Item 2</span>
              <span className="text-sm font-medium text-gray-900">$750.00</span>
            </div>
          </div>

          {/* Total */}
          <div className="border-t-2 border-gray-200 pt-3">
            <div className="flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Total</span>
              </div>
              <span className="text-2xl font-bold text-white">$1,250.00</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4 flex justify-center">
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              Ready to Send
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Calculate Badge */}
      <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
        <Calculator className="w-4 h-4" />
        <span className="text-sm font-semibold">Auto-Calculate</span>
      </div>
    </div>
  )
}

const VerifyMockup = () => {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-2xl border border-orange-100">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">PDF Verification</span>
          </div>
          <Shield className="w-5 h-5 text-white" />
        </div>

        {/* Verification Process */}
        <div className="p-6">
          {/* Upload Area */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border-2 border-dashed border-orange-300 mb-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <FileCheck className="w-12 h-12 text-orange-500" />
              <p className="text-sm font-medium text-gray-700">document.pdf</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full w-full"></div>
              </div>
              <p className="text-xs text-gray-500">Analyzing...</p>
            </div>
          </div>

          {/* Verification Results */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Hash Verified</p>
                  <p className="text-xs text-gray-500">SHA-256 Match</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">No Modifications</p>
                  <p className="text-xs text-gray-500">Document Intact</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Timestamp</p>
                  <p className="text-xs text-gray-500">Dec 9, 2025 10:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
        <Shield className="w-4 h-4" />
        <span className="text-sm font-semibold">SHA-256</span>
      </div>
    </div>
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
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
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
      bgGradient: 'from-purple-50 to-pink-50',
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
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
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
      bgGradient: 'from-orange-50 to-red-50',
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
      role: 'CEO, TechStart Inc.',
      rating: 5,
    },
    {
      quote: "The best e-signature solution we've used. Simple, secure, and incredibly fast.",
      author: 'Michael Chen',
      role: 'Legal Director, Global Corp',
      rating: 5,
    },
    {
      quote: "Finally, an e-signature platform that just works. Our team loves it!",
      author: 'Emily Rodriguez',
      role: 'Operations Manager, ScaleUp',
      rating: 5,
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase Section - CalendarJet Style */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in
              <span className="gradient-text"> One Platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed to streamline your document workflow, from resume building to e-signatures to invoicing.
            </p>
          </div>

          <div className="space-y-32">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0
              const MockupComponent = feature.mockup

              return (
                <div key={index} className="relative">
                  <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
                    {/* Content Side */}
                    <div className={!isEven ? 'lg:col-start-2' : ''}>
                      <div className="mb-6">
                        <div className={`inline-block bg-gradient-to-r ${feature.gradient} text-white px-4 py-2 rounded-full text-sm font-semibold mb-4`}>
                          {feature.subtitle}
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                          {feature.title}
                        </h3>
                        <p className="text-lg text-gray-600 mb-8">
                          {feature.description}
                        </p>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mt-0.5`}>
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="ml-3 text-gray-700 text-lg">{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={feature.href}
                        className={`inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r ${feature.gradient} rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                      >
                        Try {feature.title}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </div>

                    {/* Mockup Side */}
                    <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                      <div className="relative">
                        <MockupComponent />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Background Element */}
                  <div className={`absolute top-1/2 -translate-y-1/2 -z-10 w-96 h-96 bg-gradient-to-r ${feature.bgGradient} rounded-full blur-3xl opacity-20 ${isEven ? '-left-48' : '-right-48'}`}></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by Businesses Worldwide
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See what our customers have to say about MamaSign.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl p-8 border border-gray-700"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 text-lg">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses who trust MamaSign for their document needs.
            Get started for free today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-document"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-600 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            >
              Start Signing Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-300"
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
