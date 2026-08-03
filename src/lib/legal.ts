import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { LegalDoc } from "@/components/layout/LegalPage";
import { languageAlternates, localeUrl } from "@/lib/seo";

/** Slug per document — also what the sitemap walks. */
export const LEGAL_PATHS: Record<LegalDoc, string> = {
  privacy: "privacy",
  cookie: "cookie",
  terms: "terms",
};

export async function legalMetadata(
  locale: string,
  doc: LegalDoc,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `legal.${doc}` });
  const slug = LEGAL_PATHS[doc];

  const url = `${localeUrl(locale)}/${slug}`;

  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: url,
      languages: languageAlternates(`/${slug}`),
    },
    openGraph: { type: "article", url, title: t("title"), description: t("intro") },
    // Indexable so the VAT and contact details stay findable, but they must
    // never pick up a rich snippet that competes with the portfolio.
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": 0 },
    },
  };
}
