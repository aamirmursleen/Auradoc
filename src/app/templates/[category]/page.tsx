'use client'

import React, { useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Search,
  Grid3X3,
  List,
  Star,
  Sparkles,
  ArrowRight,
  Eye,
  X
} from 'lucide-react'
import {
  templates,
  DocumentTemplate,
  TemplateCategory,
  categoryLabels,
  searchTemplates,
  getTemplatesByCategory
} from '@/data/templates'
import TemplateEditor from '@/components/templates/TemplateEditor'
import { useTheme } from '@/components/ThemeProvider'

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
  fullName: 'Sarah Johnson',
  email: 'sarah@example.com',
  phone: '(555) 123-4567',
  location: 'New York, NY',
  summary: 'Experienced professional with expertise...',
  currentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
}

export default function CategoryPage() {
  const router = useRouter()
  const params = useParams()
  const category = params.category as string
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Get category info
  const categoryName = categoryLabels[category as TemplateCategory] || category

  // Filter templates by category
  const categoryTemplates = useMemo(() => {
    let result = getTemplatesByCategory(category as TemplateCategory)

    if (searchQuery.trim()) {
      result = result.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return result
  }, [category, searchQuery])

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

  // Handle template selection - navigate to template detail page
  const handleTemplateSelect = (template: DocumentTemplate) => {
    router.push(`/templates/${category}/${template.id}`)
  }

  // Handle use template (open editor)
  const handleUseTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
    setShowPreview(false)
    setShowEditor(true)
  }

  // Handle template completion
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

  // Generate full preview HTML for popup
  const generateFullPreview = (template: DocumentTemplate) => {
    let html = template.content
    template.fields.forEach(field => {
      const value = sampleData[field.name] || `[${field.label}]`
      const regex = new RegExp(`\\{\\{${field.name}\\}\\}`, 'g')
      html = html.replace(regex, value)
    })
    html = html.replace(/\{\{currentDate\}\}/g, sampleData.currentDate)

    // Handle invoice total
    if (template.category === 'invoices') {
      const item1 = parseFloat(sampleData['item1Amount']?.replace(',', '') || '3500')
      const item2 = parseFloat(sampleData['item2Amount']?.replace(',', '') || '1500')
      const total = (item1 + item2).toLocaleString()
      html = html.replace(/\$\$\$TOTAL\$\$\$/g, total)
    }

    return html
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-muted/30' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className={`${isDark ? 'bg-secondary text-foreground border-border' : 'bg-gray-50 text-[#134e4a] border-gray-200'} pt-8 pb-6 px-4 border-b`}>
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/templates"
            className={`inline-flex items-center gap-2 ${isDark ? 'text-muted-foreground hover:text-foreground' : 'text-gray-500 hover:text-[#134e4a]'} mb-6 transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
            All Templates
          </Link>

          <div className="text-center mb-6">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-foreground' : 'text-[#134e4a]'}`}>
              {categoryName} Templates
            </h1>
            <p className={`${isDark ? 'text-muted-foreground' : 'text-gray-500'} text-sm md:text-base max-w-xl mx-auto`}>
              Professional {categoryName.toLowerCase()} templates ready to customize and use
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder={`Search ${categoryName.toLowerCase()} templates...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl ${isDark ? 'bg-muted text-foreground placeholder-muted-foreground border-border focus:ring-primary/30' : 'bg-white text-[#134e4a] placeholder-gray-500 border-gray-200 focus:ring-[#0d9488]/30'} shadow-lg focus:ring-4 outline-none text-sm border`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-muted-foreground hover:text-foreground' : 'text-gray-500 hover:text-gray-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className={isDark ? 'text-muted-foreground' : 'text-gray-500'}>
            <span className={`font-semibold ${isDark ? 'text-foreground' : 'text-[#134e4a]'}`}>{categoryTemplates.length}</span> templates
            {searchQuery && (
              <span> matching "<span className={`font-medium ${isDark ? 'text-primary' : 'text-[#0d9488]'}`}>{searchQuery}</span>"</span>
            )}
          </p>
          <div className={`flex items-center gap-2 ${isDark ? 'bg-muted border-border' : 'bg-[#ccfbf1] border-gray-200'} rounded-lg border p-1`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white' : isDark ? 'text-muted-foreground hover:text-foreground' : 'text-gray-500 hover:text-gray-600'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white' : isDark ? 'text-muted-foreground hover:text-foreground' : 'text-gray-500 hover:text-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        {categoryTemplates.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {categoryTemplates.map(template => (
              viewMode === 'grid' ? (
                // Grid Card with Document Preview
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`group relative ${isDark ? 'bg-secondary border-border hover:border-primary' : 'bg-white border border-gray-200 hover:border-[#0d9488]'} rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden`}
                >
                  {/* Document Preview Thumbnail */}
                  <div className={`relative h-52 ${isDark ? 'bg-muted border-border' : 'bg-[#ccfbf1] border-gray-200'} border-b overflow-hidden`}>
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
                    <div className={`absolute inset-2 bg-white rounded-lg shadow-md overflow-hidden ${isDark ? 'border-border' : 'border-gray-200'} border`}>
                      <div
                        className="w-[400%] h-[400%] origin-top-left transform scale-[0.25] pointer-events-none"
                        dangerouslySetInnerHTML={{ __html: generateMiniPreview(template) }}
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span className={`px-4 py-2 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} rounded-full text-sm font-medium shadow-lg flex items-center gap-2`}>
                        <Eye className="w-4 h-4" />
                        Preview Template
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} text-xs font-medium rounded-full`}>
                        {categoryName}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>
                        {template.fields.length} fields
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`font-semibold ${isDark ? 'text-foreground group-hover:text-primary' : 'text-[#134e4a] group-hover:text-[#0d9488]'} transition-colors mb-1 line-clamp-1`}>
                      {template.name}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-500'} line-clamp-2 mb-3`}>
                      {template.description}
                    </p>

                    {/* Use Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUseTemplate(template)
                      }}
                      className={`w-full py-2 ${isDark ? 'bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground' : 'bg-[#ccfbf1] hover:bg-[#0d9488] text-gray-600 hover:text-white'} rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2`}
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
                  className={`${isDark ? 'bg-secondary border-border hover:border-primary' : 'bg-white border border-gray-200 hover:border-[#0d9488]'} rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all group`}
                >
                  {/* Mini Preview */}
                  <div className={`w-20 h-28 ${isDark ? 'bg-muted border-border' : 'bg-[#ccfbf1] border-gray-200'} rounded-lg border overflow-hidden flex-shrink-0 relative`}>
                    <div
                      className="w-[500%] h-[500%] origin-top-left transform scale-[0.2] pointer-events-none"
                      dangerouslySetInnerHTML={{ __html: generateMiniPreview(template) }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} text-xs font-medium rounded-full`}>
                        {categoryName}
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
                    <h3 className={`font-semibold ${isDark ? 'text-foreground group-hover:text-primary' : 'text-[#134e4a] group-hover:text-[#0d9488]'} transition-colors`}>
                      {template.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-500'} line-clamp-1`}>{template.description}</p>
                    <p className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mt-1`}>{template.fields.length} fields to fill</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseTemplate(template)
                    }}
                    className={`px-4 py-2 ${isDark ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-[#0d9488] text-white hover:bg-[#0d9488]/90'} rounded-lg text-sm font-medium transition-colors flex items-center gap-2`}
                  >
                    Use
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )
            ))}
          </div>
        ) : (
          // No results
          <div className="text-center py-16">
            <div className={`w-20 h-20 ${isDark ? 'bg-muted' : 'bg-[#ccfbf1]'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Search className={`w-10 h-10 ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`} />
            </div>
            <h3 className={`text-xl font-semibold ${isDark ? 'text-foreground' : 'text-[#134e4a]'} mb-2`}>No templates found</h3>
            <p className={`${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-6`}>
              Try adjusting your search to find what you're looking for.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className={`px-6 py-3 ${isDark ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-[#0d9488] text-white hover:bg-[#0d9488]/90'} rounded-xl font-medium transition-colors`}
            >
              Clear Search
            </button>
          </div>
        )}
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
    </div>
  )
}
