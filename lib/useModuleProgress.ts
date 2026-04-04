"use client";

import { useState, useEffect, useCallback } from "react";

interface ModuleState {
  step: number;
}

interface QuizState {
  qIdx: number;
  score: number;
  done: boolean;
}

function moduleKey(id: string) {
  return `git-sim-module-${id}`;
}

function quizKey(id: string) {
  return `git-sim-quiz-${id}`;
}

function loadJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full — silently ignore
  }
}

/** Step always starts at 0. showQuiz is local-only (not persisted). */
export function useModuleProgress(moduleId: string) {
  const [step, setStepRaw] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const setStep = useCallback((v: number | ((prev: number) => number)) => {
    setStepRaw((prev) => {
      const next = typeof v === "function" ? v(prev) : v;
      saveJSON(moduleKey(moduleId), { step: next });
      return next;
    });
  }, [moduleId]);

  return { step, setStep, showQuiz, setShowQuiz };
}

/** Persists quiz progress (qIdx, score, done) */
export function useQuizProgress(moduleId: string) {
  const [qIdx, setQIdxRaw] = useState(0);
  const [score, setScoreRaw] = useState(0);
  const [done, setDoneRaw] = useState(false);

  useEffect(() => {
    const saved = loadJSON<QuizState>(quizKey(moduleId));
    if (saved) {
      setQIdxRaw(saved.qIdx ?? 0);
      setScoreRaw(saved.score ?? 0);
      setDoneRaw(saved.done ?? false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((state: QuizState) => {
    saveJSON(quizKey(moduleId), state);
  }, [moduleId]);

  const setQIdx = useCallback((v: number | ((p: number) => number)) => {
    setQIdxRaw(v);
  }, []);

  const setScore = useCallback((v: number | ((p: number) => number)) => {
    setScoreRaw(v);
  }, []);

  const setDone = useCallback((v: boolean) => {
    setDoneRaw(v);
  }, []);

  const reset = useCallback(() => {
    const fresh = { qIdx: 0, score: 0, done: false };
    setQIdxRaw(0);
    setScoreRaw(0);
    setDoneRaw(false);
    persist(fresh);
  }, [persist]);

  return { qIdx, setQIdx, score, setScore, done, setDone, persist, reset };
}
