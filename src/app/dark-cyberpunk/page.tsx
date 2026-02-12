'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  FileSignature, CheckCircle, Star, ArrowRight, Shield, Lock, Zap, Globe,
  Award, PenTool, X, Check, Eye, DollarSign, AlertCircle, TrendingUp,
  BarChart3, Users, Clock, Sparkles, ShieldCheck, Send, Download, CreditCard,
  FileText, Rocket, Target, Bell
} from 'lucide-react'

// ─── Animated Counter with Intersection Observer ───
const AnimatedCounter = ({ target, prefix = '', suffix = '' }: {
  target: number; prefix?: string; suffix?: string
}) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || hasAnimated) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true)
        let current = 0
        const increment = target / 60
        const timer = setInterval(() => {
          current += increment
          if (current >= target) { setCount(target); clearInterval(timer) }
          else { setCount(Math.floor(current)) }
        }, 33)
      }
    }, { threshold: 0.3 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, hasAnimated])

  return <div ref={ref}>{prefix}{count.toLocaleString()}{suffix}</div>
}

// ─── Continuous Floating Animation ───
const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <div
      className="animate-float"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: '6s',
        animationIterationCount: 'infinite',
      }}
    >
      {children}
    </div>
  )
}

// ─── HERO: Dark Cyberpunk with Pricing Comparison ───
const DarkCyberpunkHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSig, setHasSig] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    ctx.strokeStyle = '#c4ff0e'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
  }, [])

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

  return (
    <section className="relative overflow-hidden py-24 lg:py-32" style={{
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1F1F1F 50%, #0a0a0a 100%)',
    }}>
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(196,255,14,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(196,255,14,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridPulse 4s ease-in-out infinite',
      }} />

      {/* Floating Orbs - Continuous Animation */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full opacity-20 animate-pulse" style={{
        background: 'radial-gradient(circle, #c4ff0e 0%, transparent 70%)',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 animate-pulse" style={{
        background: 'radial-gradient(circle, #7B3FFF 0%, transparent 70%)',
        filter: 'blur(100px)',
        animation: 'float 10s ease-in-out infinite reverse',
      }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* LEFT: Aggressive Pricing & Value Prop */}
          <div className="text-white">
            {/* Pulsing Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-glow" style={{
              background: 'rgba(196,255,14,0.1)',
              border: '1px solid rgba(196,255,14,0.4)',
              boxShadow: '0 0 20px rgba(196,255,14,0.2)',
            }}>
              <span className="w-2 h-2 rounded-full bg-[#c4ff0e] animate-ping" />
              <Zap className="w-4 h-4 text-[#c4ff0e]" />
              <span className="text-[#c4ff0e] text-sm font-bold uppercase tracking-widest">
                LIMITED: 50% OFF ENDS SOON
              </span>
            </div>

            {/* Massive Headline */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.95] mb-8" style={{
              letterSpacing: '-2px',
            }}>
              Stop Paying{' '}
              <span className="text-red-500">$10,000/Year</span>
              <br />
              For E-Signatures
            </h1>

            {/* Price Shock */}
            <div className="flex items-end gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">DocuSign Enterprise</p>
                <p className="text-5xl font-black text-red-500 line-through">
                  $10,000<span className="text-2xl">/year</span>
                </p>
              </div>
              <ArrowRight className="w-12 h-12 text-[#c4ff0e] mb-4" />
              <div>
                <p className="text-sm text-[#c4ff0e] mb-2">MamaSign Enterprise</p>
                <p className="text-6xl font-black text-[#c4ff0e]">
                  $27<span className="text-2xl">/once</span>
                </p>
              </div>
            </div>

            <p className="text-2xl text-gray-300 font-bold mb-10">
              Save <span className="text-[#c4ff0e]">$9,973</span> in year 1 alone.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {[
                'Unlimited signatures',
                'Custom domain',
                'Unlimited team seats',
                'White-label branding',
                'Full API access',
                'Priority support',
                'Advanced analytics',
                'Lifetime updates',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#c4ff0e] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Pulsing CTA */}
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-xl font-black text-xl transition-all duration-300 mb-4"
              style={{
                background: 'linear-gradient(135deg, #c4ff0e 0%, #a8ff00 100%)',
                color: '#000',
                boxShadow: '0 0 40px rgba(196,255,14,0.5)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              Get Enterprise for $27 — Save $9,973
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>

            <p className="text-gray-500 text-sm">
              <Clock className="w-4 h-4 inline mr-1" />
              Lifetime access. One payment. Yours forever.
            </p>
          </div>

          {/* RIGHT: Interactive Demo in Browser Frame */}
          <FloatingElement delay={0.5}>
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(196,255,14,0.15)',
            }}>
              {/* Browser Chrome */}
              <div className="px-4 py-3 flex items-center gap-3 bg-black/50 border-b border-gray-800">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-6 py-1.5 rounded-lg text-sm text-white/50 bg-white/5 flex items-center gap-2">
                    <Lock className="w-3 h-3 text-[#c4ff0e]" />
                    sign.yourcompany.com
                  </div>
                </div>
              </div>

              {/* Signature Interface */}
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#c4ff0e] flex items-center justify-center">
                        <FileSignature className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Enterprise_NDA.pdf</p>
                        <p className="text-gray-500 text-xs">sign.yourcompany.com</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-[#c4ff0e]/20 text-[#c4ff0e] border border-[#c4ff0e]/30 animate-pulse">
                      Ready
                    </div>
                  </div>

                  <canvas
                    ref={canvasRef}
                    onMouseDown={(e) => {
                      setIsDrawing(true)
                      setHasSig(true)
                      const canvas = canvasRef.current
                      if (!canvas) return
                      const rect = canvas.getBoundingClientRect()
                      const ctx = canvas.getContext('2d')
                      if (!ctx) return
                      ctx.beginPath()
                      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
                    }}
                    onMouseMove={draw}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseLeave={() => setIsDrawing(false)}
                    className="w-full rounded-xl cursor-crosshair"
                    style={{
                      height: '140px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '2px dashed rgba(196,255,14,0.3)',
                    }}
                  />

                  {!hasSig && (
                    <p className="text-center text-gray-500 text-sm mt-3 animate-pulse">
                      Draw your signature above ✍️
                    </p>
                  )}
                </div>

                <button
                  className="w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                  style={{
                    background: hasSig ? 'linear-gradient(135deg, #c4ff0e 0%, #a8ff00 100%)' : 'rgba(255,255,255,0.05)',
                    color: hasSig ? '#000' : 'rgba(255,255,255,0.3)',
                    boxShadow: hasSig ? '0 0 30px rgba(196,255,14,0.3)' : 'none',
                  }}
                >
                  <Check className="w-5 h-5 inline mr-2" />
                  Sign & Send
                </button>
              </div>
            </div>
          </FloatingElement>
        </div>

        {/* Continuous Scrolling Trust Badges */}
        <div className="mt-16 overflow-hidden">
          <div className="flex gap-12 animate-marquee">
            {[...Array(3)].map((_, setIndex) => (
              <React.Fragment key={setIndex}>
                {['256-bit SSL', 'ESIGN Compliant', '180+ Countries', 'SOC 2 Ready', '99.9% Uptime', 'GDPR Compliant'].map((badge, i) => (
                  <div key={`${setIndex}-${i}`} className="flex items-center gap-2 text-gray-400 whitespace-nowrap">
                    <Check className="w-4 h-4 text-[#c4ff0e]" />
                    <span className="text-sm font-medium">{badge}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(196,255,14,0.2); }
          50% { box-shadow: 0 0 40px rgba(196,255,14,0.4); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </section>
  )
}

// ─── Social Proof Bar ───
const SocialProof = () => (
  <section className="py-4 bg-[#171717] border-y border-gray-800">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-sm">
          <span className="text-[#c4ff0e] font-bold text-lg animate-pulse">4,891+</span> teams ditched DocuSign this month
        </p>
        <div className="flex gap-6">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#c4ff0e] text-[#c4ff0e]" />
            ))}
            <span className="text-gray-400 text-sm ml-2">4.9/5 (2,400+ reviews)</span>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// ─── 5-Year Cost Breakdown Table ───
const CostComparison = () => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            The Math Doesn't Lie.
          </h2>
          <p className="text-2xl text-gray-600">
            DocuSign: <span className="text-red-500 font-bold line-through">$50,000</span> over 5 years.
            <br />
            MamaSign: <span className="text-[#4C00FF] font-black">$27</span> once.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-6 px-6 text-gray-700 font-black text-lg">Year</th>
                <th className="text-center py-6 px-6">
                  <p className="text-2xl font-black text-[#4C00FF]">MamaSign</p>
                </th>
                <th className="text-center py-6 px-6">
                  <p className="text-2xl font-black text-gray-700">DocuSign</p>
                </th>
                <th className="text-right py-6 px-6 text-gray-700 font-black text-lg">You Save</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((year) => {
                const docuCost = 10000 * year
                const savings = docuCost - 27
                return (
                  <tr
                    key={year}
                    onMouseEnter={() => setHoveredYear(year)}
                    onMouseLeave={() => setHoveredYear(null)}
                    className="border-b border-gray-100 transition-all duration-200"
                    style={{
                      background: hoveredYear === year ? '#F8F5FF' : 'white',
                    }}
                  >
                    <td className="py-6 px-6 font-bold text-gray-700">Year {year}</td>
                    <td className="py-6 px-6 text-center">
                      <span className="text-3xl font-black text-[#4C00FF]">$27</span>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <span className="text-3xl font-black text-red-500 line-through">
                        ${docuCost.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-2xl font-black text-green-600">
                          ${savings.toLocaleString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ROI Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            { icon: DollarSign, label: 'Annual Savings', value: 9973, prefix: '$' },
            { icon: Clock, label: 'Break-Even', value: 1, suffix: ' day' },
            { icon: BarChart3, label: '5-Year ROI', value: 185148, suffix: '%' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#4C00FF]/5 to-[#7B3FFF]/5 border border-[#4C00FF]/20">
              <stat.icon className="w-12 h-12 text-[#4C00FF] mx-auto mb-4" />
              <p className="text-4xl font-black text-gray-900 mb-2">
                <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="text-gray-600 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Uncomfortable Truth (Dark Psychology) ───
const UncomfortableTruth = () => (
  <section className="py-24 bg-black relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#c4ff0e10_0%,transparent_70%)] animate-pulse" />
    <div className="relative max-w-5xl mx-auto px-6 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-red-500/10 border border-red-500/30">
        <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
        <span className="text-red-400 font-bold uppercase text-sm">THE UNCOMFORTABLE TRUTH</span>
      </div>

      <h2 className="text-5xl lg:text-6xl font-black text-white mb-8">
        You're Literally Burning
        <br />
        <span className="text-red-500 animate-pulse">
          $833/Month
        </span>
      </h2>

      <p className="text-2xl text-gray-300 mb-12">
        That's $27 <span className="text-white font-bold">every single day</span> on DocuSign.
        <br />
        Money you'll <span className="text-red-400">never get back</span>.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {[
          { title: '$10,000 Over 12 Months', desc: 'Could hire a developer. Run ads. Grow revenue.' },
          { title: 'Locked Into Their System', desc: 'Your templates. Your data. Their control. Harder to leave every month.' },
          { title: 'Price Hikes Every Year', desc: 'Remember when it was $120/month? Now it\'s $180. Next year?' },
          { title: 'Hidden Fees Everywhere', desc: 'Extra users? $15/each. API access? $50/month. It never stops.' },
        ].map((point, i) => (
          <div key={i} className="p-6 rounded-xl bg-white/5 border border-red-500/20">
            <h3 className="text-white font-bold text-xl mb-2">{point.title}</h3>
            <p className="text-gray-400">{point.desc}</p>
          </div>
        ))}
      </div>

      <Link
        href="/pricing"
        className="inline-flex items-center gap-3 px-12 py-6 rounded-xl font-black text-2xl"
        style={{
          background: 'linear-gradient(135deg, #c4ff0e 0%, #a8ff00 100%)',
          color: '#000',
          boxShadow: '0 0 60px rgba(196,255,14,0.5)',
        }}
      >
        Stop the Bleeding — Pay $27 Once
        <ArrowRight className="w-7 h-7" />
      </Link>

      <p className="text-gray-500 text-sm mt-6">
        Never pay again. Own it forever. <span className="text-[#c4ff0e]">Literally.</span>
      </p>
    </div>
  </section>
)

// ─── MAIN PAGE ───
export default function DarkCyberpunkPage() {
  return (
    <main className="bg-black">
      <DarkCyberpunkHero />
      <SocialProof />
      <CostComparison />
      <UncomfortableTruth />

      {/* Add more sections... keeping it focused for now */}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.95; }
        }
      `}</style>
    </main>
  )
}
