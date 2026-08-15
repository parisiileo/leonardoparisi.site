/**
 * Section registry.
 *
 * `hue` feeds `--ac-hue` on :root as each section crosses the viewport middle.
 * Lightness/chroma are fixed in global.css, so contrast stays constant while
 * the accent shifts. `id` doubles as the messages key under `sections.*`.
 */
export const SECTIONS = [
  { id: "hero", hue: 95 },
  { id: "work", hue: 155 },
  { id: "process", hue: 25 },
  { id: "about", hue: 300 },
  { id: "stack", hue: 235 },
  { id: "testimonials", hue: 155 },
  { id: "contact", hue: 95 },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const SECTION_HUES = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s.hue]),
) as Record<SectionId, number>;
