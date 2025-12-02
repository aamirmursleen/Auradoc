'use client'

import React from 'react'
import Link from 'next/link'
import {
  Shield,
  FileCheck,
  Globe,
  Building2,
  Scale,
  Lock,
  Users,
  CheckCircle,
  ArrowRight,
  Download,
  Eye,
  FileText,
  Award,
  MapPin,
  Clock,
  HelpCircle,
} from 'lucide-react'

const CompliancePage: React.FC = () => {
  const regulations = [
    {
      id: 'esign',
      name: 'ESIGN Act',
      region: 'United States',
      icon: Scale,
      description: 'The Electronic Signatures in Global and National Commerce Act establishes the legal validity of electronic signatures in the US.',
      status: 'Compliant',
      features: [
        'Electronic records have same legal effect as paper',
        'Electronic signatures are legally binding',
        'Consumer consent requirements supported',
        'Record retention requirements met',
      ],
    },
    {
      id: 'ueta',
      name: 'UETA',
      region: 'United States',
      icon: FileText,
      description: 'The Uniform Electronic Transactions Act provides state-level framework for electronic signatures adopted by 49 states.',
      status: 'Compliant',
      features: [
        'Uniform standards across states',
        'Attribution and validity requirements',
        'Record accuracy and retention',
        'Notarization alternatives supported',
      ],
    },
    {
      id: 'eidas',
      name: 'eIDAS',
      region: 'European Union',
      icon: Globe,
      description: 'The Electronic Identification and Trust Services Regulation provides legal framework for e-signatures across the EU.',
      status: 'Compliant',
      features: [
        'Simple Electronic Signatures (SES)',
        'Advanced Electronic Signatures (AES)',
        'Qualified Electronic Signatures (QES) support',
        'Cross-border recognition',
      ],
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      region: 'European Union',
      icon: Shield,
      description: 'The General Data Protection Regulation establishes data protection and privacy requirements for EU citizens.',
      status: 'Compliant',
      features: [
        'Data processing agreements available',
        'Right to access and portability',
        'Right to erasure supported',
        'Data breach notification procedures',
      ],
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      region: 'United States',
      icon: Users,
      description: 'The Health Insurance Portability and Accountability Act sets standards for protecting sensitive patient data.',
      status: 'Ready',
      features: [
        'Business Associate Agreements available',
        'PHI encryption and access controls',
        'Audit trail for all document access',
        'Minimum necessary access principle',
      ],
    },
    {
      id: 'soc2',
      name: 'SOC 2 Type II',
      region: 'Global',
      icon: FileCheck,
      description: 'Service Organization Control 2 attestation verifies our security, availability, and confidentiality controls.',
      status: 'Certified',
      features: [
        'Annual third-party audits',
        'Security controls verified',
        'Availability monitoring',
        'Confidentiality procedures',
      ],
    },
  ]

  const industries = [
    {
      name: 'Financial Services',
      icon: Building2,
      regulations: ['SEC Rule 17a-4', 'FINRA', 'Dodd-Frank', 'PCI DSS'],
    },
    {
      name: 'Healthcare',
      icon: Users,
      regulations: ['HIPAA', 'HITECH', 'FDA 21 CFR Part 11'],
    },
    {
      name: 'Real Estate',
      icon: MapPin,
      regulations: ['ESIGN', 'UETA', 'RESPA', 'State requirements'],
    },
    {
      name: 'Legal',
      icon: Scale,
      regulations: ['Court filing requirements', 'Bar association rules', 'Evidence standards'],
    },
    {
      name: 'Government',
      icon: Shield,
      regulations: ['FedRAMP', 'FISMA', 'StateRAMP', 'ITAR'],
    },
    {
      name: 'Insurance',
      icon: FileCheck,
      regulations: ['NAIC Model Laws', 'State insurance codes', 'AML/KYC'],
    },
  ]

  const documents = [
    { name: 'SOC 2 Type II Report', description: 'Latest audit report', format: 'PDF' },
    { name: 'Security Whitepaper', description: 'Detailed security overview', format: 'PDF' },
    { name: 'Data Processing Agreement', description: 'GDPR DPA template', format: 'PDF' },
    { name: 'Business Associate Agreement', description: 'HIPAA BAA template', format: 'PDF' },
    { name: 'Penetration Test Summary', description: 'Latest pentest results', format: 'PDF' },
    { name: 'Privacy Policy', description: 'Current privacy policy', format: 'PDF' },
  ]

  const faqs = [
    {
      question: 'Are electronic signatures legally binding?',
      answer: 'Yes, electronic signatures are legally binding in most jurisdictions worldwide. In the US, the ESIGN Act and UETA give electronic signatures the same legal standing as handwritten signatures. Similar laws exist in the EU (eIDAS), UK, Canada, Australia, and many other countries.',
    },
    {
      question: 'What makes an electronic signature valid?',
      answer: 'A valid electronic signature requires: (1) intent to sign, (2) consent to do business electronically, (3) association of the signature with the record, and (4) record retention. MamaSign captures all of these elements and provides a complete audit trail.',
    },
    {
      question: 'Can electronic signatures be used for all documents?',
      answer: 'Most documents can use electronic signatures, but some exceptions exist. Documents that typically require wet signatures include wills, certain family law documents, court documents, and some real estate documents depending on jurisdiction. Check local laws for specific requirements.',
    },
    {
      question: 'How do you ensure document integrity?',
      answer: 'We use cryptographic hashing to ensure document integrity. Every signed document receives a unique digital fingerprint that detects any modifications. Our tamper-evident seals and complete audit trails provide evidence that the document has not been altered.',
    },
    {
      question: 'What data residency options do you offer?',
      answer: 'Enterprise customers can choose to store their data in specific geographic regions including the United States, European Union, Australia, and Singapore. This helps meet data residency requirements under various regulations.',
    },
    {
      question: 'Do you offer a BAA for HIPAA compliance?',
      answer: 'Yes, we provide Business Associate Agreements (BAAs) for customers who need to comply with HIPAA. Our platform includes the technical safeguards, audit controls, and encryption required for handling protected health information.',
    },
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
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Compliance &
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Certifications
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              MamaSign meets the highest standards for security and compliance, helping you meet your regulatory requirements with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Request Compliance Pack
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="#regulations" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300">
                View Certifications
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Overview */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'SOC 2 Type II', status: 'Certified' },
              { name: 'ISO 27001', status: 'Certified' },
              { name: 'GDPR', status: 'Compliant' },
              { name: 'HIPAA', status: 'Ready' },
            ].map((cert, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{cert.name}</h3>
                <span className="text-green-400 text-sm font-medium">{cert.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulations */}
      <section id="regulations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Regulatory Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We help you meet compliance requirements across multiple regulations and jurisdictions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regulations.map((reg) => (
              <div key={reg.id} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <reg.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reg.status === 'Certified' ? 'bg-green-100 text-green-700' :
                    reg.status === 'Compliant' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {reg.status}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{reg.name}</h3>
                <p className="text-sm text-blue-600 mb-3">{reg.region}</p>
                <p className="text-gray-600 text-sm mb-4">{reg.description}</p>
                <ul className="space-y-2">
                  {reg.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Compliance */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Industry-Specific Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We understand the unique compliance needs of different industries
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <industry.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{industry.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {industry.regulations.map((reg, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {reg}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Compliance Documentation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access the documentation you need for your compliance requirements
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-500">{doc.description}</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Need additional documentation for your compliance review?
            </p>
            <Link href="/contact" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
              Contact our compliance team
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Compliance FAQ
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about e-signature compliance
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="flex items-start text-lg font-semibold text-gray-900 mb-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileCheck className="w-16 h-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Compliant?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Our team can help you understand how MamaSign meets your specific compliance requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300">
              Talk to Compliance Team
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/sign-up" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-300">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CompliancePage
