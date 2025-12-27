'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, CheckCircle, PenLine, Type, User, Check, Clock } from 'lucide-react'

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-cyan-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-[1.1]">
              Secure Digital<br />Signatures.<br />
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Fast, Easy, Legal.</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0">
              Stop printing and scanning. Sign contracts online in minutes, kahin bhi.
            </p>
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 pt-2">
              <Link href="/sign-document" className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5">
                Start Free Trial
              </Link>
              <Link href="/demo" className="px-8 py-4 text-base font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md">
                Watch Demo
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-cyan-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-cyan-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">ESIGN Compliant</span>
              </div>
            </div>
          </div>

          {/* Right - Laptop with E-Sign Feature */}
          <div className="relative flex items-center justify-center order-1 lg:order-2" style={{ perspective: '1000px' }}>
            <div style={{ transform: 'rotateY(-8deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}>
              {/* Laptop Frame */}
              <div className="rounded-t-2xl p-[3px]" style={{ background: 'linear-gradient(145deg, #e8e8e8 0%, #d4d4d4 50%, #c0c0c0 100%)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)' }}>
                <div className="bg-[#0a0a0a] rounded-t-xl p-3 relative">
                  {/* Camera */}
                  <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#1a1a1a]">
                    <div className="w-1 h-1 rounded-full bg-[#333] mx-auto mt-0.5"></div>
                  </div>
                  {/* Screen Content */}
                  <div className="bg-white rounded-lg overflow-hidden" style={{ minWidth: '420px', minHeight: '280px' }}>
                    {/* Browser Bar */}
                    <div className="bg-[#f6f6f6] px-4 py-2.5 flex items-center border-b border-gray-200">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                      </div>
                      <div className="flex-1 flex justify-center px-4">
                        <div className="bg-white rounded-md px-4 py-1 text-xs text-gray-500 border border-gray-200">mamasign</div>
                      </div>
                      <div className="w-16"></div>
                    </div>

                    {/* App Content - E-Sign Interface */}
                    <div className="flex h-[240px]">
                      {/* Left Sidebar - Field Types */}
                      <div className="w-20 bg-gray-50 border-r border-gray-100 p-2 space-y-2">
                        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">Fields</p>
                        <div className="bg-purple-100 border border-purple-200 rounded-lg p-2 cursor-pointer hover:bg-purple-50 transition-colors">
                          <PenLine className="w-4 h-4 text-purple-600 mx-auto" />
                          <p className="text-[8px] text-purple-600 text-center mt-1 font-medium">Sign</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-2">
                          <Type className="w-4 h-4 text-gray-500 mx-auto" />
                          <p className="text-[8px] text-gray-500 text-center mt-1">Initial</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-2">
                          <User className="w-4 h-4 text-gray-500 mx-auto" />
                          <p className="text-[8px] text-gray-500 text-center mt-1">Name</p>
                        </div>
                      </div>

                      {/* Center - Document */}
                      <div className="flex-1 bg-gray-100 p-3">
                        <div className="bg-white rounded-lg shadow-sm h-full p-3 relative">
                          {/* PDF Badge */}
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded">PDF</div>

                          {/* Document Lines */}
                          <div className="space-y-2 mt-6 mb-4">
                            <div className="h-1.5 bg-gray-200 rounded-full w-[70%]"></div>
                            <div className="h-1.5 bg-gray-200 rounded-full w-[90%]"></div>
                            <div className="h-1.5 bg-gray-200 rounded-full w-[60%]"></div>
                            <div className="h-1.5 bg-gray-100 rounded-full w-[80%]"></div>
                          </div>

                          {/* Signature Field */}
                          <div className="border-2 border-dashed border-purple-400 rounded-lg p-3 bg-purple-50/50 mt-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[8px] font-semibold text-purple-500 uppercase tracking-wider">Signature</span>
                              <span className="text-[7px] text-purple-400 bg-purple-100 px-1.5 py-0.5 rounded">Required</span>
                            </div>
                            <p className="text-lg text-purple-600 italic font-serif">John Smith</p>
                          </div>
                        </div>
                      </div>

                      {/* Right Sidebar - Signers */}
                      <div className="w-28 bg-gray-50 border-l border-gray-100 p-2">
                        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Signers</p>

                        {/* Signer 1 - Signed */}
                        <div className="bg-white rounded-lg p-2 mb-2 border border-green-200">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                              <span className="text-[8px] text-white font-medium">JS</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-medium text-gray-700 truncate">John Smith</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-1.5">
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-[8px] text-green-600 font-medium">Signed</span>
                          </div>
                        </div>

                        {/* Signer 2 - Pending */}
                        <div className="bg-white rounded-lg p-2 border border-gray-200">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-[8px] text-white font-medium">AS</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-medium text-gray-700 truncate">Alex Scott</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-1.5">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span className="text-[8px] text-amber-600 font-medium">Pending</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Base */}
              <div className="relative h-3 mx-1" style={{ background: 'linear-gradient(180deg, #d8d8d8 0%, #b8b8b8 100%)', borderRadius: '0 0 4px 4px' }}>
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-1" style={{ background: '#a8a8a8', borderRadius: '0 0 4px 4px' }}></div>
              </div>
              <div className="relative h-1.5 mx-4" style={{ background: 'linear-gradient(180deg, #b0b0b0 0%, #909090 100%)', borderRadius: '0 0 8px 8px' }}></div>

              {/* Shadow */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-8" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%)', filter: 'blur(8px)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
