"use client";

import { Step } from "@/lib/store";

const STEPS: { key: Step; label: string }[] = [
  { key: "client", label: "Client" },
  { key: "goals", label: "Goals" },
  { key: "services", label: "Services" },
  { key: "discovery", label: "Discovery" },
  { key: "preview", label: "Proposal" },
];

export default function Stepper({ current }: { current: Step }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((s, i) => {
        const active = i === currentIndex;
        const done = i < currentIndex;
        return (
          <div key={s.key} className="flex items-center gap-1 sm:gap-2">
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-gold-500 text-ink-950"
                  : done
                  ? "bg-ink-700 text-parchment-100"
                  : "bg-ink-800 text-ink-600"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  active ? "bg-ink-950 text-gold-400" : "bg-ink-950/40"
                }`}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-3 sm:w-6 ${done ? "bg-gold-500" : "bg-ink-700"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
