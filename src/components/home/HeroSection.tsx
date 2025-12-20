'use client'

import React from 'react'
import Link from 'next/link'
import {
  FileSignature,
  Shield,
  CheckCircle,
  ArrowRight,
  FileText,
  Lock,
  Eye,
} from 'lucide-react'

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden pt-20 md:pt-24">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-cyan-400 rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-purple-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 md:w-64 h-48 md:h-64 bg-blue-400 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Content - Text */}
          <div className="animate-in space-y-5 md:space-y-6 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3 md:px-4 py-2 bg-gradient-to-r from-cyan-100 to-purple-100 dark:from-cyan-900/50 dark:to-purple-900/50 rounded-full border border-cyan-200 dark:border-cyan-700 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-cyan-700 dark:text-cyan-300 text-xs md:text-sm font-medium">
                Trusted by 50,000+ businesses worldwide
              </span>
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1]">
              Sign Documents
              <span className="block mt-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0">
              Professional e-signature platform for businesses of all sizes.
              Get documents signed in minutes with legally-binding digital signatures.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 md:gap-4">
              <Link href="/sign-document" className="w-full sm:w-auto group relative inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-1">
                <span className="relative z-10 flex items-center">
                  Start Signing Free
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link href="/features" className="w-full sm:w-auto group inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl hover:border-cyan-300 dark:hover:border-cyan-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-500 ease-out">
                See How It Works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 md:pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-4">
              <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm">
                <Lock className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
                <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">256-bit Encryption</span>
              </div>
              <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
                <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">Legally Binding</span>
              </div>
              <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm">
                <Shield className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
                <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">SOC 2 Compliant</span>
              </div>
            </div>
          </div>

          {/* Right Content - Animated Document */}
          <div className="relative flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg hero-3d-container">
              {/* Floating Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur-3xl opacity-20 dark:opacity-30 animate-pulse" />

              {/* Main Document Card - Light/Dark Theme */}
              <div className="relative document-3d bg-white dark:bg-slate-900 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-6 border border-gray-200 dark:border-slate-700/50 overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

                {/* Document Header */}
                <div className="relative flex items-center justify-between mb-3 sm:mb-4 md:mb-5 pb-3 sm:pb-4 border-b border-gray-200 dark:border-slate-700/50">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm md:text-base">Sales Contract</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400">PDF - 1.2 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-medium rounded-full border border-emerald-200 dark:border-emerald-500/30">
                      <span className="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1 w-1 sm:h-1.5 sm:w-1.5 bg-emerald-500 dark:bg-emerald-400"></span>
                      </span>
                      Ready
                    </span>
                  </div>
                </div>

                {/* Securely Signed Badge */}
                <div className="relative flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                    <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[10px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400">Securely Signed</span>
                  </div>
                </div>

                {/* Document Lines - Animated */}
                <div className="relative space-y-2 sm:space-y-2.5 mb-4 sm:mb-5">
                  <div className="h-2 sm:h-2.5 bg-gray-200 dark:bg-slate-700/60 rounded-full w-full animate-shimmer" />
                  <div className="h-2 sm:h-2.5 bg-gray-200 dark:bg-slate-700/60 rounded-full w-4/5 animate-shimmer" style={{ animationDelay: '0.1s' }} />
                  <div className="h-2 sm:h-2.5 bg-gray-200 dark:bg-slate-700/60 rounded-full w-full animate-shimmer" style={{ animationDelay: '0.2s' }} />
                  <div className="h-2 sm:h-2.5 bg-gray-200 dark:bg-slate-700/60 rounded-full w-3/5 animate-shimmer" style={{ animationDelay: '0.3s' }} />
                </div>

                {/* Signature Area */}
                <div className="relative p-3 sm:p-4 border-2 border-dashed border-cyan-400 dark:border-cyan-500/40 rounded-lg sm:rounded-xl bg-cyan-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <span className="px-1.5 sm:px-2 py-0.5 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[8px] sm:text-[10px] font-semibold rounded uppercase tracking-wider border border-cyan-200 dark:border-cyan-500/30">
                          Signature Required
                        </span>
                      </div>
                      <div className="signature-text text-xl sm:text-2xl md:text-3xl text-cyan-600 dark:text-cyan-400 italic font-medium" style={{ fontFamily: 'cursive' }}>
                        Alexa Scott
                      </div>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center animate-bounce-slow shadow-lg shadow-cyan-500/40">
                      <FileSignature className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating User Card */}
              <div className="hidden sm:flex absolute -top-2 -left-2 sm:-top-3 sm:-left-3 md:-top-4 md:-left-4 bg-white dark:bg-slate-800 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-xl border border-gray-200 dark:border-slate-700/50 p-2 sm:p-2.5 md:p-3 items-center gap-2 sm:gap-2.5 animate-float-1">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                  JS
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white text-[10px] sm:text-xs font-medium">John Smith</p>
                  <p className="text-gray-500 dark:text-slate-400 text-[8px] sm:text-[10px] flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Viewed just now
                  </p>
                </div>
              </div>

              {/* Floating Shield Card */}
              <div className="hidden sm:flex absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 md:-bottom-4 md:-right-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white dark:bg-slate-800 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-xl border border-gray-200 dark:border-slate-700/50 items-center justify-center animate-float-2">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-emerald-500 dark:text-emerald-400" />
              </div>

              {/* Floating Verified Card */}
              <div className="hidden md:flex absolute top-1/2 -right-4 md:-right-6 lg:-right-8 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-xl shadow-cyan-500/30 items-center justify-center animate-float-3">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>

              {/* Decorative Glow Elements */}
              <div className="absolute -bottom-8 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full opacity-20 blur-3xl animate-pulse" />
              <div className="absolute -top-8 right-1/4 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
