"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props { step: number }

const BOX_W = 100;
const BOX_H = 72;
const spring     = { type: "spring" as const, stiffness: 290, damping: 22 };
const heavySpring = { type: "spring" as const, stiffness: 380, damping: 18 };

// Pencil/edit icon (Working Dir)
function IconEdit({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <rect x={cx - 8} y={cy - 14} width={16} height={20} rx="2" fill={color} stroke="#1E1B2E" strokeWidth="1.5" />
      {[cy - 8, cy - 3, cy + 2].map((y, i) => (
        <line key={i} x1={cx - 4} y1={y} x2={cx + 4} y2={y} stroke="#1E1B2E" strokeWidth="1.5" opacity="0.5" />
      ))}
    </g>
  );
}
// Box/package icon (Staging)
function IconBox({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <rect x={cx - 10} y={cy - 10} width={20} height={18} rx="2" fill={color} stroke="#1E1B2E" strokeWidth="1.5" />
      <rect x={cx - 10} y={cy - 16} width={20} height={8} rx="2" fill={color} stroke="#1E1B2E" strokeWidth="1.5" />
      <line x1={cx} y1={cy - 10} x2={cx} y2={cy + 8} stroke="#1E1B2E" strokeWidth="1.5" opacity="0.5" />
    </g>
  );
}
// Server/database icon (Repository)
function IconServer({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <rect x={cx - 12} y={cy - 14} width={24} height={10} rx="3" fill={color} stroke="#1E1B2E" strokeWidth="1.5" />
      <rect x={cx - 12} y={cy - 2}  width={24} height={10} rx="3" fill={color} stroke="#1E1B2E" strokeWidth="1.5" />
      <circle cx={cx + 6} cy={cy - 9}  r="2" fill="#1E1B2E" opacity="0.4" />
      <circle cx={cx + 6} cy={cy + 3}  r="2" fill="#1E1B2E" opacity="0.4" />
    </g>
  );
}

type BoxIconProps = { cx: number; cy: number; color: string };
type BoxDef = { label: string; x: number; color: string; Icon: (p: BoxIconProps) => React.ReactElement };

const BOXES: BoxDef[] = [
  { label: "Working\nDirectory", x: 20,  color: "#FFD93D", Icon: IconEdit   },
  { label: "Staging\nArea",      x: 150, color: "#FF6B35", Icon: IconBox    },
  { label: "Repository",         x: 280, color: "#3B82F6", Icon: IconServer },
];

// Draws the 3 area boxes, re-animates when step changes via key
function AreaBoxes({ step, animate = true }: { step: number; animate?: boolean }) {
  return (
    <motion.g key={`boxes-${step}`} initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
      {BOXES.map((b, i) => (
        <motion.g key={b.label}
          initial={{ scale: animate ? 0.75 : 1, opacity: animate ? 0 : 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...spring, delay: animate ? i * 0.16 : 0 }}
          style={{ originX: `${b.x + BOX_W / 2}px`, originY: `${60 + BOX_H / 2}px` }}
        >
          <rect x={b.x} y={60} width={BOX_W} height={BOX_H} rx="10"
            fill={b.color + "1A"} stroke={b.color} strokeWidth="2.5" />
          <motion.g
            initial={{ scale: animate ? 0 : 1 }}
            animate={{ scale: 1 }}
            transition={{ ...heavySpring, delay: animate ? i * 0.16 + 0.18 : 0 }}
            style={{ originX: `${b.x + BOX_W / 2}px`, originY: "80px" }}
          >
            <b.Icon cx={b.x + BOX_W / 2} cy={83} color={b.color} />
          </motion.g>
          {b.label.split("\n").map((line, li) => (
            <motion.text key={li}
              x={b.x + BOX_W / 2} y={113 + li * 12}
              textAnchor="middle" fill="#1E1B2E" fontSize="8.5"
              fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: animate ? 0 : 1, y: animate ? 4 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: animate ? i * 0.16 + 0.28 : 0 }}
            >{line}</motion.text>
          ))}
        </motion.g>
      ))}
      {/* Arrows between boxes */}
      {[118, 248].map((x, i) => (
        <motion.path key={x}
          d={`M ${x} 96 L ${x + 14} 96`}
          fill="none" stroke="#1E1B2E" strokeWidth="2" strokeLinecap="round"
          markerEnd="url(#arr)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 0.25, delay: animate ? 0.55 + i * 0.08 : 0 }}
        />
      ))}
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#1E1B2E" opacity="0.3" />
        </marker>
      </defs>
    </motion.g>
  );
}

// Commit node at (cx, cy)
function CommitNode({ cx, cy, color, label, delay }: { cx: number; cy: number; color: string; label: string; delay: number }) {
  return (
    <motion.g
      initial={{ scale: 0 }} animate={{ scale: 1 }}
      transition={{ ...heavySpring, delay }}
      style={{ originX: `${cx}px`, originY: `${cy}px` }}
    >
      {/* glow ring */}
      <circle cx={cx} cy={cy} r="22" fill={color} opacity="0.12" />
      <circle cx={cx} cy={cy} r="16" fill={color} stroke="#1E1B2E" strokeWidth="2.5" />
      <text x={cx} y={cy + 4} textAnchor="middle"
        fill="white" fontSize="7.5" fontFamily="monospace" fontWeight="bold"
      >{label}</text>
    </motion.g>
  );
}

const COMMIT_BOXES_TOOLTIPS = [
  { fill: "#FFD93D", label: "Working Dir",  tip: "File yang sedang diedit", tx: 70,  ty: 26 },
  { fill: "#FF6B35", label: "Staging Area", tip: "File siap di-commit",     tx: 200, ty: 26 },
  { fill: "#3B82F6", label: "Repository",   tip: "Riwayat commit tersimpan",tx: 330, ty: 26 },
];
const COMMIT_S2_TOOLTIPS = [
  { fill: "#FFD93D", label: "Working Dir",  tip: "File yang sedang diedit", tx: 70,  ty: 26 },
  { fill: "#FF6B35", label: "Staging Area", tip: "File siap di-commit",     tx: 200, ty: 26 },
  { fill: "#3B82F6", label: "Repository",   tip: "Riwayat commit tersimpan",tx: 330, ty: 26 },
  { fill: "#3B82F6", label: "commit c1a2b3",tip: "Snapshot permanen",       tx: 330, ty: 152 },
];
const COMMIT_S3_TOOLTIPS = [
  { fill: "#3B82F6", label: "a1b2c3",  tip: "Commit Initial",  tx: 70,  ty: 94 },
  { fill: "#3B82F6", label: "d4e5f6",  tip: "Add README",      tx: 155, ty: 94 },
  { fill: "#3B82F6", label: "g7h8i9",  tip: "Fix bug",         tx: 240, ty: 94 },
  { fill: "#22C55E", label: "j0k1l2",  tip: "Feature commit",  tx: 325, ty: 94 },
  { fill: "#22C55E", label: "HEAD",    tip: "Posisi aktif",     tx: 325, ty: 58 },
];

export default function CommitScene({ step }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-center justify-center w-full py-4">
      <svg viewBox="0 0 400 235" className="w-full max-w-md" style={{ overflow: "visible" }}>

        {/* ── Step 0: Three boxes appear sequentially ─────────────── */}
        {step === 0 && (
          <>
            <AreaBoxes step={step} animate />
            {[
              { x: 20,  tx: 70  },
              { x: 150, tx: 200 },
              { x: 280, tx: 330 },
            ].map(({ x, tx }, i) => (
              <rect key={i} x={x} y={60} width={100} height={72} rx="10" fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = COMMIT_BOXES_TOOLTIPS[hovered];
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

        {/* ── Step 1: git add — file moves WD → Staging ───────────── */}
        {step === 1 && (
          <motion.g key="s1" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
            <AreaBoxes step={step} animate={false} />
            {/* git add command */}
            <motion.g initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}>
              <rect x="80" y="148" width="148" height="22" rx="7" fill="#1E1B2E" />
              <text x="154" y="162" textAnchor="middle"
                fill="#FFD93D" fontSize="10" fontFamily="monospace"
              >$ git add file.txt</text>
            </motion.g>
            {/* File card moving WD → Staging */}
            <motion.g
              initial={{ x: 55, y: 70 }}
              animate={{ x: 187, y: 70 }}
              transition={{ ...spring, delay: 0.45 }}
            >
              {/* Card */}
              <rect x="0" y="0" width="36" height="28" rx="5"
                fill="#FFD93D" stroke="#1E1B2E" strokeWidth="2" />
              <line x1="6" y1="9"  x2="30" y2="9"  stroke="#1E1B2E" strokeWidth="1.5" opacity="0.4" />
              <line x1="6" y1="14" x2="30" y2="14" stroke="#1E1B2E" strokeWidth="1.5" opacity="0.4" />
              <line x1="6" y1="19" x2="22" y2="19" stroke="#1E1B2E" strokeWidth="1.5" opacity="0.4" />
            </motion.g>
            {/* Staging box highlight pulse */}
            <motion.rect x="150" y="60" width={BOX_W} height={BOX_H} rx="10"
              fill="none" stroke="#FF6B35" strokeWidth="3.5"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.5, delay: 1.1 }}
            />
            {[
              { x: 20,  tx: 70  },
              { x: 150, tx: 200 },
              { x: 280, tx: 330 },
            ].map(({ x, tx }, i) => (
              <rect key={i} x={x} y={60} width={100} height={72} rx="10" fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = COMMIT_BOXES_TOOLTIPS[hovered];
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

        {/* ── Step 2: git commit — Staging → Repo, commit appears ─── */}
        {step === 2 && (
          <motion.g key="s2" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
            <AreaBoxes step={step} animate={false} />
            {/* git commit command */}
            <motion.g initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}>
              <rect x="60" y="148" width="188" height="22" rx="7" fill="#1E1B2E" />
              <text x="154" y="162" textAnchor="middle"
                fill="#FFD93D" fontSize="10" fontFamily="monospace"
              >$ git commit -m "feat"</text>
            </motion.g>
            {/* File moves Staging → Repo */}
            <motion.g
              initial={{ x: 187, y: 70 }}
              animate={{ x: 317, y: 70 }}
              transition={{ ...spring, delay: 0.4 }}
            >
              <rect x="0" y="0" width="36" height="28" rx="5"
                fill="#FF6B35" stroke="#1E1B2E" strokeWidth="2" />
              <line x1="6" y1="9"  x2="30" y2="9"  stroke="white" strokeWidth="1.5" opacity="0.5" />
              <line x1="6" y1="14" x2="30" y2="14" stroke="white" strokeWidth="1.5" opacity="0.5" />
              <line x1="6" y1="19" x2="22" y2="19" stroke="white" strokeWidth="1.5" opacity="0.5" />
            </motion.g>
            {/* Commit node appears */}
            <motion.g style={{ originX: "330px", originY: "185px" }}>
              {/* Outline draws first */}
              <motion.circle cx="330" cy="185" r="20"
                fill="none" stroke="#3B82F6" strokeWidth="2.5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 1.0 }}
              />
              {/* Fill springs in */}
              <motion.circle cx="330" cy="185" r="20"
                fill="#3B82F6"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ ...heavySpring, delay: 1.2 }}
                style={{ originX: "330px", originY: "185px" }}
              />
              <motion.text x="330" y="189" textAnchor="middle"
                fill="white" fontSize="7.5" fontFamily="monospace" fontWeight="bold"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 1.4 }}
              >c1a2b3</motion.text>
            </motion.g>
            {/* Glow + label */}
            <motion.circle cx="330" cy="185" r="32"
              fill="none" stroke="#3B82F6" strokeWidth="2"
              initial={{ scale: 0.7, opacity: 0.7 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 0.6, delay: 1.25 }}
              style={{ originX: "330px", originY: "185px" }}
            />
            <motion.text x="330" y="213" textAnchor="middle"
              fill="#3B82F6" fontSize="9" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.5 }}
            >commit!</motion.text>
            {[
              { x: 20,  tx: 70  },
              { x: 150, tx: 200 },
              { x: 280, tx: 330 },
            ].map(({ x, tx }, i) => (
              <rect key={i} x={x} y={60} width={100} height={72} rx="10" fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            <circle cx={330} cy={185} r={20} fill="transparent"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(3)}
              onMouseLeave={() => setHovered(null)}
            />
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = COMMIT_S2_TOOLTIPS[hovered];
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

        {/* ── Step 3: Commit graph chain ───────────────────────────── */}
        {step === 3 && (
          <motion.g key="s3" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
            {/* Caption */}
            <motion.text x="200" y="28" textAnchor="middle"
              fill="#1E1B2E" fontSize="10" fontFamily="var(--font-nunito)" fontWeight="700"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
              transition={{ duration: 0.4 }}
            >Setiap commit terhubung ke parent-nya</motion.text>

            {/* Timeline baseline */}
            <motion.line x1="40" y1="128" x2="370" y2="128"
              stroke="#1E1B2E" strokeWidth="1.5" opacity="0.12"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />

            {/* Commits */}
            {[
              { cx: 70,  hash: "a1b2c3", msg: "Initial",  color: "#3B82F6", delay: 0.1  },
              { cx: 155, hash: "d4e5f6", msg: "README",   color: "#3B82F6", delay: 0.32 },
              { cx: 240, hash: "g7h8i9", msg: "Fix bug",  color: "#3B82F6", delay: 0.54 },
              { cx: 325, hash: "j0k1l2", msg: "Feature",  color: "#22C55E", delay: 0.76 },
            ].map(({ cx, hash, msg, color, delay }, i, arr) => (
              <motion.g key={hash} initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                {/* Connector line to next */}
                {i < arr.length - 1 && (
                  <motion.line x1={cx + 18} y1={128} x2={arr[i + 1].cx - 18} y2={128}
                    stroke={color} strokeWidth="2.5" opacity="0.45"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.22, delay: delay + 0.28 }}
                  />
                )}
                <CommitNode cx={cx} cy={128} color={color} label={hash.slice(0, 6)} delay={delay} />
                {/* Commit message below */}
                <motion.text x={cx} y={154} textAnchor="middle"
                  fill="#1E1B2E" fontSize="8" fontFamily="var(--font-nunito)" fontWeight="600"
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 0.6, y: 0 }}
                  transition={{ duration: 0.25, delay: delay + 0.18 }}
                >{msg}</motion.text>
              </motion.g>
            ))}

            {/* HEAD badge */}
            <motion.g
              initial={{ x: 18, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ ...spring, delay: 1.0 }}
            >
              <rect x="300" y="92" width="50" height="18" rx="6" fill="#22C55E" />
              <text x="325" y="104" textAnchor="middle"
                fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold"
              >HEAD</text>
              {/* pointer line */}
              <line x1="325" y1="110" x2="325" y2="112" stroke="#22C55E" strokeWidth="2" />
            </motion.g>
            {[
              { cx: 70,  i: 0 },
              { cx: 155, i: 1 },
              { cx: 240, i: 2 },
              { cx: 325, i: 3 },
            ].map(({ cx, i }) => (
              <circle key={i} cx={cx} cy={128} r={22} fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            <rect x={300} y={92} width={50} height={18} rx={6} fill="transparent"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(4)}
              onMouseLeave={() => setHovered(null)}
            />
            <AnimatePresence>
              {hovered !== null && (() => {
                const t = COMMIT_S3_TOOLTIPS[hovered];
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
