"use client";

import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Creative Matrix 4-agent pipeline diagram ──────────────────────────────
function CreativeMatrixDiagram() {
  const nodes = [
    { id: "brief", label: "Campaign Brief", sub: "input", x: 165, y: 10, color: "#475569", borderColor: "rgba(100,116,139,0.5)" },
    { id: "auditor", label: "Auditor Agent", sub: "847 campaigns analyzed", x: 20, y: 90, color: "#8b5cf6", borderColor: "rgba(139,92,246,0.6)" },
    { id: "strategist", label: "Strategist Agent", sub: "media strategy gen.", x: 270, y: 90, color: "#8b5cf6", borderColor: "rgba(139,92,246,0.6)" },
    { id: "taxonomy", label: "Taxonomy Agent", sub: "124 naming rules", x: 20, y: 188, color: "#22d3ee", borderColor: "rgba(34,211,238,0.5)" },
    { id: "vision", label: "Vision Agent", sub: "38 assets processed", x: 270, y: 188, color: "#22d3ee", borderColor: "rgba(34,211,238,0.5)" },
    { id: "review", label: "Human Review", sub: "approve before launch", x: 165, y: 278, color: "#f59e0b", borderColor: "rgba(245,158,11,0.5)" },
    { id: "output", label: "47 Campaigns", sub: "staged + ready", x: 165, y: 360, color: "#10b981", borderColor: "rgba(16,185,129,0.5)" },
  ];

  const nW = 150;
  const nH = 48;

  const edges: [number, number][] = [
    [0, 1], [0, 2],
    [1, 3], [2, 4],
    [3, 5], [4, 5],
    [5, 6],
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          Creative Matrix · 4-Agent Pipeline
        </span>
      </div>
      <div className="p-4">
        <svg viewBox="0 0 460 430" className="w-full" style={{ height: "auto", maxHeight: 340 }} aria-hidden="true">
          <defs>
            <marker id="arrow-purple" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="rgba(139,92,246,0.6)" />
            </marker>
            <marker id="arrow-gold" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="rgba(245,158,11,0.6)" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map(([a, b], i) => {
            const na = nodes[a];
            const nb = nodes[b];
            const x1 = na.x + nW / 2;
            const y1 = na.y + nH;
            const x2 = nb.x + nW / 2;
            const y2 = nb.y;
            const mid = (y1 + y2) / 2;
            return (
              <path
                key={i}
                d={`M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`}
                fill="none"
                stroke="rgba(139,92,246,0.25)"
                strokeWidth="1.2"
                strokeDasharray="5 3"
                markerEnd="url(#arrow-purple)"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((n) => (
            <g key={n.id}>
              <rect
                x={n.x} y={n.y} width={nW} height={nH} rx="8"
                fill={`${n.color}18`}
                stroke={n.borderColor}
                strokeWidth="1"
              />
              <text x={n.x + nW / 2} y={n.y + 18} textAnchor="middle"
                fill="#e2e8f0" fontSize="9" fontFamily="var(--font-syne)" fontWeight="700"
                letterSpacing="0.02em">
                {n.label.toUpperCase()}
              </text>
              <text x={n.x + nW / 2} y={n.y + 33} textAnchor="middle"
                fill={n.color} fontSize="8" fontFamily="var(--font-jetbrains)" opacity="0.9">
                {n.sub}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ── Media Ops automation pipeline diagram ─────────────────────────────────
function MediaOpsDiagram() {
  const stages = [
    { label: "Brief", icon: "📋", color: "#475569" },
    { label: "AI Processing", icon: "🤖", color: "#8b5cf6" },
    { label: "Human Review", icon: "👁", color: "#f59e0b" },
    { label: "Launch", icon: "🚀", color: "#10b981" },
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          Campaign Automation Pipeline
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 flex-wrap">
          {stages.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <div
                className="flex flex-col items-center px-4 py-3 rounded-xl text-center"
                style={{
                  background: `${s.color}14`,
                  border: `1px solid ${s.color}44`,
                  minWidth: 90,
                }}
              >
                <span className="text-xl mb-1">{s.icon}</span>
                <span className="text-[10px] font-display font-semibold text-text-primary uppercase tracking-wide">
                  {s.label}
                </span>
              </div>
              {i < stages.length - 1 && (
                <svg width="28" height="16" viewBox="0 0 28 16" className="flex-shrink-0" aria-hidden="true">
                  <path d="M0,8 L22,8" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 2" />
                  <path d="M18,4 L26,8 L18,12" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Before/after */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="comparison-before px-4 py-3 text-center">
            <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-1">Before</div>
            <div className="font-display font-bold text-lg text-red-300">2–3 days</div>
            <div className="text-[10px] text-text-muted">manual trafficking</div>
          </div>
          <div className="comparison-after px-4 py-3 text-center">
            <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-1">After</div>
            <div className="font-display font-bold text-lg text-emerald-300">Real-time</div>
            <div className="text-[10px] text-text-muted">autonomous pipeline</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Agency Transformation — impact diagram ────────────────────────────────
function TransformationDiagram() {
  const phases = [
    { label: "Phase 1", sub: "Core Ops", detail: "Taxonomy · Budget · Auth", color: "#3b82f6" },
    { label: "Phase 2", sub: "AI Modules", detail: "Vision · Agents · Proofing", color: "#8b5cf6" },
    { label: "Phase 3", sub: "Culture Shift", detail: "Automation-first mindset", color: "#10b981" },
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          Atlas Rollout — 3 Phases · 1 Engineer
        </span>
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-3">
          {phases.map((p, i) => (
            <div key={p.label} className="flex items-center gap-4">
              <div
                className="w-1 self-stretch rounded-full flex-shrink-0"
                style={{ background: p.color, minHeight: 44 }}
              />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-bold text-sm text-text-primary">{p.sub}</span>
                  <span className="text-[10px] font-mono text-text-muted">{p.label}</span>
                </div>
                <div className="text-xs text-text-secondary mt-0.5">{p.detail}</div>
              </div>
              {i < phases.length - 1 && (
                <svg width="12" height="28" viewBox="0 0 12 28" className="flex-shrink-0 -ml-2 self-end mb-2" aria-hidden="true">
                  <path d="M6,0 L6,20 M2,16 L6,20 L10,16" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
                </svg>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-text-muted">Result:</span>
          <span className="font-display font-bold text-sm text-text-primary">3-phase rollout · 1 engineer</span>
        </div>
      </div>
    </div>
  );
}

const caseStudies = [
  {
    id: "atlas",
    index: "01",
    title: "Atlas Platform",
    tagline: "21-tool autonomous platform. One engineer. Zero compromises.",
    href: "/case-studies/atlas-platform",
    demoHref: "/demos/creative-matrix",
    tags: ["Next.js 14", "Firebase", "BigQuery", "Azure", "Vertex AI", "Gemini Vision"],
    accentColor: "#8b5cf6",
    impact: [
      { value: "$300K+/mo", label: "operational savings" },
      { value: "21 tools", label: "shipped as sole engineer" },
      { value: "4 AI agents", label: "Creative Matrix pipeline" },
      { value: "9 modules", label: "domain-driven architecture" },
    ],
    bullets: [
      "Designed and built Atlas from scratch — a monorepo platform replacing manual workflows with autonomous AI pipelines.",
      "The Creative Matrix orchestrates 4 AI agents: auditor, strategist, taxonomy generator, and vision analyzer — all in one command.",
      "Print proofing (previously a multi-day manual process) now runs autonomously via Gemini Vision.",
    ],
    diagram: CreativeMatrixDiagram,
    detail: "Architecture: Next.js 14 monorepo · Firebase/Firestore for real-time state · BigQuery for analytics · Azure App Service for hosting · domain-driven module pattern with shared RBAC infrastructure. The monorepo decision was driven by a single-engineer constraint — sharing auth and component logic across 9 modules without drift. The hardest problem was designing a human approval gate that couldn't be bypassed even under time pressure: every campaign touches a Firestore document that requires an explicit human write before the API activates it. If I rebuilt it today, I'd extract the agent orchestration into a dedicated service rather than running it inside the Next.js API routes — the coupling created deployment complexity as agent count grew.",
  },
  {
    id: "media-ops",
    index: "02",
    title: "Media Operations",
    tagline: "Multi-day manual workflows → real-time autonomous pipelines.",
    href: "/case-studies/media-operations",
    demoHref: "/demos/ppc-auditor",
    tags: ["Python", "BigQuery", "Google Sheets API", "Gemini Vision", "Claude API"],
    accentColor: "#22d3ee",
    impact: [
      { value: "Real-time", label: "vs multi-day turnaround" },
      { value: "92 checks", label: "PPC audit automation" },
      { value: "$30M+", label: "budget oversight" },
      { value: "Human-in-loop", label: "AI proposes, humans approve" },
    ],
    bullets: [
      "Engineered an end-to-end campaign trafficking platform: AI handles taxonomy + launch setup, humans approve before anything goes live.",
      "Deployed a multi-agent print proofing system using Gemini Vision — replacing a 2-day manual review with an autonomous pipeline.",
      "Programmatic BigQuery infrastructure provides real-time oversight of $30M+ in annual campaign budgets.",
    ],
    diagram: MediaOpsDiagram,
    detail: "Human-in-the-loop design was intentional: AI handles the deterministic work (pattern matching, taxonomy generation, QA checks); humans own the judgment calls. The Gemini Vision proofing pipeline replaced a 2-day manual review with a sub-minute autonomous check — the constraint was that creative compliance requires contextual reasoning, not just regex, which ruled out rule-based validators. Using Google Sheets as the input surface was a deliberate tradeoff: it added validation complexity but eliminated adoption friction because the team already lived in Sheets. The lesson: meet users where they are before automating them to somewhere new.",
  },
  {
    id: "culture",
    index: "03",
    title: "Agency Transformation",
    tagline: "From manual-by-default to automated-by-default. One engineer did this.",
    href: "/case-studies/agency-transformation",
    demoHref: "/demos/budget-tracker",
    tags: ["Systems Architecture", "Change Management", "AI Integration", "Platform Design"],
    accentColor: "#3b82f6",
    impact: [
      { value: "3 phases", label: "intentional rollout" },
      { value: "8 tools", label: "in full production" },
      { value: "205+ files", label: "enterprise-grade codebase" },
      { value: "1 engineer", label: "sole maintainer" },
    ],
    bullets: [
      "Began with a taxonomy builder to prove the model — structured workflows with guardrails, teams ask for more.",
      "Rolled out Atlas in 3 phases: trust-building ops tools first, then AI modules that changed the game.",
      "The cultural shift is the lasting impact: when a new process emerges, the first question is now 'can we systematize this?'",
    ],
    diagram: TransformationDiagram,
    detail: "Architecture was designed for a single developer maintaining enterprise-grade software: monorepo, domain modules, shared infrastructure. The constraint became a feature — not despite being one engineer, but because of it. Every module had to justify its existence and own its boundary cleanly; there was no team to absorb ambiguity. The cultural shift mattered as much as the technology: the rollout started with a taxonomy builder that gave teams a quick win, building the trust needed to introduce AI layers later. The hardest part wasn't the code — it was sequencing the rollout so that each phase made the next one feel inevitable rather than threatening.",
  },
];

function CaseStudyCard({
  study,
  index,
  inView,
}: {
  study: (typeof caseStudies)[0] & { demoHref?: string };
  index: number;
  inView: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const Diagram = study.diagram;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
      className="glass-card overflow-hidden"
    >
      {/* Accent top strip */}
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, ${study.accentColor}, transparent)` }}
      />

      <div className="p-7 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <span className="font-mono text-xs text-text-muted mb-1 block">{study.index}</span>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-1">
              {study.title}
            </h3>
            <p className="text-text-secondary text-sm max-w-lg">{study.tagline}</p>
          </div>
        </div>

        {/* Two-column: diagram + impact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">
          {/* Diagram */}
          <Diagram />

          {/* Impact metrics + bullets */}
          <div className="flex flex-col gap-5">
            {/* Impact numbers */}
            <div className="grid grid-cols-2 gap-2.5">
              {study.impact.map((m) => (
                <div
                  key={m.label}
                  className="p-3 rounded-xl text-center"
                  style={{
                    background: `${study.accentColor}0e`,
                    border: `1px solid ${study.accentColor}28`,
                  }}
                >
                  <div
                    className="font-display font-bold text-base md:text-lg leading-tight"
                    style={{ color: study.accentColor }}
                  >
                    {m.value}
                  </div>
                  <div className="text-text-muted text-[10px] font-mono mt-0.5 uppercase tracking-wide">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Impact bullets */}
            <ul className="space-y-2.5">
              {study.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                  <span style={{ color: study.accentColor }} className="mt-1 flex-shrink-0 text-xs">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Expandable detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2 border-t border-white/[0.06]">
                <p className="text-text-secondary text-sm leading-relaxed font-mono text-xs">
                  {study.detail}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/[0.05]">
          <div className="flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-1 rounded-full border font-mono"
                style={{
                  background: `${study.accentColor}08`,
                  borderColor: `${study.accentColor}28`,
                  color: "#94a3b8",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-mono font-medium flex items-center gap-1.5 transition-colors duration-200"
              style={{ color: study.accentColor }}
            >
              {expanded ? "Show less" : "Technical details"}
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                ↓
              </motion.span>
            </button>
            <Link
              href={study.href}
              className="text-xs font-mono font-medium flex items-center gap-1 transition-all duration-200 hover:gap-2"
              style={{ color: study.accentColor }}
            >
              Full case study →
            </Link>
            {study.demoHref && (
              <Link
                href={study.demoHref}
                className="text-xs font-mono font-medium flex items-center gap-1 transition-all duration-200 hover:gap-2 text-accent-purple hover:text-text-primary"
              >
                Try the demo →
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseStudies() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="case-studies" className="relative py-16 overflow-hidden">
      <div
        className="glow-blob"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
          top: "10%",
          right: "-15%",
          position: "absolute",
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-label"
        >
          <span className="section-label-num">03</span>
          <div className="section-label-line" />
          <span className="section-label-text">Case Studies</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mb-12"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-3">
            The engineering{" "}
            <span className="gradient-text">behind it.</span>
          </h2>
          <p className="text-text-secondary max-w-xl text-sm">
            Architecture decisions, agent design, and real measured impact — documented.
          </p>
        </motion.div>

        <div className="space-y-8">
          {caseStudies.map((study, i) => (
            <CaseStudyCard key={study.id} study={study} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
