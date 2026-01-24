'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, CheckCircle, PenLine, Type, Check, Clock, Sparkles } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

const HeroSection: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <section className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-[#1a1a1a] to-[#1F1F1F]' : 'bg-gradient-to-b from-[#EDE5FF]/50 to-white'}`}>
      {/* Mobile-optimized padding for header offset */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-20 pb-12 sm:pb-16 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          {/* Left Content - Mobile first */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${isDark ? 'bg-[#c4ff0e]/10 text-[#c4ff0e]' : 'bg-[#4C00FF]/10 text-[#4C00FF]'}`}>
                <Sparkles className="h-4 w-4" />
                Trusted by 50,000+ businesses
              </div>
              {/* 90% OFF Badge - Subtle */}
              <Link
                href="#pricing"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all hover:scale-105 animate-pulse ${isDark ? 'bg-gradient-to-r from-[#c4ff0e] to-[#b8f206] text-black' : 'bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white'} shadow-lg`}
              >
                🔥 90% OFF
              </Link>
            </div>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
              Sign Documents<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>in Seconds.<br />
              <span className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-[#c4ff0e] via-[#b8f206] to-[#9ee000]' : 'bg-gradient-to-r from-[#4C00FF] via-[#8B5CF6] to-[#EC4899]'}`}>Close Deals Faster.</span>
            </h1>
            <p className={`text-base sm:text-lg lg:text-xl max-w-lg mx-auto lg:mx-0 px-2 sm:px-0 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
              Ditch the printer. Sign contracts, agreements & forms online from any device. Legally binding, beautifully simple.
            </p>
            {/* Mobile-optimized CTA buttons with 44px touch targets */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4 pt-2 px-4 sm:px-0">
              <Link href="/sign-document" className={`w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 text-base font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98] text-center flex items-center justify-center ${isDark ? 'text-black bg-[#c4ff0e] hover:bg-[#b8f206] shadow-[#c4ff0e]/25 hover:shadow-[#c4ff0e]/30' : 'text-white bg-[#4C00FF] hover:bg-[#3D00CC] shadow-[#4C00FF]/25 hover:shadow-[#4C00FF]/30'}`}>
                Start Free Trial
              </Link>
              <Link href="/features" className={`w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 text-base font-semibold border rounded-xl transition-all duration-200 hover:shadow-md active:scale-[0.98] text-center flex items-center justify-center ${isDark ? 'text-white bg-[#2a2a2a] border-[#3a3a3a] hover:border-[#c4ff0e]/30 hover:bg-[#c4ff0e]/10' : 'text-[#26065D] bg-white border-gray-200 hover:border-[#4C00FF]/30 hover:bg-[#EDE5FF]/30'}`}>
                Watch Demo
              </Link>
            </div>
            {/* Trust badges - responsive layout */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-2 sm:pt-4">
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>ESIGN Compliant</span>
              </div>
            </div>
          </div>

          {/* Right - Laptop with E-Sign Feature - Hidden on very small screens, simplified on mobile */}
          <div className="relative flex items-center justify-center order-1 lg:order-2 px-4 sm:px-0" style={{ perspective: '1000px' }}>
            {/* Mobile: Simple card view, Desktop: Full laptop mockup */}
            <div className="w-full max-w-[320px] sm:max-w-none" style={{ transform: 'rotateY(-8deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}>
              {/* Laptop Frame */}
              <div className="rounded-t-xl sm:rounded-t-2xl p-[2px] sm:p-[3px]" style={{ background: 'linear-gradient(145deg, #e8e8e8 0%, #d4d4d4 50%, #c0c0c0 100%)', boxShadow: '0 15px 30px -8px rgba(0,0,0,0.25)' }}>
                <div className="bg-[#0a0a0a] rounded-t-lg sm:rounded-t-xl p-2 sm:p-3 relative">
                  {/* Camera */}
                  <div className="absolute top-[4px] sm:top-[6px] left-1/2 -translate-x-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#1a1a1a]">
                    <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-[#333] mx-auto mt-0.5"></div>
                  </div>
                  {/* Screen Content - Responsive */}
                  <div className="bg-white rounded-md sm:rounded-lg overflow-hidden w-full">
                    {/* Browser Bar */}
                    <div className="bg-[#f6f6f6] px-2 sm:px-4 py-1.5 sm:py-2.5 flex items-center border-b border-gray-200">
                      <div className="flex gap-1 sm:gap-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#febc2e]"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#28c840]"></div>
                      </div>
                      <div className="flex-1 flex justify-center px-2 sm:px-4">
                        <div className="bg-white rounded-md px-2 sm:px-4 py-0.5 sm:py-1 text-[10px] sm:text-xs text-gray-500 border border-gray-200">mamasign.com</div>
                      </div>
                      <div className="w-8 sm:w-16"></div>
                    </div>

                    {/* App Content - E-Sign Interface - Responsive */}
                    <div className="flex h-[160px] sm:h-[200px] md:h-[240px]">
                      {/* Left Sidebar - Hidden on smallest screens */}
                      <div className="hidden sm:block w-16 md:w-20 bg-gray-50 border-r border-gray-100 p-1.5 md:p-2 space-y-1.5 md:space-y-2">
                        <p className="text-[7px] md:text-[9px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1.5 md:mb-2">Fields</p>
                        <div className={`rounded-md md:rounded-lg p-1.5 md:p-2 cursor-pointer ${isDark ? 'bg-[#c4ff0e]/10 border border-[#c4ff0e]/50' : 'bg-[#4C00FF]/10 border border-[#4C00FF]/50'}`}>
                          <PenLine className={`w-3 h-3 md:w-4 md:h-4 mx-auto ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                          <p className={`text-[6px] md:text-[8px] text-center mt-0.5 md:mt-1 font-medium ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>Sign</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-md md:rounded-lg p-1.5 md:p-2">
                          <Type className="w-3 h-3 md:w-4 md:h-4 text-gray-500 mx-auto" />
                          <p className="text-[6px] md:text-[8px] text-gray-500 text-center mt-0.5 md:mt-1">Initial</p>
                        </div>
                      </div>

                      {/* Center - Document - Always visible */}
                      <div className="flex-1 bg-gray-100 p-2 sm:p-3">
                        <div className="bg-white rounded-md sm:rounded-lg shadow-sm h-full p-2 sm:p-3 relative">
                          {/* PDF Badge */}
                          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-red-500 text-white text-[6px] sm:text-[8px] font-bold px-1.5 sm:px-2 py-0.5 rounded">PDF</div>

                          {/* Document Lines */}
                          <div className="space-y-1.5 sm:space-y-2 mt-4 sm:mt-6 mb-3 sm:mb-4">
                            <div className="h-1 sm:h-1.5 bg-gray-200 rounded-full w-[70%]"></div>
                            <div className="h-1 sm:h-1.5 bg-gray-200 rounded-full w-[90%]"></div>
                            <div className="h-1 sm:h-1.5 bg-gray-200 rounded-full w-[60%]"></div>
                          </div>

                          {/* Signature Field */}
                          <div className={`border-2 border-dashed rounded-md sm:rounded-lg p-2 sm:p-3 mt-2 sm:mt-4 ${isDark ? 'border-[#c4ff0e] bg-[#c4ff0e]/10' : 'border-[#4C00FF] bg-[#4C00FF]/10'}`}>
                            <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                              <span className={`text-[6px] sm:text-[8px] font-semibold uppercase tracking-wider ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>Signature</span>
                              <span className={`text-[5px] sm:text-[7px] px-1 sm:px-1.5 py-0.5 rounded ${isDark ? 'text-[#c4ff0e] bg-[#c4ff0e]/20' : 'text-[#4C00FF] bg-[#4C00FF]/20'}`}>Required</span>
                            </div>
                            <p className={`text-sm sm:text-lg italic font-serif ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>John Smith</p>
                          </div>
                        </div>
                      </div>

                      {/* Right Sidebar - Hidden on smallest screens */}
                      <div className="hidden sm:block w-20 md:w-28 bg-gray-50 border-l border-gray-100 p-1.5 md:p-2">
                        <p className="text-[7px] md:text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Signers</p>

                        {/* Signer 1 - Signed */}
                        <div className={`bg-white rounded-md md:rounded-lg p-1.5 md:p-2 mb-1.5 md:mb-2 border ${isDark ? 'border-[#c4ff0e]/50' : 'border-[#4C00FF]/50'}`}>
                          <div className="flex items-center gap-1">
                            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center ${isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]'}`}>
                              <span className={`text-[6px] md:text-[8px] font-medium ${isDark ? 'text-black' : 'text-white'}`}>JS</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[7px] md:text-[9px] font-medium text-gray-700 truncate">John</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 md:gap-1 mt-1">
                            <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-500" />
                            <span className="text-[6px] md:text-[8px] text-green-600 font-medium">Signed</span>
                          </div>
                        </div>

                        {/* Signer 2 - Pending */}
                        <div className="bg-white rounded-md md:rounded-lg p-1.5 md:p-2 border border-gray-200">
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gray-400 flex items-center justify-center">
                              <span className="text-[6px] md:text-[8px] text-white font-medium">AS</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[7px] md:text-[9px] font-medium text-gray-700 truncate">Alex</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 md:gap-1 mt-1">
                            <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-500" />
                            <span className="text-[6px] md:text-[8px] text-amber-600 font-medium">Pending</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Base */}
              <div className="relative h-2 sm:h-3 mx-0.5 sm:mx-1" style={{ background: 'linear-gradient(180deg, #d8d8d8 0%, #b8b8b8 100%)', borderRadius: '0 0 4px 4px' }}>
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-16 sm:w-24 h-0.5 sm:h-1" style={{ background: '#a8a8a8', borderRadius: '0 0 4px 4px' }}></div>
              </div>
              <div className="relative h-1 sm:h-1.5 mx-2 sm:mx-4" style={{ background: 'linear-gradient(180deg, #b0b0b0 0%, #909090 100%)', borderRadius: '0 0 8px 8px' }}></div>

              {/* Shadow */}
              <div className="absolute -bottom-4 sm:-bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-4 sm:h-8" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, transparent 70%)', filter: 'blur(6px)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
