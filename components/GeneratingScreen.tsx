"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { label: "Analyzing business context", detail: "Reviewing industry, goals, and requirements..." },
  { label: "Designing solution architecture", detail: "Selecting optimal tech stack and approach..." },
  { label: "Estimating team composition", detail: "Calculating roles, allocation, and timeline..." },
  { label: "Drafting executive summary", detail: "Writing the project overview..." },
  { label: "Mapping project scope", detail: "Defining in-scope and out-of-scope items..." },
  { label: "Running scope-creep detection", detail: "Analyzing delivery risk factors..." },
  { label: "Generating pricing packages", detail: "Building Startup, Growth, and Enterprise tiers..." },
  { label: "Calculating ROI projection", detail: "Estimating cost savings and efficiency gains..." },
  { label: "Scoring proposal quality", detail: "Evaluating completeness and win probability..." },
  { label: "Finalizing proposal", detail: "Assembling all sections into a cohesive document..." },
];

export default function GeneratingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((n) => (n < STEPS.length - 1 ? n + 1 : n));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-20 text-center">
      {/* Animated orb */}
      <div className="relative mb-10">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 animate-pulse-glow" />
        <div className="absolute inset-0 h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 animate-ping opacity-20" />
      </div>

      <h2 className="font-display text-xl text-white">
        {STEPS[currentStep].label}
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        {STEPS[currentStep].detail}
      </p>

      {/* Progress bar */}
      <div className="mt-8 w-full max-w-sm">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-600">
        NexGeTech AI is working like a solutions architect...
      </p>
    </div>
  );
}
