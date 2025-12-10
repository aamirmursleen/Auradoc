'use client'

import React from 'react'
import Link from 'next/link'
import {
  Shield,
  Lock,
  Server,
  Eye,
  Key,
  FileCheck,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Globe,
  Database,
  Clock,
  Fingerprint,
  Layers,
  Cpu,
  Cloud,
  RefreshCw,
} from 'lucide-react'

const SecurityPage: React.FC = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All documents are encrypted using 256-bit AES encryption, both in transit (TLS 1.3) and at rest. Your data is protected at every stage.',
    },
    {
      icon: Server,
      title: 'Secure Infrastructure',
      description: 'Our infrastructure is hosted on SOC 2 Type II certified data centers with 24/7 physical security, biometric access, and environmental controls.',
    },
    {
      icon: Key,
      title: 'Access Controls',
      description: 'Strict role-based access controls ensure only authorized personnel can access systems. All access is logged and audited.',
    },
    {
      icon: Eye,
      title: 'Audit Trails',
      description: 'Complete audit trails track every action on your documents, providing transparency and accountability for compliance purposes.',
    },
    {
      icon: Fingerprint,
      title: 'Multi-Factor Authentication',
      description: 'Protect your account with MFA using authenticator apps, SMS, or hardware security keys. Required for all administrative access.',
    },
    {
      icon: RefreshCw,
      title: 'Regular Backups',
      description: 'Automated backups occur multiple times daily with geographically distributed storage to ensure your data is never lost.',
    },
  ]

  const certifications = [
    {
      name: 'SOC 2 Type II',
      description: 'Verified security, availability, and confidentiality controls',
      icon: FileCheck,
    },
    {
      name: 'ISO 27001',
      description: 'International information security management standard',
      icon: Shield,
    },
    {
      name: 'GDPR Compliant',
      description: 'Full compliance with EU data protection regulations',
      icon: Globe,
    },
    {
      name: 'HIPAA Ready',
      description: 'Healthcare data protection requirements supported',
      icon: Users,
    },
  ]

  const securityPractices = [
    {
      category: 'Application Security',
      icon: Cpu,
      practices: [
        'Secure software development lifecycle (SSDLC)',
        'Regular penetration testing by third parties',
        'Automated vulnerability scanning',
        'Code reviews for all changes',
        'Dependency vulnerability monitoring',
        'Web Application Firewall (WAF)',
      ],
    },
    {
      category: 'Data Protection',
      icon: Database,
      practices: [
        'AES-256 encryption at rest',
        'TLS 1.3 encryption in transit',
        'Secure key management (HSM)',
        'Data minimization practices',
        'Automatic data retention policies',
        'Secure data destruction',
      ],
    },
    {
      category: 'Infrastructure Security',
      icon: Cloud,
      practices: [
        'Private network isolation',
        'DDoS protection',
        'Intrusion detection systems',
        'Real-time threat monitoring',
        'Automated security patches',
        'Disaster recovery planning',
      ],
    },
    {
      category: 'Operational Security',
      icon: Layers,
      practices: [
        'Security awareness training',
        'Background checks for employees',
        'Incident response procedures',
        'Business continuity planning',
        '24/7 security operations center',
        'Regular security assessments',
      ],
    },
  ]

  const stats = [
    { value: '99.99%', label: 'Uptime SLA' },
    { value: '256-bit', label: 'AES Encryption' },
    { value: '24/7', label: 'Security Monitoring' },
    { value: '0', label: 'Data Breaches' },
  ]

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
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Security You Can
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Trust
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Your documents contain sensitive information. We protect them with enterprise-grade security at every level, so you can sign with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/security/whitepaper" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Download Security Whitepaper
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-gray-600 rounded-xl hover:border-gray-500 hover:bg-gray-800 transition-all duration-300">
                Talk to Security Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 border-t border-gray-800">
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

      {/* Security Features */}
      <section className="py-20 bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Multiple layers of protection keep your documents and data safe
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="p-8 bg-gray-900/80 border border-gray-700/50 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Certifications & Compliance
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Third-party verified security and compliance standards
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <div key={index} className="p-8 bg-gray-900/80 rounded-2xl border border-gray-700/50 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <cert.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{cert.name}</h3>
                <p className="text-gray-300 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/compliance" className="inline-flex items-center text-blue-400 font-medium hover:text-blue-300">
              View all compliance certifications
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20 bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Security Practices
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive security measures across every layer of our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityPractices.map((category, index) => (
              <div key={index} className="bg-gray-900/80 border border-gray-700/50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{category.category}</h3>
                </div>
                <ul className="space-y-3">
                  {category.practices.map((practice, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vulnerability Disclosure */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <AlertTriangle className="w-12 h-12 text-yellow-400 mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Responsible Disclosure
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                Security is a collaborative effort. We welcome reports from security researchers who discover vulnerabilities in our platform.
              </p>
              <p className="text-gray-400 mb-8">
                We operate a responsible disclosure program and will work with researchers to fix issues and recognize their contributions.
              </p>
              <Link href="/security/disclosure" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300">
                Report a Vulnerability
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">Program Highlights</h3>
              <ul className="space-y-4">
                {[
                  'Safe harbor for good-faith research',
                  'Acknowledgment on our security page',
                  'Bug bounty rewards for valid reports',
                  'Direct communication with security team',
                  'Timely response and updates',
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Center */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Lock className="w-16 h-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Have Security Questions?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Our security team is here to help. Contact us to discuss your security requirements or request documentation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300">
              Contact Security Team
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/trust" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-300">
              Visit Trust Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SecurityPage
