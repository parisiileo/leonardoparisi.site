import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
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
  generateGraph,
  languageAlternates,
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

/** Open Graph wants the underscored form, not the bare language code. */
const OG_LOCALES: Record<string, string> = {
  en: "en_GB",
  it: "it_IT",
  de: "de_DE",
  es: "es_ES",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const url = localeUrl(locale);

  return {
    metadataBase: new URL(SEO_CONFIG.baseUrl),
    title: { default: t("title"), template: "%s | Leonardo Parisi" },
    description: t("description"),
    applicationName: "Leonardo Parisi",
    keywords: t("keywords")
      .split(",")
      .map((k) => k.trim()),
    authors: [{ name: SEO_CONFIG.author, url: SEO_CONFIG.baseUrl }],
    creator: SEO_CONFIG.author,
    publisher: SEO_CONFIG.author,
    category: "technology",
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
      // `x-default` inside: where to send a visitor whose language matches
      // none of the four.
      languages: languageAlternates(),
    },
    openGraph: {
      type: "profile",
      firstName: "Leonardo",
      lastName: "Parisi",
      username: "imleo",
      locale: OG_LOCALES[locale] ?? locale,
      alternateLocale: routing.locales
        .filter((code) => code !== locale)
        .map((code) => OG_LOCALES[code]),
      url,
      siteName: "Leonardo Parisi",
      title: t("title"),
      description: t("description"),
      // No `images` key on purpose: app/[locale]/opengraph-image.tsx supplies
      // it, and anything listed here would replace that pre-rendered card.
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      site: SEO_CONFIG.twitter,
      creator: SEO_CONFIG.twitter,
    },
    verification: {
      ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && {
        google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      }),
      ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && {
        yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      }),
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION && {
        other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION },
      }),
    },
    other: {
      // Read by a few regional crawlers and by Bing for local intent.
      "geo.region": "IT-BZ",
      "geo.placename": "Bolzano",
      "geo.position": `${SEO_CONFIG.geo.latitude};${SEO_CONFIG.geo.longitude}`,
      ICBM: `${SEO_CONFIG.geo.latitude}, ${SEO_CONFIG.geo.longitude}`,
    },
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
  const meta = await getTranslations("meta");

  // Left to itself the provider forwards *every* namespace into the RSC
  // payload. `legal` alone is ~12KB of privacy/terms/cookie prose that only
  // the three server-rendered legal pages read, and `meta` is consumed by
  // generateMetadata — neither is reachable from a client component, so both
  // are dropped here. Roughly two thirds of the messages payload on every
  // page, in all four locales.
  const { legal: _legal, meta: _meta, ...clientMessages } = await getMessages();

  const graph = generateGraph({
    locale,
    title: meta("title"),
    description: meta("description"),
    jobTitle: meta("jobTitle"),
    businessName: meta("businessName"),
  });

  return (
    <html lang={locale} className={fontVars}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
          suppressHydrationWarning
        />
      </head>
      <body>
        <NextIntlClientProvider messages={clientMessages}>
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
