'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  X,
  ArrowRight,
  Shield,
  Zap,
  ChevronDown,
  Clock,
  Globe,
  Sparkles,
  Gift,
  Star,
  Users,
  FileSignature,
  FileText,
  Receipt,
  Eye,
  Layers,
  Lock,
  Award,
} from 'lucide-react'

const PricingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // All Features included in Lifetime Deal
  const allFeatures = [
    { icon: FileSignature, name: 'Unlimited E-Signatures', description: 'Sign unlimited documents forever' },
    { icon: FileText, name: 'All PDF Tools', description: 'Convert, compress, merge, split & more' },
    { icon: Receipt, name: 'Invoice Generator', description: 'Create professional invoices' },
    { icon: Layers, name: 'Resume Templates', description: 'ATS-friendly resume builder' },
    { icon: Eye, name: 'Document Verification', description: 'Verify document authenticity' },
    { icon: Users, name: 'Team Collaboration', description: 'Invite unlimited team members' },
    { icon: Shield, name: 'Custom Branding', description: 'Add your logo & colors' },
    { icon: Zap, name: 'API Access', description: 'Integrate with your apps' },
    { icon: Lock, name: 'Priority Support', description: '24/7 dedicated support' },
    { icon: Globe, name: 'Lifetime Updates', description: 'All future features included' },
  ]

  // Feature comparison list
  const featureList = [
    'Unlimited document signing',
    'Unlimited PDF conversions',
    'All PDF tools (merge, split, compress, convert)',
    'Professional invoice generator',
    'ATS-friendly resume templates',
    'Document verification & authenticity',
    'Team collaboration (unlimited members)',
    'Custom branding & white-label',
    'API access for integrations',
    'Priority 24/7 support',
    'Lifetime updates & new features',
    'No monthly or annual fees',
    '256-bit encryption security',
    'GDPR & SOC 2 compliant',
    'Mobile-friendly access',
  ]

  // Trusted Brands
  const trustedBrands = [
    'TechCorp', 'StartupX', 'FinanceHub', 'DesignPro', 'DataFlow', 'CloudBase'
  ]

  // FAQs
  const faqs = [
    {
      question: 'What is a Lifetime Deal?',
      answer: 'A Lifetime Deal means you pay once and get access to MamaSign forever. No monthly subscriptions, no annual renewals. All current features and future updates are included at no extra cost.',
    },
    {
      question: 'Is this really a one-time payment?',
      answer: 'Yes! Pay $27 once and use MamaSign forever. No hidden fees, no recurring charges, no surprises. You own lifetime access to all features.',
    },
    {
      question: 'What happens after the deal ends?',
      answer: 'The Lifetime Deal is a limited-time offer. Once it ends, new users will have to pay monthly/annual subscriptions. But your lifetime access remains valid forever - you\'re locked in at this price.',
    },
    {
      question: 'Are future updates included?',
      answer: 'Absolutely! All future features, updates, and improvements are included in your lifetime access. As we add new tools and capabilities, you get them automatically at no extra cost.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. We use 256-bit AES encryption, are SOC 2 Type II certified, and comply with GDPR, HIPAA, and other major security standards. Your documents are encrypted both at rest and in transit.',
    },
    {
      question: 'What if I\'m not satisfied?',
      answer: 'We offer a 30-day money-back guarantee, no questions asked. If MamaSign doesn\'t meet your expectations, contact us within 30 days for a full refund.',
    },
  ]

  // Original price and discounted price
  const originalPrice = 270
  const discountedPrice = 27
  const discountPercent = 90

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-24 pb-8 md:pt-32 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Gift className="w-5 h-5 text-yellow-300" />
                <span className="text-white font-semibold">Limited Time Offer</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Lifetime Deal
              </h1>
              <p className="text-lg text-white/90 max-w-xl mx-auto">
                Pay once, use forever. Get unlimited access to all MamaSign features with a single payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Pricing Card */}
      <section className="py-8 md:py-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-xl opacity-30" />

            {/* Card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 border-2 border-cyan-500 shadow-2xl">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  SAVE {discountPercent}%
                </span>
              </div>

              <div className="text-center mb-8 pt-4">
                <p className="text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider mb-4">
                  Lifetime Access
                </p>

                {/* Price */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl text-gray-400 line-through">${originalPrice}</span>
                  <span className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white">
                    ${discountedPrice}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400">One-time payment • Forever yours</p>
              </div>

              {/* Features preview */}
              <div className="space-y-3 mb-8">
                {featureList.slice(0, 8).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
                <p className="text-cyan-600 dark:text-cyan-400 font-medium pl-8">+ {featureList.length - 8} more features...</p>
              </div>

              {/* CTA Button */}
              <Link
                href="/sign-up"
                className="block w-full py-4 px-6 text-center text-lg font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
              >
                Get Lifetime Access
                <ArrowRight className="w-5 h-5 inline-block ml-2" />
              </Link>

              {/* Guarantee */}
              <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500 dark:text-gray-400">
                <Shield className="w-4 h-4 text-green-500" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Lock className="w-5 h-5 text-cyan-500" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Zap className="w-5 h-5 text-cyan-500" />
              <span className="font-medium">Instant Access</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Shield className="w-5 h-5 text-cyan-500" />
              <span className="font-medium">30-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Globe className="w-5 h-5 text-cyan-500" />
              <span className="font-medium">Lifetime Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* All Features Grid */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything Included
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              One payment, all features, forever
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Full feature list */}
          <div className="mt-12 bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Complete Feature List</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {featureList.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Lifetime Deal?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See how much you save compared to monthly subscriptions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly Plan */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 opacity-75">
              <div className="text-center mb-6">
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">Monthly Subscription</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$19</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-red-500 text-sm mt-2">= $228/year, $1,140 in 5 years</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-500">
                  <X className="w-5 h-5 text-red-400" />
                  <span>Pay forever</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <X className="w-5 h-5 text-red-400" />
                  <span>Price increases over time</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <X className="w-5 h-5 text-red-400" />
                  <span>Lose access if you cancel</span>
                </li>
              </ul>
            </div>

            {/* Lifetime Deal */}
            <div className="bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border-2 border-cyan-500 relative">
              <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                BEST VALUE
              </div>
              <div className="text-center mb-6">
                <p className="text-cyan-600 dark:text-cyan-400 font-medium mb-2">Lifetime Deal</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">${discountedPrice}</span>
                  <span className="text-gray-500">one-time</span>
                </div>
                <p className="text-green-500 text-sm mt-2">Save $1,113+ over 5 years!</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Pay once, own forever</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Price locked in forever</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Lifetime access guaranteed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Trusted by 50,000+ Users
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {trustedBrands.map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-24 h-16 md:w-32 md:h-20 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600"
              >
                <span className="text-gray-400 dark:text-gray-500 font-semibold text-sm">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20">
              <Sparkles className="w-full h-full text-yellow-600" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why choose MamaSign?
              </h2>
              <p className="text-gray-800 text-lg leading-relaxed mb-6">
                We're building the most comprehensive document platform for businesses. Get e-signatures, PDF tools, invoices, and more - all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
                  <Shield className="w-5 h-5 text-gray-800" />
                  <span className="text-gray-800 font-medium">256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
                  <Clock className="w-5 h-5 text-gray-800" />
                  <span className="text-gray-800 font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
                  <Award className="w-5 h-5 text-gray-800" />
                  <span className="text-gray-800 font-medium">SOC 2 Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <X className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Clock className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-semibold">Limited Time Offer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Get Lifetime Access Today
          </h2>
          <p className="text-xl text-white/90 mb-4">
            <span className="line-through opacity-75">${originalPrice}</span>
            <span className="text-3xl font-bold mx-2">${discountedPrice}</span>
            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-sm font-bold">SAVE {discountPercent}%</span>
          </p>
          <p className="text-white/80 mb-8">
            One-time payment. All features. Forever yours.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-cyan-600 bg-white rounded-xl shadow-2xl hover:shadow-white/30 transition-all duration-300 transform hover:scale-105"
          >
            Get Lifetime Deal
            <ArrowRight className="w-6 h-6 ml-2" />
          </Link>
          <p className="text-white/70 text-sm mt-4">
            30-day money-back guarantee • Secure payment • Instant access
          </p>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
