"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Proposal } from "@/lib/types";

export default function StepDiscovery() {
  const { intake, setStep, setDiscoveryAnswers, setProposal, setLoading, setError, isLoading } =
    useAppStore();

  const [questions, setQuestions] = useState<string[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [fetchingQuestions, setFetchingQuestions] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setFetchingQuestions(true);
    fetch("/api/discovery-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(intake),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setQuestions(data.questions || []);
      })
      .catch(() => !cancelled && setQuestions([]))
      .finally(() => !cancelled && setFetchingQuestions(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async (skip: boolean) => {
    const discoveryAnswers = skip
      ? []
      : (questions || [])
          .map((q, i) => ({ question: q, answer: answers[i]?.trim() || "" }))
          .filter((d) => d.answer.length > 0);

    setDiscoveryAnswers(discoveryAnswers);
    setLoading(true);
    setError(null);
    setStep("generating");

    try {
      const res = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...intake, discoveryAnswers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate proposal");
      setProposal(data as Proposal);
    } catch (err: any) {
      setError(err.message);
      setStep("discovery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-signal-green" />
        <span className="text-xs font-medium uppercase tracking-wide text-signal-green">
          AI Discovery Interview Agent
        </span>
      </div>
      <h2 className="font-display text-2xl text-parchment-50">
        A few things a consultant would still ask
      </h2>
      <p className="mt-1 text-sm text-parchment-200/60">
        Before writing the proposal, ProposalPilot reviews the intake and asks the
        questions that would actually change scope, cost, or timeline. Answer what you
        can — skipping is fine, it just lowers the completeness score.
      </p>

      <div className="mt-6 space-y-4">
        {fetchingQuestions && (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-ink-900" />
            ))}
          </div>
        )}

        {!fetchingQuestions && questions?.length === 0 && (
          <p className="rounded-lg border border-ink-600 bg-ink-900 px-4 py-3 text-sm text-parchment-200/60">
            The intake was detailed enough that no critical follow-ups came up. You can
            generate the proposal now.
          </p>
        )}

        {!fetchingQuestions &&
          questions?.map((q, i) => (
            <div key={i}>
              <p className="mb-1.5 text-sm font-medium text-parchment-200/90">
                {i + 1}. {q}
              </p>
              <textarea
                rows={2}
                value={answers[i] || ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                placeholder="Your answer (optional)"
                className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3.5 py-2.5 text-sm text-parchment-50 placeholder:text-ink-600 outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
          ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep("services")}
          className="rounded-lg border border-ink-600 px-5 py-2.5 text-sm font-medium text-parchment-200/80 hover:bg-ink-900"
        >
          ← Back
        </button>
        <div className="flex gap-3">
          <button
            disabled={isLoading}
            onClick={() => handleGenerate(true)}
            className="rounded-lg border border-ink-600 px-5 py-2.5 text-sm font-medium text-parchment-200/70 hover:bg-ink-900"
          >
            Skip & generate
          </button>
          <button
            disabled={isLoading || fetchingQuestions}
            onClick={() => handleGenerate(false)}
            className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Generate proposal →
          </button>
        </div>
      </div>
    </div>
  );
}
