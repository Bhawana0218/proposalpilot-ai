"use client";

import { useAppStore } from "@/lib/store";
import CompletenessMeter from "./CompletenessMeter";
import ScopeCreepAlert from "./ScopeCreepAlert";
import InternalSalesPanel from "./InternalSalesPanel";
import ChatAssistant from "./ChatAssistant";
import PdfExportButton from "./PdfExportButton";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-ink-200/10 py-6 first:pt-0 last:border-0">
      <h3 className="font-display text-lg text-ink-900">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed text-ink-900/80">{children}</div>
    </section>
  );
}

export default function ProposalDocument() {
  const { proposal, intake, reset } = useAppStore();
  if (!proposal) return null;
  const p = proposal.document;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 text-[11px] font-medium text-gold-400">
              {p.clientPersonality}
            </span>
            <span className="text-[11px] text-parchment-200/50">v{p.version}</span>
          </div>
          <h1 className="font-display text-2xl text-parchment-50">
            Proposal for {intake.client.companyName}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="rounded-lg border border-ink-600 px-4 py-2.5 text-sm font-medium text-parchment-200/70 hover:bg-ink-900"
          >
            New proposal
          </button>
          <PdfExportButton proposal={proposal} />
        </div>
      </div>

      {/* Intelligence row */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CompletenessMeter data={p.completeness} />
        <ScopeCreepAlert data={p.scopeCreep} />
      </div>

      {p.missingInformation.length > 0 && (
        <div className="mb-8 rounded-xl border border-signal-blue/30 bg-signal-blue/5 p-5">
          <h3 className="font-display text-sm text-signal-blue">Missing information detected</h3>
          <ul className="mt-2 space-y-1 text-xs text-parchment-200/70">
            {p.missingInformation.map((m, i) => (
              <li key={i}>• {m}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-8">
        <InternalSalesPanel quality={p.quality} deal={p.dealProbability} />
      </div>

      {/* The dossier itself */}
      <div className="dossier-paper grain rounded-2xl border border-ink-700/40 p-8 shadow-dossier sm:p-12">
        <div className="mb-8 flex items-center justify-between border-b border-ink-900/10 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
              NexGeTech
            </p>
            <p className="mt-1 text-[11px] text-ink-900/50">
              Project Proposal & Scope Document
            </p>
          </div>
          <p className="text-[11px] text-ink-900/50">
            {new Date(proposal.createdAt).toLocaleDateString()}
          </p>
        </div>

        <Section title="Executive Summary">{p.executiveSummary}</Section>
        <Section title="Problem Statement">{p.problemStatement}</Section>
        <Section title="Proposed Solution">{p.proposedSolution}</Section>

        <Section title="Project Scope">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-signal-green">
                In Scope
              </p>
              <ul className="space-y-1">
                {p.scopeIn.map((s, i) => (
                  <li key={i}>✓ {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-signal-red">
                Out of Scope
              </p>
              <ul className="space-y-1">
                {p.scopeOut.map((s, i) => (
                  <li key={i}>✕ {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section title="Deliverables">
          <ul className="space-y-1">
            {p.deliverables.map((d, i) => (
              <li key={i}>• {d}</li>
            ))}
          </ul>
        </Section>

        <Section title="Assumptions">
          <ul className="space-y-1">
            {p.assumptions.map((a, i) => (
              <li key={i}>• {a}</li>
            ))}
          </ul>
        </Section>

        <Section title="Risks & Dependencies">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-ink-900/15 text-ink-900/50">
                <th className="py-2 pr-2">Risk</th>
                <th className="py-2 pr-2">Impact</th>
                <th className="py-2">Likelihood</th>
              </tr>
            </thead>
            <tbody>
              {p.risks.map((r, i) => (
                <tr key={i} className="border-b border-ink-900/5">
                  <td className="py-2 pr-2">{r.risk}</td>
                  <td className="py-2 pr-2">{r.impact}</td>
                  <td className="py-2">{r.likelihood}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Estimated Timeline">
          <div className="space-y-2">
            {p.timeline.map((t, i) => (
              <div key={i} className="flex gap-4">
                <span className="w-28 shrink-0 text-xs font-semibold text-gold-600">
                  {t.phase}
                </span>
                <span className="w-20 shrink-0 text-xs text-ink-900/50">{t.duration}</span>
                <span className="text-xs">{t.description}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Recommended Team">
          <div className="space-y-2">
            {p.team.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-xs">{t.role}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-900/10">
                  <div
                    className="h-full bg-gold-500"
                    style={{ width: `${t.allocation}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs">{t.allocation}%</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Recommended Architecture">
          <div className="flex flex-wrap gap-2">
            {p.architecture.stack.map((s, i) => (
              <span
                key={i}
                className="rounded-full bg-ink-900/8 px-2.5 py-1 text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>
          <ul className="mt-3 space-y-1">
            {p.architecture.reasoning.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </Section>

        <Section title="Competitor Feature Benchmark">
          <ul className="space-y-1">
            {p.competitorFeatures.map((c, i) => (
              <li key={i}>• {c}</li>
            ))}
          </ul>
        </Section>

        <Section title="Pricing Packages">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {p.pricing.map((pk) => (
              <div
                key={pk.name}
                className={`rounded-xl border p-4 ${
                  pk.name === p.recommendedPackage
                    ? "border-gold-500 bg-gold-500/5"
                    : "border-ink-900/10"
                }`}
              >
                {pk.name === p.recommendedPackage && (
                  <span className="mb-2 inline-block rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold text-ink-950">
                    RECOMMENDED
                  </span>
                )}
                <p className="font-display text-base">{pk.name}</p>
                <p className="mt-0.5 text-sm font-semibold text-gold-600">
                  {pk.priceRange}
                </p>
                <ul className="mt-2 space-y-1 text-xs text-ink-900/70">
                  {pk.includes.map((inc, i) => (
                    <li key={i}>• {inc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs italic text-ink-900/60">{p.recommendedPackageReason}</p>
        </Section>

        <Section title="Projected ROI">
          <p>{p.roi.narrative}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Current cost", p.roi.currentCostEstimate],
              ["Projected cost", p.roi.projectedCostAfter],
              ["Annual savings", p.roi.estimatedAnnualSavings],
              ["Efficiency gain", p.roi.operationalEfficiencyGainPct],
            ].map(([label, val]) => (
              <div key={label} className="rounded-lg bg-ink-900/5 p-3">
                <p className="text-[10px] uppercase tracking-wide text-ink-900/50">{label}</p>
                <p className="mt-0.5 text-sm font-semibold">{val}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="mt-8">
        <ChatAssistant proposal={p} />
      </div>
    </div>
  );
}
