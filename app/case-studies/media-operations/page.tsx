"use client";

import { motion } from "framer-motion";
import CaseStudyLayout from "@/components/CaseStudyLayout";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Pipeline Diagram ───────────────────────────────────────────────────────────

function MediaOpsPipelineDiagram() {
  const stages = [
    {
      label: "Campaign Brief",
      sub: "trafficking sheet",
      color: "#475569",
      icon: "📋",
    },
    {
      label: "AI Parsing",
      sub: "taxonomy + naming",
      color: "#8b5cf6",
      icon: "🤖",
    },
    {
      label: "Proofing",
      sub: "Gemini Vision QA",
      color: "#22d3ee",
      icon: "🔍",
    },
    {
      label: "Human Gate",
      sub: "approve / reject",
      color: "#f59e0b",
      icon: "👁",
    },
    {
      label: "Auto-Launch",
      sub: "platform activation",
      color: "#10b981",
      icon: "🚀",
    },
  ];

  return (
    <div
      className="w-full overflow-hidden rounded-xl"
      style={{
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          Campaign Automation Pipeline
        </span>
      </div>
      <div className="p-6">
        {/* Pipeline steps */}
        <div className="flex items-stretch gap-1 flex-wrap md:flex-nowrap">
          {stages.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1 flex-1">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                className="flex flex-col items-center px-3 py-3 rounded-xl text-center w-full"
                style={{
                  background: `${s.color}12`,
                  border: `1px solid ${s.color}35`,
                }}
              >
                <span className="text-xl mb-1.5">{s.icon}</span>
                <div
                  className="text-[9px] font-display font-bold uppercase tracking-wider"
                  style={{ color: s.color }}
                >
                  {s.label}
                </div>
                <div className="text-[8px] font-mono text-text-muted mt-0.5">
                  {s.sub}
                </div>
              </motion.div>
              {i < stages.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="flex-shrink-0"
                >
                  <svg
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M0,8 L13,8"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                      strokeDasharray="3 2"
                    />
                    <path
                      d="M10,4 L18,8 L10,12"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1.2"
                    />
                  </svg>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Before/After */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="comparison-before px-4 py-3 text-center">
            <div className="text-[9px] font-mono text-red-400 uppercase tracking-widest mb-1">
              Before Atlas
            </div>
            <div className="font-display font-bold text-xl text-red-300">
              2–3 days
            </div>
            <div className="text-[10px] text-text-muted mt-1">
              manual trafficking + QA
            </div>
          </div>
          <div className="comparison-after px-4 py-3 text-center">
            <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mb-1">
              After Atlas
            </div>
            <div className="font-display font-bold text-xl text-emerald-300">
              Real-time
            </div>
            <div className="text-[10px] text-text-muted mt-1">
              autonomous pipeline
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Budget Oversight Diagram ────────────────────────────────────────────────────

function BudgetOversightDiagram() {
  const platforms = [
    { name: "Google Ads", pct: 42, color: "#3b82f6" },
    { name: "Meta Ads", pct: 28, color: "#8b5cf6" },
    { name: "DV360", pct: 18, color: "#22d3ee" },
    { name: "Other", pct: 12, color: "#475569" },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          BigQuery Budget Oversight · $30M+ Annual
        </span>
      </div>
      <div className="p-5 space-y-3">
        {platforms.map((p, i) => (
          <div key={p.name} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary">
                {p.name}
              </span>
              <span
                className="text-xs font-mono font-medium"
                style={{ color: p.color }}
              >
                {p.pct}%
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: p.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${p.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
              />
            </div>
          </div>
        ))}
        <div className="pt-2 border-t border-white/[0.05] flex justify-between items-center">
          <span className="text-[10px] font-mono text-text-muted">
            Real-time pacing alerts
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            ● LIVE
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Section content ────────────────────────────────────────────────────────────

function ProblemContent() {
  const problems = [
    "Campaign trafficking required 2–3 days of manual setup per flight cycle",
    "Naming convention errors went undetected until reporting — costing optimization data",
    "Print proofing was a 2-day manual review process, blocking creative iterations",
    "$30M+ in annual budget managed through manual spreadsheet lookups and gut checks",
    "92 PPC audit checks done manually across campaigns — hours of repetitive work per week",
    "No unified system of record: data lived in 6+ disconnected platforms",
  ];

  return (
    <div className="space-y-6">
      <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
        Media operations at scale exposes a fundamental tension: the work that
        matters most (strategy, optimization, client relationships) gets crowded
        out by the work that scales worst (manual trafficking, QA, budget
        monitoring).
      </p>
      <ul className="space-y-2.5">
        {problems.map((p) => (
          <li
            key={p}
            className="flex gap-3 text-sm text-text-secondary leading-relaxed"
          >
            <span className="text-red-400/80 mt-1 flex-shrink-0 text-xs">▸</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApproachContent() {
  return (
    <div className="space-y-6">
      <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
        The core design constraint: AI should handle anything with a deterministic
        answer. Humans should own everything that requires judgment. This
        distinction drove every architecture decision.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: "AI owns: pattern matching",
            items: [
              "Taxonomy generation from brief",
              "Naming convention enforcement",
              "Budget pacing calculations",
              "Asset QA via Gemini Vision",
            ],
            color: "#22d3ee",
          },
          {
            title: "Humans own: judgment",
            items: [
              "Strategic budget allocation",
              "Creative direction decisions",
              "Client relationship calls",
              "Final campaign approval",
            ],
            color: "#f59e0b",
          },
        ].map((block) => (
          <div
            key={block.title}
            className="p-5 rounded-xl"
            style={{
              background: `${block.color}09`,
              border: `1px solid ${block.color}25`,
            }}
          >
            <div
              className="font-display font-bold text-sm mb-3"
              style={{ color: block.color }}
            >
              {block.title}
            </div>
            <ul className="space-y-1.5">
              {block.items.map((item) => (
                <li key={item} className="flex gap-2 text-xs text-text-secondary">
                  <span style={{ color: block.color }} className="flex-shrink-0">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchitectureContent() {
  return (
    <div className="space-y-6">
      <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
        Two interlocking systems: a campaign automation pipeline that takes a
        brief to launch in hours, and a BigQuery analytics layer that provides
        real-time oversight of $30M+ in annual spend.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MediaOpsPipelineDiagram />
        <BudgetOversightDiagram />
      </div>
      <div
        className="p-4 rounded-xl text-sm font-mono text-text-muted"
        style={{
          background: "rgba(34,211,238,0.05)",
          border: "1px solid rgba(34,211,238,0.12)",
        }}
      >
        Multi-agent print proofing: Gemini Vision processes each asset against
        brand guidelines, dimensions, and compliance rules — replacing a 2-day
        manual review with a sub-minute autonomous pipeline.
      </div>
    </div>
  );
}

function KeyDecisionsContent() {
  const decisions = [
    {
      decision: "Human approval gate (non-negotiable)",
      why: "AI-proposed, human-approved. Nothing enters a live platform without explicit sign-off. The cost of a false positive in ad ops is real money.",
      tradeoff: "Slower than fully automated, but zero tolerance for unsupervised launches.",
      color: "#f59e0b",
    },
    {
      decision: "BigQuery over a traditional database",
      why: "Campaign data compounds. You need to answer questions about 847 historical campaigns in milliseconds. BigQuery scales to petabytes without schema migrations.",
      tradeoff: "Query latency for simple lookups — mitigated by Firestore for operational data.",
      color: "#22d3ee",
    },
    {
      decision: "Gemini Vision for proofing (not rule-based checks)",
      why: "Creative compliance can't be captured in regex. Gemini Vision understands context — 'does this asset feel on-brand?' isn't a string comparison problem.",
      tradeoff: "Higher cost per check, but eliminates an entire category of human review bottleneck.",
      color: "#8b5cf6",
    },
    {
      decision: "Google Sheets as input surface (not a custom form)",
      why: "The team already lived in Sheets. Building a custom intake form would've created a change management problem. Meet users where they are.",
      tradeoff: "Input validation complexity, but zero adoption friction.",
      color: "#3b82f6",
    },
  ];

  return (
    <div className="space-y-4">
      {decisions.map((d, i) => (
        <motion.div
          key={d.decision}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
          className="flex gap-5 p-5 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="w-1 self-stretch rounded-full flex-shrink-0"
            style={{ background: d.color, minHeight: 56 }}
          />
          <div className="flex-1">
            <div
              className="font-display font-bold text-sm mb-1.5"
              style={{ color: d.color }}
            >
              {d.decision}
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-2">
              {d.why}
            </p>
            <p className="text-[11px] font-mono text-text-muted leading-relaxed">
              Tradeoff: {d.tradeoff}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────

export default function MediaOperationsPage() {
  return (
    <CaseStudyLayout
      hero={{
        index: "02",
        title: "Media Operations",
        subtitle: "Multi-day manual workflows → real-time autonomous pipelines.",
        role: "Platform Engineer",
        timeline: "2023–Present",
        hook:
          "Human-in-the-loop by design — AI handles the deterministic work, humans own the judgment calls.",
        accentColor: "#22d3ee",
        tags: [
          "Python",
          "BigQuery",
          "Google Sheets API",
          "Gemini Vision",
          "Claude API",
          "Human-in-Loop",
          "Real-Time",
        ],
      }}
      sections={[
        {
          num: "01",
          label: "Problem",
          content: <ProblemContent />,
        },
        {
          num: "02",
          label: "Approach",
          content: <ApproachContent />,
        },
        {
          num: "03",
          label: "Architecture",
          content: <ArchitectureContent />,
        },
        {
          num: "04",
          label: "Key Decisions",
          content: <KeyDecisionsContent />,
        },
      ]}
      impact={[
        { value: "Real-time", label: "vs 2–3 day turnaround" },
        { value: "92 checks", label: "PPC audit automated" },
        { value: "$30M+", label: "annual budget oversight" },
        { value: "Sub-minute", label: "print proofing" },
        { value: "0 launches", label: "without human approval" },
        { value: "6 platforms", label: "unified data layer" },
        { value: "136+ hrs", label: "saved monthly" },
        { value: "1 system", label: "of record" },
      ]}
      techStack={[
        { name: "Python" },
        { name: "BigQuery" },
        { name: "Google Sheets API" },
        { name: "Gemini Vision" },
        { name: "Claude API" },
        { name: "Google Ads API" },
        { name: "Meta Ads API" },
        { name: "DV360 API" },
        { name: "Firebase" },
        { name: "Firestore" },
      ]}
      demoHref="/demos/ppc-auditor"
      prevStudy={{
        title: "Atlas Platform",
        href: "/case-studies/atlas-platform",
      }}
      nextStudy={{
        title: "Agency Transformation",
        href: "/case-studies/agency-transformation",
      }}
    />
  );
}
