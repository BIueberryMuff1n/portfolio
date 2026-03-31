"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TutorialOverlay, { RestartTourButton, TutorialStep } from "@/components/TutorialOverlay";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Types ────────────────────────────────────────────────────────────────────

type CheckStatus = "pending" | "running" | "pass" | "fail" | "warn";
type LogicType = "hard" | "soft";
type AuditStep = "select" | "scope" | "running" | "results";
type AccountId = "techstart" | "localEats" | "luxeTravel";
type ScopeId = "quick" | "full";

interface Checkpoint {
  id: number;
  category: string;
  label: string;
  type: LogicType;
}

interface CheckpointResult {
  status: "pass" | "fail" | "warn";
}

interface CriticalIssue {
  title: string;
  detail: string;
  fix: string;
  severity: "critical" | "warning";
}

interface Account {
  id: AccountId;
  name: string;
  industry: string;
  grade: string;
  score: number;
  tagline: string;
  color: string;
  categoryScores: Record<string, number>;
  results: Record<number, CheckpointResult>;
  criticalIssues: CriticalIssue[];
  aiInsights: string[];
  projection: string;
}

// ─── 92 Checkpoints ──────────────────────────────────────────────────────────

const CHECKPOINTS: Checkpoint[] = [
  // Account Structure (1-9)
  { id: 1,  category: "Account Structure",    label: "Campaigns organized by product/service line",           type: "hard" },
  { id: 2,  category: "Account Structure",    label: "Ad groups contain 10–20 keywords max",                  type: "hard" },
  { id: 3,  category: "Account Structure",    label: "SKAG structure applied to top-performing keywords",     type: "hard" },
  { id: 4,  category: "Account Structure",    label: "Brand vs non-brand campaigns separated",                type: "hard" },
  { id: 5,  category: "Account Structure",    label: "Search and Display in distinct campaigns",              type: "hard" },
  { id: 6,  category: "Account Structure",    label: "Remarketing campaigns configured",                      type: "hard" },
  { id: 7,  category: "Account Structure",    label: "Campaign naming convention is consistent",              type: "soft" },
  { id: 8,  category: "Account Structure",    label: "Ad schedule configured for business hours",             type: "hard" },
  { id: 9,  category: "Account Structure",    label: "Geographic targeting matches service area",             type: "hard" },
  // Bidding Strategy (10-18)
  { id: 10, category: "Bidding Strategy",     label: "Bid strategy aligned with campaign goals",              type: "hard" },
  { id: 11, category: "Bidding Strategy",     label: "Target CPA configured for conversion campaigns",        type: "hard" },
  { id: 12, category: "Bidding Strategy",     label: "Target ROAS set for revenue-focused campaigns",         type: "hard" },
  { id: 13, category: "Bidding Strategy",     label: "Manual CPC used where automation is insufficient",      type: "hard" },
  { id: 14, category: "Bidding Strategy",     label: "Device bid adjustments applied",                        type: "hard" },
  { id: 15, category: "Bidding Strategy",     label: "Location bid adjustments applied",                      type: "hard" },
  { id: 16, category: "Bidding Strategy",     label: "Audience bid adjustments configured",                   type: "hard" },
  { id: 17, category: "Bidding Strategy",     label: "Smart bidding learning period respected",               type: "soft" },
  { id: 18, category: "Bidding Strategy",     label: "Portfolio bid strategies applied correctly",            type: "hard" },
  // Keywords & Negatives (19-28)
  { id: 19, category: "Keywords & Negatives", label: "Negative keyword lists applied to all campaigns",       type: "hard" },
  { id: 20, category: "Keywords & Negatives", label: "Campaign-level negatives prevent cross-contamination",  type: "hard" },
  { id: 21, category: "Keywords & Negatives", label: "Broad match keywords have phrase/exact variants",       type: "hard" },
  { id: 22, category: "Keywords & Negatives", label: "Long-tail keywords present in all ad groups",          type: "hard" },
  { id: 23, category: "Keywords & Negatives", label: "Exact match keywords cover core terms",                 type: "hard" },
  { id: 24, category: "Keywords & Negatives", label: "Phrase match used for intent variants",                 type: "hard" },
  { id: 25, category: "Keywords & Negatives", label: "Search term report reviewed within 30 days",            type: "hard" },
  { id: 26, category: "Keywords & Negatives", label: "Irrelevant search terms added as negatives",            type: "hard" },
  { id: 27, category: "Keywords & Negatives", label: "Competitor keywords in isolated ad group",              type: "hard" },
  { id: 28, category: "Keywords & Negatives", label: "Keyword quality scores reviewed and actioned",          type: "soft" },
  // Ad Copy & Extensions (29-38)
  { id: 29, category: "Ad Copy & Extensions", label: "Responsive Search Ads in all ad groups",                type: "hard" },
  { id: 30, category: "Ad Copy & Extensions", label: "At least 3 ad variations per ad group",                 type: "hard" },
  { id: 31, category: "Ad Copy & Extensions", label: "Dynamic keyword insertion used appropriately",          type: "soft" },
  { id: 32, category: "Ad Copy & Extensions", label: "Sitelink extensions on all campaigns",                  type: "hard" },
  { id: 33, category: "Ad Copy & Extensions", label: "Callout extensions configured",                         type: "hard" },
  { id: 34, category: "Ad Copy & Extensions", label: "Call extensions present (phone-based campaigns)",       type: "hard" },
  { id: 35, category: "Ad Copy & Extensions", label: "Structured snippet extensions present",                 type: "hard" },
  { id: 36, category: "Ad Copy & Extensions", label: "Price extensions configured for product campaigns",     type: "hard" },
  { id: 37, category: "Ad Copy & Extensions", label: "Promotion extensions for active offers",                type: "hard" },
  { id: 38, category: "Ad Copy & Extensions", label: "Ad copy tone matches brand voice",                      type: "soft" },
  // Quality Score (39-47)
  { id: 39, category: "Quality Score",        label: "Account average Quality Score ≥ 7/10",                  type: "hard" },
  { id: 40, category: "Quality Score",        label: "Landing page experience rated Above Average",           type: "hard" },
  { id: 41, category: "Quality Score",        label: "Expected CTR rated Above Average",                      type: "hard" },
  { id: 42, category: "Quality Score",        label: "Ad relevance rated Above Average",                      type: "hard" },
  { id: 43, category: "Quality Score",        label: "Low QS keywords (≤3) paused or reworked",              type: "hard" },
  { id: 44, category: "Quality Score",        label: "QS improvement actions documented",                     type: "soft" },
  { id: 45, category: "Quality Score",        label: "Ad copy tightly matches keyword themes",                type: "soft" },
  { id: 46, category: "Quality Score",        label: "Landing page load time under 3 seconds",                type: "hard" },
  { id: 47, category: "Quality Score",        label: "Mobile landing page experience optimized",              type: "hard" },
  // Landing Pages (48-56)
  { id: 48, category: "Landing Pages",        label: "Landing pages match ad message and offer",              type: "soft" },
  { id: 49, category: "Landing Pages",        label: "Primary CTA visible above the fold",                    type: "hard" },
  { id: 50, category: "Landing Pages",        label: "Page load time under 3 seconds",                        type: "hard" },
  { id: 51, category: "Landing Pages",        label: "Mobile-responsive design confirmed",                    type: "hard" },
  { id: 52, category: "Landing Pages",        label: "Trust signals present (reviews, badges, certifications)", type: "soft" },
  { id: 53, category: "Landing Pages",        label: "Form friction minimized (≤5 fields)",                   type: "soft" },
  { id: 54, category: "Landing Pages",        label: "Conversion path clearly defined",                       type: "soft" },
  { id: 55, category: "Landing Pages",        label: "A/B testing active on key landing pages",               type: "hard" },
  { id: 56, category: "Landing Pages",        label: "UTM parameters properly configured",                    type: "hard" },
  // Audience Targeting (57-65)
  { id: 57, category: "Audience Targeting",   label: "Customer match lists uploaded",                         type: "hard" },
  { id: 58, category: "Audience Targeting",   label: "Similar audiences enabled where applicable",            type: "hard" },
  { id: 59, category: "Audience Targeting",   label: "In-market audiences applied",                           type: "hard" },
  { id: 60, category: "Audience Targeting",   label: "RLSA (Remarketing Lists for Search) configured",        type: "hard" },
  { id: 61, category: "Audience Targeting",   label: "Audience exclusions configured",                        type: "hard" },
  { id: 62, category: "Audience Targeting",   label: "Demographics targeting optimized",                      type: "hard" },
  { id: 63, category: "Audience Targeting",   label: "Life events audiences tested",                          type: "soft" },
  { id: 64, category: "Audience Targeting",   label: "Custom intent audiences created",                       type: "soft" },
  { id: 65, category: "Audience Targeting",   label: "Observation vs targeting mode used correctly",          type: "soft" },
  // Budget & Pacing (66-74)
  { id: 66, category: "Budget & Pacing",      label: "Daily budgets set appropriately per campaign",          type: "hard" },
  { id: 67, category: "Budget & Pacing",      label: "Budget pacing within ±10% of monthly target",          type: "hard" },
  { id: 68, category: "Budget & Pacing",      label: "No campaigns budget-constrained during peak hours",     type: "hard" },
  { id: 69, category: "Budget & Pacing",      label: "Shared budgets used where appropriate",                 type: "hard" },
  { id: 70, category: "Budget & Pacing",      label: "Monthly spend forecast within target range",            type: "hard" },
  { id: 71, category: "Budget & Pacing",      label: "Budget allocation reflects campaign priority",          type: "soft" },
  { id: 72, category: "Budget & Pacing",      label: "Seasonality adjustments planned",                       type: "soft" },
  { id: 73, category: "Budget & Pacing",      label: "Emergency budget controls documented",                  type: "soft" },
  { id: 74, category: "Budget & Pacing",      label: "Return on ad spend meeting targets",                    type: "hard" },
  // Conversion Tracking (75-83)
  { id: 75, category: "Conversion Tracking",  label: "Google Ads conversion tracking installed",              type: "hard" },
  { id: 76, category: "Conversion Tracking",  label: "Google Analytics linked to Ads account",               type: "hard" },
  { id: 77, category: "Conversion Tracking",  label: "Conversion actions aligned with business goals",        type: "soft" },
  { id: 78, category: "Conversion Tracking",  label: "GA4 conversions imported into Google Ads",             type: "hard" },
  { id: 79, category: "Conversion Tracking",  label: "Phone call tracking configured",                        type: "hard" },
  { id: 80, category: "Conversion Tracking",  label: "Offline conversion imports set up",                     type: "hard" },
  { id: 81, category: "Conversion Tracking",  label: "Cross-device conversion tracking enabled",              type: "hard" },
  { id: 82, category: "Conversion Tracking",  label: "View-through conversions configured correctly",         type: "hard" },
  { id: 83, category: "Conversion Tracking",  label: "Conversion window appropriate to sales cycle",          type: "soft" },
  // Competitive Analysis (84-92)
  { id: 84, category: "Competitive Analysis", label: "Auction insights report reviewed monthly",              type: "hard" },
  { id: 85, category: "Competitive Analysis", label: "Search impression share above 60% for core terms",      type: "hard" },
  { id: 86, category: "Competitive Analysis", label: "Competitor ad copy analyzed",                           type: "soft" },
  { id: 87, category: "Competitive Analysis", label: "Competitor landing pages benchmarked",                  type: "soft" },
  { id: 88, category: "Competitive Analysis", label: "IS loss to budget tracked and actioned",                type: "hard" },
  { id: 89, category: "Competitive Analysis", label: "IS loss to rank tracked and actioned",                  type: "hard" },
  { id: 90, category: "Competitive Analysis", label: "Keyword gap analysis completed",                        type: "soft" },
  { id: 91, category: "Competitive Analysis", label: "Competitive bid strategy documented",                   type: "soft" },
  { id: 92, category: "Competitive Analysis", label: "Market trend monitoring automated",                     type: "soft" },
];

const CATEGORIES: string[] = CHECKPOINTS.reduce<string[]>((acc, c) => {
  if (!acc.includes(c.category)) acc.push(c.category);
  return acc;
}, []);

// ─── Account Data ─────────────────────────────────────────────────────────────

function buildResults(
  overrides: Record<number, "fail" | "warn">
): Record<number, CheckpointResult> {
  const res: Record<number, CheckpointResult> = {};
  for (const cp of CHECKPOINTS) {
    const ov = overrides[cp.id];
    res[cp.id] = { status: ov ?? "pass" };
  }
  return res;
}

const ACCOUNTS: Account[] = [
  {
    id: "techstart",
    name: "TechStart SaaS",
    industry: "B2B Software",
    grade: "A",
    score: 92,
    tagline: "Well-optimized — minor refinements available",
    color: "#10b981",
    categoryScores: {
      "Account Structure": 96, "Bidding Strategy": 94, "Keywords & Negatives": 88,
      "Ad Copy & Extensions": 90, "Quality Score": 91, "Landing Pages": 89,
      "Audience Targeting": 87, "Budget & Pacing": 95, "Conversion Tracking": 97,
      "Competitive Analysis": 85,
    },
    results: buildResults({ 3: "warn", 32: "warn", 55: "fail", 63: "warn", 73: "warn", 90: "fail", 91: "warn" }),
    criticalIssues: [
      {
        title: "A/B Testing Not Active on Key Landing Pages",
        detail: "No active landing page experiments detected. Conversion rate optimization opportunity is being missed across your top 3 campaign destinations.",
        fix: "Set up Google Optimize or VWO experiments on top 3 landing pages. Target 2-week test cycles with clear primary metrics per test.",
        severity: "warning",
      },
      {
        title: "Keyword Gap Analysis Overdue (90+ Days)",
        detail: "No keyword gap analysis completed in the last 90 days. Competitor terms may be unaddressed, particularly in the mid-market segment.",
        fix: "Run SEMrush or SpyFu gap analysis against top 3 competitors. Add high-intent gaps to dedicated ad groups with tailored landing pages.",
        severity: "warning",
      },
    ],
    aiInsights: [
      "Ad copy in the Enterprise campaign shows strong intent alignment — above-average CTR suggests messaging resonates with decision-makers. Consider expanding similar language patterns to SMB campaigns.",
      "Target CPA variance across campaigns suggests the bidding model hasn't fully learned seasonal patterns. Adding seasonality adjustments ahead of Q4 could improve efficiency by 8–12%.",
      "Custom intent audiences haven't been refreshed in 60+ days. Updating with recent search behavior data could significantly improve reach quality for retargeting campaigns.",
      "Conversion tracking setup is exemplary. The cross-device attribution window is well-aligned with your observed 14-day B2B sales cycle.",
    ],
    projection: "Implementing these fixes could improve CTR by ~8% and reduce CPA by ~$2.10 within 30 days.",
  },
  {
    id: "localEats",
    name: "LocalEats Restaurant Chain",
    industry: "Food & Beverage",
    grade: "C",
    score: 64,
    tagline: "Several issues found — clear improvement path exists",
    color: "#f59e0b",
    categoryScores: {
      "Account Structure": 72, "Bidding Strategy": 68, "Keywords & Negatives": 55,
      "Ad Copy & Extensions": 48, "Quality Score": 51, "Landing Pages": 58,
      "Audience Targeting": 44, "Budget & Pacing": 70, "Conversion Tracking": 78,
      "Competitive Analysis": 62,
    },
    results: buildResults({
      19: "fail", 20: "fail", 32: "fail", 33: "fail", 34: "fail",
      39: "fail", 40: "fail", 41: "fail", 48: "fail", 51: "fail",
      57: "fail", 61: "fail", 67: "fail", 68: "fail", 76: "fail",
      14: "warn", 15: "warn", 24: "warn", 25: "warn", 28: "warn",
      31: "warn", 46: "warn", 55: "warn", 66: "warn", 70: "warn",
      72: "warn", 80: "warn", 85: "warn", 88: "warn", 90: "warn",
    }),
    criticalIssues: [
      {
        title: "No Negative Keyword Lists on 3/5 Campaigns",
        detail: "3 out of 5 active campaigns have zero negative keyword lists applied, causing significant budget waste on irrelevant queries like 'recipe', 'cooking classes', and 'food delivery jobs'.",
        fix: "Create a master negative keyword list immediately. Add: recipe, DIY, cooking class, jobs, careers, free, homemade. Apply to all campaigns. Estimated waste reduction: 20–30% of current spend.",
        severity: "critical",
      },
      {
        title: "Missing Sitelink Extensions on 2 Campaigns",
        detail: "2 campaigns are running without sitelink extensions, directly reducing Ad Rank and Quality Score. Google's data shows sitelinks improve CTR by 10–20%.",
        fix: "Add minimum 4 sitelinks per campaign: Menu, Order Online, Reservations, Locations. Each sitelink requires a unique title and 2 description lines.",
        severity: "critical",
      },
      {
        title: "Below-Average Quality Score (4.2/10 Average)",
        detail: "12 keywords have Quality Scores of 4 or below. This drives up CPCs by an estimated 40–60% compared to competitors with higher QS on the same terms.",
        fix: "Group low-QS keywords into tighter themed ad groups. Rewrite ad copy to tightly match keyword intent. Align landing pages to each ad group's specific offer.",
        severity: "critical",
      },
      {
        title: "Budget Underpacing by 15% This Month",
        detail: "Monthly pacing is running 15% behind target across 4 campaigns. This suggests overly restrictive ad scheduling or budget caps limiting delivery during peak hours.",
        fix: "Review ad scheduling — restaurant searches peak 11am–2pm and 6pm–9pm. Increase budgets for these dayparts. Consider shared budget pools for flexibility.",
        severity: "warning",
      },
      {
        title: "No Audience Exclusions Configured",
        detail: "Current customers and recent converters are being re-targeted in acquisition campaigns without exclusion, wasting spend on already-acquired users.",
        fix: "Upload customer CRM list as a Customer Match exclusion. Create a 30-day converters audience from GA4. Apply both as exclusions to all acquisition campaigns.",
        severity: "warning",
      },
    ],
    aiInsights: [
      "Ad copy analysis reveals inconsistency in value proposition — 'family dining' messaging in some ads conflicts with 'fast casual' positioning in others. A unified brand voice would reduce bounce rates and improve Quality Score.",
      "Delivery-focused campaigns send traffic to the homepage instead of a dedicated order flow. This likely accounts for the below-average landing page experience score and estimated 40%+ drop-off before checkout.",
      "Peak ordering hours (11am–2pm, 6pm–9pm) are not reflected in bid schedule adjustments. Shifting 30% of daily budget toward these windows could improve conversion rate by 20–30%.",
      "3 regional competitors are bidding heavily on 'best [cuisine] near me' queries where LocalEats has zero coverage — a high-intent gap with strong local-intent signal.",
    ],
    projection: "Implementing these fixes could improve Quality Score by ~23% and reduce CPA by ~$4.20 within 60 days.",
  },
  {
    id: "luxeTravel",
    name: "LuxeTravel Premium",
    industry: "Luxury Travel",
    grade: "F",
    score: 38,
    tagline: "Major problems — urgent intervention required",
    color: "#ef4444",
    categoryScores: {
      "Account Structure": 42, "Bidding Strategy": 35, "Keywords & Negatives": 28,
      "Ad Copy & Extensions": 30, "Quality Score": 22, "Landing Pages": 45,
      "Audience Targeting": 32, "Budget & Pacing": 38, "Conversion Tracking": 55,
      "Competitive Analysis": 40,
    },
    results: buildResults({
      1: "fail", 2: "fail", 3: "fail", 4: "fail", 6: "fail",
      10: "fail", 11: "fail", 12: "fail", 14: "fail", 15: "fail", 16: "fail",
      19: "fail", 20: "fail", 21: "fail", 25: "fail", 26: "fail", 27: "fail",
      29: "fail", 30: "fail", 32: "fail", 33: "fail", 34: "fail", 35: "fail", 36: "fail", 37: "fail",
      39: "fail", 40: "fail", 41: "fail", 42: "fail", 43: "fail", 46: "fail", 47: "fail",
      48: "fail", 49: "fail", 51: "fail", 52: "fail", 55: "fail",
      57: "fail", 58: "fail", 59: "fail", 60: "fail", 61: "fail", 62: "fail",
      67: "fail", 68: "fail", 70: "fail", 74: "fail",
      76: "fail", 78: "fail", 80: "fail", 81: "fail",
      84: "fail", 85: "fail", 88: "fail", 89: "fail", 90: "fail",
      7: "warn", 13: "warn", 17: "warn", 22: "warn", 23: "warn", 24: "warn",
      31: "warn", 38: "warn", 44: "warn", 45: "warn", 50: "warn",
      53: "warn", 54: "warn", 63: "warn", 64: "warn", 66: "warn",
      71: "warn", 72: "warn", 73: "warn", 77: "warn", 82: "warn", 83: "warn",
      86: "warn", 87: "warn", 91: "warn", 92: "warn",
    }),
    criticalIssues: [
      {
        title: "Zero Negative Keywords — ~60% Budget Waste Detected",
        detail: "No negative keyword lists applied anywhere in the account. Query analysis shows 60%+ of spend going to irrelevant searches: 'budget travel', 'cheap flights', 'hostels', 'backpacking', 'student trips'.",
        fix: "URGENT: Build and apply master negative list today. Start with: budget, cheap, hostel, backpacker, student, free, discount, deal. Estimated immediate savings: 35–45% of current monthly spend.",
        severity: "critical",
      },
      {
        title: "All Ad Groups Running Deprecated ETAs Only",
        detail: "Every ad group is running Expanded Text Ads only. ETAs were deprecated June 2022 and cannot be created or edited. Smart bidding, Ad Strength, and machine learning optimization are completely disabled.",
        fix: "Create minimum 1 RSA per ad group immediately. Provide 8–10 headlines and 3–4 descriptions with strong CTAs. Use luxury positioning: 'Curated', 'Bespoke', 'Exclusive', 'Handpicked'.",
        severity: "critical",
      },
      {
        title: "Quality Score: 2.1/10 Account Average",
        detail: "Account-wide average QS is 2.1/10. Competitors bidding on the same terms pay an estimated 5–8x less per click for the same position. This is the root cause of unacceptable CPC levels.",
        fix: "Full account restructure required: tighter ad group themes, complete ad copy rewrite, landing page relevance overhaul. This is a 2–3 week strategic project, not a quick fix.",
        severity: "critical",
      },
      {
        title: "Conversion Tracking Missing on 4/7 Campaigns",
        detail: "4 campaigns have zero conversion tracking. There is no measurable ROI for nearly 60% of ad spend. Smart bidding cannot function. Budget optimization is impossible.",
        fix: "Install Google Ads tag on booking confirmation page immediately. Configure GA4 event tracking for all micro-conversions. Link accounts. Enable enhanced conversions for better attribution.",
        severity: "critical",
      },
      {
        title: "Audience Targeting Completely Unconfigured",
        detail: "No Customer Match, no In-Market audiences, no remarketing lists, no RLSA. The account targets keywords only with no audience context layering whatsoever.",
        fix: "Priority order: (1) Upload CRM customer list to Customer Match. (2) Enable In-Market audiences: Luxury Travel, International Trips. (3) Configure RLSA for past website visitors with bid boost.",
        severity: "critical",
      },
      {
        title: "Zero Ad Extensions Across All Campaigns",
        detail: "Not a single ad extension is configured across any campaign. Sitelinks, callouts, structured snippets, price extensions — all missing. This reduces Ad Rank and eliminates free SERP real estate.",
        fix: "Add immediately: 4+ sitelinks (Destinations, Private Jets, Concierge, Book Now), 4+ callouts, structured snippets (Hotels, Experiences, Services), price extensions. Extensions improve CTR 10–15% at zero cost.",
        severity: "critical",
      },
    ],
    aiInsights: [
      "The luxury travel segment demands aspirational, emotion-driven copy. Current ads read as functional and transactional ('Book flights now'). Competitors use language like 'Curated journeys', 'Bespoke itineraries', and 'Handpicked escapes' to signal premium positioning.",
      "Landing page analysis reveals a fundamental message mismatch: search ads promise 'exclusive experiences' but landing pages show generic destination grids shared with budget travel competitors. High-intent luxury travelers expect personalized, editorial-quality experiences.",
      "Bidding patterns show signs of reactive manual management — max CPC bids vary by up to 800% across semantically identical keywords in different campaigns. This suggests the account has never had a coherent strategy.",
      "LuxeTravel is losing 74% of auctions to rank, not budget — meaning competitors with better Quality Scores are outranking LuxeTravel even when bidding less. Fixing QS is the single highest-leverage action available.",
    ],
    projection: "Implementing these fixes could reduce wasted spend by ~62% and improve ROAS from 0.8x to ~2.4x within 90 days.",
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

function statusIcon(status: CheckStatus) {
  if (status === "pass") return "✓";
  if (status === "fail") return "✗";
  if (status === "warn") return "⚠";
  return "·";
}

function statusColor(status: CheckStatus) {
  if (status === "pass") return "#10b981";
  if (status === "fail") return "#ef4444";
  if (status === "warn") return "#f59e0b";
  if (status === "running") return "#8b5cf6";
  return "#1e293b";
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ target, duration = 1.4 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(ease * target));
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return <>{count}</>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function PPCAuditorDemoInner() {
  const [step, setStep] = useState<AuditStep>("select");
  const [selectedAccount, setSelectedAccount] = useState<AccountId | null>(null);
  const [scope, setScope] = useState<ScopeId>("quick");
  const [checkStatuses, setCheckStatuses] = useState<Record<number, CheckStatus>>({});
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"hard" | "soft" | "done">("hard");
  const [showComparison, setShowComparison] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const account = ACCOUNTS.find((a) => a.id === selectedAccount) ?? null;

  function clearAll() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  function schedule(fn: () => void, delay: number) {
    timeoutsRef.current.push(setTimeout(fn, delay));
  }

  function runAudit(acc: Account, sc: ScopeId) {
    clearAll();
    setCheckStatuses({});
    setProgress(0);
    setPhase("hard");

    const hardCPs = CHECKPOINTS.filter((c) => c.type === "hard");
    const softCPs = CHECKPOINTS.filter((c) => c.type === "soft");
    const allCPs = sc === "quick" ? hardCPs : CHECKPOINTS;
    const totalDuration = sc === "quick" ? 8000 : 15000;

    const BATCH = 6;

    // Split into hard and (if full) soft
    const phaseCPs: Array<{ cps: Checkpoint[]; phaseLabel: "hard" | "soft" }> =
      sc === "quick"
        ? [{ cps: hardCPs, phaseLabel: "hard" }]
        : [
            { cps: hardCPs, phaseLabel: "hard" },
            { cps: softCPs, phaseLabel: "soft" },
          ];

    const hardDuration = sc === "quick" ? totalDuration : totalDuration * 0.68;
    const softDuration = totalDuration - hardDuration;
    const phaseDurations = sc === "quick" ? [hardDuration] : [hardDuration, softDuration];

    let resolved = 0;
    let cursor = 0; // ms cursor

    phaseCPs.forEach(({ cps }, phaseIdx) => {
      const phaseDur = phaseDurations[phaseIdx];
      const batches: Checkpoint[][] = [];
      for (let i = 0; i < cps.length; i += BATCH) batches.push(cps.slice(i, i + BATCH));
      const batchInterval = (phaseDur * 0.85) / batches.length;

      // Phase transition signal
      if (phaseIdx > 0) {
        const transitionAt = cursor;
        schedule(() => setPhase("soft"), transitionAt + 150);
        cursor += 500;
      }

      batches.forEach((batch) => {
        const batchStart = cursor;

        // Mark batch as running
        schedule(() => {
          setCheckStatuses((prev) => {
            const next = { ...prev };
            batch.forEach((cp) => { next[cp.id] = "running"; });
            return next;
          });
        }, batchStart);

        // Resolve each checkpoint with stagger
        batch.forEach((cp, i) => {
          schedule(() => {
            const result = acc.results[cp.id];
            setCheckStatuses((prev) => ({ ...prev, [cp.id]: result?.status ?? "pass" }));
            resolved++;
            setProgress(resolved);
          }, batchStart + 280 + i * 110);
        });

        cursor += batchInterval;
      });
    });

    // Completion
    schedule(() => {
      setPhase("done");
      setStep("results");
    }, cursor + 500);

    void allCPs; // used for reference
  }

  function reset() {
    clearAll();
    setStep("select");
    setSelectedAccount(null);
    setScope("quick");
    setCheckStatuses({});
    setProgress(0);
    setPhase("hard");
    setShowComparison(false);
    setExpandedIssues(new Set());
  }

  useEffect(() => () => clearAll(), []);

  // ─── Step 1: Account Selection ──────────────────────────────────────────────

  if (step === "select") {
    return (
      <div className="min-h-screen bg-background text-text-primary font-sans">
        {/* Ambient glows */}
        <div className="glow-blob" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)", top: "-10%", left: "-10%", position: "fixed" }} aria-hidden />
        <div className="glow-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)", bottom: "5%", right: "-8%", position: "fixed" }} aria-hidden />

        <div className="section-container py-20 pb-28">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-white/10 text-xs mb-6" style={{ color: "#94a3b8" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-mono uppercase tracking-widest">Atlas · PPC Auditor · Interactive Demo</span>
            </div>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl gradient-text mb-4 tracking-tight leading-none">
              PPC Auditor
            </h1>
            <p className="text-text-secondary text-base md:text-lg max-w-lg mx-auto mb-6">
              92 checkpoints. Hybrid engine. Hard logic API checks + AI semantic analysis via Gemini.
            </p>
            {/* Engine split */}
            <div id="ppc-engine-split" className="inline-flex items-center gap-0 glass-card border border-white/8 overflow-hidden" style={{ borderRadius: 10 }}>
              <div className="px-5 py-2.5 flex items-center gap-2 text-xs font-mono border-r border-white/8">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-blue-300">70% Hard Logic</span>
                <span className="text-text-muted">API checks</span>
              </div>
              <div className="px-5 py-2.5 flex items-center gap-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-purple-300">30% AI Semantic</span>
                <span className="text-text-muted">Gemini</span>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-text-muted text-xs font-mono uppercase tracking-widest mb-8"
          >
            Step 1 of 3 — Select a sample account to audit
          </motion.p>

          {/* Account cards */}
          <div id="ppc-account-cards" className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ACCOUNTS.map((acc, i) => (
              <motion.button
                key={acc.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.35 + i * 0.1, ease: EASE }}
                onClick={() => { setSelectedAccount(acc.id); setStep("scope"); }}
                className="text-left glass-card glass-card-hover p-7 relative overflow-hidden group"
              >
                {/* bg glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 50%, ${acc.color}0d 0%, transparent 65%)` }}
                />

                {/* Grade badge */}
                <div
                  className="absolute top-5 right-5 w-11 h-11 rounded-xl flex items-center justify-center font-display font-extrabold text-lg"
                  style={{ background: `${acc.color}18`, border: `1px solid ${acc.color}38`, color: acc.color, boxShadow: `0 0 18px ${acc.color}22` }}
                >
                  {acc.grade}
                </div>

                <div className="relative z-10">
                  <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">{acc.industry}</div>
                  <h3 className="font-display font-bold text-xl text-text-primary mb-1 pr-12">{acc.name}</h3>

                  {/* Health bar */}
                  <div className="mt-4 mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-text-muted font-mono">Health</span>
                      <span className="font-mono font-semibold" style={{ color: acc.color }}>{acc.score}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${acc.score}%` }}
                        transition={{ duration: 0.9, delay: 0.5 + i * 0.1, ease: EASE }}
                        className="h-full rounded-full"
                        style={{ background: acc.color }}
                      />
                    </div>
                  </div>

                  <p className="text-text-muted text-sm leading-relaxed">{acc.tagline}</p>

                  <div className="mt-5 flex items-center gap-1.5 text-xs font-mono font-medium" style={{ color: acc.color }}>
                    <span>Audit this account</span>
                    <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>→</motion.span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Checkpoint count badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            {CATEGORIES.map((cat) => {
              const count = CHECKPOINTS.filter((c) => c.category === cat).length;
              return (
                <div key={cat} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-text-muted">{cat}</span>
                  <span className="text-text-muted/50">·</span>
                  <span style={{ color: "#8b5cf6" }}>{count}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Step 2: Scope Selection ─────────────────────────────────────────────────

  if (step === "scope" && account) {
    return (
      <div className="min-h-screen bg-background text-text-primary font-sans flex items-center justify-center px-7">
        <div style={{ maxWidth: 600, width: "100%" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <button
              onClick={() => setStep("select")}
              className="text-text-muted text-xs font-mono mb-8 hover:text-text-secondary transition-colors flex items-center gap-2"
            >
              ← Back
            </button>

            {/* Account pill */}
            <div className="flex items-center gap-3 mb-8 glass-card px-4 py-3 w-fit">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-extrabold text-sm"
                style={{ background: `${account.color}18`, border: `1px solid ${account.color}38`, color: account.color }}
              >
                {account.grade}
              </div>
              <div>
                <div className="font-display font-semibold text-sm text-text-primary">{account.name}</div>
                <div className="text-text-muted text-xs font-mono">{account.industry} · {account.score}% health</div>
              </div>
            </div>

            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-2">
              Select Audit Scope
            </h2>
            <p className="text-text-muted text-sm mb-10">Step 2 of 3 — Quick scan or full audit with AI analysis</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {(
                [
                  {
                    id: "quick" as const,
                    name: "Quick Scan",
                    icon: "⚡",
                    time: "~8 seconds",
                    checks: `${CHECKPOINTS.filter((c) => c.type === "hard").length} checkpoints`,
                    phase: "Hard Logic Only",
                    phaseColor: "#3b82f6",
                    desc: "Binary API validations. Structural issues, missing extensions, bid strategy mismatches, tracking gaps.",
                  },
                  {
                    id: "full" as const,
                    name: "Full Audit",
                    icon: "🧠",
                    time: "~15 seconds",
                    checks: "92 checkpoints",
                    phase: "Hard Logic + AI Semantic",
                    phaseColor: "#8b5cf6",
                    desc: "Hard logic checks plus Gemini-powered semantic analysis of ad copy, audience coherence, and landing page relevance.",
                  },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScope(s.id)}
                  className="text-left p-6 rounded-2xl border transition-all duration-200 relative overflow-hidden"
                  style={{
                    background: scope === s.id ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                    borderColor: scope === s.id ? `${s.phaseColor}50` : "rgba(255,255,255,0.08)",
                    boxShadow: scope === s.id ? `0 0 0 1px ${s.phaseColor}30, 0 8px 32px rgba(0,0,0,0.4)` : "none",
                  }}
                >
                  {scope === s.id && (
                    <div
                      className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ background: s.phaseColor }}
                    >✓</div>
                  )}
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <div className="font-display font-bold text-text-primary text-lg mb-1">{s.name}</div>
                  <div className="flex items-center gap-2 text-xs font-mono mb-3">
                    <span style={{ color: s.phaseColor }}>{s.phase}</span>
                    <span className="text-text-muted/40">·</span>
                    <span className="text-text-muted">{s.time}</span>
                  </div>
                  <div className="text-xs font-mono text-text-muted mb-3">{s.checks}</div>
                  <p className="text-text-muted text-xs leading-relaxed">{s.desc}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setStep("running");
                setTimeout(() => runAudit(account, scope), 80);
              }}
              className="w-full py-4 rounded-xl font-display font-semibold text-base bg-gradient-accent text-white hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              Run {scope === "quick" ? "Quick Scan" : "Full Audit"} →
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Step 3: Running ──────────────────────────────────────────────────────────

  if (step === "running" && account) {
    const cps = scope === "quick" ? CHECKPOINTS.filter((c) => c.type === "hard") : CHECKPOINTS;
    const total = cps.length;
    const pct = total > 0 ? Math.round((progress / total) * 100) : 0;
    const softCount = CHECKPOINTS.filter((c) => c.type === "soft").length;

    return (
      <div className="min-h-screen bg-background text-text-primary font-sans py-12 pb-24">
        <div className="section-container">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="text-text-muted text-xs font-mono uppercase tracking-widest mb-2">
              Auditing · {account.name}
            </div>
            <h2 className="font-display font-bold text-3xl text-text-primary">
              {phase === "hard" && "Running Hard Logic Checks"}
              {phase === "soft" && "AI Semantic Analysis · Gemini"}
              {phase === "done" && "Audit Complete"}
            </h2>

            {/* Phase pills */}
            <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
              <div
                className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border transition-all duration-300"
                style={{
                  background: phase === "hard" ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.03)",
                  borderColor: phase === "hard" ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.08)",
                  color: phase === "hard" ? "#93c5fd" : "#475569",
                }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${phase === "hard" ? "bg-blue-400 animate-pulse" : "bg-slate-600"}`} />
                Hard Logic · {CHECKPOINTS.filter((c) => c.type === "hard").length} checks
              </div>
              {scope === "full" && (
                <>
                  <span className="text-text-muted/25 text-xs">→</span>
                  <div
                    className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border transition-all duration-300"
                    style={{
                      background: phase === "soft" ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
                      borderColor: phase === "soft" ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.08)",
                      color: phase === "soft" ? "#c4b5fd" : "#475569",
                    }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${phase === "soft" ? "bg-purple-400 animate-pulse" : "bg-slate-600"}`} />
                    AI Semantic · {softCount} checks
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div id="ppc-progress" className="mb-8 glass-card px-5 py-4">
            <div className="flex justify-between text-xs font-mono mb-2.5">
              <span className="text-text-muted">{progress}/{total} checkpoints complete</span>
              <span style={{ color: phase === "soft" ? "#a78bfa" : "#60a5fa" }} className="font-semibold">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: phase === "soft"
                    ? "linear-gradient(90deg, #8b5cf6, #22d3ee)"
                    : "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>
          </div>

          {/* Checkpoint categories */}
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const catCPs = cps.filter((c) => c.category === cat);
              if (catCPs.length === 0) return null;

              const passed  = catCPs.filter((c) => checkStatuses[c.id] === "pass").length;
              const failed  = catCPs.filter((c) => checkStatuses[c.id] === "fail").length;
              const warned  = catCPs.filter((c) => checkStatuses[c.id] === "warn").length;
              const running = catCPs.filter((c) => checkStatuses[c.id] === "running").length;
              const done    = passed + failed + warned;

              return (
                <div key={cat} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-display font-semibold text-xs text-text-secondary uppercase tracking-wide">{cat}</div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      {passed  > 0 && <span style={{ color: "#10b981" }}>{passed}✓</span>}
                      {warned  > 0 && <span style={{ color: "#f59e0b" }}>{warned}⚠</span>}
                      {failed  > 0 && <span style={{ color: "#ef4444" }}>{failed}✗</span>}
                      {running > 0 && (
                        <span style={{ color: "#8b5cf6" }} className="animate-pulse">{running} running</span>
                      )}
                      {done === catCPs.length && done > 0 && running === 0 && (
                        <span className="text-text-muted">{done}/{catCPs.length}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1">
                    {catCPs.map((cp) => {
                      const status = checkStatuses[cp.id] ?? "pending";
                      const isRunning = status === "running";
                      return (
                        <motion.div
                          key={cp.id}
                          className="flex items-center gap-2 text-[11px] py-1 px-2 rounded-md"
                          style={{
                            background: isRunning ? "rgba(139,92,246,0.07)" : "transparent",
                            transition: "background 0.2s",
                          }}
                          animate={isRunning ? { opacity: [0.6, 1, 0.6] } : {}}
                          transition={isRunning ? { duration: 0.9, repeat: Infinity } : {}}
                        >
                          <span
                            className="w-4 h-4 flex-shrink-0 flex items-center justify-center rounded text-[9px] font-mono font-bold"
                            style={{
                              color: statusColor(status),
                              background: status !== "pending" && !isRunning ? `${statusColor(status)}16` : undefined,
                            }}
                          >
                            {isRunning ? (
                              <span className="inline-block w-2.5 h-2.5 border border-purple-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              statusIcon(status)
                            )}
                          </span>
                          <span
                            className="truncate leading-tight"
                            style={{
                              color: status === "pending" ? "#1e293b" : isRunning ? "#64748b" : "#475569",
                              transition: "color 0.25s",
                            }}
                          >
                            {cp.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI phase toast */}
          <AnimatePresence>
            {phase === "soft" && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
              >
                <div
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl"
                  style={{ background: "rgba(10,8,20,0.92)", border: "1px solid rgba(139,92,246,0.35)", backdropFilter: "blur(20px)" }}
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-purple-300 text-xs font-mono">Gemini · Semantic analysis · {softCount} soft-logic checks</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ─── Step 4: Results ──────────────────────────────────────────────────────────

  if (step === "results" && account) {
    const allCPs = scope === "quick" ? CHECKPOINTS.filter((c) => c.type === "hard") : CHECKPOINTS;
    const passed = allCPs.filter((c) => account.results[c.id]?.status === "pass").length;
    const failed = allCPs.filter((c) => account.results[c.id]?.status === "fail").length;
    const warned = allCPs.filter((c) => account.results[c.id]?.status === "warn").length;
    const total  = allCPs.length;

    return (
      <div className="min-h-screen bg-background text-text-primary font-sans py-12 pb-24">
        <div className="section-container">
          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-10">
            <div>
              <div className="text-text-muted text-xs font-mono uppercase tracking-widest mb-0.5">
                Audit Complete · {account.name}
              </div>
              <div className="text-text-muted text-xs font-mono">
                {scope === "full" ? "Full Audit · 92 checkpoints" : `Quick Scan · ${total} checkpoints`}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowComparison((v) => !v)}
                className="px-4 py-2 text-xs font-mono rounded-xl glass-card border border-white/10 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showComparison ? "Hide" : "⏱"} Time Comparison
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 text-xs font-mono rounded-xl glass-card border border-white/10 text-text-secondary hover:text-text-primary transition-colors"
              >
                ← New Audit
              </button>
            </div>
          </div>

          {/* Time comparison banner */}
          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="comparison-before p-5 rounded-2xl">
                    <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-2">Manual Audit</div>
                    <div className="font-display font-bold text-3xl text-text-primary mb-1">4–6 hours</div>
                    <p className="text-text-muted text-xs leading-relaxed">Senior PPC specialist. Spreadsheet-based. Error-prone. ~60 checkpoints max. No AI analysis.</p>
                  </div>
                  <div className="comparison-after p-5 rounded-2xl">
                    <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-2">Atlas PPC Auditor</div>
                    <div className="font-display font-bold text-3xl text-text-primary mb-1">{scope === "quick" ? "8 sec" : "5 min"}</div>
                    <p className="text-text-muted text-xs leading-relaxed">92 checkpoints. Hybrid engine. AI semantic analysis. Consistent. On-demand for any account.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Score hero row */}
          <div id="ppc-results" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Grade */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 60%, ${account.color}18 0%, transparent 70%)` }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.4, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                className="font-display font-extrabold relative"
                style={{ fontSize: "5.5rem", lineHeight: 1, color: account.color, textShadow: `0 0 50px ${account.color}55` }}
              >
                {account.grade}
              </motion.div>
              <div className="text-text-muted text-[10px] font-mono uppercase tracking-widest mt-2">Health Grade</div>
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
              className="glass-card p-8 flex flex-col items-center justify-center text-center"
            >
              <div className="font-display font-extrabold text-text-primary" style={{ fontSize: "4.5rem", lineHeight: 1 }}>
                <AnimatedCounter target={account.score} />
                <span className="text-2xl text-text-muted">%</span>
              </div>
              <div className="text-text-muted text-[10px] font-mono uppercase tracking-widest mt-2 mb-4">Health Score</div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: account.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${account.score}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: EASE }}
                />
              </div>
            </motion.div>

            {/* Checkpoint summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14, ease: EASE }}
              className="glass-card p-8"
            >
              <div className="text-text-muted text-[10px] font-mono uppercase tracking-widest mb-5">Checkpoint Summary</div>
              <div className="space-y-3.5">
                {[
                  { label: "Passed",   count: passed, color: "#10b981" },
                  { label: "Warnings", count: warned, color: "#f59e0b" },
                  { label: "Failed",   count: failed, color: "#ef4444" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-mono" style={{ color: item.color }}>{item.label}</span>
                      <span className="text-text-muted font-mono">{item.count} / {total}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / total) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Category breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
            className="glass-card p-6 mb-4"
          >
            <h3 className="font-display font-semibold text-sm text-text-primary mb-5">Category Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {Object.entries(account.categoryScores).map(([cat, score], i) => (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-text-secondary">{cat}</span>
                    <span className="font-mono font-semibold" style={{ color: scoreColor(score) }}>{score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: scoreColor(score) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.7, delay: 0.25 + i * 0.035, ease: EASE }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom row: Critical Issues + AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Critical Issues */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.26, ease: EASE }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <h3 className="font-display font-semibold text-sm text-text-primary">Critical Issues</h3>
                <span className="text-xs font-mono text-text-muted">({account.criticalIssues.length} found)</span>
              </div>
              <div className="space-y-2">
                {account.criticalIssues.map((issue, i) => {
                  const isCrit = issue.severity === "critical";
                  const isOpen = expandedIssues.has(i);
                  return (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden"
                      style={{
                        background: isCrit ? "rgba(239,68,68,0.05)" : "rgba(245,158,11,0.05)",
                        border: `1px solid ${isCrit ? "rgba(239,68,68,0.18)" : "rgba(245,158,11,0.18)"}`,
                      }}
                    >
                      <button
                        className="w-full text-left p-3.5 flex items-start gap-3"
                        onClick={() => {
                          setExpandedIssues((prev) => {
                            const next = new Set(prev);
                            if (next.has(i)) next.delete(i); else next.add(i);
                            return next;
                          });
                        }}
                      >
                        <span className="text-sm flex-shrink-0 mt-0.5 font-bold" style={{ color: isCrit ? "#ef4444" : "#f59e0b" }}>
                          {isCrit ? "✗" : "⚠"}
                        </span>
                        <span className="flex-1 text-xs font-sans font-medium text-text-primary leading-snug pr-2">{issue.title}</span>
                        <span className="text-text-muted text-xs flex-shrink-0 mt-0.5">{isOpen ? "▲" : "▼"}</span>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-3">
                              <p className="text-text-muted text-xs leading-relaxed">{issue.detail}</p>
                              <div
                                className="rounded-lg p-3"
                                style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)" }}
                              >
                                <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest mb-1.5">Recommended Fix</div>
                                <p className="text-text-secondary text-xs leading-relaxed">{issue.fix}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* AI Insights + Projection */}
            <div className="space-y-4">
              {scope === "full" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.32, ease: EASE }}
                  className="glass-card p-6"
                  style={{ border: "1px solid rgba(139,92,246,0.22)" }}
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <h3 className="font-display font-semibold text-sm text-text-primary">AI Insights</h3>
                    <span className="text-[10px] font-mono text-text-muted ml-0.5">via Gemini · Semantic Analysis</span>
                  </div>
                  <div className="space-y-3">
                    {account.aiInsights.map((insight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.45 + i * 0.08 }}
                        className="flex gap-3 text-xs text-text-muted leading-relaxed"
                      >
                        <span className="text-purple-400 flex-shrink-0 mt-0.5 text-[8px]">◆</span>
                        <span>{insight}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {scope === "quick" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.32, ease: EASE }}
                  className="glass-card p-6"
                  style={{ border: "1px solid rgba(59,130,246,0.18)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-blue-400 text-xs">💡</span>
                    <h3 className="font-display font-semibold text-sm text-text-primary">Unlock AI Insights</h3>
                  </div>
                  <p className="text-text-muted text-xs leading-relaxed mb-4">
                    Run a Full Audit to get Gemini-powered semantic analysis: ad copy quality assessment, audience coherence scoring, and landing page relevance evaluation.
                  </p>
                  <button
                    onClick={() => { setScope("full"); setStep("scope"); }}
                    className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5"
                  >
                    Run Full Audit →
                  </button>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: scope === "full" ? 0.4 : 0.36, ease: EASE }}
                className="glass-card p-6"
                style={{ border: "1px solid rgba(34,211,238,0.15)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-cyan-400 text-sm">→</span>
                  <h3 className="font-display font-semibold text-sm text-text-primary">Projected Impact</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{account.projection}</p>
                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-text-muted font-mono">
                  Based on industry benchmarks for {account.industry} accounts at this performance tier.
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const PPC_TOUR_STEPS: TutorialStep[] = [
  { targetId: "ppc-account-cards", title: "Step 1 — Choose an Account", content: "Select a sample Google Ads account. Each has a different health profile — try all three to see how the audit handles a healthy 'A' account vs a failing 'F' account." },
  { targetId: "ppc-engine-split", title: "Step 2 — Hybrid Engine", content: "The Hybrid Engine combines hard logic (binary API checks) with AI semantic analysis via Gemini. This catches issues that pure rule-based systems miss." },
  { targetId: "ppc-progress", title: "Step 3 — Checkpoints Running", content: "92 checkpoints run across 10 categories. Watch them resolve in real-time — green for pass, red for fail, amber for warning." },
  { title: "Step 4 — Phase Transition", content: "Hard logic checks run first (binary API validations), then the AI Semantic phase kicks in for deeper analysis of ad copy, audience coherence, and landing page relevance." },
  { targetId: "ppc-results", title: "Step 5 — Final Grade", content: "The health grade reflects the account across all categories. Scroll down to see specific critical issues and the recommended fix for each one." },
  { title: "Step 6 — Time Saved", content: "What used to take a PPC specialist 4–6 hours of manual auditing now happens in minutes, at any time, for any account — consistent methodology every time." },
];

export default function PPCAuditorDemo() {
  const [tourVisible, setTourVisible] = useState(true);
  const [tourDone, setTourDone] = useState(false);
  return (
    <>
      <PPCAuditorDemoInner />
      <TutorialOverlay
        steps={PPC_TOUR_STEPS}
        visible={tourVisible}
        onComplete={() => { setTourVisible(false); setTourDone(true); }}
      />
      {tourDone && !tourVisible && (
        <RestartTourButton onRestart={() => { setTourVisible(true); setTourDone(false); }} />
      )}
    </>
  );
}
