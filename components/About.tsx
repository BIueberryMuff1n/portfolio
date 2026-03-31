"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface CounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  inView: boolean;
  duration?: number;
}

function AnimatedCounter({ target, prefix = "", suffix = "", inView, duration = 1.8 }: CounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, { duration, ease: "easeOut" });
    return controls.stop;
  }, [inView, target, duration, count]);

  return (
    <span>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const metrics = [
  { target: 300, prefix: "$", suffix: "K+", label: "saved / month", color: "#8b5cf6" },
  { target: 21, prefix: "", suffix: "", label: "tools orchestrated", color: "#22d3ee" },
  { target: 136, prefix: "", suffix: "+", label: "API routes", color: "#3b82f6" },
  { target: 9, prefix: "", suffix: "", label: "domain modules", color: "#10b981" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      <div
        className="glow-blob"
        style={{
          width: 450,
          height: 450,
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          top: "10%",
          right: "-8%",
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
          <span className="section-label-num">01</span>
          <div className="section-label-line" />
          <span className="section-label-text">About</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: bio + email */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
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

          {/* Right: animated counters */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="grid grid-cols-2 gap-4"
          >
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE }}
                className="glass-card p-6"
              >
                <div
                  className="font-display font-extrabold text-3xl md:text-4xl mb-1.5"
                  style={{ color: m.color }}
                >
                  <AnimatedCounter
                    target={m.target}
                    prefix={m.prefix}
                    suffix={m.suffix}
                    inView={inView}
                    duration={1.8 + i * 0.2}
                  />
                </div>
                <div className="text-text-secondary text-sm font-medium">{m.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
