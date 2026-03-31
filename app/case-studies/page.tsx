"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const studies = [
  {
    index: "01",
    title: "Atlas Platform",
    tagline: "21-tool autonomous platform. One engineer. Zero compromises.",
    hook: "When a $300K/month operation runs on disconnected tools and hope, you don't hire 10 people — you build Atlas.",
    href: "/case-studies/atlas-platform",
    accentColor: "#8b5cf6",
    metrics: [
      { value: "$300K+/mo", label: "managed" },
      { value: "21 tools", label: "unified" },
      { value: "4 AI agents", label: "pipeline" },
    ],
    tags: ["Next.js 14", "Firebase", "BigQuery", "Vertex AI", "Gemini Vision"],
  },
  {
    index: "02",
    title: "Media Operations",
    tagline: "Multi-day manual workflows → real-time autonomous pipelines.",
    hook: "Human-in-the-loop by design — AI handles the deterministic work, humans own the judgment calls.",
    href: "/case-studies/media-operations",
    accentColor: "#22d3ee",
    metrics: [
      { value: "Real-time", label: "vs 3-day turnaround" },
      { value: "92 checks", label: "automated" },
      { value: "$30M+", label: "budget oversight" },
    ],
    tags: ["Python", "BigQuery", "Gemini Vision", "Claude API"],
  },
  {
    index: "03",
    title: "Agency Transformation",
    tagline: "From manual-by-default to automated-by-default.",
    hook: "The cultural shift is the lasting impact: when a new process emerges, the first question is now 'can we systematize this?'",
    href: "/case-studies/agency-transformation",
    accentColor: "#3b82f6",
    metrics: [
      { value: "3 phases", label: "intentional rollout" },
      { value: "8 tools", label: "in production" },
      { value: "1 engineer", label: "sole maintainer" },
    ],
    tags: ["Systems Design", "Change Management", "AI Integration"],
  },
];

function StudyCard({
  study,
  index,
  inView,
}: {
  study: (typeof studies)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
    >
      <Link href={study.href} className="block group">
        <div
          className="glass-card overflow-hidden glass-card-hover"
          style={{ transition: "all 0.3s ease" }}
        >
          {/* Accent top strip */}
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, ${study.accentColor}, transparent)`,
            }}
          />

          <div className="p-8 md:p-10">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                {/* Index + Title */}
                <span className="font-mono text-xs text-text-muted block mb-1">
                  {study.index}
                </span>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-2 group-hover:gradient-text transition-all duration-200">
                  {study.title}
                </h2>
                <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                  {study.tagline}
                </p>

                {/* Blockquote hook */}
                <blockquote
                  className="pl-4 mb-6 text-sm italic text-text-muted leading-relaxed"
                  style={{ borderLeft: `1px solid ${study.accentColor}40` }}
                >
                  &ldquo;{study.hook}&rdquo;
                </blockquote>

                {/* Metrics */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {study.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="px-3 py-2 rounded-lg text-center"
                      style={{
                        background: `${study.accentColor}0d`,
                        border: `1px solid ${study.accentColor}25`,
                      }}
                    >
                      <div
                        className="font-display font-bold text-sm"
                        style={{ color: study.accentColor }}
                      >
                        {m.value}
                      </div>
                      <div className="text-[9px] font-mono text-text-muted uppercase tracking-wide mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-1 rounded-full border font-mono"
                      style={{
                        background: `${study.accentColor}07`,
                        borderColor: `${study.accentColor}22`,
                        color: "#94a3b8",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${study.accentColor}12`,
                  border: `1px solid ${study.accentColor}30`,
                  color: study.accentColor,
                }}
              >
                <span className="text-sm group-hover:translate-x-0.5 transition-transform duration-200 inline-block">
                  →
                </span>
              </div>
            </div>

            {/* CTA text */}
            <div
              className="mt-6 pt-5 border-t border-white/[0.05] flex items-center justify-between"
            >
              <span className="text-xs font-mono text-text-muted">
                Full architecture breakdown
              </span>
              <span
                className="text-xs font-mono font-medium transition-colors duration-200"
                style={{ color: study.accentColor }}
              >
                Read case study →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CaseStudiesIndexPage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative py-28 overflow-hidden min-h-screen">
      {/* Background glow */}
      <div
        className="glow-blob"
        style={{
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
          top: "5%",
          right: "-15%",
          position: "absolute",
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10" ref={ref}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="section-label mb-12"
        >
          <span className="section-label-num">03</span>
          <div className="section-label-line" />
          <span className="section-label-text">Case Studies</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          className="mb-14"
        >
          <h1 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-3">
            The systems{" "}
            <span className="gradient-text">I built.</span>
          </h1>
          <p className="text-text-secondary max-w-xl text-sm leading-relaxed">
            Architecture deep-dives with agent designs, key decisions, and
            measured real-world impact. No slides — actual systems.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="space-y-6">
          {studies.map((study, i) => (
            <StudyCard key={study.index} study={study} index={i} inView={inView} />
          ))}
        </div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
          className="mt-14 text-center"
        >
          <Link
            href="/"
            className="text-xs font-mono text-text-muted hover:text-text-secondary transition-colors duration-200 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">
              ←
            </span>{" "}
            Back to home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
