"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·—";

/**
 * Decodes a mono label out of noise the first time it enters view.
 * Re-runs when `text` changes, which is what makes a locale switch feel
 * deliberate rather than like a flash of replaced content.
 */
export default function Scramble({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Holds only the in-flight noise, tagged with the text it belongs to. A new
  // `text` invalidates it during render, so nothing has to be reset in an effect.
  const [noise, setNoise] = useState<{ of: string; value: string } | null>(null);
  const reduced = usePrefersReducedMotion();
  const display = noise?.of === text ? noise.value : text;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        let cursor = 0;
        timer = setInterval(() => {
          if (cursor >= text.length) {
            clearInterval(timer);
            setNoise(null);
            return;
          }
          const revealed = cursor;
          setNoise({
            of: text,
            value: text
              .split("")
              .map((char, i) => {
                if (char === " ") return " ";
                if (i < revealed) return char;
                return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              })
              .join(""),
          });
          cursor += 0.8;
        }, 34);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [text, reduced]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
