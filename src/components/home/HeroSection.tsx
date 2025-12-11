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
  Zap,
} from 'lucide-react'

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-cyan-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-cyan-400 rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-purple-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 md:w-64 h-48 md:h-64 bg-blue-400 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Content - Text */}
          <div className="animate-in space-y-6 md:space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3 md:px-4 py-2 bg-gradient-to-r from-cyan-100 to-purple-100 rounded-full border border-cyan-200 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-cyan-700 text-xs md:text-sm font-medium">
                Trusted by 50,000+ businesses worldwide
              </span>
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1]">
              Sign Documents
              <span className="block mt-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0">
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
              <Link href="/features" className="w-full sm:w-auto group inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-cyan-300 hover:bg-gray-50 transition-all duration-500 ease-out">
                See How It Works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 md:pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-4">
              <div className="flex items-center space-x-2 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-gray-200 shadow-sm">
                <Lock className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
                <span className="text-xs md:text-sm font-medium text-gray-600">256-bit Encryption</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-gray-200 shadow-sm">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
                <span className="text-xs md:text-sm font-medium text-gray-600">Legally Binding</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-gray-200 shadow-sm">
                <Shield className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
                <span className="text-xs md:text-sm font-medium text-gray-600">SOC 2 Compliant</span>
              </div>
            </div>
          </div>

          {/* Right Content - Animated Document */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg hero-3d-container">
              {/* Floating Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-3xl blur-3xl opacity-20 animate-float-glow" />

              {/* Main Document Card */}
              <div className="relative document-3d bg-white backdrop-blur-xl rounded-xl md:rounded-2xl shadow-2xl p-4 md:p-6 border border-gray-200">
                {/* Document Header */}
                <div className="flex items-center justify-between mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <FileText className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm md:text-base">Contract Agreement</p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <span className="px-2 md:px-3 py-1 bg-emerald-100 text-emerald-600 text-xs font-medium rounded-full border border-emerald-200">
                    Ready to Sign
                  </span>
                </div>

                {/* Document Lines - Animated */}
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="h-2 md:h-3 bg-gray-100 rounded-full w-full animate-shimmer" />
                  <div className="h-2 md:h-3 bg-gray-100 rounded-full w-4/5 animate-shimmer" style={{ animationDelay: '0.1s' }} />
                  <div className="h-2 md:h-3 bg-gray-100 rounded-full w-full animate-shimmer" style={{ animationDelay: '0.2s' }} />
                  <div className="h-2 md:h-3 bg-gray-100 rounded-full w-3/5 animate-shimmer" style={{ animationDelay: '0.3s' }} />
                </div>

                {/* Signature Area */}
                <div className="relative p-3 md:p-4 border-2 border-dashed border-cyan-300 rounded-lg md:rounded-xl bg-cyan-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Sign Here</p>
                      <div className="signature-text text-xl md:text-2xl text-cyan-600 italic font-medium">
                        John Doe
                      </div>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce-slow shadow-lg shadow-cyan-500/30">
                      <FileSignature className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Mini Cards */}
              <div className="hidden sm:flex absolute -top-4 -left-4 w-12 h-12 md:w-16 md:h-16 bg-white backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 items-center justify-center animate-float-1">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />
              </div>

              <div className="hidden sm:flex absolute -bottom-4 -right-4 w-16 h-16 md:w-20 md:h-20 bg-white backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 items-center justify-center animate-float-2">
                <div className="text-center">
                  <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-cyan-500 mx-auto" />
                  <span className="text-xs text-gray-600 font-medium">Verified</span>
                </div>
              </div>

              <div className="hidden md:flex absolute top-1/2 -right-8 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/30 items-center justify-center animate-float-3">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-8 left-1/4 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 blur-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
