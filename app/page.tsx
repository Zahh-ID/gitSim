"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  FaRocket, FaFolder, FaSave, FaCodeBranch, FaCloud, FaBook,
  FaExchangeAlt, FaEyeSlash, FaUndo, FaHistory, FaTerminal, FaTasks,
} from "react-icons/fa";
import { VscGitMerge } from "react-icons/vsc";
import { HiSparkles } from "react-icons/hi";

const MODULES = [
  {
    href: "/modules/repo",
    num: "01",
    Icon: FaFolder,
    title: "Repositori & Init",
    desc: "Kenalan sama Git, folder biasa vs repo, dan cara pakai git init.",
    color: "#FFD93D",
    bg: "#FFF8E1",
  },
  {
    href: "/modules/commit",
    num: "02",
    Icon: FaSave,
    title: "Commit & Staging",
    desc: "Pahami 3 area Git, cara staging file, dan bikin commit pertamamu.",
    color: "#FF6B35",
    bg: "#FFF3EE",
  },
  {
    href: "/modules/branch",
    num: "03",
    Icon: FaCodeBranch,
    title: "Branching",
    desc: "Buat cabang baru, pindah-pindah branch, dan develop paralel!",
    color: "#FF6B9D",
    bg: "#FFF0F5",
  },
  {
    href: "/modules/merge",
    num: "04",
    Icon: VscGitMerge,
    title: "Merging & Rebase",
    desc: "Gabungkan branch, tangani konflik, dan pahami cara merge commit.",
    color: "#A855F7",
    bg: "#F9F0FF",
  },
  {
    href: "/modules/remote",
    num: "05",
    Icon: FaCloud,
    title: "Remote & Push/Pull",
    desc: "Hubungkan repo lokal ke GitHub, push commit, dan tarik update.",
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    href: "/modules/status",
    num: "06",
    Icon: FaExchangeAlt,
    title: "Status & File States",
    desc: "Pahami siklus hidup file: untracked, modified, staged, committed.",
    color: "#22C55E",
    bg: "#F0FFF4",
  },
  {
    href: "/modules/gitignore",
    num: "07",
    Icon: FaEyeSlash,
    title: "Gitignore",
    desc: "Pelajari cara mengabaikan file yang tidak perlu di-track Git.",
    color: "#EF4444",
    bg: "#FFF5F5",
  },
  {
    href: "/modules/undo",
    num: "08",
    Icon: FaUndo,
    title: "Undo & Reset",
    desc: "Cara membatalkan perubahan: git restore, reset, dan revert.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    href: "/modules/log",
    num: "09",
    Icon: FaHistory,
    title: "Git Log & Diff",
    desc: "Baca sejarah commit dan bandingkan perubahan antar versi.",
    color: "#06B6D4",
    bg: "#ECFEFF",
  },
];

const TOOLS = [
  {
    href: "/simulator",
    Icon: FaTerminal,
    title: "Git Simulator",
    desc: "Coba perintah Git secara langsung di terminal interaktif dengan visualisasi commit graph.",
    color: "#1E1B2E",
    bg: "#F8F8F8",
    cta: "Buka Terminal →",
  },
  {
    href: "/tasks",
    Icon: FaTasks,
    title: "Tugas Praktik",
    desc: "Selesaikan tantangan Git nyata dari level mudah sampai sulit untuk menguji pemahamanmu.",
    color: "#FF6B35",
    bg: "#FFF3EE",
    cta: "Lihat Tugas →",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto w-full px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HiSparkles className="text-6xl" style={{ color: "#FFD93D" }} />
          <h1
            className="text-5xl md:text-6xl font-bold text-[#1E1B2E] mt-4 leading-tight"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Belajar Git Itu <span style={{ color: "#FF6B35" }}>Seru!</span>
          </h1>
          <p
            className="text-lg md:text-xl text-[#1E1B2E] mt-4 max-w-xl mx-auto opacity-70 leading-relaxed"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Pelajari Version Control Git dari nol dengan animasi interaktif,
            penjelasan bahasa Indonesia, dan kuis seru. Cocok untuk siswa SMA/SMK!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8"
        >
          <Link
            href="/modules/repo"
            className="btn-brutal inline-flex items-center gap-2 px-8 py-3.5 text-lg text-white"
            style={{
              background: "#FF6B35",
              fontFamily: "var(--font-fredoka)",
              fontWeight: 500,
              fontSize: "1.2rem",
              textDecoration: "none",
            }}
          >
            <FaRocket className="mr-2" /> Mulai Belajar
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-8 mt-10 flex-wrap"
        >
          {[
            { label: "Modul", value: "9" },
            { label: "Animasi SVG", value: "36+" },
            { label: "Soal Kuis", value: "36+" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-3xl font-bold text-[#1E1B2E]"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                {s.value}
              </div>
              <div
                className="text-sm opacity-60"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Module cards */}
      <section className="max-w-5xl mx-auto w-full px-4 pb-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-center mb-8 text-[#1E1B2E] flex items-center justify-center gap-2"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          <FaBook className="text-[#FF6B35]" /> Pilih Modul
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.href}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i + 0.4 }}
            >
              <Link
                href={m.href}
                className="card-brutal flex flex-col p-5 h-full"
                style={{ background: m.bg, textDecoration: "none" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <m.Icon className="text-4xl" style={{ color: m.color }} />
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full border-2"
                    style={{
                      color: m.color,
                      borderColor: m.color,
                      background: m.color + "22",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    {m.num}
                  </span>
                </div>
                <h3
                  className="text-xl font-bold text-[#1E1B2E] mb-1.5"
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  {m.title}
                </h3>
                <p
                  className="text-sm text-[#1E1B2E] opacity-70 leading-relaxed flex-1"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {m.desc}
                </p>
                <div
                  className="mt-4 text-sm font-bold flex items-center gap-1"
                  style={{ color: m.color, fontFamily: "var(--font-nunito)" }}
                >
                  Mulai belajar →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tools section */}
      <section className="max-w-5xl mx-auto w-full px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold text-center mb-8 text-[#1E1B2E] flex items-center justify-center gap-2"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          <FaTerminal className="text-[#1E1B2E]" /> Praktik Langsung
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TOOLS.map((t, i) => (
            <motion.div
              key={t.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.15 }}
            >
              <Link
                href={t.href}
                className="card-brutal flex flex-col p-6 h-full"
                style={{ background: t.bg, textDecoration: "none" }}
              >
                <t.Icon className="text-4xl mb-3" style={{ color: t.color }} />
                <h3
                  className="text-xl font-bold text-[#1E1B2E] mb-2"
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  {t.title}
                </h3>
                <p
                  className="text-sm text-[#1E1B2E] opacity-70 leading-relaxed flex-1"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {t.desc}
                </p>
                <div
                  className="mt-4 text-sm font-bold"
                  style={{ color: t.color, fontFamily: "var(--font-nunito)" }}
                >
                  {t.cta}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[2.5px] border-[#1E1B2E] py-6 text-center">
        <p
          className="text-sm opacity-50 flex items-center justify-center gap-2"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          <FaCodeBranch /> Git Simulator, Pendidikan Teknik Informatika UM
        </p>
      </footer>
    </div>
  );
}
