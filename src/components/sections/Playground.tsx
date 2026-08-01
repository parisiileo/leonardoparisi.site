"use client";

import { useTranslations } from "next-intl";
import Scramble from "@/components/ui/Scramble";
import data from "@/data/data.json";
import { SECTION_HUES } from "@/lib/sections";

type PlaygroundItem = (typeof data.playground)[number];

/**
 * Deliberately non-interactive: these experiments aren't public yet, and as
 * links they read as broken. Each card becomes an <a> when its build ships.
 */
export default function Playground() {
  const t = useTranslations("playground");

  return (
    <section
      id="play"
      data-sec="playground"
      data-hue={SECTION_HUES.playground}
      className="bg-bg2 border-line relative border-t px-[clamp(16px,3vw,40px)] py-[clamp(60px,10vh,120px)]"
    >
      <div className="mb-[clamp(28px,5vh,56px)] flex flex-wrap items-end justify-between gap-5">
        <h2 className="font-display m-0 text-[clamp(36px,5.8vw,94px)] leading-[0.87] font-black tracking-[-0.05em] uppercase">
          {t("heading")}
        </h2>
        <div className="flex max-w-[34ch] flex-col items-start gap-[10px]">
          <span className="text-mut font-mono text-[11px] leading-[1.9] tracking-[0.2em]">
            <Scramble text={t("meta")} />
          </span>
          <span className="border-line text-ac rounded border border-dashed px-3 py-2 font-mono text-[10.5px] tracking-[0.2em]">
            {t("notice")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[14px]">
        {data.playground.map((item) => (
          <PlaygroundCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function PlaygroundCard({ item }: { item: PlaygroundItem }) {
  const t = useTranslations("playground");

  return (
    <div className="border-line bg-surf hover:border-ac group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-lg border p-5 transition-[border-color,transform] duration-400 hover:-translate-y-[6px]">
      <Graphic kind={item.graphic} />
      <div className="text-ac relative font-mono text-[11px] tracking-[0.2em]">
        {t(`categories.${item.category}` as "categories.WEBGL")}
      </div>
      <div className="relative">
        <div className="font-display text-[clamp(20px,2.2vw,29px)] leading-none font-extrabold tracking-[-0.03em]">
          {t(`items.${item.id}.title` as "items.shaders.title")}
        </div>
        <div className="text-mut mt-2 font-mono text-[11px]">
          {t(`items.${item.id}.subtitle` as "items.shaders.subtitle")}
        </div>
      </div>
    </div>
  );
}

function Graphic({ kind }: { kind: string }) {
  if (kind === "conic") {
    return (
      <div
        aria-hidden
        className="animate-slow-spin absolute inset-0 opacity-10"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, var(--ac), transparent 65%)",
        }}
      />
    );
  }
  if (kind === "dots") {
    return (
      <div
        aria-hidden
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-line) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
    );
  }
  if (kind === "glow") {
    return (
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[56%] opacity-[0.14]"
        style={{
          background: "linear-gradient(0deg, var(--ac), transparent)",
        }}
      />
    );
  }
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, var(--color-line) 0 1px, transparent 1px 9px)",
      }}
    />
  );
}
