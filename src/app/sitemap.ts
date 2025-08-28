import type { MetadataRoute } from "next";
import { getAllPosts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://atncoaching.vercel.app";
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    "",
  ].map((p) => ({
    url: `${base}/${p}`.replace(/\/+$/g, "/").replace(/\/#/, "#"),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogIndex: Array<{
    url: string;
    lastModified: string | Date;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [{
    url: `${base}/guides`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }];

  const blogPosts = getAllPosts().map((post) => ({
    url: `${base}/guide/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Cast each entry to the union type expected by Next
  const result: MetadataRoute.Sitemap = [
    ...staticPages,
    ...blogIndex.map((e) => ({
      url: e.url,
      lastModified: e.lastModified,
      changeFrequency: e.changeFrequency,
      priority: e.priority,
    })),
    ...blogPosts.map((e) => ({
      url: e.url,
      lastModified: e.lastModified,
      changeFrequency: e.changeFrequency,
      priority: e.priority,
    })),
  ]
  return result;
}


