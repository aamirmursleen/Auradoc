'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `https://mamasign.com${item.href}` } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm mb-4">
        <ol className="flex items-center flex-wrap gap-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className={`w-3.5 h-3.5 mx-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              )}
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className={`hover:underline ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
