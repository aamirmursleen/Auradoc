'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  FileSignature, CheckCircle, ArrowRight, Check, Download,
  Shield, Sparkles, Clock, Users, Star, Lock, Globe, Send
} from 'lucide-react'

// ─── Floating Animation Hook ───
const useFloating = () => {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const animate = () => {
      setOffset(o => (o + 0.3) % 360)
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [])
  return Math.sin(offset * Math.PI / 180) * 10
}

// ─── Apple-Style Hero ───
const AppleHero = () => {
  const translateY = useFloating()
  const [activeField, setActiveField] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveField(f => (f + 1) % 3)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Subtle Gradient Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-30" style={{
        background: 'radial-gradient(circle, rgba(0,122,255,0.1), transparent 70%)',
        filter: 'blur(80px)',
        transform: `translate(-50%, ${translateY}px)`,
      }} />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <div className="inline-block px-5 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold mb-8">
          Enterprise features. Consumer pricing.
        </div>

        <h1 className="text-6xl lg:text-8xl font-bold mb-8 text-gray-900 tracking-tight">
          Sign documents.
          <br />
          <span className="text-[#007AFF]">Simply.</span>
        </h1>

        <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Everything DocuSign charges $10,000/year for.
          <br />
          Yours for <span className="font-semibold text-gray-900">$27</span>. Once.
        </p>

        {/* Interactive Product Demo */}
        <div className="max-w-3xl mx-auto mb-12" style={{
          transform: `translateY(${translateY}px)`,
          transition: 'transform 0.3s ease-out',
        }}>
          <div className="rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden p-8">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
              {['Sign', 'Create', 'Send'].map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveField(i)}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeField === i
                      ? 'bg-white text-[#007AFF] shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="min-h-[200px] flex items-center justify-center">
              {activeField === 0 && (
                <div className="w-full text-center animate-fadeIn">
                  <div className="w-full h-32 rounded-xl bg-gray-50 border-2 border-dashed border-[#007AFF]/30 flex items-center justify-center mb-4 cursor-pointer hover:border-[#007AFF] transition-colors">
                    <p className="text-gray-400">Draw signature here</p>
                  </div>
                  <button className="px-8 py-3 bg-[#007AFF] text-white font-semibold rounded-full hover:bg-[#0051D5] transition-colors">
                    Apply Signature
                  </button>
                </div>
              )}
              {activeField === 1 && (
                <div className="w-full animate-fadeIn">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {['Minimal', 'Modern', 'Classic'].map((template, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#007AFF] hover:shadow-lg transition-all cursor-pointer">
                        <div className="h-24 bg-gradient-to-br from-[#007AFF]/20 to-transparent rounded-lg mb-2" />
                        <p className="text-sm font-semibold text-gray-700">{template}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeField === 2 && (
                <div className="w-full animate-fadeIn">
                  <input
                    type="email"
                    placeholder="recipient@company.com"
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all mb-4"
                  />
                  <button className="w-full px-8 py-4 bg-[#007AFF] text-white font-semibold rounded-full hover:bg-[#0051D5] transition-colors">
                    <Send className="w-5 h-5 inline mr-2" />
                    Send for Signature
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Callout */}
        <div className="mt-12 inline-flex items-center gap-8 px-8 py-5 rounded-2xl bg-white shadow-xl border border-gray-200">
          <div className="text-left">
            <p className="text-sm text-gray-500 mb-1">Others charge</p>
            <p className="text-3xl font-bold text-red-500 line-through">$10,000/year</p>
          </div>
          <ArrowRight className="w-8 h-8 text-[#007AFF]" />
          <div className="text-left">
            <p className="text-sm text-gray-500 mb-1">You pay</p>
            <p className="text-4xl font-black text-[#007AFF]">$27 once</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
      `}</style>
    </section>
  )
}

// ─── Clean Feature Grid ───
const MinimalFeatures = () => {
  const features = [
    { icon: FileSignature, title: 'Unlimited Signatures', desc: 'Sign as many docs as you need' },
    { icon: Users, title: 'Unlimited Team', desc: 'Whole company, same price' },
    { icon: Globe, title: 'Custom Domain', desc: 'sign.yourcompany.com' },
    { icon: Sparkles, title: 'White-Label', desc: 'Your brand, not ours' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption' },
    { icon: Lock, title: 'Compliance', desc: 'ESIGN, eIDAS, GDPR' },
  ]

  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-gray-900 mb-20">
          Everything. <span className="text-[#007AFF]">Included.</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-8 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <feature.icon className="w-12 h-12 text-[#007AFF] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function MinimalApplePage() {
  return (
    <main className="bg-white">
      <AppleHero />
      <MinimalFeatures />
    </main>
  )
}
