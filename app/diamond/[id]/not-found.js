import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--surface)] px-6 text-center text-[var(--ink)]">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">
        Diamond not recognized
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-2xl">
        We couldn&rsquo;t find this stone.
      </h1>
      <p className="max-w-xs text-sm text-[var(--ink-soft)]">
        This tag points at a diamond ID that isn&rsquo;t in this prototype&rsquo;s
        sample set.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full border border-[var(--hairline)] px-4 py-2 text-sm text-[var(--ink)]"
      >
        Back to prototype index
      </Link>
    </div>
  );
}
