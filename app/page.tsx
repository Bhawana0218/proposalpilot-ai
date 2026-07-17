"use client";

import { useAppStore } from "@/lib/store";
import Stepper from "@/components/Stepper";
import StepClient from "@/components/StepClient";
import StepGoals from "@/components/StepGoals";
import StepServices from "@/components/StepServices";
import StepDiscovery from "@/components/StepDiscovery";
import GeneratingScreen from "@/components/GeneratingScreen";
import ProposalDocument from "@/components/ProposalDocument";

export default function Home() {
  const { step, error } = useAppStore();

  return (
    <main className="min-h-screen">
      <header className="border-b border-ink-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-seal" />
            <span className="font-display text-lg text-parchment-50">ProposalPilot AI</span>
          </div>
          {step !== "generating" && <Stepper current={step} />}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {error && (
          <div className="mx-auto mb-6 max-w-2xl rounded-lg border border-signal-red/40 bg-signal-red/10 px-4 py-3 text-sm text-signal-red">
            {error}
          </div>
        )}

        {step === "client" && <StepClient />}
        {step === "goals" && <StepGoals />}
        {step === "services" && <StepServices />}
        {step === "discovery" && <StepDiscovery />}
        {step === "generating" && <GeneratingScreen />}
        {step === "preview" && <ProposalDocument />}
      </div>
    </main>
  );
}
