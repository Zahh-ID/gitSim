"use client";

import { useModuleProgress } from "@/lib/useModuleProgress";
import ModuleLayout from "@/components/ModuleLayout";
import RemoteScene from "@/components/scenes/RemoteScene";
import QuizBlock from "@/components/QuizBlock";

const COLOR = "#3B82F6";

const STEPS = [
  {
    title: "Local vs Remote Repository",
    text: "Sampai sekarang, repo kita hanya ada di komputer lokal. Remote repository adalah salinan repo yang tersimpan di server (misal GitHub atau GitLab). Dengan remote, kamu bisa backup kode, berkolaborasi dengan tim, dan membagikan proyek ke dunia!",
  },
  {
    title: "git remote add origin",
    text: 'Untuk menghubungkan repo lokal ke remote, gunakan "git remote add origin URL". "origin" adalah alias standar untuk remote utama. URL bisa didapat dari GitHub setelah membuat repo baru. Setelah ini, lokal dan remote kamu terhubung!',
  },
  {
    title: "git push — Kirim ke Remote",
    text: 'Setelah commit lokal, kirim ke remote dengan "git push origin main". Push memindahkan semua commit baru dari lokal ke remote. Pertama kali push, mungkin perlu flag -u: "git push -u origin main" untuk set upstream (jalur default).',
  },
  {
    title: "git pull — Ambil dari Remote",
    text: 'Saat ada perubahan di remote (dari teman satu tim atau dari komputer lain), gunakan "git pull" untuk mengambilnya ke lokal. Pull sebenarnya adalah gabungan "git fetch" + "git merge". Biasakan pull sebelum mulai kerja agar kode selalu terbaru!',
  },
];

const QUIZ = [
  {
    question: "Perintah apa yang digunakan untuk menghubungkan repo lokal ke remote GitHub?",
    options: [
      "git connect origin URL",
      "git remote add origin URL",
      "git link origin URL",
      "git set remote URL",
    ],
    correct: 1,
    explanation: '"git remote add origin URL" menambahkan remote baru dengan alias "origin" dan menghubungkannya ke URL repository GitHub/GitLab.',
  },
  {
    question: "Apa yang dilakukan perintah git push?",
    options: [
      "Mengambil perubahan dari remote ke lokal",
      "Menghapus commit dari remote",
      "Mengirim commit lokal ke remote repository",
      "Membuat repository baru di GitHub",
    ],
    correct: 2,
    explanation: "git push mengirimkan commit-commit yang ada di lokal tetapi belum ada di remote, sehingga remote tersinkronisasi dengan pekerjaan terbarumu.",
  },
  {
    question: "Apa yang dilakukan perintah git pull?",
    options: [
      "Mengirim commit ke GitHub",
      "Mengambil dan menggabungkan perubahan dari remote ke lokal",
      "Membuat branch baru",
      "Menghapus remote repository",
    ],
    correct: 1,
    explanation: "git pull mengambil perubahan terbaru dari remote (fetch) dan langsung menggabungkannya ke branch lokal kamu (merge).",
  },
  {
    question: 'Apa nama alias default yang biasa digunakan untuk remote utama?',
    options: ["upstream", "github", "origin", "main"],
    correct: 2,
    explanation: '"origin" adalah nama alias konvensional untuk remote repository utama. Nama ini bisa diubah, tapi hampir semua developer menggunakan "origin".',
  },
];

export default function RemotePage() {
  const { step, setStep, showQuiz, setShowQuiz } = useModuleProgress("remote");

  if (showQuiz) {
    return (
      <QuizBlock
        moduleId="remote"
        questions={QUIZ}
        color={COLOR}
        moduleTitle="Remote & Push/Pull"
        nextHref="/modules/status"
        nextLabel="Modul 06: Status & File States →"
      />
    );
  }

  return (
    <ModuleLayout
      moduleId="remote"
      moduleNumber={5}
      title="Remote & Push/Pull"
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
      <RemoteScene step={step} />
    </ModuleLayout>
  );
}
