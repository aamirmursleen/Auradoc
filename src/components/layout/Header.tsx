'use client'

import React, { useState } from 'react'
import Image from 'next/image'
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
    <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center group cursor-pointer"
          >
            <Image
              src="/mamasign-logo-full.png"
              alt="MamaSign - Professional e-signature for everyone"
              width={280}
              height={70}
              className="h-14 w-auto group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 relative group cursor-pointer"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
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
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer"
              >
                Log in
              </button>
              <button
                onClick={() => handleNavClick('/sign-up')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer"
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
          <div className="md:hidden py-4 border-t border-gray-100 animate-in">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavClick(item.href)
                    setIsMenuOpen(false)
                  }}
                  className="text-gray-600 hover:text-blue-600 font-medium py-2 transition-colors duration-200 text-left cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
              <hr className="border-gray-100" />
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
                  className="text-gray-600 hover:text-blue-600 font-medium py-2 transition-colors duration-200 text-left cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    handleNavClick('/sign-up')
                    setIsMenuOpen(false)
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg text-center cursor-pointer"
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
