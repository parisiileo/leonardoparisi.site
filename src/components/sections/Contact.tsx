"use client";

import { useTranslations } from "next-intl";
import Magnetic from "@/components/ui/Magnetic";
import Scramble from "@/components/ui/Scramble";
import data from "@/data/data.json";
import { Link } from "@/i18n/navigation";
import { SECTION_HUES } from "@/lib/sections";
import ContactForm from "./ContactForm";

const LEGAL_LINKS = [
  { href: "/privacy", key: "privacy" },
  { href: "/cookie", key: "cookie" },
  { href: "/terms", key: "terms" },
] as const;

export default function Contact() {
  const t = useTranslations("contact");
  const tFooter = useTranslations("footer");

  return (
    <section
      id="contact"
      data-sec="contact"
      data-hue={SECTION_HUES.contact}
      className="bg-bg relative flex min-h-screen flex-col justify-between overflow-hidden px-[clamp(16px,3vw,40px)] pt-[clamp(60px,10vh,120px)] pb-[clamp(20px,3vw,34px)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[60%] left-1/2 h-[min(80vw,900px)] w-[min(80vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.09] blur-[30px]"
        style={{ background: "radial-gradient(circle, var(--ac), transparent 62%)" }}
      />

      <div className="text-mut relative flex flex-wrap justify-between gap-4 font-mono text-[11px] tracking-[0.2em]">
        <Scramble text={t("kicker")} />
        <span>{t("replies")}</span>
      </div>

      <div className="relative py-[clamp(30px,6vh,70px)]">
        <h2 className="font-display m-0 text-[clamp(41px,9.5vw,162px)] leading-[0.84] font-black tracking-[-0.055em] uppercase">
          {t("headingA")}
        </h2>
        <p className="font-display text-ac m-0 text-[clamp(36px,8.1vw,144px)] leading-[0.86] font-normal tracking-[-0.05em] uppercase italic">
          {t("headingB")}
        </p>

        <div className="mt-[clamp(26px,4vh,44px)] flex flex-wrap gap-[14px]">
          <Magnetic>
            <a
              href={`mailto:${data.contact.email}`}
              className="bg-ac text-ac-t flex items-center gap-3 rounded-full px-[26px] py-[17px] font-mono text-[12.5px] font-medium tracking-[0.16em]"
            >
              {data.contact.email} →
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={data.contact.discord}
              target="_blank"
              rel="noreferrer"
              className="border-line text-mut hover:text-ink flex items-center gap-3 rounded-full border px-[26px] py-[17px] font-mono text-[12.5px] tracking-[0.16em] transition-colors"
            >
              {t("discord")} →
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={`tel:${data.contact.phone.replace(/\s/g, "")}`}
              className="border-line text-mut hover:text-ink flex items-center gap-3 rounded-full border px-[26px] py-[17px] font-mono text-[12.5px] tracking-[0.16em] transition-colors"
            >
              {data.contact.phone} →
            </a>
          </Magnetic>
        </div>
      </div>

      <ContactForm />

      <footer className="border-line text-mut relative flex flex-wrap items-end justify-between gap-[22px] border-t pt-5 font-mono text-[11px] tracking-[0.14em]">
        <div className="flex flex-col gap-[6px]">
          <span className="text-ink font-display text-[19px] font-extrabold tracking-[-0.02em] uppercase">
            Leonardo Parisi
          </span>
          <span>{tFooter("copyright")}</span>
          <span className="tabular-nums">
            {tFooter("vat")} {data.contact.vat}
          </span>
          {/* Required disclosures live one click away, on every page. */}
          <div className="mt-[6px] flex flex-wrap gap-4">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-ac transition-colors"
              >
                {tFooter(item.key)}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-5">
          {data.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ac transition-colors"
            >
              {social.name}
            </a>
          ))}
          <a href="#top" className="hover:text-ac transition-colors">
            {tFooter("backToTop")} ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
