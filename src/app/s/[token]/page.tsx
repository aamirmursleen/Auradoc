'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'

export default function ShortSigningPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const resolveToken = async () => {
      try {
        const response = await fetch(`/api/signing-requests/by-token/${token}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          setError(data.message || 'Invalid or expired signing link')
          return
        }

        // Redirect to the full signing page
        const { documentId, email, token: signerToken } = data.data
        router.replace(`/sign/${documentId}?token=${signerToken}&email=${encodeURIComponent(email)}`)
      } catch (err) {
        setError('Failed to load signing link. Please try again.')
      }
    }

    if (token) {
      resolveToken()
    }
  }, [token, router])

  if (error) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1F1F1F] rounded-2xl border border-[#2a2a2a] p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Unable to Load Document</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-400">This link may have expired or is invalid. Please contact the sender.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#c4ff0e] mx-auto mb-4" />
        <p className="text-gray-300">Loading document...</p>
      </div>
    </div>
  )
}
