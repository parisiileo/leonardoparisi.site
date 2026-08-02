import { ImageResponse } from "next/og";

/**
 * Generated app icon, so there is no binary asset to keep in sync with the
 * palette. Next serves it at /icon and links it automatically.
 */

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 300,
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
