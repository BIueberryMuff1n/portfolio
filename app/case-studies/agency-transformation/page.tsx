"use client";

import { motion } from "framer-motion";
import CaseStudyLayout from "@/components/CaseStudyLayout";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Transformation Phases Diagram ─────────────────────────────────────────────

function TransformationPhasesDiagram() {
  const phases = [
    {
      num: "01",
      label: "Core Ops",
      detail: "Taxonomy builder · Budget auth · Naming enforcement",
      outcome: "Teams trust the system. Adoption without pressure.",
      color: "#3b82f6",
      duration: "Month 1–2",
    },
    {
      num: "02",
      label: "AI Modules",
      detail: "Vision proofing · Agent pipeline · PPC audit automation",
      outcome: "Capabilities that would take a team of 5 to replicate manually.",
      color: "#8b5cf6",
      duration: "Month 3–5",
    },
    {
      num: "03",
      label: "Culture Shift",
      detail: "Automation-first mindset · Self-service tooling · Institutional memory",
      outcome: "New processes start with the question: 'can we systematize this?'",
      color: "#10b981",
      duration: "Month 6+",
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
        <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          Atlas Rollout · 3 Phases · 1 Engineer
        </span>
      </div>
      <div className="p-6 space-y-0">
        {phases.map((phase, i) => (
          <div key={phase.num}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
              className="flex gap-5 py-5"
            >
              {/* Left: number + connector */}
              <div className="flex flex-col items-center gap-0 flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0"
                  style={{
                    background: `${phase.color}18`,
                    border: `1.5px solid ${phase.color}55`,
                    color: phase.color,
                  }}
                >
                  {phase.num}
                </div>
                {i < phases.length - 1 && (
                  <div
                    className="w-[1px] flex-1 mt-2"
                    style={{
                      background: `linear-gradient(to bottom, ${phase.color}40, transparent)`,
                      minHeight: 24,
                    }}
                  />
                )}
              </div>

              {/* Right: content */}
              <div className="flex-1 pb-2">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span
                    className="font-display font-bold text-base"
                    style={{ color: phase.color }}
                  >
                    {phase.label}
                  </span>
                  <span className="text-[9px] font-mono text-text-muted">
                    {phase.duration}
                  </span>
                </div>
                <p className="text-xs text-text-muted mb-2 leading-relaxed">
                  {phase.detail}
                </p>
                <div
                  className="text-[11px] text-text-secondary italic leading-relaxed pl-3"
                  style={{ borderLeft: `1px solid ${phase.color}30` }}
                >
                  {phase.outcome}
                </div>
              </div>
            </motion.div>
            {i < phases.length - 1 && (
              <div
                className="ml-4 h-px"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            )}
          </div>
        ))}

        <div
          className="mt-2 pt-4 border-t border-white/[0.05] flex items-center justify-between"
        >
          <span className="text-xs font-mono text-text-muted">
            Total impact across all phases:
          </span>
          <span className="font-display font-bold text-sm gradient-text">
            $300K+ / month saved
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Module Adoption Timeline ───────────────────────────────────────────────────

function ModuleAdoptionDiagram() {
  const modules = [
    { name: "Taxonomy Builder", adoption: 100, color: "#3b82f6" },
    { name: "Budget Auth", adoption: 100, color: "#3b82f6" },
    { name: "Creative Matrix", adoption: 95, color: "#8b5cf6" },
    { name: "Print Proofing", adoption: 90, color: "#8b5cf6" },
    { name: "PPC Audit Bot", adoption: 88, color: "#22d3ee" },
    { name: "Analytics Layer", adoption: 100, color: "#10b981" },
    { name: "Campaign Trafficking", adoption: 82, color: "#22d3ee" },
    { name: "Reporting Engine", adoption: 75, color: "#f59e0b" },
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
        <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          8 Modules · Production Adoption
        </span>
      </div>
      <div className="p-5 space-y-2.5">
        {modules.map((m, i) => (
          <div key={m.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-text-secondary">
                {m.name}
              </span>
              <span
                className="text-[10px] font-mono font-medium"
                style={{ color: m.color }}
              >
                {m.adoption}%
              </span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: m.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${m.adoption}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section content ────────────────────────────────────────────────────────────

function ProblemContent() {
  const symptoms = [
    "Every process was person-dependent — institutional knowledge lived in people's heads, not systems",
    "No systematic approach to evaluating new tools or workflows",
    "Operational excellence was a competitive disadvantage: slower than it needed to be, costlier than it should be",
    "Technical debt disguised as process: manual steps that 'worked' were actually failure modes waiting to trigger",
    "New hires spent weeks learning workarounds before being productive",
    "The team was reactive by necessity — proactive optimization was a luxury no one had time for",
  ];

  return (
    <div className="space-y-6">
      <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
        The agency wasn&apos;t broken — it was functional. But &ldquo;functional&rdquo; at
        this scale meant chronically operating below potential. Every hour spent
        on manual work was an hour not spent on strategy, relationships, or
        growth.
      </p>
      <ul className="space-y-2.5">
        {symptoms.map((s) => (
          <li
            key={s}
            className="flex gap-3 text-sm text-text-secondary leading-relaxed"
          >
            <span className="text-red-400/70 mt-1 flex-shrink-0 text-xs">▸</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
      <div
        className="p-4 rounded-xl text-sm text-text-muted italic"
        style={{
          background: "rgba(59,130,246,0.05)",
          border: "1px solid rgba(59,130,246,0.12)",
        }}
      >
        The most telling metric: when asked what they&apos;d do with an extra hour
        per day, the answer was always another manual task — not more strategic
        work. The system had trained people to be operational.
      </div>
    </div>
  );
}

function ApproachContent() {
  return (
    <div className="space-y-6">
      <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
        Transformation at this scale fails when it&apos;s imposed top-down.
        The strategy: build tools so useful that adoption becomes self-evident.
        Prove the model at small scale, then expand from earned trust.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Start with pain",
            desc: "The taxonomy builder solved the most-complained-about problem first. Within two weeks, the team was asking for the next module.",
            color: "#3b82f6",
          },
          {
            title: "Build for the skeptic",
            desc: "Every tool needed a fallback. Every automation had an escape hatch. Trust is earned by systems that respect human override.",
            color: "#8b5cf6",
          },
          {
            title: "Document the wins",
            desc: "Measured time saved, errors prevented, and cost reduced — then made those numbers visible. Momentum compounds when people see the proof.",
            color: "#10b981",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-5 rounded-xl"
            style={{
              background: `${item.color}09`,
              border: `1px solid ${item.color}25`,
            }}
          >
            <div
              className="font-display font-bold text-sm mb-2"
              style={{ color: item.color }}
            >
              {item.title}
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
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
        The rollout followed a deliberate 3-phase sequence: establish operational
        trust first, then introduce AI capabilities, then let the culture shift
        follow naturally from demonstrated results.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TransformationPhasesDiagram />
        <ModuleAdoptionDiagram />
      </div>
    </div>
  );
}

function KeyDecisionsContent() {
  const decisions = [
    {
      decision: "Start with taxonomy, not AI",
      why: "A taxonomy builder is boring but critical. It solves a real daily pain point and requires no AI trust. Win with the boring tool, then introduce the exciting ones.",
      tradeoff: "Slower headline impact in the short term, but zero adoption resistance.",
      color: "#3b82f6",
    },
    {
      decision: "Monorepo: one constraint as a feature",
      why: "Maintaining 8 separate repos as a solo engineer is maintenance hell. A monorepo with shared infrastructure means changes to auth, UI components, or logging affect all modules simultaneously.",
      tradeoff: "Larger initial build overhead, but exponentially lower maintenance cost over time.",
      color: "#8b5cf6",
    },
    {
      decision: "RBAC across every module from day one",
      why: "Retrofitting access control into an existing system is 10x harder than building it in from the start. Enterprise clients need granular permissions — designed for it, not bolted on.",
      tradeoff: "More upfront architectural complexity, but no permission debt to repay later.",
      color: "#22d3ee",
    },
    {
      decision: "Measure everything, from the start",
      why: "Cultural transformation requires evidence. Time saved per module, error rates before vs after, cost per campaign launch — these numbers fund the next phase of development.",
      tradeoff: "Instrumentation overhead, but data beats anecdote in every budget conversation.",
      color: "#10b981",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-text-secondary text-sm leading-relaxed max-w-3xl mb-6">
        Building a platform for cultural change is different from building for
        technical elegance. These decisions were shaped as much by organizational
        dynamics as by engineering requirements.
      </p>
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

export default function AgencyTransformationPage() {
  return (
    <CaseStudyLayout
      hero={{
        index: "03",
        title: "Agency Transformation",
        subtitle: "From manual-by-default to automated-by-default. One engineer did this.",
        role: "Sole Engineer & Architect",
        timeline: "2023–Present",
        hook:
          "The cultural shift is the lasting impact: when a new process emerges, the first question is now 'can we systematize this?'",
        accentColor: "#3b82f6",
        tags: [
          "Systems Architecture",
          "Change Management",
          "AI Integration",
          "Platform Design",
          "RBAC",
          "Monorepo",
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
        { value: "3 phases", label: "intentional rollout" },
        { value: "8 modules", label: "in full production" },
        { value: "205+ files", label: "enterprise codebase" },
        { value: "1 engineer", label: "sole maintainer" },
        { value: "$300K+/mo", label: "total operational savings" },
        { value: "Culture", label: "automation-first mindset" },
        { value: "Zero debt", label: "permissions from day one" },
        { value: "Self-service", label: "tooling for the team" },
      ]}
      techStack={[
        { name: "Next.js 14" },
        { name: "TypeScript" },
        { name: "Firebase" },
        { name: "BigQuery" },
        { name: "Azure AD" },
        { name: "Tailwind CSS" },
        { name: "Framer Motion" },
        { name: "Python" },
        { name: "Vertex AI" },
        { name: "Gemini Vision" },
      ]}
      prevStudy={{
        title: "Media Operations",
        href: "/case-studies/media-operations",
      }}
      nextStudy={undefined}
    />
  );
}
