"use client";

import Link from "next/link";
import { motion, useScroll, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CaseStudyHero {
  index: string;
  title: string;
  subtitle: string;
  role: string;
  timeline: string;
  hook: string;
  accentColor: string;
  tags: string[];
}

export interface CaseStudySection {
  num: string;
  label: string;
  content: React.ReactNode;
}

export interface CaseStudyNavLink {
  title: string;
  href: string;
}

interface CaseStudyLayoutProps {
  hero: CaseStudyHero;
  sections: CaseStudySection[];
  impact: Array<{ value: string; label: string }>;
  techStack: Array<{ name: string }>;
  prevStudy?: CaseStudyNavLink;
  nextStudy?: CaseStudyNavLink;
  demoHref?: string;
}

// ── Scroll progress bar ───────────────────────────────────────────────────────

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "linear-gradient(90deg, #8b5cf6, #22d3ee)",
      }}
    />
  );
}

// ── Section block ─────────────────────────────────────────────────────────────

function SectionBlock({ num, label, content }: CaseStudySection) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      className="py-16 border-t border-white/[0.05]"
    >
      <div className="section-label mb-10">
        <span className="section-label-num">{num}</span>
        <div className="section-label-line" />
        <span className="section-label-text">{label}</span>
      </div>
      {content}
    </motion.div>
  );
}

// ── Impact metrics ────────────────────────────────────────────────────────────

function ImpactSection({
  impact,
  sectionNum,
}: {
  impact: Array<{ value: string; label: string }>;
  sectionNum: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      className="py-16 border-t border-white/[0.05]"
    >
      <div className="section-label mb-10">
        <span className="section-label-num">{sectionNum}</span>
        <div className="section-label-line" />
        <span className="section-label-text">Impact</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {impact.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
            className="glass-card p-6 text-center"
          >
            <div className="font-display font-bold text-2xl md:text-3xl gradient-text mb-2 leading-none">
              {m.value}
            </div>
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mt-2">
              {m.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Tech stack ────────────────────────────────────────────────────────────────

function TechStackSection({
  techStack,
  sectionNum,
}: {
  techStack: Array<{ name: string }>;
  sectionNum: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      className="py-16 border-t border-white/[0.05]"
    >
      <div className="section-label mb-10">
        <span className="section-label-num">{sectionNum}</span>
        <div className="section-label-line" />
        <span className="section-label-text">Tech Stack</span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {techStack.map((tech, i) => (
          <motion.span
            key={tech.name}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
            className="px-3.5 py-2 rounded-lg text-sm font-mono text-text-secondary"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            {tech.name}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// ── CTA section ───────────────────────────────────────────────────────────────

function CTASection({ demoHref }: { demoHref?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      className="py-16 border-t border-white/[0.05] text-center"
    >
      <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">
        Let&apos;s build
      </p>
      <h3 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-5">
        Interested in what I can{" "}
        <span className="gradient-text">build for your team?</span>
      </h3>
      <p className="text-text-secondary max-w-md mx-auto mb-8 text-sm leading-relaxed">
        Open to roles in AI systems architecture, multi-agent platform design,
        and full-stack engineering where the goal is systems that scale.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="mailto:hello@anthonycarl.com"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm font-medium text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
          }}
        >
          Let&apos;s Talk →
        </a>
        {demoHref && (
          <Link
            href={demoHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm font-medium text-text-secondary glass-card border border-white/10 hover:text-text-primary hover:border-white/20 transition-all duration-200"
          >
            Try the Demo →
          </Link>
        )}
      </div>
    </motion.div>
  );
}

// ── Prev/Next navigation ──────────────────────────────────────────────────────

function PrevNextNav({
  prev,
  next,
}: {
  prev?: CaseStudyNavLink;
  next?: CaseStudyNavLink;
}) {
  return (
    <div className="py-12 border-t border-white/[0.05] grid grid-cols-2 gap-4 mb-16">
      <div>
        {prev && (
          <Link
            href={prev.href}
            className="group flex flex-col gap-1 p-4 rounded-xl hover:bg-white/[0.04] transition-colors duration-200"
          >
            <span className="text-xs font-mono text-text-muted group-hover:text-accent-purple transition-colors">
              ← Previous
            </span>
            <span className="text-sm font-display font-bold text-text-secondary group-hover:text-text-primary transition-colors">
              {prev.title}
            </span>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link
            href={next.href}
            className="group flex flex-col gap-1 p-4 rounded-xl hover:bg-white/[0.04] transition-colors duration-200 items-end ml-auto"
            style={{ display: "inline-flex" }}
          >
            <span className="text-xs font-mono text-text-muted group-hover:text-accent-purple transition-colors">
              Next →
            </span>
            <span className="text-sm font-display font-bold text-text-secondary group-hover:text-text-primary transition-colors">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Main layout ───────────────────────────────────────────────────────────────

export default function CaseStudyLayout({
  hero,
  sections,
  impact,
  techStack,
  prevStudy,
  nextStudy,
  demoHref,
}: CaseStudyLayoutProps) {
  const impactNum = String(sections.length + 1).padStart(2, "0");
  const techNum = String(sections.length + 2).padStart(2, "0");

  return (
    <>
      <ScrollProgress />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-36 pb-24 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${hero.accentColor}09 0%, transparent 70%)`,
        }}
      >
        {/* Background glow */}
        <div
          className="glow-blob"
          style={{
            width: 800,
            height: 800,
            background: `radial-gradient(circle, ${hero.accentColor}10 0%, transparent 70%)`,
            top: "-30%",
            left: "50%",
            transform: "translateX(-50%)",
            position: "absolute",
          }}
          aria-hidden="true"
        />

        <div className="section-container relative z-10">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-14"
          >
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-secondary transition-colors duration-200 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">
                ←
              </span>
              All Case Studies
            </Link>
          </motion.div>

          {/* Index label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.04, ease: EASE }}
            className="mb-4"
          >
            <span
              className="font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: hero.accentColor }}
            >
              Case Study {hero.index}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.09, ease: EASE }}
            className="font-display font-bold text-5xl md:text-7xl text-text-primary mb-5 leading-[1.04]"
          >
            {hero.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: EASE }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mb-8 leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>

          {/* Role + Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.19, ease: EASE }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono"
              style={{
                background: `${hero.accentColor}12`,
                border: `1px solid ${hero.accentColor}30`,
                color: hero.accentColor,
              }}
            >
              <span className="opacity-60">Role:</span> {hero.role}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-text-secondary">
              <span className="opacity-60">Timeline:</span> {hero.timeline}
            </span>
          </motion.div>

          {/* Hook quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
            className="relative pl-5 max-w-2xl mb-10"
            style={{ borderLeft: `2px solid ${hero.accentColor}55` }}
          >
            <p className="text-text-secondary text-base italic leading-relaxed">
              &ldquo;{hero.hook}&rdquo;
            </p>
          </motion.blockquote>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
            className="flex flex-wrap gap-2"
          >
            {hero.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-1 rounded-full border font-mono"
                style={{
                  background: `${hero.accentColor}08`,
                  borderColor: `${hero.accentColor}28`,
                  color: "#94a3b8",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Sections ──────────────────────────────────────────────────────── */}
      <div className="section-container">
        {sections.map((section) => (
          <SectionBlock key={section.num} {...section} />
        ))}

        <ImpactSection impact={impact} sectionNum={impactNum} />
        <TechStackSection techStack={techStack} sectionNum={techNum} />
        <CTASection demoHref={demoHref} />
        <PrevNextNav prev={prevStudy} next={nextStudy} />
      </div>
    </>
  );
}
