import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Invoice Generator - Create & Send Invoices',
  description: 'Create professional invoices online for free. Add line items, taxes, branding, and send directly via email. Download as PDF.',
}

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
