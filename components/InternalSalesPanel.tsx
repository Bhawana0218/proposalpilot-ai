"use client";

import { DealProbability, QualityScore } from "@/lib/types";

export default function InternalSalesPanel({
  quality,
  deal,
}: {
  quality: QualityScore;
  deal: DealProbability;
}) {
  return (
    <div className="rounded-xl border border-ink-600 bg-ink-900/60 p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded bg-signal-blue/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-signal-blue">
          Internal only — not shown to client
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex items-baseline gap-2">
            <span className="font-display text-2xl text-parchment-50">{quality.overall}</span>
            <span className="text-xs text-parchment-200/50">/100 proposal quality</span>
          </div>
          <div className="mt-2 space-y-1 text-xs">
            {quality.strengths.map((s, i) => (
              <p key={i} className="text-signal-green">✔ {s}</p>
            ))}
            {quality.weaknesses.map((w, i) => (
              <p key={i} className="text-signal-amber">⚠ {w}</p>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-baseline gap-2">
            <span className="font-display text-2xl text-parchment-50">
              {deal.probabilityPct}%
            </span>
            <span className="text-xs text-parchment-200/50">deal win probability</span>
          </div>
          <div className="mt-2 space-y-1 text-xs">
            {deal.positiveFactors.map((p, i) => (
              <p key={i} className="text-signal-green">+ {p}</p>
            ))}
            {deal.negativeFactors.map((n, i) => (
              <p key={i} className="text-signal-red">− {n}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
