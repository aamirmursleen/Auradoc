'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Code,
  ArrowRight,
  Copy,
  Check,
  Terminal,
  Zap,
  Shield,
  Globe,
  BookOpen,
  Webhook,
  Key,
  FileJson,
  Server,
  Clock,
  Users,
  ChevronRight,
} from 'lucide-react'

const APIDocsPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/documents',
      description: 'Upload a new document for signing',
      color: 'bg-green-500',
    },
    {
      method: 'GET',
      path: '/api/v1/documents/{id}',
      description: 'Retrieve document details and status',
      color: 'bg-blue-500',
    },
    {
      method: 'POST',
      path: '/api/v1/documents/{id}/sign',
      description: 'Add a signature to a document',
      color: 'bg-green-500',
    },
    {
      method: 'POST',
      path: '/api/v1/documents/{id}/send',
      description: 'Send document for signature via email',
      color: 'bg-green-500',
    },
    {
      method: 'GET',
      path: '/api/v1/documents/{id}/audit',
      description: 'Get complete audit trail for a document',
      color: 'bg-blue-500',
    },
    {
      method: 'DELETE',
      path: '/api/v1/documents/{id}',
      description: 'Delete a document',
      color: 'bg-red-500',
    },
  ]

  const features = [
    {
      icon: Zap,
      title: 'RESTful API',
      description: 'Clean, intuitive REST API design with predictable resource-oriented URLs.',
    },
    {
      icon: Shield,
      title: 'Secure by Default',
      description: 'OAuth 2.0 authentication and 256-bit encryption for all API calls.',
    },
    {
      icon: Globe,
      title: 'Webhooks',
      description: 'Real-time event notifications for document status changes.',
    },
    {
      icon: FileJson,
      title: 'JSON Responses',
      description: 'All responses in JSON format with comprehensive error messages.',
    },
    {
      icon: Clock,
      title: 'Rate Limiting',
      description: 'Generous rate limits with clear headers and upgrade options.',
    },
    {
      icon: BookOpen,
      title: 'Full Documentation',
      description: 'Comprehensive docs with examples in multiple programming languages.',
    },
  ]

  const sdks = [
    { name: 'Node.js', icon: '🟢', command: 'npm install @mamasign/sdk' },
    { name: 'Python', icon: '🐍', command: 'pip install mamasign' },
    { name: 'Ruby', icon: '💎', command: 'gem install mamasign' },
    { name: 'PHP', icon: '🐘', command: 'composer require mamasign/sdk' },
    { name: 'Java', icon: '☕', command: 'implementation "com.mamasign:sdk:1.0.0"' },
    { name: 'Go', icon: '🔵', command: 'go get github.com/mamasign/mamasign-go' },
  ]

  const exampleCode = `const MamaSign = require('@mamasign/sdk');

const client = new MamaSign({
  apiKey: 'your-api-key'
});

// Upload and send a document for signature
async function sendForSignature() {
  const document = await client.documents.create({
    file: './contract.pdf',
    name: 'Service Agreement'
  });

  await client.documents.send(document.id, {
    signers: [
      {
        email: 'john@example.com',
        name: 'John Doe',
        order: 1
      }
    ],
    message: 'Please sign this agreement'
  });

  console.log('Document sent:', document.id);
}`

  const webhookExample = `{
  "event": "document.signed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "document_id": "doc_abc123",
    "signer": {
      "email": "john@example.com",
      "name": "John Doe",
      "signed_at": "2024-01-15T10:30:00Z"
    },
    "status": "completed",
    "download_url": "https://api.mamasign.com/v1/documents/doc_abc123/download"
  }
}`

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
              <Code className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">Developer API</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Build with the
              <span className="block mt-2 bg-primary bg-clip-text text-transparent">
                MamaSign API
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Integrate e-signatures into your application with our powerful REST API. Get started in minutes with comprehensive documentation and SDKs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up?developer=true" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-black bg-primary rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Get API Key
                <Key className="w-5 h-5 ml-2" />
              </Link>
              <a href="#docs" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-foreground border-2 border-border rounded-xl hover:border-primary hover:bg-muted transition-all duration-300">
                View Documentation
                <BookOpen className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Code */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Get Started in
                <span className="bg-primary bg-clip-text text-transparent"> Minutes</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our SDK makes it easy to integrate e-signatures into your application. Install the package, add your API key, and start sending documents for signature.
              </p>

              <div className="space-y-4">
                {[
                  'Simple REST API with JSON responses',
                  'Official SDKs for 6+ programming languages',
                  'Sandbox environment for testing',
                  'Comprehensive error handling',
                  'Real-time webhooks for events',
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-primary mr-3" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-muted/30 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-muted-foreground text-sm">example.js</span>
                  <button
                    onClick={() => copyCode(exampleCode, 'example')}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedCode === 'example' ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="text-muted-foreground">{exampleCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Built for Developers
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to build a great integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-muted/30 rounded-xl border border-border hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section id="docs" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              API Endpoints
            </h2>
            <p className="text-xl text-muted-foreground">
              Core endpoints to manage documents and signatures
            </p>
          </div>

          <div className="bg-muted/30 border border-border rounded-2xl p-6">
            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center">
                    <span className={`${endpoint.color} text-black text-xs font-bold px-3 py-1 rounded mr-4`}>
                      {endpoint.method}
                    </span>
                    <code className="text-foreground font-mono">{endpoint.path}</code>
                  </div>
                  <p className="text-muted-foreground hidden md:block">{endpoint.description}</p>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/api-docs/reference" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
              View Full API Reference
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Webhooks */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
                <Webhook className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">Webhooks</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Real-Time Event Notifications
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get instant notifications when documents are viewed, signed, or completed. No polling required - we'll push events to your endpoint as they happen.
              </p>

              <div className="space-y-4">
                {[
                  'document.viewed - When a signer opens a document',
                  'document.signed - When a signature is added',
                  'document.completed - When all parties have signed',
                  'document.declined - When a signer declines',
                  'document.expired - When a document expires',
                ].map((event, index) => (
                  <div key={index} className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <code className="text-sm">{event}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-muted rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-muted-foreground text-sm">Webhook Payload</span>
                  <button
                    onClick={() => copyCode(webhookExample, 'webhook')}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedCode === 'webhook' ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="text-muted-foreground">{webhookExample}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Official SDKs
            </h2>
            <p className="text-xl text-muted-foreground">
              Get up and running quickly with our official libraries
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdks.map((sdk, index) => (
              <div key={index} className="p-6 bg-muted/30 border border-border rounded-xl hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{sdk.icon}</span>
                  <h3 className="text-lg font-semibold text-foreground">{sdk.name}</h3>
                </div>
                <div className="flex items-center bg-muted/30 rounded-lg p-3">
                  <code className="text-sm text-muted-foreground flex-1 overflow-x-auto">{sdk.command}</code>
                  <button
                    onClick={() => copyCode(sdk.command, sdk.name)}
                    className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedCode === sdk.name ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Terminal className="w-16 h-16 text-black/80 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            Get your free API key and start integrating e-signatures into your application today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up?developer=true" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary bg-black rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300">
              Get Free API Key
              <Key className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-black border-2 border-black rounded-lg hover:bg-black/10 transition-all duration-300">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default APIDocsPage
