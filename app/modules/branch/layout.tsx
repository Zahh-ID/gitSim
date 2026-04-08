import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Branching Git",
  description:
    "Buat cabang baru dengan git branch, pindah branch dengan git checkout/switch, dan kembangkan fitur secara paralel. Modul 03 Git Simulator.",
  path: "/modules/branch",
  module: "branch",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
