"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const DEMOS = [
  {
    href: "/demos/creative-matrix",
    title: "Creative Matrix",
    description: "4 AI agents build an entire campaign strategy — audience segments, ad copy, media plan, QA — from a single brief.",
    label: "Multi-agent pipeline",
    accent: "#8b5cf6",
    rgb: "139,92,246",
    icon: "◈",
    time: "3 days → 4.2 seconds",
  },
  {
    href: "/demos/ppc-auditor",
    title: "PPC Auditor",
    description: "92-checkpoint hybrid audit: hard logic catches structure issues, Gemini AI flags semantic problems humans miss.",
    label: "92 checkpoints",
    accent: "#3b82f6",
    rgb: "59,130,246",
    icon: "◉",
    time: "4–6 hrs → minutes",
  },
  {
    href: "/demos/budget-tracker",
    title: "Budget Tracker",
    description: "Real-time pacing intelligence on $30M+ in campaigns. Automated alerts. Role-based approval workflow.",
    label: "Real-time oversight",
    accent: "#22d3ee",
    rgb: "34,211,238",
    icon: "⬡",
    time: "Weekly sheets → live dashboard",
  },
  {
    href: "/demos/proofing-tool",
    title: "Proofing Tool AI",
    description: "Gemini Vision reads mailer PDFs and validates every merchant against the expected list — with fuzzy matching.",
    label: "Chain of Verification",
    accent: "#10b981",
    rgb: "16,185,129",
    icon: "◎",
    time: "2 days manual → automated",
  },
];

export default function Demos() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="demos" className="relative py-20 overflow-hidden">
      <div
        className="glow-blob"
        style={{
          width: 700,
          height: 700,
          background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
          top: "5%",
          left: "-15%",
          position: "absolute",
        }}
        aria-hidden="true"
      />
      <div
        className="glow-blob"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
          bottom: "10%",
          right: "-10%",
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
          <span className="section-label-num">◈</span>
          <div className="section-label-line" />
          <span className="section-label-text">Interactive Demos</span>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-3">
              The systems.{" "}
              <span className="gradient-text">Live.</span>
            </h2>
            <p className="text-text-secondary max-w-xl text-sm leading-relaxed">
              These aren&apos;t prototypes — they&apos;re production systems from Atlas Platform,
              demoed in the browser. Each one replaces days of manual work.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <Link
              href="/demos"
              className="inline-flex items-center gap-2 text-xs font-mono text-accent-purple hover:text-text-primary border border-accent-purple/30 hover:border-accent-purple/60 hover:bg-accent-purple/10 rounded-lg px-4 py-2 transition-all duration-200"
            >
              View all demos →
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DEMOS.map((demo, i) => (
            <motion.div
              key={demo.href}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 + i * 0.1, ease: EASE }}
            >
              <Link href={demo.href} className="group block h-full">
                <div
                  className="glass-card glass-card-hover h-full overflow-hidden"
                  style={{ border: `1px solid rgba(${demo.rgb},0.15)` }}
                >
                  {/* Accent strip */}
                  <div
                    className="h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, ${demo.accent}, transparent)`,
                    }}
                  />

                  <div className="p-6">
                    {/* Icon + time stat */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span className="text-2xl mt-0.5" style={{ color: demo.accent }}>
                        {demo.icon}
                      </span>
                      <span
                        className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full text-right"
                        style={{
                          background: `rgba(${demo.rgb},0.10)`,
                          color: demo.accent,
                          border: `1px solid rgba(${demo.rgb},0.22)`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {demo.time}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-text-primary mb-2 group-hover:text-white transition-colors">
                      {demo.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-5">
                      {demo.description}
                    </p>

                    <div
                      className="flex items-center gap-1.5 text-xs font-mono font-semibold group-hover:gap-2.5 transition-all duration-200"
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
    </section>
  );
}
