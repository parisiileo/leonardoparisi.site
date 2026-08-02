import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { LEGAL_PATHS } from "@/lib/legal";
import { localeUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // One entry per locale of the single scrolling page; each points at the
  // others through hreflang so search engines treat them as one document.
  const home = routing.locales.map((locale) => ({
    url: localeUrl(locale),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: {
      languages: {
        ...Object.fromEntries(
          routing.locales.map((code) => [code, localeUrl(code)]),
        ),
        "x-default": localeUrl(routing.defaultLocale),
      },
    },
  }));

  // The legal pages change rarely and should never compete with the portfolio
  // in the index — hence the low priority.
  const legal = Object.values(LEGAL_PATHS).flatMap((slug) =>
    routing.locales.map((locale) => ({
      url: `${localeUrl(locale)}/${slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((code) => [code, `${localeUrl(code)}/${slug}`]),
          ),
          "x-default": `${localeUrl(routing.defaultLocale)}/${slug}`,
        },
      },
    })),
  );

  return [...home, ...legal];
}
