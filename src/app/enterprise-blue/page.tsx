'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileSignature, CheckCircle, ArrowRight, Check, Shield, BarChart3,
  Users, Globe, Lock, Award, Zap, Target, TrendingUp, Star, Clock,
  Sparkles, ShieldCheck, Bell, Eye
} from 'lucide-react'

// ─── Enterprise Hero with Trust ───
const EnterpriseHero = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 1))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{
      background: 'linear-gradient(180deg, #032D60 0%, #0176D3 50%, #032D60 100%)',
    }}>
      {/* Trust Pattern Background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT: Enterprise Messaging */}
          <div className="text-white">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-sm">Trusted by 4,000+ enterprises</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              Enterprise E-Signature.
              <br />
              <span className="text-[#00C9FF]">Startup Price.</span>
            </h1>

            <p className="text-2xl text-blue-100 mb-10 leading-relaxed">
              Get the same features Fortune 500 companies pay{' '}
              <span className="font-bold text-red-300">$10,000/year</span> for.
              <br />
              <span className="font-black text-4xl text-[#00C9FF]">You pay $27. Once.</span>
            </p>

            {/* Enterprise Features */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {[
                'Enterprise security',
                'Unlimited users',
                'Custom branding',
                'Priority support',
                'SLA guarantees',
                'Dedicated success manager',
                'Advanced analytics',
                'Full API access',
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00C9FF] flex-shrink-0 mt-0.5" />
                  <span className="text-blue-100 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Professional CTA */}
            <div className="flex gap-4">
              <Link
                href="/pricing"
                className="px-10 py-5 rounded-lg font-bold text-xl bg-white text-[#0176D3] hover:bg-blue-50 transition-all shadow-xl"
              >
                Get Enterprise Access
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-5 rounded-lg font-semibold text-lg text-white border-2 border-white/30 hover:bg-white/10 transition-all"
              >
                Schedule Demo
              </Link>
            </div>

            <p className="text-blue-200 text-sm mt-6 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              30-day money-back guarantee • SOC 2 compliant
            </p>
          </div>

          {/* RIGHT: Analytics Dashboard Demo */}
          <div className="relative">
            <div className="rounded-2xl p-8 bg-white shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-gray-900 font-bold text-xl">Performance Dashboard</p>
                  <p className="text-gray-500 text-sm">Real-time analytics</p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-green-50 text-green-700 font-bold text-sm">
                  ↑ 247% ROI
                </div>
              </div>

              {/* Animated Progress Bars */}
              <div className="space-y-6 mb-8">
                {[
                  { label: 'Documents Signed', value: progress, color: '#0176D3' },
                  { label: 'Conversion Rate', value: (progress * 0.8) % 100, color: '#00C9FF' },
                  { label: 'Team Efficiency', value: (progress * 0.6) % 100, color: '#4CAF50' },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-semibold text-sm">{metric.label}</span>
                      <span className="text-gray-900 font-bold">{Math.floor(metric.value)}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${metric.value}%`,
                          background: metric.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: FileSignature, value: '2,491', label: 'Signed' },
                  { icon: Users, value: '847', label: 'Active' },
                  { icon: TrendingUp, value: '94%', label: 'Success' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-gray-50">
                    <stat.icon className="w-6 h-6 text-[#0176D3] mx-auto mb-2" />
                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                    <p className="text-gray-600 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -right-6 px-6 py-4 rounded-xl bg-white shadow-xl border-2 border-[#0176D3] animate-bounce" style={{
              animationDuration: '3s',
            }}>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-[#0176D3]" />
                <div>
                  <p className="font-black text-[#0176D3]">SOC 2 Type II</p>
                  <p className="text-gray-600 text-xs">Enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Trust Section with Rotating Logos ───
const TrustSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(i => (i + 1) % 6)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const logos = ['Fortune 500', 'Healthcare', 'Legal Firms', 'Tech Startups', 'Finance', 'Education']

  return (
    <section className="py-16 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-gray-500 font-semibold mb-8">TRUSTED BY INDUSTRY LEADERS</p>
        <div className="flex items-center justify-center gap-12">
          {logos.map((logo, i) => (
            <div
              key={i}
              className={`text-gray-400 font-bold transition-all duration-500 ${
                i === activeIndex ? 'text-[#0176D3] scale-110' : 'scale-100 opacity-50'
              }`}
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function EnterpriseBluePage() {
  return (
    <main>
      <EnterpriseHero />
      <TrustSection />
    </main>
  )
}
