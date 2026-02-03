import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How MamaSign collects, uses, and protects your personal data. Read our privacy practices and your data rights.',
}

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
