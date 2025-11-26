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
  Star,
  FileText,
  Lock,
  Globe,
} from 'lucide-react'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: FileSignature,
      title: 'Effortless Signatures',
      description: 'Sign documents electronically with legally-binding digital signatures in seconds.',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: '256-bit encryption ensures your documents and signatures are always protected.',
    },
    {
      icon: Clock,
      title: 'Full Audit Trail',
      description: 'Track when documents are delivered, opened, and signed with complete transparency.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get documents signed in minutes, not days. Speed up your business workflows.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Invite team members and manage documents together with role-based access.',
    },
    {
      icon: Globe,
      title: 'Works Everywhere',
      description: 'Sign from any device - desktop, tablet, or mobile. No app installation required.',
    },
  ]

  const stats = [
    { value: '10M+', label: 'Documents Signed' },
    { value: '50K+', label: 'Happy Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '150+', label: 'Countries' },
  ]

  const testimonials = [
    {
      quote: "Auradoc has transformed how we handle contracts. What used to take days now takes minutes.",
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
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="animate-in space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 rounded-full">
              <span className="text-primary-700 text-sm font-medium">
                Trusted by 50,000+ businesses worldwide
              </span>
              <CheckCircle className="w-4 h-4 text-primary-600" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Sign Documents
              <span className="block gradient-text">Effortlessly</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional e-signature platform for businesses of all sizes.
              Get documents signed in minutes with legally-binding digital signatures.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign" className="btn-primary text-lg px-8 py-4">
                Start Signing Free
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link href="/features" className="btn-secondary text-lg px-8 py-4">
                See How It Works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-gray-500">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-green-600" />
                <span className="text-sm">256-bit Encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Legally Binding</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm">SOC 2 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to
              <span className="gradient-text"> Sign Smarter</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your document workflow
              and get agreements signed faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sign Documents in
              <span className="gradient-text"> 3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in seconds. No training required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Document',
                description: 'Drag and drop your PDF or image file. We support all common formats.',
                icon: FileText,
              },
              {
                step: '02',
                title: 'Add Your Signature',
                description: 'Draw your signature using your mouse or touchscreen. It takes seconds.',
                icon: FileSignature,
              },
              {
                step: '03',
                title: 'Send & Track',
                description: 'Share the signed document and track when it\'s viewed and downloaded.',
                icon: CheckCircle,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full">
                  <div className="text-6xl font-bold text-gray-100 mb-4">{item.step}</div>
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/sign" className="btn-primary text-lg px-8 py-4">
              Try It Now - It's Free
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
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
              See what our customers have to say about Auradoc.
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
            Join thousands of businesses who trust Auradoc for their e-signature needs.
            Get started for free today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-600 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            >
              Start Signing Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
