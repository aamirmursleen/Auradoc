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
    '/blog',
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

  // Blog posts
  const blogPosts = [
    '/blog/how-to-esign-documents-legally',
    '/blog/best-free-pdf-tools-2025',
    '/blog/pdf-compression-guide',
    '/blog/electronic-signature-vs-digital-signature',
    '/blog/document-security-best-practices',
    '/blog/esignature-real-estate-guide',
    '/blog/gdpr-esignature-compliance',
    '/blog/convert-pdf-to-word-guide',
    '/blog/remote-work-document-management',
  ]

  const allPages = [...mainPages, ...toolPages, ...blogPosts]

  return allPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route.startsWith('/tools') ? 0.9 : 0.8,
  }))
}
