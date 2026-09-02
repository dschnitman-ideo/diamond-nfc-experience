/**
 * The faceted-diamond brand mark, recolored for the dark stage — the
 * source file is a dark mark on a white ground; here it's a single
 * `currentColor` shape (light ink) with no background, so it drops
 * straight into the recognition overlay.
 */
export default function DiamondMark({ className = "" }) {
  return (
    <svg viewBox="0 0 370 320" fill="none" className={className} aria-hidden="true">
      <g fill="currentColor">
        <path d="M276.898 117.795L276.968 117.868L184.692 235.756L92.3461 117.868L92.4162 117.795L0 74.2085V232.539L184.692 319.639L369.315 232.539V74.2085L276.898 117.795Z" />
        <path d="M276.896 117.815L184.69 0L92.4141 117.815L184.69 161.329L276.896 117.815Z" />
      </g>
    </svg>
  );
}
