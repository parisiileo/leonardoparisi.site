import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Cursor from "@/components/layout/Cursor";
import Header from "@/components/layout/Header";
import Loader from "@/components/layout/Loader";
import MenuOverlay from "@/components/layout/MenuOverlay";
import SectionTracker from "@/components/layout/SectionTracker";
import UIProvider from "@/components/layout/UIProvider";
import { type Locale, routing } from "@/i18n/routing";
import { fontVars } from "@/lib/fonts";
import {
  generatePersonSchema,
  generateWebsiteSchema,
  localeUrl,
  SEO_CONFIG,
} from "@/lib/seo";
import "@/styles/global.css";

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
    // The manifest and every icon come from file conventions
    // (app/manifest.ts, app/icon.tsx, app/apple-icon.tsx, app/favicon.ico),
    // so Next injects the tags itself. Declaring them here would override
    // the generated routes and reintroduce the missing-file 404s.
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
      languages: {
        ...Object.fromEntries(
          routing.locales.map((code) => [code, localeUrl(code)]),
        ),
        // Where to send a visitor whose language matches none of the four.
        "x-default": localeUrl(routing.defaultLocale),
      },
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
  const t = await getTranslations("nav");

  return (
    <html lang={locale} className={fontVars}>
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
            {/* First stop for keyboard and screen-reader users: the header and
                the overlay menu sit before the content in the DOM. */}
            <a
              href="#main"
              className="focus:bg-ac focus:text-ac-t sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-300 focus:rounded-full focus:px-5 focus:py-3 focus:font-mono focus:text-[12px] focus:tracking-[0.18em]"
            >
              {t("skip")}
            </a>
            <Loader />
            <Cursor />
            <Header />
            <MenuOverlay />
            <SectionTracker />
            <main id="main">{children}</main>
          </UIProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
