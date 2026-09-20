/**
 * The crown-view outline GIA prints on a clarity plot for a round
 * brilliant: table octagon, eight bezel kites, eight star triangles,
 * sixteen upper-girdle facets. Drawn from the real facet geometry
 * rather than traced, so it stays true at any size — no inclusion
 * marks yet, since the prototype data doesn't carry a plot per stone.
 */
const R = 96; // girdle
const R_STAR = 68; // where the star apex meets the upper-girdle facets
const R_TABLE = 40;

function pt(radius, degrees) {
  const a = (degrees * Math.PI) / 180;
  return [100 + radius * Math.cos(a), 100 + radius * Math.sin(a)];
}

export default function BrilliantPlot({ className = "" }) {
  // Main directions every 45°; the halves between them carry the star
  // apexes and the girdle valleys.
  const table = Array.from({ length: 8 }, (_, i) => pt(R_TABLE, i * 45));
  const star = Array.from({ length: 8 }, (_, i) => pt(R_STAR, i * 45 + 22.5));
  const girdle = Array.from({ length: 8 }, (_, i) => pt(R, i * 45));
  const valley = Array.from({ length: 8 }, (_, i) => pt(R, i * 45 + 22.5));

  const lines = [];
  for (let i = 0; i < 8; i += 1) {
    const next = (i + 1) % 8;
    const prev = (i + 7) % 8;
    lines.push([table[i], table[next]]); // table octagon
    lines.push([table[i], star[i]]); // star facet sides
    lines.push([table[i], star[prev]]);
    lines.push([star[i], girdle[i]]); // bezel kite shoulders
    lines.push([star[i], girdle[next]]);
    lines.push([star[i], valley[i]]); // upper-girdle split
  }

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="100" cy="100" r={R} />
        {lines.map(([[x1, y1], [x2, y2]], i) => (
          <line
            key={i}
            x1={x1.toFixed(2)}
            y1={y1.toFixed(2)}
            x2={x2.toFixed(2)}
            y2={y2.toFixed(2)}
          />
        ))}
      </g>
    </svg>
  );
}
