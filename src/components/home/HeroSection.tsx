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
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="animate-in space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-700 text-sm font-medium">
                Trusted by 50,000+ businesses worldwide
              </span>
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1]">
              Sign Documents
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Professional e-signature platform for businesses of all sizes.
              Get documents signed in minutes with legally-binding digital signatures.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <Link href="/sign" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <span className="relative z-10 flex items-center">
                  Start Signing Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/features" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300">
                See How It Works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                <Lock className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">256-bit Encryption</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Legally Binding</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">SOC 2 Compliant</span>
              </div>
            </div>
          </div>

          {/* Right Content - 3D Document Animation */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg hero-3d-container">
              {/* Floating Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-3xl opacity-20 animate-float-glow" />

              {/* Main Document Card */}
              <div className="relative document-3d bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                {/* Document Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Contract Agreement</p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Ready to Sign
                  </span>
                </div>

                {/* Document Lines */}
                <div className="space-y-3 mb-6">
                  <div className="h-3 bg-gray-100 rounded-full w-full animate-shimmer" />
                  <div className="h-3 bg-gray-100 rounded-full w-4/5 animate-shimmer" style={{ animationDelay: '0.1s' }} />
                  <div className="h-3 bg-gray-100 rounded-full w-full animate-shimmer" style={{ animationDelay: '0.2s' }} />
                  <div className="h-3 bg-gray-100 rounded-full w-3/5 animate-shimmer" style={{ animationDelay: '0.3s' }} />
                </div>

                {/* Signature Area */}
                <div className="relative p-4 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Sign Here</p>
                      <div className="signature-text text-2xl text-blue-600 italic font-medium">
                        John Doe
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce-slow">
                      <FileSignature className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Mini Cards */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center animate-float-1">
                <Shield className="w-8 h-8 text-green-500" />
              </div>

              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center animate-float-2">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-blue-500 mx-auto" />
                  <span className="text-xs text-gray-600 font-medium">Verified</span>
                </div>
              </div>

              <div className="absolute top-1/2 -right-8 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center animate-float-3">
                <Zap className="w-6 h-6 text-white" />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-8 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 blur-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
