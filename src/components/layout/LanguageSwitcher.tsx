"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_LABELS, type Locale, routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickAway = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // next-intl's middleware persists the choice in a NEXT_LOCALE cookie, so the
  // next visit is server-rendered in the right language straight away.
  const select = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next }));
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label={t("language")}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((v) => !v);
        }}
        className="border-line text-ink flex cursor-pointer items-center gap-2 rounded-full border bg-transparent px-[14px] py-[9px] font-mono text-[11px] tracking-[0.2em]"
        style={{ opacity: pending ? 0.5 : 1 }}
      >
        <span className="bg-ac block h-[6px] w-[6px] rounded-full" />
        <span>{locale.toUpperCase()}</span>
        <span className="text-[9px] opacity-50">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="border-line bg-surf absolute top-[calc(100%+9px)] right-0 z-10 flex min-w-[154px] flex-col overflow-hidden rounded-[9px] border shadow-[0_18px_40px_rgba(0,0,0,.5)]"
        >
          {routing.locales.map((code) => {
            const isActive = code === locale;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => select(code)}
                className={`border-line2 hover:text-ink cursor-pointer border-b px-[15px] py-[13px] text-left font-mono text-[11px] tracking-[0.16em] transition-colors last:border-b-0 ${
                  isActive
                    ? "text-ac"
                    : "text-mut hover:bg-[rgba(244,242,238,.05)]"
                }`}
                style={
                  isActive
                    ? {
                        background:
                          "color-mix(in oklab, var(--ac) 16%, transparent)",
                      }
                    : undefined
                }
              >
                {LOCALE_LABELS[code]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
