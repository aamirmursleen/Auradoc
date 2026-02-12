'use client'

import React from 'react'
import Link from 'next/link'
import {
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
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            All PDF Tools
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
            Everything you need to work with PDFs. Convert, compress, merge, split, and more - all free and secure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-muted text-muted-foreground">
              <CheckCircle className="w-4 h-4" />
              Free to Use
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-muted text-muted-foreground">
              <CheckCircle className="w-4 h-4" />
              No Signup Required
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-muted text-muted-foreground">
              <CheckCircle className="w-4 h-4" />
              Processed Locally
            </span>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-12 px-4 border-b bg-white border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-muted">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
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
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 bg-muted text-primary">
              Most Popular
            </span>
            <h2 className="text-3xl font-bold text-foreground">
              Popular Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTools.flatMap(cat => cat.tools).filter(tool => tool.popular).map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className="group p-6 rounded-2xl border transition-all duration-300 bg-secondary border-border hover:border-primary hover:shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-primary">
                  <tool.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 transition-colors text-foreground group-hover:text-primary">
                  {tool.name}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {tool.description}
                </p>
                <span className="inline-flex items-center gap-2 font-medium group-hover:gap-3 transition-all text-primary">
                  Use Tool
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Tools by Category */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              All Tools by Category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Browse our complete collection of PDF tools
            </p>
          </div>

          <div className="space-y-12">
            {allTools.map((category, catIdx) => (
              <div key={catIdx}>
                <h3 className="text-xl font-bold mb-6 pb-2 border-b text-foreground border-border">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.tools.map((tool, toolIdx) => (
                    <Link
                      key={toolIdx}
                      href={tool.href}
                      className="group flex items-start gap-4 p-5 rounded-xl border transition-all bg-secondary border-border hover:border-primary hover:shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform bg-primary">
                        <tool.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold transition-colors text-foreground group-hover:text-primary">
                          {tool.name}
                        </h4>
                        <p className="text-sm mt-1 text-muted-foreground">
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
      <section className="py-20 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Need to Sign Documents?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Try our free e-signature tool to sign documents legally and securely
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-document"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-xl hover:shadow-xl transition-all bg-primary text-primary-foreground"
            >
              <PenTool className="w-5 h-5" />
              Sign a Document
            </Link>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-xl transition-all bg-muted text-foreground hover:bg-muted/80"
            >
              <Shield className="w-5 h-5" />
              Verify Signature
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
            <div className="p-6 rounded-xl bg-secondary">
              <h4 className="font-semibold mb-2 text-foreground">Are these tools really free?</h4>
              <p className="text-sm text-muted-foreground">Yes! All our PDF tools are completely free to use with no hidden costs or registration required.</p>
            </div>
            <div className="p-6 rounded-xl bg-secondary">
              <h4 className="font-semibold mb-2 text-foreground">Are my files secure?</h4>
              <p className="text-sm text-muted-foreground">Absolutely. All files are processed locally in your browser and never uploaded to any server.</p>
            </div>
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 font-medium text-primary hover:text-primary/80"
          >
            View all FAQs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
