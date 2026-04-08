import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Repositori & Git Init",
  description:
    "Pelajari apa itu Git, perbedaan folder biasa dengan repository, dan cara menggunakan perintah git init. Modul 01 Git Simulator.",
  path: "/modules/repo",
  module: "repo",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
