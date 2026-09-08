"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether a media query currently matches, updating live as the
 * viewport is resized or rotated (e.g. an iPad flipping between
 * portrait and landscape) rather than only reading it once on mount.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
