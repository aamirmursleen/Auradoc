'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Sparkles, FileSignature, Shield, ArrowRight } from 'lucide-react'
import { setPro } from '@/lib/usage'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    if (sessionId && !activated) {
      // Activate pro status
      setPro()
      setActivated(true)
    }
  }, [sessionId, activated])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-200">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to MamaSign Pro! Your lifetime access has been activated.
          </p>

          {/* Features Unlocked */}
          <div className="bg-gradient-to-r from-cyan-50 to-purple-50 rounded-2xl p-6 mb-8 border border-cyan-100">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-gray-900">Features Unlocked</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <FileSignature className="w-5 h-5 text-cyan-500" />
                <span className="text-sm">Unlimited Signing</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Shield className="w-5 h-5 text-purple-500" />
                <span className="text-sm">Unlimited Verify</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">Priority Support</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">Lifetime Access</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              href="/sign-document"
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              Start Signing Documents
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Receipt Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          A receipt has been sent to your email address.
        </p>
      </div>
    </div>
  )
}
