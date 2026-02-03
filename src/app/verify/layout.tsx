import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify PDF - Detect Edits & Modifications',
  description: 'Check if a PDF has been edited or tampered with. Detects editing software, metadata changes, incremental updates, and more.',
}

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
