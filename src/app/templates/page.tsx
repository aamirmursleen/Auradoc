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

// Category configuration with colors - Like template.net
const categories: Array<{
  key: TemplateCategory | 'all' | 'popular'
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
}> = [
  { key: 'all', label: 'All Templates', icon: Grid3X3, color: 'text-gray-700', bgColor: 'bg-gray-100 hover:bg-gray-200' },
  { key: 'popular', label: 'Popular', icon: Star, color: 'text-amber-600', bgColor: 'bg-amber-50 hover:bg-amber-100' },
  { key: 'resume', label: 'Resume', icon: FileText, color: 'text-cyan-600', bgColor: 'bg-cyan-50 hover:bg-cyan-100' },
  { key: 'letters', label: 'Cover Letter', icon: FileText, color: 'text-indigo-600', bgColor: 'bg-indigo-50 hover:bg-indigo-100' },
  { key: 'contracts', label: 'Contract', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50 hover:bg-blue-100' },
  { key: 'business', label: 'Business', icon: FileText, color: 'text-emerald-600', bgColor: 'bg-emerald-50 hover:bg-emerald-100' },
  { key: 'agreements', label: 'Agreement', icon: FileCheck, color: 'text-purple-600', bgColor: 'bg-purple-50 hover:bg-purple-100' },
  { key: 'invoices', label: 'Invoice', icon: Receipt, color: 'text-green-600', bgColor: 'bg-green-50 hover:bg-green-100' },
  { key: 'hr', label: 'HR & Jobs', icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-50 hover:bg-orange-100' },
  { key: 'planning', label: 'Planning', icon: FileText, color: 'text-violet-600', bgColor: 'bg-violet-50 hover:bg-violet-100' },
  { key: 'real-estate', label: 'Real Estate', icon: Home, color: 'text-amber-600', bgColor: 'bg-amber-50 hover:bg-amber-100' },
  { key: 'legal', label: 'Legal', icon: Scale, color: 'text-slate-600', bgColor: 'bg-slate-50 hover:bg-slate-100' },
]

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

// Category colors for cards
const categoryColors: Record<string, { bg: string; border: string; gradient: string }> = {
  'contracts': { bg: 'bg-blue-500', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' },
  'agreements': { bg: 'bg-purple-500', border: 'border-purple-200', gradient: 'from-purple-500 to-purple-600' },
  'invoices': { bg: 'bg-green-500', border: 'border-green-200', gradient: 'from-green-500 to-green-600' },
  'hr': { bg: 'bg-orange-500', border: 'border-orange-200', gradient: 'from-orange-500 to-orange-600' },
  'real-estate': { bg: 'bg-amber-500', border: 'border-amber-200', gradient: 'from-amber-500 to-amber-600' },
  'legal': { bg: 'bg-slate-500', border: 'border-slate-200', gradient: 'from-slate-500 to-slate-600' }
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Compact */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Document Templates
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
              Professional templates ready to customize, sign, and send
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates... (contract, invoice, NDA, offer letter)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-lg focus:ring-4 focus:ring-white/30 outline-none text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Tags - Scrollable like template.net */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative flex items-center py-3">
            {/* Left scroll button */}
            {canScrollLeft && (
              <button
                onClick={() => scrollCategories('left')}
                className="absolute left-0 z-10 w-10 h-10 bg-gradient-to-r from-white via-white to-transparent flex items-center justify-start"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
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
                        ? 'bg-primary-500 text-white shadow-md scale-105'
                        : `${cat.bgColor} ${cat.color}`
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                    {cat.key === 'popular' && !isActive && (
                      <span className="px-1.5 py-0.5 bg-amber-400 text-amber-900 text-xs rounded-full">
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
                className="absolute right-0 z-10 w-10 h-10 bg-gradient-to-l from-white via-white to-transparent flex items-center justify-end"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
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
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredTemplates.length}</span> templates
              {searchQuery && (
                <span> for "<span className="font-medium text-primary-600">{searchQuery}</span>"</span>
              )}
              {selectedCategory !== 'all' && selectedCategory !== 'popular' && (
                <span> in <span className="font-medium">{categoryLabels[selectedCategory as TemplateCategory]}</span></span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
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
                  className="group relative bg-white rounded-2xl border border-gray-100 hover:border-primary-300 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Document Preview Thumbnail */}
                  <div className="relative h-52 bg-gray-50 border-b border-gray-100 overflow-hidden">
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
                    <div className="absolute inset-2 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                      <div
                        className="w-[400%] h-[400%] origin-top-left transform scale-[0.25] pointer-events-none"
                        dangerouslySetInnerHTML={{ __html: generateMiniPreview(template) }}
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-900 shadow-lg flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary-500" />
                        Preview Template
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r ${colors.gradient} text-white text-xs font-medium rounded-full`}>
                        <IconComponent className="w-3 h-3" />
                        {categoryLabels[template.category]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {template.fields.length} fields
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1 line-clamp-1">
                      {template.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {template.description}
                    </p>

                    {/* Use Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUseTemplate(template)
                      }}
                      className="w-full py-2 bg-gray-100 hover:bg-primary-500 text-gray-700 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
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
                  className="bg-white rounded-xl border border-gray-100 hover:border-primary-300 p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all group"
                >
                  {/* Mini Preview */}
                  <div className="w-20 h-28 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 relative">
                    <div
                      className="w-[500%] h-[500%] origin-top-left transform scale-[0.2] pointer-events-none"
                      dangerouslySetInnerHTML={{ __html: generateMiniPreview(template) }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r ${colors.gradient} text-white text-xs font-medium rounded-full`}>
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
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{template.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{template.fields.length} fields to fill</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseTemplate(template)
                    }}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
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
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Can't Find What You Need?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Upload your own document and add signatures directly.
            Our platform supports PDF, PNG, and JPG files.
          </p>
          <button
            onClick={() => router.push('/sign')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
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
