"use client";

import { CompletenessBreakdown } from "@/lib/types";

function Bar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "bg-signal-green" : value >= 50 ? "bg-signal-amber" : "bg-signal-red";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-parchment-200/70">{label}</span>
        <span className="font-medium text-parchment-100">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-800">
        <div className={`h-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function CompletenessMeter({ data }: { data: CompletenessBreakdown }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm text-parchment-50">Proposal readiness</h3>
        <span className="font-display text-2xl text-gold-400">{data.overall}%</span>
      </div>
      <div className="space-y-3">
        <Bar label="Business goals" value={data.businessGoals} />
        <Bar label="Technical requirements" value={data.technicalRequirements} />
        <Bar label="Budget information" value={data.budgetInformation} />
        <Bar label="Timeline expectations" value={data.timelineExpectations} />
      </div>
    </div>
  );
}
