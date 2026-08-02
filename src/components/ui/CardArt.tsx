/**
 * Generated line-art plates used behind cards.
 *
 * Everything is drawn from static geometry — no randomness, so server and
 * client always render the same path data. Strokes use `currentColor`, so the
 * caller decides colour and opacity — here, a barely-there wash behind the
 * work cards.
 */

const round = (n: number) => Math.round(n * 10) / 10;

const LINE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// A barrel of stacked print layers, widest in the middle.
const PRINT_LAYERS = Array.from({ length: 14 }, (_, i) => ({
  y: 56 + i * 22,
  half: round(52 + 62 * Math.sin(((i + 1) / 15) * Math.PI)),
}));

// Tick marks around a plate rim.
const RIM_TICKS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2;
  return {
    x1: round(200 + Math.cos(angle) * 146),
    y1: round(200 + Math.sin(angle) * 146),
    x2: round(200 + Math.cos(angle) * 164),
    y2: round(200 + Math.sin(angle) * 164),
  };
});

const ART = {
  // IT support / infrastructure — a machine graph.
  network: (
    <>
      <g {...LINE} opacity={0.9}>
        <path d="M64 306 L146 186 L252 244 L332 122" />
        <path d="M146 186 L204 78 L332 122" />
        <path d="M64 306 L252 244 L318 330" />
      </g>
      <g fill="currentColor">
        {[
          [64, 306],
          [146, 186],
          [252, 244],
          [332, 122],
          [204, 78],
          [318, 330],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={6} />
        ))}
      </g>
      <circle {...LINE} cx={146} cy={186} r={19} opacity={0.7} />
      <circle {...LINE} cx={146} cy={186} r={30} opacity={0.35} />
      <rect
        {...LINE}
        x={26}
        y={26}
        width={348}
        height={348}
        rx={6}
        strokeDasharray="10 12"
        opacity={0.4}
      />
    </>
  ),

  // Storefront — a product grid under an awning.
  storefront: (
    <>
      <g {...LINE}>
        <path d="M32 62 H368" />
        {[32, 88, 144, 200, 256, 312, 368].map((x) => (
          <path key={x} d={`M${x} 62 V42`} opacity={0.5} />
        ))}
      </g>
      <g {...LINE}>
        {[0, 1, 2].flatMap((col) =>
          [0, 1, 2].map((row) => (
            <rect
              key={`${col}-${row}`}
              x={44 + col * 110}
              y={100 + row * 100}
              width={92}
              height={82}
              rx={5}
              opacity={col === 1 && row === 1 ? 1 : 0.55}
            />
          )),
        )}
      </g>
      <rect
        x={154}
        y={200}
        width={92}
        height={82}
        rx={5}
        fill="currentColor"
        opacity={0.13}
      />
    </>
  ),

  // 3D printing — contour layers plus a wireframe box.
  layers: (
    <>
      <g {...LINE}>
        {PRINT_LAYERS.map((row) => (
          <path
            key={row.y}
            d={`M${200 - row.half} ${row.y} H${200 + row.half}`}
            opacity={0.32 + (row.half - 52) / 160}
          />
        ))}
      </g>
      <ellipse {...LINE} cx={200} cy={56} rx={65} ry={15} opacity={0.8} />
      <g {...LINE} opacity={0.55}>
        <path d="M262 300 L322 268 L322 196 L262 228 Z" />
        <path d="M262 300 L262 228 L202 196" opacity={0.5} />
      </g>
    </>
  ),

  // Restaurant — a plate, its rim and the table setting.
  dining: (
    <>
      <g {...LINE}>
        <circle cx={200} cy={200} r={132} opacity={0.75} />
        <circle cx={200} cy={200} r={100} opacity={0.5} />
        <circle cx={200} cy={200} r={58} opacity={0.9} />
      </g>
      <g {...LINE} opacity={0.4}>
        {RIM_TICKS.map((t) => (
          <path key={`${t.x1}-${t.y1}`} d={`M${t.x1} ${t.y1} L${t.x2} ${t.y2}`} />
        ))}
      </g>
      <g {...LINE} opacity={0.6}>
        <path d="M44 96 V304" />
        <path d="M356 96 V304" />
        <path d="M356 96 q-22 34 0 58" />
      </g>
    </>
  ),

} as const;

export type CardArtName = keyof typeof ART;

export default function CardArt({
  name,
  className = "",
}: {
  name: CardArtName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      {ART[name]}
    </svg>
  );
}
