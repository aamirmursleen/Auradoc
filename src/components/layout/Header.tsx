'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Signature Generator',
      href: '/tools/signature-generator',
      icon: PenTool,
      description: 'Create digital signatures',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50'
    },
  ],
  documents: [
    {
      name: 'Verify PDFs',
      href: '/verify',
      icon: Shield,
      description: 'Check document authenticity',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'PDF to Word',
      href: '/tools/pdf-to-word',
      icon: FileType,
      description: 'Convert PDF to editable Word',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'PDF Compressor',
      href: '/tools/pdf-compressor',
      icon: Minimize2,
      description: 'Reduce PDF file size',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Image to PDF',
      href: '/tools/image-to-pdf',
      icon: Image,
      description: 'Convert images to PDF',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      name: 'PDF Merge',
      href: '/tools/pdf-merge',
      icon: Layers,
      description: 'Combine multiple PDFs',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'PDF Split',
      href: '/tools/pdf-split',
      icon: Scissors,
      description: 'Split PDF into pages',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      name: 'Word to PDF',
      href: '/tools/word-to-pdf',
      icon: FileText,
      description: 'Convert Word to PDF',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50'
    },
    {
      name: 'Watermark PDF',
      href: '/tools/watermark-pdf',
      icon: Droplets,
      description: 'Add watermarks to PDFs',
      color: 'text-teal-500',
      bgColor: 'bg-teal-50'
    },
  ],
  business: [
    {
      name: 'Create Invoice',
      href: '/create-invoice',
      icon: Receipt,
      description: 'Professional invoices',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      name: 'Resume Templates',
      href: '/templates',
      icon: LayoutTemplate,
      description: 'ATS-friendly resumes',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50'
    },
  ],
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

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

  const mainNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ]

  const handleNavClick = (href: string) => {
    router.push(href)
    setIsMenuOpen(false)
    setIsProductsOpen(false)
  }

  return (
    <header className="sticky top-0 z-[100] bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center group cursor-pointer"
          >
            <span className="text-2xl md:text-3xl font-black italic tracking-tight">
              <span className="text-cyan-400">MAMA</span>
              <span className="text-purple-400">SIGN</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Home Link */}
            <button
              onClick={() => handleNavClick('/')}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Home
            </button>

            {/* Products Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                onMouseEnter={() => setIsProductsOpen(true)}
                className={`flex items-center gap-1 px-4 py-2 font-medium transition-all duration-200 rounded-lg ${
                  isProductsOpen
                    ? 'text-cyan-600 bg-cyan-50'
                    : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'
                }`}
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu - Large Full Screen */}
              {isProductsOpen && (
                <div
                  className="fixed inset-x-0 top-20 bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200 z-50"
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <div className="max-w-7xl mx-auto px-6 py-10">
                    {/* Main Grid - 4 Columns */}
                    <div className="grid grid-cols-4 gap-12">

                      {/* E-Signature Column */}
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-cyan-500">
                          E-Signature
                        </h3>
                        <div className="space-y-4">
                          {products.signing.map((product) => (
                            <Link
                              key={product.name}
                              href={product.href}
                              onClick={() => setIsProductsOpen(false)}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                            >
                              <div className={`p-2.5 rounded-lg ${product.bgColor}`}>
                                <product.icon className={`w-5 h-5 ${product.color}`} />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{product.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* PDF Tools Column 1 */}
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-purple-500">
                          PDF Tools
                        </h3>
                        <div className="space-y-4">
                          {products.documents.slice(0, 4).map((product) => (
                            <Link
                              key={product.name}
                              href={product.href}
                              onClick={() => setIsProductsOpen(false)}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                            >
                              <div className={`p-2.5 rounded-lg ${product.bgColor}`}>
                                <product.icon className={`w-5 h-5 ${product.color}`} />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{product.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* PDF Tools Column 2 */}
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-purple-500">
                          More PDF Tools
                        </h3>
                        <div className="space-y-4">
                          {products.documents.slice(4).map((product) => (
                            <Link
                              key={product.name}
                              href={product.href}
                              onClick={() => setIsProductsOpen(false)}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                            >
                              <div className={`p-2.5 rounded-lg ${product.bgColor}`}>
                                <product.icon className={`w-5 h-5 ${product.color}`} />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{product.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Business Column */}
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-emerald-500">
                          Business Tools
                        </h3>
                        <div className="space-y-4">
                          {products.business.map((product) => (
                            <Link
                              key={product.name}
                              href={product.href}
                              onClick={() => setIsProductsOpen(false)}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                            >
                              <div className={`p-2.5 rounded-lg ${product.bgColor}`}>
                                <product.icon className={`w-5 h-5 ${product.color}`} />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{product.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        {/* Explore All Products Link */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <Link
                            href="/tools"
                            onClick={() => setIsProductsOpen(false)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                          >
                            Explore All Products
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
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Pricing
            </button>

            {/* Blog Link */}
            <button
              onClick={() => handleNavClick('/blog')}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Blog
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                className="text-gray-600 hover:text-cyan-600 font-medium transition-colors duration-200 cursor-pointer"
              >
                Log in
              </button>
              <button
                onClick={() => handleNavClick('/sign-up')}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 cursor-pointer hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500"
              >
                Get Started
              </button>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900 animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-2">
              {/* Home */}
              <button
                onClick={() => handleNavClick('/')}
                className="text-gray-600 hover:text-cyan-600 font-medium py-3 px-4 transition-colors duration-200 text-left rounded-lg hover:bg-gray-50"
              >
                Home
              </button>

              {/* Products Accordion */}
              <div>
                <button
                  onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                  className="w-full flex items-center justify-between text-gray-600 hover:text-cyan-600 font-medium py-3 px-4 transition-colors duration-200 text-left rounded-lg hover:bg-gray-50"
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileProductsOpen && (
                  <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">E-Signature</p>
                    {products.signing.map((product) => (
                      <Link
                        key={product.name}
                        href={product.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50"
                      >
                        <product.icon className={`w-4 h-4 ${product.color}`} />
                        <span className="text-gray-700 text-sm">{product.name}</span>
                      </Link>
                    ))}

                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2 mt-3">PDF Tools</p>
                    {products.documents.map((product) => (
                      <Link
                        key={product.name}
                        href={product.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50"
                      >
                        <product.icon className={`w-4 h-4 ${product.color}`} />
                        <span className="text-gray-700 text-sm">{product.name}</span>
                      </Link>
                    ))}

                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2 mt-3">Business</p>
                    {products.business.map((product) => (
                      <Link
                        key={product.name}
                        href={product.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50"
                      >
                        <product.icon className={`w-4 h-4 ${product.color}`} />
                        <span className="text-gray-700 text-sm">{product.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing */}
              <button
                onClick={() => handleNavClick('/pricing')}
                className="text-gray-600 hover:text-cyan-600 font-medium py-3 px-4 transition-colors duration-200 text-left rounded-lg hover:bg-gray-50"
              >
                Pricing
              </button>

              {/* Blog */}
              <button
                onClick={() => handleNavClick('/blog')}
                className="text-gray-600 hover:text-cyan-600 font-medium py-3 px-4 transition-colors duration-200 text-left rounded-lg hover:bg-gray-50"
              >
                Blog
              </button>

              <hr className="border-gray-200 my-2" />

              <SignedIn>
                <div className="py-2 px-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <SignedOut>
                <button
                  onClick={() => handleNavClick('/sign-in')}
                  className="text-gray-600 hover:text-cyan-600 font-medium py-3 px-4 transition-colors duration-200 text-left rounded-lg hover:bg-gray-50"
                >
                  Log in
                </button>
                <button
                  onClick={() => handleNavClick('/sign-up')}
                  className="mx-4 px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-medium rounded-lg text-center"
                >
                  Get Started
                </button>
              </SignedOut>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
