import type { MetadataRoute } from "next";

/**
 * Was a static file in public/. Generated here so the colours track the real
 * palette — the old one flashed white on launch and pointed at screenshot
 * sizes that did not match the image being served.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Leonardo Parisi — Front-End Developer, Bolzano",
    short_name: "Leonardo Parisi",
    description:
      "Portfolio of Leonardo Parisi, a front-end developer in Bolzano, Italy, working with React, Next.js and modern web technologies.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    lang: "en",
    dir: "ltr",
    categories: ["technology", "business", "portfolio"],
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        // Full-bleed twin: Android crops "any" icons to its own mask.
        src: "/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
