"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { GitState, TerminalLine, AnimationEvent, EditorRequest } from "@/types/git";
import { createInitialState, dispatch, getCommittedTree } from "@/lib/git-engine";
import WorkingDirectory from "./WorkingDirectory";
import StagingArea from "./StagingArea";
import Repository from "./Repository";
import CommitGraph, { LANE_HEIGHT } from "./CommitGraph";
import Terminal from "./Terminal";
import FileEditor from "./FileEditor";
import { FaTrash } from "react-icons/fa";

interface Props {
  initialCommands?: string[];
  /** If provided, git state + terminal are saved to localStorage under this key */
  storageKey?: string;
}

interface SavedState {
  gitState: GitState;
  lines: TerminalLine[];
}

function loadSaved(key: string): SavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as SavedState) : null;
  } catch {
    return null;
  }
}

function buildInitialState(initialCommands?: string[]): { state: GitState; lines: TerminalLine[] } {
  let state = createInitialState();
  const lines: TerminalLine[] = [
    {
      type: "output",
      text: 'Git Simulator — ketik "help" untuk daftar perintah, atau mulai dengan "git init"',
    },
  ];
  if (initialCommands) {
    for (const cmd of initialCommands) {
      const result = dispatch(state, cmd);
      state = result.newState;
    }
    lines.push({ type: "output", text: "✓ Skenario tugas sudah disiapkan. Selamat mengerjakan!" });
  }
  return { state, lines };
}

export default function SimulatorLayout({ initialCommands, storageKey }: Props) {
  const fresh = useMemo(() => buildInitialState(initialCommands), []);

  // If storageKey given, try to restore saved state on mount
  const [gitState, setGitState] = useState<GitState>(fresh.state);
  const [lines, setLines] = useState<TerminalLine[]>(fresh.lines);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    if (!storageKey || restored) return;
    setRestored(true);
    const saved = loadSaved(storageKey);
    if (saved) {
      setGitState(saved.gitState);
      setLines(saved.lines);
    }
  }, [storageKey, restored]);

  // Debounce-save whenever state changes
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!storageKey) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ gitState, lines }));
      } catch {
        // storage full — silently ignore
      }
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [gitState, lines, storageKey]);

  const handleClear = useCallback(() => {
    if (!storageKey) return;
    localStorage.removeItem(storageKey);
    setGitState(fresh.state);
    setLines(fresh.lines);
  }, [storageKey, fresh]);

  const [pendingEvents, setPendingEvents] = useState<AnimationEvent[]>([]);
  const [editorRequest, setEditorRequest] = useState<EditorRequest | null>(null);
  const [numLanes, setNumLanes] = useState(1);

  const graphHeight = useMemo(
    () => Math.max(120, 56 + numLanes * LANE_HEIGHT),
    [numLanes]
  );

  const handleCommand = useCallback(
    (input: string) => {
      const result = dispatch(gitState, input);

      setLines((prev) => {
        const next: TerminalLine[] = [...prev, { type: "input", text: input }];
        if (result.output === "\x1b[CLEAR]") return [];
        if (result.output) {
          const isError =
            result.output.startsWith("error:") ||
            result.output.startsWith("fatal:");
          next.push({ type: isError ? "error" : "output", text: result.output });
        }
        return next;
      });

      if (result.output !== "\x1b[CLEAR]") {
        setGitState(result.newState);
        if (result.events.length > 0) setPendingEvents(result.events);
        if (result.editorRequest) setEditorRequest(result.editorRequest);
      } else {
        setLines([]);
      }
    },
    [gitState]
  );

  const clearEvents = useCallback(() => setPendingEvents([]), []);

  const handleFileClick = useCallback(
    (filename: string) => {
      const committed = getCommittedTree(gitState);
      const staged = gitState.stagingArea[filename];
      const content =
        gitState.workingDirectory[filename]?.content ??
        (staged && staged !== "__deleted__" ? staged : undefined) ??
        committed[filename] ??
        "";
      const isNew = !committed[filename];
      setEditorRequest({ filename, content, isNew });
    },
    [gitState]
  );

  const handleEditorSave = useCallback(
    (filename: string, newContent: string) => {
      setGitState((prev) => {
        const committed = getCommittedTree(prev);
        const wasCommitted = filename in committed;

        if (wasCommitted && newContent === committed[filename]) {
          const newWD = { ...prev.workingDirectory };
          delete newWD[filename];
          return { ...prev, workingDirectory: newWD };
        }

        return {
          ...prev,
          workingDirectory: {
            ...prev.workingDirectory,
            [filename]: {
              content: newContent,
              status: wasCommitted ? "modified" : "untracked",
            },
          },
        };
      });

      setLines((prev) => [
        ...prev,
        { type: "output", text: `"${filename}" saved` },
      ]);
      setEditorRequest(null);
    },
    []
  );

  return (
    <div className="flex flex-col h-full bg-[#FFF9F0] select-none">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-2.5 border-b-[2px] border-[#1E1B2E] shrink-0 bg-[#F5EDE0]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-sm font-bold text-[#1E1B2E]" style={{ fontFamily: "var(--font-fredoka)" }}>
            Git Simulator
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Branch indicator */}
          <div className="flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-nunito)" }}>
            {gitState.initialized ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[#1E1B2E]/60">
                  branch:{" "}
                  <span className="font-bold text-[#22C55E]">
                    {gitState.currentBranch}
                  </span>
                </span>
              </>
            ) : (
              <span className="text-[#1E1B2E]/40">not initialized</span>
            )}
          </div>

          {/* Clear / reset button — only when storageKey is set */}
          {storageKey && (
            <button
              onClick={handleClear}
              title="Reset simulator"
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded border-[1.5px] border-[#1E1B2E]/30 hover:border-red-400 hover:text-red-500 transition-colors text-[#1E1B2E]/50"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              <FaTrash className="text-[10px]" />
              Reset
            </button>
          )}
        </div>
      </header>

      {/* Three-area panels */}
      <div className="flex border-b-[2px] border-[#1E1B2E] shrink-0" style={{ height: "220px" }}>
        <WorkingDirectory
          files={gitState.workingDirectory}
          stagedFiles={gitState.stagingArea}
          committedFiles={Object.keys(getCommittedTree(gitState))}
          events={pendingEvents}
          onFileClick={handleFileClick}
          className="flex-1 border-r-[2px] border-[#1E1B2E]"
        />
        <StagingArea
          files={gitState.stagingArea}
          events={pendingEvents}
          className="flex-1 border-r-[2px] border-[#1E1B2E]"
        />
        <Repository
          commits={gitState.commits}
          commitOrder={gitState.commitOrder}
          branches={gitState.branches}
          currentBranch={gitState.currentBranch}
          events={pendingEvents}
          onAnimationDone={clearEvents}
          className="flex-1"
        />
      </div>

      {/* Commit Graph */}
      <div
        className="border-b-[2px] border-[#1E1B2E] shrink-0 transition-all duration-300"
        style={{ height: `${graphHeight}px` }}
      >
        <CommitGraph
          commits={gitState.commits}
          commitOrder={gitState.commitOrder}
          branches={gitState.branches}
          currentBranch={gitState.currentBranch}
          HEAD={gitState.HEAD}
          onNumLanes={setNumLanes}
        />
      </div>

      {/* Terminal */}
      <div className="flex-1 min-h-0">
        <Terminal lines={lines} onCommand={handleCommand} />
      </div>

      {/* File Editor modal */}
      {editorRequest && (
        <FileEditor
          request={editorRequest}
          onSave={handleEditorSave}
          onClose={() => setEditorRequest(null)}
        />
      )}
    </div>
  );
}
