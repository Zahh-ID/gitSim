"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props { step: number }

const spring = { type: "spring" as const, stiffness: 290, damping: 22 };
const heavySpring = { type: "spring" as const, stiffness: 380, damping: 18 };

const STATES = [
  { label: "Untracked", color: "#94A3B8", x: 20  },
  { label: "Modified",  color: "#F59E0B", x: 118 },
  { label: "Staged",    color: "#FF6B35", x: 216 },
  { label: "Committed", color: "#22C55E", x: 314 },
];

const STATUS_S0_TOOLTIPS = [
  { fill: "#94A3B8", label: "Untracked",  tip: "File baru, belum dikenal Git",  tx: 62,  ty: 34 },
  { fill: "#F59E0B", label: "Modified",   tip: "File sudah diedit",              tx: 160, ty: 34 },
  { fill: "#FF6B35", label: "Staged",     tip: "Siap masuk commit",              tx: 258, ty: 34 },
  { fill: "#22C55E", label: "Committed",  tip: "Tersimpan di riwayat",           tx: 356, ty: 34 },
];
const STATUS_S1_TOOLTIPS = [
  { fill: "#22C55E", label: "staged",     tip: "Changes to be committed",        tx: 210, ty: 74 },
  { fill: "#EF4444", label: "modified",   tip: "Changes not staged",             tx: 210, ty: 118 },
  { fill: "#94A3B8", label: "untracked",  tip: "Belum di-track Git",             tx: 210, ty: 152 },
];
const STATUS_S2_TOOLTIPS = [
  { fill: "#FFD93D", label: "Working Dir",tip: "File yang sedang diedit",        tx: 70,  ty: 22 },
  { fill: "#FF6B35", label: "Staging",    tip: "File siap di-commit",            tx: 210, ty: 22 },
  { fill: "#3B82F6", label: "Repository", tip: "Riwayat commit",                 tx: 350, ty: 22 },
  { fill: "#3B82F6", label: "commit",     tip: "Snapshot tersimpan",             tx: 350, ty: 152 },
];
const STATUS_S3_TOOLTIPS = [
  { fill: "#FFD93D", label: "git diff",         tip: "WD vs last commit",        tx: 110, ty: 0  },
  { fill: "#FF6B35", label: "git diff --staged",tip: "Staging vs last commit",   tx: 110, ty: 43 },
  { fill: "#A855F7", label: "git diff branch",  tip: "Beda antar branch",        tx: 110, ty: 86 },
];

export default function StatusScene({ step }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-center justify-center w-full py-4">
      <svg viewBox="0 0 420 230" className="w-full max-w-md" style={{ overflow: "visible" }}>

        {/* ── Step 0: File lifecycle boxes ───────────────────────── */}
        {step === 0 && (
          <motion.g key="s0">
            <motion.text x="210" y="22" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 0.65 }}
              transition={{ duration: 0.35 }}
            >Siklus Hidup File di Git</motion.text>

            {STATES.map((s, i) => (
              <motion.g key={s.label}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...spring, delay: i * 0.15 }}
                style={{ originX: `${s.x + 42}px`, originY: "105px" }}
              >
                <rect x={s.x} y={68} width={84} height={54} rx="10"
                  fill={s.color + "22"} stroke={s.color} strokeWidth="2.5" />
                {/* File icon */}
                <rect x={s.x + 30} y={75} width={24} height={29} rx="3"
                  fill={s.color} stroke="#1E1B2E" strokeWidth="1.5" />
                <line x1={s.x + 35} y1={82} x2={s.x + 49} y2={82} stroke="#1E1B2E" strokeWidth="1.2" opacity="0.5" />
                <line x1={s.x + 35} y1={87} x2={s.x + 49} y2={87} stroke="#1E1B2E" strokeWidth="1.2" opacity="0.5" />
                <line x1={s.x + 35} y1={92} x2={s.x + 45} y2={92} stroke="#1E1B2E" strokeWidth="1.2" opacity="0.5" />
                <motion.text x={s.x + 42} y={134} textAnchor="middle"
                  fill="#1E1B2E" fontSize="8" fontFamily="var(--font-nunito)" fontWeight="700"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: i * 0.15 + 0.2 }}
                >{s.label}</motion.text>
                <rect x={s.x} y={68} width={84} height={54} rx="10" fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </motion.g>
            ))}

            {/* Arrows between states */}
            {[
              { x1: 108, x2: 114, label: "git add",    y: 96 },
              { x1: 206, x2: 212, label: "git add",    y: 96 },
              { x1: 304, x2: 310, label: "git commit", y: 96 },
            ].map((arr, i) => (
              <motion.g key={i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + i * 0.12 }}
              >
                <motion.path d={`M ${arr.x1} ${arr.y} L ${arr.x2} ${arr.y}`}
                  fill="none" stroke="#1E1B2E" strokeWidth="2" strokeLinecap="round"
                  markerEnd="url(#arrS)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2, delay: 0.7 + i * 0.12 }}
                />
              </motion.g>
            ))}

            {/* Cycle back arrow (committed → modified) */}
            <motion.path
              d="M 356 122 Q 210 175 76 122"
              fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3"
              markerEnd="url(#arrS)"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            />
            <motion.text x="210" y="172" textAnchor="middle"
              fill="#94A3B8" fontSize="7.5" fontFamily="var(--font-nunito)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
              transition={{ duration: 0.3, delay: 1.6 }}
            >edit lagi → modified</motion.text>

            <AnimatePresence>
              {hovered !== null && (() => {
                const t = STATUS_S0_TOOLTIPS[hovered];
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
              <marker id="arrS" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#1E1B2E" opacity="0.4" />
              </marker>
            </defs>
          </motion.g>
        )}

        {/* ── Step 1: git status output ───────────────────────────── */}
        {step === 1 && (
          <motion.g key="s1">
            {/* Terminal box */}
            <motion.rect x="30" y="30" width="360" height="180" rx="10"
              fill="#1E1B2E"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring }}
              style={{ originX: "210px", originY: "120px" }}
            />
            {/* Traffic lights */}
            {["#EF4444", "#F59E0B", "#22C55E"].map((c, i) => (
              <circle key={c} cx={50 + i * 16} cy={48} r="5" fill={c} />
            ))}
            <motion.text x="48" y="72" fill="#94A3B8" fontSize="8.5" fontFamily="monospace"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            >$ git status</motion.text>
            <motion.text x="48" y="90" fill="#94A3B8" fontSize="8" fontFamily="monospace"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            >On branch main</motion.text>

            {[
              { y: 108, color: "#22C55E", text: "Changes to be committed:" },
              { y: 120, color: "#22C55E", text: '  (use "git restore --staged" to unstage)' },
              { y: 132, color: "#22C55E", text: "        new file:   style.css" },
            ].map((line, i) => (
              <motion.text key={i} x="48" y={line.y}
                fill={line.color} fontSize="7.5" fontFamily="monospace"
                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.9 + i * 0.15 }}
              >{line.text}</motion.text>
            ))}

            {[
              { y: 152, color: "#EF4444", text: "Changes not staged for commit:" },
              { y: 164, color: "#EF4444", text: "        modified:   index.html" },
            ].map((line, i) => (
              <motion.text key={i} x="48" y={line.y}
                fill={line.color} fontSize="7.5" fontFamily="monospace"
                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 1.4 + i * 0.15 }}
              >{line.text}</motion.text>
            ))}

            <motion.text x="48" y="186"
              fill="#94A3B8" fontSize="7.5" fontFamily="monospace"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.9 }}
            >Untracked files: app.js</motion.text>

            {[
              { i: 0, y: 100, h: 40 },
              { i: 1, y: 144, h: 28 },
              { i: 2, y: 178, h: 16 },
            ].map(({ i, y, h }) => (
              <rect key={i} x={36} y={y} width={344} height={h} fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = STATUS_S1_TOOLTIPS[hovered];
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

        {/* ── Step 2: Full pipeline workflow ─────────────────────── */}
        {step === 2 && (
          <motion.g key="s2">
            {/* Three area boxes */}
            {[
              { label: "Working\nDirectory", x: 20,  color: "#FFD93D" },
              { label: "Staging\nArea",      x: 160, color: "#FF6B35" },
              { label: "Repository",         x: 300, color: "#3B82F6" },
            ].map((box, i) => (
              <motion.g key={box.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...spring, delay: i * 0.15 }}
                style={{ originX: `${box.x + 80}px`, originY: "105px" }}
              >
                <rect x={box.x} y={55} width={100} height={70} rx="10"
                  fill={box.color + "1A"} stroke={box.color} strokeWidth="2.5" />
                {box.label.split("\n").map((ln, li) => (
                  <text key={li} x={box.x + 50} y={125 + li * 13}
                    textAnchor="middle" fill="#1E1B2E" fontSize="8.5"
                    fontFamily="var(--font-nunito)" fontWeight="700"
                  >{ln}</text>
                ))}
                <rect x={box.x} y={55} width={100} height={70} rx="10" fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </motion.g>
            ))}

            {/* File card: starts in WD */}
            <motion.g
              initial={{ x: 50, y: 65 }}
              animate={{ x: 190, y: 65 }}
              transition={{ ...spring, delay: 0.7 }}
            >
              <rect width={40} height={30} rx="5" fill="#FFD93D" stroke="#1E1B2E" strokeWidth="2" />
              <line x1={6} y1={9}  x2={34} y2={9}  stroke="#1E1B2E" strokeWidth="1.2" opacity="0.4" />
              <line x1={6} y1={15} x2={34} y2={15} stroke="#1E1B2E" strokeWidth="1.2" opacity="0.4" />
            </motion.g>

            {/* git add label */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              <rect x="105" y="34" width="70" height="16" rx="5" fill="#1E1B2E" />
              <text x="140" y="45" textAnchor="middle" fill="#FFD93D" fontSize="8" fontFamily="monospace">git add</text>
            </motion.g>

            {/* File card: staging → repo */}
            <motion.g
              initial={{ x: 190, y: 65, opacity: 0 }}
              animate={{ x: 330, y: 65, opacity: 1 }}
              transition={{ ...spring, delay: 1.4 }}
            >
              <rect width={40} height={30} rx="5" fill="#FF6B35" stroke="#1E1B2E" strokeWidth="2" />
              <line x1={6} y1={9}  x2={34} y2={9}  stroke="white" strokeWidth="1.2" opacity="0.5" />
              <line x1={6} y1={15} x2={34} y2={15} stroke="white" strokeWidth="1.2" opacity="0.5" />
            </motion.g>

            {/* git commit label */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
              <rect x="245" y="34" width="80" height="16" rx="5" fill="#1E1B2E" />
              <text x="285" y="45" textAnchor="middle" fill="#FFD93D" fontSize="8" fontFamily="monospace">git commit</text>
            </motion.g>

            {/* Commit node */}
            <motion.g
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ ...heavySpring, delay: 2.0 }}
              style={{ originX: "350px", originY: "185px" }}
            >
              <circle cx="350" cy="185" r="20" fill="#3B82F6" stroke="#1E1B2E" strokeWidth="2" />
              <text x="350" y="189" textAnchor="middle"
                fill="white" fontSize="7" fontFamily="monospace" fontWeight="bold"
              >c1a2b</text>
            </motion.g>
            <circle cx={350} cy={185} r={20} fill="transparent"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(3)}
              onMouseLeave={() => setHovered(null)}
            />
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = STATUS_S2_TOOLTIPS[hovered];
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

        {/* ── Step 3: git diff ─────────────────────────────────────── */}
        {step === 3 && (
          <motion.g key="s3">
            {/* Command */}
            <motion.g initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
              <rect x="100" y="12" width="220" height="22" rx="7" fill="#1E1B2E" />
              <text x="210" y="26" textAnchor="middle"
                fill="#FFD93D" fontSize="10" fontFamily="monospace"
              >$ git diff</text>
            </motion.g>

            {/* Diff panel */}
            <motion.rect x="30" y="45" width="360" height="160" rx="10"
              fill="#1E1B2E"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring, delay: 0.3 }}
              style={{ originX: "210px", originY: "125px" }}
            />
            <motion.text x="48" y="64" fill="#94A3B8" fontSize="7.5" fontFamily="monospace"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            >diff --git a/index.html b/index.html</motion.text>
            <motion.text x="48" y="76" fill="#94A3B8" fontSize="7.5" fontFamily="monospace"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
            >@@ -1,4 +1,5 @@</motion.text>

            {[
              { y: 90,  color: "#94A3B8", text: " &lt;html&gt;" },
              { y: 102, color: "#94A3B8", text: "  &lt;head&gt;&lt;/head&gt;" },
              { y: 114, color: "#EF4444", text: "- &lt;body&gt;Hello&lt;/body&gt;" },
              { y: 126, color: "#22C55E", text: "+ &lt;body&gt;Halo Dunia!&lt;/body&gt;" },
              { y: 138, color: "#22C55E", text: "+ &lt;!-- Updated --&gt;" },
              { y: 150, color: "#94A3B8", text: " &lt;/html&gt;" },
            ].map((line, i) => (
              <motion.text key={i} x="48" y={line.y}
                fill={line.color} fontSize="8" fontFamily="monospace"
                initial={{ opacity: 0, x: line.color === "#EF4444" ? -4 : line.color === "#22C55E" ? -4 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.8 + i * 0.12 }}
                dangerouslySetInnerHTML={undefined}
              >
                {line.text.replace(/&lt;/g, "<").replace(/&gt;/g, ">")}
              </motion.text>
            ))}

            {/* Legend */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
              <rect x="48" y="165" width="8" height="8" rx="1" fill="#EF4444" />
              <text x="60" y="173" fill="#EF4444" fontSize="7.5" fontFamily="var(--font-nunito)" fontWeight="600">dihapus</text>
              <rect x="118" y="165" width="8" height="8" rx="1" fill="#22C55E" />
              <text x="130" y="173" fill="#22C55E" fontSize="7.5" fontFamily="var(--font-nunito)" fontWeight="600">ditambahkan</text>
            </motion.g>

            {[
              { y: 32 },
              { y: 75 },
              { y: 118 },
            ].map((item, i) => (
              <rect key={i} x={20} y={item.y} width={380} height={35} rx="8" fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = STATUS_S3_TOOLTIPS[hovered];
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
