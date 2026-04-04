"use client";

import { useModuleProgress } from "@/lib/useModuleProgress";
import ModuleLayout from "@/components/ModuleLayout";
import UndoScene from "@/components/scenes/UndoScene";
import QuizBlock from "@/components/QuizBlock";

const COLOR = "#F59E0B";

const STEPS = [
  {
    title: "Mengapa Perlu Undo di Git?",
    text: "Semua developer pernah membuat kesalahan — nulis bug, commit file yang salah, atau commit terlalu cepat. Git menyediakan tiga cara utama untuk undo: git restore (batalkan perubahan file), git reset (mundurkan HEAD ke commit sebelumnya), dan git revert (buat commit yang membalikkan perubahan). Pilih sesuai kebutuhan!",
  },
  {
    title: "git restore — Batalkan Perubahan File",
    text: '"git restore namafile" membuang semua perubahan di file tersebut dan mengembalikannya ke versi commit terakhir — hati-hati, perubahan yang belum di-commit akan hilang permanen! Untuk membatalkan staging (unstage), gunakan "git restore --staged namafile". Perintah ini aman karena tidak mengubah commit history.',
  },
  {
    title: "git reset — Mundurkan HEAD",
    text: '"git reset" memiliki tiga mode: --soft (HEAD mundur tapi perubahan tetap di staging), --mixed (default: HEAD mundur, staging dikosongkan, perubahan tetap di WD), --hard (HEAD mundur, semua perubahan hilang — sangat berbahaya!). Gunakan --hard dengan hati-hati dan hanya di branch lokal yang belum di-push.',
  },
  {
    title: "git revert — Undo yang Aman",
    text: 'git revert membuat commit BARU yang membalikkan perubahan dari commit tertentu. History lama tidak dihapus — hanya ditambahi "kebalikan"-nya. Ini adalah cara undo yang paling aman untuk branch yang sudah di-push ke remote/GitHub, karena tidak mengubah history yang sudah dibagikan ke tim.',
  },
];

const QUIZ = [
  {
    question: "Perintah apa untuk membatalkan perubahan file di working directory?",
    options: ["git reset", "git restore", "git revert", "git undo"],
    correct: 1,
    explanation: "git restore <file> mengembalikan file ke versi terakhir yang di-commit, membuang semua perubahan yang belum di-stage.",
  },
  {
    question: "Apa perbedaan utama git reset --hard dan --soft?",
    options: [
      "Tidak ada perbedaan",
      "--hard menghapus semua perubahan sedangkan --soft mempertahankannya di staging",
      "--soft lebih cepat dijalankan",
      "--hard hanya bekerja di branch utama",
    ],
    correct: 1,
    explanation: "git reset --soft memindahkan HEAD tapi semua perubahan tetap ada di staging area, sedangkan --hard menghapus semua perubahan di staging dan working directory.",
  },
  {
    question: "Perintah mana yang paling aman untuk membatalkan commit di branch yang sudah di-push?",
    options: ["git reset --hard", "git restore", "git revert", "git branch -D"],
    correct: 2,
    explanation: "git revert membuat commit baru yang membalikkan perubahan tanpa mengubah history. Ini aman karena tidak merusak history yang sudah di-push ke remote.",
  },
  {
    question: "Apa yang dilakukan git restore --staged <file>?",
    options: [
      "Menghapus file dari komputer",
      "Memindahkan file dari staging area kembali ke working directory",
      "Membuat commit baru",
      "Mengganti isi file dengan versi remote",
    ],
    correct: 1,
    explanation: "git restore --staged memindahkan file dari staging area kembali ke working directory (unstage) tanpa menghapus perubahannya di file.",
  },
];

export default function UndoPage() {
  const { step, setStep, showQuiz, setShowQuiz } = useModuleProgress("undo");

  if (showQuiz) {
    return (
      <QuizBlock
        moduleId="undo"
        questions={QUIZ}
        color={COLOR}
        moduleTitle="Undo & Reset"
        nextHref="/modules/log"
        nextLabel="Modul 09: Git Log & Diff →"
      />
    );
  }

  return (
    <ModuleLayout
      moduleId="undo"
      moduleNumber={8}
      title="Undo & Reset"
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
      <UndoScene step={step} />
    </ModuleLayout>
  );
}
