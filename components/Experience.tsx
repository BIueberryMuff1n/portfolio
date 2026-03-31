"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const experiences = [
  {
    company: "Mile Marker Agency",
    role: "Analyst, Innovation & Strategy",
    period: "2025 – Present",
    badge: "Engineering",
    badgeColor: "#8b5cf6",
    highlight: "Architected Atlas: 21-tool autonomous platform saving $300K+/month as sole engineer.",
  },
  {
    company: "Mile Marker Agency",
    role: "Assistant Media Planner",
    period: "2024 – 2025",
    badge: "Strategy",
    badgeColor: "#22d3ee",
    highlight: "Managed $30M+ in annual budgets across 5 active media plans; built automated reporting infrastructure.",
  },
  {
    company: "Alteryx Inc",
    role: "Digital Marketing Associate",
    period: "2023 – 2024",
    badge: "Marketing",
    badgeColor: "#3b82f6",
    highlight: "Overperformed tech industry by 503% in audience growth rate and 369% in engagement rate.",
  },
  {
    company: "Alteryx Inc",
    role: "Digital Marketing Intern",
    period: "2022",
    badge: "Marketing",
    badgeColor: "#3b82f6",
    highlight: "Produced 80-piece content repository; collaborated weekly with C-Suite on marketing strategy.",
  },
  {
    company: "Mobileware Inc",
    role: "Marketing Intern",
    period: "2021 – 2022",
    badge: "Design",
    badgeColor: "#10b981",
    highlight: "Designed user-friendly apps and websites in Figma; created 20+ email campaigns.",
  },
  {
    company: "Swift Living LLC",
    role: "Co-Founder, Head of Marketing & Growth",
    period: "2020",
    badge: "Founder",
    badgeColor: "#f59e0b",
    highlight: "Built a student rental brand with 6,000+ users; managed $13K+/month in property revenue.",
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="relative py-20 overflow-hidden">
      <div
        className="glow-blob"
        style={{
          width: 450,
          height: 450,
          background: "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)",
          top: "20%",
          left: "-8%",
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
          <span className="section-label-num">02</span>
          <div className="section-label-line" />
          <span className="section-label-text">Experience</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-12"
        >
          The path to{" "}
          <span className="gradient-text">orchestration.</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-accent-purple/50 via-accent-cyan/20 to-transparent" />

          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <motion.div
                key={`${exp.company}-${exp.role}`}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.12 + i * 0.08, ease: EASE }}
                className="relative pl-9"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-0 top-4 w-[19px] h-[19px] rounded-full border border-white/10 bg-background flex items-center justify-center"
                  style={{ borderColor: `${exp.badgeColor}44` }}
                >
                  <div
                    className="w-[7px] h-[7px] rounded-full"
                    style={{ background: exp.badgeColor }}
                  />
                </div>

                {/* Row */}
                <div className="glass-card glass-card-hover px-5 py-4 flex flex-wrap items-start gap-x-4 gap-y-2">
                  {/* Left: role + company */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-display font-semibold text-base text-text-primary">
                        {exp.role}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-mono border"
                        style={{
                          color: exp.badgeColor,
                          borderColor: `${exp.badgeColor}40`,
                          background: `${exp.badgeColor}10`,
                        }}
                      >
                        {exp.badge}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted mb-1.5">
                      <span style={{ color: `${exp.badgeColor}cc` }}>{exp.company}</span>
                    </div>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {exp.highlight}
                    </p>
                  </div>

                  {/* Right: period */}
                  <span className="text-text-muted text-xs font-mono whitespace-nowrap pt-0.5">
                    {exp.period}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 gradient-border p-5 md:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">
                Education
              </div>
              <div className="font-display font-bold text-lg text-text-primary mb-0.5">
                Stony Brook University
              </div>
              <div className="text-text-secondary text-sm">
                B.S. Business Management — Specialization in Marketing
              </div>
              <div className="text-text-muted text-xs mt-1 font-mono">
                W. Turner Founding Dean&apos;s Scholarship
              </div>
            </div>
            <span className="text-text-muted font-mono text-sm">2020 – 2023</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
