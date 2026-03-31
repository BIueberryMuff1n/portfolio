"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Top-tier orchestration skills — these define the positioning
const orchestrationSkills = [
  {
    icon: "◎",
    title: "Multi-Agent Orchestration",
    desc: "Design and deploy pipelines where multiple AI agents collaborate autonomously.",
    color: "#8b5cf6",
  },
  {
    icon: "⬡",
    title: "LLM Pipeline Architecture",
    desc: "End-to-end pipelines: prompt design, chain-of-thought, output parsing, validation.",
    color: "#22d3ee",
  },
  {
    icon: "↺",
    title: "Human-in-the-Loop Systems",
    desc: "AI proposes. Humans approve. Architecture that keeps judgment where it belongs.",
    color: "#3b82f6",
  },
  {
    icon: "⚡",
    title: "Autonomous Workflow Design",
    desc: "Replace manual processes with self-running systems that compound in value over time.",
    color: "#10b981",
  },
  {
    icon: "◈",
    title: "Claude & Gemini Integration",
    desc: "Deep API integration with Claude (Anthropic) and Gemini Vision for agentic tasks.",
    color: "#f59e0b",
  },
  {
    icon: "⬟",
    title: "Self-Improving Loops",
    desc: "Systems that learn from each run — feedback captured, prompts refined, quality rises.",
    color: "#f43f5e",
  },
];

// Infrastructure — how the above gets built
const infraGroups = [
  {
    label: "Frontend",
    color: "#8b5cf6",
    items: ["TypeScript", "React", "Next.js 14", "Tailwind CSS", "Framer Motion"],
  },
  {
    label: "Backend",
    color: "#22d3ee",
    items: ["Node.js", "Python", "REST APIs", "Firebase/Firestore", "NextAuth.js"],
  },
  {
    label: "Cloud & Data",
    color: "#3b82f6",
    items: ["Google Cloud Platform", "BigQuery", "Azure App Service", "Azure Durable Functions", "Vertex AI"],
  },
  {
    label: "Integrations",
    color: "#10b981",
    items: ["Google Ads API", "Google Sheets API", "Google Slides API", "Slack API", "Funnel.io"],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="relative py-12 overflow-hidden">
      <div
        className="glow-blob"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
          bottom: "10%",
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
          <span className="section-label-num">04</span>
          <div className="section-label-line" />
          <span className="section-label-text">The Stack</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mb-4"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-3">
            Orchestration layer{" "}
            <span className="gradient-text">first.</span>
          </h2>
          <p className="text-text-secondary text-sm max-w-lg">
            The skills that differentiate — then the infrastructure that implements them.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="h-px bg-gradient-to-r from-accent-purple/40 via-accent-cyan/20 to-transparent mb-14"
          style={{ transformOrigin: "left" }}
        />

        {/* Orchestration skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {orchestrationSkills.map((skill, i) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.07, ease: EASE }}
              className="orch-skill group"
            >
              <div className="flex items-start gap-4">
                <span
                  className="text-2xl mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                  style={{ color: skill.color }}
                >
                  {skill.icon}
                </span>
                <div>
                  <div className="font-display font-semibold text-sm text-text-primary mb-1 leading-snug">
                    {skill.title}
                  </div>
                  <div className="text-text-muted text-xs leading-relaxed">{skill.desc}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Infrastructure — compact row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {infraGroups.map((group, i) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.65 + i * 0.06, ease: EASE }}
              className="glass-card p-3.5"
            >
              <div className="flex items-center gap-1.5 mb-2.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: group.color }} />
                <span
                  className="text-[10px] font-mono font-medium uppercase tracking-widest"
                  style={{ color: group.color }}
                >
                  {group.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-[10px] px-1.5 py-0.5 rounded font-mono text-text-secondary"
                    style={{
                      background: `${group.color}0a`,
                      border: `1px solid ${group.color}20`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
