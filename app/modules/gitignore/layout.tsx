import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Gitignore",
  description:
    "Pelajari cara menggunakan file .gitignore untuk mengabaikan file yang tidak perlu di-track Git seperti node_modules, .env, dan file build. Modul 07 Git Simulator.",
  path: "/modules/gitignore",
  module: "gitignore",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
