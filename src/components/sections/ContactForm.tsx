"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import Magnetic from "@/components/ui/Magnetic";
import data from "@/data/data.json";
import { Link } from "@/i18n/navigation";

const KINDS = ["website", "webapp", "ecommerce", "redesign", "other"] as const;
type Kind = (typeof KINDS)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_CLASS =
  "border-line focus:border-ac w-full border-0 border-b bg-transparent px-[2px] py-3 text-ink outline-none transition-colors";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [kind, setKind] = useState<Kind | null>(null);
  const [status, setStatus] = useState<{ text: string; accent: boolean }>({
    text: "",
    accent: false,
  });
  const [sending, setSending] = useState(false);

  const idle = status.text || t("statusIdle");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    const message = String(values.get("message") ?? "").trim();
    const company = String(values.get("company") ?? "").trim();
    const firstName = name.split(" ")[0]?.toUpperCase() ?? "";

    if (!name || !email || !message) {
      setStatus({ text: t("statusInvalid"), accent: true });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus({ text: t("statusEmailInvalid"), accent: true });
      return;
    }

    setSending(true);
    setStatus({ text: t("statusSending"), accent: true });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          company,
          locale,
          kind: kind ? t(`kinds.${kind}`) : "PROJECT",
        }),
      });

      if (response.ok) {
        setStatus({ text: t("statusSent", { name: firstName }), accent: true });
        form.reset();
        setKind(null);
        return;
      }

      // No mail provider wired up yet — hand off to the visitor's mail client
      // rather than dead-ending them.
      const body = await response.json().catch(() => null);
      if (body?.code === "EMAIL_NOT_CONFIGURED") {
        setStatus({
          text: t("statusMailto", { name: firstName }),
          accent: true,
        });
        const subject = encodeURIComponent(
          `New ${(kind ? t(`kinds.${kind}`) : "project").toLowerCase()} enquiry`,
        );
        const mailBody = encodeURIComponent(
          `From: ${name} <${email}>\nType: ${kind ? t(`kinds.${kind}`) : "PROJECT"}\n\n${message}`,
        );
        window.location.href = `mailto:${data.contact.email}?subject=${subject}&body=${mailBody}`;
        return;
      }

      setStatus({ text: t("statusError"), accent: true });
    } catch {
      setStatus({ text: t("statusError"), accent: true });
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border-line relative flex flex-col gap-[clamp(18px,2.4vw,28px)] border-t py-[clamp(28px,5vh,52px)]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <span className="text-ac font-mono text-[11px] tracking-[0.22em]">
          {t("header")}
        </span>
        <span className="text-mut2 font-mono text-[10.5px] tracking-[0.16em]">
          {t("required")}
        </span>
      </div>

      {/* Honeypot: real people never see it, bots fill it in. */}
      <div
        aria-hidden
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap gap-[clamp(18px,2.4vw,28px)]">
        <label className="flex flex-1 basis-[240px] flex-col gap-[9px]">
          <span className="text-mut font-mono text-[10.5px] tracking-[0.2em]">
            {t("nameLabel")}
          </span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            className={`${FIELD_CLASS} text-[clamp(16px,1.6vw,21px)]`}
          />
        </label>

        <label className="flex flex-1 basis-[240px] flex-col gap-[9px]">
          <span className="text-mut font-mono text-[10.5px] tracking-[0.2em]">
            {t("emailLabel")}
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            className={`${FIELD_CLASS} text-[clamp(16px,1.6vw,21px)]`}
          />
        </label>
      </div>

      <fieldset className="flex flex-col gap-3 border-0">
        <legend className="flex text-mut font-mono text-[10.5px] tracking-[0.2em]">
          {t("kindLabel")}
        </legend>
        <div className="flex flex-wrap gap-2 py-3">
          {KINDS.map((option) => {
            const selected = kind === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => setKind(selected ? null : option)}
                className={`cursor-pointer rounded-full border px-[18px] py-[11px] font-mono text-[11.5px] tracking-[0.14em] whitespace-nowrap transition-[background,color,border-color] duration-250 ${
                  selected
                    ? "bg-ac text-ac-t border-ac"
                    : "border-line text-mut hover:text-ink"
                }`}
              >
                {t(`kinds.${option}`)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="flex flex-col gap-[9px]">
        <span className="text-mut font-mono text-[10.5px] tracking-[0.2em]">
          {t("ideaLabel")}
        </span>
        <textarea
          name="message"
          rows={3}
          required
          placeholder={t("ideaPlaceholder")}
          className={`${FIELD_CLASS} resize-y text-[clamp(15px,1.4vw,19px)] leading-[1.5]`}
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-[18px]">
        <Magnetic>
          <button
            type="submit"
            disabled={sending}
            className="bg-ac text-ac-t flex cursor-pointer items-center gap-3 rounded-full border-0 px-7 py-[17px] font-mono text-[12.5px] font-medium tracking-[0.16em] disabled:opacity-60"
          >
            {t("submit")} →
          </button>
        </Magnetic>
        <span
          role="status"
          aria-live="polite"
          className={`font-mono text-[11px] tracking-[0.16em] ${
            status.accent ? "text-ac" : "text-mut2"
          }`}
        >
          {idle}
        </span>
      </div>

      {/* Notice, not a checkbox: the lawful basis here is a pre-contractual
          measure you asked for, so a forced tick-box would be neither
          required nor a valid consent. */}
      <p className="text-mut2 m-0 max-w-[52ch] font-mono text-[10.5px] leading-[1.8] tracking-[0.06em]">
        {t.rich("consent", {
          link: (chunks) => (
            <Link
              href="/privacy"
              className="hover:text-ac underline underline-offset-4 transition-colors"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </form>
  );
}
