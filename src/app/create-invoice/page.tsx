'use client'

import React, { useState, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { incrementInvoiceCount } from '@/lib/usageLimit'
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  Calendar,
  ChevronDown,
  Check,
  Send,
  Download,
  Building2,
  User,
  MoreHorizontal,
  Image as ImageIcon,
  Eye,
  X,
  Printer
} from 'lucide-react'

interface InvoiceItem {
  id: string
  name: string
  description: string
  quantity: number
  unit: string
  price: number
  tax: number
  total: number
}

interface InvoiceData {
  // Business Info
  businessName: string
  businessEmail: string
  businessPhone: string
  businessAddress: string
  businessLogo: string | null
  backgroundLogo: string | null

  // Client Info
  clientName: string
  clientEmail: string
  clientPhone: string
  clientAddress: string

  // Invoice Details
  invoiceNumber: string
  issueDate: string
  dueDate: string
  deliveryDate: string

  // Items
  items: InvoiceItem[]

  // Additional
  notes: string
  bankDetails: string

  // Selected Template
  selectedTemplate: string

  // Currency
  currency: string
}

// World Currencies
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
  { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal' },
  { code: 'OMR', symbol: 'ر.ع.', name: 'Omani Rial' },
  { code: 'BHD', symbol: 'د.ب', name: 'Bahraini Dinar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar' },
]

// Invoice Templates Data
const invoiceTemplates = [
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    description: 'Professional blue header with clean layout',
    preview: '/templates/classic-blue.png',
    colors: { primary: '#2563EB', secondary: '#1E40AF', accent: '#DBEAFE' }
  },
  {
    id: 'modern-signature',
    name: 'Modern Signature',
    description: 'Navy theme with signature space',
    preview: '/templates/modern-signature.png',
    colors: { primary: '#1E3A5F', secondary: '#C4A35A', accent: '#FEF3C7' }
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Clean and simple professional look',
    preview: '/templates/minimal-clean.png',
    colors: { primary: '#111827', secondary: '#6B7280', accent: '#F9FAFB' }
  },
  {
    id: 'corporate-wave',
    name: 'Corporate Wave',
    description: 'Blue wave design with modern feel',
    preview: '/templates/corporate-wave.png',
    colors: { primary: '#1E40AF', secondary: '#3B82F6', accent: '#EFF6FF' }
  },
  {
    id: 'elegant-black',
    name: 'Elegant Black',
    description: 'Black and white minimalist design',
    preview: '/templates/elegant-black.png',
    colors: { primary: '#000000', secondary: '#374151', accent: '#F3F4F6' }
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Bold colors with creative layout',
    preview: '/templates/creative-bold.png',
    colors: { primary: '#7C3AED', secondary: '#A78BFA', accent: '#EDE9FE' }
  },
]

const CreateInvoicePage: React.FC = () => {
  const { user } = useUser()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const bgLogoInputRef = useRef<HTMLInputElement>(null)

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    businessLogo: null,
    backgroundLogo: null,

    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',

    invoiceNumber: `${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '14 days',
    deliveryDate: '',

    items: [{ id: '1', name: '', description: '', quantity: 1, unit: '', price: 0, tax: 20, total: 0 }],

    notes: '',
    bankDetails: '',

    selectedTemplate: 'classic-blue',
    currency: 'USD',
  })

  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [currencySearch, setCurrencySearch] = useState('')
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)

  // Calculate totals
  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.price
    const taxAmount = subtotal * (item.tax / 100)
    return subtotal + taxAmount
  }

  const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  const totalTax = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price * (item.tax / 100)), 0)
  const grandTotal = subtotal + totalTax

  const handleInputChange = (field: keyof InvoiceData, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }))
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoiceData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    newItems[index].total = calculateItemTotal(newItems[index])
    handleInputChange('items', newItems)
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: 1,
      unit: '',
      price: 0,
      tax: 20,
      total: 0
    }
    handleInputChange('items', [...invoiceData.items, newItem])
  }

  const removeItem = (index: number) => {
    if (invoiceData.items.length > 1) {
      handleInputChange('items', invoiceData.items.filter((_, i) => i !== index))
    }
  }

  // Handle PDF download and increment usage count
  const handleDownloadPDF = () => {
    // Increment invoice count when generating/downloading
    if (user?.id) {
      incrementInvoiceCount(user.id)
    }
    // TODO: Add actual PDF generation logic here
    window.print()
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleInputChange('businessLogo', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBgLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleInputChange('backgroundLogo', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const selectedCurrency = currencies.find(c => c.code === invoiceData.currency) || currencies[0]

  const formatCurrency = (amount: number) => {
    return `${selectedCurrency.symbol} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const filteredCurrencies = currencies.filter(c =>
    c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.symbol.includes(currencySearch)
  )

  const selectedTemplateData = invoiceTemplates.find(t => t.id === invoiceData.selectedTemplate)

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="flex">
        {/* Left Side - Template Selection */}
        <div className="w-80 bg-gray-50/80 border-r border-gray-200/50 min-h-screen p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h2>

          <div className="space-y-4">
            {invoiceTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleInputChange('selectedTemplate', template.id)}
                className={`w-full text-left rounded-xl overflow-hidden border-2 transition-all ${
                  invoiceData.selectedTemplate === template.id
                    ? 'border-blue-500 ring-2 ring-blue-100'
                    : 'border-gray-200/50 hover:border-gray-300'
                }`}
              >
                {/* Template Preview */}
                <div
                  className="h-40 relative"
                  style={{ backgroundColor: template.colors.accent }}
                >
                  {/* Mini Invoice Preview */}
                  <div className="absolute inset-2 bg-gray-50/80 rounded-lg shadow-sm overflow-hidden">
                    <div
                      className="h-8"
                      style={{ backgroundColor: template.colors.primary }}
                    >
                      <span className="text-gray-900 text-xs font-bold px-2 py-1">INVOICE</span>
                    </div>
                    <div className="p-2">
                      <div className="flex justify-between mb-2">
                        <div className="w-12 h-6 rounded" style={{ backgroundColor: template.colors.accent }}></div>
                        <div className="text-right">
                          <div className="w-16 h-2 rounded mb-1" style={{ backgroundColor: template.colors.accent }}></div>
                          <div className="w-12 h-2 rounded" style={{ backgroundColor: template.colors.accent }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div
                          className="h-4 rounded text-[8px] text-gray-900 font-medium flex items-center px-1"
                          style={{ backgroundColor: template.colors.primary }}
                        >
                          Description
                        </div>
                        <div className="h-3 rounded w-full" style={{ backgroundColor: template.colors.accent }}></div>
                        <div className="h-3 rounded w-3/4" style={{ backgroundColor: template.colors.accent }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Checkmark */}
                  {invoiceData.selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-900" />
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-3 bg-gray-50/80">
                  <h3 className="font-medium text-gray-900 text-sm">{template.name}</h3>
                  <p className="text-xs text-gray-600 mt-0.5">{template.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            {/* Logo Upload Section */}
            <div className="bg-gray-50/80 rounded-xl border border-gray-200/50 p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Invoice Branding</h3>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">Optional</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Business Logo */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Your Logo</label>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {invoiceData.businessLogo ? (
                    <div className="relative group h-20 border border-gray-200/50 rounded-lg flex items-center justify-center bg-gray-50/80 p-2">
                      <img
                        src={invoiceData.businessLogo}
                        alt="Logo"
                        className="h-full object-contain"
                      />
                      <button
                        onClick={() => handleInputChange('businessLogo', null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-gray-900 rounded-full text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full h-20 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-600 hover:text-blue-600"
                    >
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-xs font-medium">Add your logo</span>
                    </button>
                  )}
                </div>

                {/* Background/Watermark Logo */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Background Logo (Watermark)</label>
                  <input
                    type="file"
                    ref={bgLogoInputRef}
                    onChange={handleBgLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {invoiceData.backgroundLogo ? (
                    <div className="relative group h-20 border border-gray-200/50 rounded-lg flex items-center justify-center bg-gray-50/80 p-2">
                      <img
                        src={invoiceData.backgroundLogo}
                        alt="Background Logo"
                        className="h-full object-contain opacity-30"
                      />
                      <button
                        onClick={() => handleInputChange('backgroundLogo', null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-gray-900 rounded-full text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => bgLogoInputRef.current?.click()}
                      className="w-full h-20 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-gray-600 hover:text-purple-600"
                    >
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-xs font-medium">Add background logo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Header - Invoice Title */}
            <div className="flex items-center justify-between mb-8">
              <div></div>
              {/* Invoice Title & Number */}
              <div className="text-right">
                <h1 className="text-3xl font-bold" style={{ color: selectedTemplateData?.colors.primary }}>
                  INVOICE {invoiceData.invoiceNumber}
                </h1>
              </div>
            </div>

            {/* Form Sections */}
            <div className="space-y-6">
              {/* FROM Section */}
              <div className="bg-gray-50/80 rounded-xl border border-gray-200/50 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'from' ? null : 'from')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-600 uppercase tracking-wider">FROM</p>
                      <p className="text-sm font-medium text-gray-900">
                        {invoiceData.businessName || 'Add your business details'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-medium">1.</span>
                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${expandedSection === 'from' ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {expandedSection === 'from' && (
                  <div className="p-4 pt-0 border-t border-gray-200/50 space-y-4">
                    <input
                      type="text"
                      value={invoiceData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Business Name"
                      className="w-full px-4 py-2.5 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="email"
                        value={invoiceData.businessEmail}
                        onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-2.5 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        value={invoiceData.businessPhone}
                        onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                        placeholder="Phone"
                        className="w-full px-4 py-2.5 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <textarea
                      value={invoiceData.businessAddress}
                      onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                      placeholder="Address"
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                )}
              </div>

              {/* BILL TO Section */}
              <div className="bg-gray-50/80 rounded-xl border border-gray-200/50 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'billto' ? null : 'billto')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-600 uppercase tracking-wider">BILL TO</p>
                      <p className="text-sm font-medium text-gray-900">
                        {invoiceData.clientName || 'Add customer details'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-medium">2.</span>
                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${expandedSection === 'billto' ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {expandedSection === 'billto' && (
                  <div className="p-4 pt-0 border-t border-gray-200/50 space-y-4">
                    <input
                      type="text"
                      value={invoiceData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="Client Name"
                      className="w-full px-4 py-2.5 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="email"
                        value={invoiceData.clientEmail}
                        onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-2.5 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        value={invoiceData.clientPhone}
                        onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                        placeholder="Phone"
                        className="w-full px-4 py-2.5 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <textarea
                      value={invoiceData.clientAddress}
                      onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                      placeholder="Address"
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Invoice Details */}
              <div className="bg-gray-50/80 rounded-xl border border-gray-200/50 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-medium">3.</span>
                  <span className="text-sm font-medium text-gray-600">Invoice Details</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Invoice number *</label>
                    <input
                      type="text"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Issue date *</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={invoiceData.issueDate}
                        onChange={(e) => handleInputChange('issueDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Due date *</label>
                    <select
                      value={invoiceData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-gray-50/80"
                    >
                      <option value="7 days">7 days</option>
                      <option value="14 days">14 days</option>
                      <option value="30 days">30 days</option>
                      <option value="60 days">60 days</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Delivery date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={invoiceData.deliveryDate}
                        onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Currency Selector */}
                <div className="mt-4 pt-4 border-t border-gray-200/50">
                  <label className="block text-xs text-gray-600 mb-2">Currency</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                      className="w-full md:w-64 px-3 py-2 border border-gray-200/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/80 text-left flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-medium">{selectedCurrency.symbol}</span>
                        <span>{selectedCurrency.code}</span>
                        <span className="text-gray-600">- {selectedCurrency.name}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showCurrencyDropdown && (
                      <div className="absolute z-20 mt-1 w-full md:w-80 bg-gray-50/80 border border-gray-200/50 rounded-lg shadow-lg">
                        <div className="p-2 border-b border-gray-200/50">
                          <input
                            type="text"
                            value={currencySearch}
                            onChange={(e) => setCurrencySearch(e.target.value)}
                            placeholder="Search currency..."
                            className="w-full px-3 py-2 border border-gray-200/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCurrencies.map((currency) => (
                            <button
                              key={currency.code}
                              type="button"
                              onClick={() => {
                                handleInputChange('currency', currency.code)
                                setShowCurrencyDropdown(false)
                                setCurrencySearch('')
                              }}
                              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50/80 flex items-center gap-3 ${
                                invoiceData.currency === currency.code ? 'bg-blue-50 text-blue-600' : ''
                              }`}
                            >
                              <span className="w-8 font-medium">{currency.symbol}</span>
                              <span className="font-medium">{currency.code}</span>
                              <span className="text-gray-600">{currency.name}</span>
                              {invoiceData.currency === currency.code && (
                                <Check className="w-4 h-4 ml-auto text-blue-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <MoreHorizontal className="w-4 h-4" />
                  MORE OPTIONS
                </button>
              </div>

              {/* Items Section */}
              <div className="bg-gray-50/80 rounded-xl border border-gray-200/50 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-medium">4.</span>
                  <span className="text-sm font-medium text-gray-600">I invoice you:</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full font-medium ml-auto">5.</span>
                </div>

                {/* Items Header */}
                <div className="grid grid-cols-12 gap-2 mb-2 text-xs text-gray-600 font-medium">
                  <div className="col-span-4">Item</div>
                  <div className="col-span-1 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Unit</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-1 text-center">DPH%</div>
                  <div className="col-span-1 text-right">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {invoiceData.items.map((item, index) => (
                    <div key={item.id} className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            placeholder="Enter a name here"
                            className="w-full px-3 py-2 border border-gray-200/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            min="0"
                            className="w-full px-2 py-2 border border-gray-200/50 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            placeholder="pcs"
                            className="w-full px-2 py-2 border border-gray-200/50 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-2 py-2 border border-gray-200/50 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="number"
                            value={item.tax}
                            onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            className="w-full px-2 py-2 border border-gray-200/50 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="col-span-1 text-right text-sm font-medium text-gray-900">
                          {(item.quantity * item.price).toFixed(2)}
                        </div>
                        <div className="col-span-1 text-center">
                          <button
                            onClick={() => removeItem(index)}
                            className="p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            disabled={invoiceData.items.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="pl-0">
                        <textarea
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="Enter a description here"
                          rows={1}
                          className="w-full px-3 py-2 border border-gray-200/50 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Item Button */}
                <button
                  onClick={addItem}
                  className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add item
                </button>
              </div>

              {/* Notes & Bank Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50/80 rounded-xl border border-gray-200/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-medium">9.</span>
                    <label className="text-sm font-medium text-gray-600">Add a note</label>
                  </div>
                  <textarea
                    value={invoiceData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Notes for the client..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="bg-gray-50/80 rounded-xl border border-gray-200/50 p-4">
                  <label className="text-sm font-medium text-gray-600 block mb-3">Add bank details</label>
                  <textarea
                    value={invoiceData.bankDetails}
                    onChange={(e) => handleInputChange('bankDetails', e.target.value)}
                    placeholder="Bank name, Account number, etc..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50/80 rounded-xl border border-gray-200/50 p-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">SUBTOTAL</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div
                      className="flex justify-between text-sm font-semibold py-2 px-3 rounded-lg"
                      style={{ backgroundColor: selectedTemplateData?.colors.primary, color: 'white' }}
                    >
                      <span>TOTAL</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="py-4 bg-gray-50/80 text-gray-600 font-semibold rounded-xl transition-all hover:bg-gray-200 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    Preview Invoice
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="py-4 text-gray-900 font-semibold rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: selectedTemplateData?.colors.primary }}
                  >
                    <Download className="w-5 h-5" />
                    Generate PDF
                  </button>
                </div>
                <button className="w-full py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Send document by email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPreview(false)
          }}
        >
          <div className="bg-gray-50/80 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-gray-50/80">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-50/80 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                  Back to Edit
                </button>
                <h2 className="text-lg font-semibold text-gray-900">Invoice Preview</h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-gray-50/80 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium">
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 text-gray-900 rounded-lg transition-all hover:shadow-lg flex items-center gap-2 text-sm font-medium"
                  style={{ backgroundColor: selectedTemplateData?.colors.primary }}
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setShowPreview(false)}
                  className="ml-2 w-10 h-10 bg-red-500 hover:bg-red-600 text-gray-900 rounded-lg flex items-center justify-center transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Preview Content */}
            <div className="flex-1 overflow-auto p-6 bg-gray-50/80">
              <div className="bg-gray-50/80 shadow-lg mx-auto relative overflow-hidden" style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
                {/* Background Logo / Watermark */}
                {invoiceData.backgroundLogo && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img
                      src={invoiceData.backgroundLogo}
                      alt="Watermark"
                      className="w-[60%] h-auto opacity-[0.08]"
                    />
                  </div>
                )}

                {/* Close Button on Invoice Paper Corner */}
                <button
                  onClick={() => setShowPreview(false)}
                  className="absolute -top-3 -right-3 w-12 h-12 bg-red-500 hover:bg-red-600 text-gray-900 rounded-full flex items-center justify-center shadow-xl transition-colors border-4 border-white z-10"
                  title="Close Preview"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    {invoiceData.businessLogo ? (
                      <img src={invoiceData.businessLogo} alt="Logo" className="h-16 object-contain mb-4" />
                    ) : (
                      <div
                        className="text-2xl font-bold mb-4"
                        style={{ color: selectedTemplateData?.colors.primary }}
                      >
                        {invoiceData.businessName || 'Your Company'}
                      </div>
                    )}
                    {invoiceData.businessLogo && invoiceData.businessName && (
                      <div className="text-lg font-semibold text-gray-900">{invoiceData.businessName}</div>
                    )}
                    <div className="text-sm text-gray-700 mt-2 space-y-0.5">
                      {invoiceData.businessEmail && <div>{invoiceData.businessEmail}</div>}
                      {invoiceData.businessPhone && <div>{invoiceData.businessPhone}</div>}
                      {invoiceData.businessAddress && <div className="whitespace-pre-line">{invoiceData.businessAddress}</div>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-3xl font-bold mb-3"
                      style={{ color: selectedTemplateData?.colors.primary }}
                    >
                      INVOICE
                    </div>
                    <div className="text-sm space-y-1">
                      <div><span className="text-gray-600">Invoice #:</span> <span className="font-semibold">{invoiceData.invoiceNumber}</span></div>
                      <div><span className="text-gray-600">Date:</span> <span className="font-semibold">{new Date(invoiceData.issueDate).toLocaleDateString()}</span></div>
                      <div><span className="text-gray-600">Due:</span> <span className="font-semibold">{invoiceData.dueDate}</span></div>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: selectedTemplateData?.colors.accent }}>
                  <div
                    className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: selectedTemplateData?.colors.primary }}
                  >
                    Bill To
                  </div>
                  <div className="font-semibold text-gray-900">{invoiceData.clientName || 'Client Name'}</div>
                  <div className="text-sm text-gray-700 mt-1 space-y-0.5">
                    {invoiceData.clientEmail && <div>{invoiceData.clientEmail}</div>}
                    {invoiceData.clientPhone && <div>{invoiceData.clientPhone}</div>}
                    {invoiceData.clientAddress && <div className="whitespace-pre-line">{invoiceData.clientAddress}</div>}
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: selectedTemplateData?.colors.primary }}>
                        <th className="text-left text-gray-900 font-semibold py-3 px-4 text-sm">Description</th>
                        <th className="text-center text-gray-900 font-semibold py-3 px-4 text-sm">Qty</th>
                        <th className="text-center text-gray-900 font-semibold py-3 px-4 text-sm">Unit</th>
                        <th className="text-right text-gray-900 font-semibold py-3 px-4 text-sm">Price</th>
                        <th className="text-right text-gray-900 font-semibold py-3 px-4 text-sm">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50/80' : 'bg-gray-50/80'}>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{item.name || 'Item'}</div>
                            {item.description && <div className="text-sm text-gray-600">{item.description}</div>}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-700">{item.quantity}</td>
                          <td className="py-3 px-4 text-center text-gray-700">{item.unit || '-'}</td>
                          <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(item.price)}</td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(item.quantity * item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-72">
                    <div className="flex justify-between py-2 border-b border-gray-200/50 text-sm">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    {totalTax > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-200/50 text-sm">
                        <span className="text-gray-700">Tax</span>
                        <span className="font-medium">{formatCurrency(totalTax)}</span>
                      </div>
                    )}
                    <div
                      className="flex justify-between py-3 mt-2 rounded-lg px-4 text-lg"
                      style={{ backgroundColor: selectedTemplateData?.colors.primary, color: 'white' }}
                    >
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes & Bank Details */}
                {(invoiceData.notes || invoiceData.bankDetails) && (
                  <div className="border-t border-gray-200/50 pt-6 grid grid-cols-2 gap-6">
                    {invoiceData.notes && (
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">Notes</div>
                        <div className="text-sm text-gray-700 whitespace-pre-line">{invoiceData.notes}</div>
                      </div>
                    )}
                    {invoiceData.bankDetails && (
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">Bank Details</div>
                        <div className="text-sm text-gray-700 whitespace-pre-line">{invoiceData.bankDetails}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-gray-200/50 text-center">
                  <div className="text-sm text-gray-600">Thank you for your business!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateInvoicePage
