'use client'

import { useEffect, useState } from 'react'
import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function SignUpPage() {
  const [clerkLoaded, setClerkLoaded] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    // Give Clerk 2 seconds to load, if not show fallback
    const timer = setTimeout(() => {
      if (!clerkLoaded) {
        setShowFallback(true)
      }
    }, 2000)

    // Check if Clerk loaded
    const checkClerk = setInterval(() => {
      const clerkElement = document.querySelector('[data-clerk-component]')
      if (clerkElement) {
        setClerkLoaded(true)
        setShowFallback(false)
        clearInterval(checkClerk)
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      clearInterval(checkClerk)
    }
  }, [clerkLoaded])

  // Fallback UI when Clerk doesn't load (e.g., on localhost with production keys)
  if (showFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-200">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <span className="text-3xl font-black italic tracking-tight">
                  <span className="text-cyan-600">MAMA</span>
                  <span className="text-purple-600">SIGN</span>
                </span>
              </Link>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Create your account</h2>
              <p className="mt-2 text-gray-600">Start signing documents in minutes</p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={(e) => {
              e.preventDefault()
              // Redirect to production sign-up
              window.location.href = 'https://mamasign.com/sign-up'
            }}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-gray-900 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
              >
                Create Account
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.location.href = 'https://mamasign.com/sign-up'}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg border border-gray-200 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                onClick={() => window.location.href = 'https://mamasign.com/sign-up'}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg border border-gray-200 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Note */}
          <p className="mt-4 text-center text-gray-600 text-sm">
            You&apos;ll be redirected to our secure sign-up page
          </p>
        </div>
      </div>
    )
  }

  // Show loading first, then Clerk component
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {!clerkLoaded && !showFallback && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      )}
      <div className={clerkLoaded ? 'block' : 'hidden'}>
        <SignUp />
      </div>
    </div>
  )
}
