'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  Tag,
  Search,
  BookOpen,
  TrendingUp,
  Shield,
  Zap,
  Users,
  FileText,
} from 'lucide-react'

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'product', name: 'Product Updates' },
    { id: 'guides', name: 'How-To Guides' },
    { id: 'security', name: 'Security' },
    { id: 'business', name: 'Business Tips' },
    { id: 'legal', name: 'Legal & Compliance' },
  ]

  const featuredPost = {
    id: 1,
    title: 'The Future of E-Signatures: Trends to Watch in 2024',
    excerpt: 'Discover the emerging trends shaping the e-signature industry, from AI-powered document processing to blockchain verification and beyond.',
    category: 'business',
    author: 'Sarah Ahmed',
    date: 'January 15, 2024',
    readTime: '8 min read',
    image: null,
  }

  const posts = [
    {
      id: 2,
      title: 'How to Create Legally Binding E-Signatures: A Complete Guide',
      excerpt: 'Everything you need to know about creating e-signatures that hold up in court, including compliance requirements and best practices.',
      category: 'legal',
      author: 'James Wilson',
      date: 'January 12, 2024',
      readTime: '10 min read',
    },
    {
      id: 3,
      title: 'Introducing Bulk Sending: Sign Documents at Scale',
      excerpt: 'Our new bulk sending feature lets you send documents to hundreds of signers with just a few clicks. Here\'s how to use it.',
      category: 'product',
      author: 'Emily Rodriguez',
      date: 'January 10, 2024',
      readTime: '5 min read',
    },
    {
      id: 4,
      title: '5 Ways E-Signatures Are Transforming Real Estate',
      excerpt: 'Real estate professionals are saving hours each week with digital signatures. Learn how top agents are closing deals faster.',
      category: 'business',
      author: 'Michael Chen',
      date: 'January 8, 2024',
      readTime: '6 min read',
    },
    {
      id: 5,
      title: 'Security Best Practices for Document Signing',
      excerpt: 'Protect your sensitive documents with these essential security practices. From encryption to access controls, we cover it all.',
      category: 'security',
      author: 'David Kim',
      date: 'January 5, 2024',
      readTime: '7 min read',
    },
    {
      id: 6,
      title: 'How to Set Up Automated Document Workflows',
      excerpt: 'Step-by-step guide to creating automated workflows that route documents to the right signers in the right order.',
      category: 'guides',
      author: 'Priya Sharma',
      date: 'January 3, 2024',
      readTime: '8 min read',
    },
    {
      id: 7,
      title: 'GDPR and E-Signatures: What You Need to Know',
      excerpt: 'Understanding GDPR compliance for electronic signatures in Europe. Key requirements and how MamaSign helps you stay compliant.',
      category: 'legal',
      author: 'James Wilson',
      date: 'December 28, 2023',
      readTime: '9 min read',
    },
    {
      id: 8,
      title: 'New API Features: Webhooks and Batch Processing',
      excerpt: 'Developers can now use webhooks for real-time notifications and batch processing for high-volume document handling.',
      category: 'product',
      author: 'Michael Chen',
      date: 'December 22, 2023',
      readTime: '4 min read',
    },
    {
      id: 9,
      title: 'Reducing Contract Turnaround Time by 80%',
      excerpt: 'Case study: How a law firm reduced their contract processing time from 5 days to just 1 day using MamaSign.',
      category: 'business',
      author: 'Sarah Ahmed',
      date: 'December 18, 2023',
      readTime: '6 min read',
    },
  ]

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const popularPosts = posts.slice(0, 4)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'product': return Zap
      case 'guides': return BookOpen
      case 'security': return Shield
      case 'business': return TrendingUp
      case 'legal': return FileText
      default: return Tag
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              MamaSign
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Insights, guides, and updates to help you get the most out of e-signatures and document management.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200/50 bg-gray-100/50 text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden border border-gray-200/50">
            <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
              <div className="flex flex-col justify-center">
                <span className="inline-flex items-center w-fit px-3 py-1 bg-cyan-500/20 text-cyan-600 text-sm font-medium rounded-full mb-4">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Featured
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center text-gray-600 text-sm mb-6">
                  <div className="flex items-center mr-6">
                    <User className="w-4 h-4 mr-2" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center mr-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <Link
                  href={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-gray-900/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Posts */}
            <div className="lg:col-span-3">
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-gray-900'
                        : 'bg-gray-100/50 text-gray-700 hover:bg-gray-100 border border-gray-200/50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Posts Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredPosts.map((post) => {
                  const CategoryIcon = getCategoryIcon(post.category)
                  return (
                    <article
                      key={post.id}
                      className="bg-gray-100/50 backdrop-blur-xl rounded-xl border border-gray-200/50 overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                    >
                      <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <CategoryIcon className="w-12 h-12 text-gray-600" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-600 text-xs font-medium rounded capitalize">
                            {post.category}
                          </span>
                          <span className="text-gray-600 text-xs">{post.readTime}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-cyan-600 transition-colors">
                          <Link href={`/blog/${post.id}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {post.date}
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12 bg-gray-100/50 backdrop-blur-xl rounded-xl border border-gray-200/50">
                  <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-700">Try adjusting your search or filter criteria</p>
                </div>
              )}

              {/* Load More */}
              <div className="text-center mt-8">
                <button className="px-8 py-3 bg-gray-100/50 border-2 border-gray-200/50 rounded-xl text-gray-700 font-medium hover:border-cyan-500/50 hover:bg-gray-100 transition-all duration-300">
                  Load More Articles
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Popular Posts */}
              <div className="bg-gray-100/50 backdrop-blur-xl rounded-xl border border-gray-200/50 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h3>
                <div className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <Link key={post.id} href={`/blog/${post.id}`} className="block group">
                      <div className="flex gap-3">
                        <span className="text-2xl font-bold text-gray-600 group-hover:text-cyan-600 transition-colors">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-cyan-600 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <span className="text-xs text-gray-600">{post.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-xl p-6 text-gray-900">
                <h3 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-gray-900/80 text-sm mb-4">
                  Get the latest articles and product updates delivered to your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-900 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 mb-3"
                />
                <button className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>

              {/* Categories Widget */}
              <div className="bg-gray-100/50 backdrop-blur-xl rounded-xl border border-gray-200/50 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => {
                    const count = posts.filter(p => p.category === category.id).length
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-200/50 transition-colors"
                      >
                        <span className="text-gray-700">{category.name}</span>
                        <span className="text-sm text-gray-600">{count}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Try MamaSign?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Start signing documents for free. No credit card required.
          </p>
          <Link href="/sign" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Start Signing Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default BlogPage
