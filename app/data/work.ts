/**
 * The things I built on my own time, newest first.
 *
 * Each one also has a node on the timeline, under the same `id`. The node tells
 * the story; this says what was built. Edit the two together.
 */

export type Project = {
  /** The timeline node's id. */
  id: string;
  name: string;
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
];
