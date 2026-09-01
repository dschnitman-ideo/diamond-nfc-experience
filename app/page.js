import Link from "next/link";
import { diamonds } from "@/data/diamonds";
import { Icon } from "@/components/icons";

export const metadata = {
  title: "Diamond Experience: Prototype Index",
};

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16 text-[var(--ink)]">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brass)]">
        Prototype
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl leading-tight">
        NFC Diamond Experience
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        In production, each diamond carries its own physical NFC tag that
        opens its unique URL directly, with no index page involved. This
        screen stands in for that tap. Pick a sample stone below to simulate
        scanning its tag.
      </p>

      <div className="mt-8 flex flex-col gap-2.5">
        {diamonds.map((d) => (
          <Link
            key={d.id}
            href={`/diamond/${d.id}`}
            className="flex items-center justify-between rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)] px-4 py-3.5 transition-colors hover:border-[var(--hairline-strong)]"
          >
            <span>
              <span className="block font-[family-name:var(--font-display)] text-lg">
                {d.name}
              </span>
              <span className="block text-xs text-[var(--ink-faint)]">
                {d.shape} · {d.carat.toFixed(2)} ct
              </span>
            </span>
            <Icon name="chevronRight" className="h-4 w-4 flex-none text-[var(--ink-faint)]" />
          </Link>
        ))}
      </div>
    </main>
  );
}
