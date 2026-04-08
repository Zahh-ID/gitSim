import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Merging & Rebase",
  description:
    "Gabungkan branch dengan git merge dan git rebase. Pelajari cara menangani merge conflict, fast-forward merge, dan three-way merge. Modul 04 Git Simulator.",
  path: "/modules/merge",
  module: "merge",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
