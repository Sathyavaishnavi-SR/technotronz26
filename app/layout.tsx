import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"

// Fonts are loaded via CSS (e.g. Google Fonts) to avoid next/font/turbopack issues

export const metadata: Metadata = {
  title: "TECHNOTRONZ'26",
  description: "TECHNOTRONZ'26 - Technical Symposium by IETE-PSG CT",
  generator: "v0.app",
  icons: {
    icon: "/tz-logo.png",
    shortcut: "/tz-logo.png",
    apple: "/tz-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased bg-black`}>
        <Providers>
          <Navbar />
          {children}
          <Analytics />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
