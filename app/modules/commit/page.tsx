"use client";

import { useModuleProgress } from "@/lib/useModuleProgress";
import ModuleLayout from "@/components/ModuleLayout";
import CommitScene from "@/components/scenes/CommitScene";
import QuizBlock from "@/components/QuizBlock";

const COLOR = "#FF6B35";

const STEPS = [
  {
    title: "3 Area Git",
    text: "Git mengelola file dalam 3 area: (1) Working Directory — di sinilah kamu menulis kode; (2) Staging Area (Index) — area persiapan sebelum disimpan; (3) Repository — tempat tersimpannya snapshot permanen (commit). Memahami 3 area ini adalah kunci untuk menguasai Git!",
  },
  {
    title: "git add — Pindah ke Staging",
    text: 'Setelah mengubah file, kamu perlu "menandai" file mana yang ingin disimpan. Caranya pakai perintah "git add nama-file.txt" atau "git add ." untuk semua file. File yang di-add akan masuk ke Staging Area, siap untuk dijadikan commit.',
  },
  {
    title: "git commit — Simpan ke History",
    text: 'Setelah staging, jalankan "git commit -m \\"pesan commit\\"" untuk menyimpan snapshot permanen ke repository. Setiap commit punya hash unik (seperti sidik jari) dan pesan yang menjelaskan perubahan. Commit tidak bisa dihapus — itulah yang membuat Git aman!',
  },
  {
    title: "Commit Graph",
    text: "Setiap commit terhubung ke commit sebelumnya (parent), membentuk rantai sejarah. Inilah commit graph! Dengan git log kamu bisa melihat seluruh riwayat perubahan. Branch HEAD selalu menunjuk ke commit terbaru.",
  },
];

const QUIZ = [
  {
    question: "Apa perintah untuk memindahkan semua file ke Staging Area?",
    options: ["git commit .", "git stage .", "git add .", "git push ."],
    correct: 2,
    explanation: '"git add ." memindahkan semua file yang berubah di Working Directory ke Staging Area.',
  },
  {
    question: "Apa urutan langkah yang benar untuk menyimpan perubahan?",
    options: [
      "commit → add → push",
      "add → commit → (push)",
      "push → commit → add",
      "stage → push → commit",
    ],
    correct: 1,
    explanation: "Alur yang benar adalah: buat/ubah file → git add (staging) → git commit (simpan ke repo) → git push (opsional, ke remote).",
  },
  {
    question: "Apa flag yang digunakan untuk menambahkan pesan pada git commit?",
    options: ["-p", "-msg", "-m", "--message-here"],
    correct: 2,
    explanation: "Flag -m digunakan untuk menambahkan commit message langsung di terminal, contoh: git commit -m \"Pesan commit\".",
  },
  {
    question: "Apa yang dimaksud dengan Staging Area?",
    options: [
      "Tempat menyimpan file secara permanen",
      "Folder tempat kamu menulis kode",
      "Area persiapan sebelum membuat commit",
      "Nama lain untuk GitHub",
    ],
    correct: 2,
    explanation: "Staging Area (atau Index) adalah area persiapan di mana kamu menentukan perubahan mana yang akan masuk ke commit berikutnya.",
  },
];

export default function CommitPage() {
  const { step, setStep, showQuiz, setShowQuiz } = useModuleProgress("commit");

  if (showQuiz) {
    return (
      <QuizBlock
        moduleId="commit"
        questions={QUIZ}
        color={COLOR}
        moduleTitle="Commit & Staging"
        nextHref="/modules/branch"
        nextLabel="Modul 03: Branch →"
      />
    );
  }

  return (
    <ModuleLayout
      moduleId="commit"
      moduleNumber={2}
      title="Commit & Staging"
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
      <CommitScene step={step} />
    </ModuleLayout>
  );
}
