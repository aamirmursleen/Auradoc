'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { incrementInvoiceCount } from '@/lib/usageLimit'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
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
  Printer,
  Share2,
  Copy,
  Mail,
  MessageCircle,
  Link2,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

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
  // Logo position and size (in percentage of container)
  logoX: number
  logoY: number
  logoWidth: number
  logoHeight: number
  // Background logo position and size
  bgLogoX: number
  bgLogoY: number
  bgLogoWidth: number
  bgLogoHeight: number

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

  // More Options
  poNumber?: string
  referenceNumber?: string
  discount?: number
  shipping?: number
  paymentTerms?: string
  footerNote?: string
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
  const { theme } = useTheme()
  const isDark = theme === 'dark'
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
    logoX: 20,
    logoY: 50,
    logoWidth: 120,
    logoHeight: 60,
    bgLogoX: 30,
    bgLogoY: 30,
    bgLogoWidth: 40,
    bgLogoHeight: 40,

    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',

    invoiceNumber: '', // Will be set on client side
    issueDate: '',     // Will be set on client side
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
  const [showShareModal, setShowShareModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailTo, setEmailTo] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  // Generate invoice number and date on client side to avoid hydration error
  useEffect(() => {
    const year = new Date().getFullYear()
    const randomNum = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
    const today = new Date().toISOString().split('T')[0]

    setInvoiceData(prev => ({
      ...prev,
      invoiceNumber: prev.invoiceNumber || `${year}${randomNum}`,
      issueDate: prev.issueDate || today
    }))
  }, [])

  // Calculate totals
  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.price
    const taxAmount = subtotal * (item.tax / 100)
    return subtotal + taxAmount
  }

  // Logo drag/resize states
  const [isDraggingLogo, setIsDraggingLogo] = useState<'logo' | 'bgLogo' | null>(null)
  const [isResizingLogo, setIsResizingLogo] = useState<'logo' | 'bgLogo' | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [logoStartPos, setLogoStartPos] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const invoicePreviewRef = useRef<HTMLDivElement>(null)

  const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  const totalTax = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price * (item.tax / 100)), 0)
  const discountAmount = subtotal * ((invoiceData.discount || 0) / 100)
  const shippingAmount = invoiceData.shipping || 0
  const grandTotal = subtotal + totalTax - discountAmount + shippingAmount

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
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  const handleDownloadPDF = async () => {
    if (downloadingPDF) return

    setDownloadingPDF(true)

    // If preview modal is not open, open it so the ref element exists
    const wasPreviewOpen = showPreview
    if (!showPreview) {
      setShowPreview(true)
    }

    // Wait for the DOM to render the preview element
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      const el = invoicePreviewRef.current
      if (!el) {
        console.error('Invoice preview element not found')
        return
      }

      if (user?.id) {
        incrementInvoiceCount(user.id)
      }

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      const pdfWidth = 210
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth

      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: pdfHeight <= 297 ? 'a4' : [pdfWidth, pdfHeight],
      })

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Invoice_${invoiceData.invoiceNumber || 'draft'}.pdf`)
    } catch (err) {
      console.error('PDF download error:', err)
    } finally {
      // Close preview if it wasn't open before
      if (!wasPreviewOpen) {
        setShowPreview(false)
      }
      setDownloadingPDF(false)
    }
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

  // Logo drag handlers - supports both mouse and touch
  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if ('clientX' in e) {
      return { x: e.clientX, y: e.clientY }
    }
    return { x: 0, y: 0 }
  }

  const handleLogoDragStart = (e: React.MouseEvent | React.TouchEvent, type: 'logo' | 'bgLogo') => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingLogo(type)
    const pos = getEventPos(e)
    setDragStart(pos)
    if (type === 'logo') {
      setLogoStartPos({ x: invoiceData.logoX, y: invoiceData.logoY, width: invoiceData.logoWidth, height: invoiceData.logoHeight })
    } else {
      setLogoStartPos({ x: invoiceData.bgLogoX, y: invoiceData.bgLogoY, width: invoiceData.bgLogoWidth, height: invoiceData.bgLogoHeight })
    }
  }

  const handleLogoResizeStart = (e: React.MouseEvent | React.TouchEvent, type: 'logo' | 'bgLogo') => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizingLogo(type)
    setIsDraggingLogo(null)
    const pos = getEventPos(e)
    setDragStart(pos)
    if (type === 'logo') {
      setLogoStartPos({ x: invoiceData.logoX, y: invoiceData.logoY, width: invoiceData.logoWidth, height: invoiceData.logoHeight })
    } else {
      setLogoStartPos({ x: invoiceData.bgLogoX, y: invoiceData.bgLogoY, width: invoiceData.bgLogoWidth, height: invoiceData.bgLogoHeight })
    }
  }

  const handleLogoMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingLogo && !isResizingLogo) return

    e.preventDefault()
    const pos = getEventPos(e)
    const deltaX = pos.x - dragStart.x
    const deltaY = pos.y - dragStart.y

    if (isDraggingLogo) {
      const newX = Math.max(0, logoStartPos.x + deltaX)
      const newY = Math.max(0, logoStartPos.y + deltaY)

      if (isDraggingLogo === 'logo') {
        handleInputChange('logoX', newX)
        handleInputChange('logoY', newY)
      } else {
        handleInputChange('bgLogoX', newX)
        handleInputChange('bgLogoY', newY)
      }
    }

    if (isResizingLogo) {
      const newWidth = Math.max(60, logoStartPos.width + deltaX)
      const newHeight = Math.max(40, logoStartPos.height + deltaY)

      if (isResizingLogo === 'logo') {
        handleInputChange('logoWidth', newWidth)
        handleInputChange('logoHeight', newHeight)
      } else {
        handleInputChange('bgLogoWidth', newWidth)
        handleInputChange('bgLogoHeight', newHeight)
      }
    }
  }

  const handleLogoMouseUp = () => {
    setIsDraggingLogo(null)
    setIsResizingLogo(null)
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
    <div className={`min-h-screen ${isDark ? 'bg-muted/30' : 'bg-white'}`}>
      <div className="flex">
        {/* Left Side - Template Selection */}
        <div className={`w-80 ${isDark ? 'bg-muted/30 border-border' : 'bg-white border-gray-200'} border-r min-h-screen p-6 overflow-y-auto`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-foreground' : 'text-[#134e4a]'} mb-4`}>Choose Template</h2>

          <div className="space-y-4">
            {invoiceTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleInputChange('selectedTemplate', template.id)}
                className={`w-full text-left rounded-xl overflow-hidden border-2 transition-all ${
                  invoiceData.selectedTemplate === template.id
                    ? isDark ? 'border-primary ring-2 ring-primary/20' : 'border-[#0d9488] ring-2 ring-[#0d9488]/20'
                    : isDark ? 'border-border hover:border-border' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Template Preview */}
                <div
                  className="h-40 relative"
                  style={{ backgroundColor: template.colors.accent }}
                >
                  {/* Mini Invoice Preview */}
                  <div className={`absolute inset-2 ${isDark ? 'bg-white' : 'bg-gray-50'} rounded-lg shadow-sm overflow-hidden`}>
                    <div
                      className="h-8"
                      style={{ backgroundColor: template.colors.primary }}
                    >
                      <span className="text-white text-xs font-bold px-2 py-1">INVOICE</span>
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
                          className="h-4 rounded text-[8px] text-white font-medium flex items-center px-1"
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
                    <div className={`absolute top-2 right-2 w-6 h-6 ${isDark ? 'bg-primary' : 'bg-[#0d9488]'} rounded-full flex items-center justify-center`}>
                      <Check className={`w-4 h-4 ${isDark ? 'text-primary-foreground' : 'text-white'}`} />
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className={`p-3 ${isDark ? 'bg-white' : 'bg-gray-50'}`}>
                  <h3 className={`font-medium ${isDark ? 'text-foreground' : 'text-[#134e4a]'} text-sm`}>{template.name}</h3>
                  <p className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mt-0.5`}>{template.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            {/* Logo Upload Section */}
            <div className={`${isDark ? 'bg-white border-border' : 'bg-gray-50 border-gray-200'} rounded-xl border p-4 mb-6`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold ${isDark ? 'text-foreground' : 'text-[#134e4a]'}`}>Invoice Branding</h3>
                <span className={`text-xs px-2 py-1 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} rounded-full font-medium`}>Optional</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Business Logo */}
                <div>
                  <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-2`}>Your Logo</label>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {invoiceData.businessLogo ? (
                    <div className={`relative group ${isDark ? 'border-border bg-white' : 'border-gray-200 bg-white'} border rounded-lg flex items-center p-2`}>
                      <img
                        src={invoiceData.businessLogo}
                        alt="Logo"
                        className="max-h-12 max-w-[120px] object-contain"
                      />
                      <button
                        onClick={() => handleInputChange('businessLogo', null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className={`w-full h-20 flex flex-col items-center justify-center gap-1 border-2 border-dashed ${isDark ? 'border-border hover:border-primary hover:bg-muted text-muted-foreground hover:text-primary' : 'border-gray-300 hover:border-[#0d9488] hover:bg-[#ccfbf1] text-gray-400 hover:text-[#0d9488]'} rounded-lg transition-all`}
                    >
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-xs font-medium">Add your logo</span>
                    </button>
                  )}
                </div>

                {/* Background/Watermark Logo */}
                <div>
                  <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-2`}>Background Logo (Watermark)</label>
                  <input
                    type="file"
                    ref={bgLogoInputRef}
                    onChange={handleBgLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {invoiceData.backgroundLogo ? (
                    <div className={`relative group ${isDark ? 'border-border bg-white' : 'border-gray-200 bg-white'} border rounded-lg flex items-center p-2`}>
                      <img
                        src={invoiceData.backgroundLogo}
                        alt="Background Logo"
                        className="max-h-12 max-w-[120px] object-contain opacity-30"
                      />
                      <button
                        onClick={() => handleInputChange('backgroundLogo', null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => bgLogoInputRef.current?.click()}
                      className={`w-full h-20 flex flex-col items-center justify-center gap-1 border-2 border-dashed ${isDark ? 'border-border hover:border-primary hover:bg-muted text-muted-foreground hover:text-primary' : 'border-gray-300 hover:border-[#0d9488] hover:bg-[#ccfbf1] text-gray-400 hover:text-[#0d9488]'} rounded-lg transition-all`}
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
              <div className={`${isDark ? 'bg-white border-border' : 'bg-gray-50 border-gray-200'} rounded-xl border overflow-hidden`}>
                <button
                  onClick={() => setExpandedSection(expandedSection === 'from' ? null : 'from')}
                  className={`w-full flex items-center justify-between p-4 ${isDark ? 'hover:bg-muted' : 'hover:bg-white'} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-primary/20' : 'bg-[#0d9488]/20'} flex items-center justify-center`}>
                      <Building2 className={`w-4 h-4 ${isDark ? 'text-primary' : 'text-[#0d9488]'}`} />
                    </div>
                    <div className="text-left">
                      <p className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} uppercase tracking-wider`}>FROM</p>
                      <p className={`text-sm font-medium ${isDark ? 'text-foreground' : 'text-[#134e4a]'}`}>
                        {invoiceData.businessName || 'Add your business details'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} rounded-full font-medium`}>1.</span>
                    <ChevronDown className={`w-5 h-5 ${isDark ? 'text-muted-foreground' : 'text-gray-500'} transition-transform ${expandedSection === 'from' ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {expandedSection === 'from' && (
                  <div className={`p-4 pt-0 border-t ${isDark ? 'border-border' : 'border-gray-200'} space-y-4`}>
                    <input
                      type="text"
                      value={invoiceData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Business Name"
                      className={`w-full px-4 py-2.5 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg focus:ring-2 focus:border-transparent`}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="email"
                        value={invoiceData.businessEmail}
                        onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                        placeholder="Email"
                        className={`w-full px-4 py-2.5 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg focus:ring-2 focus:border-transparent`}
                      />
                      <input
                        type="tel"
                        value={invoiceData.businessPhone}
                        onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                        placeholder="Phone"
                        className={`w-full px-4 py-2.5 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg focus:ring-2 focus:border-transparent`}
                      />
                    </div>
                    <textarea
                      value={invoiceData.businessAddress}
                      onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                      placeholder="Address"
                      rows={2}
                      className={`w-full px-4 py-2.5 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg focus:ring-2 focus:border-transparent resize-none`}
                    />
                  </div>
                )}
              </div>

              {/* BILL TO Section */}
              <div className={`${isDark ? 'bg-white border-border' : 'bg-gray-50 border-gray-200'} rounded-xl border overflow-hidden`}>
                <button
                  onClick={() => setExpandedSection(expandedSection === 'billto' ? null : 'billto')}
                  className={`w-full flex items-center justify-between p-4 ${isDark ? 'hover:bg-muted' : 'hover:bg-white'} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-primary/20' : 'bg-[#0d9488]/20'} flex items-center justify-center`}>
                      <User className={`w-4 h-4 ${isDark ? 'text-primary' : 'text-[#0d9488]'}`} />
                    </div>
                    <div className="text-left">
                      <p className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} uppercase tracking-wider`}>BILL TO</p>
                      <p className={`text-sm font-medium ${isDark ? 'text-foreground' : 'text-[#134e4a]'}`}>
                        {invoiceData.clientName || 'Add customer details'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} rounded-full font-medium`}>2.</span>
                    <ChevronDown className={`w-5 h-5 ${isDark ? 'text-muted-foreground' : 'text-gray-500'} transition-transform ${expandedSection === 'billto' ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {expandedSection === 'billto' && (
                  <div className={`p-4 pt-0 border-t ${isDark ? 'border-border' : 'border-gray-200'} space-y-4`}>
                    <input
                      type="text"
                      value={invoiceData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="Client Name"
                      className={`w-full px-4 py-2.5 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg focus:ring-2 focus:border-transparent`}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="email"
                        value={invoiceData.clientEmail}
                        onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                        placeholder="Email"
                        className={`w-full px-4 py-2.5 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg focus:ring-2 focus:border-transparent`}
                      />
                      <input
                        type="tel"
                        value={invoiceData.clientPhone}
                        onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                        placeholder="Phone"
                        className={`w-full px-4 py-2.5 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg focus:ring-2 focus:border-transparent`}
                      />
                    </div>
                    <textarea
                      value={invoiceData.clientAddress}
                      onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                      placeholder="Address"
                      rows={2}
                      className={`w-full px-4 py-2.5 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg focus:ring-2 focus:border-transparent resize-none`}
                    />
                  </div>
                )}
              </div>

              {/* Invoice Details */}
              <div className={`${isDark ? 'bg-white border-border' : 'bg-gray-50 border-gray-200'} rounded-xl border p-4`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} rounded-full font-medium`}>3.</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>Invoice Details</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>Invoice number *</label>
                    <input
                      type="text"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                      className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>Issue date *</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={invoiceData.issueDate}
                        onChange={(e) => handleInputChange('issueDate', e.target.value)}
                        className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>Due date *</label>
                    <select
                      value={invoiceData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent appearance-none`}
                    >
                      <option value="7 days">7 days</option>
                      <option value="14 days">14 days</option>
                      <option value="30 days">30 days</option>
                      <option value="60 days">60 days</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>Delivery date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={invoiceData.deliveryDate}
                        onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                        className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
                      />
                    </div>
                  </div>
                </div>

                {/* Currency Selector */}
                <div className={`mt-4 pt-4 border-t ${isDark ? 'border-border' : 'border-gray-200'}`}>
                  <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-2`}>Currency</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                      className={`w-full md:w-64 px-3 py-2 ${isDark ? 'bg-secondary border-border focus:ring-primary' : 'bg-white border-gray-200 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent text-left flex items-center justify-between`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`font-medium ${isDark ? 'text-foreground' : 'text-[#134e4a]'}`}>{selectedCurrency.symbol}</span>
                        <span className={isDark ? 'text-foreground' : 'text-[#134e4a]'}>{selectedCurrency.code}</span>
                        <span className={isDark ? 'text-muted-foreground' : 'text-gray-500'}>- {selectedCurrency.name}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 ${isDark ? 'text-muted-foreground' : 'text-gray-500'} transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showCurrencyDropdown && (
                      <div className={`absolute z-20 mt-1 w-full md:w-80 ${isDark ? 'bg-white border-border' : 'bg-white border-gray-200'} border rounded-lg shadow-lg`}>
                        <div className={`p-2 border-b ${isDark ? 'border-border' : 'border-gray-200'}`}>
                          <input
                            type="text"
                            value={currencySearch}
                            onChange={(e) => setCurrencySearch(e.target.value)}
                            placeholder="Search currency..."
                            className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-gray-50 border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
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
                              className={`w-full px-3 py-2 text-left text-sm ${isDark ? 'hover:bg-muted' : 'hover:bg-gray-100'} flex items-center gap-3 ${
                                invoiceData.currency === currency.code ? isDark ? 'bg-primary/20 text-primary' : 'bg-[#0d9488]/20 text-[#0d9488]' : isDark ? 'text-foreground' : 'text-[#134e4a]'
                              }`}
                            >
                              <span className="w-8 font-medium">{currency.symbol}</span>
                              <span className="font-medium">{currency.code}</span>
                              <span className={isDark ? 'text-muted-foreground' : 'text-gray-500'}>{currency.name}</span>
                              {invoiceData.currency === currency.code && (
                                <Check className={`w-4 h-4 ml-auto ${isDark ? 'text-primary' : 'text-[#0d9488]'}`} />
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
                  className={`mt-4 text-sm ${isDark ? 'text-primary hover:text-primary/80' : 'text-[#0d9488] hover:text-[#0d9488]/80'} font-medium flex items-center gap-1`}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showMoreOptions ? 'rotate-180' : ''}`} />
                  {showMoreOptions ? 'LESS OPTIONS' : 'MORE OPTIONS'}
                </button>

                {/* More Options Panel */}
                {showMoreOptions && (
                  <div className={`mt-4 pt-4 border-t ${isDark ? 'border-border' : 'border-gray-200'} space-y-4`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>Purchase Order (PO) #</label>
                        <input
                          type="text"
                          value={invoiceData.poNumber || ''}
                          onChange={(e) => handleInputChange('poNumber', e.target.value)}
                          placeholder="PO-12345"
                          className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>Reference #</label>
                        <input
                          type="text"
                          value={invoiceData.referenceNumber || ''}
                          onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                          placeholder="REF-001"
                          className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>Discount (%)</label>
                        <input
                          type="number"
                          value={invoiceData.discount || 0}
                          onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                          placeholder="0"
                          className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>Shipping / Delivery Charges</label>
                        <input
                          type="number"
                          value={invoiceData.shipping || 0}
                          onChange={(e) => handleInputChange('shipping', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>Payment Terms</label>
                      <select
                        value={invoiceData.paymentTerms || ''}
                        onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                        className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
                      >
                        <option value="">Select payment terms</option>
                        <option value="due_on_receipt">Due on Receipt</option>
                        <option value="net_7">Net 7 - Payment due in 7 days</option>
                        <option value="net_15">Net 15 - Payment due in 15 days</option>
                        <option value="net_30">Net 30 - Payment due in 30 days</option>
                        <option value="net_60">Net 60 - Payment due in 60 days</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>Footer Note / Terms & Conditions</label>
                      <textarea
                        value={invoiceData.footerNote || ''}
                        onChange={(e) => handleInputChange('footerNote', e.target.value)}
                        placeholder="Payment is due within the specified period. Late payments may incur additional charges..."
                        rows={2}
                        className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent resize-none`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items Section */}
              <div className={`${isDark ? 'bg-white border-border' : 'bg-gray-50 border-gray-200'} rounded-xl border p-4`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} rounded-full font-medium`}>4.</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>I invoice you:</span>
                  <span className={`text-xs px-2 py-1 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} rounded-full font-medium ml-auto`}>5.</span>
                </div>

                {/* Items Header */}
                <div className={`grid grid-cols-12 gap-2 mb-2 text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} font-medium`}>
                  <div className="col-span-4">Item</div>
                  <div className="col-span-1 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Unit</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-1 text-center">Tax %</div>
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
                            className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            min="0"
                            className={`w-full px-2 py-2 ${isDark ? 'bg-secondary border-border text-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] focus:ring-[#0d9488]'} border rounded-lg text-sm text-center focus:ring-2 focus:border-transparent`}
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            placeholder="pcs"
                            className={`w-full px-2 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm text-center focus:ring-2 focus:border-transparent`}
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
                            className={`w-full px-2 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm text-center focus:ring-2 focus:border-transparent`}
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="number"
                            value={item.tax}
                            onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            className={`w-full px-2 py-2 ${isDark ? 'bg-secondary border-border text-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] focus:ring-[#0d9488]'} border rounded-lg text-sm text-center focus:ring-2 focus:border-transparent`}
                          />
                        </div>
                        <div className={`col-span-1 text-right text-sm font-medium ${isDark ? 'text-foreground' : 'text-[#134e4a]'}`}>
                          {(item.quantity * item.price).toFixed(2)}
                        </div>
                        <div className="col-span-1 text-center">
                          <button
                            onClick={() => removeItem(index)}
                            className={`p-1.5 ${isDark ? 'text-muted-foreground' : 'text-gray-500'} hover:text-red-500 hover:bg-red-500/10 rounded transition-colors`}
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
                          className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-muted-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-gray-600 placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent resize-none`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Item Button */}
                <button
                  onClick={addItem}
                  className={`mt-4 flex items-center gap-2 ${isDark ? 'text-primary hover:text-primary/80' : 'text-[#0d9488] hover:text-[#0d9488]/80'} font-medium text-sm`}
                >
                  <Plus className="w-4 h-4" />
                  Add item
                </button>
              </div>

              {/* Notes & Bank Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${isDark ? 'bg-white border-border' : 'bg-gray-50 border-gray-200'} rounded-xl border p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} rounded-full font-medium`}>9.</span>
                    <label className={`text-sm font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>Add a note</label>
                  </div>
                  <textarea
                    value={invoiceData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Notes for the client..."
                    rows={3}
                    className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent resize-none`}
                  />
                </div>

                <div className={`${isDark ? 'bg-white border-border' : 'bg-gray-50 border-gray-200'} rounded-xl border p-4`}>
                  <label className={`text-sm font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-500'} block mb-3`}>Add bank details</label>
                  <textarea
                    value={invoiceData.bankDetails}
                    onChange={(e) => handleInputChange('bankDetails', e.target.value)}
                    placeholder="Bank name, Account number, etc..."
                    rows={3}
                    className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-white border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent resize-none`}
                  />
                </div>
              </div>

              {/* Totals */}
              <div className={`${isDark ? 'bg-white border-border' : 'bg-gray-50 border-gray-200'} rounded-xl border p-4`}>
                <div className="flex justify-end">
                  <div className="w-72 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={isDark ? 'text-muted-foreground' : 'text-gray-600'}>SUBTOTAL</span>
                      <span className={`font-medium ${isDark ? 'text-foreground' : 'text-[#134e4a]'}`}>{formatCurrency(subtotal)}</span>
                    </div>
                    {totalTax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-muted-foreground' : 'text-gray-600'}>TAX</span>
                        <span className={`font-medium ${isDark ? 'text-foreground' : 'text-[#134e4a]'}`}>{formatCurrency(totalTax)}</span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-muted-foreground' : 'text-gray-600'}>DISCOUNT ({invoiceData.discount}%)</span>
                        <span className="font-medium text-green-600">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    {shippingAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-muted-foreground' : 'text-gray-600'}>SHIPPING</span>
                        <span className={`font-medium ${isDark ? 'text-foreground' : 'text-[#134e4a]'}`}>{formatCurrency(shippingAmount)}</span>
                      </div>
                    )}
                    <div
                      className={`flex justify-between text-sm font-semibold py-2 px-3 rounded-lg ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'}`}
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
                    className={`py-4 ${isDark ? 'bg-secondary text-muted-foreground hover:bg-muted border-border' : 'bg-white text-gray-500 hover:bg-gray-100 border-gray-200'} font-semibold rounded-xl transition-all flex items-center justify-center gap-2 border`}
                  >
                    <Eye className="w-5 h-5" />
                    Preview & Adjust
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                    className={`py-4 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} font-semibold rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60`}
                  >
                    {downloadingPDF ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    {downloadingPDF ? 'Downloading...' : 'Download PDF'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setEmailTo(invoiceData.clientEmail || '')
                      setEmailSubject(`Invoice #${invoiceData.invoiceNumber} from ${invoiceData.businessName || 'Your Business'}`)
                      setEmailMessage(`Dear ${invoiceData.clientName || 'Customer'},\n\nPlease find attached invoice #${invoiceData.invoiceNumber} for the amount of ${formatCurrency(grandTotal)}.\n\nDue Date: ${invoiceData.dueDate}\n\nThank you for your business!\n\nBest regards,\n${invoiceData.businessName || 'Your Business'}`)
                      setShowEmailModal(true)
                    }}
                    className={`w-full py-3 ${isDark ? 'bg-secondary text-muted-foreground hover:bg-muted border-border' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'} font-medium transition-colors flex items-center justify-center gap-2 rounded-xl border`}
                  >
                    <Mail className="w-4 h-4" />
                    Send by Email
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className={`w-full py-3 ${isDark ? 'bg-secondary text-muted-foreground hover:bg-muted border-border' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'} font-medium transition-colors flex items-center justify-center gap-2 rounded-xl border`}
                  >
                    <Share2 className="w-4 h-4" />
                    Share Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPreview(false)
          }}
        >
          <div className={`${isDark ? 'bg-white' : 'bg-white'} rounded-none md:rounded-2xl shadow-2xl w-full h-full md:h-auto md:max-w-4xl md:max-h-[90vh] flex flex-col overflow-y-auto`}>
            {/* Modal Header - Responsive */}
            <div className={`flex items-center justify-between p-3 md:p-4 border-b ${isDark ? 'border-border bg-white' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className={`p-2 md:px-4 md:py-2 ${isDark ? 'bg-secondary text-muted-foreground hover:bg-muted' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} rounded-lg transition-colors flex items-center gap-1 md:gap-2 text-sm font-medium`}
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                  <span className="hidden md:inline">Back to Edit</span>
                </button>
                <h2 className={`text-sm md:text-lg font-semibold ${isDark ? 'text-foreground' : 'text-[#134e4a]'}`}>Invoice Preview</h2>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <button className={`hidden md:flex px-4 py-2 ${isDark ? 'bg-secondary text-muted-foreground hover:bg-muted' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} rounded-lg transition-colors items-center gap-2 text-sm font-medium`}>
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className={`px-3 py-2 md:px-4 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} rounded-lg transition-all hover:shadow-lg flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium`}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span> PDF
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setShowPreview(false)}
                  className="ml-1 md:ml-2 w-8 h-8 md:w-10 md:h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Preview Content */}
            <div
              className={`flex-1 overflow-auto p-2 md:p-6 ${isDark ? 'bg-muted/30' : 'bg-gray-100'} flex flex-col md:flex-row gap-4`}
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain'
              }}
            >
              {/* Logo Adjustment Instructions Panel - Hidden on mobile */}
              <div className={`hidden md:block w-64 flex-shrink-0 ${isDark ? 'bg-secondary' : 'bg-white'} rounded-xl p-4 shadow-lg h-fit sticky top-0`}>
                <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-foreground' : 'text-gray-900'}`}>Adjust Logos</h3>

                {(invoiceData.businessLogo || invoiceData.backgroundLogo) ? (
                  <div className="space-y-4">
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-muted/30' : 'bg-blue-50'}`}>
                      <p className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-blue-700'} mb-2`}>
                        <strong>Drag</strong> the logo to move it anywhere
                      </p>
                      <p className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-blue-700'}`}>
                        <strong>Drag the corner</strong> to resize
                      </p>
                    </div>

                    {invoiceData.businessLogo && (
                      <div className={`p-3 rounded-lg border ${isDark ? 'border-border' : 'border-gray-200'}`}>
                        <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>Your Logo</label>
                        <div className={`text-[10px] ${isDark ? 'text-muted-foreground' : 'text-gray-400'} space-y-1`}>
                          <div>Position: {Math.round(invoiceData.logoX)}px, {Math.round(invoiceData.logoY)}px</div>
                          <div>Size: {Math.round(invoiceData.logoWidth)} x {Math.round(invoiceData.logoHeight)}px</div>
                        </div>
                        <button
                          onClick={() => { handleInputChange('logoX', 20); handleInputChange('logoY', 50); handleInputChange('logoWidth', 120); handleInputChange('logoHeight', 60) }}
                          className={`mt-2 text-[10px] ${isDark ? 'text-primary' : 'text-[#0d9488]'} hover:underline`}
                        >
                          Reset Position
                        </button>
                      </div>
                    )}

                    {invoiceData.backgroundLogo && (
                      <div className={`p-3 rounded-lg border ${isDark ? 'border-border' : 'border-gray-200'}`}>
                        <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>Background Watermark</label>
                        <div className={`text-[10px] ${isDark ? 'text-muted-foreground' : 'text-gray-400'} space-y-1`}>
                          <div>Position: {Math.round(invoiceData.bgLogoX)}%, {Math.round(invoiceData.bgLogoY)}%</div>
                          <div>Size: {Math.round(invoiceData.bgLogoWidth)}%</div>
                        </div>
                        <button
                          onClick={() => { handleInputChange('bgLogoX', 30); handleInputChange('bgLogoY', 30); handleInputChange('bgLogoWidth', 40); handleInputChange('bgLogoHeight', 40) }}
                          className={`mt-2 text-[10px] ${isDark ? 'text-primary' : 'text-[#0d9488]'} hover:underline`}
                        >
                          Reset Position
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-400'} text-center py-4`}>
                    Upload logos in the form to adjust them here
                  </p>
                )}
              </div>

              {/* Invoice Paper */}
              <div className="flex-1 flex justify-center items-start pb-20 md:pb-4">
              <div
                ref={invoicePreviewRef}
                className="bg-white shadow-lg relative"
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  minHeight: 'auto',
                  padding: '16px'
                }}
                onMouseMove={handleLogoMouseMove}
                onMouseUp={handleLogoMouseUp}
                onMouseLeave={handleLogoMouseUp}
                onTouchMove={handleLogoMouseMove}
                onTouchEnd={handleLogoMouseUp}
              >
                {/* Mobile Logo Instructions */}
                {(invoiceData.businessLogo || invoiceData.backgroundLogo) && (
                  <div className="md:hidden bg-blue-50 text-blue-700 text-xs p-2 rounded mb-3 text-center">
                    Logo ko drag karo, green corner se resize karo
                  </div>
                )}
                {/* Background Logo / Watermark - Draggable */}
                {invoiceData.backgroundLogo && (
                  <div
                    className="absolute cursor-move group touch-none"
                    style={{
                      left: `${invoiceData.bgLogoX}%`,
                      top: `${invoiceData.bgLogoY}%`,
                      width: `${invoiceData.bgLogoWidth}%`,
                      zIndex: 1
                    }}
                    onMouseDown={(e) => handleLogoDragStart(e, 'bgLogo')}
                    onTouchStart={(e) => handleLogoDragStart(e, 'bgLogo')}
                  >
                    <img
                      src={invoiceData.backgroundLogo}
                      alt="Watermark"
                      className="w-full object-contain opacity-[0.08] pointer-events-none"
                      draggable={false}
                    />
                    {/* Border - always visible */}
                    <div className="absolute inset-0 border-2 border-dashed border-purple-400 rounded transition-colors" />
                    {/* Resize handle - always visible, bigger on mobile */}
                    <div
                      className="absolute -bottom-3 -right-3 w-10 h-10 bg-purple-500 rounded-full cursor-se-resize shadow-lg flex items-center justify-center touch-none"
                      onMouseDown={(e) => { e.stopPropagation(); handleLogoResizeStart(e, 'bgLogo') }}
                      onTouchStart={(e) => { e.stopPropagation(); handleLogoResizeStart(e, 'bgLogo') }}
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20h4m-4 0v-4m16 4h-4m4 0v-4" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Close Button on Invoice Paper Corner - Hidden on mobile */}
                <button
                  onClick={() => setShowPreview(false)}
                  className="hidden md:flex absolute -top-3 -right-3 w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full items-center justify-center shadow-xl transition-colors border-4 border-white z-10"
                  title="Close Preview"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Draggable Business Logo - Like Signature Fields */}
                {invoiceData.businessLogo && (
                  <div
                    className="absolute z-30 touch-none"
                    style={{
                      left: `${invoiceData.logoX}px`,
                      top: `${invoiceData.logoY}px`,
                      width: `${Math.max(60, invoiceData.logoWidth)}px`,
                      height: `${Math.max(30, invoiceData.logoHeight)}px`,
                    }}
                  >
                    {/* Logo Container - Touch to Drag */}
                    <div
                      className="w-full h-full border-2 border-dashed border-blue-500 rounded bg-white/90 relative"
                      style={{ touchAction: 'none' }}
                      onTouchStart={(e) => {
                        // Check if touch is on resize handle
                        const target = e.target as HTMLElement
                        if (target.closest('.resize-handle')) return

                        e.preventDefault()
                        const touch = e.touches[0]
                        const startX = touch.clientX
                        const startY = touch.clientY
                        const logoStartX = invoiceData.logoX
                        const logoStartY = invoiceData.logoY

                        const handleMove = (evt: TouchEvent) => {
                          evt.preventDefault()
                          const t = evt.touches[0]
                          const dx = t.clientX - startX
                          const dy = t.clientY - startY
                          setInvoiceData(p => ({
                            ...p,
                            logoX: Math.max(0, Math.min(500, logoStartX + dx)),
                            logoY: Math.max(0, Math.min(700, logoStartY + dy))
                          }))
                        }

                        const handleEnd = () => {
                          window.removeEventListener('touchmove', handleMove)
                          window.removeEventListener('touchend', handleEnd)
                        }

                        window.addEventListener('touchmove', handleMove, { passive: false })
                        window.addEventListener('touchend', handleEnd)
                      }}
                      onMouseDown={(e) => {
                        const target = e.target as HTMLElement
                        if (target.closest('.resize-handle')) return

                        e.preventDefault()
                        const startX = e.clientX
                        const startY = e.clientY
                        const logoStartX = invoiceData.logoX
                        const logoStartY = invoiceData.logoY

                        const handleMove = (evt: MouseEvent) => {
                          const dx = evt.clientX - startX
                          const dy = evt.clientY - startY
                          setInvoiceData(p => ({
                            ...p,
                            logoX: Math.max(0, Math.min(500, logoStartX + dx)),
                            logoY: Math.max(0, Math.min(700, logoStartY + dy))
                          }))
                        }

                        const handleEnd = () => {
                          window.removeEventListener('mousemove', handleMove)
                          window.removeEventListener('mouseup', handleEnd)
                        }

                        window.addEventListener('mousemove', handleMove)
                        window.addEventListener('mouseup', handleEnd)
                      }}
                    >
                      {/* Logo Image */}
                      <img
                        src={invoiceData.businessLogo}
                        alt="Logo"
                        className="w-full h-full object-contain pointer-events-none select-none p-1"
                        draggable={false}
                      />

                      {/* Move Icon - Top Left */}
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>

                      {/* Resize Handle - Bottom Right Corner */}
                      <div
                        className="resize-handle absolute -bottom-4 -right-4 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg cursor-se-resize"
                        style={{ touchAction: 'none' }}
                        onTouchStart={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          const touch = e.touches[0]
                          const startX = touch.clientX
                          const startY = touch.clientY
                          const startWidth = invoiceData.logoWidth
                          const startHeight = invoiceData.logoHeight

                          const handleMove = (evt: TouchEvent) => {
                            evt.preventDefault()
                            const t = evt.touches[0]
                            const dx = t.clientX - startX
                            const dy = t.clientY - startY
                            // Maintain aspect ratio - use larger delta
                            const delta = Math.max(dx, dy)
                            setInvoiceData(p => ({
                              ...p,
                              logoWidth: Math.max(50, Math.min(300, startWidth + delta)),
                              logoHeight: Math.max(25, Math.min(150, startHeight + delta * 0.5))
                            }))
                          }

                          const handleEnd = () => {
                            window.removeEventListener('touchmove', handleMove)
                            window.removeEventListener('touchend', handleEnd)
                          }

                          window.addEventListener('touchmove', handleMove, { passive: false })
                          window.addEventListener('touchend', handleEnd)
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          const startX = e.clientX
                          const startY = e.clientY
                          const startWidth = invoiceData.logoWidth
                          const startHeight = invoiceData.logoHeight

                          const handleMove = (evt: MouseEvent) => {
                            const dx = evt.clientX - startX
                            const dy = evt.clientY - startY
                            const delta = Math.max(dx, dy)
                            setInvoiceData(p => ({
                              ...p,
                              logoWidth: Math.max(50, Math.min(300, startWidth + delta)),
                              logoHeight: Math.max(25, Math.min(150, startHeight + delta * 0.5))
                            }))
                          }

                          const handleEnd = () => {
                            window.removeEventListener('mousemove', handleMove)
                            window.removeEventListener('mouseup', handleEnd)
                          }

                          window.addEventListener('mousemove', handleMove)
                          window.addEventListener('mouseup', handleEnd)
                        }}
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Invoice Header */}
                <div className="flex items-start mb-8 justify-between">
                  <div>
                    {!invoiceData.businessLogo && (
                      <div
                        className="text-2xl font-bold mb-4"
                        style={{ color: selectedTemplateData?.colors.primary }}
                      >
                        {invoiceData.businessName || 'Your Company'}
                      </div>
                    )}
                    {invoiceData.businessName && (
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
                      {invoiceData.poNumber && (
                        <div><span className="text-gray-600">PO #:</span> <span className="font-semibold">{invoiceData.poNumber}</span></div>
                      )}
                      {invoiceData.referenceNumber && (
                        <div><span className="text-gray-600">Ref #:</span> <span className="font-semibold">{invoiceData.referenceNumber}</span></div>
                      )}
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
                        <th className="text-left text-white font-semibold py-3 px-4 text-sm">Description</th>
                        <th className="text-center text-white font-semibold py-3 px-4 text-sm">Qty</th>
                        <th className="text-center text-white font-semibold py-3 px-4 text-sm">Unit</th>
                        <th className="text-right text-white font-semibold py-3 px-4 text-sm">Price</th>
                        <th className="text-right text-white font-semibold py-3 px-4 text-sm">Amount</th>
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
                    {discountAmount > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-200/50 text-sm">
                        <span className="text-gray-700">Discount ({invoiceData.discount}%)</span>
                        <span className="font-medium text-green-600">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    {shippingAmount > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-200/50 text-sm">
                        <span className="text-gray-700">Shipping</span>
                        <span className="font-medium">{formatCurrency(shippingAmount)}</span>
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

                {/* Payment Terms & Footer Note */}
                {(invoiceData.paymentTerms || invoiceData.footerNote) && (
                  <div className="mt-6 pt-4 border-t border-gray-200/50">
                    {invoiceData.paymentTerms && (
                      <div className="mb-3">
                        <span className="text-sm font-semibold text-gray-900">Payment Terms: </span>
                        <span className="text-sm text-gray-700">
                          {invoiceData.paymentTerms === 'due_on_receipt' && 'Due on Receipt'}
                          {invoiceData.paymentTerms === 'net_7' && 'Net 7 - Payment due in 7 days'}
                          {invoiceData.paymentTerms === 'net_15' && 'Net 15 - Payment due in 15 days'}
                          {invoiceData.paymentTerms === 'net_30' && 'Net 30 - Payment due in 30 days'}
                          {invoiceData.paymentTerms === 'net_60' && 'Net 60 - Payment due in 60 days'}
                          {invoiceData.paymentTerms === 'custom' && 'Custom terms'}
                        </span>
                      </div>
                    )}
                    {invoiceData.footerNote && (
                      <div className="text-xs text-gray-600 whitespace-pre-line">{invoiceData.footerNote}</div>
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
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEmailModal(false)
          }}
        >
          <div className={`${isDark ? 'bg-white' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden`}>
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-border' : 'border-gray-200'}`}>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-foreground' : 'text-[#134e4a]'} flex items-center gap-2`}>
                <Mail className={`w-5 h-5 ${isDark ? 'text-primary' : 'text-[#0d9488]'}`} />
                Send Invoice by Email
              </h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className={`w-8 h-8 ${isDark ? 'bg-secondary text-muted-foreground' : 'bg-gray-100 text-gray-500'} hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>To *</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="client@email.com"
                  className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-gray-50 border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Invoice subject"
                  className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-gray-50 border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-1`}>Message</label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Your message..."
                  rows={5}
                  className={`w-full px-3 py-2 ${isDark ? 'bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary' : 'bg-gray-50 border-gray-200 text-[#134e4a] placeholder-gray-400 focus:ring-[#0d9488]'} border rounded-lg text-sm focus:ring-2 focus:border-transparent resize-none`}
                />
              </div>

              <div className={`${isDark ? 'bg-secondary' : 'bg-gray-100'} rounded-lg p-3 flex items-center gap-3`}>
                <div className={`w-10 h-10 ${isDark ? 'bg-muted' : 'bg-white'} rounded-lg flex items-center justify-center`}>
                  <FileText className={`w-5 h-5 ${isDark ? 'text-primary' : 'text-[#0d9488]'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-foreground' : 'text-[#134e4a]'}`}>Invoice #{invoiceData.invoiceNumber}.pdf</p>
                  <p className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>Will be attached to email</p>
                </div>
              </div>
            </div>

            <div className={`p-4 border-t ${isDark ? 'border-border' : 'border-gray-200'} flex gap-3`}>
              <button
                onClick={() => setShowEmailModal(false)}
                className={`flex-1 py-3 ${isDark ? 'bg-secondary text-muted-foreground hover:bg-muted' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} font-medium rounded-xl transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!emailTo) {
                    alert('Please enter recipient email')
                    return
                  }
                  setSendingEmail(true)
                  // Simulate sending - in production would call API
                  await new Promise(resolve => setTimeout(resolve, 1500))
                  setSendingEmail(false)
                  setShowEmailModal(false)
                  alert('Invoice sent successfully!')
                }}
                disabled={sendingEmail || !emailTo}
                className={`flex-1 py-3 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} font-semibold rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50`}
              >
                {sendingEmail ? (
                  <>
                    <div className={`w-4 h-4 border-2 ${isDark ? 'border-primary-foreground/30 border-t-primary-foreground' : 'border-white/30 border-t-white'} rounded-full animate-spin`} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Invoice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowShareModal(false)
          }}
        >
          <div className={`${isDark ? 'bg-white' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden`}>
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-border' : 'border-gray-200'}`}>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-foreground' : 'text-[#134e4a]'} flex items-center gap-2`}>
                <Share2 className={`w-5 h-5 ${isDark ? 'text-primary' : 'text-[#0d9488]'}`} />
                Share Invoice
              </h2>
              <button
                onClick={() => setShowShareModal(false)}
                className={`w-8 h-8 ${isDark ? 'bg-secondary text-muted-foreground' : 'bg-gray-100 text-gray-500'} hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Copy Link */}
              <div className={`${isDark ? 'bg-secondary' : 'bg-gray-100'} rounded-lg p-3`}>
                <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-2`}>Invoice Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invoice/view/${invoiceData.invoiceNumber}`}
                    className={`flex-1 px-3 py-2 ${isDark ? 'bg-muted/30 border-border text-muted-foreground' : 'bg-white border-gray-200 text-gray-600'} border rounded-lg text-sm`}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/invoice/view/${invoiceData.invoiceNumber}`)
                      setLinkCopied(true)
                      setTimeout(() => setLinkCopied(false), 2000)
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                      linkCopied
                        ? 'bg-green-500 text-white'
                        : isDark ? 'bg-primary text-primary-foreground hover:shadow-lg' : 'bg-[#0d9488] text-white hover:shadow-lg'
                    }`}
                  >
                    {linkCopied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Share Options */}
              <div>
                <label className={`block text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-500'} mb-3`}>Share via</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      const text = `Invoice #${invoiceData.invoiceNumber}\nAmount: ${formatCurrency(grandTotal)}\nFrom: ${invoiceData.businessName || 'Business'}\n\nView invoice: ${window.location.origin}/invoice/view/${invoiceData.invoiceNumber}`
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                    }}
                    className={`flex items-center gap-3 p-3 ${isDark ? 'bg-secondary border-border' : 'bg-gray-50 border-gray-200'} hover:bg-[#25D366]/20 border hover:border-[#25D366] rounded-xl transition-all group`}
                  >
                    <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className={`font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-600'} group-hover:text-[#25D366]`}>WhatsApp</span>
                  </button>

                  {/* SMS */}
                  <button
                    onClick={() => {
                      const text = `Invoice #${invoiceData.invoiceNumber} - ${formatCurrency(grandTotal)}. View: ${window.location.origin}/invoice/view/${invoiceData.invoiceNumber}`
                      window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank')
                    }}
                    className={`flex items-center gap-3 p-3 ${isDark ? 'bg-secondary border-border' : 'bg-gray-50 border-gray-200'} hover:bg-blue-500/20 border hover:border-blue-500 rounded-xl transition-all group`}
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className={`font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-600'} group-hover:text-blue-500`}>SMS</span>
                  </button>

                  {/* Email */}
                  <button
                    onClick={() => {
                      const subject = `Invoice #${invoiceData.invoiceNumber} from ${invoiceData.businessName || 'Business'}`
                      const body = `Please find invoice details below:\n\nInvoice #: ${invoiceData.invoiceNumber}\nAmount: ${formatCurrency(grandTotal)}\nDue Date: ${invoiceData.dueDate}\n\nView invoice: ${window.location.origin}/invoice/view/${invoiceData.invoiceNumber}`
                      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
                    }}
                    className={`flex items-center gap-3 p-3 ${isDark ? 'bg-secondary border-border' : 'bg-gray-50 border-gray-200'} hover:bg-red-500/20 border hover:border-red-500 rounded-xl transition-all group`}
                  >
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <span className={`font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-600'} group-hover:text-red-500`}>Email</span>
                  </button>

                  {/* More Share */}
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `Invoice #${invoiceData.invoiceNumber}`,
                          text: `Invoice from ${invoiceData.businessName || 'Business'} - ${formatCurrency(grandTotal)}`,
                          url: `${window.location.origin}/invoice/view/${invoiceData.invoiceNumber}`
                        })
                      } else {
                        navigator.clipboard.writeText(`${window.location.origin}/invoice/view/${invoiceData.invoiceNumber}`)
                        setLinkCopied(true)
                        setTimeout(() => setLinkCopied(false), 2000)
                      }
                    }}
                    className={`flex items-center gap-3 p-3 ${isDark ? 'bg-secondary border-border' : 'bg-gray-50 border-gray-200'} hover:bg-purple-500/20 border hover:border-purple-500 rounded-xl transition-all group`}
                  >
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <span className={`font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-600'} group-hover:text-purple-500`}>More</span>
                  </button>
                </div>
              </div>

              {/* Download Option */}
              <button
                onClick={() => {
                  handleDownloadPDF()
                  setShowShareModal(false)
                }}
                className={`w-full py-3 ${isDark ? 'bg-primary text-primary-foreground' : 'bg-[#0d9488] text-white'} font-semibold rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2`}
              >
                <Download className="w-5 h-5" />
                Download PDF to Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateInvoicePage
