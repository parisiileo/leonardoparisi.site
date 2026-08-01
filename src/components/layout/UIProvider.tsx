"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import type { SectionId } from "@/lib/sections";

type UIState = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  loaderDone: boolean;
  setLoaderDone: (done: boolean) => void;
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
};

const UIContext = createContext<UIState | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}

/**
 * The header, menu overlay and hero all need to agree on three things:
 * whether the curtain has lifted, whether the menu is open, and which
 * section owns the viewport. Small enough to keep in one context.
 */
export default function UIProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [curtainLifted, setLoaderDone] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");

  // With reduced motion there is no curtain to wait on, so the hero is free
  // to render immediately — derived here rather than set from an effect.
  const reduced = usePrefersReducedMotion();
  const loaderDone = curtainLifted || reduced;

  const value = useMemo(
    () => ({
      menuOpen,
      setMenuOpen,
      loaderDone,
      setLoaderDone,
      activeSection,
      setActiveSection,
    }),
    [menuOpen, loaderDone, activeSection],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
