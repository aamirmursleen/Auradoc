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
        // Step 1: Resolve token to get documentId + email
        const response = await fetch(`/api/signing-requests/by-token/${token}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          setError(data.message || 'Invalid or expired signing link')
          return
        }

        const { documentId, email, token: signerToken } = data.data

        // Step 2: Pre-fetch document metadata in parallel (so /sign/[id] loads instantly)
        try {
          const metaRes = await fetch(`/api/signing-requests/${documentId}?email=${encodeURIComponent(email)}&token=${signerToken}`)
          if (metaRes.ok) {
            const metaData = await metaRes.json()
            if (metaData.success) {
              sessionStorage.setItem(`sign-doc-${documentId}`, JSON.stringify(metaData))
            }
          }
        } catch {
          // Pre-fetch failed - signing page will fetch on its own
        }

        // Step 3: Navigate to signing page
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Document</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">This link may have expired or is invalid. Please contact the sender.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading your document...</p>
        <p className="text-xs text-gray-400 mt-2">This will only take a moment</p>
      </div>
    </div>
  )
}
