import { projects, type Project } from "../data/work";

/**
 * What I have built on my own time. Sits after the string and before the end
 * of the line, so a visitor who has walked the whole story lands on the work.
 */

function Entry({ project: p }: { project: Project }) {
  return (
    <li className="py-8 sm:py-10">
      <article aria-labelledby={`work-${p.id}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3
            id={`work-${p.id}`}
            className="font-display text-2xl font-extrabold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[28px]"
          >
            {p.name}
          </h3>
          <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            {p.range}
          </p>
        </div>

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

export default function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-20 border-t border-line px-6 py-24 sm:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <h2
          id="work-title"
          className="font-mono text-[10px] uppercase tracking-[0.28em] text-string/80"
        >
          Selected work &nbsp;·&nbsp; Projects
        </h2>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-mute">
          Two things I built on my own time, end to end. Newest first.
        </p>

        <ul className="mt-10 divide-y divide-line border-y border-line">
          {projects.map((p) => (
            <Entry key={p.id} project={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}
