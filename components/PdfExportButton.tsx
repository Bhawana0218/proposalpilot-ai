"use client";

import { useState } from "react";
import { Proposal } from "@/lib/types";
import { generateProposalPDF } from "@/lib/pdf-generator";

export default function PdfExportButton({ proposal }: { proposal: Proposal }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      generateProposalPDF(proposal);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {exporting ? "Building PDF..." : "Export professional PDF ↓"}
    </button>
  );
}
