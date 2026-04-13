"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  FaFolder, FaSave, FaCodeBranch, FaCloud, FaRocket,
  FaExchangeAlt, FaEyeSlash, FaUndo, FaHistory, FaTerminal,
} from "react-icons/fa";
import { VscGitMerge } from "react-icons/vsc";
import { HiSparkles } from "react-icons/hi";
import { QRCodeSVG } from "qrcode.react";

const MODULES = [
  { Icon: FaFolder, title: "Repositori", color: "#FFD93D" },
  { Icon: FaSave, title: "Commit", color: "#FF6B35" },
  { Icon: FaCodeBranch, title: "Branching", color: "#FF6B9D" },
  { Icon: VscGitMerge, title: "Merging", color: "#A855F7" },
  { Icon: FaCloud, title: "Remote", color: "#3B82F6" },
  { Icon: FaExchangeAlt, title: "Status", color: "#22C55E" },
  { Icon: FaEyeSlash, title: "Gitignore", color: "#EF4444" },
  { Icon: FaUndo, title: "Undo", color: "#F59E0B" },
  { Icon: FaHistory, title: "Log & Diff", color: "#06B6D4" },
];

const STATS = [
  { value: "9", label: "Modul", color: "#FFD93D" },
  { value: "36+", label: "Animasi", color: "#FF6B9D" },
  { value: "36+", label: "Kuis", color: "#3B82F6" },
  { value: "6", label: "Tugas", color: "#22C55E" },
];

export default function PosterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0] overflow-hidden relative">
      {/* Decorative background circles */}
      <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-10" style={{ background: "#FFD93D" }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full opacity-10" style={{ background: "#FF6B9D" }} />
      <div className="absolute top-[40%] right-[5%] w-[180px] h-[180px] rounded-full opacity-8" style={{ background: "#3B82F6", opacity: 0.08 }} />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <HiSparkles className="text-5xl" style={{ color: "#FFD93D" }} />
            <FaTerminal className="text-4xl" style={{ color: "#1E1B2E" }} />
            <HiSparkles className="text-5xl" style={{ color: "#FF6B35" }} />
          </div>

          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-[#1E1B2E] leading-none tracking-tight"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            <span className="block">Belajar Git</span>
            <span className="block" style={{ color: "#FF6B35" }}>Itu Seru!</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-[#1E1B2E] mt-4 max-w-2xl mx-auto opacity-65 leading-relaxed"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Media Pembelajaran Interaktif Version Control Git untuk Siswa SMA/SMK
          </motion.p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="card-brutal px-4 py-2.5 sm:px-6 sm:py-3 text-center"
              style={{ background: s.color + "20", borderColor: "#1E1B2E" }}
            >
              <div
                className="text-2xl sm:text-3xl font-bold"
                style={{ fontFamily: "var(--font-fredoka)", color: "#1E1B2E" }}
              >
                {s.value}
              </div>
              <div
                className="text-xs sm:text-sm font-semibold opacity-60"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Module icons grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 max-w-2xl"
        >
          {MODULES.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.06, type: "spring", stiffness: 200 }}
              className="card-brutal flex flex-col items-center justify-center w-[85px] h-[85px] sm:w-[100px] sm:h-[100px]"
              style={{ background: m.color + "18" }}
            >
              <m.Icon className="text-2xl sm:text-3xl mb-1" style={{ color: m.color }} />
              <span
                className="text-[10px] sm:text-xs font-bold text-[#1E1B2E] opacity-80 text-center leading-tight"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {m.title}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Features badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
        >
          {[
            "Animasi SVG Interaktif",
            "Kuis Setiap Modul",
            "Terminal Simulator",
            "Bahasa Indonesia",
            "100% Gratis",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border-2 border-[#1E1B2E]"
              style={{ fontFamily: "var(--font-nunito)", background: "#FFF9F0", color: "#1E1B2E" }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* CTA + QR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="btn-brutal inline-flex items-center gap-2 px-10 py-4 text-white text-lg sm:text-xl"
              style={{
                background: "#FF6B35",
                fontFamily: "var(--font-fredoka)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <FaRocket /> Mulai Belajar Sekarang!
            </Link>
            <div
              className="text-sm font-bold"
              style={{ fontFamily: "var(--font-fredoka)", color: "#1E1B2E", opacity: 0.4 }}
            >
              gitsim.syzzhd.web.id
            </div>
          </div>

          <div className="card-brutal p-3 flex flex-col items-center gap-1.5" style={{ background: "#fff" }}>
            <QRCodeSVG
              value="https://gitsim.syzzhd.web.id"
              size={100}
              bgColor="#ffffff"
              fgColor="#1E1B2E"
              level="M"
            />
            <div
              className="text-[10px] font-bold opacity-40"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Scan untuk akses
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="border-t-[2.5px] border-[#1E1B2E] py-4 text-center"
      >
        <p
          className="text-xs sm:text-sm opacity-40 flex items-center justify-center gap-2"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          <FaCodeBranch /> Pendidikan Teknik Informatika, Universitas Negeri Malang
        </p>
      </motion.div>
    </div>
  );
}
