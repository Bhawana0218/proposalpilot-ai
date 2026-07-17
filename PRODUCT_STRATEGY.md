# NexGeTech AI Pre-Sales Copilot — Product Strategy

*Written as a forward-looking product strategy document. For the current implementation, see README.md and ARCHITECTURE.md.*

---

## 1. Vision

**NexGeTech is the AI-native presales operating system for software and consulting agencies.**

Salesforce owns the pipeline. HubSpot owns the marketing funnel. Neither owns the highest-leverage, most error-prone 72 hours in the sales cycle: when a prospect's vague ask has to become a scoped, priced, defensible proposal. That work today is manual, inconsistent across account managers, disconnected from delivery reality, and invisible to leadership until a deal is already won or lost.

> Every proposal an agency sends should be as sharp as its best solutions architect's, as fast as a template, and as defensible as a consultant who has done this a thousand times — and leadership should see, in real time, which parts of the pipeline are healthy and which are quietly leaking margin.

**Category:** Presales Intelligence / AI Deal Desk — adjacent to CPQ (Salesforce), proposal tooling (PandaDoc, Qwilr), and revenue intelligence (Gong, Clari), but built for services businesses where the "product" being sold is scoped, not catalog-priced.

---

## 2. Who this is for

| Persona | Role | What they care about |
|---|---|---|
| **Priya — Presales Consultant** | Runs discovery calls, writes proposals daily | Speed without sounding templated. Wants to sound like a senior consultant on her 3rd year, not a chatbot. |
| **Marcus — VP of Sales / Agency Founder** | Owns revenue and margin | Pipeline health and win-rate drivers *before* deals close, not after. |
| **Elena — Delivery Lead** | Has to deliver whatever presales promised | Wants scope and timeline to be technically honest before it goes out, not discovered in sprint 1. |
| **James — Client Stakeholder** | Receiving the proposal | Wants clarity, not a wall of text. Wants to ask questions without booking another call. |

Four personas on purpose. A tool trying to serve everyone in an agency serves no one. These four map to the four moments the product touches: **write it, approve it, deliver it, receive it.**

---

## 3. What ships when (MoSCoW)

### Must have (largely built today)
- Multi-step intake (client / goals / services)
- AI Discovery Interview Agent
- AI proposal generation (summary, scope, risks, timeline, team, architecture, pricing, ROI)
- Scope Creep Detector with phasing suggestions
- Completeness Score
- Professional PDF export
- Role-based access (Presales / Delivery / Admin)
- Real proposal versioning with diffs

### Should have (what makes a VP pay for it)
- Client-facing shareable proposal portal with view tracking
- Pipeline dashboard (win rate, cycle time, revenue at risk)
- CRM sync (HubSpot / Salesforce)
- Margin Guardrail Engine (internal profitability check)
- Multi-agent QA / red-team pass before send
- Multi-currency and regional pricing norms

### Could have (later, not table stakes)
- Voice-based discovery (live call transcription → auto-filled intake)
- Win-rate learning loop calibrated on each agency's history
- Proposal A/B testing
- White-labeling for the client portal
- Industry-specific proposal templates

**What we're deliberately not building:** full CPQ catalog pricing, contract e-signature (integrate DocuSign instead), generic CRM. This stays a presales specialist.

---

## 4. The features that justify enterprise pricing

**Win-Rate Intelligence Engine**
Every closed deal feeds back into the system. Over time, the deal-probability score stops being a generic LLM prior and becomes calibrated on *this agency's* history — "proposals with a Growth-tier recommendation to Series-A fintech clients close at 61% here," not a guess.

**Margin Guardrail Engine**
Internal-only. Cross-references the AI's scope and pricing against the agency's cost baselines (team day-rates, historical actuals per phase) and flags proposals that look attractive on paper but would lose money. This is the feature that makes a VP of Sales say "I need this."

**Multi-Agent QA / Red-Team Reviewer**
Before a proposal goes out, a second AI pass — told to think like a skeptical delivery lead — checks the first pass: is 6 weeks realistic for this scope? Does team allocation match the timeline? Every proposal carries a visible "reviewed by QA agent" trail.

**Client-Facing Proposal Portal**
Replaces "email a PDF" with a trackable link. Which sections did the client actually read? How long did they spend on pricing? Did they open it at all? Turns the proposal from a one-way document into a signal.

**Voice-Enabled Discovery Copilot**
The Discovery Interview Agent extended to transcribe a real call and auto-populate the intake — so the AI follow-up questions happen live in the conversation, not as a form afterward.

---

## 5. UX direction

- **From wizard to workspace.** The five-step flow becomes the *creation* flow inside a persistent workspace with a Kanban view: Draft → Internal Review → Sent → Client Viewed → Won/Lost. The wizard makes one proposal; the workspace runs the whole presales motion.
- **Section-level regeneration.** "Just redo the timeline" or "make the executive summary punchier" — the rest stays fixed, passed as context.
- **Explainability everywhere.** Every AI-generated number gets a "why" affordance showing what drove it. Same grounding the Chat Assistant does, made ambient.
- **Inline review threads.** Delivery and sales comment directly on scope lines or risks before send, instead of that conversation happening in Slack.
- **Client-safe chat mode.** A version of the Proposal Chat on the shared portal, with internal-only data excluded.

---

## 6. Dashboard design

The VP's home screen — pipeline health at a glance.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  NexGeTech AI                                        Marcus ▾   [+ New]│
├─────────────────────────────────────────────────────────────────────────┤
│  Pipeline value        Win rate (30d)      Avg cycle time   Revenue at  │
│  $412,000               58% ▲ 6pts          2.3 days ▼       risk       │
│  ▲ 12% vs last month                                         $38,000   │
│                                                              (low       │
│                                                              complete.) │
├─────────────────────────────────────────────────────────────────────────┤
│  Pipeline                                                                  │
│  Draft(4)  Review(3)  Sent(6)  Viewed(2)  Won(9)  Lost(3)                │
│  ┌──────┐  ┌──────────┐  ┌─────┐  ┌──────────┐  ┌───┐  ┌───┐           │
│  │Acme  │  │Nimbus    │  │Vela │  │Northwind │  │...│  │...│           │
│  │68%   │  │92% ⚠     │  │Sent │  │4m pricing│  │   │  │   │           │
│  └──────┘  └──────────┘  └─────┘  └──────────┘  └───┘  └───┘           │
├─────────────────────────────────────────────────────────────────────────┤
│  Scope-creep flags              Margin Guardrail alerts                  │
│  ⚠ 3 flagged High risk          ⚠ 1 priced below cost baseline         │
│  → all had 4+ services          (Nimbus Retail, Growth tier)            │
└─────────────────────────────────────────────────────────────────────────┘
```

Leadership shouldn't have to open a single proposal to know where the pipeline is healthy.

---

## 7. AI workflow (expanded)

Today's three routes become a five-stage pipeline. Discovery and generation stay the same; QA and Margin sit between generation and send.

```
 ┌──────────────┐   ┌──────────────┐   ┌───────────────┐   ┌──────────────┐   ┌──────────────┐
 │  1. DISCOVERY │   │ 2. EXTRACTION │   │ 3. GENERATION │   │  4. QA /     │   │ 5. MARGIN    │
 │  AGENT        │──►│  & VALIDATION │──►│  AGENT        │──►│  RED-TEAM    │──►│  GUARDRAIL   │
 │               │   │  (intake      │   │  (one big     │   │  AGENT (new) │   │  AGENT (new) │
 │  asks 3-5     │   │  schema       │   │  structured   │   │              │   │              │
 │  follow-ups   │   │  checks —    │   │  call: scope, │   │  reads the   │   │  checks      │
 │  like a       │   │  catches      │   │  risk,        │   │  proposal as │   │  scope +     │
 │  consultant   │   │  contradictions│  │  timeline,    │   │  a skeptical │   │  price vs.   │
 │               │   │  before they   │   │  pricing,     │   │  delivery    │   │  the agency's│
 │               │   │  reach the AI) │   │  ROI          │   │  lead: real? │   │  cost base   │
 └──────────────┘   └──────────────┘   └───────────────┘   └──────────────┘   └──────────────┘
                                                 │                                       │
                                                 ▼                                       ▼
                                         stored as ProposalVersion  ──►  status: INTERNAL_REVIEW
                                                                                           │
                                                                            comments resolved,
                                                                            QA + Margin pass
                                                                                           ▼
                                                                                   status: SENT
                                                                                           │
                                                                                           ▼
                                                                             ┌──────────────────┐
                                                                             │ 6. PROPOSAL CHAT  │
                                                                             │ (internal full-   │
                                                                             │ context + client  │
                                                                             │ restricted view)  │
                                                                             └──────────────────┘
```

Stages 4 and 5 are what separate "generates a proposal" from "an agency can trust what it sends."

---

## 8. Database schema (future)

```prisma
model Organization {
  id            String   @id @default(cuid())
  name          String
  plan          String   // "starter" | "growth" | "enterprise"
  costBaselines Json?    // day-rates per role
  createdAt     DateTime @default(now())
  users         User[]
  clients       Client[]
  proposals     Proposal[]
}

model User {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  name           String
  email          String       @unique
  role           Role         // PRESALES | DELIVERY | ADMIN
  createdAt      DateTime     @default(now())
}

enum Role { PRESALES  DELIVERY  ADMIN }

model Client {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  companyName    String
  industry       String
  companySize    String
  region         String
  budgetRange    String
  contactPerson  String
  contactEmail   String?
  proposals      Proposal[]
}

model DiscoverySession {
  id          String   @id @default(cuid())
  proposalId  String
  proposal    Proposal @relation(fields: [proposalId], references: [id])
  questions   Json     // string[]
  answers     Json     // { question, answer }[]
  transcript  String?  // populated for voice discovery
  createdAt   DateTime @default(now())
}

model Proposal {
  id               String             @id @default(cuid())
  organizationId   String
  organization     Organization       @relation(fields: [organizationId], references: [id])
  clientId         String
  client           Client             @relation(fields: [clientId], references: [id])
  ownerId          String
  status           ProposalStatus     @default(DRAFT)
  currentVersionId String?
  discoverySessions DiscoverySession[]
  versions         ProposalVersion[]
  comments         Comment[]
  viewEvents       ProposalViewEvent[]
  createdAt        DateTime           @default(now())
}

enum ProposalStatus { DRAFT  INTERNAL_REVIEW  SENT  CLIENT_VIEWED  WON  LOST }

model ProposalVersion {
  id            String   @id @default(cuid())
  proposalId    String
  proposal      Proposal @relation(fields: [proposalId], references: [id])
  versionNumber Int
  document      Json     // full GeneratedProposal object
  qaReview      Json?    // red-team findings
  marginCheck   Json?    // margin guardrail output
  createdAt     DateTime @default(now())
}

model Comment {
  id         String   @id @default(cuid())
  proposalId String
  proposal   Proposal @relation(fields: [proposalId], references: [id])
  authorId   String
  sectionRef String   // e.g. "scopeIn[2]", "timeline[0]"
  body       String
  resolved   Boolean  @default(false)
  createdAt  DateTime @default(now())
}

model ProposalViewEvent {
  id         String   @id @default(cuid())
  proposalId String
  proposal   Proposal @relation(fields: [proposalId], references: [id])
  sectionRef String
  dwellMs    Int
  viewedAt   DateTime @default(now())
}
```

This is a direct evolution of `lib/types.ts` — `GeneratedProposal` becomes the JSON stored per version instead of living only in browser state.

---

## 9. Proposal lifecycle

```
Discovery Call
      │
      ▼
Draft (AI-generated, scored)
      │
      ▼
Internal Review  ──►  QA/Red-Team  ──►  Margin Guardrail
      │  (resolved, both pass)
      ▼
Sent  ──►  Client Portal (view-tracked)
      │
      ▼
Client Viewed  ──►  Chat / Negotiation
      │
      ├──► Won  ──► feeds Win-Rate Engine
      └──► Lost ──► feeds Win-Rate Engine (loss reason captured)
```

Every deal, win or lose, makes the next proposal's probability and pricing slightly more calibrated. That flywheel is the moat.

---

## 10. Revenue model

Seat-based SaaS + usage-based AI overage:

| Tier | Price | What's included |
|---|---|---|
| **Starter** | $49/seat/mo | Core wizard, AI generation, PDF export, Completeness Score — up to 15 proposals/mo |
| **Growth** | $149/seat/mo | + Client portal, Scope Creep Detector, Proposal Chat, CRM sync (1 integration), unlimited proposals |
| **Enterprise** | Custom | + Margin Guardrail, QA Agent, Win-Rate Intelligence, white-label portal, SSO |

Land with one presales team on Growth. Expand to Enterprise once the VP sees the dashboard and wants Margin Guardrail.

---

## 11. Roadmap

| Timeframe | Focus |
|---|---|
| **0–3 mo** | RBAC, real versioning, dashboard v1 |
| **3–9 mo** | Client portal + view tracking, CRM sync, QA agent, Margin Guardrail |
| **9–18 mo** | Win-Rate Intelligence (needs deal volume), voice discovery, white-label |

---

## 12. Metrics

**Usage**
- Time from intake start → sent proposal (target: under 20 min vs. 3–5 days typical)
- Completeness Score at send
- Chat Assistant engagement rate per proposal

**Business impact**
- Win-rate uplift vs. pre-adoption baseline
- Average deal size uplift
- Proposal cycle time reduction

**AI trust**
- QA Agent catch rate
- Scope-creep flags confirmed accurate by delivery

---

## 13. Positioning

**One-liner:** *"NexGeTech helps software agencies scope, price, and send proposals in minutes instead of days — and gets smarter about what wins with every deal."*

**Market:** Global IT/software services spend exceeds $1T annually. Agencies of 10–500 people are the volume segment, and presales tooling built for them barely exists — stuck between generic proposal tools (PandaDoc, Qwilr) with no domain intelligence, and enterprise CPQ (Salesforce) built for catalog pricing, not scoped services.

**Why now:** LLMs can do what only a senior solutions architect could a year ago — read a vague ask and produce a defensible scope, timeline, and price. Agencies are already doing this ad hoc in ChatGPT. Nobody has packaged it with the workflow, review, and accountability layer an agency actually needs to trust sending it.

**Wedge:** Land with proposal generation (fast, obviously valuable) → expand into the system of record for the whole presales pipeline once the dashboard and Margin Guardrail prove their worth.

**Moat:** Not the LLM call — anyone can prompt an AI for a proposal. The moat is the closed-loop win/loss data per agency, the QA trust layer, and the workflow lock-in.
