"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import CaseStudyLayout from "@/components/CaseStudyLayout";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Animated Architecture Diagram ─────────────────────────────────────────────

const NODES = [
  {
    id: "brief",
    label: "Campaign Brief",
    sub: "input trigger",
    x: 185,
    y: 10,
    type: "input",
  },
  {
    id: "auditor",
    label: "Auditor Agent",
    sub: "847 campaigns analyzed",
    x: 20,
    y: 105,
    type: "agent-purple",
  },
  {
    id: "strategist",
    label: "Strategist Agent",
    sub: "media strategy gen.",
    x: 350,
    y: 105,
    type: "agent-purple",
  },
  {
    id: "taxonomy",
    label: "Taxonomy Agent",
    sub: "124 naming rules",
    x: 20,
    y: 205,
    type: "agent-cyan",
  },
  {
    id: "vision",
    label: "Vision Agent",
    sub: "38 assets processed",
    x: 350,
    y: 205,
    type: "agent-cyan",
  },
  {
    id: "review",
    label: "Human Review",
    sub: "approve before launch",
    x: 185,
    y: 305,
    type: "human",
  },
  {
    id: "output",
    label: "47 Campaigns",
    sub: "staged + ready",
    x: 185,
    y: 400,
    type: "output",
  },
];

const NODE_STYLES = {
  input: {
    bg: "rgba(71,85,105,0.18)",
    border: "rgba(100,116,139,0.55)",
    text: "#e2e8f0",
    sub: "#64748b",
    glow: "rgba(100,116,139,0.0)",
  },
  "agent-purple": {
    bg: "rgba(139,92,246,0.14)",
    border: "rgba(139,92,246,0.55)",
    text: "#e2e8f0",
    sub: "#8b5cf6",
    glow: "rgba(139,92,246,0.25)",
  },
  "agent-cyan": {
    bg: "rgba(34,211,238,0.1)",
    border: "rgba(34,211,238,0.5)",
    text: "#e2e8f0",
    sub: "#22d3ee",
    glow: "rgba(34,211,238,0.2)",
  },
  human: {
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.5)",
    text: "#e2e8f0",
    sub: "#f59e0b",
    glow: "rgba(245,158,11,0.2)",
  },
  output: {
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.5)",
    text: "#e2e8f0",
    sub: "#10b981",
    glow: "rgba(16,185,129,0.25)",
  },
};

const NW = 150;
const NH = 48;
const cx = (n: (typeof NODES)[0]) => n.x + NW / 2;
const ytop = (n: (typeof NODES)[0]) => n.y;
const ybot = (n: (typeof NODES)[0]) => n.y + NH;

function bezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const mid = (y1 + y2) / 2;
  return `M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`;
}

const EDGES = [
  {
    path: bezier(cx(NODES[0]), ybot(NODES[0]), cx(NODES[1]), ytop(NODES[1])),
    color: "rgba(139,92,246,0.55)",
    marker: "arrow-purple",
    delay: 0,
  },
  {
    path: bezier(cx(NODES[0]), ybot(NODES[0]), cx(NODES[2]), ytop(NODES[2])),
    color: "rgba(139,92,246,0.55)",
    marker: "arrow-purple",
    delay: 0.2,
  },
  {
    path: bezier(cx(NODES[1]), ybot(NODES[1]), cx(NODES[3]), ytop(NODES[3])),
    color: "rgba(139,92,246,0.4)",
    marker: "arrow-purple",
    delay: 0.4,
  },
  {
    path: bezier(cx(NODES[2]), ybot(NODES[2]), cx(NODES[4]), ytop(NODES[4])),
    color: "rgba(139,92,246,0.4)",
    marker: "arrow-purple",
    delay: 0.6,
  },
  {
    path: bezier(cx(NODES[3]), ybot(NODES[3]), cx(NODES[5]), ytop(NODES[5])),
    color: "rgba(34,211,238,0.45)",
    marker: "arrow-cyan",
    delay: 0.8,
  },
  {
    path: bezier(cx(NODES[4]), ybot(NODES[4]), cx(NODES[5]), ytop(NODES[5])),
    color: "rgba(34,211,238,0.45)",
    marker: "arrow-cyan",
    delay: 1.0,
  },
  {
    path: bezier(cx(NODES[5]), ybot(NODES[5]), cx(NODES[6]), ytop(NODES[6])),
    color: "rgba(245,158,11,0.55)",
    marker: "arrow-gold",
    delay: 1.2,
  },
];

function AtlasArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodeDetails: Record<string, string> = {
    brief: "Campaign brief with targeting, budget, and creative specs",
    auditor: "Audits historical campaign data to surface patterns and anomalies",
    strategist: "Generates media strategy recommendations based on audit findings",
    taxonomy: "Applies 124 naming rules to ensure consistent campaign structure",
    vision: "Gemini Vision analyzes creative assets for quality and brand compliance",
    review: "Human approval gate — nothing launches without explicit sign-off",
    output: "47 fully configured campaigns staged in platform, ready for activation",
  };

  return (
    <div
      className="w-full overflow-hidden rounded-xl"
      style={{
        background: "rgba(0,0,0,0.38)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
            Creative Matrix · 4-Agent Pipeline · Atlas Platform
          </span>
        </div>
        <span className="text-[9px] font-mono text-text-muted opacity-50">
          HOVER NODES FOR DETAIL
        </span>
      </div>

      <div className="p-6">
        <svg
          viewBox="0 0 520 475"
          className="w-full"
          style={{ height: "auto" }}
          aria-label="Atlas Creative Matrix 4-agent pipeline architecture diagram"
        >
          <defs>
            {/* Arrow markers */}
            {[
              { id: "arrow-purple", fill: "rgba(139,92,246,0.8)" },
              { id: "arrow-cyan", fill: "rgba(34,211,238,0.8)" },
              { id: "arrow-gold", fill: "rgba(245,158,11,0.8)" },
            ].map(({ id, fill }) => (
              <marker
                key={id}
                id={id}
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L6,3 z" fill={fill} />
              </marker>
            ))}
          </defs>

          {/* Base edges (faint, always visible) */}
          {EDGES.map((edge, i) => (
            <path
              key={`base-${i}`}
              d={edge.path}
              fill="none"
              stroke={edge.color.replace(/[\d.]+\)$/, "0.1)")}
              strokeWidth="1.5"
            />
          ))}

          {/* Animated flowing edges */}
          {EDGES.map((edge, i) => (
            <motion.path
              key={`flow-${i}`}
              d={edge.path}
              fill="none"
              stroke={edge.color}
              strokeWidth="1.5"
              strokeDasharray="10 5"
              animate={{ strokeDashoffset: [30, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "linear",
                delay: edge.delay,
              }}
              markerEnd={`url(#${edge.marker})`}
            />
          ))}

          {/* Nodes */}
          {NODES.map((node, i) => {
            const style = NODE_STYLES[node.type as keyof typeof NODE_STYLES];
            const isActive = activeNode === node.id;

            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.07,
                  ease: EASE,
                }}
                style={{
                  transformOrigin: `${node.x + NW / 2}px ${node.y + NH / 2}px`,
                  cursor: "pointer",
                }}
                onHoverStart={() => setActiveNode(node.id)}
                onHoverEnd={() => setActiveNode(null)}
              >
                {/* Glow halo (visible on hover) */}
                <motion.rect
                  x={node.x - 4}
                  y={node.y - 4}
                  width={NW + 8}
                  height={NH + 8}
                  rx="12"
                  fill="none"
                  stroke={style.border}
                  strokeWidth="1"
                  animate={{ opacity: isActive ? 0.6 : 0.15 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Main rect */}
                <motion.rect
                  x={node.x}
                  y={node.y}
                  width={NW}
                  height={NH}
                  rx="9"
                  fill={style.bg}
                  stroke={style.border}
                  strokeWidth="1"
                  animate={{
                    fill: isActive
                      ? style.bg.replace(/[\d.]+\)$/, "0.28)")
                      : style.bg,
                  }}
                  transition={{ duration: 0.2 }}
                />

                {/* Label */}
                <text
                  x={node.x + NW / 2}
                  y={node.y + 19}
                  textAnchor="middle"
                  fill={style.text}
                  fontSize="9"
                  fontFamily="var(--font-syne)"
                  fontWeight="700"
                  letterSpacing="0.04em"
                >
                  {node.label.toUpperCase()}
                </text>

                {/* Sub-label */}
                <text
                  x={node.x + NW / 2}
                  y={node.y + 34}
                  textAnchor="middle"
                  fill={style.sub}
                  fontSize="8"
                  fontFamily="var(--font-jetbrains)"
                  opacity="0.9"
                >
                  {node.sub}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Active node detail tooltip */}
        <div
          className="mt-3 px-4 py-2.5 rounded-lg text-xs font-mono text-text-secondary transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            minHeight: 36,
          }}
        >
          {activeNode
            ? nodeDetails[activeNode]
            : "Hover a node to see its role in the pipeline"}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-5 justify-center">
          {[
            { color: "#8b5cf6", label: "AI Agent" },
            { color: "#22d3ee", label: "Processing" },
            { color: "#f59e0b", label: "Human Gate" },
            { color: "#10b981", label: "Output" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: item.color }}
              />
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-wide">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Section content ────────────────────────────────────────────────────────────

function ProblemContent() {
  const problems = [
    "21 disconnected tools with no unified data layer — each platform a silo",
    "$300K+/month in ad spend managed through manual Google Sheets trafficking",
    "3-day campaign launch turnaround driven by manual setup, naming, and QA",
    "Print proofing required 2+ days of manual visual review per campaign cycle",
    "Zero real-time budget visibility — issues discovered after the damage was done",
    "Every new hire had to re-learn an undocumented system of workarounds",
  ];

  return (
    <div className="space-y-6">
      <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
        A media agency managing $300K+/month in ad spend across Google, Meta,
        DV360, and 18 other platforms — all manually. No unified platform. No
        automation. Every campaign launch was a multi-day coordination exercise
        between tools that didn&apos;t talk to each other.
      </p>
      <ul className="space-y-2.5">
        {problems.map((p) => (
          <li key={p} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
            <span className="text-red-400/80 mt-1 flex-shrink-0 text-xs">▸</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <div
        className="p-4 rounded-xl text-sm text-text-muted italic font-mono"
        style={{
          background: "rgba(239,68,68,0.05)",
          border: "1px solid rgba(239,68,68,0.12)",
        }}
      >
        The breaking point: a $40K campaign launched with wrong naming
        conventions — discovered three weeks later during reporting. Manual
        systems don&apos;t scale.
      </div>
    </div>
  );
}

function ApproachContent() {
  const principles = [
    {
      title: "Human-in-the-loop by design",
      desc: "AI handles the deterministic work — pattern matching, taxonomy generation, QA checks. Humans own the judgment calls. Nothing launches without explicit approval.",
      color: "#8b5cf6",
    },
    {
      title: "Domain-driven architecture",
      desc: "9 modules, each owning its data and logic. Budget, taxonomy, trafficking, proofing, analytics — cleanly separated with shared RBAC infrastructure.",
      color: "#22d3ee",
    },
    {
      title: "Incremental rollout, proven wins first",
      desc: "Started with a taxonomy builder to prove the model. Built trust before adding AI layers. Teams asked for more after seeing the first module work.",
      color: "#3b82f6",
    },
    {
      title: "Real-time over batch",
      desc: "Campaign launches are time-sensitive. Batch processing at T+24h is worthless when a budget needs reallocation at T+1h. Everything streams.",
      color: "#10b981",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-text-secondary text-sm leading-relaxed max-w-3xl mb-6">
        Atlas wasn&apos;t designed top-down as a grand vision. It was designed
        to solve one real problem at a time — then systematically connected into
        an orchestrated platform.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {principles.map((p) => (
          <div
            key={p.title}
            className="p-5 rounded-xl"
            style={{
              background: `${p.color}09`,
              border: `1px solid ${p.color}25`,
            }}
          >
            <div
              className="font-display font-bold text-sm mb-2"
              style={{ color: p.color }}
            >
              {p.title}
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{p.desc}</p>
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
        The Creative Matrix is the core orchestration engine. One command
        triggers a 4-agent pipeline that takes a campaign brief from input to 47
        fully configured, QA-checked campaigns ready for human review.
      </p>
      <AtlasArchitectureDiagram />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {[
          {
            label: "Monorepo",
            detail: "Next.js 14 · shared RBAC infrastructure across all 9 modules",
            color: "#8b5cf6",
          },
          {
            label: "State Layer",
            detail: "Firebase/Firestore for real-time sync · offline support built-in",
            color: "#22d3ee",
          },
          {
            label: "Analytics",
            detail: "BigQuery for petabyte-scale campaign data · no infrastructure overhead",
            color: "#3b82f6",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-xl"
            style={{
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="text-xs font-mono font-medium mb-1"
              style={{ color: item.color }}
            >
              {item.label}
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeyDecisionsContent() {
  const decisions = [
    {
      decision: "Next.js 14 monorepo",
      why: "Single codebase for 9 modules means shared auth, RBAC, and component library — maintained by one engineer without divergence or duplication.",
      tradeoff: "Larger initial build time in exchange for zero cross-module drift.",
      color: "#8b5cf6",
    },
    {
      decision: "4 specialized agents vs 1 general agent",
      why: "Each agent has a narrow, auditable role. When the Taxonomy Agent fails, you know exactly where to look. General agents are black boxes at scale.",
      tradeoff: "More orchestration complexity, but dramatically easier debugging and auditing.",
      color: "#22d3ee",
    },
    {
      decision: "Firebase + BigQuery (not one DB)",
      why: "Firestore for real-time operational data (who's editing what, campaign status). BigQuery for analytics at scale — two different access patterns, two tools.",
      tradeoff: "Two data layers to maintain, but neither is compromised by the other's requirements.",
      color: "#3b82f6",
    },
    {
      decision: "Real-time over batch processing",
      why: "Campaign budgets need reallocation within hours, not days. A batch job running at midnight is useless when the spend alarm fires at 2pm.",
      tradeoff: "Higher infrastructure cost, but the alternative is missed optimization windows worth thousands.",
      color: "#10b981",
    },
    {
      decision: "Azure App Service (not Vercel)",
      why: "Enterprise SSO requirements via Azure AD. The client's IT team required Azure-native auth. Compliance, not preference.",
      tradeoff: "Less DX convenience, but the only viable path for enterprise deployment.",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-text-secondary text-sm leading-relaxed max-w-3xl mb-6">
        Every architectural decision in Atlas was made under constraint: one
        engineer, enterprise compliance requirements, zero tolerance for data
        loss. These are the five decisions that shaped everything.
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

export default function AtlasPlatformPage() {
  return (
    <CaseStudyLayout
      hero={{
        index: "01",
        title: "Atlas Platform",
        subtitle:
          "21-tool autonomous platform. One engineer. Zero compromises.",
        role: "Sole Engineer",
        timeline: "2023–Present",
        hook:
          "When a $300K/month operation runs on disconnected tools and hope, you don't hire 10 people — you build Atlas.",
        accentColor: "#8b5cf6",
        tags: [
          "Next.js 14",
          "Firebase",
          "BigQuery",
          "Azure",
          "Vertex AI",
          "Gemini Vision",
          "Monorepo",
          "Domain-Driven",
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
        { value: "$300K+/mo", label: "ad spend managed" },
        { value: "21 tools", label: "unified into one platform" },
        { value: "136+ hrs", label: "saved monthly" },
        { value: "Same-day", label: "vs 3-day launches" },
        { value: "47 campaigns", label: "per Creative Matrix run" },
        { value: "9 modules", label: "domain-driven architecture" },
        { value: "205+ files", label: "enterprise-grade codebase" },
        { value: "1 engineer", label: "sole maintainer" },
      ]}
      techStack={[
        { name: "Next.js 14" },
        { name: "TypeScript" },
        { name: "Firebase / Firestore" },
        { name: "BigQuery" },
        { name: "Azure App Service" },
        { name: "Azure AD SSO" },
        { name: "Vertex AI" },
        { name: "Gemini Vision" },
        { name: "Google Ads API" },
        { name: "Meta Ads API" },
        { name: "DV360 API" },
        { name: "Python" },
        { name: "Tailwind CSS" },
        { name: "Framer Motion" },
      ]}
      demoHref="/demos/creative-matrix"
      prevStudy={undefined}
      nextStudy={{
        title: "Media Operations",
        href: "/case-studies/media-operations",
      }}
    />
  );
}
