/**
 * Artwork for the process cards.
 *
 * One scene per step, drawn from static geometry so server and client
 * always agree. Nothing animates on its own: every moving part carries an
 * `art-*` class whose motion is defined in global.css and triggered by
 * `.step-card:hover`, so a single pointer over the card wakes the whole
 * scene at once. Colour comes from `currentColor` and `--ac`; the caller
 * only decides size and opacity.
 */

const LINE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ACCENT = { ...LINE, stroke: "var(--ac)" } as const;

/** Equalizer bars inside the listening bubble: heights are fixed, the
 *  animation scales them from the baseline. */
const EQ_BARS = [
  { x: 84, h: 34 },
  { x: 106, h: 58 },
  { x: 128, h: 26 },
  { x: 150, h: 70 },
  { x: 172, h: 44 },
  { x: 194, h: 62 },
  { x: 216, h: 30 },
];

/** Code rows: width in user units, indent level. */
const CODE_ROWS = [
  { w: 150, indent: 0 },
  { w: 96, indent: 22 },
  { w: 128, indent: 22 },
  { w: 74, indent: 44 },
  { w: 112, indent: 22 },
  { w: 162, indent: 0 },
];

/** Shared by the drawn trajectory and the dot that flies along it. */
const TRAJECTORY = "M78 322 C 158 320, 244 262, 322 96";

const SCENES = {
  // Brief — one bubble listening, one answering.
  brief: (
    <>
      <g {...LINE}>
        <rect x={36} y={78} width={228} height={140} rx={20} opacity={0.75} />
        <path d="M74 218 L74 252 L108 218" opacity={0.75} />
      </g>

      <g fill="currentColor">
        {EQ_BARS.map((bar, i) => (
          <rect
            key={bar.x}
            className="art-bar"
            style={{ "--i": i } as React.CSSProperties}
            x={bar.x}
            y={172 - bar.h}
            width={8}
            height={bar.h}
            rx={4}
            opacity={0.85}
          />
        ))}
      </g>

      <rect
        {...ACCENT}
        className="art-draw"
        pathLength={100}
        x={158}
        y={224}
        width={208}
        height={116}
        rx={20}
      />
      <g fill="var(--ac)">
        {[212, 254, 296].map((cx, i) => (
          <circle
            key={cx}
            className="art-dot"
            style={{ "--i": i } as React.CSSProperties}
            cx={cx}
            cy={282}
            r={8}
            opacity={0.25}
          />
        ))}
      </g>

      <g {...LINE} opacity={0.3} strokeDasharray="8 12">
        <path d="M26 40 H374" />
        <path d="M26 366 H374" />
      </g>
    </>
  ),

  // Design — a wireframe assembling itself, with layout guides.
  design: (
    <>
      <rect {...LINE} x={44} y={44} width={312} height={312} rx={8} />
      <path {...LINE} d="M44 100 H356" opacity={0.7} />
      <g {...LINE} opacity={0.5}>
        <path d="M292 66 H336" />
        <path d="M292 82 H336" />
      </g>

      <g className="art-rise" style={{ "--i": 0 } as React.CSSProperties}>
        <rect {...LINE} x={72} y={128} width={132} height={96} rx={5} />
        <rect
          x={72}
          y={128}
          width={132}
          height={96}
          rx={5}
          fill="var(--ac)"
          opacity={0.14}
        />
      </g>

      <g {...LINE} opacity={0.65}>
        {[140, 168, 196].map((y, i) => (
          <path
            key={y}
            className="art-rise"
            style={{ "--i": i + 1 } as React.CSSProperties}
            d={`M228 ${y} h${[100, 76, 100][i]}`}
          />
        ))}
      </g>

      <g {...LINE}>
        {[72, 168, 264].map((x, i) => (
          <rect
            key={x}
            className="art-rise"
            style={{ "--i": i + 2 } as React.CSSProperties}
            x={x}
            y={252}
            width={x === 264 ? 64 : 80}
            height={72}
            rx={5}
            opacity={0.6}
          />
        ))}
      </g>

      {/* Measurement guides: the part that only shows up on inspection. */}
      <g {...ACCENT} className="art-fade" opacity={0.9}>
        <path d="M72 116 H204" strokeDasharray="5 7" />
        <path d="M72 110 V122" />
        <path d="M204 110 V122" />
        <path d="M60 128 V224" strokeDasharray="5 7" />
        <path d="M54 128 H66" />
        <path d="M54 224 H66" />
      </g>
      <g
        className="art-fade"
        style={{ "--i": 2 } as React.CSSProperties}
        fill="var(--ac)"
      >
        {[
          [72, 128],
          [204, 128],
          [72, 224],
          [204, 224],
        ].map(([cx, cy]) => (
          <rect
            key={`${cx}-${cy}`}
            x={cx - 4}
            y={cy - 4}
            width={8}
            height={8}
          />
        ))}
      </g>
    </>
  ),

  // Build — brackets opening around code that types itself in.
  build: (
    <>
      <g {...LINE} strokeWidth={3} opacity={0.8}>
        <path className="art-spread art-spread-l" d="M96 110 L48 200 L96 290" />
        <path
          className="art-spread art-spread-r"
          d="M304 110 L352 200 L304 290"
        />
      </g>

      <g {...LINE}>
        {CODE_ROWS.map((row, i) => (
          <path
            key={`${row.w}-${i}`}
            className="art-type"
            style={{ "--i": i } as React.CSSProperties}
            d={`M${124 + row.indent} ${124 + i * 30} h${row.w}`}
            opacity={i % 3 === 0 ? 0.85 : 0.5}
          />
        ))}
      </g>

      <g {...ACCENT}>
        <path
          className="art-type"
          style={{ "--i": 6 } as React.CSSProperties}
          d="M124 304 h30"
        />
      </g>
      <rect
        className="art-dot"
        style={{ "--i": 0 } as React.CSSProperties}
        x={164}
        y={292}
        width={4}
        height={24}
        fill="var(--ac)"
      />
    </>
  ),

  // Launch — the trajectory draws itself and something rides it.
  launch: (
    <>
      <g stroke="var(--ac)" fill="none" strokeWidth={2}>
        {[34, 58, 82].map((r, i) => (
          <circle
            key={r}
            className="art-pulse"
            style={{ "--i": i } as React.CSSProperties}
            cx={78}
            cy={322}
            r={r}
          />
        ))}
      </g>
      <g {...LINE} opacity={0.35}>
        {[34, 58, 82].map((r) => (
          <circle key={r} cx={78} cy={322} r={r} />
        ))}
      </g>

      <path
        {...ACCENT}
        className="art-draw"
        pathLength={100}
        strokeWidth={3}
        d={TRAJECTORY}
      />
      <path
        {...ACCENT}
        className="art-draw"
        style={{ "--i": 8 } as React.CSSProperties}
        pathLength={100}
        strokeWidth={3}
        d="M296 104 L322 90 L330 120"
      />

      <circle
        className="art-travel"
        style={{ offsetPath: `path("${TRAJECTORY}")` } as React.CSSProperties}
        r={9}
        fill="var(--ac)"
      />

      <g {...LINE} opacity={0.3} strokeDasharray="6 14">
        <path d="M40 356 H360" />
        {[
          [138, 300],
          [232, 224],
          [326, 132],
        ].map(([x, y], i) => (
          <path
            key={x}
            className="art-rise"
            style={{ "--i": i } as React.CSSProperties}
            d={`M${x} 356 V${y}`}
          />
        ))}
      </g>
    </>
  ),
} as const;

export type ProcessArtName = keyof typeof SCENES;

export default function ProcessArt({
  name,
  className = "",
}: {
  name: ProcessArtName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid meet"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g className="art-parallax">{SCENES[name]}</g>
    </svg>
  );
}
