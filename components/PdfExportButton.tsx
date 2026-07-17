"use client";

import { useState } from "react";
import { Proposal } from "@/lib/types";
import { generateProposalPDF } from "@/lib/pdf-generator";
import { Download } from "lucide-react";

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
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg disabled:opacity-50"
    >
      <Download size={16} />
      {exporting ? "Building PDF..." : "Export PDF"}
    </button>
  );
}
