import { NextApiRequest, NextApiResponse } from "next";
import { BLOG_POSTS } from "@/lib/blogData";

const WEBSITE_URL = process.env.PUBLIC_URL || "https://xhdr.org";

interface SitemapUrl {
  url: string;
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
  lastmod?: string;
}

function createSitemapUrl(
  url: string,
  changefreq: SitemapUrl["changefreq"],
  priority: number,
  lastmod?: string
): SitemapUrl {
  return { url, changefreq, priority, lastmod };
}

function generateUrlXml({
  url,
  changefreq,
  priority,
  lastmod,
}: SitemapUrl): string {
  const lastmodXml = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
  return `
    <url>
      <loc>${WEBSITE_URL}${url}</loc>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
      ${lastmodXml}
    </url>`;
}

async function generateSiteMap() {
  const urls: SitemapUrl[] = [];
  const lastModified = new Date().toISOString().split("T")[0];

  // Homepage
  urls.push(createSitemapUrl("", "daily", 1.0, lastModified));

  // Tools
  urls.push(
    createSitemapUrl("/tools/twitter-hdr", "weekly", 0.9, lastModified)
  );
  urls.push(createSitemapUrl("/tools/hdr", "weekly", 0.9, lastModified));
  urls.push(createSitemapUrl("/tools/hdr-video", "weekly", 0.9, lastModified));

  // Blog index
  urls.push(createSitemapUrl("/blog", "weekly", 0.8, lastModified));

  // Blog posts (dynamically from blogData)
  BLOG_POSTS.forEach((post) => {
    urls.push(
      createSitemapUrl(`/blog/${post.slug}`, "monthly", 0.7, post.date)
    );
  });

  // Generate XML
  const urlsXml = urls.map(generateUrlXml).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlsXml}
</urlset>`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // Set cache control header to cache the sitemap for 24 hours
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=43200"
  );

  // Set content type to XML
  res.setHeader("Content-Type", "text/xml");

  // Generate and send sitemap
  const sitemap = await generateSiteMap();
  res.write(sitemap);
  res.end();
}
