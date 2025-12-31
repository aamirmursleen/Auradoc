'use client'

import React, { useState } from 'react'
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
} from 'lucide-react'

const TemplateLibraryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="overflow-hidden bg-[#1e1e1e]">
      {/* Hero Section */}
      <section className="relative py-20 bg-[#1F1F1F] border-b border-[#2a2a2a]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#c4ff0e] rounded-full opacity-5 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#c4ff0e] rounded-full opacity-5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Document
              <span className="block mt-2 text-[#c4ff0e]">
                Template Library
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Choose from our collection of professionally designed templates. Customize and send for signature in minutes.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-[#3a3a3a] focus:border-[#c4ff0e] focus:ring-2 focus:ring-[#c4ff0e]/20 outline-none transition-all bg-[#2a2a2a] text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Categories */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 flex items-center">
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
                          ? 'bg-[#c4ff0e] text-black border border-[#c4ff0e]'
                          : 'text-gray-300 hover:bg-[#2a2a2a]'
                      }`}
                    >
                      <div className="flex items-center">
                        <category.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className={`text-sm ${
                        activeCategory === category.id ? 'text-black' : 'text-gray-400'
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
                <p className="text-gray-400">
                  Showing <span className="font-semibold text-white">{filteredTemplates.length}</span> templates
                </p>
                <select className="px-4 py-2 border border-[#3a3a3a] rounded-lg text-gray-300 focus:outline-none focus:border-[#c4ff0e] bg-[#2a2a2a]">
                  <option>Most Popular</option>
                  <option>Newest First</option>
                  <option>Highest Rated</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group p-6 bg-[#252525] rounded-xl border border-[#2a2a2a] hover:border-[#c4ff0e] hover:shadow-lg transition-all duration-300"
                  >
                    {template.popular && (
                      <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full mb-4">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Popular
                      </span>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-[#c4ff0e] rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-black" />
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#c4ff0e] transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
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
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[#c4ff0e] text-black rounded-lg font-medium hover:bg-[#c4ff0e]/90 transition-all duration-300"
                      >
                        Use Template
                      </Link>
                      <button className="p-2 border border-[#3a3a3a] rounded-lg hover:bg-[#2a2a2a] transition-colors">
                        <Eye className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
                  <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Create Custom Template CTA */}
      <section className="py-20 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#252525] rounded-3xl p-12 text-center border border-[#2a2a2a]">
            <div className="w-16 h-16 bg-[#c4ff0e] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Can't Find What You Need?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Create your own custom template or upload an existing document. Our editor makes it easy to add signature fields and send for signing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/templates/create" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-black bg-[#c4ff0e] rounded-lg shadow-lg hover:bg-[#c4ff0e]/90 transition-all duration-300">
                Create Custom Template
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/sign" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-[#3a3a3a] rounded-lg hover:bg-[#2a2a2a] transition-all duration-300">
                Upload Document
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#1e1e1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Use Our Templates?
            </h2>
            <p className="text-xl text-gray-400">
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
                <div className="w-16 h-16 bg-[#c4ff0e] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default TemplateLibraryPage
