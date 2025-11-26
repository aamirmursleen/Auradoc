'use client'

import React from 'react'
import {
  FileText,
  Lock,
  Receipt,
  UserPlus,
  FileCheck,
  Home,
  Scale,
  Users,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { DocumentTemplate, categoryLabels } from '@/data/templates'

interface TemplateCardProps {
  template: DocumentTemplate
  onSelect: (template: DocumentTemplate) => void
}

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Lock,
  Receipt,
  UserPlus,
  FileCheck,
  Home,
  Scale,
  Users
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'contracts': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  'agreements': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  'invoices': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  'hr': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  'real-estate': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  'legal': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' }
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  const IconComponent = iconMap[template.icon] || FileText
  const colors = categoryColors[template.category] || categoryColors.contracts

  return (
    <div
      onClick={() => onSelect(template)}
      className="group relative bg-white rounded-2xl border border-gray-100 hover:border-primary-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1"
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        {template.popular && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            <Star className="w-3 h-3 fill-current" />
            Popular
          </span>
        )}
        {template.new && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <Sparkles className="w-3 h-3" />
            New
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Icon */}
        <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className={`w-7 h-7 ${colors.text}`} />
        </div>

        {/* Category Badge */}
        <span className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded-full mb-3`}>
          {categoryLabels[template.category]}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {template.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {template.description}
        </p>

        {/* Fields count */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {template.fields.length} fields to fill
          </span>
          <span className="inline-flex items-center text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
            Use Template
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  )
}

export default TemplateCard
