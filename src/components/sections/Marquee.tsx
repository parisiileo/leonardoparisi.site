/**
 * The list is rendered twice inside a `max-content` row translating 0 → -50%,
 * so the loop closes seamlessly without measuring anything.
 *
 * No `"use client"`: the scroll is a pure CSS keyframe and there is no state,
 * so keeping it on the server leaves its markup out of the hydration tree.
 */
export default function Marquee({
  items,
  separator = "✦",
  variant = "display",
}: {
  items: string[];
  separator?: string;
  variant?: "display" | "italic";
}) {
  const isItalic = variant === "italic";
  const run = [...items, ...items];

  return (
    <div className="border-line bg-bg2 overflow-hidden border-y py-[14px]">
      <div
        aria-hidden
        className={`flex w-max gap-[30px] pr-[30px] uppercase ${
          isItalic
            ? "animate-marquee-slow font-display text-mut text-[clamp(20px,2.6vw,34px)] font-normal tracking-[-0.02em] italic"
            : "animate-marquee font-display gap-[34px] pr-[34px] text-[clamp(20px,2.6vw,34px)] font-extrabold tracking-[-0.02em]"
        }`}
      >
        {run.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-[30px]">
            <span>{item}</span>
            <span className="text-ac not-italic">{separator}</span>
          </span>
        ))}
      </div>
      <span className="sr-only">{items.join(", ")}</span>
    </div>
  );
}
