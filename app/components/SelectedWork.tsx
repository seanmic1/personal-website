import { delivery, onCall, type Engagement } from "../data/work";

/**
 * The evidence under the Intro's one-line claim: who the work was actually for.
 * Sits between the Intro and the string, so a visitor meets it on their first
 * scroll and the story follows.
 */

const label = "font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint";

function Group({ title, items }: { title: string; items: Engagement[] }) {
  return (
    <div>
      <h3 className={label}>{title}</h3>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {items.map((e) => (
          <li key={`${e.client}-${e.system}`} className="py-4">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[15px] text-ink">{e.client}</p>
              <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                {e.country}
              </p>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-mute">
              {e.system} &nbsp;·&nbsp; {e.role}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-20 px-6 pb-28 pt-8 sm:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <h2
          id="work-title"
          className="font-mono text-[10px] uppercase tracking-[0.28em] text-string/80"
        >
          Selected work &nbsp;·&nbsp; JurisTech
        </h2>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-mute">
          Loan management software for banks and finance companies, and first response on
          production incidents as one of JurisTech&rsquo;s on-call engineers.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-12">
          <Group title="Built and maintained" items={delivery} />
          <Group title="On call" items={onCall} />
        </div>

        <a
          href="#early"
          className="mt-14 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink"
        >
          Then the whole story, 2001 to now ↓
        </a>
      </div>
    </section>
  );
}
