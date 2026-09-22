import Link from "next/link";
import type { Metadata } from "next";
import formatDate from "../lib/formatDate";
import { getSortedPostsData } from "../lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Occasional notes on building software.",
};

export default function BlogIndex() {
  const posts = getSortedPostsData();

  return (
    <main className="mx-auto max-w-2xl px-6 py-28">
      <Link
        href="/"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink"
      >
        ← Back to the line
      </Link>

      <h1 className="mt-10 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">
        Writing
      </h1>

      <ul className="mt-12 divide-y divide-line border-y border-line">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.id}`} className="group block py-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                {formatDate(post.date)}
                {post.readtime && ` · ${post.readtime}`}
              </p>
              <p className="mt-2 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-string">
                {post.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
