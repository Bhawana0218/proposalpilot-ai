# Architecture

## System diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Browser (Client)                           │
│                                                                     │
│  ┌──────────────┐  ┌──────────────────────────────────────────────┐│
│  │   Zustand     │  │              React Components                ││
│  │   Store       │◀─┤  DiscoverStep → AnalyzeStep → DiscoveryChat ││
│  │              │  │  → GeneratingScreen → ProposalDashboard     ││
│  └──────┬───────┘  └──────────────────────────────────────────────┘│
│         │                                                           │
│         │  fetch() / ReadableStream                                 │
└─────────┼───────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Next.js API Routes (Server)                     │
│                                                                     │
│  POST /api/discovery-questions                                      │
│    └─ askGroqForJSON() → DISCOVERY_SYSTEM_PROMPT                    │
│                                                                     │
│  POST /api/generate-proposal  (streamed)                            │
│    └─ askGroqStream() → PROPOSAL_SYSTEM_PROMPT                      │
│                                                                     │
│  POST /api/proposal-chat                                            │
│    └─ askGroq() → CHAT_SYSTEM_PROMPT                                │
│                                                                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           │  HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Groq API                                    │
│                                                                     │
│  Model: llama-3.3-70b-versatile                                     │
│  SDK: groq-sdk                                                      │
│                                                                     │
│  Auth: GROQ_API_KEY (server-side only)                              │
└─────────────────────────────────────────────────────────────────────┘
```

## Data flow

### 1. Intake (client-side only)

```
User fills forms → Zustand store → IntakeState
```

No server calls at this point. Everything stays in browser memory.

### 2. Discovery

```
IntakeState → POST /api/discovery-questions → Groq
  → { questions[], completeness, consultantInsights[], riskFlags[] }
```

If the AI returns fewer than 2 questions, the server injects fallback questions. This happened enough during testing that the safety net was necessary.

### 3. Proposal generation (streamed)

```
IntakeState + DiscoveryAnswers → POST /api/generate-proposal → Groq (stream: true)
  → ReadableStream → client accumulates tokens → parses final JSON
```

One big call, not per-section. This keeps numbers consistent — the pricing matches the timeline, the timeline matches the scope. Streaming means tokens show up as they're generated instead of waiting for the whole thing.

### 4. Chat

```
GeneratedProposal + question → POST /api/proposal-chat → Groq → answer
```

Full proposal JSON re-sent every turn. Stateless.

### 5. PDF export

```
GeneratedProposal → jsPDF → PDF (client-side, no server)
```

## Design decisions

| Decision | Why |
|---|---|
| Groq + llama-3.3-70b-versatile | Fast inference, free tier, no cold starts |
| Single generation call | Keeps sections internally consistent |
| Streaming | Tokens arrive in real time |
| Discovery before generation | Prevents circular reasoning |
| No database | Session-scoped, Zustand in browser memory |
| PDF from data, not DOM | Selectable text, proper pagination |
| Server-side API keys | Key never reaches the browser |
| Groq SDK over raw REST | Handles auth, streaming natively |
| Temperature 0.4 | Deterministic enough for structured output, creative enough for consultant voice |
| Framer Motion | Page transitions, stagger animations, hover effects |

## Component tree

```
app/page.tsx
├── AnimatedBackground (always rendered)
├── Sidebar (collapsible, mobile-responsive)
└── AnimatePresence (page transitions)
    ├── DiscoverStep (intake forms)
    ├── AnalyzeStep (review)
    ├── DiscoveryChat (AI interview)
    ├── GeneratingScreen (loading)
    └── ProposalDashboard
        ├── ExecutiveDashboard (score rings + metrics)
        ├── GlassCards (summary, scope, risks, etc.)
        ├── InteractiveTimeline
        ├── Team composition
        ├── Architecture
        ├── Pricing packages
        ├── ROI projection
        ├── Competitor benchmark
        └── ChatAssistant
```

## State

Single Zustand store (`lib/store.ts`):

- `step` — which screen we're on (discover / analyze / architect / generating / propose)
- `intake` — client info, goals, services, discovery answers
- `discoveryResult` — AI questions, completeness scores, insights
- `proposal` — the generated document
- `proposalHistory` — past proposals for versioning
- `isLoading`, `error` — UI state

No server-side caching. No persistence. Everything dies when the browser tab closes.

## Security

- API keys stay on the server (Next.js API routes)
- No client-side AI calls
- `.env` is gitignored

## If this went to production

- Postgres + Prisma for proposal persistence
- NextAuth for multi-user workspaces
- Redis for rate limiting
- Read-only client-facing proposal links
- Multi-round conversational discovery
