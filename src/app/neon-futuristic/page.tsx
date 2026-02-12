'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileSignature, ArrowRight, Check, Zap, Star, Download,
  Send, Eye, TrendingUp, Sparkles, Target
} from 'lucide-react'

// ─── Neon Hero with Glassmorphism ───
const NeonHero = () => {
  const [invoiceItems, setInvoiceItems] = useState([
    { name: 'Web Design', amount: 3500 },
    { name: 'Branding', amount: 1200 },
  ])

  const total = invoiceItems.reduce((sum, item) => sum + item.amount, 0)

  const addItem = () => {
    setInvoiceItems([...invoiceItems, {
      name: `Service ${invoiceItems.length + 1}`,
      amount: Math.floor(Math.random() * 2000) + 500
    }])
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0D0221 0%, #0F0524 50%, #1a0933 100%)',
    }}>
      {/* Animated Neon Grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,0,110,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        animation: 'gridSlide 20s linear infinite',
      }} />

      {/* Floating Neon Shapes - Continuous Motion */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-40" style={{
        background: 'radial-gradient(circle, #00F0FF, transparent)',
        filter: 'blur(60px)',
        animation: 'neonFloat 8s ease-in-out infinite',
      }} />
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-30" style={{
        background: 'radial-gradient(circle, #FF006E, transparent)',
        filter: 'blur(80px)',
        animation: 'neonFloat 10s ease-in-out infinite reverse',
      }} />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full opacity-35" style={{
        background: 'radial-gradient(circle, #FFBE0B, transparent)',
        filter: 'blur(50px)',
        animation: 'neonFloat 7s ease-in-out infinite 2s',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT: Neon Value Prop */}
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 backdrop-blur-xl" style={{
              background: 'rgba(0,240,255,0.1)',
              border: '1px solid rgba(0,240,255,0.5)',
              boxShadow: '0 0 20px rgba(0,240,255,0.3)',
            }}>
              <Zap className="w-4 h-4 text-[#00F0FF]" />
              <span className="text-[#00F0FF] font-bold text-sm uppercase tracking-widest">
                LIGHTNING DEAL
              </span>
            </div>

            <h1 className="text-7xl lg:text-8xl font-black mb-10 leading-none">
              <span className="text-white">Stop</span>
              <br />
              <span className="bg-gradient-to-r from-[#00F0FF] via-[#FF006E] to-[#FFBE0B] bg-clip-text text-transparent animate-gradientShift">
                Overpaying
              </span>
            </h1>

            <p className="text-3xl font-bold mb-6">
              <span className="text-white">Enterprise e-sign for</span>{' '}
              <span className="text-[#00F0FF] text-5xl">$27</span>
            </p>

            <p className="text-xl text-gray-400 mb-12">
              Not <span className="line-through text-red-400">$10,000/year</span>.
              Not <span className="line-through text-red-400">$999/month</span>.
              <br />
              <span className="text-white font-bold">$27. One time. Forever.</span>
            </p>

            {/* Neon CTA */}
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-3 px-12 py-6 rounded-2xl font-black text-2xl transition-all duration-300 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #00F0FF 0%, #FF006E 100%)',
                color: '#000',
                boxShadow: '0 0 60px rgba(0,240,255,0.6), 0 0 100px rgba(255,0,110,0.4)',
              }}
            >
              <span className="relative z-10">Get Enterprise — $27</span>
              <ArrowRight className="w-7 h-7 relative z-10 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>

            <p className="text-gray-500 text-sm mt-4">
              ⚡ 3,492 teams upgraded in the last 7 days
            </p>
          </div>

          {/* RIGHT: Glassmorphic Invoice Demo */}
          <div className="relative">
            <div className="rounded-3xl p-8 backdrop-blur-2xl" style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px 0 rgba(0,240,255,0.2), inset 0 0 60px rgba(255,0,110,0.1)',
            }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#FF006E] flex items-center justify-center">
                    <FileSignature className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Invoice #2026</p>
                    <p className="text-gray-400 text-sm">sign.yourcompany.com</p>
                  </div>
                </div>
                <button
                  onClick={addItem}
                  className="px-4 py-2 rounded-lg font-bold text-sm bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 hover:bg-[#00F0FF]/30 transition-all"
                >
                  + Add
                </button>
              </div>

              {/* Items with continuous update animation */}
              <div className="space-y-3 mb-6">
                {invoiceItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10"
                  >
                    <span className="text-white">{item.name}</span>
                    <span className="text-[#00F0FF] font-bold text-xl">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Animated Total */}
              <div className="p-6 rounded-2xl" style={{
                background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(255,0,110,0.1))',
                border: '1px solid rgba(0,240,255,0.3)',
                boxShadow: '0 0 40px rgba(0,240,255,0.2)',
              }}>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-4xl font-black bg-gradient-to-r from-[#00F0FF] to-[#FF006E] bg-clip-text text-transparent">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button className="px-6 py-3 rounded-xl font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all">
                  <Download className="w-4 h-4 inline mr-2" />
                  Download
                </button>
                <button className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-[#00F0FF] to-[#FF006E] text-black hover:scale-105 transition-transform">
                  <Send className="w-4 h-4 inline mr-2" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes neonFloat {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(40px, -40px); }
          66% { transform: translate(-30px, 40px); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes gridSlide {
          0% { transform: translateY(0); }
          100% { transform: translateY(60px); }
        }
        .animate-gradientShift {
          background-size: 200% auto;
          animation: gradientShift 3s ease infinite;
        }
      `}</style>
    </section>
  )
}

export default function NeonFuturisticPage() {
  return (
    <main>
      <NeonHero />
    </main>
  )
}
