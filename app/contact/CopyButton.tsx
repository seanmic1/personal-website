"use client";

import { useEffect, useState } from "react";

/**
 * Sits beside the email address. The address itself is already a real mailto
 * link — this is only for the people who'd rather paste it somewhere else.
 */
export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const [can, setCan] = useState(false);

  // Rendered only where it can actually work: clipboard access needs a secure
  // context, and a button that silently does nothing is worse than no button.
  useEffect(() => setCan(!!navigator.clipboard), []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  if (!can) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          /* denied — the mailto link is still right there */
        }
      }}
      className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint underline decoration-line underline-offset-4 transition-colors hover:text-string hover:decoration-string/50"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
