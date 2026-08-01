import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "it", "de", "es"],
  defaultLocale: "en",
  // English keeps living at "/" so the existing indexed URLs stay valid;
  // the other three get an /it, /de, /es prefix.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN · ENGLISH",
  it: "IT · ITALIANO",
  de: "DE · DEUTSCH",
  es: "ES · ESPAÑOL",
};
