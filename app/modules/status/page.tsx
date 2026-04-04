"use client";

import { useModuleProgress } from "@/lib/useModuleProgress";
import ModuleLayout from "@/components/ModuleLayout";
import StatusScene from "@/components/scenes/StatusScene";
import QuizBlock from "@/components/QuizBlock";

const COLOR = "#22C55E";

const STEPS = [
  {
    title: "Siklus Hidup File di Git",
    text: "Setiap file di repo Git punya empat status: Untracked (baru, belum pernah di-track), Modified (sudah ditrack tapi ada perubahan baru), Staged (siap di-commit), dan Committed (tersimpan di history). Memahami siklus ini adalah kunci memahami cara kerja Git!",
  },
  {
    title: "Perintah git status",
    text: 'Ketik "git status" kapan saja untuk melihat kondisi repo saat ini. File berwarna hijau artinya sudah staged (siap di-commit). File berwarna merah artinya ada perubahan yang belum di-stage. File Untracked muncul sebagai daftar terpisah di bawah.',
  },
  {
    title: "Alur Kerja: Untracked → Committed",
    text: 'Buat file baru → status "untracked". Jalankan "git add" → status "staged". Jalankan "git commit" → status "committed". Edit lagi → status "modified". Jalankan "git add" lagi → "staged". Dan seterusnya — inilah siklus Git yang akan kamu lakukan setiap hari!',
  },
  {
    title: "Perintah git diff",
    text: 'Ingin tahu perubahan apa saja yang terjadi? Gunakan "git diff" untuk melihat perubahan di working directory vs commit terakhir. Tanda merah (-) berarti baris yang dihapus, tanda hijau (+) berarti baris yang ditambahkan. Untuk melihat perubahan yang sudah di-stage, gunakan "git diff --staged".',
  },
];

const QUIZ = [
  {
    question: "File baru yang belum pernah di-track Git memiliki status apa?",
    options: ["modified", "untracked", "staged", "committed"],
    correct: 1,
    explanation: "File yang baru dibuat dan belum pernah di-add ke Git berstatus untracked — Git belum mengetahui keberadaannya.",
  },
  {
    question: "Perintah apa yang menampilkan status file di working directory?",
    options: ["git log", "git status", "git show", "git diff"],
    correct: 1,
    explanation: "git status menunjukkan file mana yang untracked, modified, atau staged — sangat berguna untuk melihat kondisi repo saat ini.",
  },
  {
    question: "Setelah menjalankan git add, file berpindah ke area mana?",
    options: ["Repository", "Working Directory", "Staging Area", "Remote"],
    correct: 2,
    explanation: "git add memindahkan file dari working directory ke staging area, di mana file siap untuk di-commit.",
  },
  {
    question: "Apa fungsi perintah git diff?",
    options: [
      "Menampilkan daftar branch",
      "Menampilkan perbedaan file yang belum di-stage",
      "Menghapus file",
      "Membuat commit baru",
    ],
    correct: 1,
    explanation: "git diff menampilkan baris yang berubah di working directory dibandingkan commit terakhir. Tanda - (merah) = dihapus, tanda + (hijau) = ditambahkan.",
  },
];

export default function StatusPage() {
  const { step, setStep, showQuiz, setShowQuiz } = useModuleProgress("status");

  if (showQuiz) {
    return (
      <QuizBlock
        moduleId="status"
        questions={QUIZ}
        color={COLOR}
        moduleTitle="Status & File States"
        nextHref="/modules/gitignore"
        nextLabel="Modul 07: Gitignore →"
      />
    );
  }

  return (
    <ModuleLayout
      moduleId="status"
      moduleNumber={6}
      title="Status & File States"
      currentStep={step}
      totalSteps={STEPS.length}
      color={COLOR}
      onPrev={() => setStep((s) => Math.max(0, s - 1))}
      onNext={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
      onStartQuiz={() => setShowQuiz(true)}
    >
      <h2
        className="text-xl font-bold mb-3 text-[#1E1B2E]"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {STEPS[step].title}
      </h2>
      <p
        className="text-base leading-relaxed text-[#1E1B2E] mb-5"
        style={{ fontFamily: "var(--font-nunito)" }}
      >
        {STEPS[step].text}
      </p>
      <StatusScene step={step} />
    </ModuleLayout>
  );
}
