// Usage limit tracking for free users
// Free users can only sign/verify/create 5 documents, then must purchase paid plan

const FREE_DOCUMENT_LIMIT = 5
const STORAGE_KEY = 'mamasign_document_usage'
const PRO_KEY = 'mamasign_is_pro'

// Check if user has pro access (works for anonymous users too)
export function isProUser(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(PRO_KEY) === 'true'
}

// Set pro status (called after successful Stripe payment)
export function setProStatus(isPro: boolean = true): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PRO_KEY, isPro ? 'true' : 'false')
}

// Anonymous usage tracking (for users not logged in)
export function getAnonymousUsage(): { signCount: number; verifyCount: number } {
  if (typeof window === 'undefined') return { signCount: 0, verifyCount: 0 }
  try {
    const stored = localStorage.getItem('mamasign_anon_usage')
    if (stored) return JSON.parse(stored)
  } catch (e) {}
  return { signCount: 0, verifyCount: 0 }
}

export function incrementAnonymousSignCount(): number {
  if (typeof window === 'undefined') return 0
  const usage = getAnonymousUsage()
  usage.signCount += 1
  localStorage.setItem('mamasign_anon_usage', JSON.stringify(usage))
  return usage.signCount
}

export function incrementAnonymousVerifyCount(): number {
  if (typeof window === 'undefined') return 0
  const usage = getAnonymousUsage()
  usage.verifyCount += 1
  localStorage.setItem('mamasign_anon_usage', JSON.stringify(usage))
  return usage.verifyCount
}

export function canAnonymousSign(): boolean {
  if (isProUser()) return true
  return getAnonymousUsage().signCount < FREE_DOCUMENT_LIMIT
}

export function canAnonymousVerify(): boolean {
  if (isProUser()) return true
  return getAnonymousUsage().verifyCount < FREE_DOCUMENT_LIMIT
}

export function getRemainingAnonymousSign(): number {
  if (isProUser()) return Infinity
  return Math.max(0, FREE_DOCUMENT_LIMIT - getAnonymousUsage().signCount)
}

export function getRemainingAnonymousVerify(): number {
  if (isProUser()) return Infinity
  return Math.max(0, FREE_DOCUMENT_LIMIT - getAnonymousUsage().verifyCount)
}

export interface UsageData {
  userId: string
  signCount: number
  verifyCount: number
  invoiceCount: number
  isPaid: boolean
  lastUpdated: string
}

// Get usage data for a user
export function getUserUsage(userId: string): UsageData {
  if (typeof window === 'undefined') {
    return {
      userId,
      signCount: 0,
      verifyCount: 0,
      invoiceCount: 0,
      isPaid: false,
      lastUpdated: new Date().toISOString()
    }
  }

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
    if (stored) {
      const data = JSON.parse(stored)
      // Ensure invoiceCount exists for backwards compatibility
      return {
        ...data,
        invoiceCount: data.invoiceCount || 0
      }
    }
  } catch (error) {
    console.error('Error reading usage data:', error)
  }

  return {
    userId,
    signCount: 0,
    verifyCount: 0,
    invoiceCount: 0,
    isPaid: false,
    lastUpdated: new Date().toISOString()
  }
}

// Save usage data
export function saveUserUsage(data: UsageData): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(`${STORAGE_KEY}_${data.userId}`, JSON.stringify({
      ...data,
      lastUpdated: new Date().toISOString()
    }))
  } catch (error) {
    console.error('Error saving usage data:', error)
  }
}

// Increment sign count
export function incrementSignCount(userId: string): UsageData {
  const usage = getUserUsage(userId)
  usage.signCount += 1
  saveUserUsage(usage)
  return usage
}

// Increment verify count
export function incrementVerifyCount(userId: string): UsageData {
  const usage = getUserUsage(userId)
  usage.verifyCount += 1
  saveUserUsage(usage)
  return usage
}

// Increment invoice count
export function incrementInvoiceCount(userId: string): UsageData {
  const usage = getUserUsage(userId)
  usage.invoiceCount += 1
  saveUserUsage(usage)
  return usage
}

// Check if user can sign documents
export function canSignDocument(userId: string): boolean {
  const usage = getUserUsage(userId)
  if (usage.isPaid) return true
  return usage.signCount < FREE_DOCUMENT_LIMIT
}

// Check if user can verify documents
export function canVerifyDocument(userId: string): boolean {
  const usage = getUserUsage(userId)
  if (usage.isPaid) return true
  return usage.verifyCount < FREE_DOCUMENT_LIMIT
}

// Check if user can create invoices
export function canCreateInvoice(userId: string): boolean {
  const usage = getUserUsage(userId)
  if (usage.isPaid) return true
  return usage.invoiceCount < FREE_DOCUMENT_LIMIT
}

// Get remaining free uses for signing
export function getRemainingSignUses(userId: string): number {
  const usage = getUserUsage(userId)
  if (usage.isPaid) return Infinity
  return Math.max(0, FREE_DOCUMENT_LIMIT - usage.signCount)
}

// Get remaining free uses for verification
export function getRemainingVerifyUses(userId: string): number {
  const usage = getUserUsage(userId)
  if (usage.isPaid) return Infinity
  return Math.max(0, FREE_DOCUMENT_LIMIT - usage.verifyCount)
}

// Get remaining free uses for invoices
export function getRemainingInvoiceUses(userId: string): number {
  const usage = getUserUsage(userId)
  if (usage.isPaid) return Infinity
  return Math.max(0, FREE_DOCUMENT_LIMIT - usage.invoiceCount)
}

// Mark user as paid
export function markUserAsPaid(userId: string): void {
  const usage = getUserUsage(userId)
  usage.isPaid = true
  saveUserUsage(usage)
}

// Get total usage
export function getTotalUsage(userId: string): number {
  const usage = getUserUsage(userId)
  return usage.signCount + usage.verifyCount + usage.invoiceCount
}

// Check if user has reached limit (any type)
export function hasReachedLimit(userId: string): boolean {
  const usage = getUserUsage(userId)
  if (usage.isPaid) return false
  return usage.signCount >= FREE_DOCUMENT_LIMIT ||
         usage.verifyCount >= FREE_DOCUMENT_LIMIT ||
         usage.invoiceCount >= FREE_DOCUMENT_LIMIT
}

export const FREE_LIMIT = FREE_DOCUMENT_LIMIT
