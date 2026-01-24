'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  FileText,
  Receipt,
  Users,
  Home,
  Scale,
  Star,
  Sparkles,
  ArrowRight,
  Grid3X3,
  List,
  FileCheck,
  Lock,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Zap,
  X
} from 'lucide-react'
import {
  templates,
  DocumentTemplate,
  TemplateCategory,
  categoryLabels,
  searchTemplates
} from '@/data/templates'
import TemplateEditor from '@/components/templates/TemplateEditor'
import { useTheme } from '@/components/ThemeProvider'

// Icon map for templates
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

// Sample data for mini previews
const sampleData: Record<string, string> = {
  clientName: 'John Smith',
  freelancerName: 'Sarah Johnson',
  projectTitle: 'Website Redesign',
  companyName: 'Acme Corp',
  invoiceNumber: 'INV-001',
  candidateName: 'Alex Thompson',
  jobTitle: 'Software Engineer',
  tenantName: 'Lisa Anderson',
  landlordName: 'Robert Williams',
  disclosingParty: 'Innovate Labs',
  receivingParty: 'Partner Solutions',
  principalName: 'Margaret Wilson',
  agentName: 'James Wilson',
  partner1Name: 'Michael Chen',
  partner2Name: 'Emily Davis',
  businessName: 'Chen & Davis',
  employerName: 'TechStart Inc',
  employeeName: 'Alex Thompson',
  currentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
}

const TemplatesPage: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Category configuration with colors - theme-aware
  const categories: Array<{
    key: TemplateCategory | 'all' | 'popular'
    label: string
    icon: React.ElementType
    color: string
    bgColor: string
  }> = [
    { key: 'all', label: 'All Templates', icon: Grid3X3, color: isDark ? 'text-gray-300' : 'text-gray-600', bgColor: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-[#EDE5FF] hover:bg-[#E0D4FF]' },
    { key: 'popular', label: 'Popular', icon: Star, color: isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]', bgColor: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-[#EDE5FF] hover:bg-[#E0D4FF]' },
    { key: 'resume', label: 'Resume', icon: FileText, color: isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]', bgColor: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-[#EDE5FF] hover:bg-[#E0D4FF]' },
    { key: 'letters', label: 'Cover Letter', icon: FileText, color: isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]', bgColor: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-[#EDE5FF] hover:bg-[#E0D4FF]' },
    { key: 'contracts', label: 'Contract', icon: FileText, color: isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]', bgColor: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-[#EDE5FF] hover:bg-[#E0D4FF]' },
    { key: 'business', label: 'Business', icon: FileText, color: isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]', bgColor: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-[#EDE5FF] hover:bg-[#E0D4FF]' },
    { key: 'agreements', label: 'Agreement', icon: FileCheck, color: isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]', bgColor: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-[#EDE5FF] hover:bg-[#E0D4FF]' },
    { key: 'invoices', label: 'Invoice', icon: Receipt, color: isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]', bgColor: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-[#EDE5FF] hover:bg-[#E0D4FF]' },
    { key: 'hr', label: 'HR & Jobs', icon: Users, color: isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]', bgColor: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-[#EDE5FF] hover:bg-[#E0D4FF]' },
    { key: 'planning', label: 'Planning', icon: FileText, color: isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]', bgColor: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-[#EDE5FF] hover:bg-[#E0D4FF]' },
    { key: 'real-estate', label: 'Real Estate', icon: Home, color: isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]', bgColor: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-[#EDE5FF] hover:bg-[#E0D4FF]' },
    { key: 'legal', label: 'Legal', icon: Scale, color: isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]', bgColor: isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-[#EDE5FF] hover:bg-[#E0D4FF]' },
  ]

  // Category colors for cards - theme-aware
  const categoryColors: Record<string, { bg: string; border: string; gradient: string }> = {
    'contracts': { bg: isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]', border: isDark ? 'border-[#2a2a2a]' : 'border-gray-200', gradient: isDark ? 'from-[#c4ff0e] to-[#c4ff0e]' : 'from-[#4C00FF] to-[#4C00FF]' },
    'agreements': { bg: isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]', border: isDark ? 'border-[#2a2a2a]' : 'border-gray-200', gradient: isDark ? 'from-[#c4ff0e] to-[#c4ff0e]' : 'from-[#4C00FF] to-[#4C00FF]' },
    'invoices': { bg: isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]', border: isDark ? 'border-[#2a2a2a]' : 'border-gray-200', gradient: isDark ? 'from-[#c4ff0e] to-[#c4ff0e]' : 'from-[#4C00FF] to-[#4C00FF]' },
    'hr': { bg: isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]', border: isDark ? 'border-[#2a2a2a]' : 'border-gray-200', gradient: isDark ? 'from-[#c4ff0e] to-[#c4ff0e]' : 'from-[#4C00FF] to-[#4C00FF]' },
    'real-estate': { bg: isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]', border: isDark ? 'border-[#2a2a2a]' : 'border-gray-200', gradient: isDark ? 'from-[#c4ff0e] to-[#c4ff0e]' : 'from-[#4C00FF] to-[#4C00FF]' },
    'legal': { bg: isDark ? 'bg-[#c4ff0e]' : 'bg-[#4C00FF]', border: isDark ? 'border-[#2a2a2a]' : 'border-gray-200', gradient: isDark ? 'from-[#c4ff0e] to-[#c4ff0e]' : 'from-[#4C00FF] to-[#4C00FF]' }
  }

  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all' | 'popular'>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const categoryScrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Check scroll position
  const checkScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
      setTimeout(checkScroll, 300)
    }
  }

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let result = templates

    // Apply search
    if (searchQuery.trim()) {
      result = searchTemplates(searchQuery)
    }

    // Apply category filter
    if (selectedCategory === 'popular') {
      result = result.filter(t => t.popular)
    } else if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory)
    }

    return result
  }, [searchQuery, selectedCategory])

  // Handle template selection - navigate to template detail page
  const handleTemplateSelect = (template: DocumentTemplate) => {
    router.push(`/templates/${template.category}/${template.id}`)
  }

  // Handle use template (open editor)
  const handleUseTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
    setShowPreview(false)
    setShowEditor(true)
  }

  // Handle template completion (redirect to sign page)
  const handleTemplateComplete = (documentHtml: string, template: DocumentTemplate) => {
    const documentData = {
      html: documentHtml,
      templateName: template.name,
      templateId: template.id,
      generatedAt: new Date().toISOString()
    }
    sessionStorage.setItem('templateDocument', JSON.stringify(documentData))
    router.push('/sign?source=template')
  }

  // Generate mini preview HTML
  const generateMiniPreview = (template: DocumentTemplate) => {
    let html = template.content
    template.fields.forEach(field => {
      const value = sampleData[field.name] || `[${field.label}]`
      const regex = new RegExp(`\\{\\{${field.name}\\}\\}`, 'g')
      html = html.replace(regex, value)
    })
    html = html.replace(/\{\{currentDate\}\}/g, sampleData.currentDate)
    return html
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      {/* Hero Section - Compact */}
      <section className={`${isDark ? 'bg-[#1F1F1F] text-white border-[#2a2a2a]' : 'bg-gray-50 text-[#26065D] border-gray-200'} pt-8 pb-6 px-4 border-b`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#26065D]'}`}>
              Document Templates
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm md:text-base max-w-xl mx-auto`}>
              Professional templates ready to customize, sign, and send
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search templates... (contract, invoice, NDA, offer letter)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl ${isDark ? 'bg-[#2a2a2a] text-white placeholder-gray-400 border-[#3a3a3a] focus:ring-[#c4ff0e]/30' : 'bg-white text-[#26065D] placeholder-gray-500 border-gray-200 focus:ring-[#4C00FF]/30'} shadow-lg focus:ring-4 outline-none text-sm border`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Tags - Scrollable like template.net */}
      <div className={`sticky top-0 z-40 ${isDark ? 'bg-[#1e1e1e] border-[#2a2a2a]' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative flex items-center py-3">
            {/* Left scroll button */}
            {canScrollLeft && (
              <button
                onClick={() => scrollCategories('left')}
                className={`absolute left-0 z-10 w-10 h-10 ${isDark ? 'bg-gradient-to-r from-[#1e1e1e] via-[#1e1e1e] to-transparent' : 'bg-gradient-to-r from-white via-white to-transparent'} flex items-center justify-start`}
              >
                <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            )}

            {/* Scrollable categories */}
            <div
              ref={categoryScrollRef}
              onScroll={checkScroll}
              className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map(cat => {
                const Icon = cat.icon
                const isActive = selectedCategory === cat.key
                const isLinkable = cat.key !== 'all' && cat.key !== 'popular'

                // For category buttons (not all/popular), navigate to category page
                if (isLinkable) {
                  return (
                    <button
                      key={cat.key}
                      onClick={() => router.push(`/templates/${cat.key}`)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:scale-105
                        ${cat.bgColor} ${cat.color}
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.label}
                      <ArrowRight className="w-3 h-3 opacity-50" />
                    </button>
                  )
                }

                // For all/popular, keep the filter behavior
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                      ${isActive
                        ? isDark ? 'bg-[#c4ff0e] text-black shadow-md scale-105' : 'bg-[#4C00FF] text-white shadow-md scale-105'
                        : `${cat.bgColor} ${cat.color}`
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                    {cat.key === 'popular' && !isActive && (
                      <span className={`px-1.5 py-0.5 ${isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white'} text-xs rounded-full`}>
                        Hot
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Right scroll button */}
            {canScrollRight && (
              <button
                onClick={() => scrollCategories('right')}
                className={`absolute right-0 z-10 w-10 h-10 ${isDark ? 'bg-gradient-to-l from-[#1e1e1e] via-[#1e1e1e] to-transparent' : 'bg-gradient-to-l from-white via-white to-transparent'} flex items-center justify-end`}
              >
                <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#26065D]'}`}>{filteredTemplates.length}</span> templates
              {searchQuery && (
                <span> for "<span className={`font-medium ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`}>{searchQuery}</span>"</span>
              )}
              {selectedCategory !== 'all' && selectedCategory !== 'popular' && (
                <span> in <span className="font-medium">{categoryLabels[selectedCategory as TemplateCategory]}</span></span>
              )}
            </p>
          </div>
          <div className={`flex items-center gap-2 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-[#EDE5FF] border-gray-200'} rounded-lg border p-1`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white' : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white' : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Templates Grid - With Document Preview like template.net */}
        {filteredTemplates.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredTemplates.map(template => {
              const IconComponent = iconMap[template.icon] || FileText
              const colors = categoryColors[template.category] || categoryColors.contracts

              return viewMode === 'grid' ? (
                // Grid Card with Document Preview
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`group relative ${isDark ? 'bg-[#252525] border-[#2a2a2a] hover:border-[#c4ff0e]' : 'bg-white border border-gray-200 hover:border-[#4C00FF]'} rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden`}
                >
                  {/* Document Preview Thumbnail */}
                  <div className={`relative h-52 ${isDark ? 'bg-[#2a2a2a] border-[#2a2a2a]' : 'bg-[#EDE5FF] border-gray-200'} border-b overflow-hidden`}>
                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-10 flex gap-1.5">
                      {template.popular && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full shadow-sm">
                          <Star className="w-3 h-3 fill-current" />
                          Popular
                        </span>
                      )}
                      {template.new && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full shadow-sm">
                          <Sparkles className="w-3 h-3" />
                          New
                        </span>
                      )}
                    </div>

                    {/* Mini Document Preview */}
                    <div className={`absolute inset-2 bg-white rounded-lg shadow-md overflow-hidden ${isDark ? 'border-[#3a3a3a]' : 'border-gray-200'} border`}>
                      <div
                        className="w-[400%] h-[400%] origin-top-left transform scale-[0.25] pointer-events-none"
                        dangerouslySetInnerHTML={{ __html: generateMiniPreview(template) }}
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span className={`px-4 py-2 ${isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white'} rounded-full text-sm font-medium shadow-lg flex items-center gap-2`}>
                        <Zap className={`w-4 h-4 ${isDark ? 'text-black' : 'text-white'}`} />
                        Preview Template
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r ${colors.gradient} ${isDark ? 'text-black' : 'text-white'} text-xs font-medium rounded-full`}>
                        <IconComponent className="w-3 h-3" />
                        {categoryLabels[template.category]}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {template.fields.length} fields
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`font-semibold ${isDark ? 'text-white group-hover:text-[#c4ff0e]' : 'text-[#26065D] group-hover:text-[#4C00FF]'} transition-colors mb-1 line-clamp-1`}>
                      {template.name}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} line-clamp-2 mb-3`}>
                      {template.description}
                    </p>

                    {/* Use Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUseTemplate(template)
                      }}
                      className={`w-full py-2 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#c4ff0e] text-gray-300 hover:text-black' : 'bg-[#EDE5FF] hover:bg-[#4C00FF] text-gray-600 hover:text-white'} rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2`}
                    >
                      Use Template
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`${isDark ? 'bg-[#252525] border-[#2a2a2a] hover:border-[#c4ff0e]' : 'bg-white border border-gray-200 hover:border-[#4C00FF]'} rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all group`}
                >
                  {/* Mini Preview */}
                  <div className={`w-20 h-28 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-[#EDE5FF] border-gray-200'} rounded-lg border overflow-hidden flex-shrink-0 relative`}>
                    <div
                      className="w-[500%] h-[500%] origin-top-left transform scale-[0.2] pointer-events-none"
                      dangerouslySetInnerHTML={{ __html: generateMiniPreview(template) }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r ${colors.gradient} ${isDark ? 'text-black' : 'text-white'} text-xs font-medium rounded-full`}>
                        {categoryLabels[template.category]}
                      </span>
                      {template.popular && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                          <Star className="w-3 h-3 fill-current" />
                        </span>
                      )}
                      {template.new && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          <Sparkles className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <h3 className={`font-semibold ${isDark ? 'text-white group-hover:text-[#c4ff0e]' : 'text-[#26065D] group-hover:text-[#4C00FF]'} transition-colors`}>
                      {template.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>{template.description}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{template.fields.length} fields to fill</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseTemplate(template)
                    }}
                    className={`px-4 py-2 ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#c4ff0e]/90' : 'bg-[#4C00FF] text-white hover:bg-[#4C00FF]/90'} rounded-lg text-sm font-medium transition-colors flex items-center gap-2`}
                  >
                    Use
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          // No results
          <div className="text-center py-16">
            <div className={`w-20 h-20 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Search className={`w-10 h-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-2`}>No templates found</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className={`px-6 py-3 ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#c4ff0e]/90' : 'bg-[#4C00FF] text-white hover:bg-[#4C00FF]/90'} rounded-xl font-medium transition-colors`}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className={`mt-16 ${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-white border border-gray-200'} rounded-2xl p-8 md:p-12 text-center`}>
          <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-4`}>
            Can't Find What You Need?
          </h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6 max-w-xl mx-auto`}>
            Upload your own document and add signatures directly.
            Our platform supports PDF, PNG, and JPG files.
          </p>
          <button
            onClick={() => router.push('/sign')}
            className={`inline-flex items-center gap-2 px-8 py-4 ${isDark ? 'bg-[#c4ff0e] text-black hover:bg-[#c4ff0e]/90' : 'bg-[#4C00FF] text-white hover:bg-[#4C00FF]/90'} rounded-xl font-semibold transition-colors`}
          >
            Upload Your Document
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>


      {/* Template Editor Modal */}
      {showEditor && selectedTemplate && (
        <TemplateEditor
          template={selectedTemplate}
          onClose={() => {
            setShowEditor(false)
            setSelectedTemplate(null)
          }}
          onComplete={handleTemplateComplete}
        />
      )}

      {/* Custom styles for scrollbar hide */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default TemplatesPage
