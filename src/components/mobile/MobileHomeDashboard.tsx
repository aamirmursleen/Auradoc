'use client'

import React from 'react'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'
import {
  FileSignature,
  FileText,
  Clock,
  Plus,
  ChevronRight,
  Layers,
  Scissors,
  FileType,
  Receipt,
  LayoutTemplate,
  CheckCircle,
  Upload,
} from 'lucide-react'
import { SignedIn, SignedOut } from '@clerk/nextjs'

const MobileHomeDashboard: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Quick actions for immediate access
  const quickActions = [
    { name: 'Sign Document', icon: FileSignature, href: '/sign-document', primary: true },
    { name: 'Upload PDF', icon: Upload, href: '/sign-document' },
    { name: 'Templates', icon: LayoutTemplate, href: '/templates' },
    { name: 'Invoice', icon: Receipt, href: '/create-invoice' },
  ]

  // Popular tools
  const popularTools = [
    { name: 'PDF Merge', icon: Layers, href: '/tools/pdf-merge' },
    { name: 'PDF Split', icon: Scissors, href: '/tools/pdf-split' },
    { name: 'PDF to Word', icon: FileType, href: '/tools/pdf-to-word' },
  ]

  return (
    <div className="px-4 py-4 space-y-6">
      {/* Quick Actions Grid */}
      <div>
        <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-foreground' : 'text-[#26065D]'}`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`flex flex-col items-center p-3 rounded-xl transition-all active:scale-95
                ${isDark ? 'bg-secondary hover:bg-secondary/80' : 'bg-white hover:bg-gray-50'} shadow-sm`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2
                  ${action.primary
                    ? isDark ? 'bg-primary' : 'bg-[#4C00FF]'
                    : isDark ? 'bg-muted' : 'bg-gray-100'
                  }`}
              >
                <action.icon
                  className={`w-6 h-6 ${action.primary
                    ? isDark ? 'text-primary-foreground' : 'text-white'
                    : isDark ? 'text-primary' : 'text-[#4C00FF]'
                  }`}
                />
              </div>
              <span className={`text-xs font-medium text-center ${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>
                {action.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Documents - Signed In Only */}
      <SignedIn>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-foreground' : 'text-[#26065D]'}`}>
              Recent Documents
            </h2>
            <Link
              href="/documents"
              className={`text-sm font-medium flex items-center gap-1 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Empty State */}
          <div
            className={`p-6 rounded-xl text-center border-2 border-dashed
              ${isDark ? 'border-border bg-secondary' : 'border-gray-200 bg-white'}`}
          >
            <FileText className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-muted-foreground' : 'text-gray-300'}`} />
            <p className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>
              No recent documents
            </p>
            <Link
              href="/sign-document"
              className={`inline-flex items-center gap-2 mt-3 text-sm font-medium ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}
            >
              <Plus className="w-4 h-4" /> Upload your first document
            </Link>
          </div>
        </div>
      </SignedIn>

      {/* Signed Out - Benefits */}
      <SignedOut>
        <div
          className={`p-4 rounded-xl ${isDark ? 'bg-secondary' : 'bg-white'} shadow-sm`}
        >
          <h3 className={`font-semibold mb-3 ${isDark ? 'text-foreground' : 'text-[#26065D]'}`}>
            Why MamaSign?
          </h3>
          <ul className="space-y-2">
            {[
              'Legally binding e-signatures',
              'No account required to sign',
              'Bank-level security (256-bit SSL)',
              '$27 lifetime deal (90% off)',
            ].map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-green-600' : 'text-green-600'}`} />
                <span className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </SignedOut>

      {/* Popular Tools */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-foreground' : 'text-[#26065D]'}`}>
            Free PDF Tools
          </h2>
          <Link
            href="/tools"
            className={`text-sm font-medium flex items-center gap-1 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}
          >
            All Tools <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {popularTools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-95
                ${isDark ? 'bg-secondary' : 'bg-white'} shadow-sm`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-primary' : 'bg-[#4C00FF]'}`}>
                <tool.icon className={`w-5 h-5 ${isDark ? 'text-primary-foreground' : 'text-white'}`} />
              </div>
              <span className={`text-sm font-medium whitespace-nowrap ${isDark ? 'text-foreground' : 'text-[#26065D]'}`}>
                {tool.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Pending Signatures - Signed In */}
      <SignedIn>
        <div
          className={`p-4 rounded-xl flex items-center gap-4
            ${isDark ? 'bg-amber-900/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
            <Clock className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
          </div>
          <div className="flex-1">
            <p className={`font-medium ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
              Waiting for Signatures
            </p>
            <p className={`text-sm ${isDark ? 'text-amber-400/70' : 'text-amber-600'}`}>
              0 documents pending
            </p>
          </div>
          <ChevronRight className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
        </div>
      </SignedIn>
    </div>
  )
}

export default MobileHomeDashboard
