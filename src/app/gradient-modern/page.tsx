'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  FileSignature, CheckCircle, Star, ArrowRight, Zap, Check, Eye,
  TrendingUp, BarChart3, Clock, Sparkles, Send, Download, Shield,
  Globe, Award, Users, FileText, CreditCard, Lock, Target
} from 'lucide-react'

// ─── Animated Gradient Background ───
const AnimatedGradientBg = () => {
  const [hue, setHue] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHue(h => (h + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0" style={{
      background: `linear-gradient(135deg,
        hsl(${270 + hue * 0.1}, 70%, 50%) 0%,
        hsl(${320 + hue * 0.1}, 70%, 55%) 50%,
        hsl(${270 + hue * 0.1}, 70%, 50%) 100%)`,
      animation: 'gradientFlow 15s ease infinite',
      backgroundSize: '200% 200%',
    }} />
  )
}

// ─── HERO: Flowing Gradients ───
const GradientHero = () => {
  const [nameInput, setNameInput] = useState('Sarah Johnson')
  const [titleInput, setTitleInput] = useState('Product Designer')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <AnimatedGradientBg />

      {/* Floating Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-30 animate-blob" style={{
        background: 'radial-gradient(circle, rgba(236,72,153,0.8), transparent)',
        filter: 'blur(60px)',
        animation: 'blob 7s infinite',
      }} />
      <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full opacity-25 animate-blob animation-delay-2000" style={{
        background: 'radial-gradient(circle, rgba(147,51,234,0.8), transparent)',
        filter: 'blur(80px)',
        animation: 'blob 9s infinite 2s',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: Value Prop */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 bg-white/10 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold text-sm">ENTERPRISE FOR EVERYONE</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-black mb-8 leading-tight">
              Enterprise E-Sign
              <br />
              <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                Without Enterprise Pricing
              </span>
            </h1>

            <p className="text-2xl mb-6 text-white/90">
              Pay <span className="line-through text-white/60">$999</span>{' '}
              <span className="font-black text-4xl bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
                $27
              </span>{' '}
              once.
            </p>

            <p className="text-xl text-white/80 mb-10">
              Everything DocuSign charges $10,000/year for.
              <br />
              Yours. Forever. For the price of lunch.
            </p>

            <div className="flex gap-4 mb-8">
              <Link
                href="/pricing"
                className="px-10 py-5 rounded-xl font-bold text-xl bg-white text-purple-600 hover:scale-105 transition-transform flex items-center gap-2 group"
                style={{ boxShadow: '0 20px 60px rgba(255,255,255,0.3)' }}
              >
                Get Started — $27
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Lifetime access</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4" /> No monthly fees</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4" /> All updates free</span>
            </div>
          </div>

          {/* RIGHT: Interactive Resume Builder */}
          <div className="relative">
            <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="mb-6">
                <label className="block text-white/70 text-sm font-bold mb-2">Your Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-pink-300 transition-all"
                />
              </div>
              <div className="mb-6">
                <label className="block text-white/70 text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-purple-300 transition-all"
                />
              </div>

              {/* Live Preview */}
              <div className="p-6 rounded-xl bg-white transition-all duration-500">
                <div className="h-20 rounded-t-xl mb-12 relative transition-all duration-700" style={{
                  background: 'linear-gradient(135deg, #7B3FFF 0%, #EC4899 100%)',
                }}>
                  <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl bg-gradient-to-br from-purple-400 to-pink-400">
                    ✨
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 transition-all duration-300">
                  {nameInput || 'Your Name'}
                </h3>
                <p className="text-lg font-semibold mb-6 transition-all duration-500" style={{
                  background: 'linear-gradient(135deg, #7B3FFF 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {titleInput || 'Your Title'}
                </p>
                <div className="flex gap-2">
                  {['Design', 'Strategy', 'Leadership'].map((skill, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full mt-4 px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform">
                <Download className="w-5 h-5 inline mr-2" />
                Download Resume PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
    </section>
  )
}

export default function GradientModernPage() {
  return (
    <main>
      <GradientHero />
      {/* More sections to be added */}
    </main>
  )
}
