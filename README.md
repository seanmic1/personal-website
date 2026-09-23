# seanml.com

Sean Michael's personal site: a short intro and the clients behind the work, then the whole
story as a single scroll-driven timeline.

Next.js 16 (App Router, fully static), React 19, TypeScript and Tailwind CSS 3.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # static build; every route is prerendered
```

## Where things live

| To change…                        | Edit                                    |
| --------------------------------- | --------------------------------------- |
| The first screen                  | `app/components/Intro.tsx`              |
| Selected work (clients)           | `app/data/work.ts`                      |
| The timeline's chapters and nodes | `app/data/timeline.ts`                  |
| Email, GitHub, LinkedIn           | `app/data/contact.ts`                   |
| Blog posts                        | `content/posts/*.md`                    |
| Search and link-preview text      | `app/layout.tsx`, `app/opengraph-image.tsx` |

The same facts appear in more than one place: the Intro, Selected work and the timeline nodes
all describe the same career, so edit them together.

### Timeline nodes

Each node in `app/data/timeline.ts` belongs to one of three chapters (`early`, `university`,
`career`). The field comments carry the limits that keep the layout intact:

- `year` is drawn on the line: four characters at most.
- `peek` is the line under the title as the node passes: twenty words at most.
- `body` is the card that opens on "Read it": aim for 60–90 words across its paragraphs.

`app/components/TimelineDocument.tsx` renders every node as plain, screen-reader-only HTML, so
the page is fully readable and crawlable without the animation. It is built from the same data
and needs no separate edits.

The motion itself lives in `app/lib/string-motion.ts`. `NODE_PITCH` there mirrors `--pitch` in
`app/globals.css`; change both together.

### Links into the page

- `/#<node-id>` (for example `/#now`) scrolls to that node and opens its card.
- `/#early`, `/#university` and `/#career` scroll to the start of a chapter.
- `/#work` scrolls to Selected work.

### Blog

Posts are Markdown with front matter (`title`, `date`, `author`, `readtime`, `coverimage`), and
cover images go in `public/blogPics/`. `/blog` is currently left out of the header nav, but it and
every post still build and resolve.

## Elsewhere

- The contact form posts straight to Formspree; the endpoint is in `app/contact/ContactForm.tsx`.
- Analytics is Google Tag Manager, loaded in `app/layout.tsx`.
- `/dearstranger` redirects to the Dear Stranger app, for links that already exist.
