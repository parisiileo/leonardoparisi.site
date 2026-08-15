"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useCurtainSeen } from "@/hooks/useCurtainSeen";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { useUI } from "./UIProvider";

/**
 * Opening curtain: a counter races to 100, the panel slides up, and 180ms
 * into that exit the rest of the hero is released (via `loaderDone`) so the
 * two motions overlap instead of queueing.
 *
 * The curtain is the first thing a visitor waits behind, so its length is a
 * straight cost in Largest Contentful Paint. Two things keep that down: the
 * counter runs on rAF against a fixed wall-clock budget rather than ~19
 * random `setInterval` ticks that drifted past a second and a half, and it
 * plays once per tab instead of on every return to the home page.
 *
 * Both "there is no curtain" cases — reduced motion, and a second view in
 * this tab — are derived in UIProvider, so `loaderDone` is already true by
 * the time this component decides not to render.
 */

/** Total time the counter is allowed to spend climbing to 100. */
const COUNT_MS = 620;
/** Beat between hitting 100 and the panel starting to slide. */
const HOLD_MS = 140;

export default function Loader() {
  const t = useTranslations("loader");
  const { setLoaderDone } = useUI();
  const reduced = usePrefersReducedMotion();
  const curtainSeen = useCurtainSeen();
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  const skip = reduced || curtainSeen;

  useEffect(() => {
    if (skip) return;

    document.body.style.overflow = "hidden";
    let releaseTimer: ReturnType<typeof setTimeout>;
    let removeTimer: ReturnType<typeof setTimeout>;
    let raf: number;

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / COUNT_MS);
      setCount(Math.round(progress * 100));

      if (progress < 1) {
        raf = requestAnimationFrame(step);
        return;
      }

      releaseTimer = setTimeout(() => {
        setExiting(true);
        document.body.style.overflow = "";
        // The hero is released 180ms into the 1.05s slide, so the letters
        // rise while the panel is still clearing them.
        releaseTimer = setTimeout(() => setLoaderDone(true), 180);
        removeTimer = setTimeout(() => setGone(true), 1200);
      }, HOLD_MS);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(releaseTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, [skip, setLoaderDone]);

  if (skip || gone) return null;

  return (
    <div
      aria-hidden
      className="bg-bg fixed inset-0 z-[200] flex items-end justify-between p-[clamp(20px,4vw,52px)]"
      style={{
        transform: exiting ? "translateY(-101%)" : "translateY(0)",
        transition: "transform 1.05s cubic-bezier(.76,0,.24,1)",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      <div className="font-display text-[clamp(43px,9.9vw,133px)] leading-[0.82] font-extrabold tracking-[-0.05em]">
        LEONARDO
        <br />
        PARISI
      </div>
      <div className="flex flex-col items-end gap-[10px]">
        <div className="font-mono text-[11px] tracking-[0.22em] text-mut">
          {t("label")}
        </div>
        <div className="font-display text-ac text-[clamp(36px,6.3vw,79px)] leading-[0.85] font-extrabold tabular-nums">
          {String(count).padStart(3, "0")}
        </div>
      </div>
    </div>
  );
}
