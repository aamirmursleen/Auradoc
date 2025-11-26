'use client'

import React, { useMemo } from 'react'
import {
  X,
  Star,
  Share2,
  Check,
  PenLine,
  Download,
  FileText,
  Sparkles
} from 'lucide-react'
import { DocumentTemplate, categoryLabels } from '@/data/templates'

interface TemplatePreviewProps {
  template: DocumentTemplate
  onClose: () => void
  onUseTemplate: (template: DocumentTemplate) => void
}

// Sample data for preview
const sampleData: Record<string, string> = {
  // Common fields
  clientName: 'John Smith',
  clientEmail: 'john.smith@example.com',
  clientAddress: '123 Business Ave\nNew York, NY 10001',
  companyName: 'Acme Corporation',
  companyAddress: '456 Corporate Blvd\nSan Francisco, CA 94102',
  companyEmail: 'contact@acmecorp.com',

  // Resume
  fullName: 'Sarah Johnson',
  jobTitle: 'Senior Software Engineer',
  email: 'sarah.johnson@email.com',
  phone: '(555) 123-4567',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/sarahjohnson',
  summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions.',
  experience1Title: 'Senior Software Engineer',
  experience1Company: 'Tech Corp Inc.',
  experience1Duration: '2020 - Present',
  experience1Desc: 'Led development of microservices architecture, improving system performance by 40%. Mentored junior developers and implemented CI/CD pipelines.',
  experience2Title: 'Software Developer',
  experience2Company: 'StartUp Labs',
  experience2Duration: '2017 - 2020',
  experience2Desc: 'Built customer-facing web applications using React and Node.js. Collaborated with design team to improve UX.',
  education: 'B.S. Computer Science\nMIT, 2017',
  skills: 'JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL',

  // Cover Letter
  yourName: 'Michael Chen',
  yourAddress: '789 Oak Street\nBoston, MA 02101',
  yourEmail: 'michael.chen@email.com',
  yourPhone: '(555) 987-6543',
  hiringManager: 'Ms. Jennifer Williams',
  opening: 'I am writing to express my strong interest in the Senior Developer position at your company. With over 7 years of experience in software development, I am confident in my ability to contribute to your team.',
  body: 'Throughout my career, I have successfully delivered numerous high-impact projects. At my current role, I led a team that reduced deployment time by 60% through automation.',
  closing: 'I would welcome the opportunity to discuss how my skills and experience align with your needs. Thank you for considering my application.',

  // Freelance contract
  freelancerName: 'Sarah Johnson',
  projectTitle: 'Website Redesign Project',
  projectDescription: 'Complete redesign of the company website including new UI/UX design, responsive layout, and integration with existing backend systems.',
  startDate: 'January 15, 2025',
  endDate: 'March 15, 2025',
  totalAmount: '5,000',
  paymentTerms: '50% upfront, 50% on completion',

  // Business
  proposalTitle: 'Website Development Proposal',
  executiveSummary: 'We propose to develop a modern, responsive website that will enhance your online presence and improve customer engagement.',
  problemStatement: 'Your current website lacks modern features and mobile responsiveness, leading to decreased user engagement.',
  proposedSolution: 'A complete redesign using modern technologies including React, responsive design, and SEO optimization.',
  deliverables: '• Custom website design\n• Mobile responsive layout\n• SEO optimization\n• Content management system\n• Training documentation',
  timeline: 'Week 1-2: Design\nWeek 3-4: Development\nWeek 5: Testing\nWeek 6: Launch',
  investment: 'Total Project Cost: $15,000\n- Design Phase: $5,000\n- Development: $8,000\n- Testing & Launch: $2,000',
  whyUs: 'With 10+ years of experience and 200+ successful projects, we deliver quality results on time.',
  contactName: 'David Miller',
  contactEmail: 'david@company.com',

  // NDA
  disclosingParty: 'Innovate Labs LLC',
  receivingParty: 'Partner Solutions Inc.',
  purpose: 'Evaluation of potential business partnership and technology collaboration opportunities.',
  effectiveDate: 'January 1, 2025',
  duration: '2 Years',

  // Invoice
  invoiceNumber: 'INV-2025-001',
  invoiceDate: 'January 10, 2025',
  dueDate: 'January 25, 2025',
  item1Description: 'Web Development Services',
  item1Amount: '3,500',
  item2Description: 'UI/UX Design',
  item2Amount: '1,500',
  notes: 'Payment due within 15 days. Bank transfer preferred.',

  // HR
  candidateName: 'Alex Thompson',
  department: 'Engineering',
  salary: '120,000',
  employmentType: 'Full-time',
  reportingTo: 'CTO - David Miller',
  hrName: 'Jennifer Brown',

  // Real estate
  landlordName: 'Robert Williams',
  landlordPhone: '(555) 123-4567',
  tenantName: 'Lisa Anderson',
  tenantEmail: 'lisa.anderson@email.com',
  propertyAddress: '789 Oak Street, Apt 4B\nChicago, IL 60601',
  monthlyRent: '2,200',
  securityDeposit: '4,400',
  leaseStart: 'February 1, 2025',
  leaseEnd: 'January 31, 2026',
  paymentDueDay: '1st',

  // Legal
  principalName: 'Margaret Wilson',
  principalAddress: '321 Elm Street\nBoston, MA 02101',
  agentName: 'James Wilson',
  agentAddress: '654 Pine Road\nBoston, MA 02102',
  powers: 'Full authority to manage financial affairs, including banking, investments, real estate transactions, and tax matters.',
  expiryDate: 'December 31, 2025',

  // Planning
  projectName: 'Website Redesign 2025',
  preparedBy: 'Project Team',
  totalBudget: '50,000',
  laborCost: '25,000',
  materialsCost: '10,000',
  equipmentCost: '8,000',
  overheadCost: '5,000',
  contingency: '2,000',
  meetingTitle: 'Q1 Planning Meeting',
  time: '10:00 AM - 11:30 AM',
  organizer: 'Sarah Johnson',
  attendees: 'John Smith\nMichael Chen\nEmily Davis',
  objectives: '1. Review Q4 results\n2. Set Q1 goals\n3. Assign responsibilities',
  agendaItems: '1. Welcome & Introduction (5 min)\n2. Q4 Review (15 min)\n3. Q1 Goals Discussion (30 min)\n4. Action Items (10 min)',
  projectManager: 'Sarah Johnson',
  phase1: '☐ Define project scope\n☐ Identify stakeholders\n☐ Create timeline\n☐ Set budget',
  phase2: '☐ Design mockups\n☐ Development sprint 1\n☐ Development sprint 2',
  phase3: '☐ Internal review\n☐ User testing\n☐ Bug fixes',
  phase4: '☐ Final approval\n☐ Deployment\n☐ Documentation',

  // Special
  currentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onClose, onUseTemplate }) => {
  // Generate preview with sample data
  const previewHtml = useMemo(() => {
    let html = template.content

    // Replace all field placeholders with sample data
    template.fields.forEach(field => {
      const value = sampleData[field.name] || `[${field.label}]`
      const regex = new RegExp(`\\{\\{${field.name}\\}\\}`, 'g')
      html = html.replace(regex, value)
    })

    // Replace special placeholders
    html = html.replace(/\{\{currentDate\}\}/g, sampleData.currentDate)

    // Calculate total for invoices
    if (template.category === 'invoices') {
      const item1 = parseFloat(sampleData['item1Amount']?.replace(',', '') || '0')
      const item2 = parseFloat(sampleData['item2Amount']?.replace(',', '') || '0')
      const total = (item1 + item2).toLocaleString()
      html = html.replace(/\$\$\$TOTAL\$\$\$/g, total)
    }

    return html
  }, [template])

  const features = [
    { icon: Check, text: '100% Customizable, free editor' },
    { icon: Check, text: 'Professional quality templates' },
    { icon: Check, text: 'Download or share as PDF' },
    { icon: Check, text: 'Edit text, add signatures' },
    { icon: Check, text: 'AI-powered content generation' },
    { icon: Check, text: 'No sign up needed' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden animate-in flex">
        {/* Left Side - Document Preview */}
        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Template Header Banner - Like template.net */}
            <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-amber-600 p-4 text-white text-center text-sm">
              <span className="opacity-80">AuraDoc</span>
              <span className="mx-2">|</span>
              <span>{template.name}</span>
            </div>

            {/* Document Preview */}
            <div className="p-4">
              <div
                className="transform scale-[0.7] origin-top-left"
                style={{ width: '142.85%' }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                  className="template-preview"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Actions Panel */}
        <div className="w-[380px] flex flex-col bg-white border-l border-gray-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Free
            </span>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Star className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Main CTA Button */}
            <button
              onClick={() => onUseTemplate(template)}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl mb-3"
            >
              <PenLine className="w-5 h-5" />
              Edit this free template
            </button>

            <p className="text-center text-gray-500 text-sm mb-6">
              No sign up needed
            </p>

            {/* Features List */}
            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <feature.icon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* AI Generator Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                AI {categoryLabels[template.category]} Generator
              </h3>

              <button
                onClick={() => onUseTemplate(template)}
                className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Generate my free {template.name}
              </button>

              <p className="text-center text-gray-400 text-xs mt-3">
                Text or voice to generate a free document
              </p>
            </div>

            {/* Template Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Template Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="text-gray-900 font-medium">{categoryLabels[template.category]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fields to fill</span>
                  <span className="text-gray-900 font-medium">{template.fields.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Format</span>
                  <span className="text-gray-900 font-medium">PDF, HTML</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplatePreview
