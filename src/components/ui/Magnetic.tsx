"use client";

import { motion, useMotionValue } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Pulls its child toward the cursor within its own bounds, then springs back.
 * Wraps rather than clones so the child stays a real <a>/<button> — which the
 * cursor's hover detection and keyboard users both depend on.
 */
export default function Magnetic({
  children,
  className = "",
  strength = 0.24,
  strengthY = 0.34,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  strengthY?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const active = isDesktop && !reduced;

  return (
    <motion.div
      ref={ref}
      className={`inline-flex w-fit ${className}`}
      style={{ x, y }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      onMouseMove={(event) => {
        if (!active || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((event.clientY - (rect.top + rect.height / 2)) * strengthY);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
