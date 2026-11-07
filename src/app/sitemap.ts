import type { MetadataRoute } from "next";
import { getAll } from "@/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://grantly.app";
  const currentDate = new Date("2026-11-07T00:00:00.000Z");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tracker`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const scholarshipRoutes: MetadataRoute.Sitemap = getAll().map((s) => ({
    url: `${baseUrl}/scholarships/${s.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...scholarshipRoutes];
}
