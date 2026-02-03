import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for MamaSign. Understand your rights and obligations when using our e-signature platform.',
}

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
