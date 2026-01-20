import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import EmailCapturePopup from '@/components/EmailCapturePopup'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { ThemeProvider } from '@/components/ThemeProvider'
import AnnouncementBar from '@/components/AnnouncementBar'
import FloatingLifetimeDeal from '@/components/FloatingLifetimeDeal'
import AISupportChat from '@/components/support/AISupportChat'

const inter = Inter({ subsets: ['latin'] })

// Mobile-responsive viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#c4ff0e' },
    { media: '(prefers-color-scheme: dark)', color: '#1F1F1F' },
  ],
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://mamasign.com'),
  title: {
    default: 'MamaSign - Free E-Signature & PDF Tools | Sign Documents Online',
    template: '%s | MamaSign'
  },
  description: 'Sign documents electronically with legally-binding digital signatures. Free PDF tools: compress, convert, merge PDFs. Fast, secure, and professional e-signature platform.',
  keywords: [
    'e-signature',
    'digital signature',
    'sign documents online',
    'electronic signature',
    'PDF tools',
    'PDF to Word',
    'compress PDF',
    'merge PDF',
    'free e-signature',
    'document signing',
    'online signature',
    'legally binding signature'
  ],
  authors: [{ name: 'MamaSign' }],
  creator: 'MamaSign',
  publisher: 'MamaSign',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mamasign.com',
    siteName: 'MamaSign',
    title: 'MamaSign - Free E-Signature & PDF Tools',
    description: 'Sign documents electronically with legally-binding digital signatures. Free PDF tools included.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MamaSign - E-Signature Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MamaSign - Free E-Signature & PDF Tools',
    description: 'Sign documents electronically with legally-binding digital signatures.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://mamasign.com',
  },
}

// JSON-LD Schema for Organization
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MamaSign',
  url: 'https://mamasign.com',
  logo: 'https://mamasign.com/logo.png',
  description: 'Professional e-signature and PDF tools platform',
  sameAs: [
    'https://twitter.com/mamasign',
    'https://facebook.com/mamasign',
    'https://linkedin.com/company/mamasign'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@mamasign.com'
  }
}

// JSON-LD Schema for WebApplication
const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MamaSign',
  url: 'https://mamasign.com',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  featureList: [
    'Electronic Signatures',
    'PDF to Word Conversion',
    'PDF Compression',
    'Image to PDF',
    'PDF Merge',
    'Document Verification'
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      dynamic
    >
      <html lang="en" className="dark">
        <head>
          {/* Prevent flash of light theme - check localStorage before React loads */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var savedTheme = localStorage.getItem('mamasign_theme');
                  if (savedTheme === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                })();
              `,
            }}
          />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />
          {/* Mobile format detection */}
          <meta name="format-detection" content="telephone=no" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
          />
        </head>
        <body className={`${inter.className} antialiased bg-[#1F1F1F] text-white`}>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen">
              <AnnouncementBar />
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            <EmailCapturePopup />
            <FloatingLifetimeDeal />
            <AISupportChat />
            <GoogleAnalytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
