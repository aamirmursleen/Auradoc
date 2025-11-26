'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, FileSignature, ChevronDown } from 'lucide-react'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Templates', href: '/templates' },
    { name: 'Sign Document', href: '/sign' },
    { name: 'Track', href: '/track' },
    { name: 'Documents', href: '/documents' },
  ]

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <FileSignature className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Auradoc</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              Log in
            </Link>
            <Link href="/sign" className="btn-primary">
              Get Started
            </Link>
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
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-600 hover:text-primary-600 font-medium py-2 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
              <hr className="border-gray-100" />
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-primary-600 font-medium py-2 transition-colors duration-200"
              >
                Log in
              </Link>
              <Link
                href="/sign"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
