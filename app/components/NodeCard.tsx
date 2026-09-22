"use client";

import { useEffect, useRef } from "react";
import { chapterOf, type TimelineNode } from "../data/timeline";

type Props = {
  node: TimelineNode;
  onClose: () => void;
  /** Playing its exit animation; still mounted, no longer interactive. */
  closing?: boolean;
};

export default function NodeCard({ node, onClose, closing = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const act = chapterOf(node);

  // Move focus into the card, and keep Tab inside it while it's open.
  useEffect(() => {
    const el = ref.current;
    if (!el || closing) return;
    const closeBtn = el.querySelector<HTMLButtonElement>("[data-close]");
    closeBtn?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = el.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [onClose, closing]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`card-${node.id}-title`}
      aria-hidden={closing || undefined}
      className={`pointer-events-auto w-full max-w-xl overflow-y-auto rounded-md border border-line bg-raised/95 p-6 shadow-[0_32px_90px_-24px_rgba(0,0,0,0.92)] backdrop-blur-sm sm:p-8 ${
        closing ? "balloon-out" : "balloon-in"
      }`}
      style={{ maxHeight: "70vh" }}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-ink-faint">
            {act.numeral} &nbsp;·&nbsp; {act.title}
          </p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-string">
            {node.range ?? node.year}
          </p>
          <h2
            id={`card-${node.id}-title`}
            className="mt-2 font-display text-2xl font-extrabold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[28px]"
          >
            {node.title}
          </h2>
          {node.org && <p className="mt-2 text-sm text-ink-mute">{node.org}</p>}
          {node.place && (
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              {node.place}
            </p>
          )}
        </div>
        <button
          data-close
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-mute transition-colors hover:border-string/60 hover:text-ink"
        >
          <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
            <path
              d="M1 1l9 9M10 1l-9 9"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {node.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-[15px] leading-relaxed text-ink-mute">
            {paragraph}
          </p>
        ))}
      </div>

      {node.tech && node.tech.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {node.tech.map((t) => (
            <li
              key={t}
              className="border border-line px-2 py-1 font-mono text-[10px] tracking-[0.06em] text-ink-faint"
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      {node.link && (
        <a
          href={node.link.href}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-string underline decoration-string/30 underline-offset-4 transition-colors hover:decoration-string"
        >
          {node.link.label}
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
    </div>
  );
}
