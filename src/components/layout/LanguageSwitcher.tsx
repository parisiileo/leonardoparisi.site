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
  const listRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Moves real focus between the options: a listbox is expected to answer the
  // arrow keys, and until now it only answered Tab.
  const focusOption = (index: number) => {
    const options = listRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="option"]',
    );
    if (!options?.length) return;
    const wrapped = (index + options.length) % options.length;
    options[wrapped]?.focus();
  };

  // Opening with the keyboard lands on the current language, so the list
  // starts where the user already is.
  useEffect(() => {
    if (!open) return;
    focusOption(routing.locales.indexOf(locale));
  }, [open, locale]);

  const onListKeyDown = (event: React.KeyboardEvent) => {
    const options = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ??
        [],
    );
    const current = options.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusOption(current + (event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusOption(event.key === "Home" ? 0 : options.length - 1);
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

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
    buttonRef.current?.focus();
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next }));
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={t("language")}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((v) => !v);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
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
          ref={listRef}
          role="listbox"
          aria-label={t("language")}
          onKeyDown={onListKeyDown}
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
