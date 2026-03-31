"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export interface TutorialStep {
  targetId?: string;
  title: string;
  content: string;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Props {
  steps: TutorialStep[];
  visible: boolean;
  onComplete: () => void;
}

const PADDING = 10;
const TOOLTIP_WIDTH = 300;

function getRect(id: string | undefined): TargetRect | null {
  if (!id) return null;
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  // Scroll element into view if off-screen
  if (r.bottom < 0 || r.top > window.innerHeight) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export default function TutorialOverlay({ steps, visible, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);

  // Track viewport size
  useEffect(() => {
    const update = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Reset step when tour becomes visible
  useEffect(() => {
    if (visible) setStep(0);
  }, [visible]);

  // Find target rect when step changes
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setTargetRect(getRect(steps[step]?.targetId));
    }, 120);
    return () => clearTimeout(t);
  }, [step, visible, steps]);

  if (!visible || vw === 0) return null;

  const spotlight = targetRect
    ? {
        top: targetRect.top - PADDING,
        left: targetRect.left - PADDING,
        width: targetRect.width + PADDING * 2,
        height: targetRect.height + PADDING * 2,
      }
    : null;

  // Compute tooltip position (screen-space, no CSS transforms)
  let tipTop: number | undefined;
  let tipBottom: number | undefined;
  let tipLeft: number;

  if (spotlight) {
    // Center horizontally on target, clamp to viewport
    tipLeft = Math.max(
      16,
      Math.min(
        spotlight.left + spotlight.width / 2 - TOOLTIP_WIDTH / 2,
        vw - TOOLTIP_WIDTH - 16
      )
    );
    const spaceBelow = vh - (spotlight.top + spotlight.height);
    if (spaceBelow >= 200 || spaceBelow >= spotlight.top) {
      tipTop = spotlight.top + spotlight.height + 14;
    } else {
      tipBottom = vh - spotlight.top + 14;
    }
  } else {
    // No target — bottom center
    tipLeft = Math.max(16, (vw - TOOLTIP_WIDTH) / 2);
    tipBottom = 28;
  }

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Clickthrough backdrop — catches clicks outside spotlight */}
          <div
            className="fixed inset-0 z-[60]"
            style={{ pointerEvents: spotlight ? "none" : "auto" }}
            onClick={spotlight ? undefined : onComplete}
          />

          {/* Spotlight frame */}
          {spotlight && (
            <motion.div
              key={`spot-${step}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{
                position: "fixed",
                top: spotlight.top,
                left: spotlight.left,
                width: spotlight.width,
                height: spotlight.height,
                borderRadius: 14,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.72)",
                border: "2px solid rgba(139,92,246,0.65)",
                zIndex: 61,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Tooltip bubble */}
          <motion.div
            key={`tip-${step}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{
              position: "fixed",
              zIndex: 62,
              top: tipTop,
              bottom: tipBottom,
              left: tipLeft,
              width: TOOLTIP_WIDTH,
              background: "rgba(8,8,12,0.96)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(139,92,246,0.28)",
              borderRadius: 16,
              padding: "18px 20px 16px",
              boxShadow: "0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.08)",
            }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono uppercase tracking-widest"
                  style={{ color: "#8b5cf6" }}
                >
                  {step + 1} / {steps.length}
                </span>
                {/* Step dots */}
                <div className="flex gap-1 ml-1">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: i === step ? 16 : 4,
                        height: 4,
                        borderRadius: 2,
                        background: i === step ? "#8b5cf6" : "rgba(139,92,246,0.25)",
                        transition: "width 0.25s ease, background 0.25s ease",
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={onComplete}
                className="text-[10px] font-mono text-text-muted hover:text-text-secondary transition-colors"
              >
                Skip tour
              </button>
            </div>

            {/* Content */}
            <h3
              className="font-display font-semibold text-text-primary mb-1.5 leading-snug"
              style={{ fontSize: 14 }}
            >
              {steps[step].title}
            </h3>
            <p className="text-text-secondary leading-relaxed mb-4" style={{ fontSize: 12 }}>
              {steps[step].content}
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="text-[11px] font-mono text-text-muted hover:text-text-secondary transition-colors disabled:opacity-30"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-1.5 text-[11px] font-mono font-semibold rounded-lg text-white transition-opacity duration-200 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
                }}
              >
                {step === steps.length - 1 ? "Finish →" : "Next →"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Restart Tour button — shown after tour completes
export function RestartTourButton({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      onClick={onRestart}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-accent-purple border border-accent-purple/30 hover:bg-accent-purple/10 hover:border-accent-purple/50 transition-all duration-200"
      style={{ background: "rgba(8,8,12,0.9)", backdropFilter: "blur(12px)" }}
    >
      ◈ Restart tour
    </motion.button>
  );
}
