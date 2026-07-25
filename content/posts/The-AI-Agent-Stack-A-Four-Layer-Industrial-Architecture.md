---
title: "The AI Agent Stack: A Four-Layer Industrial Architecture"
date: "2026-07-25T13:42:26.641830+00:00"
published: true
source: publish_incoming.py (html conversion)
tags: ""
---

![](https://aiagentsdirectory.com/landscape-social-cover.jpg)

[Executive Summary](#executive-summary)
[1. The Model Layer: The Commoditizing Foundation](#1-the-model-layer-the-commoditizing-foundation)
[2. The Harness Layer: The Execution Runtime](#2-the-harness-layer-the-execution-runtime)
[3. The Orchestration Layer: The Brain and the Battleground](#3-the-orchestration-layer-the-brain-and-the-battleground)
[4. The Managed Infrastructure & Tooling Layer: Production-Grade Reality](#4-the-managed-infrastructure-tooling-layer-production-grade-reality)
[II. Market Categorization by Application: Horizontal Breadth vs. Vertical Depth](#ii-market-categorization-by-application-horizontal-breadth-vs-vertical-depth)
[1. Horizontal Agent Categories: The "General Purpose" Contenders](#1-horizontal-agent-categories-the-general-purpose-contenders)
[2. Vertical Agent Categories: The "Deep Work" Moats](#2-vertical-agent-categories-the-deep-work-moats)
[III. The 2026 Funding Leaderboard: Valuation as a Signal of Market Truth](#iii-the-2026-funding-leaderboard-valuation-as-a-signal-of-market-truth)
[IV. Enterprise Adoption & Economic Trends: The New Physics of Software Business](#iv-enterprise-adoption-economic-trends-the-new-physics-of-software-business)
[1. Deployment Metrics: The "67% Production" Inflection Point](#1-deployment-metrics-the-67-production-inflection-point)
[2. Pricing & Business Models: The Death of the Seat](#2-pricing-business-models-the-death-of-the-seat)
[3. Market Valuation (AI Software Segment): The $120B TAM Split](#3-market-valuation-ai-software-segment-the-120b-tam-split)
[V. Key Players & Companies: The 2026 Power Map](#v-key-players-companies-the-2026-power-map)
[Model Providers (The Utilities)](#model-providers-the-utilities)
[Orchestration & Frameworks (The Brains)](#orchestration-frameworks-the-brains)
[Infrastructure, Observability & Platforms (The Production Layer)](#infrastructure-observability-platforms-the-production-layer)
[Application Layer: The Category Leaders](#application-layer-the-category-leaders)
[VI. Synthesis & Comparative Analysis: Where the Sources Agree and Diverge](#vi-synthesis-comparative-analysis-where-the-sources-agree-and-diverge)
[Points of Strong Consensus](#points-of-strong-consensus)
[Points of Tension / Nuance](#points-of-tension-nuance)
[VII. The 2026 Market Map: A Unified Taxonomy](#vii-the-2026-market-map-a-unified-taxonomy)
[VIII. Conclusion: The Map Is the Territory](#viii-conclusion-the-map-is-the-territory)

Executive Summary
-----------------

The AI agent ecosystem in 2026 has undergone a fundamental architectural transformation, evolving from a landscape dominated by "LLM wrappers" and human-led copilots into a sophisticated, multi-layered industrial stack defined by goal-led autonomous agents. This report maps the complete topology of this market, synthesizing data from CB Insights, Forbes AI 50, MAPEGY, and Q2 2026 venture analyses to provide a comprehensive taxonomy of every category, layer, and major player. The market is projected to explode from $7.84 billion in 2025 to $52.62 billion by 2030 (41% CAGR), driven by a bifurcation strategy where deep-vertical specialists—armed with proprietary data and regulatory moats—are decisively outperforming horizontal platforms in both funding velocity and production deployment rates. As of late 2025, over 400 promising private startups operate across 16 distinct categories, structured into a four-layer stack (Model, Harness, Orchestration, Managed Infrastructure) and three application layers (Enterprise Tech, Productivity, Industry-Specific). The defining economic shift of 2026 is the transition from seat-based SaaS pricing to outcome-based models, reflecting a reality where 67% of enterprises have already moved agents into production, realizing a median $2.4M in savings. This report details the stack architecture, the competitive dynamics of horizontal vs. vertical categories, the funding leaderboard dominated by Coding ($29.3B) and Healthcare ($12B), and the critical infrastructure investments in security, observability, and edge deployment required to sustain this autonomy.

---

The most critical structural insight for 2026 is that the market has solidified into a **four-layer stack**, moving decisively away from the monolithic "app" mental model of 2023–2024. This layered architecture—identified by CB Insights as the primary framework for understanding the ecosystem—separates raw intelligence from execution, orchestration, and production-grade infrastructure. This separation of concerns is what enables the shift from "copilots" (which require constant human steering) to "autonomous agents" (which execute goal-led loops independently).

### 1. The Model Layer: The Commoditizing Foundation

At the base sits the **Model Layer**, populated by the familiar giants: OpenAI, Anthropic, Meta (Llama), Google (Gemini), and xAI (Grok), with newer entrants like Reflection emerging on the Forbes AI 50 list. In 2026, this layer is characterized by two countervailing forces. First, the closed-source labs are racing toward "PhD-level" reasoning and native tool-use capabilities—models that don't just output text but natively understand function calling, code execution, and structured output schemas. Second, the open-source ecosystem (led by Meta’s Llama lineage and a flourishing fine-tuning community) is rapidly closing the gap for specific agentic tasks like structured reasoning and tool use, creating pricing pressure on the frontier labs.

**Strategic Implication:** For application-layer builders, the Model Layer is increasingly a **utility provider**. The competitive moat has moved up the stack. Startups no longer win by "having a better model"; they win by how they *harness*, *orchestrate*, and *govern* these models in production workflows. The CB Insights data highlights a specific trend: models are being explicitly optimized for "tool-use and reasoning," signaling that the model providers themselves recognize their role as the engine, not the chassis.

### 2. The Harness Layer: The Execution Runtime

Sitting directly atop the models is the **Harness Layer**—the runtime environment where the model’s reasoning is converted into executable actions (code, API calls, browser automation). This is the "hands" of the agent. CB Insights identifies this layer as focusing on "execution loops and code-generation environments," citing examples like Pi and specialized code agents.

This layer solves the **reliability gap** of raw LLMs. A model might hallucinate a function signature; the Harness Layer provides the sandbox, the type-checking, the retry logic, and the state persistence that turns a probabilistic suggestion into a deterministic action. In 2026, the differentiation here is shifting from "can it run code?" to "can it run code *safely, cheaply, and with long-horizon context*?" The rise of specialized code-execution environments (distinct from general-purpose containers) optimized for agentic loops—fast cold starts, persistent filesystems, built-in secret management—is a key infrastructure trend.

### 3. The Orchestration Layer: The Brain and the Battleground

If the Model Layer is the commodity and the Harness Layer is the commodity runtime, the **Orchestration Layer** is **the primary arena of competitive differentiation in 2026**. CB Insights explicitly labels this "the 'Brain' of the Agent" and "a primary area of competitive advantage." This layer manages the cognitive loop: task decomposition, routing, state management, memory (short and long-term), and multi-agent coordination.

The market here has split into two distinct philosophies, creating a classic "build vs. buy" tension for enterprise buyers:

* **Code-First Frameworks (The "Linux" Approach):** Open-source libraries like **LangChain, CrewAI, AutoGen, Mastra, and LangGraph** dominate developer mindshare. These offer maximum flexibility, allowing engineers to define custom control flows (graphs, DAGs, hierarchical teams) in Python/TypeScript. LangGraph (from LangChain) has emerged as the de facto standard for stateful, cyclic agent graphs, while CrewAI leads in "role-based" multi-agent abstractions. AutoGen (Microsoft Research) remains powerful for conversational agent patterns. The newer entrant **Mastra** signals a trend toward "batteries-included" frameworks that bundle evals, deployment, and observability.
* **Managed Orchestration Platforms (The "AWS" Approach):** Tools like **OpenClaw** (and the managed tiers of the frameworks above, e.g., LangChain's LangSmith platform, CrewAI AMP) abstract away the infrastructure of orchestration. They provide visual builders, managed state stores, and enterprise governance (RBAC, audit logs) out of the box.

**Why this matters:** Enterprises in 2026 are standardizing on **LangGraph for custom builds** and **Copilot Studio / CrewAI AMP for low-code/ops-led automation**. The winners in this layer will be those who solve the "evals gap"—making it trivial to test, version, and regress agent logic, not just model prompts.

### 4. The Managed Infrastructure & Tooling Layer: Production-Grade Reality

The top layer of the stack is where "demo-ware" becomes enterprise software. CB Insights categorizes this into **Platforms, Observability, Security/Governance, and Edge Infrastructure**.

* **Platforms:** **Microsoft Copilot Studio** is the 800lb gorilla here, leveraging the M365/Azure distribution moat. It represents the "buy" option for the 90% of enterprises that won't hire agent engineers.
* **Observability & Monitoring:** **LangSmith, CrewAI AMP, AutoGen Studio**. In 2026, "observability" means more than latency logs. It means **tracing the full cognitive chain**: prompt → reasoning → tool call → result → next reasoning step. Debugging an agent requires replaying the *entire trajectory*, not just a request/response pair. These tools are converging on "evals-driven development" workflows.
* **Security & Governance:** This is the **blocker for regulated industries**. The evidence cites **ISO 42001 adoption** (the new AI management system standard), **Human-in-the-Loop (HITL) frameworks** as architectural requirements (not afterthoughts), and mitigation of "token inefficiency and alignment risks." In 2026, you cannot deploy an autonomous agent in banking or healthcare without a certified governance layer that enforces policy, PII redaction, and approval gates.
* **Edge Infrastructure:** A fascinating and distinct sub-category identified by the **MAPEGY Edge AI Technology Report**. "Agentic AI at the Edge" implies agents running on factory floors, in robots, in vehicles, or on devices—disconnected or latency-sensitive. This requires a specialized stack: **hardware acceleration (NPUs/GPUs), simulation environments for safe training, formal verification for safety, and lightweight frameworks** (e.g., ONNX Runtime, TensorRT-LLM, specialized edge orchestrators). This is the physical manifestation of the agent stack.

---

II. Market Categorization by Application: Horizontal Breadth vs. Vertical Depth
-------------------------------------------------------------------------------

![](https://www.tldl.io/images/android-chrome-512x512.png)

CB Insights organizes the application layer into three primary bands: **Enterprise Tech (Horizontal Job Functions), Productivity & Personal Assistants, and Industry-Specific (Vertical) solutions**. Critically, this mapping *excludes infrastructure providers* to focus on companies delivering core enterprise use cases. As of November 2025, this taxonomy covers **400+ promising private startups across 16 distinct categories**.

### 1. Horizontal Agent Categories: The "General Purpose" Contenders

Horizontal agents bet on transferability: the same core reasoning engine applied to coding, support, or workflow across any industry. In 2026, the evidence suggests a **bifurcation of outcomes** within horizontals.

#### **Coding Agents: The Breakout Horizontal Winner**

This is the **single most successful horizontal category**, producing the market's highest valuations (Cursor at $29.3B, Lovable rising rapidly). Why coding? Three structural advantages:
1. **Verifiable Ground Truth:** Code compiles/runs/tests pass. The reward signal is objective, enabling RL and self-improvement loops impossible in fuzzy domains.
2. **High Willingness to Pay:** Developers are high-leverage, expensive, and technically sophisticated buyers who adopt tools virally (bottom-up).
3. **Data Flywheel:** Every accepted suggestion improves the model for that codebase.

Cursor and Lovable represent two UX paradigms: **Cursor = IDE-native, developer-in-the-loop "centaur" workflow**; **Lovable = natural-language-to-full-app generation** targeting a broader "builder" persona. Both are moving beyond autocomplete toward **autonomous software engineering** (repo-level understanding, test generation, PR creation, deployment).

#### **Customer Service Agents: From Chatbots to Outcome-Based Resolution**

This category (Sierra, Intercom, Wonderful) is undergoing a **business model revolution**. The evidence highlights a shift to **outcome-based pricing** (e.g., "pay per resolved ticket"). Sierra’s $10B valuation reflects the market's belief that *resolution* is a commoditizable unit of value. The technology has moved from RAG-based FAQ bots to **agents that take action**: processing refunds, rebooking flights, updating CRM records, escalating to humans with full context. The "Human-in-the-Loop" here is a designed escalation path, not a failure mode.

#### **Enterprise Workflow Agents: The Cross-Functional Glue**

Players like **Skygen AI and Caretta** target the "white space" between departmental SaaS tools—automating processes that span Sales → Legal → Finance → Ops. These are the "digital coworkers" for operations teams. The challenge here is **integration depth**: an agent that can *read* Salesforce via API is a toy; an agent that can *navigate* a complex CPQ workflow, handle exceptions, and coordinate with a legal agent for contract review is a product. This category is heavily dependent on the Orchestration Layer's maturity.

#### **Productivity & Personal Assistants: The "Autonomous Worker" Vision**

This category targets the consumer and knowledge worker with the promise of a "fully autonomous worker" (CB Insights phrasing). **Gamma (100M users, per Forbes AI 50)** exemplifies the "single-player magic" entry point (AI presentations/docs), while **EliseAI** shows the verticalized path (property management automation). The tension: horizontal assistants (like a general "Jarvis") struggle with context fragmentation across apps; verticalized assistants (EliseAI) win on workflow depth but lose on TAM.

#### **AI Avatars: The Interface Layer**

A distinct horizontal category for **human-like interaction and representation**. This spans customer-facing digital humans, training simulators, and creator economy tools. The tech stack here fuses LLMs with real-time TTS, lip-sync, and emotion modeling. It's a "presentation layer" category that will likely be absorbed into other verticals (e.g., healthcare avatars for patient intake) but currently stands alone as a specialized capability.

### 2. Vertical Agent Categories: The "Deep Work" Moats

The evidence is unequivocal: **the market is shifting toward "Vertical AI," where agents are trained on domain-specific data and regulatory requirements.** Vertical agents don't just "use an LLM"; they encode **domain logic, compliance rules, proprietary data ontologies, and workflow integrations** that a horizontal platform cannot easily replicate. This is where the 2026 funding premium lives.

#### **Industrial Manufacturing: The Physical-Digital Frontier**

This is a **highly specialized, high-barrier sector** (CB Insights). It’s not "chat for factories." The taxonomy includes:
\* **Production Optimization:** Agents tuning process parameters in real-time.
\* **Prescriptive Maintenance (PdM 2.0):** Moving beyond "predict failure" to "prescribe the exact repair action, order the part, schedule the technician."
\* **Industrial Copilots (RAG-driven):** Technicians querying 500-page manuals via voice on the shop floor.
\* **Computer Vision Agents:** Quality control (defect detection) and PPE compliance (safety) via edge-deployed vision models.
\* **Key Player:** **Plataine** (cited in evidence) exemplifies the "industrial AI platform" model—deep ERP/MES integration + optimization solvers + GenAI interface.

**Why this wins:** The cost of error is physical (downtime, safety, scrap). The data is proprietary (sensor streams, maintenance logs). The buyers (plant managers) buy *outcomes* (OEE improvement), not "AI."

#### **Financial Services: The Production Deployment Leader**

**67% production adoption** (CB Insights)—the highest of any sector. Finance has the data, the regulatory pressure (explainability), the high-value workflows (KYC, compliance, trading ops, reporting), and the budget. Agents here are specialized for **audit trails, deterministic execution, and regulatory alignment**. The "high-impact financial returns" metric suggests clear ROI: automating a $50M/yr manual reconciliation process justifies a seven-figure agent contract.

#### **Healthcare: Clinical Documentation & Patient Care**

A massive TAM with extreme regulatory gravity (HIPAA, FDA). The evidence cites **OpenEvidence ($12B valuation), Hippocratic AI, and Ambience**.
\* **OpenEvidence:** Clinical decision support at the point of care—answering "what's the dosing for this patient with these comorbidities?" using grounded medical literature.
\* **Hippocratic AI / Ambience:** **Clinical documentation (scribe) and patient-facing agents** (pre-op prep, post-discharge follow-up). The "safety-first" architecture (constitutional AI, physician oversight) is the product.
\* **Valuation Signal:** OpenEvidence at $12B signals that **clinical intelligence**—not just transcription—is the value layer.

#### **Legal AI: Case Law & Document Automation**

**Caseflood.ai** and an unnamed $11B player (per evidence table) define this category. Legal is a **language-native, precedent-driven, high-hourly-rate** domain—perfect for agents. Use cases: contract review (redlining against playbooks), discovery (document classification), case law research (multi-step reasoning over statutes), and drafting. The moat: **proprietary legal corpora, jurisdiction-specific fine-tunes, and integration with practice management systems (Clio, Litera).**

#### **HR & Retail: The Operational Backbone**

* **HR:** Recruiting (sourcing → screening → scheduling → offer), employee lifecycle (onboarding agents, benefits navigators), compliance monitoring.
* **Retail/Supply Chain:** Demand forecasting agents, inventory allocation agents, customer experience agents (personal shoppers, return handlers).
* These are **high-volume, lower-margin-per-task** categories where the agent economics rely on massive scale and deep ERP/WMS integration.

---

III. The 2026 Funding Leaderboard: Valuation as a Signal of Market Truth
------------------------------------------------------------------------

The Q1–Q2 2026 data (sourced from "Q2 2026 AI Agent [PERSON\_NAME]") reveals a **stark bifurcation**: deep-vertical specialists are outperforming horizontal platforms. The market is rewarding **narrow scope, deep workflow integration, and proven production reliability over general-purpose autonomy**. AI captured **80% of global VC in Q1 2026**—a staggering concentration of capital.

| Category | Leading Players | Valuation | Strategic Signal |
| --- | --- | --- | --- |
| **Coding & Developer Tools** | **Cursor, Lovable** | **$29.3B (Cursor)** | **Category King.** Code is the first "solved" domain for autonomy. Valuation reflects massive TAM (every company is a software company) + viral bottom-up adoption + verifiable ROI. |
| **Healthcare/Medical AI** | **OpenEvidence** | **$12B** | **Clinical Intelligence > Transcription.** The premium is for *reasoning* over medical knowledge, not just scribing. Regulatory moat is high. |
| **Legal AI** | **[PERSON\_NAME]** | **$11B** | **Language-Native Domain.** Legal work maps 1:1 to LLM capabilities. High hourly rates = high willingness to pay. |
| **Customer Service** | **Sierra, Wonderful** | **$10B (Sierra)** | **Outcome-Based Model Validation.** Sierra's valuation proves the market believes "pay per resolution" is the new SaaS seat. |
| **Enterprise Knowledge & Search** | **Glean** | **$7.2B** | **The "Connective Tissue" Play.** Glean wins by sitting *above* the data silos (Slack, Drive, Jira, Salesforce) and becoming the universal enterprise index + agent platform. Horizontal but sticky. |

**Analysis:** Notice the **absence of a "General Purpose Agent" category** in the top 5. The market has voted: **specialization wins**. Even Glean, the most "horizontal" in the top 5, is deeply embedded in the enterprise data layer—it's a *platform* for vertical agents, not a standalone agent itself. The $29.3B valuation of Cursor (likely higher by late 2026) dwarfs the rest, confirming that **developer tools are the cloud infrastructure of the agent era**—the pickaxes in the gold rush.

---

IV. Enterprise Adoption & Economic Trends: The New Physics of Software Business
-------------------------------------------------------------------------------

![](https://www.stackone.com/og/blog/ai-agent-tools-landscape-2026.png)

The transition from pilot to production is the defining macro trend of 2026. The evidence provides hard numbers that rewrite the SaaS playbook.

### 1. Deployment Metrics: The "67% Production" Inflection Point

**67% of enterprises have moved agents into production** (CB Insights). This is not "experimenting." This is **revenue-critical deployment**. Financial Services leads, but the stat implies cross-sector maturity. The **median savings of $2.4M** per enterprise deployment is the "killer metric" for CFOs. It implies:
\* **Payback periods in months, not years.**
\* Agents are replacing **high-cost human hours** (analysts, support tier-2, junior devs, paralegals).
\* The "build vs. buy" calculus has flipped: buying a $500k/yr agent that saves $2.4M is a no-brainer.

### 2. Pricing & Business Models: The Death of the Seat

The industry is **moving decisively away from seat-based pricing toward outcome-based pricing**. The evidence cites Zendesk (likely "Zendesk" not "Zendendex") as an example of outcome-based models (pay per successful resolution).

**The SaaS Pricing Strategy Guide evidence outlines the cascade:**
\* **Per-seat pricing is declining** because AI *replaces* human users (fewer seats needed).
\* **Credit-based models** (pay per API call / task) are **transitional**—they align cost with usage but not value.
\* **Hybrid models** (base platform fee + usage/outcome component) **dominate** the current enterprise contracts.
\* **Pure outcome-based** (pay per resolved ticket, per closed deal, per deployed feature) is the **end state** for mature vertical agents.

**Why this matters:** This shifts the vendor's incentive from "drive engagement/logins" to "drive *results*." It forces agent companies to **guarantee reliability, accuracy, and completion**—which in turn drives massive investment in the Orchestration and Infrastructure layers (evals, guardrails, HITL). It also means **revenue becomes variable and lumpy**, requiring new financial modeling for agent startups.

### 3. Market Valuation (AI Software Segment): The $120B TAM Split

Forbes AI 50 estimates the **total addressable market for AI software at $120B**, split three ways:
\* **Enterprise AI: $60B** (Microsoft Copilot, Salesforce Einstein) — The "default on" layer for knowledge work.
\* **Consumer AI: $30B** (ChatGPT, Midjourney, Perplexity) — High volume, lower per-user revenue, brand-driven.
\* **Developer Tools: $30B** (Cursor, GitHub Copilot, Vercel, etc.) — **The highest leverage segment.** Every dollar spent here amplifies the output of the most expensive labor in the economy (software engineers).

This split confirms the **stack investment thesis**: the money is in the *application* of intelligence to high-value workflows (Enterprise, Dev Tools), not just the model or the consumer chat interface.

---

V. Key Players & Companies: The 2026 Power Map
----------------------------------------------

Synthesizing the evidence across sources, here is the consolidated roster of the companies defining the 2026 landscape, categorized by their stack layer and strategic role.

### Model Providers (The Utilities)

* **OpenAI, Anthropic, Google (Gemini), Meta (Llama), xAI (Grok), Reflection** (Forbes AI 50).
* *Strategic Note:* The frontier is a 3-horse race (OpenAI, Anthropic, Google) with Meta as the open-source standard-setter. xAI and Reflection are wildcards for specific capabilities (reasoning, coding).

### Orchestration & Frameworks (The Brains)

* **LangChain / LangGraph:** The ecosystem standard for code-first agent graphs.
* **CrewAI / CrewAI AMP:** Leader in role-based multi-agent abstractions + managed platform.
* **AutoGen / AutoGen Studio:** Microsoft Research's contribution; strong in conversational patterns and code execution.
* **Mastra:** Rising "batteries-included" framework (evals, deployment, observability built-in).
* **OpenClaw:** Specialized orchestration tooling for routing/state.

### Infrastructure, Observability & Platforms (The Production Layer)

* **Microsoft Copilot Studio:** The enterprise "easy button" (low-code, M365 integrated, governed).
* **LangSmith:** The observability/evals standard for LangChain/LangGraph users.
* **CrewAI AMP / AutoGen Studio:** Framework-native managed platforms.
* **MAPEGY Edge AI Frameworks:** The taxonomy leader for **Agentic AI at the Edge** (architecture, hardware, simulation, safety).

### Application Layer: The Category Leaders

| Category | Company | Valuation / Signal | Strategic Positioning |
| --- | --- | --- | --- |
| **Coding** | **Cursor** | **$29.3B** | IDE-native autonomous engineer; "VS Code for AI era." |
|  | **Lovable** | High Growth | Natural language → full stack app; expanding the "builder" market. |
| **Healthcare** | **OpenEvidence** | **$12B** | Clinical decision support; "UpToDate + Agent." |
|  | **Hippocratic AI, Ambience** | Unicorn+ | Safety-aligned patient-facing agents & clinical documentation. |
| **Legal** | **Caseflood.ai** | Emerging | Case law analysis & document automation. |
|  | **[PERSON\_NAME]** | **$11B** | Undisclosed major player; likely Harvey or similar. |
| **Customer Service** | **Sierra** | **$10B** | Outcome-based resolution; brand = "agent as a service." |
|  | **Intercom, Wonderful** | Scaling | Platform incumbents (Intercom) vs. native agent challengers (Wonderful). |
| **Enterprise Knowledge** | **Glean** | **$7.2B** | Universal enterprise index + agent platform; "Google for work." |
|  | **Skygen AI, Caretta** | Growth | Cross-functional workflow automation (Ops/Finance/Legal). |
| **Industrial** | **Plataine** | Established | Production optimization, PdM 2.0, digital twin integration. |
| **Productivity** | **Gamma** | **100M Users** | Viral single-player entry (docs/slides) → platform play. |
|  | **EliseAI** | Vertical Leader | Property management / industry-specific automation. |

---

VI. Synthesis & Comparative Analysis: Where the Sources Agree and Diverge
-------------------------------------------------------------------------

![](https://the-agent-report.com/assets/images/og-image.png)

### Points of Strong Consensus

1. **Stack Architecture:** CB Insights, Forbes, and MAPEGY all converge on a **layered stack** (Model → Execution/Orchestration → Infrastructure/Apps). The "monolithic agent app" is dead.
2. **Vertical > Horizontal (for now):** CB Insights (market map), Q2 2026 Funding Report, and Forbes valuations all signal **deep vertical integration wins** on valuation, production deployment, and defensibility.
3. **Production is Here is** Outcome-Based Pricing Inevitability:\*\* CB Insights and the SaaS Pricing Guide agree: seat-based is dying; outcome-based is the destination; hybrid is the bridge.
4. **Coding is the Beachhead:** Every source identifies **Coding Agents (Cursor)** as the runaway leader in valuation, adoption, and technical maturity.
5. **Observability = Evals:** The infrastructure sources (CB Insights, framework docs) converge on "observability" meaning **trajectory tracing + automated evaluation**, not just metrics.

### Points of Tension / Nuance

1. **Orchestration Winner:** CB Insights lists **LangChain, CrewAI, AutoGen, Mastra, LangGraph, OpenClaw** as a flat list. The *market reality* (GitHub stars, enterprise RFPs, hiring) suggests a **bimodal split: LangGraph (code-first) vs. Copilot Studio/CrewAI AMP (low-code/managed)**. The evidence doesn't fully resolve this tension.
2. **Edge AI Scope:** MAPEGY's Edge AI Report treats "Agentic AI at the Edge" as a **distinct technological taxonomy** (hardware, simulation, safety). CB Insights mentions it as a sub-bullet under Infrastructure. **Reality:** Edge is a *parallel stack* with different constraints (compute, connectivity, safety certification), not just a deployment target. MAPEGY's view is more technically accurate for industrial/robotics.
3. **Legal AI Valuation:** The evidence table shows a **$11B valuation for "[PERSON\_NAME]"** in Legal AI. This is likely **Harvey** (publicly known ~$1.5B–$3B as of late 2024, but 2026 could see massive step-up) or a new stealth giant. The anonymization limits analysis.
4. **Consumer vs. Enterprise:** Forbes AI 50 splits TAM 50/50 ($60B Enterprise / $30B Consumer / $30B Dev Tools). CB Insights' market map *excludes consumer apps* (focuses on enterprise use cases). **The "Agent" definition differs:** Consumer = Chat/Creative assistants; Enterprise = Autonomous workflow executors. They are different markets sharing a model layer.

---

VII. The 2026 Market Map: A Unified Taxonomy
--------------------------------------------

Integrating all layers, categories, and players into a single navigable map.

| Layer / Super-Category | Category / Sub-Category | Core Function | Representative Players / Tools | Key 2026 Trend |
| --- | --- | --- | --- | --- |
| **0. MODEL LAYER** | Foundation Models | Reasoning, Tool Use, Coding | OpenAI, Anthropic, Gemini, Llama, Grok, Reflection | Native tool use & structured output; open-source parity for agent tasks. |
| **1. HARNESS LAYER** | Code Execution / Action Runtime | Sandboxed execution, retry, state | Pi, E2B, Modal, Browserbase, AgentOps runtimes | Fast cold-start, persistent sessions, hardware acceleration. |
| **2. ORCHESTRATION LAYER** | **Code-First Frameworks** | Custom logic, graphs, multi-agent | **LangGraph, CrewAI, AutoGen, Mastra, LangChain** | **LangGraph** standard for stateful graphs; **Mastra** for "batteries included." |
|  | **Managed Platforms** | Low-code, governance, visual builders | **Copilot Studio, CrewAI AMP, OpenClaw, LangSmith (Platform)** | Enterprise adoption driver; HITL & policy built-in. |
| **3. INFRASTRUCTURE & TOOLING** | Observability & Evals | Trajectory tracing, automated testing | **LangSmith, CrewAI AMP, AutoGen Studio, AgentOps, Arize/Phoenix** | **Evals-driven development** is the new CI/CD. |
|  | Security & Governance | ISO 42001, HITL, PII, Policy | Aporia, Lakera, Prompt Security, Enterprise platform features | **Regulatory compliance (ISO 42001) becomes a sales requirement.** |
|  | Edge Infrastructure | On-device / On-prem agent runtime | **MAPEGY Taxonomy:** NPUs, TensorRT-LLM, ONNX, Simulation, Safety | **Physical AI:** Robotics, Manufacturing, Autonomy. |
| **4. APPLICATION LAYER: HORIZONTAL** | **Coding Agents** | Autonomous Software Engineering | **Cursor ($29.3B), Lovable, GitHub Copilot, Codeium, Cognition (Devin)** | **Category King.** Repo-level autonomy; test-gen → PR → Deploy. |
|  | Customer Service Agents | Outcome-Based Resolution | **Sierra ($10B), Intercom, Wonderful, Ada, Forethought** | **Pay-per-Resolution** model validated; action-taking (refunds, changes). |
|  | Enterprise Workflow / Knowledge | Cross-Functional Automation & Search | **Glean ($7.2B), Skygen AI, Caretta, Moveworks, Dashworks** | Universal Index + Agent Platform = "Enterprise Brain." |
|  | Productivity & Personal Assistants | Autonomous Knowledge Work | **Gamma (100M), EliseAI, Rewind, Lindy, Personal.ai** | Single-player viral → Team/Enterprise expansion. |
|  | AI Avatars | Human-Like Interaction | HeyGen, Synthesia, D-ID, Soul Machines, UneeQ | Real-time video/voice + LLM; verticalizing (Healthcare, HR). |
| **4. APPLICATION LAYER: VERTICAL** | **Healthcare / Medical AI** | Clinical Decision & Patient Care | **OpenEvidence ($12B), Hippocratic AI, Ambience, Abridge, Nuance (MSFT)** | **Clinical Reasoning > Scribing.** Safety alignment (Constitutional AI). |
|  | **Legal AI** | Case Law, Contracts, Discovery | **Caseflood.ai, [PERSON\_NAME] ($11B), Harvey, EvenUp, Spellbook** | Jurisdiction-specific models; Practice Management System integration. |
|  | **Financial Services** | Compliance, Ops, Trading, KYC | Niche specialists (often stealth/acquired), Bank-internal builds | **67% Production Adoption.** High ROI, Regulatory explainability key. |
|  | **Industrial / Manufacturing** | Production, Maintenance, Quality | **Plataine, C3 AI, Uptake, Falkonry, Siemens/GE Digital (Platforms)** | **PdM 2.0 (Prescriptive), CV Quality, Edge Copilots.** Physical-digital loop. |
|  | **HR & Retail** | Recruiting, Supply Chain, CX | Paradox, Eightfold, Beamery (HR); Symbotic, Ocado, Niche (Retail) | High-volume automation; Deep ERP/WMS/ATS integration. |

---

VIII. Conclusion: The Map Is the Territory
------------------------------------------

![](https://mightybot.ai/images/blog/677f033f1ed6570169fdf845_agent-map-insight.png)

The **AI Agents Market Map of 2026** reveals an ecosystem that has **crossed the chasm from experimentation to industrialization**. The defining characteristics are:

1. **Structure:** A mature **four-layer stack** (Model → Harness → Orchestration → Infra) where value has decisively migrated *up* to Orchestration and Vertical Applications.
2. **Strategy:** **Vertical depth beats horizontal breadth.** The funding leaderboard (Cursor, OpenEvidence, Legal AI, Sierra, Glean) is dominated by companies that own a specific, high-value workflow end-to-end—encoding proprietary data, regulatory logic, and system integrations that general platforms cannot replicate.
3. **Economics:** **Outcome-based pricing** is rewriting the SaaS contract, aligning vendor incentives with customer ROI (median $2.4M savings) and forcing a quality/reliability floor that drives the Infrastructure layer.
4. **Deployment:** **67% production adoption** (led by Finance) proves this is not hype. The "Agent" is now a line-item budget category: **Autonomous Digital Labor.**
5. **Frontiers:** The next map expansion zones are **Edge/Physical AI** (MAPEGY domain—robotics, manufacturing, autonomy) and **Multi-Agent System Governance** (orchestrating fleets of agents with conflicting goals, audit trails, and societal alignment).

For builders, the map says: **Pick a vertical, go deep, own the workflow, price on outcomes, and invest heavily in evals/governance.** For buyers, the map says: **The stack is real; evaluate the layer you're buying** (model? framework? vertical app?); demand outcome contracts; and plan for the governance/edge requirements of your sector. The 2026 market map is not a snapshot of possibilities—it is a blueprint of the new software economy.

Sources (25)

[1.AI Agents Landscape & Ecosystem (July 2026): Complete Interactive Mapaiagentsdirectory.com](https://aiagentsdirectory.com/landscape)
[2.AI Agents Market Map 2026: Every Category Mapped - MightyBotmightybot.ai](https://mightybot.ai/blog/ai-automation-agents-market-maps-gone-wild/)
[3.Ai Agent Landscape 2026 Frameworks Platforms Tools Infrastructurethe-agent-report.com](https://the-agent-report.com/2026/05/ai-agent-landscape-2026-frameworks-platforms-tools-infrastructure/)
[4.120+ Agentic AI Tools Mapped Across 11 Categories [2026]stackone.com](https://www.stackone.com/blog/ai-agent-tools-landscape-2026/)
[5.AI agent market map 2026: who's building what — Kael Researchkaelresearch.com](https://kaelresearch.com/blog/ai-agent-market-map-2026)
[6.AI Agent Landscape 2026 — Reference Guideagentnetwork.ai](https://agentnetwork.ai/)
[7.AI Market Map 2026: Every Category, Key Player & Valuation in One Viewtldl.io](https://www.tldl.io/resources/ai-market-map-2026)
[8.State of Agentic AI in the Enterprise 2026 — KXN Researchkxntech.com](https://kxntech.com/global/en/research/state-of-agentic-ai-2026/)
[9.AI by Industry: How Every Sector Is Using AI in 2026 | HackerNoonhackernoon.com](https://hackernoon.com/ai-by-industry-how-every-sector-is-using-ai-in-2026)
[10.Top AI Agent Startups 2026 (Funding & Valuation)aifundingtracker.com](https://aifundingtracker.com/top-ai-agent-startups/)
[11.Top 7 AI Agent Platforms for Industrial Manufacturing in 2026roboticsandautomationnews.com](https://roboticsandautomationnews.com/2026/07/02/top-7-ai-agent-platforms-for-industrial-manufacturing-in-2026/102973/)
[12.Top AI Agent Startups (2026): The Companies Building Autonomous AI Systemsonedayadvisor.com](https://www.onedayadvisor.com/2025/11/top-10-ai-agent-startups-of-2025.html)
[13.Watch Live FOX News, Weather and Business | FOX Onefox.com](https://www.fox.com/news)
[14.Top Agentic AI Development Companies in USA 2026niracore.com](https://www.niracore.com/top-agentic-ai-development-companies-in-the-usa-2026/)
[15.Industrial AI Tech Startups: The 2026 Buyer's Guide for Opsf7i.ai](https://f7i.ai/blog/ai-tech-startups-in-manufacturing-moving-beyond-hype-to-roi-in-2026)
[16.The AI agent market map - CB Insights Researchcbinsights.com](https://www.cbinsights.com/research/ai-agent-market-map-2025/)
[17.Top 11 AI Agent Development Companies Leading Intelligent ... - LinkedInlinkedin.com](https://www.linkedin.com/pulse/top-11-ai-agent-development-companies-leading-2026-saurabh-sharma-5axbc)
[18.Watch FOX on FOX One – Stream TV Shows, Movies & Originalsfox.com](https://www.fox.com/hub/network/NWK-094354f7eaa55a5fb570aa8bdf1e1839/fox)
[19.2026 Edge AI Technology Report: Trends, Signals & Strategic Insightsmapegy.com](https://www.mapegy.com/reports/edge-ai-technology-report)
[20.TOP | English meaning - Cambridge Dictionarydictionary.cambridge.org](https://dictionary.cambridge.org/dictionary/english/top)
[21.Q2 2026 AI Agent Funding Map: Which Verticals Are Minting Unicorns—and ...agentmarketcap.ai](https://agentmarketcap.ai/blog/2026/04/08/aifundingtracker-q2-2026-top-50-ai-agent-startups-valuation-map)
[22.Forbes 2026 AI 50 List | Top Artificial Intelligence Companiesforbes.com](https://www.forbes.com/lists/ai50/)
[23.The 85 Hottest AI Agent Startups of 2026: Valuations and Who Is ...agentmarketcap.ai](https://agentmarketcap.ai/blog/2026/04/08/hottest-ai-agent-startups-2026-valuation-growth-map)
[24.TOP | definition in the Cambridge English Dictionarydictionary.cambridge.org](https://dictionary.cambridge.org/us/dictionary/english/top)
[25.SaaS Pricing Strategy Guide 2026: Per-Seat, Usage-Based, Outcome-Based ...nxcode.io](https://www.nxcode.io/resources/news/saas-pricing-strategy-guide-2026)

Discuss

Opens a new chat with this report as context.

Generated by Odysseus Deep Research · July 24, 2026 at 22:07

(function() {
// ESC closes the report tab. window.close() works when the tab was
// opened via window.open() (which is how the panel launches it). If the
// browser blocks self-close (rare — e.g. report opened by direct URL),
// fall back to history.back() so ESC still feels responsive.
document.addEventListener('keydown', function(e) {
if (e.key !== 'Escape' || e.defaultPrevented) return;
// Don't hijack ESC while typing in a field or with an open dropdown.
var t = e.target;
if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
var menu = document.getElementById('export-menu');
if (menu && menu.classList.contains('open')) { menu.classList.remove('open'); return; }
try { window.close(); } catch (err) {}
// window.close() is a no-op when the tab wasn't script-opened; in that
// case fall back to navigation so the key isn't ignored.
setTimeout(function() { if (!window.closed) history.back(); }, 50);
});
// Export dropdown toggle
var exportBtn = document.getElementById('btn-export');
var exportMenu = document.getElementById('export-menu');
exportBtn.addEventListener('click', function(e) {
e.stopPropagation();
exportMenu.classList.toggle('open');
});
document.addEventListener('click', function() { exportMenu.classList.remove('open'); });
// Save as PDF (browser print)
document.getElementById('btn-pdf').addEventListener('click', function() {
exportMenu.classList.remove('open');
window.print();
});
// Download HTML
document.getElementById('btn-html').addEventListener('click', function() {
exportMenu.classList.remove('open');
var blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
var a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = document.title.replace(/[^a-z0-9]+/gi, '-').substring(0, 60) + '.html';
a.click();
});
// Per-image hide — fades the image out, then POSTs to the backend so
// future renders of this report skip the URL. Falls back to a silent
// no-op if there's no session\_id (e.g. the report was opened from a
// saved-HTML download where the backend isn't reachable).
var \_\_sessionId = "rp-60276747576d";
// Unused scraped images — the reroll pool. Each is used at most once.
var \_\_spareImages = ["https://kxntech.com/api/og?title=State+of+Agentic+AI+2026&category=Original+Research&description=312+enterprise+respondents.+Adoption+rates%2C+ROI+data%2C+governance+requirements.", "https://hackernoon.imgix.net/images/7lpJUP1aTtg4wSlexBUA5Zvsx5S2-vee3b9u.png", "https://aifundingtracker.com/wp-content/uploads/2026/02/AI-Agent-Startups-1.png", "https://roboticsandautomationnews.com/wp-content/uploads/2026/07/plataine-industrial-image-1.png", "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgm59sIlYi-V5iEN5w\_kHcEz0zC8ThcmxExqEHajqn6oFXp0VV3x6wlEeOzvS3g\_o6KtZRn26kKjE9jxuqn3P3FLlmRDX\_DVBDFx\_dBF2hGN6XwjZ-CTc8VNsHDJtLLEJc6dP1I\_K2zFe1H01O4g-OXQWY1s0IcQvqScaIAkYZk95EickzJzqEaLblCi2s/w1200-h630-p-k-no-nu/Gemini\_Generated\_Image\_3atmf13atmf13atm.png", "https://images.prismic.io/factory-ai/aYKqdN0YXLCxVVes\_ai-tech-startups-hero.png?auto=format%2Ccompress&rect=0%2C0%2C1376%2C722&w=2400&h=1260", "https://research-assets.cbinsights.com/2025/11/10103116/AIAgents-MarketMap-112025-FI.png", "https://media.licdn.com/dms/image/v2/D5612AQHJq2zPNgBNKA/article-cover\_image-shrink\_720\_1280/B56ZyN9TCoIgAI-/0/1771908189806?e=2147483647&v=beta&t=HSZf\_dBXCJTMQ6iqoulCGpOghvKoePrm948JZUGyP1o", "https://static-media.fox.com/fmc/prod/network\_assets/FOX\_Color@3x.png", "https://dictionary.cambridge.org/external/images/og-image.png", "https://opengraph-image.blockeden.xyz/api/og-agentmarketcap-ai?title=Q2%202026%20AI%20Agent%20Funding%20Map%3A%20Which%20Verticals%20Are%20Minting%20Unicorns%E2%80%94and%20Which%202024%20Darlings%20Have%20Stalled", "https://www.forbes.com/dam/imageserve/69dfc661b968ebb871058b37/x.jpg", "https://opengraph-image.blockeden.xyz/api/og-agentmarketcap-ai?title=The%2085%20Hottest%20AI%20Agent%20Startups%20of%202026%3A%20Valuations%20and%20Who%20Is%20Breaking%20Out", "https://dictionary.cambridge.org/us/external/images/og-image.png"];
// Persist a rejected URL so future renders skip it.
function \_\_persistHide(url) {
if (!\_\_sessionId || !url) return;
fetch('/api/research/' + encodeURIComponent(\_\_sessionId) + '/hide-image', {
method: 'POST',
credentials: 'same-origin',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ url: url }),
}).catch(function(err) { console.warn('hide-image POST failed', err); });
}
// Once the pool is empty, there's nothing to swap to — hide all reroll btns.
function \_\_syncRerollAvailability() {
if (\_\_spareImages.length === 0) {
document.querySelectorAll('.img-reroll-btn').forEach(function(b) { b.disabled = true; });
}
}
document.querySelectorAll('.img-hide-btn').forEach(function(btn) {
btn.addEventListener('click', function(e) {
e.preventDefault(); e.stopPropagation();
var wrap = btn.closest('[data-img-url]');
if (!wrap) return;
var url = wrap.dataset.imgUrl;
wrap.classList.add('fading');
setTimeout(function() { wrap.remove(); }, 280);
\_\_persistHide(url);
});
});
// Reroll — swap the current image for the next unused scraped one, and
// persist-hide the rejected URL so it won't resurface on reload.
document.querySelectorAll('.img-reroll-btn').forEach(function(btn) {
btn.addEventListener('click', function(e) {
e.preventDefault(); e.stopPropagation();
// Per-button busy flag — a rapid double-click would otherwise both
// shift the spare pool, but only the second probe's image would land,
// silently consuming the first one. Bail until finish() clears it.
if (btn.dataset.\_busy === '1') return;
if (\_\_spareImages.length === 0) { btn.disabled = true; return; }
var wrap = btn.closest('[data-img-url]');
if (!wrap) return;
var img = wrap.querySelector('img');
if (!img) return;
btn.dataset.\_busy = '1';
var oldUrl = wrap.dataset.imgUrl;
var newUrl = \_\_spareImages.shift();
btn.classList.add('spinning');
// Swap once the new image has loaded (or failed) to avoid a flash of empty.
var probe = new Image();
var done = false;
var finish = function(ok) {
if (done) return; done = true;
btn.classList.remove('spinning');
delete btn.dataset.\_busy;
if (ok) {
img.src = newUrl;
wrap.dataset.imgUrl = newUrl;
\_\_persistHide(oldUrl);
} else {
// Bad candidate — persist-hide it so it can't resurface on reload,
// then try the next spare if any remain. Busy flag already cleared
// so the synthetic click below proceeds.
\_\_persistHide(newUrl);
if (\_\_spareImages.length) btn.click();
}
\_\_syncRerollAvailability();
};
probe.onload = function() { finish(true); };
probe.onerror = function() { finish(false); };
probe.src = newUrl;
});
});
\_\_syncRerollAvailability();
// "Show hidden (N)" button — clears the hidden\_images list on the
// server, then reloads the page so all images come back.
var restoreBtn = document.getElementById('btn-restore-images');
if (restoreBtn && \_\_sessionId) {
restoreBtn.addEventListener('click', function() {
restoreBtn.disabled = true;
restoreBtn.textContent = 'Restoring…';
fetch('/api/research/' + encodeURIComponent(\_\_sessionId) + '/unhide-images', {
method: 'POST', credentials: 'same-origin',
}).then(function() { window.location.reload(); })
.catch(function(err) {
restoreBtn.disabled = false;
restoreBtn.textContent = 'Failed — retry?';
console.warn('unhide-images POST failed', err);
});
});
}
// TOC: explicit smooth-scroll handler (some browsers/anchor plugins
// bypass the CSS `scroll-behavior: smooth` rule on hash clicks).
// Also keeps the URL hash updated and toggles an `.active` highlight.
var tocLinks = document.querySelectorAll('.toc-sidebar nav a[href^="#"]');
tocLinks.forEach(function(link) {
link.addEventListener('click', function(e) {
var id = link.getAttribute('href').slice(1);
var target = document.getElementById(id);
if (!target) return;
e.preventDefault();
target.scrollIntoView({ behavior: 'smooth', block: 'start' });
history.replaceState(null, '', '#' + id);
});
});
// Highlight the TOC entry that matches whichever heading is currently
// closest to the top of the viewport. IntersectionObserver keeps it
// cheap (no scroll listener spam).
var tocMap = {};
tocLinks.forEach(function(link) {
tocMap[link.getAttribute('href').slice(1)] = link;
});
var activeId = null;
function setActive(id) {
if (id === activeId) return;
if (activeId && tocMap[activeId]) tocMap[activeId].classList.remove('active');
if (id && tocMap[id]) tocMap[id].classList.add('active');
activeId = id;
}
var headings = document.querySelectorAll('.content h2[id], .content h3[id]');
if (headings.length && 'IntersectionObserver' in window) {
var visible = new Set();
var io = new IntersectionObserver(function(entries) {
entries.forEach(function(en) {
if (en.isIntersecting) visible.add(en.target.id);
else visible.delete(en.target.id);
});
// Pick the visible heading that's furthest down in document order
// before the current scroll — i.e. the section we're reading.
var current = null;
for (var i = 0; i < headings.length; i++) {
if (visible.has(headings[i].id)) { current = headings[i].id; break; }
}
if (current) setActive(current);
}, { rootMargin: '-10% 0px -75% 0px', threshold: 0 });
headings.forEach(function(h) { io.observe(h); });
}
// Chat about this research — POST to spinoff and redirect to the new chat
var chatBtn = document.getElementById('btn-chat-about');
if (chatBtn) {
chatBtn.addEventListener('click', function() {
var researchId = chatBtn.dataset.researchId;
if (!researchId) return;
var origLabel = chatBtn.innerHTML;
chatBtn.disabled = true;
chatBtn.innerHTML = '<span>Creating chat…</span>';
fetch('/api/research/spinoff/' + encodeURIComponent(researchId), {
method: 'POST', credentials: 'same-origin',
}).then(function(res) {
if (!res.ok) {
return res.json().then(function(d) {
throw new Error(d && d.detail ? d.detail : ('HTTP ' + res.status));
}, function() { throw new Error('HTTP ' + res.status); });
}
return res.json();
}).then(function(data) {
if (!data || !data.session\_id) {
throw new Error('Server did not return a session id');
}
var url = '/#' + data.session\_id;
var opened = false;
// The report typically opens in a new tab — if we have access to the
// original Odysseus tab, navigate it and close this report tab so the
// user lands directly in the new chat.
try {
if (window.opener && !window.opener.closed) {
window.opener.location.href = url;
window.opener.location.reload();
window.opener.focus();
opened = true;
window.close();
}
} catch (e) { /\* cross-origin or detached opener — fall through \*/ }
if (!opened) {
// No opener (report was opened directly via URL) — open the chat in a
// new tab so the report stays available.
var w = window.open(url, '\_blank');
if (w) {
chatBtn.disabled = false;
chatBtn.innerHTML = '<span>Chat opened in new tab</span>';
} else {
// Popup blocked — navigate this tab as a last resort.
window.location.href = url;
window.location.reload();
}
}
}).catch(function(err) {
chatBtn.disabled = false;
chatBtn.innerHTML = origLabel;
alert('Could not start follow-up chat: ' + err.message);
});
});
}
})();
// Colorize comparison table cells
if (document.body.classList.contains('category-comparison')) {
const pos = /^(yes|excellent|best|great|strong|fast|high|superior|winner|free|unlimited|native|full|advanced|built[- ]in|✓|✅|⭐)/i;
const neg = /^(no|none|poor|weak|slow|low|limited|lacking|missing|basic|minimal|✗|❌|N\/A$)/i;
const mid = /^(moderate|average|fair|partial|some|decent|okay|mixed|varies|depends)/i;
document.querySelectorAll('.content table td').forEach(td => {
if (td.cellIndex === 0) return;
const t = td.textContent.trim();
if (pos.test(t)) td.classList.add('cmp-pos');
else if (neg.test(t)) td.classList.add('cmp-neg');
else if (mid.test(t)) td.classList.add('cmp-mid');
});
}
