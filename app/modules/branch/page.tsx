"use client";

import { useModuleProgress } from "@/lib/useModuleProgress";
import ModuleLayout from "@/components/ModuleLayout";
import BranchScene from "@/components/scenes/BranchScene";
import QuizBlock from "@/components/QuizBlock";

const COLOR = "#FF6B9D";

const STEPS = [
  {
    title: "Apa itu Branch?",
    text: "Branch adalah cabang pengembangan yang terpisah dari kode utama. Bayangkan seperti pohon: trunk (batang) adalah branch utama, dan cabang-cabangnya bisa berkembang sendiri. Dengan branch, kamu bisa mengerjakan fitur baru tanpa merusak kode yang sudah berjalan.",
  },
  {
    title: "Branch main/master",
    text: "Setiap repository Git punya satu branch utama — biasanya bernama 'main' (atau 'master' di repo lama). Branch ini adalah garis waktu utama proyek kamu. Semua commit yang kamu buat saat init akan ada di branch main.",
  },
  {
    title: "git branch & git checkout",
    text: 'Buat branch baru dengan "git branch nama-branch" lalu pindah dengan "git checkout nama-branch". Atau gunakan satu perintah: "git checkout -b nama-branch" untuk buat sekaligus pindah. Branch baru dimulai dari commit terakhir di branch saat ini.',
  },
  {
    title: "Parallel Development",
    text: "Kecanggihan Git ada di sini — beberapa orang bisa bekerja di branch berbeda secara bersamaan tanpa saling ganggu! Satu orang mengerjakan feature-login, yang lain fix-bug, yang lain update-docs. Semuanya berjalan paralel. Keren, kan?",
  },
];

const QUIZ = [
  {
    question: "Perintah apa yang digunakan untuk membuat branch baru sekaligus langsung pindah ke branch tersebut?",
    options: [
      "git branch -new nama",
      "git checkout -b nama",
      "git switch --create nama",
      "git branch --move nama",
    ],
    correct: 1,
    explanation: '"git checkout -b nama" membuat branch baru dan langsung berpindah ke branch tersebut dalam satu perintah.',
  },
  {
    question: "Apa nama branch utama yang biasa digunakan dalam repository Git modern?",
    options: ["master", "main", "primary", "default"],
    correct: 1,
    explanation: 'Repository Git modern menggunakan "main" sebagai nama branch utama, meski beberapa repo lama masih menggunakan "master".',
  },
  {
    question: "Mengapa developer menggunakan branch dalam Git?",
    options: [
      "Untuk menyimpan file lebih banyak",
      "Agar kode menjadi lebih cepat",
      "Untuk mengembangkan fitur secara terpisah tanpa mengganggu kode utama",
      "Karena itu kewajiban saat menggunakan Git",
    ],
    correct: 2,
    explanation: "Branch memungkinkan developer mengerjakan fitur atau perbaikan secara terpisah, sehingga kode di branch utama tetap stabil.",
  },
  {
    question: "Perintah apa yang digunakan untuk melihat daftar branch yang ada?",
    options: ["git list", "git branch", "git show branches", "git log --branches"],
    correct: 1,
    explanation: '"git branch" (tanpa argumen) menampilkan semua branch lokal yang ada, dengan tanda * di branch yang sedang aktif.',
  },
];

export default function BranchPage() {
  const { step, setStep, showQuiz, setShowQuiz } = useModuleProgress("branch");

  if (showQuiz) {
    return (
      <QuizBlock
        moduleId="branch"
        questions={QUIZ}
        color={COLOR}
        moduleTitle="Branching"
        nextHref="/modules/merge"
        nextLabel="Modul 04: Merge →"
      />
    );
  }

  return (
    <ModuleLayout
      moduleId="branch"
      moduleNumber={3}
      title="Branching"
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
      <BranchScene step={step} />
    </ModuleLayout>
  );
}
