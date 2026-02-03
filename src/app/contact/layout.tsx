import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with MamaSign support. Email, live chat, and callback options available across multiple time zones.',
}

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
