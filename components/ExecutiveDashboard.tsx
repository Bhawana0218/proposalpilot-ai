"use client";

import GlassCard from "./GlassCard";
import AnimatedCounter from "./AnimatedCounter";
import { GeneratedProposal } from "@/lib/types";
import {
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Target,
  Shield,
} from "lucide-react";

function ScoreRing({
  score,
  label,
  color = "cyan",
}: {
  score: number;
  label: string;
  color?: string;
}) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  const colorMap: Record<string, string> = {
    cyan: "#00C2FF",
    green: "#10B981",
    amber: "#F59E0B",
    indigo: "#4F46E5",
  };
  const stroke = colorMap[color] || colorMap.cyan;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-28 w-28">
        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl font-bold text-white">
            <AnimatedCounter target={score} suffix="%" />
          </span>
        </div>
      </div>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}

export default function ExecutiveDashboard({
  proposal,
}: {
  proposal: GeneratedProposal;
}) {
  const budget = proposal.budgetEstimate;
  const win = proposal.winProbability;
  const p = proposal;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Target size={18} className="text-cyan-400" />
        <h2 className="font-display text-xl text-white">Executive Dashboard</h2>
      </div>

      {/* Score rings */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <GlassCard className="flex flex-col items-center !py-6">
          <ScoreRing score={p.proposalScore} label="Proposal Score" color="cyan" />
        </GlassCard>
        <GlassCard className="flex flex-col items-center !py-6">
          <ScoreRing
            score={win?.probability || p.dealProbability.probabilityPct}
            label="Win Probability"
            color="green"
          />
        </GlassCard>
        <GlassCard className="flex flex-col items-center !py-6">
          <ScoreRing
            score={p.completeness.overall}
            label="Completeness"
            color="indigo"
          />
        </GlassCard>
        <GlassCard className="flex flex-col items-center !py-6">
          <ScoreRing
            score={Math.min(p.quality.overall, 100)}
            label="Quality Score"
            color="amber"
          />
        </GlassCard>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <GlassCard>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15">
              <Users size={16} className="text-cyan-400" />
            </div>
            <span className="text-xs text-slate-400">Team Size</span>
          </div>
          <p className="font-display text-2xl font-bold text-white">
            <AnimatedCounter target={budget?.teamSize || p.team.length} />
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {budget?.roles?.map((r) => r.role).join(", ") || "Across all phases"}
          </p>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15">
              <Clock size={16} className="text-indigo-400" />
            </div>
            <span className="text-xs text-slate-400">Duration</span>
          </div>
          <p className="font-display text-2xl font-bold text-white">
            {budget?.deliveryDuration || "12-16 weeks"}
          </p>
          <p className="mt-1 text-xs text-slate-500">End-to-end delivery</p>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
              <DollarSign size={16} className="text-emerald-400" />
            </div>
            <span className="text-xs text-slate-400">Est. Cost</span>
          </div>
          <p className="font-display text-xl font-bold text-white">
            {budget?.estimatedCostRange || p.pricing[1]?.priceRange || "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Recommended package</p>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15">
              <TrendingUp size={16} className="text-amber-400" />
            </div>
            <span className="text-xs text-slate-400">ROI</span>
          </div>
          <p className="font-display text-xl font-bold text-white">
            {p.roi.operationalEfficiencyGainPct}
          </p>
          <p className="mt-1 text-xs text-slate-500">Efficiency gain</p>
        </GlassCard>
      </div>

      {/* Win probability reasoning */}
      {win?.reasoning && win.reasoning.length > 0 && (
        <GlassCard>
          <div className="mb-3 flex items-center gap-2">
            <Shield size={16} className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Win Analysis</h3>
          </div>
          <div className="space-y-2">
            {win.reasoning.map((reason, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                {reason}
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
