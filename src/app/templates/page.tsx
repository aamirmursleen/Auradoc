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

// Category configuration with colors - CalendarJet dark theme
const categories: Array<{
  key: TemplateCategory | 'all' | 'popular'
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
}> = [
  { key: 'all', label: 'All Templates', icon: Grid3X3, color: 'text-gray-300', bgColor: 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' },
  { key: 'popular', label: 'Popular', icon: Star, color: 'text-[#c4ff0e]', bgColor: 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' },
  { key: 'resume', label: 'Resume', icon: FileText, color: 'text-[#c4ff0e]', bgColor: 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' },
  { key: 'letters', label: 'Cover Letter', icon: FileText, color: 'text-[#c4ff0e]', bgColor: 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' },
  { key: 'contracts', label: 'Contract', icon: FileText, color: 'text-[#c4ff0e]', bgColor: 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' },
  { key: 'business', label: 'Business', icon: FileText, color: 'text-[#c4ff0e]', bgColor: 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' },
  { key: 'agreements', label: 'Agreement', icon: FileCheck, color: 'text-[#c4ff0e]', bgColor: 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' },
  { key: 'invoices', label: 'Invoice', icon: Receipt, color: 'text-[#c4ff0e]', bgColor: 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' },
  { key: 'hr', label: 'HR & Jobs', icon: Users, color: 'text-[#c4ff0e]', bgColor: 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' },
  { key: 'planning', label: 'Planning', icon: FileText, color: 'text-[#c4ff0e]', bgColor: 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' },
  { key: 'real-estate', label: 'Real Estate', icon: Home, color: 'text-[#c4ff0e]', bgColor: 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' },
  { key: 'legal', label: 'Legal', icon: Scale, color: 'text-[#c4ff0e]', bgColor: 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' },
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

// Category colors for cards - CalendarJet dark theme
const categoryColors: Record<string, { bg: string; border: string; gradient: string }> = {
  'contracts': { bg: 'bg-[#c4ff0e]', border: 'border-[#2a2a2a]', gradient: 'from-[#c4ff0e] to-[#c4ff0e]' },
  'agreements': { bg: 'bg-[#c4ff0e]', border: 'border-[#2a2a2a]', gradient: 'from-[#c4ff0e] to-[#c4ff0e]' },
  'invoices': { bg: 'bg-[#c4ff0e]', border: 'border-[#2a2a2a]', gradient: 'from-[#c4ff0e] to-[#c4ff0e]' },
  'hr': { bg: 'bg-[#c4ff0e]', border: 'border-[#2a2a2a]', gradient: 'from-[#c4ff0e] to-[#c4ff0e]' },
  'real-estate': { bg: 'bg-[#c4ff0e]', border: 'border-[#2a2a2a]', gradient: 'from-[#c4ff0e] to-[#c4ff0e]' },
  'legal': { bg: 'bg-[#c4ff0e]', border: 'border-[#2a2a2a]', gradient: 'from-[#c4ff0e] to-[#c4ff0e]' }
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
    <div className="min-h-screen bg-[#1e1e1e]">
      {/* Hero Section - Compact */}
      <section className="bg-[#1F1F1F] text-white pt-8 pb-6 px-4 border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Document Templates
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
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
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#2a2a2a] text-white placeholder-gray-400 shadow-lg focus:ring-4 focus:ring-[#c4ff0e]/30 outline-none text-sm border border-[#3a3a3a]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Tags - Scrollable like template.net */}
      <div className="sticky top-0 z-40 bg-[#1e1e1e] border-b border-[#2a2a2a] shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative flex items-center py-3">
            {/* Left scroll button */}
            {canScrollLeft && (
              <button
                onClick={() => scrollCategories('left')}
                className="absolute left-0 z-10 w-10 h-10 bg-gradient-to-r from-[#1e1e1e] via-[#1e1e1e] to-transparent flex items-center justify-start"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
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
                        ? 'bg-[#c4ff0e] text-black shadow-md scale-105'
                        : `${cat.bgColor} ${cat.color}`
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                    {cat.key === 'popular' && !isActive && (
                      <span className="px-1.5 py-0.5 bg-[#c4ff0e] text-black text-xs rounded-full">
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
                className="absolute right-0 z-10 w-10 h-10 bg-gradient-to-l from-[#1e1e1e] via-[#1e1e1e] to-transparent flex items-center justify-end"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
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
            <p className="text-gray-400">
              <span className="font-semibold text-white">{filteredTemplates.length}</span> templates
              {searchQuery && (
                <span> for "<span className="font-medium text-[#c4ff0e]">{searchQuery}</span>"</span>
              )}
              {selectedCategory !== 'all' && selectedCategory !== 'popular' && (
                <span> in <span className="font-medium">{categoryLabels[selectedCategory as TemplateCategory]}</span></span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-[#c4ff0e] text-black' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-[#c4ff0e] text-black' : 'text-gray-400 hover:text-gray-300'
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
                  className="group relative bg-[#252525] rounded-2xl border border-[#2a2a2a] hover:border-[#c4ff0e] shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Document Preview Thumbnail */}
                  <div className="relative h-52 bg-[#2a2a2a] border-b border-[#2a2a2a] overflow-hidden">
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
                    <div className="absolute inset-2 bg-white rounded-lg shadow-md overflow-hidden border border-[#3a3a3a]">
                      <div
                        className="w-[400%] h-[400%] origin-top-left transform scale-[0.25] pointer-events-none"
                        dangerouslySetInnerHTML={{ __html: generateMiniPreview(template) }}
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span className="px-4 py-2 bg-[#c4ff0e] rounded-full text-sm font-medium text-black shadow-lg flex items-center gap-2">
                        <Zap className="w-4 h-4 text-black" />
                        Preview Template
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r ${colors.gradient} text-black text-xs font-medium rounded-full`}>
                        <IconComponent className="w-3 h-3" />
                        {categoryLabels[template.category]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {template.fields.length} fields
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-white group-hover:text-[#c4ff0e] transition-colors mb-1 line-clamp-1">
                      {template.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                      {template.description}
                    </p>

                    {/* Use Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUseTemplate(template)
                      }}
                      className="w-full py-2 bg-[#2a2a2a] hover:bg-[#c4ff0e] text-gray-300 hover:text-black rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
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
                  className="bg-[#252525] rounded-xl border border-[#2a2a2a] hover:border-[#c4ff0e] p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all group"
                >
                  {/* Mini Preview */}
                  <div className="w-20 h-28 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] overflow-hidden flex-shrink-0 relative">
                    <div
                      className="w-[500%] h-[500%] origin-top-left transform scale-[0.2] pointer-events-none"
                      dangerouslySetInnerHTML={{ __html: generateMiniPreview(template) }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r ${colors.gradient} text-black text-xs font-medium rounded-full`}>
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
                    <h3 className="font-semibold text-white group-hover:text-[#c4ff0e] transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-1">{template.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{template.fields.length} fields to fill</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseTemplate(template)
                    }}
                    className="px-4 py-2 bg-[#c4ff0e] text-black rounded-lg text-sm font-medium hover:bg-[#c4ff0e]/90 transition-colors flex items-center gap-2"
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
            <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="px-6 py-3 bg-[#c4ff0e] text-black rounded-xl font-medium hover:bg-[#c4ff0e]/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-[#252525] rounded-2xl p-8 md:p-12 text-center border border-[#2a2a2a]">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Can't Find What You Need?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Upload your own document and add signatures directly.
            Our platform supports PDF, PNG, and JPG files.
          </p>
          <button
            onClick={() => router.push('/sign')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#c4ff0e] text-black rounded-xl font-semibold hover:bg-[#c4ff0e]/90 transition-colors"
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
