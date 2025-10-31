import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Notion Clone',
  description: 'A modern Notion-like note-taking application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
