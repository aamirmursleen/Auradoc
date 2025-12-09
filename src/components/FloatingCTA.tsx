'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

const FloatingCTA: React.FC = () => {
  return (
    <div className="floating-cta">
      <Link href="/pricing" className="group floating-cta-button">
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase tracking-wide opacity-80 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Lifetime Deal
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-sm line-through opacity-60">$120</span>
            <span className="text-2xl font-bold">$27</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </div>
      </Link>
    </div>
  )
}

export default FloatingCTA
