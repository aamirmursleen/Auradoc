'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, Phone, Twitter, Linkedin, Github } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Templates', href: '/template-library' },
      { name: 'API', href: '/api-docs' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Security', href: '/security' },
      { name: 'Compliance', href: '/compliance' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'GitHub', href: '#', icon: Github },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300 safe-area-inset">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand Section - Full width on mobile */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block group min-h-[44px] flex items-center">
              <span className="text-xl sm:text-2xl md:text-3xl font-black italic tracking-tight group-hover:scale-105 transition-transform duration-300 inline-block">
                <span className="text-cyan-500">MAMA</span>
                <span className="text-purple-500">SIGN</span>
              </span>
            </Link>
            <p className="mt-4 sm:mt-6 text-gray-500 dark:text-gray-400 max-w-md text-sm sm:text-base lg:text-lg">
              Professional e-signature platform for businesses of all sizes.
              Sign documents electronically with legally-binding digital signatures.
            </p>
            <div className="mt-5 sm:mt-8 space-y-3 sm:space-y-4">
              <a href="mailto:support@mamasign.com" className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 hover:text-cyan-500 transition-colors min-h-[44px]">
                <Mail className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                <span className="text-sm sm:text-base">support@mamasign.com</span>
              </a>
              <a href="tel:+15551234567" className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 hover:text-cyan-500 transition-colors min-h-[44px]">
                <Phone className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                <span className="text-sm sm:text-base">+1 (555) 123-4567</span>
              </a>
            </div>
          </div>

          {/* Product Links - Touch-friendly */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">Product</h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block py-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200 active:scale-[0.98]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links - Touch-friendly */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">Company</h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block py-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200 active:scale-[0.98]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links - Full width on mobile, Touch-friendly */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-gray-900 dark:text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">Legal</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-1 sm:space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block py-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200 active:scale-[0.98]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section - Mobile optimized */}
        <div className="mt-10 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            &copy; {currentYear} MamaSign. All rights reserved.
          </p>
          {/* Social links with 44px touch targets */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
