"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { useUI } from "./UIProvider";

/**
 * Opening curtain: a counter races to 100, the panel slides up, and 180ms
 * into that exit the hero letters are released (via `loaderDone`) so the two
 * motions overlap instead of queueing.
 */
export default function Loader() {
  const t = useTranslations("loader");
  const { setLoaderDone } = useUI();
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Nothing to animate — UIProvider already treats reduced motion as
    // "curtain lifted", so this component simply never renders.
    if (reduced) return;

    document.body.style.overflow = "hidden";
    let exitTimer: ReturnType<typeof setTimeout>;
    let releaseTimer: ReturnType<typeof setTimeout>;
    let removeTimer: ReturnType<typeof setTimeout>;

    const tick = setInterval(() => {
      setCount((n) => {
        const next = Math.min(100, n + Math.ceil(Math.random() * 9));
        if (next >= 100) {
          clearInterval(tick);
          exitTimer = setTimeout(() => {
            setExiting(true);
            document.body.style.overflow = "";
            releaseTimer = setTimeout(() => setLoaderDone(true), 180);
            removeTimer = setTimeout(() => setGone(true), 1200);
          }, 260);
        }
        return next;
      });
    }, 55);

    return () => {
      clearInterval(tick);
      clearTimeout(exitTimer);
      clearTimeout(releaseTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, [reduced, setLoaderDone]);

  if (reduced || gone) return null;

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
        LEO
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
