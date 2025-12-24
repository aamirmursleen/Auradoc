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
  Calendar,
  User,
} from 'lucide-react'

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden pt-12 md:pt-16">
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-[1.1]">
              Sign Documents
              <span className="block mt-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0">
              Professional e-signature platform for businesses of all sizes.
              Get documents signed in minutes with legally-binding digital signatures.
            </p>

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

          {/* Right Content - Realistic Document */}
          <div className="relative flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[440px]">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur-3xl opacity-20 dark:opacity-30 animate-pulse" />

              {/* Main Document */}
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700/50 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">

                {/* Document Top Bar */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-950 dark:to-black px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-medium">Service_Agreement.pdf</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-medium rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                      Ready to Sign
                    </span>
                  </div>
                </div>

                {/* Document Content */}
                <div className="p-5 sm:p-6 bg-white dark:bg-slate-900">

                  {/* Header */}
                  <div className="text-center mb-4 pb-3 border-b-2 border-gray-200 dark:border-slate-700">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      Service Agreement
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Contract No: #2024-MSN-0847
                    </p>
                  </div>

                  {/* Document Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-[10px] sm:text-xs">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Date: Dec 23, 2024</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                      <User className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Parties: 2</span>
                    </div>
                  </div>

                  {/* Document Text */}
                  <div className="space-y-2 mb-4">
                    <p className="text-[10px] sm:text-xs text-gray-700 dark:text-slate-300 leading-relaxed">
                      This Agreement is entered into by <span className="font-semibold text-cyan-600 dark:text-cyan-400">MamaSign Corp.</span> and the undersigned client for the provision of digital signature services.
                    </p>
                    <div className="space-y-1.5">
                      <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded w-full"></div>
                      <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded w-11/12"></div>
                      <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded w-4/5"></div>
                    </div>
                  </div>

                  {/* Terms Highlight */}
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800/50 rounded-lg p-3 mb-4">
                    <p className="text-[10px] sm:text-xs text-cyan-800 dark:text-cyan-300 font-medium leading-relaxed">
                      ✓ Payment: Net 30 days &nbsp;&nbsp; ✓ Duration: 12 months &nbsp;&nbsp; ✓ Auto-renewal
                    </p>
                  </div>

                  {/* Signature Section */}
                  <div className="border-t-2 border-dashed border-gray-300 dark:border-slate-600 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Digital Signatures
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-medium rounded">
                        <FileSignature className="w-3 h-3" />
                        1/2 signed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Signed */}
                      <div className="relative p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-lg">
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium mb-1">Client Signature</p>
                        <p className="text-lg sm:text-xl text-emerald-700 dark:text-emerald-300 italic" style={{ fontFamily: 'Georgia, serif' }}>
                          John Smith
                        </p>
                        <p className="text-[8px] text-emerald-500 mt-1">Signed: Dec 23, 2024 • 10:30 AM</p>
                      </div>

                      {/* Pending */}
                      <div className="relative p-3 bg-cyan-50 dark:bg-cyan-900/20 border-2 border-dashed border-cyan-400 dark:border-cyan-600 rounded-lg">
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <FileSignature className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-[9px] text-cyan-600 dark:text-cyan-400 font-medium mb-1">Company Signature</p>
                        <p className="text-lg sm:text-xl text-cyan-500 dark:text-cyan-400 italic" style={{ fontFamily: 'Georgia, serif' }}>
                          Sign here
                        </p>
                        <p className="text-[8px] text-cyan-500 mt-1">Awaiting signature...</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400">
                      <Shield className="w-3 h-3 text-emerald-500" />
                      <span>Secured by MamaSign</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400">
                      <Lock className="w-3 h-3 text-cyan-500" />
                      <span>256-bit Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="hidden sm:flex absolute -top-3 -left-3 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700/50 p-2.5 items-center gap-2.5 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  JS
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white text-xs font-medium">John Smith</p>
                  <p className="text-gray-500 dark:text-slate-400 text-[10px] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    Signed
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex absolute -bottom-3 -right-3 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700/50 p-2.5 items-center gap-2.5 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  AS
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white text-xs font-medium">Alexa Scott</p>
                  <p className="text-amber-500 dark:text-amber-400 text-[10px] flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Viewing now
                  </p>
                </div>
              </div>

              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-6 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-xl shadow-emerald-500/30 items-center justify-center animate-pulse">
                <Shield className="w-6 h-6 text-white" />
              </div>

              {/* Glow Effects */}
              <div className="absolute -bottom-10 left-1/4 w-40 h-40 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full opacity-20 blur-3xl animate-pulse" />
              <div className="absolute -top-10 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
