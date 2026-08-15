import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LEGAL_PATHS } from "@/lib/legal";
import { generateLegalGraph, SEO_CONFIG } from "@/lib/seo";

/**
 * Shared shell for the privacy, cookie and terms pages.
 *
 * The three documents differ only by namespace: copy lives in the messages
 * files as an array of sections, so translations stay side by side with the
 * rest of the site and a new clause lands in one place per language.
 */

export type LegalDoc = "privacy" | "cookie" | "terms";

type Section = {
  heading: string;
  body?: string[];
  list?: string[];
};

export default async function LegalPage({ doc }: { doc: LegalDoc }) {
  const t = await getTranslations(`legal.${doc}`);
  const tMeta = await getTranslations("legal.meta");
  const sections = t.raw("sections") as Section[];
  const locale = await getLocale();

  const graph = generateLegalGraph({
    locale,
    slug: LEGAL_PATHS[doc],
    title: t("title"),
    description: t("intro"),
    homeLabel: SEO_CONFIG.author,
  });

  return (
    <article className="bg-bg mx-auto flex w-full max-w-[820px] flex-col gap-[clamp(30px,5vh,52px)] px-[clamp(16px,4vw,40px)] pt-[clamp(90px,14vh,150px)] pb-[clamp(60px,10vh,120px)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        suppressHydrationWarning
      />
      <header className="border-line flex flex-col gap-4 border-b pb-[clamp(22px,4vh,38px)]">
        <h1 className="font-display m-0 text-[clamp(38px,7vw,86px)] leading-[0.87] font-black tracking-[-0.05em] uppercase">
          {t("title")}
        </h1>
        <span className="text-mut2 font-mono text-[11px] tracking-[0.18em]">
          {tMeta("updatedLabel")} — {t("updated")}
        </span>
        <p className="text-mut m-0 max-w-[62ch] text-[clamp(15px,1.3vw,18px)] leading-[1.65] text-pretty">
          {t("intro")}
        </p>
      </header>

      <div className="flex flex-col gap-[clamp(26px,4vh,44px)]">
        {sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-[14px]">
            <h2 className="font-display m-0 text-[clamp(20px,2.4vw,29px)] leading-[1.1] font-extrabold tracking-[-0.03em]">
              {section.heading}
            </h2>

            {section.body?.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-mut m-0 max-w-[68ch] text-[clamp(14px,1.2vw,16.5px)] leading-[1.75] text-pretty"
              >
                {paragraph}
              </p>
            ))}

            {section.list && (
              <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
                {section.list.map((item) => (
                  <li
                    key={item.slice(0, 40)}
                    className="text-mut border-line max-w-[68ch] border-l pl-4 text-[clamp(14px,1.2vw,16.5px)] leading-[1.7] text-pretty"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <footer className="border-line flex flex-col gap-3 border-t pt-[clamp(22px,4vh,34px)]">
        <span className="font-display text-[19px] font-extrabold tracking-[-0.02em] uppercase">
          {tMeta("contactHeading")}
        </span>
        <span className="text-mut font-mono text-[11.5px] leading-[1.9] tracking-[0.06em]">
          {tMeta("contactBody")}
        </span>
        <Link
          href="/"
          className="text-ac hover:text-ink mt-3 font-mono text-[11px] tracking-[0.18em] transition-colors"
        >
          ← {tMeta("back")}
        </Link>
      </footer>
    </article>
  );
}
