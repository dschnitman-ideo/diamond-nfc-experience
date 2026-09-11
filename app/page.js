import DiamondMark from "@/components/DiamondMark";
import HomeDirectory from "@/components/HomeDirectory";

export const metadata = {
  title: "Diamond Experience: Pilot Batch",
};

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-16 text-[var(--ink)]">
      <DiamondMark className="h-10 text-[var(--ink)]" />
      <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-[var(--brass)]">
        Prototype · Pilot batch
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl leading-tight">
        NFC Diamond Experience
      </h1>
      <HomeDirectory />
    </main>
  );
}
