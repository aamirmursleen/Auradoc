import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sign(.*)',
  '/templates(.*)',
  '/verify(.*)',
  '/sign-document(.*)',
  '/track(.*)',
  '/documents(.*)',
  '/api/(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // All routes are public - authentication is optional
  // Pages will show login prompt if user data is needed
})

export const config = {
  matcher: [
    '/((?!.+\.[\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}
