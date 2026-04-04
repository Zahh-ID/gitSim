"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import type { EditorRequest } from "@/types/git";

interface Props {
  request: EditorRequest;
  onSave: (filename: string, content: string) => void;
  onClose: () => void;
}

export default function FileEditor({ request, onSave, onClose }: Props) {
  const [content, setContent] = useState(request.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea on open
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+S or Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      onSave(request.filename, content);
    }
    // Tab → insert 2 spaces instead of focus-jump
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = content.slice(0, start) + "  " + content.slice(end);
      setContent(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  };

  const lineCount = content.split("\n").length;
  const isDirty = content !== request.content;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex flex-col bg-zinc-950 border border-white/12 rounded-xl shadow-2xl overflow-hidden"
        style={{ width: "min(680px, 90vw)", height: "min(480px, 80vh)" }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10 shrink-0 bg-zinc-900/60">
          <div className="flex gap-1.5">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
            />
            <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
            <span className="w-3 h-3 rounded-full bg-green-500/40" />
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-white/30 text-xs">📄</span>
            <span className="text-xs font-mono text-white/70 truncate">
              {request.filename}
            </span>
            {request.isNew && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 font-bold shrink-0">
                NEW
              </span>
            )}
            {isDirty && (
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" title="Unsaved changes" />
            )}
          </div>

          <span className="text-[10px] text-white/25 font-mono shrink-0">
            {lineCount} line{lineCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Editor area with line numbers */}
        <div className="flex flex-1 min-h-0 font-mono text-sm">
          {/* Line numbers */}
          <div
            className="select-none text-right text-white/20 bg-zinc-900/40 px-3 pt-3 leading-6 text-xs border-r border-white/5 shrink-0 overflow-hidden"
            style={{ minWidth: "3rem" }}
            aria-hidden
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 resize-none bg-transparent text-white/90 p-3 outline-none leading-6 text-xs caret-green-400 placeholder-white/20"
            placeholder="# ketik konten file di sini…"
            spellCheck={false}
            autoCorrect="off"
            autoComplete="off"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 shrink-0 bg-zinc-900/40">
          <span className="text-[10px] text-white/25 font-mono">
            Esc to close · Ctrl+S to save
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 text-xs rounded-md text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(request.filename, content)}
              className="px-4 py-1 text-xs rounded-md font-medium transition-colors"
              style={{
                background: isDirty ? "#22c55e22" : "#ffffff0a",
                color: isDirty ? "#4ade80" : "#ffffff40",
                border: isDirty ? "1px solid #22c55e40" : "1px solid #ffffff10",
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
