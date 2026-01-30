// Resume template types and data for FlowCV-style resume templates

import { TemplateField, DocumentTemplate } from './templates'

export type ResumeStyleCategory = 'popular' | 'simple' | 'modern' | 'creative'

export interface ResumeTemplate extends DocumentTemplate {
  styleCategory: ResumeStyleCategory
  colorScheme: string
}

export const styleLabels: Record<ResumeStyleCategory, string> = {
  popular: 'Popular',
  simple: 'Simple',
  modern: 'Modern',
  creative: 'Creative',
}

export const styleBadgeColors: Record<ResumeStyleCategory, { bg: string; text: string }> = {
  popular: { bg: '#FEF3C7', text: '#92400E' },
  simple: { bg: '#E0E7FF', text: '#3730A3' },
  modern: { bg: '#D1FAE5', text: '#065F46' },
  creative: { bg: '#FCE7F3', text: '#9D174D' },
}

// Standard resume fields shared across templates
const standardFields: TemplateField[] = [
  { id: 'fullName', name: 'fullName', label: 'Full Name', type: 'text', required: true },
  { id: 'jobTitle', name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
  { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
  { id: 'phone', name: 'phone', label: 'Phone', type: 'phone', required: true },
  { id: 'location', name: 'location', label: 'Location', type: 'text', required: true },
  { id: 'linkedin', name: 'linkedin', label: 'LinkedIn', type: 'text', required: false },
  { id: 'summary', name: 'summary', label: 'Professional Summary', type: 'textarea', required: true },
  { id: 'experience1Title', name: 'experience1Title', label: 'Job Title #1', type: 'text', required: true },
  { id: 'experience1Company', name: 'experience1Company', label: 'Company #1', type: 'text', required: true },
  { id: 'experience1Duration', name: 'experience1Duration', label: 'Duration #1', type: 'text', required: true },
  { id: 'experience1Desc', name: 'experience1Desc', label: 'Description #1', type: 'textarea', required: true },
  { id: 'experience2Title', name: 'experience2Title', label: 'Job Title #2', type: 'text', required: false },
  { id: 'experience2Company', name: 'experience2Company', label: 'Company #2', type: 'text', required: false },
  { id: 'experience2Duration', name: 'experience2Duration', label: 'Duration #2', type: 'text', required: false },
  { id: 'experience2Desc', name: 'experience2Desc', label: 'Description #2', type: 'textarea', required: false },
  { id: 'education', name: 'education', label: 'Education', type: 'textarea', required: true },
  { id: 'skills', name: 'skills', label: 'Skills', type: 'textarea', required: true },
]

const fieldsWithExtras = (extras: TemplateField[]): TemplateField[] => [
  ...standardFields,
  ...extras,
]

// ===================== POPULAR TEMPLATES (1-6) =====================

const atlanticBlue: ResumeTemplate = {
  id: 'atlantic-blue',
  name: 'Atlantic Blue',
  description: 'Professional two-column resume with a striking navy sidebar and clean layout.',
  category: 'resume',
  icon: 'User',
  popular: true,
  styleCategory: 'popular',
  colorScheme: '#1e3a5f',
  fields: standardFields,
  content: `<div style="font-family:Arial,sans-serif;max-width:850px;margin:0 auto;display:flex;background:#fff;min-height:600px"><div style="width:35%;background:#1e3a5f;color:#fff;padding:40px 28px"><h1 style="font-size:26px;margin:0 0 4px">{{fullName}}</h1><p style="font-size:13px;opacity:.85;margin:0 0 28px;text-transform:uppercase;letter-spacing:2px">{{jobTitle}}</p><div style="margin-bottom:28px"><h3 style="font-size:11px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid rgba(255,255,255,.3);padding-bottom:6px;margin-bottom:12px">Contact</h3><p style="font-size:12px;margin:6px 0">{{email}}</p><p style="font-size:12px;margin:6px 0">{{phone}}</p><p style="font-size:12px;margin:6px 0">{{location}}</p><p style="font-size:12px;margin:6px 0">{{linkedin}}</p></div><div style="margin-bottom:28px"><h3 style="font-size:11px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid rgba(255,255,255,.3);padding-bottom:6px;margin-bottom:12px">Skills</h3><p style="font-size:12px;line-height:1.8;white-space:pre-line">{{skills}}</p></div><div><h3 style="font-size:11px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid rgba(255,255,255,.3);padding-bottom:6px;margin-bottom:12px">Education</h3><p style="font-size:12px;line-height:1.7;white-space:pre-line">{{education}}</p></div></div><div style="width:65%;padding:40px 32px"><div style="margin-bottom:28px"><h2 style="font-size:15px;color:#1e3a5f;text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #1e3a5f;padding-bottom:8px;margin-bottom:14px">Summary</h2><p style="color:#444;line-height:1.7;font-size:13px">{{summary}}</p></div><div><h2 style="font-size:15px;color:#1e3a5f;text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #1e3a5f;padding-bottom:8px;margin-bottom:14px">Experience</h2><div style="margin-bottom:18px"><h3 style="font-size:14px;color:#1e3a5f;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#666;margin:2px 0 6px">{{experience1Company}} | {{experience1Duration}}</p><p style="font-size:13px;color:#444;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#1e3a5f;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#666;margin:2px 0 6px">{{experience2Company}} | {{experience2Duration}}</p><p style="font-size:13px;color:#444;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div></div></div>`,
}

const classic: ResumeTemplate = {
  id: 'classic-resume',
  name: 'Classic',
  description: 'Timeless single-column layout with elegant serif typography and navy accents.',
  category: 'resume',
  icon: 'User',
  popular: true,
  styleCategory: 'popular',
  colorScheme: '#1a365d',
  fields: standardFields,
  content: `<div style="font-family:Georgia,serif;max-width:850px;margin:0 auto;padding:48px;background:#fff"><div style="text-align:center;border-bottom:3px solid #1a365d;padding-bottom:24px;margin-bottom:28px"><h1 style="font-size:36px;color:#1a365d;margin:0;letter-spacing:1px">{{fullName}}</h1><p style="font-size:16px;color:#4a5568;margin:8px 0 14px;text-transform:uppercase;letter-spacing:3px">{{jobTitle}}</p><div style="font-size:13px;color:#718096">{{email}} &bull; {{phone}} &bull; {{location}} &bull; {{linkedin}}</div></div><div style="margin-bottom:26px"><h2 style="font-size:13px;color:#1a365d;text-transform:uppercase;letter-spacing:3px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:12px">Professional Summary</h2><p style="color:#2d3748;line-height:1.8;font-size:14px">{{summary}}</p></div><div style="margin-bottom:26px"><h2 style="font-size:13px;color:#1a365d;text-transform:uppercase;letter-spacing:3px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:12px">Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:15px;color:#1a365d;margin:0">{{experience1Title}}</h3><p style="font-size:13px;color:#718096;margin:2px 0 8px">{{experience1Company}} | {{experience1Duration}}</p><p style="font-size:14px;color:#2d3748;line-height:1.8;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:15px;color:#1a365d;margin:0">{{experience2Title}}</h3><p style="font-size:13px;color:#718096;margin:2px 0 8px">{{experience2Company}} | {{experience2Duration}}</p><p style="font-size:14px;color:#2d3748;line-height:1.8;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:40px"><div style="flex:1"><h2 style="font-size:13px;color:#1a365d;text-transform:uppercase;letter-spacing:3px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:12px">Education</h2><p style="color:#2d3748;line-height:1.7;font-size:14px;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#1a365d;text-transform:uppercase;letter-spacing:3px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:12px">Skills</h2><p style="color:#2d3748;line-height:1.7;font-size:14px;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const mercury: ResumeTemplate = {
  id: 'mercury',
  name: 'Mercury',
  description: 'Sleek two-column design with silver-gray sidebar and modern typography.',
  category: 'resume',
  icon: 'User',
  popular: true,
  styleCategory: 'popular',
  colorScheme: '#4a5568',
  fields: standardFields,
  content: `<div style="font-family:Helvetica,Arial,sans-serif;max-width:850px;margin:0 auto;display:flex;background:#fff;min-height:600px"><div style="width:34%;background:#2d3748;color:#fff;padding:36px 24px"><div style="text-align:center;margin-bottom:32px"><div style="width:80px;height:80px;border-radius:50%;background:#4a5568;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;border:3px solid #a0aec0">{{fullName}}</div><h1 style="font-size:20px;margin:0 0 4px">{{fullName}}</h1><p style="font-size:12px;color:#a0aec0;margin:0">{{jobTitle}}</p></div><div style="margin-bottom:24px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#a0aec0;margin-bottom:10px;border-bottom:1px solid #4a5568;padding-bottom:6px">Contact</h3><p style="font-size:11px;margin:5px 0">{{email}}</p><p style="font-size:11px;margin:5px 0">{{phone}}</p><p style="font-size:11px;margin:5px 0">{{location}}</p><p style="font-size:11px;margin:5px 0">{{linkedin}}</p></div><div style="margin-bottom:24px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#a0aec0;margin-bottom:10px;border-bottom:1px solid #4a5568;padding-bottom:6px">Skills</h3><p style="font-size:11px;line-height:1.9;white-space:pre-line">{{skills}}</p></div><div><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#a0aec0;margin-bottom:10px;border-bottom:1px solid #4a5568;padding-bottom:6px">Education</h3><p style="font-size:11px;line-height:1.7;white-space:pre-line">{{education}}</p></div></div><div style="width:66%;padding:36px 30px"><div style="margin-bottom:24px"><h2 style="font-size:14px;color:#2d3748;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #2d3748;padding-bottom:6px">Profile</h2><p style="color:#4a5568;line-height:1.7;font-size:13px">{{summary}}</p></div><div><h2 style="font-size:14px;color:#2d3748;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #2d3748;padding-bottom:6px">Work Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:14px;color:#2d3748;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#718096;margin:2px 0 6px">{{experience1Company}} &mdash; {{experience1Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#2d3748;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#718096;margin:2px 0 6px">{{experience2Company}} &mdash; {{experience2Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div></div></div>`,
}

const executive: ResumeTemplate = {
  id: 'executive-popular',
  name: 'Executive',
  description: 'Commanding single-column resume for senior leaders with bold crimson accents.',
  category: 'resume',
  icon: 'User',
  popular: true,
  styleCategory: 'popular',
  colorScheme: '#7b2d26',
  fields: standardFields,
  content: `<div style="font-family:Georgia,serif;max-width:850px;margin:0 auto;padding:48px;background:#fff;border-top:6px solid #7b2d26"><div style="margin-bottom:32px"><h1 style="font-size:38px;color:#7b2d26;margin:0;font-weight:400">{{fullName}}</h1><p style="font-size:18px;color:#4a5568;margin:6px 0 16px;letter-spacing:2px;text-transform:uppercase">{{jobTitle}}</p><div style="display:flex;gap:20px;font-size:13px;color:#718096;flex-wrap:wrap"><span>{{email}}</span><span>|</span><span>{{phone}}</span><span>|</span><span>{{location}}</span><span>|</span><span>{{linkedin}}</span></div></div><div style="margin-bottom:28px"><h2 style="font-size:13px;color:#7b2d26;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px;font-weight:600">Summary</h2><p style="color:#2d3748;line-height:1.8;font-size:14px;border-left:3px solid #7b2d26;padding-left:16px">{{summary}}</p></div><div style="margin-bottom:28px"><h2 style="font-size:13px;color:#7b2d26;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px;font-weight:600">Professional Experience</h2><div style="margin-bottom:18px"><div style="display:flex;justify-content:space-between;align-items:baseline"><h3 style="font-size:15px;color:#1a202c;margin:0">{{experience1Title}}</h3><span style="font-size:12px;color:#718096">{{experience1Duration}}</span></div><p style="font-size:13px;color:#7b2d26;margin:2px 0 8px;font-style:italic">{{experience1Company}}</p><p style="font-size:13px;color:#4a5568;line-height:1.8;white-space:pre-line">{{experience1Desc}}</p></div><div><div style="display:flex;justify-content:space-between;align-items:baseline"><h3 style="font-size:15px;color:#1a202c;margin:0">{{experience2Title}}</h3><span style="font-size:12px;color:#718096">{{experience2Duration}}</span></div><p style="font-size:13px;color:#7b2d26;margin:2px 0 8px;font-style:italic">{{experience2Company}}</p><p style="font-size:13px;color:#4a5568;line-height:1.8;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:40px"><div style="flex:1"><h2 style="font-size:13px;color:#7b2d26;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px;font-weight:600">Education</h2><p style="color:#4a5568;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#7b2d26;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px;font-weight:600">Skills</h2><p style="color:#4a5568;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const harvard: ResumeTemplate = {
  id: 'harvard',
  name: 'Harvard',
  description: 'Academic-inspired clean layout with traditional serif fonts and crimson headers.',
  category: 'resume',
  icon: 'User',
  popular: true,
  styleCategory: 'popular',
  colorScheme: '#a51c30',
  fields: standardFields,
  content: `<div style="font-family:'Times New Roman',serif;max-width:850px;margin:0 auto;padding:48px;background:#fff"><div style="text-align:center;margin-bottom:28px"><h1 style="font-size:32px;color:#1a202c;margin:0;font-weight:700">{{fullName}}</h1><p style="font-size:15px;color:#a51c30;margin:6px 0 12px;letter-spacing:1px">{{jobTitle}}</p><div style="font-size:13px;color:#4a5568">{{email}} | {{phone}} | {{location}} | {{linkedin}}</div></div><div style="border-top:2px solid #a51c30;padding-top:20px;margin-bottom:24px"><h2 style="font-size:14px;color:#a51c30;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Summary</h2><p style="color:#2d3748;line-height:1.7;font-size:14px">{{summary}}</p></div><div style="border-top:1px solid #e2e8f0;padding-top:16px;margin-bottom:24px"><h2 style="font-size:14px;color:#a51c30;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Experience</h2><div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between"><strong style="font-size:14px;color:#1a202c">{{experience1Title}}</strong><span style="font-size:12px;color:#718096">{{experience1Duration}}</span></div><p style="font-size:13px;color:#a51c30;margin:2px 0 6px;font-style:italic">{{experience1Company}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><div style="display:flex;justify-content:space-between"><strong style="font-size:14px;color:#1a202c">{{experience2Title}}</strong><span style="font-size:12px;color:#718096">{{experience2Duration}}</span></div><p style="font-size:13px;color:#a51c30;margin:2px 0 6px;font-style:italic">{{experience2Company}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:40px;border-top:1px solid #e2e8f0;padding-top:16px"><div style="flex:1"><h2 style="font-size:14px;color:#a51c30;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Education</h2><p style="color:#4a5568;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:14px;color:#a51c30;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Skills</h2><p style="color:#4a5568;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const leaves: ResumeTemplate = {
  id: 'leaves',
  name: 'Leaves',
  description: 'Nature-inspired design with olive green accents and organic divider elements.',
  category: 'resume',
  icon: 'User',
  popular: true,
  styleCategory: 'popular',
  colorScheme: '#4a6741',
  fields: standardFields,
  content: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:850px;margin:0 auto;padding:48px;background:#fff;border-left:5px solid #4a6741"><div style="margin-bottom:30px"><h1 style="font-size:34px;color:#4a6741;margin:0">{{fullName}}</h1><p style="font-size:16px;color:#6b8a62;margin:6px 0 14px;letter-spacing:1px">{{jobTitle}}</p><div style="display:flex;gap:16px;font-size:12px;color:#718096;flex-wrap:wrap"><span>{{email}}</span><span>&bull;</span><span>{{phone}}</span><span>&bull;</span><span>{{location}}</span><span>&bull;</span><span>{{linkedin}}</span></div></div><div style="margin-bottom:26px;padding:16px;background:#f0f5ee;border-radius:6px"><h2 style="font-size:13px;color:#4a6741;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px">About</h2><p style="color:#2d3748;line-height:1.7;font-size:13px;margin:0">{{summary}}</p></div><div style="margin-bottom:26px"><h2 style="font-size:13px;color:#4a6741;text-transform:uppercase;letter-spacing:2px;margin-bottom:14px;border-bottom:2px solid #4a6741;padding-bottom:6px">Experience</h2><div style="margin-bottom:16px;padding-left:14px;border-left:2px solid #c6d9c0"><h3 style="font-size:14px;color:#2d3748;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#4a6741;margin:2px 0 6px">{{experience1Company}} &mdash; {{experience1Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div style="padding-left:14px;border-left:2px solid #c6d9c0"><h3 style="font-size:14px;color:#2d3748;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#4a6741;margin:2px 0 6px">{{experience2Company}} &mdash; {{experience2Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:13px;color:#4a6741;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #4a6741;padding-bottom:6px">Education</h2><p style="color:#4a5568;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#4a6741;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #4a6741;padding-bottom:6px">Skills</h2><p style="color:#4a5568;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

// ===================== SIMPLE TEMPLATES (7-14) =====================

const corporate: ResumeTemplate = {
  id: 'corporate',
  name: 'Corporate',
  description: 'Clean corporate layout with subtle gray tones and structured sections.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'simple',
  colorScheme: '#374151',
  fields: standardFields,
  content: `<div style="font-family:Arial,sans-serif;max-width:850px;margin:0 auto;padding:44px;background:#fff"><div style="border-bottom:2px solid #374151;padding-bottom:20px;margin-bottom:24px"><h1 style="font-size:30px;color:#111827;margin:0">{{fullName}}</h1><p style="font-size:15px;color:#6b7280;margin:4px 0 12px">{{jobTitle}}</p><div style="font-size:12px;color:#9ca3af">{{email}} &bull; {{phone}} &bull; {{location}} &bull; {{linkedin}}</div></div><div style="margin-bottom:22px"><h2 style="font-size:12px;color:#374151;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;font-weight:700">Summary</h2><p style="color:#4b5563;line-height:1.7;font-size:13px">{{summary}}</p></div><div style="margin-bottom:22px"><h2 style="font-size:12px;color:#374151;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;font-weight:700">Experience</h2><div style="margin-bottom:14px"><h3 style="font-size:14px;color:#111827;margin:0">{{experience1Title}} <span style="font-weight:400;color:#6b7280;font-size:12px">&mdash; {{experience1Duration}}</span></h3><p style="font-size:12px;color:#6b7280;margin:2px 0 6px">{{experience1Company}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#111827;margin:0">{{experience2Title}} <span style="font-weight:400;color:#6b7280;font-size:12px">&mdash; {{experience2Duration}}</span></h3><p style="font-size:12px;color:#6b7280;margin:2px 0 6px">{{experience2Company}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:12px;color:#374151;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;font-weight:700">Education</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:12px;color:#374151;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;font-weight:700">Skills</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const finance: ResumeTemplate = {
  id: 'finance',
  name: 'Finance',
  description: 'Conservative layout ideal for banking and finance professionals.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'simple',
  colorScheme: '#1e3a5f',
  fields: standardFields,
  content: `<div style="font-family:'Times New Roman',serif;max-width:850px;margin:0 auto;padding:48px;background:#fff"><div style="text-align:center;margin-bottom:26px;border-bottom:1px solid #1e3a5f;padding-bottom:18px"><h1 style="font-size:28px;color:#1e3a5f;margin:0;font-weight:700;letter-spacing:1px">{{fullName}}</h1><p style="font-size:14px;color:#4a5568;margin:6px 0 10px">{{jobTitle}}</p><div style="font-size:12px;color:#718096">{{email}} | {{phone}} | {{location}} | {{linkedin}}</div></div><div style="margin-bottom:22px"><h2 style="font-size:12px;color:#1e3a5f;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #cbd5e0;padding-bottom:4px;margin-bottom:10px">Professional Summary</h2><p style="color:#2d3748;line-height:1.7;font-size:13px">{{summary}}</p></div><div style="margin-bottom:22px"><h2 style="font-size:12px;color:#1e3a5f;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #cbd5e0;padding-bottom:4px;margin-bottom:10px">Professional Experience</h2><div style="margin-bottom:14px"><strong style="font-size:13px;color:#1a202c">{{experience1Title}}</strong><br/><span style="font-size:12px;color:#1e3a5f">{{experience1Company}}</span><span style="font-size:11px;color:#718096;float:right">{{experience1Duration}}</span><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line;margin-top:6px">{{experience1Desc}}</p></div><div><strong style="font-size:13px;color:#1a202c">{{experience2Title}}</strong><br/><span style="font-size:12px;color:#1e3a5f">{{experience2Company}}</span><span style="font-size:11px;color:#718096;float:right">{{experience2Duration}}</span><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line;margin-top:6px">{{experience2Desc}}</p></div></div><div style="display:flex;gap:40px"><div style="flex:1"><h2 style="font-size:12px;color:#1e3a5f;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #cbd5e0;padding-bottom:4px;margin-bottom:10px">Education</h2><p style="color:#4a5568;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:12px;color:#1e3a5f;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #cbd5e0;padding-bottom:4px;margin-bottom:10px">Skills</h2><p style="color:#4a5568;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const refined: ResumeTemplate = {
  id: 'refined',
  name: 'Refined',
  description: 'Understated elegance with thin lines and refined spacing.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'simple',
  colorScheme: '#1a202c',
  fields: standardFields,
  content: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:850px;margin:0 auto;padding:48px;background:#fff"><div style="margin-bottom:28px"><h1 style="font-size:32px;color:#1a202c;margin:0;font-weight:300">{{fullName}}</h1><p style="font-size:14px;color:#718096;margin:6px 0 14px;letter-spacing:2px;text-transform:uppercase">{{jobTitle}}</p><div style="height:1px;background:linear-gradient(to right,#1a202c,transparent);margin-bottom:12px"></div><div style="font-size:12px;color:#a0aec0;display:flex;gap:16px;flex-wrap:wrap"><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span><span>{{linkedin}}</span></div></div><div style="margin-bottom:24px"><h2 style="font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:3px;margin-bottom:8px">Profile</h2><p style="color:#4a5568;line-height:1.8;font-size:13px">{{summary}}</p></div><div style="margin-bottom:24px"><h2 style="font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:3px;margin-bottom:8px">Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:14px;color:#1a202c;margin:0;font-weight:500">{{experience1Title}}</h3><p style="font-size:12px;color:#718096;margin:2px 0 8px">{{experience1Company}} &bull; {{experience1Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#1a202c;margin:0;font-weight:500">{{experience2Title}}</h3><p style="font-size:12px;color:#718096;margin:2px 0 8px">{{experience2Company}} &bull; {{experience2Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:3px;margin-bottom:8px">Education</h2><p style="color:#4a5568;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:3px;margin-bottom:8px">Skills</h2><p style="color:#4a5568;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const trueBlue: ResumeTemplate = {
  id: 'true-blue',
  name: 'True Blue',
  description: 'Professional blue-themed single-column resume with clear hierarchy.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'simple',
  colorScheme: '#2563eb',
  fields: standardFields,
  content: `<div style="font-family:Arial,sans-serif;max-width:850px;margin:0 auto;padding:44px;background:#fff"><div style="margin-bottom:26px;border-bottom:3px solid #2563eb;padding-bottom:18px"><h1 style="font-size:30px;color:#1e40af;margin:0">{{fullName}}</h1><p style="font-size:15px;color:#3b82f6;margin:4px 0 12px">{{jobTitle}}</p><div style="font-size:12px;color:#6b7280">{{email}} &bull; {{phone}} &bull; {{location}} &bull; {{linkedin}}</div></div><div style="margin-bottom:22px"><h2 style="font-size:13px;color:#2563eb;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Summary</h2><p style="color:#374151;line-height:1.7;font-size:13px">{{summary}}</p></div><div style="margin-bottom:22px"><h2 style="font-size:13px;color:#2563eb;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Experience</h2><div style="margin-bottom:14px"><h3 style="font-size:14px;color:#111827;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#2563eb;margin:2px 0 6px">{{experience1Company}} | {{experience1Duration}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#111827;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#2563eb;margin:2px 0 6px">{{experience2Company}} | {{experience2Duration}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:13px;color:#2563eb;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Education</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#2563eb;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Skills</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const banking: ResumeTemplate = {
  id: 'banking',
  name: 'Banking',
  description: 'Formal and traditional layout suited for investment banking and consulting.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'simple',
  colorScheme: '#0f172a',
  fields: standardFields,
  content: `<div style="font-family:Georgia,serif;max-width:850px;margin:0 auto;padding:48px;background:#fff"><div style="text-align:center;border-bottom:2px double #0f172a;padding-bottom:16px;margin-bottom:26px"><h1 style="font-size:26px;color:#0f172a;margin:0;letter-spacing:2px;text-transform:uppercase">{{fullName}}</h1><p style="font-size:13px;color:#475569;margin:8px 0 10px">{{jobTitle}}</p><div style="font-size:11px;color:#94a3b8">{{email}} &middot; {{phone}} &middot; {{location}} &middot; {{linkedin}}</div></div><div style="margin-bottom:20px"><h2 style="font-size:11px;color:#0f172a;text-transform:uppercase;letter-spacing:3px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:8px;font-weight:700">Summary</h2><p style="color:#334155;line-height:1.7;font-size:13px">{{summary}}</p></div><div style="margin-bottom:20px"><h2 style="font-size:11px;color:#0f172a;text-transform:uppercase;letter-spacing:3px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:8px;font-weight:700">Experience</h2><div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between"><strong style="font-size:13px">{{experience1Title}}</strong><span style="font-size:11px;color:#64748b">{{experience1Duration}}</span></div><p style="font-size:12px;color:#475569;margin:2px 0 6px">{{experience1Company}}</p><p style="font-size:12px;color:#475569;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><div style="display:flex;justify-content:space-between"><strong style="font-size:13px">{{experience2Title}}</strong><span style="font-size:11px;color:#64748b">{{experience2Duration}}</span></div><p style="font-size:12px;color:#475569;margin:2px 0 6px">{{experience2Company}}</p><p style="font-size:12px;color:#475569;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:11px;color:#0f172a;text-transform:uppercase;letter-spacing:3px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:8px;font-weight:700">Education</h2><p style="color:#475569;font-size:12px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:11px;color:#0f172a;text-transform:uppercase;letter-spacing:3px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:8px;font-weight:700">Skills</h2><p style="color:#475569;font-size:12px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const cleanSlate: ResumeTemplate = {
  id: 'clean-slate',
  name: 'Clean Slate',
  description: 'Ultra-minimal design with generous whitespace and modern sans-serif type.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'simple',
  colorScheme: '#111827',
  fields: standardFields,
  content: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:850px;margin:0 auto;padding:52px;background:#fff"><div style="margin-bottom:36px"><h1 style="font-size:36px;color:#111827;margin:0;font-weight:700">{{fullName}}</h1><p style="font-size:16px;color:#9ca3af;margin:8px 0 16px">{{jobTitle}}</p><div style="display:flex;gap:20px;font-size:12px;color:#6b7280;flex-wrap:wrap"><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span><span>{{linkedin}}</span></div></div><div style="margin-bottom:28px"><p style="color:#374151;line-height:1.8;font-size:14px">{{summary}}</p></div><div style="height:1px;background:#e5e7eb;margin-bottom:28px"></div><div style="margin-bottom:28px"><h2 style="font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:3px;margin-bottom:16px">Experience</h2><div style="margin-bottom:18px"><h3 style="font-size:15px;color:#111827;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#6b7280;margin:4px 0 8px">{{experience1Company}} &mdash; {{experience1Duration}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:15px;color:#111827;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#6b7280;margin:4px 0 8px">{{experience2Company}} &mdash; {{experience2Duration}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="height:1px;background:#e5e7eb;margin-bottom:28px"></div><div style="display:flex;gap:40px"><div style="flex:1"><h2 style="font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px">Education</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px">Skills</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const fineLine: ResumeTemplate = {
  id: 'fine-line',
  name: 'Fine Line',
  description: 'Delicate hairline dividers with a modern minimalist aesthetic.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'simple',
  colorScheme: '#6b7280',
  fields: standardFields,
  content: `<div style="font-family:Helvetica,Arial,sans-serif;max-width:850px;margin:0 auto;padding:48px;background:#fff"><div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid #d1d5db;padding-bottom:18px;margin-bottom:26px"><div><h1 style="font-size:28px;color:#111827;margin:0;font-weight:600">{{fullName}}</h1><p style="font-size:14px;color:#6b7280;margin:4px 0 0">{{jobTitle}}</p></div><div style="text-align:right;font-size:11px;color:#9ca3af;line-height:1.8"><div>{{email}}</div><div>{{phone}}</div><div>{{location}}</div><div>{{linkedin}}</div></div></div><div style="margin-bottom:22px"><p style="color:#374151;line-height:1.7;font-size:13px;border-left:2px solid #d1d5db;padding-left:14px">{{summary}}</p></div><div style="border-top:1px solid #e5e7eb;padding-top:18px;margin-bottom:22px"><h2 style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Experience</h2><div style="margin-bottom:14px"><h3 style="font-size:14px;color:#111827;margin:0;font-weight:500">{{experience1Title}}</h3><p style="font-size:11px;color:#6b7280;margin:2px 0 6px">{{experience1Company}} | {{experience1Duration}}</p><p style="font-size:12px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#111827;margin:0;font-weight:500">{{experience2Title}}</h3><p style="font-size:11px;color:#6b7280;margin:2px 0 6px">{{experience2Company}} | {{experience2Duration}}</p><p style="font-size:12px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px;border-top:1px solid #e5e7eb;padding-top:18px"><div style="flex:1"><h2 style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Education</h2><p style="color:#4b5563;font-size:12px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Skills</h2><p style="color:#4b5563;font-size:12px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const sageLine: ResumeTemplate = {
  id: 'sage-line',
  name: 'Sage Line',
  description: 'Calming sage green accents with clean lines and professional structure.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'simple',
  colorScheme: '#6b8f71',
  fields: standardFields,
  content: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:850px;margin:0 auto;padding:48px;background:#fff"><div style="border-bottom:2px solid #6b8f71;padding-bottom:20px;margin-bottom:26px"><h1 style="font-size:30px;color:#2d3b29;margin:0">{{fullName}}</h1><p style="font-size:14px;color:#6b8f71;margin:6px 0 12px;letter-spacing:1px">{{jobTitle}}</p><div style="font-size:12px;color:#9ca3af">{{email}} &bull; {{phone}} &bull; {{location}} &bull; {{linkedin}}</div></div><div style="margin-bottom:22px"><h2 style="font-size:12px;color:#6b8f71;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">About</h2><p style="color:#374151;line-height:1.7;font-size:13px">{{summary}}</p></div><div style="margin-bottom:22px"><h2 style="font-size:12px;color:#6b8f71;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Experience</h2><div style="margin-bottom:14px"><h3 style="font-size:14px;color:#1f2937;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#6b8f71;margin:2px 0 6px">{{experience1Company}} &bull; {{experience1Duration}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#1f2937;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#6b8f71;margin:2px 0 6px">{{experience2Company}} &bull; {{experience2Duration}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:12px;color:#6b8f71;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Education</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:12px;color:#6b8f71;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Skills</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

// ===================== MODERN TEMPLATES (15-22) =====================

const quicksilver: ResumeTemplate = {
  id: 'quicksilver',
  name: 'Quicksilver',
  description: 'Bold two-column layout with teal gradient sidebar and modern feel.',
  category: 'resume',
  icon: 'User',
  new: true,
  styleCategory: 'modern',
  colorScheme: '#0d9488',
  fields: standardFields,
  content: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:850px;margin:0 auto;display:flex;background:#fff;min-height:600px"><div style="width:36%;background:linear-gradient(180deg,#0d9488,#065f46);color:#fff;padding:40px 26px"><h1 style="font-size:24px;margin:0 0 4px;font-weight:700">{{fullName}}</h1><p style="font-size:12px;opacity:.85;margin:0 0 30px;letter-spacing:1px;text-transform:uppercase">{{jobTitle}}</p><div style="margin-bottom:26px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;opacity:.7;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,.25);padding-bottom:6px">Contact</h3><p style="font-size:11px;margin:5px 0">{{email}}</p><p style="font-size:11px;margin:5px 0">{{phone}}</p><p style="font-size:11px;margin:5px 0">{{location}}</p><p style="font-size:11px;margin:5px 0">{{linkedin}}</p></div><div style="margin-bottom:26px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;opacity:.7;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,.25);padding-bottom:6px">Skills</h3><p style="font-size:11px;line-height:1.9;white-space:pre-line">{{skills}}</p></div><div><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;opacity:.7;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,.25);padding-bottom:6px">Education</h3><p style="font-size:11px;line-height:1.7;white-space:pre-line">{{education}}</p></div></div><div style="width:64%;padding:40px 30px"><div style="margin-bottom:24px"><h2 style="font-size:14px;color:#0d9488;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #0d9488;padding-bottom:6px">Profile</h2><p style="color:#4a5568;line-height:1.7;font-size:13px">{{summary}}</p></div><div><h2 style="font-size:14px;color:#0d9488;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #0d9488;padding-bottom:6px">Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#0d9488;margin:2px 0 6px">{{experience1Company}} &mdash; {{experience1Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#0d9488;margin:2px 0 6px">{{experience2Company}} &mdash; {{experience2Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div></div></div>`,
}

const hunterGreen: ResumeTemplate = {
  id: 'hunter-green',
  name: 'Hunter Green',
  description: 'Distinguished two-column design with deep green sidebar.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'modern',
  colorScheme: '#1b4332',
  fields: standardFields,
  content: `<div style="font-family:Arial,sans-serif;max-width:850px;margin:0 auto;display:flex;background:#fff;min-height:600px"><div style="width:35%;background:#1b4332;color:#fff;padding:38px 24px"><h1 style="font-size:22px;margin:0 0 4px">{{fullName}}</h1><p style="font-size:12px;color:#95d5b2;margin:0 0 28px;letter-spacing:1px">{{jobTitle}}</p><div style="margin-bottom:24px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#95d5b2;margin-bottom:10px">Contact</h3><p style="font-size:11px;margin:5px 0">{{email}}</p><p style="font-size:11px;margin:5px 0">{{phone}}</p><p style="font-size:11px;margin:5px 0">{{location}}</p><p style="font-size:11px;margin:5px 0">{{linkedin}}</p></div><div style="margin-bottom:24px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#95d5b2;margin-bottom:10px">Skills</h3><p style="font-size:11px;line-height:1.9;white-space:pre-line">{{skills}}</p></div><div><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#95d5b2;margin-bottom:10px">Education</h3><p style="font-size:11px;line-height:1.7;white-space:pre-line">{{education}}</p></div></div><div style="width:65%;padding:38px 30px"><div style="margin-bottom:22px"><h2 style="font-size:14px;color:#1b4332;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #1b4332;padding-bottom:6px">Summary</h2><p style="color:#4a5568;line-height:1.7;font-size:13px">{{summary}}</p></div><div><h2 style="font-size:14px;color:#1b4332;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #1b4332;padding-bottom:6px">Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#2d6a4f;margin:2px 0 6px">{{experience1Company}} | {{experience1Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#2d6a4f;margin:2px 0 6px">{{experience2Company}} | {{experience2Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div></div></div>`,
}

const saffronLine: ResumeTemplate = {
  id: 'saffron-line',
  name: 'Saffron Line',
  description: 'Warm saffron accent lines with a modern single-column layout.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'modern',
  colorScheme: '#d97706',
  fields: standardFields,
  content: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:850px;margin:0 auto;padding:48px;background:#fff;border-top:4px solid #d97706"><div style="margin-bottom:28px"><h1 style="font-size:32px;color:#111827;margin:0">{{fullName}}</h1><p style="font-size:15px;color:#d97706;margin:6px 0 14px">{{jobTitle}}</p><div style="font-size:12px;color:#6b7280;display:flex;gap:16px;flex-wrap:wrap"><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span><span>{{linkedin}}</span></div></div><div style="margin-bottom:24px;background:#fffbeb;padding:16px;border-left:3px solid #d97706;border-radius:0 6px 6px 0"><p style="color:#374151;line-height:1.7;font-size:13px;margin:0">{{summary}}</p></div><div style="margin-bottom:24px"><h2 style="font-size:13px;color:#d97706;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;border-bottom:2px solid #d97706;padding-bottom:6px;display:inline-block">Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:14px;color:#111827;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#d97706;margin:2px 0 6px">{{experience1Company}} &bull; {{experience1Duration}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#111827;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#d97706;margin:2px 0 6px">{{experience2Company}} &bull; {{experience2Duration}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:13px;color:#d97706;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Education</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#d97706;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Skills</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const blueSteel: ResumeTemplate = {
  id: 'blue-steel',
  name: 'Blue Steel',
  description: 'Striking two-column design with steel blue sidebar and bold headings.',
  category: 'resume',
  icon: 'User',
  new: true,
  styleCategory: 'modern',
  colorScheme: '#1e3a5f',
  fields: standardFields,
  content: `<div style="font-family:Arial,sans-serif;max-width:850px;margin:0 auto;display:flex;background:#fff;min-height:600px"><div style="width:36%;background:linear-gradient(180deg,#1e3a5f,#0f2440);color:#fff;padding:40px 26px"><div style="border-bottom:1px solid rgba(255,255,255,.2);padding-bottom:20px;margin-bottom:24px"><h1 style="font-size:24px;margin:0 0 6px;font-weight:700">{{fullName}}</h1><p style="font-size:12px;color:#93c5fd;margin:0;letter-spacing:1px;text-transform:uppercase">{{jobTitle}}</p></div><div style="margin-bottom:24px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#93c5fd;margin-bottom:10px">Contact</h3><p style="font-size:11px;margin:5px 0">{{email}}</p><p style="font-size:11px;margin:5px 0">{{phone}}</p><p style="font-size:11px;margin:5px 0">{{location}}</p><p style="font-size:11px;margin:5px 0">{{linkedin}}</p></div><div style="margin-bottom:24px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#93c5fd;margin-bottom:10px">Skills</h3><p style="font-size:11px;line-height:1.9;white-space:pre-line">{{skills}}</p></div><div><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#93c5fd;margin-bottom:10px">Education</h3><p style="font-size:11px;line-height:1.7;white-space:pre-line">{{education}}</p></div></div><div style="width:64%;padding:40px 30px"><div style="margin-bottom:24px"><h2 style="font-size:14px;color:#1e3a5f;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:3px solid #1e3a5f;padding-bottom:6px">About</h2><p style="color:#4a5568;line-height:1.7;font-size:13px">{{summary}}</p></div><div><h2 style="font-size:14px;color:#1e3a5f;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:3px solid #1e3a5f;padding-bottom:6px">Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#1e3a5f;margin:2px 0 6px">{{experience1Company}} | {{experience1Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#1e3a5f;margin:2px 0 6px">{{experience2Company}} | {{experience2Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div></div></div>`,
}

const simplyBlue: ResumeTemplate = {
  id: 'simply-blue',
  name: 'Simply Blue',
  description: 'Modern single-column with vibrant blue accents and clean sections.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'modern',
  colorScheme: '#2563eb',
  fields: standardFields,
  content: `<div style="font-family:Arial,sans-serif;max-width:850px;margin:0 auto;padding:44px;background:#fff"><div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;padding:28px 32px;border-radius:10px;margin-bottom:28px"><h1 style="font-size:28px;margin:0 0 4px">{{fullName}}</h1><p style="font-size:14px;opacity:.85;margin:0 0 14px">{{jobTitle}}</p><div style="font-size:12px;opacity:.75;display:flex;gap:14px;flex-wrap:wrap"><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span><span>{{linkedin}}</span></div></div><div style="margin-bottom:24px"><h2 style="font-size:13px;color:#2563eb;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Summary</h2><p style="color:#374151;line-height:1.7;font-size:13px">{{summary}}</p></div><div style="margin-bottom:24px"><h2 style="font-size:13px;color:#2563eb;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Experience</h2><div style="margin-bottom:16px;padding-left:14px;border-left:3px solid #2563eb"><h3 style="font-size:14px;color:#111827;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#2563eb;margin:2px 0 6px">{{experience1Company}} | {{experience1Duration}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div style="padding-left:14px;border-left:3px solid #2563eb"><h3 style="font-size:14px;color:#111827;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#2563eb;margin:2px 0 6px">{{experience2Company}} | {{experience2Duration}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:13px;color:#2563eb;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Education</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#2563eb;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Skills</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const obsidianEdge: ResumeTemplate = {
  id: 'obsidian-edge',
  name: 'Obsidian Edge',
  description: 'Dark-accented modern layout with sharp geometric styling.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'modern',
  colorScheme: '#18181b',
  fields: standardFields,
  content: `<div style="font-family:Arial,sans-serif;max-width:850px;margin:0 auto;padding:0;background:#fff"><div style="background:#18181b;color:#fff;padding:32px 40px"><h1 style="font-size:28px;margin:0 0 4px;font-weight:700">{{fullName}}</h1><p style="font-size:14px;color:#a1a1aa;margin:0 0 14px;letter-spacing:1px;text-transform:uppercase">{{jobTitle}}</p><div style="font-size:12px;color:#71717a;display:flex;gap:16px;flex-wrap:wrap"><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span><span>{{linkedin}}</span></div></div><div style="padding:36px 40px"><div style="margin-bottom:26px"><h2 style="font-size:13px;color:#18181b;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #18181b;padding-bottom:6px;display:inline-block">Profile</h2><p style="color:#52525b;line-height:1.7;font-size:13px">{{summary}}</p></div><div style="margin-bottom:26px"><h2 style="font-size:13px;color:#18181b;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #18181b;padding-bottom:6px;display:inline-block">Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:14px;color:#18181b;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#71717a;margin:2px 0 6px">{{experience1Company}} &mdash; {{experience1Duration}}</p><p style="font-size:13px;color:#52525b;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#18181b;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#71717a;margin:2px 0 6px">{{experience2Company}} &mdash; {{experience2Duration}}</p><p style="font-size:13px;color:#52525b;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:13px;color:#18181b;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Education</h2><p style="color:#52525b;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#18181b;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Skills</h2><p style="color:#52525b;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div></div>`,
}

const cobaltEdge: ResumeTemplate = {
  id: 'cobalt-edge',
  name: 'Cobalt Edge',
  description: 'Deep cobalt blue accents with angular header and modern sections.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'modern',
  colorScheme: '#1e40af',
  fields: standardFields,
  content: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:850px;margin:0 auto;padding:0;background:#fff"><div style="background:linear-gradient(135deg,#1e40af,#1e3a8a);color:#fff;padding:30px 40px;position:relative;overflow:hidden"><div style="position:absolute;top:-20px;right:-20px;width:120px;height:120px;background:rgba(255,255,255,.08);border-radius:50%"></div><h1 style="font-size:28px;margin:0 0 4px;position:relative">{{fullName}}</h1><p style="font-size:13px;color:#93c5fd;margin:0 0 12px;letter-spacing:1px;text-transform:uppercase;position:relative">{{jobTitle}}</p><div style="font-size:11px;color:#bfdbfe;display:flex;gap:14px;flex-wrap:wrap;position:relative"><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span><span>{{linkedin}}</span></div></div><div style="padding:32px 40px"><div style="margin-bottom:24px"><h2 style="font-size:13px;color:#1e40af;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;padding-left:12px;border-left:3px solid #1e40af">Summary</h2><p style="color:#374151;line-height:1.7;font-size:13px">{{summary}}</p></div><div style="margin-bottom:24px"><h2 style="font-size:13px;color:#1e40af;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;padding-left:12px;border-left:3px solid #1e40af">Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:14px;color:#111827;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#1e40af;margin:2px 0 6px">{{experience1Company}} | {{experience1Duration}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#111827;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#1e40af;margin:2px 0 6px">{{experience2Company}} | {{experience2Duration}}</p><p style="font-size:13px;color:#4b5563;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:13px;color:#1e40af;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Education</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#1e40af;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Skills</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div></div>`,
}

const designer: ResumeTemplate = {
  id: 'designer',
  name: 'Designer',
  description: 'Creative two-column layout with purple gradient sidebar for designers.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'modern',
  colorScheme: '#7c3aed',
  fields: standardFields,
  content: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:850px;margin:0 auto;display:flex;background:#fff;min-height:600px"><div style="width:35%;background:linear-gradient(180deg,#7c3aed,#5b21b6);color:#fff;padding:40px 26px"><div style="text-align:center;margin-bottom:30px"><div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.15);margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;border:2px solid rgba(255,255,255,.3)">{{fullName}}</div><h1 style="font-size:20px;margin:0 0 4px">{{fullName}}</h1><p style="font-size:11px;color:#c4b5fd;margin:0;letter-spacing:1px;text-transform:uppercase">{{jobTitle}}</p></div><div style="margin-bottom:24px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#c4b5fd;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,.2);padding-bottom:6px">Contact</h3><p style="font-size:11px;margin:5px 0">{{email}}</p><p style="font-size:11px;margin:5px 0">{{phone}}</p><p style="font-size:11px;margin:5px 0">{{location}}</p><p style="font-size:11px;margin:5px 0">{{linkedin}}</p></div><div style="margin-bottom:24px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#c4b5fd;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,.2);padding-bottom:6px">Skills</h3><p style="font-size:11px;line-height:1.9;white-space:pre-line">{{skills}}</p></div><div><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#c4b5fd;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,.2);padding-bottom:6px">Education</h3><p style="font-size:11px;line-height:1.7;white-space:pre-line">{{education}}</p></div></div><div style="width:65%;padding:40px 30px"><div style="margin-bottom:24px"><h2 style="font-size:14px;color:#7c3aed;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #7c3aed;padding-bottom:6px;display:inline-block">About Me</h2><p style="color:#4a5568;line-height:1.7;font-size:13px">{{summary}}</p></div><div><h2 style="font-size:14px;color:#7c3aed;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #7c3aed;padding-bottom:6px;display:inline-block">Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#7c3aed;margin:2px 0 6px">{{experience1Company}} &mdash; {{experience1Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#7c3aed;margin:2px 0 6px">{{experience2Company}} &mdash; {{experience2Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div></div></div>`,
}

// ===================== CREATIVE TEMPLATES (23-30) =====================

const powderBlush: ResumeTemplate = {
  id: 'powder-blush',
  name: 'Powder Blush',
  description: 'Soft pastel pink palette with rounded elements and warm typography.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'creative',
  colorScheme: '#be185d',
  fields: standardFields,
  content: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:850px;margin:0 auto;display:flex;background:#fff;min-height:600px"><div style="width:36%;background:linear-gradient(180deg,#fce7f3,#fbcfe8);padding:40px 26px"><h1 style="font-size:24px;color:#831843;margin:0 0 4px;font-weight:700">{{fullName}}</h1><p style="font-size:12px;color:#be185d;margin:0 0 28px;letter-spacing:1px;text-transform:uppercase">{{jobTitle}}</p><div style="margin-bottom:24px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#9d174d;margin-bottom:10px;border-bottom:1px solid #f9a8d4;padding-bottom:6px">Contact</h3><p style="font-size:11px;color:#831843;margin:5px 0">{{email}}</p><p style="font-size:11px;color:#831843;margin:5px 0">{{phone}}</p><p style="font-size:11px;color:#831843;margin:5px 0">{{location}}</p><p style="font-size:11px;color:#831843;margin:5px 0">{{linkedin}}</p></div><div style="margin-bottom:24px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#9d174d;margin-bottom:10px;border-bottom:1px solid #f9a8d4;padding-bottom:6px">Skills</h3><p style="font-size:11px;color:#831843;line-height:1.9;white-space:pre-line">{{skills}}</p></div><div><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#9d174d;margin-bottom:10px;border-bottom:1px solid #f9a8d4;padding-bottom:6px">Education</h3><p style="font-size:11px;color:#831843;line-height:1.7;white-space:pre-line">{{education}}</p></div></div><div style="width:64%;padding:40px 30px"><div style="margin-bottom:24px"><h2 style="font-size:14px;color:#be185d;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #f9a8d4;padding-bottom:6px">About</h2><p style="color:#4a5568;line-height:1.7;font-size:13px">{{summary}}</p></div><div><h2 style="font-size:14px;color:#be185d;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #f9a8d4;padding-bottom:6px">Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#be185d;margin:2px 0 6px">{{experience1Company}} &mdash; {{experience1Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#be185d;margin:2px 0 6px">{{experience2Company}} &mdash; {{experience2Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div></div></div>`,
}

const blackPattern: ResumeTemplate = {
  id: 'black-pattern',
  name: 'Black Pattern',
  description: 'Bold dark theme with geometric patterns and white text for impact.',
  category: 'resume',
  icon: 'User',
  new: true,
  styleCategory: 'creative',
  colorScheme: '#111827',
  fields: standardFields,
  content: `<div style="font-family:Arial,sans-serif;max-width:850px;margin:0 auto;display:flex;background:#111827;min-height:600px;color:#fff"><div style="width:36%;background:#1f2937;padding:40px 26px;border-right:3px solid #fbbf24"><h1 style="font-size:24px;margin:0 0 4px;color:#fbbf24">{{fullName}}</h1><p style="font-size:12px;color:#9ca3af;margin:0 0 28px;letter-spacing:1px;text-transform:uppercase">{{jobTitle}}</p><div style="margin-bottom:24px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#fbbf24;margin-bottom:10px;border-bottom:1px solid #374151;padding-bottom:6px">Contact</h3><p style="font-size:11px;color:#d1d5db;margin:5px 0">{{email}}</p><p style="font-size:11px;color:#d1d5db;margin:5px 0">{{phone}}</p><p style="font-size:11px;color:#d1d5db;margin:5px 0">{{location}}</p><p style="font-size:11px;color:#d1d5db;margin:5px 0">{{linkedin}}</p></div><div style="margin-bottom:24px"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#fbbf24;margin-bottom:10px;border-bottom:1px solid #374151;padding-bottom:6px">Skills</h3><p style="font-size:11px;color:#d1d5db;line-height:1.9;white-space:pre-line">{{skills}}</p></div><div><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#fbbf24;margin-bottom:10px;border-bottom:1px solid #374151;padding-bottom:6px">Education</h3><p style="font-size:11px;color:#d1d5db;line-height:1.7;white-space:pre-line">{{education}}</p></div></div><div style="width:64%;padding:40px 30px"><div style="margin-bottom:24px"><h2 style="font-size:14px;color:#fbbf24;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #374151;padding-bottom:6px">Profile</h2><p style="color:#d1d5db;line-height:1.7;font-size:13px">{{summary}}</p></div><div><h2 style="font-size:14px;color:#fbbf24;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;border-bottom:2px solid #374151;padding-bottom:6px">Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:14px;color:#fff;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#fbbf24;margin:2px 0 6px">{{experience1Company}} | {{experience1Duration}}</p><p style="font-size:13px;color:#d1d5db;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#fff;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#fbbf24;margin:2px 0 6px">{{experience2Company}} | {{experience2Duration}}</p><p style="font-size:13px;color:#d1d5db;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div></div></div>`,
}

const plumAccent: ResumeTemplate = {
  id: 'plum-accent',
  name: 'Plum Accent',
  description: 'Rich plum-colored accents with creative layout and elegant styling.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'creative',
  colorScheme: '#7e22ce',
  fields: standardFields,
  content: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:850px;margin:0 auto;padding:0;background:#fff"><div style="background:linear-gradient(135deg,#7e22ce,#581c87);color:#fff;padding:32px 40px"><h1 style="font-size:30px;margin:0 0 4px;font-weight:700">{{fullName}}</h1><p style="font-size:13px;color:#d8b4fe;margin:0 0 14px;letter-spacing:2px;text-transform:uppercase">{{jobTitle}}</p><div style="font-size:11px;color:#e9d5ff;display:flex;gap:14px;flex-wrap:wrap"><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span><span>{{linkedin}}</span></div></div><div style="padding:32px 40px"><div style="margin-bottom:24px;background:#faf5ff;padding:16px;border-left:4px solid #7e22ce;border-radius:0 8px 8px 0"><p style="color:#374151;line-height:1.7;font-size:13px;margin:0">{{summary}}</p></div><div style="margin-bottom:24px"><h2 style="font-size:13px;color:#7e22ce;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;border-bottom:2px solid #7e22ce;padding-bottom:6px;display:inline-block">Experience</h2><div style="margin-bottom:16px"><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#7e22ce;margin:2px 0 6px">{{experience1Company}} &bull; {{experience1Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#7e22ce;margin:2px 0 6px">{{experience2Company}} &bull; {{experience2Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:13px;color:#7e22ce;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Education</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#7e22ce;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Skills</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div></div>`,
}

const blueNeon: ResumeTemplate = {
  id: 'blue-neon',
  name: 'Blue Neon',
  description: 'Futuristic dark theme with neon blue glow effects and tech aesthetic.',
  category: 'resume',
  icon: 'User',
  new: true,
  styleCategory: 'creative',
  colorScheme: '#0ea5e9',
  fields: standardFields,
  content: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:850px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:0;min-height:600px"><div style="padding:36px 40px;border-bottom:2px solid #0ea5e9"><h1 style="font-size:30px;margin:0 0 4px;color:#0ea5e9;font-weight:700">{{fullName}}</h1><p style="font-size:14px;color:#7dd3fc;margin:0 0 14px;letter-spacing:2px;text-transform:uppercase">{{jobTitle}}</p><div style="font-size:12px;color:#94a3b8;display:flex;gap:16px;flex-wrap:wrap"><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span><span>{{linkedin}}</span></div></div><div style="padding:32px 40px"><div style="margin-bottom:26px"><h2 style="font-size:13px;color:#0ea5e9;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Summary</h2><p style="color:#cbd5e1;line-height:1.7;font-size:13px">{{summary}}</p></div><div style="margin-bottom:26px"><h2 style="font-size:13px;color:#0ea5e9;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Experience</h2><div style="margin-bottom:16px;padding-left:14px;border-left:2px solid #0ea5e9"><h3 style="font-size:14px;color:#f1f5f9;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#0ea5e9;margin:2px 0 6px">{{experience1Company}} | {{experience1Duration}}</p><p style="font-size:13px;color:#cbd5e1;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div style="padding-left:14px;border-left:2px solid #0ea5e9"><h3 style="font-size:14px;color:#f1f5f9;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#0ea5e9;margin:2px 0 6px">{{experience2Company}} | {{experience2Duration}}</p><p style="font-size:13px;color:#cbd5e1;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:13px;color:#0ea5e9;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Education</h2><p style="color:#cbd5e1;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#0ea5e9;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Skills</h2><p style="color:#cbd5e1;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div></div>`,
}

const space: ResumeTemplate = {
  id: 'space',
  name: 'Space',
  description: 'Deep space-themed dark layout with cosmic purple and starlight accents.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'creative',
  colorScheme: '#6d28d9',
  fields: standardFields,
  content: `<div style="font-family:Arial,sans-serif;max-width:850px;margin:0 auto;background:linear-gradient(180deg,#0f0720,#1a0a3e);color:#e2e8f0;padding:0;min-height:600px"><div style="padding:36px 40px;border-bottom:1px solid rgba(139,92,246,.3)"><h1 style="font-size:30px;margin:0 0 4px;color:#c4b5fd;font-weight:700">{{fullName}}</h1><p style="font-size:14px;color:#8b5cf6;margin:0 0 14px;letter-spacing:2px;text-transform:uppercase">{{jobTitle}}</p><div style="font-size:12px;color:#a78bfa;display:flex;gap:16px;flex-wrap:wrap"><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span><span>{{linkedin}}</span></div></div><div style="padding:32px 40px"><div style="margin-bottom:26px"><h2 style="font-size:13px;color:#8b5cf6;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">About</h2><p style="color:#c4b5fd;line-height:1.7;font-size:13px">{{summary}}</p></div><div style="margin-bottom:26px"><h2 style="font-size:13px;color:#8b5cf6;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Experience</h2><div style="margin-bottom:16px;padding:14px;background:rgba(139,92,246,.08);border-radius:8px;border-left:3px solid #8b5cf6"><h3 style="font-size:14px;color:#e2e8f0;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#8b5cf6;margin:2px 0 6px">{{experience1Company}} | {{experience1Duration}}</p><p style="font-size:13px;color:#c4b5fd;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div style="padding:14px;background:rgba(139,92,246,.08);border-radius:8px;border-left:3px solid #8b5cf6"><h3 style="font-size:14px;color:#e2e8f0;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#8b5cf6;margin:2px 0 6px">{{experience2Company}} | {{experience2Duration}}</p><p style="font-size:13px;color:#c4b5fd;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:13px;color:#8b5cf6;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Education</h2><p style="color:#c4b5fd;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#8b5cf6;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Skills</h2><p style="color:#c4b5fd;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div></div>`,
}

const flower: ResumeTemplate = {
  id: 'flower',
  name: 'Flower',
  description: 'Romantic floral-inspired design with rose gold accents and soft tones.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'creative',
  colorScheme: '#b45309',
  fields: standardFields,
  content: `<div style="font-family:Georgia,serif;max-width:850px;margin:0 auto;padding:48px;background:#fffbf0;border:2px solid #fde68a"><div style="text-align:center;margin-bottom:28px;border-bottom:2px solid #f59e0b;padding-bottom:20px"><h1 style="font-size:32px;color:#78350f;margin:0;font-weight:400;letter-spacing:1px">{{fullName}}</h1><p style="font-size:15px;color:#b45309;margin:8px 0 14px;letter-spacing:2px;text-transform:uppercase;font-style:italic">{{jobTitle}}</p><div style="font-size:12px;color:#92400e">{{email}} &bull; {{phone}} &bull; {{location}} &bull; {{linkedin}}</div></div><div style="margin-bottom:24px"><h2 style="font-size:13px;color:#b45309;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;font-weight:600">About</h2><p style="color:#44403c;line-height:1.8;font-size:13px;font-style:italic">{{summary}}</p></div><div style="margin-bottom:24px"><h2 style="font-size:13px;color:#b45309;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;font-weight:600">Experience</h2><div style="margin-bottom:14px;padding-left:14px;border-left:2px solid #fbbf24"><h3 style="font-size:14px;color:#78350f;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#b45309;margin:2px 0 6px">{{experience1Company}} &bull; {{experience1Duration}}</p><p style="font-size:13px;color:#44403c;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div style="padding-left:14px;border-left:2px solid #fbbf24"><h3 style="font-size:14px;color:#78350f;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#b45309;margin:2px 0 6px">{{experience2Company}} &bull; {{experience2Duration}}</p><p style="font-size:13px;color:#44403c;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:13px;color:#b45309;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;font-weight:600">Education</h2><p style="color:#44403c;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#b45309;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;font-weight:600">Skills</h2><p style="color:#44403c;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div>`,
}

const goldenMosaic: ResumeTemplate = {
  id: 'golden-mosaic',
  name: 'Golden Mosaic',
  description: 'Luxurious gold and dark palette with ornate styling for creative pros.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'creative',
  colorScheme: '#ca8a04',
  fields: standardFields,
  content: `<div style="font-family:Georgia,serif;max-width:850px;margin:0 auto;background:#1c1917;color:#e7e5e4;padding:0;min-height:600px"><div style="padding:36px 40px;border-bottom:2px solid #ca8a04"><h1 style="font-size:30px;margin:0 0 4px;color:#fbbf24;font-weight:400;letter-spacing:2px">{{fullName}}</h1><p style="font-size:13px;color:#ca8a04;margin:0 0 14px;letter-spacing:3px;text-transform:uppercase">{{jobTitle}}</p><div style="font-size:11px;color:#a8a29e;display:flex;gap:14px;flex-wrap:wrap"><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span><span>{{linkedin}}</span></div></div><div style="padding:32px 40px"><div style="margin-bottom:26px"><h2 style="font-size:12px;color:#ca8a04;text-transform:uppercase;letter-spacing:3px;margin-bottom:10px">Summary</h2><p style="color:#d6d3d1;line-height:1.7;font-size:13px">{{summary}}</p></div><div style="margin-bottom:26px"><h2 style="font-size:12px;color:#ca8a04;text-transform:uppercase;letter-spacing:3px;margin-bottom:10px">Experience</h2><div style="margin-bottom:16px;padding-left:14px;border-left:2px solid #ca8a04"><h3 style="font-size:14px;color:#fbbf24;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#a8a29e;margin:2px 0 6px">{{experience1Company}} | {{experience1Duration}}</p><p style="font-size:13px;color:#d6d3d1;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div style="padding-left:14px;border-left:2px solid #ca8a04"><h3 style="font-size:14px;color:#fbbf24;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#a8a29e;margin:2px 0 6px">{{experience2Company}} | {{experience2Duration}}</p><p style="font-size:13px;color:#d6d3d1;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:12px;color:#ca8a04;text-transform:uppercase;letter-spacing:3px;margin-bottom:8px">Education</h2><p style="color:#d6d3d1;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:12px;color:#ca8a04;text-transform:uppercase;letter-spacing:3px;margin-bottom:8px">Skills</h2><p style="color:#d6d3d1;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div></div>`,
}

const happy: ResumeTemplate = {
  id: 'happy',
  name: 'Happy',
  description: 'Cheerful and colorful design with playful coral and teal accents.',
  category: 'resume',
  icon: 'User',
  styleCategory: 'creative',
  colorScheme: '#f43f5e',
  fields: standardFields,
  content: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:850px;margin:0 auto;padding:0;background:#fff"><div style="background:linear-gradient(135deg,#f43f5e,#ec4899);color:#fff;padding:32px 40px;border-radius:0 0 24px 24px"><h1 style="font-size:30px;margin:0 0 4px;font-weight:700">{{fullName}}</h1><p style="font-size:14px;opacity:.9;margin:0 0 14px;letter-spacing:1px">{{jobTitle}}</p><div style="font-size:12px;opacity:.8;display:flex;gap:14px;flex-wrap:wrap"><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span><span>{{linkedin}}</span></div></div><div style="padding:32px 40px"><div style="margin-bottom:24px;background:#fff1f2;padding:16px;border-radius:12px"><h2 style="font-size:13px;color:#f43f5e;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">About Me</h2><p style="color:#374151;line-height:1.7;font-size:13px;margin:0">{{summary}}</p></div><div style="margin-bottom:24px"><h2 style="font-size:13px;color:#f43f5e;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Experience</h2><div style="margin-bottom:16px;padding:14px;background:#fdf2f8;border-radius:10px"><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience1Title}}</h3><p style="font-size:12px;color:#ec4899;margin:2px 0 6px">{{experience1Company}} &bull; {{experience1Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience1Desc}}</p></div><div style="padding:14px;background:#fdf2f8;border-radius:10px"><h3 style="font-size:14px;color:#1a202c;margin:0">{{experience2Title}}</h3><p style="font-size:12px;color:#ec4899;margin:2px 0 6px">{{experience2Company}} &bull; {{experience2Duration}}</p><p style="font-size:13px;color:#4a5568;line-height:1.7;white-space:pre-line">{{experience2Desc}}</p></div></div><div style="display:flex;gap:36px"><div style="flex:1"><h2 style="font-size:13px;color:#f43f5e;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Education</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{education}}</p></div><div style="flex:1"><h2 style="font-size:13px;color:#f43f5e;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Skills</h2><p style="color:#4b5563;font-size:13px;line-height:1.7;white-space:pre-line">{{skills}}</p></div></div></div></div>`,
}

// ===================== EXPORTS =====================

export const resumeTemplates: ResumeTemplate[] = [
  // Popular (1-6)
  atlanticBlue, classic, mercury, executive, harvard, leaves,
  // Simple (7-14)
  corporate, finance, refined, trueBlue, banking, cleanSlate, fineLine, sageLine,
  // Modern (15-22)
  quicksilver, hunterGreen, saffronLine, blueSteel, simplyBlue, obsidianEdge, cobaltEdge, designer,
  // Creative (23-30)
  powderBlush, blackPattern, plumAccent, blueNeon, space, flower, goldenMosaic, happy,
]

export function getResumeTemplatesByStyle(style?: ResumeStyleCategory): ResumeTemplate[] {
  if (!style) return resumeTemplates
  return resumeTemplates.filter(t => t.styleCategory === style)
}

export function getResumeTemplateById(id: string): ResumeTemplate | undefined {
  return resumeTemplates.find(t => t.id === id)
}

export function searchResumeTemplates(query: string): ResumeTemplate[] {
  const q = query.toLowerCase().trim()
  if (!q) return resumeTemplates
  return resumeTemplates.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.styleCategory.includes(q)
  )
}
