import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import {read} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'

const postsDirectory = path.join(process.cwd(), "app/(blog)/blogposts");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    const blogPost: BlogPost = {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      author: matterResult.data.author,
      readtime: matterResult.data.readtime,
      coverimage: matterResult.data.coverimage
    };

    // Combine the data with the id
    return blogPost;
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // old code
  // const processedContent = await remark()
  //     .use(html)
  //     .process(matterResult.content);

      const processedContent = await unified()
      //@ts-ignore
      .use(remarkParse)
      //@ts-ignore
      .use(remarkRehype, {allowDangerousHtml: true})
      .use(rehypeDocument)
      .use(rehypeFormat)
      .use(rehypeStringify, {allowDangerousHtml: true})
      .process(matterResult.content)

  const contentHtml = processedContent.toString();

  const blogPostWithHTML: BlogPost & { contentHtml: string } = {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      author: matterResult.data.author,
      readtime: matterResult.data.readtime,
      coverimage: matterResult.data.coverimage,
      contentHtml,
  }

  // Combine the data with the id
  return blogPostWithHTML
}