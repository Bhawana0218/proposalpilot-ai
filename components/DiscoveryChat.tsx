"use client";

import { useEffect, useState, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { DiscoveryCompleteness, Proposal } from "@/lib/types";
import GlassCard from "./GlassCard";
import {
  Send,
  SkipForward,
  Brain,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

interface ChatMessage {
  role: "ai" | "user";
  text: string;
  isChip?: boolean;
}

function CompletenessRadar({ data }: { data: DiscoveryCompleteness }) {
  const items = [
    { label: "Business Clarity", value: data.businessClarity, icon: "✓" },
    { label: "Technical Scope", value: data.technicalConfidence, icon: "✓" },
    {
      label: "Scope Completeness",
      value: data.scopeCompleteness,
      icon: data.scopeCompleteness > 60 ? "✓" : "⚠",
    },
    {
      label: "Delivery Risk",
      value: data.deliveryRisk,
      icon: data.deliveryRisk > 60 ? "⚠" : "✓",
      invert: true,
    },
  ];

  return (
    <div className="glass-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Discovery Intelligence
        </h4>
        <span className="text-xs text-cyan-400">
          {Math.round(
            (data.businessClarity + data.technicalConfidence + data.scopeCompleteness + (100 - data.deliveryRisk)) / 4
          )}
          % complete
        </span>
      </div>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className={
                    item.icon === "✓" ? "text-emerald-400" : "text-amber-400"
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </span>
              <span className="text-slate-400">{item.value}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  item.invert
                    ? item.value > 60
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                    : item.value >= 70
                    ? "bg-emerald-400"
                    : item.value >= 40
                    ? "bg-amber-400"
                    : "bg-red-400"
                }`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightPanel({
  insights,
  risks,
}: {
  insights: string[];
  risks: string[];
}) {
  if (insights.length === 0 && risks.length === 0) return null;
  return (
    <div className="glass-card p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Consultant Insights
      </h4>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-lg bg-cyan-500/[0.08] px-3 py-2 text-xs text-cyan-300"
          >
            <Lightbulb size={14} className="mt-0.5 shrink-0" />
            <span>{insight}</span>
          </div>
        ))}
        {risks.map((risk, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-lg bg-amber-500/[0.08] px-3 py-2 text-xs text-amber-300"
          >
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>{risk}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DiscoveryChat() {
  const {
    intake,
    setStep,
    setDiscoveryAnswers,
    setDiscoveryResult,
    setProposal,
    setLoading,
    setError,
    isLoading,
  } = useAppStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [fetching, setFetching] = useState(true);
  const [completeness, setCompleteness] = useState<DiscoveryCompleteness | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [riskFlags, setRiskFlags] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setFetching(true);
    fetch("/api/discovery-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(intake),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const q = data.questions || [];
        setQuestions(q);
        if (data.completeness) setCompleteness(data.completeness);
        if (data.consultantInsights) setInsights(data.consultantInsights);
        if (data.riskFlags) setRiskFlags(data.riskFlags);

        const greeting: ChatMessage = {
          role: "ai",
          text: `I've reviewed the intake for ${intake.client.companyName || "your project"}. Based on my analysis, here are the key areas I need clarification on to build a comprehensive proposal.`,
        };
        const questionMessages: ChatMessage[] = q.map((question: string) => ({
          role: "ai" as const,
          text: question,
        }));
        setMessages([greeting, ...questionMessages]);
      })
      .catch(() => {
        if (!cancelled) {
          setMessages([
            {
              role: "ai",
              text: "I've analyzed the intake. Let me ask a few targeted questions to strengthen the proposal.",
            },
            {
              role: "ai",
              text: "What specific integrations with existing systems will this project require?",
            },
            {
              role: "ai",
              text: "Are there any compliance or security requirements we should plan for?",
            },
          ]);
          setQuestions([
            "What specific integrations with existing systems will this project require?",
            "Are there any compliance or security requirements we should plan for?",
          ]);
        }
      })
      .finally(() => !cancelled && setFetching(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const answerQuestion = (qIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: answer }));
    setMessages((prev) => [
      ...prev,
      { role: "user", text: answer },
    ]);
  };

  const handleGenerate = async (skip: boolean) => {
    const discoveryAnswers = skip
      ? []
      : questions
          .map((q, i) => ({ question: q, answer: answers[i]?.trim() || "" }))
          .filter((d) => d.answer.length > 0);

    setDiscoveryAnswers(discoveryAnswers);
    if (completeness) {
      setDiscoveryResult({
        questions,
        completeness,
        consultantInsights: insights,
        riskFlags,
      });
    }
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
      setStep("architect");
    } finally {
      setLoading(false);
    }
  };

  const answeredCount = Object.keys(answers).filter(
    (k) => answers[Number(k)]?.trim().length > 0
  ).length;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Chat column */}
      <div className="flex flex-1 flex-col">
        <div className="mb-4 flex items-center gap-2">
          <Brain size={18} className="text-cyan-400" />
          <h2 className="font-display text-xl text-white">
            AI Strategy Review
          </h2>
        </div>
        <p className="mb-4 text-sm text-slate-400">
          These questions directly impact your project&apos;s scope, timeline, cost,
          and architecture. Answer what you can.
        </p>

        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {fetching && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card h-16 animate-pulse" />
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white border border-cyan-500/20"
                    : "glass-card !rounded-2xl text-slate-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <span className="text-xs text-slate-500">
            {answeredCount}/{questions.length} questions answered
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => handleGenerate(true)}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm text-slate-400 transition-all hover:bg-white/[0.04] hover:text-slate-200 disabled:opacity-40"
            >
              <SkipForward size={16} />
              Skip &amp; Generate
            </button>
            <button
              onClick={() => handleGenerate(false)}
              disabled={isLoading || fetching}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg disabled:opacity-40"
            >
              <Send size={16} />
              Generate Proposal
            </button>
          </div>
        </div>
      </div>

      {/* Right panel — intelligence */}
      <div className="hidden w-80 flex-shrink-0 space-y-4 lg:block">
        {completeness && <CompletenessRadar data={completeness} />}
        <InsightPanel insights={insights} risks={riskFlags} />

        {/* Quick answer chips */}
        {!fetching && questions.length > 0 && (
          <div className="glass-card p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick Context
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                "No integrations needed",
                "Standard security",
                "3-6 month timeline",
                "MVP first, scale later",
                "Single platform",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    const unanswered = questions.findIndex(
                      (q, i) => !answers[i]?.trim()
                    );
                    if (unanswered >= 0) answerQuestion(unanswered, chip);
                  }}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
