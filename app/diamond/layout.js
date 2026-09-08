import LoadingSplash from "@/components/LoadingSplash";

/**
 * Scoped to /diamond/* only — the NFC-tap experience itself — so the
 * splash never covers the prototype index menu at "/", which stands in
 * for the physical tag tap and should stay the very first thing shown.
 */
export default function DiamondLayout({ children }) {
  return (
    <>
      <LoadingSplash />
      {children}
    </>
  );
}
