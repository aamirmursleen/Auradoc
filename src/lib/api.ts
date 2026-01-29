/**
 * Safe API utilities to prevent JSON parsing errors
 * This file ensures we never get "Unexpected token" errors from non-JSON responses
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Safe fetch wrapper that handles non-JSON responses gracefully
 * Use this instead of raw fetch() + response.json()
 */
export async function safeFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options)

    // Check content type before parsing
    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()

      if (response.ok) {
        return { success: true, data }
      } else {
        return {
          success: false,
          error: data.error || data.message || `Request failed with status ${response.status}`
        }
      }
    } else {
      // Non-JSON response - likely a server error page
      const text = await response.text()
      console.error('Non-JSON response:', response.status, text.substring(0, 200))

      // Common error messages
      if (response.status === 413) {
        return { success: false, error: 'Request too large. Please try with smaller data.' }
      }
      if (response.status === 504 || response.status === 408) {
        return { success: false, error: 'Request timed out. Please try again.' }
      }
      if (response.status >= 500) {
        return { success: false, error: 'Server error. Please try again later.' }
      }

      return { success: false, error: 'Something went wrong. Please try again.' }
    }
  } catch (error: any) {
    console.error('Fetch error:', error)

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { success: false, error: 'Network error. Please check your connection.' }
    }

    return { success: false, error: error.message || 'Request failed' }
  }
}

/**
 * Safe JSON parse that returns null instead of throwing
 */
export function safeJsonParse<T = any>(text: string): T | null {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/**
 * POST request helper with automatic JSON handling
 */
export async function apiPost<T = any>(
  url: string,
  body: any
): Promise<ApiResponse<T>> {
  return safeFetch<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
}

/**
 * GET request helper
 */
export async function apiGet<T = any>(
  url: string
): Promise<ApiResponse<T>> {
  return safeFetch<T>(url)
}
