'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

const PricingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const pricingTiers = [
    {
      price: 19,
      milestone: '1-500',
      label: 'First 500 users',
      current: true,
    },
    {
      price: 39,
      milestone: '501-1000',
      label: '501-1000 users',
      current: false,
    },
    {
      price: 59,
      milestone: '1001+',
      label: '1001+ users',
      current: false,
    },
  ]

  const features = [
    'Unlimited document signing',
    'Unlimited PDF verification',
    'Unlimited invoice creation',
    'All resume templates',
    'Custom branding',
    'Priority support',
    'Lifetime updates',
    'No monthly fees',
    'API access',
    'Team collaboration',
    'Advanced analytics',
    'White-label option',
  ]

  const faqs = [
    {
      question: 'What is a lifetime deal?',
      answer: 'A lifetime deal means you pay once and get access to MamaSign forever. No monthly or annual subscriptions. All updates and new features are included at no extra cost.',
    },
    {
      question: 'Will the price increase later?',
      answer: 'Yes! The price increases as we reach user milestones. Currently, we are in the first tier ($19 for first 500 users). Once we hit 500 users, the price jumps to $39, and so on. Lock in your price now before it goes up.',
    },
    {
      question: 'Are there any hidden fees?',
      answer: 'Absolutely not. The one-time payment includes everything - all features, unlimited usage, lifetime updates, and priority support. No hidden fees, no recurring charges.',
    },
    {
      question: 'What if I am not satisfied?',
      answer: 'We offer a 30-day money-back guarantee, no questions asked. If MamaSign is not right for you, simply contact us within 30 days for a full refund.',
    },
    {
      question: 'Do I need technical skills to use MamaSign?',
      answer: 'Not at all! MamaSign is designed to be incredibly user-friendly. If you can use email, you can use MamaSign. Plus, we have comprehensive documentation and priority support to help you get started.',
    },
    {
      question: 'Can I upgrade my license later?',
      answer: 'Your lifetime license is already the complete package with all features included. There is nothing to upgrade to - you get everything from day one.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use 256-bit AES encryption, are SOC 2 Type II certified, and comply with GDPR, HIPAA, and other major security standards. Your documents are encrypted both at rest and in transit.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through industry-standard payment processors.',
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              One Price.
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Forever Yours.
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Get lifetime access to all MamaSign features with a single payment. No subscriptions, no monthly fees, no surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Lifetime Deal Pricing
            </h2>
            <p className="text-xl text-gray-700">
              Price increases with each milestone. Lock in your discount now!
            </p>
          </div>

          {/* Milestone Pricing Cards */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative ${tier.current ? 'transform scale-105' : 'opacity-75'}`}
              >
                <div
                  className={`bg-gray-100/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl transition-all duration-300 hover:transform hover:scale-105 ${
                    tier.current
                      ? 'border-4 border-cyan-500'
                      : 'border-2 border-gray-200/50'
                  }`}
                >
                  {tier.current && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      Last chance!
                    </div>
                  )}
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 shadow-2xl ${
                        tier.current
                          ? 'bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600'
                          : 'bg-gray-700/50'
                      }`}
                    >
                      <div className="text-gray-900">
                        <div className="text-4xl font-bold">${tier.price}</div>
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">{tier.label}</p>
                    {tier.current && (
                      <div className="mt-3 px-3 py-1.5 bg-cyan-500/20 text-cyan-600 rounded-full text-sm font-semibold inline-block">
                        CURRENT TIER
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mb-12">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-gray-900 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-xl shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide"
            >
              Get Lifetime Deal
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              One-time payment. Lifetime access. 30-day money-back guarantee.
            </p>
          </div>

          {/* Guarantee Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-2 bg-green-500/20 border-2 border-green-500/50 rounded-full px-6 py-3">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-semibold">30-Day Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything Included
            </h2>
            <p className="text-xl text-gray-700">
              Get full access to all features with your lifetime license
            </p>
          </div>

          <div className="bg-gray-100/50 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200/50">
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-gray-900" />
                  </div>
                  <span className="ml-4 text-gray-700 text-lg">{feature}</span>
                </div>
              ))}
            </div>

            {/* Value Proposition */}
            <div className="mt-12 pt-8 border-t border-gray-200/50 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                Everything for a one-time payment of just $19
              </p>
              <p className="text-gray-700">
                Compare this to competitors charging $15-50/month. You will save hundreds over a year!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-700">
              Everything you need to know about the lifetime deal
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200/50 rounded-xl overflow-hidden bg-gray-100/50 backdrop-blur-xl"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Do not Miss This Limited-Time Offer
          </h2>
          <p className="text-xl text-gray-900/80 mb-8 max-w-2xl mx-auto">
            Join the first 500 users and lock in the lowest price. Once this tier fills up, the price increases to $39.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Have Questions? Contact Us
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 items-center text-gray-900/80">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>30-Day Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
