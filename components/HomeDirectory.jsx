"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { diamondDirectory, PILOT_BATCH_SIZE } from "@/data/diamondDirectory";
import { Icon } from "@/components/icons";

export default function HomeDirectory() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return diamondDirectory;
    return diamondDirectory.filter((d) => {
      return (
        d.id.includes(q) ||
        d.reportNumber?.toLowerCase().includes(q) ||
        d.name?.toLowerCase().includes(q) ||
        d.shape?.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        In production, each diamond carries its own physical NFC tag that
        opens its unique URL directly, with no index page involved. This
        stands in for that tap, scaled to the {PILOT_BATCH_SIZE}-stone pilot
        batch — GIA inscribes and photographs every stone up front, but the
        full experience below is only built out for a handful so far. The
        rest are placeholders until that data arrives.
      </p>

      <div className="relative mt-8">
        <Icon
          name="search"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-faint)]"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or report number"
          className="w-full rounded-full border border-[var(--hairline)] bg-[var(--surface-card)] py-3 pl-11 pr-4 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] focus:border-[var(--hairline-strong)]"
        />
      </div>

      <p className="mt-3 text-xs text-[var(--ink-faint)]">
        {filtered.length} of {PILOT_BATCH_SIZE} stones
      </p>

      <div className="mt-3 flex flex-col gap-2 pb-16">
        {filtered.map((d) =>
          d.available ? (
            <Link
              key={d.id}
              href={`/diamond/${d.id}`}
              className="flex items-center justify-between rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)] px-4 py-3.5 transition-colors hover:border-[var(--hairline-strong)]"
            >
              <span className="min-w-0">
                <span className="block font-[family-name:var(--font-display)] text-lg">
                  {d.name}
                </span>
                <span className="block text-xs text-[var(--ink-faint)]">
                  {d.shape} · {d.carat.toFixed(2)} ct
                </span>
              </span>
              <Icon name="chevronRight" className="h-5 w-5 flex-none text-[var(--ink-faint)]" />
            </Link>
          ) : (
            <div
              key={d.id}
              aria-disabled="true"
              className="flex items-center justify-between rounded-2xl border border-[var(--hairline)]/50 px-4 py-3.5 opacity-50"
            >
              <span className="min-w-0">
                <span className="block text-sm text-[var(--ink-soft)]">Diamond {d.id}</span>
                <span className="block text-xs text-[var(--ink-faint)]">GIA {d.reportNumber}</span>
              </span>
              <span className="flex-none text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                Pending
              </span>
            </div>
          )
        )}

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--ink-faint)]">
            No stones match &ldquo;{query}&rdquo;.
          </p>
        ) : null}
      </div>
    </>
  );
}
