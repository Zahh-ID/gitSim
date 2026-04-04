"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { TASKS } from "@/lib/tasks";
import { useTaskProgress } from "@/lib/useTaskProgress";
import { FaTasks, FaArrowRight, FaCheckCircle, FaPlayCircle } from "react-icons/fa";

export default function TasksPage() {
  const { isCompleted, progress } = useTaskProgress();

  const completedCount = TASKS.filter((t) => isCompleted(t.id)).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto w-full px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FaTasks className="text-5xl mx-auto mb-4" style={{ color: "#FF6B35" }} />
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1E1B2E]"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Tugas Praktik
          </h1>
          <p
            className="text-base md:text-lg text-[#1E1B2E] mt-3 max-w-lg mx-auto opacity-60 leading-relaxed"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Selesaikan tantangan Git nyata dari level mudah sampai sulit. Setiap tugas menggunakan
            simulator interaktif — tidak perlu install apapun!
          </p>

          {/* Progress summary */}
          {completedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full border-2 border-[#22C55E] bg-[#22C55E15]"
            >
              <FaCheckCircle style={{ color: "#22C55E" }} />
              <span
                className="text-sm font-bold"
                style={{ color: "#22C55E", fontFamily: "var(--font-nunito)" }}
              >
                {completedCount} / {TASKS.length} tugas selesai
              </span>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Task cards */}
      <section className="max-w-4xl mx-auto w-full px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TASKS.map((task, i) => {
            const completed = isCompleted(task.id);
            const savedStep = progress.steps[task.id];
            const inProgress = !completed && savedStep !== undefined && savedStep > 0;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
              >
                <Link
                  href={`/tasks/${task.id}`}
                  className="card-brutal flex flex-col p-5 h-full"
                  style={{
                    background: completed ? "#F0FFF4" : "white",
                    textDecoration: "none",
                    borderColor: completed ? "#22C55E" : undefined,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full border-2"
                      style={{
                        color: task.difficultyColor,
                        borderColor: task.difficultyColor,
                        background: task.difficultyColor + "20",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      {task.difficulty}
                    </span>

                    {/* Status badge */}
                    {completed ? (
                      <span className="flex items-center gap-1 text-xs font-bold"
                        style={{ color: "#22C55E", fontFamily: "var(--font-nunito)" }}>
                        <FaCheckCircle /> Selesai
                      </span>
                    ) : inProgress ? (
                      <span className="flex items-center gap-1 text-xs font-bold"
                        style={{ color: "#F59E0B", fontFamily: "var(--font-nunito)" }}>
                        <FaPlayCircle /> Langkah {savedStep + 1}/{task.steps.length}
                      </span>
                    ) : (
                      <span
                        className="text-xs font-bold text-[#1E1B2E] opacity-30"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        #{task.id.slice(0, 2)}
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-lg font-bold text-[#1E1B2E] mb-2"
                    style={{ fontFamily: "var(--font-fredoka)" }}
                  >
                    {task.title}
                  </h3>

                  <p
                    className="text-sm text-[#1E1B2E] opacity-60 leading-relaxed flex-1"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {task.description}
                  </p>

                  {/* Step progress bar for in-progress tasks */}
                  {inProgress && (
                    <div className="mt-3 h-1.5 rounded-full bg-[#1E1B2E15] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${((savedStep) / task.steps.length) * 100}%`,
                          background: "#F59E0B",
                        }}
                      />
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className="text-xs text-[#1E1B2E] opacity-50"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {task.steps.length} langkah
                    </span>
                    <div className="flex-1" />
                    <span
                      className="text-sm font-bold flex items-center gap-1"
                      style={{
                        color: completed ? "#22C55E" : task.difficultyColor,
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      {completed ? "Ulangi" : inProgress ? "Lanjutkan" : "Mulai"}
                      <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <footer className="border-t-[2.5px] border-[#1E1B2E] py-6 text-center">
        <p
          className="text-sm opacity-50"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Git Simulator - Proyek PSBI, Pendidikan Teknik Informatika UM
        </p>
      </footer>
    </div>
  );
}
