import type { Metadata } from "next";
import { buildMetadata, SITE } from "@/lib/seo";
import { jsonLd, learningResourceSchema } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Branching Git",
  description:
    "Buat cabang baru dengan git branch, pindah branch dengan git checkout/switch, dan kembangkan fitur secara paralel. Modul 03 Git Simulator.",
  path: "/modules/branch",
  module: "branch",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(learningResourceSchema({
        name: "Branching Git",
        description: "Buat cabang baru dengan git branch, pindah branch dengan git checkout/switch, dan kembangkan fitur secara paralel.",
        url: `${SITE.url}/modules/branch`,
        position: 3,
      }))} />
      {children}
    </>
  );
}
