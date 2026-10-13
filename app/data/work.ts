/**
 * The things I built outside the day job, for myself and for people I know, in
 * the order /projects lists them.
 *
 * Each one also has a node on the timeline, under the same `id`. The node tells
 * the story; this says what was built. Edit the two together.
 */

export type Project = {
  /** The timeline node's id. */
  id: string;
  name: string;
  /** Who it was for, and on what terms. One short line. */
  context: string;
  range: string;
  /** What it is, in a line or two. */
  summary: string;
  /** What I built, and the parts worth asking about. */
  points: string[];
  tech: string[];
  link?: { label: string; href: string };
};

export const projects: Project[] = [
  {
    id: "biaskop",
    name: "Biaskop",
    context: "Side project · Solo",
    range: "May 2026 — present",
    summary:
      "A bias observatory for Indonesian news. The same story from over a dozen outlets, side by side, each article scored on five axes of slant and one of sourcing.",
    points: [
      "A scraper reads twenty-odd RSS feeds every four hours, extracts each article with an LLM, and clusters coverage of one event into a single story thread — extending an existing thread rather than starting a second.",
      "An analyser scores each article with its owner's political ties in context. The two never call each other: Postgres is the queue, and both go through OpenAI's Batch API at half the cost.",
      "An audit of the scorer itself: swap the ethnic, religious or party group an article names, re-score both versions, and measure the shift against the model's own run-to-run noise.",
      "Runs unattended as Cloud Run Jobs, provisioned in Terraform, with Postgres advisory locks so an overlapping run backs off instead of paying twice.",
    ],
    tech: ["Python", "FastAPI", "OpenAI Batch API", "Postgres", "Supabase", "Cloud Run", "Terraform", "TanStack Start"],
    link: { label: "biaskop.com", href: "https://biaskop.com/" },
  },
  {
    id: "dear-stranger",
    name: "Dear Stranger",
    context: "Side project · Solo",
    range: "Nov 2023 — 2024",
    summary:
      "Write an anonymous letter, and a stranger somewhere in the world writes back. Over 140 letters so far, and not one left without a reply.",
    points: [
      "Built solo while job-hunting after graduation: Next.js and TypeScript on the front, Postgres on Supabase and Google Cloud behind it.",
      "A Hugging Face model scores every letter before it publishes. An anonymous inbox without a filter is unusable inside a day.",
      "Shared on Reddit, which was kind to it.",
    ],
    tech: ["Next.js", "TypeScript", "Postgres", "Supabase", "GCP", "Hugging Face"],
    link: { label: "dear-stranger.vercel.app", href: "https://dear-stranger.vercel.app/" },
  },
  {
    id: "cassette-del-sol",
    name: "Cassette del Sol",
    context: "Freelance · First client",
    range: "Feb 2026 — present",
    summary:
      "The first website for a music studio in Petaling Jaya — guitar and piano lessons, production, live sound. Built with its owners, Jethro and Cass, then handed over so they could run it themselves.",
    points: [
      "They had an Instagram and a WhatsApp number and nothing else, so I offered to build them a site. We designed it together in Lovable, the owners and I prompting it into shape, most of it in February.",
      "Then the parts an AI builder leaves to you: pointing their Squarespace domain at the site, a favicon set, page titles and descriptions, link-preview cards, a sitemap, LocalBusiness structured data, and Google Search Console.",
      "The real handover was teaching them to prompt their own changes. They've shipped edits on their own since; what's left for me is advice, and they still ask for it often.",
    ],
    tech: ["Lovable", "React", "DNS", "Google Search Console", "Structured data"],
    link: { label: "cassettedelsol.com", href: "https://cassettedelsol.com/" },
  },
  {
    id: "ifgf-qatar",
    name: "IFGF Qatar Connect",
    context: "Volunteer · For my home church",
    range: "May 2026 — present",
    summary:
      "Member registration and an admin dashboard for IFGF Qatar, my home church in Doha. It replaced a 1,400-row spreadsheet, and 136 people have registered in its first five months.",
    points: [
      "The old member list was an Excel sheet kept for years: duplicates, people who had long since moved away, and birthdays typed as both DD/MM and MM/DD, which tripped up the birthday celebrations more than once.",
      "Members sign up by scanning a QR code on a Sunday, or an usher does it for them. Fixed fields replace free text, so every record arrives in the same shape — one date format, one spelling per nationality.",
      "A selfie, taken in the browser as they register, so leaders can put a face to a name and every record belongs to a real person. Only admins can see the photos.",
      "Three roles that can't be climbed. I hold the only super-admin, the one role that can make an admin. Admins edit records and can invite others, but only as viewers, who can read and nothing else.",
      "The dashboard is built around what the church actually does with the list: look up a member's contact details, find whose birthday it is, and export to CSV.",
    ],
    tech: ["Lovable", "Lovable Cloud", "React", "Auth", "Role-based access"],
  },
];
