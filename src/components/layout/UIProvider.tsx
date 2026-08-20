"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { useCurtainSeen } from "@/hooks/useCurtainSeen";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type UIState = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  loaderDone: boolean;
  setLoaderDone: (done: boolean) => void;
};

const UIContext = createContext<UIState | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}

/**
 * The header, menu overlay and hero all need to agree on two things:
 * whether the curtain has lifted and whether the menu is open. Small enough
 * to keep in one context.
 */
export default function UIProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [curtainLifted, setLoaderDone] = useState(false);

  // With reduced motion there is no curtain to wait on, and on a second view
  // in the same tab it never plays at all, so the hero is free to render
  // immediately — both derived here rather than set from an effect.
  const reduced = usePrefersReducedMotion();
  const curtainSeen = useCurtainSeen();
  const loaderDone = curtainLifted || reduced || curtainSeen;

  const value = useMemo(
    () => ({
      menuOpen,
      setMenuOpen,
      loaderDone,
      setLoaderDone,
    }),
    [menuOpen, loaderDone],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
