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
])

export default clerkMiddleware(async (auth, req) => {
  // All routes are public - users can optionally sign in for enhanced features
})

export const config = {
  matcher: [
    '/((?!.+\.[\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}
