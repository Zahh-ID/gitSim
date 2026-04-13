"use client";

/* eslint-disable @next/next/no-img-element */
import {
  FaFolder, FaSave, FaCodeBranch, FaCloud, FaTerminal,
  FaExchangeAlt, FaEyeSlash, FaUndo, FaHistory, FaTasks,
  FaChartBar, FaGlobe, FaCheckCircle,
} from "react-icons/fa";
import { VscGitMerge } from "react-icons/vsc";
import { HiSparkles, HiLightBulb } from "react-icons/hi";
import { QRCodeSVG } from "qrcode.react";

const FEATURES = [
  { Icon: FaFolder, label: "9 Modul", desc: "Animasi SVG bertahap", color: "#FFD93D" },
  { Icon: FaTerminal, label: "Git Simulator", desc: "Terminal tanpa instalasi", color: "#1E1B2E" },
  { Icon: FaTasks, label: "Tugas Praktik", desc: "Level Mudah–Sulit", color: "#FF6B35" },
  { Icon: FaCheckCircle, label: "36+ Kuis", desc: "Pilihan ganda per modul", color: "#22C55E" },
  { Icon: FaGlobe, label: "Bahasa Indonesia", desc: "Seluruh konten lokal", color: "#3B82F6" },
  { Icon: FaSave, label: "Auto-save", desc: "Progress via localStorage", color: "#A855F7" },
];

const MODULES = [
  { Icon: FaFolder, title: "Repositori", color: "#FFD93D" },
  { Icon: FaSave, title: "Commit", color: "#FF6B35" },
  { Icon: FaCodeBranch, title: "Branch", color: "#FF6B9D" },
  { Icon: VscGitMerge, title: "Merge", color: "#A855F7" },
  { Icon: FaCloud, title: "Remote", color: "#3B82F6" },
  { Icon: FaExchangeAlt, title: "Status", color: "#22C55E" },
  { Icon: FaEyeSlash, title: "Gitignore", color: "#EF4444" },
  { Icon: FaUndo, title: "Undo", color: "#F59E0B" },
  { Icon: FaHistory, title: "Log & Diff", color: "#06B6D4" },
];

const TECH = ["Next.js 16", "TypeScript", "Tailwind CSS", "Framer Motion", "GitHub Pages"];

const DT_STEPS = ["Empathize", "Define", "Ideate", "Prototype", "Test"];
const DT_COLORS = ["#FF6B35", "#FFD93D", "#22C55E", "#3B82F6", "#A855F7"];

function SectionTitle({ children, color = "#FF6B35" }: { children: React.ReactNode; color?: string }) {
  return (
    <h2
      className="text-[1.3rem] font-bold flex items-center gap-2 mb-3"
      style={{ fontFamily: "var(--font-fredoka)", color: "#1E1B2E" }}
    >
      <span className="w-1.5 h-6 rounded-full" style={{ background: color }} />
      {children}
    </h2>
  );
}

export default function PosterPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full opacity-10" style={{ background: "#FFD93D" }} />
      <div className="absolute bottom-[20%] left-[-40px] w-[150px] h-[150px] rounded-full" style={{ background: "#FF6B9D", opacity: 0.08 }} />
      <div className="absolute top-[45%] right-[-30px] w-[120px] h-[120px] rounded-full" style={{ background: "#3B82F6", opacity: 0.07 }} />

      <div className="max-w-[960px] mx-auto w-full px-6 py-8 flex flex-col gap-6 relative z-10 flex-1">

        {/* ====== HEADER ====== */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HiSparkles className="text-3xl" style={{ color: "#FFD93D" }} />
            <FaTerminal className="text-2xl" style={{ color: "#1E1B2E" }} />
            <HiSparkles className="text-3xl" style={{ color: "#FF6B35" }} />
          </div>
          <h1
            className="text-5xl sm:text-6xl font-bold text-[#1E1B2E] leading-none"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            GitSim
          </h1>
          <p
            className="text-2xl sm:text-3xl font-bold mt-1"
            style={{ fontFamily: "var(--font-fredoka)", color: "#FF6B35" }}
          >
            Belajar Git Itu Seru!
          </p>
          <p
            className="text-sm mt-2 opacity-65 max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Media Pembelajaran Git Interaktif untuk Siswa SMK/SMA
          </p>
        </div>

        {/* ====== 2-COLUMN: LATAR BELAKANG + METODE ====== */}
        <div className="grid grid-cols-2 gap-4">
          {/* Latar Belakang */}
          <div className="card-brutal p-4" style={{ background: "#FFF8E1" }}>
            <SectionTitle color="#FFD93D">
              <FaChartBar className="text-sm" style={{ color: "#FFD93D" }} />
              Latar Belakang
            </SectionTitle>
            <ul className="text-xs leading-relaxed space-y-1.5" style={{ fontFamily: "var(--font-nunito)" }}>
              <li className="flex gap-2">
                <span className="text-base font-bold leading-none" style={{ color: "#FF6B35", fontFamily: "var(--font-fredoka)" }}>73%</span>
                <span className="opacity-70">siswa SMK/SMA belum pernah menggunakan Git.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: "#FFD93D" }} />
                <span className="opacity-70">Dokumentasi resmi Git berbahasa Inggris dan terlalu teknis untuk pemula.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: "#FFD93D" }} />
                <span className="opacity-70">Tidak ada media pembelajaran Git berbahasa Indonesia yang interaktif dan visual.</span>
              </li>
            </ul>
          </div>

          {/* Metode Pengembangan */}
          <div className="card-brutal p-4" style={{ background: "#F0FFF4" }}>
            <SectionTitle color="#22C55E">
              <HiLightBulb className="text-sm" style={{ color: "#22C55E" }} />
              Metode Pengembangan
            </SectionTitle>
            <p className="text-xs opacity-70 mb-3" style={{ fontFamily: "var(--font-nunito)" }}>
              Design Thinking 5 tahap — berpusat pada kebutuhan nyata siswa SMK/SMA kelas XI–XII jurusan TKJ dan RPL.
            </p>
            <div className="flex items-center gap-1">
              {DT_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-1">
                  <div
                    className="text-[10px] font-bold px-2 py-1 rounded-md border-[1.5px] border-[#1E1B2E] text-center"
                    style={{ background: DT_COLORS[i] + "25", color: "#1E1B2E", fontFamily: "var(--font-nunito)" }}
                  >
                    {step}
                  </div>
                  {i < DT_STEPS.length - 1 && (
                    <span className="text-[10px] opacity-30">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ====== FITUR UTAMA ====== */}
        <div>
          <SectionTitle color="#FF6B35">Fitur Utama</SectionTitle>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="card-brutal p-3 flex flex-col items-center text-center"
                style={{ background: f.color + "12" }}
              >
                <f.Icon className="text-xl mb-1" style={{ color: f.color }} />
                <div className="text-xs font-bold" style={{ fontFamily: "var(--font-fredoka)", color: "#1E1B2E" }}>
                  {f.label}
                </div>
                <div className="text-[9px] opacity-55 leading-tight mt-0.5" style={{ fontFamily: "var(--font-nunito)" }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ====== MATERI (9 modules strip) ====== */}
        <div>
          <SectionTitle color="#A855F7">9 Modul Pembelajaran</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {MODULES.map((m, i) => (
              <div
                key={m.title}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-[1.5px] border-[#1E1B2E]"
                style={{ background: m.color + "18" }}
              >
                <span className="text-[10px] font-bold opacity-40" style={{ fontFamily: "var(--font-nunito)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <m.Icon className="text-sm" style={{ color: m.color }} />
                <span className="text-xs font-bold" style={{ fontFamily: "var(--font-nunito)", color: "#1E1B2E" }}>
                  {m.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ====== SCREENSHOTS ====== */}
        <div>
          <SectionTitle color="#3B82F6">Tampilan Produk</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            {[
              { src: "/ss-landing.png", label: "Landing Page" },
              { src: "/ss-commit.png", label: "Modul Commit" },
              { src: "/ss-simulator.png", label: "Git Simulator" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1.5">
                <div className="card-brutal overflow-hidden" style={{ background: "#fff" }}>
                  <img
                    src={s.src}
                    alt={s.label}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <span className="text-[10px] font-bold text-center opacity-50" style={{ fontFamily: "var(--font-nunito)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ====== 2-COLUMN: TEKNOLOGI + AKSES ====== */}
        <div className="grid grid-cols-2 gap-4">
          {/* Teknologi */}
          <div className="card-brutal p-4" style={{ background: "#EFF6FF" }}>
            <SectionTitle color="#3B82F6">Teknologi</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {TECH.map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-md border-[1.5px] border-[#1E1B2E]"
                  style={{ background: "#fff", fontFamily: "var(--font-nunito)", color: "#1E1B2E" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Akses Produk */}
          <div className="card-brutal p-4 flex items-center gap-4" style={{ background: "#FFF3EE" }}>
            <div className="flex-1">
              <SectionTitle color="#FF6B35">
                <FaGlobe className="text-sm" style={{ color: "#FF6B35" }} />
                Akses Produk
              </SectionTitle>
              <div
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-fredoka)", color: "#FF6B35" }}
              >
                gitsim.syzzhd.web.id
              </div>
              <p className="text-[10px] opacity-50 mt-1" style={{ fontFamily: "var(--font-nunito)" }}>
                Scan QR code atau kunjungi URL
              </p>
            </div>
            <div className="card-brutal p-2 shrink-0" style={{ background: "#fff" }}>
              <QRCodeSVG
                value="https://gitsim.syzzhd.web.id"
                size={80}
                bgColor="#ffffff"
                fgColor="#1E1B2E"
                level="M"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ====== FOOTER ====== */}
      <div className="border-t-[2.5px] border-[#1E1B2E] py-3 text-center">
        <p className="text-xs opacity-40" style={{ fontFamily: "var(--font-nunito)" }}>
          <FaCodeBranch className="inline mr-1" />
          Proyek PSBI — Pendidikan Teknik Informatika, Universitas Negeri Malang
        </p>
      </div>
    </div>
  );
}
