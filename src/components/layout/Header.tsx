'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'ResumeTemplates', href: '/templates' },
    { name: 'SignDocument', href: '/sign-document' },
    { name: 'Create Invoice', href: '/create-invoice' },
    { name: 'Verify Pdfs', href: '/verify' },
  ]

  const handleNavClick = (href: string) => {
    router.push(href)
  }

  return (
    <header className="sticky top-0 z-[100] bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/50 shadow-lg shadow-black/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Simple Text like CALENDARJET */}
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
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-300 hover:text-cyan-400 font-medium transition-colors duration-200 relative group cursor-pointer"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <button
                onClick={() => handleNavClick('/sign-in')}
                className="text-gray-300 hover:text-cyan-400 font-medium transition-colors duration-200 cursor-pointer"
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
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700/50 animate-in">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavClick(item.href)
                    setIsMenuOpen(false)
                  }}
                  className="text-gray-300 hover:text-cyan-400 font-medium py-2 transition-colors duration-200 text-left cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
              <hr className="border-gray-700/50" />
              <SignedIn>
                <div className="py-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <SignedOut>
                <button
                  onClick={() => {
                    handleNavClick('/sign-in')
                    setIsMenuOpen(false)
                  }}
                  className="text-gray-300 hover:text-cyan-400 font-medium py-2 transition-colors duration-200 text-left cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    handleNavClick('/sign-up')
                    setIsMenuOpen(false)
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-medium rounded-lg text-center cursor-pointer"
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
