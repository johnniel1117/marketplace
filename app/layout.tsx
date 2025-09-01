import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import "./globals.css" // Import globals.css at the top of the file

export const metadata: Metadata = {
  title: "Marketplace - Buy & Sell Items",
  description:
    "A modern marketplace for buying and selling items in your local community. Find great deals on electronics, vehicles, home goods, and more.",
  keywords: "marketplace, buy, sell, local, community, electronics, vehicles, home goods, deals",
  authors: [{ name: "Marketplace Team" }],
  creator: "Marketplace",
  publisher: "Marketplace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Marketplace - Buy & Sell Items",
    description: "A modern marketplace for buying and selling items in your local community",
    url: "/",
    siteName: "Marketplace",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Marketplace - Buy & Sell Items",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketplace - Buy & Sell Items",
    description: "A modern marketplace for buying and selling items in your local community",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
