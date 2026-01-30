'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  X,
  Star,
  Sparkles,
  Eye,
  ArrowRight,
  FileText,
  ArrowLeft,
  PenLine,
  Check,
} from 'lucide-react'
import {
  resumeTemplates,
  ResumeTemplate,
  ResumeStyleCategory,
  styleLabels,
  styleBadgeColors,
  getResumeTemplatesByStyle,
  searchResumeTemplates,
} from '@/data/resume-templates'
import TemplateEditor from '@/components/templates/TemplateEditor'
import { useTheme } from '@/components/ThemeProvider'

const styleCategories: { key: ResumeStyleCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Templates' },
  { key: 'popular', label: 'Popular' },
  { key: 'simple', label: 'Simple' },
  { key: 'modern', label: 'Modern' },
  { key: 'creative', label: 'Creative' },
]

// Sample data for mini-previews
const sampleData: Record<string, string> = {
  fullName: 'Sarah Johnson',
  jobTitle: 'Senior Software Engineer',
  email: 'sarah@example.com',
  phone: '(555) 123-4567',
  location: 'New York, NY',
  linkedin: 'linkedin.com/in/sarahjohnson',
  summary: 'Experienced professional with expertise in software development and team leadership.',
  experience1Title: 'Senior Software Engineer',
  experience1Company: 'Tech Corp Inc.',
  experience1Duration: '2020 - Present',
  experience1Desc: 'Led development of microservices architecture serving 1M+ users.',
  experience2Title: 'Software Developer',
  experience2Company: 'StartUp Labs',
  experience2Duration: '2017 - 2020',
  experience2Desc: 'Built customer-facing web applications using React and Node.js.',
  education: 'B.S. Computer Science, MIT, 2017',
  skills: 'JavaScript, React, Node.js, Python, AWS, Docker',
}

// Features for preview popup
const features = [
  { icon: Check, text: '100% Customizable, free editor' },
  { icon: Check, text: 'Professional quality templates' },
  { icon: Check, text: 'Download or share as PDF' },
  { icon: Check, text: 'AI-powered content generation' },
]

export default function ResumeTemplatesPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [activeStyle, setActiveStyle] = useState<ResumeStyleCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null)
  const [showPreviewPopup, setShowPreviewPopup] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let result: ResumeTemplate[]
    if (searchQuery.trim()) {
      result = searchResumeTemplates(searchQuery)
    } else if (activeStyle === 'all') {
      result = resumeTemplates
    } else {
      result = getResumeTemplatesByStyle(activeStyle)
    }
    return result
  }, [activeStyle, searchQuery])

  // Generate preview HTML
  const generatePreview = (template: ResumeTemplate) => {
    let html = template.content
    template.fields.forEach(field => {
      const value = sampleData[field.name] || `[${field.label}]`
      const regex = new RegExp(`\\{\\{${field.name}\\}\\}`, 'g')
      html = html.replace(regex, value)
    })
    return html
  }

  const handleTemplateClick = (template: ResumeTemplate) => {
    setSelectedTemplate(template)
    setShowPreviewPopup(true)
  }

  const handleUseTemplate = (template: ResumeTemplate) => {
    setSelectedTemplate(template)
    setShowPreviewPopup(false)
    setShowEditor(true)
  }

  const handleTemplateComplete = (documentHtml: string, completedTemplate: import('@/data/templates').DocumentTemplate) => {
    const documentData = {
      html: documentHtml,
      templateName: completedTemplate.name,
      templateId: completedTemplate.id,
      generatedAt: new Date().toISOString(),
    }
    sessionStorage.setItem('templateDocument', JSON.stringify(documentData))
    router.push('/sign?source=template')
  }

  const badgeColor = (style: ResumeStyleCategory) => styleBadgeColors[style]

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <section className={`${isDark ? 'bg-[#1F1F1F] border-[#2a2a2a]' : 'bg-white border-gray-200'} pt-8 pb-6 px-4 border-b`}>
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mb-4`}>
            <Link href="/" className={`flex items-center gap-1 ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <span>/</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>Resume Templates</span>
          </div>

          <div className="text-center mb-6">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Resume Templates
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm md:text-base max-w-xl mx-auto`}>
              Choose from 30 professionally designed resume templates. Customize, download, and land your dream job.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resume templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl ${isDark ? 'bg-[#2a2a2a] text-white border-[#3a3a3a]' : 'bg-gray-100 text-gray-900 border-gray-200'} placeholder-gray-400 shadow-lg focus:ring-4 focus:ring-[#c4ff0e]/30 outline-none text-sm border`}
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

          {/* Style Category Tabs */}
          <div className="flex justify-center gap-2 flex-wrap">
            {styleCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setActiveStyle(cat.key); setSearchQuery('') }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeStyle === cat.key
                    ? 'bg-[#c4ff0e] text-black'
                    : isDark
                      ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{filteredTemplates.length}</span> templates
            {searchQuery && (
              <span> matching &quot;<span className="font-medium text-[#c4ff0e]">{searchQuery}</span>&quot;</span>
            )}
            {activeStyle !== 'all' && !searchQuery && (
              <span> in <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{styleLabels[activeStyle]}</span></span>
            )}
          </p>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                className={`group relative ${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-white border-gray-200'} rounded-2xl border hover:border-[#c4ff0e] shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                {/* Document Preview Thumbnail */}
                <div className={`relative h-52 ${isDark ? 'bg-[#2a2a2a] border-[#2a2a2a]' : 'bg-gray-100 border-gray-200'} border-b overflow-hidden`}>
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
                  <div className={`absolute inset-2 bg-white rounded-lg shadow-md overflow-hidden border ${isDark ? 'border-[#3a3a3a]' : 'border-gray-200'}`}>
                    <div
                      className="w-[400%] h-[400%] origin-top-left transform scale-[0.25] pointer-events-none"
                      dangerouslySetInnerHTML={{ __html: generatePreview(template) }}
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="px-4 py-2 bg-[#c4ff0e] rounded-full text-sm font-medium text-black shadow-lg flex items-center gap-2">
                      <Eye className="w-4 h-4 text-black" />
                      Preview Template
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  {/* Style Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full"
                      style={{ backgroundColor: badgeColor(template.styleCategory).bg, color: badgeColor(template.styleCategory).text }}
                    >
                      <FileText className="w-3 h-3" />
                      {styleLabels[template.styleCategory]}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {template.fields.length} fields
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-[#c4ff0e] transition-colors mb-1 line-clamp-1`}>
                    {template.name}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2 mb-3`}>
                    {template.description}
                  </p>

                  {/* Use Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseTemplate(template)
                    }}
                    className={`w-full py-2 ${isDark ? 'bg-[#2a2a2a] text-gray-300' : 'bg-gray-100 text-gray-700'} hover:bg-[#c4ff0e] hover:text-black rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2`}
                  >
                    Use Template
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className={`w-20 h-20 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>No templates found</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Try adjusting your search to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveStyle('all') }}
              className="px-6 py-3 bg-[#c4ff0e] text-black rounded-xl font-medium hover:bg-[#c4ff0e]/90 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Template Preview Popup Modal */}
      {showPreviewPopup && selectedTemplate && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => { setShowPreviewPopup(false); setSelectedTemplate(null) }}
        >
          <div
            className={`${isDark ? 'bg-[#252525] border-[#2a2a2a]' : 'bg-white border-gray-200'} rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden relative border`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setShowPreviewPopup(false); setSelectedTemplate(null) }}
              className={`absolute top-2 right-2 z-10 p-1.5 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200'} rounded-full transition-colors shadow-sm`}
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="overflow-y-auto max-h-[80vh] overscroll-contain touch-pan-y">
              {/* Template Preview */}
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'} p-4`}>
                <div className={`bg-white rounded-lg shadow border ${isDark ? 'border-[#3a3a3a]' : 'border-gray-200'} overflow-hidden h-[280px] overflow-y-auto`}>
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
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full"
                    style={{ backgroundColor: badgeColor(selectedTemplate.styleCategory).bg, color: badgeColor(selectedTemplate.styleCategory).text }}
                  >
                    {styleLabels[selectedTemplate.styleCategory]}
                  </span>
                </div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>{selectedTemplate.name}</h2>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs mb-4`}>{selectedTemplate.description}</p>

                <button
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className="w-full py-3 bg-[#c4ff0e] hover:bg-[#c4ff0e]/90 text-black rounded-lg font-semibold flex items-center justify-center gap-2 transition-all mb-3"
                >
                  <PenLine className="w-4 h-4" />
                  Edit this free template
                </button>

                <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs mb-4`}>
                  No sign up needed
                </p>

                <div className="space-y-2 mb-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{feature.text}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/resume-templates/${selectedTemplate.id}`}
                  className={`w-full py-2.5 ${isDark ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg font-medium flex items-center justify-center gap-2 text-sm transition-all`}
                >
                  <Eye className="w-4 h-4" />
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      {showEditor && selectedTemplate && (
        <TemplateEditor
          template={selectedTemplate}
          onClose={() => { setShowEditor(false); setSelectedTemplate(null) }}
          onComplete={handleTemplateComplete}
        />
      )}
    </div>
  )
}
