/**
 * Where the site lives. Everything that needs an absolute URL — metadata, the
 * canonical link, the sitemap, robots.txt, the share card — reads it from here.
 *
 * On the Vercel address until seanml.com is registered again. Once the domain
 * is pointed at the Vercel project, change this one line back.
 */
export const SITE = "https://seanml.vercel.app";

/** The bare host, for printing: "seanml.vercel.app". */
export const HOST = new URL(SITE).host;
