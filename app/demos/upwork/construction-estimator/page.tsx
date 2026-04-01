"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────

type Phase = "idle" | "processing" | "done";
type ProcessStep = 0 | 1 | 2;

type ProjectType = "Residential Home" | "Commercial Office" | "Renovation" | "Extension" | "Granny Flat";
type Location = "Sydney" | "Melbourne" | "Brisbane" | "Perth" | "Adelaide";
type Quality = "Budget" | "Standard" | "Premium" | "Luxury";

interface FormState {
  projectType: ProjectType;
  location: Location;
  size: string;
  stories: 1 | 2 | 3;
  quality: Quality;
}

interface CostCategory {
  name: string;
  percent: number;
  icon: string;
}

interface EstimateResult {
  total: number;
  low: number;
  high: number;
  perSqm: number;
  localAvgPerSqm: number;
  nationalAvgPerSqm: number;
  localAvgTotal: number;
  nationalAvgTotal: number;
  timeline: number;
  categories: Array<{ name: string; cost: number; percent: number; icon: string }>;
  insights: string[];
}

// ─── Data ──────────────────────────────────────────────────────────────────

const BASE_RATES: Record<Location, number> = {
  Sydney: 3200,
  Melbourne: 2900,
  Brisbane: 2600,
  Perth: 2400,
  Adelaide: 2200,
};

const QUALITY_MULT: Record<Quality, number> = {
  Budget: 0.72,
  Standard: 1.0,
  Premium: 1.42,
  Luxury: 2.05,
};

const TYPE_MULT: Record<ProjectType, number> = {
  "Residential Home": 1.0,
  "Commercial Office": 1.38,
  Renovation: 0.58,
  Extension: 0.84,
  "Granny Flat": 0.88,
};

const STORIES_MULT: Record<number, number> = { 1: 1.0, 2: 1.14, 3: 1.26 };

const NATIONAL_AVG = 2600;

const CATEGORIES: CostCategory[] = [
  { name: "Foundation & Slab", percent: 12, icon: "▣" },
  { name: "Framing & Structure", percent: 18, icon: "⬡" },
  { name: "Roofing", percent: 10, icon: "◭" },
  { name: "Electrical", percent: 9, icon: "⚡" },
  { name: "Plumbing", percent: 11, icon: "◎" },
  { name: "Interior Finishing", percent: 22, icon: "◈" },
  { name: "Exterior & Cladding", percent: 11, icon: "⬜" },
  { name: "Landscaping & Site", percent: 7, icon: "◆" },
];

const PROCESS_STEPS = [
  { label: "Analyzing local market data", sub: "Sourcing live construction indices for your region" },
  { label: "Calculating material costs", sub: "Cross-referencing supplier rates and labour multipliers" },
  { label: "Generating your estimate", sub: "Compiling detailed breakdown with AI insights" },
];

const INSIGHTS_DB: Record<string, string[]> = {
  Sydney: [
    "Timber framing is 12–18% cheaper than steel in the Sydney basin — consider it for residential builds under 3 storeys.",
    "Labour costs in Sydney's Inner West run 22% above the metro average. Schedule trades 6–8 weeks in advance to lock in competitive rates.",
    "Sydney's sandy coastal soils often require deeper footings — budget an additional $8,000–$15,000 for geotechnical investigation.",
  ],
  Melbourne: [
    "Melbourne's basalt rock zones (Werribee/Bacchus Marsh corridors) can add $12,000–$20,000 in site preparation costs.",
    "Prefab bathroom pods have gained traction in Melbourne CBD projects — can cut wet area labour by up to 30%.",
    "Timber supply chains from Victorian forests have stabilised — hardwood pricing is down 8% YoY vs national trend.",
  ],
  Brisbane: [
    "Elevated timber homes (Queenslander style) add 10–15% to structural costs but significantly reduce flood risk premiums.",
    "Brisbane's subtropical climate allows for simplified HVAC systems — savings of $8,000–$14,000 vs southern states.",
    "Southeast Queensland is experiencing a 14-week lead time on structural steel. Locking in orders early is strongly recommended.",
  ],
  Perth: [
    "Western Australia's isolated market commands a 9–13% premium on imported materials vs eastern seaboard.",
    "Perth's red clay soils require reactive soil management — Class P footings can add $6,000–$11,000 to slab costs.",
    "WA government rebates of up to $20,000 are available for 7-star NatHERS rated new builds — worth pursuing on premium projects.",
  ],
  Adelaide: [
    "Adelaide offers the most competitive labour rates of any mainland capital — builder margins are typically 12–15% vs 18–22% in Sydney.",
    "Stone heritage facades in heritage overlay zones add complexity — budget $1,200–$1,800/lm for heritage-compliant masonry.",
    "South Australia's build-to-rent incentives include stamp duty concessions that can free up $15,000+ for construction budget.",
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function calcEstimate(form: FormState): EstimateResult {
  const sqm = Math.max(10, parseInt(form.size) || 150);
  const base = BASE_RATES[form.location];
  const qMult = QUALITY_MULT[form.quality];
  const tMult = TYPE_MULT[form.projectType];
  const sMult = STORIES_MULT[form.stories];

  const perSqm = Math.round(base * qMult * tMult * sMult);
  const total = perSqm * sqm;
  const variance = 0.12;
  const low = Math.round(total * (1 - variance));
  const high = Math.round(total * (1 + variance));

  const localAvgPerSqm = Math.round(base * tMult * sMult);
  const nationalAvgPerSqm = Math.round(NATIONAL_AVG * tMult * sMult);

  const baseWeeks = Math.round(sqm / 18 + 8);
  const typeWeeksMult: Record<ProjectType, number> = {
    "Residential Home": 1.0,
    "Commercial Office": 1.35,
    Renovation: 0.65,
    Extension: 0.75,
    "Granny Flat": 0.7,
  };
  const timeline = Math.round(baseWeeks * typeWeeksMult[form.projectType]);

  const categories = CATEGORIES.map((c) => ({
    name: c.name,
    icon: c.icon,
    percent: c.percent,
    cost: Math.round((total * c.percent) / 100),
  }));

  const insights = INSIGHTS_DB[form.location].slice(0, 3);

  return {
    total,
    low,
    high,
    perSqm,
    localAvgPerSqm,
    nationalAvgPerSqm,
    localAvgTotal: localAvgPerSqm * sqm,
    nationalAvgTotal: nationalAvgPerSqm * sqm,
    timeline,
    categories,
    insights,
  };
}

function fmtAUD(n: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtShort(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-amber-400/80">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-400/50 focus:outline-none focus:bg-white/[0.07] transition-all cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-[#0d0d10] text-slate-100">
              {o}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-amber-400/60 text-xs">▾</span>
      </div>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  suffix,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-amber-400/80">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-400/50 focus:outline-none focus:bg-white/[0.07] transition-all"
          style={{ WebkitAppearance: "none" }}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function QualityPicker({
  value,
  onChange,
}: {
  value: Quality;
  onChange: (q: Quality) => void;
}) {
  const opts: { q: Quality; color: string; label: string }[] = [
    { q: "Budget", color: "text-slate-400 border-slate-600", label: "Budget" },
    { q: "Standard", color: "text-blue-300 border-blue-700", label: "Standard" },
    { q: "Premium", color: "text-amber-300 border-amber-700", label: "Premium" },
    { q: "Luxury", color: "text-rose-300 border-rose-700", label: "Luxury" },
  ];
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-amber-400/80">
        Quality Level
      </label>
      <div className="grid grid-cols-4 gap-1.5">
        {opts.map(({ q, color, label }) => (
          <button
            key={q}
            onClick={() => onChange(q)}
            className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-all ${
              value === q
                ? `${color} bg-white/10`
                : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StoriesPicker({
  value,
  onChange,
}: {
  value: 1 | 2 | 3;
  onChange: (s: 1 | 2 | 3) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-amber-400/80">
        Storeys
      </label>
      <div className="grid grid-cols-3 gap-1.5">
        {([1, 2, 3] as const).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`rounded-lg border py-2 text-sm font-bold transition-all ${
              value === n
                ? "border-amber-400/60 bg-amber-400/10 text-amber-300"
                : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-400"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function AnimatedBar({ percent, color = "#f59e0b", delay = 0 }: { percent: number; color?: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 100 + delay * 80);
    return () => clearTimeout(t);
  }, [percent, delay]);
  return (
    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}

function ComparisonCell({
  label,
  value,
  total,
  highlight,
  diff,
}: {
  label: string;
  value: number;
  total: number;
  highlight?: boolean;
  diff?: number;
}) {
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-2 transition-all ${
        highlight
          ? "border-amber-400/40 bg-amber-400/[0.06]"
          : "border-white/[0.07] bg-white/[0.02]"
      }`}
    >
      <div className={`text-[10px] font-bold tracking-[0.1em] uppercase ${highlight ? "text-amber-400" : "text-slate-500"}`}>
        {label}
      </div>
      <div className={`text-lg font-bold tabular-nums ${highlight ? "text-amber-300" : "text-slate-300"}`}>
        {fmtShort(total)}
      </div>
      <div className="text-[11px] text-slate-500 tabular-nums">{fmtAUD(value)}/m²</div>
      {diff !== undefined && (
        <div className={`text-[11px] font-semibold ${diff > 0 ? "text-rose-400" : diff < 0 ? "text-emerald-400" : "text-slate-500"}`}>
          {diff > 0 ? `+${diff}%` : diff < 0 ? `${diff}%` : "—"} vs national
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function ConstructionEstimatorPage() {
  const [form, setForm] = useState<FormState>({
    projectType: "Residential Home",
    location: "Sydney",
    size: "250",
    stories: 1,
    quality: "Standard",
  });

  const [phase, setPhase] = useState<Phase>("idle");
  const [processStep, setProcessStep] = useState<ProcessStep>(0);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  function patch<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function runEstimate() {
    if (!form.size || parseInt(form.size) < 10) return;
    setPhase("processing");
    setProcessStep(0);
    setSaved(false);
    setDownloaded(false);

    await delay(1100);
    setProcessStep(1);
    await delay(1000);
    setProcessStep(2);
    await delay(900);

    setResult(calcEstimate(form));
    setPhase("done");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }

  function reset() {
    setPhase("idle");
    setResult(null);
    setProcessStep(0);
  }

  const nationalDiff = result
    ? Math.round(((result.perSqm - result.nationalAvgPerSqm) / result.nationalAvgPerSqm) * 100)
    : 0;
  const localDiff = result
    ? Math.round(((result.perSqm - result.localAvgPerSqm) / result.localAvgPerSqm) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100" style={{ fontFamily: "var(--font-ibm-plex), system-ui, sans-serif" }}>
      {/* Blueprint grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Amber radial glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-[0.08] rounded-full blur-[120px] bg-amber-500" />

      <div className="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-amber-400">BuildAI Pro</span>
            </div>
            <div className="text-[11px] text-slate-600 tracking-wide">Powered by AI Estimation Engine v2</div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
            Construction Cost Estimator
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            AI-powered estimates for Australian builders. Calibrated with live market data across all major metro regions.
          </p>
        </motion.div>

        {/* Input Form */}
        <AnimatePresence mode="wait">
          {phase !== "done" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8 mb-8 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="text-amber-400 text-sm">◈</span>
                <h2 className="text-sm font-bold tracking-[0.08em] uppercase text-slate-300">Project Parameters</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <SelectField
                  label="Project Type"
                  value={form.projectType}
                  onChange={(v) => patch("projectType", v as ProjectType)}
                  options={["Residential Home", "Commercial Office", "Renovation", "Extension", "Granny Flat"]}
                />
                <SelectField
                  label="Location"
                  value={form.location}
                  onChange={(v) => patch("location", v as Location)}
                  options={["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"]}
                />
                <NumberInput
                  label="Floor Area"
                  value={form.size}
                  onChange={(v) => patch("size", v)}
                  suffix="m²"
                  placeholder="e.g. 250"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <StoriesPicker value={form.stories} onChange={(s) => patch("stories", s)} />
                <QualityPicker value={form.quality} onChange={(q) => patch("quality", q)} />
              </div>

              <AnimatePresence mode="wait">
                {phase === "idle" && (
                  <motion.button
                    key="btn-estimate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={runEstimate}
                    disabled={!form.size || parseInt(form.size) < 10}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm tracking-wide py-3.5 transition-colors shadow-lg shadow-amber-500/20"
                  >
                    Get AI Estimate →
                  </motion.button>
                )}

                {phase === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-5"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-4 w-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                      <span className="text-amber-300 font-semibold text-sm">
                        {PROCESS_STEPS[processStep].label}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mb-4">{PROCESS_STEPS[processStep].sub}</p>
                    <div className="space-y-2">
                      {PROCESS_STEPS.map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div
                            className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                              i < processStep
                                ? "bg-amber-400"
                                : i === processStep
                                ? "bg-amber-400 animate-pulse"
                                : "bg-white/10"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              i < processStep
                                ? "text-slate-400 line-through"
                                : i === processStep
                                ? "text-amber-300"
                                : "text-slate-600"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {phase === "done" && result && (
            <motion.div
              key="results"
              ref={resultRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Adjust Parameters bar */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-amber-400">
                    Estimate Generated
                  </span>
                  <span className="text-[11px] text-slate-600 ml-2">
                    {form.size}m² · {form.projectType} · {form.location} · {form.quality}
                  </span>
                </div>
                <button
                  onClick={reset}
                  className="text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors border border-white/10 hover:border-amber-400/40 rounded-lg px-3 py-1.5"
                >
                  ↺ Adjust Parameters
                </button>
              </div>

              {/* Hero cost card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.08] to-transparent p-6 sm:p-8 mb-5 relative overflow-hidden"
              >
                <div className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: "radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.3) 0%, transparent 60%)",
                  }}
                />
                <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="sm:col-span-2">
                    <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-amber-400/70 mb-1">
                      Total Estimated Cost (AUD)
                    </div>
                    <div className="text-4xl sm:text-5xl font-bold text-white tabular-nums mb-1">
                      {fmtAUD(result.total)}
                    </div>
                    <div className="text-sm text-slate-400 tabular-nums">
                      Range: {fmtAUD(result.low)} – {fmtAUD(result.high)}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs">
                      <span className="rounded-full bg-white/[0.06] border border-white/10 px-3 py-1 text-slate-300 tabular-nums">
                        {fmtAUD(result.perSqm)}/m²
                      </span>
                      <span className="rounded-full bg-white/[0.06] border border-white/10 px-3 py-1 text-slate-300">
                        {result.timeline} weeks build time
                      </span>
                      <span className={`rounded-full border px-3 py-1 font-semibold ${
                        localDiff > 5 ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                        : localDiff < -5 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-slate-500/10 border-slate-500/30 text-slate-300"
                      }`}>
                        {localDiff > 0 ? `+${localDiff}%` : `${localDiff}%`} vs {form.location} avg
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-slate-600 mb-1">Cost/m² Comparison</div>
                    {[
                      { label: "Your Estimate", val: result.perSqm, isYours: true },
                      { label: `${form.location} Avg`, val: result.localAvgPerSqm, isYours: false },
                      { label: "National Avg", val: result.nationalAvgPerSqm, isYours: false },
                    ].map(({ label, val, isYours }) => {
                      const maxVal = Math.max(result.perSqm, result.localAvgPerSqm, result.nationalAvgPerSqm);
                      const pct = (val / maxVal) * 100;
                      return (
                        <div key={label}>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className={isYours ? "text-amber-400 font-semibold" : "text-slate-500"}>{label}</span>
                            <span className={isYours ? "text-amber-300 font-bold tabular-nums" : "text-slate-400 tabular-nums"}>{fmtAUD(val)}</span>
                          </div>
                          <AnimatedBar percent={pct} color={isYours ? "#f59e0b" : "#475569"} delay={0} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Cost Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 mb-5"
              >
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-amber-400 text-sm">◈</span>
                  <h3 className="text-sm font-bold tracking-[0.08em] uppercase text-slate-300">Cost Breakdown</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {result.categories.map((cat, i) => (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.05, duration: 0.4 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400/60 text-xs w-4">{cat.icon}</span>
                          <span className="text-xs text-slate-300 font-medium">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="text-slate-500">{cat.percent}%</span>
                          <span className="text-slate-200 font-semibold tabular-nums w-24 text-right">{fmtAUD(cat.cost)}</span>
                        </div>
                      </div>
                      <AnimatedBar percent={cat.percent * (100 / 22)} delay={i} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Comparison Table */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 mb-5"
              >
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-amber-400 text-sm">⬡</span>
                  <h3 className="text-sm font-bold tracking-[0.08em] uppercase text-slate-300">Market Comparison</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <ComparisonCell
                    label="Your Estimate"
                    value={result.perSqm}
                    total={result.total}
                    highlight
                    diff={nationalDiff}
                  />
                  <ComparisonCell
                    label={`${form.location} Avg`}
                    value={result.localAvgPerSqm}
                    total={result.localAvgTotal}
                    diff={Math.round(((result.localAvgPerSqm - result.nationalAvgPerSqm) / result.nationalAvgPerSqm) * 100)}
                  />
                  <ComparisonCell
                    label="National Avg"
                    value={result.nationalAvgPerSqm}
                    total={result.nationalAvgTotal}
                    diff={0}
                  />
                </div>

                {/* Table view */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left text-[10px] font-semibold tracking-[0.1em] uppercase text-slate-600 pb-2 pr-4">Category</th>
                        <th className="text-right text-[10px] font-semibold tracking-[0.1em] uppercase text-amber-400/70 pb-2 px-3">Your Estimate</th>
                        <th className="text-right text-[10px] font-semibold tracking-[0.1em] uppercase text-slate-600 pb-2 px-3">{form.location} Avg</th>
                        <th className="text-right text-[10px] font-semibold tracking-[0.1em] uppercase text-slate-600 pb-2">National Avg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.categories.map((cat, i) => {
                        const localCatCost = Math.round((result.localAvgTotal * cat.percent) / 100);
                        const natCatCost = Math.round((result.nationalAvgTotal * cat.percent) / 100);
                        const isHigh = cat.cost > localCatCost * 1.05;
                        const isLow = cat.cost < localCatCost * 0.95;
                        return (
                          <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                            <td className="py-2 pr-4">
                              <span className="text-slate-400">{cat.name}</span>
                            </td>
                            <td className="py-2 px-3 text-right">
                              <span className={`font-semibold tabular-nums ${isHigh ? "text-rose-400" : isLow ? "text-emerald-400" : "text-amber-300"}`}>
                                {fmtAUD(cat.cost)}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right text-slate-500 tabular-nums">{fmtAUD(localCatCost)}</td>
                            <td className="py-2 text-right text-slate-600 tabular-nums">{fmtAUD(natCatCost)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* AI Insights */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.5 }}
                className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-6 mb-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-amber-400">⚡</span>
                  <h3 className="text-sm font-bold tracking-[0.08em] uppercase text-amber-400/90">AI Insights</h3>
                  <span className="ml-auto text-[10px] font-semibold tracking-wide text-slate-600 border border-white/[0.06] rounded-full px-2 py-0.5">
                    {form.location} Market
                  </span>
                </div>
                <div className="space-y-3">
                  {result.insights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.42 + i * 0.08 }}
                      className="flex gap-3"
                    >
                      <div className="mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-amber-400/60" />
                      <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.46, duration: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                <button
                  onClick={() => { setDownloaded(true); setTimeout(() => setDownloaded(false), 2500); }}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                    downloaded
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-amber-400/30 bg-amber-400/[0.08] text-amber-300 hover:bg-amber-400/[0.14]"
                  }`}
                >
                  {downloaded ? (
                    <><span>✓</span> PDF Queued for Download</>
                  ) : (
                    <><span>↓</span> Download PDF Report</>
                  )}
                </button>
                <button
                  onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                    saved
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                  }`}
                >
                  {saved ? "✓ Saved to Project" : "☆ Save Estimate"}
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:border-white/20 hover:text-slate-400 transition-all"
                >
                  ↺ New Estimate
                </button>
              </motion.div>

              {/* Disclaimer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mt-5 text-[11px] text-slate-600 leading-relaxed"
              >
                Estimates are indicative only and based on current market data for {form.location}.
                Final costs are subject to site conditions, council approvals, and contractor pricing.
                BuildAI Pro recommends obtaining 3 independent quotes before committing.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
