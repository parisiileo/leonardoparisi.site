import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SEO_CONFIG } from "@/lib/seo";

/**
 * The share card. It lives here rather than behind /api/og for two reasons:
 * the file convention emits `og:image` + `:width` + `:height` + `:type` and a
 * hashed, cacheable URL, and — unlike an API route — it is pre-rendered at
 * build time, so scrapers with a short timeout (WhatsApp, iMessage, Slack)
 * always get a finished PNG instead of a cold serverless render.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Leonardo Parisi — Front-End Developer in Bolzano, Italy";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const BG = "#0a0a0b";
const INK = "#f4f2ee";
const ACCENT = "#f5ce00";
const MUTED = "rgba(244,242,238,0.54)";

/** Read once per build; a missing file just drops the portrait column. */
function portraitDataUri() {
  try {
    const file = readFileSync(
      join(process.cwd(), "assets", "about_portrait.jpg"),
    );
    return `data:image/jpeg;base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const portrait = portraitDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: BG,
          color: INK,
          fontFamily: "sans-serif",
        }}
      >
        {/* Satori has no blur, so the hero's glow becomes a hard accent rule */}
        <div
          style={{ display: "flex", width: 14, height: "100%", background: ACCENT }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: 64,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 21,
              letterSpacing: 4,
              color: MUTED,
            }}
          >
            <span>LEONARDO PARISI</span>
            <span>{SEO_CONFIG.domain.toUpperCase()}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 116,
                fontWeight: 900,
                letterSpacing: -6,
                lineHeight: 1,
              }}
            >
              {t("ogHeadline")}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 84,
                fontStyle: "italic",
                letterSpacing: -3,
                lineHeight: 1.1,
                color: ACCENT,
              }}
            >
              {t("ogHeadlineItalic")}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              borderTop: "1px solid rgba(244,242,238,0.14)",
              paddingTop: 26,
            }}
          >
            <div style={{ display: "flex", fontSize: 30, color: INK }}>
              {t("ogTagline")}
            </div>
            <div style={{ display: "flex", fontSize: 23, color: MUTED }}>
              React · Next.js · TypeScript
            </div>
          </div>
        </div>

        {portrait ? (
          <div
            style={{
              display: "flex",
              width: 380,
              borderLeft: `1px solid ${ACCENT}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portrait}
              alt=""
              width={380}
              height={630}
              // Grayscale matches the About portrait — and drops the PNG well
              // under the size where WhatsApp starts skipping previews.
              style={{
                width: 380,
                height: 630,
                objectFit: "cover",
                filter: "grayscale(1) contrast(1.05)",
              }}
            />
          </div>
        ) : null}
      </div>
    ),
    size,
  );
}
