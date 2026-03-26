"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "$300K+", label: "Monthly efficiency savings", sublabel: "across agency operations" },
  { value: "21", label: "Internal tools shipped", sublabel: "as sole developer" },
  { value: "136+", label: "API routes", sublabel: "across 9 domain modules" },
  { value: "3+", label: "Years building", sublabel: "full-stack products" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="relative py-28 overflow-hidden">
      <div
        className="glow-blob"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
          top: "20%",
          right: "-5%",
          position: "absolute",
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10" ref={ref}>
        {/* Section label */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex items-center gap-3 mb-12"
        >
          <span className="text-accent-purple text-sm font-mono tracking-widest uppercase">01</span>
          <div className="w-8 h-px bg-accent-purple/50" />
          <span className="text-text-secondary text-sm uppercase tracking-widest">About</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <motion.h2
              variants={itemVariants}
              className="font-display font-bold text-4xl md:text-5xl text-text-primary leading-tight mb-8"
            >
              Engineer first.{" "}
              <br />
              <span className="gradient-text">Strategist by necessity.</span>
            </motion.h2>

            <motion.div variants={itemVariants} className="space-y-5 text-text-secondary leading-relaxed">
              <p>
                I&apos;m Anthony — a software engineer who spent three years embedded inside a media agency,
                turning operational friction into engineered systems. My background bridges marketing strategy and
                full-stack development, which means I understand both the business problem and how to solve it technically.
              </p>
              <p>
                At Mile Marker Agency, I built{" "}
                <span className="text-text-primary font-medium">Atlas</span> — a 21-tool internal platform
                from scratch — while simultaneously working as an analyst and media planner. Every tool I built
                solved a real problem I had watched humans struggle with. That context made all the difference.
              </p>
              <p>
                I&apos;m drawn to high-leverage problems: the kind where a well-built system replaces days
                of manual work, where AI augments human judgment rather than replacing it, and where the
                architecture compounds in value over time.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8">
              <a
                href="mailto:hello@anthonycarl.com"
                className="inline-flex items-center gap-2 text-accent-purple hover:text-accent-cyan transition-colors duration-200 text-sm font-medium group"
              >
                hello@anthonycarl.com
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.value}
                variants={itemVariants}
                className="glass-card glass-card-hover p-6"
              >
                <div className="font-display font-bold text-3xl gradient-text mb-1">{stat.value}</div>
                <div className="text-text-primary text-sm font-medium mb-0.5">{stat.label}</div>
                <div className="text-text-muted text-xs">{stat.sublabel}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
