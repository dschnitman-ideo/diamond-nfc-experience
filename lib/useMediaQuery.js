"use client";

import { useEffect, useState } from "react";

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
