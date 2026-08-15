"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { useUI } from "@/components/layout/UIProvider";
import Counter from "@/components/ui/Counter";
import Magnetic from "@/components/ui/Magnetic";
import Scramble from "@/components/ui/Scramble";
import data from "@/data/data.json";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { SECTION_HUES } from "@/lib/sections";

const HEADLINE = ["F", "R", "O", "N", "T", "–", "E", "N", "D"];
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// The job title is the brand line, not copy — it reads the same in every locale.
const ROLE = "Developer";

const GLOW_SPRING = { stiffness: 45, damping: 22, mass: 0.9 } as const;

export default function Hero() {
  const t = useTranslations("hero");
  const { loaderDone } = useUI();
  const isDesktop = useIsDesktop();
  const sectionRef = useRef<HTMLElement>(null);
  const hasMoved = useRef(false);

  // Motion values, not state — the glow tracks the pointer without ever
  // re-rendering the section.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const glowX = useSpring(pointerX, GLOW_SPRING);
  const glowY = useSpring(pointerY, GLOW_SPRING);

  // Park it where the static blob used to sit, so the first paint (and any
  // touch device, which never fires mousemove) still looks composed. `jump`
  // on the springs too, otherwise it visibly slides in from the top-left.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const place = () => {
      if (hasMoved.current) return;
      const rect = el.getBoundingClientRect();
      const x = rect.width * 0.82;
      const y = rect.height * 0.28;
      pointerX.jump(x);
      pointerY.jump(y);
      glowX.jump(x);
      glowY.jump(y);
    };
    const observer = new ResizeObserver(place);
    observer.observe(el);
    return () => observer.disconnect();
  }, [pointerX, pointerY, glowX, glowY]);

  // Leading below 1 means the reveal mask would clip ascenders/descenders;
  // the padding is cancelled by an equal negative margin so layout is unchanged.
  const maskShift = { padding: "0.14em 0 0.18em", margin: "-0.14em 0 -0.18em" };

  return (
    <section
      id="top"
      ref={sectionRef}
      data-sec="hero"
      data-hue={SECTION_HUES.hero}
      onMouseMove={(event) => {
        if (!isDesktop) return;
        const rect = event.currentTarget.getBoundingClientRect();
        hasMoved.current = true;
        pointerX.set(event.clientX - rect.left);
        pointerY.set(event.clientY - rect.top);
      }}
      className="relative flex min-h-screen flex-col justify-between overflow-hidden px-[clamp(16px,3vw,40px)] pt-[clamp(84px,12vh,140px)] pb-[clamp(18px,3vw,34px)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-line2) 1px, transparent 1px)",
          backgroundSize: "12.5% 100%",
        }}
      />

      {/* Outer element carries the spring (transform); the inner one carries the
          centring translate, so the two never fight over `transform`. */}
      <motion.div
        aria-hidden
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none absolute top-0 left-0"
      >
        <div
          className="h-[min(46vw,620px)] w-[min(46vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.14] blur-[18px]"
          style={{
            background:
              "radial-gradient(circle at 40% 35%, var(--ac), transparent 66%)",
          }}
        />
      </motion.div>

      <div className="relative flex flex-1 flex-col justify-center gap-[clamp(10px,2vh,22px)] py-[clamp(24px,6vh,60px)]">
        <motion.p
          className="text-mut max-w-[34ch] text-[clamp(14px,1.5vw,19px)]"
          initial={{ opacity: 0, y: 24 }}
          animate={loaderDone ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          {t("intro")}
        </motion.p>

        <h1
          className="font-display m-0 flex flex-wrap overflow-hidden text-[clamp(52px,11.9vw,193px)] leading-[0.82] font-black tracking-[-0.055em] uppercase"
          style={maskShift}
        >
          {/* The animated letters are aria-hidden, so this is the real H1 —
              spelled out with the name and the city rather than the two words
              the layout can fit. */}
          <span className="sr-only">{t("h1")}</span>
          {HEADLINE.map((char, i) => (
            <span
              key={`${char}-${i}`}
              aria-hidden
              className={`hero-rise inline-block ${char === "–" ? "text-ac" : ""}`}
              style={{ "--i": i } as React.CSSProperties}
            >
              {char}
            </span>
          ))}
        </h1>

        <div className="flex flex-wrap items-end gap-[clamp(16px,4vw,54px)]">
          <p
            aria-hidden
            className="font-display m-0 overflow-hidden text-[clamp(34px,7.7vw,126px)] leading-[0.86] font-normal tracking-[-0.04em] uppercase italic"
            style={{
              padding: "0.14em 0.06em 0.2em 0",
              margin: "-0.14em -0.06em -0.2em 0",
            }}
          >
            {/* Same reasoning as the headline: at up to 126px this is the
                other credible LCP candidate, so it must not wait on JS. */}
            <span
              className="hero-rise inline-block"
              style={{ "--i": 9 } as React.CSSProperties}
            >
              {ROLE}
            </span>
          </p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={loaderDone ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT }}
            className="mb-2"
          >
            <Magnetic>
              <a
                href="#work"
                className="bg-ac text-ac-t flex items-center gap-3 rounded-full px-6 py-[15px] font-mono text-[12px] font-medium tracking-[0.18em]"
              >
                {t("cta")} →
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      <div className="border-line relative grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-5 border-t pt-5">
        <Stat value={data.stats.yearsShipping} label={t("statYears")} />
        <Stat value={data.stats.projectsLive} label={t("statProjects")} />
        <div className="text-mut flex items-end justify-start gap-[10px] font-mono text-[10.5px] tracking-[0.2em]">
          <span className="animate-bob inline-block">↓</span>
          {t("scroll")}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-display text-[clamp(25px,3.1vw,41px)] leading-none font-extrabold tracking-[-0.03em] tabular-nums">
        <Counter value={value} />
      </div>
      <div className="text-mut mt-[7px] font-mono text-[10.5px] tracking-[0.2em]">
        {label}
      </div>
    </div>
  );
}
