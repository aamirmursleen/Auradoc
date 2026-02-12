'use client'

import React, { useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Star,
  Sparkles,
  ArrowRight,
  X,
  PenLine,
  Check,
  Share2,
  Eye,
  Grid3X3,
  List,
  Search,
  FileText
} from 'lucide-react'
import {
  templates,
  DocumentTemplate,
  TemplateCategory,
  categoryLabels,
  getTemplatesByCategory,
  getTemplateById
} from '@/data/templates'
import TemplateEditor from '@/components/templates/TemplateEditor'
import { useTheme } from '@/components/ThemeProvider'

// Category colors for styling - CalendarJet dark theme
const categoryStyles: Record<string, { gradient: string; bgLight: string; textColor: string }> = {
  'contracts': { gradient: 'from-primary to-primary', bgLight: 'bg-primary', textColor: 'text-primary' },
  'agreements': { gradient: 'from-primary to-primary', bgLight: 'bg-primary', textColor: 'text-primary' },
  'invoices': { gradient: 'from-primary to-primary', bgLight: 'bg-primary', textColor: 'text-primary' },
  'hr': { gradient: 'from-primary to-primary', bgLight: 'bg-primary', textColor: 'text-primary' },
  'real-estate': { gradient: 'from-primary to-primary', bgLight: 'bg-primary', textColor: 'text-primary' },
  'legal': { gradient: 'from-primary to-primary', bgLight: 'bg-primary', textColor: 'text-primary' },
  'resume': { gradient: 'from-primary to-primary', bgLight: 'bg-primary', textColor: 'text-primary' },
  'letters': { gradient: 'from-primary to-primary', bgLight: 'bg-primary', textColor: 'text-primary' },
  'business': { gradient: 'from-primary to-primary', bgLight: 'bg-primary', textColor: 'text-primary' },
  'planning': { gradient: 'from-primary to-primary', bgLight: 'bg-primary', textColor: 'text-primary' },
}

// Sample data for previews
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
  fullName: 'Sarah Johnson',
  email: 'sarah@example.com',
  phone: '(555) 123-4567',
  location: 'New York, NY',
  linkedin: 'linkedin.com/in/sarahjohnson',
  summary: 'Experienced professional with expertise in software development...',
  experience1Title: 'Senior Software Engineer',
  experience1Company: 'Tech Corp Inc.',
  experience1Duration: '2020 - Present',
  experience1Desc: 'Led development of microservices architecture.',
  experience2Title: 'Software Developer',
  experience2Company: 'StartUp Labs',
  experience2Duration: '2017 - 2020',
  experience2Desc: 'Built customer-facing web applications.',
  education: 'B.S. Computer Science, MIT, 2017',
  skills: 'JavaScript, React, Node.js, Python',
  item1Amount: '3,500',
  item2Amount: '1,500',
  item1Description: 'Web Development Services',
  item2Description: 'UI/UX Design',
  currentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
}

// Features list for preview popup
const features = [
  { icon: Check, text: '100% Customizable, free editor' },
  { icon: Check, text: 'Professional quality templates' },
  { icon: Check, text: 'Download or share as PDF' },
  { icon: Check, text: 'Edit text, add signatures' },
  { icon: Check, text: 'AI-powered content generation' },
  { icon: Check, text: 'No sign up needed' },
]

export default function TemplateDetailPage() {
  const router = useRouter()
  const params = useParams()
  const category = params.category as string
  const templateId = params.templateId as string
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [showPreviewPopup, setShowPreviewPopup] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  // Get the main template (for page title)
  const mainTemplate = getTemplateById(templateId)

  // Get all templates in this category
  const allCategoryTemplates = getTemplatesByCategory(category as TemplateCategory)

  // Filter templates based on search
  const categoryTemplates = useMemo(() => {
    if (!searchQuery.trim()) return allCategoryTemplates
    return allCategoryTemplates.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [allCategoryTemplates, searchQuery])

  // Get category info
  const categoryName = categoryLabels[category as TemplateCategory] || category
  const style = categoryStyles[category] || categoryStyles.contracts

  // Generate preview HTML
  const generatePreview = (template: DocumentTemplate) => {
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

  // Handle template click - show popup
  const handleTemplateClick = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
    setShowPreviewPopup(true)
  }

  // Handle use template (open editor)
  const handleUseTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
    setShowPreviewPopup(false)
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

  if (!mainTemplate) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-muted/30' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-foreground' : 'text-gray-900'} mb-4`}>Template not found</h1>
          <Link href="/templates" className="text-primary hover:underline">
            Back to Templates
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-muted/30' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <section className={`${isDark ? 'bg-white border-border' : 'bg-white border-gray-200'} pt-8 pb-6 px-4 border-b`}>
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className={`flex items-center gap-2 ${isDark ? 'text-muted-foreground' : 'text-gray-500'} text-sm mb-4`}>
            <Link href="/templates" className={`${isDark ? 'hover:text-foreground' : 'hover:text-gray-900'}`}>Templates</Link>
            <span>/</span>
            <span className={isDark ? 'text-foreground' : 'text-gray-900'}>{categoryName}</span>
          </div>

          <div className="text-center mb-6">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-foreground' : 'text-gray-900'}`}>
              {categoryName} Templates
            </h1>
            <p className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'} text-sm md:text-base max-w-xl mx-auto`}>
              Professional {categoryName.toLowerCase()} templates ready to customize and use
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-muted-foreground' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder={`Search ${categoryName.toLowerCase()} templates...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl ${isDark ? 'bg-muted text-foreground border-border' : 'bg-gray-100 text-gray-900 border-gray-200'} placeholder-muted-foreground shadow-lg focus:ring-4 focus:ring-primary/30 outline-none text-sm border`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-muted-foreground hover:text-foreground' : 'text-gray-400 hover:text-gray-300'}`}
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
          <div className="flex items-center gap-4">
            <Link
              href="/templates"
              className={`flex items-center gap-2 ${isDark ? 'text-muted-foreground' : 'text-gray-500'} hover:text-primary transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
              All Templates
            </Link>
            <span className={isDark ? 'text-muted-foreground' : 'text-gray-400'}>|</span>
            <p className={isDark ? 'text-muted-foreground' : 'text-gray-500'}>
              <span className={`font-semibold ${isDark ? 'text-foreground' : 'text-gray-900'}`}>{categoryTemplates.length}</span> templates
              {searchQuery && (
                <span> matching "<span className="font-medium text-primary">{searchQuery}</span>"</span>
              )}
            </p>
          </div>
          <div className={`flex items-center gap-2 ${isDark ? 'bg-muted border-border' : 'bg-gray-100 border-gray-200'} rounded-lg border p-1`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : isDark ? 'text-muted-foreground hover:text-foreground' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : isDark ? 'text-muted-foreground hover:text-foreground' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Templates Grid - Same as screenshot */}
        {categoryTemplates.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {categoryTemplates.map(template => (
              viewMode === 'grid' ? (
                // Grid Card with Document Preview - Like Screenshot
                <div
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className={`group relative ${isDark ? 'bg-secondary border-border' : 'bg-white border-gray-200'} rounded-2xl border hover:border-primary shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden`}
                >
                  {/* Document Preview Thumbnail */}
                  <div className={`relative h-52 ${isDark ? 'bg-muted border-border' : 'bg-gray-100 border-gray-200'} border-b overflow-hidden`}>
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
                    <div className={`absolute inset-2 bg-white rounded-lg shadow-md overflow-hidden border ${isDark ? 'border-border' : 'border-gray-200'}`}>
                      <div
                        className="w-[400%] h-[400%] origin-top-left transform scale-[0.25] pointer-events-none"
                        dangerouslySetInnerHTML={{ __html: generatePreview(template) }}
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span className="px-4 py-2 bg-primary rounded-full text-sm font-medium text-primary-foreground shadow-lg flex items-center gap-2">
                        <Eye className="w-4 h-4 text-primary-foreground" />
                        Preview Template
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r ${style.gradient} text-primary-foreground text-xs font-medium rounded-full`}>
                        <FileText className="w-3 h-3" />
                        {categoryName}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>
                        {template.fields.length} fields
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`font-semibold ${isDark ? 'text-foreground' : 'text-gray-900'} group-hover:text-primary transition-colors mb-1 line-clamp-1`}>
                      {template.name}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-600'} line-clamp-2 mb-3`}>
                      {template.description}
                    </p>

                    {/* Use Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUseTemplate(template)
                      }}
                      className={`w-full py-2 ${isDark ? 'bg-muted text-muted-foreground' : 'bg-gray-100 text-gray-700'} hover:bg-primary hover:text-primary-foreground rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2`}
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
                  onClick={() => handleTemplateClick(template)}
                  className={`${isDark ? 'bg-secondary border-border' : 'bg-white border-gray-200'} rounded-xl border hover:border-primary p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all group`}
                >
                  {/* Mini Preview */}
                  <div className={`w-20 h-28 ${isDark ? 'bg-muted border-border' : 'bg-gray-100 border-gray-200'} rounded-lg border overflow-hidden flex-shrink-0 relative`}>
                    <div
                      className="w-[500%] h-[500%] origin-top-left transform scale-[0.2] pointer-events-none"
                      dangerouslySetInnerHTML={{ __html: generatePreview(template) }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r ${style.gradient} text-primary-foreground text-xs font-medium rounded-full`}>
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
                    <h3 className={`font-semibold ${isDark ? 'text-foreground' : 'text-gray-900'} group-hover:text-primary transition-colors`}>
                      {template.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-600'} line-clamp-1`}>{template.description}</p>
                    <p className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mt-1`}>{template.fields.length} fields to fill</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseTemplate(template)
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
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
            <div className={`w-20 h-20 ${isDark ? 'bg-muted' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Search className={`w-10 h-10 ${isDark ? 'text-muted-foreground' : 'text-gray-400'}`} />
            </div>
            <h3 className={`text-xl font-semibold ${isDark ? 'text-foreground' : 'text-gray-900'} mb-2`}>No templates found</h3>
            <p className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'} mb-6`}>
              Try adjusting your search to find what you're looking for.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>


      {/* Template Preview Popup Modal - Compact & Clean */}
      {showPreviewPopup && selectedTemplate && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowPreviewPopup(false)
            setSelectedTemplate(null)
          }}
        >
          {/* Popup Container - Smaller */}
          <div
            className={`${isDark ? 'bg-secondary border-border' : 'bg-white border-gray-200'} rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden relative border`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Top Right */}
            <button
              onClick={() => {
                setShowPreviewPopup(false)
                setSelectedTemplate(null)
              }}
              className={`absolute top-2 right-2 z-10 p-1.5 ${isDark ? 'bg-muted hover:bg-muted/80' : 'bg-gray-100 hover:bg-gray-200'} rounded-full transition-colors shadow-sm`}
            >
              <X className={`w-5 h-5 ${isDark ? 'text-muted-foreground' : 'text-gray-400'}`} />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[80vh] overscroll-contain touch-pan-y">
              {/* Template Preview - Larger */}
              <div className={`${isDark ? 'bg-muted' : 'bg-gray-100'} p-4`}>
                <div className={`bg-white rounded-lg shadow border ${isDark ? 'border-border' : 'border-gray-200'} overflow-hidden h-[280px] overflow-y-auto`}>
                  <div
                    className="transform scale-[0.55] origin-top-left"
                    style={{ width: '182%' }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: generatePreview(selectedTemplate) }} />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                {/* Title */}
                <h2 className={`text-lg font-bold ${isDark ? 'text-foreground' : 'text-gray-900'} mb-1`}>{selectedTemplate.name}</h2>
                <p className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'} text-xs mb-4`}>{selectedTemplate.description}</p>

                {/* Main CTA Button */}
                <button
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 transition-all mb-3"
                >
                  <PenLine className="w-4 h-4" />
                  Edit this free template
                </button>

                <p className={`text-center ${isDark ? 'text-muted-foreground' : 'text-gray-500'} text-xs mb-4`}>
                  No sign up needed
                </p>

                {/* Features - Compact */}
                <div className="space-y-2 mb-4">
                  {features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'} text-xs`}>{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* AI Generator Button */}
                <button
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 text-sm transition-all hover:bg-primary/90"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate with AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  )
}
