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

/** Tracks window.innerWidth live, for layout math CSS can't do alone. */
export function useViewportWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}
