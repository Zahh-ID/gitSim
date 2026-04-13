import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Poster — Belajar Git Itu Seru",
  description:
    "Poster media pembelajaran interaktif Git untuk siswa SMA/SMK. 9 modul, animasi SVG, kuis, dan terminal simulator bahasa Indonesia.",
  path: "/poster",
  extraKeywords: ["poster git", "poster media pembelajaran", "poster PSBI"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
