"use client";

import { useState } from "react";
import { GeneratedProposal } from "@/lib/types";
import { Send, Bot } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  text: string;
}

export default function ChatAssistant({ proposal }: { proposal: GeneratedProposal }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Ask me anything about this proposal — timeline, pricing, scope, architecture, or ROI decisions.",
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
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-4">
        <Bot size={18} className="text-cyan-400" />
        <h3 className="text-sm font-semibold text-white">Proposal Chat</h3>
      </div>
      <div className="flex h-[380px] flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white border border-cyan-500/20"
                    : "bg-white/[0.04] text-slate-200 border border-white/[0.06]"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white/[0.04] px-4 py-2.5 text-sm text-slate-400 border border-white/[0.06]">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 border-t border-white/[0.06] p-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Why is development 14 weeks?"
            className="glass-input flex-1 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none"
          />
          <button
            onClick={send}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
