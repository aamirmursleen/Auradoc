'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight, FileSignature, CreditCard, FileText, ShieldCheck,
  PenTool, BarChart3, Users, Globe, Sparkles, Code, Check, Download,
  Send, Eye, Star, Lock, Zap, Award
} from 'lucide-react'

// ─── HEADER (Dev-Boost Style) ───
const DevBoostHeader = () => {
  return (
    <section className="container px-4 py-24 mx-auto text-center relative">
      {/* Floating Blur Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-3xl animate-pulse" />

      <h1 className="relative text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-100/80">
        Enterprise E-Signature Platform
      </h1>

      <p className="max-w-[700px] mx-auto mt-4 text-gray-400 text-lg">
        Everything DocuSign charges $10,000/year for. Yours for $27 once.
        <br />
        Built with enterprise security and unlimited everything.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <Link
          href="/pricing"
          className="inline-flex items-center px-8 py-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all duration-300 hover:scale-105"
        >
          Get Enterprise — $27
          <ArrowUpRight className="ml-2 h-5 w-5" />
        </Link>

        <p className="text-gray-500 text-sm">
          No credit card • Lifetime access • 30-day guarantee
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-12 mt-12 text-gray-400">
        <div>
          <p className="text-3xl font-black text-violet-400">4,891+</p>
          <p className="text-sm">Teams switched</p>
        </div>
        <div>
          <p className="text-3xl font-black text-violet-400">$9,973</p>
          <p className="text-sm">Avg. saved/year</p>
        </div>
        <div>
          <p className="text-3xl font-black text-violet-400">4.9/5</p>
          <p className="text-sm">Customer rating</p>
        </div>
      </div>
    </section>
  )
}

// ─── FEATURE GRID (Same structure as ProjectGrid) ───
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const getYOffset = (index: number) => {
  if (index % 3 === 1) return 48
  if (index % 3 === 2) return 96
  return 0
}

const getFeatureVariants = (index: number) => ({
  hidden: {
    opacity: 0,
    y: getYOffset(index),
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: getYOffset(index),
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    y: getYOffset(index) - 20,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
})

const FeatureGrid = () => {
  const [activeTab, setActiveTab] = useState('all')

  const colors = [
    "bg-slate-800",
    "bg-indigo-900",
    "bg-purple-900",
    "bg-slate-900",
    "bg-blue-900",
    "bg-violet-900",
  ]

  const features = [
    {
      name: "E-Signatures",
      description: "Unlimited legally-binding signatures. Draw, type, or upload. Works on any device. ESIGN & eIDAS compliant.",
      icon: FileSignature,
      category: "core",
      demo: "Interactive canvas",
    },
    {
      name: "Resume Builder",
      description: "Professional ATS-friendly templates. Real-time preview. Custom colors and fonts. Download perfect PDFs.",
      icon: FileText,
      category: "tools",
      demo: "Live editor",
    },
    {
      name: "Invoice Generator",
      description: "Create branded invoices in minutes. Auto-calculate taxes. Track payments. Get paid faster.",
      icon: CreditCard,
      category: "tools",
      demo: "Calculator",
    },
    {
      name: "Document Verification",
      description: "SHA-256 cryptographic hashing. Detect tampering. Blockchain-ready. Military-grade security.",
      icon: ShieldCheck,
      category: "core",
      demo: "Hash checker",
    },
    {
      name: "Template Library",
      description: "100+ professional templates. NDAs, contracts, agreements. Drag-drop fields. Save time.",
      icon: PenTool,
      category: "tools",
      demo: "Template picker",
    },
    {
      name: "Analytics Dashboard",
      description: "Track opens, views, signs. Conversion rates. Team performance. Export reports.",
      icon: BarChart3,
      category: "core",
      demo: "Live dashboard",
    },
    {
      name: "Team Collaboration",
      description: "Unlimited seats. Role-based permissions. Shared templates. Team inbox. Activity logs.",
      icon: Users,
      category: "enterprise",
      demo: "Team view",
    },
    {
      name: "Custom Domain",
      description: "sign.yourcompany.com — Your brand, not ours. SSL included. Zero MamaSign branding.",
      icon: Globe,
      category: "enterprise",
      demo: "Domain setup",
    },
    {
      name: "White-Label",
      description: "Upload logo. Set colors. Custom emails. Match brand guidelines. Look enterprise.",
      icon: Sparkles,
      category: "enterprise",
      demo: "Branding tool",
    },
    {
      name: "Full API Access",
      description: "REST API. Webhooks. Build custom workflows. Integrate anything. Developer-friendly docs.",
      icon: Code,
      category: "enterprise",
      demo: "API explorer",
    },
    {
      name: "Security & Compliance",
      description: "SOC 2 Type II. GDPR. HIPAA-ready. AES-256 encryption. 99.9% uptime SLA.",
      icon: Lock,
      category: "core",
      demo: "Audit log",
    },
    {
      name: "Priority Support",
      description: "24/7 chat. Email support. Video calls. Dedicated success manager. 2-hour response time.",
      icon: Award,
      category: "enterprise",
      demo: "Help center",
    },
  ]

  const filteredFeatures = features.filter(feature => {
    if (activeTab === 'all') return true
    return feature.category === activeTab
  })

  return (
    <section className="container px-4 pb-24 mx-auto">
      {/* Tabs */}
      <div className="w-full mb-8">
        <div className="w-full max-w-[500px] mx-auto grid grid-cols-4 gap-2 bg-slate-800/50 backdrop-blur-sm p-2 rounded-xl">
          {['all', 'core', 'tools', 'enterprise'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 rounded-lg font-semibold text-sm capitalize transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Grid with Stagger Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredFeatures.map((feature, index) => {
            const bgColor = colors[index % colors.length]

            return (
              <motion.div
                key={feature.name}
                custom={index}
                variants={getFeatureVariants(index)}
                className={`group relative rounded-3xl p-8 ${bgColor} text-gray-100 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/20 backdrop-blur-sm border border-gray-800 transition-all duration-300`}
              >
                {/* Number Badge */}
                <div className="flex items-start justify-between mb-6">
                  <motion.span
                    className="text-sm text-gray-400 font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </motion.span>

                  <div className="size-12 rounded-full border border-gray-700 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:border-violet-500 group-hover:text-violet-400">
                    <feature.icon className="size-5" />
                  </div>
                </div>

                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-semibold">{feature.name}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <span className="text-sm text-violet-400 font-medium">
                      {feature.demo}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {feature.category}
                    </span>
                  </div>
                </motion.div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                  background: 'radial-gradient(circle at center, rgba(139,92,246,0.1), transparent 70%)',
                }} />
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

// ─── FOOTER ───
const DevBoostFooter = () => (
  <footer className="container px-4 py-12 mx-auto text-center text-gray-400 border-t border-gray-800">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <p className="text-sm">
        © 2026 MamaSign. Pay once, own forever.
      </p>
      <div className="flex gap-6 text-sm">
        <Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy</Link>
        <Link href="/terms" className="hover:text-violet-400 transition-colors">Terms</Link>
        <Link href="/security" className="hover:text-violet-400 transition-colors">Security</Link>
      </div>
    </div>
  </footer>
)

// ─── MAIN PAGE ───
export default function DevBoostStylePage() {
  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col relative overflow-hidden">
      {/* Background Layers - Exact dev-boost style */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-indigo-950 to-indigo-950 z-0" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px] z-10"
      />

      {/* Radial Gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-violet-500/10 via-transparent to-transparent z-20" />

      <div className="relative z-30 flex-grow">
        <main className="flex-grow">
          <DevBoostHeader />
          <FeatureGrid />
        </main>
        <DevBoostFooter />
      </div>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
