import jsPDF from "jspdf";
import { Proposal } from "./types";

const W = 210;
const H = 297;
const M = 20;
const CYAN = [0, 194, 255] as [number, number, number];
const NAVY = [15, 23, 42] as [number, number, number];
const DARK = [30, 41, 59] as [number, number, number];
const INK = [30, 30, 30] as [number, number, number];
const GREY = [100, 116, 139] as [number, number, number];
const LIGHT_GREY = [241, 245, 249] as [number, number, number];
const WHITE = [255, 255, 255] as [number, number, number];

export function generateProposalPDF(proposal: Proposal) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const { intake, document: p } = proposal;
  let y = M;
  let page = 1;
  const toc: { title: string; page: number }[] = [];

  // ── helpers ──────────────────────────────────────────────────────────

  const newPage = () => {
    doc.addPage();
    page++;
    y = M;
    runningHeader();
    footer();
  };

  const runningHeader = () => {
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREY);
    doc.text("NexGeTech AI Pre-Sales Copilot", M, 10);
    doc.text(intake.client.companyName, W - M, 10, { align: "right" });
    doc.setDrawColor(...CYAN);
    doc.setLineWidth(0.3);
    doc.line(M, 12, W - M, 12);
  };

  const footer = () => {
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREY);
    doc.text(
      `Confidential — ${intake.client.companyName}`,
      M,
      H - 8
    );
    doc.text(`${page}`, W - M, H - 8, { align: "right" });
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > H - M - 5) newPage();
  };

  const sectionHeading = (num: string, title: string) => {
    ensureSpace(20);
    toc.push({ title: `${num}  ${title}`, page });

    // accent bar
    doc.setFillColor(...CYAN);
    doc.rect(M, y, 3, 10, "F");

    // number
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...CYAN);
    doc.text(num, M + 6, y + 4);

    // title
    doc.setFontSize(14);
    doc.setTextColor(...INK);
    doc.text(title, M + 6, y + 9.5);

    y += 14;
    doc.setDrawColor(220, 226, 232);
    doc.setLineWidth(0.2);
    doc.line(M, y, W - M, y);
    y += 5;
    doc.setFont("helvetica", "normal");
  };

  const paragraph = (text: string, opts?: { size?: number; color?: [number, number, number]; indent?: number }) => {
    const size = opts?.size ?? 10;
    const color = opts?.color ?? INK;
    const indent = opts?.indent ?? 0;
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, W - M * 2 - indent);
    for (const line of lines) {
      ensureSpace(5);
      doc.text(line, M + indent, y);
      y += 5;
    }
    y += 2;
  };

  const subheading = (text: string) => {
    ensureSpace(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.text(text, M, y);
    y += 6;
    doc.setFont("helvetica", "normal");
  };

  const bullets = (items: string[], opts?: { symbol?: string; size?: number }) => {
    const symbol = opts?.symbol ?? "\u2022";
    const size = opts?.size ?? 9.5;
    doc.setFontSize(size);
    doc.setFont("helvetica", "normal");
    items.forEach((item) => {
      const lines = doc.splitTextToSize(item, W - M * 2 - 8);
      lines.forEach((line: string, i: number) => {
        ensureSpace(5);
        if (i === 0) {
          doc.setTextColor(...CYAN);
          doc.text(symbol, M + 2, y);
          doc.setTextColor(...INK);
          doc.text(line, M + 8, y);
        } else {
          doc.setTextColor(...INK);
          doc.text(line, M + 8, y);
        }
        y += 5;
      });
      y += 1;
    });
    y += 2;
  };

  const table = (
    headers: string[],
    rows: string[][],
    colWidths: number[],
    opts?: { headerSize?: number; cellSize?: number }
  ) => {
    const hSize = opts?.headerSize ?? 8.5;
    const cSize = opts?.cellSize ?? 9;
    const totalW = colWidths.reduce((a, b) => a + b, 0);
    const rowH = 8;

    ensureSpace(12 + rows.length * rowH + 5);

    // header row
    let x = M;
    doc.setFillColor(...NAVY);
    doc.rect(M, y, totalW, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(hSize);
    doc.setTextColor(...WHITE);
    headers.forEach((h, i) => {
      doc.text(h, x + 3, y + 6.5);
      x += colWidths[i];
    });
    y += 10;

    // data rows
    doc.setFont("helvetica", "normal");
    doc.setFontSize(cSize);
    rows.forEach((row, ri) => {
      ensureSpace(rowH + 2);

      // alternating row bg
      if (ri % 2 === 0) {
        doc.setFillColor(...LIGHT_GREY);
        doc.rect(M, y, totalW, rowH, "F");
      }

      x = M;
      row.forEach((cell, ci) => {
        const maxW = colWidths[ci] - 6;
        const cellLines = doc.splitTextToSize(cell || "\u2014", maxW);
        doc.setTextColor(...INK);
        doc.text(cellLines[0] || "\u2014", x + 3, y + 5.5);
        x += colWidths[ci];
      });
      y += rowH;
    });
    y += 5;
  };

  const divider = () => {
    ensureSpace(8);
    doc.setDrawColor(220, 226, 232);
    doc.setLineWidth(0.15);
    doc.line(M, y, W - M, y);
    y += 5;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // COVER PAGE
  // ═══════════════════════════════════════════════════════════════════════

  // full navy background
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, H, "F");

  // cyan accent bar at top
  doc.setFillColor(...CYAN);
  doc.rect(0, 0, W, 4, "F");

  // company name
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...CYAN);
  doc.text("NEXGETECH", M, 25);

  doc.setFontSize(8);
  doc.setTextColor(140, 160, 180);
  doc.text("AI PRE-SALES COPILOT", M, 32);

  // horizontal rule
  doc.setDrawColor(...CYAN);
  doc.setLineWidth(0.5);
  doc.line(M, 38, W - M, 38);

  // document type
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(140, 160, 180);
  doc.text("PROJECT PROPOSAL & SCOPE DOCUMENT", M, 48);

  // client name (big)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(...WHITE);
  const clientName = intake.client.companyName || "Client";
  const nameLines = doc.splitTextToSize(clientName, W - M * 2);
  doc.text(nameLines, M, 90);

  // industry + services line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...CYAN);
  const meta = [
    intake.client.industry,
    intake.services.selected.join(" · "),
  ]
    .filter(Boolean)
    .join("  |  ");
  doc.text(meta || "Project Proposal", M, 105);

  // cyan divider
  doc.setFillColor(...CYAN);
  doc.rect(M, 115, 60, 0.8, "F");

  // details block
  doc.setFontSize(9);
  doc.setTextColor(180, 195, 215);
  const details: [string, string][] = [
    ["Prepared for", intake.client.contactPerson || "\u2014"],
    ["Company", intake.client.companyName || "\u2014"],
    ["Region", intake.client.region || "\u2014"],
    ["Budget Range", intake.client.budgetRange || "\u2014"],
    [
      "Date",
      new Date(proposal.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    ],
    ["Version", `v${p.version}`],
  ];

  let detailY = 125;
  details.forEach(([label, value]) => {
    doc.setTextColor(120, 140, 165);
    doc.text(label.toUpperCase(), M, detailY);
    doc.setTextColor(...WHITE);
    doc.text(value, M + 45, detailY);
    detailY += 8;
  });

  // score badge
  doc.setDrawColor(...CYAN);
  doc.setLineWidth(0.6);
  doc.circle(W - 35, 220, 18);
  doc.setFontSize(7);
  doc.setTextColor(...CYAN);
  doc.text("READINESS", W - 35, 217, { align: "center" });
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text(`${p.completeness.overall}%`, W - 35, 224, { align: "center" });

  // bottom bar
  doc.setFillColor(...CYAN);
  doc.rect(0, H - 4, W, 4, "F");

  // ═══════════════════════════════════════════════════════════════════════
  // TABLE OF CONTENTS
  // ═══════════════════════════════════════════════════════════════════════

  newPage();
  const tocPageIndex = page;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...INK);
  doc.text("Table of Contents", M, y + 5);
  y += 14;

  doc.setFillColor(...CYAN);
  doc.rect(M, y, 40, 0.6, "F");
  y += 8;

  // ═══════════════════════════════════════════════════════════════════════
  // CONTENT
  // ═══════════════════════════════════════════════════════════════════════

  newPage();

  // 01 — Executive Summary
  sectionHeading("01", "Executive Summary");
  paragraph(p.executiveSummary);

  // 02 — Problem Statement
  sectionHeading("02", "Problem Statement");
  paragraph(p.problemStatement);

  // 03 — Proposed Solution
  sectionHeading("03", "Proposed Solution");
  paragraph(p.proposedSolution);

  // 04 — Scope
  newPage();
  sectionHeading("04", "Project Scope");

  subheading("In Scope");
  bullets(p.scopeIn, { symbol: "\u2713", size: 9.5 });

  divider();

  subheading("Out of Scope");
  bullets(p.scopeOut, { symbol: "\u2717", size: 9.5 });

  // 05 — Deliverables
  sectionHeading("05", "Deliverables");
  bullets(p.deliverables);

  // 06 — Assumptions
  sectionHeading("06", "Assumptions");
  bullets(p.assumptions);

  // 07 — Risks
  newPage();
  sectionHeading("07", "Risks & Dependencies");
  table(
    ["Risk", "Impact", "Likelihood"],
    p.risks.map((r) => [r.risk, r.impact, r.likelihood]),
    [95, 55, 20]
  );

  // 08 — Scope Creep
  sectionHeading("08", "Scope Creep Assessment");

  // risk level badge
  const riskColor =
    p.scopeCreep.riskLevel === "High"
      ? [220, 38, 38]
      : p.scopeCreep.riskLevel === "Medium"
      ? [234, 179, 8]
      : [34, 197, 94];
  doc.setFillColor(...(riskColor as [number, number, number]));
  doc.roundedRect(M, y, 30, 7, 1.5, 1.5, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text(p.scopeCreep.riskLevel.toUpperCase(), M + 15, y + 5, {
    align: "center",
  });
  y += 12;

  paragraph(p.scopeCreep.recommendation);
  if (p.scopeCreep.reasons.length > 0) {
    subheading("Reasons");
    bullets(p.scopeCreep.reasons);
  }
  if (p.scopeCreep.phasingSuggestion && p.scopeCreep.phasingSuggestion.length > 0) {
    subheading("Suggested Phasing");
    p.scopeCreep.phasingSuggestion.forEach((phase) => {
      ensureSpace(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...DARK);
      doc.text(phase.phase, M + 4, y);
      y += 5;
      bullets(phase.features, { symbol: "\u25B8", size: 9 });
    });
  }

  // 09 — Timeline
  newPage();
  sectionHeading("09", "Estimated Timeline");
  table(
    ["Phase", "Duration", "Description"],
    p.timeline.map((t) => [t.phase, t.duration, t.description]),
    [40, 25, 105]
  );

  // 10 — Team
  sectionHeading("10", "Recommended Team");
  table(
    ["Role", "Allocation"],
    p.team.map((t) => [t.role, `${t.allocation}%`]),
    [130, 40]
  );

  // 11 — Architecture
  newPage();
  sectionHeading("11", "Recommended Architecture");

  subheading("Technology Stack");
  bullets(p.architecture.stack);

  subheading("Why This Stack");
  bullets(p.architecture.reasoning);

  // 12 — Competitor Benchmark
  sectionHeading("12", "Competitor Feature Benchmark");
  bullets(p.competitorFeatures);

  // 13 — Pricing
  newPage();
  sectionHeading("13", "Pricing Packages");

  // pricing cards
  p.pricing.forEach((pk) => {
    ensureSpace(30);
    const isRecommended = pk.name === p.recommendedPackage;

    // card bg
    doc.setFillColor(isRecommended ? 240 : 248, isRecommended ? 253 : 250, isRecommended ? 255 : 252);
    doc.roundedRect(M, y, W - M * 2, 8 + pk.includes.length * 5 + 6, 2, 2, "F");

    if (isRecommended) {
      doc.setFillColor(...CYAN);
      doc.roundedRect(M, y, W - M * 2, 8 + pk.includes.length * 5 + 6, 2, 2, "S");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...CYAN);
      doc.text("RECOMMENDED", W - M - 2, y + 5, { align: "right" });
    }

    // package name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(pk.name, M + 4, y + 7);

    // price
    doc.setFontSize(11);
    doc.setTextColor(...CYAN);
    doc.text(pk.priceRange, M + 50, y + 7);

    y += 12;

    // includes
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    pk.includes.forEach((item) => {
      doc.setTextColor(...GREY);
      doc.text(`  \u2022  ${item}`, M + 6, y);
      y += 5;
    });
    y += 5;
  });

  // recommendation note
  divider();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text(`Recommended: ${p.recommendedPackage}`, M, y);
  y += 5;
  paragraph(p.recommendedPackageReason, { size: 9.5, color: GREY });

  // 14 — ROI
  newPage();
  sectionHeading("14", "Projected ROI");
  paragraph(p.roi.narrative);
  divider();

  const roiItems: [string, string][] = [
    ["Current estimated cost", p.roi.currentCostEstimate],
    ["Projected cost after", p.roi.projectedCostAfter],
    ["Estimated annual savings", p.roi.estimatedAnnualSavings],
    ["Operational efficiency gain", p.roi.operationalEfficiencyGainPct],
  ];

  roiItems.forEach(([label, value]) => {
    ensureSpace(10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text(label, M + 4, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text(value, M + 70, y);
    y += 8;
  });

  // 15 — Signature
  newPage();
  sectionHeading("15", "Acceptance & Signature");
  paragraph(
    "By signing below, both parties agree to proceed under the scope, timeline, and pricing outlined in this proposal. Any changes to scope will be handled via a formal change request.",
    { size: 10, color: GREY }
  );
  y += 20;

  // signature lines
  doc.setDrawColor(...GREY);
  doc.setLineWidth(0.4);

  doc.line(M, y, M + 70, y);
  doc.line(W - M - 70, y, W - M, y);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY);
  doc.text("Client Signature / Date", M, y + 6);
  doc.text("NexGeTech Representative / Date", W - M - 70, y + 6);

  y += 16;
  doc.setFontSize(7);
  doc.setTextColor(180, 190, 200);
  doc.text(
    "This proposal is valid for 30 days from the date above.",
    M,
    y
  );

  // ═══════════════════════════════════════════════════════════════════════
  // FILL TABLE OF CONTENTS
  // ═══════════════════════════════════════════════════════════════════════

  doc.setPage(tocPageIndex);
  y = M + 20;

  toc.forEach((t) => {
    ensureSpace(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text(t.title, M + 2, y);

    // dotted leader
    const titleW = doc.getTextWidth(t.title);
    const pageNumW = doc.getTextWidth(`${t.page}`);
    const dotsStart = M + 2 + titleW + 3;
    const dotsEnd = W - M - pageNumW - 3;
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(8);
    let dotX = dotsStart;
    while (dotX < dotsEnd) {
      doc.text(".", dotX, y);
      dotX += 2;
    }

    doc.setFontSize(10);
    doc.setTextColor(...GREY);
    doc.text(`${t.page}`, W - M, y, { align: "right" });
    y += 8;
  });

  // ── save ──────────────────────────────────────────────────────────────

  const fileName = `${intake.client.companyName.replace(/\s+/g, "_") || "proposal"}_NexGeTech.pdf`;
  doc.save(fileName);
}
