import { Archivo, JetBrains_Mono, Space_Grotesk } from "next/font/google";

/**
 * Shared so the not-found page can re-declare the CSS variables: Next renders
 * it inside its own `<html id="__next_error__">` shell, which drops the class
 * list the root layout puts on the real <html>.
 */

export const archivo = Archivo({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

export const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  // Not preloaded on purpose. Four `<link rel=preload as=font>` tags fired at
  // once — ~137KB — all compete with the stylesheet that actually blocks the
  // first paint. Mono only ever sets 10–12px labels and kickers here, never a
  // contentful-paint candidate, so it loads on demand and swaps in from the
  // ui-monospace fallback.
  preload: false,
});

export const fontVars = `${archivo.variable} ${grotesk.variable} ${jetbrains.variable}`;
