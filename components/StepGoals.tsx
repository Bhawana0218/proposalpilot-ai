"use client";

import { useAppStore } from "@/lib/store";

const GOALS = [
  "Increase sales",
  "Automate operations",
  "Improve customer support",
  "Build MVP",
  "Improve internal workflow",
  "Reduce manual work",
  "Enter a new market",
  "Replace legacy system",
];

export default function StepGoals() {
  const { intake, updateGoals, setStep } = useAppStore();
  const { goals } = intake;

  const toggle = (g: string) => {
    const selected = goals.selected.includes(g)
      ? goals.selected.filter((s) => s !== g)
      : [...goals.selected, g];
    updateGoals({ selected });
  };

  const canContinue = goals.selected.length > 0 || goals.freeText.length > 10;

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="font-display text-2xl text-parchment-50">Business goals</h2>
      <p className="mt-1 text-sm text-parchment-200/60">
        What outcome is the client actually chasing? Select what applies, then describe
        it in their own words — the discovery agent uses this text most.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {GOALS.map((g) => (
          <button
            key={g}
            onClick={() => toggle(g)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              goals.selected.includes(g)
                ? "border-gold-500 bg-gold-500/15 text-gold-400"
                : "border-ink-600 bg-ink-900 text-parchment-200/70 hover:border-ink-600/60"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <label className="mt-6 block">
        <span className="mb-1.5 block text-sm font-medium text-parchment-200/80">
          Describe the need, in the client's own words
        </span>
        <textarea
          value={goals.freeText}
          onChange={(e) => updateGoals({ freeText: e.target.value })}
          rows={5}
          placeholder="e.g. We need an e-commerce website. We currently sell through Instagram DMs and it's chaos..."
          className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3.5 py-2.5 text-sm text-parchment-50 placeholder:text-ink-600 outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
        />
      </label>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep("client")}
          className="rounded-lg border border-ink-600 px-5 py-2.5 text-sm font-medium text-parchment-200/80 hover:bg-ink-900"
        >
          ← Back
        </button>
        <button
          disabled={!canContinue}
          onClick={() => setStep("services")}
          className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Continue to services →
        </button>
      </div>
    </div>
  );
}
