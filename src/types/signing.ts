export type FieldType = 'signature' | 'initials' | 'date' | 'text' | 'checkbox'

export interface DocumentField {
  id: string
  document_id: string
  signer_id?: string | null
  field_type: FieldType
  page_number: number
  x: number
  y: number
  width: number
  height: number
  required: boolean
  label?: string
  value?: string
  created_at?: string
  updated_at?: string
}

export interface Signer {
  id: string
  document_id: string
  name: string
  email: string
  order: number
  status: 'pending' | 'sent' | 'opened' | 'signed' | 'declined'
  color?: string
  signed_at?: string
  created_at?: string
  updated_at?: string
}

export const FIELD_CONFIGS: Record<FieldType, {
  label: string
  icon: string
  defaultWidth: number
  defaultHeight: number
}> = {
  signature: {
    label: 'Signature',
    icon: 'PenTool',
    defaultWidth: 25,
    defaultHeight: 8,
  },
  initials: {
    label: 'Initials',
    icon: 'Type',
    defaultWidth: 12,
    defaultHeight: 6,
  },
  date: {
    label: 'Date',
    icon: 'Calendar',
    defaultWidth: 20,
    defaultHeight: 5,
  },
  text: {
    label: 'Text',
    icon: 'AlignLeft',
    defaultWidth: 30,
    defaultHeight: 5,
  },
  checkbox: {
    label: 'Checkbox',
    icon: 'CheckSquare',
    defaultWidth: 4,
    defaultHeight: 4,
  },
}

export const SIGNER_COLORS = [
  { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700' },
  { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700' },
  { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700' },
  { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700' },
  { bg: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-700' },
  { bg: 'bg-cyan-50', border: 'border-cyan-500', text: 'text-cyan-700' },
]
