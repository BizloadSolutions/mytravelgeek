import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI for Travel and Lifestyle Guide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="/images/fav-icon/ms-icon-144x144.png"
        />
        <meta name="theme-color" content="#ffffff" />

        {/* Swiper CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />

        {/* Tabler Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />

        {/* Flag Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css"
        />

        {/* Custom CSS */}
        <link rel="stylesheet" href="/css/custom.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
      </head>

      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Script
          src="/js/strip-extension-attrs.js"
          strategy="beforeInteractive"
        />

        <Header />

        {children}

        <Footer />

        {/* Tailwind */}
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />

        <Script
          src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"
          strategy="beforeInteractive"
        />

        {/* jQuery */}
        <Script
          src="https://code.jquery.com/jquery-3.7.1.min.js"
          strategy="beforeInteractive"
        />

        {/* Swiper JS */}
        <Script
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
          strategy="afterInteractive"
        />

        {/* Custom JS Files */}
        <Script src="/js/function.js" strategy="afterInteractive" />

        <Script src="/js/modal.js" strategy="afterInteractive" />

        <Script src="/js/custom.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
