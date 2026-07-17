# NexGeTech AI Pre-Sales Copilot — Transformation Plan

## Overview

Transform ProposalPilot AI from a form-based wizard into **NexGeTech AI Pre-Sales Copilot** — a premium SaaS-grade product with conversational AI, glassmorphism UI, animated dashboard, and world-class intelligence panels.

---

## Phase 1: Foundation — Package & API Migration

### 1A. Package Changes
**Remove:**
- `@anthropic-ai/sdk` (Anthropic SDK)

**Add:**
- `@google/genai` (Official Gemini SDK, GA since May 2025)
- `framer-motion` (Animations, page transitions, hover effects)
- `@react-pdf/renderer` or keep `jspdf` (enhanced PDF)

**Keep:**
- `zustand`, `jspdf`, `lucide-react`, `next`, `react`, `tailwindcss`

### 1B. Gemini API Backend (`lib/gemini.ts` replaces `lib/anthropic.ts`)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const GEMINI_MODEL = 'gemini-2.5-flash';

export async function askGeminiForJSON<T>(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<T> {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ role: 'user', parts: [{ text: params.user }] }],
    config: {
      systemInstruction: { parts: [{ text: params.system }] },
      maxOutputTokens: params.maxTokens ?? 4000,
      temperature: 0.7,
    },
  });
  const text = response.text ?? '{}';
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned) as T;
}
```

### 1C. Environment Variables
**.env.local:**
```
GEMINI_API_KEY=your_key_here
```

### 1D. API Route Updates
All 3 routes (`discovery-questions`, `generate-proposal`, `proposal-chat`) switch from `askClaudeForJSON` → `askGeminiForJSON` and from `anthropic.messages.create` → Gemini equivalents.

---

## Phase 2: Complete UI Overhaul — Premium SaaS Dashboard

### 2A. Theme & Design System (`tailwind.config.ts`)

**New color palette:**
```
Dark Navy:     #081120 (background)
Deep Navy:     #0A1628 (cards)
Electric Blue: #3B82F6 → #60A5FA (primary accent)
Purple:        #8B5CF6 → #A78BFA (secondary accent)
Glass:         rgba(255,255,255,0.05) (surfaces)
Glass Border:  rgba(255,255,255,0.08)
Text Primary:  #F8FAFC
Text Secondary:#94A3B8
Success:       #10B981
Warning:       #F59E0B
Error:         #EF4444
```

**New fonts:** Inter (body) + Geist/Geist Mono (display/mono) or keep Fraunces + Inter

**New effects:**
- `.glass` — backdrop-blur-xl, bg-white/5, border border-white/8
- `.glass-hover` — hover:bg-white/8 transition
- `.aurora` — animated gradient mesh background
- `.gradient-text` — bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent
- `.glow-blue` — shadow-[0_0_30px_rgba(59,130,246,0.3)]
- `.glow-purple` — shadow-[0_0_30px_rgba(139,92,246,0.3)]

### 2B. Layout Structure (`app/layout.tsx` + `app/page.tsx`)

**Replace single-page wizard with dashboard layout:**

```
┌─────────────────────────────────────────────────┐
│  Sidebar (collapsible)     │  Main Content Area  │
│  ┌─────────────────┐      │  ┌────────────────┐ │
│  │ Logo            │      │  │ Dashboard /     │ │
│  │ Nav Items       │      │  │ Chat / Proposal │ │
│  │ • Dashboard     │      │  │                 │ │
│  │ • New Proposal  │      │  │                 │ │
│  │ • History       │      │  │                 │ │
│  │ • Settings      │      │  │                 │ │
│  └─────────────────┘      │  └────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Animated mesh/aurora background** on the entire page using CSS gradients + animation.

### 2C. Animated Background Component (`components/AnimatedBackground.tsx`)
- Floating particles (CSS or canvas)
- Aurora gradient animation (top-right corner, slow-moving)
- Subtle grid pattern overlay

### 2D. Glass Card Component (`components/ui/GlassCard.tsx`)
Reusable glass card with:
- `backdrop-blur-xl bg-white/[0.03] border border-white/[0.06]`
- Hover glow effect
- Framer Motion entrance animation

---

## Phase 3: Conversational AI Interface

### 3A. AI Discovery Chat (`components/DiscoveryChat.tsx`)

**Replace Steps 1-4 (forms) with a single conversational flow:**

```
┌─────────────────────────────────────────────┐
│  🤖 NexGeTech AI Copilot                    │
│                                             │
│  "Hi! I'm your AI pre-sales architect.      │
│   Let me help you build a winning proposal. │
│                                             │
│   Tell me about your business."             │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ [Suggested questions as chips]      │    │
│  │ "We're an e-commerce startup..."   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [Message input bar]              [Send]    │
└─────────────────────────────────────────────┘
```

**AI Flow:**
1. AI asks about business → user responds
2. AI asks about goals → user responds
3. AI asks about services needed → user responds
4. AI asks follow-up questions (discovery)
5. AI confirms understanding → generates proposal

**Key: Each AI message includes suggested response chips for quick interaction.**

### 3B. Conversation State Management (`lib/conversation.ts`)
Extend Zustand store:
```typescript
interface ConversationState {
  messages: Message[];
  currentPhase: 'greeting' | 'business' | 'goals' | 'services' | 'discovery' | 'confirmation' | 'generating';
  extractedIntake: Partial<IntakeState>;
  addMessage: (msg: Message) => void;
  setPhase: (phase: string) => void;
  updateExtractedIntake: (patch: Partial<IntakeState>) => void;
}
```

### 3C. AI Conversation Engine (`lib/conversation-engine.ts`)
System prompt that instructs Gemini to:
1. Act as a senior solutions architect
2. Ask one question at a time
3. Extract structured data from natural conversation
4. Use suggested chips for guided flow
5. Confirm understanding before generating

---

## Phase 4: New AI Intelligence Features

### 4A. Proposal Health Score (enhanced CompletenessMeter)
- Animated circular progress ring
- Sub-categories with animated bars
- Color-coded: green (80+), amber (50+), red (<50)
- Framer Motion entrance animation

### 4B. Project Risk Analysis (enhanced ScopeCreepAlert)
- Risk matrix visualization
- Mitigation recommendations
- Color-coded risk cards with icons

### 4C. Budget Estimator (`components/BudgetEstimator.tsx`)
New AI-generated section:
- Team composition with role cards
- Cost range display
- Animated counter for total cost

### 4D. Technology Recommendation Engine (`components/TechStack.tsx`)
- Visual stack cards with icons
- Frontend / Backend / AI / Infrastructure sections
- Animated reveal

### 4E. Competitor Benchmarking (`components/CompetitorBenchmark.tsx`)
- Industry comparison table
- Feature comparison grid
- Market positioning

### 4F. Executive Dashboard (`components/ExecutiveDashboard.tsx`)
New dashboard view showing:
- Complexity Score (animated ring)
- Estimated Cost (animated counter)
- Delivery Duration
- Team Requirement
- Proposal Confidence (animated bar)
- ROI Potential

### 4G. Proposal Versions / Packages (`components/PackageComparison.tsx`)
- 3-column comparison cards (Startup / Growth / Enterprise)
- Recommended package highlighted with glow
- Animated entrance

### 4H. Interactive Timeline (`components/InteractiveTimeline.tsx`)
- Horizontal animated roadmap
- Phase nodes with hover details
- Progress indicator
- Framer Motion stagger animation

### 4I. Win Probability Prediction (`components/WinProbability.tsx`)
- Animated circular gauge
- Confidence factors list
- Green/amber/red color coding

### 4J. AI Solution Architect Mode (`components/SystemArchitecture.tsx`)
- Module breakdown cards
- Development phases visualization
- Scalability considerations

---

## Phase 5: Premium UI Effects

### 5A. Framer Motion Animations
- Page transitions (AnimatePresence)
- Staggered list animations
- Hover scale/glow effects
- Loading skeleton shimmer
- Scroll-triggered reveals

### 5B. Animated Counters (`components/ui/AnimatedCounter.tsx`)
- Count-up animation for numbers
- Used in: cost, team size, duration, score

### 5C. Typing Effect (`components/ui/TypingEffect.tsx`)
- AI messages appear with typewriter effect
- Streaming text simulation

### 5D. Loading Storytelling (`components/GeneratingScreen.tsx` enhanced)
- Multi-step generation visualization
- Each step shows what AI is doing
- Progress bar with phase indicators
- "AI thinking" animation (pulsing dots)

### 5E. Particle Background (`components/ui/Particles.tsx`)
- Floating dots/particles
- Subtle movement
- Performance-optimized (CSS or requestAnimationFrame)

---

## Phase 6: Enhanced PDF Export

### 6A. Premium PDF Design
- Modern cover page with gradient
- NexGeTech branding
- Table of contents with page numbers
- Section headers with colored accents
- Professional tables
- Team structure visualization
- Architecture diagram (text-based)
- Pricing comparison table
- ROI summary card
- Signature block

---

## Phase 7: Documentation & Polish

### 7A. Updated README.md
- New product positioning
- Architecture overview
- Screenshots section
- AI tools and prompts used
- Getting started guide

### 7B. ARCHITECTURE.md
- System diagram
- Data flow
- API design
- Component hierarchy

---

## File Change Summary

### Files to DELETE:
- `lib/anthropic.ts` (replaced by `lib/gemini.ts`)
- `components/Stepper.tsx` (replaced by sidebar nav)
- `components/StepClient.tsx` (replaced by conversational flow)
- `components/StepGoals.tsx` (replaced by conversational flow)
- `components/StepServices.tsx` (replaced by conversational flow)
- `components/StepDiscovery.tsx` (replaced by conversational flow)
- `components/Field.tsx` (replaced by conversational flow)

### Files to CREATE:
- `lib/gemini.ts` — Gemini API client
- `lib/conversation.ts` — Conversation state management
- `lib/conversation-engine.ts` — AI conversation prompts/logic
- `components/AnimatedBackground.tsx` — Aurora + particles
- `components/Sidebar.tsx` — Dashboard sidebar
- `components/DiscoveryChat.tsx` — AI conversational interface
- `components/ProposalDashboard.tsx` — Main proposal view with all panels
- `components/ExecutiveDashboard.tsx` — Score cards + metrics
- `components/BudgetEstimator.tsx` — Team + cost visualization
- `components/TechStack.tsx` — Technology recommendation cards
- `components/CompetitorBenchmark.tsx` — Industry comparison
- `components/InteractiveTimeline.tsx` — Animated roadmap
- `components/WinProbability.tsx` — Win chance gauge
- `components/SystemArchitecture.tsx` — Architecture breakdown
- `components/PackageComparison.tsx` — 3-tier pricing cards
- `components/ui/GlassCard.tsx` — Reusable glass card
- `components/ui/AnimatedCounter.tsx` — Count-up animation
- `components/ui/TypingEffect.tsx` — Typewriter effect
- `components/ui/Particles.tsx` — Floating particles
- `components/ui/ProgressBar.tsx` — Animated progress
- `components/ui/GlowButton.tsx` — Premium button with glow

### Files to HEAVILY MODIFY:
- `app/layout.tsx` — New metadata, fonts, theme
- `app/page.tsx` — Complete rewrite (dashboard + chat)
- `app/globals.css` — Complete rewrite (glass, aurora, glow effects)
- `tailwind.config.ts` — New color palette, effects, animations
- `lib/store.ts` — Add conversation state
- `lib/types.ts` — Extend types for new features
- `lib/prompts.ts` — New prompts for conversation engine + enhanced features
- `lib/pdf-generator.ts` — Premium PDF design
- `components/GeneratingScreen.tsx` — Storytelling loading
- `components/ProposalDocument.tsx` — Complete redesign with dashboard panels
- `components/CompletenessMeter.tsx` — Animated ring + bars
- `components/ScopeCreepAlert.tsx` — Risk matrix design
- `components/InternalSalesPanel.tsx` — Executive dashboard layout
- `components/ChatAssistant.tsx` — Premium chat UI
- `components/PdfExportButton.tsx` — Enhanced button
- `package.json` — Package changes
- `README.md` — Complete rewrite
- `.env` — Update to GEMINI_API_KEY

### Files to MODIFY (minor):
- `app/api/discovery-questions/route.ts` — Switch to Gemini
- `app/api/generate-proposal/route.ts` — Switch to Gemini
- `app/api/proposal-chat/route.ts` — Switch to Gemini

---

## Implementation Order

1. **Phase 1** (Foundation) — Package install, Gemini backend, env vars
2. **Phase 2** (UI Theme) — Tailwind config, globals.css, layout, background
3. **Phase 3** (Conversational AI) — Discovery chat, conversation engine
4. **Phase 4** (Intelligence) — All new AI feature components
5. **Phase 5** (Effects) — Framer Motion, counters, typing, particles
6. **Phase 6** (PDF) — Enhanced PDF export
7. **Phase 7** (Polish) — README, architecture docs, final touches
