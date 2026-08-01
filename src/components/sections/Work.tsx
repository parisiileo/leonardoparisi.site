"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Magnetic from "@/components/ui/Magnetic";
import Scramble from "@/components/ui/Scramble";
import data from "@/data/data.json";
import { useIsWide } from "@/hooks/useMediaQuery";
import { SECTION_HUES } from "@/lib/sections";

type WorkItem = (typeof data.work)[number];

export default function Work() {
  const t = useTranslations("work");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const isWide = useIsWide();
  const [distance, setDistance] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  // ResizeObserver fires once on observe, so this covers the initial measure
  // and every later reflow without a setState in the effect body.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (barRef.current) barRef.current.style.width = `${(p * 100).toFixed(1)}%`;

    const total = data.work.length;
    const index = Math.min(total - 1, Math.max(0, Math.ceil(p * total) - 1));
    if (labelRef.current) {
      labelRef.current.textContent = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    }
    setActiveIndex((current) => (current === index ? current : index));
  });

  return (
    <section
      id="work"
      ref={sectionRef}
      data-sec="work"
      data-hue={SECTION_HUES.work}
      className="bg-bg relative h-auto md:h-[420vh]"
    >
      <div className="relative flex flex-col md:sticky md:top-0 md:h-screen md:overflow-hidden">
        <div className="text-mut flex items-center justify-between gap-4 px-[clamp(16px,3vw,40px)] pt-[clamp(74px,10vh,100px)] pb-4 font-mono text-[11px] tracking-[0.22em]">
          <Scramble text={t("hint")} />
          <span ref={labelRef} className="tabular-nums">
            01 / {String(data.work.length).padStart(2, "0")}
          </span>
        </div>

        <div className="bg-line relative mx-[clamp(16px,3vw,40px)] h-px">
          <div
            ref={barRef}
            className="bg-ac absolute top-0 left-0 h-px w-0 transition-[width] duration-100 ease-linear"
          />
        </div>

        <motion.div
          ref={trackRef}
          style={{ x: isWide ? x : 0 }}
          className="flex snap-x snap-mandatory items-stretch overflow-x-auto px-[clamp(16px,3vw,40px)] pb-6 md:h-full md:snap-none md:overflow-visible md:pb-0"
        >
          <div className="flex w-[min(78vw,520px)] flex-none snap-start flex-col justify-center pr-[clamp(24px,5vw,80px)]">
            <div className="text-ac mb-5 font-mono text-[11px] tracking-[0.22em]">
              02
            </div>
            <h2 className="font-display m-0 text-[clamp(43px,6.7vw,101px)] leading-[0.86] font-black tracking-[-0.05em] uppercase">
              {t("headingLine1")}
              <br />
              {t("headingLine2")}
            </h2>
            <p className="text-mut mt-[22px] max-w-[38ch] text-[clamp(14px,1.3vw,17px)] leading-[1.55] text-pretty">
              {t("lead")}
            </p>
          </div>

          {data.work.map((item, i) => (
            <WorkCard
              key={item.id}
              item={item}
              index={i}
              active={isWide && activeIndex === i}
            />
          ))}

          <div className="flex w-[min(60vw,380px)] flex-none snap-start flex-col justify-center gap-[18px]">
            <p className="font-display m-0 text-[clamp(31px,4.1vw,61px)] leading-[0.9] font-black tracking-[-0.04em] uppercase">
              {t("closing")}
            </p>
            <Magnetic>
              <a
                href="#contact"
                className="bg-ac text-ac-t w-fit rounded-full px-[22px] py-[14px] font-mono text-[12px] font-medium tracking-[0.18em]"
              >
                {t("cta")} →
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WorkCard({
  item,
  index,
  active,
}: {
  item: WorkItem;
  index: number;
  active: boolean;
}) {
  const t = useTranslations("work");
  const period = item.from === item.to ? item.from : `${item.from} — ${item.to}`;

  return (
    <article
      className="mr-[clamp(18px,2.4vw,34px)] flex w-[min(84vw,660px)] flex-none snap-start flex-col justify-between self-center rounded-lg border p-[clamp(22px,3vw,40px)] transition-[border-color,background] duration-400 md:h-[min(62vh,560px)]"
      style={{
        borderColor: active ? "var(--ac)" : "var(--color-line)",
        background: active
          ? "color-mix(in oklab, var(--ac) 7%, var(--color-surf))"
          : "var(--color-surf)",
      }}
    >
      <div>
        <div className="text-mut flex items-start justify-between gap-4 font-mono text-[11px] tracking-[0.2em]">
          <span>
            {String(index + 1).padStart(2, "0")} —{" "}
            {t(`types.${item.type}` as "types.client")}
          </span>
          <span className="text-ac">{period}</span>
        </div>
        <h3 className="font-display mt-[26px] mb-[10px] text-[clamp(25px,3.2vw,45px)] leading-[0.96] font-extrabold tracking-[-0.035em]">
          {item.company}
        </h3>
        <p className="text-ac mb-5 text-[clamp(14px,1.2vw,17px)]">
          {t(`items.${item.id}.role` as "items.acs.role")}
        </p>
        <p className="text-mut m-0 max-w-[52ch] text-[clamp(13.5px,1.15vw,16px)] leading-[1.6] text-pretty">
          {t(`items.${item.id}.desc` as "items.acs.desc")}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {item.stack.map((tech) => (
          <span
            key={tech}
            className="border-line text-mut rounded-full border px-[13px] py-[7px] font-mono text-[11px] tracking-[0.08em]"
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}
