import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Git Simulator — Belajar Git Itu Seru!",
  description: "Media pembelajaran interaktif konsep version control Git untuk siswa SMA/SMK",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="font-nunito bg-[#FFF9F0] text-[#1E1B2E] min-h-screen">
        {children}
      </body>
    </html>
  );
}
