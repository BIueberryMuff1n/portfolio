"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const METRICS = [
  { value: "5 demos", label: "shipped & live" },
  { value: "3 case studies", label: "documented" },
  { value: "100%", label: "TypeScript" },
  { value: "\+", label: "saved monthly" },
];

export default function ProofMetrics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="relative py-8 overflow-hidden">
      {/* Subtle accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex flex-wrap items-center justify-center gap-0 w-full glass-card overflow-hidden"
          style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
              className="flex-1 px-4 py-4 flex flex-col items-center"
              style={{
                borderRight:
                  i < METRICS.length - 1
                    ? "1px solid rgba(255,255,255,0.07)"
                    : undefined,
              }}
            >
              <span className="font-display font-bold text-sm md:text-base text-white">
                {m.value}
              </span>
              <span className="text-text-muted text-[10px] font-mono uppercase tracking-wider mt-0.5">
                {m.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Subtle accent line */}
      <div
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
