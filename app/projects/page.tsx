import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import { projects, type Project } from "../data/work";

const names = new Intl.ListFormat("en", { type: "conjunction" }).format(projects.map((p) => p.name));

export const metadata: Metadata = {
  title: "Projects",
  description: `What Sean Michael has built outside the day job: ${names}.`,
  alternates: { canonical: "/projects" },
};

function Entry({ project: p }: { project: Project }) {
  return (
    <li className="py-8 sm:py-10">
      <article aria-labelledby={`work-${p.id}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2
            id={`work-${p.id}`}
            className="font-display text-2xl font-extrabold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[28px]"
          >
            {p.name}
          </h2>
          <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            {p.range}
          </p>
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-string/80">
          {p.context}
        </p>

        <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-ink">{p.summary}</p>

        <ul className="mt-5 space-y-3">
          {p.points.map((point) => (
            <li
              key={point.slice(0, 24)}
              className="relative max-w-[64ch] pl-5 text-[14px] leading-relaxed text-ink-mute before:absolute before:left-0 before:top-[0.72em] before:h-px before:w-2.5 before:bg-string/60"
            >
              {point}
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Built with">
          {p.tech.map((t) => (
            <li
              key={t}
              className="border border-line px-2 py-1 font-mono text-[10px] tracking-[0.06em] text-ink-faint"
            >
              {t}
            </li>
          ))}
        </ul>

        {p.link && (
          <a
            href={p.link.href}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-string underline decoration-string/30 underline-offset-4 transition-colors hover:decoration-string"
          >
            {p.link.label}
            <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
              <path
                d="M1 8L8 1M8 1H3.5M8 1v4.5"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </a>
        )}
      </article>
    </li>
  );
}

export default function Projects() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-28 sm:px-10">
        <Link
          href="/"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink"
        >
          ← Back to the line
        </Link>

        <h1 className="mt-10 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">
          Projects
        </h1>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-mute">
          Built outside the day job, for myself and for people I know.
        </p>

        <ul className="mt-10 divide-y divide-line border-y border-line">
          {projects.map((p) => (
            <Entry key={p.id} project={p} />
          ))}
        </ul>
      </main>
    </>
  );
}
