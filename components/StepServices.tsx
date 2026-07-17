"use client";

import { useAppStore } from "@/lib/store";
import { SERVICE_OPTIONS } from "@/lib/types";

export default function StepServices() {
  const { intake, toggleService, setStep } = useAppStore();
  const selected = intake.services.selected;

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="font-display text-2xl text-parchment-50">Requested services</h2>
      <p className="mt-1 text-sm text-parchment-200/60">
        Select every service the client is asking about. Selecting 4+ at once will
        trigger the scope-creep detector later — that's intentional.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SERVICE_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => toggleService(s)}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
              selected.includes(s)
                ? "border-gold-500 bg-gold-500/10 text-parchment-50"
                : "border-ink-600 bg-ink-900 text-parchment-200/70 hover:border-ink-600/60"
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                selected.includes(s)
                  ? "border-gold-500 bg-gold-500 text-ink-950"
                  : "border-ink-600"
              }`}
            >
              {selected.includes(s) && "✓"}
            </span>
            {s}
          </button>
        ))}
      </div>

      {selected.length >= 4 && (
        <p className="mt-4 rounded-lg border border-signal-amber/40 bg-signal-amber/10 px-4 py-2.5 text-xs text-signal-amber">
          ⚠ {selected.length} services selected — the scope-creep detector will likely
          flag this and suggest phasing.
        </p>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep("goals")}
          className="rounded-lg border border-ink-600 px-5 py-2.5 text-sm font-medium text-parchment-200/80 hover:bg-ink-900"
        >
          ← Back
        </button>
        <button
          disabled={selected.length === 0}
          onClick={() => setStep("discovery")}
          className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Continue to AI discovery →
        </button>
      </div>
    </div>
  );
}
