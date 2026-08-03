import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { LEGAL_PATHS } from "@/lib/legal";
import { languageAlternates, localeUrl, SEO_CONFIG } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // One entry per locale of the single scrolling page; each points at the
  // others through hreflang so search engines treat them as one document.
  const home = routing.locales.map((locale) => ({
    url: localeUrl(locale),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages: languageAlternates() },
    // Gives the share card a shot at Google Images for "Leonardo Parisi".
    images: [`${SEO_CONFIG.baseUrl}/opengraph-image`],
  }));

  // The legal pages change rarely and should never compete with the portfolio
  // in the index — hence the low priority.
  const legal = Object.values(LEGAL_PATHS).flatMap((slug) =>
    routing.locales.map((locale) => ({
      url: `${localeUrl(locale)}/${slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
      alternates: { languages: languageAlternates(`/${slug}`) },
    })),
  );

  return [...home, ...legal];
}
