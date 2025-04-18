import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import registerServiceWorker from './pwa-register';

export const metadata: Metadata = {
  title: "Aeon Website",
  description: "Aeon Website Description",
  generator: 'v0.dev',
  manifest: '/manifest.json',
  themeColor: '#000000',
}

if (typeof window !== 'undefined') {
  registerServiceWorker();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen bg-black font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
