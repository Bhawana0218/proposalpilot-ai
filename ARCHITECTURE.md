# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                            │
│                                                                     │
│  ┌──────────────┐  ┌──────────────────────────────────────────────┐│
│  │   Zustand     │  │              React Components                ││
│  │   Store       │◀─┤  DiscoverStep → AnalyzeStep → DiscoveryChat ││
│  │  (state)      │  │  → GeneratingScreen → ProposalDashboard     ││
│  └──────┬───────┘  └──────────────────────────────────────────────┘│
│         │                                                           │
│         │  fetch()                                                  │
└─────────┼───────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Next.js API Routes (Server)                    │
│                                                                     │
│  POST /api/discovery-questions                                      │
│    └─ askGeminiForJSON() → DISCOVERY_SYSTEM_PROMPT                  │
│                                                                     │
│  POST /api/generate-proposal                                        │
│    └─ askGeminiForJSON() → PROPOSAL_SYSTEM_PROMPT                   │
│                                                                     │
│  POST /api/proposal-chat                                            │
│    └─ askGemini() → CHAT_SYSTEM_PROMPT                              │
│                                                                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           │  HTTPS (REST API)
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Google Gemini API                                 │
│                                                                     │
│  Primary: gemini-2.5-flash-lite                                     │
│  Fallback: gemini-2.0-flash                                         │
│                                                                     │
│  Auth: GEMINI_API_KEY (server-side only, never exposed to client)   │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Intake Collection (Client-Side Only)
```
User fills forms → Zustand store → IntakeState
```
No server calls. All data lives in browser memory.

### 2. AI Discovery
```
IntakeState → POST /api/discovery-questions → Gemini
  → DiscoveryResult { questions[], completeness, consultantInsights[], riskFlags[] }
```
Safety fallback: if Gemini returns 0 questions, 3 strategic defaults are injected.

### 3. Proposal Generation
```
IntakeState + DiscoveryAnswers → POST /api/generate-proposal → Gemini
  → GeneratedProposal (20+ fields, single coherent JSON)
```
Single large call (not per-section) so numbers stay internally consistent — price matches timeline, timeline matches scope.

### 4. Chat Q&A
```
GeneratedProposal + question → POST /api/proposal-chat → Gemini → answer
```
Stateless: full proposal JSON re-sent on every turn.

### 5. PDF Export
```
GeneratedProposal → jsPDF → PDF file (client-side only, no server)
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **Single large generation call** | Keeps all sections internally consistent (price ↔ timeline ↔ scope) |
| **Discovery separate from generation** | Asks questions BEFORE the proposal exists, preventing circular reasoning |
| **No database** | Session-scoped by design; Zustand in browser memory |
| **PDF from data, not DOM** | jsPDF against the Proposal object produces selectable text and proper pagination |
| **Server-side only AI keys** | `GEMINI_API_KEY` never reaches the client |
| **REST API, not SDK** | Avoids `@google/genai` dependency conflicts with Next.js 14 |
| **Automatic model fallback** | `gemini-2.5-flash-lite` → `gemini-2.0-flash` ensures availability |
| **Framer Motion** | Page transitions, stagger animations, hover effects for premium feel |

## Component Hierarchy

```
app/page.tsx
├── AnimatedBackground (fixed, always rendered)
├── Sidebar (fixed, collapsible, mobile-responsive)
└── AnimatePresence (page transitions)
    ├── DiscoverStep (forms: business context, goals, services)
    ├── AnalyzeStep (review + confirmation)
    ├── DiscoveryChat (AI interview + completeness radar + insights)
    ├── GeneratingScreen (storytelling loading)
    └── ProposalDashboard
        ├── ExecutiveDashboard
        │   ├── ScoreRing × 4 (SVG animated)
        │   └── MetricCard × 4
        ├── GlassCard × N (executive summary, scope, etc.)
        ├── InteractiveTimeline
        ├── Team composition (bar charts)
        ├── Architecture (stack pills + reasoning)
        ├── Pricing packages (3-column comparison)
        ├── ROI projection (4 metric cards)
        ├── Competitor benchmark
        ├── Missing information
        └── ChatAssistant
```

## State Management

Single Zustand store (`lib/store.ts`):
- `step`: Current wizard step (discover | analyze | architect | generating | propose)
- `intake`: Client info, goals, services, discovery answers
- `discoveryResult`: AI-generated questions, completeness scores, insights
- `proposal`: Generated proposal document
- `proposalHistory`: Array of past proposals (versioning)
- `isLoading`, `error`: UI state

No server state caching. No persistence. Session-scoped.

## Security

- API keys are server-side only (Next.js API routes)
- No client-side AI calls
- No authentication (scope cut for assessment timeline)
- `.env` is gitignored

## Scaling Considerations

- Add Postgres + Prisma for proposal persistence
- Add auth (NextAuth.js) for multi-user workspaces
- Add streaming for section-by-section generation
- Add Redis for rate limiting
- Add client-facing read-only proposal links
