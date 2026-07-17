"use client";

import { useAppStore } from "@/lib/store";
import GlassCard from "./GlassCard";
import ExecutiveDashboard from "./ExecutiveDashboard";
import InteractiveTimeline from "./InteractiveTimeline";
import ChatAssistant from "./ChatAssistant";
import PdfExportButton from "./PdfExportButton";
import {
  FileText,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
  TrendingUp,
  Building2,
  BarChart3,
  Lightbulb,
  Shield,
} from "lucide-react";

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: typeof FileText;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon size={16} className="text-cyan-400" />
      <h3 className="font-display text-base font-semibold text-white">
        {title}
      </h3>
    </div>
  );
}

export default function ProposalDashboard() {
  const { proposal, intake, reset } = useAppStore();
  if (!proposal) return null;
  const p = proposal.document;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-400">
              {p.clientPersonality}
            </span>
            <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-400">
              v{p.version}
            </span>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
              Score: {p.proposalScore}/100
            </span>
          </div>
          <h1 className="font-display text-2xl text-white">
            Proposal for {intake.client.companyName}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Generated {new Date(proposal.createdAt).toLocaleDateString()} ·{" "}
            {p.timeline.map((t) => t.duration).join(" → ")}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm text-slate-400 transition-all hover:bg-white/[0.04] hover:text-white"
          >
            New Proposal
          </button>
          <PdfExportButton proposal={proposal} />
        </div>
      </div>

      {/* Executive Dashboard */}
      <ExecutiveDashboard proposal={p} />

      {/* Two-column layout for key sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Executive Summary */}
        <GlassCard hover={false}>
          <SectionHeader icon={FileText} title="Executive Summary" />
          <p className="text-sm leading-relaxed text-slate-300">
            {p.executiveSummary}
          </p>
        </GlassCard>

        {/* Problem + Solution */}
        <GlassCard hover={false}>
          <SectionHeader icon={Lightbulb} title="Problem & Solution" />
          <div className="space-y-4">
            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Problem
              </h4>
              <p className="text-sm text-slate-300">{p.problemStatement}</p>
            </div>
            <div className="h-px bg-white/[0.06]" />
            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Solution
              </h4>
              <p className="text-sm text-slate-300">{p.proposedSolution}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Scope */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false}>
          <SectionHeader icon={CheckCircle2} title="In Scope" />
          <ul className="space-y-2">
            {p.scopeIn.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                {s}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard hover={false}>
          <SectionHeader icon={XCircle} title="Out of Scope" />
          <ul className="space-y-2">
            {p.scopeOut.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <XCircle size={14} className="mt-0.5 shrink-0 text-red-400" />
                {s}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Timeline */}
      <InteractiveTimeline timeline={p.timeline} />

      {/* Team + Architecture */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false}>
          <SectionHeader icon={Building2} title="Team Composition" />
          <div className="space-y-3">
            {p.team.map((t, i) => (
              <div key={i}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-300">{t.role}</span>
                  <span className="text-slate-500">{t.allocation}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                    style={{ width: `${t.allocation}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <SectionHeader icon={Layers} title="Architecture" />
          <div className="mb-3 flex flex-wrap gap-2">
            {p.architecture.stack.map((s, i) => (
              <span
                key={i}
                className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400"
              >
                {s}
              </span>
            ))}
          </div>
          <ul className="space-y-1.5">
            {p.architecture.reasoning.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                {r}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Deliverables + Assumptions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false}>
          <SectionHeader icon={Package} title="Deliverables" />
          <div className="flex flex-wrap gap-2">
            {p.deliverables.map((d, i) => (
              <span
                key={i}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
              >
                {d}
              </span>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <SectionHeader icon={AlertTriangle} title="Assumptions" />
          <ul className="space-y-1.5">
            {p.assumptions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                {a}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Risks */}
      <GlassCard hover={false}>
        <SectionHeader icon={Shield} title="Risks & Dependencies" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-500">
                <th className="pb-3 pr-4 font-medium">Risk</th>
                <th className="pb-3 pr-4 font-medium">Impact</th>
                <th className="pb-3 font-medium">Likelihood</th>
              </tr>
            </thead>
            <tbody>
              {p.risks.map((r, i) => (
                <tr key={i} className="border-b border-white/[0.03]">
                  <td className="py-3 pr-4 text-slate-300">{r.risk}</td>
                  <td className="py-3 pr-4 text-slate-400">{r.impact}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        r.likelihood === "High"
                          ? "bg-red-500/15 text-red-400"
                          : r.likelihood === "Medium"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-emerald-500/15 text-emerald-400"
                      }`}
                    >
                      {r.likelihood}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Pricing */}
      <GlassCard hover={false}>
        <SectionHeader icon={BarChart3} title="Pricing Packages" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {p.pricing.map((pk) => (
            <div
              key={pk.name}
              className={`rounded-xl border p-5 transition-all ${
                pk.name === p.recommendedPackage
                  ? "border-cyan-500/30 bg-cyan-500/[0.08] shadow-glow"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {pk.name === p.recommendedPackage && (
                <span className="mb-3 inline-block rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-1 text-[10px] font-bold text-white">
                  RECOMMENDED
                </span>
              )}
              <p className="font-display text-base text-white">{pk.name}</p>
              <p className="mt-1 text-lg font-bold text-cyan-400">
                {pk.priceRange}
              </p>
              <ul className="mt-3 space-y-1.5">
                {pk.includes.map((inc, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 text-xs text-slate-400"
                  >
                    <CheckCircle2
                      size={12}
                      className="mt-0.5 shrink-0 text-cyan-500"
                    />
                    {inc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs italic text-slate-500">
          {p.recommendedPackageReason}
        </p>
      </GlassCard>

      {/* ROI */}
      <GlassCard hover={false}>
        <SectionHeader icon={TrendingUp} title="Projected ROI" />
        <p className="mb-4 text-sm text-slate-300">{p.roi.narrative}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Current cost", p.roi.currentCostEstimate],
            ["Projected cost", p.roi.projectedCostAfter],
            ["Annual savings", p.roi.estimatedAnnualSavings],
            ["Efficiency gain", p.roi.operationalEfficiencyGainPct],
          ].map(([label, val]) => (
            <div
              key={label}
              className="rounded-xl bg-white/[0.03] p-3 text-center"
            >
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                {label}
              </p>
              <p className="mt-1 text-sm font-bold text-white">{val}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Competitor Benchmark */}
      {p.competitorFeatures.length > 0 && (
        <GlassCard hover={false}>
          <SectionHeader icon={BarChart3} title="Competitor Benchmark" />
          <div className="flex flex-wrap gap-2">
            {p.competitorFeatures.map((c, i) => (
              <span
                key={i}
                className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400"
              >
                {c}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Missing Info */}
      {p.missingInformation.length > 0 && (
        <GlassCard hover={false} className="border-amber-500/20">
          <SectionHeader icon={AlertTriangle} title="Missing Information" />
          <ul className="space-y-1.5">
            {p.missingInformation.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-amber-300">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                {m}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {/* Chat */}
      <ChatAssistant proposal={p} />
    </div>
  );
}
