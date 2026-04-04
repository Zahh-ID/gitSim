import type { GitState } from "@/types/git";

export interface TaskStep {
  question: string;
  hint: string;
  placeholder: string;
  validate: (state: GitState, command: string) => boolean;
  successMessage: string;
}

export interface Task {
  id: string;
  title: string;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  difficultyColor: string;
  description: string;
  steps: TaskStep[];
  setupCommands?: string[];
}

export const TASKS: Task[] = [
  {
    id: "01-first-repo",
    title: "Repository Pertama",
    difficulty: "Mudah",
    difficultyColor: "#22C55E",
    description: "Belajar cara membuat repository Git dari nol dan membuat commit pertamamu.",
    steps: [
      {
        question: "Bagaimana cara menginisialisasi repository Git baru?",
        hint: "Perintah ini mengubah folder biasa menjadi repository Git.",
        placeholder: "git ...",
        validate: (state) => state.initialized,
        successMessage: "Repository berhasil dibuat! Folder .git sudah ada.",
      },
      {
        question: "Buat file baru bernama index.html",
        hint: "Gunakan perintah shell untuk membuat file kosong.",
        placeholder: "touch ...",
        validate: (state) => "index.html" in state.workingDirectory,
        successMessage: "File index.html berhasil dibuat!",
      },
      {
        question: "Tambahkan index.html ke staging area",
        hint: "Gunakan perintah git add.",
        placeholder: "git add ...",
        validate: (state) => "index.html" in state.stagingArea,
        successMessage: "index.html sudah masuk ke staging area!",
      },
      {
        question: 'Buat commit pertama dengan pesan "Initial commit"',
        hint: 'Gunakan git commit -m diikuti pesan dalam tanda kutip.',
        placeholder: 'git commit -m "..."',
        validate: (state) => state.commitOrder.length > 0,
        successMessage: "Commit pertama berhasil! Cek git log untuk melihat hasilnya.",
      },
    ],
  },
  {
    id: "02-staging-practice",
    title: "Latihan Staging Area",
    difficulty: "Mudah",
    difficultyColor: "#22C55E",
    description: "Latihan staging file secara selektif — tidak semua file perlu di-commit sekaligus.",
    setupCommands: ["git init"],
    steps: [
      {
        question: "Buat tiga file: app.js, style.css, dan readme.md",
        hint: "Kamu bisa membuat satu per satu atau dengan satu perintah: touch app.js style.css readme.md",
        placeholder: "touch ...",
        validate: (state) =>
          "app.js" in state.workingDirectory &&
          "style.css" in state.workingDirectory &&
          "readme.md" in state.workingDirectory,
        successMessage: "Ketiga file berhasil dibuat!",
      },
      {
        question: "Stage hanya app.js dan style.css (jangan readme.md)",
        hint: "Kamu bisa menyebutkan beberapa file sekaligus: git add app.js style.css",
        placeholder: "git add ...",
        validate: (state) =>
          "app.js" in state.stagingArea &&
          "style.css" in state.stagingArea &&
          !("readme.md" in state.stagingArea),
        successMessage: "Dua file berhasil di-stage. readme.md masih untracked!",
      },
      {
        question: "Buat commit dengan deskripsi yang bermakna",
        hint: 'Contoh: git commit -m "Add app and style files"',
        placeholder: "git commit -m ...",
        validate: (state) => state.commitOrder.length > 0,
        successMessage: "Commit berhasil! readme.md tetap untracked — persis yang kita inginkan.",
      },
      {
        question: "Cek status repo untuk melihat readme.md masih untracked",
        hint: "Perintah yang menampilkan kondisi working directory dan staging area.",
        placeholder: "git ...",
        validate: (_state, cmd) => cmd.trim() === "git status",
        successMessage: "git status menunjukkan readme.md masih untracked. Staging area sudah dikuasai!",
      },
    ],
  },
  {
    id: "03-branch-basics",
    title: "Membuat Branch Baru",
    difficulty: "Mudah",
    difficultyColor: "#22C55E",
    description: "Latihan membuat branch baru dan berpindah antar branch.",
    setupCommands: [
      "git init",
      "touch index.html",
      "git add .",
      'git commit -m "Initial commit"',
    ],
    steps: [
      {
        question: "Lihat daftar branch yang ada saat ini",
        hint: "Perintah git untuk menampilkan semua branch lokal.",
        placeholder: "git ...",
        validate: (_state, cmd) => cmd.trim() === "git branch",
        successMessage: "Saat ini hanya ada branch main.",
      },
      {
        question: "Buat branch baru bernama 'feature/navbar' (jangan pindah dulu!)",
        hint: "Gunakan 'git branch feature/navbar' — perintah ini hanya membuat branch, tidak pindah.",
        placeholder: "git branch feature/navbar",
        validate: (state) =>
          "feature/navbar" in state.branches && state.currentBranch === "main",
        successMessage: "Branch feature/navbar berhasil dibuat! Kamu masih di branch main.",
      },
      {
        question: "Sekarang pindah ke branch feature/navbar",
        hint: "Gunakan git checkout atau git switch untuk berpindah branch.",
        placeholder: "git checkout feature/navbar",
        validate: (state) => state.currentBranch === "feature/navbar",
        successMessage: "Kamu sekarang berada di branch feature/navbar!",
      },
      {
        question: "Buat file navbar.html lalu commit",
        hint: "touch navbar.html → git add . → git commit -m 'Add navbar'",
        placeholder: "touch navbar.html",
        validate: (state) => state.commitOrder.length > 1,
        successMessage: "Commit di branch feature berhasil! Branch main tidak terpengaruh.",
      },
    ],
  },
  {
    id: "04-merge-branches",
    title: "Merge Branch",
    difficulty: "Sedang",
    difficultyColor: "#F59E0B",
    description: "Branch feature/login sudah siap. Gabungkan ke main menggunakan git merge.",
    setupCommands: [
      "git init",
      "touch index.html",
      "git add .",
      'git commit -m "Initial commit"',
      "git branch feature/login",
      "git checkout feature/login",
      "touch login.html",
      "git add .",
      'git commit -m "Add login page"',
      "git checkout main",
    ],
    steps: [
      {
        question: "Cek kamu berada di branch mana sekarang",
        hint: "git status atau git branch menunjukkan branch aktif.",
        placeholder: "git ...",
        validate: (_state, cmd) =>
          cmd.includes("git status") || cmd.includes("git branch") || cmd.includes("git log"),
        successMessage: "Kamu sudah di branch main — siap untuk merge!",
      },
      {
        question: "Merge branch 'feature/login' ke main",
        hint: "Pastikan kamu di branch main, lalu gunakan git merge.",
        placeholder: "git merge ...",
        validate: (state) => {
          // Fast-forward merge: main and feature/login point to the same commit
          const fastForward =
            state.branches["main"] !== undefined &&
            state.branches["feature/login"] !== undefined &&
            state.branches["main"] === state.branches["feature/login"];
          // Real merge commit: a new commit with a mergeParent was created
          const mergeCommit = Object.values(state.commits).some(
            (c) => c.mergeParent !== undefined
          );
          return fastForward || mergeCommit;
        },
        successMessage: "Merge berhasil! Login page sekarang ada di branch main.",
      },
      {
        question: "Lihat commit history dengan tampilan graph",
        hint: "git log --oneline --graph menampilkan visualisasi branch.",
        placeholder: "git log ...",
        validate: (_state, cmd) => cmd.includes("git log"),
        successMessage: "Kamu bisa melihat alur merge di log. Selamat — merge dikuasai!",
      },
    ],
  },
  {
    id: "05-undo-mistakes",
    title: "Membatalkan Kesalahan",
    difficulty: "Sedang",
    difficultyColor: "#F59E0B",
    description: "Ada file salah di staging dan perubahan bug di working directory. Perbaiki dengan git restore!",
    setupCommands: [
      "git init",
      "touch app.js",
      'echo "console.log(1)" > app.js',
      "git add .",
      'git commit -m "Initial"',
      'echo "BUG HERE" > app.js',
      "touch temp.txt",
      "git add temp.txt",
    ],
    steps: [
      {
        question: "Cek kondisi repo — ada apa saja yang berubah?",
        hint: "Perintah untuk melihat status working directory dan staging.",
        placeholder: "git ...",
        validate: (_state, cmd) => cmd.trim() === "git status",
        successMessage: "Terlihat: temp.txt di staging, app.js ada bug di working directory.",
      },
      {
        question: "Unstage file temp.txt dari staging area",
        hint: "Gunakan git restore dengan flag --staged.",
        placeholder: "git restore --staged ...",
        validate: (state) => !("temp.txt" in state.stagingArea),
        successMessage: "temp.txt berhasil di-unstage! Sekarang kembali ke working directory.",
      },
      {
        question: "Batalkan perubahan bug pada app.js di working directory",
        hint: "Gunakan git restore tanpa flag untuk membuang perubahan di WD.",
        placeholder: "git restore ...",
        validate: (state) => !("app.js" in state.workingDirectory),
        successMessage: "app.js kembali ke versi commit terakhir. Bug dihapus!",
      },
      {
        question: "Verifikasi repo sudah bersih",
        hint: "Jalankan git status — harusnya tidak ada yang modified atau staged.",
        placeholder: "git status",
        validate: (_state, cmd) => cmd.trim() === "git status",
        successMessage: "Repo bersih! Kamu berhasil membatalkan semua kesalahan.",
      },
    ],
  },
  {
    id: "06-full-workflow",
    title: "Alur Kerja Lengkap",
    difficulty: "Sulit",
    difficultyColor: "#EF4444",
    description: "Simulasikan workflow nyata: init → develop di branch → hotfix → merge semua ke main.",
    steps: [
      {
        question: "Inisialisasi repo, buat file index.html, lalu commit pertama",
        hint: "Kamu perlu: git init → touch index.html → git add → git commit",
        placeholder: "git init",
        validate: (state) => state.commitOrder.length >= 1,
        successMessage: "Repository dan commit awal berhasil!",
      },
      {
        question: "Buat dan pindah ke branch 'develop'",
        hint: "Gunakan git checkout -b untuk buat sekaligus pindah.",
        placeholder: "git checkout -b develop",
        validate: (state) => state.currentBranch === "develop",
        successMessage: "Kamu sekarang di branch develop!",
      },
      {
        question: "Tambahkan fitur di branch develop dan commit",
        hint: "Buat file baru (misal: feature.js), add, lalu commit.",
        placeholder: "touch feature.js",
        validate: (state) =>
          state.currentBranch === "develop" && state.commitOrder.length >= 2,
        successMessage: "Fitur berhasil di-commit ke branch develop!",
      },
      {
        question: "Kembali ke main dan buat branch 'hotfix'",
        hint: "git checkout main → git checkout -b hotfix",
        placeholder: "git checkout main",
        validate: (state) => "hotfix" in state.branches,
        successMessage: "Branch hotfix siap untuk perbaikan cepat!",
      },
      {
        question: "Commit perbaikan di hotfix, lalu merge ke main",
        hint: "touch fix.js → add → commit → git checkout main → git merge hotfix",
        placeholder: "touch fix.js",
        validate: (state) =>
          state.currentBranch === "main" &&
          state.commitOrder.length >= 3,
        successMessage: "Hotfix berhasil di-merge ke main!",
      },
      {
        question: "Merge branch develop ke main, lalu cek git log --graph",
        hint: "git merge develop → git log --oneline --graph --all",
        placeholder: "git merge develop",
        validate: (state, cmd) => {
          if (state.currentBranch !== "main") return false;
          const developMerged =
            "develop" in state.branches &&
            state.branches["develop"] === state.branches["main"];
          const mergeCommitExists = Object.values(state.commits).some(
            (c) => c.mergeParent !== undefined
          );
          const merged = developMerged || mergeCommitExists;
          return merged && cmd.includes("git log");
        },
        successMessage: "Workflow lengkap selesai! Kamu sudah seperti developer profesional.",
      },
    ],
  },
];
