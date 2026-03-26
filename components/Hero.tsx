"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background blobs */}
      <div
        className="glow-blob animate-float-slow"
        style={{
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
          top: "5%",
          left: "-10%",
        }}
        aria-hidden="true"
      />
      <div
        className="glow-blob animate-float-medium"
        style={{
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
          bottom: "10%",
          right: "-8%",
        }}
        aria-hidden="true"
      />
      <div
        className="glow-blob animate-pulse-glow"
        style={{
          width: 300,
          height: 300,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
          top: "50%",
          left: "60%",
          transform: "translate(-50%, -50%)",
        }}
        aria-hidden="true"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10 py-32 text-center">
        {/* Status chip */}
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-sm text-text-secondary mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Open to new opportunities
        </motion.div>

        {/* Name */}
        <motion.p
          {...fadeUp(0.08)}
          className="text-text-secondary text-lg md:text-xl mb-3 font-sans"
        >
          Hi, I&apos;m
        </motion.p>
        <motion.h1
          {...fadeUp(0.14)}
          className="font-display font-extrabold text-6xl md:text-8xl lg:text-9xl tracking-tight text-text-primary leading-none mb-6"
        >
          Anthony Carl
          <span className="gradient-text">.</span>
        </motion.h1>

        {/* Title */}
        <motion.h2
          {...fadeUp(0.2)}
          className="font-display font-semibold text-2xl md:text-4xl text-text-secondary mb-6 leading-snug"
        >
          Software Engineer &{" "}
          <span className="gradient-text-warm">Innovation Strategist</span>
        </motion.h2>

        {/* One-liner */}
        <motion.p
          {...fadeUp(0.26)}
          className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
        >
          I build systems that transform how organizations operate — from 21-tool
          internal platforms to multi-agentic AI pipelines that replace days of
          manual work.
        </motion.p>

        {/* CTA row */}
        <motion.div
          {...fadeUp(0.32)}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => {
              document
                .querySelector("#case-studies")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 rounded-xl font-medium text-sm bg-gradient-accent text-white hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-purple-500/20"
          >
            See My Work
          </button>
          <a
            href="mailto:hello@anthonycarl.com"
            className="px-6 py-3 rounded-xl font-medium text-sm glass-card border border-white/12 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all duration-200"
          >
            Get In Touch
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-text-muted text-xs uppercase tracking-widest">
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-0.5 h-8 bg-gradient-to-b from-text-muted/60 to-transparent rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
