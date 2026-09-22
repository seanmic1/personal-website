"use client";

import { useState } from "react";

/** The same Formspree form the previous version of this site used. */
const ENDPOINT = "https://formspree.io/f/xknlrlwy";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-sm border border-line bg-raised/60 px-3 py-2.5 text-sm text-ink " +
  "placeholder:text-ink-faint/70 transition-colors focus:border-string/60 focus:outline-none";

const legend = "font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint";

/**
 * Posted straight to Formspree rather than through a route handler: the site is
 * otherwise entirely static, and adding a server just to relay five fields to
 * the same place would be a worse trade than the one honeypot below.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setError("");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) {
        // Formspree puts field-level complaints in `errors`; anything else is
        // ours to summarise rather than dump.
        const body = await res.json().catch(() => null);
        throw new Error(body?.errors?.[0]?.message ?? "That didn't send.");
      }
      form.reset();
      setStatus("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "That didn't send.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="rounded-sm border border-string/40 bg-raised/60 p-6"
        role="status"
        aria-live="polite"
      >
        <p className={legend}>Sent</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-mute">
          Thanks — that reached me. I&rsquo;ll reply to the address you gave.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-string underline decoration-string/30 underline-offset-4 transition-colors hover:decoration-string"
        >
          Write another
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Bots fill this in; people never see it. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div>
        <label htmlFor="contact-name" className={legend}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Who you are"
          className={`mt-2 ${field}`}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className={legend}>
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Where I should reply"
          className={`mt-2 ${field}`}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={legend}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="Whatever it is"
          className={`mt-2 resize-y ${field}`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-string" role="alert">
          {error} You can always email me directly instead.
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-sm border border-string/50 bg-string/10 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-string transition-colors hover:bg-string/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Sending…" : "Send it"}
      </button>
    </form>
  );
}
