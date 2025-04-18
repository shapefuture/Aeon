import type React from "react"
import "@/app/globals.css"
import type { Metadata, Viewport } from "next"
import registerServiceWorker from './pwa-register';

export const metadata: Metadata = {
  title: "Aeon Website",
  description: "Aeon Website Description",
  generator: 'v0.dev',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
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
        <link rel="manifest" href="/Aeon/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/Aeon/favicon.ico" />
      </head>
      <body className="min-h-screen bg-black font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
