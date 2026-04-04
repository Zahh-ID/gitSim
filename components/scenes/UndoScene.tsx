"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props { step: number }

const spring = { type: "spring" as const, stiffness: 290, damping: 22 };
const heavySpring = { type: "spring" as const, stiffness: 380, damping: 18 };

function CommitNode({ cx, cy, color, label, delay }: { cx: number; cy: number; color: string; label: string; delay: number }) {
  return (
    <motion.g
      initial={{ scale: 0 }} animate={{ scale: 1 }}
      transition={{ ...heavySpring, delay }}
      style={{ originX: `${cx}px`, originY: `${cy}px` }}
    >
      <circle cx={cx} cy={cy} r="22" fill={color} opacity="0.15" />
      <circle cx={cx} cy={cy} r="16" fill={color} stroke="#1E1B2E" strokeWidth="2.5" />
      <text x={cx} y={cy + 4} textAnchor="middle"
        fill="white" fontSize="7" fontFamily="monospace" fontWeight="bold"
      >{label}</text>
    </motion.g>
  );
}

const UNDO_S0_TOOLTIPS = [
  { fill: "#3B82F6", label: "commit c1",    tip: "Commit pertama",        tx: 80,  ty: 44 },
  { fill: "#3B82F6", label: "commit c2",    tip: "Commit kedua",          tx: 180, ty: 44 },
  { fill: "#3B82F6", label: "commit c3",    tip: "Commit bermasalah",     tx: 290, ty: 44 },
  { fill: "#22C55E", label: "git restore",  tip: "Batalkan perubahan WD", tx: 110, ty: 133 },
  { fill: "#F59E0B", label: "git reset",    tip: "Mundurkan HEAD",        tx: 210, ty: 143 },
  { fill: "#EF4444", label: "git revert",   tip: "Buat commit balik",     tx: 310, ty: 133 },
];
const UNDO_S1_TOOLTIPS = [
  { fill: "#FFD93D", label: "Working Dir",  tip: "File yang diedit",      tx: 105, ty: 18 },
  { fill: "#FF6B35", label: "Staging Area", tip: "File yang di-stage",    tx: 315, ty: 18 },
];
const UNDO_S2_TOOLTIPS = [
  { fill: "#3B82F6", label: "commit c1",    tip: "Commit awal",           tx: 80,  ty: 16 },
  { fill: "#3B82F6", label: "commit c2",    tip: "Commit tengah",         tx: 180, ty: 16 },
  { fill: "#3B82F6", label: "commit c3",    tip: "HEAD aktif",            tx: 280, ty: 16 },
  { fill: "#22C55E", label: "--soft",        tip: "Staging tetap",        tx: 210, ty: 60 },
  { fill: "#F59E0B", label: "--mixed",       tip: "Staging dikosongkan",  tx: 210, ty: 105 },
  { fill: "#EF4444", label: "--hard",        tip: "Semua perubahan hilang",tx: 210, ty: 150 },
];
const UNDO_S3_TOOLTIPS = [
  { fill: "#3B82F6", label: "commit c1",    tip: "Commit awal",           tx: 60,  ty: 54 },
  { fill: "#3B82F6", label: "commit c2",    tip: "Commit kedua",          tx: 155, ty: 54 },
  { fill: "#EF4444", label: "commit c3",    tip: "Ada bug di sini",       tx: 250, ty: 54 },
  { fill: "#22C55E", label: "revert c3",    tip: "Undo tanpa hapus hist", tx: 345, ty: 54 },
];

export default function UndoScene({ step }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-center justify-center w-full py-4">
      <svg viewBox="0 0 420 230" className="w-full max-w-md" style={{ overflow: "visible" }}>

        {/* ── Step 0: Three undo paths ──────────────────────────── */}
        {step === 0 && (
          <motion.g key="s0">
            <motion.text x="210" y="22" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 0.65 }}
              transition={{ duration: 0.35 }}
            >Tiga Cara Membatalkan di Git</motion.text>

            {/* Commit nodes */}
            {[80, 180, 290].map((cx, i) => (
              <motion.g key={cx}>
                {i < 2 && (
                  <motion.line x1={cx + 18} y1={80} x2={cx + 82} y2={80}
                    stroke="#3B82F6" strokeWidth="2.5" opacity="0.4"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25, delay: i * 0.18 + 0.1 }}
                  />
                )}
                <CommitNode cx={cx} cy={80} color="#3B82F6" label={`c${i + 1}`} delay={i * 0.18} />
                <circle cx={cx} cy={80} r={22} fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </motion.g>
            ))}

            {/* X on last commit */}
            <motion.text x="290" y="50" textAnchor="middle"
              fill="#EF4444" fontSize="18" fontFamily="monospace"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ ...heavySpring, delay: 0.6 }}
              style={{ originX: "290px", originY: "50px" }}
            >✗</motion.text>

            {/* Three paths */}
            {[
              { label: "git restore", desc: "Batalkan perubahan file", color: "#22C55E", angle: -40, endX: 110, endY: 165 },
              { label: "git reset",   desc: "Mundurkan HEAD",          color: "#F59E0B", angle: 0,   endX: 210, endY: 175 },
              { label: "git revert",  desc: "Buat commit balik",       color: "#EF4444", angle: 40,  endX: 310, endY: 165 },
            ].map((path, i) => (
              <motion.g key={path.label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.8 + i * 0.15 }}
              >
                <motion.path
                  d={`M 290 100 Q ${290 + (path.endX - 290) / 2} 140 ${path.endX} ${path.endY - 20}`}
                  fill="none" stroke={path.color} strokeWidth="2" strokeDasharray="5 3"
                  markerEnd="url(#arrU)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }}
                />
                <rect x={path.endX - 55} y={path.endY} width={110} height={36} rx="7"
                  fill={path.color + "22"} stroke={path.color} strokeWidth="2" />
                <text x={path.endX} y={path.endY + 14} textAnchor="middle"
                  fill={path.color} fontSize="8.5" fontFamily="monospace" fontWeight="700"
                >{path.label}</text>
                <text x={path.endX} y={path.endY + 28} textAnchor="middle"
                  fill="#1E1B2E" fontSize="7.5" fontFamily="var(--font-nunito)"
                >{path.desc}</text>
                <rect x={path.endX - 55} y={path.endY} width={110} height={36} rx="7" fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i + 3)}
                  onMouseLeave={() => setHovered(null)}
                />
              </motion.g>
            ))}
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = UNDO_S0_TOOLTIPS[hovered];
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
              <marker id="arrU" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#1E1B2E" opacity="0.5" />
              </marker>
            </defs>
          </motion.g>
        )}

        {/* ── Step 1: git restore ───────────────────────────────── */}
        {step === 1 && (
          <motion.g key="s1">
            {/* WD Box */}
            <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring }}
              style={{ originX: "105px", originY: "100px" }}
              onMouseEnter={() => setHovered(0)} onMouseLeave={() => setHovered(null)}
            >
              <rect x="30" y="50" width="150" height="100" rx="10"
                fill="#FFD93D1A" stroke="#FFD93D" strokeWidth="2.5" />
              <text x="105" y="80" textAnchor="middle"
                fill="#1E1B2E" fontSize="9" fontFamily="var(--font-nunito)" fontWeight="800"
              >Working Directory</text>
              {/* Modified file */}
              <rect x="55" y="88" width="100" height="28" rx="6"
                fill="#F59E0B" stroke="#1E1B2E" strokeWidth="1.5" />
              <text x="105" y="106" textAnchor="middle"
                fill="white" fontSize="8" fontFamily="monospace"
              >app.js (modified)</text>
            </motion.g>

            {/* Staging Box */}
            <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring, delay: 0.15 }}
              style={{ originX: "315px", originY: "100px" }}
              onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)}
            >
              <rect x="240" y="50" width="150" height="100" rx="10"
                fill="#FF6B351A" stroke="#FF6B35" strokeWidth="2.5" />
              <text x="315" y="80" textAnchor="middle"
                fill="#1E1B2E" fontSize="9" fontFamily="var(--font-nunito)" fontWeight="800"
              >Staging Area</text>
              {/* Staged file */}
              <rect x="265" y="88" width="100" height="28" rx="6"
                fill="#FF6B35" stroke="#1E1B2E" strokeWidth="1.5" />
              <text x="315" y="106" textAnchor="middle"
                fill="white" fontSize="8" fontFamily="monospace"
              >style.css (staged)</text>
            </motion.g>

            {/* git restore: modified file reverts */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <rect x="60" y="165" width="160" height="20" rx="6" fill="#1E1B2E" />
              <text x="140" y="178" textAnchor="middle"
                fill="#22C55E" fontSize="8.5" fontFamily="monospace"
              >$ git restore app.js</text>
            </motion.g>

            {/* Arrow: modified → clean */}
            <motion.path d="M 105 116 Q 105 145 105 158"
              fill="none" stroke="#22C55E" strokeWidth="2" markerEnd="url(#arrU2)"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.9 }}
            />
            <motion.rect x="55" y="170" width="100" height="28" rx="6"
              fill="#22C55E" stroke="#1E1B2E" strokeWidth="1.5"
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ ...heavySpring, delay: 1.2 }}
              style={{ originX: "105px", originY: "184px" }}
            />
            <motion.text x="105" y="188" textAnchor="middle"
              fill="white" fontSize="8" fontFamily="monospace"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            >app.js (clean ✓)</motion.text>

            {/* git restore --staged */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              <rect x="195" y="165" width="190" height="20" rx="6" fill="#1E1B2E" />
              <text x="290" y="178" textAnchor="middle"
                fill="#22C55E" fontSize="7.5" fontFamily="monospace"
              >$ git restore --staged style.css</text>
            </motion.g>

            <AnimatePresence>
              {hovered !== null && (() => {
                const t = UNDO_S1_TOOLTIPS[hovered];
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
              <marker id="arrU2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#22C55E" />
              </marker>
            </defs>
          </motion.g>
        )}

        {/* ── Step 2: git reset modes ───────────────────────────── */}
        {step === 2 && (
          <motion.g key="s2">
            <motion.text x="210" y="20" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
              transition={{ duration: 0.35 }}
            >Mode git reset</motion.text>

            {/* Commit timeline */}
            {[80, 180, 280].map((cx, i) => (
              <motion.g key={cx}>
                {i < 2 && (
                  <line x1={cx + 18} y1={55} x2={cx + 82} y2={55}
                    stroke="#3B82F6" strokeWidth="2" opacity="0.3"
                  />
                )}
                <CommitNode cx={cx} cy={55} color="#3B82F6" label={`c${i + 1}`} delay={i * 0.12} />
                <circle cx={cx} cy={55} r={22} fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </motion.g>
            ))}
            <motion.text x="280" y="82" textAnchor="middle"
              fill="#1E1B2E" fontSize="7.5" fontFamily="monospace" opacity="0.5"
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.4 }}
            >← HEAD</motion.text>

            {/* Three modes */}
            {[
              { mode: "--soft",  desc: "HEAD mundur, staging tetap",      kept: ["Staging ✓", "WD ✓"],   color: "#22C55E", y: 95  },
              { mode: "--mixed", desc: "HEAD mundur, staging dikosongkan", kept: ["Staging ✗", "WD ✓"],   color: "#F59E0B", y: 140 },
              { mode: "--hard",  desc: "Semua perubahan hilang! ⚠",        kept: ["Staging ✗", "WD ✗"],   color: "#EF4444", y: 185 },
            ].map((item, i) => (
              <motion.g key={item.mode}
                initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.5 + i * 0.18 }}
              >
                <rect x="20" y={item.y} width="380" height="36" rx="8"
                  fill={item.color + "18"} stroke={item.color} strokeWidth="2" />
                <rect x="20" y={item.y} width="90" height="36" rx="8"
                  fill={item.color} />
                <text x="65" y={item.y + 22} textAnchor="middle"
                  fill="white" fontSize="8.5" fontFamily="monospace" fontWeight="700"
                >{item.mode}</text>
                <text x="120" y={item.y + 22}
                  fill="#1E1B2E" fontSize="8" fontFamily="var(--font-nunito)"
                >{item.desc}</text>
                {item.kept.map((k, ki) => (
                  <text key={ki} x={330 + ki * 0} y={item.y + 22 - ki * 0}
                    fill={k.includes("✓") ? "#22C55E" : "#EF4444"} fontSize="8"
                    fontFamily="var(--font-nunito)" fontWeight="700"
                    dx={ki * 45}
                  >{k}</text>
                ))}
                <rect x={20} y={item.y} width={380} height={36} rx="8" fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i + 3)}
                  onMouseLeave={() => setHovered(null)}
                />
              </motion.g>
            ))}
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = UNDO_S2_TOOLTIPS[hovered];
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

        {/* ── Step 3: git revert ────────────────────────────────── */}
        {step === 3 && (
          <motion.g key="s3">
            <motion.text x="210" y="22" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 0.65 }}
              transition={{ duration: 0.35 }}
            >git revert — Undo yang Aman</motion.text>

            {/* Timeline: 3 original commits + 1 revert commit */}
            {[
              { cx: 60,  label: "c1", color: "#3B82F6", delay: 0.0 },
              { cx: 155, label: "c2", color: "#3B82F6", delay: 0.18 },
              { cx: 250, label: "c3", color: "#EF4444", delay: 0.36 },
              { cx: 345, label: "revert", color: "#22C55E", delay: 0.7 },
            ].map(({ cx, label, color, delay }, i, arr) => (
              <motion.g key={cx}>
                {i < arr.length - 1 && (
                  <motion.line x1={cx + 18} y1={90} x2={arr[i + 1].cx - 18} y2={90}
                    stroke={i === 2 ? "#22C55E" : "#3B82F6"} strokeWidth="2.5" opacity="0.4"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.22, delay: delay + 0.25 }}
                  />
                )}
                <CommitNode cx={cx} cy={90} color={color} label={label} delay={delay} />
                <circle cx={cx} cy={90} r={22} fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </motion.g>
            ))}

            {/* Error badge on c3 */}
            <motion.text x="250" y="65" textAnchor="middle"
              fill="#EF4444" fontSize="14"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ ...heavySpring, delay: 0.5 }}
              style={{ originX: "250px", originY: "65px" }}
            >⚠</motion.text>

            {/* Revert arrow (curved) */}
            <motion.path d="M 345 108 Q 345 140 297 145 Q 250 150 250 145"
              fill="none" stroke="#22C55E" strokeWidth="2" strokeDasharray="5 3"
              markerEnd="url(#arrRv)"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            />

            {/* Labels */}
            <motion.text x="250" y="120" textAnchor="middle"
              fill="#EF4444" fontSize="8" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            >ada bug!</motion.text>

            <motion.text x="345" y="120" textAnchor="middle"
              fill="#22C55E" fontSize="8" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            >Revert c3</motion.text>

            {/* Info box */}
            <motion.rect x="50" y="160" width="320" height="55" rx="10"
              fill="#22C55E1A" stroke="#22C55E" strokeWidth="2"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring, delay: 1.4 }}
              style={{ originX: "210px", originY: "187px" }}
            />
            <motion.text x="210" y="180" textAnchor="middle"
              fill="#1E1B2E" fontSize="8.5" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
            >✓ History tetap utuh — commit lama tidak dihapus</motion.text>
            <motion.text x="210" y="196" textAnchor="middle"
              fill="#1E1B2E" fontSize="8" fontFamily="var(--font-nunito)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.7 }}
            >Aman digunakan di branch yang sudah di-push!</motion.text>
            <motion.text x="210" y="208" textAnchor="middle"
              fill="#1E1B2E" fontSize="8" fontFamily="monospace"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 1.8 }}
            >$ git revert c3hash</motion.text>

            <AnimatePresence>
              {hovered !== null && (() => {
                const t = UNDO_S3_TOOLTIPS[hovered];
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
              <marker id="arrRv" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#22C55E" />
              </marker>
            </defs>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
