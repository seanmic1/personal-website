import Link from "next/link";
import getFormattedDate from "../../lib/getFormattedDate";
import { getPostData, getSortedPostsData } from "../../lib/posts";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const posts = getSortedPostsData();

  return posts.map((post) => ({
    postId: post.id
  }))
}

export function generateMetadata({ params }: { params: { postId: string } }) {
  const posts = getSortedPostsData();
  const { postId } = params;

  const post = posts.find((post) => post.id === postId);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post?.title,
  };
}

export default async function Post({ params }: { params: { postId: string } }) {

  const posts = getSortedPostsData(); // deduped cuz NextJS 13 magic
  const { postId } = params;

  if (!posts.find((post) => post.id === postId)) {
    return notFound();
  }

  const { title, date, author, readtime, coverimage, contentHtml } = await getPostData(postId);

  const pubDate = getFormattedDate(date);

  return (
    <main className="py-2 prose prose-xl dark:prose-invert px-4 mx-auto">
      <div className="flex w-full justify-center items-center">
        <img className="h-80 w-full object-cover" src={coverimage}/>
      </div>
      <h1 className=" text-4xl mt-4 mb-0">{title}</h1>
      <p className="my-0 font-mono">{pubDate}</p> 
      <p className="my-0 font-extralight">{author}</p> 
      <p className="my-0">{readtime} read time</p> 
      <article> 
        <section dangerouslySetInnerHTML={{ __html: contentHtml }} />
          <p>
            <Link href="/blog">← Back to article list</Link>
          </p>
      </article>
    </main>
  );
}
