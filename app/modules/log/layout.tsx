import type { Metadata } from "next";
import { buildMetadata, SITE } from "@/lib/seo";
import { jsonLd, learningResourceSchema } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Git Log & Diff",
  description:
    "Baca riwayat commit dengan git log dan bandingkan perubahan dengan git diff. Pelajari git show dan cara membaca history proyek. Modul 09 Git Simulator.",
  path: "/modules/log",
  module: "log",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(learningResourceSchema({
        name: "Git Log & Diff",
        description: "Baca riwayat commit dengan git log dan bandingkan perubahan dengan git diff. Pelajari git show dan cara membaca history proyek.",
        url: `${SITE.url}/modules/log`,
        position: 9,
      }))} />
      {children}
    </>
  );
}
