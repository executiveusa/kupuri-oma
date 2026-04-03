import type { ReactNode } from 'react'

// This layout is required by Next.js App Router even though the root page
// immediately redirects to the default locale. The [locale]/layout.tsx
// provides the actual <html> and <body> for all locale-prefixed routes.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
