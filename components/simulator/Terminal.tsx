"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import type { TerminalLine } from "@/types/git";

interface Props {
  lines: TerminalLine[];
  onCommand: (input: string) => void;
}

export default function Terminal({ lines, onCommand }: Props) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = input.trim();
      if (cmd) {
        setHistory((prev) => [cmd, ...prev]);
        setHistIdx(-1);
        onCommand(cmd);
        setInput("");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : history[next] ?? "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const completions = [
        "git init", "git status", "git add .", "git add ",
        "git commit -m ", "git log", "git branch ",
        "git checkout ", "git checkout -b ", "git merge ",
        "touch ", "echo ", "ls", "help", "clear",
      ];
      const match = completions.find((c) => c.startsWith(input) && c !== input);
      if (match) setInput(match);
    }
  };

  const getLineStyle = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input":  return "text-[#1E1B2E] font-semibold";
      case "error":  return "text-red-500";
      case "output": return "text-[#1E1B2E]/65";
    }
  };

  return (
    <div
      className="h-full flex flex-col font-mono text-sm cursor-text bg-[#FAFAF6]"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className={`leading-relaxed whitespace-pre-wrap break-all ${getLineStyle(line.type)}`}>
            {line.type === "input" ? (
              <span>
                <span className="select-none" style={{ color: "#FF6B35" }}>→ </span>
                {line.text}
              </span>
            ) : (
              line.text
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-t-[2px] border-[#1E1B2E] shrink-0"
        style={{ background: "#FFF9F0" }}
      >
        <span className="select-none shrink-0 font-bold text-sm" style={{ color: "#FF6B35" }}>→</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-[#1E1B2E] placeholder-[#1E1B2E]/30"
          style={{ caretColor: "#FF6B35" }}
          placeholder="ketik perintah git atau 'help'…"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
        />
        <span className="cursor-blink select-none" style={{ color: "#FF6B35" }}>▌</span>
      </div>
    </div>
  );
}
