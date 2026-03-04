"use client";

interface PhaseIndicatorProps {
  currentPhase: number;
  status: string;
}

export default function PhaseIndicator({ currentPhase, status }: PhaseIndicatorProps) {
  const phases = [
    { num: 1, label: "Checklist" },
    { num: 2, label: "Punch List" },
    { num: 3, label: "Sign-off" },
  ];

  return (
    <div className="flex items-center gap-1">
      {phases.map((phase, i) => {
        const isComplete = status === "completed" || phase.num < currentPhase;
        const isCurrent = phase.num === currentPhase && status !== "completed";

        return (
          <div key={phase.num} className="flex items-center">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                isComplete
                  ? "bg-green-500 text-white"
                  : isCurrent
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-500"
              }`}
            >
              {isComplete ? "\u2713" : phase.num}
            </div>
            {i < phases.length - 1 && (
              <div
                className={`w-6 h-0.5 ${
                  isComplete ? "bg-green-500" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
