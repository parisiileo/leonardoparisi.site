import { getTranslations, setRequestLocale } from "next-intl/server";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Process from "@/components/sections/Process";
import Stack from "@/components/sections/Stack";
import Testimonials from "@/components/sections/Testimonials";
import Work from "@/components/sections/Work";
import data from "@/data/data.json";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("availability");

  return (
    <>
      <Hero />
      <Marquee items={data.marquee} separator="✦" />
      <Work />
      <Process />
      <About />
      <Stack />
      <Testimonials />
      <Marquee
        items={[t("one"), t("two"), t("three")]}
        separator="—"
        variant="italic"
      />
      <Contact />
    </>
  );
}
