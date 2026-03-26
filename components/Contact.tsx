"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="relative py-28 overflow-hidden">
      {/* Background blobs */}
      <div
        className="glow-blob animate-pulse-glow"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          top: "0%",
          left: "30%",
          position: "absolute",
        }}
        aria-hidden="true"
      />
      <div
        className="glow-blob"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
          bottom: "10%",
          right: "10%",
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
          <span className="text-accent-purple text-sm font-mono tracking-widest uppercase">05</span>
          <div className="w-8 h-px bg-accent-purple/50" />
          <span className="text-text-secondary text-sm uppercase tracking-widest">Contact</span>
        </motion.div>

        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-text-primary leading-tight mb-6"
          >
            Let&apos;s build{" "}
            <span className="gradient-text">something</span>{" "}
            together.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-text-secondary text-lg mb-12 leading-relaxed"
          >
            I&apos;m currently open to new opportunities. Whether you have a role in mind,
            a problem to solve, or just want to connect — I&apos;d love to hear from you.
          </motion.p>

          {/* Email CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.22 }}
          >
            <a
              href="mailto:hello@anthonycarl.com"
              className="group inline-flex items-center gap-4 px-8 py-5 rounded-2xl glass-card border border-white/10 hover:border-accent-purple/40 hover:bg-accent-purple/5 transition-all duration-300"
            >
              <div>
                <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Email</div>
                <div className="font-display font-semibold text-xl md:text-2xl gradient-text group-hover:opacity-90 transition-opacity">
                  hello@anthonycarl.com
                </div>
              </div>
              <motion.span
                className="text-2xl text-accent-purple/60 group-hover:text-accent-purple"
                animate={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                →
              </motion.span>
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-6 mt-10"
          >
            {/* GitHub */}
            <a
              href="https://github.com/BIueberryMuff1n"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-text-muted hover:text-text-primary transition-colors duration-200 group"
            >
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                className="group-hover:text-accent-purple transition-colors duration-200"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span className="text-sm">GitHub</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/anthonyc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-text-muted hover:text-text-primary transition-colors duration-200 group"
            >
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                className="group-hover:text-accent-cyan transition-colors duration-200"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span className="text-sm">LinkedIn</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="section-container relative z-10 mt-24 pt-8 border-t border-white/[0.06]"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-text-muted text-sm">
          <span>
            Built with Next.js, Tailwind CSS, and Framer Motion
          </span>
          <span>
            © {new Date().getFullYear()} Anthony Carl
          </span>
        </div>
      </motion.div>
    </section>
  );
}
