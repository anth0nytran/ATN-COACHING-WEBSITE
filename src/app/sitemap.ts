import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://atncoaching.vercel.app";
  const pages = [
    "",
    "#services",
  ];
  const now = new Date().toISOString();
  return pages.map((p) => ({
    url: `${base}/${p}`.replace(/\/+$/g, "/").replace(/\/#/, "#"),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}


