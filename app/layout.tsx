import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aeon Website",
  description: "Aeon Website Description",
  generator: 'v0.dev'
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
