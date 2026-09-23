import Link from "next/link";
import type { Metadata } from "next";
import { channels, EMAIL, isExternal } from "../data/contact";
import ContactForm from "./ContactForm";
import CopyButton from "./CopyButton";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, GitHub and LinkedIn — every way to reach Sean Michael.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-28">
      <Link
        href="/"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink"
      >
        ← Back to the line
      </Link>

      <h1 className="mt-10 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">
        Get in touch
      </h1>
      <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink-mute">
        Work, writing, or something you think I&rsquo;d find interesting — any of these reach me.
        Email is the surest.
      </p>

      {/* The links first: most people want an address, not a form. */}
      <ul className="mt-12 divide-y divide-line border-y border-line">
        {channels.map((channel) => (
          <li key={channel.label} className="py-5">
            <div className="flex items-baseline justify-between gap-6">
              <a
                href={channel.href}
                {...(isExternal(channel.href) ? { target: "_blank", rel: "me noreferrer" } : {})}
                className="group flex min-w-0 items-baseline gap-4"
              >
                <span className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                  {channel.label}
                </span>
                <span className="truncate text-sm text-ink transition-colors group-hover:text-string">
                  {channel.value}
                </span>
              </a>
              {channel.copy && <CopyButton value={channel.copy} />}
            </div>
            <p className="mt-1.5 pl-0 text-[13px] leading-relaxed text-ink-faint sm:pl-24">
              {channel.note}
            </p>
          </li>
        ))}
      </ul>

      <section className="mt-16" aria-labelledby="write">
        <h2
          id="write"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint"
        >
          Or just write here
        </h2>
        <p className="mt-3 max-w-[46ch] text-[13px] leading-relaxed text-ink-faint">
          It lands in the same inbox as{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-ink-mute underline decoration-line underline-offset-4 transition-colors hover:text-string hover:decoration-string/50"
          >
            {EMAIL}
          </a>
          .
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
