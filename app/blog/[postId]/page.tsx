import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import formatDate from "../../lib/formatDate";
import { getPostData, getSortedPostsData } from "../../lib/posts";

export function generateStaticParams() {
  return getSortedPostsData().map((post) => ({ postId: post.id }));
}

type Props = { params: Promise<{ postId: string }> };

export async function generateMetadata({ params }: Props) {
  const { postId } = await params;
  const post = getSortedPostsData().find((p) => p.id === postId);
  return post ? { title: post.title } : { title: "Post not found" };
}

export default async function Post({ params }: Props) {
  const { postId } = await params;
  if (!getSortedPostsData().some((post) => post.id === postId)) notFound();

  const { title, date, author, readtime, coverimage, contentHtml } = await getPostData(postId);

  return (
    <main className="mx-auto max-w-2xl px-6 py-28">
      <Link
        href="/blog"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink"
      >
        ← All writing
      </Link>

      {coverimage && (
        <Image
          src={coverimage}
          alt=""
          width={1200}
          height={480}
          priority
          className="mt-10 h-56 w-full rounded-sm border border-line object-cover sm:h-72"
        />
      )}

      <h1 className="mt-10 font-display text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-ink">
        {title}
      </h1>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
        {formatDate(date)} · {author}
        {readtime && ` · ${readtime}`}
      </p>

      <article
        className="prose prose-invert mt-12 max-w-none prose-headings:font-display prose-headings:tracking-[-0.01em] prose-a:text-string prose-a:decoration-string/30 prose-blockquote:border-l-string/50 prose-figcaption:font-mono prose-figcaption:text-[10px] prose-figcaption:uppercase prose-figcaption:tracking-[0.14em] prose-img:rounded-sm prose-img:border prose-img:border-line"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}
