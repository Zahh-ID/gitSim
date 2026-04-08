import type { Metadata } from "next";
import { buildMetadata, SITE } from "@/lib/seo";
import { jsonLd, learningResourceSchema } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Status & File States",
  description:
    "Pahami siklus hidup file di Git: untracked, modified, staged, dan committed. Gunakan git status untuk melacak perubahan file. Modul 06 Git Simulator.",
  path: "/modules/status",
  module: "status",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(learningResourceSchema({
        name: "Status & File States",
        description: "Pahami siklus hidup file di Git: untracked, modified, staged, dan committed. Gunakan git status untuk melacak perubahan file.",
        url: `${SITE.url}/modules/status`,
        position: 6,
      }))} />
      {children}
    </>
  );
}
