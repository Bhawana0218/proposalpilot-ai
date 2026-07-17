"use client";

import { useAppStore } from "@/lib/store";
import GlassCard from "./GlassCard";
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function AnalyzeStep() {
  const { intake, setStep } = useAppStore();
  const c = intake.client;
  const s = intake.services.selected;
  const g = intake.goals;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <BarChart3 size={18} className="text-cyan-400" />
          <h2 className="font-display text-xl text-white">Analyze</h2>
        </div>
        <p className="text-sm text-slate-400">
          Here&apos;s what we&apos;ve captured. The AI will use this to generate
          targeted discovery questions.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <GlassCard>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Business Context
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Company</span>
              <span className="text-white">{c.companyName || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Industry</span>
              <span className="text-white">{c.industry || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Size</span>
              <span className="text-white">{c.companySize || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Budget</span>
              <span className="text-white">{c.budgetRange || "—"}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Objectives
          </h3>
          <div className="flex flex-wrap gap-2">
            {g.selected.length > 0 ? (
              g.selected.map((goal) => (
                <span
                  key={goal}
                  className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400"
                >
                  {goal}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No goals selected</span>
            )}
          </div>
          {g.freeText && (
            <p className="mt-3 text-xs text-slate-400 italic">
              &ldquo;{g.freeText}&rdquo;
            </p>
          )}
        </GlassCard>
      </div>

      {/* Services */}
      <GlassCard>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Requested Services
        </h3>
        <div className="flex flex-wrap gap-2">
          {s.map((service) => (
            <span
              key={service}
              className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-400"
            >
              {service}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* Status */}
      <GlassCard>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Readiness Check
        </h3>
        <div className="space-y-2">
          {[
            { label: "Business context defined", ok: !!c.companyName && !!c.industry },
            { label: "Objectives clarified", ok: g.selected.length > 0 || g.freeText.length > 10 },
            { label: "Services selected", ok: s.length > 0 },
            { label: "Budget range provided", ok: !!c.budgetRange },
            { label: "Contact information", ok: !!c.contactPerson },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              {item.ok ? (
                <CheckCircle2 size={14} className="text-emerald-400" />
              ) : (
                <AlertTriangle size={14} className="text-amber-400" />
              )}
              <span className={item.ok ? "text-slate-300" : "text-amber-300"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep("discover")}
          className="flex items-center gap-2 rounded-xl border border-white/[0.08] px-5 py-2.5 text-sm text-slate-400 transition-all hover:bg-white/[0.04] hover:text-white"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <button
          onClick={() => setStep("architect")}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg"
        >
          Start AI Discovery
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
