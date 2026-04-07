"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "idle" | "running" | "complete";
type SkillState = "idle" | "active" | "complete";
type DataTab = "overview" | "asins" | "ppc" | "inventory";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ASINS = [
  { asin: "B0CK2X9M1", product: "Vitamin C Serum 30ml",        units: 412, revenue: 16068, margin: 62, bsr: 1847  },
  { asin: "B0CK3Y8N2", product: "Retinol Night Cream 50ml",    units: 289, revenue: 11271, margin: 58, bsr: 3214  },
  { asin: "B0CK4Z7P3", product: "Hyaluronic Acid Moisturizer", units: 234, revenue:  8190, margin: 55, bsr: 5891  },
  { asin: "B0CK5A6Q4", product: "Niacinamide Toner 200ml",     units: 187, revenue:  6545, margin: 64, bsr: 8432  },
  { asin: "B0CK6B5R5", product: "Collagen Eye Cream 15ml",     units: 125, revenue:  5758, margin: 71, bsr: 12108 },
];

const INVENTORY = [
  { product: "Vitamin C Serum 30ml",        units: 1847, days:  32, status: "warn"     as const },
  { product: "Retinol Night Cream 50ml",    units: 3214, days:  78, status: "ok"       as const },
  { product: "Hyaluronic Acid Moisturizer", units:  891, days:  27, status: "critical" as const },
  { product: "Niacinamide Toner 200ml",     units: 2108, days:  79, status: "ok"       as const },
  { product: "Collagen Eye Cream 15ml",     units: 4321, days: 242, status: "excess"   as const },
];

const SKILLS = [
  {
    id: "data-reader",
    name: "AmazonDataReader",
    desc: "Parses raw Seller Central exports into structured JSON metrics",
    color: "#6366f1",
    steps: [
      "Connecting to Seller Central feed...",
      "Parsing 7-day window [Mar 31–Apr 6]...",
      "Normalizing 5 ASIN records...",
      "Structuring inventory health data...",
      "Building PPC attribution map...",
      "JSON payload ready ✓",
    ],
    duration: 2400,
  },
  {
    id: "brand-voice",
    name: "BrandVoice",
    desc: "Applies TerraGlow's tone — professional, data-driven, action-oriented",
    color: "#8b5cf6",
    steps: [
      "Loading TerraGlow brand profile...",
      "Tone: professional + action-oriented...",
      "Calibrating terminology rules...",
      "Brand voice applied ✓",
    ],
    duration: 1600,
  },
  {
    id: "report-gen",
    name: "WeeklyReportGenerator",
    desc: "Composes the final branded report with KPIs, insights, action items",
    color: "#22d3ee",
    steps: [
      "Composing executive summary...",
      "Rendering KPI dashboard...",
      "Identifying top performer...",
      "Prioritizing action items...",
      "Writing ad insights...",
      "Report finalized ✓",
    ],
    duration: 2800,
  },
];

// Skill 0: t=0→2400  |  Skill 1: t=2400→4000  |  Skill 2: t=4000→6800
// Section reveal: t=2400 (s0), t=2800 (s1), t=4000 (s2), t=4400 (s3), t=6800 (s4), t=7200 (s5)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt$(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n}`;
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ─── Left Panel ───────────────────────────────────────────────────────────────

function OverviewTab() {
  const stats = [
    { label: "Total Revenue",   value: "$47,832", note: "↑ +12.3% WoW", noteColor: "#10b981", color: "#10b981" },
    { label: "Units Sold",      value: "1,247",   note: "last 7 days",   noteColor: "#94a3b8",  color: "#22d3ee" },
    { label: "Avg Order Value", value: "$38.36",  note: "↑ +2.1%",       noteColor: "#10b981", color: "#8b5cf6" },
    { label: "Week-over-Week",  value: "+12.3%",  note: "revenue growth",noteColor: "#10b981", color: "#10b981" },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border p-3"
            style={{ borderColor: s.color + "30", background: s.color + "0d" }}
          >
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">{s.label}</div>
            <div className="font-mono text-lg font-bold leading-none" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] mt-1.5" style={{ color: s.noteColor }}>{s.note}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-amber-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[9px] font-mono text-amber-400/70 uppercase tracking-widest">Live Data Source</span>
        </div>
        <div className="text-[10px] text-slate-500 space-y-0.5">
          <div>Brand: <span className="text-slate-400">TerraGlow Skincare</span></div>
          <div>Period: <span className="text-slate-400">Mar 31 – Apr 6, 2026</span></div>
          <div>Marketplace: <span className="text-slate-400">Amazon US</span></div>
        </div>
      </div>
    </div>
  );
}

function ASINsTab() {
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 px-1 pb-1 border-b border-slate-800">
        {["Product", "Rev", "Margin", "BSR"].map((h) => (
          <div key={h} className="text-[9px] font-mono text-slate-600 uppercase tracking-wider text-right first:text-left">{h}</div>
        ))}
      </div>
      {ASINS.map((a, i) => {
        const marginColor = a.margin >= 65 ? "#10b981" : a.margin >= 60 ? "#f59e0b" : "#94a3b8";
        return (
          <motion.div
            key={a.asin}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 px-1 py-1.5 rounded border border-transparent hover:border-slate-800 hover:bg-slate-900/30 transition-colors"
          >
            <div>
              <div className="text-xs text-slate-300 truncate leading-tight">{a.product}</div>
              <div className="text-[9px] font-mono text-slate-600 mt-0.5">{a.asin}</div>
            </div>
            <div className="text-right font-mono text-xs text-emerald-400 self-center">{fmt$(a.revenue)}</div>
            <div className="text-right font-mono text-xs font-bold self-center" style={{ color: marginColor }}>{a.margin}%</div>
            <div className="text-right font-mono text-[10px] text-slate-500 self-center">#{a.bsr.toLocaleString()}</div>
          </motion.div>
        );
      })}
      <div className="pt-1 text-[9px] font-mono text-slate-600 px-1">
        Total: 1,247 units · Avg margin: 62% · 5 active ASINs
      </div>
    </div>
  );
}

function PPCTab() {
  const primary = [
    { label: "Ad Spend",   value: "$4,231",  sub: "this week",     color: "#f59e0b" },
    { label: "Ad Revenue", value: "$14,809", sub: "attributed",    color: "#10b981" },
    { label: "ACoS",       value: "28.6%",   sub: "target <30% ✓", color: "#10b981" },
    { label: "TACoS",      value: "8.8%",    sub: "blended",       color: "#10b981" },
    { label: "ROAS",       value: "3.50×",   sub: "return on ad",  color: "#10b981" },
  ];
  const secondary = [
    { label: "Impressions", value: "892,431" },
    { label: "Clicks",      value: "12,847"  },
    { label: "CTR",         value: "1.44%",  sub: "avg 0.9%" },
    { label: "CPC",         value: "$0.33",  sub: "↓ from $0.38" },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1.5">
        {primary.map((m) => (
          <div key={m.label} className="rounded-lg border border-slate-800 bg-slate-900/40 p-2">
            <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">{m.label}</div>
            <div className="font-mono font-bold text-sm mt-1 leading-none" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[9px] mt-1" style={{ color: m.color + "80" }}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">Click Metrics</div>
        <div className="grid grid-cols-2 gap-1.5">
          {secondary.map((m) => (
            <div key={m.label} className="flex items-center justify-between rounded border border-slate-800/50 bg-slate-900/20 px-2.5 py-1.5">
              <span className="text-[10px] text-slate-500">{m.label}</span>
              <div className="text-right">
                <div className="font-mono text-xs text-slate-300">{m.value}</div>
                {m.sub && <div className="text-[9px] text-emerald-500/60">{m.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InventoryTab() {
  const cfg = {
    ok:       { color: "#10b981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)",  icon: "✓", label: "HEALTHY"  },
    warn:     { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)",  icon: "⚠", label: "REORDER"  },
    critical: { color: "#ef4444", bg: "rgba(239,68,68,0.10)",   border: "rgba(239,68,68,0.25)",  icon: "●", label: "LOW STOCK"},
    excess:   { color: "#f59e0b", bg: "rgba(245,158,11,0.06)",  border: "rgba(245,158,11,0.15)", icon: "⚠", label: "EXCESS"   },
  };
  return (
    <div className="space-y-2">
      {INVENTORY.map((item, i) => {
        const c = cfg[item.status];
        return (
          <motion.div
            key={item.product}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="rounded-lg border p-3 flex items-center justify-between gap-3"
            style={{ borderColor: c.border, background: c.bg }}
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-300 truncate">{item.product}</div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                {item.units.toLocaleString()} units · <span style={{ color: item.days < 30 ? "#ef4444" : item.days > 120 ? "#f59e0b" : "#94a3b8" }}>{item.days} days</span>
              </div>
            </div>
            <div className="text-[10px] font-mono font-bold flex-shrink-0 flex items-center gap-1" style={{ color: c.color }}>
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </div>
          </motion.div>
        );
      })}
      <div className="text-[9px] font-mono text-slate-600 pt-0.5">2 items need immediate PO action</div>
    </div>
  );
}

function DataPanel() {
  const [tab, setTab] = useState<DataTab>("overview");
  const tabs: { id: DataTab; label: string }[] = [
    { id: "overview",   label: "Overview"   },
    { id: "asins",      label: "ASINs"      },
    { id: "ppc",        label: "PPC"        },
    { id: "inventory",  label: "Inventory"  },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-5 pt-5 pb-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-sm bg-amber-500/80" />
          <span className="text-[9px] font-mono text-amber-400/60 uppercase tracking-widest">Input</span>
        </div>
        <div className="text-sm font-display font-semibold text-slate-200">Amazon Seller Central</div>
        <div className="text-[11px] text-slate-500 mt-0.5">TerraGlow Skincare · Mar 31 – Apr 6, 2026</div>
      </div>

      <div className="flex-shrink-0 flex gap-0.5 px-5 pt-3 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-2.5 py-1 text-[11px] rounded-md font-medium transition-all duration-200"
            style={
              tab === t.id
                ? { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }
                : { color: "#475569" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-shrink-0 mx-5 h-px bg-slate-800/60" />

      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {tab === "overview"  && <OverviewTab  />}
            {tab === "asins"     && <ASINsTab     />}
            {tab === "ppc"       && <PPCTab       />}
            {tab === "inventory" && <InventoryTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Pipeline Panel ───────────────────────────────────────────────────────────

function SkillCard({
  skill,
  state,
  currentStep,
  index,
}: {
  skill: typeof SKILLS[number];
  state: SkillState;
  currentStep: string;
  index: number;
}) {
  const isActive   = state === "active";
  const isComplete = state === "complete";

  return (
    <motion.div
      animate={{
        borderColor: isActive   ? skill.color + "70"
                   : isComplete ? "rgba(16,185,129,0.35)"
                   : "rgba(255,255,255,0.06)",
        background:  isActive   ? skill.color + "10"
                   : isComplete ? "rgba(16,185,129,0.06)"
                   : "rgba(255,255,255,0.02)",
      }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border p-3.5 relative overflow-hidden"
    >
      {/* Header row */}
      <div className="flex items-start gap-2.5">
        <div
          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold mt-0.5 transition-all duration-300"
          style={{
            background: isActive   ? skill.color + "25"
                       : isComplete ? "rgba(16,185,129,0.2)"
                       : "rgba(255,255,255,0.05)",
            color: isActive   ? skill.color
                 : isComplete ? "#10b981"
                 : "#475569",
          }}
        >
          {isComplete ? "✓" : index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-mono text-xs font-semibold truncate transition-colors duration-300"
            style={{
              color: isActive   ? skill.color
                   : isComplete ? "#10b981"
                   : "#475569",
            }}
          >
            {skill.name}
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{skill.desc}</div>
        </div>
      </div>

      {/* Active: progress + step text */}
      {isActive && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2.5 space-y-2">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}cc)` }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: skill.duration / 1000, ease: "linear" }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: skill.color }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
            />
            <span className="text-[10px] font-mono" style={{ color: skill.color + "cc" }}>
              {currentStep}
            </span>
          </div>
        </motion.div>
      )}

      {/* Complete state */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1.5 text-[10px] font-mono text-emerald-500/60"
        >
          ● complete
        </motion.div>
      )}

      {/* Glow pulse when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ boxShadow: `inset 0 0 24px ${skill.color}18` }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

function PipelinePanel({
  phase,
  skillStates,
  skillCurrentSteps,
  onGenerate,
}: {
  phase: Phase;
  skillStates: SkillState[];
  skillCurrentSteps: string[];
  onGenerate: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-5 pt-5 pb-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-sm bg-purple-500/80" />
          <span className="text-[9px] font-mono text-purple-400/60 uppercase tracking-widest">Pipeline</span>
        </div>
        <div className="text-sm font-display font-semibold text-slate-200">Claude Skills</div>
        <div className="text-[11px] text-slate-500 mt-0.5">3 skills · sequential</div>
      </div>

      <div className="flex-shrink-0 mx-5 mt-3 h-px bg-slate-800/60" />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-3 space-y-2">
        {SKILLS.map((skill, i) => (
          <div key={skill.id}>
            <SkillCard
              skill={skill}
              state={skillStates[i]}
              currentStep={skillCurrentSteps[i]}
              index={i}
            />
            {i < SKILLS.length - 1 && (
              <div className="flex justify-center my-1.5">
                <motion.div
                  className="text-slate-700 text-sm leading-none select-none"
                  animate={{
                    opacity: skillStates[i] === "complete" ? [0.5, 1, 0.5] : 0.2,
                    y:       skillStates[i] === "complete" ? [0, 3, 0] : 0,
                  }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  ↓
                </motion.div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 px-5 pb-5 pt-2 space-y-2">
        <button
          onClick={onGenerate}
          disabled={phase === "running"}
          className="w-full py-3 rounded-xl font-display font-semibold text-sm text-white transition-all duration-300 disabled:cursor-not-allowed relative overflow-hidden"
          style={{
            background:
              phase === "running"
                ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                : phase === "complete"
                ? "linear-gradient(135deg, #059669, #10b981)"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow:
              phase === "running"
                ? "none"
                : phase === "complete"
                ? "0 0 24px rgba(16,185,129,0.3)"
                : "0 0 28px rgba(139,92,246,0.4)",
          }}
        >
          {phase === "running" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
          )}
          <span className="relative">
            {phase === "running"  ? "Processing…"
           : phase === "complete" ? "↺ Regenerate"
           :                        "Generate Report"}
          </span>
        </button>

        <AnimatePresence>
          {phase === "complete" && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-[10px] font-mono text-emerald-500/60"
            >
              ● Generated in 6.8s · 3 skills executed
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Report Panel ─────────────────────────────────────────────────────────────

function MetricBadge({
  label,
  value,
  note,
  type,
}: {
  label: string;
  value: string;
  note?: string;
  type: "good" | "neutral" | "warn";
}) {
  const palette = {
    good:    { color: "#10b981", border: "rgba(16,185,129,0.25)",  bg: "rgba(16,185,129,0.08)"  },
    neutral: { color: "#22d3ee", border: "rgba(34,211,238,0.25)",  bg: "rgba(34,211,238,0.08)"  },
    warn:    { color: "#f59e0b", border: "rgba(245,158,11,0.25)",  bg: "rgba(245,158,11,0.08)"  },
  }[type];

  return (
    <div className="rounded-lg border p-2.5" style={{ borderColor: palette.border, background: palette.bg }}>
      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="font-mono font-bold text-base leading-none" style={{ color: palette.color }}>{value}</div>
      {note && <div className="text-[9px] mt-1.5 leading-tight" style={{ color: palette.color + "90" }}>{note}</div>}
    </div>
  );
}

function ActionItem({
  urgency,
  text,
}: {
  urgency: "critical" | "warn" | "ok";
  text: string;
}) {
  const cfg = {
    critical: { icon: "🔴", border: "rgba(239,68,68,0.22)",   bg: "rgba(239,68,68,0.07)"   },
    warn:     { icon: "⚠️", border: "rgba(245,158,11,0.22)",  bg: "rgba(245,158,11,0.06)"  },
    ok:       { icon: "✅", border: "rgba(16,185,129,0.18)",  bg: "rgba(16,185,129,0.05)"  },
  }[urgency];

  return (
    <div
      className="flex items-start gap-2.5 rounded-lg border px-3 py-2.5"
      style={{ borderColor: cfg.border, background: cfg.bg }}
    >
      <span className="flex-shrink-0 text-sm mt-0.5">{cfg.icon}</span>
      <span className="text-xs text-slate-300 leading-relaxed">{text}</span>
    </div>
  );
}

function ReportPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[360px] px-8 text-center">
      <div
        className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center text-2xl"
        style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.18)" }}
      >
        🌿
      </div>
      <div className="text-base font-display font-semibold text-slate-300 mb-1">TerraGlow Skincare</div>
      <div className="text-sm text-slate-500">Weekly Performance Report</div>
      <div className="text-xs text-slate-600 mt-1 mb-7">Week of March 31 – April 6, 2026</div>

      {/* Ghost skeleton */}
      <div className="w-full max-w-[260px] space-y-2 mb-6">
        {[75, 100, 85, 60, 90, 70].map((w, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full bg-slate-800"
            style={{ width: `${w}%`, marginLeft: i % 2 === 1 ? "auto" : "0", opacity: 0.5 - i * 0.05 }}
          />
        ))}
      </div>

      <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
        <span>Click</span>
        <span className="text-purple-400/60 font-mono">Generate Report</span>
        <span>to run the pipeline</span>
      </div>
    </div>
  );
}

function ReportContent({ sections }: { sections: number }) {
  const show = (n: number) => sections >= n;

  return (
    <div className="px-5 pt-5 pb-6 space-y-5">

      {/* 0 → Report Header */}
      <AnimatePresence>
        {show(1) && (
          <motion.div
            key="header"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800/60">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">🌿</span>
                  <span className="text-[9px] font-mono text-emerald-400/60 uppercase tracking-widest">TerraGlow Skincare</span>
                </div>
                <h2 className="text-lg font-display font-bold text-slate-100 leading-tight">
                  Weekly Performance Report
                </h2>
                <div className="text-xs text-slate-500 mt-1">Week of March 31 – April 6, 2026</div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-[9px] font-mono text-slate-700">Generated by</div>
                <div className="text-[10px] font-mono text-purple-400/50">Claude Skills ×3</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1 → Executive Summary */}
      <AnimatePresence>
        {show(2) && (
          <motion.div
            key="exec"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4">
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2.5">
                Executive Summary
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Revenue grew{" "}
                <span className="text-emerald-400 font-semibold">12.3% WoW to $47.8K</span> driven
                by strong Vitamin C Serum performance (BSR improved to{" "}
                <span className="text-emerald-400">#1,847</span>). Ad efficiency healthy — ACoS at{" "}
                <span className="text-emerald-400">28.6%</span> against a 30% target. Two SKUs
                require immediate inventory action to prevent stockouts.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2 → KPI Dashboard */}
      <AnimatePresence>
        {show(3) && (
          <motion.div
            key="kpis"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div>
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2.5">
                Key Metrics Dashboard
              </div>
              <div className="grid grid-cols-3 gap-2">
                <MetricBadge label="Revenue"    value="$47.8K" note="↑ +12.3% WoW" type="good"    />
                <MetricBadge label="Units Sold" value="1,247"                       type="neutral" />
                <MetricBadge label="ACoS"       value="28.6%"  note="target <30% ✓" type="good"    />
                <MetricBadge label="TACoS"      value="8.8%"   note="healthy"        type="good"    />
                <MetricBadge label="ROAS"       value="3.50×"                        type="good"    />
                <MetricBadge label="Avg Order"  value="$38.36"                       type="neutral" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3 → Top Performer */}
      <AnimatePresence>
        {show(4) && (
          <motion.div
            key="top"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: "rgba(245,158,11,0.22)", background: "rgba(245,158,11,0.06)" }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-sm">⭐</span>
                <div className="text-[9px] font-mono text-amber-400/70 uppercase tracking-widest">
                  Top Performer
                </div>
              </div>
              <div className="text-sm font-display font-semibold text-slate-200 mb-1.5">
                Vitamin C Serum 30ml
              </div>
              <div className="text-xs text-slate-400 leading-relaxed mb-3">
                $16K revenue · 62% margin · BSR #1,847 · 412 units sold
              </div>
              <div
                className="rounded-lg border px-3 py-2.5"
                style={{ borderColor: "rgba(245,158,11,0.18)", background: "rgba(245,158,11,0.08)" }}
              >
                <div className="text-[9px] font-mono text-amber-400/60 mb-1">Recommendation</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Increase daily ad budget from{" "}
                  <span className="text-amber-400 font-semibold">$80 → $120</span> to capture BSR
                  momentum. Current trajectory puts this in top 1,000 by month end.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 → Action Items */}
      <AnimatePresence>
        {show(5) && (
          <motion.div
            key="actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div>
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2.5">
                Action Items
              </div>
              <div className="space-y-2">
                <ActionItem urgency="critical" text="URGENT: Hyaluronic Acid Moisturizer at 27 days of stock. Submit PO for 2,000 units by Friday." />
                <ActionItem urgency="warn"     text="Vitamin C Serum at 32 days. Submit PO for 3,000 units this week to prevent stockout." />
                <ActionItem urgency="warn"     text="Collagen Eye Cream at 242 days excess. Recommend 15% coupon to accelerate sell-through." />
                <ActionItem urgency="ok"       text="Retinol Night Cream and Niacinamide Toner inventory healthy. No action required." />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5 → Ad Performance Insights */}
      <AnimatePresence>
        {show(6) && (
          <motion.div
            key="ads"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: "rgba(34,211,238,0.2)", background: "rgba(34,211,238,0.05)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">🎯</span>
                <div className="text-[9px] font-mono text-cyan-400/70 uppercase tracking-widest">
                  Ad Performance Insights
                </div>
              </div>
              <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
                <div className="flex gap-2.5">
                  <span className="text-emerald-400 flex-shrink-0 font-bold">↓</span>
                  <span>
                    <span className="text-slate-200">CPC dropped to $0.33</span> (was $0.38 last
                    week) — bidding optimization is working.
                  </span>
                </div>
                <div className="flex gap-2.5">
                  <span className="text-emerald-400 flex-shrink-0 font-bold">↑</span>
                  <span>
                    <span className="text-slate-200">CTR at 1.44%</span> — above category average
                    of 0.9%. Strong creative performance across top ASINs.
                  </span>
                </div>
                <div className="flex gap-2.5">
                  <span className="text-amber-400 flex-shrink-0 font-bold">→</span>
                  <span>
                    Recommend testing new{" "}
                    <span className="text-slate-200">A+ content on Retinol Night Cream</span> —
                    lowest CTR of the top 5 ASINs.
                  </span>
                </div>
              </div>
            </div>

            {/* Report footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between"
            >
              <div className="text-[9px] font-mono text-slate-700">
                Generated by Claude Skills · Apr 7, 2026
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                <span className="text-[9px] font-mono text-emerald-500/50">Report complete</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReportPanel({ sections }: { sections: number }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-5 pt-5 pb-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-sm bg-cyan-500/80" />
          <span className="text-[9px] font-mono text-cyan-400/60 uppercase tracking-widest">Output</span>
        </div>
        <div className="text-sm font-display font-semibold text-slate-200">Weekly Report</div>
        <div className="text-[11px] text-slate-500 mt-0.5">Branded · structured · ready to send</div>
      </div>

      <div className="flex-shrink-0 mx-5 mt-3 h-px bg-slate-800/60" />

      <div className="flex-1 overflow-y-auto">
        {sections === 0 ? <ReportPlaceholder /> : <ReportContent sections={sections} />}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ClaudeSkillsArchitecturePage() {
  const [phase,             setPhase]             = useState<Phase>("idle");
  const [skillStates,       setSkillStates]       = useState<SkillState[]>(["idle", "idle", "idle"]);
  const [skillCurrentSteps, setSkillCurrentSteps] = useState(["", "", ""]);
  const [sections,          setSections]          = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearAll() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  function handleGenerate() {
    if (phase === "running") return;
    clearAll();

    setPhase("running");
    setSkillStates(["active", "idle", "idle"]);
    setSkillCurrentSteps([SKILLS[0].steps[0], "", ""]);
    setSections(0);

    function add(fn: () => void, delay: number) {
      const t = setTimeout(fn, delay);
      timeoutsRef.current.push(t);
    }

    // ── Skill 0: t=0 → 2400ms ──────────────────────────────────────────────
    const s0Interval = 2400 / SKILLS[0].steps.length;
    SKILLS[0].steps.forEach((step, i) => {
      add(() => setSkillCurrentSteps((p) => [step, p[1], p[2]]), i * s0Interval);
    });

    // Skill 0 done → Skill 1 starts, reveal section 0 (report header)
    add(() => {
      setSkillStates(["complete", "active", "idle"]);
      setSkillCurrentSteps((p) => [p[0], SKILLS[1].steps[0], p[2]]);
      setSections(1);
    }, 2400);

    // Reveal exec summary
    add(() => setSections(2), 2800);

    // ── Skill 1: t=2400 → 4000ms ───────────────────────────────────────────
    const s1Interval = 1600 / SKILLS[1].steps.length;
    SKILLS[1].steps.forEach((step, i) => {
      add(() => setSkillCurrentSteps((p) => [p[0], step, p[2]]), 2400 + i * s1Interval);
    });

    // Skill 1 done → Skill 2 starts, reveal KPI section
    add(() => {
      setSkillStates(["complete", "complete", "active"]);
      setSkillCurrentSteps((p) => [p[0], p[1], SKILLS[2].steps[0]]);
      setSections(3);
    }, 4000);

    // Reveal top performer
    add(() => setSections(4), 4400);

    // ── Skill 2: t=4000 → 6800ms ───────────────────────────────────────────
    const s2Interval = 2800 / SKILLS[2].steps.length;
    SKILLS[2].steps.forEach((step, i) => {
      add(() => setSkillCurrentSteps((p) => [p[0], p[1], step]), 4000 + i * s2Interval);
    });

    // Skill 2 done → reveal action items
    add(() => {
      setSkillStates(["complete", "complete", "complete"]);
      setSections(5);
    }, 6800);

    // Final section + complete
    add(() => {
      setSections(6);
      setPhase("complete");
    }, 7200);
  }

  return (
    <div className="min-h-screen text-slate-100" style={{ background: "#07080d" }}>
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden
      >
        <div
          className="absolute -top-40 left-1/4 w-[600px] h-[400px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)", filter: "blur(40px)" }}
        />
        <div
          className="absolute top-1/2 -right-20 w-[400px] h-[600px] rounded-full opacity-[0.025]"
          style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="relative z-10 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="max-w-[1440px] mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
            >
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-bold text-sm text-slate-100">
                  Claude Skills Architecture
                </span>
                <span className="text-[9px] font-mono bg-purple-500/15 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded-full">
                  LIVE DEMO
                </span>
              </div>
              <p className="text-[10px] text-slate-600 mt-0.5 hidden sm:block">
                Amazon Seller data → AmazonDataReader → BrandVoice → WeeklyReportGenerator → branded report
              </p>
            </div>
          </div>
          <a
            href="/"
            className="text-[11px] font-mono text-slate-700 hover:text-slate-400 transition-colors flex-shrink-0 hidden sm:block"
          >
            ← portfolio
          </a>
        </div>
      </header>

      {/* ── 3-panel layout ──────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-[1440px] mx-auto">

        {/* Desktop: 3 columns, viewport height panels */}
        <div
          className="hidden lg:grid"
          style={{
            gridTemplateColumns: "1fr 290px 1fr",
            height: "calc(100vh - 57px)",
          }}
        >
          <div className="border-r border-slate-800/50 overflow-hidden">
            <DataPanel />
          </div>
          <div className="border-r border-slate-800/50 overflow-hidden">
            <PipelinePanel
              phase={phase}
              skillStates={skillStates}
              skillCurrentSteps={skillCurrentSteps}
              onGenerate={handleGenerate}
            />
          </div>
          <div className="overflow-hidden">
            <ReportPanel sections={sections} />
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="lg:hidden divide-y divide-slate-800/60">
          <div className="px-4 py-6">
            <DataPanel />
          </div>
          <div className="px-4 py-6">
            <PipelinePanel
              phase={phase}
              skillStates={skillStates}
              skillCurrentSteps={skillCurrentSteps}
              onGenerate={handleGenerate}
            />
          </div>
          <div className="px-4 py-6">
            <ReportPanel sections={sections} />
          </div>
        </div>
      </main>
    </div>
  );
}
