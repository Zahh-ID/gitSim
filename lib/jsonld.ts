import { SITE } from "./seo";

/** Render a JSON-LD script tag (use inside <head> via Next.js Script or directly) */
export function jsonLd(data: object) {
  return {
    __html: JSON.stringify(data),
  };
}

/** WebSite schema for homepage */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: "id-ID",
  publisher: {
    "@type": "EducationalOrganization",
    name: SITE.institution,
    url: "https://um.ac.id",
  },
};

/** Course schema for the overall Git Simulator platform */
export const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Belajar Git — Version Control untuk Pemula",
  description: SITE.description,
  url: SITE.url,
  inLanguage: "id-ID",
  isAccessibleForFree: true,
  availableLanguage: "Indonesian",
  provider: {
    "@type": "EducationalOrganization",
    name: SITE.institution,
    url: "https://um.ac.id",
  },
  author: {
    "@type": "Person",
    name: SITE.author,
  },
  hasPart: [
    { "@type": "LearningResource", name: "Repositori & Git Init", url: `${SITE.url}/modules/repo` },
    { "@type": "LearningResource", name: "Commit & Staging Area", url: `${SITE.url}/modules/commit` },
    { "@type": "LearningResource", name: "Branching Git", url: `${SITE.url}/modules/branch` },
    { "@type": "LearningResource", name: "Merging & Rebase", url: `${SITE.url}/modules/merge` },
    { "@type": "LearningResource", name: "Remote & Push/Pull", url: `${SITE.url}/modules/remote` },
    { "@type": "LearningResource", name: "Status & File States", url: `${SITE.url}/modules/status` },
    { "@type": "LearningResource", name: "Gitignore", url: `${SITE.url}/modules/gitignore` },
    { "@type": "LearningResource", name: "Undo & Reset Git", url: `${SITE.url}/modules/undo` },
    { "@type": "LearningResource", name: "Git Log & Diff", url: `${SITE.url}/modules/log` },
  ],
};

/** WebApplication schema for the simulator tool */
export const simulatorSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Git Simulator — Terminal Interaktif",
  url: `${SITE.url}/simulator`,
  description: "Terminal interaktif untuk mencoba perintah Git secara langsung dengan visualisasi commit graph.",
  inLanguage: "id-ID",
  applicationCategory: "EducationalApplication",
  isAccessibleForFree: true,
  operatingSystem: "Web Browser",
  author: {
    "@type": "Person",
    name: SITE.author,
  },
};

/** LearningResource schema builder for individual module pages */
export function learningResourceSchema({
  name,
  description,
  url,
  position,
}: {
  name: string;
  description: string;
  url: string;
  position: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description,
    url,
    inLanguage: "id-ID",
    isAccessibleForFree: true,
    learningResourceType: "lesson",
    educationalLevel: "SMA/SMK",
    teaches: "Version Control Git",
    position,
    isPartOf: {
      "@type": "Course",
      name: "Belajar Git — Version Control untuk Pemula",
      url: SITE.url,
    },
    author: {
      "@type": "Person",
      name: SITE.author,
    },
    provider: {
      "@type": "EducationalOrganization",
      name: SITE.institution,
    },
  };
}
