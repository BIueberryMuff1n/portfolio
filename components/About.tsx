"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-16 overflow-hidden">
      <div className="section-container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-label"
        >
          <span className="section-label-num">01</span>
          <div className="section-label-line" />
          <span className="section-label-text">About</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="max-w-2xl"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary leading-tight mb-6">
            Not a developer.
            <br />
            <span className="gradient-text">An orchestrator.</span>
          </h2>

          <div className="space-y-4 text-text-secondary text-base leading-relaxed mb-8">
            <p>
              Three years embedded inside a media agency. I built the automation layer —
              from scratch, as the sole engineer — saving{" "}
              <span className="text-text-primary font-medium">six figures monthly</span> in operational overhead.
            </p>
            <p>
              My work isn&apos;t about writing functions. It&apos;s about designing systems where AI agents
              handle 80% of the work, and humans only touch what actually needs human judgment.
            </p>
            <p className="text-text-muted text-sm">
              Available for: AI systems architecture · multi-agent pipeline design · full-stack implementation
            </p>
          </div>

          <a
            href="mailto:hello@anthonycarl.com"
            className="inline-flex items-center gap-2 text-accent-purple hover:text-accent-cyan transition-colors duration-200 text-sm font-medium font-mono group"
          >
            hello@anthonycarl.com
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
