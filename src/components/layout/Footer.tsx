'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, Twitter, Linkedin, Github } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

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
    <footer className="transition-colors duration-300 safe-area-inset" style={{
      backgroundColor: isDark ? '#1a1a1a' : '#130032',
      borderTop: isDark ? '1px solid #2a2a2a' : '1px solid rgba(255, 255, 255, 0.08)',
      color: isDark ? '#D1D5DB' : 'rgba(255, 255, 255, 0.7)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block min-h-[44px] flex items-center">
              <Image
                src="/logo.png"
                alt="MamaSign"
                width={140}
                height={50}
                className="h-12 w-auto"
                style={{ filter: isDark ? 'none' : 'brightness(0) invert(1)' }}
              />
            </Link>
            <p className="mt-6 max-w-md text-sm sm:text-base leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255, 255, 255, 0.5)' }}>
              Professional e-signature platform for businesses of all sizes.
              Sign documents electronically with legally-binding digital signatures.
            </p>
            <div className="mt-6 space-y-3">
              <a href="mailto:support@mamasign.com" className="flex items-center space-x-3 transition-colors min-h-[44px]"
                style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255, 255, 255, 0.5)' }}>
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: isDark ? '#c4ff0e' : '#CBC2FF' }} />
                <span className="text-sm">support@mamasign.com</span>
              </a>
              <Link href="/contact" className="flex items-center space-x-3 transition-colors min-h-[44px]"
                style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255, 255, 255, 0.5)' }}>
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: isDark ? '#c4ff0e' : '#CBC2FF' }} />
                <span className="text-sm">Contact Support</span>
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(255, 255, 255, 0.35)' }}>Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block py-1.5 text-sm transition-colors duration-200"
                    style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255, 255, 255, 0.6)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#c4ff0e' : '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255, 255, 255, 0.6)'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(255, 255, 255, 0.35)' }}>Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block py-1.5 text-sm transition-colors duration-200"
                    style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255, 255, 255, 0.6)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#c4ff0e' : '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255, 255, 255, 0.6)'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(255, 255, 255, 0.35)' }}>Legal</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block py-1.5 text-sm transition-colors duration-200"
                    style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255, 255, 255, 0.6)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#c4ff0e' : '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255, 255, 255, 0.6)'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 sm:mt-16 pt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 sm:gap-0"
          style={{ borderTop: isDark ? '1px solid #2a2a2a' : '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p className="text-xs sm:text-sm text-center sm:text-left" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255, 255, 255, 0.3)' }}>
            &copy; {currentYear} MamaSign. All rights reserved.
          </p>
          <div className="flex items-center space-x-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{
                  backgroundColor: isDark ? '#2a2a2a' : 'rgba(255, 255, 255, 0.08)',
                  color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255, 255, 255, 0.5)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#c4ff0e' : '#CBC2FF'
                  e.currentTarget.style.color = isDark ? '#000' : '#130032'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255, 255, 255, 0.5)'
                }}
                aria-label={social.name}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
