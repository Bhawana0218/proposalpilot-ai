"use client";

import { useAppStore } from "@/lib/store";
import { TextField, SelectField } from "./Field";

export default function StepClient() {
  const { intake, updateClient, setStep } = useAppStore();
  const c = intake.client;

  const canContinue = c.companyName && c.industry && c.contactPerson;

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="font-display text-2xl text-parchment-50">Client information</h2>
      <p className="mt-1 text-sm text-parchment-200/60">
        Basic facts about who this proposal is for. This anchors every section the AI
        writes next.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          label="Company name"
          value={c.companyName}
          onChange={(v) => updateClient({ companyName: v })}
          placeholder="Acme Logistics Inc."
          required
        />
        <TextField
          label="Industry"
          value={c.industry}
          onChange={(v) => updateClient({ industry: v })}
          placeholder="E-commerce, Healthcare, FinTech..."
          required
        />
        <SelectField
          label="Company size"
          value={c.companySize}
          onChange={(v) => updateClient({ companySize: v })}
          options={["1-10", "11-50", "51-200", "200+"]}
        />
        <TextField
          label="Country / Region"
          value={c.region}
          onChange={(v) => updateClient({ region: v })}
          placeholder="United States, EU, APAC..."
        />
        <TextField
          label="Existing website"
          value={c.existingWebsite || ""}
          onChange={(v) => updateClient({ existingWebsite: v })}
          placeholder="https://..."
        />
        <SelectField
          label="Budget range"
          value={c.budgetRange}
          onChange={(v) => updateClient({ budgetRange: v })}
          options={["<$10k", "$10k-$25k", "$25k-$50k", "$50k+"]}
        />
        <TextField
          label="Contact person"
          value={c.contactPerson}
          onChange={(v) => updateClient({ contactPerson: v })}
          placeholder="Full name"
          required
        />
        <TextField
          label="Contact email"
          value={c.contactEmail || ""}
          onChange={(v) => updateClient({ contactEmail: v })}
          placeholder="name@company.com"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          disabled={!canContinue}
          onClick={() => setStep("goals")}
          className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Continue to business goals →
        </button>
      </div>
    </div>
  );
}
