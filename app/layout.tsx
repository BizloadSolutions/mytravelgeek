import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SuppressExtensionHydrationWarning from "@/components/SuppressExtensionHydrationWarning";

/** Preload chain used by custom.css @import — files themselves are unchanged. */
const PUBLIC_CSS_PRELOAD = [
  "/css/developer.css",
  "/css/color.css",
  "/css/fonts.css",
  "/css/style.css",
] as const;

export const metadata: Metadata = {
  title: "My Travel Geek AI",
  description: "Your Personal Travel Expert, Anytime",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script defer src="/js/strip-extension-attrs.js" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="/images/fav-icon/ms-icon-144x144.png"
        />
        <meta name="theme-color" content="#ffffff" />

        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />

        {PUBLIC_CSS_PRELOAD.map((href) => (
          <link key={`preload-${href}`} rel="preload" href={href} as="style" />
        ))}

        <link rel="stylesheet" href="/css/custom.css" />
        <link rel="stylesheet" href="/css/responsive.css" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css"
        />
      </head>

      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <SuppressExtensionHydrationWarning />
        <div
          className="site-wraper flex min-h-screen flex-col"
          suppressHydrationWarning
        >
          <Header />
          {children}
          <Footer />
        </div>

        {/* Native script tags (not next/script) — avoids nonce hydration mismatch */}
        <script src="https://cdn.tailwindcss.com" />
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />
        <script src="https://code.jquery.com/jquery-3.7.1.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" />
        <script src="/js/function.js" />
        <script src="/js/modal.js" />
        <script src="/js/custom.js" />
        <script src="/js/travelpayout.js" />
      </body>
    </html>
  );
}
