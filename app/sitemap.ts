import type { MetadataRoute } from "next";
import { getSortedPostsData } from "./lib/posts";

const SITE = "https://seanml.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedPostsData().map((post) => ({
    url: `${SITE}/blog/${post.id}`,
    lastModified: new Date(post.date),
  }));
  return [
    { url: SITE, lastModified: new Date(), priority: 1 },
    { url: `${SITE}/blog`, lastModified: new Date(), priority: 0.5 },
    { url: `${SITE}/contact`, lastModified: new Date(), priority: 0.6 },
    ...posts,
  ];
}
