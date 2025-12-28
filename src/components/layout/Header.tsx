'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  X,
  ChevronDown,
  FileSignature,
  Shield,
  FileText,
  FileType,
  Image,
  PenTool,
  Receipt,
  Minimize2,
  Sparkles,
  CreditCard,
  LayoutTemplate,
  Layers,
  Scissors,
  Droplets,
  Sun,
  Moon
} from 'lucide-react'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { useTheme } from '@/components/ThemeProvider'

// Product categories for dropdown
const products = {
  signing: [
    {
      name: 'Sign Documents',
      href: '/sign-document',
      icon: FileSignature,
      description: 'E-signatures for any document',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/30'
    },
    {
      name: 'Signature Generator',
      href: '/tools/signature-generator',
      icon: PenTool,
      description: 'Create digital signatures',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/30'
    },
  ],
  documents: [
    {
      name: 'Verify PDFs',
      href: '/verify',
      icon: Shield,
      description: 'Check document authenticity',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/30'
    },
    {
      name: 'PDF to Word',
      href: '/tools/pdf-to-word',
      icon: FileType,
      description: 'Convert PDF to editable Word',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30'
    },
    {
      name: 'PDF Compressor',
      href: '/tools/pdf-compressor',
      icon: Minimize2,
      description: 'Reduce PDF file size',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/30'
    },
    {
      name: 'Image to PDF',
      href: '/tools/image-to-pdf',
      icon: Image,
      description: 'Convert images to PDF',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/30'
    },
    {
      name: 'PDF Merge',
      href: '/tools/pdf-merge',
      icon: Layers,
      description: 'Combine multiple PDFs',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/30'
    },
    {
      name: 'PDF Split',
      href: '/tools/pdf-split',
      icon: Scissors,
      description: 'Split PDF into pages',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/30'
    },
    {
      name: 'Word to PDF',
      href: '/tools/word-to-pdf',
      icon: FileText,
      description: 'Convert Word to PDF',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/30'
    },
    {
      name: 'Watermark PDF',
      href: '/tools/watermark-pdf',
      icon: Droplets,
      description: 'Add watermarks to PDFs',
      color: 'text-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900/30'
    },
  ],
  business: [
    {
      name: 'Create Invoice',
      href: '/create-invoice',
      icon: Receipt,
      description: 'Professional invoices',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/30'
    },
    {
      name: 'Resume Templates',
      href: '/templates',
      icon: LayoutTemplate,
      description: 'ATS-friendly resumes',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/30'
    },
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

  // Only show navbar on home page
  const isHomePage = pathname === '/'

  // Handle scroll for enhanced glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Don't render header on non-home pages
  if (!isHomePage) {
    return null
  }

  const handleNavClick = (href: string) => {
    router.push(href)
    setIsMenuOpen(false)
    setIsProductsOpen(false)
  }

  return (
    <header className="fixed top-[52px] left-0 right-0 z-[100] px-4 sm:px-6 lg:px-8 pt-4">
      {/* Glassmorphism Pill Navbar */}
      <nav
        className={`
          max-w-6xl mx-auto
          bg-white/70 dark:bg-gray-900/70
          backdrop-blur-xl
          border border-white/20 dark:border-gray-700/50
          rounded-full
          shadow-lg shadow-gray-200/50 dark:shadow-black/20
          transition-all duration-500 ease-out
          ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 shadow-xl' : ''}
        `}
      >
        <div className="flex justify-between items-center h-16 px-6 lg:px-8">
          {/* Logo - Left */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center group cursor-pointer flex-shrink-0"
          >
            <span className="text-xl md:text-2xl font-black italic tracking-tight transition-transform duration-300 group-hover:scale-105">
              <span className="text-cyan-400">MAMA</span>
              <span className="text-purple-400">SIGN</span>
            </span>
          </button>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-full px-2 py-1">
              {/* Home Link */}
              <button
                onClick={() => handleNavClick('/')}
                className="relative px-4 py-2 text-gray-600 dark:text-gray-300 font-medium transition-all duration-300 rounded-full hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white/80 dark:hover:bg-gray-700/80 group"
              >
                <span className="relative z-10">Home</span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {/* Products Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  onMouseEnter={() => setIsProductsOpen(true)}
                  className={`relative flex items-center gap-1 px-4 py-2 font-medium transition-all duration-300 rounded-full group ${
                    isProductsOpen
                      ? 'text-cyan-600 dark:text-cyan-400 bg-white/80 dark:bg-gray-700/80'
                      : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white/80 dark:hover:bg-gray-700/80'
                  }`}
                >
                  <span className="relative z-10">Products</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} />
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                {/* Dropdown Menu */}
                {isProductsOpen && (
                  <div
                    className="fixed inset-x-0 top-24 mx-4 sm:mx-6 lg:mx-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-700/50 rounded-3xl animate-in fade-in slide-in-from-top-2 duration-300 z-50 overflow-hidden"
                    onMouseLeave={() => setIsProductsOpen(false)}
                  >
                    <div className="max-w-6xl mx-auto px-6 py-8">
                      <div className="grid grid-cols-4 gap-8">
                        {/* E-Signature Column */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-cyan-500/50">
                            E-Signature
                          </h3>
                          <div className="space-y-2">
                            {products.signing.map((product) => (
                              <Link
                                key={product.name}
                                href={product.href}
                                onClick={() => setIsProductsOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-300 group hover:scale-[1.02]"
                              >
                                <div className={`p-2 rounded-lg ${product.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                                  <product.icon className={`w-4 h-4 ${product.color}`} />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* PDF Tools Column 1 */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-purple-500/50">
                            PDF Tools
                          </h3>
                          <div className="space-y-2">
                            {products.documents.slice(0, 4).map((product) => (
                              <Link
                                key={product.name}
                                href={product.href}
                                onClick={() => setIsProductsOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-300 group hover:scale-[1.02]"
                              >
                                <div className={`p-2 rounded-lg ${product.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                                  <product.icon className={`w-4 h-4 ${product.color}`} />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* PDF Tools Column 2 */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-purple-500/50">
                            More PDF Tools
                          </h3>
                          <div className="space-y-2">
                            {products.documents.slice(4).map((product) => (
                              <Link
                                key={product.name}
                                href={product.href}
                                onClick={() => setIsProductsOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-300 group hover:scale-[1.02]"
                              >
                                <div className={`p-2 rounded-lg ${product.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                                  <product.icon className={`w-4 h-4 ${product.color}`} />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Business Column */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-emerald-500/50">
                            Business Tools
                          </h3>
                          <div className="space-y-2">
                            {products.business.map((product) => (
                              <Link
                                key={product.name}
                                href={product.href}
                                onClick={() => setIsProductsOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-300 group hover:scale-[1.02]"
                              >
                                <div className={`p-2 rounded-lg ${product.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                                  <product.icon className={`w-4 h-4 ${product.color}`} />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>

                          {/* Explore All Link */}
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <Link
                              href="/tools"
                              onClick={() => setIsProductsOpen(false)}
                              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
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

              {/* Pricing Link */}
              <button
                onClick={() => handleNavClick('/pricing')}
                className="relative px-4 py-2 text-gray-600 dark:text-gray-300 font-medium transition-all duration-300 rounded-full hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white/80 dark:hover:bg-gray-700/80 group"
              >
                <span className="relative z-10">Pricing</span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {/* Blog Link */}
              <button
                onClick={() => handleNavClick('/blog')}
                className="relative px-4 py-2 text-gray-600 dark:text-gray-300 font-medium transition-all duration-300 rounded-full hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white/80 dark:hover:bg-gray-700/80 group"
              >
                <span className="relative z-10">Blog</span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>

          {/* CTA Buttons - Right */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-110"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <button
                onClick={() => handleNavClick('/sign-in')}
                className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-all duration-300 px-4 py-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
              >
                Log in
              </button>
              <button
                onClick={() => handleNavClick('/sign-up')}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500"
              >
                Sign Up
              </button>
            </SignedOut>
          </div>

          {/* Mobile Menu Button - 44px minimum touch target */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 active:scale-95"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute left-0 block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ease-out ${isMenuOpen ? 'top-3 rotate-45' : 'top-1'}`} />
              <span className={`absolute left-0 top-3 block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ease-out ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
              <span className={`absolute left-0 block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ease-out ${isMenuOpen ? 'top-3 -rotate-45' : 'top-5'}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation - Glassmorphism Slide Down */}
      <div
        className={`
          md:hidden mt-2 mx-auto max-w-6xl overflow-hidden transition-all duration-500 ease-out
          ${isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl shadow-xl p-4 safe-area-inset">
          <div className="flex flex-col space-y-1">
            {/* Home - 44px touch target */}
            <button
              onClick={() => handleNavClick('/')}
              className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium min-h-[44px] py-3 px-4 transition-all duration-300 text-left rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 active:scale-[0.98]"
            >
              Home
            </button>

            {/* Products Accordion - 44px touch target */}
            <div>
              <button
                onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                className="w-full flex items-center justify-between text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium min-h-[44px] py-3 px-4 transition-all duration-300 text-left rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 active:scale-[0.98]"
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${isMobileProductsOpen ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="ml-4 mt-2 space-y-1 border-l-2 border-cyan-500/30 pl-4 max-h-[50vh] overflow-y-auto">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2">E-Signature</p>
                  {products.signing.map((product) => (
                    <Link
                      key={product.name}
                      href={product.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-300 active:scale-[0.98]"
                    >
                      <product.icon className={`w-5 h-5 ${product.color}`} />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{product.name}</span>
                    </Link>
                  ))}

                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2 mt-3">PDF Tools</p>
                  {products.documents.map((product) => (
                    <Link
                      key={product.name}
                      href={product.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-300 active:scale-[0.98]"
                    >
                      <product.icon className={`w-5 h-5 ${product.color}`} />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{product.name}</span>
                    </Link>
                  ))}

                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2 mt-3">Business</p>
                  {products.business.map((product) => (
                    <Link
                      key={product.name}
                      href={product.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 min-h-[44px] py-2.5 px-3 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-300 active:scale-[0.98]"
                    >
                      <product.icon className={`w-5 h-5 ${product.color}`} />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{product.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing - 44px touch target */}
            <button
              onClick={() => handleNavClick('/pricing')}
              className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium min-h-[44px] py-3 px-4 transition-all duration-300 text-left rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 active:scale-[0.98]"
            >
              Pricing
            </button>

            {/* Blog - 44px touch target */}
            <button
              onClick={() => handleNavClick('/blog')}
              className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium min-h-[44px] py-3 px-4 transition-all duration-300 text-left rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 active:scale-[0.98]"
            >
              Blog
            </button>

            <hr className="border-gray-200/50 dark:border-gray-700/50 my-2" />

            {/* Theme Toggle Mobile - 44px touch target */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-medium min-h-[44px] py-3 px-4 transition-all duration-300 text-left rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 active:scale-[0.98]"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              )}
            </button>

            <SignedIn>
              <div className="min-h-[44px] py-3 px-4 flex items-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <button
                onClick={() => handleNavClick('/sign-in')}
                className="mx-4 mt-2 px-6 min-h-[48px] py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold rounded-full text-center hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
              >
                Get Started
              </button>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
