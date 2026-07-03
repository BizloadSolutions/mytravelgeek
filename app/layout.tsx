import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SuppressExtensionHydrationWarning from "@/components/SuppressExtensionHydrationWarning";
import { CssReadyScript, CssReadyStyle } from "@/components/CssReadyGate";

// Test commit here

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
        url: "/images/logo/icon-coloured.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/logo/icon-coloured.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/logo/icon-coloured.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/images/logo/icon-coloured.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/images/logo/icon-coloured.png",
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
        <CssReadyStyle />
        {/* Sync in head (no defer) — registers MutationObserver before body parses */}
        <script src="/js/strip-extension-attrs.js" />

        <meta name="msapplication-TileColor" content="#0f3a5d" />
        <meta
          name="msapplication-TileImage"
          content="/images/logo/icon-coloured.png"
        />
        <meta name="theme-color" content="#0f3a5d" />
        <link
          rel="apple-touch-icon"
          href="/images/logo/icon-coloured.png"
          sizes="180x180"
        />

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

        <CssReadyScript />
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

        {/* Impact.com tracking script */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7390400-e0d6-41f8-b533-46b83497f4071.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');`,
          }}
        />
      </body>
    </html>
  );
}
