import type { Metadata } from "next";
import { buildMetadata, SITE } from "@/lib/seo";
import { jsonLd, learningResourceSchema } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Commit & Staging Area",
  description:
    "Pahami 3 area Git: working directory, staging area, dan repository. Pelajari cara git add, git commit, dan membuat snapshot perubahan. Modul 02 Git Simulator.",
  path: "/modules/commit",
  module: "commit",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(learningResourceSchema({
        name: "Commit & Staging Area",
        description: "Pahami 3 area Git: working directory, staging area, dan repository. Pelajari cara git add, git commit, dan membuat snapshot perubahan.",
        url: `${SITE.url}/modules/commit`,
        position: 2,
      }))} />
      {children}
    </>
  );
}
