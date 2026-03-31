"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import TutorialOverlay, { RestartTourButton, TutorialStep } from "@/components/TutorialOverlay";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = "idle" | "scanning" | "fuzzy" | "results";

type MatchStatus = "matched" | "missing" | "unexpected" | "flagged";

interface MerchantResult {
  name: string;
  status: MatchStatus;
  page?: number;
  confidence?: number;
  detectedAs?: string;
  aiReasoning: string;
  logoQuality?: "good" | "low";
}

interface FuzzyMatch {
  detected: string;
  canonical: string;
  confidence: number;
}

interface Preset {
  id: string;
  title: string;
  subtitle: string;
  pages: number;
  description: string;
  scanPages: { page: number; merchants: string[] }[];
  fuzzyMatches: FuzzyMatch[];
  results: MerchantResult[];
  stats: {
    expected: number;
    matched: number;
    missing: number;
    unexpected: number;
    flagged: number;
  };
  metrics: {
    detectionAccuracy: string;
    fuzzyMatchRate: string;
    falsePositiveRate: string;
    processingTime: string;
    manualTime: string;
  };
}

// ── Preset Data ───────────────────────────────────────────────────────────────

const PRESETS: Preset[] = [
  {
    id: "q1-doordash",
    title: "Q1 DoorDash Mailer",
    subtitle: "Northeast",
    pages: 8,
    description: "Mostly correct — minor discrepancies flagged",
    scanPages: [
      { page: 1, merchants: ["Subway", "McDonald's", "Burger King"] },
      { page: 2, merchants: ["Wendy's", "Chick-fil-A", "Taco Bell"] },
      { page: 3, merchants: ["Domino's", "Pizza Hut", "Chipotle"] },
      { page: 4, merchants: ["Starbucks", "Dunkin'", "Chik-Fil-A"] },
      { page: 5, merchants: ["McDnlds", "KFC", "Five Guys"] },
      { page: 6, merchants: ["Panera Bread", "BK", "Jersey Mike's"] },
      { page: 7, merchants: ["Shake Shack", "Wingstop", "Arby's"] },
      { page: 8, merchants: ["Popeyes", "Dairy Queen", "Tim Hortons"] },
    ],
    fuzzyMatches: [
      { detected: "McDnlds", canonical: "McDonald's", confidence: 94 },
      { detected: "BK", canonical: "Burger King", confidence: 89 },
      { detected: "Chik-Fil-A", canonical: "Chick-fil-A", confidence: 91 },
    ],
    stats: { expected: 42, matched: 38, missing: 3, unexpected: 1, flagged: 2 },
    metrics: {
      detectionAccuracy: "97.3%",
      fuzzyMatchRate: "94.1%",
      falsePositiveRate: "0.8%",
      processingTime: "23 seconds",
      manualTime: "~45 minutes",
    },
    results: [
      { name: "McDonald's", status: "matched", page: 5, confidence: 99, detectedAs: "McDnlds", aiReasoning: "Detected 'McDnlds' on page 5, resolved to 'McDonald's' via fuzzy matching (char similarity + golden arches logo)." },
      { name: "Burger King", status: "matched", page: 6, confidence: 89, detectedAs: "BK", aiReasoning: "Detected abbreviation 'BK' on page 6. Matched to 'Burger King' based on brand abbreviation lookup and crown logo detection." },
      { name: "Chick-fil-A", status: "flagged", page: 4, confidence: 91, detectedAs: "Chik-Fil-A", aiReasoning: "Detected 'Chik-Fil-A' on page 4, matched to 'Chick-fil-A' with 91% confidence. Flagged: capitalization variant may indicate OCR error.", logoQuality: "good" },
      { name: "Subway", status: "matched", page: 1, confidence: 99, aiReasoning: "Exact match detected on page 1." },
      { name: "Wendy's", status: "matched", page: 2, confidence: 98, aiReasoning: "Exact match detected on page 2." },
      { name: "Taco Bell", status: "matched", page: 2, confidence: 99, aiReasoning: "Exact match detected on page 2." },
      { name: "Domino's", status: "matched", page: 3, confidence: 97, aiReasoning: "Exact match detected on page 3." },
      { name: "Starbucks", status: "matched", page: 4, confidence: 99, aiReasoning: "Exact match detected on page 4." },
      { name: "Dunkin'", status: "flagged", page: 4, confidence: 82, aiReasoning: "Detected on page 4 with 82% confidence. Logo quality assessed as low — brand mark partially obscured. Manual review recommended.", logoQuality: "low" },
      { name: "KFC", status: "matched", page: 5, confidence: 96, aiReasoning: "Exact match detected on page 5." },
      { name: "Panda Express", status: "missing", aiReasoning: "Not detected on any page. Expected per merchant grid for Northeast Q1 campaign. Possible omission from print run." },
      { name: "Olive Garden", status: "missing", aiReasoning: "Not detected on any page. Expected per merchant grid." },
      { name: "Applebee's", status: "missing", aiReasoning: "Not detected on any page. Expected per merchant grid. Possible substitution." },
      { name: "Popeyes", status: "unexpected", page: 8, confidence: 96, aiReasoning: "Detected on page 8 but not present in merchant grid for this submarket/week. Likely included in error." },
      { name: "Chipotle", status: "matched", page: 3, confidence: 99, aiReasoning: "Exact match detected on page 3." },
      { name: "Five Guys", status: "matched", page: 5, confidence: 98, aiReasoning: "Exact match detected on page 5." },
      { name: "Panera Bread", status: "matched", page: 6, confidence: 99, aiReasoning: "Exact match detected on page 6." },
      { name: "Jersey Mike's", status: "matched", page: 6, confidence: 97, aiReasoning: "Exact match detected on page 6." },
      { name: "Shake Shack", status: "matched", page: 7, confidence: 99, aiReasoning: "Exact match detected on page 7." },
      { name: "Wingstop", status: "matched", page: 7, confidence: 98, aiReasoning: "Exact match detected on page 7." },
    ],
  },
  {
    id: "holiday-national",
    title: "Holiday Promo Mailer",
    subtitle: "National",
    pages: 12,
    description: "Several issues detected across multiple pages",
    scanPages: [
      { page: 1, merchants: ["Target", "Best Buy", "Walmart"] },
      { page: 2, merchants: ["Amazon", "Apple Store", "GameStop"] },
      { page: 3, merchants: ["Macy's", "Nordstrom", "Gap"] },
      { page: 4, merchants: ["Nike", "Adidas", "Foot Locker"] },
      { page: 5, merchants: ["Starbucks", "Panera", "Chipotle"] },
      { page: 6, merchants: ["McDonalds", "BurgerKng", "Wendys"] },
      { page: 7, merchants: ["AMC Theatres", "Regal", "IMAX"] },
      { page: 8, merchants: ["Home Depot", "Lowes", "IKEA"] },
      { page: 9, merchants: ["CVS", "Walgreens", "RiteAide"] },
      { page: 10, merchants: ["Uber Eats", "DoorDash", "GrubHub"] },
      { page: 11, merchants: ["Peloton", "Gold's Gym"] },
      { page: 12, merchants: ["Barnes Noble", "Bookseller", "Amazon"] },
    ],
    fuzzyMatches: [
      { detected: "McDonalds", canonical: "McDonald's", confidence: 97 },
      { detected: "BurgerKng", canonical: "Burger King", confidence: 86 },
      { detected: "RiteAide", canonical: "Rite Aid", confidence: 88 },
    ],
    stats: { expected: 48, matched: 39, missing: 6, unexpected: 3, flagged: 4 },
    metrics: {
      detectionAccuracy: "95.8%",
      fuzzyMatchRate: "90.3%",
      falsePositiveRate: "1.4%",
      processingTime: "31 seconds",
      manualTime: "~75 minutes",
    },
    results: [
      { name: "McDonald's", status: "matched", page: 6, confidence: 97, detectedAs: "McDonalds", aiReasoning: "Detected 'McDonalds' on page 6 (missing apostrophe). Resolved via fuzzy match + logo recognition." },
      { name: "Burger King", status: "matched", page: 6, confidence: 86, detectedAs: "BurgerKng", aiReasoning: "Detected 'BurgerKng' on page 6. Character substitution resolved via pattern matching." },
      { name: "Rite Aid", status: "flagged", page: 9, confidence: 88, detectedAs: "RiteAide", aiReasoning: "Detected 'RiteAide' — extra 'e' appended. Low confidence flag raised for manual review." },
      { name: "Target", status: "matched", page: 1, confidence: 99, aiReasoning: "Exact match on page 1." },
      { name: "Best Buy", status: "matched", page: 1, confidence: 99, aiReasoning: "Exact match on page 1." },
      { name: "Sears", status: "missing", aiReasoning: "Expected per national holiday grid. Not detected on any page." },
      { name: "JCPenney", status: "missing", aiReasoning: "Not detected on any page. May have been substituted." },
      { name: "Kohl's", status: "missing", aiReasoning: "Expected but not found." },
      { name: "Bed Bath & Beyond", status: "missing", aiReasoning: "Not found — possibly merchant no longer active in this region." },
      { name: "Old Navy", status: "missing", aiReasoning: "Expected per grid. Not detected on any page." },
      { name: "H&M", status: "missing", aiReasoning: "Not detected on any page." },
      { name: "Bookseller Co.", status: "unexpected", page: 12, confidence: 72, aiReasoning: "Detected 'Bookseller' on page 12 — not in merchant grid. Low confidence score; likely non-brand text." },
      { name: "Unnamed Retailer", status: "unexpected", page: 3, confidence: 65, aiReasoning: "Ambiguous brand detected on page 3. Could not resolve to any expected merchant." },
      { name: "GrubHub", status: "flagged", page: 10, confidence: 78, aiReasoning: "Detected but logo quality assessed as low. Partial obstruction on page 10.", logoQuality: "low" },
      { name: "Uber Eats", status: "matched", page: 10, confidence: 99, aiReasoning: "Exact match on page 10." },
    ],
  },
  {
    id: "summer-clean",
    title: "Summer Campaign Mailer",
    subtitle: "West Coast",
    pages: 6,
    description: "Clean — near-perfect validation",
    scanPages: [
      { page: 1, merchants: ["In-N-Out", "Jack in the Box", "Carl's Jr."] },
      { page: 2, merchants: ["Del Taco", "El Pollo Loco", "Rubio's"] },
      { page: 3, merchants: ["Jamba Juice", "Pressed", "Blaze Pizza"] },
      { page: 4, merchants: ["Panda Express", "Pei Wei", "P.F. Chang's"] },
      { page: 5, merchants: ["Habit Burger", "The Habit", "Shake Shack"] },
      { page: 6, merchants: ["Sweetgreen", "CAVA", "Tender Loving Empire"] },
    ],
    fuzzyMatches: [
      { detected: "Carl's Jr", canonical: "Carl's Jr.", confidence: 98 },
      { detected: "Jamba", canonical: "Jamba Juice", confidence: 95 },
      { detected: "The Habit", canonical: "Habit Burger", confidence: 93 },
    ],
    stats: { expected: 28, matched: 27, missing: 1, unexpected: 0, flagged: 1 },
    metrics: {
      detectionAccuracy: "99.1%",
      fuzzyMatchRate: "98.6%",
      falsePositiveRate: "0.2%",
      processingTime: "17 seconds",
      manualTime: "~30 minutes",
    },
    results: [
      { name: "Carl's Jr.", status: "matched", page: 1, confidence: 98, detectedAs: "Carl's Jr", aiReasoning: "Detected 'Carl's Jr' (missing period). Resolved via punctuation normalization." },
      { name: "Jamba Juice", status: "matched", page: 3, confidence: 95, detectedAs: "Jamba", aiReasoning: "Detected abbreviation 'Jamba'. Resolved to full brand name via brand lookup." },
      { name: "Habit Burger", status: "flagged", page: 5, confidence: 93, detectedAs: "The Habit", aiReasoning: "Detected 'The Habit' — variant brand name. Matched to 'Habit Burger' with 93% confidence.", logoQuality: "good" },
      { name: "In-N-Out", status: "matched", page: 1, confidence: 99, aiReasoning: "Exact match on page 1." },
      { name: "Del Taco", status: "matched", page: 2, confidence: 99, aiReasoning: "Exact match on page 2." },
      { name: "Blaze Pizza", status: "matched", page: 3, confidence: 99, aiReasoning: "Exact match on page 3." },
      { name: "Panda Express", status: "matched", page: 4, confidence: 99, aiReasoning: "Exact match on page 4." },
      { name: "Shake Shack", status: "matched", page: 5, confidence: 99, aiReasoning: "Exact match on page 5." },
      { name: "Sweetgreen", status: "matched", page: 6, confidence: 99, aiReasoning: "Exact match on page 6." },
      { name: "Tender Loving Empire", status: "missing", aiReasoning: "Not detected on page 6 or any other page. Possible print omission." },
      { name: "CAVA", status: "matched", page: 6, confidence: 97, aiReasoning: "Exact match on page 6." },
    ],
  },
];

const SUBMARKETS = ["Northeast", "Southeast", "Midwest", "Southwest", "West Coast", "National", "Pacific Northwest"];
const WEEKS = ["Week 01 — Jan 6", "Week 02 — Jan 13", "Week 03 — Jan 20", "Week 04 — Jan 27", "Week 05 — Feb 3", "Week 06 — Feb 10", "Week 07 — Feb 17", "Week 08 — Feb 24"];

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  matched:    { color: "#10b981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)",  label: "Matched",     dot: "bg-emerald-400" },
  missing:    { color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)",   label: "Missing",     dot: "bg-red-400" },
  unexpected: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)",  label: "Unexpected",  dot: "bg-amber-400" },
  flagged:    { color: "#3b82f6", bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.25)",  label: "Flagged",     dot: "bg-blue-400" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function PresetCard({ preset, selected, onSelect }: { preset: Preset; selected: boolean; onSelect: () => void }) {
  const statusColor = preset.stats.missing > 3 ? "#f59e0b" : preset.stats.missing > 0 ? "#3b82f6" : "#10b981";
  const statusLabel = preset.stats.missing > 3 ? "Issues Found" : preset.stats.missing > 0 ? "Minor Issues" : "Clean";

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      className="relative text-left w-full rounded-2xl transition-all duration-300 overflow-hidden"
      style={{
        background: selected ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.03)",
        border: selected ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.07)",
        boxShadow: selected ? "0 0 0 1px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
      }}
    >
      {selected && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)"
        }} />
      )}

      {/* Document thumbnail */}
      <div className="px-5 pt-5 pb-3">
        <div
          className="w-full rounded-lg overflow-hidden mb-4 relative"
          style={{ height: 88, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Simulated PDF page lines */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute left-4 right-4" style={{
              top: 10 + i * 13,
              height: 7,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
              width: i % 3 === 2 ? "55%" : i % 3 === 1 ? "85%" : "100%",
            }} />
          ))}
          <div className="absolute top-2 right-3 text-[8px] font-mono text-text-muted">{preset.pages}pp</div>
          <div className="absolute bottom-2 left-3 right-3 flex gap-1">
            {[...Array(Math.min(preset.pages, 5))].map((_, i) => (
              <div key={i} className="h-4 flex-1 rounded-sm" style={{ background: "rgba(255,255,255,0.08)" }} />
            ))}
          </div>
        </div>

        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="font-display font-bold text-sm text-text-primary leading-tight">{preset.title}</p>
            <p className="text-[11px] font-mono text-text-muted mt-0.5">{preset.subtitle}</p>
          </div>
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
            style={{ color: statusColor, background: `${statusColor}18`, border: `1px solid ${statusColor}33` }}
          >
            {statusLabel}
          </span>
        </div>
        <p className="text-[11px] text-text-muted leading-snug">{preset.description}</p>
      </div>

      <div className="px-5 pb-4 flex items-center gap-3">
        <span className="text-[10px] font-mono text-text-muted">{preset.pages} pages</span>
        <span className="w-px h-3 bg-white/10" />
        <span className="text-[10px] font-mono" style={{ color: statusColor }}>{preset.stats.matched}/{preset.stats.expected} matched</span>
      </div>

      {selected && (
        <motion.div
          layoutId="preset-selected-bar"
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, #8b5cf6, #22d3ee)" }}
        />
      )}
    </motion.button>
  );
}

function ChainOfVerificationStep({
  step,
  label,
  sub,
  active,
  completed,
}: { step: number; label: string; sub: string; active: boolean; completed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
        style={{
          background: completed ? "rgba(16,185,129,0.2)" : active ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${completed ? "rgba(16,185,129,0.5)" : active ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.1)"}`,
          boxShadow: active ? "0 0 12px rgba(139,92,246,0.3)" : "none",
        }}
      >
        {completed ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className="font-mono text-[10px]" style={{ color: active ? "#8b5cf6" : "#475569" }}>{step}</span>
        )}
      </div>
      <div>
        <p className="text-xs font-display font-semibold transition-colors duration-500" style={{ color: completed ? "#10b981" : active ? "#f1f5f9" : "#475569" }}>
          {label}
        </p>
        <p className="text-[10px] font-mono text-text-muted">{sub}</p>
      </div>
    </div>
  );
}

function DocumentScanner({ preset, currentPage, detectedMerchants }: {
  preset: Preset;
  currentPage: number;
  detectedMerchants: string[];
}) {
  return (
    <div className="relative">
      {/* Document wrapper */}
      <div
        className="relative mx-auto overflow-hidden rounded-xl"
        style={{
          width: "100%",
          maxWidth: 360,
          aspectRatio: "8.5/11",
          background: "#0c0c14",
          border: "1px solid rgba(139,92,246,0.2)",
          boxShadow: "0 0 40px rgba(139,92,246,0.08)",
        }}
      >
        {/* Page header */}
        <div className="px-5 pt-4 pb-2 border-b border-white/5 flex items-center justify-between">
          <div className="flex gap-1.5">
            {["#ef4444", "#f59e0b", "#10b981"].map((c, i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, opacity: 0.7 }} />
            ))}
          </div>
          <span className="text-[9px] font-mono text-text-muted">page {currentPage}/{preset.pages}</span>
        </div>

        {/* Page content lines */}
        <div className="px-5 py-4 space-y-2.5">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="rounded" style={{
                height: 8,
                width: i % 4 === 0 ? "20%" : "8%",
                background: i % 4 === 0 ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.12)",
              }} />
              <div className="rounded flex-1" style={{
                height: 8,
                background: "rgba(255,255,255,0.07)",
                width: i % 3 === 2 ? "70%" : "100%",
              }} />
            </div>
          ))}

          {/* Simulated merchant logo zones */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="rounded-lg flex items-center justify-center"
                style={{
                  height: 32,
                  background: detectedMerchants[i] ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${detectedMerchants[i] ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.06)"}`,
                }}
                animate={detectedMerchants[i] ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {detectedMerchants[i] && (
                  <span className="text-[7px] font-mono text-purple-300 text-center px-1 leading-tight">
                    {detectedMerchants[i].length > 8 ? detectedMerchants[i].slice(0, 8) + "…" : detectedMerchants[i]}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded" style={{ height: 7, background: "rgba(255,255,255,0.05)", width: i === 3 ? "45%" : "100%" }} />
          ))}
        </div>

        {/* Scan line */}
        <motion.div
          key={currentPage}
          className="absolute left-0 right-0 pointer-events-none"
          style={{ height: 2 }}
          initial={{ top: "10%", opacity: 0 }}
          animate={{ top: "95%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.8, ease: "linear", times: [0, 0.05, 0.9, 1] }}
        >
          <div className="w-full h-full" style={{
            background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.8), rgba(139,92,246,0.9), rgba(34,211,238,0.8), transparent)",
            boxShadow: "0 0 12px rgba(34,211,238,0.6), 0 0 24px rgba(139,92,246,0.3)",
          }} />
        </motion.div>

        {/* Scan glow overlay */}
        <motion.div
          key={`glow-${currentPage}`}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.06, 0] }}
          transition={{ duration: 1.8, ease: "linear" }}
          style={{ background: "linear-gradient(180deg, rgba(34,211,238,0.1), rgba(139,92,246,0.1))" }}
        />
      </div>

      {/* Floating merchant detection labels */}
      <div className="absolute -right-4 top-8 space-y-2" style={{ width: 140 }}>
        <AnimatePresence>
          {detectedMerchants.map((m, i) => (
            <motion.div
              key={`${currentPage}-${m}`}
              initial={{ opacity: 0, x: 20, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4, delay: i * 0.15, ease: EASE }}
              className="px-2.5 py-1.5 rounded-lg"
              style={{
                background: "rgba(34,211,238,0.08)",
                border: "1px solid rgba(34,211,238,0.25)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                <span className="text-[10px] font-mono text-cyan-300 leading-tight">{m}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FuzzyMatchLine({ match, index, visible }: { match: FuzzyMatch; index: number; visible: boolean }) {
  const confidence = match.confidence;
  const color = confidence >= 95 ? "#10b981" : confidence >= 85 ? "#3b82f6" : "#f59e0b";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.2, ease: EASE }}
      className="relative"
    >
      <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
        {/* Detected (raw) */}
        <div className="px-4 py-3 rounded-xl text-right" style={{
          background: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}>
          <div className="text-[10px] font-mono text-red-400 mb-0.5 uppercase tracking-widest">detected</div>
          <div className="font-mono text-sm text-red-300 font-medium">{match.detected}</div>
        </div>

        {/* Arrow + confidence */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={visible ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 + 0.3, ease: EASE }}
            className="origin-left"
          >
            <svg width="56" height="20" viewBox="0 0 56 20">
              <defs>
                <linearGradient id={`fuzzy-grad-${index}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(239,68,68,0.6)" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                </linearGradient>
                <marker id={`fuzzy-arrow-${index}`} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L0,5 L5,2.5 z" fill={color} />
                </marker>
              </defs>
              <path
                d="M4,10 L48,10"
                stroke={`url(#fuzzy-grad-${index})`}
                strokeWidth="1.5"
                markerEnd={`url(#fuzzy-arrow-${index})`}
                strokeDasharray="4 2"
              />
            </svg>
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.2 + 0.5 }}
            className="text-[10px] font-mono font-bold"
            style={{ color }}
          >
            {confidence}%
          </motion.span>
        </div>

        {/* Resolved (canonical) */}
        <div className="px-4 py-3 rounded-xl" style={{
          background: `${color}0e`,
          border: `1px solid ${color}33`,
        }}>
          <div className="text-[10px] font-mono mb-0.5 uppercase tracking-widest" style={{ color }}>resolved</div>
          <div className="font-mono text-sm font-medium" style={{ color }}>{match.canonical}</div>
        </div>
      </div>
    </motion.div>
  );
}

function MerchantRow({ result, index }: { result: MerchantResult; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[result.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: EASE }}
      className="rounded-xl overflow-hidden"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <button
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Status dot */}
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />

        {/* Name */}
        <span className="font-display font-semibold text-sm text-text-primary flex-1">{result.name}</span>
        {result.detectedAs && result.detectedAs !== result.name && (
          <span className="text-[10px] font-mono text-text-muted hidden sm:block">as &quot;{result.detectedAs}&quot;</span>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {result.page && (
            <span className="text-[10px] font-mono text-text-muted">p.{result.page}</span>
          )}
          {result.confidence !== undefined && (
            <span className="text-[10px] font-mono" style={{ color: cfg.color }}>{result.confidence}%</span>
          )}
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-mono"
            style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}33` }}
          >
            {cfg.label}
          </span>
          {result.logoQuality === "low" && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono text-amber-400 bg-amber-400/10 border border-amber-400/25">
              logo ⚠
            </span>
          )}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-text-muted text-xs flex-shrink-0"
          >
            ↓
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: `${cfg.color}18` }}>
              <div className="pt-3 flex gap-4 flex-wrap">
                {/* Simulated page region */}
                {result.page && (
                  <div
                    className="rounded-lg overflow-hidden flex-shrink-0"
                    style={{ width: 80, height: 56, background: "rgba(0,0,0,0.4)", border: `1px solid ${cfg.color}25`, position: "relative" }}
                  >
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="mx-2 rounded" style={{ height: 6, marginTop: i === 0 ? 8 : 4, background: "rgba(255,255,255,0.07)" }} />
                    ))}
                    <div
                      className="absolute inset-2 rounded border"
                      style={{ background: `${cfg.color}14`, borderColor: `${cfg.color}40` }}
                    />
                    <div className="absolute bottom-1.5 left-1.5 text-[7px] font-mono" style={{ color: cfg.color }}>p.{result.page}</div>
                  </div>
                )}

                {/* AI reasoning */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">AI Reasoning</span>
                  </div>
                  <p className="text-xs font-mono leading-relaxed" style={{ color: "#94a3b8" }}>
                    {result.aiReasoning}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

function ProofingToolDemoInner() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [submarket, setSubmarket] = useState(SUBMARKETS[0]);
  const [week, setWeek] = useState(WEEKS[0]);

  // Scanning state
  const [currentPage, setCurrentPage] = useState(1);
  const [detectedMerchants, setDetectedMerchants] = useState<string[]>([]);
  const [covStep, setCovStep] = useState<1 | 2 | 3>(1);

  // Fuzzy state
  const [fuzzyVisible, setFuzzyVisible] = useState(false);

  // Results filter
  const [filter, setFilter] = useState<MatchStatus | "all">("all");

  const scanIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Animation orchestration ──────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "scanning") return;

    let page = 1;
    setCurrentPage(1);
    setDetectedMerchants([]);
    setCovStep(1);

    const advancePage = () => {
      const pageData = selectedPreset.scanPages[page - 1];

      // Reveal merchants one by one
      pageData.merchants.forEach((m, i) => {
        setTimeout(() => {
          setDetectedMerchants(prev => [...prev, m]);
        }, i * 250 + 400);
      });

      if (page < selectedPreset.pages) {
        // Next page after scan completes
        scanIntervalRef.current = setTimeout(() => {
          setDetectedMerchants([]);
          page++;
          setCurrentPage(page);

          // Update CoV step mid-scan
          if (page > Math.floor(selectedPreset.pages / 3)) setCovStep(2);
          if (page > Math.floor((selectedPreset.pages * 2) / 3)) setCovStep(3);

          advancePage();
        }, 2400);
      } else {
        // Done scanning → transition to fuzzy
        scanIntervalRef.current = setTimeout(() => {
          setPhase("fuzzy");
        }, 2600);
      }
    };

    // Small lead-in
    const leadIn = setTimeout(advancePage, 300);
    return () => {
      clearTimeout(leadIn);
      if (scanIntervalRef.current) clearTimeout(scanIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== "fuzzy") return;
    const t = setTimeout(() => setFuzzyVisible(true), 200);
    const t2 = setTimeout(() => setPhase("results"), 3200 + selectedPreset.fuzzyMatches.length * 600);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [phase, selectedPreset.fuzzyMatches.length]);

  const handleStart = () => {
    setPhase("scanning");
    setCurrentPage(1);
    setDetectedMerchants([]);
    setCovStep(1);
    setFuzzyVisible(false);
  };

  const handleReset = () => {
    setPhase("idle");
    setCurrentPage(1);
    setDetectedMerchants([]);
    setCovStep(1);
    setFuzzyVisible(false);
    setFilter("all");
  };

  const filteredResults = phase === "results"
    ? selectedPreset.results.filter(r => filter === "all" || r.status === filter)
    : [];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ background: "#070709" }}>
      <div className="noise-overlay" aria-hidden="true" />

      {/* Ambient glow */}
      <div className="fixed pointer-events-none" style={{
        top: "-10%", left: "5%", width: 700, height: 700,
        background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)",
        borderRadius: "50%",
      }} aria-hidden="true" />
      <div className="fixed pointer-events-none" style={{
        bottom: "-5%", right: "-5%", width: 500, height: 500,
        background: "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 65%)",
        borderRadius: "50%",
      }} aria-hidden="true" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-12 md:py-20">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-10"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <a
              href="/"
              className="text-[11px] font-mono text-text-muted hover:text-text-secondary transition-colors flex items-center gap-1"
            >
              ← portfolio
            </a>
            <span className="text-text-muted/40 text-xs">/</span>
            <span className="text-[11px] font-mono text-text-muted">demos</span>
            <span className="text-text-muted/40 text-xs">/</span>
            <span className="text-[11px] font-mono text-accent-purple">proofing-tool</span>
          </div>

          <div className="flex flex-wrap items-start gap-4 justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{
                  background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)"
                }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
                  <span className="text-[10px] font-mono text-accent-purple uppercase tracking-widest">Atlas Platform · Live Demo</span>
                </div>
              </div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl text-text-primary mb-2">
                Proofing Tool
                <span className="ml-2" style={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                }}>AI</span>
              </h1>
              <p className="text-text-secondary text-sm max-w-lg leading-relaxed">
                Gemini Vision validates creative PDFs against merchant grids. Chain of Verification prompting + fuzzy matching resolve ambiguities automatically.
              </p>
            </div>
            {phase !== "idle" && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 flex items-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                }}
              >
                ↺ Reset
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════ */}
        {/* PHASE: IDLE — Upload / Select                       */}
        {/* ════════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* Step label */}
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-xs text-accent-purple uppercase tracking-widest">Step 1</span>
                <div className="h-px flex-1" style={{ background: "rgba(139,92,246,0.2)" }} />
                <span className="font-mono text-xs text-text-muted">Select Document</span>
              </div>

              {/* Preset cards */}
              <div id="pt-preset-cards" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {PRESETS.map(p => (
                  <PresetCard
                    key={p.id}
                    preset={p}
                    selected={selectedPreset.id === p.id}
                    onSelect={() => setSelectedPreset(p)}
                  />
                ))}
              </div>

              {/* Config row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">Submarket</label>
                  <select
                    value={submarket}
                    onChange={e => setSubmarket(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl font-mono text-sm text-text-primary appearance-none cursor-pointer transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      outline: "none",
                    }}
                  >
                    {SUBMARKETS.map(s => <option key={s} value={s} style={{ background: "#0d0d14" }}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">Week</label>
                  <select
                    value={week}
                    onChange={e => setWeek(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl font-mono text-sm text-text-primary appearance-none cursor-pointer transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      outline: "none",
                    }}
                  >
                    {WEEKS.map(w => <option key={w} value={w} style={{ background: "#0d0d14" }}>{w}</option>)}
                  </select>
                </div>
              </div>

              {/* Summary bar + start */}
              <div className="glass-card p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <div className="text-[10px] font-mono text-text-muted mb-0.5">Document</div>
                    <div className="font-display font-semibold text-sm text-text-primary">{selectedPreset.title} — {selectedPreset.subtitle}</div>
                  </div>
                  <div className="w-px h-8 bg-white/8 hidden sm:block" />
                  <div>
                    <div className="text-[10px] font-mono text-text-muted mb-0.5">Pages</div>
                    <div className="font-mono text-sm text-text-primary">{selectedPreset.pages}</div>
                  </div>
                  <div className="w-px h-8 bg-white/8 hidden sm:block" />
                  <div>
                    <div className="text-[10px] font-mono text-text-muted mb-0.5">Expected Merchants</div>
                    <div className="font-mono text-sm text-text-primary">{selectedPreset.stats.expected}</div>
                  </div>
                </div>
                <motion.button
                  id="pt-start-btn"
                  onClick={handleStart}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3 rounded-xl font-display font-bold text-sm text-white transition-opacity flex items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)",
                    boxShadow: "0 0 24px rgba(139,92,246,0.35)",
                  }}
                >
                  <span style={{
                    display: "inline-block", width: 8, height: 8,
                    borderRadius: "50%", background: "rgba(255,255,255,0.7)",
                    animation: "pulse 1.5s ease-in-out infinite"
                  }} />
                  Start Analysis
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* PHASE: SCANNING                                      */}
          {/* ════════════════════════════════════════════════════ */}
          {phase === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="font-mono text-xs text-accent-cyan uppercase tracking-widest">Step 2</span>
                <div className="h-px flex-1" style={{ background: "rgba(34,211,238,0.2)" }} />
                <span className="font-mono text-xs text-text-muted">AI Analysis</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-8">
                {/* Document scanner */}
                <div>
                  {/* Status bar */}
                  <div className="glass-card px-5 py-4 mb-6 flex items-center gap-4">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-xs font-mono text-cyan-300">Processing</span>
                    </div>
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-xs font-mono text-text-muted">
                      Analyzing page <span className="text-text-primary font-bold">{currentPage}</span>/{selectedPreset.pages}
                    </span>
                    <div className="flex-shrink-0 text-xs font-mono text-text-muted">
                      {Math.round((currentPage / selectedPreset.pages) * 100)}%
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-6 rounded-full overflow-hidden" style={{ height: 3, background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #8b5cf6, #22d3ee)" }}
                      animate={{ width: `${(currentPage / selectedPreset.pages) * 100}%` }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  </div>

                  {/* Document + detected merchants */}
                  <div id="pt-scanner" className="flex justify-center pr-32 md:pr-40">
                    <DocumentScanner
                      preset={selectedPreset}
                      currentPage={currentPage}
                      detectedMerchants={detectedMerchants}
                    />
                  </div>

                  {/* Current page detected list */}
                  {detectedMerchants.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 px-4 py-3 rounded-xl"
                      style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}
                    >
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mr-3">Detected:</span>
                      <span className="text-xs font-mono text-text-secondary">{detectedMerchants.join(", ")}</span>
                    </motion.div>
                  )}
                </div>

                {/* Chain of Verification sidebar */}
                <div>
                  <div id="pt-cov" className="glass-card p-5 mb-4">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
                      <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Chain of Verification</span>
                    </div>

                    <div className="space-y-5">
                      <ChainOfVerificationStep
                        step={1}
                        label="Detect Content"
                        sub="Gemini Vision OCR + logo recognition"
                        active={covStep === 1}
                        completed={covStep > 1}
                      />
                      <div className="ml-3.5 w-px h-4 bg-white/10" />
                      <ChainOfVerificationStep
                        step={2}
                        label="Cross-Reference Grid"
                        sub="Compare against expected merchant list"
                        active={covStep === 2}
                        completed={covStep > 2}
                      />
                      <div className="ml-3.5 w-px h-4 bg-white/10" />
                      <ChainOfVerificationStep
                        step={3}
                        label="Verify Matches"
                        sub="Resolve ambiguities + assign confidence"
                        active={covStep === 3}
                        completed={false}
                      />
                    </div>
                  </div>

                  {/* Live log */}
                  <div className="terminal-screen">
                    <div className="terminal-header">
                      <div className="terminal-dot" style={{ background: "#ef4444" }} />
                      <div className="terminal-dot" style={{ background: "#f59e0b" }} />
                      <div className="terminal-dot" style={{ background: "#10b981" }} />
                      <span className="ml-2 text-[10px] font-mono text-text-muted">gemini-vision.log</span>
                    </div>
                    <div className="terminal-body py-3 px-4 space-y-1" style={{ minHeight: 140 }}>
                      <div className="terminal-line terminal-output">$ atlas proof --doc &quot;{selectedPreset.title}&quot;</div>
                      <div className="terminal-line terminal-agent">→ Gemini Vision initialized</div>
                      <div className="terminal-line terminal-output">→ Loading merchant grid ({selectedPreset.stats.expected} merchants)</div>
                      {currentPage > 1 && (
                        <div className="terminal-line terminal-success">✓ Pages 1-{currentPage - 1} analyzed</div>
                      )}
                      <div className="terminal-line terminal-agent">
                        → Scanning page {currentPage}/{selectedPreset.pages}…
                        <span className="terminal-cursor" />
                      </div>
                      {detectedMerchants.map((m, i) => (
                        <div key={i} className="terminal-line terminal-success" style={{ paddingLeft: 12 }}>
                          ✓ detected: {m}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* PHASE: FUZZY MATCHING                               */}
          {/* ════════════════════════════════════════════════════ */}
          {phase === "fuzzy" && (
            <motion.div
              key="fuzzy"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="font-mono text-xs text-accent-blue uppercase tracking-widest">Step 3</span>
                <div className="h-px flex-1" style={{ background: "rgba(59,130,246,0.2)" }} />
                <span className="font-mono text-xs text-text-muted">Fuzzy Resolution</span>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="glass-card p-6 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
                    <h2 className="font-display font-bold text-lg text-text-primary">Resolving Ambiguous Detections</h2>
                    <span className="ml-auto text-[10px] font-mono px-2.5 py-1 rounded-full" style={{
                      background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa"
                    }}>
                      {selectedPreset.fuzzyMatches.length} matches
                    </span>
                  </div>

                  <p className="text-xs font-mono text-text-muted mb-6 leading-relaxed">
                    Character similarity scoring + brand abbreviation lookup + logo context →{" "}
                    <span className="text-accent-blue">canonical merchant name</span>
                  </p>

                  <div className="space-y-4">
                    {selectedPreset.fuzzyMatches.map((m, i) => (
                      <FuzzyMatchLine key={m.detected} match={m} index={i} visible={fuzzyVisible} />
                    ))}
                  </div>
                </div>

                {/* Transitioning indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="flex items-center gap-3 justify-center"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-accent-purple"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-text-muted">Compiling results report…</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* PHASE: RESULTS                                       */}
          {/* ════════════════════════════════════════════════════ */}
          {phase === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="font-mono text-xs text-accent-emerald uppercase tracking-widest">Step 4</span>
                <div className="h-px flex-1" style={{ background: "rgba(16,185,129,0.2)" }} />
                <span className="font-mono text-xs text-text-muted">Validation Report</span>
              </div>

              {/* ── Summary stats ── */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                {[
                  { value: selectedPreset.stats.expected, label: "Expected", color: "#94a3b8" },
                  { value: selectedPreset.stats.matched,  label: "Matched",  color: "#10b981" },
                  { value: selectedPreset.stats.missing,  label: "Missing",  color: "#ef4444" },
                  { value: selectedPreset.stats.unexpected, label: "Unexpected", color: "#f59e0b" },
                  { value: selectedPreset.stats.flagged,  label: "Flagged",  color: "#3b82f6" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
                    className="rounded-2xl p-4 text-center"
                    style={{
                      background: `${s.color}0a`,
                      border: `1px solid ${s.color}28`,
                    }}
                  >
                    <div className="font-display font-extrabold text-2xl mb-1" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{s.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* ── Accuracy metrics ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ease: EASE }}
                className="glass-card p-5 mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Performance Metrics</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Detection Accuracy", value: selectedPreset.metrics.detectionAccuracy, color: "#10b981" },
                    { label: "Fuzzy Match Rate", value: selectedPreset.metrics.fuzzyMatchRate, color: "#22d3ee" },
                    { label: "False Positive Rate", value: selectedPreset.metrics.falsePositiveRate, color: "#8b5cf6" },
                    { label: "Processing Time", value: selectedPreset.metrics.processingTime, sub: `vs ${selectedPreset.metrics.manualTime} manual`, color: "#f59e0b" },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="font-display font-bold text-lg" style={{ color: m.color }}>{m.value}</div>
                      <div className="text-[10px] font-mono text-text-muted leading-tight">{m.label}</div>
                      {m.sub && <div className="text-[10px] font-mono text-text-muted/60 mt-0.5">{m.sub}</div>}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ── Filter tabs ── */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {(["all", "matched", "missing", "unexpected", "flagged"] as const).map(f => {
                  const count = f === "all"
                    ? selectedPreset.results.length
                    : selectedPreset.results.filter(r => r.status === f).length;
                  const cfg = f === "all" ? { color: "#94a3b8", bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.12)" } : STATUS_CONFIG[f];
                  const active = filter === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className="px-3 py-1.5 rounded-full text-[11px] font-mono capitalize transition-all duration-200 flex items-center gap-1.5"
                      style={{
                        background: active ? cfg.bg : "rgba(255,255,255,0.03)",
                        border: `1px solid ${active ? cfg.border : "rgba(255,255,255,0.07)"}`,
                        color: active ? cfg.color : "#475569",
                      }}
                    >
                      {f}
                      <span className="opacity-70">{count}</span>
                    </button>
                  );
                })}

                <div className="ml-auto">
                  <button
                    onClick={() => {
                        // Simulated export — production Atlas deployment handles real PDF generation
                    }}
                    className="px-4 py-2 rounded-xl text-[11px] font-mono flex items-center gap-2 transition-all duration-200"
                    style={{
                      background: "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.25)",
                      color: "#10b981",
                    }}
                  >
                    ↓ Export PDF Report
                  </button>
                </div>
              </div>

              {/* ── Results grid ── */}
              <div id="pt-results-grid" className="space-y-2">
                {filteredResults.length === 0 ? (
                  <div className="text-center py-12 text-text-muted font-mono text-sm">No {filter} merchants in this document.</div>
                ) : (
                  filteredResults.map((result, i) => (
                    <MerchantRow key={result.name} result={result} index={i} />
                  ))
                )}
              </div>

              {/* Legend */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center gap-4"
              >
                <span className="text-[10px] font-mono text-text-muted">Legend:</span>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: v.color }} />
                    <span className="text-[10px] font-mono text-text-muted capitalize">{v.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const PT_TOUR_STEPS: TutorialStep[] = [
  { targetId: "pt-preset-cards", title: "Step 1 — Choose a Document", content: "Select a sample mailer PDF. The AI will validate every merchant against the expected list for that campaign." },
  { targetId: "pt-start-btn", title: "Step 2 — Start Analysis", content: "Click to begin. Gemini Vision will scan each page of the PDF, detecting merchant names, logos, and promotional content." },
  { targetId: "pt-scanner", title: "Step 3 — Scanning in Progress", content: "Watch the AI scan each page in real-time. It detects merchant names, logos, and promotional content using Vision OCR." },
  { targetId: "pt-cov", title: "Step 4 — Chain of Verification", content: "Our 'Chain of Verification' technique: first detect content, then cross-reference against the expected list, then verify matches. This reduces false positives." },
  { title: "Step 5 — Fuzzy Matching", content: "The fuzzy matching engine resolves typos and abbreviations. 'McDnlds' becomes 'McDonald\u2019s' with 94% confidence — watch it resolve in the transition screen." },
  { targetId: "pt-results-grid", title: "Step 6 — Color-Coded Results", content: "Green = matched, red = missing, amber = unexpected, blue = needs review. Click any merchant row to see the full AI reasoning behind the decision." },
];

export default function ProofingToolDemo() {
  const [tourVisible, setTourVisible] = useState(true);
  const [tourDone, setTourDone] = useState(false);
  return (
    <>
      <ProofingToolDemoInner />
      <TutorialOverlay
        steps={PT_TOUR_STEPS}
        visible={tourVisible}
        onComplete={() => { setTourVisible(false); setTourDone(true); }}
      />
      {tourDone && !tourVisible && (
        <RestartTourButton onRestart={() => { setTourVisible(true); setTourDone(false); }} />
      )}
    </>
  );
}
