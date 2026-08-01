"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import data from "@/data/data.json";
import { SECTION_HUES } from "@/lib/sections";

/**
 * Built and ready, but gated behind `testimonials.enabled` in data.json —
 * flip that to true once real quotes replace the placeholder copy.
 */
export default function Testimonials() {
  const t = useTranslations("testimonials");
  if (!data.testimonials.enabled) return null;

  return (
    <section
      id="words"
      data-sec="testimonials"
      data-hue={SECTION_HUES.testimonials}
      className="bg-bg border-line relative border-t px-[clamp(16px,3vw,40px)] py-[clamp(60px,10vh,120px)]"
    >
      <div className="mb-[clamp(28px,5vh,56px)] flex flex-wrap items-end justify-between gap-5">
        <h2 className="font-display m-0 text-[clamp(36px,5.8vw,94px)] leading-[0.87] font-black tracking-[-0.05em] uppercase">
          {t("heading")}
        </h2>
        <div className="border-line text-ac rounded border border-dashed px-[13px] py-[9px] font-mono text-[11px] tracking-[0.2em]">
          {t("notice")}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[14px]">
        {data.testimonials.items.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.1} y={26}>
            <blockquote className="border-line bg-surf m-0 flex h-full flex-col justify-between gap-5 rounded-lg border p-[clamp(20px,2.4vw,32px)]">
              <p className="font-display m-0 text-[clamp(18px,1.9vw,25px)] leading-[1.25] font-semibold tracking-[-0.02em] text-pretty">
                {t(`items.${item.id}` as "items.one")}
              </p>
              <footer className="text-mut font-mono text-[11px] tracking-[0.16em]">
                {item.name} — {item.company}
              </footer>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
