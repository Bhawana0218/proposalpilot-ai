# Demo Script (~4 min)

These are talking points, not a script. Sound like you're walking someone through what you built.

---

**0:00–0:20 — Opening (don't open the app yet)**

"This is NexGeTech AI Pre-Sales Copilot. Not a form that calls an API — a pre-sales consultant in software form. Most solutions to this brief give you a form, one AI call, and a PDF. I wanted to build the parts of presales that are usually invisible: the discovery questions, the scope-creep flags, the 'should I really send this?' quality score."

---

**0:20–1:00 — Client intake (screen: Discover → Analyze)**

Fill in a realistic example. Something with enough surface area to trigger scope creep — a mid-size e-commerce company wanting a chatbot, mobile app, and analytics dashboard. Walk through the three intake sections:

- Company info (name, industry, size, budget)
- Business goals (structured options + free text)
- Requested services (select 4+ to make the scope-creep detector interesting)

Click through to Analyze. "This just captures what the user told us. The interesting part is next."

---

**1:00–1:40 — Discovery interview**

Hit Architect. The AI comes back with targeted follow-up questions. Point out: these aren't generic. "What specific integrations?" "Who handles QA?" — questions that actually change scope or cost. Answer one or two, skip the rest. Show the completeness radar and consultant insights on the right.

"This is the difference between generating a proposal and consulting on one."

---

**1:40–2:40 — The proposal**

Click Generate. Talk through the generating screen briefly — it's streaming tokens in real time, not waiting for the whole thing.

Once it loads, walk through the dashboard in order:

1. Score rings (proposal health, deal probability, completeness)
2. Scope creep assessment with phasing suggestion
3. Internal-only panel (deal probability, quality score — "this never reaches the client")
4. Executive summary → scope → risks → timeline → team → architecture
5. Pricing tiers with the recommended one highlighted
6. ROI projection

---

**2:40–3:10 — Chat assistant**

Ask it something specific: "Why is development estimated at 14 weeks?" Let it answer from the proposal's own numbers. "This makes the document defensible. You can walk into a client call and back up every number."

---

**3:10–3:40 — PDF export**

Click export, open the PDF. Point out: cover page, table of contents, sections, signature block. "Built with jsPDF directly against the data — selectable text, proper pagination, not a screenshot."

---

**3:40–4:00 — Closing**

"The whole AI implementation is three API routes and a prompts file. The Groq model streams responses so generation feels fast. The discovery prompt has safety nets — if the AI tries to skip questions, the server forces fallback questions. Everything runs server-side so the API key never touches the browser."
