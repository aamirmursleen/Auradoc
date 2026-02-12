'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  FileText, Mail, Phone, MapPin, ArrowUpRight, Linkedin, Github,
  Twitter, Send, Check, Zap, Shield, Award, Globe2,
  Activity, Clock, Server, Users, TrendingUp, Sparkles
} from 'lucide-react'

// Animated counter hook
const useCounter = (end: number, duration: number = 2000, isVisible: boolean = true) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, isVisible])

  return count
}

// World map ping animation
const WorldMapPings = () => {
  const [pings, setPings] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newPing = {
        id: Date.now(),
        x: Math.random() * 100,
        y: 20 + Math.random() * 60, // Keep pings in land mass areas
      }
      setPings(prev => [...prev.slice(-8), newPing])
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Simplified world map path */}
        <path
          d="M20,40 L25,38 L30,42 L35,40 L40,45 L45,43 L50,48 L55,45 L60,50 L65,48 L70,52 L75,50 L80,55"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
        />
        {pings.map(ping => (
          <g key={ping.id}>
            <circle
              cx={ping.x}
              cy={ping.y}
              r="0"
              fill="hsl(var(--primary))"
              opacity="0.8"
            >
              <animate attributeName="r" from="0" to="3" dur="1.5s" />
              <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" />
            </circle>
            <circle
              cx={ping.x}
              cy={ping.y}
              r="0"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.3"
            >
              <animate attributeName="r" from="0" to="6" dur="1.5s" />
              <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  )
}

// Floating particles
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${8 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  )
}

// Testimonial ticker
const TestimonialTicker = () => {
  const testimonials = [
    { name: 'Sarah Chen', company: 'TechCorp', text: 'Saved us $50k/year' },
    { name: 'Marcus Johnson', company: 'DesignCo', text: 'Easiest tool we use' },
    { name: 'Lisa Wang', company: 'StartupXYZ', text: 'Game changer for our team' },
    { name: 'David Smith', company: 'AgencyPro', text: 'Best $27 ever spent' },
    { name: 'Emma Rodriguez', company: 'LegalFirm', text: 'Clients love it' },
  ]

  return (
    <div className="relative overflow-hidden h-8 mb-8">
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-foreground to-transparent z-10" />
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-foreground to-transparent z-10" />
      <div className="flex gap-8 animate-marquee whitespace-nowrap">
        {[...testimonials, ...testimonials].map((item, i) => (
          <div key={i} className="flex items-center gap-3 opacity-50">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
              {item.name[0]}
            </div>
            <span className="text-sm">
              &quot;{item.text}&quot; — <span className="opacity-60">{item.name}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Live status indicators
const LiveStatus = () => {
  const [pulse, setPulse] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { icon: Activity, label: 'API Status', value: 'Operational', color: 'text-green-400' },
        { icon: Clock, label: 'Avg Response', value: '89ms', color: 'text-blue-400' },
        { icon: Server, label: 'Uptime', value: '99.99%', color: 'text-purple-400' },
        { icon: TrendingUp, label: 'Active Users', value: '12.4k', color: 'text-orange-400' },
      ].map((stat, i) => (
        <div
          key={i}
          className="relative bg-background/5 rounded-xl p-4 border border-background/10 overflow-hidden group hover:border-background/20 transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-3">
            <div className={`${stat.color} relative`}>
              <stat.icon className="w-4 h-4" />
              {i === 0 && (
                <span className={`absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full ${pulse ? 'animate-ping' : ''}`} />
              )}
            </div>
            <div>
              <div className="text-xs opacity-50">{stat.label}</div>
              <div className="text-sm font-semibold">{stat.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Newsletter signup with confetti
const NewsletterSignup = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success'>('idle')
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // Trigger confetti
    const colors = ['hsl(var(--primary))', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6']
    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 40,
      y: 50,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setConfetti(newConfetti)
    setStatus('success')
    setEmail('')

    setTimeout(() => {
      setConfetti([])
      setStatus('idle')
    }, 3000)
  }

  return (
    <div className="relative">
      {confetti.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map(c => (
            <div
              key={c.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                backgroundColor: c.color,
                animation: 'confettiFall 2s ease-out forwards',
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        Stay Updated
      </h3>

      {status === 'success' ? (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-sm">
          <Check className="w-4 h-4 text-green-400" />
          <span>You&apos;re on the list! 🎉</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-background/5 border border-background/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            required
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  )
}

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  // Intersection observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const docsCount = useCounter(12480000, 2000, isVisible)
  const usersCount = useCounter(54320, 2000, isVisible)
  const countriesCount = useCounter(187, 2000, isVisible)

  const footerLinks = {
    Product: [
      { label: 'E-Signatures', href: '/features' },
      { label: 'Resume Builder', href: '/resume-templates' },
      { label: 'Invoice Generator', href: '/create-invoice' },
      { label: 'Document Verify', href: '/verify' },
      { label: 'Custom Domain', href: '/features' },
      { label: 'API Access', href: '/api-docs' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers', badge: '🔥' },
      { label: 'Contact', href: '/contact' },
      { label: 'Security', href: '/security' },
    ],
    Resources: [
      { label: 'Templates', href: '/template-library' },
      { label: 'Tools', href: '/tools' },
      { label: 'Help Center', href: '/faq' },
      { label: 'API Docs', href: '/api-docs' },
    ],
    Legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Compliance', href: '/compliance' },
    ],
  }

  const trustBadges = [
    { icon: Shield, label: 'SSL Encrypted' },
    { icon: Award, label: 'SOC 2 Certified' },
    { icon: Globe2, label: 'GDPR Compliant' },
  ]

  return (
    <footer ref={footerRef} className="relative bg-foreground text-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/20 animate-gradient-shift" />
      </div>

      {/* World map background */}
      <WorldMapPings />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative container-main pt-20 pb-12">
        {/* Social proof ticker */}
        <TestimonialTicker />

        {/* Mega stats row */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { value: docsCount.toLocaleString(), label: 'Documents Signed', icon: FileText, suffix: '+' },
            { value: usersCount.toLocaleString(), label: 'Happy Users', icon: Users, suffix: '+' },
            { value: countriesCount, label: 'Countries', icon: Globe2, suffix: '' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center group cursor-default"
              style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-background via-background to-primary/60 bg-clip-text text-transparent">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm opacity-50">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Live status */}
        <LiveStatus />

        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                MamaSign
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-60 max-w-[280px] mb-6">
              Everything DocuSign charges <span className="line-through opacity-40">$2,160/year</span> for.
              <br />
              <span className="text-primary font-semibold">$27. Once. Forever.</span>
            </p>

            {/* Newsletter */}
            <NewsletterSignup />

            {/* Contact info */}
            <div className="space-y-3 mt-6">
              <a href="mailto:hello@mamasign.com" className="flex items-center gap-2.5 text-sm opacity-50 hover:opacity-100 transition-opacity">
                <Mail className="w-4 h-4" />
                hello@mamasign.com
              </a>
              <a href="tel:+18001234567" className="flex items-center gap-2.5 text-sm opacity-50 hover:opacity-100 transition-opacity">
                <Phone className="w-4 h-4" />
                +1 (800) 123-4567
              </a>
              <span className="flex items-center gap-2.5 text-sm opacity-50">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] opacity-40 mb-5 flex items-center gap-2">
                {category}
                <Zap className="w-3 h-3 opacity-50" />
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm opacity-60 hover:opacity-100 hover:text-primary transition-all inline-flex items-center gap-1.5 group"
                    >
                      <span>{link.label}</span>
                      {'badge' in link && link.badge && (
                        <span className="text-xs">{link.badge}</span>
                      )}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12 pb-8 border-b border-background/10">
          {trustBadges.map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm opacity-40 hover:opacity-100 transition-opacity cursor-default"
            >
              <badge.icon className="w-4 h-4" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs opacity-40 text-center md:text-left">
            © 2026 MamaSign. All rights reserved. Made with 💚 for the people who actually work.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {[
              { icon: Twitter, label: 'Twitter', href: '#' },
              { icon: Linkedin, label: 'LinkedIn', href: '#' },
              { icon: Github, label: 'GitHub', href: '#' },
            ].map(social => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 rounded-full border border-background/10 flex items-center justify-center opacity-40 hover:opacity-100 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all group"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(300px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(10%, 10%) scale(1.1);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-gradient-shift {
          animation: gradient-shift 15s ease-in-out infinite;
        }
      `}</style>
    </footer>
  )
}

export default Footer
