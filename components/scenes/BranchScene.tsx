"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props { step: number }

const spring      = { type: "spring" as const, stiffness: 290, damping: 22 };
const heavySpring = { type: "spring" as const, stiffness: 380, damping: 16 };

// Commit circle with hash label
function Commit({ cx, cy, color, label, delay = 0 }: {
  cx: number; cy: number; color: string; label: string; delay?: number;
}) {
  return (
    <motion.g
      initial={{ scale: 0 }} animate={{ scale: 1 }}
      transition={{ ...heavySpring, delay }}
      style={{ originX: `${cx}px`, originY: `${cy}px` }}
    >
      <circle cx={cx} cy={cy} r="20" fill={color} opacity="0.15" />
      <circle cx={cx} cy={cy} r="15" fill={color} stroke="#1E1B2E" strokeWidth="2.5" />
      <text x={cx} y={cy + 4} textAnchor="middle"
        fill="white" fontSize="7" fontFamily="monospace" fontWeight="bold"
      >{label}</text>
    </motion.g>
  );
}

// Branch label pill
function BranchLabel({ x, y, label, color, delay = 0 }: {
  x: number; y: number; label: string; color: string; delay?: number;
}) {
  const w = label.length * 6.5 + 14;
  return (
    <motion.g
      initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      transition={{ ...spring, delay }}
    >
      <rect x={x} y={y - 9} width={w} height={17} rx="5" fill={color} />
      <text x={x + w / 2} y={y + 3} textAnchor="middle"
        fill="white" fontSize="8.5" fontFamily="monospace" fontWeight="bold"
      >{label}</text>
    </motion.g>
  );
}

// Step 0 nodes — transform(99,16) scale(0.21), r≈23
const NODES = [
  { cx: 495, cy: 800, fill: "#09AC00", delay: 0.15, label: "Commit awal",   tip: "Titik awal semua branch", tx: 203, ty: 126 },
  { cx: 495, cy: 236, fill: "#09AC00", delay: 0.5,  label: "main",          tip: "Branch utama produksi",   tx: 203, ty: 93  },
  { cx: 118, cy: 376, fill: "#0050CA", delay: 0.65, label: "feature/login", tip: "Branch fitur login",      tx: 124, ty: 58  },
  { cx: 850, cy: 118, fill: "#9200AC", delay: 0.65, label: "feature/ui",    tip: "Branch fitur tampilan",   tx: 278, ty: 68  },
];

// Step 1 nodes — transform(57,12) scale(0.21), r≈23
// Node centers: left-green(82,118) center-green(200,118) right-green(319,118)
//               blue(207,37) orange(317,37) purple(262,194)
// Shared tooltip positions & labels — same for all steps using this SVG
const BRANCH_META = [
  { cx: 118,     cy: 505.428, delay: 0.1,  label: "commit #1",    tip: "Awal branch main",         tx: 92,  ty: 61  },
  { cx: 682,     cy: 505.428, delay: 0.25, label: "commit #2",    tip: "Perkembangan main",        tx: 200, ty: 61  },
  { cx: 1246.16, cy: 505,     delay: 0.4,  label: "commit #3",    tip: "Ujung branch main",        tx: 300, ty: 61  },
  { cx: 713.16,  cy: 118,     delay: 0.75, label: "feature/auth", tip: "Branch fitur autentikasi", tx: 196, ty: 69  },
  { cx: 1237.16, cy: 118,     delay: 0.75, label: "feature/ui",   tip: "Branch fitur tampilan",    tx: 297, ty: 69  },
  { cx: 975.159, cy: 868,     delay: 0.8,  label: "hotfix",       tip: "Branch perbaikan cepat",   tx: 255, ty: 130 },
];

type BranchColors = { main: string; b1: string; b2: string; b3: string };

// Step color schemes
const S1_COLORS: BranchColors = { main: "#09AC00", b1: "#0050CA", b2: "#EB741F", b3: "#9200AC" };
const S2_COLORS: BranchColors = { main: "#3B82F6", b1: "#FF6B9D", b2: "#FFD93D", b3: "#FF6B35" };
const S3_COLORS: BranchColors = { main: "#22C55E", b1: "#A855F7", b2: "#F59E0B", b3: "#EF4444" };

function makeNodes(c: BranchColors) {
  const fills = [c.main, c.main, c.main, c.b1, c.b2, c.b3];
  return BRANCH_META.map((m, i) => ({ ...m, fill: fills[i] }));
}

// Reusable SVG diagram — same structure, swappable colors
function BranchSvg({ colors, hovered, setHovered }: {
  colors: BranchColors;
  hovered: number | null;
  setHovered: (i: number | null) => void;
}) {
  const nodes = makeNodes(colors);
  return (
    <>
      <g transform="translate(70, 21) scale(0.19)">
        <motion.line x1="236" y1="497.928" x2="566" y2="497.928"
          stroke={colors.main} strokeWidth="15"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.line x1="800.16" y1="497.5" x2="1130.16" y2="497.5"
          stroke={colors.main} strokeWidth="15"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        <motion.path d="M236.16 499C508.178 499 413.958 127.593 595.16 118"
          fill="none" stroke={colors.b1} strokeWidth="15"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.3 }}
        />
        <motion.path d="M800.16 498C1048.69 498 962.605 120.744 1128.16 111"
          fill="none" stroke={colors.b2} strokeWidth="15"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.3 }}
        />
        <motion.path d="M236.159 499C706.697 499 543.715 858.71 857.159 868"
          fill="none" stroke={colors.b3} strokeWidth="15"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        {nodes.map(({ cx, cy, fill, delay }, i) => (
          <motion.circle key={`${cx}-${cy}`}
            cx={cx} cy={cy} r={110.5}
            fill={fill} stroke="#1E1B2E" strokeWidth="15"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay }}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </g>
      <AnimatePresence>
        {hovered !== null && (() => {
          const n = nodes[hovered];
          const w = 116;
          return (
            <motion.g key={hovered}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
            >
              <rect x={n.tx - w / 2} y={n.ty} width={w} height={30} rx="6"
                fill={n.fill} stroke="#1E1B2E" strokeWidth="1.5" />
              <text x={n.tx} y={n.ty + 11} textAnchor="middle"
                fill="white" fontSize="9" fontFamily="monospace" fontWeight="bold"
              >{n.label}</text>
              <text x={n.tx} y={n.ty + 23} textAnchor="middle"
                fill="white" fontSize="8" fontFamily="var(--font-nunito)" opacity="0.85"
              >{n.tip}</text>
            </motion.g>
          );
        })()}
      </AnimatePresence>
    </>
  );
}

const NODES_S1 = makeNodes(S1_COLORS);

export default function BranchScene({ step }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-center justify-center w-full py-4">
      <svg viewBox="0 0 400 230" className="w-full max-w-md" style={{ overflow: "visible" }}>

        {/* ── Step 0: Branch diagram (custom SVG) ─────────────────── */}
        {step === 0 && (
          <motion.g key="s0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Scale + center the 968×918 design into the 400×230 viewBox */}
            <g transform="translate(99, 16) scale(0.21)">
              {/* Lines draw first */}
              <motion.line x1="487.5" y1="682" x2="487.5" y2="352"
                stroke="#09AC00" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.35 }}
              />
              <motion.path d="M489 682C489 532.731 113.693 584.434 104 485"
                fill="none" stroke="#0050CA" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, delay: 0.3 }}
              />
              <motion.path d="M489 682C489 337.242 848.71 456.657 858 227"
                fill="none" stroke="#9200AC" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
              {/* Nodes fade in after lines */}
              {NODES.map(({ cx, cy, fill, delay }, i) => (
                <motion.circle key={`${cx}-${cy}`}
                  cx={cx} cy={cy} r={110.5}
                  fill={fill} stroke="#1E1B2E" strokeWidth="15"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay }}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
            </g>

            {/* Tooltips — rendered outside the transform in viewBox coords */}
            <AnimatePresence>
              {hovered !== null && (() => {
                const n = NODES[hovered];
                const w = 104;
                return (
                  <motion.g key={hovered}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <rect x={n.tx - w / 2} y={n.ty} width={w} height={30} rx="6"
                      fill={n.fill} stroke="#1E1B2E" strokeWidth="1.5" />
                    <text x={n.tx} y={n.ty + 11} textAnchor="middle"
                      fill="white" fontSize="9" fontFamily="monospace" fontWeight="bold"
                    >{n.label}</text>
                    <text x={n.tx} y={n.ty + 23} textAnchor="middle"
                      fill="white" fontSize="8" fontFamily="var(--font-nunito)" opacity="0.85"
                    >{n.tip}</text>
                  </motion.g>
                );
              })()}
            </AnimatePresence>

            {/* Caption */}
            <motion.text x="200" y="224" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 0.65 }}
              transition={{ duration: 0.35, delay: 1.2 }}
            >Branch = cabang pengembangan terpisah</motion.text>
          </motion.g>
        )}

        {/* ── Step 1: main/master branch (custom SVG) ─────────────── */}
        {step === 1 && (
          <motion.g key="s1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <BranchSvg colors={S1_COLORS} hovered={hovered} setHovered={setHovered} />
            <motion.text x="200" y="224" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="600"
              initial={{ opacity: 0 }} animate={{ opacity: 0.55 }}
              transition={{ duration: 0.35, delay: 1.1 }}
            >Branch "main" — garis waktu utama</motion.text>
          </motion.g>
        )}

        {/* ── Step 2: git branch ──────────────────────────────────── */}
        {step === 2 && (
          <motion.g key="s2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <BranchSvg colors={S2_COLORS} hovered={hovered} setHovered={setHovered} />
            <motion.text x="200" y="224" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="600"
              initial={{ opacity: 0 }} animate={{ opacity: 0.55 }}
              transition={{ duration: 0.35, delay: 1.1 }}
            >git branch — membuat branch baru</motion.text>
          </motion.g>
        )}

        {/* ── Step 3: Parallel Development (Group 2116 (3).svg) ────── */}
        {step === 3 && (
          <motion.g key="s3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <g transform="translate(46, 34) scale(0.16)">
              {/* Green main line segments */}
              <motion.line x1="236" y1="497.928" x2="566" y2="497.928"
                stroke="#09AC00" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.25 }}
              />
              <motion.line x1="800.16" y1="497.5" x2="1130.16" y2="497.5"
                stroke="#09AC00" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.25, delay: 0.08 }}
              />
              <motion.line x1="1361.16" y1="497.501" x2="1691.16" y2="497.501"
                stroke="#09AC00" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.25, delay: 0.16 }}
              />
              {/* Blue top branch segments */}
              <motion.line x1="831.16" y1="110.5" x2="1119.16" y2="110.501"
                stroke="#0050CA" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.25, delay: 0.55 }}
              />
              <motion.line x1="1355.16" y1="122.501" x2="1643.16" y2="122.501"
                stroke="#0050CA" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.25, delay: 0.63 }}
              />
              {/* Purple bottom branch segment */}
              <motion.line x1="1349.16" y1="890.53" x2="1679.16" y2="890.53"
                stroke="#9200AC" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.25, delay: 0.55 }}
              />
              {/* Branch paths */}
              <motion.path d="M236.16 499.001C508.178 499.001 413.958 127.593 595.16 118"
                fill="none" stroke="#0050CA" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, delay: 0.3 }}
              />
              <motion.path d="M800.16 499.001C1045.66 499.001 960.624 887.956 1124.16 898.001"
                fill="none" stroke="#9200AC" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, delay: 0.3 }}
              />
              {/* Nodes */}
              {[
                { cx: 118,     cy: 505.427, fill: "#09AC00", delay: 0.05 },
                { cx: 682,     cy: 505.428, fill: "#09AC00", delay: 0.13 },
                { cx: 1246.16, cy: 505,     fill: "#09AC00", delay: 0.21 },
                { cx: 1807.16, cy: 505.001, fill: "#09AC00", delay: 0.29 },
                { cx: 713.16,  cy: 118,     fill: "#0050CA", delay: 0.7  },
                { cx: 1237.16, cy: 118,     fill: "#0050CA", delay: 0.78 },
                { cx: 1761.16, cy: 130.001, fill: "#0050CA", delay: 0.86 },
                { cx: 1240.16, cy: 898.03,  fill: "#9200AC", delay: 0.7  },
                { cx: 1797.16, cy: 898.022, fill: "#9200AC", delay: 0.78 },
              ].map(({ cx, cy, fill, delay }, i) => (
                <motion.circle key={`${cx}-${cy}`}
                  cx={cx} cy={cy} r={110.5}
                  fill={fill} stroke="#1E1B2E" strokeWidth="15"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay }}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
            </g>

            {/* Tooltips — transform(46,34) scale(0.16), r≈18 */}
            <AnimatePresence>
              {hovered !== null && (() => {
                const tooltips = [
                  { fill: "#09AC00", label: "main #1",   tip: "Commit pertama main",   tx: 65,  ty: 65  },
                  { fill: "#09AC00", label: "main #2",   tip: "Perkembangan main",     tx: 155, ty: 65  },
                  { fill: "#09AC00", label: "main #3",   tip: "Lanjutan main",         tx: 246, ty: 65  },
                  { fill: "#09AC00", label: "main #4",   tip: "Ujung branch main",     tx: 335, ty: 65  },
                  { fill: "#0050CA", label: "feature #1",tip: "Awal branch fitur",     tx: 160, ty: 76  },
                  { fill: "#0050CA", label: "feature #2",tip: "Lanjutan fitur",        tx: 244, ty: 76  },
                  { fill: "#0050CA", label: "feature #3",tip: "Ujung branch fitur",    tx: 328, ty: 76  },
                  { fill: "#9200AC", label: "hotfix #1", tip: "Awal branch hotfix",    tx: 244, ty: 128 },
                  { fill: "#9200AC", label: "hotfix #2", tip: "Ujung branch hotfix",   tx: 330, ty: 128 },
                ][hovered];
                if (!tooltips) return null;
                const w = 110;
                return (
                  <motion.g key={hovered}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <rect x={tooltips.tx - w / 2} y={tooltips.ty} width={w} height={30} rx="6"
                      fill={tooltips.fill} stroke="#1E1B2E" strokeWidth="1.5" />
                    <text x={tooltips.tx} y={tooltips.ty + 11} textAnchor="middle"
                      fill="white" fontSize="9" fontFamily="monospace" fontWeight="bold"
                    >{tooltips.label}</text>
                    <text x={tooltips.tx} y={tooltips.ty + 23} textAnchor="middle"
                      fill="white" fontSize="8" fontFamily="var(--font-nunito)" opacity="0.85"
                    >{tooltips.tip}</text>
                  </motion.g>
                );
              })()}
            </AnimatePresence>

            <motion.text x="200" y="220" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="600"
              initial={{ opacity: 0 }} animate={{ opacity: 0.55 }}
              transition={{ duration: 0.35, delay: 1.0 }}
            >Tiga branch berkembang secara paralel</motion.text>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
