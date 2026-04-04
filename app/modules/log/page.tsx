"use client";

import { useModuleProgress } from "@/lib/useModuleProgress";
import ModuleLayout from "@/components/ModuleLayout";
import LogScene from "@/components/scenes/LogScene";
import QuizBlock from "@/components/QuizBlock";

const COLOR = "#06B6D4";

const STEPS = [
  {
    title: "Membaca Sejarah dengan git log",
    text: 'Git adalah mesin waktu — kamu bisa melihat semua perubahan yang pernah terjadi. Ketik "git log" untuk melihat daftar commit dari yang terbaru. Setiap commit menampilkan: hash unik (ID commit), nama author, tanggal & waktu, dan pesan commit. Seperti buku diary proyek kamu!',
  },
  {
    title: "Format Ringkas: --oneline",
    text: '"git log" bisa sangat panjang untuk proyek besar. Gunakan "git log --oneline" untuk tampilan ringkas: satu commit = satu baris berisi hash pendek + pesan commit. Jauh lebih mudah di-scan! Tambahkan "-n 10" untuk hanya menampilkan 10 commit terakhir.',
  },
  {
    title: "Visualisasi Branch: --graph",
    text: '"git log --graph --oneline --all" menampilkan visualisasi ASCII art dari cabang-cabang branch kamu — sangat berguna untuk melihat di mana branch bercabang dan di mana terjadi merge. Ini seperti pohon git versi terminal! Flag --all memastikan semua branch (bukan hanya yang aktif) ditampilkan.',
  },
  {
    title: "git diff Lebih Dalam",
    text: 'Ada tiga variant git diff: "git diff" (perubahan di WD vs commit terakhir), "git diff --staged" (perubahan yang sudah di-stage vs commit terakhir), "git diff branch1..branch2" (perbedaan antar dua branch). Output menunjukkan baris yang dihapus (merah, tanda -) dan ditambahkan (hijau, tanda +).',
  },
];

const QUIZ = [
  {
    question: "Perintah apa yang menampilkan riwayat commit?",
    options: ["git status", "git log", "git show", "git history"],
    correct: 1,
    explanation: "git log menampilkan daftar commit dari yang terbaru, lengkap dengan hash, penulis, tanggal, dan pesan commit.",
  },
  {
    question: "Flag apa untuk menampilkan log dalam satu baris per commit?",
    options: ["--short", "--oneline", "--brief", "--compact"],
    correct: 1,
    explanation: "git log --oneline menampilkan setiap commit dalam satu baris: hash pendek (7 karakter) dan pesan commit — jauh lebih mudah dibaca.",
  },
  {
    question: "Apa fungsi flag --graph pada git log?",
    options: [
      "Membuat grafik performa",
      "Menampilkan visualisasi ASCII branch dan merge",
      "Mengekspor ke format gambar",
      "Menghitung jumlah commit",
    ],
    correct: 1,
    explanation: "--graph menambahkan visualisasi ASCII yang menunjukkan percabangan branch (* | / \\) sehingga kamu bisa melihat struktur cabang repo dengan jelas.",
  },
  {
    question: "git diff --staged menampilkan perbedaan antara apa?",
    options: [
      "Working directory dan commit terakhir",
      "Staging area dan commit terakhir",
      "Dua branch berbeda",
      "Dua commit berbeda",
    ],
    correct: 1,
    explanation: "git diff --staged (atau --cached) menampilkan perbedaan antara file yang sudah di-add ke staging area dengan commit terakhir — berguna untuk review sebelum commit.",
  },
];

export default function LogPage() {
  const { step, setStep, showQuiz, setShowQuiz } = useModuleProgress("log");

  if (showQuiz) {
    return (
      <QuizBlock
        moduleId="log"
        questions={QUIZ}
        color={COLOR}
        moduleTitle="Git Log & Diff"
      />
    );
  }

  return (
    <ModuleLayout
      moduleId="log"
      moduleNumber={9}
      title="Git Log & Diff"
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
      <LogScene step={step} />
    </ModuleLayout>
  );
}
