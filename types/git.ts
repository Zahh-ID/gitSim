export type FileStatus = "untracked" | "modified" | "deleted";

export interface WDFile {
  content: string;
  status: FileStatus;
}

export interface Commit {
  hash: string;
  message: string;
  parent: string | null;
  mergeParent?: string; // second parent for merge commits
  tree: Record<string, string>; // filename -> content snapshot
  branch: string;
  timestamp: number;
}

export interface RemoteState {
  branches: Record<string, string>; // branch -> commit hash
}

export interface GitState {
  initialized: boolean;
  currentBranch: string;
  HEAD: string; // commit hash
  workingDirectory: Record<string, WDFile>;
  stagingArea: Record<string, string>; // filename -> content
  commits: Record<string, Commit>; // hash -> Commit
  commitOrder: string[]; // hashes in creation order
  branches: Record<string, string>; // branch name -> commit hash
  remotes: Record<string, RemoteState>;
}

export type AnimationEvent =
  | { type: "file-to-staging"; files: string[] }
  | { type: "staging-to-commit"; files: string[]; commitHash: string }
  | { type: "branch-switch"; from: string; to: string }
  | { type: "new-branch"; name: string }
  | { type: "merge"; from: string; into: string };

export interface EditorRequest {
  filename: string;
  content: string;
  isNew: boolean; // true if file not yet committed
}

export interface DispatchResult {
  newState: GitState;
  output: string;
  events: AnimationEvent[];
  editorRequest?: EditorRequest;
}

export interface TerminalLine {
  type: "input" | "output" | "error";
  text: string;
}
