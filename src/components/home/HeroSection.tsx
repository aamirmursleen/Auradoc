'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, CheckCircle } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

const HeroSection: React.FC<{ variant?: 'mobile' | 'desktop' }> = ({ variant }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <section style={{ backgroundColor: isDark ? '#1a1a1a' : '#FFFFFF' }}>
      {/* Mobile Layout */}
      {variant !== 'desktop' && <div className="md:hidden relative max-w-7xl mx-auto px-4 pt-4 pb-10">
        {/* Heading - Mobile */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold leading-tight mb-3" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px' }}>
            Sign Documents{' '}
            <span className="gradient-text">Instantly.</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19, 0, 50, 0.65)' }}>
            Ditch the printer. Sign contracts, agreements & forms online from any device.
          </p>
        </div>

        {/* Laptop Mockup - Mobile */}
        <div className="relative flex items-center justify-center mb-8" style={{ perspective: '1000px' }}>
          <div className="w-full max-w-[340px]" style={{ transform: 'rotateY(-5deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}>
            <div className="rounded-t-2xl p-[3px]" style={{ background: 'linear-gradient(145deg, #e8e8e8 0%, #d4d4d4 50%, #c0c0c0 100%)', boxShadow: '0 15px 30px -8px rgba(0,0,0,0.25)' }}>
              <div className="bg-[#0a0a0a] rounded-t-xl p-2 relative">
                <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1a1a1a]">
                  <div className="w-0.5 h-0.5 rounded-full bg-[#333] mx-auto mt-0.5"></div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden w-full">
                  <div className="bg-[#f6f6f6] px-3 py-2 flex items-center border-b border-gray-200">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                    </div>
                    <div className="flex-1 flex justify-center px-3">
                      <div className="bg-white rounded-md px-4 py-1 text-xs text-gray-500 border border-gray-200">mamasign.com</div>
                    </div>
                    <div className="w-10"></div>
                  </div>
                  <div className="bg-gray-100 p-3">
                    <div className="bg-white rounded-lg shadow-sm p-3 relative" style={{ minHeight: '140px' }}>
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">PDF</div>
                      <div className="space-y-2 mt-7 mb-4">
                        <div className="h-1.5 bg-gray-200 rounded-full w-[70%]"></div>
                        <div className="h-1.5 bg-gray-200 rounded-full w-[90%]"></div>
                        <div className="h-1.5 bg-gray-200 rounded-full w-[55%]"></div>
                      </div>
                      <div className={`border-2 border-dashed rounded-lg p-3 ${isDark ? 'border-[#c4ff0e] bg-[#c4ff0e]/10' : 'border-[#4C00FF] bg-[#4C00FF]/10'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>Signature</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded ${isDark ? 'text-[#c4ff0e] bg-[#c4ff0e]/20' : 'text-[#4C00FF] bg-[#4C00FF]/20'}`}>Required</span>
                        </div>
                        <p className={`text-base italic font-serif ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>John Smith</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-3 mx-1" style={{ background: 'linear-gradient(180deg, #d8d8d8 0%, #b8b8b8 100%)', borderRadius: '0 0 6px 6px' }}>
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-20 h-1" style={{ background: '#a8a8a8', borderRadius: '0 0 4px 4px' }}></div>
            </div>
            <div className="relative h-1.5 mx-3" style={{ background: 'linear-gradient(180deg, #b0b0b0 0%, #909090 100%)', borderRadius: '0 0 8px 8px' }}></div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-6" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, transparent 70%)', filter: 'blur(8px)' }}></div>
          </div>
        </div>

        {/* CTA Buttons - Mobile */}
        <div className="space-y-3">
          <Link href="/sign-document" className="w-full min-h-[52px] px-6 py-4 text-base font-semibold rounded-lg transition-all duration-200 text-center flex items-center justify-center"
            style={{
              backgroundColor: isDark ? '#c4ff0e' : '#4C00FF',
              color: isDark ? '#000' : '#fff',
            }}>
            Start Signing Free
          </Link>
          <Link href="/features" className="w-full min-h-[52px] px-6 py-4 text-base font-semibold rounded-lg transition-all duration-200 text-center flex items-center justify-center"
            style={{
              border: isDark ? '1px solid #3a3a3a' : '1px solid #E8E0F0',
              color: isDark ? '#fff' : '#130032',
              backgroundColor: 'transparent',
            }}>
            See How It Works
          </Link>
        </div>
      </div>}

      {/* Desktop Layout - DocuSign style centered */}
      {variant !== 'mobile' && <div className="hidden md:block relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40 pb-20 lg:pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[3.625rem] font-light leading-[1.08]" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-1.25px' }}>
            Sign Documents in Seconds.{' '}
            <span className="gradient-text">Close Deals Faster.</span>
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed mt-6 max-w-2xl mx-auto" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19, 0, 50, 0.65)' }}>
            Ditch the printer. Sign contracts, agreements & forms online from any device. Legally binding, beautifully simple.
          </p>
          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link href="/sign-document"
              className="px-8 py-4 text-base font-semibold rounded-[0.5rem] transition-all duration-200"
              style={{
                backgroundColor: isDark ? '#c4ff0e' : '#4C00FF',
                color: isDark ? '#000' : '#fff',
              }}
            >
              Start Signing Free
            </Link>
            <Link href="/features"
              className="px-8 py-4 text-base font-semibold rounded-[0.5rem] transition-all duration-200"
              style={{
                border: isDark ? '1px solid #3a3a3a' : '1px solid #4C00FF',
                color: isDark ? '#fff' : '#4C00FF',
                backgroundColor: 'transparent',
              }}
            >
              See How It Works
            </Link>
          </div>
          {/* Trust badges */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
              <span className="text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19, 0, 50, 0.55)' }}>Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
              <span className="text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19, 0, 50, 0.55)' }}>ESIGN Compliant</span>
            </div>
          </div>
        </div>
      </div>}
    </section>
  )
}

export default HeroSection
