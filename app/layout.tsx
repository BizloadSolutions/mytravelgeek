import type { Metadata } from 'next'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI for Travel and Lifestyle Guide',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/images/fav-icon/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />

        {/* Swiper CSS */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

        {/* Tabler Icons */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

        {/* Flag Icons */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css" />

        {/* Custom CSS */}
        <link rel="stylesheet" href="/css/custom.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
      </head>
      {/* suppressHydrationWarning fixes the mismatch error caused by browser extensions modifying the body */}
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Header />
        {children}      {/* har page ka content yahan aayega */}
        <Footer />

        {/* Tailwind CSS CDN (v3 & v4) */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" strategy="beforeInteractive" />
      </body>
    </html>
  )
}