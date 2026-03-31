"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const skills = [
  "TypeScript", "React", "Next.js 14", "Tailwind CSS", "Framer Motion",
  "Node.js", "Python", "Firebase", "BigQuery", "Google Cloud",
  "Azure", "Vertex AI", "Gemini Vision", "Claude API",
  "Google Ads API", "Google Sheets API", "Slack API", "NextAuth.js",
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="relative py-12 overflow-hidden">
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
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="flex flex-wrap gap-2"
        >
          {skills.map((skill) => (
            <span
              key={skill}
              className="text-xs px-3 py-1.5 rounded-full font-mono text-text-secondary"
              style={{
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            >
              {skill}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
