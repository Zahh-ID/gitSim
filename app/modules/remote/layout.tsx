import type { Metadata } from "next";
import { buildMetadata, SITE } from "@/lib/seo";
import { jsonLd, learningResourceSchema } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Remote & Push/Pull",
  description:
    "Hubungkan repository lokal ke GitHub dengan git remote. Pelajari cara git push, git pull, git fetch, dan kolaborasi tim. Modul 05 Git Simulator.",
  path: "/modules/remote",
  module: "remote",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(learningResourceSchema({
        name: "Remote & Push/Pull",
        description: "Hubungkan repository lokal ke GitHub dengan git remote. Pelajari cara git push, git pull, git fetch, dan kolaborasi tim.",
        url: `${SITE.url}/modules/remote`,
        position: 5,
      }))} />
      {children}
    </>
  );
}
