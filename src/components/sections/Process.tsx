"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import ProcessArt, { type ProcessArtName } from "@/components/ui/ProcessArt";
import Scramble from "@/components/ui/Scramble";
import data from "@/data/data.json";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { SECTION_HUES } from "@/lib/sections";

type Step = (typeof data.process)[number];

export default function Process() {
  const t = useTranslations("process");

  return (
    <section
      id="process"
      data-sec="process"
      data-hue={SECTION_HUES.process}
      className="bg-bg relative px-[clamp(16px,3vw,40px)] pt-[clamp(60px,10vh,120px)]"
    >
      <div className="border-line flex flex-wrap items-end justify-between gap-5 border-b pb-[22px]">
        <h2 className="font-display m-0 text-[clamp(38px,6.3vw,99px)] leading-[0.86] font-black tracking-[-0.05em] uppercase">
          {t("headingLine1")}
          <br />
          {t("headingLine2")}
        </h2>
        <div className="text-mut max-w-[30ch] font-mono text-[11px] leading-[1.9] tracking-[0.2em]">
          <Scramble text={t("meta")} />
          <br />
          {t("range")}
        </div>
      </div>

      <div className="pt-[clamp(30px,6vh,70px)]">
        {data.process.map((step, i) => (
          <StepCard key={step.id} step={step} index={i} />
        ))}
      </div>

      <div className="h-[20vh]" />
    </section>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const t = useTranslations("process");
  const ref = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const number = String(index + 1).padStart(2, "0");

  // Copy lives in the messages files; `raw` is how next-intl hands back the
  // deliverables array untouched.
  const deliverables = t.raw(
    `items.${step.id}.deliverables` as "items.brief.deliverables",
  ) as string[];

  const applyTilt = (event: React.MouseEvent) => {
    const el = ref.current;
    if (!isDesktop || !el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1400px) rotateY(${(px * 5).toFixed(2)}deg) rotateX(${(-py * 4).toFixed(2)}deg) scale(1.005)`;
    el.style.borderColor = "var(--ac)";
    // The artwork reads these to drift against the tilt (see .art-parallax).
    el.style.setProperty("--px", (-px).toFixed(3));
    el.style.setProperty("--py", (-py).toFixed(3));
  };

  const resetTilt = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(1400px) rotateY(0deg) rotateX(0deg) scale(1)";
    el.style.borderColor = "var(--color-line)";
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
  };

  const textColumn = (
    <div
      className={`flex flex-col justify-between gap-6 p-[clamp(22px,3vw,44px)] ${
        step.mediaFirst ? "min-[860px]:order-2" : ""
      }`}
    >
      <div className="text-mut flex justify-between font-mono text-[11px] tracking-[0.2em]">
        <span>{number}</span>
        <span className="text-ac">
          {t(`items.${step.id}.tag` as "items.brief.tag")}
        </span>
      </div>
      <div>
        <h3 className="font-display m-0 mb-[14px] text-[clamp(31px,4.7vw,72px)] leading-[0.86] font-black tracking-[-0.045em] uppercase">
          {t(`items.${step.id}.title` as "items.brief.title")}
        </h3>
        <p className="text-mut m-0 mb-[22px] max-w-[44ch] text-[clamp(14px,1.2vw,17px)] leading-[1.6] text-pretty">
          {t(`items.${step.id}.desc` as "items.brief.desc")}
        </p>
        <ul className="flex list-none flex-wrap gap-2 p-0">
          {deliverables.map((item) => (
            <li
              key={item}
              className="border-line text-mut rounded-full border px-[13px] py-[7px] font-mono text-[11px]"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const mediaColumn = (
    <div
      className={`relative flex items-center justify-center overflow-hidden p-[18px] ${
        step.mediaFirst ? "min-[860px]:order-1" : ""
      }`}
      style={{
        background: "#0e0e10",
        backgroundImage: `repeating-linear-gradient(${step.hatch}deg, rgba(244,242,238,.055) 0 2px, transparent 2px 13px)`,
      }}
    >
      {/* A generated scene instead of a screenshot — a step has nothing to
          photograph. It comes alive on hover; the outlined numeral sits
          behind it as a watermark. */}
      <span
        aria-hidden
        className="font-display text-[clamp(120px,20vw,300px)] leading-none font-black tracking-[-0.06em] text-transparent opacity-60"
        style={{ WebkitTextStroke: "1.5px var(--color-line2)" }}
      >
        {number}
      </span>
      <div className="absolute inset-[9%]">
        <ProcessArt name={step.id as ProcessArtName} className="text-ink/50" />
      </div>
    </div>
  );

  return (
    <article
      ref={ref}
      data-tilt
      onMouseMove={applyTilt}
      onMouseLeave={resetTilt}
      className={`step-card border-line bg-surf relative mb-[26px] grid min-h-[min(72vh,620px)] overflow-hidden rounded-[10px] border transition-[transform,border-color] duration-500 md:sticky ${
        step.mediaFirst
          ? "min-[860px]:grid-cols-[.95fr_1.05fr]"
          : "min-[860px]:grid-cols-[1.05fr_.95fr]"
      }`}
      style={{
        top: `${step.stickyTop}px`,
        transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
      }}
    >
      {textColumn}
      {mediaColumn}
    </article>
  );
}
