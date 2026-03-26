"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const experiences = [
  {
    company: "Mile Marker Agency",
    location: "New York, NY",
    role: "Analyst, Innovation & Strategy",
    period: "2025 – Present",
    type: "Engineering",
    bullets: [
      "Built an automated email scheduler system connecting Funnel, Google Sheets, and Gmail to distribute performance reports to vendor partners and clients, eliminating manual sends entirely.",
      "Automated deck generation and reporting templates via Google Slides and Sheets APIs, enabling faster delivery of weekly client presentations with zero repetitive formatting work.",
      "Collaborated with media and analytics leads to document SOPs and establish automation workflows that improved visibility and reduced turnaround time across recurring reporting.",
    ],
  },
  {
    company: "Mile Marker Agency",
    location: "New York, NY",
    role: "Assistant Media Planner",
    period: "2024 – 2025",
    type: "Strategy",
    bullets: [
      "Orchestrated omnichannel media planning and execution across DOOH, TV, CTV, radio, print, social, search, and affiliate channels — supporting 5 active media plans with combined annual budgets exceeding $30M.",
      "Managed 50+ monthly line items and invoices across multiple vendors and platforms, ensuring budget accuracy and reconciliation alignment between media plans and client documentation.",
      "Delivered weekly status reports and monthly competitive analyses across multiple accounts, accelerating turnaround through automated reporting workflows.",
      "Coordinated vendor communications and RFP support across display, programmatic, and partnership opportunities.",
    ],
  },
  {
    company: "Alteryx Inc",
    location: "Irvine, CA",
    role: "Digital Marketing Associate",
    period: "2023 – 2024",
    type: "Marketing",
    bullets: [
      "Managed multi-channel campaigns directly with the Sr. Director of Marketing — overperforming the tech industry by 52% in reach (with 53% smaller audience), 503% in audience growth rate, and 369% in engagement rate.",
      "Created copy and graphics for hundreds of social posts using Hootsuite, Canva, and Google Analytics, maintaining a data-centric approach with weekly metrics reporting.",
      "Coordinated digital marketing for the 22-person SparkED team, organizing and delegating projects via ASANA.",
    ],
  },
  {
    company: "Alteryx Inc",
    location: "Irvine, CA",
    role: "Digital Marketing Intern",
    period: "2022",
    type: "Marketing",
    bullets: [
      "Conducted a comprehensive audit of digital and social media presence, identifying key opportunities for brand enhancement.",
      "Generated 80 pieces of content organized into a content repository and calendar with targeted channels and timelines.",
      "Collaborated weekly with C-Suite executives (SVP, VP) to strategize and improve marketing initiatives.",
    ],
  },
  {
    company: "Mobileware Inc",
    location: "Stony Brook, NY",
    role: "Marketing Intern",
    period: "2021 – 2022",
    type: "Design",
    bullets: [
      "Designed user-friendly websites and apps using Figma, improving user experience for product initiatives.",
      "Created 20+ engaging graphics and email campaigns, connecting with partners and clients.",
      "Structured marketing goals and timelines using Notion, ensuring project milestones were met.",
    ],
  },
  {
    company: "Swift Living LLC",
    location: "Stony Brook, NY",
    role: "Co-Founder, Head of Marketing & Growth",
    period: "2020",
    type: "Founder",
    bullets: [
      "Entered the student rental market in the Stony Brook area, building a brand with over 6,000 users.",
      "Managed 5+ properties generating over $13,000 in monthly revenue.",
      "Approached problems with an open and creative mindset, solving through iteration and collaboration.",
    ],
  },
];

const typeColors: Record<string, string> = {
  Engineering: "text-accent-purple border-accent-purple/30 bg-accent-purple/10",
  Strategy: "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10",
  Marketing: "text-accent-blue border-accent-blue/30 bg-accent-blue/10",
  Design: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Founder: "text-amber-400 border-amber-400/30 bg-amber-400/10",
};

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="relative py-28 overflow-hidden">
      <div
        className="glow-blob"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
          top: "30%",
          left: "-10%",
          position: "absolute",
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10" ref={ref}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="text-accent-purple text-sm font-mono tracking-widest uppercase">02</span>
          <div className="w-8 h-px bg-accent-purple/50" />
          <span className="text-text-secondary text-sm uppercase tracking-widest">Experience</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-16"
        >
          Professional{" "}
          <span className="gradient-text">Timeline</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] md:left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-purple/60 via-accent-cyan/30 to-transparent" />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={`${exp.company}-${exp.role}`}
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.09, ease: EASE }}
                className="relative pl-8 md:pl-12"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-0 top-[22px] w-[15px] h-[15px] md:w-[23px] md:h-[23px] rounded-full border-2 border-accent-purple/60 bg-background flex items-center justify-center"
                >
                  <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full bg-gradient-accent" />
                </div>

                {/* Card */}
                <div className="glass-card glass-card-hover p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h3 className="font-display font-semibold text-lg text-text-primary">
                          {exp.role}
                        </h3>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${typeColors[exp.type] ?? ""}`}
                        >
                          {exp.type}
                        </span>
                      </div>
                      <div className="text-text-secondary text-sm">
                        <span className="font-medium text-accent-cyan/80">{exp.company}</span>
                        <span className="text-text-muted mx-2">·</span>
                        <span className="text-text-muted">{exp.location}</span>
                      </div>
                    </div>
                    <span className="text-text-muted text-sm font-mono whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="flex gap-3 text-text-secondary text-sm leading-relaxed">
                        <span className="text-accent-purple mt-1.5 flex-shrink-0">▸</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 gradient-border p-6 md:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-text-muted text-xs uppercase tracking-widest mb-2">Education</div>
              <h3 className="font-display font-semibold text-xl text-text-primary mb-1">
                Stony Brook University
              </h3>
              <p className="text-text-secondary text-sm">
                B.S. in Business Management — Specialization in Marketing
              </p>
              <p className="text-text-muted text-xs mt-1">W. Turner Founding D Scholarship</p>
            </div>
            <span className="text-text-muted font-mono text-sm">2020 – 2023</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
