"use client";

import { useEffect, useRef, useState } from "react";
import type { Commit } from "@/types/git";

// Bold palette matching the SVG reference
const BRANCH_COLORS = [
  "#0050CA", // blue  — main
  "#09AC00", // green
  "#9200AC", // purple
  "#FF6B35", // orange
  "#E11D48", // red
  "#0891B2", // cyan
  "#D97706", // amber
  "#7C3AED", // violet
];

const PADDING_X  = 40;
const PADDING_Y  = 46;  // extra room above for branch labels
const COMMIT_SPACING = 76;
export const LANE_HEIGHT = 58;
const NODE_R     = 13;
const HOVER_R    = NODE_R + 8;
const STROKE_W   = 3;
const ANIM_DURATION = 380;

interface Props {
  commits: Record<string, Commit>;
  commitOrder: string[];
  branches: Record<string, string>;
  currentBranch: string;
  HEAD: string;
  onNumLanes?: (n: number) => void;
}

interface NodePos {
  x: number;
  y: number;
  hash: string;
  lane: number;
  depth: number;
}

interface HoverState {
  hash: string;
  clientX: number;
  clientY: number;
}

// ── Layout ────────────────────────────────────────────────────────────────────

function computeDepths(
  commits: Record<string, Commit>,
  commitOrder: string[]
): Record<string, number> {
  const cache: Record<string, number> = {};
  function depth(hash: string): number {
    if (hash in cache) return cache[hash];
    const c = commits[hash];
    if (!c) return (cache[hash] = 0);
    let d = 0;
    if (c.parent && c.parent in commits) d = Math.max(d, depth(c.parent) + 1);
    if (c.mergeParent && c.mergeParent in commits)
      d = Math.max(d, depth(c.mergeParent) + 1);
    return (cache[hash] = d);
  }
  commitOrder.forEach((h) => depth(h));
  return cache;
}

function computeNodeLanes(
  commits: Record<string, Commit>,
  commitOrder: string[],
  branches: Record<string, string>
): { nodeLanes: Record<string, number>; branchLanes: Record<string, number>; numLanes: number } {
  const mainHead = branches["main"] ?? branches["master"] ?? "";
  const mainLineage = new Set<string>();
  let cur: string | null = mainHead;
  while (cur && commits[cur]) {
    mainLineage.add(cur);
    cur = commits[cur].parent ?? null;
  }

  const branchLanes: Record<string, number> = {};
  let next = 0;
  for (const name of ["main", "master"]) {
    if (name in branches && !(name in branchLanes)) branchLanes[name] = next++;
  }
  const firstSeen: Record<string, number> = {};
  commitOrder.forEach((hash, i) => {
    const b = commits[hash]?.branch;
    if (b && !(b in firstSeen)) firstSeen[b] = i;
  });
  Object.entries(firstSeen)
    .sort(([, a], [, b]) => a - b)
    .forEach(([branch]) => {
      if (!(branch in branchLanes)) branchLanes[branch] = next++;
    });

  const nodeLanes: Record<string, number> = {};
  let maxLane = 0;
  commitOrder.forEach((hash) => {
    const lane = mainLineage.has(hash)
      ? 0
      : (branchLanes[commits[hash]?.branch ?? "main"] ?? 0);
    nodeLanes[hash] = lane;
    if (lane > maxLane) maxLane = lane;
  });

  return { nodeLanes, branchLanes, numLanes: maxLane + 1 };
}

// ── Canvas draw helpers ───────────────────────────────────────────────────────

function drawEdge(
  ctx: CanvasRenderingContext2D,
  from: NodePos,
  to: NodePos,
  color: string,
  dashed = false
) {
  ctx.beginPath();
  ctx.setLineDash(dashed ? [6, 4] : []);
  ctx.moveTo(from.x, from.y);
  if (from.y === to.y) {
    ctx.lineTo(to.x, to.y);
  } else {
    const dx = to.x - from.x;
    ctx.bezierCurveTo(
      from.x + dx * 0.55, from.y,
      to.x   - dx * 0.55, to.y,
      to.x, to.y
    );
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = dashed ? 2.5 : 3.5;
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  pos: NodePos,
  color: string,
  r: number,
  isHEAD: boolean,
  isHovered: boolean
) {
  // Outer glow ring for HEAD or hovered
  if (isHEAD || isHovered) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r + 8, 0, Math.PI * 2);
    ctx.fillStyle = color + (isHEAD ? "30" : "20");
    ctx.fill();
  }

  // Main filled circle
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Thick white stroke (like the SVG reference)
  ctx.strokeStyle = "rgba(255,255,255,0.92)";
  ctx.lineWidth = STROKE_W;
  ctx.stroke();

  // Thin colored outer ring for definition on light bg
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, r + STROKE_W / 2 + 0.5, 0, Math.PI * 2);
  ctx.strokeStyle = color + "50";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawLabels(
  ctx: CanvasRenderingContext2D,
  pos: NodePos,
  r: number,
  color: string,
  labels: string[],
  currentBranch: string,
  isHEAD: boolean
) {
  let yOff = pos.y - r - STROKE_W - 6;

  if (isHEAD) {
    const text = "HEAD";
    ctx.font = "bold 9px monospace";
    const tw = ctx.measureText(text).width;
    const lw = tw + 10;
    const lh = 14;
    const lx = pos.x;
    const ly = yOff - lh;

    ctx.beginPath();
    ctx.roundRect(lx - lw / 2, ly, lw, lh, 4);
    ctx.fillStyle = "#FEF9C3";
    ctx.fill();
    ctx.strokeStyle = "#D97706";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#92400E";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, lx, ly + lh / 2);
    yOff -= lh + 4;
  }

  [...labels].reverse().forEach((label) => {
    const isActive = label === currentBranch;
    ctx.font = `${isActive ? "bold" : "600"} 9px monospace`;
    const tw = ctx.measureText(label).width;
    const lw = tw + 10;
    const lh = 14;
    const lx = pos.x;
    const ly = yOff - lh;

    ctx.beginPath();
    ctx.roundRect(lx - lw / 2, ly, lw, lh, 4);
    ctx.fillStyle = isActive ? color : "rgba(30,27,46,0.07)";
    ctx.fill();
    ctx.strokeStyle = isActive ? color : "rgba(30,27,46,0.22)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = isActive ? "#ffffff" : "rgba(30,27,46,0.55)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, lx, ly + lh / 2);
    yOff -= lh + 3;
  });
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

function formatTs(ts: number) {
  return new Date(ts).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function CommitTooltip({
  hover, commits, branches, HEAD, nodeLanes,
}: {
  hover: HoverState;
  commits: Record<string, Commit>;
  branches: Record<string, string>;
  HEAD: string;
  nodeLanes: Record<string, number>;
}) {
  const c = commits[hover.hash];
  if (!c) return null;

  const lane = nodeLanes[hover.hash] ?? 0;
  const color = BRANCH_COLORS[lane % BRANCH_COLORS.length];
  const isHEAD = hover.hash === HEAD;
  const isMerge = !!c.mergeParent;

  const branchLabels = Object.entries(branches)
    .filter(([, h]) => h === hover.hash)
    .map(([b]) => b);

  const W = 224;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = hover.clientX + 14;
  let top  = hover.clientY - 12;
  if (left + W > vw - 8) left = hover.clientX - W - 14;
  if (top + 180 > vh - 8) top  = hover.clientY - 180 + 12;

  return (
    <div className="fixed z-50 pointer-events-none" style={{ left, top, width: W }}>
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "#FFF9F0",
          border: "2px solid #1E1B2E",
          boxShadow: "3px 3px 0px #1E1B2E",
        }}
      >
        <div
          className="px-3 py-2 flex items-center gap-2 border-b-2 border-[#1E1B2E]"
          style={{ background: color + "22" }}
        >
          <span className="w-2.5 h-2.5 rounded-full shrink-0 border-2 border-white/60" style={{ background: color }} />
          <span className="font-mono text-xs font-bold tracking-wider" style={{ color }}>
            {c.hash}
          </span>
          <div className="ml-auto flex gap-1">
            {isHEAD && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded border"
                style={{ color: "#92400E", background: "#FEF9C3", borderColor: "#D97706" }}
              >
                HEAD
              </span>
            )}
            {isMerge && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded border"
                style={{ color: "#1E1B2E", background: "#1E1B2E15", borderColor: "#1E1B2E30" }}
              >
                MERGE
              </span>
            )}
          </div>
        </div>

        <div className="px-3 py-2.5 space-y-2">
          <p className="text-xs text-[#1E1B2E] font-semibold leading-snug">{c.message}</p>

          {branchLabels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {branchLabels.map((b) => (
                <span
                  key={b}
                  className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border"
                  style={{ background: color + "20", color, border: `1.5px solid ${color}60` }}
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-1 text-[10px] text-[#1E1B2E]/50 font-mono">
            <Row label="date">{formatTs(c.timestamp)}</Row>
            <Row label="parent">
              {c.parent
                ? <span style={{ color: BRANCH_COLORS[0] }}>{c.parent}</span>
                : <span className="italic text-[#1E1B2E]/30">root commit</span>}
            </Row>
            {c.mergeParent && (
              <Row label="merged">
                <span style={{ color: BRANCH_COLORS[1] }}>{c.mergeParent}</span>
              </Row>
            )}
            <Row label="branch"><span style={{ color }}>{c.branch}</span></Row>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-1.5">
      <span className="text-[#1E1B2E]/30 w-14 shrink-0">{label}</span>
      <span className="text-[#1E1B2E]/60 break-all">{children}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CommitGraph({
  commits, commitOrder, branches, currentBranch, HEAD, onNumLanes,
}: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const animRef      = useRef(1.0);
  const newHashesRef = useRef<Set<string>>(new Set());
  const prevLenRef   = useRef(0);
  const nodePosRef   = useRef<Record<string, NodePos>>({});
  const nodeLanesRef = useRef<Record<string, number>>({});
  const hovHashRef   = useRef<string | null>(null);
  const drawFnRef    = useRef<((ts: number) => void) | null>(null);

  const [hovered, setHovered] = useState<HoverState | null>(null);

  useEffect(() => {
    if (commitOrder.length > prevLenRef.current) {
      newHashesRef.current = new Set(commitOrder.slice(prevLenRef.current));
      animRef.current = 0;
    }
    prevLenRef.current = commitOrder.length;
  }, [commitOrder]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scroll = scrollRef.current;
    if (!canvas || !scroll) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const depths = computeDepths(commits, commitOrder);
    const { nodeLanes, numLanes } = computeNodeLanes(commits, commitOrder, branches);
    nodeLanesRef.current = nodeLanes;
    onNumLanes?.(numLanes);

    const positions: Record<string, NodePos> = {};
    let maxDepth = 0;
    commitOrder.forEach((hash) => {
      const c = commits[hash];
      if (!c) return;
      const d = depths[hash] ?? 0;
      const lane = nodeLanes[hash] ?? 0;
      positions[hash] = { x: PADDING_X + d * COMMIT_SPACING, y: PADDING_Y + lane * LANE_HEIGHT, hash, lane, depth: d };
      if (d > maxDepth) maxDepth = d;
    });
    nodePosRef.current = positions;

    const labelsAt: Record<string, string[]> = {};
    Object.entries(branches).forEach(([b, h]) => {
      if (!h) return;
      (labelsAt[h] ??= []).push(b);
    });

    let t0: number | null = null;

    const draw = (ts: number) => {
      const containerW = scroll.clientWidth;
      const contentW   = PADDING_X * 2 + (maxDepth + 1) * COMMIT_SPACING;
      const logicalW   = Math.max(containerW, contentW);
      const logicalH   = scroll.clientHeight;

      const dpr = window.devicePixelRatio || 1;
      const pw  = Math.round(logicalW * dpr);
      const ph  = Math.round(logicalH * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width  = pw;
        canvas.height = ph;
        canvas.style.width  = `${logicalW}px`;
        canvas.style.height = `${logicalH}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (animRef.current < 1) {
        if (!t0) t0 = ts;
        animRef.current = Math.min((ts - t0) / ANIM_DURATION, 1);
      }
      const prog = animRef.current;

      ctx.clearRect(0, 0, logicalW, logicalH);

      if (commitOrder.length === 0) {
        ctx.fillStyle = "rgba(30,27,46,0.25)";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("git graph akan muncul di sini", logicalW / 2, logicalH / 2);
        return;
      }

      // Primary edges
      commitOrder.forEach((hash) => {
        const c = commits[hash];
        if (!c?.parent) return;
        const from = positions[c.parent];
        const to   = positions[hash];
        if (!from || !to) return;
        const lane  = nodeLanes[hash] ?? 0;
        const color = BRANCH_COLORS[lane % BRANCH_COLORS.length] + "90";
        drawEdge(ctx, from, to, color);
      });

      // Merge edges (dashed)
      commitOrder.forEach((hash) => {
        const c = commits[hash];
        if (!c?.mergeParent) return;
        const from = positions[c.mergeParent];
        const to   = positions[hash];
        if (!from || !to) return;
        const srcLane = nodeLanes[c.mergeParent] ?? 0;
        drawEdge(ctx, from, to, BRANCH_COLORS[srcLane % BRANCH_COLORS.length] + "80", true);
      });

      // Nodes
      const hovHash = hovHashRef.current;
      commitOrder.forEach((hash) => {
        const pos = positions[hash];
        const c   = commits[hash];
        if (!pos || !c) return;
        const isNew = newHashesRef.current.has(hash);
        const r     = isNew ? NODE_R * easeOut(prog) : NODE_R;
        if (r <= 0) return;
        const lane  = nodeLanes[hash] ?? 0;
        const color = BRANCH_COLORS[lane % BRANCH_COLORS.length];
        drawNode(ctx, pos, color, r, hash === HEAD, hash === hovHash);
        if (r >= NODE_R * 0.8) {
          drawLabels(ctx, pos, r, color, labelsAt[hash] ?? [], currentBranch, hash === HEAD);
        }
      });

      if (animRef.current < 1) rafRef.current = requestAnimationFrame(draw);
    };

    drawFnRef.current = draw;
    cancelAnimationFrame(rafRef.current);
    t0 = null;
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [commits, commitOrder, branches, currentBranch, HEAD, onNumLanes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let found: string | null = null;
      for (const [hash, pos] of Object.entries(nodePosRef.current)) {
        const dx = pos.x - mx, dy = pos.y - my;
        if (dx * dx + dy * dy <= HOVER_R * HOVER_R) { found = hash; break; }
      }
      canvas.style.cursor = found ? "pointer" : "default";
      if (found !== hovHashRef.current) {
        hovHashRef.current = found;
        cancelAnimationFrame(rafRef.current);
        if (drawFnRef.current) rafRef.current = requestAnimationFrame(drawFnRef.current);
      }
      setHovered(found ? { hash: found, clientX: e.clientX, clientY: e.clientY } : null);
    };

    const onLeave = () => {
      canvas.style.cursor = "default";
      if (hovHashRef.current !== null) {
        hovHashRef.current = null;
        cancelAnimationFrame(rafRef.current);
        if (drawFnRef.current) rafRef.current = requestAnimationFrame(drawFnRef.current);
      }
      setHovered(null);
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={scrollRef} className="w-full h-full overflow-x-auto overflow-y-hidden">
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>
      {hovered && (
        <CommitTooltip
          hover={hovered}
          commits={commits}
          branches={branches}
          HEAD={HEAD}
          nodeLanes={nodeLanesRef.current}
        />
      )}
    </div>
  );
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
