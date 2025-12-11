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
} from 'lucide-react'

const FeaturesPage: React.FC = () => {
  const mainFeatures = [
    {
      icon: FileSignature,
      title: 'Electronic Signatures',
      description: 'Create legally-binding electronic signatures in seconds. Draw, type, or upload your signature for instant document signing.',
      details: ['Draw signatures with mouse or touch', 'Type and style your signature', 'Upload signature images', 'Reusable signature library'],
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: '256-bit AES encryption protects every document. Your data is secure at rest and in transit with enterprise-grade security.',
      details: ['256-bit encryption', 'SOC 2 Type II certified', 'GDPR compliant', 'Regular security audits'],
    },
    {
      icon: Clock,
      title: 'Complete Audit Trail',
      description: 'Track every action on your documents with detailed timestamped logs. Know exactly when documents are viewed, signed, and downloaded.',
      details: ['Timestamped activity logs', 'IP address tracking', 'Device information', 'Tamper-evident seals'],
    },
    {
      icon: Zap,
      title: 'Lightning Fast Processing',
      description: 'Get documents signed in minutes, not days. Our optimized infrastructure ensures instant delivery and processing.',
      details: ['Instant document delivery', 'Real-time status updates', 'Batch processing support', 'Priority queue for business'],
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Invite unlimited team members and collaborate seamlessly. Role-based permissions keep your organization secure.',
      details: ['Unlimited team members', 'Role-based access control', 'Team templates', 'Shared document library'],
    },
    {
      icon: Globe,
      title: 'Works Everywhere',
      description: 'Sign from any device - desktop, tablet, or mobile. No app installation required, just open and sign.',
      details: ['Desktop & mobile support', 'No app required', 'Offline signing capability', 'Cross-browser compatible'],
    },
  ]

  const additionalFeatures = [
    { icon: Smartphone, title: 'Mobile Optimized', description: 'Full functionality on any mobile device with responsive design' },
    { icon: Mail, title: 'Email Notifications', description: 'Automated reminders and status updates keep everyone informed' },
    { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track signing patterns and document metrics in real-time' },
    { icon: Layers, title: 'Template Library', description: 'Save time with reusable document templates for common workflows' },
    { icon: RefreshCw, title: 'Bulk Operations', description: 'Process hundreds of documents simultaneously with bulk sending' },
    { icon: Search, title: 'Smart Search', description: 'Find any document instantly with powerful search and filters' },
    { icon: Download, title: 'Export Options', description: 'Download signed documents in multiple formats including PDF/A' },
    { icon: Bell, title: 'Custom Reminders', description: 'Set automatic follow-up reminders for pending signatures' },
    { icon: Workflow, title: 'Workflow Automation', description: 'Create sequential and parallel signing workflows' },
    { icon: Database, title: 'Secure Storage', description: 'Cloud-based document storage with unlimited retention' },
    { icon: Cloud, title: 'API Integration', description: 'Connect MamaSign to your existing tools and workflows' },
    { icon: Key, title: 'SSO Support', description: 'Single sign-on integration with major identity providers' },
  ]

  const signingFeatures = [
    {
      icon: PenTool,
      title: 'Draw Your Signature',
      description: 'Use your mouse, trackpad, or touchscreen to draw your unique signature.',
    },
    {
      icon: FileText,
      title: 'Type Your Signature',
      description: 'Choose from beautiful signature fonts and customize the style to match your preference.',
    },
    {
      icon: Eye,
      title: 'In-Person Signing',
      description: 'Hand your device to signers for in-person document completion.',
    },
    {
      icon: Send,
      title: 'Remote Signing',
      description: 'Send documents for signature via email with automatic reminders.',
    },
    {
      icon: Stamp,
      title: 'Digital Stamps',
      description: 'Add official stamps, seals, and initials alongside signatures.',
    },
    {
      icon: History,
      title: 'Version History',
      description: 'Access complete document history with all previous versions.',
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/50 mb-6">
              <Zap className="w-4 h-4 text-cyan-600" />
              <span className="text-cyan-700 text-sm font-medium">Powerful E-Signature Features</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Everything You Need to
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Sign Smarter
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              MamaSign provides all the tools you need to create, send, sign, and manage documents electronically with legally-binding digital signatures.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Start Signing Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-gray-100/50 backdrop-blur-xl border-2 border-gray-200/50 rounded-xl hover:border-cyan-500/50 hover:bg-gray-100 transition-all duration-300">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Core Features That
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"> Power Your Business</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Enterprise-grade features designed for businesses of all sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-gray-200/50 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 bg-gray-100/50 backdrop-blur-xl"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signing Options */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"> Sign Documents</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Choose the signing method that works best for you and your signers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signingFeatures.map((feature, index) => (
              <div key={index} className="flex items-start p-6 bg-gray-100/50 backdrop-blur-xl rounded-xl border border-gray-200/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-700 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              And So Much More
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Explore our comprehensive feature set designed to streamline your document workflow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="p-6 bg-gray-100/50 backdrop-blur-xl rounded-xl border border-gray-200/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-gray-900" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Enterprise-Grade
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"> Security</span>
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Your documents deserve the highest level of protection. MamaSign uses industry-leading security measures to keep your data safe.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Lock, text: '256-bit AES encryption for all documents' },
                  { icon: Shield, text: 'SOC 2 Type II certified infrastructure' },
                  { icon: Globe, text: 'GDPR, HIPAA, and eIDAS compliant' },
                  { icon: Eye, text: 'Tamper-evident seals and audit trails' },
                  { icon: Key, text: 'Two-factor authentication available' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-100/50 backdrop-blur-xl rounded-lg border border-gray-200/50">
                    <item.icon className="w-6 h-6 text-cyan-600 mr-4" />
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-center border border-gray-200/50">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-12 h-12 text-gray-900" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Data is Protected</h3>
                <p className="text-gray-700 mb-6">
                  We never sell your data. Your documents are encrypted and stored securely with industry-leading protection.
                </p>
                <Link href="/security" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium">
                  Learn more about our security
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-gray-900/80 mb-8 max-w-2xl mx-auto">
            Start signing documents for free today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-300">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FeaturesPage
