import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const INK = "#f4f2ee";
const BG = "#0a0a0b";
const ACCENT = "#eddc5c";
const MUTED = "rgba(244,242,238,0.52)";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "FRONT–END";
  const subtitle = searchParams.get("subtitle") || "Developer";
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "imleo.it";

  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            background: BG,
            color: INK,
            padding: "64px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Accent glow, echoing the hero blob */}
          <div
            style={{
              position: "absolute",
              top: "-140px",
              right: "-140px",
              width: "560px",
              height: "560px",
              borderRadius: "50%",
              background: ACCENT,
              opacity: 0.16,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "22px",
              letterSpacing: "4px",
              color: MUTED,
            }}
          >
            <span>LEONARDO PARISI</span>
            <span>PORTFOLIO / 2026</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: "150px",
                fontWeight: 900,
                letterSpacing: "-7px",
                lineHeight: 1,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "104px",
                fontWeight: 400,
                fontStyle: "italic",
                letterSpacing: "-4px",
                lineHeight: 1.05,
                color: ACCENT,
              }}
            >
              {subtitle}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "24px",
              color: MUTED,
              borderTop: "1px solid rgba(244,242,238,0.13)",
              paddingTop: "26px",
            }}
          >
            <span>{domain}</span>
            <span>BASED IN ITALY · AVAILABLE FOR WORK</span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  } catch (error) {
    console.error("[og] falling back to the plain card:", error);
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 96,
            fontWeight: 900,
            background: BG,
            color: INK,
            width: "100%",
            height: "100%",
          }}
        >
          Leonardo Parisi
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }
}
