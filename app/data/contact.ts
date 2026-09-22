/**
 * Every way to reach me, in one list.
 *
 * Used twice: as the terse "end of the line" footer under the string, and in
 * full on /contact. Keeping it here means the two can never drift apart, and
 * that adding a channel is a one-line change rather than a hunt.
 */
export type Channel = {
  /** The micro-label. Kept to one word wherever it can be. */
  label: string;
  /** What the footer shows — a handle or an address, never a URL. */
  value: string;
  href: string;
  /** One line of context, shown only on /contact. */
  note: string;
  /** Present when the value is worth copying rather than only following. */
  copy?: string;
};

export const EMAIL = "seanlasono@gmail.com";

export const channels: Channel[] = [
  {
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    note: "The one that always reaches me. I read everything, and I reply to most of it.",
    copy: EMAIL,
  },
  {
    label: "GitHub",
    value: "seanmic1",
    href: "https://github.com/seanmic1",
    note: "Side projects, and this site.",
  },
  {
    label: "Twitter",
    // TODO(sean): confirm the handle — this is a guess from the others, and a
    // wrong one points at a stranger. Delete this comment once checked.
    value: "@seanmic1",
    href: "https://twitter.com/seanmic1",
    note: "Rarely, and mostly about work.",
  },
  {
    label: "LinkedIn",
    value: "seanmic1",
    href: "https://www.linkedin.com/in/seanmic1/",
    note: "The formal version of the same career.",
  },
  {
    label: "Résumé",
    value: "PDF",
    href: "/SeanResume20250512.pdf",
    note: "One page, kept current.",
  },
];

/** Where the link goes to another site, and therefore needs target/rel. */
export const isExternal = (href: string) => href.startsWith("http");
