"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  step: number;
}

// Laptop SVG shape
function Laptop({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="80" height="54" rx="6" fill="#FFF9F0" stroke="#1E1B2E" strokeWidth="2.5" />
      <rect x={x - 4} y={y + 54} width="88" height="8" rx="4" fill="#1E1B2E" />
      <rect x={x + 8} y={y + 6} width="64" height="40" rx="3" fill="#1E1B2E" opacity="0.8" />
      <text x={x + 40} y={y + 32} textAnchor="middle" fill="#22C55E" fontSize="10" fontFamily="monospace">$ git</text>
    </g>
  );
}

// Cloud SVG shape
function Cloud({ x, y, color = "#3B82F6" }: { x: number; y: number; color?: string }) {
  const cx = x + 50;
  const cy = y + 28;
  return (
    <g>
      {/* cloud body */}
      <ellipse cx={cx} cy={cy} rx="44" ry="22" fill={color + "22"} stroke={color} strokeWidth="2.5" />
      <ellipse cx={cx - 18} cy={cy + 6} rx="26" ry="16" fill={color + "22"} stroke={color} strokeWidth="2.5" />
      <ellipse cx={cx + 18} cy={cy + 6} rx="24" ry="14" fill={color + "22"} stroke={color} strokeWidth="2.5" />
      {/* github-style server icon in center */}
      <rect x={cx - 12} y={cy - 10} width={24} height={8} rx="2" fill={color} opacity="0.7" />
      <rect x={cx - 12} y={cy}      width={24} height={8} rx="2" fill={color} opacity="0.7" />
      <circle cx={cx + 6} cy={cy - 6} r="1.5" fill="white" />
      <circle cx={cx + 6} cy={cy + 4} r="1.5" fill="white" />
    </g>
  );
}

const REMOTE_S0_TOOLTIPS = [
  { fill: "#1E1B2E", label: "Local Repo",  tip: "Komputer kamu",      tx: 70,  ty: 40 },
  { fill: "#3B82F6", label: "Remote Repo", tip: "GitHub / GitLab",    tx: 305, ty: 40 },
];
const REMOTE_S1_TOOLTIPS = [
  { fill: "#1E1B2E", label: "Local Repo",  tip: "Komputer kamu",      tx: 70,  ty: 45 },
  { fill: "#3B82F6", label: "Remote Repo", tip: "origin remote",      tx: 315, ty: 45 },
];
const REMOTE_S2_TOOLTIPS = [
  { fill: "#1E1B2E", label: "Local Repo",  tip: "Komputer kamu",      tx: 70,  ty: 110 },
  { fill: "#3B82F6", label: "Remote Repo", tip: "Menerima push",      tx: 315, ty: 10  },
];
const REMOTE_S3_TOOLTIPS = [
  { fill: "#1E1B2E", label: "Local Repo",  tip: "Menerima pull",      tx: 70,  ty: 110 },
  { fill: "#3B82F6", label: "Remote Repo", tip: "Sumber perubahan",   tx: 315, ty: 10  },
];

export default function RemoteScene({ step }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-center justify-center w-full py-4">
      <svg viewBox="0 0 400 230" className="w-full max-w-md" style={{ overflow: "visible" }}>

        {/* === Step 0: Laptop and Cloud side by side === */}
        {step === 0 && (
          <>
            <motion.g
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Laptop x={30} y={70} />
              <text x="70" y="148" textAnchor="middle" fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="700">Local</text>
              <text x="70" y="161" textAnchor="middle" fill="#1E1B2E" fontSize="8" fontFamily="var(--font-nunito)" opacity="0.5">komputer kamu</text>
              <rect x={30} y={70} width={88} height={72} fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(0)} onMouseLeave={() => setHovered(null)} />
            </motion.g>

            {/* VS / question mark separator */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <line x1="112" y1="101" x2="168" y2="101" stroke="#1E1B2E" strokeWidth="2" strokeDasharray="4 3" opacity="0.3" />
              <line x1="232" y1="101" x2="288" y2="101" stroke="#1E1B2E" strokeWidth="2" strokeDasharray="4 3" opacity="0.3" />
              <circle cx="200" cy="101" r="16" fill="#1E1B2E0A" stroke="#1E1B2E30" strokeWidth="1.5" />
              <text x="200" y="106" textAnchor="middle" fill="#1E1B2E" fontSize="11" fontFamily="monospace" fontWeight="bold" opacity="0.5">VS</text>
            </motion.g>

            <motion.g
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Cloud x={255} y={68} />
              <text x="305" y="148" textAnchor="middle" fill="#3B82F6" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="700">Remote</text>
              <text x="305" y="161" textAnchor="middle" fill="#1E1B2E" fontSize="8" fontFamily="var(--font-nunito)" opacity="0.5">GitHub / GitLab</text>
              <rect x={255} y={68} width={100} height={72} fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)} />
            </motion.g>

            <motion.text
              x="200" y="200"
              textAnchor="middle" fill="#1E1B2E" fontSize="10"
              fontFamily="var(--font-nunito)" fontWeight="600" opacity="0.6"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.5 }}
            >
              Local vs Remote Repository
            </motion.text>
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = REMOTE_S0_TOOLTIPS[hovered];
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
          </>
        )}

        {/* === Step 1: Connection line draws === */}
        {step === 1 && (
          <>
            {/* static laptop and cloud */}
            <Laptop x={30} y={75} />
            <Cloud x={265} y={73} />
            <rect x={30} y={75} width={88} height={72} fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(0)} onMouseLeave={() => setHovered(null)} />
            <rect x={265} y={73} width={100} height={72} fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)} />

            <text x="70" y="153" textAnchor="middle" fill="#1E1B2E" fontSize="9" fontFamily="var(--font-nunito)" fontWeight="700">Local</text>
            <text x="315" y="153" textAnchor="middle" fill="#3B82F6" fontSize="9" fontFamily="var(--font-nunito)" fontWeight="700">Remote (origin)</text>

            {/* Connection line */}
            <motion.line
              x1="112" y1="101"
              x2="268" y2="101"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray="8 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            {/* arrows */}
            <motion.text
              x="190" y="96"
              textAnchor="middle" fill="#3B82F6" fontSize="14"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            >↔</motion.text>

            {/* Command */}
            <motion.g
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
            >
              <rect x="80" y="170" width="240" height="22" rx="7" fill="#1E1B2E" />
              <text x="200" y="184" textAnchor="middle" fill="#FFD93D" fontSize="10" fontFamily="monospace">
                $ git remote add origin &lt;url&gt;
              </text>
            </motion.g>
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = REMOTE_S1_TOOLTIPS[hovered];
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
          </>
        )}

        {/* === Step 2: git push — commits go UP === */}
        {step === 2 && (
          <>
            <Laptop x={30} y={140} />
            <Cloud x={265} y={30} />
            <rect x={30} y={140} width={88} height={72} fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(0)} onMouseLeave={() => setHovered(null)} />
            <rect x={265} y={30} width={100} height={72} fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)} />

            <text x="70"  y="218" textAnchor="middle" fill="#1E1B2E" fontSize="9" fontFamily="var(--font-nunito)" fontWeight="700">Local</text>
            <text x="315" y="28"  textAnchor="middle" fill="#3B82F6" fontSize="9" fontFamily="var(--font-nunito)" fontWeight="700">Remote</text>

            {/* Static connection */}
            <line x1="112" y1="166" x2="112" y2="80" stroke="#1E1B2E" strokeWidth="1.5" opacity="0.15" strokeDasharray="5 4" />
            <line x1="112" y1="80"  x2="268" y2="80" stroke="#1E1B2E" strokeWidth="1.5" opacity="0.15" strokeDasharray="5 4" />

            {/* Commit nodes moving upward */}
            {[0, 1, 2].map((i) => (
              <motion.g
                key={i}
                initial={{ x: 70, y: 125, opacity: 0 }}
                animate={{ x: 290 + i * 20, y: 65, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.25, type: "spring", stiffness: 70 }}
              >
                <circle cx="0" cy="0" r="13" fill="#3B82F6" stroke="#1E1B2E" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="white" fontSize="7" fontFamily="monospace" fontWeight="bold">c{i + 1}</text>
              </motion.g>
            ))}
            {/* Push label */}
            <motion.g
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            >
              <text x="160" y="100" textAnchor="middle" fill="#3B82F6" fontSize="20">↑</text>
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              <rect x="110" y="198" width="100" height="22" rx="7" fill="#1E1B2E" />
              <text x="160" y="212" textAnchor="middle" fill="#FFD93D" fontSize="10" fontFamily="monospace">$ git push</text>
            </motion.g>
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = REMOTE_S2_TOOLTIPS[hovered];
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
          </>
        )}

        {/* === Step 3: git pull — commits come DOWN === */}
        {step === 3 && (
          <>
            <Laptop x={30} y={140} />
            <Cloud x={265} y={30} />
            <rect x={30} y={140} width={88} height={72} fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(0)} onMouseLeave={() => setHovered(null)} />
            <rect x={265} y={30} width={100} height={72} fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)} />

            <text x="70"  y="218" textAnchor="middle" fill="#1E1B2E" fontSize="9" fontFamily="var(--font-nunito)" fontWeight="700">Local</text>
            <text x="315" y="28"  textAnchor="middle" fill="#3B82F6" fontSize="9" fontFamily="var(--font-nunito)" fontWeight="700">Remote</text>

            <line x1="112" y1="166" x2="112" y2="80" stroke="#1E1B2E" strokeWidth="1.5" opacity="0.15" strokeDasharray="5 4" />
            <line x1="112" y1="80"  x2="268" y2="80" stroke="#1E1B2E" strokeWidth="1.5" opacity="0.15" strokeDasharray="5 4" />

            {/* Commit nodes moving downward (from cloud to laptop) */}
            {[0, 1, 2].map((i) => (
              <motion.g
                key={i}
                initial={{ x: 290 + i * 20, y: 65, opacity: 0 }}
                animate={{ x: 55 + i * 14, y: 150, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.25, type: "spring", stiffness: 70 }}
              >
                <circle cx="0" cy="0" r="13" fill="#22C55E" stroke="#1E1B2E" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="white" fontSize="7" fontFamily="monospace" fontWeight="bold">r{i + 1}</text>
              </motion.g>
            ))}
            {/* Down arrow */}
            <motion.text
              x="160" y="105" textAnchor="middle" fill="#22C55E" fontSize="20"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            >↓</motion.text>

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              <rect x="110" y="198" width="100" height="22" rx="7" fill="#1E1B2E" />
              <text x="160" y="212" textAnchor="middle" fill="#FFD93D" fontSize="10" fontFamily="monospace">$ git pull</text>
            </motion.g>
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = REMOTE_S3_TOOLTIPS[hovered];
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
          </>
        )}
      </svg>
    </div>
  );
}
