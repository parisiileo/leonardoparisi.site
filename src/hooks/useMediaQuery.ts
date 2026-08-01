"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query. Renders as `false` on the server and during the first
 * client paint, then settles — so anything gated on this must degrade to its
 * "off" state gracefully rather than jumping.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/**
 * The gate for cursor, magnetic pull, 3D tilt and the horizontal scroll-jack.
 * Requires a fine pointer too, so hybrid touch laptops don't get a cursor
 * they can't move.
 */
export const useIsDesktop = () =>
  useMediaQuery("(min-width: 761px) and (pointer: fine)");

/** Layout-only breakpoint — matches the prototype's 760px mobile gate. */
export const useIsWide = () => useMediaQuery("(min-width: 761px)");
