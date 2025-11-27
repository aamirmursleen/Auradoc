// Template types and data for document templates

export interface TemplateField {
  id: string
  name: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'number' | 'email' | 'phone' | 'select'
  placeholder?: string
  required: boolean
  options?: string[] // For select type
  defaultValue?: string
}

export interface DocumentTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  icon: string // Lucide icon name
  previewImage?: string
  fields: TemplateField[]
  content: string // HTML template content with {{fieldName}} placeholders
  popular?: boolean
  new?: boolean
}

export type TemplateCategory =
  | 'contracts'
  | 'agreements'
  | 'invoices'
  | 'hr'
  | 'real-estate'
  | 'legal'
  | 'resume'
  | 'letters'
  | 'business'
  | 'planning'

export const categoryLabels: Record<TemplateCategory, string> = {
  'contracts': 'Contracts',
  'agreements': 'Agreements',
  'invoices': 'Invoices',
  'hr': 'HR & Employment',
  'real-estate': 'Real Estate',
  'legal': 'Legal',
  'resume': 'Resume & CV',
  'letters': 'Letters',
  'business': 'Business',
  'planning': 'Planning'
}

export const categoryIcons: Record<TemplateCategory, string> = {
  'contracts': 'FileText',
  'agreements': 'FileCheck',
  'invoices': 'Receipt',
  'hr': 'Users',
  'real-estate': 'Home',
  'legal': 'Scale',
  'resume': 'User',
  'letters': 'Mail',
  'business': 'Briefcase',
  'planning': 'ClipboardList'
}

export const templates: DocumentTemplate[] = [
  // ==================== RESUME & CV ====================
  {
    id: 'executive-resume',
    name: 'Executive Resume',
    description: 'Premium executive-level resume for C-suite and senior management positions.',
    category: 'resume',
    icon: 'User',
    popular: true,
    fields: [
      { id: 'fullName', name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { id: 'title', name: 'title', label: 'Executive Title', type: 'text', placeholder: 'Chief Executive Officer', required: true },
      { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
      { id: 'phone', name: 'phone', label: 'Phone', type: 'phone', required: true },
      { id: 'linkedin', name: 'linkedin', label: 'LinkedIn', type: 'text', required: false },
      { id: 'summary', name: 'summary', label: 'Executive Summary', type: 'textarea', required: true },
      { id: 'achievements', name: 'achievements', label: 'Key Achievements', type: 'textarea', required: true },
      { id: 'experience', name: 'experience', label: 'Executive Experience', type: 'textarea', required: true },
      { id: 'education', name: 'education', label: 'Education', type: 'textarea', required: true },
      { id: 'boardPositions', name: 'boardPositions', label: 'Board Positions (optional)', type: 'textarea', required: false },
    ],
    content: '<div style="font-family: Georgia, serif; max-width: 850px; margin: 0 auto; padding: 50px; background: white;"><div style="border-bottom: 4px solid #1a365d; padding-bottom: 30px; margin-bottom: 30px;"><h1 style="font-size: 42px; color: #1a365d; margin: 0; font-weight: 400; letter-spacing: 2px;">{{fullName}}</h1><p style="font-size: 20px; color: #718096; margin: 10px 0 20px 0; text-transform: uppercase; letter-spacing: 3px;">{{title}}</p><div style="display: flex; gap: 25px; font-size: 14px; color: #4a5568;"><span>{{email}}</span><span>|</span><span>{{phone}}</span><span>|</span><span>{{linkedin}}</span></div></div><div style="margin-bottom: 35px;"><h2 style="font-size: 14px; color: #1a365d; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 15px; font-weight: 600;">Executive Summary</h2><p style="color: #2d3748; line-height: 1.9; font-size: 15px;">{{summary}}</p></div><div style="margin-bottom: 35px; background: #f7fafc; padding: 25px; border-left: 4px solid #1a365d;"><h2 style="font-size: 14px; color: #1a365d; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 15px 0; font-weight: 600;">Key Achievements</h2><p style="color: #2d3748; line-height: 1.9; font-size: 15px; white-space: pre-line; margin: 0;">{{achievements}}</p></div><div style="margin-bottom: 35px;"><h2 style="font-size: 14px; color: #1a365d; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 15px; font-weight: 600;">Executive Experience</h2><p style="color: #2d3748; line-height: 1.9; font-size: 15px; white-space: pre-line;">{{experience}}</p></div><div style="display: flex; gap: 40px;"><div style="flex: 1;"><h2 style="font-size: 14px; color: #1a365d; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 15px; font-weight: 600;">Education</h2><p style="color: #2d3748; line-height: 1.8; font-size: 14px; white-space: pre-line;">{{education}}</p></div><div style="flex: 1;"><h2 style="font-size: 14px; color: #1a365d; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 15px; font-weight: 600;">Board Positions</h2><p style="color: #2d3748; line-height: 1.8; font-size: 14px; white-space: pre-line;">{{boardPositions}}</p></div></div></div>'
  },
  {
    id: 'creative-resume',
    name: 'Creative Resume',
    description: 'Bold, colorful resume design for creative professionals and designers.',
    category: 'resume',
    icon: 'User',
    new: true,
    fields: [
      { id: 'fullName', name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { id: 'title', name: 'title', label: 'Job Title', type: 'text', required: true },
      { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
      { id: 'phone', name: 'phone', label: 'Phone', type: 'phone', required: true },
      { id: 'portfolio', name: 'portfolio', label: 'Portfolio URL', type: 'text', required: false },
      { id: 'about', name: 'about', label: 'About Me', type: 'textarea', required: true },
      { id: 'skills', name: 'skills', label: 'Skills', type: 'textarea', required: true },
      { id: 'experience', name: 'experience', label: 'Experience', type: 'textarea', required: true },
      { id: 'education', name: 'education', label: 'Education', type: 'text', required: true },
      { id: 'interests', name: 'interests', label: 'Interests', type: 'text', required: false },
    ],
    content: '<div style="font-family: Poppins, Arial, sans-serif; max-width: 850px; margin: 0 auto; display: flex; background: white; min-height: 600px;"><div style="width: 35%; background: linear-gradient(180deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px;"><div style="text-align: center; margin-bottom: 40px;"><div style="width: 120px; height: 120px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: 700;">{{fullName}}</div><h1 style="font-size: 24px; margin: 0 0 5px 0; font-weight: 600;">{{fullName}}</h1><p style="font-size: 14px; opacity: 0.9; margin: 0;">{{title}}</p></div><div style="margin-bottom: 30px;"><h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px;">Contact</h3><p style="font-size: 13px; margin: 8px 0;">{{email}}</p><p style="font-size: 13px; margin: 8px 0;">{{phone}}</p><p style="font-size: 13px; margin: 8px 0;">{{portfolio}}</p></div><div style="margin-bottom: 30px;"><h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px;">Skills</h3><p style="font-size: 13px; line-height: 2; white-space: pre-line;">{{skills}}</p></div><div><h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px;">Interests</h3><p style="font-size: 13px;">{{interests}}</p></div></div><div style="width: 65%; padding: 40px;"><div style="margin-bottom: 35px;"><h2 style="font-size: 18px; color: #667eea; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; border-bottom: 3px solid #667eea; padding-bottom: 10px; display: inline-block;">About Me</h2><p style="color: #444; line-height: 1.8; font-size: 14px;">{{about}}</p></div><div style="margin-bottom: 35px;"><h2 style="font-size: 18px; color: #667eea; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; border-bottom: 3px solid #667eea; padding-bottom: 10px; display: inline-block;">Experience</h2><p style="color: #444; line-height: 1.8; font-size: 14px; white-space: pre-line;">{{experience}}</p></div><div><h2 style="font-size: 18px; color: #667eea; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; border-bottom: 3px solid #667eea; padding-bottom: 10px; display: inline-block;">Education</h2><p style="color: #444; line-height: 1.8; font-size: 14px;">{{education}}</p></div></div></div>'
  },
  {
    id: 'minimal-resume',
    name: 'Minimal Resume',
    description: 'Clean, minimalist resume with focus on content. Perfect for tech and corporate.',
    category: 'resume',
    icon: 'User',
    fields: [
      { id: 'fullName', name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { id: 'title', name: 'title', label: 'Professional Title', type: 'text', required: true },
      { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
      { id: 'phone', name: 'phone', label: 'Phone', type: 'phone', required: true },
      { id: 'location', name: 'location', label: 'Location', type: 'text', required: true },
      { id: 'website', name: 'website', label: 'Website/GitHub', type: 'text', required: false },
      { id: 'summary', name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { id: 'experience', name: 'experience', label: 'Work Experience', type: 'textarea', required: true },
      { id: 'skills', name: 'skills', label: 'Technical Skills', type: 'textarea', required: true },
      { id: 'education', name: 'education', label: 'Education', type: 'text', required: true },
    ],
    content: '<div style="font-family: Inter, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 50px; background: white;"><header style="margin-bottom: 40px;"><h1 style="font-size: 36px; font-weight: 700; color: #111; margin: 0 0 8px 0;">{{fullName}}</h1><p style="font-size: 18px; color: #666; margin: 0 0 20px 0;">{{title}}</p><div style="display: flex; flex-wrap: wrap; gap: 20px; font-size: 14px; color: #888;"><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span><span>{{website}}</span></div></header><section style="margin-bottom: 35px;"><p style="font-size: 15px; color: #444; line-height: 1.8; border-left: 3px solid #111; padding-left: 20px;">{{summary}}</p></section><section style="margin-bottom: 35px;"><h2 style="font-size: 13px; font-weight: 600; color: #111; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">Experience</h2><div style="color: #444; line-height: 1.8; font-size: 14px; white-space: pre-line;">{{experience}}</div></section><section style="margin-bottom: 35px;"><h2 style="font-size: 13px; font-weight: 600; color: #111; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">Skills</h2><p style="color: #444; line-height: 1.8; font-size: 14px; white-space: pre-line;">{{skills}}</p></section><section><h2 style="font-size: 13px; font-weight: 600; color: #111; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">Education</h2><p style="color: #444; line-height: 1.8; font-size: 14px;">{{education}}</p></section></div>'
  },
  {
    id: 'academic-cv',
    name: 'Academic CV',
    description: 'Comprehensive CV for academics, researchers, and professors.',
    category: 'resume',
    icon: 'User',
    fields: [
      { id: 'fullName', name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { id: 'title', name: 'title', label: 'Academic Title', type: 'text', placeholder: 'Ph.D., Associate Professor', required: true },
      { id: 'institution', name: 'institution', label: 'Institution', type: 'text', required: true },
      { id: 'department', name: 'department', label: 'Department', type: 'text', required: true },
      { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
      { id: 'researchInterests', name: 'researchInterests', label: 'Research Interests', type: 'textarea', required: true },
      { id: 'education', name: 'education', label: 'Education', type: 'textarea', required: true },
      { id: 'publications', name: 'publications', label: 'Selected Publications', type: 'textarea', required: true },
      { id: 'awards', name: 'awards', label: 'Awards & Grants', type: 'textarea', required: false },
      { id: 'teaching', name: 'teaching', label: 'Teaching Experience', type: 'textarea', required: true },
    ],
    content: '<div style="font-family: Cambria, Georgia, serif; max-width: 800px; margin: 0 auto; padding: 50px; background: white;"><header style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #2c5282; padding-bottom: 30px;"><h1 style="font-size: 32px; color: #1a202c; margin: 0 0 5px 0;">{{fullName}}</h1><p style="font-size: 16px; color: #2c5282; margin: 0 0 15px 0;">{{title}}</p><p style="font-size: 14px; color: #4a5568; margin: 0;">{{department}} | {{institution}}</p><p style="font-size: 14px; color: #718096; margin: 5px 0 0 0;">{{email}}</p></header><section style="margin-bottom: 30px;"><h2 style="font-size: 16px; color: #2c5282; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">Research Interests</h2><p style="color: #2d3748; line-height: 1.7; font-size: 14px;">{{researchInterests}}</p></section><section style="margin-bottom: 30px;"><h2 style="font-size: 16px; color: #2c5282; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">Education</h2><p style="color: #2d3748; line-height: 1.8; font-size: 14px; white-space: pre-line;">{{education}}</p></section><section style="margin-bottom: 30px;"><h2 style="font-size: 16px; color: #2c5282; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">Selected Publications</h2><p style="color: #2d3748; line-height: 1.8; font-size: 14px; white-space: pre-line;">{{publications}}</p></section><section style="margin-bottom: 30px;"><h2 style="font-size: 16px; color: #2c5282; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">Awards & Grants</h2><p style="color: #2d3748; line-height: 1.8; font-size: 14px; white-space: pre-line;">{{awards}}</p></section><section><h2 style="font-size: 16px; color: #2c5282; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">Teaching Experience</h2><p style="color: #2d3748; line-height: 1.8; font-size: 14px; white-space: pre-line;">{{teaching}}</p></section></div>'
  },
  {
    id: 'professional-resume',
    name: 'Professional Resume',
    description: 'Clean, modern resume template perfect for any industry. ATS-friendly design.',
    category: 'resume',
    icon: 'User',
    popular: true,
    fields: [
      { id: 'fullName', name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Smith', required: true },
      { id: 'jobTitle', name: 'jobTitle', label: 'Professional Title', type: 'text', placeholder: 'Senior Software Engineer', required: true },
      { id: 'email', name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com', required: true },
      { id: 'phone', name: 'phone', label: 'Phone', type: 'phone', placeholder: '(555) 123-4567', required: true },
      { id: 'location', name: 'location', label: 'Location', type: 'text', placeholder: 'New York, NY', required: true },
      { id: 'linkedin', name: 'linkedin', label: 'LinkedIn URL', type: 'text', placeholder: 'linkedin.com/in/johnsmith', required: false },
      { id: 'summary', name: 'summary', label: 'Professional Summary', type: 'textarea', placeholder: 'Experienced professional with...', required: true },
      { id: 'experience1Title', name: 'experience1Title', label: 'Job Title 1', type: 'text', placeholder: 'Senior Developer', required: true },
      { id: 'experience1Company', name: 'experience1Company', label: 'Company 1', type: 'text', placeholder: 'Tech Corp', required: true },
      { id: 'experience1Duration', name: 'experience1Duration', label: 'Duration 1', type: 'text', placeholder: '2020 - Present', required: true },
      { id: 'experience1Desc', name: 'experience1Desc', label: 'Description 1', type: 'textarea', placeholder: 'Key achievements and responsibilities...', required: true },
      { id: 'experience2Title', name: 'experience2Title', label: 'Job Title 2', type: 'text', placeholder: 'Developer', required: false },
      { id: 'experience2Company', name: 'experience2Company', label: 'Company 2', type: 'text', placeholder: 'StartUp Inc', required: false },
      { id: 'experience2Duration', name: 'experience2Duration', label: 'Duration 2', type: 'text', placeholder: '2018 - 2020', required: false },
      { id: 'experience2Desc', name: 'experience2Desc', label: 'Description 2', type: 'textarea', placeholder: 'Key achievements...', required: false },
      { id: 'education', name: 'education', label: 'Education', type: 'textarea', placeholder: 'BS Computer Science, MIT, 2018', required: true },
      { id: 'skills', name: 'skills', label: 'Skills', type: 'textarea', placeholder: 'JavaScript, React, Node.js, Python', required: true },
    ],
    content: '<div style="font-family: \'Segoe UI\', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;"><div style="border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 25px;"><h1 style="font-size: 32px; color: #1a1a1a; margin: 0 0 5px 0; font-weight: 700;">{{fullName}}</h1><p style="font-size: 18px; color: #2563eb; margin: 0 0 15px 0; font-weight: 500;">{{jobTitle}}</p><div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 14px; color: #555;"><span>{{email}}</span><span>|</span><span>{{phone}}</span><span>|</span><span>{{location}}</span><span>|</span><span>{{linkedin}}</span></div></div><div style="margin-bottom: 25px;"><h2 style="font-size: 16px; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px;">Professional Summary</h2><p style="color: #444; line-height: 1.6; margin: 0;">{{summary}}</p></div><div style="margin-bottom: 25px;"><h2 style="font-size: 16px; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Experience</h2><div style="margin-bottom: 20px;"><div style="display: flex; justify-content: space-between; align-items: baseline;"><h3 style="font-size: 16px; color: #1a1a1a; margin: 0;">{{experience1Title}}</h3><span style="color: #666; font-size: 14px;">{{experience1Duration}}</span></div><p style="color: #2563eb; margin: 3px 0 8px 0; font-weight: 500;">{{experience1Company}}</p><p style="color: #444; line-height: 1.6; margin: 0;">{{experience1Desc}}</p></div><div style="margin-bottom: 20px;"><div style="display: flex; justify-content: space-between; align-items: baseline;"><h3 style="font-size: 16px; color: #1a1a1a; margin: 0;">{{experience2Title}}</h3><span style="color: #666; font-size: 14px;">{{experience2Duration}}</span></div><p style="color: #2563eb; margin: 3px 0 8px 0; font-weight: 500;">{{experience2Company}}</p><p style="color: #444; line-height: 1.6; margin: 0;">{{experience2Desc}}</p></div></div><div style="margin-bottom: 25px;"><h2 style="font-size: 16px; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px;">Education</h2><p style="color: #444; line-height: 1.6; margin: 0;">{{education}}</p></div><div><h2 style="font-size: 16px; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px;">Skills</h2><p style="color: #444; line-height: 1.6; margin: 0;">{{skills}}</p></div></div>'
  },
  {
    id: 'modern-cv',
    name: 'Modern CV Template',
    description: 'Stylish two-column CV with sidebar design. Perfect for creative professionals.',
    category: 'resume',
    icon: 'User',
    new: true,
    fields: [
      { id: 'fullName', name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { id: 'jobTitle', name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
      { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
      { id: 'phone', name: 'phone', label: 'Phone', type: 'phone', required: true },
      { id: 'address', name: 'address', label: 'Address', type: 'text', required: true },
      { id: 'website', name: 'website', label: 'Website/Portfolio', type: 'text', required: false },
      { id: 'about', name: 'about', label: 'About Me', type: 'textarea', required: true },
      { id: 'experience', name: 'experience', label: 'Work Experience', type: 'textarea', required: true },
      { id: 'education', name: 'education', label: 'Education', type: 'textarea', required: true },
      { id: 'skills', name: 'skills', label: 'Skills', type: 'textarea', required: true },
      { id: 'languages', name: 'languages', label: 'Languages', type: 'text', placeholder: 'English, Spanish', required: false },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; display: flex; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1);"><div style="width: 35%; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px;"><div style="text-align: center; margin-bottom: 30px;"><div style="width: 100px; height: 100px; background: white; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 40px; color: #1e3a5f;">{{fullName}}</div><h1 style="font-size: 22px; margin: 0 0 5px 0;">{{fullName}}</h1><p style="font-size: 14px; opacity: 0.9; margin: 0;">{{jobTitle}}</p></div><div style="margin-bottom: 25px;"><h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px; margin-bottom: 15px;">Contact</h3><p style="font-size: 13px; margin: 8px 0;">{{email}}</p><p style="font-size: 13px; margin: 8px 0;">{{phone}}</p><p style="font-size: 13px; margin: 8px 0;">{{address}}</p><p style="font-size: 13px; margin: 8px 0;">{{website}}</p></div><div style="margin-bottom: 25px;"><h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px; margin-bottom: 15px;">Skills</h3><p style="font-size: 13px; line-height: 1.8;">{{skills}}</p></div><div><h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px; margin-bottom: 15px;">Languages</h3><p style="font-size: 13px;">{{languages}}</p></div></div><div style="width: 65%; padding: 30px;"><div style="margin-bottom: 25px;"><h2 style="font-size: 18px; color: #1e3a5f; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px; margin-bottom: 15px;">About Me</h2><p style="color: #444; line-height: 1.7; font-size: 14px;">{{about}}</p></div><div style="margin-bottom: 25px;"><h2 style="font-size: 18px; color: #1e3a5f; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px; margin-bottom: 15px;">Experience</h2><p style="color: #444; line-height: 1.7; font-size: 14px; white-space: pre-line;">{{experience}}</p></div><div><h2 style="font-size: 18px; color: #1e3a5f; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px; margin-bottom: 15px;">Education</h2><p style="color: #444; line-height: 1.7; font-size: 14px; white-space: pre-line;">{{education}}</p></div></div></div>'
  },

  // ==================== COVER LETTERS ====================
  {
    id: 'professional-cover-letter',
    name: 'Professional Cover Letter',
    description: 'Clean, professional cover letter template for job applications.',
    category: 'letters',
    icon: 'Mail',
    popular: true,
    fields: [
      { id: 'yourName', name: 'yourName', label: 'Your Name', type: 'text', required: true },
      { id: 'yourAddress', name: 'yourAddress', label: 'Your Address', type: 'textarea', required: true },
      { id: 'yourEmail', name: 'yourEmail', label: 'Your Email', type: 'email', required: true },
      { id: 'yourPhone', name: 'yourPhone', label: 'Your Phone', type: 'phone', required: true },
      { id: 'date', name: 'date', label: 'Date', type: 'date', required: true },
      { id: 'hiringManager', name: 'hiringManager', label: 'Hiring Manager Name', type: 'text', placeholder: 'Mr./Ms. Name', required: true },
      { id: 'companyName', name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { id: 'companyAddress', name: 'companyAddress', label: 'Company Address', type: 'textarea', required: true },
      { id: 'jobTitle', name: 'jobTitle', label: 'Position Applied For', type: 'text', required: true },
      { id: 'opening', name: 'opening', label: 'Opening Paragraph', type: 'textarea', placeholder: 'I am writing to express my interest in...', required: true },
      { id: 'body', name: 'body', label: 'Main Body', type: 'textarea', placeholder: 'My experience includes...', required: true },
      { id: 'closing', name: 'closing', label: 'Closing Paragraph', type: 'textarea', placeholder: 'I look forward to discussing...', required: true },
    ],
    content: '<div style="font-family: Georgia, serif; max-width: 700px; margin: 0 auto; padding: 50px; background: white; line-height: 1.8;"><div style="margin-bottom: 30px;"><p style="margin: 0; font-weight: 600;">{{yourName}}</p><p style="margin: 0; white-space: pre-line; color: #555; font-size: 14px;">{{yourAddress}}</p><p style="margin: 0; color: #555; font-size: 14px;">{{yourEmail}} | {{yourPhone}}</p></div><p style="margin: 0 0 30px 0; color: #555;">{{date}}</p><div style="margin-bottom: 30px;"><p style="margin: 0; font-weight: 600;">{{hiringManager}}</p><p style="margin: 0; font-weight: 600;">{{companyName}}</p><p style="margin: 0; white-space: pre-line; color: #555; font-size: 14px;">{{companyAddress}}</p></div><p style="margin: 0 0 20px 0;"><strong>RE: Application for {{jobTitle}}</strong></p><p style="margin: 0 0 20px 0;">Dear {{hiringManager}},</p><p style="margin: 0 0 20px 0; text-align: justify;">{{opening}}</p><p style="margin: 0 0 20px 0; text-align: justify;">{{body}}</p><p style="margin: 0 0 30px 0; text-align: justify;">{{closing}}</p><p style="margin: 0 0 5px 0;">Sincerely,</p><p style="margin: 40px 0 0 0; font-weight: 600;">{{yourName}}</p></div>'
  },
  {
    id: 'formal-letter',
    name: 'Formal Business Letter',
    description: 'Traditional formal letter format for official business correspondence.',
    category: 'letters',
    icon: 'Mail',
    fields: [
      { id: 'senderName', name: 'senderName', label: 'Sender Name', type: 'text', required: true },
      { id: 'senderAddress', name: 'senderAddress', label: 'Sender Address', type: 'textarea', required: true },
      { id: 'date', name: 'date', label: 'Date', type: 'date', required: true },
      { id: 'recipientName', name: 'recipientName', label: 'Recipient Name', type: 'text', required: true },
      { id: 'recipientTitle', name: 'recipientTitle', label: 'Recipient Title', type: 'text', required: false },
      { id: 'recipientCompany', name: 'recipientCompany', label: 'Recipient Company', type: 'text', required: true },
      { id: 'recipientAddress', name: 'recipientAddress', label: 'Recipient Address', type: 'textarea', required: true },
      { id: 'subject', name: 'subject', label: 'Subject', type: 'text', required: true },
      { id: 'body', name: 'body', label: 'Letter Body', type: 'textarea', required: true },
      { id: 'closing', name: 'closing', label: 'Closing', type: 'select', options: ['Sincerely', 'Best regards', 'Respectfully', 'Yours truly'], required: true },
    ],
    content: '<div style="font-family: Times New Roman, serif; max-width: 700px; margin: 0 auto; padding: 50px; background: white; line-height: 1.8;"><div style="text-align: right; margin-bottom: 30px;"><p style="margin: 0; font-weight: bold;">{{senderName}}</p><p style="margin: 0; white-space: pre-line;">{{senderAddress}}</p><p style="margin: 15px 0 0 0;">{{date}}</p></div><div style="margin-bottom: 30px;"><p style="margin: 0;">{{recipientName}}</p><p style="margin: 0;">{{recipientTitle}}</p><p style="margin: 0;">{{recipientCompany}}</p><p style="margin: 0; white-space: pre-line;">{{recipientAddress}}</p></div><p style="margin: 0 0 20px 0;"><strong>Subject: {{subject}}</strong></p><p style="margin: 0 0 20px 0;">Dear {{recipientName}},</p><p style="margin: 0 0 30px 0; text-align: justify; white-space: pre-line;">{{body}}</p><p style="margin: 0 0 40px 0;">{{closing}},</p><p style="margin: 0; font-weight: bold;">{{senderName}}</p></div>'
  },

  // ==================== BUSINESS ====================
  {
    id: 'business-proposal',
    name: 'Business Proposal',
    description: 'Professional business proposal template to win clients and projects.',
    category: 'business',
    icon: 'Briefcase',
    popular: true,
    fields: [
      { id: 'companyName', name: 'companyName', label: 'Your Company Name', type: 'text', required: true },
      { id: 'companyLogo', name: 'companyLogo', label: 'Company Tagline', type: 'text', required: false },
      { id: 'clientName', name: 'clientName', label: 'Client Name/Company', type: 'text', required: true },
      { id: 'proposalTitle', name: 'proposalTitle', label: 'Proposal Title', type: 'text', placeholder: 'Website Development Proposal', required: true },
      { id: 'date', name: 'date', label: 'Date', type: 'date', required: true },
      { id: 'executiveSummary', name: 'executiveSummary', label: 'Executive Summary', type: 'textarea', required: true },
      { id: 'problemStatement', name: 'problemStatement', label: 'Problem Statement', type: 'textarea', required: true },
      { id: 'proposedSolution', name: 'proposedSolution', label: 'Proposed Solution', type: 'textarea', required: true },
      { id: 'deliverables', name: 'deliverables', label: 'Deliverables', type: 'textarea', required: true },
      { id: 'timeline', name: 'timeline', label: 'Timeline', type: 'textarea', required: true },
      { id: 'investment', name: 'investment', label: 'Investment/Pricing', type: 'textarea', required: true },
      { id: 'whyUs', name: 'whyUs', label: 'Why Choose Us', type: 'textarea', required: true },
      { id: 'contactName', name: 'contactName', label: 'Contact Person', type: 'text', required: true },
      { id: 'contactEmail', name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: white;"><div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 50px 40px; text-align: center;"><h1 style="font-size: 36px; margin: 0 0 10px 0;">{{companyName}}</h1><p style="font-size: 16px; opacity: 0.9; margin: 0 0 30px 0;">{{companyLogo}}</p><h2 style="font-size: 28px; margin: 0 0 10px 0;">{{proposalTitle}}</h2><p style="font-size: 16px; opacity: 0.9;">Prepared for: {{clientName}}</p><p style="font-size: 14px; opacity: 0.8; margin-top: 20px;">{{date}}</p></div><div style="padding: 40px;"><div style="margin-bottom: 35px;"><h3 style="color: #1e40af; font-size: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Executive Summary</h3><p style="color: #444; line-height: 1.8;">{{executiveSummary}}</p></div><div style="margin-bottom: 35px;"><h3 style="color: #1e40af; font-size: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">The Challenge</h3><p style="color: #444; line-height: 1.8;">{{problemStatement}}</p></div><div style="margin-bottom: 35px;"><h3 style="color: #1e40af; font-size: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Our Solution</h3><p style="color: #444; line-height: 1.8;">{{proposedSolution}}</p></div><div style="margin-bottom: 35px;"><h3 style="color: #1e40af; font-size: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Deliverables</h3><p style="color: #444; line-height: 1.8; white-space: pre-line;">{{deliverables}}</p></div><div style="margin-bottom: 35px;"><h3 style="color: #1e40af; font-size: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Timeline</h3><p style="color: #444; line-height: 1.8; white-space: pre-line;">{{timeline}}</p></div><div style="margin-bottom: 35px; background: #f0f9ff; padding: 25px; border-radius: 8px;"><h3 style="color: #1e40af; font-size: 20px; margin-top: 0;">Investment</h3><p style="color: #444; line-height: 1.8; white-space: pre-line;">{{investment}}</p></div><div style="margin-bottom: 35px;"><h3 style="color: #1e40af; font-size: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Why Choose Us</h3><p style="color: #444; line-height: 1.8;">{{whyUs}}</p></div><div style="background: #1e40af; color: white; padding: 25px; border-radius: 8px; text-align: center;"><h3 style="margin: 0 0 10px 0;">Ready to Get Started?</h3><p style="margin: 0;">Contact {{contactName}} at {{contactEmail}}</p></div></div></div>'
  },
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'Concise executive summary template for business reports and plans.',
    category: 'business',
    icon: 'FileText',
    fields: [
      { id: 'companyName', name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { id: 'reportTitle', name: 'reportTitle', label: 'Report Title', type: 'text', required: true },
      { id: 'date', name: 'date', label: 'Date', type: 'date', required: true },
      { id: 'overview', name: 'overview', label: 'Overview', type: 'textarea', required: true },
      { id: 'keyFindings', name: 'keyFindings', label: 'Key Findings', type: 'textarea', required: true },
      { id: 'recommendations', name: 'recommendations', label: 'Recommendations', type: 'textarea', required: true },
      { id: 'nextSteps', name: 'nextSteps', label: 'Next Steps', type: 'textarea', required: true },
      { id: 'preparedBy', name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;"><div style="border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px;"><h1 style="font-size: 28px; color: #1a1a1a; margin: 0;">{{companyName}}</h1><h2 style="font-size: 22px; color: #059669; margin: 10px 0 0 0;">{{reportTitle}}</h2><p style="color: #666; margin: 10px 0 0 0;">Executive Summary | {{date}}</p></div><div style="margin-bottom: 30px;"><h3 style="color: #059669; font-size: 18px; margin-bottom: 15px;">Overview</h3><p style="color: #444; line-height: 1.8;">{{overview}}</p></div><div style="margin-bottom: 30px;"><h3 style="color: #059669; font-size: 18px; margin-bottom: 15px;">Key Findings</h3><p style="color: #444; line-height: 1.8; white-space: pre-line;">{{keyFindings}}</p></div><div style="margin-bottom: 30px;"><h3 style="color: #059669; font-size: 18px; margin-bottom: 15px;">Recommendations</h3><p style="color: #444; line-height: 1.8; white-space: pre-line;">{{recommendations}}</p></div><div style="margin-bottom: 30px;"><h3 style="color: #059669; font-size: 18px; margin-bottom: 15px;">Next Steps</h3><p style="color: #444; line-height: 1.8; white-space: pre-line;">{{nextSteps}}</p></div><div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;"><p style="color: #666; font-size: 14px;">Prepared by: {{preparedBy}}</p></div></div>'
  },
  {
    id: 'business-memo',
    name: 'Business Memo',
    description: 'Internal business memorandum for official company communications.',
    category: 'business',
    icon: 'FileText',
    fields: [
      { id: 'companyName', name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { id: 'to', name: 'to', label: 'To', type: 'text', placeholder: 'All Staff / Department Name', required: true },
      { id: 'from', name: 'from', label: 'From', type: 'text', required: true },
      { id: 'date', name: 'date', label: 'Date', type: 'date', required: true },
      { id: 'subject', name: 'subject', label: 'Subject', type: 'text', required: true },
      { id: 'body', name: 'body', label: 'Memo Body', type: 'textarea', required: true },
      { id: 'action', name: 'action', label: 'Action Required (optional)', type: 'textarea', required: false },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 40px; background: white;"><div style="text-align: center; border-bottom: 2px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 25px;"><h1 style="font-size: 24px; color: #1a1a1a; margin: 0;">{{companyName}}</h1><p style="font-size: 18px; color: #666; margin: 5px 0 0 0;">MEMORANDUM</p></div><table style="width: 100%; margin-bottom: 25px; font-size: 14px;"><tr><td style="padding: 8px 0; width: 80px; font-weight: bold;">TO:</td><td style="padding: 8px 0;">{{to}}</td></tr><tr><td style="padding: 8px 0; font-weight: bold;">FROM:</td><td style="padding: 8px 0;">{{from}}</td></tr><tr><td style="padding: 8px 0; font-weight: bold;">DATE:</td><td style="padding: 8px 0;">{{date}}</td></tr><tr><td style="padding: 8px 0; font-weight: bold;">SUBJECT:</td><td style="padding: 8px 0; font-weight: bold;">{{subject}}</td></tr></table><div style="border-top: 1px solid #ccc; padding-top: 20px;"><p style="color: #333; line-height: 1.8; white-space: pre-line;">{{body}}</p></div><div style="margin-top: 25px; background: #fef3c7; padding: 15px; border-radius: 4px; border-left: 4px solid #f59e0b;"><p style="margin: 0; font-weight: bold; color: #92400e;">Action Required:</p><p style="margin: 10px 0 0 0; color: #78350f;">{{action}}</p></div></div>'
  },

  // ==================== PLANNING ====================
  {
    id: 'project-budget',
    name: 'Project Budget',
    description: 'Detailed project budget template with categories and totals.',
    category: 'planning',
    icon: 'Calculator',
    popular: true,
    fields: [
      { id: 'projectName', name: 'projectName', label: 'Project Name', type: 'text', required: true },
      { id: 'preparedBy', name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
      { id: 'date', name: 'date', label: 'Date', type: 'date', required: true },
      { id: 'totalBudget', name: 'totalBudget', label: 'Total Budget ($)', type: 'number', required: true },
      { id: 'laborCost', name: 'laborCost', label: 'Labor Costs ($)', type: 'number', required: true },
      { id: 'materialsCost', name: 'materialsCost', label: 'Materials Costs ($)', type: 'number', required: true },
      { id: 'equipmentCost', name: 'equipmentCost', label: 'Equipment Costs ($)', type: 'number', required: true },
      { id: 'overheadCost', name: 'overheadCost', label: 'Overhead Costs ($)', type: 'number', required: true },
      { id: 'contingency', name: 'contingency', label: 'Contingency ($)', type: 'number', required: true },
      { id: 'notes', name: 'notes', label: 'Budget Notes', type: 'textarea', required: false },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;"><div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px;"><h1 style="font-size: 28px; margin: 0 0 10px 0;">Project Budget</h1><h2 style="font-size: 20px; margin: 0; font-weight: normal; opacity: 0.9;">{{projectName}}</h2><p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.8;">Prepared by: {{preparedBy}} | {{date}}</p></div><div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;"><p style="margin: 0; color: #166534; font-size: 16px;">Total Approved Budget</p><p style="margin: 10px 0 0 0; font-size: 36px; font-weight: bold; color: #059669;">${{totalBudget}}</p></div><table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;"><thead><tr style="background: #059669; color: white;"><th style="padding: 15px; text-align: left; font-size: 14px;">Category</th><th style="padding: 15px; text-align: right; font-size: 14px;">Amount</th></tr></thead><tbody><tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 15px;">Labor Costs</td><td style="padding: 15px; text-align: right; font-weight: 600;">${{laborCost}}</td></tr><tr style="border-bottom: 1px solid #e5e7eb; background: #f9fafb;"><td style="padding: 15px;">Materials</td><td style="padding: 15px; text-align: right; font-weight: 600;">${{materialsCost}}</td></tr><tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 15px;">Equipment</td><td style="padding: 15px; text-align: right; font-weight: 600;">${{equipmentCost}}</td></tr><tr style="border-bottom: 1px solid #e5e7eb; background: #f9fafb;"><td style="padding: 15px;">Overhead</td><td style="padding: 15px; text-align: right; font-weight: 600;">${{overheadCost}}</td></tr><tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 15px;">Contingency Reserve</td><td style="padding: 15px; text-align: right; font-weight: 600;">${{contingency}}</td></tr></tbody></table><div style="background: #f9fafb; padding: 20px; border-radius: 8px;"><h3 style="margin: 0 0 10px 0; color: #374151;">Notes</h3><p style="margin: 0; color: #6b7280; white-space: pre-line;">{{notes}}</p></div></div>'
  },
  {
    id: 'meeting-agenda',
    name: 'Meeting Agenda',
    description: 'Structured meeting agenda template to keep meetings organized and productive.',
    category: 'planning',
    icon: 'ClipboardList',
    fields: [
      { id: 'meetingTitle', name: 'meetingTitle', label: 'Meeting Title', type: 'text', required: true },
      { id: 'date', name: 'date', label: 'Date', type: 'date', required: true },
      { id: 'time', name: 'time', label: 'Time', type: 'text', placeholder: '10:00 AM - 11:00 AM', required: true },
      { id: 'location', name: 'location', label: 'Location/Link', type: 'text', required: true },
      { id: 'organizer', name: 'organizer', label: 'Meeting Organizer', type: 'text', required: true },
      { id: 'attendees', name: 'attendees', label: 'Attendees', type: 'textarea', required: true },
      { id: 'objectives', name: 'objectives', label: 'Meeting Objectives', type: 'textarea', required: true },
      { id: 'agendaItems', name: 'agendaItems', label: 'Agenda Items', type: 'textarea', placeholder: '1. Welcome (5 min)\n2. Review previous minutes (10 min)\n3. Main discussion (30 min)', required: true },
      { id: 'notes', name: 'notes', label: 'Pre-meeting Notes', type: 'textarea', required: false },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 40px; background: white;"><div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 25px; border-radius: 8px; margin-bottom: 25px;"><h1 style="font-size: 24px; margin: 0 0 15px 0;">{{meetingTitle}}</h1><div style="display: flex; flex-wrap: wrap; gap: 20px; font-size: 14px;"><span>{{date}}</span><span>|</span><span>{{time}}</span><span>|</span><span>{{location}}</span></div></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;"><div style="background: #f5f3ff; padding: 15px; border-radius: 8px;"><h3 style="margin: 0 0 10px 0; color: #7c3aed; font-size: 14px;">Organizer</h3><p style="margin: 0; color: #333;">{{organizer}}</p></div><div style="background: #f5f3ff; padding: 15px; border-radius: 8px;"><h3 style="margin: 0 0 10px 0; color: #7c3aed; font-size: 14px;">Attendees</h3><p style="margin: 0; color: #333; white-space: pre-line; font-size: 14px;">{{attendees}}</p></div></div><div style="margin-bottom: 25px;"><h3 style="color: #7c3aed; font-size: 16px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">Meeting Objectives</h3><p style="color: #444; line-height: 1.7; white-space: pre-line;">{{objectives}}</p></div><div style="margin-bottom: 25px;"><h3 style="color: #7c3aed; font-size: 16px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">Agenda</h3><p style="color: #444; line-height: 2; white-space: pre-line; background: #faf5ff; padding: 15px; border-radius: 8px;">{{agendaItems}}</p></div><div style="background: #fef3c7; padding: 15px; border-radius: 8px;"><h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 14px;">Notes</h3><p style="margin: 0; color: #78350f; white-space: pre-line;">{{notes}}</p></div></div>'
  },
  {
    id: 'project-checklist',
    name: 'Project Checklist',
    description: 'Comprehensive project checklist to track tasks and milestones.',
    category: 'planning',
    icon: 'CheckSquare',
    new: true,
    fields: [
      { id: 'projectName', name: 'projectName', label: 'Project Name', type: 'text', required: true },
      { id: 'projectManager', name: 'projectManager', label: 'Project Manager', type: 'text', required: true },
      { id: 'startDate', name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { id: 'endDate', name: 'endDate', label: 'Target End Date', type: 'date', required: true },
      { id: 'phase1', name: 'phase1', label: 'Phase 1: Planning Tasks', type: 'textarea', placeholder: 'Define scope\nIdentify stakeholders\nCreate timeline', required: true },
      { id: 'phase2', name: 'phase2', label: 'Phase 2: Execution Tasks', type: 'textarea', required: true },
      { id: 'phase3', name: 'phase3', label: 'Phase 3: Review Tasks', type: 'textarea', required: true },
      { id: 'phase4', name: 'phase4', label: 'Phase 4: Completion Tasks', type: 'textarea', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;"><div style="background: #1f2937; color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px;"><h1 style="font-size: 26px; margin: 0 0 10px 0;">Project Checklist</h1><h2 style="font-size: 18px; margin: 0; font-weight: normal; opacity: 0.9;">{{projectName}}</h2><div style="margin-top: 15px; display: flex; gap: 30px; font-size: 14px; opacity: 0.8;"><span>Manager: {{projectManager}}</span><span>{{startDate}} - {{endDate}}</span></div></div><div style="margin-bottom: 25px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;"><div style="background: #3b82f6; color: white; padding: 15px;"><h3 style="margin: 0; font-size: 16px;">Phase 1: Planning</h3></div><div style="padding: 20px; white-space: pre-line; line-height: 2;">{{phase1}}</div></div><div style="margin-bottom: 25px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;"><div style="background: #8b5cf6; color: white; padding: 15px;"><h3 style="margin: 0; font-size: 16px;">Phase 2: Execution</h3></div><div style="padding: 20px; white-space: pre-line; line-height: 2;">{{phase2}}</div></div><div style="margin-bottom: 25px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;"><div style="background: #f59e0b; color: white; padding: 15px;"><h3 style="margin: 0; font-size: 16px;">Phase 3: Review</h3></div><div style="padding: 20px; white-space: pre-line; line-height: 2;">{{phase3}}</div></div><div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;"><div style="background: #10b981; color: white; padding: 15px;"><h3 style="margin: 0; font-size: 16px;">Phase 4: Completion</h3></div><div style="padding: 20px; white-space: pre-line; line-height: 2;">{{phase4}}</div></div></div>'
  },

  // ==================== CONTRACTS ====================
  {
    id: 'freelance-contract',
    name: 'Freelance Contract',
    description: 'Professional contract for freelance work, including scope, payment terms, and deliverables.',
    category: 'contracts',
    icon: 'FileText',
    popular: true,
    fields: [
      { id: 'clientName', name: 'clientName', label: 'Client Name', type: 'text', placeholder: 'Enter client name', required: true },
      { id: 'clientEmail', name: 'clientEmail', label: 'Client Email', type: 'email', placeholder: 'client@example.com', required: true },
      { id: 'freelancerName', name: 'freelancerName', label: 'Freelancer Name', type: 'text', placeholder: 'Your full name', required: true },
      { id: 'projectTitle', name: 'projectTitle', label: 'Project Title', type: 'text', placeholder: 'Website Redesign', required: true },
      { id: 'projectDescription', name: 'projectDescription', label: 'Project Description', type: 'textarea', placeholder: 'Describe the project scope and deliverables...', required: true },
      { id: 'startDate', name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { id: 'endDate', name: 'endDate', label: 'End Date', type: 'date', required: true },
      { id: 'totalAmount', name: 'totalAmount', label: 'Total Amount ($)', type: 'number', placeholder: '5000', required: true },
      { id: 'paymentTerms', name: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['50% upfront, 50% on completion', 'Full payment upfront', 'Full payment on completion', 'Monthly installments'], required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;"><div style="text-align: center; margin-bottom: 40px;"><h1 style="color: #1a1a1a; margin-bottom: 10px;">FREELANCE SERVICE CONTRACT</h1><p style="color: #666;">Agreement Date: {{currentDate}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">1. PARTIES</h2><p><strong>Client:</strong> {{clientName}} ({{clientEmail}})</p><p><strong>Freelancer:</strong> {{freelancerName}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">2. PROJECT DETAILS</h2><p><strong>Project Title:</strong> {{projectTitle}}</p><p><strong>Description:</strong></p><p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">{{projectDescription}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">3. TIMELINE</h2><p><strong>Start Date:</strong> {{startDate}}</p><p><strong>End Date:</strong> {{endDate}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">4. PAYMENT</h2><p><strong>Total Amount:</strong> ${{totalAmount}}</p><p><strong>Payment Terms:</strong> {{paymentTerms}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">5. TERMS & CONDITIONS</h2><ul style="color: #555;"><li>All work shall be original and free of plagiarism.</li><li>Client owns all rights to deliverables upon full payment.</li><li>Freelancer may include work in portfolio unless otherwise agreed.</li><li>Either party may terminate with 14 days written notice.</li><li>Disputes shall be resolved through mediation first.</li></ul></div><div style="margin-top: 60px; display: flex; justify-content: space-between;"><div style="width: 45%;"><p style="border-top: 1px solid #333; padding-top: 10px;"><strong>Client Signature</strong></p><p>{{clientName}}</p><p style="color: #666;">Date: _______________</p></div><div style="width: 45%;"><p style="border-top: 1px solid #333; padding-top: 10px;"><strong>Freelancer Signature</strong></p><p>{{freelancerName}}</p><p style="color: #666;">Date: _______________</p></div></div></div>'
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    description: 'General service agreement template for businesses providing services to clients.',
    category: 'contracts',
    icon: 'FileText',
    fields: [
      { id: 'providerName', name: 'providerName', label: 'Service Provider Name', type: 'text', placeholder: 'Company or individual name', required: true },
      { id: 'providerAddress', name: 'providerAddress', label: 'Provider Address', type: 'textarea', placeholder: 'Full address', required: true },
      { id: 'clientName', name: 'clientName', label: 'Client Name', type: 'text', placeholder: 'Client company or name', required: true },
      { id: 'clientAddress', name: 'clientAddress', label: 'Client Address', type: 'textarea', placeholder: 'Full address', required: true },
      { id: 'serviceDescription', name: 'serviceDescription', label: 'Services Description', type: 'textarea', placeholder: 'Detailed description of services...', required: true },
      { id: 'duration', name: 'duration', label: 'Contract Duration', type: 'select', options: ['1 Month', '3 Months', '6 Months', '1 Year', '2 Years'], required: true },
      { id: 'monthlyFee', name: 'monthlyFee', label: 'Monthly Fee ($)', type: 'number', placeholder: '1000', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;"><div style="text-align: center; margin-bottom: 40px;"><h1 style="color: #1a1a1a;">SERVICE AGREEMENT</h1><p style="color: #666;">Effective Date: {{currentDate}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #333; border-bottom: 2px solid #10B981; padding-bottom: 10px;">PARTIES</h2><p><strong>Service Provider:</strong><br/>{{providerName}}<br/>{{providerAddress}}</p><p><strong>Client:</strong><br/>{{clientName}}<br/>{{clientAddress}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #333; border-bottom: 2px solid #10B981; padding-bottom: 10px;">SERVICES</h2><p>{{serviceDescription}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #333; border-bottom: 2px solid #10B981; padding-bottom: 10px;">TERM & COMPENSATION</h2><p><strong>Duration:</strong> {{duration}}</p><p><strong>Monthly Fee:</strong> ${{monthlyFee}}</p></div><div style="margin-top: 60px; display: flex; justify-content: space-between;"><div style="width: 45%;"><p style="border-top: 1px solid #333; padding-top: 10px;"><strong>Service Provider</strong></p><p style="color: #666;">Signature: _______________</p><p style="color: #666;">Date: _______________</p></div><div style="width: 45%;"><p style="border-top: 1px solid #333; padding-top: 10px;"><strong>Client</strong></p><p style="color: #666;">Signature: _______________</p><p style="color: #666;">Date: _______________</p></div></div></div>'
  },

  // ==================== AGREEMENTS ====================
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement (NDA)',
    description: 'Protect confidential information with this mutual NDA template.',
    category: 'agreements',
    icon: 'Lock',
    popular: true,
    fields: [
      { id: 'disclosingParty', name: 'disclosingParty', label: 'Disclosing Party', type: 'text', placeholder: 'Company/Person sharing info', required: true },
      { id: 'receivingParty', name: 'receivingParty', label: 'Receiving Party', type: 'text', placeholder: 'Company/Person receiving info', required: true },
      { id: 'purpose', name: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', placeholder: 'Business collaboration, partnership discussion...', required: true },
      { id: 'duration', name: 'duration', label: 'Confidentiality Period', type: 'select', options: ['1 Year', '2 Years', '3 Years', '5 Years', 'Indefinite'], required: true },
      { id: 'effectiveDate', name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;"><div style="text-align: center; margin-bottom: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px;"><h1 style="margin-bottom: 10px;">NON-DISCLOSURE AGREEMENT</h1><p>Confidential Information Protection</p></div><div style="margin-bottom: 30px;"><p>This Non-Disclosure Agreement ("Agreement") is entered into as of <strong>{{effectiveDate}}</strong> by and between:</p><p><strong>Disclosing Party:</strong> {{disclosingParty}}</p><p><strong>Receiving Party:</strong> {{receivingParty}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #667eea;">1. PURPOSE</h2><p>{{purpose}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #667eea;">2. CONFIDENTIAL INFORMATION</h2><p>Includes all business, technical, financial, and other information disclosed by either party, whether written, oral, or visual.</p></div><div style="margin-bottom: 30px;"><h2 style="color: #667eea;">3. OBLIGATIONS</h2><ul><li>Maintain strict confidentiality of all disclosed information</li><li>Use information only for the stated purpose</li><li>Not disclose to third parties without written consent</li><li>Return or destroy all materials upon request</li></ul></div><div style="margin-bottom: 30px;"><h2 style="color: #667eea;">4. TERM</h2><p>This agreement shall remain in effect for <strong>{{duration}}</strong> from the effective date.</p></div><div style="margin-top: 60px; display: flex; justify-content: space-between;"><div style="width: 45%;"><p style="border-top: 2px solid #667eea; padding-top: 10px;"><strong>Disclosing Party</strong></p><p>{{disclosingParty}}</p><p style="color: #666;">Signature: _______________</p></div><div style="width: 45%;"><p style="border-top: 2px solid #667eea; padding-top: 10px;"><strong>Receiving Party</strong></p><p>{{receivingParty}}</p><p style="color: #666;">Signature: _______________</p></div></div></div>'
  },
  {
    id: 'partnership-agreement',
    name: 'Partnership Agreement',
    description: 'Define roles, responsibilities, and profit sharing for business partnerships.',
    category: 'agreements',
    icon: 'FileCheck',
    new: true,
    fields: [
      { id: 'partner1Name', name: 'partner1Name', label: 'Partner 1 Name', type: 'text', required: true },
      { id: 'partner1Contribution', name: 'partner1Contribution', label: 'Partner 1 Contribution ($)', type: 'number', required: true },
      { id: 'partner1Share', name: 'partner1Share', label: 'Partner 1 Profit Share (%)', type: 'number', placeholder: '50', required: true },
      { id: 'partner2Name', name: 'partner2Name', label: 'Partner 2 Name', type: 'text', required: true },
      { id: 'partner2Contribution', name: 'partner2Contribution', label: 'Partner 2 Contribution ($)', type: 'number', required: true },
      { id: 'partner2Share', name: 'partner2Share', label: 'Partner 2 Profit Share (%)', type: 'number', placeholder: '50', required: true },
      { id: 'businessName', name: 'businessName', label: 'Business Name', type: 'text', required: true },
      { id: 'businessPurpose', name: 'businessPurpose', label: 'Business Purpose', type: 'textarea', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;"><div style="text-align: center; margin-bottom: 40px;"><h1 style="color: #1a1a1a;">PARTNERSHIP AGREEMENT</h1><p style="color: #666;">{{businessName}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #059669;">PARTNERS</h2><div style="display: flex; gap: 20px;"><div style="flex: 1; background: #f0fdf4; padding: 20px; border-radius: 8px;"><h3>Partner 1</h3><p><strong>{{partner1Name}}</strong></p><p>Contribution: ${{partner1Contribution}}</p><p>Profit Share: {{partner1Share}}%</p></div><div style="flex: 1; background: #f0fdf4; padding: 20px; border-radius: 8px;"><h3>Partner 2</h3><p><strong>{{partner2Name}}</strong></p><p>Contribution: ${{partner2Contribution}}</p><p>Profit Share: {{partner2Share}}%</p></div></div></div><div style="margin-bottom: 30px;"><h2 style="color: #059669;">BUSINESS PURPOSE</h2><p>{{businessPurpose}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #059669;">TERMS</h2><ul><li>All major decisions require unanimous consent</li><li>Profits and losses shared according to percentage</li><li>Monthly financial reports required</li><li>90-day notice required for dissolution</li></ul></div><div style="margin-top: 60px; display: flex; justify-content: space-between;"><div style="width: 45%;"><p style="border-top: 2px solid #059669; padding-top: 10px;"><strong>{{partner1Name}}</strong></p><p style="color: #666;">Signature: _______________</p><p style="color: #666;">Date: _______________</p></div><div style="width: 45%;"><p style="border-top: 2px solid #059669; padding-top: 10px;"><strong>{{partner2Name}}</strong></p><p style="color: #666;">Signature: _______________</p><p style="color: #666;">Date: _______________</p></div></div></div>'
  },

  // ==================== INVOICES ====================
  {
    id: 'modern-invoice',
    name: 'Modern Invoice',
    description: 'Sleek, modern invoice with gradient header. Perfect for agencies and freelancers.',
    category: 'invoices',
    icon: 'Receipt',
    new: true,
    fields: [
      { id: 'companyName', name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { id: 'companyEmail', name: 'companyEmail', label: 'Email', type: 'email', required: true },
      { id: 'invoiceNumber', name: 'invoiceNumber', label: 'Invoice #', type: 'text', required: true },
      { id: 'clientName', name: 'clientName', label: 'Client Name', type: 'text', required: true },
      { id: 'invoiceDate', name: 'invoiceDate', label: 'Date', type: 'date', required: true },
      { id: 'dueDate', name: 'dueDate', label: 'Due Date', type: 'date', required: true },
      { id: 'item1Description', name: 'item1Description', label: 'Item 1', type: 'text', required: true },
      { id: 'item1Amount', name: 'item1Amount', label: 'Amount 1 ($)', type: 'number', required: true },
      { id: 'item2Description', name: 'item2Description', label: 'Item 2', type: 'text', required: false },
      { id: 'item2Amount', name: 'item2Amount', label: 'Amount 2 ($)', type: 'number', required: false },
      { id: 'notes', name: 'notes', label: 'Notes', type: 'textarea', required: false },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: white;"><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; display: flex; justify-content: space-between; align-items: center;"><div><h1 style="margin: 0; font-size: 28px;">{{companyName}}</h1><p style="margin: 10px 0 0 0; opacity: 0.9;">{{companyEmail}}</p></div><div style="text-align: right;"><h2 style="margin: 0; font-size: 36px; font-weight: 300;">INVOICE</h2><p style="margin: 10px 0 0 0; opacity: 0.9;">#{{invoiceNumber}}</p></div></div><div style="padding: 40px;"><div style="display: flex; justify-content: space-between; margin-bottom: 40px;"><div><h3 style="color: #667eea; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">Bill To</h3><p style="margin: 0; font-size: 18px; font-weight: 600;">{{clientName}}</p></div><div style="text-align: right;"><p style="margin: 5px 0;"><strong>Date:</strong> {{invoiceDate}}</p><p style="margin: 5px 0;"><strong>Due:</strong> {{dueDate}}</p></div></div><table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;"><thead><tr><th style="background: #f8f9fa; padding: 15px; text-align: left; color: #667eea; font-size: 14px; text-transform: uppercase;">Description</th><th style="background: #f8f9fa; padding: 15px; text-align: right; color: #667eea; font-size: 14px; text-transform: uppercase;">Amount</th></tr></thead><tbody><tr style="border-bottom: 1px solid #eee;"><td style="padding: 20px 15px;">{{item1Description}}</td><td style="padding: 20px 15px; text-align: right; font-weight: 600;">${{item1Amount}}</td></tr><tr style="border-bottom: 1px solid #eee;"><td style="padding: 20px 15px;">{{item2Description}}</td><td style="padding: 20px 15px; text-align: right; font-weight: 600;">${{item2Amount}}</td></tr></tbody></table><div style="text-align: right; margin-bottom: 40px;"><div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 40px; border-radius: 8px;"><p style="margin: 0; font-size: 14px; opacity: 0.9;">Total Due</p><p style="margin: 5px 0 0 0; font-size: 32px; font-weight: 700;">$$$TOTAL$$$</p></div></div><div style="background: #f8f9fa; padding: 20px; border-radius: 8px;"><h4 style="margin: 0 0 10px 0; color: #667eea;">Notes</h4><p style="margin: 0; color: #666;">{{notes}}</p></div></div></div>'
  },
  {
    id: 'simple-invoice',
    name: 'Simple Invoice',
    description: 'Clean and simple invoice layout. Easy to read and professional.',
    category: 'invoices',
    icon: 'Receipt',
    fields: [
      { id: 'businessName', name: 'businessName', label: 'Business Name', type: 'text', required: true },
      { id: 'businessAddress', name: 'businessAddress', label: 'Address', type: 'textarea', required: true },
      { id: 'invoiceNumber', name: 'invoiceNumber', label: 'Invoice #', type: 'text', required: true },
      { id: 'clientName', name: 'clientName', label: 'Client', type: 'text', required: true },
      { id: 'invoiceDate', name: 'invoiceDate', label: 'Date', type: 'date', required: true },
      { id: 'item1Description', name: 'item1Description', label: 'Service 1', type: 'text', required: true },
      { id: 'item1Amount', name: 'item1Amount', label: 'Price 1 ($)', type: 'number', required: true },
      { id: 'item2Description', name: 'item2Description', label: 'Service 2', type: 'text', required: false },
      { id: 'item2Amount', name: 'item2Amount', label: 'Price 2 ($)', type: 'number', required: false },
      { id: 'paymentInfo', name: 'paymentInfo', label: 'Payment Info', type: 'textarea', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 50px; background: white;"><div style="display: flex; justify-content: space-between; margin-bottom: 50px;"><div><h1 style="margin: 0; color: #333; font-size: 24px;">{{businessName}}</h1><p style="margin: 10px 0 0 0; color: #666; white-space: pre-line; font-size: 14px;">{{businessAddress}}</p></div><div style="text-align: right;"><h2 style="margin: 0; color: #333; font-size: 32px; font-weight: 300;">Invoice</h2><p style="margin: 10px 0 0 0; color: #666;">#{{invoiceNumber}}</p><p style="margin: 5px 0 0 0; color: #666;">{{invoiceDate}}</p></div></div><div style="margin-bottom: 40px;"><h3 style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Bill To</h3><p style="margin: 0; font-size: 18px; color: #333;">{{clientName}}</p></div><table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;"><thead><tr style="border-bottom: 2px solid #333;"><th style="padding: 15px 0; text-align: left; font-weight: 600;">Description</th><th style="padding: 15px 0; text-align: right; font-weight: 600;">Amount</th></tr></thead><tbody><tr style="border-bottom: 1px solid #eee;"><td style="padding: 20px 0;">{{item1Description}}</td><td style="padding: 20px 0; text-align: right;">${{item1Amount}}</td></tr><tr style="border-bottom: 1px solid #eee;"><td style="padding: 20px 0;">{{item2Description}}</td><td style="padding: 20px 0; text-align: right;">${{item2Amount}}</td></tr><tr style="border-top: 2px solid #333;"><td style="padding: 20px 0; font-weight: 700; font-size: 18px;">Total</td><td style="padding: 20px 0; text-align: right; font-weight: 700; font-size: 24px;">$$$TOTAL$$$</td></tr></tbody></table><div style="border-top: 1px solid #eee; padding-top: 30px;"><h4 style="margin: 0 0 10px 0; color: #333;">Payment Information</h4><p style="margin: 0; color: #666; white-space: pre-line;">{{paymentInfo}}</p></div></div>'
  },
  {
    id: 'consulting-invoice',
    name: 'Consulting Invoice',
    description: 'Detailed invoice with hourly rates. Ideal for consultants and contractors.',
    category: 'invoices',
    icon: 'Receipt',
    fields: [
      { id: 'consultantName', name: 'consultantName', label: 'Consultant Name', type: 'text', required: true },
      { id: 'consultantEmail', name: 'consultantEmail', label: 'Email', type: 'email', required: true },
      { id: 'invoiceNumber', name: 'invoiceNumber', label: 'Invoice #', type: 'text', required: true },
      { id: 'clientName', name: 'clientName', label: 'Client', type: 'text', required: true },
      { id: 'projectName', name: 'projectName', label: 'Project Name', type: 'text', required: true },
      { id: 'invoiceDate', name: 'invoiceDate', label: 'Date', type: 'date', required: true },
      { id: 'dueDate', name: 'dueDate', label: 'Due Date', type: 'date', required: true },
      { id: 'hours', name: 'hours', label: 'Hours Worked', type: 'number', required: true },
      { id: 'hourlyRate', name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', required: true },
      { id: 'expenses', name: 'expenses', label: 'Expenses ($)', type: 'number', required: false },
      { id: 'notes', name: 'notes', label: 'Notes', type: 'textarea', required: false },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;"><div style="background: #1a365d; color: white; padding: 30px; margin: -40px -40px 40px -40px;"><div style="display: flex; justify-content: space-between; align-items: center;"><div><h1 style="margin: 0; font-size: 24px;">{{consultantName}}</h1><p style="margin: 5px 0 0 0; opacity: 0.8;">{{consultantEmail}}</p></div><div style="text-align: right;"><p style="margin: 0; font-size: 14px; opacity: 0.8;">Invoice</p><p style="margin: 5px 0 0 0; font-size: 28px; font-weight: 700;">#{{invoiceNumber}}</p></div></div></div><div style="display: flex; justify-content: space-between; margin-bottom: 40px;"><div><h3 style="margin: 0 0 5px 0; color: #1a365d; font-size: 12px; text-transform: uppercase;">Client</h3><p style="margin: 0; font-size: 18px;">{{clientName}}</p><p style="margin: 5px 0 0 0; color: #666;">Project: {{projectName}}</p></div><div style="text-align: right;"><p style="margin: 0;"><strong>Date:</strong> {{invoiceDate}}</p><p style="margin: 5px 0 0 0;"><strong>Due:</strong> {{dueDate}}</p></div></div><table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;"><thead><tr style="background: #f7fafc;"><th style="padding: 15px; text-align: left; color: #1a365d;">Description</th><th style="padding: 15px; text-align: center; color: #1a365d;">Qty</th><th style="padding: 15px; text-align: center; color: #1a365d;">Rate</th><th style="padding: 15px; text-align: right; color: #1a365d;">Amount</th></tr></thead><tbody><tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 15px;">Consulting Services</td><td style="padding: 15px; text-align: center;">{{hours}} hrs</td><td style="padding: 15px; text-align: center;">${{hourlyRate}}/hr</td><td style="padding: 15px; text-align: right; font-weight: 600;">$$$TOTAL$$$</td></tr><tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 15px;">Expenses</td><td style="padding: 15px; text-align: center;">-</td><td style="padding: 15px; text-align: center;">-</td><td style="padding: 15px; text-align: right; font-weight: 600;">${{expenses}}</td></tr></tbody></table><div style="text-align: right; margin-bottom: 30px;"><div style="display: inline-block; background: #1a365d; color: white; padding: 20px 40px;"><p style="margin: 0; font-size: 14px; opacity: 0.8;">Total Due</p><p style="margin: 5px 0 0 0; font-size: 28px; font-weight: 700;">$$$TOTAL$$$</p></div></div><div style="background: #f7fafc; padding: 20px; border-radius: 4px;"><h4 style="margin: 0 0 10px 0; color: #1a365d;">Notes</h4><p style="margin: 0; color: #4a5568;">{{notes}}</p></div></div>'
  },
  {
    id: 'retail-invoice',
    name: 'Retail Invoice',
    description: 'Product-focused invoice for retail and e-commerce businesses.',
    category: 'invoices',
    icon: 'Receipt',
    fields: [
      { id: 'storeName', name: 'storeName', label: 'Store Name', type: 'text', required: true },
      { id: 'storeAddress', name: 'storeAddress', label: 'Store Address', type: 'textarea', required: true },
      { id: 'invoiceNumber', name: 'invoiceNumber', label: 'Invoice #', type: 'text', required: true },
      { id: 'customerName', name: 'customerName', label: 'Customer', type: 'text', required: true },
      { id: 'invoiceDate', name: 'invoiceDate', label: 'Date', type: 'date', required: true },
      { id: 'item1Description', name: 'item1Description', label: 'Product 1', type: 'text', required: true },
      { id: 'item1Amount', name: 'item1Amount', label: 'Price 1 ($)', type: 'number', required: true },
      { id: 'item2Description', name: 'item2Description', label: 'Product 2', type: 'text', required: false },
      { id: 'item2Amount', name: 'item2Amount', label: 'Price 2 ($)', type: 'number', required: false },
      { id: 'tax', name: 'tax', label: 'Tax (%)', type: 'number', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white; border: 2px solid #e2e8f0;"><div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 30px; margin-bottom: 30px;"><h1 style="margin: 0; color: #2d3748; font-size: 28px;">{{storeName}}</h1><p style="margin: 10px 0 0 0; color: #718096; white-space: pre-line; font-size: 14px;">{{storeAddress}}</p></div><div style="display: flex; justify-content: space-between; margin-bottom: 30px;"><div><p style="margin: 0; color: #718096; font-size: 12px; text-transform: uppercase;">Invoice To</p><p style="margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">{{customerName}}</p></div><div style="text-align: right;"><p style="margin: 0; color: #718096; font-size: 12px; text-transform: uppercase;">Invoice #</p><p style="margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">{{invoiceNumber}}</p><p style="margin: 10px 0 0 0; color: #718096;">{{invoiceDate}}</p></div></div><table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;"><thead><tr style="background: #edf2f7;"><th style="padding: 12px; text-align: left; font-size: 14px;">Item</th><th style="padding: 12px; text-align: right; font-size: 14px;">Price</th></tr></thead><tbody><tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 15px;">{{item1Description}}</td><td style="padding: 15px; text-align: right;">${{item1Amount}}</td></tr><tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 15px;">{{item2Description}}</td><td style="padding: 15px; text-align: right;">${{item2Amount}}</td></tr></tbody></table><div style="text-align: right;"><table style="width: 250px; margin-left: auto;"><tr><td style="padding: 8px 0; color: #718096;">Subtotal</td><td style="padding: 8px 0; text-align: right;">$$$TOTAL$$$</td></tr><tr><td style="padding: 8px 0; color: #718096;">Tax ({{tax}}%)</td><td style="padding: 8px 0; text-align: right;">-</td></tr><tr style="border-top: 2px solid #2d3748;"><td style="padding: 15px 0; font-weight: 700; font-size: 18px;">Total</td><td style="padding: 15px 0; text-align: right; font-weight: 700; font-size: 18px;">$$$TOTAL$$$</td></tr></table></div><div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;"><p style="margin: 0; color: #718096; font-size: 14px;">Thank you for your purchase!</p></div></div>'
  },
  {
    id: 'professional-invoice',
    name: 'Professional Invoice',
    description: 'Clean, professional invoice template for billing clients.',
    category: 'invoices',
    icon: 'Receipt',
    popular: true,
    fields: [
      { id: 'invoiceNumber', name: 'invoiceNumber', label: 'Invoice Number', type: 'text', placeholder: 'INV-001', required: true },
      { id: 'companyName', name: 'companyName', label: 'Your Company Name', type: 'text', required: true },
      { id: 'companyAddress', name: 'companyAddress', label: 'Your Address', type: 'textarea', required: true },
      { id: 'companyEmail', name: 'companyEmail', label: 'Your Email', type: 'email', required: true },
      { id: 'clientName', name: 'clientName', label: 'Bill To (Client)', type: 'text', required: true },
      { id: 'clientAddress', name: 'clientAddress', label: 'Client Address', type: 'textarea', required: true },
      { id: 'invoiceDate', name: 'invoiceDate', label: 'Invoice Date', type: 'date', required: true },
      { id: 'dueDate', name: 'dueDate', label: 'Due Date', type: 'date', required: true },
      { id: 'item1Description', name: 'item1Description', label: 'Item 1 Description', type: 'text', placeholder: 'Web Design Services', required: true },
      { id: 'item1Amount', name: 'item1Amount', label: 'Item 1 Amount ($)', type: 'number', required: true },
      { id: 'item2Description', name: 'item2Description', label: 'Item 2 Description (optional)', type: 'text', required: false },
      { id: 'item2Amount', name: 'item2Amount', label: 'Item 2 Amount ($)', type: 'number', required: false },
      { id: 'notes', name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Payment terms, bank details...', required: false },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;"><div style="display: flex; justify-content: space-between; margin-bottom: 40px;"><div><h1 style="color: #4F46E5; margin: 0;">INVOICE</h1><p style="color: #666; margin: 5px 0;">#{{invoiceNumber}}</p></div><div style="text-align: right;"><h2 style="margin: 0;">{{companyName}}</h2><p style="color: #666; margin: 5px 0; white-space: pre-line;">{{companyAddress}}</p><p style="color: #666; margin: 5px 0;">{{companyEmail}}</p></div></div><div style="display: flex; justify-content: space-between; margin-bottom: 40px;"><div><h3 style="color: #666; margin-bottom: 10px;">BILL TO</h3><p style="margin: 0;"><strong>{{clientName}}</strong></p><p style="color: #666; white-space: pre-line;">{{clientAddress}}</p></div><div style="text-align: right;"><p><strong>Invoice Date:</strong> {{invoiceDate}}</p><p><strong>Due Date:</strong> {{dueDate}}</p></div></div><table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;"><thead><tr style="background: #4F46E5; color: white;"><th style="padding: 15px; text-align: left;">Description</th><th style="padding: 15px; text-align: right;">Amount</th></tr></thead><tbody><tr style="border-bottom: 1px solid #eee;"><td style="padding: 15px;">{{item1Description}}</td><td style="padding: 15px; text-align: right;">${{item1Amount}}</td></tr><tr style="border-bottom: 1px solid #eee;"><td style="padding: 15px;">{{item2Description}}</td><td style="padding: 15px; text-align: right;">{{item2Amount}}</td></tr></tbody><tfoot><tr style="background: #f5f5f5;"><td style="padding: 15px;"><strong>TOTAL</strong></td><td style="padding: 15px; text-align: right; font-size: 1.2em; color: #4F46E5;"><strong>$$$TOTAL$$$</strong></td></tr></tfoot></table><div style="background: #f9fafb; padding: 20px; border-radius: 8px;"><h3 style="margin-top: 0;">Notes</h3><p style="color: #666;">{{notes}}</p></div><div style="margin-top: 40px; text-align: center; color: #666;"><p>Thank you for your business!</p></div></div>'
  },

  // ==================== HR & EMPLOYMENT ====================
  {
    id: 'offer-letter',
    name: 'Employment Offer Letter',
    description: 'Professional job offer letter template for new hires.',
    category: 'hr',
    icon: 'UserPlus',
    popular: true,
    fields: [
      { id: 'companyName', name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { id: 'candidateName', name: 'candidateName', label: 'Candidate Name', type: 'text', required: true },
      { id: 'jobTitle', name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
      { id: 'department', name: 'department', label: 'Department', type: 'text', required: true },
      { id: 'startDate', name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { id: 'salary', name: 'salary', label: 'Annual Salary ($)', type: 'number', required: true },
      { id: 'employmentType', name: 'employmentType', label: 'Employment Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract'], required: true },
      { id: 'reportingTo', name: 'reportingTo', label: 'Reporting To', type: 'text', required: true },
      { id: 'hrName', name: 'hrName', label: 'HR Representative Name', type: 'text', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;"><div style="text-align: center; margin-bottom: 40px;"><h1 style="color: #1a1a1a; margin-bottom: 5px;">{{companyName}}</h1><p style="color: #666;">Employment Offer Letter</p></div><p>Date: {{currentDate}}</p><p>Dear <strong>{{candidateName}}</strong>,</p><p>We are pleased to offer you the position of <strong>{{jobTitle}}</strong> in the <strong>{{department}}</strong> department at {{companyName}}. We believe your skills and experience will be a valuable addition to our team.</p><div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #0284c7;"><h3 style="margin-top: 0; color: #0284c7;">Position Details</h3><p><strong>Job Title:</strong> {{jobTitle}}</p><p><strong>Department:</strong> {{department}}</p><p><strong>Employment Type:</strong> {{employmentType}}</p><p><strong>Start Date:</strong> {{startDate}}</p><p><strong>Reporting To:</strong> {{reportingTo}}</p><p><strong>Annual Salary:</strong> ${{salary}}</p></div><h3>Benefits</h3><ul><li>Health, dental, and vision insurance</li><li>401(k) with company match</li><li>Paid time off (PTO)</li><li>Professional development opportunities</li></ul><p>This offer is contingent upon successful completion of background check and verification of employment eligibility.</p><p>Please sign and return this letter to confirm your acceptance.</p><p>We look forward to welcoming you to the team!</p><p>Sincerely,</p><p><strong>{{hrName}}</strong><br/>Human Resources<br/>{{companyName}}</p><div style="margin-top: 60px; border-top: 2px solid #0284c7; padding-top: 20px;"><h3>Acceptance</h3><p>I, {{candidateName}}, accept this offer of employment.</p><p style="margin-top: 40px;">Signature: ___________________________ Date: _______________</p></div></div>'
  },
  {
    id: 'job-description',
    name: 'Job Description',
    description: 'Comprehensive job description template for hiring and recruitment.',
    category: 'hr',
    icon: 'Briefcase',
    fields: [
      { id: 'companyName', name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { id: 'jobTitle', name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
      { id: 'department', name: 'department', label: 'Department', type: 'text', required: true },
      { id: 'location', name: 'location', label: 'Location', type: 'text', required: true },
      { id: 'employmentType', name: 'employmentType', label: 'Employment Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract', 'Remote'], required: true },
      { id: 'summary', name: 'summary', label: 'Job Summary', type: 'textarea', required: true },
      { id: 'responsibilities', name: 'responsibilities', label: 'Responsibilities', type: 'textarea', placeholder: 'List each responsibility on a new line', required: true },
      { id: 'requirements', name: 'requirements', label: 'Requirements', type: 'textarea', placeholder: 'List each requirement on a new line', required: true },
      { id: 'benefits', name: 'benefits', label: 'Benefits', type: 'textarea', required: true },
      { id: 'salaryRange', name: 'salaryRange', label: 'Salary Range', type: 'text', placeholder: '$80,000 - $100,000', required: false },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;"><div style="background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px;"><h1 style="font-size: 28px; margin: 0 0 10px 0;">{{jobTitle}}</h1><p style="font-size: 18px; margin: 0; opacity: 0.9;">{{companyName}}</p><div style="margin-top: 20px; display: flex; flex-wrap: wrap; gap: 15px;"><span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 14px;">{{department}}</span><span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 14px;">{{location}}</span><span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 14px;">{{employmentType}}</span><span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 14px;">{{salaryRange}}</span></div></div><div style="margin-bottom: 30px;"><h2 style="color: #0369a1; font-size: 20px; margin-bottom: 15px;">About the Role</h2><p style="color: #444; line-height: 1.8;">{{summary}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #0369a1; font-size: 20px; margin-bottom: 15px;">Responsibilities</h2><p style="color: #444; line-height: 2; white-space: pre-line;">{{responsibilities}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #0369a1; font-size: 20px; margin-bottom: 15px;">Requirements</h2><p style="color: #444; line-height: 2; white-space: pre-line;">{{requirements}}</p></div><div style="background: #f0f9ff; padding: 25px; border-radius: 12px;"><h2 style="color: #0369a1; font-size: 20px; margin: 0 0 15px 0;">What We Offer</h2><p style="color: #444; line-height: 2; white-space: pre-line; margin: 0;">{{benefits}}</p></div></div>'
  },

  // ==================== REAL ESTATE ====================
  {
    id: 'rental-agreement',
    name: 'Rental Agreement',
    description: 'Residential lease agreement between landlord and tenant.',
    category: 'real-estate',
    icon: 'Home',
    popular: true,
    fields: [
      { id: 'landlordName', name: 'landlordName', label: 'Landlord Name', type: 'text', required: true },
      { id: 'landlordPhone', name: 'landlordPhone', label: 'Landlord Phone', type: 'phone', required: true },
      { id: 'tenantName', name: 'tenantName', label: 'Tenant Name', type: 'text', required: true },
      { id: 'tenantEmail', name: 'tenantEmail', label: 'Tenant Email', type: 'email', required: true },
      { id: 'propertyAddress', name: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true },
      { id: 'monthlyRent', name: 'monthlyRent', label: 'Monthly Rent ($)', type: 'number', required: true },
      { id: 'securityDeposit', name: 'securityDeposit', label: 'Security Deposit ($)', type: 'number', required: true },
      { id: 'leaseStart', name: 'leaseStart', label: 'Lease Start Date', type: 'date', required: true },
      { id: 'leaseEnd', name: 'leaseEnd', label: 'Lease End Date', type: 'date', required: true },
      { id: 'paymentDueDay', name: 'paymentDueDay', label: 'Rent Due Day', type: 'select', options: ['1st', '5th', '15th', 'Last day of month'], required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;"><div style="text-align: center; margin-bottom: 40px; background: #fef3c7; padding: 20px; border-radius: 12px;"><h1 style="color: #92400e; margin: 0;">RESIDENTIAL LEASE AGREEMENT</h1></div><div style="margin-bottom: 30px;"><h2 style="color: #92400e;">PARTIES</h2><p><strong>Landlord:</strong> {{landlordName}} | Phone: {{landlordPhone}}</p><p><strong>Tenant:</strong> {{tenantName}} | Email: {{tenantEmail}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #92400e;">PROPERTY</h2><p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">{{propertyAddress}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #92400e;">LEASE TERM</h2><p><strong>Start Date:</strong> {{leaseStart}}</p><p><strong>End Date:</strong> {{leaseEnd}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #92400e;">FINANCIAL TERMS</h2><p><strong>Monthly Rent:</strong> ${{monthlyRent}}</p><p><strong>Security Deposit:</strong> ${{securityDeposit}}</p><p><strong>Rent Due:</strong> {{paymentDueDay}} of each month</p></div><div style="margin-bottom: 30px;"><h2 style="color: #92400e;">TERMS & CONDITIONS</h2><ul><li>Tenant shall maintain the property in good condition</li><li>No subletting without written consent</li><li>Landlord may inspect with 24-hour notice</li><li>Late fee of 5% applies after 5 days</li><li>30-day written notice required for termination</li></ul></div><div style="margin-top: 60px; display: flex; justify-content: space-between;"><div style="width: 45%;"><p style="border-top: 2px solid #92400e; padding-top: 10px;"><strong>Landlord</strong></p><p>{{landlordName}}</p><p style="color: #666;">Signature: _______________</p><p style="color: #666;">Date: _______________</p></div><div style="width: 45%;"><p style="border-top: 2px solid #92400e; padding-top: 10px;"><strong>Tenant</strong></p><p>{{tenantName}}</p><p style="color: #666;">Signature: _______________</p><p style="color: #666;">Date: _______________</p></div></div></div>'
  },

  // ==================== LEGAL ====================
  {
    id: 'power-of-attorney',
    name: 'Power of Attorney',
    description: 'Legal document granting authority to act on someones behalf.',
    category: 'legal',
    icon: 'Scale',
    fields: [
      { id: 'principalName', name: 'principalName', label: 'Principal (Granting Power)', type: 'text', required: true },
      { id: 'principalAddress', name: 'principalAddress', label: 'Principal Address', type: 'textarea', required: true },
      { id: 'agentName', name: 'agentName', label: 'Agent (Receiving Power)', type: 'text', required: true },
      { id: 'agentAddress', name: 'agentAddress', label: 'Agent Address', type: 'textarea', required: true },
      { id: 'powers', name: 'powers', label: 'Powers Granted', type: 'textarea', placeholder: 'Financial decisions, property management, healthcare...', required: true },
      { id: 'effectiveDate', name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      { id: 'expiryDate', name: 'expiryDate', label: 'Expiry Date (optional)', type: 'date', required: false },
    ],
    content: '<div style="font-family: Times New Roman, serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;"><div style="text-align: center; margin-bottom: 40px; border: 3px double #333; padding: 20px;"><h1 style="margin: 0;">POWER OF ATTORNEY</h1></div><p><strong>KNOW ALL PERSONS BY THESE PRESENTS:</strong></p><p>I, <strong>{{principalName}}</strong>, residing at {{principalAddress}}, hereby appoint <strong>{{agentName}}</strong>, residing at {{agentAddress}}, as my true and lawful Attorney-in-Fact.</p><h2>POWERS GRANTED</h2><p>{{powers}}</p><h2>EFFECTIVE DATE</h2><p>This Power of Attorney shall become effective on <strong>{{effectiveDate}}</strong>.</p><h2>REVOCATION</h2><p>This Power of Attorney may be revoked by me at any time by written notice to my Agent.</p><div style="margin-top: 60px;"><p><strong>IN WITNESS WHEREOF</strong>, I have signed this document on {{currentDate}}.</p><div style="margin-top: 40px;"><p style="border-top: 1px solid #333; width: 300px; padding-top: 10px;"><strong>Principal Signature</strong><br/>{{principalName}}</p></div><div style="margin-top: 40px; background: #f5f5f5; padding: 20px;"><h3>NOTARY ACKNOWLEDGMENT</h3><p>State of: _________________ County of: _________________</p><p>On this _____ day of _____________, 20___, before me personally appeared {{principalName}}, known to me to be the person who executed this Power of Attorney.</p><p style="margin-top: 30px;">Notary Public: _________________________</p><p>My Commission Expires: _________________</p></div></div></div>'
  },
  {
    id: 'release-liability',
    name: 'Release of Liability',
    description: 'Waiver of liability form for activities and events.',
    category: 'legal',
    icon: 'Shield',
    new: true,
    fields: [
      { id: 'organizationName', name: 'organizationName', label: 'Organization Name', type: 'text', required: true },
      { id: 'activityName', name: 'activityName', label: 'Activity/Event Name', type: 'text', required: true },
      { id: 'participantName', name: 'participantName', label: 'Participant Name', type: 'text', required: true },
      { id: 'participantDOB', name: 'participantDOB', label: 'Date of Birth', type: 'date', required: true },
      { id: 'emergencyContact', name: 'emergencyContact', label: 'Emergency Contact', type: 'text', required: true },
      { id: 'emergencyPhone', name: 'emergencyPhone', label: 'Emergency Phone', type: 'phone', required: true },
      { id: 'activityDate', name: 'activityDate', label: 'Activity Date', type: 'date', required: true },
      { id: 'risks', name: 'risks', label: 'Known Risks', type: 'textarea', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.7;"><div style="text-align: center; margin-bottom: 40px;"><h1 style="color: #dc2626; margin: 0 0 10px 0;">RELEASE OF LIABILITY</h1><h2 style="font-weight: normal; color: #666; margin: 0;">AND ASSUMPTION OF RISK</h2><p style="margin-top: 20px; font-size: 18px;">{{organizationName}}</p></div><div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin-bottom: 30px;"><p style="margin: 0; color: #991b1b;"><strong>PLEASE READ CAREFULLY BEFORE SIGNING</strong></p></div><p><strong>Activity/Event:</strong> {{activityName}}</p><p><strong>Date:</strong> {{activityDate}}</p><h3 style="color: #dc2626; margin-top: 30px;">ACKNOWLEDGMENT OF RISKS</h3><p>I, <strong>{{participantName}}</strong> (DOB: {{participantDOB}}), acknowledge that participation in {{activityName}} involves inherent risks including but not limited to:</p><p style="background: #f9fafb; padding: 15px; border-radius: 8px; white-space: pre-line;">{{risks}}</p><h3 style="color: #dc2626;">RELEASE AND WAIVER</h3><p>In consideration of being permitted to participate, I hereby release, waive, discharge, and covenant not to sue {{organizationName}}, its officers, employees, and agents from any and all liability, claims, demands, actions, and causes of action arising out of or related to any loss, damage, or injury that may be sustained by me.</p><h3 style="color: #dc2626;">EMERGENCY CONTACT</h3><p><strong>Name:</strong> {{emergencyContact}}</p><p><strong>Phone:</strong> {{emergencyPhone}}</p><div style="margin-top: 50px; border-top: 2px solid #dc2626; padding-top: 20px;"><p><strong>I HAVE READ THIS RELEASE AND UNDERSTAND THAT I AM GIVING UP SUBSTANTIAL RIGHTS.</strong></p><div style="display: flex; justify-content: space-between; margin-top: 30px;"><div style="width: 45%;"><p>Participant Signature:</p><p style="border-bottom: 1px solid #333; height: 30px;"></p><p>{{participantName}}</p></div><div style="width: 45%;"><p>Date:</p><p style="border-bottom: 1px solid #333; height: 30px;"></p><p>{{currentDate}}</p></div></div></div></div>'
  },

  // ==================== ADDITIONAL CONTRACTS ====================
  {
    id: 'employment-contract',
    name: 'Employment Contract',
    description: 'Comprehensive employment agreement for hiring new employees.',
    category: 'contracts',
    icon: 'FileText',
    fields: [
      { id: 'companyName', name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { id: 'companyAddress', name: 'companyAddress', label: 'Company Address', type: 'textarea', required: true },
      { id: 'employeeName', name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { id: 'employeeAddress', name: 'employeeAddress', label: 'Employee Address', type: 'textarea', required: true },
      { id: 'jobTitle', name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
      { id: 'department', name: 'department', label: 'Department', type: 'text', required: true },
      { id: 'startDate', name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { id: 'salary', name: 'salary', label: 'Annual Salary ($)', type: 'number', required: true },
      { id: 'payFrequency', name: 'payFrequency', label: 'Pay Frequency', type: 'select', options: ['Weekly', 'Bi-weekly', 'Semi-monthly', 'Monthly'], required: true },
      { id: 'probationPeriod', name: 'probationPeriod', label: 'Probation Period', type: 'select', options: ['30 days', '60 days', '90 days', '6 months'], required: true },
      { id: 'workHours', name: 'workHours', label: 'Work Hours', type: 'text', placeholder: '9:00 AM - 5:00 PM', required: true },
      { id: 'benefits', name: 'benefits', label: 'Benefits', type: 'textarea', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.7;"><div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1e40af; padding-bottom: 20px;"><h1 style="color: #1e40af; margin: 0;">EMPLOYMENT CONTRACT</h1><p style="color: #666; margin-top: 10px;">Official Employment Agreement</p></div><div style="margin-bottom: 30px;"><h2 style="color: #1e40af; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">1. PARTIES</h2><p><strong>Employer:</strong> {{companyName}}<br/>{{companyAddress}}</p><p><strong>Employee:</strong> {{employeeName}}<br/>{{employeeAddress}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #1e40af; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">2. POSITION</h2><p><strong>Job Title:</strong> {{jobTitle}}</p><p><strong>Department:</strong> {{department}}</p><p><strong>Start Date:</strong> {{startDate}}</p><p><strong>Work Hours:</strong> {{workHours}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #1e40af; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">3. COMPENSATION</h2><div style="background: #eff6ff; padding: 20px; border-radius: 8px;"><p style="margin: 0;"><strong>Annual Salary:</strong> ${{salary}}</p><p style="margin: 10px 0 0 0;"><strong>Pay Frequency:</strong> {{payFrequency}}</p></div></div><div style="margin-bottom: 30px;"><h2 style="color: #1e40af; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">4. PROBATION PERIOD</h2><p>The Employee will be subject to a probationary period of <strong>{{probationPeriod}}</strong> from the start date.</p></div><div style="margin-bottom: 30px;"><h2 style="color: #1e40af; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">5. BENEFITS</h2><p style="white-space: pre-line;">{{benefits}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #1e40af; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">6. TERMS & CONDITIONS</h2><ul style="color: #444;"><li>Employee agrees to perform duties to the best of their abilities</li><li>Employee will maintain confidentiality of company information</li><li>Either party may terminate with appropriate notice</li><li>Employee will comply with all company policies</li></ul></div><div style="margin-top: 60px; display: flex; justify-content: space-between;"><div style="width: 45%;"><p style="border-top: 2px solid #1e40af; padding-top: 10px;"><strong>Employer</strong></p><p>{{companyName}}</p><p style="color: #666;">Signature: _______________</p><p style="color: #666;">Date: _______________</p></div><div style="width: 45%;"><p style="border-top: 2px solid #1e40af; padding-top: 10px;"><strong>Employee</strong></p><p>{{employeeName}}</p><p style="color: #666;">Signature: _______________</p><p style="color: #666;">Date: _______________</p></div></div></div>'
  },
  {
    id: 'consulting-contract',
    name: 'Consulting Contract',
    description: 'Professional consulting services agreement for independent consultants.',
    category: 'contracts',
    icon: 'FileText',
    new: true,
    fields: [
      { id: 'consultantName', name: 'consultantName', label: 'Consultant Name', type: 'text', required: true },
      { id: 'consultantEmail', name: 'consultantEmail', label: 'Consultant Email', type: 'email', required: true },
      { id: 'clientName', name: 'clientName', label: 'Client Name', type: 'text', required: true },
      { id: 'clientEmail', name: 'clientEmail', label: 'Client Email', type: 'email', required: true },
      { id: 'projectScope', name: 'projectScope', label: 'Scope of Work', type: 'textarea', required: true },
      { id: 'deliverables', name: 'deliverables', label: 'Deliverables', type: 'textarea', required: true },
      { id: 'startDate', name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { id: 'endDate', name: 'endDate', label: 'End Date', type: 'date', required: true },
      { id: 'hourlyRate', name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', required: true },
      { id: 'maxHours', name: 'maxHours', label: 'Maximum Hours', type: 'number', required: true },
      { id: 'paymentTerms', name: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Net 15', 'Net 30', 'Net 45', 'Upon completion'], required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.7;"><div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center;"><h1 style="margin: 0;">CONSULTING SERVICES AGREEMENT</h1></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;"><div style="background: #f0fdf4; padding: 20px; border-radius: 8px;"><h3 style="color: #059669; margin: 0 0 15px 0;">Consultant</h3><p style="margin: 5px 0;"><strong>{{consultantName}}</strong></p><p style="margin: 5px 0; color: #666;">{{consultantEmail}}</p></div><div style="background: #f0fdf4; padding: 20px; border-radius: 8px;"><h3 style="color: #059669; margin: 0 0 15px 0;">Client</h3><p style="margin: 5px 0;"><strong>{{clientName}}</strong></p><p style="margin: 5px 0; color: #666;">{{clientEmail}}</p></div></div><div style="margin-bottom: 30px;"><h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 8px;">Scope of Work</h2><p style="white-space: pre-line;">{{projectScope}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 8px;">Deliverables</h2><p style="white-space: pre-line;">{{deliverables}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 8px;">Timeline</h2><p><strong>Start Date:</strong> {{startDate}}</p><p><strong>End Date:</strong> {{endDate}}</p></div><div style="margin-bottom: 30px; background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #059669;"><h2 style="color: #059669; margin-top: 0;">Compensation</h2><p><strong>Hourly Rate:</strong> ${{hourlyRate}}/hour</p><p><strong>Maximum Hours:</strong> {{maxHours}} hours</p><p><strong>Maximum Total:</strong> ${{hourlyRate}} x {{maxHours}} hours</p><p><strong>Payment Terms:</strong> {{paymentTerms}}</p></div><div style="margin-bottom: 30px;"><h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 8px;">Terms</h2><ul><li>Consultant operates as independent contractor</li><li>Work product belongs to Client upon payment</li><li>Consultant maintains professional liability insurance</li><li>Either party may terminate with 14 days notice</li></ul></div><div style="margin-top: 60px; display: flex; justify-content: space-between;"><div style="width: 45%;"><p style="border-top: 2px solid #059669; padding-top: 10px;"><strong>Consultant</strong></p><p>{{consultantName}}</p><p style="color: #666;">Date: _______________</p></div><div style="width: 45%;"><p style="border-top: 2px solid #059669; padding-top: 10px;"><strong>Client</strong></p><p>{{clientName}}</p><p style="color: #666;">Date: _______________</p></div></div></div>'
  },
  {
    id: 'vendor-contract',
    name: 'Vendor Contract',
    description: 'Agreement between a business and vendor for supply of goods or services.',
    category: 'contracts',
    icon: 'FileText',
    fields: [
      { id: 'buyerCompany', name: 'buyerCompany', label: 'Buyer Company', type: 'text', required: true },
      { id: 'buyerContact', name: 'buyerContact', label: 'Buyer Contact Person', type: 'text', required: true },
      { id: 'vendorCompany', name: 'vendorCompany', label: 'Vendor Company', type: 'text', required: true },
      { id: 'vendorContact', name: 'vendorContact', label: 'Vendor Contact Person', type: 'text', required: true },
      { id: 'goodsServices', name: 'goodsServices', label: 'Goods/Services Description', type: 'textarea', required: true },
      { id: 'pricing', name: 'pricing', label: 'Pricing Details', type: 'textarea', required: true },
      { id: 'deliveryTerms', name: 'deliveryTerms', label: 'Delivery Terms', type: 'textarea', required: true },
      { id: 'contractStart', name: 'contractStart', label: 'Contract Start', type: 'date', required: true },
      { id: 'contractEnd', name: 'contractEnd', label: 'Contract End', type: 'date', required: true },
      { id: 'paymentTerms', name: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Net 30', 'Net 45', 'Net 60', '2/10 Net 30'], required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.7;"><div style="text-align: center; margin-bottom: 40px;"><h1 style="color: #7c3aed; margin: 0;">VENDOR AGREEMENT</h1><p style="color: #666; margin-top: 10px;">Supply of Goods and Services Contract</p></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;"><div style="border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;"><h3 style="color: #7c3aed; margin: 0 0 15px 0;">BUYER</h3><p style="margin: 5px 0;"><strong>{{buyerCompany}}</strong></p><p style="margin: 5px 0; color: #666;">Contact: {{buyerContact}}</p></div><div style="border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;"><h3 style="color: #7c3aed; margin: 0 0 15px 0;">VENDOR</h3><p style="margin: 5px 0;"><strong>{{vendorCompany}}</strong></p><p style="margin: 5px 0; color: #666;">Contact: {{vendorContact}}</p></div></div><div style="margin-bottom: 25px;"><h2 style="color: #7c3aed; font-size: 16px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">GOODS/SERVICES</h2><p style="white-space: pre-line;">{{goodsServices}}</p></div><div style="margin-bottom: 25px;"><h2 style="color: #7c3aed; font-size: 16px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">PRICING</h2><p style="white-space: pre-line; background: #f5f3ff; padding: 15px; border-radius: 8px;">{{pricing}}</p></div><div style="margin-bottom: 25px;"><h2 style="color: #7c3aed; font-size: 16px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">DELIVERY TERMS</h2><p style="white-space: pre-line;">{{deliveryTerms}}</p></div><div style="margin-bottom: 25px;"><h2 style="color: #7c3aed; font-size: 16px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">CONTRACT PERIOD</h2><p><strong>Start:</strong> {{contractStart}} | <strong>End:</strong> {{contractEnd}}</p><p><strong>Payment Terms:</strong> {{paymentTerms}}</p></div><div style="margin-bottom: 25px;"><h2 style="color: #7c3aed; font-size: 16px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">STANDARD TERMS</h2><ul style="color: #444;"><li>Vendor warrants goods/services meet specifications</li><li>Buyer may inspect upon delivery</li><li>Defective items may be returned within 30 days</li><li>Force majeure excuses performance delays</li></ul></div><div style="margin-top: 50px; display: flex; justify-content: space-between;"><div style="width: 45%;"><p style="border-top: 2px solid #7c3aed; padding-top: 10px;"><strong>Buyer</strong></p><p>{{buyerCompany}}</p><p style="color: #666;">Date: _______________</p></div><div style="width: 45%;"><p style="border-top: 2px solid #7c3aed; padding-top: 10px;"><strong>Vendor</strong></p><p>{{vendorCompany}}</p><p style="color: #666;">Date: _______________</p></div></div></div>'
  },

  // ==================== ADDITIONAL AGREEMENTS ====================
  {
    id: 'rental-agreement',
    name: 'Equipment Rental Agreement',
    description: 'Agreement for renting equipment, machinery, or other assets.',
    category: 'agreements',
    icon: 'FileCheck',
    fields: [
      { id: 'ownerName', name: 'ownerName', label: 'Owner/Lessor Name', type: 'text', required: true },
      { id: 'ownerContact', name: 'ownerContact', label: 'Owner Contact', type: 'phone', required: true },
      { id: 'renterName', name: 'renterName', label: 'Renter/Lessee Name', type: 'text', required: true },
      { id: 'renterContact', name: 'renterContact', label: 'Renter Contact', type: 'phone', required: true },
      { id: 'equipmentDesc', name: 'equipmentDesc', label: 'Equipment Description', type: 'textarea', required: true },
      { id: 'serialNumber', name: 'serialNumber', label: 'Serial/ID Number', type: 'text', required: true },
      { id: 'rentalStart', name: 'rentalStart', label: 'Rental Start Date', type: 'date', required: true },
      { id: 'rentalEnd', name: 'rentalEnd', label: 'Rental End Date', type: 'date', required: true },
      { id: 'dailyRate', name: 'dailyRate', label: 'Daily Rental Rate ($)', type: 'number', required: true },
      { id: 'deposit', name: 'deposit', label: 'Security Deposit ($)', type: 'number', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.7;"><div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 25px; border-radius: 12px; margin-bottom: 30px; text-align: center;"><h1 style="color: #92400e; margin: 0;">EQUIPMENT RENTAL AGREEMENT</h1></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;"><div style="background: #fffbeb; padding: 20px; border-radius: 8px;"><h3 style="color: #92400e; margin: 0 0 10px 0;">OWNER (Lessor)</h3><p style="margin: 5px 0;"><strong>{{ownerName}}</strong></p><p style="margin: 5px 0;">{{ownerContact}}</p></div><div style="background: #fffbeb; padding: 20px; border-radius: 8px;"><h3 style="color: #92400e; margin: 0 0 10px 0;">RENTER (Lessee)</h3><p style="margin: 5px 0;"><strong>{{renterName}}</strong></p><p style="margin: 5px 0;">{{renterContact}}</p></div></div><div style="margin-bottom: 25px;"><h2 style="color: #92400e; font-size: 16px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">EQUIPMENT DETAILS</h2><p style="white-space: pre-line;">{{equipmentDesc}}</p><p><strong>Serial/ID Number:</strong> {{serialNumber}}</p></div><div style="margin-bottom: 25px;"><h2 style="color: #92400e; font-size: 16px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">RENTAL PERIOD</h2><p><strong>Start Date:</strong> {{rentalStart}}</p><p><strong>End Date:</strong> {{rentalEnd}}</p></div><div style="margin-bottom: 25px; background: #fef3c7; padding: 20px; border-radius: 8px;"><h2 style="color: #92400e; font-size: 16px; margin-top: 0;">FINANCIAL TERMS</h2><p><strong>Daily Rate:</strong> ${{dailyRate}}</p><p><strong>Security Deposit:</strong> ${{deposit}}</p><p style="color: #666; font-size: 14px;">Deposit refundable upon return of equipment in good condition.</p></div><div style="margin-bottom: 25px;"><h2 style="color: #92400e; font-size: 16px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">TERMS & CONDITIONS</h2><ul><li>Renter accepts equipment in current condition</li><li>Renter responsible for all damages during rental period</li><li>Equipment must be returned by end date or late fees apply</li><li>Renter shall not sublease without written consent</li><li>Insurance required for equipment over $1,000 value</li></ul></div><div style="margin-top: 50px; display: flex; justify-content: space-between;"><div style="width: 45%;"><p style="border-top: 2px solid #f59e0b; padding-top: 10px;"><strong>Owner</strong></p><p>{{ownerName}}</p><p style="color: #666;">Date: _______________</p></div><div style="width: 45%;"><p style="border-top: 2px solid #f59e0b; padding-top: 10px;"><strong>Renter</strong></p><p>{{renterName}}</p><p style="color: #666;">Date: _______________</p></div></div></div>'
  },
  {
    id: 'licensing-agreement',
    name: 'Software Licensing Agreement',
    description: 'License agreement for software products and digital assets.',
    category: 'agreements',
    icon: 'FileCheck',
    new: true,
    fields: [
      { id: 'licensorName', name: 'licensorName', label: 'Licensor (Software Owner)', type: 'text', required: true },
      { id: 'licensorEmail', name: 'licensorEmail', label: 'Licensor Email', type: 'email', required: true },
      { id: 'licenseeName', name: 'licenseeName', label: 'Licensee', type: 'text', required: true },
      { id: 'licenseeEmail', name: 'licenseeEmail', label: 'Licensee Email', type: 'email', required: true },
      { id: 'softwareName', name: 'softwareName', label: 'Software Name', type: 'text', required: true },
      { id: 'version', name: 'version', label: 'Version', type: 'text', required: true },
      { id: 'licenseType', name: 'licenseType', label: 'License Type', type: 'select', options: ['Single User', 'Multi-User (5)', 'Multi-User (10)', 'Enterprise', 'Site License'], required: true },
      { id: 'licenseFee', name: 'licenseFee', label: 'License Fee ($)', type: 'number', required: true },
      { id: 'effectiveDate', name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      { id: 'expiryDate', name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.7;"><div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center;"><h1 style="margin: 0 0 10px 0;">SOFTWARE LICENSE AGREEMENT</h1><p style="margin: 0; opacity: 0.9;">{{softwareName}} v{{version}}</p></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;"><div style="background: #eff6ff; padding: 20px; border-radius: 8px;"><h3 style="color: #3b82f6; margin: 0 0 10px 0;">LICENSOR</h3><p style="margin: 5px 0;"><strong>{{licensorName}}</strong></p><p style="margin: 5px 0; color: #666;">{{licensorEmail}}</p></div><div style="background: #f5f3ff; padding: 20px; border-radius: 8px;"><h3 style="color: #8b5cf6; margin: 0 0 10px 0;">LICENSEE</h3><p style="margin: 5px 0;"><strong>{{licenseeName}}</strong></p><p style="margin: 5px 0; color: #666;">{{licenseeEmail}}</p></div></div><div style="margin-bottom: 25px;"><h2 style="color: #3b82f6; font-size: 16px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">LICENSE DETAILS</h2><p><strong>Software:</strong> {{softwareName}}</p><p><strong>Version:</strong> {{version}}</p><p><strong>License Type:</strong> {{licenseType}}</p><p><strong>Effective:</strong> {{effectiveDate}} to {{expiryDate}}</p></div><div style="margin-bottom: 25px; background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); padding: 20px; border-radius: 8px;"><h2 style="color: #3b82f6; font-size: 16px; margin-top: 0;">LICENSE FEE</h2><p style="font-size: 28px; font-weight: bold; color: #1e40af; margin: 0;">${{licenseFee}}</p></div><div style="margin-bottom: 25px;"><h2 style="color: #3b82f6; font-size: 16px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">GRANT OF LICENSE</h2><p>Licensor grants Licensee a non-exclusive, non-transferable license to use the Software subject to these terms.</p></div><div style="margin-bottom: 25px;"><h2 style="color: #3b82f6; font-size: 16px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">RESTRICTIONS</h2><ul><li>No reverse engineering, decompilation, or disassembly</li><li>No redistribution or sublicensing</li><li>No modification of source code</li><li>Use only for intended purpose</li></ul></div><div style="margin-bottom: 25px;"><h2 style="color: #3b82f6; font-size: 16px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">WARRANTY DISCLAIMER</h2><p style="color: #666; font-size: 14px;">SOFTWARE PROVIDED AS IS WITHOUT WARRANTY OF ANY KIND. LICENSOR DISCLAIMS ALL WARRANTIES EXPRESS OR IMPLIED.</p></div><div style="margin-top: 50px; display: flex; justify-content: space-between;"><div style="width: 45%;"><p style="border-top: 2px solid #3b82f6; padding-top: 10px;"><strong>Licensor</strong></p><p>{{licensorName}}</p><p style="color: #666;">Date: _______________</p></div><div style="width: 45%;"><p style="border-top: 2px solid #8b5cf6; padding-top: 10px;"><strong>Licensee</strong></p><p>{{licenseeName}}</p><p style="color: #666;">Date: _______________</p></div></div></div>'
  },
  {
    id: 'service-level-agreement',
    name: 'Service Level Agreement (SLA)',
    description: 'SLA for defining service quality and performance metrics.',
    category: 'agreements',
    icon: 'FileCheck',
    fields: [
      { id: 'providerName', name: 'providerName', label: 'Service Provider', type: 'text', required: true },
      { id: 'clientName', name: 'clientName', label: 'Client Name', type: 'text', required: true },
      { id: 'serviceDescription', name: 'serviceDescription', label: 'Service Description', type: 'textarea', required: true },
      { id: 'uptime', name: 'uptime', label: 'Uptime Guarantee', type: 'select', options: ['99.0%', '99.5%', '99.9%', '99.99%'], required: true },
      { id: 'responseTime', name: 'responseTime', label: 'Response Time Commitment', type: 'text', placeholder: '< 4 hours for critical issues', required: true },
      { id: 'supportHours', name: 'supportHours', label: 'Support Hours', type: 'text', placeholder: '24/7 or Business Hours', required: true },
      { id: 'escalationProcess', name: 'escalationProcess', label: 'Escalation Process', type: 'textarea', required: true },
      { id: 'penalties', name: 'penalties', label: 'Service Credit/Penalties', type: 'textarea', required: true },
      { id: 'effectiveDate', name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.7;"><div style="background: #1f2937; color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center;"><h1 style="margin: 0 0 10px 0;">SERVICE LEVEL AGREEMENT</h1><p style="margin: 0; opacity: 0.8;">Performance & Quality Standards</p></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;"><div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #1f2937;"><h3 style="color: #1f2937; margin: 0 0 10px 0;">Provider</h3><p style="margin: 0;"><strong>{{providerName}}</strong></p></div><div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #6b7280;"><h3 style="color: #1f2937; margin: 0 0 10px 0;">Client</h3><p style="margin: 0;"><strong>{{clientName}}</strong></p></div></div><div style="margin-bottom: 25px;"><h2 style="color: #1f2937; font-size: 16px; border-bottom: 2px solid #1f2937; padding-bottom: 8px;">SERVICE DESCRIPTION</h2><p style="white-space: pre-line;">{{serviceDescription}}</p></div><div style="margin-bottom: 25px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;"><div style="background: #ecfdf5; padding: 20px; border-radius: 8px; text-align: center;"><p style="color: #059669; font-size: 12px; margin: 0;">UPTIME GUARANTEE</p><p style="font-size: 24px; font-weight: bold; color: #047857; margin: 10px 0 0 0;">{{uptime}}</p></div><div style="background: #eff6ff; padding: 20px; border-radius: 8px; text-align: center;"><p style="color: #3b82f6; font-size: 12px; margin: 0;">RESPONSE TIME</p><p style="font-size: 16px; font-weight: bold; color: #1d4ed8; margin: 10px 0 0 0;">{{responseTime}}</p></div><div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center;"><p style="color: #d97706; font-size: 12px; margin: 0;">SUPPORT</p><p style="font-size: 16px; font-weight: bold; color: #b45309; margin: 10px 0 0 0;">{{supportHours}}</p></div></div><div style="margin-bottom: 25px;"><h2 style="color: #1f2937; font-size: 16px; border-bottom: 2px solid #1f2937; padding-bottom: 8px;">ESCALATION PROCESS</h2><p style="white-space: pre-line;">{{escalationProcess}}</p></div><div style="margin-bottom: 25px;"><h2 style="color: #1f2937; font-size: 16px; border-bottom: 2px solid #1f2937; padding-bottom: 8px;">SERVICE CREDITS & PENALTIES</h2><p style="white-space: pre-line; background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444;">{{penalties}}</p></div><p style="color: #666;"><strong>Effective Date:</strong> {{effectiveDate}}</p><div style="margin-top: 50px; display: flex; justify-content: space-between;"><div style="width: 45%;"><p style="border-top: 2px solid #1f2937; padding-top: 10px;"><strong>Service Provider</strong></p><p>{{providerName}}</p><p style="color: #666;">Date: _______________</p></div><div style="width: 45%;"><p style="border-top: 2px solid #1f2937; padding-top: 10px;"><strong>Client</strong></p><p>{{clientName}}</p><p style="color: #666;">Date: _______________</p></div></div></div>'
  },

  // ==================== ADDITIONAL LETTERS ====================
  {
    id: 'resignation-letter',
    name: 'Resignation Letter',
    description: 'Professional resignation letter template for leaving a job gracefully.',
    category: 'letters',
    icon: 'Mail',
    fields: [
      { id: 'employeeName', name: 'employeeName', label: 'Your Name', type: 'text', required: true },
      { id: 'employeePosition', name: 'employeePosition', label: 'Your Position', type: 'text', required: true },
      { id: 'managerName', name: 'managerName', label: 'Manager Name', type: 'text', required: true },
      { id: 'companyName', name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { id: 'lastDay', name: 'lastDay', label: 'Last Working Day', type: 'date', required: true },
      { id: 'reason', name: 'reason', label: 'Reason (optional)', type: 'textarea', required: false },
      { id: 'gratitude', name: 'gratitude', label: 'Gratitude Message', type: 'textarea', placeholder: 'Express appreciation for opportunities...', required: true },
      { id: 'date', name: 'date', label: 'Date', type: 'date', required: true },
    ],
    content: '<div style="font-family: Georgia, serif; max-width: 700px; margin: 0 auto; padding: 50px; background: white; line-height: 1.9;"><div style="text-align: right; margin-bottom: 30px;"><p style="margin: 0;">{{employeeName}}</p><p style="margin: 5px 0; color: #666;">{{employeePosition}}</p><p style="margin: 5px 0; color: #666;">{{date}}</p></div><div style="margin-bottom: 30px;"><p style="margin: 0;">{{managerName}}</p><p style="margin: 0;">{{companyName}}</p></div><p style="margin-bottom: 20px;"><strong>Subject: Letter of Resignation</strong></p><p>Dear {{managerName}},</p><p style="text-align: justify;">I am writing to formally notify you of my resignation from my position as {{employeePosition}} at {{companyName}}. My last day of work will be <strong>{{lastDay}}</strong>.</p><p style="text-align: justify;">{{reason}}</p><p style="text-align: justify;">{{gratitude}}</p><p style="text-align: justify;">During my remaining time, I am committed to ensuring a smooth transition. I am happy to help train my replacement and complete any outstanding projects.</p><p style="text-align: justify;">Thank you for the opportunities for professional growth during my time here. I wish the company continued success.</p><p style="margin-top: 40px;">Sincerely,</p><p style="margin-top: 50px; font-weight: 600;">{{employeeName}}</p></div>'
  },
  {
    id: 'recommendation-letter',
    name: 'Recommendation Letter',
    description: 'Professional letter of recommendation for employees or students.',
    category: 'letters',
    icon: 'Mail',
    popular: true,
    fields: [
      { id: 'writerName', name: 'writerName', label: 'Your Name', type: 'text', required: true },
      { id: 'writerTitle', name: 'writerTitle', label: 'Your Title', type: 'text', required: true },
      { id: 'writerCompany', name: 'writerCompany', label: 'Your Company/Organization', type: 'text', required: true },
      { id: 'writerEmail', name: 'writerEmail', label: 'Your Email', type: 'email', required: true },
      { id: 'writerPhone', name: 'writerPhone', label: 'Your Phone', type: 'phone', required: true },
      { id: 'candidateName', name: 'candidateName', label: 'Candidate Name', type: 'text', required: true },
      { id: 'relationship', name: 'relationship', label: 'Your Relationship', type: 'text', placeholder: 'Direct supervisor for 3 years', required: true },
      { id: 'qualities', name: 'qualities', label: 'Key Qualities & Achievements', type: 'textarea', required: true },
      { id: 'recommendation', name: 'recommendation', label: 'Recommendation Statement', type: 'textarea', required: true },
      { id: 'date', name: 'date', label: 'Date', type: 'date', required: true },
    ],
    content: '<div style="font-family: Georgia, serif; max-width: 700px; margin: 0 auto; padding: 50px; background: white; line-height: 1.9;"><div style="border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px;"><h2 style="color: #1e40af; margin: 0 0 5px 0;">{{writerName}}</h2><p style="margin: 0; color: #666;">{{writerTitle}}</p><p style="margin: 0; color: #666;">{{writerCompany}}</p><p style="margin: 10px 0 0 0; font-size: 14px; color: #888;">{{writerEmail}} | {{writerPhone}}</p></div><p style="color: #666; margin-bottom: 20px;">{{date}}</p><p style="margin-bottom: 20px;"><strong>Re: Letter of Recommendation for {{candidateName}}</strong></p><p>To Whom It May Concern,</p><p style="text-align: justify;">I am writing to highly recommend <strong>{{candidateName}}</strong>. I have had the pleasure of knowing {{candidateName}} as {{relationship}}.</p><p style="text-align: justify; white-space: pre-line;">{{qualities}}</p><p style="text-align: justify;">{{recommendation}}</p><p style="text-align: justify;">I give {{candidateName}} my highest recommendation without reservation. Please feel free to contact me if you have any questions.</p><p style="margin-top: 40px;">Sincerely,</p><p style="margin-top: 50px; font-weight: 600;">{{writerName}}</p><p style="color: #666; margin: 5px 0;">{{writerTitle}}</p><p style="color: #666; margin: 5px 0;">{{writerCompany}}</p></div>'
  },
  {
    id: 'complaint-letter',
    name: 'Formal Complaint Letter',
    description: 'Professional complaint letter for products, services, or workplace issues.',
    category: 'letters',
    icon: 'Mail',
    fields: [
      { id: 'senderName', name: 'senderName', label: 'Your Name', type: 'text', required: true },
      { id: 'senderAddress', name: 'senderAddress', label: 'Your Address', type: 'textarea', required: true },
      { id: 'senderEmail', name: 'senderEmail', label: 'Your Email', type: 'email', required: true },
      { id: 'senderPhone', name: 'senderPhone', label: 'Your Phone', type: 'phone', required: true },
      { id: 'recipientName', name: 'recipientName', label: 'Recipient Name/Department', type: 'text', required: true },
      { id: 'companyName', name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { id: 'subject', name: 'subject', label: 'Subject of Complaint', type: 'text', required: true },
      { id: 'incidentDate', name: 'incidentDate', label: 'Incident Date', type: 'date', required: true },
      { id: 'description', name: 'description', label: 'Detailed Description', type: 'textarea', required: true },
      { id: 'resolution', name: 'resolution', label: 'Desired Resolution', type: 'textarea', required: true },
      { id: 'date', name: 'date', label: 'Letter Date', type: 'date', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 50px; background: white; line-height: 1.8;"><div style="margin-bottom: 30px;"><p style="margin: 0; font-weight: 600;">{{senderName}}</p><p style="margin: 5px 0; color: #555; white-space: pre-line; font-size: 14px;">{{senderAddress}}</p><p style="margin: 5px 0; color: #555; font-size: 14px;">{{senderEmail}} | {{senderPhone}}</p></div><p style="margin-bottom: 20px; color: #666;">{{date}}</p><div style="margin-bottom: 30px;"><p style="margin: 0;">{{recipientName}}</p><p style="margin: 0;">{{companyName}}</p></div><p style="margin-bottom: 20px; font-weight: 600; color: #dc2626;">Subject: Formal Complaint - {{subject}}</p><p>Dear {{recipientName}},</p><p style="text-align: justify;">I am writing to formally lodge a complaint regarding an incident that occurred on <strong>{{incidentDate}}</strong>.</p><div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;"><h4 style="color: #dc2626; margin: 0 0 10px 0;">Description of Issue</h4><p style="margin: 0; white-space: pre-line;">{{description}}</p></div><div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;"><h4 style="color: #059669; margin: 0 0 10px 0;">Requested Resolution</h4><p style="margin: 0; white-space: pre-line;">{{resolution}}</p></div><p style="text-align: justify;">I expect a response within 14 business days. If I do not receive a satisfactory response, I may be forced to escalate this matter further.</p><p style="text-align: justify;">I have attached relevant documentation to support my complaint. Please contact me if you require any additional information.</p><p style="margin-top: 30px;">Sincerely,</p><p style="margin-top: 40px; font-weight: 600;">{{senderName}}</p></div>'
  },

  // ==================== ADDITIONAL BUSINESS ====================
  {
    id: 'business-plan-summary',
    name: 'Business Plan Summary',
    description: 'One-page business plan summary for startups and new ventures.',
    category: 'business',
    icon: 'Briefcase',
    new: true,
    fields: [
      { id: 'companyName', name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { id: 'tagline', name: 'tagline', label: 'Tagline/Slogan', type: 'text', required: false },
      { id: 'mission', name: 'mission', label: 'Mission Statement', type: 'textarea', required: true },
      { id: 'problem', name: 'problem', label: 'Problem We Solve', type: 'textarea', required: true },
      { id: 'solution', name: 'solution', label: 'Our Solution', type: 'textarea', required: true },
      { id: 'targetMarket', name: 'targetMarket', label: 'Target Market', type: 'textarea', required: true },
      { id: 'revenueModel', name: 'revenueModel', label: 'Revenue Model', type: 'textarea', required: true },
      { id: 'competition', name: 'competition', label: 'Competitive Advantage', type: 'textarea', required: true },
      { id: 'teamMembers', name: 'teamMembers', label: 'Key Team Members', type: 'textarea', required: true },
      { id: 'fundingNeeded', name: 'fundingNeeded', label: 'Funding Required ($)', type: 'number', required: false },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;"><div style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 40px; border-radius: 16px; margin-bottom: 30px; text-align: center;"><h1 style="margin: 0; font-size: 32px;">{{companyName}}</h1><p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 18px;">{{tagline}}</p></div><div style="margin-bottom: 25px; background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #1e40af;"><h3 style="color: #1e40af; margin: 0 0 10px 0;">Mission</h3><p style="margin: 0; color: #444;">{{mission}}</p></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;"><div style="background: #fef2f2; padding: 20px; border-radius: 12px;"><h3 style="color: #dc2626; margin: 0 0 10px 0;">The Problem</h3><p style="margin: 0; color: #444; font-size: 14px;">{{problem}}</p></div><div style="background: #ecfdf5; padding: 20px; border-radius: 12px;"><h3 style="color: #059669; margin: 0 0 10px 0;">Our Solution</h3><p style="margin: 0; color: #444; font-size: 14px;">{{solution}}</p></div></div><div style="margin-bottom: 25px;"><h3 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px;">Target Market</h3><p style="color: #444; white-space: pre-line;">{{targetMarket}}</p></div><div style="margin-bottom: 25px;"><h3 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px;">Revenue Model</h3><p style="color: #444; white-space: pre-line;">{{revenueModel}}</p></div><div style="margin-bottom: 25px;"><h3 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px;">Competitive Advantage</h3><p style="color: #444; white-space: pre-line;">{{competition}}</p></div><div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;"><div style="background: #f8fafc; padding: 20px; border-radius: 12px;"><h3 style="color: #1e40af; margin: 0 0 10px 0;">Key Team</h3><p style="color: #444; margin: 0; white-space: pre-line; font-size: 14px;">{{teamMembers}}</p></div><div style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 12px; text-align: center;"><h3 style="margin: 0 0 10px 0; font-size: 14px;">Funding Needed</h3><p style="margin: 0; font-size: 28px; font-weight: bold;">${{fundingNeeded}}</p></div></div></div>'
  },
  {
    id: 'meeting-minutes',
    name: 'Meeting Minutes',
    description: 'Document and record meeting discussions, decisions, and action items.',
    category: 'business',
    icon: 'FileText',
    fields: [
      { id: 'meetingTitle', name: 'meetingTitle', label: 'Meeting Title', type: 'text', required: true },
      { id: 'date', name: 'date', label: 'Date', type: 'date', required: true },
      { id: 'time', name: 'time', label: 'Time', type: 'text', placeholder: '2:00 PM - 3:30 PM', required: true },
      { id: 'location', name: 'location', label: 'Location', type: 'text', required: true },
      { id: 'attendees', name: 'attendees', label: 'Attendees', type: 'textarea', required: true },
      { id: 'absentees', name: 'absentees', label: 'Absent Members', type: 'textarea', required: false },
      { id: 'agendaItems', name: 'agendaItems', label: 'Agenda Discussed', type: 'textarea', required: true },
      { id: 'discussions', name: 'discussions', label: 'Discussion Summary', type: 'textarea', required: true },
      { id: 'decisions', name: 'decisions', label: 'Decisions Made', type: 'textarea', required: true },
      { id: 'actionItems', name: 'actionItems', label: 'Action Items', type: 'textarea', placeholder: 'Task - Assignee - Deadline', required: true },
      { id: 'nextMeeting', name: 'nextMeeting', label: 'Next Meeting Date', type: 'date', required: false },
      { id: 'recorder', name: 'recorder', label: 'Minutes Recorded By', type: 'text', required: true },
    ],
    content: '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;"><div style="background: #1f2937; color: white; padding: 25px; border-radius: 12px; margin-bottom: 30px;"><h1 style="margin: 0 0 10px 0;">Meeting Minutes</h1><h2 style="margin: 0; font-weight: normal; opacity: 0.9;">{{meetingTitle}}</h2><div style="display: flex; gap: 30px; margin-top: 15px; font-size: 14px; opacity: 0.8;"><span>{{date}}</span><span>{{time}}</span><span>{{location}}</span></div></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;"><div style="background: #f9fafb; padding: 15px; border-radius: 8px;"><h3 style="color: #059669; margin: 0 0 10px 0; font-size: 14px;">ATTENDEES</h3><p style="margin: 0; white-space: pre-line; font-size: 14px;">{{attendees}}</p></div><div style="background: #fef2f2; padding: 15px; border-radius: 8px;"><h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 14px;">ABSENT</h3><p style="margin: 0; white-space: pre-line; font-size: 14px;">{{absentees}}</p></div></div><div style="margin-bottom: 25px;"><h3 style="color: #1f2937; border-bottom: 2px solid #1f2937; padding-bottom: 8px;">Agenda</h3><p style="white-space: pre-line; color: #444;">{{agendaItems}}</p></div><div style="margin-bottom: 25px;"><h3 style="color: #1f2937; border-bottom: 2px solid #1f2937; padding-bottom: 8px;">Discussion Summary</h3><p style="white-space: pre-line; color: #444;">{{discussions}}</p></div><div style="margin-bottom: 25px; background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #059669;"><h3 style="color: #059669; margin: 0 0 10px 0;">Decisions Made</h3><p style="margin: 0; white-space: pre-line;">{{decisions}}</p></div><div style="margin-bottom: 25px; background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;"><h3 style="color: #3b82f6; margin: 0 0 10px 0;">Action Items</h3><p style="margin: 0; white-space: pre-line; font-family: monospace;">{{actionItems}}</p></div><div style="display: flex; justify-content: space-between; border-top: 1px solid #e5e7eb; padding-top: 20px; color: #666; font-size: 14px;"><span><strong>Next Meeting:</strong> {{nextMeeting}}</span><span><strong>Minutes by:</strong> {{recorder}}</span></div></div>'
  },
]

export const getTemplatesByCategory = (category: TemplateCategory): DocumentTemplate[] => {
  return templates.filter(t => t.category === category)
}

export const getPopularTemplates = (): DocumentTemplate[] => {
  return templates.filter(t => t.popular)
}

export const getNewTemplates = (): DocumentTemplate[] => {
  return templates.filter(t => t.new)
}

export const getTemplateById = (id: string): DocumentTemplate | undefined => {
  return templates.find(t => t.id === id)
}

export const searchTemplates = (query: string): DocumentTemplate[] => {
  const lowerQuery = query.toLowerCase()
  return templates.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.category.toLowerCase().includes(lowerQuery)
  )
}
