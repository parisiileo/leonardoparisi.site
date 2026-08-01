"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";
import Scramble from "@/components/ui/Scramble";
import data from "@/data/data.json";
import { SECTION_HUES } from "@/lib/sections";
import portrait from "../../../assets/about_portrait.jpg";

export default function About() {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      data-sec="about"
      data-hue={SECTION_HUES.about}
      className="bg-bg2 border-line relative border-t px-[clamp(16px,3vw,40px)] py-[clamp(60px,10vh,120px)]"
    >
      <div className="grid grid-cols-1 items-start gap-[clamp(24px,5vw,72px)] min-[860px]:grid-cols-[1.15fr_.85fr]">
        <div>
          <div className="text-ac mb-[22px] font-mono text-[11px] tracking-[0.22em]">
            <Scramble text={t("kicker")} />
          </div>
          <h2 className="font-display m-0 mb-[26px] text-[clamp(36px,5.8vw,94px)] leading-[0.87] font-black tracking-[-0.05em] uppercase">
            {t("headingA")}
            <br />
            <span className="font-normal normal-case italic">
              {t("headingB")}
            </span>{" "}
            {t("headingC")}
          </h2>
          <p className="m-0 mb-[18px] max-w-[46ch] text-[clamp(15px,1.4vw,20px)] leading-[1.55] text-pretty">
            {t("lead")}
          </p>
          <p className="text-mut m-0 mb-[34px] max-w-[50ch] text-[clamp(14px,1.2vw,17px)] leading-[1.6] text-pretty">
            {t("secondary")}
          </p>

          <div className="border-line grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-[18px] border-t pt-[22px]">
            <AboutStat
              label={t("statStarted")}
              value={<Counter value={data.stats.startedCoding} />}
            />
            <AboutStat label={t("statSelfDriven")} value={<>100%</>} />
            <AboutStat label={t("statBased")} value={<>IT</>} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Reveal y={30}>
            <Image
              src={portrait}
              alt={t("photoAlt")}
              placeholder="blur"
              sizes="(max-width: 860px) 100vw, 40vw"
              priority={false}
              className="aspect-[3/4] w-full rounded-md object-cover grayscale contrast-[1.05] transition-[filter] duration-700 hover:grayscale-0"
            />
          </Reveal>
          <div className="text-mut2 text-right font-mono text-[10.5px] tracking-[0.16em]">
            {t("figCaption")}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutStat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-display text-[clamp(23px,2.7vw,36px)] leading-none font-extrabold tracking-[-0.03em] tabular-nums">
        {value}
      </div>
      <div className="text-mut mt-[6px] font-mono text-[10.5px] tracking-[0.18em]">
        {label}
      </div>
    </div>
  );
}
