"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="relative py-16 overflow-hidden">
      <div
        className="glow-blob animate-pulse-glow"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          top: "-10%",
          left: "20%",
          position: "absolute",
        }}
        aria-hidden="true"
      />
      <div
        className="glow-blob"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
          bottom: "10%",
          right: "5%",
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
          <span className="section-label-num">05</span>
          <div className="section-label-line" />
          <span className="section-label-text">Contact</span>
        </motion.div>

        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            className="font-display font-extrabold text-text-primary leading-tight mb-5"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Let&apos;s build something{" "}
            <span className="gradient-text">that runs itself.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            className="text-text-secondary text-base mb-10 leading-relaxed"
          >
            Open to roles in AI systems architecture, multi-agent platform design, and
            full-stack engineering where the goal is systems that scale beyond their creator.
          </motion.p>

          {/* Email CTA */}
          <motion.a
            href="mailto:hello@anthonycarl.com"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
            className="group inline-flex items-center gap-5 px-8 py-5 rounded-2xl glass-card border border-white/8 hover:border-accent-purple/40 hover:bg-accent-purple/5 transition-all duration-300 mb-10 w-full sm:w-auto"
          >
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">
                Email
              </div>
              <div className="font-display font-bold text-xl gradient-text">
                hello@anthonycarl.com
              </div>
            </div>
            <span className="text-2xl text-accent-purple/50 group-hover:text-accent-purple group-hover:translate-x-1 transition-all duration-200">
              →
            </span>
          </motion.a>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.34, ease: EASE }}
            className="flex flex-wrap items-center gap-6"
          >
            <a
              href="https://github.com/BIueberryMuff1n"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors duration-200 group text-sm font-mono"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-accent-purple transition-colors duration-200">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              GitHub
            </a>
            {/* TODO: verify correct LinkedIn handle — /in/anthonyc appears too short */}
            <a
              href="https://linkedin.com/in/anthonyc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors duration-200 group text-sm font-mono"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-accent-cyan transition-colors duration-200">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              LinkedIn
            </a>
            <a
              href="/Anthony_Carl_Resume.pdf"
              download
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors duration-200 group text-sm font-mono"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-accent-purple transition-colors duration-200">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Resume
            </a>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="section-container relative z-10 mt-24 pt-8 border-t border-white/[0.05]"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-text-muted text-xs font-mono">
            Built with Next.js · Tailwind CSS · Framer Motion
          </span>
          <span className="text-text-muted text-xs font-mono">
            © {new Date().getFullYear()} Anthony Carl
          </span>
        </div>
      </motion.div>
    </section>
  );
}
