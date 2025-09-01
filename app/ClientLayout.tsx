"use client"

import type React from "react"
import { Playfair_Display } from "next/font/google"
import { Source_Sans_3 } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
})

const sourceSansPro = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans-pro",
})

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body
        className={`font-sans ${playfairDisplay.variable} ${sourceSansPro.variable} ${GeistMono.variable} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
