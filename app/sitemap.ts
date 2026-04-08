import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export const dynamic = "force-static";

const MODULES = [
  "repo", "commit", "branch", "merge", "remote",
  "status", "gitignore", "undo", "log",
];

const TASK_IDS = [
  "01-first-repo",
  "02-staging-practice",
  "03-branch-basics",
  "04-merge-branches",
  "05-undo-mistakes",
  "06-full-workflow",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Home
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    // Simulator
    {
      url: `${SITE.url}/simulator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Tasks index
    {
      url: `${SITE.url}/tasks`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Individual task pages
    ...TASK_IDS.map((id) => ({
      url: `${SITE.url}/tasks/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Module pages
    ...MODULES.map((slug) => ({
      url: `${SITE.url}/modules/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
