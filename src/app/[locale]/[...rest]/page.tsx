import { notFound } from "next/navigation";

/**
 * Without this, an unknown URL matches no route at all and Next falls back to
 * its bare built-in 404 — no layout, no translations, no <html lang>. Catching
 * everything left over inside the locale segment lets `not-found.tsx` render
 * with the site chrome and in the right language.
 */
export default function CatchAllPage() {
  notFound();
}
