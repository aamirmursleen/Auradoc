'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import { ChevronDown, FileSignature, PenLine, Shield, FileType, Minimize2, Image, Layers, Scissors, FileText, Droplets, Receipt, LayoutTemplate, LayoutDashboard } from 'lucide-react'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

// Product categories for mobile menu
const products = {
  signing: [
    { name: 'Sign Documents', href: '/sign-document', icon: FileSignature },
    { name: 'Signature Generator', href: '/tools/signature-generator', icon: PenLine },
  ],
  documents: [
    { name: 'Verify PDFs', href: '/verify', icon: Shield },
    { name: 'PDF to Word', href: '/tools/pdf-to-word', icon: FileType },
    { name: 'PDF Compressor', href: '/tools/pdf-compressor', icon: Minimize2 },
    { name: 'Image to PDF', href: '/tools/image-to-pdf', icon: Image },
    { name: 'PDF Merge', href: '/tools/pdf-merge', icon: Layers },
    { name: 'PDF Split', href: '/tools/pdf-split', icon: Scissors },
    { name: 'Word to PDF', href: '/tools/word-to-pdf', icon: FileText },
    { name: 'Watermark PDF', href: '/tools/watermark-pdf', icon: Droplets },
  ],
  business: [
    { name: 'Create Invoice', href: '/create-invoice', icon: Receipt },
    { name: 'Resume Templates', href: '/templates', icon: LayoutTemplate },
  ],
}

interface MobileAppShellProps {
  children: React.ReactNode
  title?: string
  showHeader?: boolean
}

const MobileAppShell: React.FC<MobileAppShellProps> = ({
  children,
  title,
  showHeader = true,
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  const handleNavClick = (href: string) => {
    router.push(href)
    setIsMenuOpen(false)
    setIsMobileProductsOpen(false)
  }

  return (
    <div className={`md:hidden min-h-screen ${isDark ? 'bg-white' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      {showHeader && (
        <header
          className={`fixed top-0 left-0 right-0 z-40 ${isDark ? 'bg-white' : 'bg-white'} border-b ${isDark ? 'border-border' : 'border-gray-200'}`}
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: '60px', padding: '0 12px', width: '100%', boxSizing: 'border-box' }}>
            {/* Left - Hamburger Menu */}
            <div style={{ flex: '0 0 auto' }}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                  <rect y="0" width="28" height="4" rx="2" fill="#000000"/>
                  <rect y="8" width="28" height="4" rx="2" fill="#000000"/>
                  <rect y="16" width="28" height="4" rx="2" fill="#000000"/>
                </svg>
              </button>
            </div>

            {/* Center - Logo */}
            <div style={{ flex: '0 0 auto' }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <NextImage
                  src="/logo.png"
                  alt="MamaSign"
                  width={100}
                  height={38}
                  style={{ height: '38px', width: 'auto', filter: 'contrast(1.2) saturate(1.3)' }}
                  priority
                />
              </Link>
            </div>

            {/* Right - Login/User */}
            <div style={{ flex: '0 0 auto' }}>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link
                  href="/sign-in"
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 700,
                    borderRadius: '50px',
                    backgroundColor: '#4C00FF',
                    color: '#ffffff',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  Login
                </Link>
              </SignedOut>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-0 z-30 transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-14 left-0 right-0 max-h-[80vh] overflow-y-auto transition-all duration-300 ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className={`mx-4 mt-2 rounded-2xl shadow-xl ${isDark ? 'bg-white border border-border' : 'bg-white border border-gray-200'}`}>
            <div className="p-4 space-y-1">
              <button onClick={() => handleNavClick('/')}
                className={`w-full font-medium min-h-[44px] py-3 px-4 text-left rounded-xl transition-all duration-300 active:scale-[0.98]
                  ${isDark ? 'text-foreground hover:text-primary hover:bg-secondary' : 'text-[#26065D] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'}`}
              >
                Home
              </button>

              {/* Products Dropdown */}
              <div>
                <button onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                  className={`w-full flex items-center justify-between font-medium min-h-[44px] py-3 px-4 text-left rounded-xl transition-all duration-300 active:scale-[0.98]
                    ${isDark ? 'text-foreground hover:text-primary hover:bg-secondary' : 'text-[#26065D] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'}`}
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-out ${isMobileProductsOpen ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className={`ml-4 mt-2 space-y-1 border-l-2 pl-4 max-h-[50vh] overflow-y-auto
                    ${isDark ? 'border-[#c4ff0e]/30' : 'border-[#4C00FF]/30'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider py-2 ${isDark ? 'text-muted-foreground' : 'text-[#6B7280]'}`}>E-Signature</p>
                    {products.signing.map((product) => (
                      <Link key={product.name} href={product.href} onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98]
                          ${isDark ? 'hover:bg-secondary' : 'hover:bg-[#EDE5FF]'}`}
                      >
                        <product.icon className={`w-5 h-5 ${isDark ? 'text-primary' : 'text-[#4C00FF]'}`} />
                        <span className={`text-sm ${isDark ? 'text-foreground' : 'text-[#26065D]'}`}>{product.name}</span>
                      </Link>
                    ))}

                    <p className={`text-xs font-semibold uppercase tracking-wider py-2 mt-3 ${isDark ? 'text-muted-foreground' : 'text-[#6B7280]'}`}>PDF Tools</p>
                    {products.documents.map((product) => (
                      <Link key={product.name} href={product.href} onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98]
                          ${isDark ? 'hover:bg-secondary' : 'hover:bg-[#EDE5FF]'}`}
                      >
                        <product.icon className={`w-5 h-5 ${isDark ? 'text-primary' : 'text-[#4C00FF]'}`} />
                        <span className={`text-sm ${isDark ? 'text-foreground' : 'text-[#26065D]'}`}>{product.name}</span>
                      </Link>
                    ))}

                    <p className={`text-xs font-semibold uppercase tracking-wider py-2 mt-3 ${isDark ? 'text-muted-foreground' : 'text-[#6B7280]'}`}>Business</p>
                    {products.business.map((product) => (
                      <Link key={product.name} href={product.href} onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98]
                          ${isDark ? 'hover:bg-secondary' : 'hover:bg-[#EDE5FF]'}`}
                      >
                        <product.icon className={`w-5 h-5 ${isDark ? 'text-primary' : 'text-[#4C00FF]'}`} />
                        <span className={`text-sm ${isDark ? 'text-foreground' : 'text-[#26065D]'}`}>{product.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => handleNavClick('/pricing')}
                className={`w-full font-medium min-h-[44px] py-3 px-4 text-left rounded-xl transition-all duration-300 active:scale-[0.98]
                  ${isDark ? 'text-foreground hover:text-primary hover:bg-secondary' : 'text-[#26065D] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'}`}
              >
                Pricing
              </button>

              <SignedIn>
                <button onClick={() => handleNavClick('/documents')}
                  className={`w-full flex items-center gap-3 font-medium min-h-[44px] py-3 px-4 text-left rounded-xl transition-all duration-300 active:scale-[0.98]
                    ${isDark ? 'text-foreground hover:text-primary hover:bg-secondary' : 'text-[#26065D] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </button>
              </SignedIn>

              <hr className={`my-2 ${isDark ? 'border-border' : 'border-gray-200'}`} />

              <SignedOut>
                <button onClick={() => handleNavClick('/sign-up')}
                  className={`w-full min-h-[44px] py-3 px-4 font-semibold rounded-xl transition-all duration-300 active:scale-[0.98]
                    ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#4C00FF] text-white'}`}
                >
                  Get Started Free
                </button>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        className={showHeader ? 'pt-14' : ''}
        style={{ paddingTop: showHeader ? 'calc(3.5rem + env(safe-area-inset-top))' : undefined }}
      >
        {children}
      </main>
    </div>
  )
}

export default MobileAppShell
