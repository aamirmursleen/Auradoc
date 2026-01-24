'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  X,
  ArrowLeft,
  Download,
  Share2,
  Undo,
  Redo,
  Type,
  Bold,
  Italic,
  Underline,
  Link2,
  ListOrdered,
  List,
  Copy,
  Trash2,
  Sparkles,
  Send,
  Mic,
  Globe,
  FileText,
  Loader2,
  Check,
  ChevronDown
} from 'lucide-react'
import { DocumentTemplate, categoryLabels, TemplateField } from '@/data/templates'

interface TemplateEditorProps {
  template: DocumentTemplate
  onClose: () => void
  onComplete: (documentHtml: string, template: DocumentTemplate) => void
}

// Sample data for initial preview
const sampleData: Record<string, string> = {
  fullName: 'Your Name',
  jobTitle: 'Your Job Title',
  email: 'your.email@example.com',
  phone: '(555) 000-0000',
  location: 'City, State',
  linkedin: 'linkedin.com/in/yourprofile',
  summary: 'Write your professional summary here...',
  experience1Title: 'Job Title',
  experience1Company: 'Company Name',
  experience1Duration: '2020 - Present',
  experience1Desc: 'Describe your responsibilities and achievements...',
  experience2Title: 'Previous Title',
  experience2Company: 'Previous Company',
  experience2Duration: '2018 - 2020',
  experience2Desc: 'Describe your previous role...',
  education: 'Your Degree, University Name, Year',
  skills: 'Skill 1, Skill 2, Skill 3, Skill 4',
  clientName: 'Client Name',
  clientEmail: 'client@example.com',
  companyName: 'Company Name',
  companyAddress: 'Company Address',
  companyEmail: 'company@example.com',
  freelancerName: 'Your Name',
  projectTitle: 'Project Title',
  projectDescription: 'Project description goes here...',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 90*24*60*60*1000).toISOString().split('T')[0],
  totalAmount: '0',
  paymentTerms: '50% upfront, 50% on completion',
  currentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, onClose, onComplete }) => {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [documentHtml, setDocumentHtml] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(true)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const editorRef = useRef<HTMLDivElement>(null)
  const [selectedText, setSelectedText] = useState('')

  // Initialize form data and document
  useEffect(() => {
    const initialData: Record<string, string> = {}
    template.fields.forEach(field => {
      initialData[field.name] = sampleData[field.name] || ''
    })
    setFormData(initialData)
  }, [template])

  // Generate document HTML whenever form data changes
  useEffect(() => {
    let html = template.content

    template.fields.forEach(field => {
      const value = formData[field.name] || sampleData[field.name] || `[${field.label}]`
      const regex = new RegExp(`\\{\\{${field.name}\\}\\}`, 'g')
      html = html.replace(regex, value)
    })

    html = html.replace(/\{\{currentDate\}\}/g, sampleData.currentDate)

    // Calculate total for invoices
    if (template.category === 'invoices') {
      const item1 = parseFloat(formData['item1Amount'] || '0')
      const item2 = parseFloat(formData['item2Amount'] || '0')
      const total = (item1 + item2).toFixed(2)
      html = html.replace(/\$\$\$TOTAL\$\$\$/g, total)
    }

    setDocumentHtml(html)
  }, [formData, template])

  // Handle field change
  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  // Execute formatting command
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  // AI Generate content using OpenAI API
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          category: template.category,
          fields: template.fields.map(f => ({
            name: f.name,
            label: f.label,
            type: f.type
          }))
        })
      })

      const result = await response.json()

      if (result.success && result.data) {
        // Update form data with AI-generated content
        Object.keys(result.data).forEach(key => {
          if (formData.hasOwnProperty(key) || template.fields.find(f => f.name === key)) {
            handleFieldChange(key, result.data[key])
          }
        })
        setAiPrompt('')
      } else {
        // Fallback to local generation if API fails
        console.warn('AI API failed, using fallback:', result.error)
        const generatedContent = generateAiContent(aiPrompt, template)
        Object.keys(generatedContent).forEach(key => {
          if (formData.hasOwnProperty(key) || template.fields.find(f => f.name === key)) {
            handleFieldChange(key, generatedContent[key])
          }
        })
        setAiPrompt('')
      }
    } catch (error) {
      console.error('AI generation error:', error)
      // Fallback to local generation
      const generatedContent = generateAiContent(aiPrompt, template)
      Object.keys(generatedContent).forEach(key => {
        if (formData.hasOwnProperty(key) || template.fields.find(f => f.name === key)) {
          handleFieldChange(key, generatedContent[key])
        }
      })
      setAiPrompt('')
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate AI content based on prompt
  const generateAiContent = (prompt: string, template: DocumentTemplate): Record<string, string> => {
    const lowerPrompt = prompt.toLowerCase()

    // Resume generation
    if (template.category === 'resume') {
      if (lowerPrompt.includes('software') || lowerPrompt.includes('developer') || lowerPrompt.includes('engineer') || lowerPrompt.includes('programmer')) {
        return {
          fullName: 'Alex Johnson',
          jobTitle: 'Senior Software Engineer',
          email: 'alex.johnson@email.com',
          phone: '(555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/alexjohnson',
          summary: 'Passionate software engineer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Strong problem-solving skills and proven track record of delivering high-quality solutions.',
          experience1Title: 'Senior Software Engineer',
          experience1Company: 'Tech Innovations Inc.',
          experience1Duration: '2021 - Present',
          experience1Desc: '• Led development of microservices architecture serving 1M+ users\n• Implemented CI/CD pipelines reducing deployment time by 60%\n• Mentored junior developers and conducted code reviews',
          experience2Title: 'Software Developer',
          experience2Company: 'StartUp Solutions',
          experience2Duration: '2018 - 2021',
          experience2Desc: '• Built customer-facing web applications using React and Node.js\n• Optimized database queries improving performance by 40%\n• Collaborated with design team on UX improvements',
          education: 'B.S. Computer Science\nStanford University, 2018',
          skills: 'JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, MongoDB, Git',
        }
      }
      if (lowerPrompt.includes('marketing') || lowerPrompt.includes('manager')) {
        return {
          fullName: 'Sarah Williams',
          jobTitle: 'Marketing Manager',
          email: 'sarah.williams@email.com',
          phone: '(555) 987-6543',
          location: 'New York, NY',
          linkedin: 'linkedin.com/in/sarahwilliams',
          summary: 'Results-driven marketing professional with 7+ years of experience in digital marketing, brand strategy, and team leadership. Proven track record of increasing brand awareness and driving revenue growth.',
          experience1Title: 'Marketing Manager',
          experience1Company: 'Global Brands Co.',
          experience1Duration: '2020 - Present',
          experience1Desc: '• Managed $2M annual marketing budget across digital channels\n• Increased brand awareness by 45% through targeted campaigns\n• Led team of 5 marketing specialists',
          experience2Title: 'Digital Marketing Specialist',
          experience2Company: 'Creative Agency Inc.',
          experience2Duration: '2017 - 2020',
          experience2Desc: '• Executed SEO/SEM strategies improving organic traffic by 120%\n• Created content calendars and managed social media presence\n• Analyzed campaign performance and optimized ROI',
          education: 'MBA Marketing\nNYU Stern, 2017',
          skills: 'Digital Marketing, SEO/SEM, Social Media, Content Strategy, Analytics, Team Leadership, Google Ads, HubSpot',
        }
      }
      if (lowerPrompt.includes('data') || lowerPrompt.includes('analyst')) {
        return {
          fullName: 'Michael Chen',
          jobTitle: 'Data Analyst',
          email: 'michael.chen@email.com',
          phone: '(555) 456-7890',
          location: 'Chicago, IL',
          linkedin: 'linkedin.com/in/michaelchen',
          summary: 'Detail-oriented data analyst with 4+ years of experience transforming complex data into actionable insights. Proficient in SQL, Python, and data visualization tools.',
          experience1Title: 'Senior Data Analyst',
          experience1Company: 'Analytics Corp',
          experience1Duration: '2021 - Present',
          experience1Desc: '• Built dashboards tracking KPIs for executive leadership\n• Reduced reporting time by 70% through automation\n• Led cross-functional data projects',
          experience2Title: 'Data Analyst',
          experience2Company: 'Tech Insights LLC',
          experience2Duration: '2019 - 2021',
          experience2Desc: '• Analyzed customer behavior patterns improving retention by 25%\n• Created predictive models for sales forecasting\n• Collaborated with product team on feature optimization',
          education: 'M.S. Data Science\nUniversity of Chicago, 2019',
          skills: 'SQL, Python, R, Tableau, Power BI, Excel, Machine Learning, Statistical Analysis',
        }
      }
      if (lowerPrompt.includes('project') || lowerPrompt.includes('pm')) {
        return {
          fullName: 'Emily Davis',
          jobTitle: 'Project Manager',
          email: 'emily.davis@email.com',
          phone: '(555) 321-0987',
          location: 'Austin, TX',
          linkedin: 'linkedin.com/in/emilydavis',
          summary: 'PMP-certified project manager with 6+ years of experience delivering complex projects on time and within budget. Expert in Agile and Waterfall methodologies.',
          experience1Title: 'Senior Project Manager',
          experience1Company: 'Enterprise Solutions',
          experience1Duration: '2020 - Present',
          experience1Desc: '• Managed portfolio of 15+ concurrent projects worth $5M+\n• Achieved 95% on-time delivery rate\n• Implemented Agile transformation across 3 teams',
          experience2Title: 'Project Manager',
          experience2Company: 'Digital Ventures',
          experience2Duration: '2018 - 2020',
          experience2Desc: '• Led software development projects from inception to launch\n• Reduced project costs by 20% through process optimization\n• Coordinated cross-functional teams of 10-15 members',
          education: 'B.S. Business Administration\nUT Austin, 2018\nPMP Certified',
          skills: 'Project Management, Agile/Scrum, JIRA, MS Project, Risk Management, Stakeholder Management, Budget Planning',
        }
      }
    }

    // Cover letter generation
    if (template.category === 'letters') {
      if (lowerPrompt.includes('tech') || lowerPrompt.includes('software') || lowerPrompt.includes('developer')) {
        return {
          yourName: 'Alex Johnson',
          yourAddress: '123 Tech Lane\nSan Francisco, CA 94102',
          yourEmail: 'alex.johnson@email.com',
          yourPhone: '(555) 123-4567',
          hiringManager: 'Hiring Manager',
          opening: `I am writing to express my strong interest in the Software Engineer position at your company. With 5+ years of experience in full-stack development and a passion for building innovative solutions, I am confident I would be a valuable addition to your engineering team.`,
          body: `Throughout my career, I have successfully delivered scalable applications serving millions of users. At my current role, I led the development of a microservices architecture that improved system performance by 40%. I am particularly drawn to your company's commitment to innovation and would be excited to contribute to your next-generation products.`,
          closing: `I would welcome the opportunity to discuss how my technical skills and experience align with your needs. Thank you for considering my application. I look forward to hearing from you soon.`,
        }
      }
      return {
        yourName: 'Your Name',
        yourAddress: '123 Main Street\nYour City, State 12345',
        yourEmail: 'your.email@email.com',
        yourPhone: '(555) 000-0000',
        hiringManager: 'Hiring Manager',
        opening: `I am writing to express my strong interest in the position at your esteemed organization. With my background and passion for excellence, I am confident I would be a valuable addition to your team.`,
        body: `Throughout my career, I have consistently demonstrated my ability to deliver results and exceed expectations. I am particularly drawn to your company's innovative approach and commitment to quality. My experience has equipped me with the skills necessary to contribute meaningfully to your organization's goals.`,
        closing: `I would welcome the opportunity to discuss how my skills and experience align with your needs. Thank you for considering my application. I look forward to hearing from you soon.`,
      }
    }

    // Business proposal
    if (template.category === 'business') {
      if (lowerPrompt.includes('web') || lowerPrompt.includes('website') || lowerPrompt.includes('development')) {
        return {
          proposalTitle: 'Website Development Proposal',
          companyName: 'Your Company Name',
          companyEmail: 'contact@yourcompany.com',
          clientName: 'Client Name',
          executiveSummary: 'We propose to develop a modern, responsive website that will enhance your online presence, improve user engagement, and drive business growth through cutting-edge technology.',
          problemStatement: 'Your current website lacks modern features, mobile responsiveness, and optimal performance, leading to decreased user engagement and potential loss of customers.',
          proposedSolution: 'Our solution includes a complete website redesign using React/Next.js, mobile-first design approach, SEO optimization, and integration with your existing systems.',
          deliverables: '• Custom website design mockups\n• Responsive front-end development\n• CMS integration\n• SEO optimization\n• Performance optimization\n• Training documentation',
          timeline: 'Week 1-2: Discovery & Design\nWeek 3-4: Development\nWeek 5: Testing & QA\nWeek 6: Launch & Support',
          investment: 'Total Project Investment: $15,000\n- Design Phase: $4,000\n- Development: $9,000\n- Testing & Launch: $2,000',
          whyUs: 'With over 10 years of experience and 200+ successful projects, we have the expertise and track record to deliver exceptional results on time and within budget.',
          contactName: 'Project Lead',
          contactEmail: 'projects@yourcompany.com',
        }
      }
      if (lowerPrompt.includes('marketing') || lowerPrompt.includes('campaign')) {
        return {
          proposalTitle: 'Digital Marketing Campaign Proposal',
          companyName: 'Your Marketing Agency',
          companyEmail: 'hello@youragency.com',
          clientName: 'Client Name',
          executiveSummary: 'We propose a comprehensive digital marketing campaign designed to increase brand awareness, drive qualified leads, and maximize your ROI across multiple channels.',
          problemStatement: 'Current marketing efforts lack cohesive strategy, resulting in inconsistent brand messaging, low engagement rates, and missed opportunities for customer acquisition.',
          proposedSolution: 'Our integrated approach combines SEO, paid advertising, content marketing, and social media management to create a unified brand presence that resonates with your target audience.',
          deliverables: '• Market research & competitor analysis\n• Campaign strategy document\n• Content calendar (3 months)\n• Ad creatives & copy\n• Monthly performance reports\n• Optimization recommendations',
          timeline: 'Month 1: Research & Strategy\nMonth 2-3: Campaign Launch & Optimization\nOngoing: Performance Monitoring & Reporting',
          investment: 'Monthly Retainer: $5,000\nIncludes:\n- Strategy & Planning: $1,500\n- Content Creation: $2,000\n- Ad Management: $1,500',
          whyUs: 'Our data-driven approach has helped 100+ businesses achieve an average 3x ROI on their marketing investment.',
          contactName: 'Account Manager',
          contactEmail: 'accounts@youragency.com',
        }
      }
      return {
        proposalTitle: 'Business Proposal',
        companyName: 'Your Company',
        companyEmail: 'contact@yourcompany.com',
        clientName: 'Client Name',
        executiveSummary: 'We propose a comprehensive solution designed to meet your specific needs and drive measurable results. Our approach combines industry best practices with innovative strategies.',
        problemStatement: 'Based on our analysis, the current challenges include inefficient processes, lack of scalability, and missed opportunities for growth.',
        proposedSolution: 'Our solution addresses these challenges through a phased implementation approach, leveraging cutting-edge technology and proven methodologies.',
        deliverables: '• Initial assessment report\n• Implementation roadmap\n• Core solution delivery\n• Training & documentation\n• Ongoing support',
        timeline: 'Phase 1: Discovery (2 weeks)\nPhase 2: Implementation (4 weeks)\nPhase 3: Testing (1 week)\nPhase 4: Launch (1 week)',
        investment: 'Total Investment: $XX,XXX\nDetailed breakdown available upon request.',
        whyUs: 'With over 10 years of experience and 200+ successful projects, we have the expertise and track record to deliver exceptional results.',
        contactName: 'Your Name',
        contactEmail: 'your.email@company.com',
      }
    }

    // Contract generation
    if (template.category === 'contracts') {
      if (lowerPrompt.includes('freelance') || lowerPrompt.includes('web') || lowerPrompt.includes('development')) {
        return {
          freelancerName: 'Your Name',
          clientName: 'Client Name',
          clientEmail: 'client@example.com',
          clientAddress: '123 Client Street\nCity, State 12345',
          projectTitle: 'Web Development Project',
          projectDescription: 'Design and development of a responsive website including homepage, about page, services page, contact page, and blog section. Includes CMS integration and basic SEO optimization.',
          startDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          endDate: new Date(Date.now() + 60*24*60*60*1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          totalAmount: '5,000',
          paymentTerms: '50% upfront ($2,500), 50% upon completion ($2,500)',
        }
      }
      return {
        freelancerName: 'Your Name',
        clientName: 'Client Name',
        clientEmail: 'client@example.com',
        projectTitle: 'Project Title',
        projectDescription: 'Detailed description of the project scope, deliverables, and expectations.',
        startDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        endDate: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        totalAmount: '0',
        paymentTerms: '50% upfront, 50% on completion',
      }
    }

    // Invoice generation
    if (template.category === 'invoices') {
      return {
        companyName: 'Your Company Name',
        companyAddress: '123 Business Ave\nYour City, State 12345',
        companyEmail: 'billing@yourcompany.com',
        clientName: 'Client Name',
        clientAddress: '456 Client Street\nClient City, State 67890',
        clientEmail: 'client@example.com',
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        invoiceDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        dueDate: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        item1Description: 'Professional Services',
        item1Amount: '1,500',
        item2Description: 'Additional Services',
        item2Amount: '500',
        notes: 'Payment due within 30 days. Please include invoice number with your payment.',
      }
    }

    // HR documents
    if (template.category === 'hr') {
      return {
        companyName: 'Your Company Name',
        companyAddress: '123 Corporate Drive\nCity, State 12345',
        candidateName: 'Candidate Name',
        jobTitle: 'Position Title',
        department: 'Department Name',
        salary: '75,000',
        employmentType: 'Full-time',
        startDate: new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        reportingTo: 'Manager Name, Title',
        hrName: 'HR Manager Name',
      }
    }

    // Default - return empty
    return {}
  }

  // AI Suggestions based on template type
  const getAiSuggestions = (): string[] => {
    switch (template.category) {
      case 'resume':
        return [
          'Software Engineer resume',
          'Marketing Manager resume',
          'Project Manager resume',
          'Data Analyst resume'
        ]
      case 'letters':
        return [
          'Cover letter for tech job',
          'Professional introduction letter',
          'Follow-up letter after interview',
          'Thank you letter'
        ]
      case 'business':
        return [
          'Website development proposal',
          'Marketing campaign proposal',
          'Consulting services proposal',
          'Partnership proposal'
        ]
      case 'contracts':
        return [
          'Freelance web development',
          'Consulting services contract',
          'Design project contract',
          'Monthly retainer contract'
        ]
      case 'invoices':
        return [
          'Generate invoice',
          'Professional services invoice',
          'Project milestone invoice',
          'Monthly retainer invoice'
        ]
      case 'hr':
        return [
          'Job offer letter',
          'Employment contract',
          'Performance review',
          'Termination letter'
        ]
      case 'agreements':
        return [
          'NDA agreement',
          'Partnership agreement',
          'Service agreement',
          'Licensing agreement'
        ]
      case 'legal':
        return [
          'Power of attorney',
          'Release of liability',
          'Terms of service',
          'Privacy policy'
        ]
      case 'real-estate':
        return [
          'Residential lease',
          'Commercial lease',
          'Rental application',
          'Property management'
        ]
      case 'planning':
        return [
          'Project budget',
          'Meeting agenda',
          'Project checklist',
          'Quarterly plan'
        ]
      default:
        return [
          'Generate professional content',
          'Create formal document',
          'Write business content'
        ]
    }
  }

  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const downloadRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setShowDownloadOptions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle download
  const handleDownload = (format: 'pdf' | 'html' | 'print' = 'pdf') => {
    setShowDownloadOptions(false)

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${template.name}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 40px; font-family: Arial, sans-serif; background: white; }
    @media print {
      body { padding: 20px; }
      @page { margin: 0.5in; }
    }
  </style>
</head>
<body>${documentHtml}</body>
</html>`

    if (format === 'print' || format === 'pdf') {
      // Open in new window for print/PDF
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(fullHtml)
        printWindow.document.close()
        printWindow.focus()

        // Wait for content to load then print
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
    } else if (format === 'html') {
      // Download as HTML file
      const blob = new Blob([fullHtml], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${template.name.replace(/\s+/g, '_')}.html`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  // Proceed to sign
  const handleProceedToSign = () => {
    onComplete(documentHtml, template)
  }

  // Render field input
  const renderFieldInput = (field: TemplateField) => {
    const value = formData[field.name] || ''

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          rows={3}
        />
      )
    }

    if (field.type === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select {field.label}</option>
          {field.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )
    }

    return (
      <input
        type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        value={value}
        onChange={(e) => handleFieldChange(field.name, e.target.value)}
        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Top Header Bar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-gray-400">|</span>
          <span className="font-medium text-gray-900">{template.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={downloadRef}>
            <button
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              Download
              <ChevronDown className={`w-4 h-4 transition-transform ${showDownloadOptions ? 'rotate-180' : ''}`} />
            </button>

            {/* Download Options Dropdown */}
            {showDownloadOptions && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <button
                  onClick={() => handleDownload('pdf')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Download PDF</p>
                    <p className="text-xs text-gray-500">Best for sharing</p>
                  </div>
                </button>
                <button
                  onClick={() => handleDownload('html')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Download HTML</p>
                    <p className="text-xs text-gray-500">Editable format</p>
                  </div>
                </button>
                <button
                  onClick={() => handleDownload('print')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Copy className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Print</p>
                    <p className="text-xs text-gray-500">Print directly</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - AI Generator & Fields */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Back Button */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
          </div>

          {/* Editable Doc Info */}
          <div className="p-4 border-b border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Here is your editable doc</p>
          </div>

          {/* AI Generator Panel */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium">{categoryLabels[template.category]} Generator</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAiPanel ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* AI Input Area */}
          {showAiPanel && (
            <div className="p-4 border-b border-gray-200">
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-primary-300 transition-colors">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={`Describe your ${categoryLabels[template.category].toLowerCase()}...\n\nExample: "Senior software engineer with 5 years experience in React and Node.js"`}
                  className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none border-none focus:ring-0 focus:outline-none bg-transparent"
                  rows={4}
                />

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                      <Globe className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAiGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white text-sm rounded-full transition-colors flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {getAiSuggestions().map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAiPrompt(suggestion)}
                      className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="flex-1 overflow-auto p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Edit Fields</h3>
            <div className="space-y-4">
              {template.fields.map(field => (
                <div key={field.id}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  {renderFieldInput(field)}
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Bottom Action Button */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={() => handleDownload('pdf')}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              Download Template
            </button>
          </div>
        </div>

        {/* Center - Document Editor */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-1">
            <button
              onClick={() => execCommand('undo')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCommand('redo')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <select
              className="px-2 py-1.5 text-sm border border-gray-200 rounded hover:border-gray-300 focus:ring-2 focus:ring-primary-500"
              onChange={(e) => execCommand('fontName', e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button
              onClick={() => execCommand('bold')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCommand('italic')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCommand('underline')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button
              onClick={() => execCommand('insertUnorderedList')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCommand('insertOrderedList')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button
              onClick={() => {
                const url = prompt('Enter URL:')
                if (url) execCommand('createLink', url)
              }}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
              title="Insert Link"
            >
              <Link2 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button
              onClick={() => navigator.clipboard.writeText(documentHtml)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* Document Preview/Editor Area */}
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-4xl mx-auto">
              <div
                ref={editorRef}
                className="bg-white shadow-xl rounded-lg overflow-hidden min-h-[800px]"
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  // Could capture edits here if needed
                }}
                dangerouslySetInnerHTML={{ __html: documentHtml }}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Your Feedback (optional, like template.net) */}
        <div className="w-12 bg-white border-l border-gray-200 flex flex-col items-center py-4">
          <button
            className="w-8 h-24 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-200 transition-colors"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            <span className="text-xs font-medium">Your Feedback</span>
          </button>
        </div>
      </div>

      {/* Floating Download CTA - Always Visible */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <button
          onClick={() => handleDownload('pdf')}
          className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transition-all flex items-center gap-3 font-bold shadow-2xl hover:shadow-green-500/30 hover:scale-105 transform"
        >
          <Download className="w-6 h-6" />
          <span className="text-lg">Download Template</span>
        </button>
      </div>
    </div>
  )
}

export default TemplateEditor
