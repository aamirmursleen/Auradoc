import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

// When Clerk keys aren't set, skip Clerk middleware entirely
const hasClerkKeys = !!(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

function noopMiddleware(req: NextRequest) {
  return NextResponse.next()
}

export default hasClerkKeys
  ? clerkMiddleware(async (auth, req) => {
      // All routes are public - users can optionally sign in for enhanced features
    })
  : noopMiddleware

export const config = {
  matcher: [
    '/((?!.+\.[\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}
