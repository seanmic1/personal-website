/**
 * The story the string tells, in three acts.
 *
 * The acts are declared separately and joined to the nodes by `chapter` rather
 * than nesting the nodes inside them. Everything the string does — scroll
 * progress, the snap target, the pan, the deep-link scroll — is indexed off one
 * flat array, and teaching all of it to flatten a nested shape would buy
 * nothing. `chapterStarts` derives the boundaries back out, so the two can't
 * drift.
 */

export type ChapterKey = "early" | "university" | "career";

export type Chapter = {
  key: ChapterKey;
  /** Drawn on the string at the act's opening boundary. */
  numeral: string;
  title: string;
  range: string;
};

export const chapters: Chapter[] = [
  { key: "early", numeral: "I", title: "Early years & personal life", range: "2001 — 2020" },
  { key: "university", numeral: "II", title: "University years", range: "2020 — 2023" },
  { key: "career", numeral: "III", title: "Career", range: "2023 — now" },
];

export type TimelineNode = {
  /** URL fragment — `/#dear-stranger` deep-links straight to this card. */
  id: string;
  /** Which of the three acts this node belongs to. */
  chapter: ChapterKey;
  /** Rendered at the node on the string. Keep it to four characters. */
  year: string;
  /** Fuller date. Shown in the fixed slot and at the head of the card. */
  range?: string;
  title: string;
  org?: string;
  place?: string;
  /** Shown in the fixed slot as the dot passes. Twenty words, hard limit. */
  peek: string;
  /** Card body. Aim for 60–90 words total across all paragraphs. */
  body: string[];
  tech?: string[];
  link?: { label: string; href: string };
};

export const timeline: TimelineNode[] = [
  // ── I · Early years & personal life ───────────────────────────────────────
  {
    id: "beginning",
    chapter: "early",
    year: "2001",
    range: "2001 — 2003",
    title: "In the beginning",
    place: "Cilegon → Serang, Indonesia",
    peek: "Born in a small coastal town on the west edge of Java. Apparently I would not stop dancing.",
    body: [
      "Born in Cilegon, a coastal town on the western tip of Java, and raised inland in Serang, the capital of Banten — the province immediately west of Jakarta.",
      "I remember almost none of it. What I have is my parents' account, which is that I loved to dance and did it constantly. Nothing since has come as naturally.",
    ],
  },
  {
    id: "exodus",
    chapter: "early",
    year: "2004",
    range: "2004",
    title: "Exodus",
    place: "Doha, Qatar",
    peek: "Dad took a job in Doha and moved the three of us there. It started rough.",
    body: [
      "My father found work in Qatar and took my mother and me with him to build something there. Home was a single rented room with a wooden wall between the bedroom and the kitchen, and a bathroom in a separate building outside.",
      "He once left the house with the only set of keys, and I had to make do with a bucket. It got better from there. It kept getting better.",
    ],
  },
  {
    id: "early-life",
    chapter: "early",
    year: "2005",
    range: "2005 — 2015",
    title: "A decade of video games",
    place: "Doha, Qatar",
    peek: "Never the athletic type. Consoles, then PC, then cracking Minecraft — which is where the coding started.",
    body: [
      "School was fun and I was never the athletic type. A serious share of that decade went into games — a DSi, then a Wii, then a PS3, until I gave up on consoles for a PC. Roblox at eleven, Team Fortress 2 at thirteen, Dota 2 at fifteen. That last one never stopped.",
      "Somewhere in there I worked out how to crack Minecraft, because my parents wouldn't buy it. Learning the Windows file system and the command prompt to pull it off was, in hindsight, where the coding began.",
    ],
  },
  {
    id: "first-server",
    chapter: "early",
    year: "2019",
    range: "2019",
    title: "A server and a Discord bot",
    place: "Doha, Qatar",
    peek: "Hosted a Minecraft server, pointed a domain at it, automated the backups. First thing I built from nothing.",
    body: [
      "Last year of high school, and everyone was about to leave for a different country. So I hosted a Minecraft server locally, bought a domain and pointed it at the box, so the group could keep playing from wherever we ended up.",
      "Then a Python script to automate the backups, and a Discord bot so anyone could start the server without me. Built from scratch, and the proudest I had been of anything. That settled the question of what I was going to study.",
    ],
    tech: ["Python", "Discord API", "DNS", "Self-hosting"],
  },

  // ── II · University years ─────────────────────────────────────────────────
  {
    id: "covid",
    chapter: "university",
    year: "2020",
    range: "2020 — 2021",
    title: "University from a bedroom",
    org: "Monash University Malaysia",
    place: "Attended from Doha, Qatar",
    peek: "Accepted into Monash Malaysia, then grounded by Covid. Eighteen months of a degree over Discord.",
    body: [
      "I got into Monash University Malaysia and then could not go. Borders shut, so the first year and a half of a computer science degree happened entirely online, from Qatar.",
      "I met my whole cohort through a screen. Most evenings were games, or group study calls on Discord where we were of course not sharing answers. A strange way to start a degree, and I would not give the memory back.",
    ],
  },
  {
    id: "kl",
    chapter: "university",
    year: "2022",
    range: "2022",
    title: "Finally in Kuala Lumpur",
    place: "Kuala Lumpur, Malaysia",
    peek: "Travel bans lifted and I wasted no time. Still the stretch I would go back to.",
    body: [
      "The moment the travel bans lifted I was on a plane. Everybody had two years of missed socialising to make up for, so we made up for it relentlessly.",
      "I had the privilege of joining a Christian student fellowship and eventually becoming its president. I also started working out for the first time in my life. The people I met that year are why it is still the stretch I would go back to.",
    ],
  },
  {
    id: "intern",
    chapter: "university",
    year: "2022",
    range: "Nov 2022 — Feb 2023",
    title: "First real codebase",
    org: "JurisTech · Software Engineer Intern",
    place: "Kuala Lumpur, Malaysia",
    peek: "Three months inside a live loan origination system. PHP, Oracle, and a lot of reading.",
    body: [
      "Months of applications with nothing to show for them, then a call from JurisTech and an interview process that genuinely tested me. I got in, onto the team delivering a loan origination and collection system for an Indonesian finance company.",
      "It began as documentation, the way internships do, and turned into real design and build work — PHP against an Oracle backend, wiring our system to the client's own APIs. Good boss, good team, and the lasting lesson that most of this job is reading code you didn't write.",
    ],
    tech: ["PHP", "PL/SQL", "Oracle", "REST"],
  },
  {
    id: "activity-recognition",
    chapter: "university",
    year: "2023",
    range: "Jun 2023 · Final year project",
    title: "Reading a room with Wi-Fi",
    org: "Monash University Malaysia",
    peek: "Telling whether someone is sitting, standing or running from Wi-Fi alone. Nothing worn, no camera.",
    body: [
      "My group picked the most hardware-intensive topic on the list on the theory that it would be interesting, and it was: device-free human activity recognition from Wi-Fi channel state information and visible light.",
      "I learnt more about signal propagation, microcontrollers and deep learning in those months than in the two years before them. The rig ran on ESP32s with the classifier in TensorFlow, and by the end it could tell sitting from standing from running using nothing but Wi-Fi and light.",
    ],
    tech: ["Python", "TensorFlow", "ESP32", "Signal processing"],
  },
  {
    id: "graduation",
    chapter: "university",
    year: "2023",
    range: "Nov 2023",
    title: "The piece of paper",
    org: "Monash University Malaysia",
    place: "Kuala Lumpur, Malaysia",
    peek: "Walked the stage, said goodbye to people I still miss, flew back to Qatar to look for work.",
    body: [
      "Bachelor of Computer Science, data science major, GPA 3.4. The coursework that actually stuck was the unglamorous half — databases, OOP design, software quality and testing. Those three still come up every week.",
      "Then the ceremony, the paper confirming it, and goodbyes to friends and colleagues I have not stopped missing. I flew home to Qatar to start looking for a job.",
    ],
  },

  // ── III · Career ──────────────────────────────────────────────────────────
  {
    id: "dear-stranger",
    chapter: "career",
    year: "2023",
    range: "Nov 2023 — 2024",
    title: "Dear Stranger",
    org: "Shipped solo",
    peek: "Anyone writes an anonymous letter; anyone in the world can answer it. Built end to end while job-hunting.",
    body: [
      "Job hunting with nothing to point at, so I built something to point at: a platform where you write an anonymous letter and a stranger writes back. Next.js and TypeScript on the front, Postgres on Supabase behind it, running on Google Cloud.",
      "Hosting, databases, auth, captcha, inference — I picked up most of it here. The piece worth defending is the moderation: a Hugging Face model scores every letter before it publishes, because an anonymous inbox without a filter is unusable inside a day. Reddit was kind to it.",
    ],
    tech: ["Next.js", "TypeScript", "Postgres", "Supabase", "GCP", "Hugging Face"],
    link: { label: "dear-stranger.vercel.app", href: "https://dear-stranger.vercel.app/" },
  },
  {
    id: "software-engineer",
    chapter: "career",
    year: "2024",
    range: "Feb 2024 — Dec 2024",
    title: "Software Engineer",
    org: "JurisTech",
    place: "Remote, then Kuala Lumpur",
    peek: "No company would take me, so I texted my old boss. The offer letter came two weeks later.",
    body: [
      "Nothing was landing, so I asked my old boss at JurisTech whether a return offer was possible. He said yes, and the letter arrived two weeks later. I have not forgotten it.",
      "The work permit took six months, so I worked remotely until it cleared and then moved back to KL. I owned system integration testing for phase 2 of the BFI build — mostly asking the client's technical users what was broken — supported phase 1 after go-live, and picked up a new joiner when he got stuck.",
    ],
    tech: ["PHP", "Oracle", "SIT", "API integration"],
  },
  {
    id: "specialist",
    chapter: "career",
    year: "2025",
    range: "Jan 2025 — 2025",
    title: "Specialist Software Engineer",
    org: "JurisTech",
    place: "Kuala Lumpur, Malaysia",
    peek: "Led delivery of several web apps for one of Indonesia's largest lenders. Also taught a receipt printer to listen.",
    body: [
      "I led the design and build of multiple web applications for BFI Finance, one of Indonesia's largest multi-finance companies: integrating with their API systems across several teams, negotiating scope so the deadline could survive it, and watching the production end-of-day batch, which is where you find out what you got wrong.",
      "The rest was features, production fixes and training new hires — plus an internal library so our systems could drive a receipt printer one client used. The least glamorous thing I have shipped, and one of the most used.",
    ],
    tech: ["TypeScript", "React", "PHP", "Oracle", "PostgreSQL"],
  },
  {
    id: "swat",
    chapter: "career",
    year: "2025",
    range: "Nov 2025",
    title: "On call",
    org: "JurisTech · SWAT",
    place: "Kuala Lumpur, Malaysia",
    peek: "Trained onto the crisis team. The worst call came at 2am and ran seven hours.",
    body: [
      "I took the training for the SWAT team — the on-call engineers who are first contact whenever something goes wrong with a JurisTech product in production.",
      "The worst of it started at two in the morning and ran seven hours. The cause turned out to be a third-party vendor who hadn't tested properly, which is simultaneously the most and least satisfying answer available. I owe that company a great deal. It was my first.",
    ],
  },
  {
    id: "qashier",
    chapter: "career",
    year: "2026",
    range: "Apr 2026 — Sep 2026",
    title: "Qashier, from a distance",
    org: "Qashier · Engineering",
    place: "Singapore",
    peek: "Joined a Singapore start-up, then left Malaysia the next day for a visa. Four months remote.",
    body: [
      "Qashier's engineering team got in touch. The interviews went better than I had any right to expect, and the offer was not one I was going to turn down.",
      "I made it into the office for exactly one day before flying out of Malaysia to renew my visa. Four months of remote work followed, waiting on the permit. Second time round for that particular wait, and no easier for the practice.",
    ],
  },
  {
    id: "now",
    chapter: "career",
    year: "now",
    range: "Sep 2026 — present",
    title: "Boarding",
    org: "Qashier",
    place: "Kuala Lumpur, Malaysia",
    peek: "Writing this at the gate, waiting to fly back to KL.",
    body: [
      "I am writing this at the airport, about to board for Kuala Lumpur. Permit cleared, desk waiting, and the city I keep coming back to.",
      "Which is as current as a timeline gets. I don't know what the next node says yet — only that I intend to keep growing into it, in the work and outside of it.",
    ],
  },
];

const byKey = new Map(chapters.map((c) => [c.key, c]));

/** The act a node belongs to. Chapters are a closed set, so this cannot miss. */
export const chapterOf = (node: TimelineNode): Chapter => byKey.get(node.chapter)!;

/** The nodes of one act, in order. */
export const nodesIn = (key: ChapterKey): TimelineNode[] =>
  timeline.filter((n) => n.chapter === key);

/**
 * Where one act hands over to the next, as a fractional node index — the tick
 * sits halfway between the last node of one and the first of the next. Derived
 * from the nodes rather than written down, so it cannot fall out of step with
 * them. The first act has no boundary before it, hence the filter.
 */
export const chapterStarts: { chapter: Chapter; at: number }[] = chapters
  .map((chapter) => ({
    chapter,
    at: timeline.findIndex((n) => n.chapter === chapter.key) - 0.5,
  }))
  .filter((b) => b.at > 0);

/*
 * The end of the line used to live here. It is now `channels` in ./contact,
 * shared with /contact so the footer and the contact page cannot drift.
 */
