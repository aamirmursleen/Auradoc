'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  FileSignature, CheckCircle, ArrowRight, Check, Download, Send,
  Star, Sparkles, Zap, Users, Shield, TrendingUp, Eye, Clock
} from 'lucide-react'

// ─── Sunset Warm Hero ───
const SunsetHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [glowIntensity, setGlowIntensity] = useState(0)

  // Continuous glow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(g => (g + 0.05) % (Math.PI * 2))
    }, 30)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    ctx.strokeStyle = '#FF6B35'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    setIsDrawing(true)
    setHasSignature(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const glowValue = Math.abs(Math.sin(glowIntensity)) * 40

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{
      background: 'linear-gradient(135deg, #FFF5E6 0%, #FFE8CC 50%, #FFD6A5 100%)',
    }}>
      {/* Warm Animated Gradient Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-40 animate-pulse" style={{
        background: 'radial-gradient(circle, #FF6B35, transparent)',
        filter: 'blur(100px)',
        animation: 'warmFloat 10s ease-in-out infinite',
      }} />
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-35" style={{
        background: 'radial-gradient(circle, #F7931E, transparent)',
        filter: 'blur(80px)',
        animation: 'warmFloat 12s ease-in-out infinite reverse',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: Warm, Friendly Value Prop */}
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-orange-200 mb-8 shadow-lg">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 font-bold text-sm">SUMMER SALE — 50% OFF</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-black mb-8 leading-tight" style={{ color: '#2D1810' }}>
              Sign Smarter.
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                Save Thousands.
              </span>
            </h1>

            <p className="text-2xl text-gray-700 mb-6">
              DocuSign: <span className="line-through text-red-500 font-bold">$10,000/year</span>
              <br />
              MamaSign: <span className="text-orange-600 font-black text-4xl">$27</span>{' '}
              <span className="text-gray-600">one-time</span>
            </p>

            <p className="text-xl text-gray-600 mb-10">
              Same enterprise features. Same security. Same everything.
              <br />
              <span className="font-bold text-gray-900">99.7% less expensive.</span>
            </p>

            {/* Warm CTA */}
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                boxShadow: `0 20px 60px rgba(255,107,53,${0.3 + glowValue/100})`,
              }}
            >
              Get Enterprise for $27
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>

            <p className="text-gray-600 text-sm mt-6 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Instant access • Lifetime updates • 30-day guarantee
            </p>
          </div>

          {/* RIGHT: Document Signature Demo */}
          <div className="relative">
            <div className="rounded-3xl bg-white shadow-2xl p-8 border-2 border-orange-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                    <FileSignature className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold">Client_Agreement.pdf</p>
                    <p className="text-gray-500 text-sm">sign.yourcompany.com</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                  Ready
                </div>
              </div>

              {/* Signature Canvas */}
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                className="w-full rounded-xl cursor-crosshair mb-4"
                style={{
                  height: '160px',
                  background: '#FFF5E6',
                  border: '2px dashed #FF6B35',
                }}
              />

              {!hasSignature && (
                <p className="text-center text-gray-400 text-sm mb-4 animate-pulse">
                  ✍️ Sign with your mouse or finger
                </p>
              )}

              <button
                onClick={() => {
                  if (hasSignature) {
                    setShowSuccess(true)
                    setTimeout(() => setShowSuccess(false), 3000)
                  }
                }}
                disabled={!hasSignature}
                className="w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                style={{
                  background: hasSignature
                    ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                    : '#E5E5E5',
                  color: hasSignature ? 'white' : '#999',
                  boxShadow: hasSignature ? `0 10px 40px rgba(255,107,53,${0.3 + glowValue/100})` : 'none',
                }}
              >
                <Check className="w-5 h-5 inline mr-2" />
                Sign & Complete
              </button>

              {showSuccess && (
                <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 animate-fadeIn flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-900 font-bold text-sm">Document Signed!</p>
                    <p className="text-green-700 text-xs">All parties notified via email</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes warmFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(5deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </section>
  )
}

export default function SunsetWarmPage() {
  return (
    <main className="bg-[#FFF5E6]">
      <SunsetHero />
    </main>
  )
}
