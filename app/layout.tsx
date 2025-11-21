// app/layout.tsx

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RZ Automation Hub',
  description: 'Professional automation and AI workspace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 min-h-screen text-gray-800">
        {children}
      </body>
    </html>
  )
}
