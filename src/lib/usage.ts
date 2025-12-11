// Usage tracking for free tier limits
import { STRIPE_CONFIG } from './stripe'

const STORAGE_KEYS = {
  SIGN_COUNT: 'mamasign_sign_count',
  VERIFY_COUNT: 'mamasign_verify_count',
  IS_PRO: 'mamasign_is_pro',
  USER_EMAIL: 'mamasign_user_email',
}

// Check if user has pro/lifetime access
export const isPro = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEYS.IS_PRO) === 'true'
}

// Set pro status (called after successful payment)
export const setPro = (email?: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.IS_PRO, 'true')
  if (email) {
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email)
  }
}

// Get sign document usage count
export const getSignCount = (): number => {
  if (typeof window === 'undefined') return 0
  const count = localStorage.getItem(STORAGE_KEYS.SIGN_COUNT)
  return count ? parseInt(count, 10) : 0
}

// Increment sign document count
export const incrementSignCount = (): number => {
  if (typeof window === 'undefined') return 0
  const current = getSignCount()
  const newCount = current + 1
  localStorage.setItem(STORAGE_KEYS.SIGN_COUNT, newCount.toString())
  return newCount
}

// Get verify PDF usage count
export const getVerifyCount = (): number => {
  if (typeof window === 'undefined') return 0
  const count = localStorage.getItem(STORAGE_KEYS.VERIFY_COUNT)
  return count ? parseInt(count, 10) : 0
}

// Increment verify PDF count
export const incrementVerifyCount = (): number => {
  if (typeof window === 'undefined') return 0
  const current = getVerifyCount()
  const newCount = current + 1
  localStorage.setItem(STORAGE_KEYS.VERIFY_COUNT, newCount.toString())
  return newCount
}

// Check if user can sign (has remaining quota or is pro)
export const canSign = (): boolean => {
  if (isPro()) return true
  return getSignCount() < STRIPE_CONFIG.FREE_SIGN_LIMIT
}

// Check if user can verify (has remaining quota or is pro)
export const canVerify = (): boolean => {
  if (isPro()) return true
  return getVerifyCount() < STRIPE_CONFIG.FREE_VERIFY_LIMIT
}

// Get remaining sign quota
export const getRemainingSignQuota = (): number => {
  if (isPro()) return Infinity
  return Math.max(0, STRIPE_CONFIG.FREE_SIGN_LIMIT - getSignCount())
}

// Get remaining verify quota
export const getRemainingVerifyQuota = (): number => {
  if (isPro()) return Infinity
  return Math.max(0, STRIPE_CONFIG.FREE_VERIFY_LIMIT - getVerifyCount())
}

// Usage stats for display
export interface UsageStats {
  signCount: number
  verifyCount: number
  signLimit: number
  verifyLimit: number
  remainingSign: number
  remainingVerify: number
  isPro: boolean
}

export const getUsageStats = (): UsageStats => {
  const pro = isPro()
  return {
    signCount: getSignCount(),
    verifyCount: getVerifyCount(),
    signLimit: STRIPE_CONFIG.FREE_SIGN_LIMIT,
    verifyLimit: STRIPE_CONFIG.FREE_VERIFY_LIMIT,
    remainingSign: pro ? Infinity : getRemainingSignQuota(),
    remainingVerify: pro ? Infinity : getRemainingVerifyQuota(),
    isPro: pro,
  }
}

// Clear all usage data (for testing)
export const clearUsageData = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.SIGN_COUNT)
  localStorage.removeItem(STORAGE_KEYS.VERIFY_COUNT)
  localStorage.removeItem(STORAGE_KEYS.IS_PRO)
  localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)
}
