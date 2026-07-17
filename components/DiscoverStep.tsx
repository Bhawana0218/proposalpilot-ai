"use client";

import { useAppStore } from "@/lib/store";
import { SERVICE_OPTIONS } from "@/lib/types";
import GlassCard from "./GlassCard";
import {
  Building2,
  Target,
  Zap,
  ChevronRight,
  Globe,
  Mail,
  Users,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

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

const SERVICE_ICONS: Record<string, typeof Building2> = {
  "Web Development": Globe,
  "Mobile App Development": Zap,
  "AI Solutions": Target,
  Automation: Zap,
  "Chatbot Development": Target,
  "Cloud Infrastructure": Globe,
  "Data Analytics": Target,
  "UI/UX Design": Target,
};

export default function DiscoverStep() {
  const { intake, updateClient, updateGoals, toggleService, setStep } =
    useAppStore();
  const c = intake.client;
  const s = intake.services.selected;
  const g = intake.goals;

  const canContinueBasic =
    c.companyName && c.industry && c.contactPerson;
  const canContinueGoals =
    g.selected.length > 0 || g.freeText.length > 10;
  const canContinueServices = s.length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Progress chips */}
      <div className="flex items-center gap-2">
        {["Business Context", "Objectives", "Services"].map((label, i) => {
          const done =
            (i === 0 && canContinueBasic) ||
            (i === 1 && canContinueGoals) ||
            (i === 2 && canContinueServices);
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  done
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-white/[0.04] text-slate-500"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    done ? "bg-emerald-500 text-white" : "bg-white/[0.08] text-slate-500"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < 2 && (
                <div
                  className={`h-px w-4 ${
                    done ? "bg-emerald-500/50" : "bg-white/[0.06]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Business Context */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Building2 size={18} className="text-cyan-400" />
          <h2 className="font-display text-xl text-white">Business Context</h2>
        </div>
        <p className="mb-6 text-sm text-slate-400">
          Tell us about the client. This anchors every section the AI writes.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: "Company name", key: "companyName", placeholder: "Acme Corp", icon: Building2, required: true },
            { label: "Industry", key: "industry", placeholder: "E-commerce, Healthcare, FinTech...", icon: Target, required: true },
            { label: "Company size", key: "companySize", placeholder: "", icon: Users, type: "select", options: ["1-10", "11-50", "51-200", "200+"] },
            { label: "Country / Region", key: "region", placeholder: "United States, EU, APAC...", icon: Globe },
            { label: "Existing website", key: "existingWebsite", placeholder: "https://...", icon: Globe },
            { label: "Budget range", key: "budgetRange", placeholder: "", icon: DollarSign, type: "select", options: ["<$10k", "$10k-$25k", "$25k-$50k", "$50k+"] },
            { label: "Contact person", key: "contactPerson", placeholder: "Full name", icon: Mail, required: true },
            { label: "Contact email", key: "contactEmail", placeholder: "name@company.com", icon: Mail },
          ].map((field) => (
            <GlassCard key={field.key} className="!p-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <field.icon size={12} />
                  {field.label}
                  {field.required && <span className="text-cyan-400">*</span>}
                </span>
                {field.type === "select" ? (
                  <select
                    value={(c as any)[field.key] || ""}
                    onChange={(e) =>
                      updateClient({ [field.key]: e.target.value } as any)
                    }
                    className="glass-input w-full px-3 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((o) => (
                      <option key={o} value={o} className="bg-navy-800">
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={(c as any)[field.key] || ""}
                    onChange={(e) =>
                      updateClient({ [field.key]: e.target.value } as any)
                    }
                    placeholder={field.placeholder}
                    className="glass-input w-full px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none"
                  />
                )}
              </label>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Step 2: Objectives */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Target size={18} className="text-cyan-400" />
          <h2 className="font-display text-xl text-white">Objectives</h2>
        </div>
        <p className="mb-6 text-sm text-slate-400">
          What outcome is the client chasing? Select what applies, then describe
          it in their own words.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {GOALS.map((goal) => (
            <button
              key={goal}
              onClick={() => {
                const selected = g.selected.includes(goal)
                  ? g.selected.filter((s) => s !== goal)
                  : [...g.selected, goal];
                updateGoals({ selected });
              }}
              className={`rounded-full border px-4 py-2 text-sm transition-all ${
                g.selected.includes(goal)
                  ? "border-cyan-500/30 bg-cyan-500/15 text-cyan-400"
                  : "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:border-white/[0.12] hover:text-slate-200"
              }`}
            >
              {goal}
            </button>
          ))}
        </div>

        <GlassCard className="!p-4">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-400">
              Describe the need, in the client&apos;s own words
            </span>
            <textarea
              value={g.freeText}
              onChange={(e) => updateGoals({ freeText: e.target.value })}
              rows={4}
              placeholder="e.g. We need an e-commerce website. We currently sell through Instagram DMs and it's chaos..."
              className="glass-input w-full resize-none px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none"
            />
          </label>
        </GlassCard>
      </div>

      {/* Step 3: Services */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Zap size={18} className="text-cyan-400" />
          <h2 className="font-display text-xl text-white">Solution Design</h2>
        </div>
        <p className="mb-6 text-sm text-slate-400">
          Select every service the client needs. 4+ triggers the scope-creep
          detector.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SERVICE_OPTIONS.map((service) => {
            const Icon = SERVICE_ICONS[service] || Zap;
            const isSelected = s.includes(service);
            return (
              <button
                key={service}
                onClick={() => toggleService(service)}
                className={`glass-card flex items-center gap-3 !p-4 text-left transition-all ${
                  isSelected
                    ? "!border-cyan-500/30 !bg-cyan-500/[0.08]"
                    : ""
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isSelected
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-white/[0.04] text-slate-500"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {service}
                  </span>
                </div>
                <div
                  className={`ml-auto flex h-5 w-5 items-center justify-center rounded border ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-500 text-white"
                      : "border-white/[0.12]"
                  }`}
                >
                  {isSelected && <span className="text-[10px]">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {s.length >= 4 && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-xs text-amber-300">
            <AlertTriangle size={14} />
            {s.length} services selected — the scope-creep detector will flag
            this and suggest phasing.
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <button
          disabled={!canContinueBasic || !canContinueGoals || !canContinueServices}
          onClick={() => setStep("analyze")}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Continue to Analysis
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
