import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Remote & Push/Pull",
  description:
    "Hubungkan repository lokal ke GitHub dengan git remote. Pelajari cara git push, git pull, git fetch, dan kolaborasi tim. Modul 05 Git Simulator.",
  path: "/modules/remote",
  module: "remote",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
