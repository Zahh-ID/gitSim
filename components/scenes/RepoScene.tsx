"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SiGit } from "react-icons/si";

interface Props { step: number }

// SVG folder shape centered at (cx, cy)
function FolderSvg({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <rect x={cx - 16} y={cy - 22} width={20} height={9} rx="3" fill={color} stroke="#1E1B2E" strokeWidth="1.5" />
      <rect x={cx - 22} y={cy - 14} width={44} height={30} rx="5" fill={color} stroke="#1E1B2E" strokeWidth="1.5" />
    </g>
  );
}

const spring = { type: "spring" as const, stiffness: 300, damping: 22 };
const softSpring = { type: "spring" as const, stiffness: 200, damping: 24 };

const REPO_S1_TOOLTIPS = [
  { fill: "#FFD93D", label: "folder biasa", tip: "Tidak terlacak Git",   tx: 93,  ty: 34 },
  { fill: "#FF6B35", label: "repository",   tip: "Ada folder .git",      tx: 307, ty: 34 },
  { fill: "#F14E32", label: ".git badge",   tip: "Tanda repo Git aktif", tx: 340, ty: 60 },
];
const REPO_S2_TOOLTIPS = [
  { fill: "#F14E32", label: ".git/",        tip: "Folder tersembunyi",   tx: 200, ty: 44 },
];
const REPO_S3_TOOLTIPS = [
  { fill: "#F14E32", label: ".git/",        tip: "Root folder git",      tx: 55,  ty: 4  },
  { fill: "#FFD93D", label: "HEAD",         tip: "Branch aktif",         tx: 210, ty: 46 },
  { fill: "#FF6B35", label: "config",       tip: "Konfigurasi repo",     tx: 210, ty: 76 },
  { fill: "#FF6B9D", label: "objects/",     tip: "Blob, tree, commit",   tx: 210, ty: 106 },
  { fill: "#A855F7", label: "refs/",        tip: "Branch & tags",        tx: 210, ty: 136 },
  { fill: "#3B82F6", label: "COMMIT_MSG",   tip: "Pesan commit terakhir",tx: 210, ty: 166 },
];

export default function RepoScene({ step }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  /* ── Step 0: Git logo (HTML layout, uses real SiGit icon) ── */
  if (step === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-5 border-[2.5px] border-[#1E1B2E]"
          style={{ background: "#F14E32", boxShadow: "4px 4px 0px #1E1B2E" }}
        >
          <SiGit style={{ fontSize: "5rem", color: "white" }} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-base font-bold text-[#1E1B2E]"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Version Control System
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full py-4">
      <svg viewBox="0 0 400 220" className="w-full max-w-md" style={{ overflow: "visible" }}>

        {/* ── Step 1: Folder biasa vs Repository ───────────────────── */}
        {step === 1 && (
          <motion.g key="s1" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
            {/* Left folder */}
            <motion.g initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ ...softSpring, delay: 0 }}>
              <rect x="28" y="62" width="130" height="100" rx="10"
                fill="#FFF8E1" stroke="#1E1B2E" strokeWidth="2.5" />
              <rect x="28" y="48" width="55" height="22" rx="6"
                fill="#FFD93D" stroke="#1E1B2E" strokeWidth="2.5" />
              <FolderSvg cx={93} cy={107} color="#FFD93D" />
              <motion.text x="93" y="148" textAnchor="middle"
                fill="#1E1B2E" fontSize="11" fontFamily="var(--font-nunito)" fontWeight="700"
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >folder biasa</motion.text>
              <motion.text x="93" y="162" textAnchor="middle"
                fill="#1E1B2E" fontSize="9" fontFamily="var(--font-nunito)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.45 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >tidak terlacak</motion.text>
              <rect x={28} y={48} width={130} height={114} rx="10" fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(0)} onMouseLeave={() => setHovered(null)} />
            </motion.g>

            {/* VS */}
            <motion.text x="200" y="116" textAnchor="middle"
              fill="#1E1B2E" fontSize="16" fontWeight="bold" fontFamily="var(--font-fredoka)"
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.6 }}
              transition={{ ...spring, delay: 0.3 }}
              style={{ originX: "200px", originY: "116px" }}
            >VS</motion.text>

            {/* Right folder */}
            <motion.g initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ ...softSpring, delay: 0.12 }}>
              <rect x="242" y="62" width="130" height="100" rx="10"
                fill="#FFF3EE" stroke="#FF6B35" strokeWidth="2.5" />
              <rect x="242" y="48" width="55" height="22" rx="6"
                fill="#FF6B35" stroke="#1E1B2E" strokeWidth="2.5" />
              <FolderSvg cx={307} cy={104} color="#FF6B35" />
              {/* .git badge pops in */}
              <motion.g
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.7 }}
                style={{ originX: "343px", originY: "98px", cursor: "pointer" }}
                onMouseEnter={() => setHovered(2)} onMouseLeave={() => setHovered(null)}
              >
                <rect x="320" y="88" width="40" height="18" rx="9" fill="#F14E32" />
                <text x="340" y="100" textAnchor="middle"
                  fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace"
                >.git</text>
              </motion.g>
              <motion.text x="307" y="148" textAnchor="middle"
                fill="#FF6B35" fontSize="11" fontFamily="var(--font-nunito)" fontWeight="700"
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >repository</motion.text>
              <motion.text x="307" y="162" textAnchor="middle"
                fill="#1E1B2E" fontSize="9" fontFamily="var(--font-nunito)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.45 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >terlacak Git</motion.text>
              <rect x={242} y={48} width={130} height={114} rx="10" fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)} />
            </motion.g>
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = REPO_S1_TOOLTIPS[hovered];
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

        {/* ── Step 2: git init ──────────────────────────────────────── */}
        {step === 2 && (
          <motion.g key="s2" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
            {/* Folder outline draws */}
            <motion.path
              d="M 100 40 L 100 180 Q 100 188 108 188 L 292 188 Q 300 188 300 180 L 300 60 Q 300 52 292 52 L 182 52 L 174 40 Z"
              fill="#FFF9F0" stroke="#1E1B2E" strokeWidth="2.5" strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
            {/* Folder name tab */}
            <motion.text x="130" y="50" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >my-project/</motion.text>

            {/* .git folder materializes inside */}
            <motion.g
              initial={{ scale: 0, y: 12 }} animate={{ scale: 1, y: 0 }}
              transition={{ ...spring, delay: 0.65 }}
              style={{ originX: "200px", originY: "118px", cursor: "pointer" }}
              onMouseEnter={() => setHovered(0)} onMouseLeave={() => setHovered(null)}
            >
              <rect x="148" y="82" width="104" height="50" rx="10"
                fill="#F14E32" stroke="#1E1B2E" strokeWidth="2.5" />
              <text x="200" y="111" textAnchor="middle"
                fill="white" fontSize="13" fontWeight="bold" fontFamily="monospace"
              >.git</text>
            </motion.g>

            {/* Expanding glow ring */}
            <motion.circle cx="200" cy="107" r="60"
              fill="none" stroke="#F14E32" strokeWidth="3"
              initial={{ scale: 0.6, opacity: 0.7 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
              style={{ originX: "200px", originY: "107px" }}
            />
            <motion.circle cx="200" cy="107" r="60"
              fill="none" stroke="#F14E32" strokeWidth="1.5"
              initial={{ scale: 0.6, opacity: 0.4 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.85, ease: "easeOut" }}
              style={{ originX: "200px", originY: "107px" }}
            />

            {/* Command box slides up */}
            <motion.g
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 1.1 }}
            >
              <rect x="108" y="192" width="184" height="22" rx="7" fill="#1E1B2E" />
              <text x="200" y="206" textAnchor="middle"
                fill="#FFD93D" fontSize="11" fontFamily="monospace"
              >$ git init</text>
            </motion.g>
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = REPO_S2_TOOLTIPS[hovered];
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

        {/* ── Step 3: .git structure tree ──────────────────────────── */}
        {step === 3 && (
          <motion.g key="s3" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
            {/* .git root badge */}
            <motion.g
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ ...spring }}
              style={{ originX: "55px", originY: "38px", cursor: "pointer" }}
              onMouseEnter={() => setHovered(0)} onMouseLeave={() => setHovered(null)}
            >
              <rect x="14" y="22" width="82" height="28" rx="8"
                fill="#F14E32" stroke="#1E1B2E" strokeWidth="2" />
              <text x="55" y="40" textAnchor="middle"
                fill="white" fontSize="12" fontWeight="bold" fontFamily="monospace"
              >.git/</text>
            </motion.g>

            {/* Tree items */}
            {[
              { label: "HEAD",           desc: "branch aktif",       y: 82,  color: "#FFD93D" },
              { label: "config",         desc: "konfigurasi repo",   y: 112, color: "#FF6B35" },
              { label: "objects/",       desc: "blob, tree, commit", y: 142, color: "#FF6B9D" },
              { label: "refs/",          desc: "branch & tags",      y: 172, color: "#A855F7" },
              { label: "COMMIT_EDITMSG", desc: "pesan commit",       y: 202, color: "#3B82F6" },
            ].map(({ label, desc, y, color }, i) => {
              const d = 0.18 + i * 0.14;
              return (
                <motion.g key={label}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.01, delay: d }}
                >
                  {/* vertical stem */}
                  <motion.line x1="55" y1="50" x2="55" y2={y + 5}
                    stroke="#1E1B2E" strokeWidth="1.5" opacity="0.2"
                    strokeDasharray="4 3"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.18, delay: d }}
                  />
                  {/* horizontal connector */}
                  <motion.line x1="55" y1={y + 5} x2="96" y2={y + 5}
                    stroke="#1E1B2E" strokeWidth="1.5" opacity="0.2"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.14, delay: d + 0.12 }}
                  />
                  {/* file box */}
                  <motion.g
                    initial={{ x: -18, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    transition={{ ...softSpring, delay: d + 0.22 }}
                  >
                    <rect x="96" y={y - 8} width="112" height="22" rx="6"
                      fill={color + "18"} stroke={color + "60"} strokeWidth="1.5" />
                    <text x="104" y={y + 6}
                      fill="#1E1B2E" fontSize="9.5" fontFamily="monospace" fontWeight="600"
                    >{label}</text>
                  </motion.g>
                  {/* description */}
                  <motion.text x="218" y={y + 6}
                    fill="#1E1B2E" fontSize="8.5" fontFamily="var(--font-nunito)" opacity="0.45"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.45 }}
                    transition={{ duration: 0.3, delay: d + 0.34 }}
                  >{desc}</motion.text>
                  <rect x={96} y={y - 8} width={222} height={22} fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovered(i + 1)}
                    onMouseLeave={() => setHovered(null)}
                  />
                </motion.g>
              );
            })}
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = REPO_S3_TOOLTIPS[hovered];
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
