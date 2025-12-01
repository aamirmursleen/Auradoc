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
    { name: 'Templates', href: '/templates' },
    { name: 'SignDocument', href: '/sign-document' },
    { name: 'Verify', href: '/verify' },
    { name: 'Documents', href: '/documents' },
  ]

  const handleNavClick = (href: string) => {
    router.push(href)
  }

  return (
    <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-lg border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center group cursor-pointer"
          >
            <Image
              src="/mamasign-logo.png"
              alt="MamaSign"
              width={180}
              height={45}
              className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200 relative group cursor-pointer"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300" />
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
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200 cursor-pointer"
              >
                Log in
              </button>
              <button
                onClick={() => handleNavClick('/sign-up')}
                className="btn-primary cursor-pointer"
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
                  className="text-gray-600 hover:text-primary-600 font-medium py-2 transition-colors duration-200 text-left cursor-pointer"
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
                  className="text-gray-600 hover:text-primary-600 font-medium py-2 transition-colors duration-200 text-left cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    handleNavClick('/sign-up')
                    setIsMenuOpen(false)
                  }}
                  className="btn-primary text-center cursor-pointer"
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
