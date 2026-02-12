'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  FileText, CheckCircle, Star, ArrowRight, Download, FileSignature, Users, Shield,
  CreditCard, ShieldCheck, FileCheck, Clock, Lock, Zap, Globe, Award, FileType,
  Image, Minimize2, PenTool, Layers, Scissors, Droplets, X, Check, ChevronDown,
  Send, Sparkles, TrendingUp, Heart, MousePointerClick, Bell, Eye, DollarSign,
  AlertCircle, Target, Briefcase, Rocket, BarChart3, TrendingDown
} from 'lucide-react'
import HeroSection from '@/components/home/HeroSection'
import FloatingMobileCTA from '@/components/FloatingMobileCTA'
import { useTheme } from '@/components/ThemeProvider'
import MobileAppShell from '@/components/mobile/MobileAppShell'
import MobileHomeDashboard from '@/components/mobile/MobileHomeDashboard'

// ─── Animated Counter ───
const AnimatedCounter = ({ target, prefix = '', suffix = '', duration = 2000 }: {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
}) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const steps = 60
          const increment = target / steps
          let current = 0

          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)

          return () => clearInterval(timer)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, hasAnimated])

  return (
    <div ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  )
}

// ─── CalendarJet-Style Dark Hero with Pricing Comparison ───
const EnterpriseHero = ({ isDark }: { isDark: boolean }) => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32 xl:py-40" style={{
      background: 'linear-gradient(180deg, #1F1F1F 0%, #252525 50%, #1F1F1F 100%)',
    }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23c4ff0e" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 xl:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-32 items-center">
          {/* LEFT: Value Proposition + Pricing */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{
              background: 'rgba(196,255,14,0.1)',
              border: '1px solid rgba(196,255,14,0.3)',
            }}>
              <Zap className="w-4 h-4 text-[#c4ff0e]" />
              <span className="text-[#c4ff0e] text-sm font-bold uppercase tracking-wider">
                ENTERPRISE FEATURES • ONE-TIME PAYMENT
              </span>
            </div>

            {/* Pricing Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8" style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
            }}>
              <span className="text-white font-bold bg-red-500 px-3 py-1 rounded-full text-sm">
                50% OFF
              </span>
              <span className="text-red-400 line-through text-lg font-semibold">$999</span>
              <span className="text-[#c4ff0e] text-2xl font-black">$497</span>
              <span className="text-gray-400 text-sm">— Limited Time</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.05] mb-6" style={{
              letterSpacing: '-1.5px',
            }}>
              Stop Paying DocuSign{' '}
              <span className="text-red-400">$180/Month</span>
              <br />
              For Enterprise E-Signature
            </h1>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-gray-300 font-medium mb-4">
              Get every DocuSign Enterprise feature for{' '}
              <span className="text-[#c4ff0e] font-bold line-through decoration-red-500">$999</span>{' '}
              <span className="text-[#c4ff0e] font-black text-3xl">$497</span>{' '}
              <span className="text-[#c4ff0e]">one-time</span> instead of $2,160/year.
            </p>

            <p className="text-lg text-gray-400 mb-10">
              Pay once, own it forever.
            </p>

            {/* Feature Comparison */}
            <p className="text-white text-lg font-semibold mb-4">
              Everything DocuSign locks behind{' '}
              <span className="text-red-400 font-black">$180/month</span> yours forever:
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-10">
              {[
                'Custom Domain (sign.yourco.com)',
                'White-Label Branding',
                'Unlimited Team Seats',
                'Full API Access',
                'AI Assistant',
                '1-Click Import from DocuSign',
                'Advanced Analytics',
                'Webhooks & Integrations',
                'Priority Support',
                'Blockchain Verification',
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#c4ff0e] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Pricing Box */}
            <div className="p-6 rounded-2xl mb-8" style={{
              background: 'rgba(196,255,14,0.05)',
              border: '2px solid rgba(196,255,14,0.3)',
            }}>
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">50% OFF — Lifetime Deal</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-gray-500 line-through text-2xl font-bold">$999</span>
                    <span className="text-[#c4ff0e] text-5xl font-black">$497</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">vs. DocuSign Enterprise</p>
                  <p className="text-red-400 text-2xl font-bold line-through">$15,000/yr</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-[#c4ff0e] font-bold text-lg mb-1">
                  Save <AnimatedCounter target={74503} prefix="$" /> over 5 years
                </p>
                <p className="text-sm text-gray-400">
                  • Pay once, own forever  • No monthly fees  • Yours to keep
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/pricing"
                className="group px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #c4ff0e 0%, #a8ff00 100%)',
                  color: '#000',
                  boxShadow: '0 0 40px rgba(196,255,14,0.3)',
                }}
              >
                Get Enterprise Access
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/demo"
                className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                }}
              >
                Watch 2-min Demo
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              ⚡ Price goes back to $999 when this deal ends. Lock in $497 now
            </p>
          </div>

          {/* RIGHT: Interactive Signature Demo */}
          <div className="relative">
            {/* Browser Window Frame */}
            <div className="rounded-2xl overflow-hidden" style={{
              background: '#252525',
              border: '1px solid #3A3A3A',
              boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8), 0 0 40px rgba(196,255,14,0.1)',
            }}>
              {/* Browser Chrome */}
              <div className="px-4 py-3 flex items-center gap-3" style={{
                background: '#1F1F1F',
                borderBottom: '1px solid #3A3A3A',
              }}>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-6 py-1.5 rounded-lg text-sm text-white/40 flex items-center gap-2" style={{
                    background: 'rgba(255,255,255,0.05)',
                  }}>
                    <Lock className="w-3 h-3 text-green-400" />
                    sign.yourcompany.com
                  </div>
                </div>
              </div>

              {/* Signature Interface */}
              <InteractiveSignatureDemo />
            </div>

            {/* Trust Badges Below */}
            <div className="flex items-center justify-center gap-6 mt-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c4ff0e]" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#c4ff0e]" />
                <span>ESIGN Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#c4ff0e]" />
                <span>180+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Interactive Signature Demo Component ───
const InteractiveSignatureDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    ctx.strokeStyle = '#c4ff0e'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
    setHasSignature(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const handleSign = () => {
    if (hasSignature) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  return (
    <div className="p-8">
      {/* Document Preview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#c4ff0e] flex items-center justify-center">
              <FileSignature className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Enterprise_Agreement.pdf</p>
              <p className="text-gray-500 text-xs">Ready to sign</p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-bold" style={{
            background: 'rgba(196,255,14,0.15)',
            color: '#c4ff0e',
          }}>
            In Progress
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full rounded-xl cursor-crosshair"
          style={{
            height: '120px',
            background: 'rgba(255,255,255,0.03)',
            border: '2px dashed rgba(196,255,14,0.3)',
          }}
        />

        {!hasSignature && (
          <p className="text-center text-gray-500 text-sm mt-3">
            Sign with your mouse above
          </p>
        )}
      </div>

      {/* Sign Button */}
      <button
        onClick={handleSign}
        disabled={!hasSignature}
        className="w-full px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          background: hasSignature ? 'linear-gradient(135deg, #c4ff0e 0%, #a8ff00 100%)' : 'rgba(255,255,255,0.05)',
          color: hasSignature ? '#000' : 'rgba(255,255,255,0.3)',
          opacity: hasSignature ? 1 : 0.5,
          boxShadow: hasSignature ? '0 0 20px rgba(196,255,14,0.2)' : 'none',
        }}
      >
        <Check className="w-5 h-5" />
        Sign Document
      </button>

      {/* Success State */}
      {showSuccess && (
        <div className="mt-4 p-4 rounded-xl animate-fade-in-up" style={{
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.3)',
        }}>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-green-400 font-bold text-sm">Document Signed!</p>
              <p className="text-gray-400 text-xs">All parties notified</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Social Proof / Featured Section ───
const FeaturedSection = () => {
  return (
    <section className="py-6" style={{
      background: '#171717',
      borderTop: '1px solid #2a2a2a',
      borderBottom: '1px solid #2a2a2a',
    }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm font-medium">
            <span className="text-[#c4ff0e] font-bold">2,847+</span> businesses switched from DocuSign
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#c4ff0e]" />
              <span className="text-gray-400 text-sm">Product Hunt #7</span>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#c4ff0e] text-[#c4ff0e]" />
              ))}
              <span className="text-gray-400 text-sm ml-2">4.9/5 (1,200+ reviews)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Cost Comparison Table (CalendarJet-style) ───
const CostComparisonSection = ({ isDark }: { isDark: boolean }) => {
  const years = [1, 2, 3, 4, 5]
  const mamaSignCost = 497
  const docuSignYearlyCost = 2160 // $180/month x 12

  return (
    <section className="py-20 lg:py-28" style={{ background: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-[#4C00FF] font-bold uppercase tracking-wider text-sm mb-4">
            The Math is Simple
          </p>
          <h2 className="text-4xl lg:text-5xl font-black mb-6 text-gray-900">
            Same Features. <span className="text-[#4C00FF]">99.3% Less.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DocuSign Enterprise costs <span className="font-bold text-red-500">$15,000+/year</span>.
            MamaSign gives you the same features for <span className="font-bold text-[#4C00FF]">$497 once</span>.
          </p>
        </div>

        {/* 5-Year Cost Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 text-gray-700 font-bold">Year</th>
                <th className="text-center py-4 px-6">
                  <div className="text-center">
                    <p className="font-black text-xl text-[#4C00FF] mb-1">MamaSign</p>
                    <p className="text-xs text-gray-500">One-time payment</p>
                  </div>
                </th>
                <th className="text-center py-4 px-6">
                  <div className="text-center">
                    <p className="font-black text-xl text-gray-700 mb-1">DocuSign</p>
                    <p className="text-xs text-gray-500">$180/month</p>
                  </div>
                </th>
                <th className="text-right py-4 px-6 text-gray-700 font-bold">Your Savings</th>
              </tr>
            </thead>
            <tbody>
              {years.map((year) => {
                const docuSignTotal = docuSignYearlyCost * year
                const savings = docuSignTotal - mamaSignCost
                return (
                  <tr key={year} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-6 px-6 font-semibold text-gray-700">Year {year}</td>
                    <td className="py-6 px-6 text-center">
                      <span className="text-2xl font-black text-[#4C00FF]">
                        ${mamaSignCost.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <span className="text-2xl font-black text-red-500">
                        ${docuSignTotal.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-xl font-black text-green-600">
                          +${savings.toLocaleString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
              <tr className="bg-[#4C00FF]/5">
                <td className="py-6 px-6 font-black text-gray-900 text-lg">5-Year Total</td>
                <td className="py-6 px-6 text-center">
                  <span className="text-3xl font-black text-[#4C00FF]">$497</span>
                </td>
                <td className="py-6 px-6 text-center">
                  <span className="text-3xl font-black text-red-500 line-through">$10,800</span>
                </td>
                <td className="py-6 px-6 text-right">
                  <div className="inline-flex flex-col items-end">
                    <span className="text-4xl font-black text-green-600">
                      <AnimatedCounter target={10303} prefix="$" />
                    </span>
                    <span className="text-sm font-bold text-green-600">saved</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ROI Metrics */}
        <div className="grid grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#4C00FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-[#4C00FF]" />
            </div>
            <p className="text-3xl font-black text-gray-900 mb-2">
              <AnimatedCounter target={2063} prefix="$" />
            </p>
            <p className="text-sm text-gray-600 font-medium">Annual Savings</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-black text-gray-900 mb-2">
              <AnimatedCounter target={3} /> days
            </p>
            <p className="text-sm text-gray-600 font-medium">Break-Even Point</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-black text-gray-900 mb-2">
              <AnimatedCounter target={2073} />%
            </p>
            <p className="text-sm text-gray-600 font-medium">5-Year ROI</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 group"
            style={{
              background: 'linear-gradient(135deg, #4C00FF 0%, #7B3FFF 100%)',
              color: '#fff',
              boxShadow: '0 10px 30px rgba(76,0,255,0.3)',
            }}
          >
            Lock In $497 Lifetime Deal
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            💰 Price increases to $997 when this deal ends
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Uncomfortable Truth Section (Dark Psychology) ───
const UncomfortableTruthSection = ({ isDark }: { isDark: boolean }) => {
  return (
    <section className="py-20 lg:py-32" style={{
      background: 'linear-gradient(180deg, #1F1F1F 0%, #1a1a1a 100%)',
    }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
        }}>
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm font-bold uppercase tracking-wider">
            THE UNCOMFORTABLE TRUTH
          </span>
        </div>

        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
          You're Bleeding{' '}
          <span className="text-red-400">
            <AnimatedCounter target={2160} prefix="$" duration={1500} />
          </span>
          /Year on DocuSign
        </h2>

        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          That's <span className="font-bold text-white">$180 every single month</span> for features you could own forever for $497.
        </p>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 text-left">
          {[
            {
              icon: TrendingDown,
              title: '$10,800 in 5 Years',
              desc: 'Money that could hire a developer, run ads, or invest in growth',
            },
            {
              icon: Clock,
              title: 'Every Month You Wait',
              desc: 'Another $180 down the drain. That\'s $6/day you\'re never getting back',
            },
            {
              icon: AlertCircle,
              title: 'Locked Into Their Ecosystem',
              desc: 'They own your data, your templates, your workflows. Migration gets harder every month',
            },
            {
              icon: DollarSign,
              title: 'Hidden Fees Add Up',
              desc: 'Premium templates? Extra. More storage? Extra. API access? You guessed it—extra',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                  background: 'rgba(239,68,68,0.1)',
                }}>
                  <item.icon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The Solution */}
        <div className="p-8 rounded-2xl mb-10" style={{
          background: 'rgba(76,0,255,0.05)',
          border: '2px solid rgba(76,0,255,0.3)',
        }}>
          <h3 className="text-2xl font-black text-white mb-4">
            What Could You Do With <span className="text-[#c4ff0e]">$10,000</span>?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
            <div>✓ Hire a developer</div>
            <div>✓ Run ad campaigns</div>
            <div>✓ Build new features</div>
            <div>✓ Expand your team</div>
            <div>✓ Invest in tools</div>
            <div>✓ Upgrade equipment</div>
            <div>✓ Pay yourself more</div>
            <div>✓ Grow your business</div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-10 py-5 rounded-xl font-black text-xl transition-all duration-300 group"
          style={{
            background: 'linear-gradient(135deg, #c4ff0e 0%, #a8ff00 100%)',
            color: '#000',
            boxShadow: '0 0 50px rgba(196,255,14,0.4)',
          }}
        >
          Stop the Bleeding — Get MamaSign
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="text-gray-400 text-sm mt-6">
          Pay $497 once. Own it forever. <span className="text-[#c4ff0e] font-bold">Never pay again.</span>
        </p>
      </div>
    </section>
  )
}

// ─── Feature Showcase Template ───
const FeatureShowcase = ({
  reverse = false,
  badge,
  badgeIcon: BadgeIcon,
  title,
  highlight,
  description,
  features,
  cta,
  ctaHref,
  demo,
  bgLight = true,
}: {
  reverse?: boolean
  badge: string
  badgeIcon: React.ElementType
  title: string
  highlight?: string
  description: string
  features: string[]
  cta: string
  ctaHref: string
  demo: React.ReactNode
  bgLight?: boolean
}) => {
  return (
    <section className="py-20 lg:py-28" style={{
      background: bgLight ? '#FFFFFF' : '#F8F8F8',
    }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          {/* Demo Side */}
          <div className={reverse ? 'lg:order-2' : ''}>
            {demo}
          </div>

          {/* Content Side */}
          <div className={reverse ? 'lg:order-1' : ''}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{
              background: 'rgba(76,0,255,0.08)',
              border: '1px solid rgba(76,0,255,0.15)',
            }}>
              <BadgeIcon className="w-4 h-4 text-[#4C00FF]" />
              <span className="text-[#4C00FF] text-sm font-bold uppercase tracking-wider">{badge}</span>
            </div>

            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 mb-6 leading-tight">
              {title}
              {highlight && <span className="text-[#4C00FF]"> {highlight}</span>}
            </h2>

            <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>

            <ul className="space-y-4 mb-10">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 group"
              style={{
                background: 'linear-gradient(135deg, #4C00FF 0%, #7B3FFF 100%)',
                color: '#fff',
              }}
            >
              {cta}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Individual Feature Showcases ───

const CustomBrandingShowcase = ({ isDark }: { isDark: boolean }) => (
  <FeatureShowcase
    badge="Custom Branding"
    badgeIcon={Sparkles}
    title="Your Brand."
    highlight="Your Domain. Your Rules."
    description="White-label everything. From sign.yourcompany.com to your logo on every email. Look like the enterprise you are."
    features={[
      'Custom domain (sign.yourco.com) — No "Powered by MamaSign" branding',
      'Upload your logo, set your colors, match your brand guidelines',
      'Custom email templates with your branding on every notification',
      'Branded signing pages that match your website perfectly',
      'White-label PDF certificates — Your name, not ours',
    ]}
    cta="See Custom Branding"
    ctaHref="/features/branding"
    demo={
      <div className="rounded-2xl overflow-hidden shadow-2xl" style={{
        background: '#252525',
        border: '1px solid #3A3A3A',
      }}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4C00FF] to-[#7B3FFF] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">Your Company</p>
              <p className="text-gray-400 text-sm">sign.yourcompany.com</p>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="h-3 bg-white/5 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-5/6" />
          </div>
          <div className="p-4 rounded-xl" style={{
            background: 'rgba(76,0,255,0.1)',
            border: '2px dashed rgba(76,0,255,0.3)',
          }}>
            <p className="text-[#4C00FF] font-bold text-sm mb-2">✓ Your Logo Here</p>
            <p className="text-gray-400 text-xs">Fully branded experience</p>
          </div>
        </div>
      </div>
    }
  />
)

const TemplateBuilderShowcase = ({ isDark }: { isDark: boolean }) => (
  <FeatureShowcase
    reverse
    badge="Template Builder"
    badgeIcon={FileText}
    title="Build Templates Once."
    highlight="Use Forever."
    description="Stop recreating the same documents. Build templates, add fields, save time. Perfect for NDAs, contracts, proposals, onboarding docs."
    features={[
      'Drag-and-drop template builder — No coding required',
      'Pre-fill fields automatically from your CRM or database',
      'Conditional logic: Show fields based on previous answers',
      'Template library with 100+ professional templates included',
      'Share templates across your team with one click',
    ]}
    cta="Explore Templates"
    ctaHref="/templates"
    bgLight={false}
    demo={
      <div className="rounded-2xl p-8 shadow-2xl" style={{
        background: 'white',
        border: '1px solid #E5E5E5',
      }}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-gray-900">Document Template</p>
            <div className="flex gap-2">
              {['NDA', 'Contract', 'Proposal'].map((t, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    i === 0 ? 'bg-[#4C00FF] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {['Company Name', 'Signer Name', 'Contract Date'].map((field, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-[#4C00FF]/10 rounded flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#4C00FF]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{field}</p>
                  <p className="text-xs text-gray-500">Auto-filled from contact</p>
                </div>
                <Check className="w-4 h-4 text-green-600" />
              </div>
            ))}
          </div>
        </div>
        <button className="w-full px-4 py-3 rounded-xl font-bold" style={{
          background: 'linear-gradient(135deg, #4C00FF 0%, #7B3FFF 100%)',
          color: 'white',
        }}>
          Create From Template
        </button>
      </div>
    }
  />
)

const AnalyticsDashboardShowcase = ({ isDark }: { isDark: boolean }) => (
  <FeatureShowcase
    badge="Analytics"
    badgeIcon={BarChart3}
    title="Know What's Working."
    highlight="(And What's Not)"
    description="See exactly who opened, viewed, and signed. Track conversion rates. Identify bottlenecks. Make data-driven decisions."
    features={[
      'Real-time dashboard: Who opened, when, from where, on what device',
      'Conversion tracking: See drop-off points in your signature flow',
      'Team performance metrics: Who closes fastest, who needs help',
      'Document analytics: Which templates convert best',
      'Export reports for stakeholders (CSV, PDF, or API)',
    ]}
    cta="View Analytics"
    ctaHref="/features/analytics"
    demo={
      <div className="rounded-2xl p-8 shadow-2xl" style={{
        background: 'linear-gradient(135deg, #1F1F1F 0%, #252525 100%)',
        border: '1px solid #3A3A3A',
      }}>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Sent', value: '1,247', color: '#4C00FF' },
            { label: 'Opened', value: '1,089', color: '#7B3FFF' },
            { label: 'Signed', value: '982', color: '#c4ff0e' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
              <p className="text-2xl font-black" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[
            { name: 'Enterprise Agreement', rate: 92, count: 145 },
            { name: 'NDA Template', rate: 88, count: 234 },
            { name: 'Service Contract', rate: 76, count: 89 },
          ].map((doc, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-sm font-semibold">{doc.name}</p>
                  <p className="text-[#c4ff0e] text-sm font-bold">{doc.rate}%</p>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${doc.rate}%`,
                    background: 'linear-gradient(90deg, #4C00FF, #c4ff0e)',
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    }
  />
)

const APIIntegrationsShowcase = ({ isDark }: { isDark: boolean }) => (
  <FeatureShowcase
    reverse
    badge="API & Integrations"
    badgeIcon={Zap}
    title="Plug Into Everything."
    highlight="Automate Everything."
    description="Full REST API. Webhooks for real-time events. Native integrations with the tools you already use. Build custom workflows."
    features={[
      'Full REST API: Send docs, track status, download signed PDFs programmatically',
      'Webhooks: Get notified instantly when docs are opened, signed, or declined',
      'Zapier integration: Connect to 5,000+ apps without code',
      'Native integrations: Salesforce, HubSpot, Slack, Google Drive, Dropbox',
      "Developer docs that don't suck (seriously, they're actually good)",
    ]}
    cta="View API Docs"
    ctaHref="/api-docs"
    bgLight={false}
    demo={
      <div className="rounded-2xl p-6 shadow-2xl font-mono text-sm" style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
      }}>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-500 text-xs">API Request</span>
        </div>
        <div className="space-y-2">
          <p className="text-purple-400">POST <span className="text-gray-400">/api/documents/send</span></p>
          <p className="text-gray-600">{'{'}</p>
          <p className="text-blue-400 ml-4">"template"<span className="text-gray-400">:</span> <span className="text-green-400">"nda"</span>,</p>
          <p className="text-blue-400 ml-4">"signer"<span className="text-gray-400">:</span> <span className="text-green-400">"john@example.com"</span>,</p>
          <p className="text-blue-400 ml-4">"webhook"<span className="text-gray-400">:</span> <span className="text-green-400">"https://..."</span></p>
          <p className="text-gray-600">{'}'}</p>
          <p className="text-gray-600 mt-4">{'→'} <span className="text-[#c4ff0e]">200 OK</span></p>
        </div>
      </div>
    }
  />
)

const TeamCollaborationShowcase = ({ isDark }: { isDark: boolean }) => (
  <FeatureShowcase
    badge="Team Collaboration"
    badgeIcon={Users}
    title="Your Entire Team."
    highlight="One Platform."
    description="Unlimited seats. Role-based permissions. Shared templates. Team analytics. Everyone on the same page, literally."
    features={[
      'Unlimited team members — No per-seat pricing (seriously)',
      'Role-based access: Admin, Manager, Member permissions',
      'Shared template library: Everyone uses the same approved templates',
      'Team inbox: See all pending signatures in one place',
      'Activity log: Full audit trail of who did what, when',
    ]}
    cta="Invite Your Team"
    ctaHref="/team"
    demo={
      <div className="rounded-2xl p-8 shadow-2xl" style={{
        background: 'white',
        border: '1px solid #E5E5E5',
      }}>
        <div className="flex items-center justify-between mb-6">
          <p className="font-bold text-gray-900">Team Members</p>
          <button className="px-4 py-2 rounded-lg font-bold text-sm" style={{
            background: '#4C00FF',
            color: 'white',
          }}>
            + Invite
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Sarah Johnson', role: 'Admin', active: true },
            { name: 'Mike Chen', role: 'Manager', active: true },
            { name: 'Emily Rodriguez', role: 'Member', active: false },
            { name: 'David Park', role: 'Member', active: true },
          ].map((member, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white`} style={{
                background: `linear-gradient(135deg, ${['#4C00FF', '#7B3FFF', '#9D5CFF', '#B97EFF'][i]} 0%, ${['#7B3FFF', '#9D5CFF', '#B97EFF', '#D5A0FF'][i]} 100%)`,
              }}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${member.active ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
          ))}
        </div>
      </div>
    }
  />
)

const SecurityComplianceShowcase = ({ isDark }: { isDark: boolean }) => (
  <FeatureShowcase
    reverse
    badge="Security & Compliance"
    badgeIcon={ShieldCheck}
    title="Enterprise Security."
    highlight="Without the Price Tag."
    description="Bank-level encryption. SOC 2 ready. GDPR compliant. ESIGN & eIDAS certified. Your data is safer than your bank account."
    features={[
      'AES-256 encryption at rest, TLS 1.3 in transit',
      'SOC 2 Type II compliance (audit report available on request)',
      'GDPR, CCPA, HIPAA-ready infrastructure',
      'ESIGN Act (US) & eIDAS (EU) legally binding signatures',
      '99.9% uptime SLA with automatic failover',
    ]}
    cta="View Security"
    ctaHref="/security"
    bgLight={false}
    demo={
      <div className="rounded-2xl p-8 shadow-2xl" style={{
        background: 'linear-gradient(135deg, #1F1F1F 0%, #252525 100%)',
        border: '1px solid #3A3A3A',
      }}>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: ShieldCheck, label: 'SOC 2 Type II', color: '#c4ff0e' },
            { icon: Lock, label: 'AES-256', color: '#4C00FF' },
            { icon: Globe, label: 'GDPR Ready', color: '#7B3FFF' },
            { icon: Award, label: 'ESIGN Certified', color: '#c4ff0e' },
            { icon: Shield, label: '99.9% Uptime', color: '#4C00FF' },
            { icon: FileCheck, label: 'Audit Logs', color: '#7B3FFF' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <item.icon className="w-8 h-8 mb-3" style={{ color: item.color }} />
              <p className="text-white font-bold text-sm">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-lg" style={{
          background: 'rgba(76,0,255,0.1)',
          border: '1px solid rgba(76,0,255,0.3)',
        }}>
          <p className="text-[#c4ff0e] font-bold text-sm mb-1">✓ Enterprise-Grade Security</p>
          <p className="text-gray-400 text-xs">Same infrastructure as Fortune 500 companies</p>
        </div>
      </div>
    }
  />
)

// ─── Enterprise Feature Grid ───
const EnterpriseFeatureGrid = ({ isDark }: { isDark: boolean }) => {
  const features = [
    { icon: FileSignature, title: 'Unlimited Signatures', desc: 'No limits. Ever.' },
    { icon: Users, title: 'Unlimited Team Seats', desc: 'Whole company, no extra cost' },
    { icon: Globe, title: 'Custom Domain', desc: 'sign.yourcompany.com' },
    { icon: Sparkles, title: 'White-Label Branding', desc: 'Your logo, your colors' },
    { icon: FileText, title: 'Template Library', desc: '100+ professional templates' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time dashboards' },
    { icon: Zap, title: 'Full API Access', desc: 'Build custom integrations' },
    { icon: Bell, title: 'Webhooks', desc: 'Real-time event notifications' },
    { icon: ShieldCheck, title: 'SOC 2 Compliance', desc: 'Enterprise security' },
    { icon: Lock, title: 'SSO Integration', desc: 'Google, Microsoft, SAML' },
    { icon: Target, title: 'Priority Support', desc: '24/7 dedicated help' },
    { icon: Rocket, title: 'No Monthly Fees', desc: 'Pay once, own forever' },
  ]

  return (
    <section className="py-20 lg:py-32" style={{ background: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
            Everything Enterprise.{' '}
            <span className="text-[#4C00FF]">Nothing Held Back.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DocuSign charges extra for these. We include them all.{' '}
            <span className="font-bold">For $497. Once.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group"
              style={{
                background: '#FAFAFA',
                border: '1px solid #E5E5E5',
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4C00FF] to-[#7B3FFF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            <strong className="text-gray-900">Everything above</strong> for $497. DocuSign charges{' '}
            <span className="text-red-500 font-bold">$15,000+/year</span> for the same.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials Section ───
const TestimonialsSection = ({ isDark }: { isDark: boolean }) => {
  const testimonials = [
    {
      quote: "Switched from DocuSign and saved $14,000 in year one. Same features, zero regrets. The one-time payment model is a game-changer.",
      author: 'Sarah Chen',
      role: 'VP of Operations',
      company: 'TechFlow Inc.',
      initials: 'SC',
      metric: 'Saved $14,000/year',
    },
    {
      quote: "We were paying DocuSign $180/month for 3 users. MamaSign gave us unlimited seats for $497 total. ROI was 2 weeks.",
      author: 'Michael Rodriguez',
      role: 'CEO',
      company: 'GrowthLabs',
      initials: 'MR',
      metric: '$180/mo → $497 once',
    },
    {
      quote: "The custom branding alone justified the switch. Our clients don't see 'Powered by MamaSign' — they see our brand. Feels premium.",
      author: 'Emily Park',
      role: 'Legal Director',
      company: 'Innovate Corp',
      initials: 'EP',
      metric: 'White-label everything',
    },
    {
      quote: "DocuSign wanted $300/month for API access. MamaSign includes it. We built custom integrations in days, not months.",
      author: 'David Kim',
      role: 'CTO',
      company: 'DevTools Pro',
      initials: 'DK',
      metric: 'Full API included',
    },
    {
      quote: "Best business decision this quarter. Paid $497 once, saved thousands. The analytics dashboard is better than DocuSign's too.",
      author: 'Lisa Thompson',
      role: 'Director of Sales',
      company: 'SalesPro',
      initials: 'LT',
      metric: 'Saved thousands',
    },
    {
      quote: "Migration took 20 minutes with their import tool. Brought over all our templates, contacts, everything. Zero downtime.",
      author: 'James Wilson',
      role: 'Operations Manager',
      company: 'Enterprise Co',
      initials: 'JW',
      metric: '20-min migration',
    },
  ]

  return (
    <section className="py-20 lg:py-28" style={{
      background: 'linear-gradient(180deg, #F8F8F8 0%, #FFFFFF 100%)',
    }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{
            background: 'rgba(76,0,255,0.08)',
            border: '1px solid rgba(76,0,255,0.15)',
          }}>
            <Star className="w-4 h-4 text-[#4C00FF]" />
            <span className="text-[#4C00FF] text-sm font-bold">4.9/5 from 2,847+ businesses</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
            Don't Take Our Word.{' '}
            <span className="text-[#4C00FF]">Take Theirs.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl"
              style={{
                background: 'white',
                border: '1px solid #E5E5E5',
              }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#4C00FF] text-[#4C00FF]" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4C00FF] to-[#7B3FFF] flex items-center justify-center font-bold text-white">
                  {t.initials}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{t.author}</p>
                  <p className="text-gray-600 text-xs">{t.role}, {t.company}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[#4C00FF] font-bold text-sm">💰 {t.metric}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ Section ───
const FAQSection = ({ isDark }: { isDark: boolean }) => {
  const faqs = [
    {
      q: 'Is this really a one-time payment? No hidden fees?',
      a: 'Yes. Pay $497 once, own MamaSign Enterprise forever. No monthly fees, no per-user fees, no surprise charges. All features unlocked, all updates included, lifetime access.',
    },
    {
      q: 'Can I really get unlimited team seats?',
      a: 'Absolutely. Invite your entire company. 5 people or 500 people, same price: $497. No per-seat pricing, no "contact sales for enterprise pricing" nonsense.',
    },
    {
      q: 'How is this legal for $497 when DocuSign charges $15,000?',
      a: "We don't have their overhead. No sales team, no enterprise account managers, no bloated org chart. We build software, sell it once, move on. You win, we win.",
    },
    {
      q: 'What if I need help? Is support included?',
      a: 'Priority support is included forever. 24/7 chat, email support, comprehensive docs, video tutorials. Most questions answered in under 2 hours.',
    },
    {
      q: 'Can I migrate from DocuSign/HelloSign easily?',
      a: 'Yes. One-click import tool brings over your templates, contacts, and documents. Most migrations take 10-20 minutes. Zero downtime.',
    },
    {
      q: 'Are the signatures legally binding?',
      a: 'Yes. Compliant with ESIGN Act (US), eIDAS (EU), and equivalent laws in 180+ countries. Every signature includes a full audit trail with timestamps, IP addresses, and certificates.',
    },
    {
      q: 'Do you offer refunds?',
      a: "30-day money-back guarantee. If MamaSign doesn't work for you, full refund, no questions asked. But 99.1% of customers keep it.",
    },
    {
      q: 'Will the price go back to $999?',
      a: 'Yes. This $497 deal is temporary. Once it ends, the price goes back to $999. Lock in $497 now while you can.',
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 lg:py-28" style={{ background: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
            Questions? <span className="text-[#4C00FF]">Answered.</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                border: '1px solid #E5E5E5',
                background: openIndex === i ? '#FAFAFA' : 'white',
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-bold text-gray-900 text-lg pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#4C00FF] flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-96 pb-5' : 'max-h-0'
                }`}
              >
                <p className="px-6 text-gray-700 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA Section ───
const FinalCTASection = ({ isDark }: { isDark: boolean }) => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #1F1F1F 0%, #1a1a1a 100%)',
    }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23c4ff0e" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }} />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
        }}>
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm font-bold uppercase tracking-wider">
            LIMITED TIME OFFER
          </span>
        </div>

        <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Stop Paying $2,160/Year.
          <br />
          <span className="text-[#c4ff0e]">Pay $497 Once.</span>
        </h2>

        <p className="text-xl text-gray-300 mb-4">
          Same features as DocuSign Enterprise. Same security. Same compliance.
        </p>
        <p className="text-2xl text-gray-100 font-bold mb-12">
          <span className="text-red-400 line-through">99.3%</span> less expensive.
        </p>

        {/* Pricing Box */}
        <div className="max-w-2xl mx-auto p-8 rounded-2xl mb-10" style={{
          background: 'rgba(196,255,14,0.05)',
          border: '2px solid rgba(196,255,14,0.3)',
        }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Regular Price</p>
              <p className="text-gray-500 line-through text-3xl font-bold">$999</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Today Only</p>
              <p className="text-[#c4ff0e] text-5xl font-black">$497</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-2">DocuSign</p>
              <p className="text-red-400 line-through text-3xl font-bold">$2,160/yr</p>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-700">
            <p className="text-[#c4ff0e] font-bold text-xl mb-2">
              Save $1,663 in Year 1. Save $10,303 in 5 Years.
            </p>
            <p className="text-gray-400 text-sm">
              Pay once. Own forever. Never pay again.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-12 py-6 rounded-2xl font-black text-2xl transition-all duration-300 group mb-6"
          style={{
            background: 'linear-gradient(135deg, #c4ff0e 0%, #a8ff00 100%)',
            color: '#000',
            boxShadow: '0 0 60px rgba(196,255,14,0.5)',
          }}
        >
          Get MamaSign Enterprise — $497
          <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
        </Link>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#c4ff0e]" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#c4ff0e]" />
            <span>Instant access</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#c4ff0e]" />
            <span>Lifetime updates</span>
          </div>
        </div>

        <p className="text-red-400 text-sm font-bold mt-8">
          ⚠️ This deal ends soon. Price goes back to $999.
        </p>
      </div>
    </section>
  )
}

const HomePage: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <>
      <MobileAppShell>
        <HeroSection variant="mobile" />
        <MobileHomeDashboard />
      </MobileAppShell>

      <div className="hidden md:block overflow-hidden">
        {/* ─── ENTERPRISE HERO ─── */}
        <EnterpriseHero isDark={isDark} />

        {/* ─── SOCIAL PROOF ─── */}
        <FeaturedSection />

        {/* ─── COST COMPARISON TABLE ─── */}
        <CostComparisonSection isDark={isDark} />

        {/* ─── UNCOMFORTABLE TRUTH (Psychology) ─── */}
        <UncomfortableTruthSection isDark={isDark} />

        {/* ─── FEATURE SHOWCASES (6 sections alternating) ─── */}
        <CustomBrandingShowcase isDark={isDark} />
        <TemplateBuilderShowcase isDark={isDark} />
        <AnalyticsDashboardShowcase isDark={isDark} />
        <APIIntegrationsShowcase isDark={isDark} />
        <TeamCollaborationShowcase isDark={isDark} />
        <SecurityComplianceShowcase isDark={isDark} />

        {/* ─── ENTERPRISE FEATURE GRID ─── */}
        <EnterpriseFeatureGrid isDark={isDark} />

        {/* ─── TESTIMONIALS ─── */}
        <TestimonialsSection isDark={isDark} />

        {/* ─── FAQ ─── */}
        <FAQSection isDark={isDark} />

        {/* ─── FINAL CTA ─── */}
        <FinalCTASection isDark={isDark} />
      </div>

      <FloatingMobileCTA />
    </>
  )
}

export default HomePage
