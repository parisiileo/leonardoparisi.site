import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Archivo, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import Cursor from "@/components/layout/Cursor";
import Header from "@/components/layout/Header";
import Loader from "@/components/layout/Loader";
import MenuOverlay from "@/components/layout/MenuOverlay";
import SectionTracker from "@/components/layout/SectionTracker";
import UIProvider from "@/components/layout/UIProvider";
import { type Locale, routing } from "@/i18n/routing";
import {
  generatePersonSchema,
  generateWebsiteSchema,
  localeUrl,
  SEO_CONFIG,
} from "@/lib/seo";
import "@/styles/global.css";

const archivo = Archivo({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  viewportFit: "cover",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const url = localeUrl(locale);
  const ogImage = `${SEO_CONFIG.baseUrl}/api/og`;

  return {
    metadataBase: new URL(SEO_CONFIG.baseUrl),
    title: { default: t("title"), template: "%s | Leonardo Parisi" },
    description: t("description"),
    keywords: SEO_CONFIG.keywords,
    authors: [{ name: SEO_CONFIG.author, url: SEO_CONFIG.baseUrl }],
    creator: SEO_CONFIG.author,
    publisher: SEO_CONFIG.author,
    manifest: "/site.webmanifest",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Leonardo Parisi",
    },
    formatDetection: { telephone: false, email: false },
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
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((code) => [code, localeUrl(code)]),
      ),
    },
    openGraph: {
      type: "website",
      locale,
      url,
      siteName: "Leonardo Parisi",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Leonardo Parisi — Frontend Developer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      site: SEO_CONFIG.twitter,
      creator: SEO_CONFIG.twitter,
      images: [ogImage],
    },
    ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && {
      verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION },
    }),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);

  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${grotesk.variable} ${jetbrains.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generatePersonSchema()),
          }}
          suppressHydrationWarning
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteSchema()),
          }}
          suppressHydrationWarning
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <UIProvider>
            <Loader />
            <Cursor />
            <Header />
            <MenuOverlay />
            <SectionTracker />
            <main>{children}</main>
          </UIProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
