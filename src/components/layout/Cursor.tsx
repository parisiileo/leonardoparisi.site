"use client";

import { useEffect, useRef } from "react";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const INTERACTIVE =
  "a,button,input,textarea,select,[data-magnetic],[data-tilt],[data-chip]";

/**
 * Two layers: a ring that lags the pointer (lerped 0.16/frame) and a dot that
 * tracks it exactly. Hover state comes from event delegation rather than
 * per-element listeners, so it keeps working as sections mount and unmount.
 */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const active = isDesktop && !reduced;

  useEffect(() => {
    if (!active) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.classList.add("has-custom-cursor");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      ring.style.opacity = "1";
      dot.style.opacity = "1";
      dot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;

      const el = event.target as Element | null;
      const hovering = !!el?.closest?.(INTERACTIVE);
      ring.style.width = hovering ? "76px" : "34px";
      ring.style.height = hovering ? "76px" : "34px";
      ring.style.background = hovering
        ? "color-mix(in oklab, var(--ac) 22%, transparent)"
        : "transparent";
    };

    const onLeave = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };

    const loop = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      frame = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="border-ac pointer-events-none fixed top-0 left-0 z-[150] h-[34px] w-[34px] rounded-full border opacity-0 mix-blend-difference"
        style={{
          transition: "width .3s, height .3s, opacity .3s, background .3s",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="bg-ac pointer-events-none fixed top-0 left-0 z-[151] h-[5px] w-[5px] rounded-full opacity-0"
      />
    </>
  );
}
