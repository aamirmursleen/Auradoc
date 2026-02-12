'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  FileText,
  ArrowRight,
  Search,
  Briefcase,
  Home,
  Heart,
  GraduationCap,
  Building2,
  Users,
  Scale,
  Car,
  Download,
  Eye,
  Star,
  Filter,
  Clock,
  Loader2,
} from 'lucide-react'

interface Template {
  id: string | number
  name: string
  description: string
  category: string
  downloads: number
  rating: number
  popular: boolean
}

const TemplateLibraryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [apiTemplates, setApiTemplates] = useState<Template[] | null>(null)
  const [loadingApi, setLoadingApi] = useState(true)

  // Fetch templates from API
  const fetchTemplates = useCallback(async () => {
    try {
      setLoadingApi(true)
      const params = new URLSearchParams()
      if (activeCategory !== 'all') params.set('category', activeCategory)
      if (searchQuery.trim()) params.set('search', searchQuery)

      const res = await fetch(`/api/templates?${params.toString()}`)
      const data = await res.json()
      if (data.success && data.data?.length > 0) {
        setApiTemplates(data.data)
      }
    } catch {
      // Fallback to hardcoded
    } finally {
      setLoadingApi(false)
    }
  }, [activeCategory, searchQuery])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const categories = [
    { id: 'all', name: 'All Templates', icon: FileText, count: 50 },
    { id: 'business', name: 'Business', icon: Briefcase, count: 15 },
    { id: 'real-estate', name: 'Real Estate', icon: Home, count: 8 },
    { id: 'healthcare', name: 'Healthcare', icon: Heart, count: 6 },
    { id: 'education', name: 'Education', icon: GraduationCap, count: 5 },
    { id: 'legal', name: 'Legal', icon: Scale, count: 10 },
    { id: 'hr', name: 'HR & Employment', icon: Users, count: 12 },
    { id: 'finance', name: 'Finance', icon: Building2, count: 7 },
    { id: 'automotive', name: 'Automotive', icon: Car, count: 4 },
  ]

  const templates = [
    {
      id: 1,
      name: 'Non-Disclosure Agreement (NDA)',
      description: 'Standard mutual NDA template for protecting confidential business information between parties.',
      category: 'business',
      downloads: 12500,
      rating: 4.9,
      popular: true,
    },
    {
      id: 2,
      name: 'Employment Contract',
      description: 'Comprehensive employment agreement template covering terms, compensation, and conditions.',
      category: 'hr',
      downloads: 9800,
      rating: 4.8,
      popular: true,
    },
    {
      id: 3,
      name: 'Residential Lease Agreement',
      description: 'Complete rental agreement for residential properties with all standard clauses.',
      category: 'real-estate',
      downloads: 8500,
      rating: 4.7,
      popular: true,
    },
    {
      id: 4,
      name: 'Independent Contractor Agreement',
      description: 'Template for hiring contractors with clear scope of work and payment terms.',
      category: 'business',
      downloads: 7200,
      rating: 4.8,
      popular: false,
    },
    {
      id: 5,
      name: 'Medical Consent Form',
      description: 'HIPAA-compliant patient consent form for medical procedures and treatments.',
      category: 'healthcare',
      downloads: 6100,
      rating: 4.9,
      popular: false,
    },
    {
      id: 6,
      name: 'Invoice Template',
      description: 'Professional invoice template with itemized billing and payment terms.',
      category: 'finance',
      downloads: 15000,
      rating: 4.6,
      popular: true,
    },
    {
      id: 7,
      name: 'Purchase Order',
      description: 'Standard purchase order form for business procurement and vendor management.',
      category: 'business',
      downloads: 5400,
      rating: 4.7,
      popular: false,
    },
    {
      id: 8,
      name: 'Vehicle Sale Agreement',
      description: 'Complete bill of sale template for private vehicle transactions.',
      category: 'automotive',
      downloads: 4200,
      rating: 4.8,
      popular: false,
    },
    {
      id: 9,
      name: 'Student Enrollment Form',
      description: 'Educational institution enrollment and registration template.',
      category: 'education',
      downloads: 3800,
      rating: 4.5,
      popular: false,
    },
    {
      id: 10,
      name: 'Power of Attorney',
      description: 'Legal document granting authority to act on someone\'s behalf.',
      category: 'legal',
      downloads: 6800,
      rating: 4.9,
      popular: true,
    },
    {
      id: 11,
      name: 'Employee Onboarding Checklist',
      description: 'Comprehensive checklist for new employee orientation and setup.',
      category: 'hr',
      downloads: 4500,
      rating: 4.6,
      popular: false,
    },
    {
      id: 12,
      name: 'Commercial Lease Agreement',
      description: 'Professional commercial property lease with business-specific terms.',
      category: 'real-estate',
      downloads: 5100,
      rating: 4.7,
      popular: false,
    },
  ]

  // Use API templates if available, otherwise fall back to hardcoded
  const sourceTemplates: Template[] = apiTemplates || templates

  const filteredTemplates = apiTemplates
    ? sourceTemplates // API already filters by category/search
    : sourceTemplates.filter((template) => {
        const matchesCategory = activeCategory === 'all' || template.category === activeCategory
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
      })

  return (
    <div className="overflow-hidden bg-muted/30">
      {/* Hero Section */}
      <section className="relative py-20 bg-white border-b border-border">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full opacity-5 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full opacity-5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Document
              <span className="block mt-2 text-primary">
                Template Library
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose from our collection of professionally designed templates. Customize and send for signature in minutes.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted text-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Categories */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Categories
                </h3>
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${
                        activeCategory === category.id
                          ? 'bg-primary text-primary-foreground border border-primary'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center">
                        <category.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className={`text-sm ${
                        activeCategory === category.id ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredTemplates.length}</span> templates
                </p>
                <select className="px-4 py-2 border border-border rounded-lg text-muted-foreground focus:outline-none focus:border-primary bg-muted">
                  <option>Most Popular</option>
                  <option>Newest First</option>
                  <option>Highest Rated</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group p-6 bg-secondary rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300"
                  >
                    {template.popular && (
                      <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full mb-4">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Popular
                      </span>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {template.downloads.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        {template.rating}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/templates/${template.id}`}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-300"
                      >
                        Use Template
                      </Link>
                      <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No templates found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Create Custom Template CTA */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-secondary rounded-3xl p-12 text-center border border-border">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Can't Find What You Need?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Create your own custom template or upload an existing document. Our editor makes it easy to add signature fields and send for signing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/templates/create" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-foreground bg-primary rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-300">
                Create Custom Template
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/sign" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-foreground border-2 border-border rounded-lg hover:bg-muted transition-all duration-300">
                Upload Document
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Use Our Templates?
            </h2>
            <p className="text-xl text-muted-foreground">
              Save time and ensure compliance with professionally crafted templates
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Save Hours of Work',
                description: 'Start with a professionally designed template instead of creating documents from scratch.',
              },
              {
                icon: Scale,
                title: 'Legally Reviewed',
                description: 'All templates are reviewed by legal professionals to ensure compliance and protection.',
              },
              {
                icon: Users,
                title: 'Industry-Specific',
                description: 'Templates tailored for specific industries and use cases with relevant clauses.',
              },
            ].map((feature, index) => (
              <div key={index} className="text-center p-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default TemplateLibraryPage
