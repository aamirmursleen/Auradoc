'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
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
    { name: 'Resume Templates', href: '/templates', icon: LayoutTemplate, description: 'ATS-friendly resumes' },
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

  // Theme-aware colors
  const colors = {
    primary: isDark ? '#c4ff0e' : '#4C00FF',
    primaryHover: isDark ? '#b8f206' : '#3D00CC',
    primaryPale: isDark ? 'rgba(196, 255, 14, 0.1)' : '#EDE5FF',
    text: isDark ? '#FFFFFF' : '#26065D',
    textSecondary: isDark ? '#D1D5DB' : '#6B7280',
    bg: isDark ? '#1e1e1e' : '#FFFFFF',
    bgSecondary: isDark ? '#2a2a2a' : '#F3F4F6',
    border: isDark ? '#2a2a2a' : '#E5E7EB',
  }

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
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 lg:px-8 pt-4">
      <nav
        className={`max-w-6xl mx-auto backdrop-blur-xl rounded-full transition-all duration-500 ease-out
          ${isDark
            ? `bg-[#1e1e1e]/90 border border-[#2a2a2a] shadow-lg shadow-black/30 ${scrolled ? 'bg-[#1e1e1e]/95 shadow-xl' : ''}`
            : `bg-white/90 border border-gray-200 shadow-lg shadow-gray-200/50 ${scrolled ? 'bg-white/95 shadow-xl shadow-gray-300/50' : ''}`
          }`}
      >
        <div className="flex justify-between items-center h-16 px-6 lg:px-8">
          {/* Logo */}
          <button onClick={() => handleNavClick('/')} className="flex items-center group cursor-pointer flex-shrink-0">
            <span className="text-xl md:text-2xl font-black italic tracking-tight transition-transform duration-300 group-hover:scale-105">
              <span style={{ color: colors.primary }}>MAMA</span>
              <span style={{ color: colors.text }}>SIGN</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className={`flex items-center space-x-1 rounded-full px-2 py-1 ${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-100/50'}`}>
              <button
                onClick={() => handleNavClick('/')}
                className={`px-4 py-2 font-medium rounded-full transition-all duration-300
                  ${isDark ? 'text-gray-300 hover:text-[#c4ff0e] hover:bg-[#2a2a2a]' : 'text-[#6B7280] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'}`}
              >
                Home
              </button>

              {/* Products Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  onMouseEnter={() => setIsProductsOpen(true)}
                  className={`flex items-center gap-1 px-4 py-2 font-medium rounded-full transition-all duration-300
                    ${isProductsOpen
                      ? isDark ? 'text-[#c4ff0e] bg-[#2a2a2a]' : 'text-[#4C00FF] bg-[#EDE5FF]'
                      : isDark ? 'text-gray-300 hover:text-[#c4ff0e] hover:bg-[#2a2a2a]' : 'text-[#6B7280] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'
                    }`}
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProductsOpen && (
                  <div
                    className={`fixed inset-x-0 top-24 mx-4 sm:mx-6 lg:mx-8 backdrop-blur-xl shadow-2xl rounded-3xl z-50 overflow-hidden
                      ${isDark ? 'bg-[#1e1e1e]/95 border border-[#2a2a2a]' : 'bg-white/95 border border-gray-200'}`}
                    onMouseLeave={() => setIsProductsOpen(false)}
                  >
                    <div className="max-w-6xl mx-auto px-6 py-8">
                      <div className="grid grid-cols-4 gap-8">
                        {/* E-Signature */}
                        <div>
                          <h3 className={`text-sm font-bold mb-4 pb-2 border-b-2 ${isDark ? 'text-white border-[#c4ff0e]/50' : 'text-[#26065D] border-[#4C00FF]/50'}`}>
                            E-Signature
                          </h3>
                          <div className="space-y-2">
                            {products.signing.map((product) => (
                              <Link key={product.name} href={product.href} onClick={() => setIsProductsOpen(false)}
                                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 group hover:scale-[1.02]
                                  ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#EDE5FF]'}`}
                              >
                                <div className={`p-2 rounded-lg transition-transform duration-300 group-hover:scale-110
                                  ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'}`}>
                                  <product.icon className="w-4 h-4" style={{ color: colors.primary }} />
                                </div>
                                <div>
                                  <p className={`font-semibold text-sm transition-colors duration-300
                                    ${isDark ? 'text-white group-hover:text-[#c4ff0e]' : 'text-[#26065D] group-hover:text-[#4C00FF]'}`}>
                                    {product.name}
                                  </p>
                                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>{product.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* PDF Tools 1 */}
                        <div>
                          <h3 className={`text-sm font-bold mb-4 pb-2 border-b-2 ${isDark ? 'text-white border-[#c4ff0e]/50' : 'text-[#26065D] border-[#4C00FF]/50'}`}>
                            PDF Tools
                          </h3>
                          <div className="space-y-2">
                            {products.documents.slice(0, 4).map((product) => (
                              <Link key={product.name} href={product.href} onClick={() => setIsProductsOpen(false)}
                                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 group hover:scale-[1.02]
                                  ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#EDE5FF]'}`}
                              >
                                <div className={`p-2 rounded-lg transition-transform duration-300 group-hover:scale-110
                                  ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`}>
                                  <product.icon className="w-4 h-4" style={{ color: colors.primary }} />
                                </div>
                                <div>
                                  <p className={`font-semibold text-sm transition-colors duration-300
                                    ${isDark ? 'text-white group-hover:text-[#c4ff0e]' : 'text-[#26065D] group-hover:text-[#4C00FF]'}`}>
                                    {product.name}
                                  </p>
                                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>{product.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* PDF Tools 2 */}
                        <div>
                          <h3 className={`text-sm font-bold mb-4 pb-2 border-b-2 ${isDark ? 'text-white border-[#c4ff0e]/50' : 'text-[#26065D] border-[#4C00FF]/50'}`}>
                            More PDF Tools
                          </h3>
                          <div className="space-y-2">
                            {products.documents.slice(4).map((product) => (
                              <Link key={product.name} href={product.href} onClick={() => setIsProductsOpen(false)}
                                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 group hover:scale-[1.02]
                                  ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#EDE5FF]'}`}
                              >
                                <div className={`p-2 rounded-lg transition-transform duration-300 group-hover:scale-110
                                  ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`}>
                                  <product.icon className="w-4 h-4" style={{ color: colors.primary }} />
                                </div>
                                <div>
                                  <p className={`font-semibold text-sm transition-colors duration-300
                                    ${isDark ? 'text-white group-hover:text-[#c4ff0e]' : 'text-[#26065D] group-hover:text-[#4C00FF]'}`}>
                                    {product.name}
                                  </p>
                                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>{product.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Business */}
                        <div>
                          <h3 className={`text-sm font-bold mb-4 pb-2 border-b-2 ${isDark ? 'text-white border-[#c4ff0e]/50' : 'text-[#26065D] border-[#4C00FF]/50'}`}>
                            Business Tools
                          </h3>
                          <div className="space-y-2">
                            {products.business.map((product) => (
                              <Link key={product.name} href={product.href} onClick={() => setIsProductsOpen(false)}
                                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 group hover:scale-[1.02]
                                  ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#EDE5FF]'}`}
                              >
                                <div className={`p-2 rounded-lg transition-transform duration-300 group-hover:scale-110
                                  ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`}>
                                  <product.icon className="w-4 h-4" style={{ color: colors.primary }} />
                                </div>
                                <div>
                                  <p className={`font-semibold text-sm transition-colors duration-300
                                    ${isDark ? 'text-white group-hover:text-[#c4ff0e]' : 'text-[#26065D] group-hover:text-[#4C00FF]'}`}>
                                    {product.name}
                                  </p>
                                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>{product.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className={`mt-4 pt-4 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                            <Link href="/tools" onClick={() => setIsProductsOpen(false)}
                              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105"
                              style={{ backgroundColor: colors.primary, color: isDark ? '#000' : '#fff' }}
                            >
                              Explore All
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
                className={`px-4 py-2 font-medium rounded-full transition-all duration-300
                  ${isDark ? 'text-gray-300 hover:text-[#c4ff0e] hover:bg-[#2a2a2a]' : 'text-[#6B7280] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'}`}
              >
                Pricing
              </button>

              <SignedIn>
                <button
                  onClick={() => handleNavClick('/documents')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium rounded-full transition-all duration-300
                    ${isDark ? 'text-gray-300 hover:text-[#c4ff0e] hover:bg-[#2a2a2a]' : 'text-[#6B7280] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
              </SignedIn>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110
                ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#EDE5FF]'}`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-[#6B7280]" />
              )}
            </button>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <button
                onClick={() => handleNavClick('/sign-in')}
                className={`font-medium px-4 py-2 rounded-full transition-all duration-300
                  ${isDark ? 'text-gray-300 hover:text-[#c4ff0e] hover:bg-[#2a2a2a]' : 'text-[#6B7280] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'}`}
              >
                Log in
              </button>
              <button
                onClick={() => handleNavClick('/sign-up')}
                className="px-5 py-2.5 font-medium rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: colors.primary,
                  color: isDark ? '#000' : '#fff',
                  boxShadow: `0 4px 14px -4px ${isDark ? 'rgba(196, 255, 14, 0.4)' : 'rgba(76, 0, 255, 0.4)'}`
                }}
              >
                Sign Up
              </button>
            </SignedOut>
          </div>

          {/* Mobile Right Section */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#EDE5FF]'}`}
            >
              {isDark ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-[#6B7280]" />}
            </button>

            <SignedOut>
              <button
                onClick={() => handleNavClick('/sign-in')}
                className="px-4 py-2 min-h-[40px] text-sm font-semibold rounded-full shadow-md active:scale-95 transition-all"
                style={{
                  backgroundColor: colors.primary,
                  color: isDark ? '#000' : '#fff',
                  boxShadow: `0 4px 14px -4px ${isDark ? 'rgba(196, 255, 14, 0.3)' : 'rgba(76, 0, 255, 0.3)'}`
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
              className={`p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-300 active:scale-95
                ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#EDE5FF]'}`}
            >
              <div className="relative w-6 h-6">
                <span className={`absolute left-0 block w-6 h-0.5 transform transition-all duration-300 ease-out ${isMenuOpen ? 'top-3 rotate-45' : 'top-1'}`}
                  style={{ backgroundColor: colors.text }} />
                <span className={`absolute left-0 top-3 block w-6 h-0.5 transition-all duration-300 ease-out ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
                  style={{ backgroundColor: colors.text }} />
                <span className={`absolute left-0 block w-6 h-0.5 transform transition-all duration-300 ease-out ${isMenuOpen ? 'top-3 -rotate-45' : 'top-5'}`}
                  style={{ backgroundColor: colors.text }} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`md:hidden mt-2 mx-auto max-w-6xl overflow-hidden transition-all duration-500 ease-out
        ${isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className={`backdrop-blur-xl rounded-3xl shadow-xl p-4
          ${isDark ? 'bg-[#1e1e1e]/95 border border-[#2a2a2a]' : 'bg-white/95 border border-gray-200'}`}>
          <div className="flex flex-col space-y-1">
            <button onClick={() => handleNavClick('/')}
              className={`font-medium min-h-[44px] py-3 px-4 text-left rounded-xl transition-all duration-300 active:scale-[0.98]
                ${isDark ? 'text-white hover:text-[#c4ff0e] hover:bg-[#2a2a2a]' : 'text-[#26065D] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'}`}
            >
              Home
            </button>

            <div>
              <button onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                className={`w-full flex items-center justify-between font-medium min-h-[44px] py-3 px-4 text-left rounded-xl transition-all duration-300 active:scale-[0.98]
                  ${isDark ? 'text-white hover:text-[#c4ff0e] hover:bg-[#2a2a2a]' : 'text-[#26065D] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'}`}
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-out ${isMobileProductsOpen ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className={`ml-4 mt-2 space-y-1 border-l-2 pl-4 max-h-[50vh] overflow-y-auto
                  ${isDark ? 'border-[#c4ff0e]/30' : 'border-[#4C00FF]/30'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider py-2 ${isDark ? 'text-gray-500' : 'text-[#6B7280]'}`}>E-Signature</p>
                  {products.signing.map((product) => (
                    <Link key={product.name} href={product.href} onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98]
                        ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#EDE5FF]'}`}
                    >
                      <product.icon className="w-5 h-5" style={{ color: colors.primary }} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#26065D]'}`}>{product.name}</span>
                    </Link>
                  ))}

                  <p className={`text-xs font-semibold uppercase tracking-wider py-2 mt-3 ${isDark ? 'text-gray-500' : 'text-[#6B7280]'}`}>PDF Tools</p>
                  {products.documents.map((product) => (
                    <Link key={product.name} href={product.href} onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98]
                        ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#EDE5FF]'}`}
                    >
                      <product.icon className="w-5 h-5" style={{ color: colors.primary }} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#26065D]'}`}>{product.name}</span>
                    </Link>
                  ))}

                  <p className={`text-xs font-semibold uppercase tracking-wider py-2 mt-3 ${isDark ? 'text-gray-500' : 'text-[#6B7280]'}`}>Business</p>
                  {products.business.map((product) => (
                    <Link key={product.name} href={product.href} onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98]
                        ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#EDE5FF]'}`}
                    >
                      <product.icon className="w-5 h-5" style={{ color: colors.primary }} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#26065D]'}`}>{product.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => handleNavClick('/pricing')}
              className={`font-medium min-h-[44px] py-3 px-4 text-left rounded-xl transition-all duration-300 active:scale-[0.98]
                ${isDark ? 'text-white hover:text-[#c4ff0e] hover:bg-[#2a2a2a]' : 'text-[#26065D] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'}`}
            >
              Pricing
            </button>

            <SignedIn>
              <button onClick={() => handleNavClick('/documents')}
                className={`flex items-center gap-3 font-medium min-h-[44px] py-3 px-4 text-left rounded-xl transition-all duration-300 active:scale-[0.98]
                  ${isDark ? 'text-white hover:text-[#c4ff0e] hover:bg-[#2a2a2a]' : 'text-[#26065D] hover:text-[#4C00FF] hover:bg-[#EDE5FF]'}`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
            </SignedIn>

            <hr className={isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} />

            <SignedOut>
              <button onClick={() => handleNavClick('/sign-up')}
                className="w-full min-h-[44px] py-3 px-4 font-semibold rounded-xl transition-all duration-300 active:scale-[0.98]"
                style={{ backgroundColor: colors.primary, color: isDark ? '#000' : '#fff' }}
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
