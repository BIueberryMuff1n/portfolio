"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, ease: EASE, delay },
});

const ROTATING_PHRASES = [
  "Multi-Agent Pipelines",
  "Autonomous Systems",
  "Self-Improving Loops",
  "AI-Powered Platforms",
];

function RotatingPhrase() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROTATING_PHRASES.length);
        setVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="gradient-text font-display font-bold"
      style={{
        display: "inline-block",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
      }}
    >
      {ROTATING_PHRASES[index]}
    </span>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Perspective grid floor */}
      <div className="perspective-grid" aria-hidden="true" />

      {/* Glow blobs */}
      <div
        className="glow-blob animate-float-slow"
        style={{
          width: 700,
          height: 700,
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          top: "-5%",
          left: "-15%",
        }}
        aria-hidden="true"
      />
      <div
        className="glow-blob animate-float-medium"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
          bottom: "5%",
          right: "-10%",
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10 py-32 text-center">
        {/* Status chip */}
        <motion.div
          {...fadeUp(0)}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card border border-white/10 text-xs mb-10"
          style={{ color: "#94a3b8", letterSpacing: "0.12em" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono uppercase tracking-widest">Available · AI Orchestrator</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          {...fadeUp(0.1)}
          className="font-display font-extrabold tracking-tight text-text-primary leading-[0.92] mb-4"
          style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
        >
          Anthony Carl
          <span className="gradient-text">.</span>
        </motion.h1>

        {/* Dynamic rotating subtitle */}
        <motion.div
          {...fadeUp(0.18)}
          className="text-xl md:text-2xl text-text-secondary mb-6 font-display"
          style={{ minHeight: "2rem" }}
        >
          I orchestrate &nbsp;
          <RotatingPhrase />
        </motion.div>

        {/* Statement */}
        <motion.p
          {...fadeUp(0.26)}
          className="text-text-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10 font-sans"
        >
          I don&apos;t just write code — I design the systems that run themselves.
          <br className="hidden md:block" />
          Autonomous pipelines. Self-improving loops. AI that multiplies human capacity.
        </motion.p>

        {/* Inline proof bar */}
        <motion.div
          {...fadeUp(0.33)}
          className="inline-flex flex-wrap items-center justify-center gap-0 mb-12 glass-card border border-white/8 overflow-hidden"
          style={{ borderRadius: 12 }}
        >
          {[
            { value: "21", label: "tools orchestrated" },
            { value: "$300K+", label: "saved / month" },
            { value: "10-node", label: "AI pipeline" },
            { value: "4 agents", label: "Creative Matrix" },
          ].map((m, i) => (
            <div
              key={m.label}
              className="px-5 py-3.5 flex flex-col items-center"
              style={{
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : undefined,
              }}
            >
              <span className="font-display font-bold text-sm md:text-base gradient-text">
                {m.value}
              </span>
              <span className="text-text-muted text-[10px] font-mono uppercase tracking-wider mt-0.5">
                {m.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() =>
              document.querySelector("#case-studies")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3.5 rounded-xl font-display font-semibold text-sm bg-gradient-accent text-white hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-purple-500/25 tracking-wide"
          >
            See the Systems →
          </button>
          <a
            href="mailto:hello@anthonycarl.com"
            className="px-7 py-3.5 rounded-xl font-display font-medium text-sm glass-card border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all duration-200"
          >
            Let&apos;s Talk
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-text-muted text-[10px] font-mono uppercase tracking-widest">
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-7 bg-gradient-to-b from-text-muted/60 to-transparent rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
