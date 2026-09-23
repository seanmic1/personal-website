import { channels, EMAIL, isExternal } from "../data/contact";

/**
 * The first screen, and the answer to the only question a visitor arrives with:
 * who is this, and what do they do.
 *
 * The string is the story; this is the summary a recruiter reads before
 * deciding whether the story is worth their time. Everything here is also said
 * somewhere on the line, so the two should be edited together.
 */

/** Email gets the button; everything else is a quieter link beside it. */
const elsewhere = channels.filter((c) => c.label !== "Email");

export default function Intro() {
  return (
    <section
      aria-labelledby="intro-name"
      className="relative flex min-h-[100svh] flex-col justify-center px-6 pb-24 pt-24 sm:px-10 sm:pt-28"
    >
      <div className="mx-auto w-full max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-string/80">
          Backend engineer &nbsp;·&nbsp; Kuala Lumpur
        </p>

        <h1
          id="intro-name"
          className="mt-5 font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] text-ink sm:text-7xl"
        >
          Sean Michael
        </h1>

        <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-ink-mute sm:mt-7 sm:text-lg">
          Currently designing and building access control systems as a Backend Engineer at
          Qashier. Previously worked with high profile banks and financial institutions across
          Malaysia and Indonesia developing loan management software.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-12">
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-sm border border-string/50 bg-string/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-string transition-colors hover:bg-string/20"
          >
            Email me
          </a>
          {elsewhere.map((c) => (
            <a
              key={c.label}
              href={c.href}
              {...(isExternal(c.href) ? { target: "_blank", rel: "me noreferrer" } : {})}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink-faint"
            >
              {c.label} ↗
            </a>
          ))}
          {/* Scrolls the string to the first node of Act III without opening a
              card — see the chapter branch of fromHash in Timeline. */}
          <a
            href="#career"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-string underline decoration-string/30 underline-offset-4 transition-colors hover:decoration-string"
          >
            Jump to career →
          </a>
        </div>
      </div>

      <a
        href="#work"
        className="absolute inset-x-0 bottom-8 mx-auto w-fit font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink"
      >
        Selected work ↓
      </a>
    </section>
  );
}
