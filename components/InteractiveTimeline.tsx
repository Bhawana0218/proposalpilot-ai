"use client";

import GlassCard from "./GlassCard";
import { TimelinePhase } from "@/lib/types";

export default function InteractiveTimeline({
  timeline,
}: {
  timeline: TimelinePhase[];
}) {
  return (
    <GlassCard hover={false}>
      <h3 className="mb-6 font-display text-lg text-white">Timeline Roadmap</h3>
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-indigo-500/50 to-transparent" />

        <div className="space-y-6">
          {timeline.map((phase, i) => (
            <div key={i} className="flex gap-4 group">
              {/* Node */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    i === 0
                      ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-glow"
                      : "bg-white/[0.06] text-slate-400 group-hover:bg-white/[0.1] group-hover:text-white"
                  }`}
                >
                  {i + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-baseline gap-3">
                  <h4 className="text-sm font-semibold text-white">
                    {phase.phase}
                  </h4>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
                    {phase.duration}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
