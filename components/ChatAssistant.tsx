"use client";

import { useState } from "react";
import { GeneratedProposal } from "@/lib/types";

interface Msg {
  role: "user" | "assistant";
  text: string;
}

export default function ChatAssistant({ proposal }: { proposal: GeneratedProposal }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Ask me anything about this proposal — timeline, pricing, scope decisions, anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const question = input.trim();
    if (!question || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: question }]);
    setLoading(true);
    try {
      const res = await fetch("/api/proposal-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal, question }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.answer || data.error || "Something went wrong." },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[420px] flex-col rounded-xl border border-ink-700 bg-ink-900">
      <div className="border-b border-ink-700 px-4 py-3">
        <h3 className="font-display text-sm text-parchment-50">Proposal Chat Assistant</h3>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-auto bg-gold-500 text-ink-950"
                : "bg-ink-800 text-parchment-100"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="max-w-[85%] rounded-lg bg-ink-800 px-3 py-2 text-sm text-parchment-200/50">
            Thinking...
          </div>
        )}
      </div>
      <div className="flex gap-2 border-t border-ink-700 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Why is development 14 weeks?"
          className="flex-1 rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-parchment-50 placeholder:text-ink-600 outline-none focus:border-gold-500"
        />
        <button
          onClick={send}
          disabled={loading}
          className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-ink-950 disabled:opacity-40"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
