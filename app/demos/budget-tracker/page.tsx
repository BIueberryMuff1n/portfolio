"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

// ─── Design tokens ───────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

// ─── Sample data ─────────────────────────────────────────────────────────────
const CAMPAIGNS_RAW = [
  {
    id: 1,
    name: "Summer Sale – Search",
    platform: "Google",
    budget: 150000,
    spend: 131250,
    pacing: 87.5,
    status: "active",
    daily: [4200, 4400, 4100, 4600, 4350, 4800, 4500, 4750, 4600, 4900, 4700, 4850, 4950, 5100],
  },
  {
    id: 2,
    name: "Summer Sale – Meta",
    platform: "Meta",
    budget: 95000,
    spend: 120650,
    pacing: 127.0,
    status: "over",
    daily: [3200, 3600, 3800, 4100, 4300, 4500, 4200, 4800, 5100, 5400, 5200, 5600, 5800, 6000],
  },
  {
    id: 3,
    name: "Brand Awareness – LinkedIn",
    platform: "LinkedIn",
    budget: 60000,
    spend: 40800,
    pacing: 68.0,
    status: "under",
    daily: [1200, 1100, 1300, 1250, 1400, 1350, 1200, 1450, 1300, 1250, 1400, 1350, 1500, 1450],
  },
  {
    id: 4,
    name: "Retargeting – Google",
    platform: "Google",
    budget: 45000,
    spend: 42300,
    pacing: 94.0,
    status: "active",
    daily: [1400, 1450, 1500, 1480, 1520, 1490, 1510, 1550, 1530, 1570, 1540, 1580, 1560, 1600],
  },
  {
    id: 5,
    name: "App Install – TikTok",
    platform: "TikTok",
    budget: 75000,
    spend: 64500,
    pacing: 86.0,
    status: "active",
    daily: [2100, 2200, 2300, 2150, 2400, 2350, 2450, 2500, 2600, 2550, 2700, 2650, 2800, 2750],
  },
  {
    id: 6,
    name: "Prospecting – Meta",
    platform: "Meta",
    budget: 85000,
    spend: 73950,
    pacing: 87.0,
    status: "active",
    daily: [2400, 2500, 2600, 2550, 2700, 2650, 2750, 2800, 2900, 2850, 3000, 2950, 3100, 3050],
  },
  {
    id: 7,
    name: "Video Views – TikTok",
    platform: "TikTok",
    budget: 40000,
    spend: 28800,
    pacing: 72.0,
    status: "under",
    daily: [900, 950, 1000, 980, 1050, 1020, 1080, 1100, 1150, 1120, 1180, 1150, 1200, 1170],
  },
  {
    id: 8,
    name: "Shopping – Google",
    platform: "Google",
    budget: 120000,
    spend: 109200,
    pacing: 91.0,
    status: "active",
    daily: [3600, 3700, 3800, 3750, 3900, 3850, 3950, 4000, 4100, 4050, 4200, 4150, 4300, 4250],
  },
  {
    id: 9,
    name: "Lead Gen – LinkedIn",
    platform: "LinkedIn",
    budget: 55000,
    spend: 47850,
    pacing: 87.0,
    status: "active",
    daily: [1600, 1650, 1700, 1680, 1720, 1700, 1740, 1750, 1780, 1760, 1800, 1780, 1820, 1800],
  },
  {
    id: 10,
    name: "Awareness – Meta",
    platform: "Meta",
    budget: 72500,
    spend: 63875,
    pacing: 88.1,
    status: "active",
    daily: [2050, 2100, 2150, 2120, 2200, 2180, 2220, 2250, 2300, 2280, 2320, 2300, 2350, 2320],
  },
];

const PLATFORM_COLORS: Record<string, string> = {
  Google: "#3b82f6",
  Meta: "#8b5cf6",
  TikTok: "#22d3ee",
  LinkedIn: "#10b981",
};

const PLATFORM_BUDGETS_DEFAULT = {
  Google: 315000,
  Meta: 252500,
  TikTok: 115000,
  LinkedIn: 115000,
};

const TOTAL_BUDGET = 847500;
const TOTAL_SPEND = 523180;

const ALERTS = [
  {
    id: 1,
    level: "red",
    campaign: "Summer Sale – Meta",
    platform: "Meta",
    pacing: 127,
    message: "Overpacing at 127% — Auto-pause recommended",
    action: "Pause campaign and redistribute $8,500 to LinkedIn",
    icon: "🔴",
  },
  {
    id: 2,
    level: "amber",
    campaign: "Brand Awareness – LinkedIn",
    platform: "LinkedIn",
    pacing: 68,
    message: "Underpacing at 68% — Budget reallocation suggested",
    action: "Increase daily budget by $1,200 and expand targeting",
    icon: "🟡",
  },
  {
    id: 3,
    level: "amber",
    campaign: "Video Views – TikTok",
    platform: "TikTok",
    pacing: 72,
    message: "Underpacing at 72% — Creative refresh advised",
    action: "Swap creative assets and increase bid by 15%",
    icon: "🟡",
  },
  {
    id: 4,
    level: "green",
    campaign: "Retargeting – Google",
    platform: "Google",
    pacing: 94,
    message: "On track at 94% — No action required",
    action: "Maintain current settings through end of period",
    icon: "🟢",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function pacingColor(p: number) {
  if (p > 110) return "#ef4444";
  if (p >= 85) return "#10b981";
  if (p >= 70) return "#f59e0b";
  return "#ef4444";
}

function pacingLabel(p: number) {
  if (p > 110) return "Over";
  if (p >= 85) return "On Track";
  if (p >= 70) return "At Risk";
  return "Under";
}

// ─── Animated counter ────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, start]);
  return value;
}

// ─── Mini sparkline tooltip ──────────────────────────────────────────────────
const SparkTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-2 py-1 text-xs" style={{ fontFamily: "var(--font-jetbrains)", color: "#f1f5f9" }}>
      ${payload[0].value.toLocaleString()}
    </div>
  );
};

// ─── Summary cards ───────────────────────────────────────────────────────────
function SummaryCard({
  label,
  value,
  suffix,
  accent,
  sparkData,
  delay,
  started,
}: {
  label: string;
  value: number;
  suffix?: string;
  accent: string;
  sparkData: number[];
  delay: number;
  started: boolean;
}) {
  const count = useCounter(value, 1600, started);
  // display is computed inline below — no need for this variable

  const sd = sparkData.map((v, i) => ({ i, v }));

  return (
    <motion.div {...fadeUp(delay)} className="glass-card glass-card-hover relative overflow-hidden p-5">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 80% 20%, ${accent}, transparent 70%)` }}
      />
      <div className="flex items-start justify-between mb-3">
        <span style={{ fontFamily: "var(--font-ibm-plex)", color: "#94a3b8", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {label}
        </span>
        <span
          className="px-2 py-0.5 rounded text-xs"
          style={{ background: `${accent}18`, color: accent, fontFamily: "var(--font-jetbrains)" }}
        >
          LIVE
        </span>
      </div>
      <div style={{ fontFamily: "var(--font-syne)", color: "#f1f5f9", fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
        {suffix === "%" ? `${count}%` : suffix === "K" ? fmt(count) : count}
      </div>
      <div className="mt-3 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sd} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={accent} strokeWidth={1.5} fill={`url(#spark-${label})`} dot={false} />
            <Tooltip content={<SparkTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// ─── Pacing bar ──────────────────────────────────────────────────────────────
function PacingBar({ pacing, animated }: { pacing: number; animated: boolean }) {
  const color = pacingColor(pacing);
  const width = Math.min(pacing, 130);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: animated ? `${(width / 130) * 100}%` : 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>
      <span style={{ fontFamily: "var(--font-jetbrains)", color, fontSize: 12, minWidth: 44, textAlign: "right" }}>
        {pacing.toFixed(1)}%
      </span>
    </div>
  );
}

// ─── Platform pill ───────────────────────────────────────────────────────────
function PlatformPill({ platform }: { platform: string }) {
  const color = PLATFORM_COLORS[platform] || "#94a3b8";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs"
      style={{ background: `${color}15`, color, fontFamily: "var(--font-jetbrains)", border: `1px solid ${color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />
      {platform}
    </span>
  );
}

// ─── Expandable row daily chart ──────────────────────────────────────────────
function DailyChart({ data, platform }: { data: number[]; platform: string }) {
  const color = PLATFORM_COLORS[platform] || "#8b5cf6";
  const chartData = data.map((v, i) => ({ day: `D${i + 1}`, spend: v }));
  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 9, fontFamily: "var(--font-jetbrains)" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: "rgba(7,7,9,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "#f1f5f9" }}
            formatter={(v: unknown) => [`$${(v as number).toLocaleString()}`, "Daily Spend"]}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Bar dataKey="spend" fill={color} opacity={0.8} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function BudgetTrackerDemo() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">("month");
  const [platformFilter, setPlatformFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<string>("pacing");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);
  const [appliedFixes, setAppliedFixes] = useState<Set<number>>(new Set());
  const [approvalState, setApprovalState] = useState<"pending" | "approved" | "rejected">("pending");
  const [sliders, setSliders] = useState({ ...PLATFORM_BUDGETS_DEFAULT });

  const heroRef = useRef<HTMLDivElement>(null);
  const inView = useInView(heroRef, { once: true });

  // Time range multipliers
  const rangeMultiplier = timeRange === "week" ? 0.25 : timeRange === "quarter" ? 3 : 1;

  // Campaigns adjusted for time range
  const campaigns = CAMPAIGNS_RAW.map((c) => ({
    ...c,
    budget: Math.round(c.budget * rangeMultiplier),
    spend: Math.round(c.spend * rangeMultiplier * (timeRange === "week" ? 0.95 : timeRange === "quarter" ? 1.02 : 1)),
  }));

  // Filter + sort
  const filtered = campaigns
    .filter((c) => platformFilter === "All" || c.platform === platformFilter)
    .sort((a, b) => {
      const va = a[sortKey as keyof typeof a] as number | string;
      const vb = b[sortKey as keyof typeof b] as number | string;
      if (typeof va === "number" && typeof vb === "number") return sortDir === "asc" ? va - vb : vb - va;
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  // Donut chart data from sliders
  const totalSlider = Object.values(sliders).reduce((a, b) => a + b, 0);
  const donutData = Object.entries(sliders).map(([name, value]) => ({
    name,
    value,
    pct: ((value / totalSlider) * 100).toFixed(1),
  }));

  // Projected pacing from reallocation
  const baseSpendByPlatform = { Google: 282750, Meta: 258475, TikTok: 93300, LinkedIn: 88650 };
  const projectedPacing = Object.entries(sliders)
    .map(([p, budget]) => (baseSpendByPlatform[p as keyof typeof baseSpendByPlatform] / budget) * 100)
    .reduce((a, b) => a + b, 0) / 4;
  const basePacing = 87.2;
  const pacingDelta = projectedPacing - basePacing;

  const handleSlider = (platform: string, val: number) => {
    const current = sliders[platform as keyof typeof sliders];
    const diff = val - current;
    // Redistribute proportionally from others
    const others = Object.keys(sliders).filter((k) => k !== platform);
    const otherTotal = others.reduce((a, k) => a + sliders[k as keyof typeof sliders], 0);
    const newSliders = { ...sliders, [platform]: val };
    others.forEach((k) => {
      const share = sliders[k as keyof typeof sliders] / otherTotal;
      newSliders[k as keyof typeof sliders] = Math.max(10000, Math.round(sliders[k as keyof typeof sliders] - diff * share));
    });
    setSliders(newSliders);
  };

  const resetDemo = () => {
    setSliders({ ...PLATFORM_BUDGETS_DEFAULT });
    setApprovalState("pending");
    setAppliedFixes(new Set());
    setExpandedRow(null);
    setExpandedAlert(null);
    setPlatformFilter("All");
    setSortKey("pacing");
    setSortDir("desc");
    setTimeRange("month");
  };

  // Summary sparklines (daily totals across all campaigns)
  const budgetSpark = [820, 835, 842, 838, 847, 843, 847].map((v) => v * 1000);
  const spendSpark = [480, 495, 503, 510, 515, 519, 523].map((v) => v * 1000);
  const pacingSpark = [82, 83.5, 84.2, 85.0, 85.8, 86.5, 87.2];
  const campaignSpark = [22, 22, 23, 23, 24, 24, 24];

  const SortIcon = ({ k }: { k: string }) => (
    <span style={{ color: sortKey === k ? "#8b5cf6" : "#475569", marginLeft: 4, fontSize: 10 }}>
      {sortKey === k ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
    </span>
  );

  return (
    <div style={{ background: "#070709", minHeight: "100vh", fontFamily: "var(--font-ibm-plex)", color: "#f1f5f9" }}>
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="glow-blob" style={{ width: 600, height: 600, top: -200, right: -200, background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
        <div className="glow-blob" style={{ width: 500, height: 500, bottom: 100, left: -150, background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)" }} />
        <div className="noise-overlay" />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(7,7,9,0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
          <div className="section-container py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" style={{ color: "#475569", fontSize: 13, fontFamily: "var(--font-jetbrains)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
              >
                ← portfolio
              </Link>
              <span style={{ color: "#2a2a30" }}>/</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
                <span style={{ fontFamily: "var(--font-syne)", fontWeight: 600, fontSize: 15 }}>Atlas Budget Tracker</span>
                <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", fontFamily: "var(--font-jetbrains)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  DEMO
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Time range */}
              <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                {(["week", "month", "quarter"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    style={{
                      padding: "5px 14px",
                      fontSize: 12,
                      fontFamily: "var(--font-jetbrains)",
                      background: timeRange === r ? "rgba(139,92,246,0.2)" : "transparent",
                      color: timeRange === r ? "#a78bfa" : "#475569",
                      border: "none",
                      cursor: "pointer",
                      borderRight: r !== "quarter" ? "1px solid rgba(255,255,255,0.08)" : "none",
                      transition: "all 0.2s",
                      textTransform: "capitalize",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button
                onClick={resetDemo}
                style={{
                  padding: "5px 14px",
                  fontSize: 12,
                  fontFamily: "var(--font-jetbrains)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#94a3b8",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#f1f5f9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }}
              >
                ↺ Reset
              </button>
            </div>
          </div>
        </div>

        <div className="section-container py-8" ref={heroRef}>
          {/* ── Section label ─────────────────────────────────────────────── */}
          <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-6">
            <span style={{ fontFamily: "var(--font-jetbrains)", color: "#475569", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Marketing Intelligence
            </span>
            <div style={{ flex: 1, maxWidth: 80, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.12), transparent)" }} />
          </motion.div>

          {/* ── Summary cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SummaryCard label="Total Budget" value={Math.round(TOTAL_BUDGET * rangeMultiplier)} suffix="K" accent="#8b5cf6" sparkData={budgetSpark} delay={0.05} started={inView} />
            <SummaryCard label="Total Spend" value={Math.round(TOTAL_SPEND * rangeMultiplier)} suffix="K" accent="#22d3ee" sparkData={spendSpark} delay={0.12} started={inView} />
            <SummaryCard label="Avg Pacing" value={87} suffix="%" accent="#10b981" sparkData={pacingSpark} delay={0.19} started={inView} />
            <SummaryCard label="Active Campaigns" value={24} accent="#f59e0b" sparkData={campaignSpark} delay={0.26} started={inView} />
          </div>

          {/* ── Main grid ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Campaign table (2/3 width) */}
            <div className="xl:col-span-2 space-y-6">
              {/* ── Campaign Table ───────────────────────────────────────── */}
              <motion.div {...fadeUp(0.1)} className="glass-card overflow-hidden">
                {/* Table header */}
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontFamily: "var(--font-syne)", fontWeight: 600, fontSize: 15 }}>Campaign Performance</span>
                  {/* Platform filters */}
                  <div className="flex gap-1">
                    {["All", "Google", "Meta", "TikTok", "LinkedIn"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlatformFilter(p)}
                        style={{
                          padding: "3px 10px",
                          fontSize: 11,
                          fontFamily: "var(--font-jetbrains)",
                          background: platformFilter === p ? (p === "All" ? "rgba(139,92,246,0.2)" : `${PLATFORM_COLORS[p]}20`) : "transparent",
                          color: platformFilter === p ? (p === "All" ? "#a78bfa" : PLATFORM_COLORS[p]) : "#475569",
                          border: `1px solid ${platformFilter === p ? (p === "All" ? "rgba(139,92,246,0.3)" : `${PLATFORM_COLORS[p]}40`) : "rgba(255,255,255,0.06)"}`,
                          borderRadius: 6,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column headers */}
                <div
                  className="grid px-5 py-2 text-xs"
                  style={{
                    gridTemplateColumns: "1fr 100px 90px 90px 140px 80px",
                    color: "#475569",
                    fontFamily: "var(--font-jetbrains)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  {[["name", "Campaign"], ["platform", "Platform"], ["budget", "Budget"], ["spend", "Spend"], ["pacing", "Pacing"], ["status", "Status"]].map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => handleSort(k)}
                      style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", color: sortKey === k ? "#8b5cf6" : "#475569", fontFamily: "var(--font-jetbrains)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", padding: 0 }}
                    >
                      {label}
                      <SortIcon k={k} />
                    </button>
                  ))}
                </div>

                {/* Rows */}
                <div>
                  <AnimatePresence>
                    {filtered.map((c, idx) => (
                      <motion.div key={c.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.3, ease: EASE, delay: idx * 0.04 }}
                      >
                        <div
                          className="grid px-5 py-3 cursor-pointer"
                          style={{
                            gridTemplateColumns: "1fr 100px 90px 90px 140px 80px",
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                            background: expandedRow === c.id ? "rgba(255,255,255,0.03)" : "transparent",
                            transition: "background 0.2s",
                          }}
                          onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}
                          onMouseEnter={(e) => { if (expandedRow !== c.id) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                          onMouseLeave={(e) => { if (expandedRow !== c.id) e.currentTarget.style.background = "transparent"; }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span style={{ color: expandedRow === c.id ? "#22d3ee" : "#475569", fontSize: 10, transition: "color 0.2s", fontFamily: "var(--font-jetbrains)" }}>
                              {expandedRow === c.id ? "▼" : "▶"}
                            </span>
                            <span style={{ fontFamily: "var(--font-ibm-plex)", fontSize: 13, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {c.name}
                            </span>
                          </div>
                          <div><PlatformPill platform={c.platform} /></div>
                          <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 13, color: "#94a3b8" }}>{fmt(c.budget)}</div>
                          <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 13, color: "#94a3b8" }}>{fmt(c.spend)}</div>
                          <div className="pr-2"><PacingBar pacing={c.pacing} animated={inView} /></div>
                          <div>
                            <span className="px-2 py-0.5 rounded text-xs" style={{
                              background: `${pacingColor(c.pacing)}15`,
                              color: pacingColor(c.pacing),
                              fontFamily: "var(--font-jetbrains)",
                              border: `1px solid ${pacingColor(c.pacing)}30`,
                            }}>
                              {pacingLabel(c.pacing)}
                            </span>
                          </div>
                        </div>

                        {/* Expanded row */}
                        <AnimatePresence>
                          {expandedRow === c.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: EASE }}
                              style={{ overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                            >
                              <div className="px-5 py-4" style={{ background: "rgba(255,255,255,0.015)" }}>
                                <div className="flex items-center gap-2 mb-3">
                                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    14-Day Daily Spend
                                  </span>
                                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: PLATFORM_COLORS[c.platform] }}>
                                    avg ${Math.round(c.daily.reduce((a, b) => a + b, 0) / c.daily.length).toLocaleString()}/day
                                  </span>
                                </div>
                                <DailyChart data={c.daily} platform={c.platform} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* ── Budget Allocation Visualizer ─────────────────────────── */}
              <motion.div {...fadeUp(0.2)} className="glass-card p-5">
                <div className="flex items-center justify-between mb-5">
                  <span style={{ fontFamily: "var(--font-syne)", fontWeight: 600, fontSize: 15 }}>Budget Allocation</span>
                  <div className="flex items-center gap-2">
                    <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: pacingDelta >= 0 ? "#10b981" : "#ef4444" }}>
                      {pacingDelta >= 0 ? "↑" : "↓"} {Math.abs(pacingDelta).toFixed(1)}% pacing impact
                    </span>
                    {Math.abs(pacingDelta) > 0.1 && (
                      <span style={{ fontFamily: "var(--font-ibm-plex)", fontSize: 12, color: "#94a3b8" }}>
                        vs baseline
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Donut */}
                  <div style={{ width: 180, height: 180, flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={78}
                          paddingAngle={3}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={600}
                        >
                          {donutData.map((entry) => (
                            <Cell key={entry.name} fill={PLATFORM_COLORS[entry.name]} opacity={0.9} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: "rgba(7,7,9,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "#f1f5f9" }}
                          formatter={(v: unknown, name: unknown) => [fmt(v as number), name as string]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Sliders */}
                  <div className="flex-1 space-y-4 w-full">
                    {Object.entries(sliders).map(([platform, value]) => {
                      const color = PLATFORM_COLORS[platform];
                      const pct = (value / totalSlider) * 100;
                      return (
                        <div key={platform}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "#94a3b8" }}>{platform}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "#475569" }}>{pct.toFixed(1)}%</span>
                              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 13, color, minWidth: 52, textAlign: "right" }}>{fmt(value)}</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min={10000}
                            max={500000}
                            step={5000}
                            value={value}
                            onChange={(e) => handleSlider(platform, Number(e.target.value))}
                            style={{ width: "100%", accentColor: color, cursor: "pointer", height: 4 }}
                          />
                        </div>
                      );
                    })}

                    {/* Projected message */}
                    <AnimatePresence>
                      {Math.abs(pacingDelta) > 0.5 && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="mt-2 px-3 py-2 rounded-lg text-xs"
                          style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)", color: "#22d3ee", fontFamily: "var(--font-ibm-plex)" }}
                        >
                          Shifting {fmt(Math.abs(
                            sliders[Object.keys(sliders).reduce((a, b) => sliders[a as keyof typeof sliders] < PLATFORM_BUDGETS_DEFAULT[a as keyof typeof PLATFORM_BUDGETS_DEFAULT] ? a : b) as keyof typeof sliders]
                            - PLATFORM_BUDGETS_DEFAULT[Object.keys(sliders).reduce((a, b) => sliders[a as keyof typeof sliders] < PLATFORM_BUDGETS_DEFAULT[a as keyof typeof PLATFORM_BUDGETS_DEFAULT] ? a : b) as keyof typeof PLATFORM_BUDGETS_DEFAULT]
                          ))} across platforms {pacingDelta >= 0 ? "improves" : "reduces"} overall pacing by {Math.abs(pacingDelta).toFixed(1)}%
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* ── Pacing Alerts ─────────────────────────────────────────── */}
              <motion.div {...fadeUp(0.15)} className="glass-card overflow-hidden">
                <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: "var(--font-syne)", fontWeight: 600, fontSize: 15 }}>Pacing Alerts</span>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", fontFamily: "var(--font-jetbrains)" }}>
                      {ALERTS.filter((a) => a.level !== "green" && !appliedFixes.has(a.id)).length} active
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {ALERTS.map((alert, idx) => {
                    const isFixed = appliedFixes.has(alert.id);
                    const isExpanded = expandedAlert === alert.id;
                    const borderColor = alert.level === "red" ? "rgba(239,68,68,0.25)" : alert.level === "amber" ? "rgba(245,158,11,0.25)" : "rgba(16,185,129,0.25)";
                    const bgColor = alert.level === "red" ? "rgba(239,68,68,0.06)" : alert.level === "amber" ? "rgba(245,158,11,0.06)" : "rgba(16,185,129,0.06)";

                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.3 + idx * 0.1 }}
                        className="rounded-xl overflow-hidden"
                        style={{ border: `1px solid ${isFixed ? "rgba(16,185,129,0.2)" : borderColor}`, background: isFixed ? "rgba(16,185,129,0.04)" : bgColor }}
                      >
                        <div
                          className="px-3 py-3 cursor-pointer flex items-start gap-2"
                          onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                        >
                          <span style={{ fontSize: 14, flexShrink: 0 }}>{isFixed ? "✅" : alert.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>
                              {alert.campaign}
                            </div>
                            <div style={{ fontFamily: "var(--font-ibm-plex)", fontSize: 12, color: isFixed ? "#10b981" : "#e2e8f0" }}>
                              {isFixed ? "Fix applied — monitoring" : alert.message}
                            </div>
                          </div>
                          <span style={{ color: "#475569", fontSize: 10, flexShrink: 0 }}>{isExpanded ? "▲" : "▼"}</span>
                        </div>

                        <AnimatePresence>
                          {isExpanded && !isFixed && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: EASE }}
                              style={{ overflow: "hidden" }}
                            >
                              <div className="px-3 pb-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                                <div className="pt-2 mb-3" style={{ fontFamily: "var(--font-ibm-plex)", fontSize: 12, color: "#94a3b8" }}>
                                  <span style={{ color: "#475569", fontFamily: "var(--font-jetbrains)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Recommended action</span>
                                  <div className="mt-1">{alert.action}</div>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setAppliedFixes((prev) => { const n = new Set(prev); n.add(alert.id); return n; }); setExpandedAlert(null); }}
                                  style={{
                                    width: "100%",
                                    padding: "6px 12px",
                                    borderRadius: 6,
                                    background: "rgba(16,185,129,0.15)",
                                    border: "1px solid rgba(16,185,129,0.3)",
                                    color: "#10b981",
                                    fontFamily: "var(--font-jetbrains)",
                                    fontSize: 12,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.25)"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.15)"; }}
                                >
                                  Apply Fix →
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* ── Approval Workflow ─────────────────────────────────────── */}
              <motion.div {...fadeUp(0.25)} className="glass-card overflow-hidden">
                <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontFamily: "var(--font-syne)", fontWeight: 600, fontSize: 15 }}>Approval Workflow</span>
                </div>
                <div className="p-4">
                  <AnimatePresence mode="wait">
                    {approvalState === "pending" && (
                      <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {/* Request card */}
                        <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div style={{ fontFamily: "var(--font-syne)", fontSize: 13, fontWeight: 600 }}>Budget Reallocation</div>
                              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "#475569", marginTop: 2 }}>REQ-2847 · 2 hours ago</div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b", fontFamily: "var(--font-jetbrains)", border: "1px solid rgba(245,158,11,0.25)" }}>
                              PENDING
                            </span>
                          </div>
                          <div className="space-y-1.5 mb-3">
                            {[
                              ["Google Ads", "+$12,000", "#3b82f6"],
                              ["Meta Ads", "−$8,500", "#ef4444"],
                              ["LinkedIn", "+$3,500", "#10b981"],
                              ["TikTok", "−$7,000", "#ef4444"],
                            ].map(([plat, delta, color]) => (
                              <div key={plat} className="flex items-center justify-between">
                                <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "#94a3b8" }}>{plat}</span>
                                <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color }}>{delta}</span>
                              </div>
                            ))}
                          </div>
                          {/* Role flow */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                              { role: "CST", name: "J. Park", done: true },
                              { role: "Biddable Lead", name: "Awaiting", done: false },
                              { role: "Super Admin", name: "—", done: false },
                            ].map((step, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                {i > 0 && <span style={{ color: "#2a2a30", fontSize: 10 }}>→</span>}
                                <div className="flex items-center gap-1 px-2 py-1 rounded" style={{
                                  background: step.done ? "rgba(16,185,129,0.12)" : i === 1 ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.03)",
                                  border: `1px solid ${step.done ? "rgba(16,185,129,0.25)" : i === 1 ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.06)"}`,
                                }}>
                                  <span style={{ fontSize: 9, color: step.done ? "#10b981" : i === 1 ? "#f59e0b" : "#475569" }}>{step.done ? "✓" : "○"}</span>
                                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: step.done ? "#10b981" : i === 1 ? "#f59e0b" : "#475569" }}>{step.role}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setApprovalState("approved")}
                            style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.25)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.15)"; }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setApprovalState("rejected")}
                            style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                          >
                            Reject
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {approvalState === "approved" && (
                      <motion.div key="approved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="text-4xl mb-3">✅</motion.div>
                        <div style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 600, color: "#10b981" }}>Approved</div>
                        <div style={{ fontFamily: "var(--font-ibm-plex)", fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Budget changes applied — campaigns updating</div>
                        <button onClick={() => setApprovalState("pending")} style={{ marginTop: 16, padding: "5px 14px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#475569", fontFamily: "var(--font-jetbrains)", fontSize: 11, cursor: "pointer" }}>Reset</button>
                      </motion.div>
                    )}

                    {approvalState === "rejected" && (
                      <motion.div key="rejected" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="text-4xl mb-3">❌</motion.div>
                        <div style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 600, color: "#ef4444" }}>Rejected</div>
                        <div style={{ fontFamily: "var(--font-ibm-plex)", fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Request returned to CST for revision</div>
                        <button onClick={() => setApprovalState("pending")} style={{ marginTop: 16, padding: "5px 14px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#475569", fontFamily: "var(--font-jetbrains)", fontSize: 11, cursor: "pointer" }}>Reset</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* ── Comparison bar ────────────────────────────────────────── */}
              <motion.div {...fadeUp(0.3)} className="glass-card p-4">
                <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                  vs. Manual Tracking
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Update frequency", manual: "Weekly", atlas: "Real-time", good: true },
                    { label: "Time per update", manual: "~2 hours", atlas: "Automated", good: true },
                    { label: "Pacing alerts", manual: "Manual check", atlas: "Instant", good: true },
                    { label: "Approval flow", manual: "Email thread", atlas: "In-app", good: true },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-2">
                      <div style={{ fontFamily: "var(--font-ibm-plex)", fontSize: 11, color: "#94a3b8", width: 110, flexShrink: 0 }}>{row.label}</div>
                      <div className="flex-1 flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", fontFamily: "var(--font-jetbrains)", border: "1px solid rgba(239,68,68,0.2)" }}>
                          {row.manual}
                        </span>
                        <span style={{ color: "#2a2a30", fontSize: 10 }}>→</span>
                        <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", fontFamily: "var(--font-jetbrains)", border: "1px solid rgba(16,185,129,0.2)" }}>
                          {row.atlas}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
