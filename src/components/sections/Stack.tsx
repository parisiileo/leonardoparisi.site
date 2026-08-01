"use client";

import { useTranslations } from "next-intl";
import Magnetic from "@/components/ui/Magnetic";
import Scramble from "@/components/ui/Scramble";
import data from "@/data/data.json";
import { SECTION_HUES } from "@/lib/sections";

export default function Stack() {
  const t = useTranslations("stack");

  return (
    <section
      id="stack"
      data-sec="stack"
      data-hue={SECTION_HUES.stack}
      className="bg-bg border-line relative border-t px-[clamp(16px,3vw,40px)] py-[clamp(60px,10vh,120px)]"
    >
      <div className="mb-[clamp(28px,5vh,56px)] flex flex-wrap items-end justify-between gap-5">
        <h2 className="font-display m-0 text-[clamp(36px,5.8vw,94px)] leading-[0.87] font-black tracking-[-0.05em] uppercase">
          {t("heading")}
        </h2>
        <div className="text-mut font-mono text-[11px] tracking-[0.2em]">
          <Scramble text={t("meta")} />
        </div>
      </div>

      <ul className="flex list-none flex-wrap gap-[10px] p-0">
        {data.stack.map((tool) => (
          <li key={tool}>
            <Magnetic>
              <span
                data-chip
                className="border-line font-display hover:bg-ac hover:text-ac-t hover:border-ac block rounded-full border px-[22px] py-[13px] text-[clamp(15px,1.7vw,25px)] font-semibold tracking-[-0.02em] transition-[background,color,border-color] duration-300"
              >
                {tool}
              </span>
            </Magnetic>
          </li>
        ))}
      </ul>
    </section>
  );
}
