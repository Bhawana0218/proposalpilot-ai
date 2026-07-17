# NexGeTech AI Pre-Sales Copilot

An AI-powered pre-sales consultant for software agencies. It walks through a structured intake, asks discovery questions that a human account manager would ask, flags scope creep early, and generates a professional proposal with pricing, timeline, architecture, and ROI — all in a few minutes.

---

## What it actually does

Most "AI proposal generators" are just a form hooked up to a single prompt. This one has a few layers that make the output actually usable:

- **Discovery interview.** Before writing anything, the AI reviews the intake and comes back with 2-6 targeted follow-up questions — the kind that change scope, timeline, or cost. Things like "who handles QA?" or "are there existing APIs that need integration?" that you'd normally miss until sprint 3.
- **Completeness scoring.** Rates how well we understand the business goals, technical requirements, scope, and delivery risk. Gives you a quick read on what's still fuzzy.
- **Scope creep detection.** When someone asks for a chatbot + mobile app + analytics dashboard all at once, it flags that and suggests phasing instead of just inflating the price.
- **Proposal health score.** A 0-100 number that reflects how solid the proposal is — scope clarity, budget confidence, timeline realism. Internal only, never shown to the client.
- **Win probability.** Estimates the chance of the client saying yes, with reasoning. Again, internal only.
- **Proposal chat.** You can ask "why is development 14 weeks?" and get an answer grounded in the proposal's own numbers. Turns a static document into something you can actually defend in a client call.
- **PDF export.** Cover page, table of contents, signature block. Built with jsPDF against the data directly, not a screenshot of the page.

---

## Tech stack

| Layer | What | Why |
|---|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Zustand | Standard React stack, no surprises |
| Animations | Framer Motion | Page transitions, staggered reveals, hover effects |
| AI backend | Groq (`llama-3.3-70b-versatile`) | Fast inference, free tier, no cold starts |
| PDF | jsPDF | Client-side generation, selectable text |
| Icons | lucide-react | Lightweight, tree-shakeable |

No database. Stateless by design — everything lives in browser memory for the session.

---

## Getting started

```bash
npm install
cp .env.example .env.local
# add your GROQ_API_KEY to .env.local
npm run dev
```

Open http://localhost:3000.

### Getting a Groq API key

1. Go to https://console.groq.com
2. Sign up or log in
3. Go to API Keys → Create API Key
4. Copy it into `.env.local` as `GROQ_API_KEY=gsk_...`

---

## How it works

The app runs through five steps:

```
DISCOVER  →  ANALYZE  →  ARCHITECT  →  GENERATE  →  PROPOSE
  forms      review       AI chat      streaming     dashboard
                              ↓        generation       ↓
                          2-6 Qs                        chat + PDF
```

All state lives in a single Zustand store (`lib/store.ts`). No prop drilling, no context hell.

---

## Prompts

All prompt engineering is in `lib/prompts.ts`. Three prompts:

1. **Discovery prompt** — frames the AI as a senior solutions architect on a discovery call. Explicitly can't return empty questions. Has a few-shot example to anchor the format. Server-side fallback forces 3+ questions if the AI somehow returns fewer.

2. **Proposal prompt** — the big one. Single structured-output call so everything (summary, scope, risks, timeline, team, architecture, pricing, ROI, scope creep, completeness, deal probability) stays internally consistent. Price matches timeline, timeline matches scope.

3. **Chat prompt** — the full proposal JSON gets passed as context on every turn. The model is told not to invent scope or pricing that contradicts the document.

All routes go through `lib/groq.ts` which wraps the Groq SDK. The API key never leaves the server.

---

## Project structure

```
proposalpilot-ai/
├── app/
│   ├── layout.tsx              root layout, fonts
│   ├── page.tsx                main orchestrator
│   ├── globals.css             glass, orbs, glow CSS
│   └── api/
│       ├── discovery-questions/ AI discovery questions
│       ├── generate-proposal/   AI proposal generation (streamed)
│       └── proposal-chat/       AI chat about proposals
├── components/
│   ├── AnimatedBackground.tsx   floating orbs
│   ├── Sidebar.tsx              collapsible nav
│   ├── DiscoverStep.tsx         intake forms
│   ├── AnalyzeStep.tsx          intake review
│   ├── DiscoveryChat.tsx        AI interview + insights
│   ├── GeneratingScreen.tsx     loading screen
│   ├── ProposalDashboard.tsx    proposal view
│   ├── ExecutiveDashboard.tsx   score rings + metrics
│   ├── InteractiveTimeline.tsx  roadmap
│   ├── GlassCard.tsx            glass card wrapper
│   ├── AnimatedCounter.tsx      count-up animation
│   ├── ChatAssistant.tsx        proposal Q&A
│   ├── PdfExportButton.tsx      PDF export
│   ├── Motion.tsx               framer-motion helpers
│   └── TypingEffect.tsx         typewriter effect
├── lib/
│   ├── groq.ts                  Groq SDK client
│   ├── prompts.ts               all AI prompts
│   ├── types.ts                 TypeScript types
│   ├── store.ts                 Zustand store
│   └── pdf-generator.ts         jsPDF builder
```

---

## What's next

Things I'd want to build if this kept going:

- Persist proposals with Postgres + Prisma for versioning
- Auth and multi-user workspaces
- Client-facing share link (read-only view)
- Real competitor benchmarking
- Multi-round conversational discovery instead of one-shot
- Voice-based discovery mode
