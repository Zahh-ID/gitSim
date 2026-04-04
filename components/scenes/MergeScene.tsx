"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  step: number;
}

// Step 0 tooltips — transform(46,34) scale(0.16), r≈18
// Green y≈115, Blue y≈53 (tooltip below), Purple y≈178
const BEFORE_MERGE_TOOLTIPS = [
  { fill: "#09AC00", label: "main #1",   tip: "Commit awal main",      tx: 65,  ty: 63  },
  { fill: "#09AC00", label: "main #2",   tip: "Perkembangan main",     tx: 155, ty: 63  },
  { fill: "#09AC00", label: "main #3",   tip: "Lanjutan main",         tx: 245, ty: 63  },
  { fill: "#09AC00", label: "main #4",   tip: "Ujung branch main",     tx: 335, ty: 63  },
  { fill: "#0050CA", label: "feature #1",tip: "Awal branch fitur",     tx: 160, ty: 76  },
  { fill: "#0050CA", label: "feature #2",tip: "Lanjutan fitur",        tx: 244, ty: 76  },
  { fill: "#0050CA", label: "feature #3",tip: "Ujung branch fitur",    tx: 328, ty: 76  },
  { fill: "#9200AC", label: "hotfix #1", tip: "Awal branch hotfix",    tx: 244, ty: 126 },
  { fill: "#9200AC", label: "hotfix #2", tip: "Ujung branch hotfix",   tx: 334, ty: 126 },
];

// Step 1 tooltips — transform(35,59) scale(0.11), r≈12
// Exact node x = cx*0.11+35, y = cy*0.11+59
// Green y≈115 → tooltip above ty=69
// Blue  y≈72  → tooltip below ty=88 (above would clip at top)
// Purple y≈158 → tooltip above ty=112
const MERGE_TOOLTIPS = [
  { fill: "#09AC00", label: "main #1",   tip: "Commit awal main",      tx: 57,  ty: 69  },
  { fill: "#09AC00", label: "main #2",   tip: "Perkembangan main",     tx: 110, ty: 69  },
  { fill: "#09AC00", label: "main #3",   tip: "Lanjutan main",         tx: 172, ty: 69  },
  { fill: "#09AC00", label: "main #4",   tip: "Setelah merge feature", tx: 234, ty: 69  },
  { fill: "#09AC00", label: "merge feature", tip: "Feature digabung ke main", tx: 292, ty: 69  },
  { fill: "#09AC00", label: "merge hotfix",  tip: "Hotfix digabung ke main",  tx: 345, ty: 69  },
  { fill: "#0050CA", label: "feature #1",tip: "Awal branch fitur",     tx: 113, ty: 88  },
  { fill: "#0050CA", label: "feature #2",tip: "Lanjutan fitur",        tx: 171, ty: 88  },
  { fill: "#0050CA", label: "feature #3",tip: "Digabung ke main",      tx: 229, ty: 88  },
  { fill: "#9200AC", label: "hotfix #1", tip: "Awal branch hotfix",    tx: 171, ty: 112 },
  { fill: "#9200AC", label: "hotfix #2", tip: "Digabung ke main",      tx: 233, ty: 112 },
];

const CONFLICT_TOOLTIPS = [
  { fill: "#3B82F6", label: "main commit",  tip: "Edit file yg sama",  tx: 80,  ty: 56  },
  { fill: "#3B82F6", label: "main commit",  tip: "Edit file yg sama",  tx: 160, ty: 56  },
  { fill: "#A855F7", label: "feat commit",  tip: "Branch fitur",       tx: 80,  ty: 128 },
  { fill: "#A855F7", label: "feat commit",  tip: "Branch fitur",       tx: 160, ty: 128 },
  { fill: "#EF4444", label: "⚠ CONFLICT",  tip: "Perlu diselesaikan", tx: 290, ty: 88  },
];
const RESOLVED_TOOLTIPS = [
  { fill: "#3B82F6", label: "main commit",  tip: "Edit file yg sama",  tx: 80,  ty: 56  },
  { fill: "#3B82F6", label: "main commit",  tip: "Edit file yg sama",  tx: 160, ty: 56  },
  { fill: "#A855F7", label: "feat commit",  tip: "Branch fitur",       tx: 80,  ty: 128 },
  { fill: "#A855F7", label: "feat commit",  tip: "Branch fitur",       tx: 160, ty: 128 },
  { fill: "#22C55E", label: "✓ RESOLVED",  tip: "Konflik teratasi",   tx: 290, ty: 88  },
];

export default function MergeScene({ step }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-center justify-center w-full py-4">
      <svg viewBox="0 0 400 230" className="w-full max-w-md" style={{ overflow: "visible" }}>

        {/* === Step 0: Situasi Sebelum Merge (Group 2116 (3).svg) === */}
        {step === 0 && (
          <motion.g key="s0"
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

            {/* Tooltips */}
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = BEFORE_MERGE_TOOLTIPS[hovered];
                const w = 110;
                return (
                  <motion.g key={hovered}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
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

            <motion.text x="200" y="220" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="600"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
              transition={{ duration: 0.35, delay: 1.0 }}
            >Tiga branch berkembang sebelum di-merge</motion.text>
          </motion.g>
        )}

        {/* === Step 1: Merge — lines converge === */}
        {/* === Step 1: git merge (Group 2116 (4).svg) === */}
        {step === 1 && (
          <motion.g key="s1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <g transform="translate(35, 59) scale(0.11)">
              {/* Green main line segments */}
              <motion.line x1="236" y1="497.928" x2="566" y2="497.928"
                stroke="#09AC00" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.line x1="800.16" y1="497.5" x2="1130.16" y2="497.5"
                stroke="#09AC00" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.06 }}
              />
              <motion.line x1="1361.16" y1="497.501" x2="1691.16" y2="497.501"
                stroke="#09AC00" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.12 }}
              />
              <motion.line x1="1922.16" y1="497.504" x2="2224.16" y2="497.504"
                stroke="#09AC00" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.18 }}
              />
              <motion.line x1="2455" y1="491.501" x2="2757" y2="491.501"
                stroke="#09AC00" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.24 }}
              />
              {/* Blue top branch segments */}
              <motion.line x1="831.16" y1="110.5" x2="1119.16" y2="110.5"
                stroke="#0050CA" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.5 }}
              />
              <motion.line x1="1355.16" y1="122.501" x2="1643.16" y2="122.501"
                stroke="#0050CA" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.56 }}
              />
              {/* Purple bottom branch segment */}
              <motion.line x1="1349.16" y1="890.529" x2="1679.16" y2="890.529"
                stroke="#9200AC" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.5 }}
              />
              {/* Branch diverge paths */}
              <motion.path d="M236.16 499C508.178 499 413.958 127.593 595.16 118"
                fill="none" stroke="#0050CA" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              />
              <motion.path d="M800.16 499.001C1045.66 499.001 960.624 887.955 1124.16 898.001"
                fill="none" stroke="#9200AC" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              />
              {/* Branch merge-back paths */}
              <motion.path d="M2231.16 499.002C1956.87 499.002 2051.88 127.595 1869.16 118.002"
                fill="none" stroke="#0050CA" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              />
              <motion.path d="M2758 489.001C2321 489.001 2771.5 898.201 1915 898.202"
                fill="none" stroke="#9200AC" strokeWidth="15"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              />
              {/* Nodes */}
              {[
                { cx: 118,     cy: 505.427, fill: "#09AC00", delay: 0.05 },
                { cx: 682,     cy: 505.427, fill: "#09AC00", delay: 0.11 },
                { cx: 1246.16, cy: 505,     fill: "#09AC00", delay: 0.17 },
                { cx: 1807.16, cy: 505.001, fill: "#09AC00", delay: 0.23 },
                { cx: 2338.16, cy: 499.004, fill: "#09AC00", delay: 0.29 },
                { cx: 2875,    cy: 499.001, fill: "#09AC00", delay: 0.35 },
                { cx: 713.16,  cy: 118,     fill: "#0050CA", delay: 0.65 },
                { cx: 1237.16, cy: 118,     fill: "#0050CA", delay: 0.71 },
                { cx: 1761.16, cy: 130.001, fill: "#0050CA", delay: 0.77 },
                { cx: 1240.16, cy: 898.029, fill: "#9200AC", delay: 0.65 },
                { cx: 1797.16, cy: 898.021, fill: "#9200AC", delay: 0.71 },
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

            {/* Tooltips */}
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = MERGE_TOOLTIPS[hovered];
                const w = 110;
                return (
                  <motion.g key={hovered}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
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

            <motion.text x="200" y="220" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="600"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
              transition={{ duration: 0.35, delay: 1.1 }}
            >git merge — branch digabungkan ke main</motion.text>
          </motion.g>
        )}

        {/* === Step 2: Merge conflict === */}
        {step === 2 && (
          <motion.g key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {/* static base */}
            <line x1="30" y1="90"  x2="220" y2="90"  stroke="#3B82F6" strokeWidth="2.5" />
            <line x1="30" y1="160" x2="220" y2="160" stroke="#A855F7" strokeWidth="2.5" />
            {[
              { cx: 80,  cy: 90,  color: "#3B82F6" },
              { cx: 160, cy: 90,  color: "#3B82F6" },
              { cx: 80,  cy: 160, color: "#A855F7" },
              { cx: 160, cy: 160, color: "#A855F7" },
            ].map(({ cx, cy, color }, i) => (
              <motion.circle key={i} cx={cx} cy={cy} r="14" fill={color} stroke="#1E1B2E" strokeWidth="2.5"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            <path d="M 220 90 C 255 90 265 125 290 125" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.5" />
            <path d="M 220 160 C 255 160 265 125 290 125" fill="none" stroke="#A855F7" strokeWidth="2" opacity="0.5" />

            {/* Conflict node — red */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 250 }}
              style={{ originX: "290px", originY: "125px", cursor: "pointer" }}
              onMouseEnter={() => setHovered(4)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle cx="290" cy="125" r="22" fill="#EF4444" stroke="#1E1B2E" strokeWidth="2.5" />
              <text x="290" y="130" textAnchor="middle" fill="white" fontSize="18">⚠️</text>
            </motion.g>
            {/* Warning label */}
            <motion.text
              x="290" y="158"
              textAnchor="middle" fill="#EF4444" fontSize="10"
              fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            >
              CONFLICT!
            </motion.text>
            <motion.text
              x="200" y="205"
              textAnchor="middle" fill="#1E1B2E" fontSize="10"
              fontFamily="var(--font-nunito)" fontWeight="600" opacity="0.6"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.7 }}
            >
              Dua branch mengubah file yang sama
            </motion.text>
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = CONFLICT_TOOLTIPS[hovered];
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

        {/* === Step 3: Conflict resolved === */}
        {step === 3 && (
          <motion.g key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {/* static base */}
            <line x1="30" y1="90"  x2="220" y2="90"  stroke="#3B82F6" strokeWidth="2.5" />
            <line x1="30" y1="160" x2="220" y2="160" stroke="#A855F7" strokeWidth="2.5" />
            {[
              { cx: 80,  cy: 90,  color: "#3B82F6" },
              { cx: 160, cy: 90,  color: "#3B82F6" },
              { cx: 80,  cy: 160, color: "#A855F7" },
              { cx: 160, cy: 160, color: "#A855F7" },
            ].map(({ cx, cy, color }, i) => (
              <motion.circle key={i} cx={cx} cy={cy} r="14" fill={color} stroke="#1E1B2E" strokeWidth="2.5"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            <path d="M 220 90 C 255 90 265 125 290 125" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.5" />
            <path d="M 220 160 C 255 160 265 125 290 125" fill="none" stroke="#A855F7" strokeWidth="2" opacity="0.5" />

            {/* Resolved merge commit — green with checkmark */}
            <motion.g
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, delay: 0.2 }}
              style={{ originX: "290px", originY: "125px", cursor: "pointer" }}
              onMouseEnter={() => setHovered(4)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle cx="290" cy="125" r="22" fill="#22C55E" stroke="#1E1B2E" strokeWidth="2.5" />
              <text x="290" y="130" textAnchor="middle" fill="white" fontSize="18">✓</text>
            </motion.g>
            {/* Glow */}
            <motion.circle
              cx="290" cy="125" r="34"
              fill="none" stroke="#22C55E" strokeWidth="2"
              initial={{ opacity: 0.8, scale: 0.7 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            />
            <motion.text
              x="290" y="158"
              textAnchor="middle" fill="#22C55E" fontSize="10"
              fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            >
              Konflik teratasi!
            </motion.text>
            <motion.text
              x="200" y="205"
              textAnchor="middle" fill="#1E1B2E" fontSize="10"
              fontFamily="var(--font-nunito)" fontWeight="600" opacity="0.6"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 1.0 }}
            >
              Edit file → git add → git commit
            </motion.text>
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = RESOLVED_TOOLTIPS[hovered];
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
