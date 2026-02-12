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
  Building2,
  MapPin,
  Code,
} from 'lucide-react'

const AboutPage: React.FC = () => {
  const stats = [
    { value: '150+', label: 'Countries Served' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24h', label: 'Avg Support Response' },
    { value: '7+', label: 'Free PDF Tools' },
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

  const departments = [
    {
      icon: Code,
      title: 'Engineering',
      description: 'Building reliable, secure infrastructure for document signing at scale.',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Protecting your documents with enterprise-grade encryption and compliance.',
    },
    {
      icon: Heart,
      title: 'Customer Success',
      description: 'Dedicated to helping every user get the most from MamaSign.',
    },
  ]

  const milestones = [
    { year: '2020', event: 'MamaSign founded with a mission to simplify document signing' },
    { year: '2021', event: 'Launched public beta and began serving customers worldwide' },
    { year: '2022', event: 'Expanded product suite with PDF tools and templates' },
    { year: '2023', event: 'Introduced team collaboration and API access' },
    { year: '2024', event: 'Launched enterprise features and advanced security' },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Making Document Signing
              <span className="block mt-2 text-primary">
                Simple for Everyone
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              We believe signing documents shouldn't be complicated. That's why we built MamaSign - to make e-signatures accessible, secure, and delightfully easy.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
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
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
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
              <div className="absolute inset-0 bg-primary rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-primary rounded-2xl p-8 text-black">
                <FileSignature className="w-16 h-16 mb-6 opacity-80" />
                <blockquote className="text-2xl font-medium mb-6">
                  "We wanted to build the e-signature platform we wished existed - simple, powerful, and accessible to everyone."
                </blockquote>
                <div>
                  <p className="font-semibold">Sarah Ahmed</p>
                  <p className="opacity-70">CEO & Co-Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-muted backdrop-blur-xl p-8 rounded-2xl border border-border hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              Key milestones in our story
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary rounded-full" />

            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-muted backdrop-blur-xl p-6 rounded-xl border border-border shadow-lg shadow-primary/20">
                    <span className="text-2xl font-bold text-primary">
                      {milestone.year}
                    </span>
                    <p className="text-muted-foreground mt-2">{milestone.event}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-primary rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A passionate team dedicated to making document signing simple, secure, and accessible
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <div key={index} className="bg-muted backdrop-blur-xl p-8 rounded-2xl border border-border text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <dept.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{dept.title}</h3>
                <p className="text-muted-foreground text-sm">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Global Reach
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              MamaSign serves customers across 150+ countries with support available in multiple time zones.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Globe className="w-6 h-6 text-primary" />
              <span className="text-muted-foreground text-lg">Americas &bull; Europe &bull; Asia-Pacific</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Join Us on Our Mission
          </h2>
          <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people to join our team. Help us build the future of document signing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/careers" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary bg-black rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300">
              View Open Positions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-black border-2 border-black rounded-lg hover:bg-black/10 transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
