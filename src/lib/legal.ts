import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { LegalDoc } from "@/components/layout/LegalPage";
import { routing } from "@/i18n/routing";
import { localeUrl } from "@/lib/seo";

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

  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: `${localeUrl(locale)}/${slug}`,
      languages: Object.fromEntries(
        routing.locales.map((code) => [code, `${localeUrl(code)}/${slug}`]),
      ),
    },
    // Indexable, but they should never outrank the portfolio itself.
    robots: { index: true, follow: true },
  };
}
