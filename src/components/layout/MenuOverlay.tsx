"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import Magnetic from "@/components/ui/Magnetic";
import data from "@/data/data.json";
import { useUI } from "./UIProvider";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function MenuOverlay() {
  const t = useTranslations("nav");
  const { menuOpen, setMenuOpen } = useUI();
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restoreRef.current?.focus?.();
    };
  }, [menuOpen, setMenuOpen]);

  return (
    <div
      id="site-menu"
      aria-hidden={!menuOpen}
      aria-modal={menuOpen}
      role="dialog"
      className="bg-bg2 fixed inset-0 z-[120] flex flex-col justify-between p-[clamp(18px,3vw,40px)]"
      style={{
        clipPath: menuOpen ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
        transition: "clip-path .9s cubic-bezier(.76,0,.24,1)",
        pointerEvents: menuOpen ? "auto" : "none",
      }}
    >
      <div className="flex items-start justify-between">
        <span className="text-mut font-mono text-[11px] tracking-[0.24em]">
          {t("label")}
        </span>
        <Magnetic>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
            className="border-line text-ink hover:text-ac cursor-pointer rounded-full border bg-transparent px-4 py-[9px] font-mono text-[11px] tracking-[0.2em] transition-colors"
          >
            {t("close")} ✕
          </button>
        </Magnetic>
      </div>

      <nav className="flex flex-col gap-[clamp(2px,1vw,10px)] py-6">
        <AnimatePresence>
          {menuOpen &&
            data.nav.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.href}
                onClick={() => setTimeout(() => setMenuOpen(false), 120)}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                transition={{
                  duration: 0.8,
                  delay: 0.18 + i * 0.07,
                  ease: EASE_OUT,
                }}
                className="font-display hover:text-ac flex items-baseline gap-[18px] text-[clamp(38px,8.1vw,112px)] leading-[0.94] font-extrabold tracking-[-0.045em] transition-colors"
              >
                <span className="text-ac font-mono text-[12px] font-normal tracking-[0.2em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t(item.id)}
              </motion.a>
            ))}
        </AnimatePresence>
      </nav>

      <div className="border-line text-mut flex flex-wrap items-end justify-between gap-6 border-t pt-5 font-mono text-[12px] tracking-[0.06em]">
        <div className="flex flex-col gap-[5px]">
          <a
            href={`mailto:${data.contact.email}`}
            tabIndex={menuOpen ? 0 : -1}
            className="hover:text-ac transition-colors"
          >
            {data.contact.email}
          </a>
          <span>{data.contact.domain}</span>
        </div>
        <div className="flex flex-wrap gap-5">
          {data.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              tabIndex={menuOpen ? 0 : -1}
              className="hover:text-ac transition-colors"
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
