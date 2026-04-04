"use client";

import { useState, useEffect } from "react";
import { useQuizProgress } from "@/lib/useModuleProgress";
import Navbar from "./Navbar";
import Link from "next/link";
import {
  FaTrophy, FaRedo, FaHome, FaBook, FaDumbbell,
  FaArrowRight, FaCheckCircle, FaTimesCircle,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Props {
  questions: QuizQuestion[];
  color: string;
  moduleTitle: string;
  moduleId: string;
  nextHref?: string;
  nextLabel?: string;
}

export default function QuizBlock({
  questions,
  color,
  moduleTitle,
  moduleId,
  nextHref,
  nextLabel,
}: Props) {
  const { qIdx, setQIdx, score, setScore, done, setDone, persist, reset } = useQuizProgress(moduleId);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  // Persist whenever quiz state changes
  useEffect(() => {
    persist({ qIdx, score, done });
  }, [qIdx, score, done, persist]);

  const q = questions[qIdx];

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (qIdx + 1 >= questions.length) {
      setDone(true);
    } else {
      setQIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const scorePercent = Math.round((score / questions.length) * 100);
  const ScoreIcon = scorePercent === 100 ? FaTrophy
    : scorePercent >= 75 ? HiSparkles
    : scorePercent >= 50 ? FaDumbbell
    : FaBook;

  const getMessage = () => {
    if (scorePercent === 100) return "Sempurna! Kamu jenius!";
    if (scorePercent >= 75) return "Bagus banget! Hampir sempurna!";
    if (scorePercent >= 50) return "Lumayan! Coba review lagi ya";
    return "Yuk belajar lagi, kamu pasti bisa!";
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="card-brutal p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4 flex justify-center" style={{ color }}>
              <ScoreIcon />
            </div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "var(--font-fredoka)", color }}
            >
              Kuis Selesai!
            </h2>
            <p className="text-[#1E1B2E] font-semibold mb-1" style={{ fontFamily: "var(--font-nunito)" }}>
              {moduleTitle}
            </p>
            <div
              className="text-5xl font-bold my-6"
              style={{ fontFamily: "var(--font-fredoka)", color }}
            >
              {score}/{questions.length}
            </div>
            <p className="text-lg font-bold mb-6" style={{ fontFamily: "var(--font-nunito)" }}>
              {getMessage()}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                className="btn-brutal px-5 py-2 text-sm bg-white flex items-center gap-2"
                style={{ fontFamily: "var(--font-nunito)", fontWeight: 700 }}
                onClick={() => {
                  reset();
                  setSelected(null);
                  setAnswered(false);
                }}
              >
                <FaRedo /> Ulangi Kuis
              </button>
              {nextHref && (
                <Link
                  href={nextHref}
                  className="btn-brutal px-5 py-2 text-sm text-white flex items-center gap-2"
                  style={{
                    fontFamily: "var(--font-nunito)",
                    fontWeight: 700,
                    background: color,
                    textDecoration: "none",
                  }}
                >
                  {nextLabel ?? "Modul Selanjutnya"} <FaArrowRight />
                </Link>
              )}
              {!nextHref && (
                <Link
                  href="/"
                  className="btn-brutal px-5 py-2 text-sm text-white flex items-center gap-2"
                  style={{
                    fontFamily: "var(--font-nunito)",
                    fontWeight: 700,
                    background: color,
                    textDecoration: "none",
                  }}
                >
                  <FaHome /> Ke Beranda
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 border-2"
            style={{
              background: color + "22",
              color,
              borderColor: color,
              fontFamily: "var(--font-nunito)",
            }}
          >
            Kuis — {moduleTitle}
          </div>
          <div className="flex items-center justify-between">
            <h2
              className="text-2xl font-bold text-[#1E1B2E]"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Soal {qIdx + 1} dari {questions.length}
            </h2>
            <span className="text-sm font-bold" style={{ color, fontFamily: "var(--font-nunito)" }}>
              Skor: {score}/{qIdx}
            </span>
          </div>
        </div>

        {/* Question card */}
        <div className="card-brutal p-6 mb-4">
          <p
            className="text-lg font-bold mb-6"
            style={{ fontFamily: "var(--font-nunito)", color: "#1E1B2E" }}
          >
            {q.question}
          </p>

          <div className="flex flex-col gap-3">
            {q.options.map((opt, i) => {
              let bg = "bg-white";
              let border = "border-[#1E1B2E]";
              let textColor = "#1E1B2E";

              if (answered) {
                if (i === q.correct) {
                  bg = "bg-green-50";
                  border = "border-green-500";
                  textColor = "#16a34a";
                } else if (i === selected) {
                  bg = "bg-red-50";
                  border = "border-red-400";
                  textColor = "#dc2626";
                } else {
                  border = "border-[#1E1B2E30]";
                  textColor = "#1E1B2E60";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all ${bg} ${border}`}
                  style={{ fontFamily: "var(--font-nunito)", color: textColor, cursor: answered ? "default" : "pointer" }}
                >
                  <span className="mr-2 font-bold opacity-50">{["A", "B", "C", "D"][i]}.</span>
                  {opt}
                  {answered && i === q.correct && <FaCheckCircle className="ml-2 inline text-green-600" />}
                  {answered && i === selected && i !== q.correct && <FaTimesCircle className="ml-2 inline text-red-500" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div
              className="mt-4 p-3 rounded-xl border-2 text-sm"
              style={{
                background: selected === q.correct ? "#22C55E15" : "#FF6B3515",
                borderColor: selected === q.correct ? "#22C55E" : "#FF6B35",
                color: "#1E1B2E",
                fontFamily: "var(--font-nunito)",
              }}
            >
              <span className="font-bold mr-1 inline-flex items-center gap-1">
                {selected === q.correct
                  ? <><FaCheckCircle className="text-green-600" /> Benar!</>
                  : <><FaTimesCircle className="text-red-500" /> Salah!</>}
              </span>
              {q.explanation}
            </div>
          )}
        </div>

        {/* Next button */}
        {answered && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="btn-brutal px-6 py-2.5 text-sm font-bold text-white"
              style={{ background: color, fontFamily: "var(--font-nunito)" }}
            >
              {qIdx + 1 >= questions.length
                ? <span className="flex items-center gap-2"><FaTrophy /> Lihat Hasil</span>
                : <span className="flex items-center gap-2">Soal Berikutnya <FaArrowRight /></span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
