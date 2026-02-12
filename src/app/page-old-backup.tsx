'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  CheckCircle,
  Star,
  ArrowRight,
  Download,
  FileSignature,
  Users,
  Shield,
  CreditCard,
  ShieldCheck,
  FileCheck,
  Clock,
  Lock,
  Zap,
  Globe,
  Award,
  FileType,
  Image,
  Minimize2,
  PenTool,
  Layers,
  Scissors,
  Droplets,
  X,
  Check,
  ChevronDown,
  Send,
  Sparkles,
  TrendingUp,
  Heart,
  MousePointerClick,
  Bell,
  Eye,
} from 'lucide-react'
import HeroSection from '@/components/home/HeroSection'
import FloatingMobileCTA from '@/components/FloatingMobileCTA'
import { useTheme } from '@/components/ThemeProvider'
import MobileAppShell from '@/components/mobile/MobileAppShell'
import MobileHomeDashboard from '@/components/mobile/MobileHomeDashboard'

// ─── Scroll Reveal ───
const ScrollReveal = ({
  children,
  className = '',
  animation = 'scroll-reveal',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  animation?: 'scroll-reveal' | 'scroll-reveal-left' | 'scroll-reveal-right' | 'scroll-reveal-scale'
  delay?: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsRevealed(true); obs.unobserve(el) } }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`${animation} ${isRevealed ? 'revealed' : ''} ${className}`} style={{ transitionDelay: delay ? `${delay}s` : undefined }}>
      {children}
    </div>
  )
}

// ─── Feature Section Wrapper (CalendarJet-style) ───
const FeatureSection = ({
  isDark,
  badge,
  badgeIcon: BadgeIcon,
  heading,
  headingHighlight,
  description,
  benefits,
  cta,
  ctaHref,
  children,
  reverse = false,
  bgStyle,
}: {
  isDark: boolean
  badge: string
  badgeIcon: React.ElementType
  heading: string
  headingHighlight?: string
  description: string
  benefits: string[]
  cta: string
  ctaHref: string
  children: React.ReactNode
  reverse?: boolean
  bgStyle: 'primary' | 'secondary'
}) => {
  const bg = bgStyle === 'primary'
    ? isDark ? '#1F1F1F' : '#FFFFFF'
    : isDark ? '#171717' : '#F8F5FF'

  return (
    <section className="py-32 lg:py-40 xl:py-48" style={{ backgroundColor: bg }}>
      <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-20">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 xl:gap-32 items-center ${reverse ? 'lg:[direction:rtl]' : ''}`}>
          {/* Text Side */}
          <ScrollReveal animation={reverse ? 'scroll-reveal-right' : 'scroll-reveal-left'} className={reverse ? 'lg:[direction:ltr]' : ''}>
            <div className="max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{
                background: isDark ? 'rgba(196,255,14,0.08)' : 'rgba(76,0,255,0.05)',
                border: isDark ? '1px solid rgba(196,255,14,0.2)' : '1px solid rgba(76,0,255,0.12)',
              }}>
                <BadgeIcon className="w-4 h-4" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>{badge}</span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl lg:text-[2.75rem] xl:text-5xl font-bold leading-[1.1] mb-8" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px' }}>
                {heading}
                {headingHighlight && (
                  <span style={{
                    background: isDark ? 'linear-gradient(90deg, #c4ff0e, #a8ff00)' : 'linear-gradient(90deg, #4C00FF, #7B3FFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}> {headingHighlight}</span>
                )}
              </h2>

              {/* Description */}
              <p className="text-base lg:text-lg xl:text-xl leading-relaxed mb-12" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19,0,50,0.65)' }}>
                {description}
              </p>

              {/* Benefits */}
              <ul className="space-y-4 mb-12">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{
                      background: isDark ? 'rgba(34,197,94,0.15)' : 'rgba(16,185,129,0.08)',
                    }}>
                      <Check className="w-3 h-3" style={{ color: isDark ? '#22C55E' : '#10B981' }} />
                    </div>
                    <span className="text-sm lg:text-base" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(19,0,50,0.65)' }}>{b}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={ctaHref} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 group"
                style={{ background: isDark ? '#c4ff0e' : '#4C00FF', color: isDark ? '#000' : '#fff' }}>
                {cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Demo Side */}
          <ScrollReveal animation={reverse ? 'scroll-reveal-left' : 'scroll-reveal-right'} delay={0.15} className={reverse ? 'lg:[direction:ltr]' : ''}>
            <div className="rounded-2xl overflow-hidden" style={{
              background: isDark ? '#252525' : '#fff',
              border: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0',
              boxShadow: isDark ? '0 25px 60px -12px rgba(0,0,0,0.5)' : '0 25px 60px -12px rgba(19,0,50,0.12)',
            }}>
              {children}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

// ─── Interactive Demo: E-Signatures (Truly Interactive!) ───
const SignatureDemo = ({ isDark }: { isDark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    // Style
    ctx.strokeStyle = isDark ? '#c4ff0e' : '#4C00FF'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [isDark])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
    setHasDrawn(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
    setShowSuccess(false)
  }

  const applySignature = () => {
    if (hasDrawn) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: isDark ? '#c4ff0e' : '#4C00FF' }}>
            <PenTool className="w-4 h-4" style={{ color: isDark ? '#000' : '#fff' }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: isDark ? '#fff' : '#130032' }}>Sign Document</p>
            <p className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)' }}>Draw your signature below</p>
          </div>
        </div>
        <Sparkles className="w-5 h-5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF', opacity: 0.3 }} />
      </div>

      {/* Interactive Canvas */}
      <div className="relative mb-4">
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={clearSignature}
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 flex items-center gap-1"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(19,0,50,0.04)',
              color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19,0,50,0.5)',
            }}
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full rounded-xl cursor-crosshair"
          style={{
            height: '160px',
            background: isDark ? 'rgba(255,255,255,0.02)' : '#fff',
            border: isDark ? '2px dashed rgba(196,255,14,0.2)' : '2px dashed rgba(76,0,255,0.2)',
            touchAction: 'none',
          }}
        />

        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(19,0,50,0.2)' }}>
              Sign here with your mouse or finger
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={clearSignature}
          disabled={!hasDrawn}
          className="px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(19,0,50,0.04)',
            color: hasDrawn ? (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(19,0,50,0.7)') : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(19,0,50,0.2)'),
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(19,0,50,0.06)',
            opacity: hasDrawn ? 1 : 0.5,
          }}
        >
          <X className="w-4 h-4" />
          Clear
        </button>
        <button
          onClick={applySignature}
          disabled={!hasDrawn}
          className="px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background: hasDrawn ? (isDark ? '#c4ff0e' : '#4C00FF') : (isDark ? 'rgba(196,255,14,0.1)' : 'rgba(76,0,255,0.1)'),
            color: hasDrawn ? (isDark ? '#000' : '#fff') : (isDark ? 'rgba(196,255,14,0.3)' : 'rgba(76,0,255,0.3)'),
            opacity: hasDrawn ? 1 : 0.5,
            boxShadow: hasDrawn ? (isDark ? '0 0 20px rgba(196,255,14,0.2)' : '0 0 20px rgba(76,0,255,0.15)') : 'none',
          }}
        >
          <Check className="w-4 h-4" />
          Apply
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 rounded-xl animate-fade-in-up flex items-center gap-3" style={{
          background: isDark ? 'rgba(34,197,94,0.1)' : 'rgba(16,185,129,0.08)',
          border: isDark ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(16,185,129,0.15)',
        }}>
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div className="flex-1">
            <p className="text-sm font-bold text-green-500">Signature Applied!</p>
            <p className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19,0,50,0.5)' }}>
              Document signed successfully
            </p>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="mt-4 p-4 rounded-xl" style={{
        background: isDark ? 'rgba(196,255,14,0.04)' : 'rgba(76,0,255,0.03)',
        border: isDark ? '1px solid rgba(196,255,14,0.1)' : '1px solid rgba(76,0,255,0.08)',
      }}>
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 mt-0.5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
          <div>
            <p className="text-[11px] font-bold mb-1" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>
              Legally Binding
            </p>
            <p className="text-[10px] leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19,0,50,0.5)' }}>
              All signatures are encrypted and comply with ESIGN Act
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Interactive Demo: Resume Builder (Fully Editable!) ───
const ResumeDemo = ({ isDark }: { isDark: boolean }) => {
  const [name, setName] = useState('Sarah Johnson')
  const [title, setTitle] = useState('Senior Product Designer')
  const [active, setActive] = useState(0)
  const [downloading, setDownloading] = useState(false)

  const templates = [
    { name: 'Modern', color: '#4C00FF', icon: '✨' },
    { name: 'Professional', color: '#0EA5E9', icon: '💼' },
    { name: 'Creative', color: '#10B981', icon: '🎨' },
    { name: 'Executive', color: '#F59E0B', icon: '👑' },
  ]

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => setDownloading(false), 2000)
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Template Selector */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
        {templates.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 flex-shrink-0"
            style={{
              background: i === active ? t.color : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(76,0,255,0.03)'),
              color: i === active ? '#fff' : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)'),
              border: i === active ? 'none' : (isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(76,0,255,0.08)'),
              transform: i === active ? 'scale(1.05)' : 'scale(1)',
              boxShadow: i === active ? `0 8px 20px ${t.color}30` : 'none',
            }}
          >
            <span>{t.icon}</span>
            {t.name}
          </button>
        ))}
      </div>

      {/* Editable Form */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)',
          }}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E8E0F0',
              color: isDark ? '#fff' : '#130032',
            }}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)',
          }}>
            Job Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E8E0F0',
              color: isDark ? '#fff' : '#130032',
            }}
            placeholder="Enter your title"
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="relative">
        <div className="absolute -top-2 left-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold" style={{
          background: templates[active].color,
          color: '#fff',
        }}>
          <Eye className="w-2.5 h-2.5" />
          LIVE PREVIEW
        </div>

        <div className="rounded-xl overflow-hidden transition-all duration-500" style={{
          background: '#fff',
          border: `2px solid ${templates[active].color}`,
          boxShadow: `0 15px 40px ${templates[active].color}20`,
        }}>
          {/* Header with animated color */}
          <div className="h-24 transition-all duration-500 relative flex items-center px-6" style={{
            background: templates[active].color,
          }}>
            <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-full border-4 border-white shadow-lg transition-all duration-500 flex items-center justify-center text-2xl"
              style={{ background: templates[active].color }}>
              {templates[active].icon}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-12">
            {/* Name with real-time update */}
            <h3 className="text-lg font-bold text-gray-900 mb-1 transition-all duration-300">
              {name || 'Your Name'}
            </h3>
            <p className="text-sm font-medium mb-4 transition-all duration-500" style={{
              color: templates[active].color,
            }}>
              {title || 'Your Title'}
            </p>

            {/* Section Headers */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2 transition-all duration-500" style={{
                  color: templates[active].color,
                }}>
                  Experience
                </h4>
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-gray-100 rounded w-full" />
                  <div className="h-1.5 bg-gray-100 rounded w-11/12" />
                  <div className="h-1.5 bg-gray-100 rounded w-full" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2 transition-all duration-500" style={{
                  color: templates[active].color,
                }}>
                  Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {['Design', 'Figma', 'React', 'UX'].map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[9px] font-semibold transition-all duration-500" style={{
                      background: `${templates[active].color}15`,
                      color: templates[active].color,
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="w-full mt-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
        style={{
          background: downloading ? templates[active].color : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(76,0,255,0.04)'),
          color: downloading ? '#fff' : (isDark ? '#c4ff0e' : '#4C00FF'),
          border: downloading ? 'none' : (isDark ? '1px solid rgba(196,255,14,0.2)' : '1px solid rgba(76,0,255,0.15)'),
          boxShadow: downloading ? `0 10px 30px ${templates[active].color}40` : 'none',
        }}
      >
        {downloading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download Resume
          </>
        )}
      </button>
    </div>
  )
}

// ─── Interactive Demo: Invoice Generator (Dynamic Calculator!) ───
const InvoiceDemo = ({ isDark }: { isDark: boolean }) => {
  const [items, setItems] = useState([
    { id: 1, name: 'Website Design', amount: 2500 },
    { id: 2, name: 'Logo Branding', amount: 800 },
    { id: 3, name: 'SEO Setup', amount: 450 },
  ])
  const [newItemName, setNewItemName] = useState('')
  const [newItemAmount, setNewItemAmount] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const total = items.reduce((s, i) => s + i.amount, 0)
  const tax = Math.round(total * 0.1)
  const grandTotal = total + tax

  const addItem = () => {
    if (newItemName && newItemAmount) {
      setItems([...items, {
        id: Date.now(),
        name: newItemName,
        amount: parseInt(newItemAmount) || 0
      }])
      setNewItemName('')
      setNewItemAmount('')
      setShowAddForm(false)
    }
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateAmount = (id: number, newAmount: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, amount: parseInt(newAmount) || 0 } : item
    ))
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{
            background: isDark ? '#c4ff0e' : '#4C00FF',
          }}>
            <CreditCard className="w-5 h-5" style={{ color: isDark ? '#000' : '#fff' }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: isDark ? '#fff' : '#130032' }}>Invoice #1087</p>
            <p className="text-[11px]" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(19,0,50,0.4)' }}>
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 flex items-center gap-1"
          style={{
            background: isDark ? 'rgba(196,255,14,0.1)' : 'rgba(76,0,255,0.08)',
            color: isDark ? '#c4ff0e' : '#4C00FF',
          }}
        >
          {showAddForm ? <X className="w-3 h-3" /> : <span className="text-sm">+</span>}
          {showAddForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="mb-4 p-4 rounded-xl animate-fade-in-up" style={{
          background: isDark ? 'rgba(196,255,14,0.04)' : 'rgba(76,0,255,0.03)',
          border: isDark ? '1px solid rgba(196,255,14,0.1)' : '1px solid rgba(76,0,255,0.08)',
        }}>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Item description"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E8E0F0',
                color: isDark ? '#fff' : '#130032',
              }}
            />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{
                  color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(19,0,50,0.3)',
                }}>$</span>
                <input
                  type="number"
                  placeholder="0"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-lg text-sm"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E8E0F0',
                    color: isDark ? '#fff' : '#130032',
                  }}
                />
              </div>
              <button
                onClick={addItem}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                style={{
                  background: isDark ? '#c4ff0e' : '#4C00FF',
                  color: isDark ? '#000' : '#fff',
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2 mb-4">
        {items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-2 p-3 rounded-lg group transition-all duration-200" style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : '#F8F5FF',
            border: isDark ? '1px solid rgba(255,255,255,0.03)' : '1px solid #F0EBF5',
          }}>
            <span className="flex-1 text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(19,0,50,0.65)' }}>
              {item.name}
            </span>
            <input
              type="number"
              value={item.amount}
              onChange={(e) => updateAmount(item.id, e.target.value)}
              className="w-24 px-2 py-1 rounded text-sm font-bold text-right"
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
                border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E8E0F0',
                color: isDark ? '#fff' : '#130032',
              }}
            />
            <button
              onClick={() => removeItem(item.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
              style={{ color: '#EF4444' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Calculations */}
      <div className="space-y-2 mb-4 p-4 rounded-xl" style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(76,0,255,0.02)',
        border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(76,0,255,0.06)',
      }}>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19,0,50,0.5)' }}>Subtotal</span>
          <span className="font-semibold transition-all duration-300" style={{ color: isDark ? '#fff' : '#130032' }}>
            ${total.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19,0,50,0.5)' }}>Tax (10%)</span>
          <span className="font-semibold transition-all duration-300" style={{ color: isDark ? '#fff' : '#130032' }}>
            ${tax.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Total with Animation */}
      <div className="flex items-center justify-between p-4 rounded-xl transition-all duration-500" style={{
        background: isDark ? '#c4ff0e' : '#4C00FF',
        boxShadow: isDark ? '0 10px 30px rgba(196,255,14,0.2)' : '0 10px 30px rgba(76,0,255,0.2)',
      }}>
        <span className="text-sm font-bold" style={{ color: isDark ? '#000' : '#fff' }}>
          Total Due
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-bold" style={{ color: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)' }}>
            USD
          </span>
          <span className="text-2xl font-bold transition-all duration-500" style={{ color: isDark ? '#000' : '#fff' }}>
            ${grandTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button className="p-3 rounded-lg text-center transition-all duration-200 hover:scale-105" style={{
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(76,0,255,0.04)',
          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(76,0,255,0.08)',
        }}>
          <Download className="w-4 h-4 mx-auto mb-1" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
          <span className="text-[10px] font-bold" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>
            Download
          </span>
        </button>
        <button className="p-3 rounded-lg text-center transition-all duration-200 hover:scale-105" style={{
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(76,0,255,0.04)',
          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(76,0,255,0.08)',
        }}>
          <Send className="w-4 h-4 mx-auto mb-1" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
          <span className="text-[10px] font-bold" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>
            Send
          </span>
        </button>
      </div>
    </div>
  )
}

// ─── Interactive Demo: PDF Verification (Drag & Drop Upload!) ───
const VerifyDemo = ({ isDark }: { isDark: boolean }) => {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'hashing' | 'verified' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const simulateVerification = (name: string) => {
    setFileName(name)
    setPhase('scanning')
    setProgress(0)

    // Scanning phase
    const scanInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 40) {
          clearInterval(scanInterval)
          setPhase('hashing')
          return 40
        }
        return prev + 2
      })
    }, 30)

    // Hashing phase
    setTimeout(() => {
      const hashInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(hashInterval)
            setPhase('verified')
            return 100
          }
          return prev + 3
        })
      }, 40)
    }, 800)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      simulateVerification(file.name)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      simulateVerification(file.name)
    }
  }

  const reset = () => {
    setPhase('idle')
    setProgress(0)
    setFileName('')
  }

  return (
    <div className="p-6 lg:p-8">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={phase === 'idle' ? handleClick : undefined}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
          phase === 'idle' || phase === 'error' ? 'cursor-pointer hover:scale-[1.02]' : ''
        }`}
        style={{
          minHeight: '200px',
          borderColor: phase === 'verified'
            ? '#10B981'
            : phase === 'error'
            ? '#EF4444'
            : isDragging
            ? (isDark ? '#c4ff0e' : '#4C00FF')
            : (isDark ? 'rgba(196,255,14,0.2)' : 'rgba(76,0,255,0.2)'),
          background: phase === 'verified'
            ? 'rgba(16,185,129,0.03)'
            : phase === 'error'
            ? 'rgba(239,68,68,0.03)'
            : isDragging
            ? (isDark ? 'rgba(196,255,14,0.04)' : 'rgba(76,0,255,0.04)')
            : (isDark ? 'rgba(255,255,255,0.01)' : 'rgba(76,0,255,0.01)'),
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
            phase === 'scanning' || phase === 'hashing' ? 'animate-pulse' : ''
          }`} style={{
            background: phase === 'verified'
              ? 'rgba(16,185,129,0.1)'
              : phase === 'error'
              ? 'rgba(239,68,68,0.1)'
              : (isDark ? 'rgba(196,255,14,0.08)' : 'rgba(76,0,255,0.06)'),
            border: phase === 'verified'
              ? '2px solid rgba(16,185,129,0.3)'
              : phase === 'error'
              ? '2px solid rgba(239,68,68,0.3)'
              : (isDark ? '2px solid rgba(196,255,14,0.2)' : '2px solid rgba(76,0,255,0.15)'),
            transform: phase === 'verified' ? 'scale(1.1)' : 'scale(1)',
          }}>
            {phase === 'scanning' || phase === 'hashing' ? (
              <div className="relative">
                <div className="w-8 h-8 rounded-full border-3 border-t-transparent animate-spin" style={{
                  borderColor: isDark ? '#c4ff0e' : '#4C00FF',
                  borderTopColor: 'transparent',
                  borderWidth: '3px',
                }} />
                <Shield className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{
                  color: isDark ? '#c4ff0e' : '#4C00FF',
                }} />
              </div>
            ) : phase === 'verified' ? (
              <CheckCircle className="w-9 h-9 text-green-500" />
            ) : phase === 'error' ? (
              <X className="w-9 h-9 text-red-500" />
            ) : (
              <ShieldCheck className="w-9 h-9" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
            )}
          </div>

          {/* Text */}
          <h4 className="text-base font-bold mb-2 transition-all duration-300" style={{
            color: phase === 'verified'
              ? '#10B981'
              : phase === 'error'
              ? '#EF4444'
              : (isDark ? '#fff' : '#130032'),
          }}>
            {phase === 'scanning' && 'Scanning Document...'}
            {phase === 'hashing' && 'Computing SHA-256 Hash...'}
            {phase === 'verified' && 'Document Verified! ✓'}
            {phase === 'error' && 'Verification Failed'}
            {phase === 'idle' && (isDragging ? 'Drop PDF Here' : 'Drag & Drop PDF')}
          </h4>

          <p className="text-xs mb-4 text-center max-w-[220px]" style={{
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.4)',
          }}>
            {phase === 'idle' && 'or click to browse files'}
            {(phase === 'scanning' || phase === 'hashing') && fileName}
            {phase === 'verified' && 'No tampering detected'}
            {phase === 'error' && 'Please try again'}
          </p>

          {/* Progress Bar */}
          {(phase === 'scanning' || phase === 'hashing') && (
            <div className="w-full max-w-xs">
              <div className="h-2 rounded-full overflow-hidden" style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(76,0,255,0.08)',
              }}>
                <div className="h-full rounded-full transition-all duration-300" style={{
                  width: `${progress}%`,
                  background: isDark
                    ? 'linear-gradient(90deg, #c4ff0e, #a8ff00)'
                    : 'linear-gradient(90deg, #4C00FF, #7B3FFF)',
                }} />
              </div>
              <p className="text-[10px] text-center mt-1.5 font-bold" style={{
                color: isDark ? '#c4ff0e' : '#4C00FF',
              }}>
                {progress}% Complete
              </p>
            </div>
          )}

          {/* Success Badges */}
          {phase === 'verified' && (
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs mt-2 animate-fade-in-up">
              {['Hash Match', 'No Tampering', 'Original File', 'Integrity OK'].map((label, i) => (
                <div key={i} className="flex items-center gap-1.5 p-2 rounded-lg" style={{
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.15)',
                }}>
                  <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span className="text-[10px] text-green-600 font-bold">{label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Reset Button */}
          {(phase === 'verified' || phase === 'error') && (
            <button
              onClick={(e) => { e.stopPropagation(); reset() }}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(76,0,255,0.06)',
                color: isDark ? '#c4ff0e' : '#4C00FF',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(76,0,255,0.1)',
              }}
            >
              Verify Another
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-4 rounded-xl" style={{
        background: isDark ? 'rgba(196,255,14,0.03)' : 'rgba(76,0,255,0.02)',
        border: isDark ? '1px solid rgba(196,255,14,0.08)' : '1px solid rgba(76,0,255,0.06)',
      }}>
        <div className="flex items-start gap-2">
          <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{
            color: isDark ? '#c4ff0e' : '#4C00FF',
          }} />
          <div className="flex-1">
            <p className="text-[11px] font-bold mb-1" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>
              Cryptographic Verification
            </p>
            <p className="text-[10px] leading-relaxed" style={{
              color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(19,0,50,0.5)',
            }}>
              SHA-256 hashing detects even single-pixel changes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── FAQ ───
const FAQItem = ({ question, answer, isDark }: { question: string; answer: string; isDark: boolean }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl transition-all duration-200" style={{
      border: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0',
      background: isDark ? '#1F1F1F' : '#fff',
    }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-semibold text-[15px] pr-4" style={{ color: isDark ? '#fff' : '#130032' }}>{question}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="px-5 text-sm leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19,0,50,0.65)' }}>{answer}</p>
      </div>
    </div>
  )
}

// ─── Main HomePage ───
const HomePage: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const trustBadges = [
    { icon: Lock, label: 'AES-256 Encrypted' },
    { icon: Shield, label: 'GDPR Compliant' },
    { icon: Award, label: 'ESIGN Act & eIDAS' },
    { icon: Globe, label: '180+ Countries' },
    { icon: Zap, label: 'Lightning Fast' },
    { icon: ShieldCheck, label: 'SOC 2 Ready' },
  ]

  const pdfTools = [
    { name: 'PDF to Word', href: '/tools/pdf-to-word', icon: FileType, desc: 'Convert PDF to editable Word documents' },
    { name: 'PDF Compressor', href: '/tools/pdf-compressor', icon: Minimize2, desc: 'Reduce file size by up to 90%' },
    { name: 'Image to PDF', href: '/tools/image-to-pdf', icon: Image, desc: 'Convert any image to PDF instantly' },
    { name: 'Signature Generator', href: '/tools/signature-generator', icon: PenTool, desc: 'Create beautiful digital signatures' },
    { name: 'PDF Merge', href: '/tools/pdf-merge', icon: Layers, desc: 'Combine multiple PDFs into one' },
    { name: 'PDF Split', href: '/tools/pdf-split', icon: Scissors, desc: 'Split PDF into individual pages' },
    { name: 'Word to PDF', href: '/tools/word-to-pdf', icon: FileText, desc: 'Convert Word files to PDF format' },
    { name: 'Watermark PDF', href: '/tools/watermark-pdf', icon: Droplets, desc: 'Add custom watermarks to PDFs' },
  ]

  const testimonials = [
    { quote: "MamaSign has completely transformed how we handle contracts. What used to take 3-5 business days now takes under 5 minutes. Our close rate went up 23%.", author: 'Sarah Johnson', role: 'Operations Director', company: 'TechFlow Solutions', initials: 'SJ' },
    { quote: "I've used DocuSign, HelloSign, and Adobe Sign. MamaSign is the only one that doesn't feel like it was designed by a committee. The lifetime deal saved us $2,000+.", author: 'Michael Chen', role: 'Legal Counsel', company: 'Chen & Associates', initials: 'MC' },
    { quote: "Finally, an e-signature platform that just works. Our remote team loves it. The PDF tools are a game-changer -- we use the compressor and merge tools daily.", author: 'Emily Rodriguez', role: 'Project Manager', company: 'Creative Agency Co.', initials: 'ER' },
    { quote: "Switched from DocuSign after they hiked prices again. MamaSign does everything we need at a fraction of the cost. The one-time payment model is honestly unbeatable.", author: 'David Park', role: 'Founder & CEO', company: 'Park Ventures', initials: 'DP' },
    { quote: "As a freelancer, I was wasting hours on invoicing and contracts. MamaSign handles both. I create invoices, get contracts signed, and look 10x more professional.", author: 'Lisa Thompson', role: 'Freelance Designer', company: 'Self-employed', initials: 'LT' },
    { quote: "The document verification feature is unique. No other platform offers SHA-256 hash verification for free. We use it for compliance and our auditors are impressed.", author: 'James Wilson', role: 'Compliance Officer', company: 'FinTech Corp', initials: 'JW' },
  ]

  const comparisonFeatures = [
    { feature: 'E-Signatures', a: true, h: true, ad: true },
    { feature: 'Unlimited Documents', a: true, h: '3/mo free', ad: '2/mo free' },
    { feature: 'Document Verification', a: true, h: false, ad: false },
    { feature: 'PDF Watermarking', a: true, h: false, ad: 'Paid add-on' },
    { feature: 'Audit Trail', a: true, h: true, ad: true },
    { feature: 'Multiple Signers', a: true, h: 'Paid only', ad: 'Paid only' },
    { feature: 'Templates', a: 'Unlimited', h: '5 max', ad: '5 max' },
    { feature: 'Free PDF Tools (8+)', a: true, h: false, ad: false },
    { feature: 'Invoice Generator', a: true, h: false, ad: false },
    { feature: 'Resume Builder', a: true, h: false, ad: false },
    { feature: 'One-Time Payment', a: true, h: false, ad: false },
  ]

  const faqs = [
    { q: 'Is MamaSign legally binding?', a: 'Yes. MamaSign e-signatures are legally valid under the ESIGN Act (US), eIDAS (EU), and equivalent laws in 180+ countries. Every document includes a complete audit trail with timestamps and IP addresses.' },
    { q: 'How does the lifetime deal work?', a: 'Pay once, use forever. No monthly fees, no renewals. Unlimited signing, all PDF tools, invoice generator, resume builder, and every future update -- all for $27.' },
    { q: 'Is my data secure?', a: 'We use AES-256 encryption at rest, TLS 1.3 in transit, SOC 2 ready infrastructure with GDPR compliance. Documents are stored in geographically distributed data centers.' },
    { q: 'Can I send to multiple signers?', a: 'Yes! Add unlimited signers, set signing orders, assign fields, and track status in real-time. Automatic email reminders ensure nobody forgets.' },
    { q: 'Do I need an account for PDF tools?', a: 'No! All 8+ PDF tools are 100% free with no account. Files are processed in your browser and never leave your device.' },
    { q: 'What if I need help?', a: '24/7 in-app chat, email support, comprehensive docs, and video tutorials. Most questions answered within 2 hours.' },
  ]

  const renderVal = (v: boolean | string, hl?: boolean) => {
    if (typeof v === 'boolean')
      return v
        ? <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/40' : 'bg-green-50'}`}><Check className={`h-3.5 w-3.5 ${isDark ? 'text-green-400' : 'text-green-600'}`} /></div>
        : <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDark ? 'bg-red-900/40' : 'bg-red-50'}`}><X className={`h-3.5 w-3.5 ${isDark ? 'text-red-400' : 'text-red-500'}`} /></div>
    return <span className={`text-xs font-semibold ${hl ? (isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]') : (isDark ? 'text-gray-500' : 'text-gray-500')}`}>{v}</span>
  }

  return (
    <>
      <MobileAppShell><HeroSection variant="mobile" /><MobileHomeDashboard /></MobileAppShell>

      <div className={`hidden md:block overflow-hidden ${isDark ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
        {/* ─── HERO ─── */}
        <HeroSection variant="desktop" />

        {/* ─── TRUST BADGES ─── */}
        <section className="py-4" style={{ backgroundColor: isDark ? '#171717' : '#FFFFFF', borderTop: isDark ? '1px solid #222' : '1px solid #E8E0F0', borderBottom: isDark ? '1px solid #222' : '1px solid #E8E0F0' }}>
          <div className="marquee-container">
            <div className="marquee-track">
              {[...trustBadges, ...trustBadges, ...trustBadges, ...trustBadges].map((b, i) => (
                <div key={i} className="flex items-center gap-2 mx-8 flex-shrink-0" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(19,0,50,0.5)' }}>
                  <b.icon className="w-4.5 h-4.5 flex-shrink-0" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                  <span className="text-sm font-medium whitespace-nowrap">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PROBLEM SECTION ─── */}
        <section className="py-32 lg:py-40 xl:py-48" style={{ backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }}>
          <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-20 text-center">
            <ScrollReveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>The Problem</p>
              <h2 className="text-3xl lg:text-[2.75rem] font-bold leading-[1.1] mb-5" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px' }}>
                Still printing, scanning, and mailing?{' '}
                <span style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(19,0,50,0.25)' }}>You&apos;re losing deals.</span>
              </h2>
              <p className="text-base lg:text-lg leading-relaxed max-w-2xl mx-auto mb-10" style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(19,0,50,0.6)' }}>
                Every day without a signature is another day a deal can fall through. <strong style={{ color: isDark ? '#fff' : '#130032' }}>Contracts signed digitally close 80% faster.</strong> Your competitors already know this.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="grid grid-cols-3 gap-5 max-w-2xl mx-auto">
                {[
                  { icon: Clock, stat: '5 days', label: 'Average paper turnaround' },
                  { icon: TrendingUp, stat: '23%', label: 'Deals lost to slow signing' },
                  { icon: CreditCard, stat: '$36/mo', label: 'Avg. e-sign platform cost' },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-xl text-center" style={{ background: isDark ? '#171717' : '#F8F5FF', border: isDark ? '1px solid #222' : '1px solid #E8E0F0' }}>
                    <item.icon className="w-5 h-5 mx-auto mb-2.5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                    <p className="text-xl font-bold mb-0.5" style={{ color: isDark ? '#fff' : '#130032' }}>{item.stat}</p>
                    <p className="text-[11px]" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(19,0,50,0.4)' }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── FEATURE 1: E-SIGNATURES ─── */}
        <FeatureSection isDark={isDark} bgStyle="secondary" badge="E-Signatures" badgeIcon={FileSignature}
          heading="Get Documents Signed in Under 60 Seconds." headingHighlight="Every Time."
          description="Upload any PDF, drag signature fields exactly where you need them, send to signers, and get legally-binding signatures back -- faster than making a cup of coffee."
          benefits={['Drag & drop signature placement', 'Multi-signer support with signing order', 'Real-time tracking & email notifications', 'Legally binding in 180+ countries', 'Automatic audit trail & certificates']}
          cta="Start Signing Free" ctaHref="/sign-document">
          <SignatureDemo isDark={isDark} />
        </FeatureSection>

        {/* ─── FEATURE 2: RESUME BUILDER ─── */}
        <FeatureSection isDark={isDark} bgStyle="primary" reverse badge="Resume Builder" badgeIcon={FileText}
          heading="Land Your Dream Job with Resumes" headingHighlight="That Get Noticed."
          description="Choose from professional, ATS-friendly templates. Customize colors, fonts, and layout in real-time. Download a pixel-perfect PDF in minutes -- not hours."
          benefits={['4+ professional, ATS-optimized templates', 'Real-time preview as you type', 'One-click PDF download', 'Customizable colors and layout', 'Mobile-friendly editor']}
          cta="Build Your Resume" ctaHref="/templates">
          <ResumeDemo isDark={isDark} />
        </FeatureSection>

        {/* ─── FEATURE 3: INVOICE GENERATOR ─── */}
        <FeatureSection isDark={isDark} bgStyle="secondary" badge="Invoice Generator" badgeIcon={CreditCard}
          heading="Create Invoices That" headingHighlight="Get You Paid Faster."
          description="Generate stunning, branded invoices in minutes with automatic tax calculations. Download as PDF and send instantly. Look professional, get paid on time."
          benefits={['Auto-calculate totals, taxes & discounts', 'Add your company logo & branding', 'Professional PDF download', 'Track payment status', 'Multiple currency support']}
          cta="Create an Invoice" ctaHref="/create-invoice">
          <InvoiceDemo isDark={isDark} />
        </FeatureSection>

        {/* ─── FEATURE 4: PDF VERIFICATION ─── */}
        <FeatureSection isDark={isDark} bgStyle="primary" reverse badge="Document Verification" badgeIcon={ShieldCheck}
          heading="Verify Document Integrity with" headingHighlight="Military-Grade Security."
          description="SHA-256 cryptographic hashing detects even a single changed pixel. Know with 100% certainty your documents haven't been tampered with."
          benefits={['SHA-256 hash verification', 'Instant tampering detection', 'Register original documents', 'Detailed verification reports', 'Blockchain-ready architecture']}
          cta="Verify a Document" ctaHref="/verify">
          <VerifyDemo isDark={isDark} />
        </FeatureSection>

        {/* ─── FREE PDF TOOLS ─── */}
        <section className="py-32 lg:py-40 xl:py-48" style={{ backgroundColor: isDark ? '#171717' : '#F8F5FF' }}>
          <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-20">
            <ScrollReveal className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-5" style={{
                background: isDark ? 'rgba(196,255,14,0.06)' : 'rgba(76,0,255,0.04)', border: isDark ? '1px solid rgba(196,255,14,0.12)' : '1px solid rgba(76,0,255,0.08)', color: isDark ? '#c4ff0e' : '#4C00FF',
              }}><Sparkles className="w-3.5 h-3.5" />100% Free - No Sign Up</div>
              <h2 className="text-3xl lg:text-[2.75rem] font-bold mb-4" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px', lineHeight: '1.1' }}>8 Free PDF Tools That Just Work</h2>
              <p className="text-base lg:text-lg max-w-xl mx-auto" style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(19,0,50,0.6)' }}>Everything runs in your browser. Your files never leave your device.</p>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {pdfTools.map((tool, i) => (
                <ScrollReveal key={i} delay={i * 0.04}>
                  <Link href={tool.href} className="group block p-5 rounded-xl h-full transition-all duration-300 hover:-translate-y-1" style={{
                    background: isDark ? '#1F1F1F' : '#fff', border: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0',
                  }} onMouseEnter={e => { e.currentTarget.style.boxShadow = isDark ? '0 20px 40px rgba(0,0,0,0.3)' : '0 20px 40px rgba(19,0,50,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: isDark ? 'rgba(196,255,14,0.08)' : 'rgba(76,0,255,0.04)' }}>
                      <tool.icon className="w-4.5 h-4.5" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                    </div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: isDark ? '#fff' : '#130032' }}>{tool.name}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(19,0,50,0.5)' }}>{tool.desc}</p>
                    <div className="flex items-center gap-1 mt-2.5 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>Use Free <ArrowRight className="w-3 h-3" /></div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── COMPARISON ─── */}
        <section className="py-32 lg:py-40 xl:py-48" style={{ backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }}>
          <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-20">
            <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>See The Difference</p>
              <h2 className="text-3xl lg:text-[2.75rem] font-bold mb-4" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px', lineHeight: '1.1' }}>Why 50,000+ Businesses Chose MamaSign</h2>
              <p className="text-base lg:text-lg" style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(19,0,50,0.6)' }}>Every premium feature at a fraction of the cost. One payment, lifetime access.</p>
            </ScrollReveal>
            <ScrollReveal>
              <div className="max-w-3xl mx-auto mb-10 rounded-2xl overflow-hidden" style={{ border: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0', boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.3)' : '0 20px 50px rgba(19,0,50,0.06)' }}>
                <div className="grid grid-cols-4" style={{ background: isDark ? '#171717' : '#FAFAFA', borderBottom: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0' }}>
                  <div className="p-4 font-bold text-sm" style={{ color: isDark ? '#fff' : '#130032' }}>Feature</div>
                  <div className="p-4 text-center" style={{ background: isDark ? 'rgba(196,255,14,0.05)' : 'rgba(76,0,255,0.03)', borderLeft: isDark ? '1px solid rgba(196,255,14,0.1)' : '1px solid rgba(76,0,255,0.06)', borderRight: isDark ? '1px solid rgba(196,255,14,0.1)' : '1px solid rgba(76,0,255,0.06)' }}>
                    <div className="font-bold text-sm" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>MamaSign</div>
                  </div>
                  <div className="p-4 text-center text-sm font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.45)' }}>HelloSign</div>
                  <div className="p-4 text-center text-sm font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.45)' }}>Adobe Sign</div>
                </div>
                <div className="grid grid-cols-4" style={{ borderBottom: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0' }}>
                  <div className="p-4 font-bold text-sm" style={{ color: isDark ? '#fff' : '#130032' }}>Price</div>
                  <div className="p-4 text-center" style={{ background: isDark ? 'rgba(196,255,14,0.03)' : 'rgba(76,0,255,0.015)', borderLeft: isDark ? '1px solid rgba(196,255,14,0.06)' : '1px solid rgba(76,0,255,0.04)', borderRight: isDark ? '1px solid rgba(196,255,14,0.06)' : '1px solid rgba(76,0,255,0.04)' }}>
                    <div className="text-xl font-bold" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>$27</div>
                    <div className="text-[10px] text-green-500 font-bold">LIFETIME</div>
                  </div>
                  <div className="p-4 text-center"><div className="text-lg font-bold" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19,0,50,0.6)' }}>$180</div><div className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(19,0,50,0.3)' }}>/year</div></div>
                  <div className="p-4 text-center"><div className="text-lg font-bold" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(19,0,50,0.6)' }}>$156</div><div className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(19,0,50,0.3)' }}>/year</div></div>
                </div>
                {comparisonFeatures.map((r, i) => (
                  <div key={r.feature} className="grid grid-cols-4" style={{
                    background: isDark ? (i % 2 === 0 ? '#1F1F1F' : '#1a1a1a') : (i % 2 === 0 ? '#fff' : '#FAFAFA'),
                    borderBottom: i < comparisonFeatures.length - 1 ? (isDark ? '1px solid #222' : '1px solid #E8E0F0') : 'none',
                  }}>
                    <div className="p-4 text-xs font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.8)' : '#130032' }}>{r.feature}</div>
                    <div className="p-4 flex items-center justify-center" style={{ background: isDark ? 'rgba(196,255,14,0.02)' : 'rgba(76,0,255,0.01)', borderLeft: isDark ? '1px solid rgba(196,255,14,0.04)' : '1px solid rgba(76,0,255,0.03)', borderRight: isDark ? '1px solid rgba(196,255,14,0.04)' : '1px solid rgba(76,0,255,0.03)' }}>{renderVal(r.a, true)}</div>
                    <div className="p-4 flex items-center justify-center">{renderVal(r.h)}</div>
                    <div className="p-4 flex items-center justify-center">{renderVal(r.ad)}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="max-w-xl mx-auto rounded-2xl p-7 text-center relative overflow-hidden" style={{ background: isDark ? '#c4ff0e' : '#4C00FF', color: isDark ? '#000' : '#fff' }}>
                <div className="text-2xl lg:text-3xl font-bold mb-2">Save $753+ with MamaSign</div>
                <p className="text-sm mb-5" style={{ opacity: 0.75 }}>One-time $27 vs $900+ over 5 years with competitors</p>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors" style={{ background: isDark ? '#000' : '#fff', color: isDark ? '#c4ff0e' : '#4C00FF' }}>
                  Get Lifetime Access <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="py-32 lg:py-40 xl:py-48" style={{ backgroundColor: isDark ? '#171717' : '#F8F5FF' }}>
          <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-20">
            <ScrollReveal className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>Simple as 1-2-3</p>
              <h2 className="text-3xl lg:text-[2.75rem] font-bold" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px', lineHeight: '1.1' }}>Get Signed in 60 Seconds</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { s: '01', icon: Download, t: 'Upload Document', d: 'Drag and drop any PDF, Word doc, or image. All major formats supported.' },
                { s: '02', icon: MousePointerClick, t: 'Add Signature Fields', d: 'Click where you need signatures, initials, dates. Assign to signers.' },
                { s: '03', icon: Send, t: 'Send & Get Signed', d: 'Enter emails, hit send. Signers sign on any device. You get it back instantly.' },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.12}>
                  <div className="relative p-7 rounded-2xl text-center h-full" style={{ background: isDark ? '#1F1F1F' : '#fff', border: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0' }}>
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: isDark ? '#c4ff0e' : '#4C00FF', color: isDark ? '#000' : '#fff' }}>Step {item.s}</div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 mt-1" style={{ background: isDark ? 'rgba(196,255,14,0.08)' : 'rgba(76,0,255,0.04)' }}>
                      <item.icon className="w-6 h-6" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }} />
                    </div>
                    <h3 className="text-base font-bold mb-2" style={{ color: isDark ? '#fff' : '#130032' }}>{item.t}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(19,0,50,0.6)' }}>{item.d}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={0.3} className="text-center mt-10">
              <Link href="/sign-document" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all group" style={{ background: isDark ? '#c4ff0e' : '#4C00FF', color: isDark ? '#000' : '#fff' }}>
                Try It Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="py-32 lg:py-40 xl:py-48" style={{ backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }}>
          <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-20">
            <ScrollReveal className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>Don&apos;t Take Our Word For It</p>
              <h2 className="text-3xl lg:text-[2.75rem] font-bold mb-4" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px', lineHeight: '1.1' }}>Loved by 50,000+ Businesses</h2>
              <div className="flex items-center justify-center gap-0.5 mb-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}</div>
              <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(19,0,50,0.45)' }}>4.9/5 from 2,400+ reviews</p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <ScrollReveal key={i} delay={i * 0.06}>
                  <div className="rounded-2xl p-6 h-full flex flex-col" style={{ background: isDark ? '#171717' : '#F8F5FF', border: isDark ? '1px solid #222' : '1px solid #E8E0F0' }}>
                    <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-current" />)}</div>
                    <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(19,0,50,0.6)' }}>&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-2.5 pt-4" style={{ borderTop: isDark ? '1px solid #222' : '1px solid #E8E0F0' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: isDark ? '#c4ff0e' : '#4C00FF', color: isDark ? '#000' : '#fff' }}>{t.initials}</div>
                      <div>
                        <p className="font-semibold text-xs" style={{ color: isDark ? '#fff' : '#130032' }}>{t.author}</p>
                        <p className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(19,0,50,0.4)' }}>{t.role}, {t.company}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHY CHOOSE US ─── */}
        <section className="py-32 lg:py-40 xl:py-48" style={{ backgroundColor: isDark ? '#171717' : '#F8F5FF' }}>
          <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-20">
            <ScrollReveal className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>Built Different</p>
              <h2 className="text-3xl lg:text-[2.75rem] font-bold" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px', lineHeight: '1.1' }}>Why Smart Teams Choose MamaSign</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Zap, title: 'Lightning Fast', desc: 'Documents signed in under 60 seconds. Upload, add fields, send. Done.' },
                { icon: Lock, title: 'Bank-Level Security', desc: 'AES-256 encryption, TLS 1.3, SOC 2 ready. Safer than your bank.' },
                { icon: Award, title: 'Legally Binding', desc: 'Valid in 180+ countries. ESIGN Act, eIDAS. Full audit trail included.' },
                { icon: Heart, title: 'No Monthly Fees', desc: 'One-time $27 payment. Lifetime access. Competitors charge $15-30/month.' },
                { icon: Globe, title: 'Works Everywhere', desc: 'Any browser, any device. Mac, Windows, iOS, Android. Sign anywhere.' },
                { icon: Sparkles, title: 'All-in-One Platform', desc: 'E-signs, PDF tools, invoicing, resumes, verification. Everything in one place.' },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.06}>
                  <div className="p-6 rounded-2xl h-full hover:-translate-y-1 transition-transform" style={{ background: isDark ? '#1F1F1F' : '#fff', border: isDark ? '1px solid #2a2a2a' : '1px solid #E8E0F0' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: isDark ? '#c4ff0e' : '#4C00FF' }}>
                      <item.icon className="w-5 h-5" style={{ color: isDark ? '#000' : '#fff' }} />
                    </div>
                    <h3 className="text-base font-bold mb-1.5" style={{ color: isDark ? '#fff' : '#130032' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(19,0,50,0.6)' }}>{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-32 lg:py-40 xl:py-48" style={{ backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }}>
          <div className="max-w-[700px] mx-auto px-6 lg:px-8">
            <ScrollReveal className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: isDark ? '#c4ff0e' : '#4C00FF' }}>Got Questions?</p>
              <h2 className="text-3xl lg:text-[2.75rem] font-bold" style={{ color: isDark ? '#fff' : '#130032', letterSpacing: '-0.5px', lineHeight: '1.1' }}>Frequently Asked Questions</h2>
            </ScrollReveal>
            <div className="space-y-3">
              {faqs.map((f, i) => <ScrollReveal key={i} delay={i * 0.04}><FAQItem question={f.q} answer={f.a} isDark={isDark} /></ScrollReveal>)}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-32 lg:py-40 xl:py-48 relative overflow-hidden" style={{
          background: isDark ? 'linear-gradient(180deg, #171717, #130020)' : 'linear-gradient(180deg, #130032, #1E0050, #2D006B)',
        }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-15" style={{ background: isDark ? 'radial-gradient(circle, #c4ff0e 0%, transparent 70%)' : 'radial-gradient(circle, #7B3FFF 0%, transparent 70%)', filter: 'blur(80px)' }} />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-10" style={{ background: isDark ? 'radial-gradient(circle, #c4ff0e 0%, transparent 70%)' : 'radial-gradient(circle, #A855F7 0%, transparent 70%)', filter: 'blur(60px)' }} />
          </div>
          <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold mb-5 text-white" style={{ letterSpacing: '-1px', lineHeight: '1.1' }}>Ready to Close Deals Faster?</h2>
            <p className="text-base lg:text-lg mb-8 text-white/55 leading-relaxed">Join 50,000+ businesses. Start signing for free in 60 seconds.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
              <Link href="/sign-document" className="group w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold rounded-xl transition-all gap-2" style={{ background: isDark ? '#c4ff0e' : '#fff', color: isDark ? '#000' : '#130032' }}>
                Start Signing Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#fff', background: 'rgba(255,255,255,0.04)' }}>View Pricing</Link>
            </div>
            <p className="text-xs text-white/25">No credit card required</p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {['SJ','MC','ER','DP','LT'].map((init, i) => (
                  <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white/10" style={{ background: isDark ? '#c4ff0e' : '#4C00FF', color: isDark ? '#000' : '#fff' }}>{init}</div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-current" />)}</div>
                <p className="text-[10px] text-white/35">50,000+ happy users</p>
              </div>
            </div>
          </div>
        </section>

        <FloatingMobileCTA />
      </div>
    </>
  )
}

export default HomePage
