import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export type BlogPost = {
  id: string;
  title: string;
  date: string;
  author: string;
  readtime: string;
  coverimage: string;
};

const postsDirectory = path.join(process.cwd(), "content/posts");

function toMeta(id: string, data: Record<string, unknown>): BlogPost {
  return {
    id,
    title: String(data.title ?? id),
    date: String(data.date ?? ""),
    author: String(data.author ?? "Sean Michael"),
    readtime: String(data.readtime ?? ""),
    coverimage: String(data.coverimage ?? ""),
  };
}

export function getSortedPostsData(): BlogPost[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, "");
      const fileContents = fs.readFileSync(path.join(postsDirectory, fileName), "utf8");
      return toMeta(id, matter(fileContents).data);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(id: string): Promise<BlogPost & { contentHtml: string }> {
  const fileContents = fs.readFileSync(path.join(postsDirectory, `${id}.md`), "utf8");
  const { data, content } = matter(fileContents);

  // The posts contain raw <figure> blocks, so dangerous HTML has to pass through.
  // Note there is no rehypeDocument here — that wrapped every post in its own
  // <html><head><body>, which then got injected into a <section> mid-page.
  const processed = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return { ...toMeta(id, data), contentHtml: processed.toString() };
}
