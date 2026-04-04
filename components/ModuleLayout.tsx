"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import StepNavigator from "./StepNavigator";
import { FaCheckCircle, FaRedo } from "react-icons/fa";

interface Props {
  title: string;
  moduleNumber: number;
  moduleId: string;
  currentStep: number;
  totalSteps: number;
  color: string;
  onPrev: () => void;
  onNext: () => void;
  onStartQuiz?: () => void;
  children: React.ReactNode;
}

export default function ModuleLayout({
  title,
  moduleNumber,
  moduleId,
  currentStep,
  totalSteps,
  color,
  onPrev,
  onNext,
  onStartQuiz,
  children,
}: Props) {
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`git-sim-quiz-${moduleId}`);
      if (raw) setQuizDone(!!JSON.parse(raw).done);
    } catch {}
  }, [moduleId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Module header */}
        <div className="mb-6">
          <div
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 border-2"
            style={{
              background: color + "22",
              color: color,
              borderColor: color,
              fontFamily: "var(--font-nunito)",
            }}
          >
            Modul {String(moduleNumber).padStart(2, "0")}
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#1E1B2E]"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {title}
          </h1>
          <p
            className="text-sm mt-1 font-semibold"
            style={{ color: color, fontFamily: "var(--font-nunito)" }}
          >
            Step {currentStep + 1} dari {totalSteps}
          </p>
        </div>

        {/* Quiz done banner */}
        {quizDone && (
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 mb-5"
            style={{
              background: color + "15",
              borderColor: color,
              fontFamily: "var(--font-nunito)",
            }}
          >
            <div className="flex items-center gap-2">
              <FaCheckCircle style={{ color }} />
              <span className="text-sm font-bold" style={{ color: "#1E1B2E" }}>
                Kamu sudah menyelesaikan modul ini!
              </span>
            </div>
            {onStartQuiz && (
              <button
                onClick={onStartQuiz}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border-2"
                style={{
                  color,
                  borderColor: color,
                  background: color + "22",
                  fontFamily: "var(--font-nunito)",
                }}
              >
                <FaRedo className="text-[10px]" /> Ulangi Kuis
              </button>
            )}
          </div>
        )}

        {/* Content area */}
        <div className="card-brutal p-6 mb-6">{children}</div>

        {/* Navigation */}
        <StepNavigator
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrev={onPrev}
          onNext={onNext}
          color={color}
          onStartQuiz={onStartQuiz}
        />
      </main>
    </div>
  );
}
