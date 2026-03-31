"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const COMMAND = `run creative-matrix --client="NovaCar" --q4-budget=2500000`;

const OUTPUT_LINES: Array<{ text: string; type: "info" | "agent" | "success" | "output" }> = [
  { text: "→ Initializing 4-agent pipeline...", type: "info" },
  { text: "[agent:auditor]      Analyzing 847 historical campaigns", type: "agent" },
  { text: "[agent:auditor]      ✓ Complete — 12 anomalies flagged", type: "success" },
  { text: "[agent:strategist]   Generating Q4 media strategy", type: "agent" },
  { text: "[agent:strategist]   ✓ Complete — strategy confidence: 94%", type: "success" },
  { text: "[agent:taxonomy]     Building 124 naming conventions", type: "agent" },
  { text: "[agent:taxonomy]     ✓ Complete — taxonomy locked", type: "success" },
  { text: "[agent:vision]       Processing 38 creative assets", type: "agent" },
  { text: "[agent:vision]       ✓ Complete — 6 assets flagged for review", type: "success" },
  { text: "→ Pipeline complete in 4.2s", type: "info" },
  { text: "→ 47 campaigns staged · Human review required before launch", type: "output" },
];

type Stage = "idle" | "typing" | "output" | "done";

export default function TerminalBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [stage, setStage] = useState<Stage>("idle");
  const [typedCmd, setTypedCmd] = useState("");
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!inView || stage !== "idle") return;

    const schedule = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay);
      timeouts.current.push(t);
      return t;
    };

    // Start typing the command
    schedule(() => setStage("typing"), 600);

    // Type each character
    let charDelay = 700;
    for (let i = 1; i <= COMMAND.length; i++) {
      const charIndex = i;
      const randomJitter = Math.random() * 40;
      schedule(() => {
        setTypedCmd(COMMAND.slice(0, charIndex));
      }, charDelay + randomJitter);
      charDelay += 45 + randomJitter;
    }

    // After typing finishes, start output lines
    const outputStart = charDelay + 500;
    schedule(() => setStage("output"), outputStart);

    OUTPUT_LINES.forEach((_, i) => {
      schedule(
        () => setVisibleLines((v) => v + 1),
        outputStart + 200 + i * 260
      );
    });

    // Mark done
    schedule(() => setStage("done"), outputStart + OUTPUT_LINES.length * 260 + 400);

    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  const lineColor = (type: string) => {
    if (type === "agent") return "text-cyan-400";
    if (type === "success") return "text-emerald-400";
    if (type === "output") return "text-purple-300";
    return "text-slate-300";
  };

  return (
    <section id="pipeline" className="relative py-28 overflow-hidden">
      <div
        className="glow-blob"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
          top: "0%",
          left: "-5%",
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
          <span className="section-label-num font-mono">⌘</span>
          <div className="section-label-line" />
          <span className="section-label-text">Live Pipeline</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-5 leading-tight">
              This is what{" "}
              <span className="gradient-text">orchestration</span>
              <br />looks like.
            </h2>
            <p className="text-text-secondary text-base leading-relaxed mb-6">
              One command. Four AI agents working in parallel. 847 campaigns analyzed.
              47 campaigns staged. Human review required before anything goes live.
            </p>
            <div className="space-y-3 mb-6">
              {[
                { icon: "⚡", text: "4.2s vs 40hrs manual process" },
                { icon: "🔒", text: "Human-in-the-loop — AI proposes, humans approve" },
                { icon: "♻️", text: "Pipeline self-improves with each run" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 text-sm text-text-secondary">
                  <span className="text-base mt-px">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <Link
              href="/demos/creative-matrix"
              className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-accent-purple hover:text-text-primary border border-accent-purple/30 hover:border-accent-purple/60 hover:bg-accent-purple/10 rounded-lg px-4 py-2.5 transition-all duration-200"
            >
              See it in action →
            </Link>
          </motion.div>

          {/* Right: terminal */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="terminal-screen"
          >
            {/* Header bar */}
            <div className="terminal-header">
              <div className="terminal-dot" style={{ background: "#ff5f57" }} />
              <div className="terminal-dot" style={{ background: "#febc2e" }} />
              <div className="terminal-dot" style={{ background: "#28c840" }} />
              <span
                className="ml-3 text-[10px] font-mono text-text-muted"
                style={{ letterSpacing: "0.08em" }}
              >
                atlas — creative-matrix — zsh
              </span>
            </div>

            {/* Terminal body */}
            <div className="terminal-body">
              {/* Prompt line */}
              <div className="terminal-line flex flex-wrap gap-1">
                <span className="terminal-prompt">~/atlas</span>
                <span className="text-text-muted">$</span>
                <span className="terminal-cmd">
                  {stage === "idle" ? (
                    <span className="terminal-cursor" />
                  ) : (
                    <>
                      {typedCmd}
                      {stage === "typing" && <span className="terminal-cursor" />}
                    </>
                  )}
                </span>
              </div>

              {/* Output lines */}
              {visibleLines > 0 && (
                <div className="mt-3 space-y-0.5">
                  {OUTPUT_LINES.slice(0, visibleLines).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`terminal-line ${lineColor(line.type)}`}
                    >
                      {line.text}
                    </motion.div>
                  ))}
                  {/* Blinking cursor at end */}
                  {stage === "done" && (
                    <div className="terminal-line mt-2 flex items-center gap-1">
                      <span className="terminal-prompt">~/atlas</span>
                      <span className="text-text-muted">$</span>
                      <span className="terminal-cursor" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
