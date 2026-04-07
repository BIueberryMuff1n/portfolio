"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "hierarchy" | "dataflow" | "simulator";

type OutputKey =
  | "weekly-email"
  | "sales-report"
  | "ad-performance"
  | "pptx-slide"
  | "inventory-alert"
  | "cowork-route";

// ─── Skills Data ─────────────────────────────────────────────────────────────

const FOUNDATION_SKILLS = [
  {
    id: "amazon-data",
    name: "AmazonDataReader",
    desc: "Connects to your MCP database. Normalizes raw Seller Central exports into structured JSON every skill can read.",
    color: "#6366f1",
    icon: "🗄️",
  },
  {
    id: "brand-voice",
    name: "BrandVoice",
    desc: "Single source of truth for tone, formatting rules, and brand terminology. Change it once — every downstream output updates.",
    color: "#8b5cf6",
    icon: "✍️",
  },
  {
    id: "output-formatter",
    name: "OutputFormatter",
    desc: "Routes final output to the right format: Markdown, PPTX JSON schema, HTML email, or plain text.",
    color: "#a78bfa",
    icon: "📤",
  },
];

const COMPOSITE_SKILLS = [
  {
    id: "sales-analyst",
    name: "SalesAnalyst",
    desc: "Revenue trends, ASIN performance, period-over-period comparisons. Calls AmazonDataReader + BrandVoice.",
    color: "#0ea5e9",
    icon: "📈",
    deps: ["amazon-data", "brand-voice"],
  },
  {
    id: "ad-performance",
    name: "AdPerformance",
    desc: "ACOS, ROAS, keyword efficiency analysis. Surfaces spend waste and bid recommendations.",
    color: "#06b6d4",
    icon: "🎯",
    deps: ["amazon-data", "brand-voice"],
  },
  {
    id: "inventory-ops",
    name: "InventoryOps",
    desc: "Reorder forecasting, stockout risk scoring, IPI impact modeling. Alerts before the problem hits.",
    color: "#0891b2",
    icon: "📦",
    deps: ["amazon-data", "output-formatter"],
  },
  {
    id: "account-health",
    name: "AccountHealth",
    desc: "Monitors policy compliance, review velocity, listing suppression risk.",
    color: "#0e7490",
    icon: "🛡️",
    deps: ["amazon-data", "brand-voice"],
  },
];

const OUTPUT_SKILLS = [
  {
    id: "client-report",
    name: "ClientReportGenerator",
    desc: "Full monthly PDF-ready report. Pulls from all four department composites, formats in brand voice.",
    color: "#10b981",
    icon: "📋",
    deps: ["sales-analyst", "ad-performance", "inventory-ops", "account-health"],
  },
  {
    id: "pptx-builder",
    name: "PowerPointBuilder",
    desc: "Generates slide-ready JSON from department data. Drop into your template — 60-second deck.",
    color: "#059669",
    icon: "📊",
    deps: ["sales-analyst", "ad-performance"],
  },
  {
    id: "weekly-email",
    name: "WeeklyEmailDigest",
    desc: "Auto-sends Monday morning. 5 KPIs, 3 insights, 1 action item per client. No manual work.",
    color: "#047857",
    icon: "📧",
    deps: ["sales-analyst", "inventory-ops"],
  },
  {
    id: "cowork-router",
    name: "CoworkTaskOrchestrator",
    desc: "Routes any team message to the right skill. 'Pull last week's ad report for Client X' → AdPerformance → formatted output.",
    color: "#065f46",
    icon: "🤖",
    deps: ["sales-analyst", "ad-performance", "inventory-ops", "account-health"],
  },
];

// ─── Live Output Data ─────────────────────────────────────────────────────────

const OUTPUTS: Record<OutputKey, { label: string; skill: string; icon: string; content: string }> = {
  "weekly-email": {
    label: "Weekly Email Digest",
    skill: "WeeklyEmailDigest",
    icon: "📧",
    content: `Subject: Atlas Weekly | Client: Horizon Supplements | Week of Apr 7

Hi Sarah,

Here's your Amazon performance snapshot for the week.

📈 REVENUE
$142,380 (+12.4% WoW) — driven by ASIN B09XKZP2R1 (Creatine 500g)
Top performer: "Grass-Fed Whey 2lb" up 31% after bid adjustment

🎯 AD EFFICIENCY
Blended ACOS: 18.2% (target: <22%) ✓
ROAS: 4.8x — 3 keywords flagged for budget increase
Wasted spend eliminated: $840 from 12 low-CTR terms

📦 INVENTORY ALERT
"Magnesium Glycinate 120ct" — 18 days of cover remaining
Recommended reorder: 2,400 units by Apr 14

🛡️ ACCOUNT HEALTH
No policy violations. 2 new reviews (4.8 avg this week).

ACTION: Review the Magnesium reorder before Friday.

— Your Atlas AI System`,
  },
  "sales-report": {
    label: "Sales Analysis Report",
    skill: "SalesAnalyst",
    icon: "📈",
    content: `SALES ANALYSIS — Horizon Supplements
Period: Mar 1–31, 2026 vs Feb 1–28, 2026

EXECUTIVE SUMMARY
Total Revenue: $589,240 (+8.7% MoM)
Units Sold: 14,820 (+6.2% MoM)
Average Order Value: $39.76 (+2.3% MoM)

TOP PERFORMERS
1. Creatine Monohydrate 500g — $124,500 (21.1% of revenue)
   → +18.4% MoM. Capitalize on Q2 fitness season.
2. Grass-Fed Whey Protein 2lb — $98,200 (16.7%)
   → +11.2% MoM. Bundle opportunity with shakers.
3. Omega-3 Fish Oil 120ct — $76,800 (13.0%)
   → -2.1% MoM. Review listing content for refresh.

UNDERPERFORMERS (flagged for review)
• Electrolyte Powder Mix — $12,400 (-28% MoM)
  Likely cause: price increase + competitor entry

RECOMMENDED ACTIONS
1. Increase Creatine ad budget 15% through May
2. Launch Whey + Shaker bundle at $59.99
3. Audit Electrolyte listing — consider promo`,
  },
  "ad-performance": {
    label: "Ad Performance Report",
    skill: "AdPerformance",
    icon: "🎯",
    content: `AD PERFORMANCE ANALYSIS — Horizon Supplements
Period: Apr 1–6, 2026

CAMPAIGN SUMMARY
Total Ad Spend: $18,420
Total Ad Revenue: $88,400
Blended ACOS: 20.8% | ROAS: 4.8x

HIGH-EFFICIENCY KEYWORDS (increase bids)
"creatine monohydrate unflavored" — ACOS 11.2%, 840 clicks
"grass fed whey protein" — ACOS 14.8%, 612 clicks
"magnesium glycinate sleep" — ACOS 16.1%, 290 clicks

WASTED SPEND (pause or reduce)
"protein powder best" — $340 spend, 0 conversions
"supplements amazon" — $290 spend, 1.2% CTR
"creatine supplement" (broad) — $210 spend, ACOS 84%

BUDGET REALLOCATION RECOMMENDATION
Move $840 from low-performers to top 3 keywords.
Projected ROAS improvement: 4.8x → 5.6x

COMPETITOR ALERT
New entrant "PureBulk" ranking #3 for "creatine 500g".
Recommend defensive SB campaign.`,
  },
  "pptx-slide": {
    label: "PowerPoint Slide Content",
    skill: "PowerPointBuilder",
    icon: "📊",
    content: `SLIDE DECK JSON OUTPUT
Client: Horizon Supplements | Monthly Business Review

─── SLIDE 1: Executive Summary ───
Title: "March 2026 Performance Overview"
Headline stat: $589K Revenue (+8.7%)
3 bullets:
  • Record Creatine sales driven by Q2 fitness demand
  • Ad efficiency at 20.8% ACOS — on target
  • 1 inventory risk: Magnesium reorder needed by Apr 14

─── SLIDE 2: Revenue Breakdown ───
Chart type: Horizontal bar (by ASIN)
Top 3 products + % of total revenue
Callout: "Whey bundle opportunity = +$18K/mo potential"

─── SLIDE 3: Advertising ───
Chart type: ACOS trend line (12 weeks)
KPIs: ROAS 4.8x | Spend $18.4K | Revenue $88.4K
Action: Reallocate $840 from wasted spend

─── SLIDE 4: Next 30 Days ───
Priority 1: Creatine budget increase (+15%)
Priority 2: Launch Whey + Shaker bundle
Priority 3: Resolve Electrolyte listing decline`,
  },
  "inventory-alert": {
    label: "Inventory Alert",
    skill: "InventoryOps",
    icon: "📦",
    content: `INVENTORY OPERATIONS ALERT
Generated: Apr 7, 2026 | Client: Horizon Supplements

🔴 URGENT — 18 Days Cover Remaining
ASIN: B08RVMZ91X | Magnesium Glycinate 120ct
Current FBA Stock: 1,440 units
Daily Velocity: 80 units/day
Estimated Stockout: Apr 25, 2026

RECOMMENDED ACTION
Reorder Qty: 2,400 units (30-day cover + safety stock)
Ship By: Apr 14 to clear Amazon receiving window
Supplier Lead Time: 7–10 days → ORDER TODAY

IPI IMPACT
Current IPI Score: 524 (Good)
Stockout risk to IPI: -40 to -60 points
At-risk revenue if out of stock: ~$14,400 (18 days × $800/day)

SECONDARY ALERTS
⚠️  Omega-3 Fish Oil — 31 days cover (monitor)
✅  Creatine 500g — 68 days cover (healthy)
✅  Grass-Fed Whey — 45 days cover (healthy)

Auto-alert sent to: sarah@horizonsupplements.com`,
  },
  "cowork-route": {
    label: "Cowork Task Routing",
    skill: "CoworkTaskOrchestrator",
    icon: "🤖",
    content: `COWORK TASK ORCHESTRATION LOG
Channel: #amazon-ops | User: @jake

───────────────────────────────────────────
INPUT (Jake's message):
"Can someone pull last week's ad performance
for Horizon? Need ACOS and top keywords for
our call at 2pm."
───────────────────────────────────────────

ORCHESTRATOR ANALYSIS
Intent: Ad performance report
Client: Horizon Supplements (matched from context)
Period: Last 7 days (inferred from "last week")
Output needed: ACOS + keyword table

SKILL ROUTING
→ AmazonDataReader.fetch(client="horizon",
    period="7d", scope="advertising")
→ AdPerformance.analyze(data, focus="acos,keywords")
→ OutputFormatter.render(format="slack_message")

EXECUTION TIME: 4.2 seconds

OUTPUT POSTED TO #amazon-ops:
"@jake — Horizon ad performance (Apr 1–6):
 ACOS: 20.8% ✓ | ROAS: 4.8x
 Top keyword: 'creatine monohydrate unflavored' (11.2% ACOS)
 Full report: [link] — ready for your 2pm call"`,
  },
};

// ─── Hierarchy Tab ─────────────────────────────────────────────────────────

function SkillCard({
  name,
  desc,
  color,
  icon,
  delay = 0,
}: {
  name: string;
  desc: string;
  color: string;
  icon: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-lg border p-3 text-left hover:scale-[1.02] transition-transform duration-200 cursor-default"
      style={{ borderColor: color + "40", backgroundColor: color + "10" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <span className="font-mono text-xs font-semibold" style={{ color }}>
          {name}
        </span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function LayerLabel({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="text-right pr-4 pt-2 min-w-[120px]">
      <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">{label}</div>
      <div className="text-[10px] text-slate-500 mt-0.5">{sublabel}</div>
    </div>
  );
}

function HierarchyTab() {
  return (
    <div className="space-y-6">
      {/* Layer 1: Foundation */}
      <div className="flex gap-4 items-start">
        <LayerLabel label="Foundation" sublabel="Layer 1 — reference skills" />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FOUNDATION_SKILLS.map((s, i) => (
            <SkillCard key={s.id} {...s} delay={i * 0.08} />
          ))}
        </div>
      </div>

      {/* Connector arrows */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-1">
          <div className="text-slate-600 text-xs">composites inherit from foundation</div>
          <div className="flex gap-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                className="text-slate-600 text-lg"
              >
                ↓
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer 2: Department Composites */}
      <div className="flex gap-4 items-start">
        <LayerLabel label="Composites" sublabel="Layer 2 — department skills" />
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COMPOSITE_SKILLS.map((s, i) => (
            <SkillCard key={s.id} {...s} delay={0.3 + i * 0.08} />
          ))}
        </div>
      </div>

      {/* Connector arrows */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-1">
          <div className="text-slate-600 text-xs">output skills orchestrate composites</div>
          <div className="flex gap-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
                className="text-slate-600 text-lg"
              >
                ↓
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer 3: Output Skills */}
      <div className="flex gap-4 items-start">
        <LayerLabel label="Outputs" sublabel="Layer 3 — deliverable skills" />
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {OUTPUT_SKILLS.map((s, i) => (
            <SkillCard key={s.id} {...s} delay={0.6 + i * 0.08} />
          ))}
        </div>
      </div>

      {/* Reuse callout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4 text-sm text-slate-300"
      >
        <span className="font-semibold text-indigo-400">Why it matters: </span>
        Update <span className="font-mono text-purple-400">BrandVoice</span> once and all 8 downstream
        skills — every report, email, and slide — instantly reflect your new tone. No hunting through
        prompts.
      </motion.div>
    </div>
  );
}

// ─── Data Flow Tab ─────────────────────────────────────────────────────────

const DATA_FLOW_STEPS = [
  { label: "Amazon Seller Central", desc: "Raw sales, ad, inventory exports", color: "#f59e0b", icon: "🏪" },
  { label: "MCP Database", desc: "Structured warehouse via Model Context Protocol", color: "#6366f1", icon: "🗄️" },
  { label: "AmazonDataReader", desc: "Foundation skill normalizes data into typed JSON", color: "#8b5cf6", icon: "⚙️" },
  { label: "Department Skills", desc: "SalesAnalyst, AdPerformance, InventoryOps pull normalized data", color: "#0ea5e9", icon: "🏢" },
  { label: "Output Skills", desc: "ClientReport, PPTX, Email, Cowork compose final deliverables", color: "#10b981", icon: "📤" },
  { label: "Client Deliverable", desc: "Report, slide deck, email, or Slack message — ready in seconds", color: "#f472b6", icon: "✅" },
];

function DataFlowTab() {
  const [step, setStep] = useState(0);
  const steps = DATA_FLOW_STEPS;

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % DATA_FLOW_STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Flow diagram */}
      <div className="relative">
        <div className="flex flex-col gap-0">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: step === i ? 1.02 : 1,
                  borderColor: step === i ? s.color : s.color + "30",
                  backgroundColor: step === i ? s.color + "20" : s.color + "08",
                }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg mx-auto rounded-lg border p-3 flex items-center gap-3"
              >
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="font-semibold text-sm" style={{ color: step === i ? s.color : "#94a3b8" }}>
                    {s.label}
                  </div>
                  <div className="text-xs text-slate-500">{s.desc}</div>
                </div>
                {step === i && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                )}
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  animate={{ opacity: step === i ? 1 : 0.3 }}
                  className="text-slate-600 text-xl my-1"
                >
                  ↓
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MCP callout */}
      <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4 space-y-2">
        <div className="text-sm font-semibold text-indigo-400">MCP: Model Context Protocol</div>
        <p className="text-xs text-slate-400 leading-relaxed">
          MCP is Claude&apos;s native database connection protocol. Instead of pasting CSV data into
          prompts, <span className="font-mono text-purple-400">AmazonDataReader</span> queries your
          live database directly — structured, typed, always current. This is what makes the system
          scale across 50+ clients without manual data prep.
        </p>
      </div>

      {/* Cowork callout */}
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
        <div className="text-sm font-semibold text-emerald-400">Cowork Task Orchestration</div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Team members trigger the full pipeline with a single Slack message.{" "}
          <span className="font-mono text-emerald-400">CoworkTaskOrchestrator</span> parses intent,
          selects the right skill chain, and posts formatted output back to the channel — no dashboards,
          no manual queries, no waiting.
        </p>
      </div>
    </div>
  );
}

// ─── Simulator Tab ─────────────────────────────────────────────────────────

function SimulatorTab() {
  const [selected, setSelected] = useState<OutputKey>("weekly-email");
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [generated, setGenerated] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const output = OUTPUTS[selected];

  function runSimulation() {
    if (isGenerating) return;
    setIsGenerating(true);
    setDisplayedText("");
    setGenerated(false);

    const fullText = output.content;
    let index = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      index += 3;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(intervalRef.current!);
        setIsGenerating(false);
        setGenerated(true);
      }
    }, 16);
  }

  // Reset on tab change
  useEffect(() => {
    setDisplayedText("");
    setIsGenerating(false);
    setGenerated(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [selected]);

  const outputKeys = Object.keys(OUTPUTS) as OutputKey[];

  return (
    <div className="space-y-4">
      {/* Selector */}
      <div className="flex flex-wrap gap-2">
        {outputKeys.map((key) => {
          const o = OUTPUTS[key];
          return (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
              style={
                selected === key
                  ? { borderColor: "#6366f1", backgroundColor: "#6366f110", color: "#a5b4fc" }
                  : { borderColor: "#334155", backgroundColor: "transparent", color: "#64748b" }
              }
            >
              <span>{o.icon}</span>
              {o.label}
            </button>
          );
        })}
      </div>

      {/* Skill badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Skill:</span>
        <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded">
          {output.skill}
        </span>
      </div>

      {/* Output panel */}
      <div className="rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800/50">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{output.label}</span>
          {generated && (
            <span className="text-[10px] text-emerald-400 font-mono">● generated</span>
          )}
        </div>

        <div className="p-4 min-h-[240px] font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
          {displayedText || (
            <span className="text-slate-600 italic">
              Select a skill output above, then click Generate to see it run.
            </span>
          )}
          {isGenerating && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-1.5 h-3.5 bg-indigo-400 ml-0.5 align-middle"
            />
          )}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={runSimulation}
        disabled={isGenerating}
        className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50"
        style={{
          background: isGenerating
            ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "white",
          boxShadow: isGenerating ? "none" : "0 0 20px #6366f130",
        }}
      >
        {isGenerating ? "Generating…" : generated ? "Run Again" : `Generate ${output.label}`}
      </button>

      <p className="text-[10px] text-slate-600 text-center">
        This simulates the output each skill produces. In production, data is pulled live from your MCP
        database — no manual input required.
      </p>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function ClaudeSkillsArchitecturePage() {
  const [activeTab, setActiveTab] = useState<Tab>("hierarchy");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "hierarchy", label: "Skills Hierarchy", icon: "🏗️" },
    { id: "dataflow", label: "Data Flow", icon: "🔄" },
    { id: "simulator", label: "Live Simulator", icon: "▶️" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🧠</span>
              <h1 className="font-bold text-lg">Claude Skills Architecture</h1>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                DEMO
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Amazon reporting system · Reusable skills · MCP database · Cowork orchestration
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500">built for</div>
            <div className="text-xs font-mono text-slate-400">Claude AI Consultant proposal</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
              style={
                activeTab === tab.id
                  ? { backgroundColor: "#6366f120", color: "#a5b4fc", borderColor: "#6366f140" }
                  : { color: "#64748b" }
              }
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "hierarchy" && <HierarchyTab />}
            {activeTab === "dataflow" && <DataFlowTab />}
            {activeTab === "simulator" && <SimulatorTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            This architecture is based on real systems I built at{" "}
            <span className="text-slate-500">Atlas</span> — managing $300K+/month in operations across
            21 tools.
          </div>
          <a
            href="/"
            className="text-indigo-500 hover:text-indigo-400 transition-colors font-medium shrink-0"
          >
            ← Back to portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
