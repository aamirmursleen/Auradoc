'use client'

import React from 'react'
import Link from 'next/link'
import {
  FileText,
  FileType,
  Image,
  Minimize2,
  Scissors,
  Merge,
  PenTool,
  Droplets,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  CheckCircle,
} from 'lucide-react'

const allTools = [
  {
    category: 'PDF Conversion',
    tools: [
      {
        name: 'PDF to Word',
        description: 'Convert PDF files to editable Word documents (.docx)',
        icon: FileType,
        href: '/tools/pdf-to-word',
        color: 'bg-blue-500',
        popular: true,
      },
      {
        name: 'Word to PDF',
        description: 'Convert Word documents to PDF format',
        icon: FileText,
        href: '/tools/word-to-pdf',
        color: 'bg-indigo-500',
        popular: true,
      },
      {
        name: 'Image to PDF',
        description: 'Convert images (JPG, PNG) to PDF documents',
        icon: Image,
        href: '/tools/image-to-pdf',
        color: 'bg-purple-500',
        popular: false,
      },
    ],
  },
  {
    category: 'PDF Management',
    tools: [
      {
        name: 'Compress PDF',
        description: 'Reduce PDF file size while maintaining quality',
        icon: Minimize2,
        href: '/tools/pdf-compressor',
        color: 'bg-green-500',
        popular: true,
      },
      {
        name: 'Merge PDF',
        description: 'Combine multiple PDF files into one document',
        icon: Merge,
        href: '/tools/pdf-merge',
        color: 'bg-orange-500',
        popular: true,
      },
      {
        name: 'Split PDF',
        description: 'Split PDF into multiple separate documents',
        icon: Scissors,
        href: '/tools/pdf-split',
        color: 'bg-red-500',
        popular: false,
      },
    ],
  },
  {
    category: 'PDF Enhancement',
    tools: [
      {
        name: 'Watermark PDF',
        description: 'Add text or image watermarks to your PDFs',
        icon: Droplets,
        href: '/tools/watermark-pdf',
        color: 'bg-cyan-500',
        popular: false,
      },
      {
        name: 'Signature Generator',
        description: 'Create beautiful digital signatures',
        icon: PenTool,
        href: '/tools/signature-generator',
        color: 'bg-pink-500',
        popular: true,
      },
    ],
  },
]

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'All tools process files in seconds, right in your browser',
  },
  {
    icon: Shield,
    title: '100% Secure',
    description: 'Files never leave your device - processed locally for privacy',
  },
  {
    icon: Globe,
    title: 'No Registration',
    description: 'Use all tools for free without creating an account',
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            All PDF Tools
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Everything you need to work with PDFs. Convert, compress, merge, split, and more - all free and secure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              <CheckCircle className="w-4 h-4" />
              Free to Use
            </span>
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              <CheckCircle className="w-4 h-4" />
              No Signup Required
            </span>
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              <CheckCircle className="w-4 h-4" />
              Processed Locally
            </span>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
              Most Popular
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Popular Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTools.flatMap(cat => cat.tools).filter(tool => tool.popular).map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-xl hover:shadow-cyan-100/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {tool.description}
                </p>
                <span className="inline-flex items-center gap-2 text-cyan-600 font-medium group-hover:gap-3 transition-all">
                  Use Tool
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Tools by Category */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              All Tools by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Browse our complete collection of PDF tools
            </p>
          </div>

          <div className="space-y-12">
            {allTools.map((category, catIdx) => (
              <div key={catIdx}>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.tools.map((tool, toolIdx) => (
                    <Link
                      key={toolIdx}
                      href={tool.href}
                      className="group flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-lg transition-all"
                    >
                      <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {tool.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E-Signature CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need to Sign Documents?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Try our free e-signature tool to sign documents legally and securely
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-document"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-600 font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              <PenTool className="w-5 h-5" />
              Sign a Document
            </Link>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              <Shield className="w-5 h-5" />
              Verify Signature
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Are these tools really free?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Yes! All our PDF tools are completely free to use with no hidden costs or registration required.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Are my files secure?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Absolutely. All files are processed locally in your browser and never uploaded to any server.</p>
            </div>
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-cyan-600 font-medium hover:text-cyan-700"
          >
            View all FAQs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
