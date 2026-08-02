import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fontVars } from "@/lib/fonts";

/**
 * Next renders this inside its own `<html id="__next_error__">` shell, which
 * drops both the `lang` attribute and the font variables the root layout puts
 * on the real <html>. The wrapper restores the fonts; the inline script
 * restores the language, which screen readers need to pick a voice.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  const locale = await getLocale();

  return (
    <div
      className={`${fontVars} bg-bg text-ink flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center`}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale)}`,
        }}
      />
      <p className="text-ac font-mono text-[11px] tracking-[0.22em]">
        {t("kicker")}
      </p>
      <h1 className="font-display m-0 text-[clamp(47px,10.8vw,162px)] leading-[0.84] font-black tracking-[-0.055em] uppercase">
        {t("headingA")}
        <br />
        <span className="font-normal normal-case italic">{t("headingB")}</span>
      </h1>
      <p className="text-mut max-w-[42ch] text-[clamp(14px,1.3vw,17px)] text-pretty">
        {t("body")}
      </p>
      <Link
        href="/"
        className="bg-ac text-ac-t rounded-full px-6 py-[15px] font-mono text-[12px] font-medium tracking-[0.18em]"
      >
        {t("cta")} →
      </Link>
    </div>
  );
}
