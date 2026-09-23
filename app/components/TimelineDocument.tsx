import { chapters, nodesIn, type TimelineNode } from "../data/timeline";

/**
 * The page underneath the page.
 *
 * The string is a scroll-driven visual: it only ever shows a few nodes at once,
 * and its dots are a pointer affordance, not a document. So the real document
 * lives here — every node, in order, with its full text — rendered on the
 * server, visible to screen readers and crawlers, and working with no JS at all.
 *
 * This is why the interactive dots can be aria-hidden without hiding anything.
 * The page's h1 belongs to the Intro above, so this starts at h2, with the
 * three acts as real headings beneath it — the outline is navigable by heading
 * rather than only by walking fifteen items in a row.
 *
 * Contact is deliberately absent: the visible footer already exposes it as real
 * links, and repeating it here would read it out twice.
 */
export default function TimelineDocument({ nodes }: { nodes: TimelineNode[] }) {
  // `nodes` is the prop the string is driven by, so the document is built from
  // it too — an act with nothing in it is simply not rendered.
  const inAct = (key: (typeof chapters)[number]["key"]) =>
    nodesIn(key).filter((n) => nodes.some((given) => given.id === n.id));

  return (
    <section className="sr-only">
      <h2>The full story, in order</h2>
      <p>
        Born in Indonesia, raised in Qatar, educated and now working in Malaysia. I spent three
        years building lending systems for an Indonesian finance company, and now work on access
        control across Qashier&rsquo;s point-of-sale platforms. What follows is the same story the
        string on this page walks through, in order, in three parts.
      </p>

      {chapters.map((chapter) => {
        const acts = inAct(chapter.key);
        if (!acts.length) return null;
        return (
          <section key={chapter.key}>
            <h3>
              {chapter.numeral}. {chapter.title}, {chapter.range}
            </h3>
            <ol>
              {acts.map((node) => (
                <li key={node.id}>
                  <h4>
                    {node.range ?? node.year} — {node.title}
                    {node.org ? `, ${node.org}` : ""}
                  </h4>
                  {node.place && <p>{node.place}</p>}
                  {node.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                  {node.tech && node.tech.length > 0 && <p>Built with: {node.tech.join(", ")}.</p>}
                  {node.link && (
                    <p>
                      <a href={node.link.href}>{node.link.label}</a>
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </section>
  );
}
