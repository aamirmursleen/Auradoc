import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Digital Signature Generator',
  description: 'Create professional digital signatures online. Draw, type, or customize your signature. Download as transparent PNG for any document.',
}

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
