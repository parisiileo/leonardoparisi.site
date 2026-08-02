import type { MetadataRoute } from "next";

/**
 * Was a static file in public/. Generated here so the colours track the real
 * palette — the old one flashed white on launch and pointed at screenshot
 * sizes that did not match the image being served.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Leonardo Parisi — Frontend Developer",
    short_name: "Leonardo Parisi",
    description:
      "Portfolio of Leonardo Parisi, a frontend developer working with React, Next.js and modern web technologies.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    categories: ["technology", "business"],
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
