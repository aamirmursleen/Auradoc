import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sign(.*)',
  '/templates(.*)',
  '/track(.*)',
  '/api/(.*)',
  '/verify(.*)',
  '/sign-document(.*)',
  '/create-invoice(.*)',
  '/bulk-send(.*)',
  '/documents(.*)',
  '/settings(.*)',
  '/tools(.*)',
  '/resume-templates(.*)',
  '/template-library(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // All routes are public - users can optionally sign in for enhanced features
  // Don't protect any routes - let individual pages handle auth gating
})

export const config = {
  matcher: [
    '/((?!.+\.[\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}
