import type { Metadata } from "next";
import { buildMetadata, SITE } from "@/lib/seo";
import { jsonLd, learningResourceSchema } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Repositori & Git Init",
  description:
    "Pelajari apa itu Git, perbedaan folder biasa dengan repository, dan cara menggunakan perintah git init. Modul 01 Git Simulator.",
  path: "/modules/repo",
  module: "repo",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(learningResourceSchema({
        name: "Repositori & Git Init",
        description: "Pelajari apa itu Git, perbedaan folder biasa dengan repository, dan cara menggunakan perintah git init.",
        url: `${SITE.url}/modules/repo`,
        position: 1,
      }))} />
      {children}
    </>
  );
}
