import Stripe from 'stripe'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Product/Price IDs - Update these after creating in Stripe Dashboard
export const STRIPE_CONFIG = {
  // Lifetime subscription price
  LIFETIME_PRICE_ID: process.env.STRIPE_LIFETIME_PRICE_ID || 'price_lifetime_19',

  // Product details
  PRODUCT_NAME: 'MamaSign Lifetime Access',
  PRODUCT_PRICE: 19, // $19 USD

  // Free tier limits
  FREE_SIGN_LIMIT: 5,
  FREE_VERIFY_LIMIT: 5,
}

// Get publishable key for client-side
export const getStripePublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
}
