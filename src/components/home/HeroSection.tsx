'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, CheckCircle, ArrowRight, Star, FileSignature, Zap, Globe } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const duration = 2000
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
  }, [target])
  return <>{count.toLocaleString()}{suffix}</>
}

const HeroSection: React.FC<{ variant?: 'mobile' | 'desktop' }> = ({ variant }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <section className="relative overflow-hidden" style={{
      background: isDark
        ? 'linear-gradient(180deg, #130020 0%, #1a1a2e 50%, #1F1F1F 100%)'
        : 'linear-gradient(180deg, #130032 0%, #1E0050 40%, #2D006B 70%, #3A0088 100%)',
    }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20" style={{
          background: isDark ? 'radial-gradient(circle, #c4ff0e 0%, transparent 70%)' : 'radial-gradient(circle, #7B3FFF 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div className="absolute top-40 right-20 w-96 h-96 rounded-full opacity-15" style={{
          background: isDark ? 'radial-gradient(circle, #c4ff0e 0%, transparent 70%)' : 'radial-gradient(circle, #A855F7 0%, transparent 70%)',
          filter: 'blur(100px)',
        }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10" style={{
          background: isDark ? 'radial-gradient(ellipse, #c4ff0e 0%, transparent 70%)' : 'radial-gradient(ellipse, #8B5CF6 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Mobile Layout */}
      {variant !== 'desktop' && (
        <div className="md:hidden relative max-w-6xl mx-auto px-8 pt-6 pb-12">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{
              background: isDark ? 'rgba(196,255,14,0.1)' : 'rgba(255,255,255,0.1)',
              border: isDark ? '1px solid rgba(196,255,14,0.2)' : '1px solid rgba(255,255,255,0.15)',
              color: isDark ? '#c4ff0e' : 'rgba(255,255,255,0.9)',
            }}>
              <Zap className="w-4 h-4" />
              Trusted by 50,000+ businesses
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold leading-[1.1] mb-4 text-white" style={{ letterSpacing: '-1px' }}>
              Stop Chasing Signatures.{' '}
              <span style={{
                background: isDark
                  ? 'linear-gradient(90deg, #c4ff0e, #a8ff00)'
                  : 'linear-gradient(90deg, #C084FC, #E879F9, #F0ABFC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Start Closing Deals.</span>
            </h1>
            <p className="text-base leading-relaxed text-white/60 max-w-md mx-auto">
              Sign contracts, agreements & forms online from any device in under 60 seconds. Legally binding. Zero hassle. Free to start.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 mb-8">
            <Link href="/sign-document" className="w-full min-h-[52px] px-6 py-4 text-base font-bold rounded-xl transition-all duration-200 text-center flex items-center justify-center gap-2"
              style={{
                backgroundColor: isDark ? '#c4ff0e' : '#FFFFFF',
                color: isDark ? '#000' : '#130032',
                boxShadow: isDark ? '0 0 30px rgba(196,255,14,0.3)' : '0 0 30px rgba(255,255,255,0.2)',
              }}>
              Start Signing Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/features" className="w-full min-h-[52px] px-6 py-4 text-base font-semibold rounded-xl transition-all duration-200 text-center flex items-center justify-center"
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                backgroundColor: 'rgba(255,255,255,0.05)',
              }}>
              Watch 60-Second Demo
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/40">256-bit SSL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/40">ESIGN Act</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/40">180+ Countries</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {variant !== 'mobile' && (
        <div className="hidden md:block relative max-w-6xl mx-auto px-8 lg:px-16 xl:px-20 pt-40 lg:pt-48 xl:pt-56 pb-32 lg:pb-40 xl:pb-48">
          <div className="max-w-4xl mx-auto text-center">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium mb-8 animate-fade-in" style={{
              background: isDark ? 'rgba(196,255,14,0.08)' : 'rgba(255,255,255,0.08)',
              border: isDark ? '1px solid rgba(196,255,14,0.2)' : '1px solid rgba(255,255,255,0.15)',
              color: isDark ? '#c4ff0e' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
            }}>
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: isDark ? '#c4ff0e' : '#A78BFA' }}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: isDark ? '#c4ff0e' : '#A78BFA' }}></span>
                </span>
                Lifetime Deal: One payment, unlimited signatures forever
              </span>
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.05] text-white mb-6" style={{ letterSpacing: '-2px' }}>
              Stop Chasing Signatures.{' '}
              <br className="hidden lg:block" />
              <span style={{
                background: isDark
                  ? 'linear-gradient(90deg, #c4ff0e, #a8ff00, #d4ff4d)'
                  : 'linear-gradient(90deg, #C084FC, #E879F9, #F0ABFC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Start Closing Deals.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl leading-relaxed text-white/60 max-w-2xl mx-auto mb-10">
              Sign contracts, agreements & forms online from any device in under 60 seconds.
              Legally binding in 180+ countries. Beautifully simple. Free to start.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <Link href="/sign-document"
                className="group px-8 py-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-2"
                style={{
                  backgroundColor: isDark ? '#c4ff0e' : '#FFFFFF',
                  color: isDark ? '#000' : '#130032',
                  boxShadow: isDark ? '0 0 40px rgba(196,255,14,0.25)' : '0 0 40px rgba(255,255,255,0.15)',
                }}
              >
                Start Signing Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/features"
                className="px-8 py-4 text-base font-semibold rounded-xl transition-all duration-200"
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Watch 60-Second Demo
              </Link>
            </div>

            {/* Trust Bar */}
            <div className="flex items-center justify-center gap-8 mb-16">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-white/40" />
                <span className="text-sm font-medium text-white/40">Bank-Level Security</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white/40" />
                <span className="text-sm font-medium text-white/40">ESIGN Compliant</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-white/40" />
                <span className="text-sm font-medium text-white/40">180+ Countries</span>
              </div>
            </div>

            {/* Product Mockup - Floating Browser Window */}
            <div className="relative max-w-3xl mx-auto">
              <div className="relative z-10 rounded-2xl overflow-hidden" style={{
                border: isDark ? '1px solid rgba(196,255,14,0.15)' : '1px solid rgba(255,255,255,0.15)',
                boxShadow: isDark
                  ? '0 40px 100px -20px rgba(0,0,0,0.5), 0 0 40px rgba(196,255,14,0.1)'
                  : '0 40px 100px -20px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.15)',
                backdropFilter: 'blur(20px)',
              }}>
                {/* Browser Chrome */}
                <div className="px-4 py-3 flex items-center gap-3" style={{
                  background: isDark ? 'rgba(30,30,30,0.95)' : 'rgba(20,0,40,0.95)',
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-6 py-1.5 rounded-lg text-sm text-white/40 flex items-center gap-2" style={{
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
                    }}>
                      <Shield className="w-3 h-3 text-green-400" />
                      mamasign.com
                    </div>
                  </div>
                </div>

                {/* App Content */}
                <div className="p-6 lg:p-8" style={{
                  background: isDark
                    ? 'linear-gradient(180deg, rgba(30,30,30,0.95) 0%, rgba(25,25,25,0.98) 100%)'
                    : 'linear-gradient(180deg, rgba(248,245,255,0.98) 0%, rgba(255,255,255,0.98) 100%)',
                }}>
                  {/* Document Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                        background: isDark ? '#c4ff0e' : '#4C00FF',
                      }}>
                        <FileSignature className="w-5 h-5" style={{ color: isDark ? '#000' : '#fff' }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: isDark ? '#fff' : '#130032' }}>Service Agreement.pdf</p>
                        <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.45)' }}>2 signers - Ready to sign</p>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-full text-xs font-bold" style={{
                      background: isDark ? 'rgba(196,255,14,0.15)' : 'rgba(76,0,255,0.1)',
                      color: isDark ? '#c4ff0e' : '#4C00FF',
                    }}>In Progress</div>
                  </div>

                  {/* Simulated Document */}
                  <div className="rounded-xl p-6 mb-4" style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E8E0F0',
                  }}>
                    <div className="space-y-2.5 mb-6">
                      <div className="h-2.5 rounded-full w-[75%]" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#E8E0F0' }} />
                      <div className="h-2.5 rounded-full w-[95%]" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#F0EBF5' }} />
                      <div className="h-2.5 rounded-full w-[60%]" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#F0EBF5' }} />
                    </div>

                    {/* Signature Field - highlighted */}
                    <div className="rounded-xl p-4" style={{
                      border: isDark ? '2px dashed rgba(196,255,14,0.4)' : '2px dashed rgba(76,0,255,0.3)',
                      background: isDark ? 'rgba(196,255,14,0.05)' : 'rgba(76,0,255,0.03)',
                    }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>
                          Signature
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{
                          background: isDark ? 'rgba(196,255,14,0.15)' : 'rgba(76,0,255,0.1)',
                          color: isDark ? '#c4ff0e' : '#4C00FF',
                        }}>Required</span>
                      </div>
                      <p className="text-xl italic font-serif" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>
                        John Smith
                      </p>
                    </div>
                  </div>

                  {/* Signer Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5 p-3 rounded-lg" style={{
                      background: isDark ? 'rgba(34,197,94,0.1)' : 'rgba(16,185,129,0.06)',
                      border: isDark ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(16,185,129,0.15)',
                    }}>
                      <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: isDark ? '#fff' : '#130032' }}>John Smith</p>
                        <p className="text-[10px] text-green-500 font-medium">Signed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-lg" style={{
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(19,0,50,0.02)',
                      border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E8E0F0',
                    }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{
                        background: isDark ? 'rgba(196,255,14,0.1)' : 'rgba(76,0,255,0.1)',
                      }}>
                        <FileSignature className="w-3.5 h-3.5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: isDark ? '#fff' : '#130032' }}>Jane Cooper</p>
                        <p className="text-[10px] font-medium" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>Awaiting...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow underneath */}
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] h-40 rounded-full" style={{
                background: isDark
                  ? 'radial-gradient(ellipse, rgba(196,255,14,0.15) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }} />
            </div>

            {/* Social Proof Numbers */}
            <div className="grid grid-cols-4 gap-8 mt-20 max-w-2xl mx-auto">
              {[
                { value: 10, suffix: 'M+', label: 'Documents Signed' },
                { value: 50, suffix: 'K+', label: 'Happy Users' },
                { value: 99, suffix: '.9%', label: 'Uptime' },
                { value: 150, suffix: '+', label: 'Countries' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold mb-1" style={{
                    color: isDark ? '#c4ff0e' : '#fff',
                  }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24" style={{
        background: isDark
          ? 'linear-gradient(to top, #1F1F1F, transparent)'
          : 'linear-gradient(to top, #fff, transparent)',
      }} />
    </section>
  )
}

export default HeroSection
