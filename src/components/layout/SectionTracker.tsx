"use client";

import { useEffect } from "react";
import type { SectionId } from "@/lib/sections";
import { useUI } from "./UIProvider";

/**
 * Rewrites `--ac-hue` on :root as each `[data-sec]` crosses the viewport
 * middle. Driving a single custom property means every accent on the page —
 * borders, fills, glows, the cursor — transitions together for free.
 */
export default function SectionTracker() {
  const { setActiveSection } = useUI();

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-sec]"),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const id = el.dataset.sec as SectionId | undefined;
          const hue = el.dataset.hue;
          if (hue) document.documentElement.style.setProperty("--ac-hue", hue);
          if (id) setActiveSection(id);
        }
      },
      { threshold: 0.001, rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [setActiveSection]);

  return null;
}
