import type { Metadata } from "next";
import { buildMetadata, SITE } from "@/lib/seo";
import { jsonLd, learningResourceSchema } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Undo & Reset Git",
  description:
    "Cara membatalkan perubahan di Git menggunakan git restore, git reset, dan git revert. Pelajari perbedaannya dan kapan harus dipakai. Modul 08 Git Simulator.",
  path: "/modules/undo",
  module: "undo",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(learningResourceSchema({
        name: "Undo & Reset Git",
        description: "Cara membatalkan perubahan di Git menggunakan git restore, git reset, dan git revert. Pelajari perbedaannya dan kapan harus dipakai.",
        url: `${SITE.url}/modules/undo`,
        position: 8,
      }))} />
      {children}
    </>
  );
}
