"use client";

import { useScroll } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * A lattice of short strokes that behaves like a magnetic field: every stroke
 * turns to face the pointer, and a wave travels through the grid as the
 * section crosses the viewport. Fills the space the copy leaves empty.
 *
 * Nothing here re-renders — the grid is state (it only changes on resize),
 * everything else is written straight to the DOM inside one rAF loop that
 * runs only while the section is on screen and something is actually moving.
 */

const SPACING = 40; // px between nodes
const LENGTH = 7; // half-length of a stroke at rest
const RADIUS = 240; // px of pointer influence
const EASE = 0.14; // per-frame approach to the target angle
const SETTLED = 0.0004; // below this the loop idles instead of writing

type Node = { x: number; y: number; phase: number };

/** Deterministic resting angle — a slow diagonal drift across the plate. */
function baseAngle(x: number, y: number) {
  return Math.sin(x * 0.006) * 0.7 + Math.cos(y * 0.009) * 0.7;
}

/** Shortest way round the circle, so a stroke never spins the long way. */
function approach(current: number, target: number, amount: number) {
  let delta = (target - current) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return current + delta * amount;
}

export default function FieldArt({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(SVGLineElement | null)[]>([]);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();

  const [size, setSize] = useState({ width: 0, height: 0 });
  const { scrollYProgress } = useScroll({
    target: hostRef,
    offset: ["start end", "end start"],
  });

  // Nodes are laid out from the measured box, centred so the margins match.
  const nodes = useMemo<Node[]>(() => {
    const { width, height } = size;
    if (width < SPACING || height < SPACING) return [];

    const cols = Math.floor(width / SPACING);
    const rows = Math.floor(height / SPACING);
    const offsetX = (width - (cols - 1) * SPACING) / 2;
    const offsetY = (height - (rows - 1) * SPACING) / 2;

    return Array.from({ length: cols * rows }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        x: offsetX + col * SPACING,
        y: offsetY + row * SPACING,
        // Staggers the wave along the diagonal.
        phase: col * 0.55 + row * 0.4,
      };
    });
  }, [size]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || nodes.length === 0) return;

    const angles = new Float32Array(nodes.map((n) => baseAngle(n.x, n.y)));
    const pointer = { x: 0, y: 0, active: false };
    let rect = host.getBoundingClientRect();
    let frame = 0;
    let visible = false;
    let lastWave = Number.NaN;

    const draw = (settleOnly: boolean) => {
      const wave = reduced ? 0 : scrollYProgress.get() * Math.PI * 4;
      const waveHeld = wave === lastWave;
      lastWave = wave;

      let motion = 0;

      for (let i = 0; i < nodes.length; i++) {
        const line = linesRef.current[i];
        if (!line) continue;
        const node = nodes[i];

        // Resting state plus the travelling wave.
        const swell = reduced ? 0 : Math.sin(node.phase + wave);
        let target = baseAngle(node.x, node.y) + swell * 0.5;
        let pull = 0;

        if (pointer.active) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const distance = Math.hypot(dx, dy);
          if (distance < RADIUS) {
            // Smoothstep, so the edge of the field has no visible rim.
            const t = 1 - distance / RADIUS;
            pull = t * t * (3 - 2 * t);
            target = approach(target, Math.atan2(dy, dx), pull);
          }
        }

        const previous = angles[i];
        const next = approach(previous, target, settleOnly ? 1 : EASE);
        angles[i] = next;
        motion = Math.max(motion, Math.abs(next - previous));

        const scale = 1 + pull * 1.15 + Math.abs(swell) * 0.3;
        line.setAttribute(
          "transform",
          `translate(${node.x} ${node.y}) rotate(${(next * 180) / Math.PI}) scale(${scale} 1)`,
        );
        line.style.opacity = String(0.14 + pull * 0.62 + Math.abs(swell) * 0.1);
        line.style.stroke = pull > 0.55 ? "var(--ac)" : "currentColor";
      }

      // Once every stroke has settled and the wave is parked, stop writing.
      return motion > SETTLED || !waveHeld;
    };

    // Static plate: draw once and leave it alone.
    if (reduced) {
      draw(true);
      return;
    }

    const tick = () => {
      frame = draw(false) ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!frame && visible) frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDesktop || event.pointerType !== "mouse") return;
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      // Keeps the field reacting to the pointer anywhere in the section, not
      // only where the strokes are.
      pointer.active =
        pointer.x > -RADIUS &&
        pointer.y > -RADIUS &&
        pointer.x < rect.width + RADIUS &&
        pointer.y < rect.height + RADIUS;
      wake();
    };

    // Pointer gone from the window entirely: let the field relax instead of
    // freezing it mid-reach.
    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      pointer.active = false;
      wake();
    };

    const onScrollOrResize = () => {
      rect = host.getBoundingClientRect();
      wake();
    };

    const inView = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          rect = host.getBoundingClientRect();
          wake();
        } else if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "120px" },
    );

    inView.observe(host);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    const unsubscribe = scrollYProgress.on("change", wake);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      inView.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      unsubscribe();
    };
  }, [nodes, isDesktop, reduced, scrollYProgress]);

  // Before the first measurement there is no grid to draw — and no valid
  // viewBox either, so the plate stays an empty box until the observer fires.
  if (nodes.length === 0) {
    return <div ref={hostRef} aria-hidden className={className} />;
  }

  return (
    <div ref={hostRef} aria-hidden className={`relative ${className}`}>
      <svg
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
        className="text-ink absolute inset-0"
      >
        {nodes.map((node, i) => (
          <line
            key={`${node.x}-${node.y}`}
            ref={(el) => {
              linesRef.current[i] = el;
            }}
            x1={-LENGTH}
            y1={0}
            x2={LENGTH}
            y2={0}
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ opacity: 0.14, stroke: "currentColor" }}
            transform={`translate(${node.x} ${node.y}) rotate(${
              (baseAngle(node.x, node.y) * 180) / Math.PI
            })`}
          />
        ))}
      </svg>
    </div>
  );
}
