"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props { step: number }

const spring = { type: "spring" as const, stiffness: 290, damping: 22 };

const GITIGNORE_S0_TOOLTIPS = [
  { fill: "#22C55E", label: "index.html", tip: "Di-track Git",        tx: 95,  ty: 52  },
  { fill: "#22C55E", label: "style.css",  tip: "Di-track Git",        tx: 95,  ty: 94  },
  { fill: "#22C55E", label: "app.js",     tip: "Di-track Git",        tx: 95,  ty: 136 },
  { fill: "#EF4444", label: ".gitignore", tip: "Filter file ignored", tx: 210, ty: 84  },
  { fill: "#94A3B8", label: ".env",       tip: "Di-ignore",           tx: 325, ty: 52  },
  { fill: "#94A3B8", label: "node_mods/", tip: "Di-ignore (besar)",   tx: 325, ty: 94  },
  { fill: "#94A3B8", label: "dist/",      tip: "Di-ignore",           tx: 325, ty: 136 },
];
const GITIGNORE_S1_TOOLTIPS = [
  { fill: "#EF4444", label: ".gitignore", tip: "File konfigurasi",    tx: 115, ty: -8  },
  { fill: "#EF4444", label: "ignore",     tip: "File/folder ini",     tx: 248, ty: 38  },
  { fill: "#F59E0B", label: "wildcard",   tip: "Cocokkan pola *",     tx: 248, ty: 74  },
  { fill: "#22C55E", label: "negasi !",   tip: "Jangan ignore ini",   tx: 248, ty: 110 },
  { fill: "#94A3B8", label: "komentar",   tip: "Diawali dengan #",    tx: 248, ty: 146 },
];
const GITIGNORE_S2_TOOLTIPS = [
  { fill: "#EF4444", label: "node_mods/", tip: "Terlalu besar",       tx: 75,  ty: 8   },
  { fill: "#F59E0B", label: ".env",       tip: "Berisi secret!",      tx: 215, ty: 8   },
  { fill: "#94A3B8", label: "*.log",      tip: "Log otomatis",        tx: 355, ty: 8   },
  { fill: "#A855F7", label: "dist/",      tip: "Build artifact",      tx: 75,  ty: 98  },
  { fill: "#94A3B8", label: ".DS_Store",  tip: "File macOS",          tx: 215, ty: 98  },
  { fill: "#06B6D4", label: "__pycache__",tip: "Python cache",        tx: 355, ty: 98  },
];
const GITIGNORE_S3_TOOLTIPS = [
  { fill: "#22C55E", label: "Step 1",     tip: "touch .gitignore",    tx: 50,  ty: 26  },
  { fill: "#F59E0B", label: "Step 2",     tip: "Tambah pattern",      tx: 50,  ty: 81  },
  { fill: "#FF6B35", label: "Step 3",     tip: "git add .gitignore",  tx: 50,  ty: 136 },
  { fill: "#3B82F6", label: "Step 4",     tip: "git commit!",         tx: 50,  ty: 171 },
];

export default function GitignoreScene({ step }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-center justify-center w-full py-4">
      <svg viewBox="0 0 420 230" className="w-full max-w-md" style={{ overflow: "visible" }}>

        {/* ── Step 0: Tracked vs Ignored files ──────────────────── */}
        {step === 0 && (
          <motion.g key="s0">
            {/* Tracked side */}
            <motion.g initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ ...spring }}
            >
              <rect x="20" y="35" width="150" height="165" rx="10"
                fill="#22C55E1A" stroke="#22C55E" strokeWidth="2.5" />
              <text x="95" y="55" textAnchor="middle"
                fill="#22C55E" fontSize="9" fontFamily="var(--font-nunito)" fontWeight="800"
              >✓ Di-track Git</text>
              {["index.html", "style.css", "app.js"].map((f, i) => (
                <motion.g key={f}
                  initial={{ x: -8, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.15 }}
                >
                  <rect x="36" y={68 + i * 42} width="118" height="30" rx="6"
                    fill="#22C55E" stroke="#1E1B2E" strokeWidth="1.5" />
                  <text x="95" y={88 + i * 42} textAnchor="middle"
                    fill="white" fontSize="8.5" fontFamily="monospace" fontWeight="600"
                  >{f}</text>
                  <rect x={36} y={68 + i * 42} width={118} height={30} rx="6" fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  />
                </motion.g>
              ))}
            </motion.g>

            {/* Shield in center */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring, delay: 0.6 }}
              style={{ originX: "210px", originY: "118px", cursor: "pointer" }}
              onMouseEnter={() => setHovered(3)}
              onMouseLeave={() => setHovered(null)}
            >
              <path d="M210 90 L226 100 L226 128 Q210 138 194 128 L194 100 Z"
                fill="#EF4444" stroke="#1E1B2E" strokeWidth="2.5" />
              <text x="210" y="117" textAnchor="middle"
                fill="white" fontSize="10" fontFamily="monospace" fontWeight="bold"
              >🚫</text>
              <text x="210" y="148" textAnchor="middle"
                fill="#EF4444" fontSize="7.5" fontFamily="var(--font-nunito)" fontWeight="700"
              >.gitignore</text>
            </motion.g>

            {/* Ignored side */}
            <motion.g initial={{ x: 12, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ ...spring, delay: 0.2 }}
            >
              <rect x="250" y="35" width="150" height="165" rx="10"
                fill="#EF44441A" stroke="#EF4444" strokeWidth="2.5" />
              <text x="325" y="55" textAnchor="middle"
                fill="#EF4444" fontSize="9" fontFamily="var(--font-nunito)" fontWeight="800"
              >✗ Di-ignore</text>
              {[".env", "node_modules/", "dist/"].map((f, i) => (
                <motion.g key={f}
                  initial={{ x: 8, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.15 }}
                >
                  <rect x="266" y={68 + i * 42} width="118" height="30" rx="6"
                    fill="#94A3B833" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="325" y={88 + i * 42} textAnchor="middle"
                    fill="#94A3B8" fontSize="8" fontFamily="monospace"
                  >{f}</text>
                  <rect x={266} y={68 + i * 42} width={118} height={30} rx="6" fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovered(i + 4)}
                    onMouseLeave={() => setHovered(null)}
                  />
                </motion.g>
              ))}
            </motion.g>

            <AnimatePresence>
              {hovered !== null && (() => {
                const t = GITIGNORE_S0_TOOLTIPS[hovered];
                const w = 110;
                return (
                  <motion.g key={hovered}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }}
                  >
                    <rect x={t.tx - w / 2} y={t.ty} width={w} height={30} rx="6"
                      fill={t.fill} stroke="#1E1B2E" strokeWidth="1.5" />
                    <text x={t.tx} y={t.ty + 11} textAnchor="middle"
                      fill="white" fontSize="9" fontFamily="monospace" fontWeight="bold"
                    >{t.label}</text>
                    <text x={t.tx} y={t.ty + 23} textAnchor="middle"
                      fill="white" fontSize="8" fontFamily="var(--font-nunito)" opacity="0.85"
                    >{t.tip}</text>
                  </motion.g>
                );
              })()}
            </AnimatePresence>
          </motion.g>
        )}

        {/* ── Step 1: Pattern lines ──────────────────────────────── */}
        {step === 1 && (
          <motion.g key="s1">
            {/* .gitignore file card */}
            <motion.g initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ ...spring }}
              onMouseEnter={() => setHovered(0)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <rect x="30" y="20" width="170" height="190" rx="10"
                fill="#EF44441A" stroke="#EF4444" strokeWidth="2.5" />
              {/* Tab */}
              <rect x="30" y="20" width="80" height="20" rx="5"
                fill="#EF4444" />
              <text x="70" y="33" textAnchor="middle"
                fill="white" fontSize="8.5" fontFamily="monospace" fontWeight="700"
              >.gitignore</text>
            </motion.g>

            {/* Pattern lines appearing */}
            {[
              { text: "# Dependency folder",  color: "#94A3B8", y: 60  },
              { text: "node_modules/",         color: "#EF4444", y: 76  },
              { text: "",                      color: "#94A3B8", y: 88  },
              { text: "# Environment files",  color: "#94A3B8", y: 100 },
              { text: ".env",                 color: "#EF4444", y: 116 },
              { text: "",                      color: "#94A3B8", y: 128 },
              { text: "# Wildcard pattern",   color: "#94A3B8", y: 140 },
              { text: "*.log",                color: "#F59E0B", y: 156 },
              { text: "",                      color: "#94A3B8", y: 168 },
              { text: "# Negation: keep this",color: "#94A3B8", y: 180 },
              { text: "!important.log",       color: "#22C55E", y: 196 },
            ].map((line, i) => line.text ? (
              <motion.text key={i} x="46" y={line.y}
                fill={line.color} fontSize="8" fontFamily="monospace"
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.35 + i * 0.1 }}
              >{line.text}</motion.text>
            ) : null)}

            {/* Legend */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              <rect x="230" y="30" width="160" height="175" rx="10"
                fill="#FFF9F0" stroke="#1E1B2E" strokeWidth="2" />
              <text x="310" y="50" textAnchor="middle"
                fill="#1E1B2E" fontSize="9" fontFamily="var(--font-nunito)" fontWeight="800"
              >Keterangan</text>
              {[
                { color: "#EF4444", text: "→ ignore file/folder" },
                { color: "#F59E0B", text: "→ wildcard (*)" },
                { color: "#22C55E", text: "→ negasi (!) — keep" },
                { color: "#94A3B8", text: "→ komentar (#)" },
              ].map((item, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 + i * 0.12 }}
                >
                  <circle cx="248" cy={70 + i * 36} r="6" fill={item.color} />
                  <text x="260" y={74 + i * 36}
                    fill="#1E1B2E" fontSize="8" fontFamily="var(--font-nunito)" fontWeight="600"
                  >{item.text}</text>
                  <circle cx={248} cy={70 + i * 36} r={12} fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovered(i + 1)}
                    onMouseLeave={() => setHovered(null)}
                  />
                </motion.g>
              ))}
            </motion.g>

            <AnimatePresence>
              {hovered !== null && (() => {
                const t = GITIGNORE_S1_TOOLTIPS[hovered];
                const w = 110;
                return (
                  <motion.g key={hovered}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }}
                  >
                    <rect x={t.tx - w / 2} y={t.ty} width={w} height={30} rx="6"
                      fill={t.fill} stroke="#1E1B2E" strokeWidth="1.5" />
                    <text x={t.tx} y={t.ty + 11} textAnchor="middle"
                      fill="white" fontSize="9" fontFamily="monospace" fontWeight="bold"
                    >{t.label}</text>
                    <text x={t.tx} y={t.ty + 23} textAnchor="middle"
                      fill="white" fontSize="8" fontFamily="var(--font-nunito)" opacity="0.85"
                    >{t.tip}</text>
                  </motion.g>
                );
              })()}
            </AnimatePresence>
          </motion.g>
        )}

        {/* ── Step 2: Common files to ignore ────────────────────── */}
        {step === 2 && (
          <motion.g key="s2">
            <motion.text x="210" y="22" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
              transition={{ duration: 0.3 }}
            >File yang Sebaiknya Di-ignore</motion.text>

            {[
              { label: "node_modules/", reason: "Terlalu besar",    color: "#EF4444", x: 20,  y: 40 },
              { label: ".env",          reason: "Berisi secret",    color: "#F59E0B", x: 160, y: 40 },
              { label: "*.log",         reason: "Log otomatis",     color: "#94A3B8", x: 300, y: 40 },
              { label: "dist/",         reason: "Build artifact",   color: "#A855F7", x: 20,  y: 130 },
              { label: ".DS_Store",     reason: "File macOS",       color: "#94A3B8", x: 160, y: 130 },
              { label: "__pycache__/",  reason: "Python cache",     color: "#06B6D4", x: 300, y: 130 },
            ].map((item, i) => (
              <motion.g key={item.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...spring, delay: i * 0.13 }}
                style={{ originX: `${item.x + 55}px`, originY: `${item.y + 40}px` }}
              >
                <rect x={item.x} y={item.y} width={110} height={75} rx="10"
                  fill={item.color + "1A"} stroke={item.color} strokeWidth="2.5" />
                <text x={item.x + 55} y={item.y + 28} textAnchor="middle"
                  fill={item.color} fontSize="8.5" fontFamily="monospace" fontWeight="700"
                >{item.label}</text>
                {/* X badge */}
                <circle cx={item.x + 95} cy={item.y + 15} r="11" fill="#EF4444" stroke="white" strokeWidth="1.5" />
                <text x={item.x + 95} y={item.y + 19} textAnchor="middle"
                  fill="white" fontSize="10" fontFamily="monospace" fontWeight="bold"
                >✗</text>
                <text x={item.x + 55} y={item.y + 52} textAnchor="middle"
                  fill="#1E1B2E" fontSize="7.5" fontFamily="var(--font-nunito)"
                >{item.reason}</text>
                <rect x={item.x} y={item.y} width={110} height={75} rx="10" fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </motion.g>
            ))}

            <AnimatePresence>
              {hovered !== null && (() => {
                const t = GITIGNORE_S2_TOOLTIPS[hovered];
                const w = 110;
                return (
                  <motion.g key={hovered}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }}
                  >
                    <rect x={t.tx - w / 2} y={t.ty} width={w} height={30} rx="6"
                      fill={t.fill} stroke="#1E1B2E" strokeWidth="1.5" />
                    <text x={t.tx} y={t.ty + 11} textAnchor="middle"
                      fill="white" fontSize="9" fontFamily="monospace" fontWeight="bold"
                    >{t.label}</text>
                    <text x={t.tx} y={t.ty + 23} textAnchor="middle"
                      fill="white" fontSize="8" fontFamily="var(--font-nunito)" opacity="0.85"
                    >{t.tip}</text>
                  </motion.g>
                );
              })()}
            </AnimatePresence>
          </motion.g>
        )}

        {/* ── Step 3: How to create .gitignore ──────────────────── */}
        {step === 3 && (
          <motion.g key="s3">
            <motion.text x="210" y="22" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
              transition={{ duration: 0.3 }}
            >Cara Membuat .gitignore</motion.text>

            {[
              { step: "1", cmd: 'touch .gitignore',          desc: "Buat file .gitignore",        color: "#22C55E", y: 40  },
              { step: "2", cmd: 'echo "node_modules/" >> .gitignore', desc: "Tambahkan pattern", color: "#F59E0B", y: 95  },
              { step: "3", cmd: 'git add .gitignore',         desc: "Stage file",                  color: "#FF6B35", y: 150 },
              { step: "4", cmd: 'git commit -m "Add .gitignore"', desc: "Commit!",                color: "#3B82F6", y: 185 },
            ].map((item, i) => (
              <motion.g key={i}
                initial={{ x: -15, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.35, delay: i * 0.22 }}
              >
                <circle cx="50" cy={item.y + 20} r="14" fill={item.color} stroke="#1E1B2E" strokeWidth="2" />
                <text x="50" y={item.y + 24} textAnchor="middle"
                  fill="white" fontSize="10" fontFamily="var(--font-fredoka)" fontWeight="700"
                >{item.step}</text>
                <rect x="75" y={item.y + 8} width="300" height="24" rx="7" fill="#1E1B2E" />
                <text x="90" y={item.y + 24}
                  fill="#FFD93D" fontSize="8.5" fontFamily="monospace"
                >$ {item.cmd}</text>
                <text x="90" y={item.y + 40}
                  fill="#94A3B8" fontSize="7.5" fontFamily="var(--font-nunito)"
                >↳ {item.desc}</text>
                {/* Connector line */}
                {i < 3 && (
                  <motion.line x1="50" y1={item.y + 34} x2="50" y2={item.y + 55}
                    stroke={item.color} strokeWidth="2" strokeDasharray="3 2" opacity="0.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.22 + 0.3 }}
                  />
                )}
                <rect x={30} y={item.y + 8} width={350} height={24} rx="7" fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </motion.g>
            ))}

            <AnimatePresence>
              {hovered !== null && (() => {
                const t = GITIGNORE_S3_TOOLTIPS[hovered];
                const w = 110;
                return (
                  <motion.g key={hovered}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }}
                  >
                    <rect x={t.tx - w / 2} y={t.ty} width={w} height={30} rx="6"
                      fill={t.fill} stroke="#1E1B2E" strokeWidth="1.5" />
                    <text x={t.tx} y={t.ty + 11} textAnchor="middle"
                      fill="white" fontSize="9" fontFamily="monospace" fontWeight="bold"
                    >{t.label}</text>
                    <text x={t.tx} y={t.ty + 23} textAnchor="middle"
                      fill="white" fontSize="8" fontFamily="var(--font-nunito)" opacity="0.85"
                    >{t.tip}</text>
                  </motion.g>
                );
              })()}
            </AnimatePresence>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
