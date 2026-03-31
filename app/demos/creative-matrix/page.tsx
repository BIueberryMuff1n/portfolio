"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Types ─────────────────────────────────────────────────────────────────────
type AgentStatus = "waiting" | "processing" | "complete";
type SimStatus = "idle" | "running" | "complete";

interface Segment { name: string; size: string; insight: string; }
interface StrategistOutput { segments: Segment[]; pillars: string[]; positioning: string; }
interface CopyVariation { headline: string; body: string; cta: string; }
interface CreativeOutput { variations: { segment: string; copies: CopyVariation[] }[]; }
interface Channel { name: string; pct: number; platform: string; }
interface MediaOutput { channels: Channel[]; topRec: string; schedule: string; }
interface QAScore { category: string; score: number; status: "pass" | "flag"; note: string; }
interface QAOutput { scores: QAScore[]; overall: number; }
interface ResponseSet {
  strategist: StrategistOutput;
  creative: CreativeOutput;
  media: MediaOutput;
  qa: QAOutput;
}

// ── Agent config ──────────────────────────────────────────────────────────────
const AGENTS = [
  { id: "strategist", label: "Strategist", desc: "Audience & strategy", accent: "#8b5cf6", rgb: "139,92,246", icon: "◈" },
  { id: "creative",   label: "Creative",   desc: "Ad copy generation",  accent: "#22d3ee", rgb: "34,211,238",  icon: "◇" },
  { id: "media",      label: "Media Plan", desc: "Channel allocation",  accent: "#3b82f6", rgb: "59,130,246",  icon: "◉" },
  { id: "qa",         label: "QA Review",  desc: "Brand compliance",    accent: "#10b981", rgb: "16,185,129",  icon: "◎" },
] as const;

// Agent processing durations in ms
const AGENT_DURATIONS = [3200, 4000, 3000, 2200];

// ── Pre-scripted responses ────────────────────────────────────────────────────
const RESPONSES: Record<string, ResponseSet> = {
  ev_suv: {
    strategist: {
      segments: [
        { name: "Eco Affluent Professionals", size: "4.2M", insight: "HHI $150K+, ages 35–50, sustainability-driven purchase decisions" },
        { name: "Tech-Forward Early Adopters",  size: "1.8M", insight: "Ages 28–40, EV-infrastructure aware, range-anxiety resolved" },
        { name: "Status-Conscious Executives",  size: "2.1M", insight: "Brand equity matters — premium SUV category already in consideration" },
      ],
      pillars: [
        "Zero-compromise sustainability — luxury without guilt",
        "Future-proof ownership — software-defined driving",
        "Executive presence — commanding, silent, certain",
      ],
      positioning: "The only SUV that outperforms its fossil-fuel counterparts on every axis that matters to the professional who has everything — except a reason to compromise.",
    },
    creative: {
      variations: [
        {
          segment: "Eco Affluent Professionals",
          copies: [
            { headline: "Your commute. The planet's balance sheet.", body: "The Apex EV doesn't ask you to sacrifice performance for principle. 412 miles. 5.1 seconds. Net zero.", cta: "Reserve yours →" },
            { headline: "Driven by conviction. Powered by nothing else.", body: "When your values and your vehicle finally agree. Experience the Apex.", cta: "Schedule a drive →" },
            { headline: "The last SUV you'll ever explain.", body: "Stop justifying your choices. The numbers do it for you. 0 emissions. 0 compromises.", cta: "See the specs →" },
          ],
        },
        {
          segment: "Tech-Forward Early Adopters",
          copies: [
            { headline: "Your car just got a software update.", body: "Over-the-air upgrades. Predictive routing. The Apex learns your drive — then improves it.", cta: "Explore tech →" },
            { headline: "412 miles. No excuses left.", body: "Range anxiety is a legacy problem. The Apex Planner routes, charges, and arrives — automatically.", cta: "Plan a route →" },
            { headline: "The infrastructure caught up. Have you?", body: "48,000 fast-charge stations. 30-minute top-up. The Apex is ready when you are.", cta: "Find stations →" },
          ],
        },
      ],
    },
    media: {
      channels: [
        { name: "Connected TV",     pct: 34, platform: "YouTube Premium / Hulu" },
        { name: "Programmatic",     pct: 24, platform: "DV360 / The Trade Desk" },
        { name: "LinkedIn",         pct: 18, platform: "Sponsored Content + InMail" },
        { name: "Paid Search",      pct: 14, platform: "Google / Bing" },
        { name: "Out of Home",      pct: 10, platform: "Major metro premium placements" },
      ],
      topRec: "CTV for brand reach with exec segment; LinkedIn for precise professional targeting",
      schedule: "8-week burst: wks 1–3 awareness CTV → wks 4–6 consideration LinkedIn → wks 7–8 conversion search",
    },
    qa: {
      scores: [
        { category: "Brand Voice",         score: 96, status: "pass", note: "All copy aligns with premium positioning" },
        { category: "Reg. Compliance",     score: 88, status: "pass", note: "Range claims properly qualified" },
        { category: "Audience Relevance",  score: 94, status: "pass", note: "Segment targeting validated against ICP" },
        { category: "Channel Fit",         score: 91, status: "pass", note: "Creative formats match platform specs" },
        { category: "Budget Allocation",   score: 72, status: "flag", note: "OOH spend high relative to measurability" },
      ],
      overall: 88,
    },
  },

  skincare: {
    strategist: {
      segments: [
        { name: "Gen Z Beauty Enthusiasts",  size: "6.8M", insight: "Ages 18–26, ingredient-conscious, heavy TikTok usage, community-driven discovery" },
        { name: "Millennial Skin Investors", size: "5.1M", insight: "Ages 27–38, routine-builders, Instagram-native, willing to spend on results" },
        { name: "Clean Beauty Converts",     size: "3.4M", insight: "Transitioning from conventional beauty — trust-driven, values transparency" },
      ],
      pillars: [
        "Ingredient honesty — science you can actually understand",
        "Ritual over routine — skincare as self-care ceremony",
        "Visible results — transformation worth sharing",
      ],
      positioning: "The skincare brand that treats its customers like adults — transparent ingredients, real results, no markup guilt.",
    },
    creative: {
      variations: [
        {
          segment: "Gen Z Beauty Enthusiasts",
          copies: [
            { headline: "No BS. Just niacinamide.", body: "We put the actives front and center because your skin (and your wallet) deserves honesty. Holiday kit from $42.", cta: "Shop the kit →" },
            { headline: "Your For You Page sent you here.", body: "That glow everyone's talking about? It's 4 ingredients. We'll show you which ones.", cta: "See the formula →" },
            { headline: "Gifting season. No more guessing.", body: "The Holy Trinity Set: cleanser, serum, moisturizer. All under $60. Dermatologist-backed.", cta: "Gift it →" },
          ],
        },
        {
          segment: "Millennial Skin Investors",
          copies: [
            { headline: "This is what $50K in skincare research looks like.", body: "We did the testing so you can skip the guesswork. Holiday bundles built for your skin goals.", cta: "Find your bundle →" },
            { headline: "Treat your future self.", body: "Anti-aging ingredients that actually work. Plus free shipping on everything through Jan 1.", cta: "Shop now →" },
            { headline: "Your skin in 90 days.", body: "Before/after isn't a filter. It's what happens when you commit to the right actives.", cta: "Start the routine →" },
          ],
        },
      ],
    },
    media: {
      channels: [
        { name: "TikTok",      pct: 38, platform: "In-Feed + Spark Ads + TopView" },
        { name: "Instagram",   pct: 32, platform: "Stories + Reels + Shopping" },
        { name: "Influencer",  pct: 18, platform: "Micro-influencers (10K–100K)" },
        { name: "Email/SMS",   pct: 8,  platform: "Klaviyo retention flows" },
        { name: "Paid Search", pct: 4,  platform: "Google Shopping" },
      ],
      topRec: "TikTok-first creative strategy with UGC-style ads; Instagram for higher-intent conversion",
      schedule: "6-week holiday: wks 1–2 awareness TikTok seeding → wks 3–4 conversion offers → wks 5–6 urgency & gifting",
    },
    qa: {
      scores: [
        { category: "Platform Specs",      score: 98, status: "pass", note: "All assets sized for TikTok + IG formats" },
        { category: "Claims Compliance",   score: 82, status: "flag", note: "\"Dermatologist-backed\" needs supporting citation" },
        { category: "Audience Targeting",  score: 95, status: "pass", note: "Age gating and interest segments verified" },
        { category: "Budget Efficiency",   score: 93, status: "pass", note: "$50K well-distributed for reach + frequency" },
        { category: "Holiday Timing",      score: 89, status: "pass", note: "Launch window aligned with peak purchase intent" },
      ],
      overall: 91,
    },
  },

  saas: {
    strategist: {
      segments: [
        { name: "Enterprise CTOs",              size: "380K", insight: "Fortune 500–2000, managing 50–500 engineers, org-efficiency mandate from board" },
        { name: "VP Engineering / Platform",    size: "620K", insight: "Implementation decision-makers, risk-averse, ROI-proof required pre-deploy" },
        { name: "Digital Transformation Leads", size: "290K", insight: "Cross-functional, budget authority, competing internal priorities" },
      ],
      pillars: [
        "Enterprise security posture — SOC 2, SSO, audit logs out of the box",
        "ROI in 90 days — measurable developer velocity gains",
        "White-glove onboarding — dedicated CSM, migration support included",
      ],
      positioning: "The platform that makes CTOs look prescient — deployed in 30 days, ROI in 90, embedded in company DNA by year two.",
    },
    creative: {
      variations: [
        {
          segment: "Enterprise CTOs",
          copies: [
            { headline: "Your board asked about AI velocity. We have the answer.", body: "We help CTOs deploy measurable AI-powered dev tooling in 30 days. 3 logos in your sector already moved.", cta: "See the case study →" },
            { headline: "87% of your peers are evaluating this category.", body: "The ones who moved first are 4 sprints ahead. Request a technical briefing before Q2 planning locks.", cta: "Book a briefing →" },
            { headline: "SOC 2 Type II. SSO. Audit logs. Ship on day one.", body: "We know what enterprise procurement needs. We built for it. No security review surprises.", cta: "Review security docs →" },
          ],
        },
        {
          segment: "VP Engineering / Platform",
          copies: [
            { headline: "Your engineers ship 34% faster. Verifiable.", body: "Not a vendor claim — a measured outcome from 47 enterprise deployments. We'll show you the methodology.", cta: "See the data →" },
            { headline: "Migration support included. Always.", body: "Dedicated solutions engineer. Custom integration. 99.99% uptime SLA. We own the rollout.", cta: "Talk to an SE →" },
            { headline: "Zero cold starts. We come in with your stack.", body: "Native integrations with GitHub, Jira, Datadog, PagerDuty. Ready on day one, not month three.", cta: "View integrations →" },
          ],
        },
      ],
    },
    media: {
      channels: [
        { name: "LinkedIn",          pct: 52, platform: "Sponsored Content + Message Ads" },
        { name: "Paid Search",       pct: 22, platform: "Google / Bing branded + category" },
        { name: "ABM / Intent",      pct: 14, platform: "6sense / Bombora targeting" },
        { name: "Content Syndication", pct: 8, platform: "TechTarget / IDG" },
        { name: "Podcast / Audio",   pct: 4,  platform: "Software Engineering Daily + CTO Craft" },
      ],
      topRec: "LinkedIn dominates for CTO targeting; layer ABM intent data to identify in-market accounts",
      schedule: "Always-on LinkedIn with ABM overlays; surge spend aligned to Q1 and Q3 budget planning cycles",
    },
    qa: {
      scores: [
        { category: "Enterprise Messaging",   score: 97, status: "pass", note: "Pain points precisely matched to ICP" },
        { category: "Competitive Diff.",       score: 85, status: "pass", note: "Positioning tested against top 3 competitors" },
        { category: "Proof Point Strength",   score: 79, status: "flag", note: "\"47 enterprise deployments\" needs legal approval" },
        { category: "ABM Coverage",           score: 92, status: "pass", note: "Target account list validated against LinkedIn reach" },
        { category: "Funnel Coverage",        score: 88, status: "pass", note: "TOFU + MOFU + BOFU assets present" },
      ],
      overall: 88,
    },
  },
};

const GENERIC: ResponseSet = {
  strategist: {
    segments: [
      { name: "Primary Decision Makers", size: "2.4M", insight: "Core buyers with direct budget authority and highest conversion potential" },
      { name: "Influence Network",        size: "7.1M", insight: "Recommenders and champions who shape primary buyer decisions" },
      { name: "Adjacent Opportunity",     size: "4.8M", insight: "Adjacent segment with cross-sell potential post-acquisition" },
    ],
    pillars: [
      "Outcome certainty — measurable results in a defined timeframe",
      "Trust through transparency — show the methodology, not just the claim",
      "Competitive advantage — what others can't replicate",
    ],
    positioning: "A focused value proposition that speaks directly to the cost of inaction — not features, but the outcome of choosing correctly.",
  },
  creative: {
    variations: [
      {
        segment: "Primary Decision Makers",
        copies: [
          { headline: "The cost of waiting is compounding.", body: "Every quarter you delay is a quarter your competitors don't. Let's close that gap — fast.", cta: "Start now →" },
          { headline: "Results in 90 days. Guaranteed.", body: "We've done this 200+ times. We know what works. We'll show you the playbook.", cta: "See the results →" },
          { headline: "Your peers already moved.", body: "3 companies in your sector deployed last quarter. Here's what they found.", cta: "Read the report →" },
        ],
      },
      {
        segment: "Influence Network",
        copies: [
          { headline: "Be the one who brought this in.", body: "The tools that make your team look prescient. Share this briefing with your decision-maker.", cta: "Get the brief →" },
          { headline: "Champion this. Own the outcome.", body: "ROI calculator, business case template, exec presentation included.", cta: "Get the kit →" },
          { headline: "This is what your board wants to hear.", body: "Efficiency gains. Risk reduction. Vendor consolidation. All in one slide.", cta: "Get the slide →" },
        ],
      },
    ],
  },
  media: {
    channels: [
      { name: "Paid Search",    pct: 32, platform: "Google / Bing" },
      { name: "Programmatic",   pct: 26, platform: "Display + Video" },
      { name: "LinkedIn",       pct: 24, platform: "Sponsored + Message" },
      { name: "Content / SEO",  pct: 12, platform: "Owned + earned" },
      { name: "Retargeting",    pct: 6,  platform: "Cross-platform" },
    ],
    topRec: "Balanced full-funnel approach with search capturing in-market demand and paid social building awareness",
    schedule: "12-week sprint: 4 weeks awareness → 4 weeks consideration → 4 weeks conversion",
  },
  qa: {
    scores: [
      { category: "Brand Voice",        score: 93, status: "pass", note: "Messaging aligned across all touchpoints" },
      { category: "Audience Relevance", score: 89, status: "pass", note: "Copy validated against segment profiles" },
      { category: "Claims Accuracy",    score: 84, status: "flag", note: "Quantitative claims need source validation" },
      { category: "Channel-Creative Fit", score: 91, status: "pass", note: "Format specs verified for all placements" },
      { category: "Funnel Completeness", score: 87, status: "pass", note: "TOFU / MOFU / BOFU assets balanced" },
    ],
    overall: 89,
  },
};

// ── Preset briefs ─────────────────────────────────────────────────────────────
const PRESETS = [
  {
    id: "ev_suv",
    label: "Electric SUV Launch",
    brief: "Launch campaign for premium electric SUV targeting eco-conscious professionals",
    tag: "Automotive · B2C",
  },
  {
    id: "skincare",
    label: "D2C Holiday Skincare",
    brief: "Holiday promotion for D2C skincare brand, $50K budget, Instagram + TikTok",
    tag: "Beauty · D2C",
  },
  {
    id: "saas",
    label: "Enterprise SaaS Launch",
    brief: "B2B SaaS product launch targeting enterprise CTOs, LinkedIn focus",
    tag: "SaaS · B2B",
  },
];

// ── Pipeline Graph ────────────────────────────────────────────────────────────
const NODE_CX = [60, 213, 387, 540];
const NODE_CY = 55;
const NODE_R  = 28;

function PipelineGraph({ statuses, activeTransition }: {
  statuses: AgentStatus[];
  activeTransition: number | null; // index of path currently animating (0=1→2, 1=2→3, 2=3→4)
}) {
  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox="0 0 600 110"
        className="w-full max-w-2xl mx-auto"
        style={{ minWidth: 340 }}
        aria-hidden="true"
      >
        <defs>
          {AGENTS.map((a) => (
            <radialGradient key={a.id} id={`glow-${a.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={a.accent} stopOpacity="0.35" />
              <stop offset="100%" stopColor={a.accent} stopOpacity="0" />
            </radialGradient>
          ))}
          {/* Connector path defs for animateMotion */}
          {NODE_CX.slice(0, -1).map((cx, i) => (
            <path
              key={`path-def-${i}`}
              id={`conn-path-${i}`}
              d={`M ${cx + NODE_R} ${NODE_CY} C ${cx + 80} ${NODE_CY} ${NODE_CX[i+1] - 80} ${NODE_CY} ${NODE_CX[i+1] - NODE_R} ${NODE_CY}`}
              fill="none"
            />
          ))}
        </defs>

        {/* Connection lines */}
        {NODE_CX.slice(0, -1).map((cx, i) => {
          const isActive = statuses[i] === "complete" || activeTransition === i;
          const isComplete = statuses[i+1] !== "waiting";
          return (
            <g key={`conn-${i}`}>
              {/* Base line */}
              <path
                d={`M ${cx + NODE_R} ${NODE_CY} C ${cx + 80} ${NODE_CY} ${NODE_CX[i+1] - 80} ${NODE_CY} ${NODE_CX[i+1] - NODE_R} ${NODE_CY}`}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Active/complete fill */}
              {(isActive || isComplete) && (
                <path
                  d={`M ${cx + NODE_R} ${NODE_CY} C ${cx + 80} ${NODE_CY} ${NODE_CX[i+1] - 80} ${NODE_CY} ${NODE_CX[i+1] - NODE_R} ${NODE_CY}`}
                  stroke={`rgba(${AGENTS[i].rgb},0.4)`}
                  strokeWidth="1.5"
                  fill="none"
                />
              )}
              {/* Animated data packet */}
              {activeTransition === i && (
                <circle r="4" fill={AGENTS[i].accent} opacity="0.9" key={`packet-${i}-${activeTransition}`}>
                  <animateMotion dur="0.7s" repeatCount="1" fill="freeze">
                    <mpath href={`#conn-path-${i}`} />
                  </animateMotion>
                </circle>
              )}
            </g>
          );
        })}

        {/* Agent nodes */}
        {AGENTS.map((agent, i) => {
          const status = statuses[i];
          const cx = NODE_CX[i];
          const isProcessing = status === "processing";
          const isComplete   = status === "complete";
          const isWaiting    = status === "waiting";

          return (
            <g key={agent.id}>
              {/* Glow behind active node */}
              {isProcessing && (
                <circle
                  cx={cx}
                  cy={NODE_CY}
                  r={NODE_R + 16}
                  fill={`url(#glow-${agent.id})`}
                  style={{
                    animation: "nodePulse 1.4s ease-in-out infinite",
                  }}
                />
              )}
              {/* Outer ring for processing */}
              {isProcessing && (
                <circle
                  cx={cx}
                  cy={NODE_CY}
                  r={NODE_R + 6}
                  fill="none"
                  stroke={agent.accent}
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  opacity="0.5"
                  style={{ animation: "spin 3s linear infinite", transformOrigin: `${cx}px ${NODE_CY}px` }}
                />
              )}
              {/* Node circle */}
              <circle
                cx={cx}
                cy={NODE_CY}
                r={NODE_R}
                fill={
                  isComplete ? `rgba(${agent.rgb},0.18)` :
                  isProcessing ? `rgba(${agent.rgb},0.14)` :
                  "rgba(255,255,255,0.03)"
                }
                stroke={
                  isComplete   ? agent.accent :
                  isProcessing ? agent.accent :
                  "rgba(255,255,255,0.12)"
                }
                strokeWidth={isProcessing ? 1.5 : 1}
              />
              {/* Icon or checkmark */}
              <text
                x={cx}
                y={NODE_CY + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fill={
                  isComplete || isProcessing ? agent.accent : "rgba(255,255,255,0.25)"
                }
                fontFamily="monospace"
              >
                {isComplete ? "✓" : agent.icon}
              </text>
              {/* Label below */}
              <text
                x={cx}
                y={NODE_CY + NODE_R + 14}
                textAnchor="middle"
                fontSize="9"
                fill={
                  isWaiting ? "rgba(255,255,255,0.25)" :
                  isProcessing ? agent.accent :
                  "rgba(255,255,255,0.55)"
                }
                fontFamily="monospace"
                letterSpacing="0.05em"
              >
                {agent.label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
      <style>{`
        @keyframes nodePulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.9; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ── Brief Selector ────────────────────────────────────────────────────────────
function BriefSelector({
  selected, custom, onSelect, onCustom, onRun, disabled,
}: {
  selected: string;
  custom: string;
  onSelect: (id: string) => void;
  onCustom: (v: string) => void;
  onRun: () => void;
  disabled: boolean;
}) {
  const isCustom = selected === "custom";

  return (
    <div className="space-y-4">
      {/* Preset pills */}
      <div className="flex flex-wrap gap-3">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            disabled={disabled}
            className="text-left transition-all duration-200"
            style={{
              background: selected === p.id
                ? "rgba(139,92,246,0.15)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${selected === p.id ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 10,
              padding: "10px 16px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <div
              className="text-xs font-mono mb-1"
              style={{
                color: selected === p.id ? "#8b5cf6" : "#475569",
                letterSpacing: "0.08em",
              }}
            >
              {p.tag}
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: selected === p.id ? "#f1f5f9" : "#94a3b8", fontFamily: "var(--font-syne)" }}
            >
              {p.label}
            </div>
          </button>
        ))}
        <button
          onClick={() => onSelect("custom")}
          disabled={disabled}
          className="text-left transition-all duration-200"
          style={{
            background: isCustom ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${isCustom ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 10,
            padding: "10px 16px",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <div className="text-xs font-mono mb-1" style={{ color: isCustom ? "#8b5cf6" : "#475569", letterSpacing: "0.08em" }}>
            Custom
          </div>
          <div className="text-sm font-medium" style={{ color: isCustom ? "#f1f5f9" : "#94a3b8", fontFamily: "var(--font-syne)" }}>
            Write your own
          </div>
        </button>
      </div>

      {/* Brief preview / custom input */}
      <div
        style={{
          background: "rgba(13,13,20,0.8)",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: 10,
          padding: "14px 18px",
          fontFamily: "var(--font-jetbrains)",
        }}
      >
        <div className="text-xs mb-2" style={{ color: "#475569" }}>Campaign brief</div>
        {isCustom ? (
          <textarea
            value={custom}
            onChange={(e) => onCustom(e.target.value)}
            disabled={disabled}
            placeholder="Describe your campaign (e.g. 'Q1 launch for fintech app targeting millennials, $75K budget, Meta + Google')"
            className="w-full bg-transparent resize-none outline-none text-sm"
            style={{
              color: "#f1f5f9",
              minHeight: 72,
              fontFamily: "var(--font-jetbrains)",
              lineHeight: 1.6,
            }}
          />
        ) : (
          <p className="text-sm" style={{ color: "#94a3b8", lineHeight: 1.7, fontFamily: "var(--font-ibm-plex)" }}>
            {PRESETS.find((p) => p.id === selected)?.brief ?? "Select a brief above"}
          </p>
        )}
      </div>

      {/* Run button */}
      <button
        onClick={onRun}
        disabled={disabled || (isCustom && !custom.trim())}
        className="relative overflow-hidden flex items-center gap-3 transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(34,211,238,0.7) 100%)",
          border: "1px solid rgba(139,92,246,0.4)",
          borderRadius: 10,
          padding: "13px 28px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          fontFamily: "var(--font-syne)",
          fontWeight: 600,
          fontSize: 14,
          color: "#fff",
          letterSpacing: "0.02em",
        }}
      >
        <span style={{ fontSize: 16 }}>▶</span>
        Run Pipeline
      </button>
    </div>
  );
}

// ── Strategist Output ─────────────────────────────────────────────────────────
function StrategistContent({ data, visible }: { data: StrategistOutput; visible: number }) {
  return (
    <div className="space-y-4">
      {/* Segments */}
      <div>
        <div className="text-xs font-mono mb-2" style={{ color: "#8b5cf6", letterSpacing: "0.1em" }}>AUDIENCE SEGMENTS</div>
        <div className="space-y-2">
          {data.segments.map((seg, i) => (
            <motion.div
              key={seg.name}
              initial={{ opacity: 0, x: -8 }}
              animate={visible > i ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, ease: EASE }}
              style={{
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.15)",
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: "#f1f5f9", fontFamily: "var(--font-syne)" }}>{seg.name}</span>
                <span className="text-xs font-mono" style={{ color: "#8b5cf6" }}>{seg.size}</span>
              </div>
              <p className="text-xs" style={{ color: "#94a3b8", lineHeight: 1.6 }}>{seg.insight}</p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Pillars */}
      {visible > 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <div className="text-xs font-mono mb-2" style={{ color: "#8b5cf6", letterSpacing: "0.1em" }}>MESSAGING PILLARS</div>
          <div className="space-y-1.5">
            {data.pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.12 }}
                className="flex items-start gap-2 text-xs"
                style={{ color: "#94a3b8", lineHeight: 1.7 }}
              >
                <span style={{ color: "#8b5cf6", marginTop: 2 }}>—</span>
                <span>{p}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {/* Positioning */}
      {visible > 6 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 8,
            padding: "12px 14px",
          }}
        >
          <div className="text-xs font-mono mb-1.5" style={{ color: "#8b5cf6", letterSpacing: "0.1em" }}>POSITIONING STATEMENT</div>
          <p className="text-xs italic" style={{ color: "#cbd5e1", lineHeight: 1.7 }}>&ldquo;{data.positioning}&rdquo;</p>
        </motion.div>
      )}
    </div>
  );
}

// ── Creative Output ───────────────────────────────────────────────────────────
function CreativeContent({ data, visible }: { data: CreativeOutput; visible: number }) {
  const allCopies = data.variations.flatMap((v) =>
    v.copies.map((c) => ({ ...c, segment: v.segment }))
  );
  return (
    <div className="space-y-3">
      <div className="text-xs font-mono mb-2" style={{ color: "#22d3ee", letterSpacing: "0.1em" }}>COPY VARIATIONS</div>
      {allCopies.map((copy, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={visible > i ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: EASE }}
          style={{
            background: "rgba(34,211,238,0.04)",
            border: "1px solid rgba(34,211,238,0.14)",
            borderRadius: 8,
            padding: "12px 14px",
          }}
        >
          <div className="text-xs font-mono mb-1.5" style={{ color: "rgba(34,211,238,0.6)" }}>
            {copy.segment}
          </div>
          <div className="text-sm font-semibold mb-1.5" style={{ color: "#f1f5f9", fontFamily: "var(--font-syne)", lineHeight: 1.4 }}>
            {copy.headline}
          </div>
          <p className="text-xs mb-2" style={{ color: "#94a3b8", lineHeight: 1.65 }}>{copy.body}</p>
          <span className="text-xs font-mono" style={{ color: "#22d3ee" }}>{copy.cta}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ── Media Output ──────────────────────────────────────────────────────────────
function MediaContent({ data, visible }: { data: MediaOutput; visible: number }) {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono mb-2" style={{ color: "#3b82f6", letterSpacing: "0.1em" }}>CHANNEL ALLOCATION</div>
      <div className="space-y-2.5">
        {data.channels.map((ch, i) => (
          <motion.div
            key={ch.name}
            initial={{ opacity: 0 }}
            animate={visible > i ? { opacity: 1 } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: "#f1f5f9", fontFamily: "var(--font-syne)" }}>{ch.name}</span>
              <span className="text-xs font-mono" style={{ color: "#3b82f6" }}>{ch.pct}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={visible > i ? { width: `${ch.pct}%` } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, rgba(59,130,246,0.9) 0%, rgba(34,211,238,0.7) 100%)`,
                  borderRadius: 4,
                }}
              />
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#475569", fontFamily: "var(--font-jetbrains)", fontSize: 10 }}>{ch.platform}</div>
          </motion.div>
        ))}
      </div>
      {visible > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}
        >
          <div className="text-xs font-mono mb-1.5" style={{ color: "#3b82f6", letterSpacing: "0.1em" }}>RECOMMENDATION</div>
          <p className="text-xs" style={{ color: "#94a3b8", lineHeight: 1.7 }}>{data.topRec}</p>
          <div className="text-xs font-mono mt-2" style={{ color: "#3b82f6", letterSpacing: "0.1em" }}>SCHEDULE</div>
          <p className="text-xs mt-1" style={{ color: "#94a3b8", lineHeight: 1.7 }}>{data.schedule}</p>
        </motion.div>
      )}
    </div>
  );
}

// ── QA Output ─────────────────────────────────────────────────────────────────
function QAContent({ data, visible }: { data: QAOutput; visible: number }) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-mono mb-2" style={{ color: "#10b981", letterSpacing: "0.1em" }}>COMPLIANCE SCORECARD</div>
      {data.scores.map((score, i) => (
        <motion.div
          key={score.category}
          initial={{ opacity: 0, x: -6 }}
          animate={visible > i ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.35, ease: EASE }}
          style={{
            background: score.status === "pass" ? "rgba(16,185,129,0.05)" : "rgba(245,158,11,0.06)",
            border: `1px solid ${score.status === "pass" ? "rgba(16,185,129,0.18)" : "rgba(245,158,11,0.2)"}`,
            borderRadius: 8,
            padding: "10px 14px",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span style={{
                width: 16, height: 16, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
                background: score.status === "pass" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                fontSize: 9, color: score.status === "pass" ? "#10b981" : "#f59e0b", flexShrink: 0,
              }}>
                {score.status === "pass" ? "✓" : "!"}
              </span>
              <span className="text-xs font-semibold" style={{ color: "#f1f5f9", fontFamily: "var(--font-syne)" }}>{score.category}</span>
            </div>
            <span className="text-sm font-bold font-mono" style={{ color: score.status === "pass" ? "#10b981" : "#f59e0b" }}>
              {score.score}
            </span>
          </div>
          <p className="text-xs ml-6" style={{ color: "#475569", lineHeight: 1.6, fontFamily: "var(--font-jetbrains)", fontSize: 10 }}>{score.note}</p>
        </motion.div>
      ))}
      {visible > 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 10,
            padding: "14px 18px",
            textAlign: "center" as const,
          }}
        >
          <div className="text-xs font-mono mb-1" style={{ color: "#10b981", letterSpacing: "0.1em" }}>OVERALL SCORE</div>
          <div className="text-4xl font-bold font-mono" style={{ color: "#10b981", fontFamily: "var(--font-syne)" }}>
            {data.overall}<span className="text-lg" style={{ color: "rgba(16,185,129,0.5)" }}>/100</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Agent Panel ───────────────────────────────────────────────────────────────
function AgentPanel({
  index, status, response, revealCount,
}: {
  index: number;
  status: AgentStatus;
  response: ResponseSet | null;
  revealCount: number;
}) {
  const agent = AGENTS[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(12px)",
        border: `1px solid rgba(${agent.rgb},${status === "processing" ? "0.35" : "0.2"})`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.4s ease",
      }}
    >
      {/* Panel header */}
      <div
        style={{
          background: `rgba(${agent.rgb},0.06)`,
          borderBottom: `1px solid rgba(${agent.rgb},0.12)`,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ color: agent.accent, fontSize: 16 }}>{agent.icon}</span>
        <div>
          <div className="text-sm font-semibold" style={{ color: "#f1f5f9", fontFamily: "var(--font-syne)" }}>{agent.label}</div>
          <div className="text-xs" style={{ color: "#475569", fontFamily: "var(--font-jetbrains)" }}>{agent.desc}</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {status === "processing" && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="flex items-center gap-1.5 text-xs font-mono"
              style={{ color: agent.accent }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: agent.accent }} />
              processing
            </motion.div>
          )}
          {status === "complete" && (
            <span className="text-xs font-mono" style={{ color: "#10b981" }}>✓ complete</span>
          )}
          {status === "waiting" && (
            <span className="text-xs font-mono" style={{ color: "#475569" }}>waiting</span>
          )}
        </div>
      </div>

      {/* Panel body */}
      <div style={{ padding: "16px", maxHeight: 380, overflowY: "auto" }}>
        {status === "waiting" && (
          <div className="flex items-center justify-center py-8" style={{ color: "#475569" }}>
            <span className="text-xs font-mono">— queued —</span>
          </div>
        )}

        {(status === "processing" || status === "complete") && response && (
          <>
            {index === 0 && <StrategistContent data={response.strategist} visible={revealCount} />}
            {index === 1 && <CreativeContent   data={response.creative}   visible={revealCount} />}
            {index === 2 && <MediaContent      data={response.media}      visible={revealCount} />}
            {index === 3 && <QAContent         data={response.qa}         visible={revealCount} />}
          </>
        )}
      </div>
    </motion.div>
  );
}

// ── Pipeline Summary ──────────────────────────────────────────────────────────
function PipelineSummary({ response, onReset }: { response: ResponseSet; onReset: () => void }) {
  const passCount = response.qa.scores.filter((s) => s.status === "pass").length;
  const flagCount = response.qa.scores.filter((s) => s.status === "flag").length;
  const copyCount = response.creative.variations.reduce((acc, v) => acc + v.copies.length, 0);
  const segCount  = response.strategist.segments.length;

  const metrics = [
    { label: "Audience Segments",  value: segCount,   unit: "identified", color: "#8b5cf6" },
    { label: "Copy Variations",    value: copyCount,  unit: "generated",  color: "#22d3ee" },
    { label: "Channel Allocation", value: response.media.channels.length, unit: "channels mapped", color: "#3b82f6" },
    { label: "QA Checks",          value: `${passCount}/${response.qa.scores.length}`, unit: "passed", color: "#10b981" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(139,92,246,0.3)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(90deg, rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.06) 100%)",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap" as const,
          gap: 12,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 8px rgba(16,185,129,0.8)",
              animation: "nodePulse 2s ease-in-out infinite",
            }}
          />
          <span className="font-semibold text-sm" style={{ color: "#f1f5f9", fontFamily: "var(--font-syne)" }}>
            Pipeline Complete
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "#475569" }}>
          <span style={{ color: "#10b981" }}>12.3s</span>
          <span>vs</span>
          <span>~3 days manual</span>
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
              style={{
                background: `rgba(${i === 0 ? "139,92,246" : i === 1 ? "34,211,238" : i === 2 ? "59,130,246" : "16,185,129"},0.06)`,
                border: `1px solid rgba(${i === 0 ? "139,92,246" : i === 1 ? "34,211,238" : i === 2 ? "59,130,246" : "16,185,129"},0.18)`,
                borderRadius: 10,
                padding: "14px 16px",
                textAlign: "center" as const,
              }}
            >
              <div className="text-2xl font-bold font-mono mb-1" style={{ color: m.color, fontFamily: "var(--font-syne)" }}>
                {m.value}
              </div>
              <div className="text-xs" style={{ color: "#94a3b8" }}>{m.label}</div>
              <div className="text-xs font-mono" style={{ color: "#475569" }}>{m.unit}</div>
            </motion.div>
          ))}
        </div>

        {/* QA flag callout */}
        {flagCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            style={{
              background: "rgba(245,158,11,0.06)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 16,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <span style={{ color: "#f59e0b", fontSize: 14, marginTop: 1 }}>⚠</span>
            <div>
              <div className="text-sm font-semibold mb-0.5" style={{ color: "#fbbf24", fontFamily: "var(--font-syne)" }}>
                {flagCount} QA {flagCount === 1 ? "flag" : "flags"} — human review required
              </div>
              <p className="text-xs" style={{ color: "#94a3b8", lineHeight: 1.6 }}>
                AI proposes. Humans approve. Review the flagged items before this campaign goes live.
              </p>
            </div>
          </motion.div>
        )}

        {/* CTA + Reset */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(34,211,238,0.05) 100%)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 12,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap" as const,
            gap: 16,
          }}
        >
          <div>
            <div className="text-sm font-semibold mb-1" style={{ color: "#f1f5f9", fontFamily: "var(--font-syne)" }}>
              This is what Atlas does at scale.
            </div>
            <p className="text-xs" style={{ color: "#94a3b8", lineHeight: 1.6 }}>
              Powering <span style={{ color: "#f1f5f9" }}>$300K+/mo</span> in ad spend across 10 interconnected AI agents.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="text-xs font-mono transition-all duration-200"
              style={{
                color: "#94a3b8",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: "9px 16px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#f1f5f9"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#94a3b8"; }}
            >
              ↺ Reset
            </button>
            <Link
              href="/#work"
              className="text-xs font-semibold transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.85), rgba(34,211,238,0.7))",
                border: "1px solid rgba(139,92,246,0.3)",
                borderRadius: 8,
                padding: "9px 18px",
                color: "#fff",
                fontFamily: "var(--font-syne)",
                textDecoration: "none",
              }}
            >
              See the full system →
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Main Demo ─────────────────────────────────────────────────────────────────
export default function CreativeMatrixPage() {
  const [selectedPreset, setSelectedPreset] = useState("ev_suv");
  const [customBrief, setCustomBrief]       = useState("");
  const [simStatus, setSimStatus]           = useState<SimStatus>("idle");
  const [agentStatuses, setAgentStatuses]   = useState<AgentStatus[]>(["waiting", "waiting", "waiting", "waiting"]);
  const [activeTransition, setActiveTransition] = useState<number | null>(null);
  const [revealCounts, setRevealCounts]     = useState([0, 0, 0, 0]);
  const [response, setResponse]             = useState<ResponseSet | null>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timeouts.current.push(t);
  }, []);

  const runPipeline = useCallback(() => {
    if (simStatus === "running") return;

    // Determine response set
    const res = selectedPreset !== "custom"
      ? (RESPONSES[selectedPreset] ?? GENERIC)
      : GENERIC;
    setResponse(res);

    setSimStatus("running");
    setAgentStatuses(["waiting", "waiting", "waiting", "waiting"]);
    setRevealCounts([0, 0, 0, 0]);
    setActiveTransition(null);

    // Reveal counts per agent: how many content items to show and when
    // Agent 0 (Strategist): 3 segments + 3 pillars + 1 positioning = 7 items
    // Agent 1 (Creative): 6 copy items
    // Agent 2 (Media): 5 channels + 1 rec block = 6 items
    // Agent 3 (QA): 5 scores + 1 overall = 6 items
    const revealSchedules = [
      { total: 7, duration: AGENT_DURATIONS[0] },
      { total: 6, duration: AGENT_DURATIONS[1] },
      { total: 6, duration: AGENT_DURATIONS[2] },
      { total: 6, duration: AGENT_DURATIONS[3] },
    ];

    let cursor = 200; // initial delay

    for (let i = 0; i < 4; i++) {
      const agentIdx = i;
      const { total, duration } = revealSchedules[i];

      // Start processing
      schedule(() => {
        setAgentStatuses((prev) => {
          const next = [...prev] as AgentStatus[];
          next[agentIdx] = "processing";
          return next;
        });
      }, cursor);

      // Reveal content items progressively
      for (let j = 1; j <= total; j++) {
        const revealDelay = cursor + Math.floor((j / total) * duration * 0.85);
        const capturedJ = j;
        schedule(() => {
          setRevealCounts((prev) => {
            const next = [...prev];
            next[agentIdx] = capturedJ;
            return next;
          });
        }, revealDelay);
      }

      // Mark complete
      schedule(() => {
        setAgentStatuses((prev) => {
          const next = [...prev] as AgentStatus[];
          next[agentIdx] = "complete";
          return next;
        });
      }, cursor + duration);

      // Transition packet to next agent
      if (i < 3) {
        schedule(() => setActiveTransition(i), cursor + duration + 50);
        schedule(() => setActiveTransition(null), cursor + duration + 850);
      }

      cursor += duration + 150; // small gap between agents
    }

    // Pipeline complete
    schedule(() => setSimStatus("complete"), cursor + 200);
  }, [simStatus, selectedPreset, schedule]);

  const resetPipeline = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setSimStatus("idle");
    setAgentStatuses(["waiting", "waiting", "waiting", "waiting"]);
    setRevealCounts([0, 0, 0, 0]);
    setActiveTransition(null);
    setResponse(null);
  }, []);

  useEffect(() => {
    return () => { timeouts.current.forEach(clearTimeout); };
  }, []);

  const isRunning = simStatus === "running";

  return (
    <main
      className="relative min-h-screen pt-24 pb-20 overflow-x-hidden"
      style={{ background: "#070709" }}
    >
      {/* Background glows */}
      <div
        className="glow-blob"
        style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", top: "-10%", left: "-10%", position: "absolute" }}
        aria-hidden="true"
      />
      <div
        className="glow-blob"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)", top: "30%", right: "-10%", position: "absolute" }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-10"
        >
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-xs font-mono transition-colors duration-200"
            style={{ color: "#475569", textDecoration: "none", letterSpacing: "0.08em" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#94a3b8")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#475569")}
          >
            ← Back to portfolio
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-10"
        >
          <div className="section-label mb-4">
            <span className="section-label-num font-mono">⬡</span>
            <div className="section-label-line" />
            <span className="section-label-text">Interactive Demo</span>
          </div>
          <h1
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight"
            style={{ fontFamily: "var(--font-syne)", color: "#f1f5f9" }}
          >
            Creative Matrix{" "}
            <span className="gradient-text">Simulator</span>
          </h1>
          <p className="text-base max-w-xl" style={{ color: "#94a3b8", lineHeight: 1.75 }}>
            Select a campaign brief, then watch 4 specialized AI agents process it in real-time —
            strategy, copy, media planning, and QA review. This is a simplified simulation of the
            Atlas pipeline running live at{" "}
            <span style={{ color: "#f1f5f9" }}>$300K+/month in ad spend</span>.
          </p>
        </motion.div>

        {/* Pipeline graph */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            padding: "20px 24px",
            marginBottom: 24,
          }}
        >
          <div className="text-xs font-mono mb-4" style={{ color: "#475569", letterSpacing: "0.1em" }}>PIPELINE GRAPH</div>
          <PipelineGraph statuses={agentStatuses} activeTransition={activeTransition} />
          {/* Timing strip */}
          {isRunning && (
            <div className="flex justify-center gap-6 mt-4">
              {AGENTS.map((a, i) => (
                <div key={a.id} className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: agentStatuses[i] !== "waiting" ? a.accent : "rgba(255,255,255,0.15)",
                      transition: "background 0.3s",
                    }}
                  />
                  <span className="text-xs font-mono hidden sm:inline" style={{ color: agentStatuses[i] !== "waiting" ? a.accent : "#475569", fontSize: 9 }}>
                    {a.label.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Brief selector — only visible when idle */}
        <AnimatePresence>
          {simStatus === "idle" && (
            <motion.div
              key="brief-selector"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "20px 24px",
                marginBottom: 24,
              }}
            >
              <div className="text-xs font-mono mb-4" style={{ color: "#475569", letterSpacing: "0.1em" }}>SELECT CAMPAIGN BRIEF</div>
              <BriefSelector
                selected={selectedPreset}
                custom={customBrief}
                onSelect={setSelectedPreset}
                onCustom={setCustomBrief}
                onRun={runPipeline}
                disabled={isRunning}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agent panels — appear when pipeline starts */}
        <AnimatePresence>
          {simStatus !== "idle" && (
            <motion.div
              key="agent-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
            >
              {AGENTS.map((_, i) => (
                <AgentPanel
                  key={i}
                  index={i}
                  status={agentStatuses[i]}
                  response={response}
                  revealCount={revealCounts[i]}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary */}
        <AnimatePresence>
          {simStatus === "complete" && response && (
            <PipelineSummary key="summary" response={response} onReset={resetPipeline} />
          )}
        </AnimatePresence>

        {/* Reset button when running */}
        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-6"
          >
            <button
              onClick={resetPipeline}
              className="text-xs font-mono transition-colors duration-200"
              style={{ color: "#475569", background: "none", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#94a3b8")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#475569")}
            >
              ↺ cancel & reset
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
