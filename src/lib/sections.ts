import data from "@/data/data.json";

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

/**
 * The running number shown next to each section name. Derived rather than
 * written into the messages files, so gating a section (testimonials waits on
 * real quotes) renumbers the rest instead of leaving a hole.
 */
export const SECTION_NUMBERS = Object.fromEntries(
  SECTIONS.filter(
    (s) => s.id !== "testimonials" || data.testimonials.enabled,
  ).map((s, index) => [s.id, String(index + 1).padStart(2, "0")]),
) as Partial<Record<SectionId, string>>;
