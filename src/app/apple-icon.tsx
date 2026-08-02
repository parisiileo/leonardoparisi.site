import { ImageResponse } from "next/og";

/** Home-screen icon on iOS. Replaces the /apple-touch-icon.png that 404'd. */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          color: "#d7f24a",
          fontSize: 104,
          fontWeight: 900,
          letterSpacing: "-0.06em",
          fontFamily: "sans-serif",
        }}
      >
        LP
      </div>
    ),
    size,
  );
}
