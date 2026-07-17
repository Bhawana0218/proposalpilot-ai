# Architecture Overview — ProposalPilot AI

## System diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (client)                        │
│                                                                   │
│  Wizard steps (React, App Router)                                │
│  StepClient → StepGoals → StepServices → StepDiscovery           │
│                                                                   │
│         all driven by a single Zustand store (lib/store.ts)      │
│                          │                                        │
│         ┌────────────────┼─────────────────┐                     │
│         ▼                ▼                 ▼                     │
│  POST /api/          POST /api/       POST /api/                 │
│  discovery-questions  generate-proposal proposal-chat            │
└─────────┼────────────────┼─────────────────┼─────────────────────┘
          │                │                 │
          ▼                ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER (API routes)                   │
│                                                                   │
│  lib/prompts.ts   — all prompt templates, one source of truth    │
│  lib/anthropic.ts — shared Claude client + JSON-safe wrapper     │
│                                                                   │
└─────────┼─────────────────────────────────────────────────────────┘
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Anthropic API (Claude)                        │
│         claude-sonnet-4-5-20250929, structured JSON output       │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼ (proposal JSON returned to browser)
┌─────────────────────────────────────────────────────────────────┐
│  ProposalDocument.tsx renders:                                   │
│    - CompletenessMeter, ScopeCreepAlert, InternalSalesPanel       │
│    - the dossier itself (executive summary → signature block)    │
│    - ChatAssistant (re-queries /api/proposal-chat per question)  │
│                                                                   │
│  PdfExportButton → lib/pdf-generator.ts (jsPDF, client-side,      │
│  no network call — builds the PDF from the same JSON in memory)  │
└─────────────────────────────────────────────────────────────────┘
```

## Why a single large generation call instead of many small ones

An earlier design considered one Claude call per section (executive summary,
scope, timeline, pricing, etc.) so each could be regenerated independently.
That was rejected: sections in a real proposal are not independent — the
recommended pricing tier has to agree with the timeline, which has to agree
with the requested services and company size, which has to agree with the
scope-creep assessment. Generating them in one structured call with a single
shared context keeps those numbers consistent. The tradeoff is regeneration
granularity (you regenerate the whole document, not one section) — noted as
a known limitation, and solvable later with partial-regeneration prompts
that pass the existing document back in as context to keep everything else
fixed.

## Why the discovery step is a separate call from generation

The discovery questions need to exist *before* the client has answered them,
so they can't be generated in the same call that consumes the answers. This
also means the discovery agent only ever sees the raw intake, not the
eventual proposal — keeping its questions genuinely about gaps rather than
justifications for an answer that already exists.

## State management

No database. State lives in:
- `lib/store.ts` (Zustand) for the in-progress wizard, only for the current
  browser session
- The returned `Proposal` object, which is the entire source of truth for
  the preview screen, the PDF export, and the chat assistant — nothing is
  re-fetched or re-derived after generation, so "what you see is what
  exports"

This was a deliberate scope cut for the 72-hour window. See README.md → "What
I'd build next" for the persistence layer (Postgres + Prisma) that would
replace this in a real multi-user product.

## PDF generation approach

`lib/pdf-generator.ts` builds the PDF with `jsPDF`'s text/table primitives
directly from the `Proposal` object — not via `html2canvas` screenshotting
the DOM. This was chosen deliberately over the more common
screenshot-to-PDF approach because it produces selectable text, correctly
paginates long content (risk tables, timelines) across page breaks, and
keeps file size small. The cost is more manual layout code (see the
`heading` / `paragraph` / `bullets` / `table` helpers), which was judged
worth it for output quality.

## Security notes

- `ANTHROPIC_API_KEY` is read server-side only (`lib/anthropic.ts`, no
  `NEXT_PUBLIC_` prefix) and is never sent to the browser.
- All three AI routes validate/trust only what the client sends as intake
  data; there's no user-generated content executed or rendered as HTML
  (React's default escaping handles this), so there's no injection surface
  from a malicious "company name" field, for example.
