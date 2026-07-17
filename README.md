# ProposalPilot AI

**An AI-powered presales copilot that turns client requirements into professional project proposals, scope documents, timelines, and service recommendations in minutes.**

Built for the NexGeTech AI Application Developer Internship technical assessment.

**→ [PRODUCT_STRATEGY.md](./PRODUCT_STRATEGY.md)** — the enterprise product vision, personas, feature roadmap, AI workflow architecture, database schema, revenue model, and investor positioning for where this product goes beyond the assessment. Worth reading if you want to see the product thinking behind the code, not just the code.

> Positioning: not "a proposal generator" — a presales consultant in software form. It interviews the client the way a human account manager would, flags scope creep before it becomes a delivery problem, and produces a document good enough to actually send.

---

## Why this isn't just a form + a prompt

The brief asked for a form, an AI call, a proposal, and a PDF. Most submissions will stop there. ProposalPilot adds the parts of presales that are usually invisible and hardest to fake convincingly:

| Feature | What it does | Why it matters |
|---|---|---|
| **AI Discovery Interview Agent** | Before generating anything, Claude reviews the intake and asks 3–5 follow-up questions that would genuinely change scope or cost | Mimics how a real consultant runs a discovery call instead of jumping straight to output |
| **Scope Creep Detector** | Flags when requested services/goals imply broad, multi-system work and proposes a phased delivery plan | Real agencies do this manually to protect margins |
| **Proposal Completeness Score** | Scores business goals, technical requirements, budget clarity, and timeline expectations (0–100) individually, not just an overall number | Tells the account manager exactly what's still missing |
| **AI Architecture Recommendation** | Recommends a stack with reasoning tied to the client's actual requirements | Shows engineering judgment, not templated tech |
| **Proposal Chat Assistant** | Ask the generated proposal "why is this 14 weeks?" and get an answer grounded in the proposal's own numbers | Turns a static document into something defensible in a client call |
| **Internal Sales Panel** | Deal-win probability + proposal quality score, marked clearly as internal-only | Salesforce-style signal that never leaks to the client-facing document |
| **ROI Forecast** | Estimated cost before/after, annual savings, efficiency gain | Makes the business case, not just the technical one |
| **Client Personality Detection** | Classifies the client (Startup Founder / Enterprise / Technical Founder / Non-Technical) and lets that shape the AI's framing | The same features get pitched differently to a founder vs. an enterprise buyer |
| **Professional PDF Export** | Cover page, table of contents, styled sections, signature block — built with `jsPDF` directly (no screenshot-based export) | The PDF looks like something a client could actually receive, not a printed webpage |

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand for wizard state
- **AI:** Anthropic Claude (`@anthropic-ai/sdk`), server-side only, via three purpose-built API routes
- **PDF:** `jspdf`, generated programmatically (text/table layout, not `html2canvas` screenshots) for print-quality, selectable-text output
- **No database** — this is a stateless single-session tool by design; see [ARCHITECTURE.md](./ARCHITECTURE.md) for how it could grow one

---

## Getting started

```bash
npm install
cp .env.example .env.local
# add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Product flow

```
Client Info → Business Goals → Requested Services
    → AI Discovery Interview (dynamic questions)
    → AI Proposal Generation
    → Proposal Preview (dossier + intelligence panels + chat)
    → Export PDF
```

Each step is a screen in `app/page.tsx`, driven by a single Zustand store (`lib/store.ts`) so state survives step navigation without prop drilling.

---

## AI tools and prompts used

All prompt engineering lives in **`lib/prompts.ts`** — this is the file to read to understand the AI design.

1. **`DISCOVERY_SYSTEM_PROMPT`** (used by `/api/discovery-questions`)
   Frames Claude as a discovery-call consultant. Explicitly instructed to skip anything already answered and prioritize questions that change scope/cost/timeline over generic ones. Forced JSON output: `{ "questions": string[] }`.

2. **`PROPOSAL_SYSTEM_PROMPT`** (used by `/api/generate-proposal`)
   The core prompt. This is a single large structured-output call rather than many small calls — deliberately, so every section (summary, scope, risks, timeline, team, architecture, pricing, ROI, scope-creep assessment, completeness score, quality score, deal probability) is generated with full awareness of every other section, so the numbers stay internally consistent (e.g. the recommended package actually matches the stated budget range, and the timeline actually matches the requested services). The prompt encodes explicit rules against generic filler, against defaulting completeness to a high score, and for grounding scope-creep risk in the actual number/breadth of services requested.

3. **`CHAT_SYSTEM_PROMPT`** (used by `/api/proposal-chat`)
   A grounded Q&A prompt — the full generated proposal JSON is passed as context on every turn (Claude is stateless between requests, so state is re-sent each time per the completions-API pattern), and the model is explicitly told not to invent scope or numbers that contradict what's already in the document.

All three routes share `askClaudeForJSON()` / the raw `anthropic.messages.create()` call in `lib/anthropic.ts`, which centralizes model selection, JSON-fence stripping, and error handling so prompt logic never has to touch API plumbing.

**Model used:** `claude-sonnet-4-5-20250929`, called server-side only — the API key never reaches the browser.

---

## What I'd build next with more time

- Persist proposals (Postgres + Prisma) so "Proposal Versioning" is a real diff between saved versions, not just an in-session array
- Auth + multi-user workspaces so this is usable by an actual sales team, not a single browser session
- A client-facing share link (read-only view of the dossier) instead of only a downloadable PDF
- Real competitor benchmarking backed by a search tool call instead of model knowledge alone
- Streaming the proposal generation section-by-section instead of one blocking call, so the UI can show sections as they complete

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full system diagram and these tradeoffs in more detail.
