"use client";

import { useModuleProgress } from "@/lib/useModuleProgress";
import ModuleLayout from "@/components/ModuleLayout";
import MergeScene from "@/components/scenes/MergeScene";
import QuizBlock from "@/components/QuizBlock";

const COLOR = "#A855F7";

const STEPS = [
  {
    title: "Situasi Sebelum Merge",
    text: "Bayangkan kamu punya dua branch: 'main' (kode produksi) dan 'feature' (fitur baru). Keduanya punya commit masing-masing dan sudah berkembang secara terpisah. Saat fitur sudah siap, kamu perlu menggabungkannya ke branch utama. Di sinilah merge digunakan!",
  },
  {
    title: "git merge",
    text: 'Untuk menggabungkan branch, pindah ke branch tujuan (misal main) lalu jalankan "git merge nama-branch". Git akan membuat "merge commit" yang menggabungkan perubahan dari kedua branch. Hasilnya, semua commit dari kedua branch tersimpan dalam sejarah.',
  },
  {
    title: "Merge Conflict",
    text: "Konflik terjadi ketika dua branch mengubah bagian yang SAMA pada file yang SAMA. Git tidak tahu perubahan mana yang harus dipakai. Tanda konflik muncul di file dengan format <<<<<<, =======, dan >>>>>>>. Jangan panik — ini hal yang normal di pengembangan tim!",
  },
  {
    title: "Menyelesaikan Konflik",
    text: "Cara resolve conflict: (1) Buka file yang konflik, (2) Pilih kode yang ingin dipertahankan — milik kamu, milik orang lain, atau gabungan keduanya, (3) Hapus marker conflict (<<<, ===, >>>), (4) Jalankan git add pada file tersebut, (5) Lanjutkan dengan git commit. Selesai!",
  },
];

const QUIZ = [
  {
    question: "Perintah apa yang digunakan untuk menggabungkan branch 'feature' ke branch 'main'?",
    options: [
      "git join feature",
      "git combine feature main",
      "git merge feature (saat di branch main)",
      "git pull feature",
    ],
    correct: 2,
    explanation: "Kamu harus berada di branch tujuan (main) terlebih dahulu, lalu jalankan git merge feature untuk menggabungkan perubahannya.",
  },
  {
    question: "Kapan merge conflict terjadi?",
    options: [
      "Saat membuat branch baru",
      "Saat dua branch mengubah bagian yang sama pada file yang sama",
      "Saat menggunakan git add",
      "Saat repo tidak terkoneksi internet",
    ],
    correct: 1,
    explanation: "Merge conflict terjadi ketika dua branch memiliki perubahan yang saling bertentangan pada baris kode yang sama, sehingga Git tidak bisa otomatis memilih.",
  },
  {
    question: "Apa langkah pertama untuk menyelesaikan merge conflict?",
    options: [
      "Langsung git push",
      "Hapus salah satu branch",
      "Buka dan edit file yang konflik, pilih kode yang dipertahankan",
      "Jalankan git reset",
    ],
    correct: 2,
    explanation: "Langkah pertama adalah membuka file yang konflik, memahami kedua versi perubahan, lalu memilih atau menggabungkan kode yang sesuai.",
  },
  {
    question: "Apa yang dimaksud 'fast-forward merge'?",
    options: [
      "Merge yang dilakukan dengan sangat cepat",
      "Merge tanpa membuat merge commit karena tidak ada divergence",
      "Merge yang membutuhkan resolusi konflik",
      "Fitur merge khusus GitHub",
    ],
    correct: 1,
    explanation: "Fast-forward merge terjadi ketika branch tujuan tidak memiliki commit baru sejak branch source dibuat — Git cukup memindahkan pointer tanpa membuat merge commit.",
  },
];

export default function MergePage() {
  const { step, setStep, showQuiz, setShowQuiz } = useModuleProgress("merge");

  if (showQuiz) {
    return (
      <QuizBlock
        moduleId="merge"
        questions={QUIZ}
        color={COLOR}
        moduleTitle="Merging"
        nextHref="/modules/remote"
        nextLabel="Modul 05: Remote →"
      />
    );
  }

  return (
    <ModuleLayout
      moduleId="merge"
      moduleNumber={4}
      title="Merging & Conflict"
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
      <MergeScene step={step} />
    </ModuleLayout>
  );
}
