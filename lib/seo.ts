import type { Metadata } from "next";

export const SITE = {
  name: "Git Simulator",
  url: "https://gitsim.syzzhd.web.id",
  title: "Git Simulator — Belajar Git Itu Seru!",
  description:
    "Media pembelajaran interaktif Git untuk siswa SMA/SMK. Belajar git init, commit, branch, merge, push/pull dengan animasi SVG dan kuis bahasa Indonesia.",
  ogImage: "/opengraph-image",
  locale: "id_ID",
  author: "Syahruzzahid",
  institution: "Universitas Negeri Malang, Pendidikan Teknik Informatika",
};

/** Core keywords shared across all pages */
export const BASE_KEYWORDS = [
  "git simulator",
  "belajar git",
  "git bahasa indonesia",
  "tutorial git",
  "version control",
  "git untuk pemula",
  "git interaktif",
  "media pembelajaran git",
  "git SMA",
  "git SMK",
  "git init",
  "git commit",
  "git branch",
  "git merge",
  "git push",
  "git pull",
  "github tutorial",
  "version control system",
  "VCS",
  "source control",
  "PSBI",
  "Universitas Negeri Malang",
  "Pendidikan Teknik Informatika",
];

/** Per-module keyword extensions */
export const MODULE_KEYWORDS: Record<string, string[]> = {
  repo: [
    "git repository",
    "git init tutorial",
    "apa itu git",
    "cara membuat repository git",
    "git folder tersembunyi",
    ".git directory",
  ],
  commit: [
    "git commit",
    "git add",
    "staging area",
    "working directory",
    "git status",
    "cara commit git",
    "git snapshot",
  ],
  branch: [
    "git branch",
    "git checkout",
    "git switch",
    "branching git",
    "parallel development",
    "cara buat branch git",
    "fitur branch git",
  ],
  merge: [
    "git merge",
    "git rebase",
    "merge conflict",
    "cara merge branch",
    "fast-forward merge",
    "three-way merge",
  ],
  remote: [
    "git remote",
    "git push",
    "git pull",
    "git fetch",
    "github",
    "origin remote",
    "cara push ke github",
  ],
  status: [
    "git status",
    "untracked file",
    "modified file",
    "staged file",
    "committed",
    "siklus hidup file git",
  ],
  gitignore: [
    ".gitignore",
    "cara pakai gitignore",
    "file yang diabaikan git",
    "gitignore pattern",
    "node_modules gitignore",
  ],
  undo: [
    "git restore",
    "git reset",
    "git revert",
    "cara undo git",
    "membatalkan commit",
    "rollback git",
  ],
  log: [
    "git log",
    "git diff",
    "git history",
    "melihat riwayat commit",
    "git show",
    "git blame",
  ],
};

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  /** Extra keywords specific to the page */
  extraKeywords?: string[];
  /** Module slug to pull MODULE_KEYWORDS for */
  module?: keyof typeof MODULE_KEYWORDS;
}

export function buildMetadata({
  title,
  description,
  path = "",
  extraKeywords = [],
  module,
}: BuildMetadataOptions = {}): Metadata {
  const fullTitle = title ? `${title} — ${SITE.name}` : SITE.title;
  const fullDesc = description ?? SITE.description;
  const canonicalUrl = `${SITE.url}${path}`;
  const keywords = [
    ...BASE_KEYWORDS,
    ...(module ? (MODULE_KEYWORDS[module] ?? []) : []),
    ...extraKeywords,
  ];

  return {
    title: fullTitle,
    description: fullDesc,
    keywords,
    authors: [{ name: SITE.author }],
    creator: SITE.author,
    publisher: SITE.institution,
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      url: canonicalUrl,
      siteName: SITE.name,
      title: fullTitle,
      description: fullDesc,
      images: [
        {
          url: SITE.ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDesc,
      images: [SITE.ogImage],
      creator: "@syzzhd",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
