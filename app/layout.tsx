import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { buildMetadata } from "@/lib/seo";
import { jsonLd, websiteSchema, courseSchema } from "@/lib/jsonld";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${fredoka.variable} ${nunito.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteSchema)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(courseSchema)} />
      </head>
      <body className="font-nunito bg-[#FFF9F0] text-[#1E1B2E] min-h-screen">
        {children}
      </body>
    </html>
  );
}
