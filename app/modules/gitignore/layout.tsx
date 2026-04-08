import type { Metadata } from "next";
import { buildMetadata, SITE } from "@/lib/seo";
import { jsonLd, learningResourceSchema } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Gitignore",
  description:
    "Cara menggunakan .gitignore untuk mengabaikan file yang tidak perlu di-track Git seperti node_modules, .env, dan build output. Modul 07 Git Simulator.",
  path: "/modules/gitignore",
  module: "gitignore",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(learningResourceSchema({
        name: "Gitignore",
        description: "Cara menggunakan .gitignore untuk mengabaikan file yang tidak perlu di-track Git seperti node_modules, .env, dan build output.",
        url: `${SITE.url}/modules/gitignore`,
        position: 7,
      }))} />
      {children}
    </>
  );
}
