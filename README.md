# NexGeTech AI Pre-Sales Copilot

**An intelligent business consultant that helps agencies create winning project proposals, scope documents, delivery plans, budgets, and sales insights in minutes.**

Built for the NexGeTech AI Application Developer Internship technical assessment.

> Not "a proposal generator" — a pre-sales consultant in software form. It interviews the client like a human account manager would, flags scope creep before it becomes a delivery problem, and produces a document good enough to actually send.

---

## Why This Isn't Just a Form + a Prompt

| Feature | What it does | Why it matters |
|---|---|---|
| **AI Discovery Interview Agent** | Before generating anything, Gemini reviews the intake and asks 2–6 follow-up questions that would genuinely change scope or cost | Mimics how a real consultant runs a discovery call |
| **Discovery Intelligence Metrics** | Scores Business Clarity, Technical Confidence, Scope Completeness, and Delivery Risk | Tells you exactly what's still unknown |
| **Consultant Insights** | Proactive observations like "authentication often increases scope by 15-20%" | Shows senior-level thinking, not templated output |
| **Scope Creep Detector** | Flags when requested services imply broad, multi-system work and proposes phasing | Real agencies do this to protect margins |
| **Proposal Health Score** | 0-100 score reflecting scope clarity, budget confidence, timeline realism | Quick quality signal |
| **Executive Dashboard** | Animated score rings, team size, duration, cost, ROI — all at a glance | Dashboard-grade visibility |
| **Interactive Timeline** | Animated vertical roadmap with phase nodes and duration badges | Visual delivery plan |
| **AI Architecture Recommendation** | Recommends a stack with reasoning tied to actual requirements | Shows engineering judgment |
| **Pricing Package Comparison** | Startup / Growth / Enterprise tiers with recommended highlight | Client-ready pricing |
| **Win Probability Prediction** | Predicts chance of client approval with reasoning | Internal sales signal |
| **ROI Projection** | Current cost vs. projected cost, annual savings, efficiency gains | Makes the business case |
| **Proposal Chat Assistant** | Ask "why is this 14 weeks?" and get an answer grounded in the proposal's numbers | Turns a static doc into something defensible |
| **Professional PDF Export** | Cover page, table of contents, styled sections, signature block | Looks like it came from a consulting firm |
| **Framer Motion Animations** | Page transitions, staggered reveals, hover effects, animated counters | Premium feel |

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, Framer Motion
- **AI:** Google Gemini (REST API, `gemini-2.5-flash-lite` with `gemini-2.0-flash` fallback), server-side only
- **PDF:** `jspdf`, generated programmatically (text/table layout, not screenshots)
- **Icons:** `lucide-react`
- **No database** — stateless single-session tool by design

---

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### How to Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `.env.local` as `GEMINI_API_KEY=your_key_here`

---

## Product Flow

```
DISCOVER          ANALYZE           ARCHITECT         GENERATE        PROPOSE
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐    ┌──────────┐
│ Business │     │ Review   │     │ AI asks  │     │ Gemini   │    │ Dashboard│
│ Context  │────▶│ captured │────▶│ 2-6 Qs   │────▶│ builds   │───▶│ + Chat   │
│ Goals    │     │ intake   │     │ + insights│    │ proposal │    │ + PDF    │
│ Services │     │          │     │          │     │          │    │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘    └──────────┘
```

Each step is driven by a single Zustand store (`lib/store.ts`). No prop drilling.

---

## AI Tools and Prompts Used

All prompt engineering lives in **`lib/prompts.ts`**.

### 1. `DISCOVERY_SYSTEM_PROMPT` (`/api/discovery-questions`)
Frames Gemini as a senior solutions architect conducting a discovery call. **Explicitly forbidden** from returning empty questions. Generates 2-6 questions plus completeness scores, consultant insights, and risk flags. Questions must impact scope, timeline, cost, team size, or architecture.

### 2. `PROPOSAL_SYSTEM_PROMPT` (`/api/generate-proposal`)
The core prompt. Single large structured-output call so every section (summary, scope, risks, timeline, team, architecture, pricing, ROI, scope-creep, completeness, quality, deal probability, budget estimate, win probability) is generated with full awareness of every other section — keeping numbers internally consistent.

### 3. `CHAT_SYSTEM_PROMPT` (`/api/proposal-chat`)
Grounded Q&A — the full proposal JSON is passed as context on every turn. The model is told not to invent scope or pricing that contradicts the document.

All routes share `askGeminiForJSON()` / `askGemini()` in `lib/gemini.ts`, which centralizes model selection (with automatic fallback), JSON-fence stripping, and error handling.

**Models used:** `gemini-2.5-flash-lite` (primary) with automatic fallback to `gemini-2.0-flash`. Called server-side only — the API key never reaches the browser.

---

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full system diagram, data flow, and design decisions.

---

## Project Structure

```
proposalpilot-ai/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Main page (dashboard orchestrator)
│   ├── globals.css             # Glass, orbs, glow effects
│   └── api/
│       ├── discovery-questions/ # AI discovery questions
│       ├── generate-proposal/   # AI proposal generation
│       └── proposal-chat/       # AI chat about proposals
├── components/
│   ├── AnimatedBackground.tsx   # Floating orbs background
│   ├── Sidebar.tsx              # Collapsible sidebar navigation
│   ├── DiscoverStep.tsx         # Business context + goals + services
│   ├── AnalyzeStep.tsx          # Intake review before AI
│   ├── DiscoveryChat.tsx        # AI discovery interview
│   ├── GeneratingScreen.tsx     # Storytelling loading screen
│   ├── ProposalDashboard.tsx    # Card-based proposal view
│   ├── ExecutiveDashboard.tsx   # Score rings + metrics
│   ├── InteractiveTimeline.tsx  # Animated roadmap
│   ├── GlassCard.tsx            # Reusable glass card
│   ├── AnimatedCounter.tsx      # Count-up animation
│   ├── ChatAssistant.tsx        # Proposal Q&A chat
│   ├── PdfExportButton.tsx      # PDF export trigger
│   ├── Motion.tsx               # Framer Motion wrappers
│   └── TypingEffect.tsx         # Typewriter text effect
├── lib/
│   ├── gemini.ts                # Gemini REST API client
│   ├── prompts.ts               # All AI prompts
│   ├── types.ts                 # TypeScript interfaces
│   ├── store.ts                 # Zustand state management
│   └── pdf-generator.ts         # jsPDF PDF builder
```

---

## What I'd Build Next

- Persist proposals (Postgres + Prisma) for real versioning
- Auth + multi-user workspaces for actual sales teams
- Client-facing share link (read-only dossier view)
- Real competitor benchmarking via search tool calls
- Streaming proposal generation section-by-section
- Voice discovery mode
