"use client";

import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
import { useRef } from "react";

const skillGroups = [
  {
    category: "Languages & Frameworks",
    icon: "⬡",
    color: "#8b5cf6",
    skills: [
      "TypeScript", "JavaScript", "Python", "React", "Next.js 14",
      "Node.js", "HTML/CSS", "SQL",
    ],
  },
  {
    category: "Cloud & Infrastructure",
    icon: "◈",
    color: "#22d3ee",
    skills: [
      "Firebase / Firestore", "Google Cloud Platform", "BigQuery",
      "Azure App Service", "Azure Durable Functions", "Google Cloud Storage",
      "Railway", "Vercel",
    ],
  },
  {
    category: "AI & Automation",
    icon: "◎",
    color: "#3b82f6",
    skills: [
      "Vertex AI", "Gemini Vision", "Claude API", "Multi-agentic Workflows",
      "Human-in-the-loop Systems", "Google Apps Script",
      "Prompt Engineering", "AI Pipeline Design",
    ],
  },
  {
    category: "APIs & Integrations",
    icon: "⬢",
    color: "#10b981",
    skills: [
      "Google Ads API (GAQL)", "Google Sheets API", "Google Slides API",
      "Slack API", "NextAuth.js", "Google OAuth",
      "Resend API", "Funnel.io",
    ],
  },
  {
    category: "Analytics & Data",
    icon: "◇",
    color: "#f59e0b",
    skills: [
      "Google Analytics", "Looker Studio", "Excel / Google Sheets",
      "Recharts", "Data Visualization", "BigQuery Analytics",
      "SPSS", "Competitive Analysis",
    ],
  },
  {
    category: "Tools & Workflow",
    icon: "⬟",
    color: "#f43f5e",
    skills: [
      "Git / GitHub", "Figma", "Notion", "Asana",
      "Tailwind CSS", "ESLint", "Canva", "Adobe Photoshop",
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="relative py-28 overflow-hidden">
      <div
        className="glow-blob"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)",
          bottom: "10%",
          left: "-5%",
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
          <span className="text-accent-purple text-sm font-mono tracking-widest uppercase">04</span>
          <div className="w-8 h-px bg-accent-purple/50" />
          <span className="text-text-secondary text-sm uppercase tracking-widest">Skills</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-16"
        >
          Technical{" "}
          <span className="gradient-text">Arsenal</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: EASE }}
              className="glass-card glass-card-hover p-6"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xl" style={{ color: group.color }}>{group.icon}</span>
                <h3 className="font-display font-semibold text-text-primary text-sm">
                  {group.category}
                </h3>
              </div>

              {/* Color accent line */}
              <div
                className="h-px w-full mb-5 rounded-full opacity-30"
                style={{ background: `linear-gradient(90deg, ${group.color}, transparent)` }}
              />

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-text-secondary hover:text-text-primary hover:border-white/[0.14] transition-colors duration-150 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
