import { setRequestLocale } from "next-intl/server";
import LegalPage from "@/components/layout/LegalPage";
import { type Locale, routing } from "@/i18n/routing";
import { legalMetadata } from "@/lib/legal";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return legalMetadata(locale, "cookie");
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return <LegalPage doc="cookie" />;
}
