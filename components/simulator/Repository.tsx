"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Commit, AnimationEvent } from "@/types/git";

interface Props {
  commits: Record<string, Commit>;
  commitOrder: string[];
  branches: Record<string, string>;
  currentBranch: string;
  events: AnimationEvent[];
  onAnimationDone: () => void;
  className?: string;
}

export default function Repository({
  commits,
  commitOrder,
  branches,
  currentBranch,
  events,
  onAnimationDone,
  className,
}: Props) {
  const ordered = [...commitOrder].reverse();
  const prevLenRef = useRef(0);

  useEffect(() => {
    const hasCommitEvent = events.some((e) => e.type === "staging-to-commit");
    if (hasCommitEvent) {
      const t = setTimeout(onAnimationDone, 500);
      return () => clearTimeout(t);
    }
  }, [events, onAnimationDone]);

  useEffect(() => {
    prevLenRef.current = commitOrder.length;
  }, [commitOrder.length]);

  const branchForCommit = (hash: string) =>
    Object.entries(branches)
      .filter(([, h]) => h === hash)
      .map(([b]) => b);

  return (
    <div className={`flex flex-col h-full bg-[#EFF6FF] ${className ?? ""}`}>
      <div
        className="px-3 py-2 border-b border-[#1E1B2E]/15 flex items-center gap-2"
        style={{ background: "#DBEAFE" }}
      >
        <span
          className="text-[10px] font-bold text-[#1E40AF]/60 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Repository
        </span>
        {ordered.length > 0 && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border"
            style={{ background: "#BFDBFE", color: "#1E40AF", borderColor: "#60A5FA" }}
          >
            {ordered.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        <AnimatePresence initial={false}>
          {ordered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[#1E40AF]/30 italic px-1 pt-1"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              no commits yet
            </motion.p>
          ) : (
            ordered.map((hash, i) => {
              const c = commits[hash];
              if (!c) return null;
              const branchLabels = branchForCommit(hash);
              const isNew = i === 0 && commitOrder.length > prevLenRef.current;

              return (
                <motion.div
                  key={hash}
                  layout
                  initial={isNew ? { opacity: 0, y: -12, scale: 0.95 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                  className="flex items-start gap-2 px-2 py-1.5 rounded-lg border transition-colors"
                  style={{ background: "#BFDBFE44", borderColor: "#93C5FD55" }}
                >
                  <span
                    className="font-mono text-[10px] mt-0.5 shrink-0"
                    style={{ color: "#2563EB" }}
                  >
                    {hash}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#1E1B2E] truncate font-medium">{c.message}</p>
                    <div className="flex gap-1 mt-0.5 flex-wrap">
                      {branchLabels.map((b) => (
                        <span
                          key={b}
                          className="text-[9px] px-1.5 py-0.5 rounded font-bold border"
                          style={
                            b === currentBranch
                              ? { background: "#BFDBFE", color: "#1E40AF", borderColor: "#60A5FA" }
                              : { background: "#1E1B2E10", color: "#1E1B2E60", borderColor: "#1E1B2E20" }
                          }
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
