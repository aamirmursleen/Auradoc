import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sign(.*)',
  '/templates(.*)',
  '/track(.*)',
  '/api/(.*)',
])

const isProtectedRoute = createRouteMatcher([
  '/verify(.*)',
  '/sign-document(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Protected routes require authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!.+\.[\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}
