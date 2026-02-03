import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mamasign.com'

  // Main pages
  const mainPages = [
    '',
    '/sign-document',
    '/verify',
    '/create-invoice',
    '/templates',
    '/pricing',
    '/faq',
    '/contact',
    '/tools',
    '/sign-in',
    '/sign-up',
  ]

  // Tool pages
  const toolPages = [
    '/tools/pdf-to-word',
    '/tools/pdf-compressor',
    '/tools/image-to-pdf',
    '/tools/signature-generator',
    '/tools/pdf-merge',
    '/tools/pdf-split',
    '/tools/word-to-pdf',
    '/tools/watermark-pdf',
  ]

  // Additional pages
  const additionalPages = [
    '/about',
    '/features',
    '/security',
    '/privacy',
    '/terms',
    '/resume-templates',
    '/template-library',
    '/compliance',
  ]

  const allPages = [...mainPages, ...toolPages, ...additionalPages]

  return allPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route.startsWith('/tools') ? 0.9 : 0.8,
  }))
}
