'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import NextImage from 'next/image'
import {
  ChevronDown,
  FileSignature,
  Shield,
  FileText,
  FileType,
  Image,
  PenTool,
  Receipt,
  Minimize2,
  LayoutTemplate,
  Layers,
  Scissors,
  Droplets,
  LayoutDashboard,
  Sun,
  Moon
} from 'lucide-react'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { useTheme } from '@/components/ThemeProvider'

// Product categories for dropdown
const products = {
  signing: [
    { name: 'Sign Documents', href: '/sign-document', icon: FileSignature, description: 'E-signatures for any document' },
    { name: 'Signature Generator', href: '/tools/signature-generator', icon: PenTool, description: 'Create digital signatures' },
  ],
  documents: [
    { name: 'Verify PDFs', href: '/verify', icon: Shield, description: 'Check document authenticity' },
    { name: 'PDF to Word', href: '/tools/pdf-to-word', icon: FileType, description: 'Convert PDF to editable Word' },
    { name: 'PDF Compressor', href: '/tools/pdf-compressor', icon: Minimize2, description: 'Reduce PDF file size' },
    { name: 'Image to PDF', href: '/tools/image-to-pdf', icon: Image, description: 'Convert images to PDF' },
    { name: 'PDF Merge', href: '/tools/pdf-merge', icon: Layers, description: 'Combine multiple PDFs' },
    { name: 'PDF Split', href: '/tools/pdf-split', icon: Scissors, description: 'Split PDF into pages' },
    { name: 'Word to PDF', href: '/tools/word-to-pdf', icon: FileText, description: 'Convert Word to PDF' },
    { name: 'Watermark PDF', href: '/tools/watermark-pdf', icon: Droplets, description: 'Add watermarks to PDFs' },
  ],
  business: [
    { name: 'Create Invoice', href: '/create-invoice', icon: Receipt, description: 'Professional invoices' },
    { name: 'Resume Templates', href: '/resume-templates', icon: LayoutTemplate, description: 'ATS-friendly resumes' },
  ],
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const isHomePage = pathname === '/'
  const isDark = theme === 'dark'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  // Only show header on homepage
  if (!isHomePage) return null

  const handleNavClick = (href: string) => {
    router.push(href)
    setIsMenuOpen(false)
    setIsProductsOpen(false)
  }

  return (
    <header
      className="hidden md:block fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
      style={{
        backgroundColor: isDark
          ? scrolled ? 'rgba(30, 30, 30, 0.98)' : 'rgba(30, 30, 30, 0.95)'
          : '#130032',
        borderBottom: scrolled
          ? isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255, 255, 255, 0.08)'
          : isDark ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <nav className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-[72px] px-6 lg:px-8">
          {/* Logo */}
          <button onClick={() => handleNavClick('/')} className="flex items-center cursor-pointer flex-shrink-0">
            <NextImage
              src="/logo.png"
              alt="MamaSign"
              width={120}
              height={45}
              className="h-10 w-auto"
              style={{ filter: isDark ? 'none' : 'brightness(0) invert(1)' }}
              priority
            />
          </button>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleNavClick('/')}
                className="px-4 py-2 text-[15px] font-medium transition-colors duration-200"
                style={{ color: isDark ? '#D1D5DB' : 'rgba(255, 255, 255, 0.8)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#c4ff0e' : '#FFFFFF'}
                onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#D1D5DB' : 'rgba(255, 255, 255, 0.8)'}
              >
                Home
              </button>

              {/* Products Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  onMouseEnter={() => setIsProductsOpen(true)}
                  className="flex items-center gap-1 px-4 py-2 text-[15px] font-medium transition-colors duration-200"
                  style={{ color: isProductsOpen ? (isDark ? '#c4ff0e' : '#FFFFFF') : (isDark ? '#D1D5DB' : 'rgba(255, 255, 255, 0.8)') }}
                  onMouseOver={(e) => { if (!isProductsOpen) e.currentTarget.style.color = isDark ? '#c4ff0e' : '#FFFFFF' }}
                  onMouseOut={(e) => { if (!isProductsOpen) e.currentTarget.style.color = isDark ? '#D1D5DB' : 'rgba(255, 255, 255, 0.8)' }}
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProductsOpen && (
                  <div
                    className="fixed inset-x-0 top-[72px] mx-4 sm:mx-6 lg:mx-8 z-50 overflow-hidden"
                    onMouseLeave={() => setIsProductsOpen(false)}
                  >
                    <div
                      className="max-w-5xl mx-auto rounded-xl p-6 mt-2"
                      style={{
                        backgroundColor: isDark ? 'rgba(30, 30, 30, 0.98)' : 'rgba(255, 255, 255, 0.99)',
                        border: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0',
                        boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.4)' : '0 16px 48px rgba(19, 0, 50, 0.15)',
                        backdropFilter: 'blur(16px)',
                      }}
                    >
                      <div className="grid grid-cols-4 gap-8">
                        {/* E-Signature */}
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4"
                            style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19, 0, 50, 0.4)' }}>
                            E-Signature
                          </h3>
                          <div className="space-y-1">
                            {products.signing.map((product) => (
                              <Link key={product.name} href={product.href} onClick={() => setIsProductsOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-lg transition-all duration-200 group"
                                style={{ backgroundColor: 'transparent' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#F8F5FF'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <product.icon className="w-5 h-5 mt-0.5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                                <div>
                                  <p className="font-medium text-sm" style={{ color: isDark ? '#fff' : '#130032' }}>
                                    {product.name}
                                  </p>
                                  <p className="text-xs mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19, 0, 50, 0.55)' }}>{product.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* PDF Tools 1 */}
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4"
                            style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19, 0, 50, 0.4)' }}>
                            PDF Tools
                          </h3>
                          <div className="space-y-1">
                            {products.documents.slice(0, 4).map((product) => (
                              <Link key={product.name} href={product.href} onClick={() => setIsProductsOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-lg transition-all duration-200 group"
                                style={{ backgroundColor: 'transparent' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#F8F5FF'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <product.icon className="w-5 h-5 mt-0.5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                                <div>
                                  <p className="font-medium text-sm" style={{ color: isDark ? '#fff' : '#130032' }}>
                                    {product.name}
                                  </p>
                                  <p className="text-xs mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19, 0, 50, 0.55)' }}>{product.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* PDF Tools 2 */}
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4"
                            style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19, 0, 50, 0.4)' }}>
                            More PDF Tools
                          </h3>
                          <div className="space-y-1">
                            {products.documents.slice(4).map((product) => (
                              <Link key={product.name} href={product.href} onClick={() => setIsProductsOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-lg transition-all duration-200 group"
                                style={{ backgroundColor: 'transparent' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#F8F5FF'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <product.icon className="w-5 h-5 mt-0.5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                                <div>
                                  <p className="font-medium text-sm" style={{ color: isDark ? '#fff' : '#130032' }}>
                                    {product.name}
                                  </p>
                                  <p className="text-xs mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19, 0, 50, 0.55)' }}>{product.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Business */}
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4"
                            style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19, 0, 50, 0.4)' }}>
                            Business Tools
                          </h3>
                          <div className="space-y-1">
                            {products.business.map((product) => (
                              <Link key={product.name} href={product.href} onClick={() => setIsProductsOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-lg transition-all duration-200 group"
                                style={{ backgroundColor: 'transparent' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#F8F5FF'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <product.icon className="w-5 h-5 mt-0.5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                                <div>
                                  <p className="font-medium text-sm" style={{ color: isDark ? '#fff' : '#130032' }}>
                                    {product.name}
                                  </p>
                                  <p className="text-xs mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19, 0, 50, 0.55)' }}>{product.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-4 pt-4" style={{ borderTop: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0' }}>
                            <Link href="/tools" onClick={() => setIsProductsOpen(false)}
                              className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                              style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}
                            >
                              View all tools
                              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavClick('/pricing')}
                className="px-4 py-2 text-[15px] font-medium transition-colors duration-200"
                style={{ color: isDark ? '#D1D5DB' : 'rgba(255, 255, 255, 0.8)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#c4ff0e' : '#FFFFFF'}
                onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#D1D5DB' : 'rgba(255, 255, 255, 0.8)'}
              >
                Pricing
              </button>

              <SignedIn>
                <button
                  onClick={() => handleNavClick('/documents')}
                  className="flex items-center gap-2 px-4 py-2 text-[15px] font-medium transition-colors duration-200"
                  style={{ color: isDark ? '#D1D5DB' : 'rgba(255, 255, 255, 0.8)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#c4ff0e' : '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#D1D5DB' : 'rgba(255, 255, 255, 0.8)'}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
              </SignedIn>
            </div>
          </div>

          {/* CTA Buttons - Right */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all duration-200"
              style={{
                color: isDark ? '#D1D5DB' : 'rgba(255, 255, 255, 0.7)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <button
                onClick={() => handleNavClick('/sign-in')}
                className="text-[15px] font-medium px-4 py-2 transition-colors duration-200"
                style={{ color: isDark ? '#D1D5DB' : 'rgba(255, 255, 255, 0.8)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#c4ff0e' : '#FFFFFF'}
                onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#D1D5DB' : 'rgba(255, 255, 255, 0.8)'}
              >
                Log in
              </button>
              <button
                onClick={() => handleNavClick('/sign-up')}
                className="px-6 py-2.5 text-[15px] font-semibold rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: isDark ? '#c4ff0e' : '#FFFFFF',
                  color: isDark ? '#000' : '#130032',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#b8f206' : '#EDE5FF'
                  e.currentTarget.style.color = isDark ? '#000' : '#130032'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#c4ff0e' : '#FFFFFF'
                  e.currentTarget.style.color = isDark ? '#000' : '#130032'
                }}
              >
                Sign Up Free
              </button>
            </SignedOut>
          </div>

          {/* Mobile Right Section */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5" style={{ color: 'rgba(19,0,50,0.55)' }} />}
            </button>

            <SignedOut>
              <button
                onClick={() => handleNavClick('/sign-in')}
                className="px-4 py-2 min-h-[40px] text-sm font-semibold rounded-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#c4ff0e' : '#4C00FF',
                  color: isDark ? '#000' : '#fff',
                }}
              >
                Login
              </button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all duration-200"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute left-0 block w-6 h-0.5 transform transition-all duration-300 ease-out ${isMenuOpen ? 'top-3 rotate-45' : 'top-1'}`}
                  style={{ backgroundColor: isDark ? '#fff' : '#130032' }} />
                <span className={`absolute left-0 top-3 block w-6 h-0.5 transition-all duration-300 ease-out ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
                  style={{ backgroundColor: isDark ? '#fff' : '#130032' }} />
                <span className={`absolute left-0 block w-6 h-0.5 transform transition-all duration-300 ease-out ${isMenuOpen ? 'top-3 -rotate-45' : 'top-5'}`}
                  style={{ backgroundColor: isDark ? '#fff' : '#130032' }} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out
        ${isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-6 pt-2"
          style={{
            backgroundColor: isDark ? 'rgba(30, 30, 30, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            borderTop: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0',
          }}
        >
          <div className="flex flex-col space-y-1">
            <button onClick={() => handleNavClick('/')}
              className="font-medium min-h-[44px] py-3 px-4 text-left rounded-lg transition-all duration-200"
              style={{ color: isDark ? '#fff' : '#130032' }}
            >
              Home
            </button>

            <div>
              <button onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                className="w-full flex items-center justify-between font-medium min-h-[44px] py-3 px-4 text-left rounded-lg transition-all duration-200"
                style={{ color: isDark ? '#fff' : '#130032' }}
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-out ${isMobileProductsOpen ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-4 mt-2 space-y-1 pl-4 max-h-[50vh] overflow-y-auto"
                  style={{ borderLeft: isDark ? '2px solid rgba(196,255,14,0.3)' : '2px solid rgba(76,0,255,0.2)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider py-2"
                    style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)' }}>E-Signature</p>
                  {products.signing.map((product) => (
                    <Link key={product.name} href={product.href} onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-lg transition-all duration-200"
                    >
                      <product.icon className="w-5 h-5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                      <span className="text-sm" style={{ color: isDark ? '#D1D5DB' : 'rgba(19,0,50,0.75)' }}>{product.name}</span>
                    </Link>
                  ))}

                  <p className="text-xs font-semibold uppercase tracking-wider py-2 mt-3"
                    style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)' }}>PDF Tools</p>
                  {products.documents.map((product) => (
                    <Link key={product.name} href={product.href} onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-lg transition-all duration-200"
                    >
                      <product.icon className="w-5 h-5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                      <span className="text-sm" style={{ color: isDark ? '#D1D5DB' : 'rgba(19,0,50,0.75)' }}>{product.name}</span>
                    </Link>
                  ))}

                  <p className="text-xs font-semibold uppercase tracking-wider py-2 mt-3"
                    style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)' }}>Business</p>
                  {products.business.map((product) => (
                    <Link key={product.name} href={product.href} onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-lg transition-all duration-200"
                    >
                      <product.icon className="w-5 h-5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                      <span className="text-sm" style={{ color: isDark ? '#D1D5DB' : 'rgba(19,0,50,0.75)' }}>{product.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => handleNavClick('/pricing')}
              className="font-medium min-h-[44px] py-3 px-4 text-left rounded-lg transition-all duration-200"
              style={{ color: isDark ? '#fff' : '#130032' }}
            >
              Pricing
            </button>

            <SignedIn>
              <button onClick={() => handleNavClick('/documents')}
                className="flex items-center gap-3 font-medium min-h-[44px] py-3 px-4 text-left rounded-lg transition-all duration-200"
                style={{ color: isDark ? '#fff' : '#130032' }}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
            </SignedIn>

            <hr style={{ borderColor: isDark ? '#2a2a2a' : '#E8E0F0' }} />

            <SignedOut>
              <button onClick={() => handleNavClick('/sign-up')}
                className="w-full min-h-[44px] py-3 px-4 font-semibold rounded-lg transition-all duration-200"
                style={{ backgroundColor: isDark ? '#c4ff0e' : '#4C00FF', color: isDark ? '#000' : '#fff' }}
              >
                Get Started Free
              </button>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
