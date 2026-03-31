"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const DEMOS = [
  {
    href: "/demos/creative-matrix",
    title: "Creative Matrix Simulator",
    description:
      "Watch 4 AI agents — Strategist, Creative, Media Planner, and QA — collaborate on a full campaign brief in real time.",
    label: "4-agent pipeline",
    accent: "#8b5cf6",
    rgb: "139,92,246",
    icon: "◈",
    tags: ["Multi-agent", "Claude API", "Campaign Strategy"],
  },
  {
    href: "/demos/ppc-auditor",
    title: "PPC Auditor",
    description:
      "92-checkpoint audit engine using a hybrid of hard logic API checks and Gemini AI semantic analysis.",
    label: "92 checkpoints",
    accent: "#3b82f6",
    rgb: "59,130,246",
    icon: "◉",
    tags: ["Hybrid Engine", "Gemini AI", "Google Ads"],
  },
  {
    href: "/demos/budget-tracker",
    title: "Budget Tracker",
    description:
      "Real-time campaign budget intelligence with automated pacing alerts and a role-based approval workflow.",
    label: "$30M+ oversight",
    accent: "#22d3ee",
    rgb: "34,211,238",
    icon: "⬡",
    tags: ["BigQuery", "Real-time", "Approvals"],
  },
  {
    href: "/demos/proofing-tool",
    title: "Proofing Tool AI",
    description:
      "Gemini Vision scans mailer PDFs and validates every merchant against an expected list using Chain of Verification.",
    label: "Chain of Verification",
    accent: "#10b981",
    rgb: "16,185,129",
    icon: "◎",
    tags: ["Gemini Vision", "Fuzzy Match", "PDF Analysis"],
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

export default function DemosIndex() {
  return (
    <div className="min-h-screen bg-background text-text-primary font-sans">
      {/* Ambient glows */}
      <div
        className="glow-blob"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          top: "-10%",
          left: "-10%",
          position: "fixed",
        }}
        aria-hidden
      />
      <div
        className="glow-blob"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
          bottom: "5%",
          right: "-8%",
          position: "fixed",
        }}
        aria-hidden
      />

      <div className="section-container relative z-10 pt-28 pb-20">
        {/* Back link */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-secondary transition-colors"
          >
            ← portfolio
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div {...fadeUp(0.05)} className="mb-4">
          <div className="section-label mb-6">
            <span className="section-label-num">◈</span>
            <div className="section-label-line" />
            <span className="section-label-text">Interactive Demos</span>
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-6xl text-text-primary mb-4 leading-tight">
            See the systems{" "}
            <span className="gradient-text">in action.</span>
          </h1>
          <p className="text-text-secondary text-base max-w-xl leading-relaxed">
            Each demo shows a real production system — the same tooling that runs inside Atlas
            Platform. No mockups. No hand-waving.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="h-px bg-gradient-to-r from-accent-purple/40 via-accent-cyan/20 to-transparent mb-14"
          style={{ transformOrigin: "left" }}
        />

        {/* Demo cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMOS.map((demo, i) => (
            <motion.div
              key={demo.href}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 + i * 0.1, ease: EASE }}
            >
              <Link href={demo.href} className="group block">
                <div
                  className="glass-card glass-card-hover h-full overflow-hidden"
                  style={{ border: `1px solid rgba(${demo.rgb},0.18)` }}
                >
                  {/* Accent strip */}
                  <div
                    className="h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, ${demo.accent}, transparent)`,
                    }}
                  />

                  <div className="p-7">
                    {/* Icon + label */}
                    <div className="flex items-center justify-between mb-5">
                      <span
                        className="text-3xl"
                        style={{ color: demo.accent }}
                      >
                        {demo.icon}
                      </span>
                      <span
                        className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full"
                        style={{
                          background: `rgba(${demo.rgb},0.12)`,
                          color: demo.accent,
                          border: `1px solid rgba(${demo.rgb},0.25)`,
                        }}
                      >
                        {demo.label}
                      </span>
                    </div>

                    {/* Title + description */}
                    <h2
                      className="font-display font-bold text-xl text-text-primary mb-2 group-hover:text-white transition-colors"
                    >
                      {demo.title}
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed mb-5">
                      {demo.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {demo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md font-mono text-text-muted"
                          style={{
                            background: `rgba(${demo.rgb},0.06)`,
                            border: `1px solid rgba(${demo.rgb},0.15)`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div
                      className="flex items-center gap-2 text-sm font-mono font-semibold group-hover:gap-3 transition-all duration-200"
                      style={{ color: demo.accent }}
                    >
                      Try it →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
