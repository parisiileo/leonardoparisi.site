import type { Metadata, Viewport } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  SEO_CONFIG,
  generatePersonSchema,
  generateWebsiteSchema,
} from "@/lib/seo";
import "@/styles/global.css";

const title = SEO_CONFIG.title;
const description = SEO_CONFIG.description;
const keywords = SEO_CONFIG.keywords;
const baseUrl = SEO_CONFIG.baseUrl;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#6b6253",
  colorScheme: "light",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: title,
    template: "%s | Leonardo Parisi Portfolio",
  },
  description,
  keywords,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Leonardo Parisi Portfolio",
  },
  formatDetection: {
    telephone: false,
    email: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  authors: [
    {
      name: SEO_CONFIG.author,
      url: baseUrl,
    },
  ],
  creator: SEO_CONFIG.author,
  publisher: SEO_CONFIG.author,
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
  openGraph: {
    type: "website",
    locale: "it_IT",
    title,
    description,
    siteName: "Leonardo Parisi Portfolio",
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: "Leonardo Parisi - Frontend Developer",
      },
      {
        url: `${baseUrl}/api/og`,
        width: 800,
        height: 400,
        alt: "Leonardo Parisi - Frontend Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    site: SEO_CONFIG.twitter,
    creator: SEO_CONFIG.twitter,
    images: [`${baseUrl}/api/og`],
  },
  other: {
    "twitter:image": `${baseUrl}/api/og`,
  },
  alternates: {
    canonical: baseUrl,
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  }),
  ...(process.env.NEXT_PUBLIC_BING_VERIFICATION && {
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION,
    },
  }),
  ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && {
    other: {
      "yandex-verification": process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD Structured Data
  const personSchema = generatePersonSchema();
  const webSiteSchema = generateWebsiteSchema();

  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.vercel.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
          suppressHydrationWarning
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
          suppressHydrationWarning
        />
      </head>
      <body className="max-w-[2520px] flex-col h-screen flex items-center justify-between mx-auto relative">
        <Header />
        <div className="w-full">{children}</div>
        <Footer />
        <Toaster position="bottom-left" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
