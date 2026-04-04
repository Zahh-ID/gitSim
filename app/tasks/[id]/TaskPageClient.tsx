"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { TASKS } from "@/lib/tasks";
import { useTaskProgress } from "@/lib/useTaskProgress";
import type { GitState, TerminalLine } from "@/types/git";
import { createInitialState, dispatch } from "@/lib/git-engine";
import Navbar from "@/components/Navbar";
import { FaCheckCircle, FaArrowRight, FaTrophy, FaLightbulb, FaChevronDown, FaRedo } from "react-icons/fa";

interface Props { id: string }

const spring = { type: "spring" as const, stiffness: 300, damping: 24 };

export default function TaskPageClient({ id }: Props) {
  const task = TASKS.find((t) => t.id === id);
  const { isCompleted, saveStep, markCompleted, resetTask } = useTaskProgress();

  function buildInitialGitState() {
    let state = createInitialState();
    if (task?.setupCommands) {
      for (const cmd of task.setupCommands) {
        state = dispatch(state, cmd).newState;
      }
    }
    return state;
  }

  const [gitState, setGitState] = useState<GitState>(buildInitialGitState);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [stepIdx, setStepIdx] = useState(0);
  const [stepDone, setStepDone] = useState(false);
  const [done, setDone] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [hydrated, setHydrated] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const nextBtnRef = useRef<HTMLDivElement>(null);
  // Synchronous flag — prevents stale closure from allowing extra commands
  const stepDoneRef = useRef(false);

  const currentStep = task?.steps[stepIdx];

  // Scroll terminal to bottom
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines]);

  // Restore completion status only — step cannot be resumed because
  // git state (files, commits) would be missing from the previous session.
  useEffect(() => {
    if (hydrated || !task) return;
    setHydrated(true);
    if (isCompleted(task.id)) {
      setDone(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [stepIdx]);

  // Reset hint on step change
  useEffect(() => {
    setHintOpen(false);
  }, [stepIdx]);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || !currentStep || stepDoneRef.current) return;

    const cmd = input.trim();
    const result = dispatch(gitState, cmd);

    const newLines: TerminalLine[] = [
      ...lines,
      { type: "input", text: cmd },
    ];

    if (result.output === "\x1b[CLEAR]") {
      setLines([]);
    } else if (result.output) {
      const isError = result.output.startsWith("error:") || result.output.startsWith("fatal:");
      newLines.push({ type: isError ? "error" : "output", text: result.output });
      setLines(newLines);
    } else {
      setLines(newLines);
    }

    const newState = result.output === "\x1b[CLEAR]" ? gitState : result.newState;
    setGitState(newState);
    setHistory((h) => [cmd, ...h].slice(0, 50));
    setHistIdx(-1);
    setInput("");

    // Check if step is completed
    if (currentStep.validate(newState, cmd)) {
      stepDoneRef.current = true;
      setStepDone(true);
      // Scroll to the next button after a short delay
      setTimeout(() => {
        nextBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  }, [input, currentStep, gitState, lines]);

  const handleNext = useCallback(() => {
    if (!task) return;
    stepDoneRef.current = false;
    if (stepIdx < task.steps.length - 1) {
      const next = stepIdx + 1;
      setStepIdx(next);
      setStepDone(false);
      setLines([]);
      saveStep(task.id, next);
    } else {
      markCompleted(task.id);
      setDone(true);
    }
  }, [task, stepIdx, saveStep, markCompleted]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(newIdx);
      setInput(history[newIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(histIdx - 1, -1);
      setHistIdx(newIdx);
      setInput(newIdx === -1 ? "" : history[newIdx]);
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F0]">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-fredoka)" }}>
            Tugas tidak ditemukan
          </p>
          <Link href="/tasks" className="btn-brutal px-4 py-2 bg-white inline-block"
            style={{ fontFamily: "var(--font-nunito)", textDecoration: "none", color: "#1E1B2E" }}>
            ← Kembali ke Tugas
          </Link>
        </div>
      </div>
    );
  }

  // ── Completion screen ─────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={spring}
            className="card-brutal p-10 max-w-md w-full text-center bg-white"
          >
            <FaTrophy className="text-6xl mx-auto mb-4" style={{ color: "#FFD93D" }} />
            <h2
              className="text-3xl font-bold text-[#1E1B2E] mb-2"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Tugas Selesai!
            </h2>
            <p
              className="text-base text-[#1E1B2E] opacity-60 mb-2"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              {task.title}
            </p>
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full border-2 mb-6"
              style={{
                color: task.difficultyColor,
                borderColor: task.difficultyColor,
                background: task.difficultyColor + "20",
                fontFamily: "var(--font-nunito)",
              }}
            >
              {task.difficulty} • {task.steps.length} langkah
            </span>
            <p
              className="text-sm text-[#1E1B2E] opacity-60 mb-8 leading-relaxed"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Kamu berhasil menyelesaikan semua langkah! Terus latihan untuk semakin mahir.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Link
                  href="/tasks"
                  className="btn-brutal flex-1 text-center py-2.5 text-sm bg-white"
                  style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, textDecoration: "none", color: "#1E1B2E" }}
                >
                  Tugas Lain
                </Link>
                <Link
                  href="/simulator"
                  className="btn-brutal flex-1 text-center py-2.5 text-sm text-white"
                  style={{
                    fontFamily: "var(--font-nunito)", fontWeight: 700,
                    textDecoration: "none", background: "#FF6B35",
                  }}
                >
                  Simulator →
                </Link>
              </div>
              <button
                onClick={() => {
                  resetTask(task.id);
                  stepDoneRef.current = false;
                  setDone(false);
                  setStepIdx(0);
                  setStepDone(false);
                  setLines([]);
                  setGitState(buildInitialGitState());
                }}
                className="flex items-center justify-center gap-2 text-xs opacity-40 hover:opacity-70 transition-opacity"
                style={{ fontFamily: "var(--font-nunito)", color: "#1E1B2E" }}
              >
                <FaRedo /> Ulangi dari awal
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const color = task.difficultyColor;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/tasks"
              className="text-xs font-semibold opacity-40 hover:opacity-70 transition-opacity"
              style={{ fontFamily: "var(--font-nunito)", textDecoration: "none", color: "#1E1B2E" }}
            >
              Tugas
            </Link>
            <span className="text-xs opacity-30">/</span>
            <span className="text-xs font-semibold opacity-40" style={{ fontFamily: "var(--font-nunito)" }}>
              {task.title}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full border-2"
              style={{
                color,
                borderColor: color,
                background: color + "20",
                fontFamily: "var(--font-nunito)",
              }}
            >
              {task.difficulty}
            </span>
            <span
              className="text-xs font-semibold opacity-40"
              style={{ fontFamily: "var(--font-nunito)", color: "#1E1B2E" }}
            >
              Langkah {stepIdx + 1} dari {task.steps.length}
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold text-[#1E1B2E]"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {task.title}
          </h1>
        </div>

        {/* Step progress dots */}
        <div className="flex gap-2 mb-6">
          {task.steps.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                background: i < stepIdx ? color : i === stepIdx ? color : color + "30",
                width: i === stepIdx ? "2rem" : "0.5rem",
              }}
            />
          ))}
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="card-brutal p-6 mb-4 bg-white"
          >
            <p
              className="text-xl md:text-2xl font-bold text-[#1E1B2E] leading-snug mb-4"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {currentStep?.question}
            </p>

            {/* Success message when step done */}
            {stepDone && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={spring}
                className="flex items-start gap-3 p-3 rounded-xl mb-4"
                style={{ background: color + "15", border: `2px solid ${color}` }}
              >
                <FaCheckCircle className="text-xl shrink-0 mt-0.5" style={{ color }} />
                <p
                  className="text-sm font-semibold leading-relaxed"
                  style={{ color: "#1E1B2E", fontFamily: "var(--font-nunito)" }}
                >
                  {currentStep?.successMessage}
                </p>
              </motion.div>
            )}

            {/* Hint toggle */}
            {!stepDone && (
              <button
                onClick={() => setHintOpen((v) => !v)}
                className="flex items-center gap-2 text-xs font-semibold opacity-50 hover:opacity-80 transition-opacity mb-2"
                style={{ fontFamily: "var(--font-nunito)", color: "#1E1B2E" }}
              >
                <FaLightbulb style={{ color: "#FFD93D" }} />
                {hintOpen ? "Sembunyikan petunjuk" : "Tampilkan petunjuk"}
                <FaChevronDown
                  className="text-[10px] transition-transform"
                  style={{ transform: hintOpen ? "rotate(180deg)" : "rotate(0)" }}
                />
              </button>
            )}
            {hintOpen && !stepDone && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm rounded-lg px-3 py-2 mb-2"
                style={{
                  background: "#FFD93D22",
                  border: "1.5px solid #FFD93D",
                  fontFamily: "var(--font-nunito)",
                  color: "#1E1B2E",
                }}
              >
                💡 {currentStep?.hint}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Terminal */}
        <div
          className="card-brutal bg-white mb-4 overflow-hidden"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Terminal header */}
          <div
            className="flex items-center gap-2 px-4 py-2 border-b-[2px] border-[#1E1B2E]"
            style={{ background: "#1E1B2E" }}
          >
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>
            <span className="text-xs text-white/50 font-mono ml-1">terminal</span>
            {gitState.initialized && (
              <span className="ml-auto text-xs font-mono" style={{ color: "#22C55E" }}>
                ● {gitState.currentBranch}
              </span>
            )}
          </div>

          {/* Output history */}
          <div
            ref={termRef}
            className="px-4 py-3 font-mono text-sm overflow-y-auto"
            style={{ minHeight: "120px", maxHeight: "220px", background: "#FAFAF8" }}
          >
            {lines.length === 0 && (
              <p className="text-[#1E1B2E] opacity-25 text-xs italic" style={{ fontFamily: "monospace" }}>
                {task.setupCommands?.length
                  ? "Skenario sudah disiapkan. Coba jalankan git status untuk melihat kondisi repo."
                  : "Ketik perintah Git di bawah dan tekan Enter."}
              </p>
            )}
            {lines.map((line, i) => (
              <div key={i} className="mb-0.5">
                {line.type === "input" ? (
                  <span className="text-[#1E1B2E] font-semibold">
                    <span style={{ color: "#FF6B35" }}>→ </span>{line.text}
                  </span>
                ) : line.type === "error" ? (
                  <span className="text-red-500 whitespace-pre-wrap">{line.text}</span>
                ) : (
                  <span className="text-[#1E1B2E] opacity-70 whitespace-pre-wrap">{line.text}</span>
                )}
              </div>
            ))}
          </div>

          {/* Input line */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 border-t-[2px] border-[#1E1B2E]"
            style={{ background: "#FFF9F0" }}
          >
            <span className="font-mono text-sm font-bold shrink-0" style={{ color: "#FF6B35" }}>→</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={stepDone}
              placeholder={stepDone ? "Langkah selesai! Klik Lanjut →" : currentStep?.placeholder}
              className="flex-1 bg-transparent outline-none font-mono text-sm text-[#1E1B2E] placeholder:opacity-30"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
        </div>

        {/* Next button */}
        {stepDone && (
          <motion.div
            ref={nextBtnRef}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            <button
              onClick={handleNext}
              className="btn-brutal w-full py-3 text-base font-bold flex items-center justify-center gap-2 text-white"
              style={{
                background: color,
                fontFamily: "var(--font-fredoka)",
                fontSize: "1.1rem",
              }}
            >
              {stepIdx < task.steps.length - 1 ? (
                <>Langkah Berikutnya <FaArrowRight /></>
              ) : (
                <>Selesai! <FaTrophy /></>
              )}
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
