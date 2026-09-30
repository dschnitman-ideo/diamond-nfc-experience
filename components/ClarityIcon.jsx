/**
 * GIA clarity plotting symbols, redrawn as tiny inline SVGs for the
 * 4Cs board's characteristic pills. Follows GIA's own convention —
 * internal characteristics in red, external in green, a few symbols
 * (Cavity, Knot, Laser Drill-hole…) using both — in muted tones rather
 * than GIA's pure red and green. The one deliberate exception to the
 * brand palette: these are GIA's own notation, not brand colour.
 */

const RED = "#b0402f";
const GREEN = "#3f7a52";

const line = { fill: "none", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };

// Each entry draws into a 16×16 box. `r` / `g` are the two stroke
// colors so two-tone symbols can mix them.
const SYMBOLS = {
  // Internal
  Bruise: () => <path d="M5 5l6 6M11 5l-6 6" stroke={RED} {...line} />,
  Cavity: () => (
    <>
      <ellipse cx="8" cy="8" rx="6" ry="4" stroke={GREEN} {...line} />
      <path d="M4.5 9.8L6.8 5.2M7.2 11.2L10 5.1M10.2 10.8L12 7.2" stroke={RED} {...line} strokeWidth={1.1} />
    </>
  ),
  Chip: () => <path d="M4.5 10.5L8 6l3.5 4.5" stroke={RED} {...line} />,
  Cleavage: () => <path d="M5 12l3.5-8M8.5 12L12 4" stroke={RED} {...line} />,
  Cloud: () => <ellipse cx="8" cy="8" rx="6" ry="4" stroke={RED} {...line} strokeDasharray="0.1 2.4" strokeWidth={1.6} />,
  Crystal: () => (
    <path d="M3.5 8.5C3.5 5.5 5.5 4 8.5 4s4 2 3.8 4.5S10.5 12 7.8 12 3.5 11 3.5 8.5z" stroke={RED} {...line} />
  ),
  Feather: () => <path d="M3 11.5c3 0 3.5-7 8-7 1 0 1.5.3 2 .5" stroke={RED} {...line} />,
  "Grain Center": () => <path d="M2.5 8h11M6 5.5l4 5M10 5.5l-4 5" stroke={RED} {...line} />,
  "Indented Natural": () => (
    <>
      <path d="M3 9.5L8 4.5l5 5" stroke={RED} {...line} />
      <path d="M3 12.5L8 7.5l5 5" stroke={GREEN} {...line} />
    </>
  ),
  "Internal Graining": () => (
    <path d="M2 12c3-1 5-3 7-4s3-1.5 5-3" stroke={RED} {...line} strokeDasharray="2 1.6" />
  ),
  Knot: () => (
    <>
      <ellipse cx="8" cy="8" rx="6.2" ry="4.2" stroke={GREEN} {...line} />
      <ellipse cx="8" cy="8" rx="3.6" ry="1.9" stroke={RED} {...line} />
    </>
  ),
  "Laser Drill-hole": () => (
    <>
      <circle cx="8" cy="8" r="4.5" stroke={GREEN} {...line} />
      <circle cx="8" cy="8" r="1.7" fill={RED} />
    </>
  ),
  Needle: () => <path d="M6 12.5l4-9" stroke={RED} {...line} />,
  Pinpoint: () => <circle cx="8" cy="8" r="1.5" fill={RED} />,
  "Twinning Wisp": () => (
    <path d="M2 7c2.5-1.5 4 0 6 2s3.5 3 6 1.5M3.5 4.5v4M1.5 6.5h4M12.5 9v4M10.5 11h4" stroke={RED} {...line} strokeWidth={1.2} />
  ),
  "Etch Channel": () => (
    <>
      <rect x="2.5" y="2.5" width="11" height="11" stroke={RED} {...line} />
      <rect x="5.5" y="5.5" width="5" height="5" stroke={GREEN} {...line} />
    </>
  ),

  // External
  Abrasion: () => (
    <path d="M2 9.5h12M3 7.5v3M5 7.3v3M7 7.2v3M9 7.2v3M11 7.3v3M13 7.5v3" stroke={GREEN} {...line} strokeWidth={1} />
  ),
  Natural: () => <path d="M3 11L8 5l5 6" stroke={GREEN} {...line} />,
  Nick: () => <path d="M6 6.5L8 10l2-3.5" stroke={GREEN} {...line} />,
  Pit: () => <circle cx="8" cy="8" r="1.2" fill={GREEN} />,
  "Polish Lines": () => <path d="M3 12l3-8M5.5 12l3-8M8 12l3-8M10.5 12l3-8" stroke={GREEN} {...line} strokeWidth={1.1} />,
  "Burn Mark": () => (
    <path d="M2.5 10.5c0-3 3-3 3 0M5.5 10.5c0-3.5 3-3.5 3 0M8.5 10.5c0-3 3-3 3 0 0 1 1 1.5 2 1" stroke={GREEN} {...line} strokeWidth={1.2} />
  ),
  Scratch: () => <path d="M3 10.5c3 0 3.5-4 6.5-4 1.5 0 2.5.5 3.5 1" stroke={GREEN} {...line} />,
  "Surface Graining": () => <path d="M2 11c3-1 5-2.5 7-3.5s3-1.5 5-2.5" stroke={GREEN} {...line} strokeDasharray="2 1.6" />,
  "Extra Facet": () => <path d="M5 13L8 3l3 10" stroke={GREEN} {...line} />,
};

// GIA reports vary in wording ("Abrasions", "Laser Drill Hole").
const ALIASES = {
  Abrasions: "Abrasion",
  "Laser Drill Hole": "Laser Drill-hole",
  "Laser drill hole": "Laser Drill-hole",
  "Grain Centre": "Grain Center",
};

export default function ClarityIcon({ name, className = "" }) {
  const Symbol = SYMBOLS[name] ?? SYMBOLS[ALIASES[name]];
  if (!Symbol) return null;
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <Symbol />
    </svg>
  );
}
