"use client";

import { useModuleProgress } from "@/lib/useModuleProgress";
import ModuleLayout from "@/components/ModuleLayout";
import GitignoreScene from "@/components/scenes/GitignoreScene";
import QuizBlock from "@/components/QuizBlock";

const COLOR = "#EF4444";

const STEPS = [
  {
    title: "Apa Itu .gitignore?",
    text: "Tidak semua file perlu di-track Git. File seperti node_modules berisi ribuan file dependency, .env menyimpan password/API key yang harus rahasia, dan log files terus berubah. File .gitignore memberi tahu Git file mana yang harus diabaikan — tidak akan pernah di-add atau di-commit!",
  },
  {
    title: "Pola Pattern di .gitignore",
    text: 'Kamu bisa menggunakan berbagai pola: "*.log" mengabaikan semua file berekstensi .log (tanda * adalah wildcard). "node_modules/" mengabaikan seluruh folder. "!important.log" pengecualian — file ini tetap di-track walau .log lain diabaikan. Baris yang diawali # adalah komentar.',
  },
  {
    title: "File yang Sebaiknya Di-ignore",
    text: "Beberapa file yang hampir selalu di-ignore: node_modules/ (dependency Node.js), .env (variabel environment berisi secret), *.log (log files), dist/ atau build/ (hasil build otomatis), .DS_Store (file sistem macOS), __pycache__/ (cache Python). GitHub menyediakan template .gitignore untuk berbagai bahasa!",
  },
  {
    title: "Cara Membuat .gitignore",
    text: 'Buat file bernama ".gitignore" di root folder proyek, tambahkan pola file yang ingin diabaikan, lalu commit file tersebut. Penting: kalau file sudah terlanjur di-track Git, .gitignore tidak akan berefek sampai kamu menjalankan "git rm --cached namafile" untuk menghapusnya dari tracking tanpa menghapus file fisiknya.',
  },
];

const QUIZ = [
  {
    question: "Apa fungsi file .gitignore?",
    options: [
      "Menghapus file dari komputer",
      "Memberi tahu Git file mana yang tidak perlu di-track",
      "Mengenkripsi file sensitif",
      "Membuat backup otomatis",
    ],
    correct: 1,
    explanation: ".gitignore berisi daftar pattern file/folder yang akan diabaikan oleh Git — file tersebut tidak akan muncul di git status dan tidak bisa di-add.",
  },
  {
    question: 'Pattern "*.log" di .gitignore artinya?',
    options: [
      "Hanya ignore file bernama log",
      "Ignore semua file berekstensi .log",
      "Ignore folder log",
      "Hapus semua file .log",
    ],
    correct: 1,
    explanation: "Tanda * adalah wildcard yang cocok dengan nama apapun, jadi *.log berarti semua file yang berakhiran .log akan diabaikan.",
  },
  {
    question: "Folder mana yang paling umum di-ignore di proyek Node.js?",
    options: ["src/", "public/", "node_modules/", "pages/"],
    correct: 2,
    explanation: "node_modules/ berisi ribuan file dependency yang bisa di-install ulang lewat npm install, jadi tidak perlu di-track dan akan membuat repo sangat besar jika di-commit.",
  },
  {
    question: "Jika file sudah terlanjur di-track, apa yang harus dilakukan agar .gitignore berefek?",
    options: [
      "Hapus file dari komputer",
      "Jalankan git rm --cached",
      "Jalankan git init ulang",
      "Buat repo baru",
    ],
    correct: 1,
    explanation: "git rm --cached menghapus file dari tracking Git tanpa menghapus file fisik di komputer, sehingga .gitignore bisa mulai bekerja pada file tersebut.",
  },
];

export default function GitignorePage() {
  const { step, setStep, showQuiz, setShowQuiz } = useModuleProgress("gitignore");

  if (showQuiz) {
    return (
      <QuizBlock
        moduleId="gitignore"
        questions={QUIZ}
        color={COLOR}
        moduleTitle="Gitignore"
        nextHref="/modules/undo"
        nextLabel="Modul 08: Undo & Reset →"
      />
    );
  }

  return (
    <ModuleLayout
      moduleId="gitignore"
      moduleNumber={7}
      title="Gitignore"
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
      <GitignoreScene step={step} />
    </ModuleLayout>
  );
}
