"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
import { useRef, useState } from "react";

const caseStudies = [
  {
    id: "atlas",
    index: "01",
    title: "Atlas Platform",
    subtitle: "Building a 21-Tool Internal Platform as a Solo Engineer",
    tags: ["Next.js 14", "Firebase", "BigQuery", "Azure", "Vertex AI", "Gemini"],
    metrics: [
      { value: "$300K+/mo", label: "Efficiency savings" },
      { value: "21", label: "Tools shipped" },
      { value: "136+", label: "API routes" },
      { value: "9", label: "Domain modules" },
    ],
    problem:
      "Mile Marker Agency ran on spreadsheets, manual handoffs, and disconnected vendor tools. Campaign taxonomy lived in error-prone Google Sheets. Budget pacing required analysts to manually pull data from multiple ad platforms. Print proofing — validating thousands of direct mail pieces — was a multi-day manual process that bottlenecked creative production. Every manual step compounded: more error risk, more delay, more technical debt.",
    approach:
      "I designed and built Atlas from scratch as a monorepo platform on Next.js 14 with Firebase/Firestore for application state, Google BigQuery for analytics, and Azure App Service for hosting. Architecture follows a domain-driven module pattern — each tool in its own directory with isolated services and components, while shared infrastructure (auth, RBAC, logging) lives in a common lib layer.\n\nAI-powered tools are where Atlas gets interesting. The Print Proofing module uses Gemini Vision to validate print mailer PDFs against merchant data grids — replacing a multi-day manual review with an autonomous pipeline. The Creative Matrix is a 7-step wizard orchestrating four AI agents: an auditor, a strategist, a taxonomy generator, and a vision analyzer. The PPC Auditor runs 92 automated checkpoints against Google Ads accounts.",
    result:
      "Atlas eliminated entire categories of manual work. Budget pacing now runs programmatically against BigQuery. Campaign taxonomy is governed through structured approval workflows. Print proofing is handled by an autonomous AI pipeline. Eight tools are in full production use across agency teams, with nine more in beta. The platform saves over $300K/month in operational efficiency — not through headcount reduction, but by reclaiming analyst hours consumed by manual processing.",
    color: "from-violet-500/20 to-cyan-500/20",
    accentColor: "#8b5cf6",
  },
  {
    id: "media-ops",
    index: "02",
    title: "Media Operations Innovation",
    subtitle: "Driving Results Through Engineering at a Media Agency",
    tags: ["Python", "BigQuery", "Google Sheets API", "Gemini Vision", "Automation"],
    metrics: [
      { value: "Multi-day → RT", label: "Data pipeline speed" },
      { value: "Human-in-loop", label: "AI workflow design" },
      { value: "92 checks", label: "PPC audit automation" },
      { value: "$30M+", label: "Budget oversight" },
    ],
    problem:
      "Media agencies live and die by execution speed. At Mile Marker, the gap between strategic planning and campaign delivery was filled with manual labor — analysts hand-building taxonomy strings, trafficking teams manually configuring campaign launches, and operations staff spending hours on data QA that could be systematized. The agency needed someone who could bridge the gap between media strategy and software engineering.",
    approach:
      "My role as Analyst, Innovation & Strategy sits at the intersection of media operations and engineering. Rather than treating technology as a support function, I approached every operational pain point as a systems design problem.\n\nCampaign trafficking automation: engineered an end-to-end platform that fully automates complex taxonomy generation and campaign launches, with a custom human-in-the-loop review workflow. AI handles the heavy lifting; humans approve before anything goes live.\n\nAutonomous QA: deployed a multi-agentic AI system for large-scale print proofing using Gemini Vision. Financial infrastructure: programmatic budget tracking powered by BigQuery provides real-time oversight with automated alerting.",
    result:
      "Processes that once required multi-day turnarounds now happen in real time. QA that was reactive became proactive. The agency gained a competitive advantage: the ability to operate at a speed and accuracy level that manual workflows simply cannot match. The financial infrastructure enables real-time oversight of $30M+ in annual campaign budgets.",
    color: "from-cyan-500/20 to-blue-500/20",
    accentColor: "#22d3ee",
  },
  {
    id: "culture",
    index: "03",
    title: "Agency Transformation",
    subtitle: "How One Engineer Built an Automation-First Culture",
    tags: ["Architecture", "Change Management", "AI Integration", "Platform Design"],
    metrics: [
      { value: "$300K+/mo", label: "Total efficiency impact" },
      { value: "21 tools", label: "Replacing manual workflows" },
      { value: "205+ files", label: "Platform source code" },
      { value: "1 engineer", label: "Enterprise-grade infra" },
    ],
    problem:
      "When I joined Mile Marker Agency, the operation looked like most mid-size media agencies: talented people doing great strategic work, hamstrung by manual processes, disconnected tools, and the kind of operational friction that compounds quietly until it defines how the business runs. Campaigns were trafficked by hand. Budgets were paced in spreadsheets. Creative QA meant someone staring at print mailers for hours.",
    approach:
      "The first project was a taxonomy builder to replace the shared Google Sheet where campaign naming conventions lived. It proved something important: when you give agency teams structured workflows with guardrails, they don't just adopt them — they start asking for more.\n\nThat seed grew into Atlas. The platform evolved through distinct phases: core operations tools (budget tracking, taxonomy, user admin) shipped first and established trust. Then came AI-powered modules that changed the game. The architecture — monorepo, domain-driven modules, shared infrastructure — was designed for a single developer maintaining enterprise-grade software.",
    result:
      "Atlas saves Mile Marker over $300K per month in operational efficiency. The real transformation is cultural. The agency now operates with an automation-first mindset. When a new process emerges, the first question isn't 'who handles this?' — it's 'can we systematize this?' That shift — from manual-by-default to automated-by-default — is the lasting impact.\n\nFor me, the project proved that a single engineer, embedded in the right context with the right autonomy, can transform how an entire organization operates.",
    color: "from-blue-500/20 to-violet-500/20",
    accentColor: "#3b82f6",
  },
];

function CaseStudyCard({ study, index, inView }: { study: typeof caseStudies[0]; index: number; inView: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: EASE }}
      className="glass-card overflow-hidden"
    >
      {/* Header gradient strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${study.color} opacity-80`} />

      <div className="p-7 md:p-10">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <span className="font-mono text-sm text-text-muted mb-2 block">{study.index}</span>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-1">
              {study.title}
            </h3>
            <p className="text-text-secondary text-sm">{study.subtitle}</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {study.metrics.map((m) => (
            <div key={m.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
              <div
                className="font-display font-bold text-lg md:text-xl mb-0.5"
                style={{ color: study.accentColor }}
              >
                {m.value}
              </div>
              <div className="text-text-muted text-xs leading-tight">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Problem */}
        <div className="mb-5">
          <h4 className="text-xs uppercase tracking-widest text-text-muted mb-2 font-medium">
            The Problem
          </h4>
          <p className="text-text-secondary text-sm leading-relaxed">{study.problem}</p>
        </div>

        {/* Expand toggle */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mb-5">
                <h4 className="text-xs uppercase tracking-widest text-text-muted mb-2 font-medium">
                  The Approach
                </h4>
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                  {study.approach}
                </p>
              </div>
              <div className="mb-5">
                <h4 className="text-xs uppercase tracking-widest text-text-muted mb-2 font-medium">
                  The Result
                </h4>
                <p className="text-text-secondary text-sm leading-relaxed">{study.result}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
          <div className="flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 group"
            style={{ color: study.accentColor }}
          >
            {expanded ? "Show less" : "Read full case study"}
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="inline-block"
            >
              ↓
            </motion.span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseStudies() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="case-studies" className="relative py-28 overflow-hidden">
      <div
        className="glow-blob"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          top: "10%",
          right: "-15%",
          position: "absolute",
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="text-accent-purple text-sm font-mono tracking-widest uppercase">03</span>
          <div className="w-8 h-px bg-accent-purple/50" />
          <span className="text-text-secondary text-sm uppercase tracking-widest">Case Studies</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mb-16"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-4">
            The Work That{" "}
            <span className="gradient-text">Mattered</span>
          </h2>
          <p className="text-text-secondary max-w-2xl">
            Three lenses on the same body of work — platform architecture, operational innovation, and organizational transformation.
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
