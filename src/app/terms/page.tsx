'use client'

import React from 'react'
import Link from 'next/link'
import {
  FileText,
  Users,
  CreditCard,
  AlertTriangle,
  Scale,
  Shield,
  Clock,
  Ban,
  Mail,
  CheckCircle,
  XCircle,
} from 'lucide-react'

const TermsPage: React.FC = () => {
  const lastUpdated = 'January 1, 2024'
  const effectiveDate = 'January 1, 2024'

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: `By accessing or using MamaSign ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.

These Terms apply to all visitors, users, and others who access or use the Service. By using the Service, you represent that you are at least 16 years of age and have the legal capacity to enter into these Terms.

If you are using the Service on behalf of an organization, you are agreeing to these Terms on behalf of that organization and represent that you have the authority to bind that organization to these Terms.`,
    },
    {
      id: 'account',
      title: 'Account Registration',
      icon: Users,
      content: `To access certain features of the Service, you must create an account. When you create an account, you agree to:

• Provide accurate, current, and complete information
• Maintain and promptly update your account information
• Keep your password secure and confidential
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized use

We reserve the right to suspend or terminate your account if any information provided is inaccurate, incomplete, or violates these Terms.`,
    },
    {
      id: 'services',
      title: 'Description of Services',
      icon: FileText,
      content: `MamaSign provides electronic signature and document management services. Our services include:

• Electronic document signing and verification
• Document storage and management
• Signature request and tracking
• Template creation and management
• API access for integrations
• Team collaboration features

We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without notice. We will not be liable for any modification, suspension, or discontinuation of the Service.`,
    },
    {
      id: 'payments',
      title: 'Payments and Billing',
      icon: CreditCard,
      content: `Some features of the Service require payment. By subscribing to a paid plan, you agree to:

Billing: You will be billed in advance on a recurring basis (monthly or annually) depending on the plan selected. Your subscription will automatically renew unless canceled before the renewal date.

Payment Methods: You authorize us to charge your payment method for all fees incurred. You are responsible for providing valid payment information and keeping it current.

Price Changes: We may change our prices at any time. Price changes will take effect at the start of the next billing period. We will provide notice of any price changes.

Refunds: Subscription fees are non-refundable except as required by law. If you cancel your subscription, you will continue to have access until the end of your current billing period.

Taxes: All fees are exclusive of applicable taxes, which you are responsible for paying.`,
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use Policy',
      icon: Shield,
      content: `You agree not to use the Service to:

• Violate any laws, regulations, or third-party rights
• Upload, transmit, or distribute any harmful, threatening, or offensive content
• Send spam or unsolicited communications
• Impersonate any person or entity
• Interfere with or disrupt the Service or servers
• Attempt to gain unauthorized access to any part of the Service
• Use the Service for any illegal or unauthorized purpose
• Transmit viruses, malware, or other harmful code
• Scrape or collect data from the Service without permission
• Circumvent any access controls or usage limits

We reserve the right to investigate and take appropriate action against anyone who violates these Terms, including removing content and terminating accounts.`,
    },
    {
      id: 'content',
      title: 'Your Content',
      icon: FileText,
      content: `You retain ownership of all content you upload to the Service ("Your Content"). By uploading content, you grant us a limited license to store, process, and display Your Content solely to provide the Service.

You are responsible for:

• Ensuring you have the right to upload and share Your Content
• The accuracy and legality of Your Content
• Backing up Your Content (we are not responsible for loss of data)
• Complying with all applicable laws regarding Your Content

We do not review, endorse, or guarantee the accuracy of any content. We may remove content that violates these Terms or applicable law.`,
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: Scale,
      content: `The Service, including its original content, features, and functionality, is owned by MamaSign and protected by copyright, trademark, and other intellectual property laws.

Our trademarks, logos, and service marks may not be used without our prior written consent. You may not copy, modify, distribute, sell, or lease any part of the Service or its software.

If you provide feedback or suggestions about the Service, you grant us the right to use such feedback without restriction or compensation to you.`,
    },
    {
      id: 'legal-validity',
      title: 'Legal Validity of E-Signatures',
      icon: CheckCircle,
      content: `MamaSign is designed to help create legally binding electronic signatures in compliance with applicable laws including:

• Electronic Signatures in Global and National Commerce Act (ESIGN)
• Uniform Electronic Transactions Act (UETA)
• eIDAS Regulation (EU)
• Similar laws in other jurisdictions

However, we do not guarantee that all signatures created using our Service will be legally binding in all circumstances. The legal validity of electronic signatures may depend on:

• The type of document being signed
• The jurisdiction where the document will be enforced
• Specific industry regulations
• How the signature is applied

We recommend consulting with legal counsel for documents requiring specific legal formalities.`,
    },
    {
      id: 'warranties',
      title: 'Disclaimers and Warranties',
      icon: AlertTriangle,
      content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

We do not warrant that:

• The Service will be uninterrupted, secure, or error-free
• The results obtained from the Service will be accurate
• Any defects in the Service will be corrected

TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions may not apply to you.`,
    },
    {
      id: 'limitation',
      title: 'Limitation of Liability',
      icon: Ban,
      content: `TO THE FULLEST EXTENT PERMITTED BY LAW, MAMASIGN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:

• Loss of profits, revenue, or data
• Business interruption
• Cost of substitute services
• Any other intangible losses

OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

These limitations apply regardless of the legal theory on which the claim is based.`,
    },
    {
      id: 'indemnification',
      title: 'Indemnification',
      icon: Shield,
      content: `You agree to indemnify, defend, and hold harmless MamaSign and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising from:

• Your use of the Service
• Your violation of these Terms
• Your violation of any third-party rights
• Your Content uploaded to the Service`,
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: XCircle,
      content: `You may terminate your account at any time by following the instructions in your account settings.

We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including:

• Breach of these Terms
• Request by law enforcement
• Unexpected technical issues
• Extended periods of inactivity

Upon termination:

• Your right to use the Service will immediately cease
• You may lose access to your data
• We may delete your account and content
• Provisions that should survive termination will remain in effect`,
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Disputes',
      icon: Scale,
      content: `These Terms are governed by the laws of the State of California, without regard to its conflict of law provisions.

Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.

You agree to waive any right to a jury trial or to participate in a class action lawsuit.

If any provision of these Terms is found unenforceable, the remaining provisions will continue in effect.`,
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      icon: Clock,
      content: `We reserve the right to modify these Terms at any time. If we make material changes, we will notify you by email or through a notice on the Service before the changes take effect.

Your continued use of the Service after the changes take effect constitutes your acceptance of the new Terms. If you do not agree to the new Terms, you must stop using the Service.`,
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-gray-900" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-4">
              Please read these terms carefully before using MamaSign. By using our service, you agree to be bound by these terms.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <span>Effective: {effectiveDate}</span>
              <span>•</span>
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-gray-50/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Table of Contents</h2>
          <nav className="grid sm:grid-cols-2 gap-4">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center p-4 bg-gray-50/80 rounded-lg border border-gray-200/50 hover:bg-blue-600/20 transition-colors"
              >
                <span className="text-blue-400 font-medium mr-3">{index + 1}.</span>
                <span className="text-gray-700">{section.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12 bg-gray-50/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {sections.map((section, index) => (
            <div key={section.id} id={section.id} className="mb-12 scroll-mt-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <section.icon className="w-6 h-6 text-gray-900" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {index + 1}. {section.title}
                </h2>
              </div>

              <div className="bg-gray-50/80 rounded-xl p-8 shadow-lg border border-gray-200/50">
                <div className="prose prose-gray max-w-none">
                  {section.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center">
            <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About These Terms?</h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              If you have any questions about these Terms of Service, please contact our legal team.
            </p>
            <Link
              href="mailto:legal@mamasign.com"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300"
            >
              legal@mamasign.com
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsPage
