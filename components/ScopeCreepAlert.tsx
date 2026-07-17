"use client";

import { ScopeCreepAssessment } from "@/lib/types";

const LEVEL_STYLES: Record<string, string> = {
  Low: "border-signal-green/40 bg-signal-green/10 text-signal-green",
  Medium: "border-signal-amber/40 bg-signal-amber/10 text-signal-amber",
  High: "border-signal-red/40 bg-signal-red/10 text-signal-red",
};

export default function ScopeCreepAlert({ data }: { data: ScopeCreepAssessment }) {
  return (
    <div className={`rounded-xl border p-5 ${LEVEL_STYLES[data.riskLevel]}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">⚠</span>
        <h3 className="font-display text-sm">
          Scope Creep Risk: {data.riskLevel}
        </h3>
      </div>
      {data.reasons.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs opacity-90">
          {data.reasons.map((r, i) => (
            <li key={i}>• {r}</li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs font-medium opacity-90">Recommendation: {data.recommendation}</p>
      {data.phasingSuggestion && data.phasingSuggestion.length > 0 && (
        <div className="mt-3 space-y-1 border-t border-current/20 pt-3 text-xs opacity-90">
          {data.phasingSuggestion.map((p, i) => (
            <p key={i}>
              <span className="font-semibold">{p.phase}:</span> {p.features.join(", ")}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
