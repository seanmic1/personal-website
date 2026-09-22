import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-32">
      <h1 className="font-display text-2xl font-extrabold text-ink">That post isn&apos;t here.</h1>
      <Link
        href="/blog"
        className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-string underline underline-offset-4"
      >
        ← All writing
      </Link>
    </main>
  );
}
