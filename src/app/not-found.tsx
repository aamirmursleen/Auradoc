'use client'

import React from 'react'
import Link from 'next/link'
import { FileQuestion, Home, Search, ArrowLeft, FileText, PenTool, Wrench } from 'lucide-react'

export default function NotFound() {
  const suggestedPages = [
    {
      name: 'Home',
      description: 'Go back to the homepage',
      href: '/',
      icon: Home,
    },
    {
      name: 'Sign Document',
      description: 'E-sign your documents',
      href: '/sign-document',
      icon: PenTool,
    },
    {
      name: 'PDF Tools',
      description: 'Browse all our PDF tools',
      href: '/tools',
      icon: Wrench,
    },
    {
      name: 'Templates',
      description: 'Browse document templates',
      href: '/templates',
      icon: FileText,
    },
  ]

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[180px] font-bold text-gray-100 dark:text-gray-800 select-none leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <FileQuestion className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Search Box */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for something..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Maybe you were looking for:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestedPages.map((page, idx) => (
              <Link
                key={idx}
                href={page.href}
                className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-xl flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                  <page.icon className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {page.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{page.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>
    </div>
  )
}
