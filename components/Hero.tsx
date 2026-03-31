"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, ease: EASE, delay },
});

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

      <div className="section-container relative z-10 py-24 text-center">
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

        {/* Subtitle */}
        <motion.div
          {...fadeUp(0.18)}
          className="text-xl md:text-2xl text-text-secondary mb-6 font-display"
        >
          I orchestrate{" "}
          <span className="gradient-text font-bold">
            AI systems that replace entire workflows
          </span>
        </motion.div>

        {/* Statement — one line */}
        <motion.p
          {...fadeUp(0.26)}
          className="text-text-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10 font-sans"
        >
          I don&apos;t just write code — I design the systems that run themselves.
        </motion.p>

        {/* Proof bar */}
        <motion.div
          {...fadeUp(0.33)}
          className="inline-flex flex-wrap items-center justify-center gap-0 mb-12 glass-card overflow-hidden"
          style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {[
            { value: "21 tools", label: "orchestrated" },
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
              <span className="font-display font-bold text-sm md:text-base text-white">
                {m.value}
              </span>
              <span className="text-text-muted text-[10px] font-mono uppercase tracking-wider mt-0.5">
                {m.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Primary CTAs */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-wrap items-center justify-center gap-4 mb-5"
        >
          <button
            onClick={() =>
              document.querySelector("#demos")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3.5 rounded-xl font-display font-semibold text-sm bg-gradient-accent text-white hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-purple-500/25 tracking-wide"
          >
            See the Demos →
          </button>
          <button
            onClick={() =>
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3.5 rounded-xl font-display font-medium text-sm glass-card border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all duration-200"
          >
            Let&apos;s Talk
          </button>
        </motion.div>

        {/* Resume — subtle below CTAs */}
        <motion.div {...fadeUp(0.46)}>
          <a
            href="/Anthony_Carl_Resume.pdf"
            download
            className="text-text-muted text-xs font-mono hover:text-text-secondary transition-colors duration-200"
          >
            ↓ Download Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
}
