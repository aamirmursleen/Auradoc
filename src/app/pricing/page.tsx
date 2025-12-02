'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  X,
  ArrowRight,
  Zap,
  Building2,
  Users,
  Crown,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const plans = [
    {
      name: 'Free',
      icon: Zap,
      description: 'Perfect for individuals getting started with e-signatures',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        { text: '3 documents per month', included: true },
        { text: 'Basic e-signatures', included: true },
        { text: 'Email notifications', included: true },
        { text: 'Mobile signing', included: true },
        { text: 'Document templates', included: false },
        { text: 'Team collaboration', included: false },
        { text: 'API access', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Get Started Free',
      ctaLink: '/sign-up',
      popular: false,
    },
    {
      name: 'Professional',
      icon: Users,
      description: 'For professionals and small teams who need more power',
      monthlyPrice: 15,
      annualPrice: 12,
      features: [
        { text: 'Unlimited documents', included: true },
        { text: 'Advanced e-signatures', included: true },
        { text: 'Email notifications', included: true },
        { text: 'Mobile signing', included: true },
        { text: '10 document templates', included: true },
        { text: 'Up to 5 team members', included: true },
        { text: 'Basic API access', included: true },
        { text: 'Email support', included: true },
      ],
      cta: 'Start Free Trial',
      ctaLink: '/sign-up?plan=professional',
      popular: true,
    },
    {
      name: 'Business',
      icon: Building2,
      description: 'For growing businesses that need advanced features',
      monthlyPrice: 45,
      annualPrice: 36,
      features: [
        { text: 'Unlimited documents', included: true },
        { text: 'Advanced e-signatures', included: true },
        { text: 'Custom branding', included: true },
        { text: 'Bulk sending', included: true },
        { text: 'Unlimited templates', included: true },
        { text: 'Unlimited team members', included: true },
        { text: 'Full API access', included: true },
        { text: 'Priority support', included: true },
      ],
      cta: 'Start Free Trial',
      ctaLink: '/sign-up?plan=business',
      popular: false,
    },
    {
      name: 'Enterprise',
      icon: Crown,
      description: 'For large organizations with custom requirements',
      monthlyPrice: null,
      annualPrice: null,
      features: [
        { text: 'Everything in Business', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'SSO / SAML', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom SLA', included: true },
        { text: 'On-premise deployment', included: true },
        { text: 'Advanced analytics', included: true },
        { text: '24/7 phone support', included: true },
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      popular: false,
    },
  ]

  const faqs = [
    {
      question: 'Is there a free trial available?',
      answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start. You can explore all features and decide which plan works best for you.',
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Absolutely. You can upgrade or downgrade your plan at any time. If you upgrade, you\'ll be charged the prorated difference. If you downgrade, the change will take effect at the end of your billing cycle.',
    },
    {
      question: 'Are documents legally binding?',
      answer: 'Yes, all documents signed with MamaSign are legally binding in most countries. We comply with major e-signature laws including ESIGN Act (USA), eIDAS (EU), and similar regulations worldwide.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans. Enterprise customers can also pay via invoice.',
    },
    {
      question: 'What happens to my documents if I cancel?',
      answer: 'Your signed documents remain accessible for 30 days after cancellation. We recommend downloading all important documents before your subscription ends. Enterprise customers have custom retention options.',
    },
    {
      question: 'Do you offer discounts for nonprofits?',
      answer: 'Yes! We offer 50% off for verified nonprofit organizations. Contact our sales team with proof of nonprofit status to get your discount code.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use 256-bit AES encryption, are SOC 2 Type II certified, and comply with GDPR, HIPAA, and other major security standards. Your documents are encrypted both at rest and in transit.',
    },
    {
      question: 'Can I integrate MamaSign with other tools?',
      answer: 'Yes! We offer integrations with popular tools like Salesforce, Google Drive, Dropbox, and more. Our REST API is also available for custom integrations on Professional plans and above.',
    },
  ]

  const comparisonFeatures = [
    { name: 'Documents per month', free: '3', professional: 'Unlimited', business: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Team members', free: '1', professional: '5', business: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Templates', free: '-', professional: '10', business: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'API requests/month', free: '-', professional: '1,000', business: '10,000', enterprise: 'Unlimited' },
    { name: 'Storage', free: '100 MB', professional: '5 GB', business: '50 GB', enterprise: 'Unlimited' },
    { name: 'Audit trail', free: 'Basic', professional: 'Advanced', business: 'Advanced', enterprise: 'Advanced + Custom' },
    { name: 'Custom branding', free: '-', professional: '-', business: '✓', enterprise: '✓' },
    { name: 'SSO / SAML', free: '-', professional: '-', business: '-', enterprise: '✓' },
    { name: 'Dedicated support', free: '-', professional: '-', business: '-', enterprise: '✓' },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Simple, Transparent
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Choose the plan that fits your needs. Start free and upgrade as you grow. No hidden fees, no surprises.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  !isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? 'border-blue-500 shadow-xl shadow-blue-500/20'
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <plan.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  {plan.monthlyPrice !== null ? (
                    <>
                      <span className="text-4xl font-bold text-gray-900">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-gray-600">/month</span>
                      {isAnnual && plan.annualPrice !== plan.monthlyPrice && (
                        <p className="text-sm text-gray-500 mt-1">
                          Billed annually (${(plan.annualPrice || 0) * 12}/year)
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">Custom Pricing</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaLink}
                  className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Compare Plans
            </h2>
            <p className="text-xl text-gray-600">
              See what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">Free</th>
                  <th className="px-6 py-4 text-center font-semibold">Professional</th>
                  <th className="px-6 py-4 text-center font-semibold">Business</th>
                  <th className="px-6 py-4 text-center font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-medium text-gray-900">{feature.name}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{feature.free}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{feature.professional}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{feature.business}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using MamaSign. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-300">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
