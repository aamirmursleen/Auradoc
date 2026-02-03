import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about MamaSign, our mission to simplify document signing, and the team behind the platform.',
}

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
