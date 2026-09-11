import DiamondMark from "./DiamondMark";

/**
 * Consumer-facing explainer for the laser inscription and its trust
 * symbol. Plain language rather than the old Tracr tab's blockchain
 * jargon and chain-of-custody timeline — this sheet is one continuous
 * scroll now, not a place to spelunk provenance data.
 */
export default function InscriptionInfo() {
  return (
    <div>
      <p className="font-[family-name:var(--font-display)] text-2xl leading-snug text-[var(--ink)]">
        Each is inscribed with a unique symbol and serial number that proves
        its authenticity and uniqueness.
      </p>

      <div className="mt-5 flex items-start gap-3.5 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)] px-4 py-3.5">
        <DiamondMark className="mt-0.5 h-6 w-6 flex-none text-[var(--ink)]" />
        <p className="text-[13px] leading-relaxed text-[var(--ink-soft)]">
          This symbol means a diamond has been authenticated as natural,
          formed in the earth&rsquo;s mantle, is a one-of-one, ancient, and
          holds value.
        </p>
      </div>
    </div>
  );
}
