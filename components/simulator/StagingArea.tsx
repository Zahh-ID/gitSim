"use client";

import { AnimatePresence, motion } from "motion/react";
import type { AnimationEvent } from "@/types/git";

interface Props {
  files: Record<string, string>;
  events: AnimationEvent[];
  className?: string;
}

export default function StagingArea({ files, className }: Props) {
  const entries = Object.entries(files);

  return (
    <div className={`flex flex-col h-full bg-[#F0FFF4] ${className ?? ""}`}>
      <div
        className="px-3 py-2 border-b border-[#1E1B2E]/15 flex items-center gap-2"
        style={{ background: "#DCFCE7" }}
      >
        <span
          className="text-[10px] font-bold text-[#166534]/60 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Staging Area
        </span>
        {entries.length > 0 && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border"
            style={{ background: "#BBF7D0", color: "#166534", borderColor: "#4ADE80" }}
          >
            {entries.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        <AnimatePresence>
          {entries.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[#166534]/30 italic px-1 pt-1"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              empty
            </motion.p>
          ) : (
            entries.map(([name, content]) => (
              <motion.div
                key={name}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg border transition-colors"
                style={{ background: "#BBFAB866", borderColor: "#4ADE8055" }}
              >
                <span className="text-green-600/50 text-xs shrink-0">📄</span>
                <span className="text-xs text-[#166534] flex-1 truncate font-mono font-medium">
                  {name}
                </span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0"
                  style={{ background: "#BBF7D0", color: "#166534", borderColor: "#4ADE80" }}
                >
                  {content === "__deleted__" ? "D" : "S"}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
