# ProposalPilot AI — Enterprise Product Strategy

*Prepared as if for a Series A board deck. Companion to README.md and ARCHITECTURE.md, which cover the implementation as it stands today.*

---

## 1. Product Vision

**ProposalPilot AI is the AI-native presales operating system for software and consulting agencies.**

Salesforce owns the pipeline. HubSpot owns the marketing funnel. Neither owns the highest-leverage, most error-prone 72 hours in the entire sales cycle: the moment a prospect's vague ask has to become a scoped, priced, defensible proposal. That work today is manual, inconsistent across account managers, disconnected from delivery reality, and invisible to leadership until a deal is already won or lost.

**Vision statement:**
> Every proposal an agency sends should be as sharp as its best solutions architect's, as fast as a template, and as defensible as a consultant who has done this a thousand times — and leadership should be able to see, in real time, which parts of the pipeline are healthy and which are quietly leaking margin.

**Category:** Presales Intelligence / AI Deal Desk — adjacent to CPQ (Salesforce), proposal tooling (PandaDoc, Qwilr), and revenue intelligence (Gong, Clari), but purpose-built for services businesses where the "product" being sold is scoped, not catalog-priced.

---

## 2. User Personas

| Persona | Role | Core need | What they touch |
|---|---|---|---|
| **Priya — Presales Consultant** | Runs discovery calls, builds proposals daily | Speed without sounding templated; wants to sound like a senior consultant on her 3rd year of the job | Discovery Agent, proposal editor, chat assistant |
| **Marcus — VP of Sales / Agency Founder** | Owns revenue and margin | Visibility into pipeline health and win-rate drivers *before* deals close, not after | Dashboard, Margin Guardrail, win-rate analytics |
| **Elena — Delivery Lead / Solutions Architect** | Has to deliver whatever presales promises | Wants scope and timeline to be technically honest before it's sent, not discovered in sprint 1 | QA/Red-Team Agent output, architecture recommendations, scope-creep flags |
| **James — Client Stakeholder (external)** | Receiving the proposal | Wants clarity, not a wall of text; wants to ask questions without booking another call | Client-facing proposal portal, proposal chat (client-safe mode) |

Four personas, not eight — deliberately. A tool trying to serve everyone in an agency serves no one well; these four map to the four moments the product actually touches: **write it, approve it, deliver it, receive it.**

---

## 3. Feature Prioritization (MoSCoW)

### Must Have (ships the core loop — largely built today)
- Multi-step client intake (client / goals / services)
- AI Discovery Interview Agent
- AI proposal generation (summary, scope, risks, timeline, team, architecture, pricing, ROI)
- Scope Creep Detector with phasing suggestions
- Proposal Completeness Score
- Professional PDF export
- **[New]** Role-based access (Presales / Delivery / Admin) — a solo-session tool isn't an enterprise product
- **[New]** Real proposal versioning with diffs, not just an in-memory array

### Should Have (makes it a product a VP will pay for, not just a tool an intern uses)
- **[New]** Client-facing shareable proposal portal with view tracking
- **[New]** Pipeline dashboard (win rate, cycle time, revenue at risk)
- **[New]** CRM sync (HubSpot / Salesforce) so proposals aren't an island
- **[New]** Margin Guardrail Engine (internal-only profitability check)
- **[New]** Multi-agent QA / red-team pass before send
- Multi-currency and regional pricing norms

### Could Have (differentiators for later, not table stakes now)
- Voice-based discovery (live call transcription → auto-filled intake)
- Win-rate learning loop calibrated on each agency's own closed-deal history
- Proposal A/B testing (two framings sent to similar clients, tracked)
- White-labeling for agency branding on the client portal
- Marketplace of industry-specific proposal templates

**What was deliberately left out:** full CPQ-style catalog pricing, contract e-signature as a built-in (better to integrate DocuSign than rebuild it), and a generic CRM — this stays a presales specialist, not a bloated all-in-one.

---

## 4. Premium Differentiating Features (the features that justify Enterprise pricing)

**1. Win-Rate Intelligence Engine**
Every closed deal (won or lost) feeds back into the system. Over time, the deal-probability score stops being a generic LLM prior and becomes calibrated on *this agency's* actual history — "proposals with a Growth-tier recommendation to Series-A fintech clients close at 61% here," not a guess.

**2. Margin Guardrail Engine**
Internal-only. Cross-references the AI's recommended scope and pricing against the agency's own cost baselines (team day-rates, historical actuals per phase) and flags when a proposal is scoped to look attractive but would lose money. This is the single feature most likely to make a VP of Sales say "I need this."

**3. Multi-Agent QA / Red-Team Reviewer**
Before a proposal is sent, a second Claude pass — instructed to think like a skeptical delivery lead, not a salesperson — checks the first pass: is 6 weeks realistic for this scope? Does the team allocation match the timeline? This is explainability in action: every proposal carries a visible "reviewed by QA agent" trail, not a black-box output.

**4. Client-Facing Proposal Portal**
Replaces "email a PDF" with a trackable link: which sections the client actually read, how long they spent on pricing, whether they opened it at all. Turns the proposal from a one-way document into a signal.

**5. Voice-Enabled Discovery Copilot**
The existing Discovery Interview Agent, extended to listen to (or transcribe) a real discovery call and auto-populate the intake — so the "AI asks smart follow-up questions" experience happens live in the client conversation, not as a second form afterward.

---

## 5. UX Improvements

- **From a linear wizard to a pipeline workspace.** Today's five-step flow becomes the *creation* flow inside a persistent workspace with a Kanban view: Draft → Internal Review → Sent → Client Viewed → Won/Lost. The wizard is how you make one proposal; the workspace is how an agency runs its whole presales motion.
- **Section-level regeneration.** Instead of regenerating the whole document, a reviewer can say "just redo the timeline" or "make the executive summary punchier" — the rest of the proposal stays fixed, passed back to Claude as context.
- **Explainability affordances everywhere.** Every AI-generated number (timeline weeks, price range, deal probability) gets a small "why" affordance that surfaces the specific inputs that drove it — the same grounding the Proposal Chat Assistant already does, made ambient rather than something you have to ask for.
- **Inline review threads.** Delivery and sales can comment directly on a scope line or a risk before it's sent, instead of that conversation happening in Slack, disconnected from the document.
- **Client-safe chat mode.** The internal Proposal Chat Assistant already answers "why is this 14 weeks?" — expose a client-safe version of the same assistant on the shared portal, with the Internal Sales Panel and Margin Guardrail data excluded from what it can see.

---

## 6. Dashboard Design

The VP of Sales' home screen — pipeline health at a glance, not another inbox to check.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ProposalPilot AI                                    Marcus ▾   [+ New]  │
├─────────────────────────────────────────────────────────────────────────┤
│  Pipeline value        Win rate (30d)      Avg cycle time   Revenue at   │
│  $412,000               58% ▲ 6pts          2.3 days ▼       risk        │
│  ▲ 12% vs last month                                          $38,000    │
│                                                               (low        │
│                                                               completeness)│
├─────────────────────────────────────────────────────────────────────────┤
│  Pipeline                                                                 │
│  Draft(4)  Internal Review(3)  Sent(6)  Client Viewed(2)  Won(9) Lost(3)  │
│  ┌──────┐  ┌──────────────┐   ┌─────┐  ┌─────────────┐   ┌───┐  ┌───┐    │
│  │Acme  │  │Nimbus Retail │   │Vela │  │ Northwind    │   │...│  │...│    │
│  │68%   │  │92% ⚠ margin  │   │Sent │  │ 4m on pricing│   │   │  │   │    │
│  └──────┘  └──────────────┘   └─────┘  └─────────────┘   └───┘  └───┘    │
├─────────────────────────────────────────────────────────────────────────┤
│  This month's scope-creep flags        Margin Guardrail alerts           │
│  ⚠ 3 proposals flagged High risk       ⚠ 1 proposal priced below cost    │
│  → all involved 4+ requested services   baseline (Nimbus Retail, Growth) │
└─────────────────────────────────────────────────────────────────────────┘
```

Design intent: leadership shouldn't have to open a single proposal to know where the pipeline is healthy and where it's quietly leaking margin — the top row and the two alert panels answer that before any drill-down.

---

## 7. AI Workflow Architecture (expanded)

Today's three routes (`discovery-questions`, `generate-proposal`, `proposal-chat`) become a five-stage pipeline. Discovery and Generation are unchanged in spirit; QA and Margin are new agents that sit between generation and send, which is where the product goes from "generates a proposal" to "an agency can trust what it sends."

```
 ┌──────────────┐   ┌──────────────┐   ┌───────────────┐   ┌──────────────┐   ┌──────────────┐
 │  1. DISCOVERY │   │ 2. EXTRACTION │   │ 3. GENERATION │   │  4. QA /      │   │ 5. MARGIN     │
 │  AGENT        │──►│  & VALIDATION │──►│  AGENT        │──►│  RED-TEAM     │──►│  GUARDRAIL    │
 │               │   │  (existing    │   │  (existing    │   │  AGENT (new)  │   │  AGENT (new)  │
 │  asks 3-5     │   │  intake       │   │  route, one   │   │               │   │               │
 │  follow-ups   │   │  schema       │   │  structured   │   │  re-reads the │   │  checks scope │
 │  like a       │   │  checks —     │   │  call: scope, │   │  proposal as  │   │  + price vs.  │
 │  consultant   │   │  catches      │   │  risk,        │   │  a skeptical  │   │  the agency's │
 │               │   │  contradictions│  │  timeline,    │   │  delivery     │   │  own cost      │
 │               │   │  before they   │   │  pricing,     │   │  lead: is 6   │   │  baselines —   │
 │               │   │  reach Claude) │   │  ROI          │   │  wks real?    │   │  internal-only │
 └──────────────┘   └──────────────┘   └───────────────┘   └──────────────┘   └──────────────┘
                                                │                                        │
                                                ▼                                        ▼
                                        stored as a ProposalVersion  ──►  status: INTERNAL_REVIEW
                                                                                          │
                                                                            comments resolved,
                                                                            QA + Margin pass
                                                                                          ▼
                                                                                  status: SENT
                                                                                          │
                                                                                          ▼
                                                                            ┌──────────────────────┐
                                                                            │ 6. PROPOSAL CHAT      │
                                                                            │ AGENT (existing route,│
                                                                            │ two modes: internal    │
                                                                            │ full-context, client   │
                                                                            │ portal restricted-     │
                                                                            │ context)               │
                                                                            └──────────────────────┘
```

Stages 1–3 and 6 are the existing `discovery-questions`, `generate-proposal`, and `proposal-chat` routes, unchanged in spirit. Stages 4 and 5 are new agents that sit between "Claude wrote something" and "an account manager can trust it enough to hit send" — that gap is exactly what separates a demo from a product an agency puts its name behind.

---

## 8. Database Schema (Postgres / Prisma-style)

```prisma
model Organization {
  id            String   @id @default(cuid())
  name          String
  plan          String   // "starter" | "growth" | "enterprise"
  costBaselines Json?    // day-rates per role, used by Margin Guardrail
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

enum Role {
  PRESALES
  DELIVERY
  ADMIN
}

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
  answers     Json      // { question, answer }[]
  transcript  String?   // populated when voice discovery is used
  createdAt   DateTime  @default(now())
}

model Proposal {
  id               String             @id @default(cuid())
  organizationId   String
  organization     Organization       @relation(fields: [organizationId], references: [id])
  clientId         String
  client           Client             @relation(fields: [clientId], references: [id])
  ownerId          String             // Priya — the presales user who created it
  status           ProposalStatus     @default(DRAFT)
  currentVersionId String?
  discoverySessions DiscoverySession[]
  versions         ProposalVersion[]
  comments         Comment[]
  viewEvents       ProposalViewEvent[]
  createdAt        DateTime           @default(now())
}

enum ProposalStatus {
  DRAFT
  INTERNAL_REVIEW
  SENT
  CLIENT_VIEWED
  WON
  LOST
}

model ProposalVersion {
  id           String   @id @default(cuid())
  proposalId   String
  proposal     Proposal @relation(fields: [proposalId], references: [id])
  versionNumber Int
  document     Json     // the full GeneratedProposal object
  qaReview     Json?    // red-team agent findings for this version
  marginCheck  Json?    // Margin Guardrail output for this version
  createdAt    DateTime @default(now())
}

model Comment {
  id          String   @id @default(cuid())
  proposalId  String
  proposal    Proposal @relation(fields: [proposalId], references: [id])
  authorId    String
  sectionRef  String   // e.g. "scopeIn[2]", "timeline[0]"
  body        String
  resolved    Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model ProposalViewEvent {
  id          String   @id @default(cuid())
  proposalId  String
  proposal    Proposal @relation(fields: [proposalId], references: [id])
  sectionRef  String
  dwellMs     Int
  viewedAt    DateTime @default(now())
}
```

This is a direct evolution of `lib/types.ts` — `GeneratedProposal` becomes the JSON payload stored per `ProposalVersion` rather than living only in browser state, which is what unlocks the dashboard, the portal, and the win-rate engine.

---

## 9. Proposal Lifecycle Workflow

```
Discovery Call
      │
      ▼
Draft (AI-generated, Completeness + Scope Creep scored)
      │
      ▼
Internal Review  ──►  QA/Red-Team Agent  ──►  Margin Guardrail
      │  (comments resolved, both checks pass)
      ▼
Sent  ──►  Client Portal (view-tracked)
      │
      ▼
Client Viewed  ──►  Client Chat / Negotiation
      │
      ├──► Won  ──► feeds Win-Rate Intelligence Engine
      └──► Lost ──► feeds Win-Rate Intelligence Engine (loss reason captured)
```

The closed-loop arrows at the bottom are the point: every proposal, win or lose, makes the next one's deal-probability and pricing recommendation slightly more calibrated to that specific agency. That data flywheel is the moat — a competitor can copy the UI, not the accumulated win/loss history.

---

## 10. Revenue Model

**SaaS, seat-based core + usage-based AI overage**, mirroring the pricing-tier pattern the product itself generates for clients:

| Tier | Price | Includes |
|---|---|---|
| **Starter** | $49/seat/mo | Core wizard, AI generation, PDF export, Completeness Score — up to 15 proposals/mo |
| **Growth** | $149/seat/mo | + Client portal, Scope Creep Detector, Proposal Chat, CRM sync (1 integration), unlimited proposals |
| **Enterprise** | Custom | + Margin Guardrail, QA/Red-Team Agent, Win-Rate Intelligence, white-label portal, SSO, dedicated cost-baseline calibration |

**Expansion revenue:** per-seat growth as agencies scale their presales team, plus an AI-credits add-on for high-volume shops running voice discovery on every call. **Land** with a single presales team on Growth; **expand** to Enterprise once a VP of Sales sees the dashboard and wants Margin Guardrail.

---

## 11. Future Roadmap

| Horizon | Focus |
|---|---|
| **Now (0–3 mo)** | Ship Must Haves: RBAC, real versioning, dashboard v1 |
| **Next (3–9 mo)** | Client portal + view tracking, CRM sync, QA/Red-Team agent, Margin Guardrail |
| **Later (9–18 mo)** | Win-Rate Intelligence Engine (needs closed-deal volume to be useful), voice discovery, white-label |
| **Later still** | Vertical-specific proposal packs (fintech, healthcare, e-commerce agencies have different risk/compliance defaults) |

---

## 12. Metrics / KPIs

**Product usage**
- Time from intake start → sent proposal (target: under 20 minutes vs. industry-typical 3–5 days)
- Average Completeness Score at send (proxy for discovery quality)
- Chat Assistant engagement rate per proposal (signal that it's being used in real client conversations, not just generated and forgotten)

**Business impact (the numbers that go in the investor deck)**
- Win-rate uplift vs. agency's pre-adoption baseline
- Average deal size uplift (does clearer packaging move clients toward Growth/Enterprise tiers more often?)
- Proposal cycle time reduction

**AI quality / trust**
- QA/Red-Team Agent catch rate (proposals it flagged before send — proof the second pass earns its keep)
- Scope-creep flags that delivery later confirmed were accurate (closes the loop between AI judgment and real project outcomes)

---

## 13. Investor Pitch Positioning

**One-liner:** *"ProposalPilot AI is the AI presales copilot that helps software and consulting agencies scope, price, and send proposals in minutes instead of days — and gets smarter about what wins with every deal."*

**Market:** Global IT/software services and digital consulting spend exceeds $1T annually; agencies of 10–500 people are the volume segment, and presales tooling built for them barely exists — they're stuck between generic e-signature/proposal tools (PandaDoc, Qwilr) with no domain intelligence, and enterprise CPQ (Salesforce) built for catalog pricing, not scoped services work.

**Why now:** LLMs made it possible to do what only a senior solutions architect could do a year ago — read a vague client ask and produce a defensible scope, timeline, and price. Agencies are already using ChatGPT ad hoc for this; nobody has packaged it with the workflow, review, and accountability layer an agency actually needs to trust sending it.

**Wedge:** Land with the proposal-generation moment (fast, obviously valuable, easy first use) → expand into the system of record for the whole presales pipeline once the dashboard and Margin Guardrail prove their worth to leadership.

**Moat:** Not the LLM call — anyone can prompt Claude for a proposal. The moat is the closed-loop win/loss data per agency, the QA/red-team trust layer, and the workflow lock-in of being where presales, delivery, and sales leadership already collaborate.

**The ask (illustrative):** Seed-stage framing — enough runway to convert 15–20 design-partner agencies from the Starter/Growth tiers into full pipeline-of-record usage, generating the closed-deal volume the Win-Rate Intelligence Engine needs to become a genuine data moat.
