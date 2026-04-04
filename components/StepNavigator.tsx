import { FaBullseye } from "react-icons/fa";

interface Props {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  color: string;
  onStartQuiz?: () => void;
}

export default function StepNavigator({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  color,
  onStartQuiz,
}: Props) {
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      {/* Prev button */}
      <button
        onClick={onPrev}
        disabled={currentStep === 0}
        className="btn-brutal px-5 py-2 text-sm bg-white"
        style={{ fontFamily: "var(--font-nunito)", fontWeight: 700 }}
      >
        ← Sebelumnya
      </button>

      {/* Step dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === currentStep ? 20 : 10,
              height: 10,
              background: i === currentStep ? color : "#1E1B2E20",
              border: `2px solid ${i === currentStep ? color : "#1E1B2E30"}`,
            }}
          />
        ))}
      </div>

      {/* Next / Quiz button */}
      {isLast ? (
        <button
          onClick={onStartQuiz}
          className="btn-brutal px-5 py-2 text-sm text-white"
          style={{
            fontFamily: "var(--font-nunito)",
            fontWeight: 700,
            background: color,
          }}
        >
          Mulai Kuis <FaBullseye className="inline ml-1" />
        </button>
      ) : (
        <button
          onClick={onNext}
          className="btn-brutal px-5 py-2 text-sm text-white"
          style={{
            fontFamily: "var(--font-nunito)",
            fontWeight: 700,
            background: color,
          }}
        >
          Selanjutnya →
        </button>
      )}
    </div>
  );
}
