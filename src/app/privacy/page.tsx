'use client'

import React from 'react'
import Link from 'next/link'
import {
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  Mail,
  Globe,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

const PrivacyPage: React.FC = () => {
  const lastUpdated = 'January 1, 2024'

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      content: [
        {
          subtitle: 'Account Information',
          text: 'When you create an account, we collect your name, email address, and password. If you sign up using a third-party service like Google, we receive your profile information from that service.',
        },
        {
          subtitle: 'Document Data',
          text: 'We store the documents you upload for signing, including any signatures, initials, and other annotations added during the signing process. Documents are encrypted and stored securely.',
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect information about how you use MamaSign, including pages visited, features used, and time spent in the application. This helps us improve our services.',
        },
        {
          subtitle: 'Device Information',
          text: 'We collect information about the devices you use to access MamaSign, including device type, operating system, browser type, IP address, and unique device identifiers.',
        },
      ],
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        {
          subtitle: 'Providing Services',
          text: 'We use your information to provide, maintain, and improve MamaSign, including processing document signatures, sending notifications, and providing customer support.',
        },
        {
          subtitle: 'Communication',
          text: 'We may send you service-related emails, such as account verification, transaction confirmations, and important updates. You can opt out of marketing communications at any time.',
        },
        {
          subtitle: 'Security',
          text: 'We use your information to detect, prevent, and respond to fraud, abuse, security risks, and technical issues that could harm MamaSign or our users.',
        },
        {
          subtitle: 'Analytics',
          text: 'We analyze usage patterns to understand how users interact with MamaSign, which helps us prioritize features and improve the user experience.',
        },
      ],
    },
    {
      id: 'data-sharing',
      title: 'How We Share Your Information',
      icon: UserCheck,
      content: [
        {
          subtitle: 'With Your Consent',
          text: 'We share your information when you direct us to, such as when you send a document to another party for signature or share a signed document.',
        },
        {
          subtitle: 'Service Providers',
          text: 'We work with trusted third-party companies that help us provide MamaSign, including cloud hosting, email delivery, and analytics. These providers are bound by strict confidentiality agreements.',
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law, such as in response to a valid subpoena or court order, or to protect the rights and safety of MamaSign and our users.',
        },
        {
          subtitle: 'Business Transfers',
          text: 'If MamaSign is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change.',
        },
      ],
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: [
        {
          subtitle: 'Encryption',
          text: 'All data transmitted to and from MamaSign is encrypted using TLS 1.3. Documents at rest are encrypted using AES-256 encryption. Your passwords are hashed and salted.',
        },
        {
          subtitle: 'Infrastructure',
          text: 'We use enterprise-grade cloud infrastructure with SOC 2 Type II certification. Our data centers have 24/7 physical security, redundant power, and environmental controls.',
        },
        {
          subtitle: 'Access Controls',
          text: 'Access to user data is strictly limited to employees who need it to do their jobs. We use multi-factor authentication and audit logs to track all access.',
        },
        {
          subtitle: 'Incident Response',
          text: 'We have a dedicated security team and incident response plan. In the event of a data breach, we will notify affected users as required by applicable law.',
        },
      ],
    },
    {
      id: 'your-rights',
      title: 'Your Privacy Rights',
      icon: Shield,
      content: [
        {
          subtitle: 'Access and Portability',
          text: 'You can access your personal information at any time through your account settings. You can also request a copy of your data in a portable format.',
        },
        {
          subtitle: 'Correction',
          text: 'If your personal information is inaccurate or incomplete, you can update it through your account settings or by contacting our support team.',
        },
        {
          subtitle: 'Deletion',
          text: 'You can request deletion of your account and associated data. Some information may be retained as required by law or for legitimate business purposes.',
        },
        {
          subtitle: 'Opt-Out',
          text: 'You can opt out of marketing communications at any time. You can also control cookies and tracking technologies through your browser settings.',
        },
      ],
    },
    {
      id: 'international',
      title: 'International Data Transfers',
      icon: Globe,
      content: [
        {
          subtitle: 'Data Location',
          text: 'MamaSign processes data in the United States and other countries where we or our service providers operate. We ensure appropriate safeguards are in place for international transfers.',
        },
        {
          subtitle: 'GDPR Compliance',
          text: 'For users in the European Economic Area, we comply with GDPR requirements including data processing agreements and standard contractual clauses for data transfers.',
        },
        {
          subtitle: 'Privacy Shield',
          text: 'We adhere to the principles of the EU-U.S. and Swiss-U.S. Privacy Shield Frameworks, although we recognize these may no longer serve as valid transfer mechanisms.',
        },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: FileText,
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'We use essential cookies to enable core functionality like authentication and security. These cookies cannot be disabled.',
        },
        {
          subtitle: 'Analytics Cookies',
          text: 'We use analytics cookies to understand how users interact with MamaSign. You can opt out of analytics cookies through your browser settings.',
        },
        {
          subtitle: 'Marketing Cookies',
          text: 'With your consent, we may use marketing cookies to deliver relevant advertisements. You can manage your preferences in our cookie settings.',
        },
      ],
    },
    {
      id: 'children',
      title: "Children's Privacy",
      icon: AlertCircle,
      content: [
        {
          subtitle: 'Age Requirement',
          text: 'MamaSign is not intended for children under 16. We do not knowingly collect personal information from children. If we learn we have collected data from a child, we will delete it.',
        },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to This Policy',
      icon: FileText,
      content: [
        {
          subtitle: 'Updates',
          text: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a notice on our website before the changes take effect.',
        },
      ],
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-muted backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 text-primary mr-2" />
              Privacy at a Glance
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Lock className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">Your documents are encrypted with 256-bit encryption</p>
              </div>
              <div className="flex items-start">
                <UserCheck className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">We never sell your personal information to third parties</p>
              </div>
              <div className="flex items-start">
                <Eye className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">You control who can access your documents</p>
              </div>
              <div className="flex items-start">
                <Database className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">You can export or delete your data at any time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Table of Contents</h2>
          <nav className="grid sm:grid-cols-2 gap-4">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center p-4 bg-muted rounded-lg hover:bg-secondary transition-colors border border-border"
              >
                <span className="text-primary font-medium mr-3">{index + 1}.</span>
                <span className="text-muted-foreground">{section.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {sections.map((section, index) => (
            <div key={section.id} id={section.id} className="mb-12 scroll-mt-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-4">
                  <section.icon className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {index + 1}. {section.title}
                </h2>
              </div>

              <div className="bg-muted backdrop-blur-xl rounded-xl p-8 shadow-lg border border-border space-y-6">
                {section.content.map((item, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-foreground mb-2">{item.subtitle}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-muted rounded-2xl p-8 text-center border border-border">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Questions About Privacy?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              If you have any questions about this Privacy Policy or our data practices, please contact our privacy team.
            </p>
            <Link
              href="mailto:privacy@mamasign.com"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-black bg-primary rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-300"
            >
              privacy@mamasign.com
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPage
