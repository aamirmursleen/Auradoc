'use client'

import React from 'react'
import Link from 'next/link'
import {
  FileSignature,
  ArrowRight,
  Users,
  Globe,
  Heart,
  Target,
  Lightbulb,
  Shield,
  Award,
  Building2,
  MapPin,
  Linkedin,
  Twitter,
} from 'lucide-react'

const AboutPage: React.FC = () => {
  const stats = [
    { value: '10M+', label: 'Documents Signed' },
    { value: '50K+', label: 'Happy Customers' },
    { value: '150+', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make starts with our customers. We\'re obsessed with making document signing delightful.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your documents contain sensitive information. We protect them with enterprise-grade security at every level.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously push boundaries to make e-signatures faster, easier, and more accessible to everyone.',
    },
    {
      icon: Target,
      title: 'Simplicity',
      description: 'Complex problems deserve simple solutions. We believe powerful software should be effortless to use.',
    },
  ]

  const team = [
    {
      name: 'Sarah Ahmed',
      role: 'CEO & Co-Founder',
      bio: 'Former VP at DocuSign with 15+ years in enterprise software.',
      image: null,
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Google engineer, built systems serving billions of users.',
      image: null,
    },
    {
      name: 'Emily Rodriguez',
      role: 'VP of Product',
      bio: 'Product leader with experience at Dropbox and Slack.',
      image: null,
    },
    {
      name: 'James Wilson',
      role: 'VP of Engineering',
      bio: 'Engineering leader who scaled systems at AWS and Stripe.',
      image: null,
    },
    {
      name: 'Priya Sharma',
      role: 'VP of Customer Success',
      bio: 'Customer experience expert from Salesforce and HubSpot.',
      image: null,
    },
    {
      name: 'David Kim',
      role: 'VP of Security',
      bio: 'Cybersecurity veteran with 20+ years protecting enterprises.',
      image: null,
    },
  ]

  const milestones = [
    { year: '2020', event: 'MamaSign founded with a mission to simplify document signing' },
    { year: '2021', event: 'Launched public beta, reached 10,000 users in first month' },
    { year: '2022', event: 'Series A funding, expanded to 50+ countries' },
    { year: '2023', event: 'Reached 1 million signed documents milestone' },
    { year: '2024', event: 'SOC 2 Type II certification, enterprise features launch' },
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
              Making Document Signing
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Simple for Everyone
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              We believe signing documents shouldn't be complicated. That's why we built MamaSign - to make e-signatures accessible, secure, and delightfully easy.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  MamaSign was born out of frustration. Our founders, Sarah and Michael, were tired of dealing with complicated, expensive e-signature tools that made simple tasks unnecessarily difficult.
                </p>
                <p>
                  They envisioned a platform that anyone could use - from a small business owner signing their first contract to a large enterprise processing thousands of documents daily. A platform that just works, without the learning curve.
                </p>
                <p>
                  Today, MamaSign powers millions of signatures across 150+ countries. But our mission remains the same: make document signing so simple that it feels like magic.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl p-8 text-gray-900">
                <FileSignature className="w-16 h-16 mb-6 opacity-80" />
                <blockquote className="text-2xl font-medium mb-6">
                  "We wanted to build the e-signature platform we wished existed - simple, powerful, and accessible to everyone."
                </blockquote>
                <div>
                  <p className="font-semibold">Sarah Ahmed</p>
                  <p className="text-gray-900/70">CEO & Co-Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-100/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-700">
              Key milestones in our story
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-cyan-500 via-blue-600 to-purple-600 rounded-full" />

            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-gray-100/50 backdrop-blur-xl p-6 rounded-xl border border-gray-200/50 shadow-lg shadow-cyan-500/20">
                    <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                      {milestone.year}
                    </span>
                    <p className="text-gray-700 mt-2">{milestone.event}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-cyan-500 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Meet the people building the future of document signing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-100/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-cyan-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-700 text-sm mb-4">{member.bio}</p>
                <div className="flex items-center justify-center gap-3">
                  <a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Offices
            </h2>
            <p className="text-xl text-gray-700">
              A global team serving customers worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { city: 'San Francisco', country: 'United States', type: 'Headquarters' },
              { city: 'London', country: 'United Kingdom', type: 'EMEA Office' },
              { city: 'Singapore', country: 'Singapore', type: 'APAC Office' },
            ].map((office, index) => (
              <div key={index} className="p-8 bg-gray-100/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{office.city}</h3>
                <p className="text-gray-700 mb-2">{office.country}</p>
                <span className="text-sm text-cyan-600 font-medium">{office.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Awards & Recognition
            </h2>
            <p className="text-xl text-gray-600">
              Industry recognition for our innovation and excellence
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'G2 Leader 2024',
              'Capterra Best Value',
              'TrustRadius Top Rated',
              'Forbes Cloud 100',
            ].map((award, index) => (
              <div key={index} className="p-6 bg-gray-100 rounded-xl border border-gray-200 text-center">
                <Award className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-900 font-medium">{award}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Join Us on Our Mission
          </h2>
          <p className="text-xl text-gray-900/80 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people to join our team. Help us build the future of document signing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/careers" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300">
              View Open Positions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
