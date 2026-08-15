"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Magnetic from "@/components/ui/Magnetic";
import { useIsWide } from "@/hooks/useMediaQuery";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useUI } from "./UIProvider";

function ItalyClock() {
  const t = useTranslations("common");
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Rome",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    // Seeded on mount rather than during render: a clock value can never match
    // between server and client, so it stays out of the SSR output entirely.
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;
  return (
    <span className="text-mut2 font-mono text-[11px] tracking-[0.16em] tabular-nums">
      {t("italy")} {time}
    </span>
  );
}

export default function Header() {
  const t = useTranslations("nav");
  const tSections = useTranslations("sections");
  const { menuOpen, setMenuOpen, loaderDone, activeSection } = useUI();
  const onHome = usePathname() === "/";
  const LogoTag = onHome ? "a" : Link;
  const isWide = useIsWide();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The section chip tracks the scrolling page, so it means nothing on the
  // legal routes — those have no [data-sec] for the observer to follow.
  const showMeta = isWide && loaderDone && onHome;

  return (
    <header
      className="fixed top-0 left-0 z-[100] flex w-full items-center justify-between gap-4 px-[clamp(16px,3vw,40px)] py-[18px]"
      style={{
        background: scrolled ? "rgba(10,10,11,.78)" : "rgba(10,10,11,0)",
        backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
        borderBottom: `1px solid ${scrolled ? "var(--color-line)" : "transparent"}`,
        transition:
          "background .35s, backdrop-filter .35s, border-color .35s, -webkit-backdrop-filter .35s",
      }}
    >
      <Magnetic>
        {/* An anchor on the scrolling page, a route home from anywhere else. */}
        <LogoTag
          href={onHome ? "#top" : "/"}
          className="flex items-center gap-[11px]"
        >
          <span className="bg-ac animate-blink block h-[11px] w-[11px] flex-none rounded-full" />
          {/* Below 420px the full name, the language switcher and MENU stop
              fitting on one line, so the wordmark contracts to a monogram.
              The accessible name stays the same at every width. */}
          <span className="sr-only">Leonardo Parisi</span>
          <span
            aria-hidden
            className="font-display text-[15px] font-extrabold tracking-[-0.02em] whitespace-nowrap uppercase"
          >
            <span className="min-[420px]:hidden">LP</span>
            <span className="hidden min-[420px]:inline">Leonardo Parisi</span>
          </span>
        </LogoTag>
      </Magnetic>

      <div className="flex items-center gap-[26px]">
        {showMeta && (
          <span className="text-mut font-mono text-[11px] tracking-[0.22em]">
            {tSections(activeSection)}
          </span>
        )}
        {showMeta && <ItalyClock />}

        <LanguageSwitcher />

        <Magnetic>
          <button
            type="button"
            aria-label={t("open")}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="border-line text-ink hover:text-ac flex cursor-pointer items-center gap-[10px] rounded-full border bg-transparent px-4 py-[9px] font-mono text-[11px] tracking-[0.2em] transition-colors"
          >
            <span className="flex flex-col gap-[3px]">
              <span className="bg-ink block h-px w-[14px]" />
              <span className="bg-ink block h-px w-[14px]" />
            </span>
            {t("menu")}
          </button>
        </Magnetic>
      </div>
    </header>
  );
}
