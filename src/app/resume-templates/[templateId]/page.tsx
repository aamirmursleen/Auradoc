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
  Eye,
  FileText,
} from 'lucide-react'
import {
  resumeTemplates,
  ResumeTemplate,
  styleLabels,
  styleBadgeColors,
  getResumeTemplateById,
  getResumeTemplatesByStyle,
} from '@/data/resume-templates'
import TemplateEditor from '@/components/templates/TemplateEditor'
import { useTheme } from '@/components/ThemeProvider'

// Sample data for previews
const sampleData: Record<string, string> = {
  fullName: 'Sarah Johnson',
  jobTitle: 'Senior Software Engineer',
  email: 'sarah@example.com',
  phone: '(555) 123-4567',
  location: 'New York, NY',
  linkedin: 'linkedin.com/in/sarahjohnson',
  summary: 'Experienced professional with expertise in software development, team leadership, and delivering scalable solutions. Proven track record of driving innovation and mentoring cross-functional teams.',
  experience1Title: 'Senior Software Engineer',
  experience1Company: 'Tech Corp Inc.',
  experience1Duration: '2020 - Present',
  experience1Desc: 'Led development of microservices architecture serving 1M+ users.\nImplemented CI/CD pipelines reducing deployment time by 60%.\nMentored junior developers and conducted code reviews.',
  experience2Title: 'Software Developer',
  experience2Company: 'StartUp Labs',
  experience2Duration: '2017 - 2020',
  experience2Desc: 'Built customer-facing web applications using React and Node.js.\nOptimized database queries improving performance by 40%.',
  education: 'B.S. Computer Science\nMassachusetts Institute of Technology, 2017',
  skills: 'JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, Git',
}

const features = [
  { icon: Check, text: '100% Customizable, free editor' },
  { icon: Check, text: 'Professional quality templates' },
  { icon: Check, text: 'Download or share as PDF' },
  { icon: Check, text: 'Edit text, add signatures' },
  { icon: Check, text: 'AI-powered content generation' },
  { icon: Check, text: 'No sign up needed' },
]

export default function ResumeTemplateDetailPage() {
  const router = useRouter()
  const params = useParams()
  const templateId = params.templateId as string
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [showEditor, setShowEditor] = useState(false)

  const template = getResumeTemplateById(templateId)

  // Related templates from same style category
  const relatedTemplates = useMemo(() => {
    if (!template) return []
    return getResumeTemplatesByStyle(template.styleCategory)
      .filter(t => t.id !== template.id)
      .slice(0, 4)
  }, [template])

  // Generate preview HTML
  const generatePreview = (t: ResumeTemplate) => {
    let html = t.content
    t.fields.forEach(field => {
      const value = sampleData[field.name] || `[${field.label}]`
      const regex = new RegExp(`\\{\\{${field.name}\\}\\}`, 'g')
      html = html.replace(regex, value)
    })
    return html
  }

  const handleUseTemplate = () => {
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

  const badgeColor = (style: ResumeTemplate['styleCategory']) => styleBadgeColors[style]

  if (!template) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-muted/30' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-foreground' : 'text-gray-900'} mb-4`}>Template not found</h1>
          <Link href="/resume-templates" className="text-primary hover:underline">
            Back to Resume Templates
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
            <Link href="/resume-templates" className={`flex items-center gap-1 ${isDark ? 'hover:text-foreground' : 'hover:text-gray-900'}`}>
              <ArrowLeft className="w-4 h-4" />
              Resume Templates
            </Link>
            <span>/</span>
            <span className={isDark ? 'text-foreground' : 'text-gray-900'}>{template.name}</span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full"
              style={{ backgroundColor: badgeColor(template.styleCategory).bg, color: badgeColor(template.styleCategory).text }}
            >
              {styleLabels[template.styleCategory]}
            </span>
            {template.popular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                <Star className="w-3 h-3 fill-current" />
                Popular
              </span>
            )}
            {template.new && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                <Sparkles className="w-3 h-3" />
                New
              </span>
            )}
          </div>

          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-foreground' : 'text-gray-900'}`}>
            {template.name} Resume Template
          </h1>
          <p className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'} text-sm md:text-base max-w-2xl`}>
            {template.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Full-size Preview */}
          <div className="lg:col-span-2">
            <div className={`${isDark ? 'bg-secondary border-border' : 'bg-white border-gray-200'} rounded-2xl border shadow-sm overflow-hidden`}>
              <div className={`${isDark ? 'bg-muted' : 'bg-gray-100'} p-6`}>
                <div className={`bg-white rounded-lg shadow-lg border ${isDark ? 'border-border' : 'border-gray-200'} overflow-hidden`}>
                  <div dangerouslySetInnerHTML={{ __html: generatePreview(template) }} />
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            <div className={`${isDark ? 'bg-secondary border-border' : 'bg-white border-gray-200'} rounded-2xl border shadow-sm p-6 sticky top-8`}>
              <h2 className={`text-xl font-bold ${isDark ? 'text-foreground' : 'text-gray-900'} mb-2`}>{template.name}</h2>
              <p className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'} text-sm mb-6`}>{template.description}</p>

              {/* CTA Button */}
              <button
                onClick={handleUseTemplate}
                className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 transition-all mb-4 shadow-lg"
              >
                <PenLine className="w-5 h-5" />
                Edit this free template
              </button>

              <p className={`text-center ${isDark ? 'text-muted-foreground' : 'text-gray-500'} text-xs mb-6`}>
                No sign up needed &bull; 100% free
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <h3 className={`text-sm font-semibold ${isDark ? 'text-foreground' : 'text-gray-900'}`}>Features</h3>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'} text-sm`}>{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Template Info */}
              <div className={`border-t ${isDark ? 'border-border' : 'border-gray-200'} pt-4`}>
                <h3 className={`text-sm font-semibold ${isDark ? 'text-foreground' : 'text-gray-900'} mb-3`}>Template Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>Style</span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: badgeColor(template.styleCategory).bg, color: badgeColor(template.styleCategory).text }}
                    >
                      {styleLabels[template.styleCategory]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>Fields</span>
                    <span className={`text-sm font-medium ${isDark ? 'text-foreground' : 'text-gray-900'}`}>{template.fields.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>Format</span>
                    <span className={`text-sm font-medium ${isDark ? 'text-foreground' : 'text-gray-900'}`}>PDF, HTML</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Templates */}
        {relatedTemplates.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-foreground' : 'text-gray-900'}`}>
                More {styleLabels[template.styleCategory]} Templates
              </h2>
              <Link
                href="/resume-templates"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTemplates.map(related => (
                <Link
                  key={related.id}
                  href={`/resume-templates/${related.id}`}
                  className={`group ${isDark ? 'bg-secondary border-border' : 'bg-white border-gray-200'} rounded-2xl border hover:border-primary shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
                >
                  <div className={`relative h-44 ${isDark ? 'bg-muted' : 'bg-gray-100'} border-b ${isDark ? 'border-border' : 'border-gray-200'} overflow-hidden`}>
                    <div className={`absolute inset-2 bg-white rounded-lg shadow-md overflow-hidden border ${isDark ? 'border-border' : 'border-gray-200'}`}>
                      <div
                        className="w-[400%] h-[400%] origin-top-left transform scale-[0.25] pointer-events-none"
                        dangerouslySetInnerHTML={{ __html: generatePreview(related) }}
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-foreground' : 'text-gray-900'} group-hover:text-primary transition-colors`}>
                      {related.name}
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-600'} line-clamp-1 mt-0.5`}>
                      {related.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Template Editor Modal */}
      {showEditor && template && (
        <TemplateEditor
          template={template}
          onClose={() => setShowEditor(false)}
          onComplete={handleTemplateComplete}
        />
      )}
    </div>
  )
}
