import jsPDF from "jspdf";
import { Proposal } from "./types";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CYAN = "#00C2FF";
const NAVY = "#0F172A";
const TEXT = "#E2E8F0";

export function generateProposalPDF(proposal: Proposal) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const { intake, document: p } = proposal;
  let y = MARGIN;
  let page = 1;
  const toc: { title: string; page: number }[] = [];

  const newPage = () => {
    doc.addPage();
    page++;
    y = MARGIN;
    footer();
  };

  const footer = () => {
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`NexGeTech AI · ${intake.client.companyName}`, MARGIN, PAGE_H - 10);
    doc.text(`${page}`, PAGE_W - MARGIN, PAGE_H - 10, { align: "right" });
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN - 5) newPage();
  };

  const heading = (title: string) => {
    ensureSpace(16);
    toc.push({ title, page });
    doc.setFillColor(CYAN);
    doc.rect(MARGIN, y, 8, 1.2, "F");
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(TEXT);
    doc.text(title, MARGIN, y);
    y += 8;
    doc.setFont("helvetica", "normal");
  };

  const paragraph = (text: string, size = 10.5) => {
    doc.setFontSize(size);
    doc.setTextColor(TEXT);
    const lines = doc.splitTextToSize(text, PAGE_W - MARGIN * 2);
    for (const line of lines) {
      ensureSpace(6);
      doc.text(line, MARGIN, y);
      y += 5.6;
    }
    y += 3;
  };

  const bullets = (items: string[], symbol = "•") => {
    doc.setFontSize(10.5);
    doc.setTextColor(TEXT);
    items.forEach((item) => {
      const lines = doc.splitTextToSize(item, PAGE_W - MARGIN * 2 - 6);
      lines.forEach((line: string, i: number) => {
        ensureSpace(6);
        doc.text(i === 0 ? `${symbol}  ${line}` : `   ${line}`, MARGIN, y);
        y += 5.6;
      });
    });
    y += 3;
  };

  const table = (headers: string[], rows: string[][], colWidths: number[]) => {
    ensureSpace(10 + rows.length * 7);
    let x = MARGIN;
    doc.setFillColor(NAVY);
    doc.setTextColor(255);
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.rect(MARGIN, y, colWidths.reduce((a, b) => a + b, 0), 8, "F");
    headers.forEach((h, i) => {
      doc.text(h, x + 2, y + 5.5);
      x += colWidths[i];
    });
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(TEXT);
    rows.forEach((row, ri) => {
      ensureSpace(8);
      if (ri % 2 === 0) {
        doc.setFillColor(20, 30, 50);
        doc.rect(MARGIN, y, colWidths.reduce((a, b) => a + b, 0), 7.5, "F");
      }
      x = MARGIN;
      row.forEach((cell, i) => {
        const lines = doc.splitTextToSize(cell, colWidths[i] - 4);
        doc.text(lines[0] || "", x + 2, y + 5.2);
        x += colWidths[i];
      });
      y += 7.5;
    });
    y += 5;
  };

  // ---------- COVER PAGE ----------
  doc.setFillColor(NAVY);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  doc.setFillColor(CYAN);
  doc.rect(0, 130, PAGE_W, 1.2, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("NEXGETECH", MARGIN, 40);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180);
  doc.text("PROJECT PROPOSAL & SCOPE DOCUMENT", MARGIN, 47);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255);
  const titleLines = doc.splitTextToSize(
    `${intake.client.companyName}`,
    PAGE_W - MARGIN * 2
  );
  doc.text(titleLines, MARGIN, 115);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(CYAN as any);
  doc.text("Prepared by NexGeTech · AI Pre-Sales Copilot", MARGIN, 145);

  doc.setFontSize(9.5);
  doc.setTextColor(190);
  doc.text(`Industry: ${intake.client.industry || "—"}`, MARGIN, 165);
  doc.text(`Prepared for: ${intake.client.contactPerson || "—"}`, MARGIN, 172);
  doc.text(
    `Date: ${new Date(proposal.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    MARGIN,
    179
  );
  doc.text(`Proposal version: v${p.version}`, MARGIN, 186);
  doc.text(`Proposal Score: ${p.proposalScore}/100`, MARGIN, 193);

  doc.setDrawColor(CYAN as any);
  doc.setLineWidth(0.4);
  doc.circle(PAGE_W - 40, 250, 16);
  doc.setFontSize(8);
  doc.setTextColor(CYAN as any);
  doc.text("READINESS", PAGE_W - 40, 248, { align: "center" });
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`${p.completeness.overall}%`, PAGE_W - 40, 255, { align: "center" });

  // ---------- TOC PLACEHOLDER ----------
  newPage();
  const tocPageIndex = page;
  y += 10;

  // ---------- CONTENT ----------
  newPage();
  heading("Executive Summary");
  paragraph(p.executiveSummary);

  heading("Problem Statement");
  paragraph(p.problemStatement);

  heading("Proposed Solution");
  paragraph(p.proposedSolution);

  newPage();
  heading("Project Scope — In Scope");
  bullets(p.scopeIn, "✓");
  heading("Project Scope — Out of Scope");
  bullets(p.scopeOut, "✕");

  heading("Deliverables");
  bullets(p.deliverables);

  heading("Assumptions");
  bullets(p.assumptions);

  newPage();
  heading("Risks & Dependencies");
  table(
    ["Risk", "Impact", "Likelihood"],
    p.risks.map((r) => [r.risk, r.impact, r.likelihood]),
    [90, 60, 20]
  );

  heading("Scope Creep Assessment");
  paragraph(`Risk level: ${p.scopeCreep.riskLevel}. ${p.scopeCreep.recommendation}`);
  bullets(p.scopeCreep.reasons);

  newPage();
  heading("Estimated Timeline");
  table(
    ["Phase", "Duration", "Description"],
    p.timeline.map((t) => [t.phase, t.duration, t.description]),
    [35, 25, 110]
  );

  heading("Recommended Team");
  table(
    ["Role", "Allocation"],
    p.team.map((t) => [t.role, `${t.allocation}%`]),
    [130, 40]
  );

  newPage();
  heading("Recommended Architecture");
  bullets(p.architecture.stack);
  paragraph("Why this stack:");
  bullets(p.architecture.reasoning);

  heading("Competitor Feature Benchmark");
  bullets(p.competitorFeatures);

  newPage();
  heading("Pricing Packages");
  table(
    ["Package", "Estimated Cost", "Includes"],
    p.pricing.map((pk) => [pk.name, pk.priceRange, pk.includes.join(", ")]),
    [30, 35, 105]
  );
  paragraph(`Recommended package: ${p.recommendedPackage}`, 11.5);
  paragraph(p.recommendedPackageReason);

  heading("Projected ROI");
  paragraph(p.roi.narrative);
  bullets([
    `Current estimated cost: ${p.roi.currentCostEstimate}`,
    `Projected cost after: ${p.roi.projectedCostAfter}`,
    `Estimated annual savings: ${p.roi.estimatedAnnualSavings}`,
    `Operational efficiency gain: ${p.roi.operationalEfficiencyGainPct}`,
  ]);

  newPage();
  heading("Acceptance & Signature");
  paragraph(
    "By signing below, both parties agree to proceed under the scope, timeline, and pricing outlined in this proposal. Any changes to scope will be handled via a formal change request."
  );
  y += 15;
  doc.setDrawColor(180);
  doc.line(MARGIN, y, MARGIN + 70, y);
  doc.line(PAGE_W - MARGIN - 70, y, PAGE_W - MARGIN, y);
  doc.setFontSize(9);
  doc.text("Client Signature / Date", MARGIN, y + 6);
  doc.text("NexGeTech Representative / Date", PAGE_W - MARGIN - 70, y + 6);

  // ---------- FILL TOC ----------
  doc.setPage(tocPageIndex);
  y = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(TEXT);
  doc.text("Table of Contents", MARGIN, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  toc.forEach((t) => {
    doc.setTextColor(TEXT);
    doc.text(t.title, MARGIN, y);
    doc.setTextColor(120);
    doc.text(`${t.page}`, PAGE_W - MARGIN, y, { align: "right" });
    y += 8;
  });

  doc.save(
    `${intake.client.companyName.replace(/\s+/g, "_") || "proposal"}_NexGeTech.pdf`
  );
}
