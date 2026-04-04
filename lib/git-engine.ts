import type {
  GitState,
  Commit,
  DispatchResult,
  AnimationEvent,
} from "@/types/git";

export function getCommittedTree(state: GitState): Record<string, string> {
  if (!state.HEAD || !state.commits[state.HEAD]) return {};
  return { ...state.commits[state.HEAD].tree };
}

export function createInitialState(): GitState {
  return {
    initialized: false,
    currentBranch: "main",
    HEAD: "",
    workingDirectory: {},
    stagingArea: {},
    commits: {},
    commitOrder: [],
    branches: {},
    remotes: {},
  };
}

function generateHash(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 7);
}

export function dispatch(state: GitState, input: string): DispatchResult {
  const trimmed = input.trim();
  const events: AnimationEvent[] = [];

  if (!trimmed) {
    return { newState: state, output: "", events: [] };
  }

  const tokens = tokenize(trimmed);
  const cmd = tokens[0];

  // Non-git helpers
  if (cmd === "touch") return cmdTouch(state, tokens);
  if (cmd === "echo") return cmdEcho(state, tokens);
  if (cmd === "ls") return cmdLs(state);
  if (cmd === "clear") return { newState: state, output: "\x1b[CLEAR]", events: [] };
  if (cmd === "help") return cmdHelp(state);
  if (cmd === "edit" || cmd === "nano" || cmd === "vim") return cmdEdit(state, tokens);

  if (cmd !== "git") {
    return err(state, `command not found: ${cmd}`);
  }

  const sub = tokens[1];

  if (!sub) return err(state, "usage: git <command>");

  switch (sub) {
    case "init":     return cmdInit(state, tokens, events);
    case "status":   return cmdStatus(state);
    case "add":      return cmdAdd(state, tokens, events);
    case "commit":   return cmdCommit(state, tokens, events);
    case "log":      return cmdLog(state);
    case "branch":   return cmdBranch(state, tokens, events);
    case "checkout": return cmdCheckout(state, tokens, events);
    case "switch":   return cmdSwitch(state, tokens, events);
    case "merge":    return cmdMerge(state, tokens, events);
    case "diff":     return cmdDiff(state);
    case "reset":    return cmdReset(state, tokens);
    case "restore":  return cmdRestore(state, tokens);
    default:
      return err(state, `git: '${sub}' is not a git command`);
  }
}

// ── helpers ──────────────────────────────────────────────────────────────────

function ok(state: GitState, output: string, events: AnimationEvent[] = []): DispatchResult {
  return { newState: state, output, events };
}

function err(state: GitState, msg: string): DispatchResult {
  return { newState: state, output: `error: ${msg}`, events: [] };
}

function requireInit(state: GitState): string | null {
  if (!state.initialized)
    return "not a git repository (run 'git init' first)";
  return null;
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuote = false;
  let quoteChar = "";

  for (const ch of input) {
    if (inQuote) {
      if (ch === quoteChar) inQuote = false;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      inQuote = true;
      quoteChar = ch;
    } else if (ch === " ") {
      if (current) { tokens.push(current); current = ""; }
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

// ── commands ──────────────────────────────────────────────────────────────────

function cmdInit(state: GitState, _tokens: string[], events: AnimationEvent[]): DispatchResult {
  if (state.initialized) return ok(state, "Reinitialized existing Git repository in .git/", events);
  const newState: GitState = {
    ...state,
    initialized: true,
    currentBranch: "main",
    branches: { main: "" },
  };
  return ok(newState, "Initialized empty Git repository in .git/", events);
}

function cmdStatus(state: GitState): DispatchResult {
  const e = requireInit(state);
  if (e) return err(state, e);

  const committed = getCommittedTree(state);
  const lines: string[] = [`On branch ${state.currentBranch}`, ""];

  const staged = Object.keys(state.stagingArea);
  if (staged.length > 0) {
    lines.push("Changes to be committed:");
    lines.push('  (use "git restore --staged <file>" to unstage)');
    for (const f of staged) {
      if (!committed[f]) lines.push(`\tnew file:   ${f}`);
      else if (state.stagingArea[f] === null) lines.push(`\tdeleted:    ${f}`);
      else lines.push(`\tmodified:   ${f}`);
    }
    lines.push("");
  }

  const unstaged: string[] = [];
  const untracked: string[] = [];

  for (const [f, wdf] of Object.entries(state.workingDirectory)) {
    if (wdf.status === "untracked") untracked.push(f);
    else unstaged.push(f);
  }

  if (unstaged.length > 0) {
    lines.push("Changes not staged for commit:");
    for (const f of unstaged) {
      lines.push(`\t${state.workingDirectory[f].status}:   ${f}`);
    }
    lines.push("");
  }

  if (untracked.length > 0) {
    lines.push("Untracked files:");
    lines.push('  (use "git add <file>" to include in what will be committed)');
    for (const f of untracked) lines.push(`\t${f}`);
    lines.push("");
  }

  if (staged.length === 0 && unstaged.length === 0 && untracked.length === 0) {
    lines.push("nothing to commit, working tree clean");
  }

  return ok(state, lines.join("\n"));
}

function cmdAdd(state: GitState, tokens: string[], events: AnimationEvent[]): DispatchResult {
  const e = requireInit(state);
  if (e) return err(state, e);

  const target = tokens[2];
  if (!target) return err(state, "nothing specified, nothing added");

  const committed = getCommittedTree(state);
  let filesToStage: string[] = [];

  if (target === ".") {
    filesToStage = Object.keys(state.workingDirectory);
  } else {
    if (!state.workingDirectory[target] && committed[target] === undefined) {
      return err(state, `pathspec '${target}' did not match any files`);
    }
    filesToStage = [target];
  }

  const newStagingArea = { ...state.stagingArea };
  const newWD = { ...state.workingDirectory };
  const actualStaged: string[] = [];

  for (const f of filesToStage) {
    if (f.startsWith("__del__")) {
      const realF = f.slice(7);
      newStagingArea[realF] = "__deleted__";
      actualStaged.push(realF);
    } else if (newWD[f]) {
      newStagingArea[f] = newWD[f].content;
      delete newWD[f];
      actualStaged.push(f);
    }
  }

  if (actualStaged.length === 0) return ok(state, "", events);

  events.push({ type: "file-to-staging", files: actualStaged });

  return ok({ ...state, stagingArea: newStagingArea, workingDirectory: newWD }, "", events);
}

function cmdCommit(state: GitState, tokens: string[], events: AnimationEvent[]): DispatchResult {
  const e = requireInit(state);
  if (e) return err(state, e);

  if (Object.keys(state.stagingArea).length === 0) {
    return ok(state, "On branch " + state.currentBranch + "\nnothing to commit, working tree clean");
  }

  const mIdx = tokens.indexOf("-m");
  if (mIdx === -1 || !tokens[mIdx + 1]) {
    return err(state, "please provide a commit message with -m \"message\"");
  }
  const message = tokens[mIdx + 1];

  const parentHash = state.HEAD || null;
  const parentTree = getCommittedTree(state);
  const newTree = { ...parentTree };

  // Apply staging area to tree
  for (const [f, content] of Object.entries(state.stagingArea)) {
    if (content === "__deleted__") delete newTree[f];
    else newTree[f] = content;
  }

  const hash = generateHash();
  const commit: Commit = {
    hash,
    message,
    parent: parentHash,
    tree: newTree,
    branch: state.currentBranch,
    timestamp: Date.now(),
  };

  const stagedFiles = Object.keys(state.stagingArea);
  events.push({ type: "staging-to-commit", files: stagedFiles, commitHash: hash });

  const newState: GitState = {
    ...state,
    HEAD: hash,
    commits: { ...state.commits, [hash]: commit },
    commitOrder: [...state.commitOrder, hash],
    branches: { ...state.branches, [state.currentBranch]: hash },
    stagingArea: {},
  };

  const summary = `[${state.currentBranch} ${hash}] ${message}\n ${stagedFiles.length} file(s) changed`;
  return ok(newState, summary, events);
}

function cmdLog(state: GitState): DispatchResult {
  const e = requireInit(state);
  if (e) return err(state, e);

  if (!state.HEAD) {
    return ok(state, "fatal: your current branch has no commits yet");
  }

  const lines: string[] = [];
  let current: string | null = state.HEAD;

  while (current && state.commits[current]) {
    const c: Commit = state.commits[current];
    const branchLabels = Object.entries(state.branches)
      .filter(([, h]) => h === c.hash)
      .map(([b]) => b)
      .join(", ");
    lines.push(`commit ${c.hash}${branchLabels ? `  (${branchLabels})` : ""}`);
    lines.push(`    ${c.message}`);
    lines.push("");
    current = c.parent;
  }

  return ok(state, lines.join("\n").trimEnd());
}

function cmdBranch(state: GitState, tokens: string[], events: AnimationEvent[]): DispatchResult {
  const e = requireInit(state);
  if (e) return err(state, e);

  const name = tokens[2];

  // List branches
  if (!name || tokens[2] === "-v") {
    const lines = Object.keys(state.branches).map((b) =>
      `${b === state.currentBranch ? "* " : "  "}${b}${tokens[2] === "-v" ? "  " + (state.branches[b] || "(no commits)") : ""}`
    );
    return ok(state, lines.join("\n"));
  }

  // Delete branch
  if (tokens[2] === "-d" || tokens[2] === "-D") {
    const target = tokens[3];
    if (!target) return err(state, "branch name required");
    if (target === state.currentBranch) return err(state, `cannot delete branch '${target}' checked out`);
    if (!state.branches[target]) return err(state, `branch '${target}' not found`);
    const newBranches = { ...state.branches };
    delete newBranches[target];
    return ok({ ...state, branches: newBranches }, `Deleted branch ${target}.`);
  }

  if (state.branches[name] !== undefined) {
    return err(state, `branch '${name}' already exists`);
  }

  events.push({ type: "new-branch", name });
  const newState: GitState = {
    ...state,
    branches: { ...state.branches, [name]: state.HEAD },
  };
  return ok(newState, "", events);
}

function cmdCheckout(state: GitState, tokens: string[], events: AnimationEvent[]): DispatchResult {
  const e = requireInit(state);
  if (e) return err(state, e);

  // git checkout -b <branch>
  if (tokens[2] === "-b") {
    const name = tokens[3];
    if (!name) return err(state, "branch name required");
    if (state.branches[name] !== undefined) return err(state, `branch '${name}' already exists`);

    events.push({ type: "new-branch", name });
    events.push({ type: "branch-switch", from: state.currentBranch, to: name });

    return ok({
      ...state,
      branches: { ...state.branches, [name]: state.HEAD },
      currentBranch: name,
    }, `Switched to a new branch '${name}'`, events);
  }

  const target = tokens[2];
  if (!target) return err(state, "branch name or commit required");

  if (state.branches[target] === undefined) {
    return err(state, `pathspec '${target}' did not match any branch`);
  }

  const targetHash = state.branches[target];
  const targetTree = targetHash && state.commits[targetHash]
    ? state.commits[targetHash].tree
    : {};

  events.push({ type: "branch-switch", from: state.currentBranch, to: target });

  return ok({
    ...state,
    currentBranch: target,
    HEAD: targetHash || "",
    stagingArea: {},
    workingDirectory: {},
  }, `Switched to branch '${target}'`, events);
}

function cmdSwitch(state: GitState, tokens: string[], events: AnimationEvent[]): DispatchResult {
  // git switch acts like checkout for branches
  if (tokens[2] === "-c") {
    return cmdCheckout(state, ["git", "checkout", "-b", tokens[3]], events);
  }
  return cmdCheckout(state, ["git", "checkout", tokens[2]], events);
}

function cmdMerge(state: GitState, tokens: string[], events: AnimationEvent[]): DispatchResult {
  const e = requireInit(state);
  if (e) return err(state, e);

  const source = tokens[2];
  if (!source) return err(state, "branch name required");
  if (!state.branches[source]) return err(state, `branch '${source}' not found`);

  if (source === state.currentBranch) {
    return ok(state, "Already up to date.");
  }

  const sourceHash = state.branches[source];
  if (!sourceHash) return ok(state, "Already up to date.");

  // Fast-forward: if current branch has no commits or source is ahead
  const currentHash = state.HEAD;
  const sourceCommit = state.commits[sourceHash];

  if (!currentHash) {
    // Fast-forward from empty
    events.push({ type: "merge", from: source, into: state.currentBranch });
    return ok({
      ...state,
      HEAD: sourceHash,
      branches: { ...state.branches, [state.currentBranch]: sourceHash },
      workingDirectory: {},
    }, `Fast-forward\nUpdated branch '${state.currentBranch}' to '${source}'`, events);
  }

  // Check if source is ancestor of current (already merged)
  let ancestor: string | null = currentHash;
  while (ancestor) {
    if (ancestor === sourceHash) return ok(state, "Already up to date.");
    ancestor = state.commits[ancestor]?.parent ?? null;
  }

  // Check if current is ancestor of source (fast-forward)
  ancestor = sourceHash;
  let isFastForward = false;
  while (ancestor) {
    if (ancestor === currentHash) { isFastForward = true; break; }
    ancestor = state.commits[ancestor]?.parent ?? null;
  }

  if (isFastForward) {
    events.push({ type: "merge", from: source, into: state.currentBranch });
    return ok({
      ...state,
      HEAD: sourceHash,
      branches: { ...state.branches, [state.currentBranch]: sourceHash },
      workingDirectory: {},
    }, `Fast-forward\n${source} -> ${state.currentBranch}`, events);
  }

  // Simple merge commit (no conflict detection for now)
  const currentTree = getCommittedTree(state);
  const sourceTree = sourceCommit?.tree ?? {};
  const mergedTree = { ...currentTree, ...sourceTree };

  const hash = generateHash();
  const mergeCommit: Commit = {
    hash,
    message: `Merge branch '${source}' into ${state.currentBranch}`,
    parent: currentHash,
    mergeParent: sourceHash,
    tree: mergedTree,
    branch: state.currentBranch,
    timestamp: Date.now(),
  };

  events.push({ type: "merge", from: source, into: state.currentBranch });

  return ok({
    ...state,
    HEAD: hash,
    commits: { ...state.commits, [hash]: mergeCommit },
    commitOrder: [...state.commitOrder, hash],
    branches: { ...state.branches, [state.currentBranch]: hash },
  }, `Merge made by the 'ort' strategy.\nMerge branch '${source}' into ${state.currentBranch}`, events);
}

function cmdDiff(state: GitState): DispatchResult {
  const e = requireInit(state);
  if (e) return err(state, e);

  const committed = getCommittedTree(state);
  const lines: string[] = [];

  for (const [f, wdf] of Object.entries(state.workingDirectory)) {
    lines.push(`diff --git a/${f} b/${f}`);
    lines.push(`--- a/${f}`);
    lines.push(`+++ b/${f}`);
    if (wdf.status === "untracked") {
      lines.push(`+++ (new file)`);
    } else {
      lines.push(`- ${committed[f] ?? ""}`);
      lines.push(`+ ${wdf.content}`);
    }
    lines.push("");
  }

  return ok(state, lines.length ? lines.join("\n") : "");
}

function cmdReset(state: GitState, tokens: string[]): DispatchResult {
  const e = requireInit(state);
  if (e) return err(state, e);

  if (tokens[2] === "HEAD" || tokens[2] === "--soft" || tokens[2] === "--mixed") {
    // Unstage everything
    const newWD = { ...state.workingDirectory };
    for (const [f, content] of Object.entries(state.stagingArea)) {
      if (content !== "__deleted__") {
        newWD[f] = { content, status: "untracked" };
      }
    }
    return ok({ ...state, stagingArea: {}, workingDirectory: newWD }, "Unstaged changes.");
  }

  return err(state, "unsupported reset mode");
}

function cmdRestore(state: GitState, tokens: string[]): DispatchResult {
  const e = requireInit(state);
  if (e) return err(state, e);

  const staged = tokens[2] === "--staged";
  const file = staged ? tokens[3] : tokens[2];

  if (!file) return err(state, "file required");

  if (staged) {
    const newStagingArea = { ...state.stagingArea };
    if (!(file in newStagingArea)) return err(state, `pathspec '${file}' did not match any staged file`);
    const content = newStagingArea[file];
    delete newStagingArea[file];
    const newWD = { ...state.workingDirectory, [file]: { content, status: "untracked" as const } };
    return ok({ ...state, stagingArea: newStagingArea, workingDirectory: newWD }, "");
  }

  // Restore working file to committed version
  const committed = getCommittedTree(state);
  if (!(file in committed)) return err(state, `pathspec '${file}' did not match any files known to git`);
  const newWD = { ...state.workingDirectory };
  delete newWD[file];
  return ok({ ...state, workingDirectory: newWD }, "");
}

// ── shell helpers ──────────────────────────────────────────────────────────────

function cmdTouch(state: GitState, tokens: string[]): DispatchResult {
  const files = tokens.slice(1);
  if (files.length === 0) return err(state, "touch: missing operand");

  const newWD = { ...state.workingDirectory };
  for (const file of files) {
    if (!newWD[file]) {
      newWD[file] = { content: "", status: "untracked" };
    }
  }
  return ok({ ...state, workingDirectory: newWD }, "");
}

function cmdEcho(state: GitState, tokens: string[]): DispatchResult {
  // echo "content" > file  or  echo "content" >> file
  const redirectIdx = tokens.indexOf(">");
  const appendIdx = tokens.indexOf(">>");

  if (redirectIdx === -1 && appendIdx === -1) {
    return ok(state, tokens.slice(1).join(" "));
  }

  const opIdx = appendIdx !== -1 && (redirectIdx === -1 || appendIdx < redirectIdx) ? appendIdx : redirectIdx;
  const append = opIdx === appendIdx;
  const content = tokens.slice(1, opIdx).join(" ");
  const file = tokens[opIdx + 1];

  if (!file) return err(state, "redirect target required");

  const committed = getCommittedTree(state);
  const existing = state.workingDirectory[file]?.content ?? committed[file] ?? "";
  const newContent = append ? (existing ? existing + "\n" + content : content) : content;
  const isNew = !committed[file];

  const newWD = {
    ...state.workingDirectory,
    [file]: { content: newContent, status: isNew ? "untracked" as const : "modified" as const },
  };

  return ok({ ...state, workingDirectory: newWD }, "");
}

function cmdLs(state: GitState): DispatchResult {
  const committed = getCommittedTree(state);
  const all = new Set([
    ...Object.keys(committed),
    ...Object.keys(state.workingDirectory),
    ...Object.keys(state.stagingArea),
  ]);
  return ok(state, Array.from(all).join("  "));
}

function cmdEdit(state: GitState, tokens: string[]): DispatchResult {
  const file = tokens[1];
  if (!file) return err(state, `usage: edit <filename>`);

  const committed = getCommittedTree(state);
  const currentContent =
    state.workingDirectory[file]?.content ??
    committed[file] ??
    "";
  const isNew = !committed[file] && !state.workingDirectory[file];

  return {
    newState: state,
    output: "",
    events: [],
    editorRequest: { filename: file, content: currentContent, isNew },
  };
}

function cmdHelp(state: GitState): DispatchResult {
  return ok(state, [
    "Available commands:",
    "",
    "  git init                  Initialize repository",
    "  git status                Show working tree status",
    "  git add <file|.>          Stage file(s)",
    "  git commit -m \"msg\"       Create a commit",
    "  git log                   Show commit history",
    "  git branch [name]         List or create branch",
    "  git checkout <branch>     Switch branch",
    "  git checkout -b <branch>  Create & switch branch",
    "  git merge <branch>        Merge branch into current",
    "  git diff                  Show unstaged changes",
    "  git reset HEAD            Unstage all changes",
    "  git restore --staged <f>  Unstage a file",
    "",
    "  touch <file>              Create empty file",
    "  edit <file>               Open file editor",
    "  echo \"text\" > <file>      Write to file",
    "  echo \"text\" >> <file>     Append to file",
    "  ls                        List files",
    "  clear                     Clear terminal",
    "  help                      Show this help",
  ].join("\n"));
}
