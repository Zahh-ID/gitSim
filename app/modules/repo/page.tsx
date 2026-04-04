"use client";

import { useModuleProgress } from "@/lib/useModuleProgress";
import ModuleLayout from "@/components/ModuleLayout";
import RepoScene from "@/components/scenes/RepoScene";
import QuizBlock from "@/components/QuizBlock";

const COLOR = "#FFD93D";

const STEPS = [
  {
    title: "Apa itu Git?",
    text: "Git adalah sistem version control — alat yang mencatat semua perubahan pada kode kamu. Bayangkan seperti tombol 'undo' yang bisa kembali ke titik mana saja dalam sejarah proyek. Git dibuat oleh Linus Torvalds tahun 2005 dan sekarang dipakai oleh jutaan developer di seluruh dunia!",
  },
  {
    title: "Folder Biasa vs Repository",
    text: "Folder biasa hanya menyimpan file. Tapi repository (repo) Git menyimpan file PLUS seluruh riwayat perubahan. Bedanya? Repo Git punya folder tersembunyi bernama .git yang menyimpan semua info version control.",
  },
  {
    title: "Perintah git init",
    text: 'Untuk membuat folder biasa menjadi repository, cukup jalankan perintah "git init" di dalam folder tersebut. Git akan membuat folder .git secara otomatis. Setelah ini, Git siap mencatat semua perubahan di folder kamu!',
  },
  {
    title: "Struktur .git",
    text: "Di dalam folder .git tersimpan berbagai file penting. HEAD menunjuk ke branch aktif. objects/ menyimpan semua snapshot file. refs/ berisi pointer ke branch dan tag. config menyimpan pengaturan repo lokal. Kamu tidak perlu mengedit ini manual — Git yang mengurusnya!",
  },
];

const QUIZ = [
  {
    question: "Apa fungsi utama dari Git?",
    options: [
      "Menyimpan file di cloud",
      "Mencatat dan mengelola riwayat perubahan kode",
      "Membuat tampilan website",
      "Mengkompilasi program",
    ],
    correct: 1,
    explanation: "Git adalah version control system yang mencatat semua perubahan kode, sehingga kamu bisa kembali ke versi sebelumnya kapan saja.",
  },
  {
    question: 'Perintah apa yang digunakan untuk membuat repository Git baru?',
    options: ["git start", "git create", "git init", "git new"],
    correct: 2,
    explanation: '"git init" adalah perintah untuk menginisialisasi repository Git baru di folder saat ini.',
  },
  {
    question: "Folder tersembunyi apa yang dibuat oleh Git saat menjalankan git init?",
    options: [".github", ".gitignore", ".git", ".config"],
    correct: 2,
    explanation: "Git membuat folder .git yang menyimpan semua data version control, termasuk commit history, branch, dan konfigurasi repo.",
  },
  {
    question: "Apa perbedaan utama antara folder biasa dan repository Git?",
    options: [
      "Repository Git lebih besar ukurannya",
      "Repository Git mencatat riwayat perubahan, folder biasa tidak",
      "Folder biasa lebih cepat diakses",
      "Tidak ada perbedaan",
    ],
    correct: 1,
    explanation: "Repository Git memiliki folder .git yang menyimpan seluruh riwayat perubahan, sementara folder biasa hanya menyimpan file saat ini.",
  },
];

export default function RepoPage() {
  const { step, setStep, showQuiz, setShowQuiz } = useModuleProgress("repo");

  if (showQuiz) {
    return (
      <QuizBlock
        moduleId="repo"
        questions={QUIZ}
        color={COLOR}
        moduleTitle="Repositori & Init"
        nextHref="/modules/commit"
        nextLabel="Modul 02: Commit →"
      />
    );
  }

  return (
    <ModuleLayout
      moduleId="repo"
      moduleNumber={1}
      title="Repositori & Init"
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
      <RepoScene step={step} />
    </ModuleLayout>
  );
}
