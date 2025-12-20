'use client'

import React from 'react'
import Link from 'next/link'
import {
  FileSignature,
  Shield,
  Clock,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  FileText,
  Lock,
  Globe,
  Smartphone,
  Mail,
  BarChart3,
  Layers,
  RefreshCw,
  Search,
  Download,
  Bell,
  Workflow,
  Database,
  Cloud,
  Key,
  Eye,
  Stamp,
  PenTool,
  Send,
  History,
  FileType,
  Image,
  Minimize2,
  Scissors,
  Droplets,
  Receipt,
  LayoutTemplate,
  Sparkles,
  Star,
  Check,
  Award,
} from 'lucide-react'

const FeaturesPage: React.FC = () => {
  // All Platform Features
  const platformFeatures = [
    {
      category: 'E-Signature Tools',
      icon: FileSignature,
      color: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/30',
      features: [
        'Sign documents electronically with legally-binding signatures',
        'Draw signatures using mouse, trackpad, or touchscreen',
        'Type signatures with beautiful font styles',
        'Upload your handwritten signature image',
        'Add initials and stamps to documents',
        'Multiple signers support with sequential signing',
        'Real-time signature tracking and notifications',
        'In-person and remote signing options',
        'Reusable signature library',
        'Mobile-friendly signing experience',
      ],
    },
    {
      category: 'PDF Conversion Tools',
      icon: FileType,
      color: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/30',
      features: [
        'PDF to Word - Convert PDFs to editable Word documents',
        'Word to PDF - Transform Word files into professional PDFs',
        'Image to PDF - Convert JPG, PNG images to PDF format',
        'PDF Compression - Reduce file size up to 90%',
        'PDF Merge - Combine multiple PDFs into one',
        'PDF Split - Extract pages from PDF documents',
        'Watermark PDF - Add text or image watermarks',
        'All conversions happen in your browser (privacy-first)',
        'No file size limits for free tools',
        'Batch processing for multiple files',
      ],
    },
    {
      category: 'Business Tools',
      icon: Receipt,
      color: 'from-emerald-500 to-green-500',
      shadowColor: 'shadow-emerald-500/30',
      features: [
        'Professional Invoice Generator with custom branding',
        'Auto-calculate totals, taxes, and discounts',
        'ATS-friendly Resume Templates',
        'Multiple resume designs (Modern, Professional, Creative)',
        'Download invoices and resumes as PDF',
        'Save templates for future use',
        'Client management for invoices',
        'Payment tracking and status updates',
        'Customizable company logo and colors',
        'Export in multiple formats',
      ],
    },
    {
      category: 'Security & Compliance',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-500/30',
      features: [
        '256-bit AES encryption for all documents',
        'SOC 2 Type II certified infrastructure',
        'GDPR and HIPAA compliant',
        'eIDAS and ESIGN Act compliant',
        'Tamper-evident digital seals',
        'Complete audit trail with timestamps',
        'Two-factor authentication (2FA)',
        'IP address and device tracking',
        'Secure cloud storage with encryption',
        'Regular third-party security audits',
      ],
    },
    {
      category: 'Document Verification',
      icon: Eye,
      color: 'from-cyan-500 to-blue-500',
      shadowColor: 'shadow-cyan-500/30',
      features: [
        'SHA-256 hash verification for authenticity',
        'Detect document tampering and modifications',
        'Register original documents on blockchain',
        'Instant verification results',
        'Detailed tampering detection reports',
        'Certificate of authenticity generation',
        'Compare document versions',
        'Verify digital signatures',
        'QR code verification support',
        'Bulk document verification',
      ],
    },
    {
      category: 'Collaboration & Workflow',
      icon: Users,
      color: 'from-violet-500 to-purple-500',
      shadowColor: 'shadow-violet-500/30',
      features: [
        'Invite unlimited team members',
        'Role-based access control (Admin, Editor, Viewer)',
        'Sequential and parallel signing workflows',
        'Shared document library',
        'Team templates and branding',
        'Automated email reminders',
        'Custom notification preferences',
        'Comment and annotation tools',
        'Version history and rollback',
        'Activity dashboard and analytics',
      ],
    },
  ]

  // Quick Stats
  const stats = [
    { value: '10M+', label: 'Documents Signed' },
    { value: '50K+', label: 'Happy Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '150+', label: 'Countries' },
  ]

  // Why Choose Us
  const whyChooseUs = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sign documents in seconds, not days',
    },
    {
      icon: Lock,
      title: '100% Secure',
      description: 'Bank-level encryption protects your data',
    },
    {
      icon: Globe,
      title: 'Works Anywhere',
      description: 'Desktop, tablet, or mobile - no app needed',
    },
    {
      icon: Award,
      title: 'Legally Binding',
      description: 'Valid in 180+ countries worldwide',
    },
  ]

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-purple-100 dark:from-cyan-900/50 dark:to-purple-900/50 rounded-full border border-cyan-200 dark:border-cyan-700 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-cyan-700 dark:text-cyan-300 text-sm font-medium">All Features Included Free</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              See How
              <span className="block mt-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                MamaSign Works
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Discover all the powerful features that make MamaSign the ultimate platform for e-signatures, PDF tools, and business documents.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Quick Overview */}
      <section className="py-12 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-cyan-500/30">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Features - Bullet Points */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Feature
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent"> Overview</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage documents, get signatures, and run your business efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((category, index) => (
              <div
                key={index}
                className="group bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 hover:border-cyan-400 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-xl"
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg ${category.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.category}
                  </h3>
                </div>

                {/* Feature List */}
                <ul className="space-y-3">
                  {category.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="w-5 h-5 text-emerald-500" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PDF Tools Highlight */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              100% Free - No Sign Up Required
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Free PDF Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              All tools work directly in your browser. No uploads, no waiting - complete privacy.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'PDF to Word', icon: FileType, href: '/tools/pdf-to-word', color: 'bg-blue-500' },
              { name: 'Compress PDF', icon: Minimize2, href: '/tools/pdf-compressor', color: 'bg-green-500' },
              { name: 'Merge PDF', icon: Layers, href: '/tools/pdf-merge', color: 'bg-purple-500' },
              { name: 'Split PDF', icon: Scissors, href: '/tools/pdf-split', color: 'bg-red-500' },
              { name: 'Image to PDF', icon: Image, href: '/tools/image-to-pdf', color: 'bg-indigo-500' },
              { name: 'Word to PDF', icon: FileText, href: '/tools/word-to-pdf', color: 'bg-cyan-500' },
              { name: 'Watermark PDF', icon: Droplets, href: '/tools/watermark-pdf', color: 'bg-teal-500' },
              { name: 'Sign Document', icon: PenTool, href: '/sign-document', color: 'bg-pink-500' },
            ].map((tool, index) => (
              <Link
                key={index}
                href={tool.href}
                className="group p-4 md:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {tool.name}
                </h3>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
            >
              View All Tools
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic mb-6">
            "MamaSign has completely transformed how we handle documents. The e-signature feature is incredibly easy to use, and the PDF tools save us hours every week!"
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              SJ
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Operations Director, TechFlow Solutions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join 50,000+ businesses using MamaSign. Start signing documents for free - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-document"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-cyan-600 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Signing Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FeaturesPage
