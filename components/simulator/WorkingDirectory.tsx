"use client";

import { AnimatePresence, motion } from "motion/react";
import type { WDFile, AnimationEvent } from "@/types/git";

interface BadgeStyle {
  label: string;
  bg: string;
  text: string;
  border: string;
}

const DIRTY_BADGE: Record<string, BadgeStyle> = {
  untracked: { label: "U", bg: "#FEF9C3", text: "#854D0E", border: "#FDE047" },
  modified:  { label: "M", bg: "#FFEDD5", text: "#C2410C", border: "#FB923C" },
  deleted:   { label: "D", bg: "#FEE2E2", text: "#B91C1C", border: "#F87171" },
};

const STAGED_BADGE: BadgeStyle =
  { label: "S", bg: "#DCFCE7", text: "#166534", border: "#4ADE80" };

const CLEAN_BADGE: BadgeStyle =
  { label: "✓", bg: "#F0FDF4", text: "#15803D", border: "#86EFAC" };

interface FileRow {
  name: string;
  badge: BadgeStyle;
  dim?: boolean;
}

interface Props {
  files: Record<string, WDFile>;
  stagedFiles?: Record<string, string>;
  committedFiles?: string[];
  events: AnimationEvent[];
  onFileClick?: (name: string) => void;
  className?: string;
}

export default function WorkingDirectory({
  files,
  stagedFiles = {},
  committedFiles = [],
  onFileClick,
  className,
}: Props) {
  // Build unified file list: dirty > staged > clean committed
  const rows: FileRow[] = [];
  const seen = new Set<string>();

  // 1. Dirty (untracked / modified / deleted)
  for (const [name, wdf] of Object.entries(files)) {
    seen.add(name);
    rows.push({ name, badge: DIRTY_BADGE[wdf.status] ?? DIRTY_BADGE.untracked });
  }

  // 2. Staged (already snapshotted to staging, still exists on disk)
  for (const name of Object.keys(stagedFiles)) {
    if (seen.has(name)) continue;
    seen.add(name);
    rows.push({ name, badge: STAGED_BADGE, dim: true });
  }

  // 3. Clean committed (no pending changes)
  for (const name of committedFiles) {
    if (seen.has(name)) continue;
    seen.add(name);
    rows.push({ name, badge: CLEAN_BADGE, dim: true });
  }

  return (
    <div className={`flex flex-col h-full bg-[#FFF9F0] ${className ?? ""}`}>
      <div
        className="px-3 py-2 border-b border-[#1E1B2E]/15 flex items-center gap-2"
        style={{ background: "#F5EDE0" }}
      >
        <span
          className="text-[10px] font-bold text-[#1E1B2E]/50 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Working Dir
        </span>
        {rows.length > 0 && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border"
            style={{ background: "#1E1B2E15", color: "#1E1B2E", borderColor: "#1E1B2E30" }}
          >
            {rows.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        <AnimatePresence>
          {rows.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[#1E1B2E]/30 italic px-1 pt-1"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              empty
            </motion.p>
          ) : (
            rows.map(({ name, badge, dim }) => (
              <motion.div
                key={name}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: dim ? 0.55 : 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                onClick={() => onFileClick?.(name)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border transition-colors ${onFileClick ? "cursor-pointer hover:bg-white" : ""}`}
                style={{ background: "rgba(255,255,255,0.5)", borderColor: "#1E1B2E18" }}
              >
                <span className="text-[#1E1B2E]/40 text-xs shrink-0">📄</span>
                <span className="text-xs text-[#1E1B2E] flex-1 truncate font-mono">
                  {name}
                </span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0"
                  style={{ background: badge.bg, color: badge.text, borderColor: badge.border }}
                >
                  {badge.label}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
