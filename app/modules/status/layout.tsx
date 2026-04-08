import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Status & File States",
  description:
    "Pahami siklus hidup file di Git: untracked, modified, staged, dan committed. Gunakan git status untuk melacak perubahan file. Modul 06 Git Simulator.",
  path: "/modules/status",
  module: "status",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
