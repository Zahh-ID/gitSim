"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props { step: number }

const spring = { type: "spring" as const, stiffness: 290, damping: 22 };
const heavySpring = { type: "spring" as const, stiffness: 380, damping: 18 };

const COMMITS = [
  { hash: "j0k1l2", short: "j0k1l2", msg: "Add login feature", author: "zahh", date: "3 hours ago",   color: "#22C55E" },
  { hash: "g7h8i9", short: "g7h8i9", msg: "Fix navbar bug",    author: "zahh", date: "1 day ago",     color: "#3B82F6" },
  { hash: "a1b2c3", short: "a1b2c3", msg: "Initial commit",    author: "zahh", date: "2 days ago",    color: "#3B82F6" },
];

const LOG_S0_TOOLTIPS = [
  { fill: "#22C55E", label: "j0k1l2", tip: "Add login feature",   tx: 210, ty: 18  },
  { fill: "#3B82F6", label: "g7h8i9", tip: "Fix navbar bug",      tx: 210, ty: 73  },
  { fill: "#3B82F6", label: "a1b2c3", tip: "Initial commit",      tx: 210, ty: 128 },
];
const LOG_S1_TOOLTIPS = [
  { fill: "#94A3B8", label: "verbose",   tip: "Format lengkap",      tx: 97,  ty: 4  },
  { fill: "#06B6D4", label: "--oneline", tip: "Format ringkas",       tx: 210, ty: 68 },
  { fill: "#06B6D4", label: "--oneline", tip: "Hash + pesan singkat", tx: 327, ty: 4  },
];
const LOG_S2_TOOLTIPS = [
  { fill: "#22C55E", label: "j0k1l2",   tip: "HEAD, main branch",    tx: 210, ty: 20 },
  { fill: "#3B82F6", label: "g7h8i9",   tip: "Fix navbar bug",       tx: 210, ty: 35 },
  { fill: "#A855F7", label: "b2c3d4",   tip: "Feature branch",       tx: 210, ty: 65 },
  { fill: "#3B82F6", label: "a1b2c3",   tip: "Initial commit",       tx: 210, ty: 95 },
  { fill: "#3B82F6", label: "000000",   tip: "First file",           tx: 210, ty: 125 },
];
const LOG_S3_TOOLTIPS = [
  { fill: "#FFD93D", label: "git diff",         tip: "WD vs last commit",      tx: 110, ty: 0  },
  { fill: "#FF6B35", label: "diff --staged",    tip: "Staging vs last commit", tx: 110, ty: 43 },
  { fill: "#A855F7", label: "diff branch",      tip: "Beda antar branch",      tx: 110, ty: 86 },
];

export default function LogScene({ step }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-center justify-center w-full py-4">
      <svg viewBox="0 0 420 230" className="w-full max-w-md" style={{ overflow: "visible" }}>

        {/* ── Step 0: git log output ────────────────────────────── */}
        {step === 0 && (
          <motion.g key="s0">
            <motion.g initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
              <rect x="70" y="8" width="140" height="22" rx="7" fill="#1E1B2E" />
              <text x="140" y="22" textAnchor="middle"
                fill="#FFD93D" fontSize="10" fontFamily="monospace"
              >$ git log</text>
            </motion.g>

            <motion.rect x="20" y="38" width="380" height="185" rx="10"
              fill="#1E1B2E"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring, delay: 0.25 }}
              style={{ originX: "210px", originY: "130px" }}
            />

            {COMMITS.map((c, i) => (
              <motion.g key={c.hash}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.28 }}
              >
                <text x="36" y={58 + i * 55} fill="#F59E0B" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  commit {c.hash}
                </text>
                <text x="36" y={70 + i * 55} fill="#94A3B8" fontSize="7.5" fontFamily="monospace">
                  Author: {c.author}
                </text>
                <text x="36" y={82 + i * 55} fill="#94A3B8" fontSize="7.5" fontFamily="monospace">
                  Date:   {c.date}
                </text>
                <text x="50" y={93 + i * 55} fill="white" fontSize="8" fontFamily="monospace">
                  {c.msg}
                </text>
                {i < COMMITS.length - 1 && (
                  <line x1="36" y1={100 + i * 55} x2="380" y2={100 + i * 55}
                    stroke="#ffffff18" strokeWidth="1"
                  />
                )}
                <rect x={36} y={48 + i * 55} width={344} height={50} fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </motion.g>
            ))}
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = LOG_S0_TOOLTIPS[hovered];
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

        {/* ── Step 1: --oneline comparison ─────────────────────── */}
        {step === 1 && (
          <motion.g key="s1">
            {/* Left: verbose (faded) */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ duration: 0.4 }}
              onMouseEnter={() => setHovered(0)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}
            >
              <rect x="15" y="20" width="165" height="195" rx="8" fill="#1E1B2E" />
              <text x="97" y="40" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="monospace">verbose</text>
              {COMMITS.map((c, i) => (
                <g key={c.hash}>
                  <text x="26" y={55 + i * 55} fill="#F59E0B" fontSize="6.5" fontFamily="monospace">commit {c.hash}</text>
                  <text x="26" y={65 + i * 55} fill="#94A3B8" fontSize="6.5" fontFamily="monospace">Author: {c.author}</text>
                  <text x="26" y={75 + i * 55} fill="#94A3B8" fontSize="6.5" fontFamily="monospace">Date: {c.date}</text>
                  <text x="35" y={85 + i * 55} fill="white" fontSize="7" fontFamily="monospace">{c.msg}</text>
                </g>
              ))}
            </motion.g>

            {/* Arrow */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}
            >
              <rect x="180" y="100" width="60" height="24" rx="8" fill="#06B6D4" />
              <text x="210" y="115" textAnchor="middle"
                fill="white" fontSize="8" fontFamily="monospace" fontWeight="700"
              >--oneline</text>
              <path d="M 190 112 L 175 112" fill="none" stroke="#06B6D4" strokeWidth="2"
                markerEnd="url(#arrL)" />
              <path d="M 240 112 L 248 112" fill="none" stroke="#06B6D4" strokeWidth="2"
                markerEnd="url(#arrL)" />
            </motion.g>

            {/* Right: oneline (bright) */}
            <motion.g initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ ...spring, delay: 0.6 }}
              onMouseEnter={() => setHovered(2)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}
            >
              <rect x="250" y="20" width="155" height="195" rx="8" fill="#1E1B2E" />
              <text x="327" y="40" textAnchor="middle" fill="#06B6D4" fontSize="8" fontFamily="monospace" fontWeight="700">--oneline</text>
              {COMMITS.map((c, i) => (
                <motion.g key={c.hash}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + i * 0.2 }}
                >
                  <text x="264" y={65 + i * 38} fill={c.color} fontSize="8" fontFamily="monospace" fontWeight="bold">
                    {c.short.slice(0, 7)}
                  </text>
                  <text x="308" y={65 + i * 38} fill="white" fontSize="8" fontFamily="monospace">
                    {c.msg.slice(0, 18)}
                  </text>
                </motion.g>
              ))}
            </motion.g>

            <AnimatePresence>
              {hovered !== null && (() => {
                const t = LOG_S1_TOOLTIPS[hovered];
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
            <defs>
              <marker id="arrL" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#06B6D4" />
              </marker>
            </defs>
          </motion.g>
        )}

        {/* ── Step 2: --graph visualization ────────────────────── */}
        {step === 2 && (
          <motion.g key="s2">
            <motion.g initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
              <rect x="30" y="8" width="260" height="22" rx="7" fill="#1E1B2E" />
              <text x="160" y="22" textAnchor="middle"
                fill="#FFD93D" fontSize="9" fontFamily="monospace"
              >$ git log --graph --oneline --all</text>
            </motion.g>

            <motion.rect x="20" y="38" width="380" height="185" rx="10"
              fill="#1E1B2E"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring, delay: 0.25 }}
              style={{ originX: "210px", originY: "130px" }}
            />

            {/* ASCII graph lines */}
            {[
              { y: 60,  ast: "*", bar: " ", hash: "j0k1l2", msg: "(HEAD, main) Add login feature", color: "#22C55E" },
              { y: 75,  ast: "*", bar: " ", hash: "g7h8i9", msg: "Fix navbar bug",                  color: "#3B82F6" },
              { y: 90,  ast: "|", bar: "\\",hash: "      ", msg: "",                                 color: "#94A3B8" },
              { y: 105, ast: "*", bar: "|", hash: "b2c3d4", msg: "(feature) Add sidebar",            color: "#A855F7" },
              { y: 120, ast: "|", bar: "|", hash: "      ", msg: "",                                 color: "#94A3B8" },
              { y: 135, ast: "*", bar: "|", hash: "a1b2c3", msg: "Initial commit",                   color: "#3B82F6" },
              { y: 150, ast: " ", bar: "/", hash: "      ", msg: "",                                 color: "#94A3B8" },
              { y: 165, ast: "*", bar: " ", hash: "000000", msg: "First file",                       color: "#3B82F6" },
            ].map((line, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.5 + i * 0.1 }}
              >
                <text x="36" y={line.y} fill={line.color} fontSize="9" fontFamily="monospace">
                  {line.ast}
                </text>
                <text x="48" y={line.y} fill="#94A3B8" fontSize="9" fontFamily="monospace">
                  {line.bar}
                </text>
                {line.hash.trim() && (
                  <>
                    <text x="60" y={line.y} fill={line.color} fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                      {line.hash}
                    </text>
                    <text x="110" y={line.y} fill="white" fontSize="8" fontFamily="monospace">
                      {line.msg}
                    </text>
                  </>
                )}
              </motion.g>
            ))}
            {[
              { i: 0, y: 60 },
              { i: 1, y: 75 },
              { i: 2, y: 105 },
              { i: 3, y: 135 },
              { i: 4, y: 165 },
            ].map(({ i, y }) => (
              <rect key={i} x={36} y={y - 10} width={344} height={14} fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = LOG_S2_TOOLTIPS[hovered];
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

        {/* ── Step 3: git diff deep ─────────────────────────────── */}
        {step === 3 && (
          <motion.g key="s3">
            <motion.text x="210" y="20" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
              transition={{ duration: 0.3 }}
            >Tiga Variant git diff</motion.text>

            {/* Three diff command pills */}
            {[
              { cmd: "git diff",          desc: "WD vs last commit",        color: "#FFD93D", y: 32 },
              { cmd: "git diff --staged", desc: "Staging vs last commit",   color: "#FF6B35", y: 75 },
              { cmd: "git diff main..feature", desc: "Beda antar branch",   color: "#A855F7", y: 118 },
            ].map((item, i) => (
              <motion.g key={item.cmd}
                initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.35, delay: i * 0.2 }}
              >
                <rect x="20" y={item.y} width="380" height="35" rx="8"
                  fill={item.color + "18"} stroke={item.color} strokeWidth="2" />
                <rect x="20" y={item.y} width="180" height="35" rx="8" fill={item.color} />
                <text x="110" y={item.y + 22} textAnchor="middle"
                  fill="#1E1B2E" fontSize="8.5" fontFamily="monospace" fontWeight="700"
                >$ {item.cmd}</text>
                <text x="220" y={item.y + 22}
                  fill="#1E1B2E" fontSize="8.5" fontFamily="var(--font-nunito)" fontWeight="600"
                >↳ {item.desc}</text>
                <rect x={20} y={item.y} width={380} height={35} rx="8" fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </motion.g>
            ))}
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = LOG_S3_TOOLTIPS[hovered];
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

            {/* Diff output preview */}
            <motion.rect x="20" y="165" width="380" height="58" rx="8"
              fill="#1E1B2E"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            />
            {[
              { text: "--- a/app.js", color: "#EF4444", y: 182 },
              { text: "+++ b/app.js", color: "#22C55E", y: 193 },
              { text: "- console.log('bug')", color: "#EF4444", y: 204 },
              { text: "+ console.log('fix')", color: "#22C55E", y: 215 },
            ].map((line, i) => (
              <motion.text key={i} x="36" y={line.y}
                fill={line.color} fontSize="7.5" fontFamily="monospace"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.0 + i * 0.1 }}
              >{line.text}</motion.text>
            ))}
          </motion.g>
        )}
      </svg>
    </div>
  );
}
