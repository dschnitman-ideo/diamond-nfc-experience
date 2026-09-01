"use client";

/**
 * Hand-authored faceted-diamond illustration, standing in for real
 * product photography in this prototype. Shape-specific facet
 * geometry, a shared glassy gradient treatment, and a `tilt` prop
 * (driven by drag in DiamondStage) that shifts the specular highlight
 * the way light would move across a real stone as it's turned.
 */

const TINTS = {
  colorless: { core: "#ffffff", mid: "#e7e2d8", edge: "#8f8a80" },
  warm: { core: "#fff6df", mid: "#e9d9ad", edge: "#8f8265" },
};

function Defs({ id, tint }) {
  const t = TINTS[tint] ?? TINTS.colorless;
  return (
    <defs>
      <radialGradient id={`${id}-body`} cx="42%" cy="34%" r="75%">
        <stop offset="0%" stopColor={t.core} stopOpacity="0.95" />
        <stop offset="45%" stopColor={t.mid} stopOpacity="0.55" />
        <stop offset="100%" stopColor={t.edge} stopOpacity="0.28" />
      </radialGradient>
      <linearGradient id={`${id}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c9a35d" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#c9a35d" stopOpacity="0.12" />
      </linearGradient>
      <filter id={`${id}-shadow`} x="-40%" y="-40%" width="180%" height="200%">
        <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#000000" floodOpacity="0.55" />
      </filter>
    </defs>
  );
}

function Facets({ paths, opacity = 0.5 }) {
  return (
    <g fill="#ffffff" fillOpacity={opacity} stroke="#000000" strokeOpacity="0.18" strokeWidth="0.6">
      {paths.map((d, i) => (
        <path key={i} d={d} fillOpacity={0.12 + (i % 3) * 0.09} />
      ))}
    </g>
  );
}

function RoundBrilliant({ id }) {
  return (
    <>
      <path
        d="M150 26 L206 62 L266 96 L226 150 L266 204 L206 238 L150 274 L94 238 L34 204 L74 150 L34 96 L94 62 Z"
        fill={`url(#${id}-body)`}
        stroke={`url(#${id}-rim)`}
        strokeWidth="1.5"
        filter={`url(#${id}-shadow)`}
      />
      <Facets
        paths={[
          "M150 26 L206 62 L150 108 Z",
          "M206 62 L266 96 L150 108 Z",
          "M266 96 L226 150 L150 108 Z",
          "M226 150 L266 204 L150 108 L150 150 Z",
          "M266 204 L206 238 L150 150 Z",
          "M206 238 L150 274 L150 150 Z",
          "M150 274 L94 238 L150 150 Z",
          "M94 238 L34 204 L150 150 Z",
          "M34 204 L74 150 L150 150 Z",
          "M74 150 L34 96 L150 108 L150 150 Z",
          "M34 96 L94 62 L150 108 Z",
          "M94 62 L150 26 L150 108 Z",
        ]}
      />
      <polygon points="150,108 226,150 150,192 74,150" fill="#ffffff" fillOpacity="0.22" />
    </>
  );
}

function Oval({ id }) {
  return (
    <>
      <path
        d="M150 20 C210 20 246 96 246 150 C246 204 210 280 150 280 C90 280 54 204 54 150 C54 96 90 20 150 20 Z"
        fill={`url(#${id}-body)`}
        stroke={`url(#${id}-rim)`}
        strokeWidth="1.5"
        filter={`url(#${id}-shadow)`}
      />
      <Facets
        paths={[
          "M150 20 C190 20 216 70 226 108 L150 128 Z",
          "M226 108 C238 128 246 140 246 150 L150 150 L150 128 Z",
          "M246 150 C246 162 238 176 226 196 L150 172 L150 150 Z",
          "M226 196 C216 232 190 280 150 280 L150 172 Z",
          "M150 280 C110 280 84 232 74 196 L150 172 Z",
          "M74 196 C62 176 54 162 54 150 L150 150 L150 172 Z",
          "M54 150 C54 140 62 128 74 108 L150 128 L150 150 Z",
          "M74 108 C84 70 110 20 150 20 L150 128 Z",
        ]}
      />
      <ellipse cx="150" cy="150" rx="52" ry="70" fill="#ffffff" fillOpacity="0.2" />
    </>
  );
}

function EmeraldCut({ id }) {
  return (
    <>
      <path
        d="M84 34 L216 34 L266 84 L266 216 L216 266 L84 266 L34 216 L34 84 Z"
        fill={`url(#${id}-body)`}
        stroke={`url(#${id}-rim)`}
        strokeWidth="1.5"
        filter={`url(#${id}-shadow)`}
      />
      <g fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1.4">
        <rect x="70" y="70" width="160" height="160" />
        <rect x="100" y="100" width="100" height="100" />
      </g>
      <Facets
        paths={[
          "M84 34 L216 34 L200 70 L100 70 Z",
          "M216 34 L266 84 L230 100 L200 70 Z",
          "M266 84 L266 216 L230 200 L230 100 Z",
          "M266 216 L216 266 L200 230 L230 200 Z",
          "M216 266 L84 266 L100 230 L200 230 Z",
          "M84 266 L34 216 L70 200 L100 230 Z",
          "M34 216 L34 84 L70 100 L70 200 Z",
          "M34 84 L84 34 L100 70 L70 100 Z",
        ]}
      />
      <rect x="100" y="100" width="100" height="100" fill="#ffffff" fillOpacity="0.18" />
    </>
  );
}

function Cushion({ id }) {
  return (
    <>
      <path
        d="M150 30 C210 30 224 44 250 74 C270 100 270 118 270 150 C270 182 270 200 250 226 C224 256 210 270 150 270 C90 270 76 256 50 226 C30 200 30 182 30 150 C30 118 30 100 50 74 C76 44 90 30 150 30 Z"
        fill={`url(#${id}-body)`}
        stroke={`url(#${id}-rim)`}
        strokeWidth="1.5"
        filter={`url(#${id}-shadow)`}
      />
      <Facets
        paths={[
          "M150 30 C190 30 208 42 224 62 L150 110 Z",
          "M224 62 C246 90 250 108 250 128 L150 110 Z",
          "M250 128 C250 140 250 160 250 172 L150 150 L150 110 Z",
          "M250 172 C250 192 246 210 224 238 L150 150 Z",
          "M224 238 C208 258 190 270 150 270 L150 150 Z",
          "M150 270 C110 270 92 258 76 238 L150 150 Z",
          "M76 238 C54 210 50 192 50 172 L150 150 Z",
          "M50 172 C50 160 50 140 50 128 L150 150 L150 110 Z",
          "M50 128 C50 108 54 90 76 62 L150 110 Z",
          "M76 62 C92 42 110 30 150 30 L150 110 Z",
        ]}
      />
      <rect x="112" y="112" width="76" height="76" rx="14" fill="#ffffff" fillOpacity="0.2" />
    </>
  );
}

const SHAPE_RENDERERS = {
  "Round Brilliant": RoundBrilliant,
  Oval: Oval,
  "Emerald Cut": EmeraldCut,
  Cushion: Cushion,
};

export default function DiamondArt({
  shape,
  tint = "colorless",
  tilt = 0,
  instant = false,
  className = "",
}) {
  const id = `gem-${shape.replace(/\s+/g, "-").toLowerCase()}`;
  const Renderer = SHAPE_RENDERERS[shape] ?? RoundBrilliant;

  return (
    <div
      className={className}
      style={{
        transform: `perspective(900px) rotateY(${tilt}deg)`,
        transition: instant ? "none" : "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform",
      }}
    >
      <svg viewBox="0 0 300 300" className="h-full w-full" aria-hidden="true">
        <Defs id={id} tint={tint} />
        <Renderer id={id} />
      </svg>
    </div>
  );
}
