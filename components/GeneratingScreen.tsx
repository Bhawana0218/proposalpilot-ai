"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Reading the client intake...",
  "Weighing scope against budget signals...",
  "Drafting executive summary...",
  "Mapping in-scope vs out-of-scope...",
  "Estimating timeline and team...",
  "Running scope-creep detection...",
  "Scoring proposal completeness...",
  "Finalizing pricing packages...",
];

export default function GeneratingScreen() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % MESSAGES.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
      <div className="seal-animate h-16 w-16 rounded-full bg-seal shadow-dossier" />
      <p className="mt-8 font-display text-lg text-parchment-50">{MESSAGES[i]}</p>
      <p className="mt-2 text-xs text-parchment-200/50">
        ProposalPilot is thinking like a solutions architect, not a form.
      </p>
    </div>
  );
}
