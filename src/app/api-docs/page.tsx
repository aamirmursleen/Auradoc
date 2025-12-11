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
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Developer API</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Build with the
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                MamaSign API
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Integrate e-signatures into your application with our powerful REST API. Get started in minutes with comprehensive documentation and SDKs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up?developer=true" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Get API Key
                <Key className="w-5 h-5 ml-2" />
              </Link>
              <a href="#docs" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 border-2 border-gray-600 rounded-xl hover:border-gray-500 hover:bg-gray-100 transition-all duration-300">
                View Documentation
                <BookOpen className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Code */}
      <section className="py-20 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Get Started in
                <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent"> Minutes</span>
              </h2>
              <p className="text-lg text-gray-700 mb-8">
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
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-600 text-sm">example.js</span>
                  <button
                    onClick={() => copyCode(exampleCode, 'example')}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {copiedCode === 'example' ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="text-gray-700">{exampleCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Features */}
      <section className="py-20 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for Developers
            </h2>
            <p className="text-xl text-gray-700">
              Everything you need to build a great integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-gray-50/80 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section id="docs" className="py-20 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              API Endpoints
            </h2>
            <p className="text-xl text-gray-700">
              Core endpoints to manage documents and signatures
            </p>
          </div>

          <div className="bg-gray-50/80 border border-gray-200/50 rounded-2xl p-6">
            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50/80 rounded-lg border border-gray-200/50 hover:border-blue-600 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center">
                    <span className={`${endpoint.color} text-gray-900 text-xs font-bold px-3 py-1 rounded mr-4`}>
                      {endpoint.method}
                    </span>
                    <code className="text-gray-900 font-mono">{endpoint.path}</code>
                  </div>
                  <p className="text-gray-700 hidden md:block">{endpoint.description}</p>
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/api-docs/reference" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
              View Full API Reference
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Webhooks */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
                <Webhook className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Webhooks</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Real-Time Event Notifications
              </h2>
              <p className="text-lg text-gray-600 mb-8">
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
                  <div key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                    <code className="text-sm">{event}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-100 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <span className="text-gray-600 text-sm">Webhook Payload</span>
                  <button
                    onClick={() => copyCode(webhookExample, 'webhook')}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {copiedCode === 'webhook' ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="text-gray-700">{webhookExample}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-20 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Official SDKs
            </h2>
            <p className="text-xl text-gray-700">
              Get up and running quickly with our official libraries
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdks.map((sdk, index) => (
              <div key={index} className="p-6 bg-gray-50/80 border border-gray-200/50 rounded-xl hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{sdk.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{sdk.name}</h3>
                </div>
                <div className="flex items-center bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-700 flex-1 overflow-x-auto">{sdk.command}</code>
                  <button
                    onClick={() => copyCode(sdk.command, sdk.name)}
                    className="ml-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {copiedCode === sdk.name ? (
                      <Check className="w-4 h-4 text-green-400" />
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Terminal className="w-16 h-16 text-gray-900/80 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-gray-900/80 mb-8 max-w-2xl mx-auto">
            Get your free API key and start integrating e-signatures into your application today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up?developer=true" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300">
              Get Free API Key
              <Key className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-300">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default APIDocsPage
