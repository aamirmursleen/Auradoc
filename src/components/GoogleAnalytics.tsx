'use client'

import Script from 'next/script'

// Replace with your actual Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

export default function GoogleAnalytics() {
  // Don't load in development
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}

// Helper function to track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Pre-defined events for common actions
export const analyticsEvents = {
  // Document signing events
  signDocument: (documentType: string) => trackEvent('sign_document', 'documents', documentType),
  verifySignature: () => trackEvent('verify_signature', 'documents'),

  // Tool usage events
  useTool: (toolName: string) => trackEvent('use_tool', 'tools', toolName),
  downloadFile: (fileType: string) => trackEvent('download', 'tools', fileType),

  // User engagement
  signUp: () => trackEvent('sign_up', 'user'),
  signIn: () => trackEvent('sign_in', 'user'),
  emailSubscribe: () => trackEvent('subscribe', 'email'),

  // Page interactions
  clickCTA: (ctaName: string) => trackEvent('click', 'cta', ctaName),
  viewPricing: () => trackEvent('view', 'pricing'),
}
