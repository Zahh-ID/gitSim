"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "git-sim-task-progress";

interface Progress {
  completed: string[];         // task IDs that are fully done
  steps: Record<string, number>; // taskId → last reached stepIdx
}

function load(): Progress {
  if (typeof window === "undefined") return { completed: [], steps: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: [], steps: {} };
    return JSON.parse(raw) as Progress;
  } catch {
    return { completed: [], steps: {} };
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // storage full or blocked — silently ignore
  }
}

export function useTaskProgress() {
  const [progress, setProgress] = useState<Progress>({ completed: [], steps: {} });

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    setProgress(load());
  }, []);

  const getSavedStep = useCallback(
    (taskId: string) => progress.steps[taskId] ?? 0,
    [progress]
  );

  const isCompleted = useCallback(
    (taskId: string) => progress.completed.includes(taskId),
    [progress]
  );

  const saveStep = useCallback((taskId: string, stepIdx: number) => {
    setProgress((prev) => {
      const next = { ...prev, steps: { ...prev.steps, [taskId]: stepIdx } };
      save(next);
      return next;
    });
  }, []);

  const markCompleted = useCallback((taskId: string) => {
    setProgress((prev) => {
      if (prev.completed.includes(taskId)) return prev;
      const next = {
        completed: [...prev.completed, taskId],
        steps: { ...prev.steps, [taskId]: -1 }, // -1 = done
      };
      save(next);
      return next;
    });
  }, []);

  const resetTask = useCallback((taskId: string) => {
    setProgress((prev) => {
      const newCompleted = prev.completed.filter((id) => id !== taskId);
      const newSteps = { ...prev.steps };
      delete newSteps[taskId];
      const next = { completed: newCompleted, steps: newSteps };
      save(next);
      return next;
    });
  }, []);

  return { getSavedStep, isCompleted, saveStep, markCompleted, resetTask, progress };
}
