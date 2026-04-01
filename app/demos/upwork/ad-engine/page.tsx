"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Platform = "Instagram" | "Facebook" | "TikTok" | "LinkedIn";
type Phase = "idle" | "analyzing" | "generating" | "composing" | "done";
type DrivePhase = "idle" | "connecting" | "creating" | "exporting" | "done";
type FilterTab = "All" | Platform;

interface AdVariation {
  id: number;
  headline: string;
  body: string;
  cta: string;
  platform: Platform;
  size: string;
  gradient: string;
}

const PRESETS = [
  "Luxury Watches Summer Sale",
  "Vegan Protein Launch",
  "B2B SaaS Demo Signup",
] as const;

const AD_DATA: Record<string, AdVariation[]> = {
  "Luxury Watches Summer Sale": [
    { id: 1, headline: "Time Doesn't Wait", body: "Summer's most coveted timepieces, now up to 40% off.", cta: "Shop the Sale", platform: "Instagram", size: "1080×1080", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: 2, headline: "Crafted for Eternity", body: "Swiss precision. Limited summer prices. Only while stocks last.", cta: "Explore Collection", platform: "Instagram", size: "1080×1350", gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" },
    { id: 3, headline: "The Season Calls for Excellence", body: "Our finest watches. Your best summer yet. Up to 40% off.", cta: "View Deals", platform: "Facebook", size: "1200×628", gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)" },
    { id: 4, headline: "40% Off Luxury Timepieces", body: "Ends July 31st. Inventory is limited. Don't miss it.", cta: "Grab the Deal", platform: "Facebook", size: "300×250", gradient: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)" },
    { id: 5, headline: "Watch What Summer Looks Like", body: "Drop-worthy luxury. Iconic designs, limited-time pricing.", cta: "Swipe Up", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)" },
    { id: 6, headline: "POV: Your Summer Just Leveled Up", body: "The watch you've been watching. Now 40% off.", cta: "Get Yours", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)" },
    { id: 7, headline: "Reward Your Excellence", body: "For professionals who understand precision. Summer luxury event is live.", cta: "Learn More", platform: "LinkedIn", size: "1200×627", gradient: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)" },
    { id: 8, headline: "Time Is Your Most Valuable Asset", body: "Invest in timepieces that match your ambition. Summer Sale now live.", cta: "Discover More", platform: "LinkedIn", size: "1080×1080", gradient: "linear-gradient(135deg, #334155 0%, #1e293b 100%)" },
    { id: 9, headline: "Rarity Meets Summer", body: "Limited-edition colorways. Your wrist, elevated.", cta: "Shop Now", platform: "Instagram", size: "1080×1080", gradient: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)" },
    { id: 10, headline: "Legacy Craftsmanship. Summer Savings.", body: "100-year heritage. 40% off for 30 days only.", cta: "Shop Sale", platform: "Facebook", size: "1080×1080", gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)" },
    { id: 11, headline: "Summer Flex? This Is It ✨", body: "Luxury watches for less. Only this summer.", cta: "Link in Bio", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #c026d3 0%, #9333ea 100%)" },
    { id: 12, headline: "Make Every Second Count", body: "Summer collection, summer prices. Shop before they're gone.", cta: "Discover", platform: "Instagram", size: "1080×1350", gradient: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)" },
  ],
  "Vegan Protein Launch": [
    { id: 1, headline: "Protein That Gives a Damn", body: "100% plant-based. 100% delicious. 0% compromise.", cta: "Try Now", platform: "Instagram", size: "1080×1080", gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" },
    { id: 2, headline: "Plants Do It Better", body: "25g protein per scoop. No whey needed. Just results.", cta: "Get Yours", platform: "Instagram", size: "1080×1350", gradient: "linear-gradient(135deg, #65a30d 0%, #16a34a 100%)" },
    { id: 3, headline: "The Future of Fitness Is Plant-Based", body: "Science-backed amino profile. Taste-tested by athletes.", cta: "Shop Now", platform: "Facebook", size: "1200×628", gradient: "linear-gradient(135deg, #059669 0%, #0d9488 100%)" },
    { id: 4, headline: "Launch Price: 30% Off", body: "Introductory offer ends soon. Try risk-free with our guarantee.", cta: "Claim Offer", platform: "Facebook", size: "300×250", gradient: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)" },
    { id: 5, headline: "Gym Bro, Meet Your New Protein", body: "Yes, it's vegan. Yes, it slaps. Try it.", cta: "Learn More", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #84cc16 0%, #22c55e 100%)" },
    { id: 6, headline: "We Dared You to Try It", body: "5-star taste. Planet-positive impact. Ship it.", cta: "Order Now", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #22c55e 0%, #84cc16 100%)" },
    { id: 7, headline: "Sustainable Nutrition for Peak Performance", body: "Corporate wellness teams choosing plants for real performance gains.", cta: "Request Sample", platform: "LinkedIn", size: "1200×627", gradient: "linear-gradient(135deg, #15803d 0%, #065f46 100%)" },
    { id: 8, headline: "Your Team's New Recovery Stack", body: "Bulk orders for wellness programs. ESG-aligned nutrition at scale.", cta: "Get Quote", platform: "LinkedIn", size: "1080×1080", gradient: "linear-gradient(135deg, #0f766e 0%, #15803d 100%)" },
    { id: 9, headline: "No Animals. All Gains.", body: "Pea + Rice + Hemp. The complete plant protein stack.", cta: "Shop Now", platform: "Instagram", size: "1080×1080", gradient: "linear-gradient(135deg, #a3e635 0%, #4ade80 100%)" },
    { id: 10, headline: "30-Day Taste Guarantee", body: "Love it or your money back. Zero risk, all reward.", cta: "Start Trial", platform: "Facebook", size: "1080×1080", gradient: "linear-gradient(135deg, #0d9488 0%, #16a34a 100%)" },
    { id: 11, headline: "Plot Twist: This Is Vegan 👀", body: "The protein shake that broke the internet. Now shipping.", cta: "Get It", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #16a34a 0%, #0284c7 100%)" },
    { id: 12, headline: "Built Different. Grown Differently.", body: "Your protein revolution starts here. Launch pricing active now.", cta: "Join the Wave", platform: "Instagram", size: "1080×1350", gradient: "linear-gradient(135deg, #06b6d4 0%, #16a34a 100%)" },
  ],
  "B2B SaaS Demo Signup": [
    { id: 1, headline: "Your Pipeline Is Leaking", body: "See exactly where deals die. Fix it in 30 days.", cta: "Book Demo", platform: "Instagram", size: "1080×1080", gradient: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" },
    { id: 2, headline: "Stop Guessing. Start Closing.", body: "AI-powered deal intelligence. Your reps will thank you.", cta: "Get Started", platform: "Instagram", size: "1080×1350", gradient: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" },
    { id: 3, headline: "87% of Teams Who Demo, Stay", body: "See why revenue leaders choose us over the alternative.", cta: "Schedule Demo", platform: "Facebook", size: "1200×628", gradient: "linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)" },
    { id: 4, headline: "Free 30-Day Trial", body: "No credit card. No commitment. Real results in your pipeline.", cta: "Start Free", platform: "Facebook", size: "300×250", gradient: "linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)" },
    { id: 5, headline: "This Dashboard Slaps 🔥", body: "See your entire revenue engine in one view. Live demo available.", cta: "Book It", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)" },
    { id: 6, headline: "Your CRM Is Lying to You", body: "Real-time signal intelligence. See what's actually happening.", cta: "See Demo", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)" },
    { id: 7, headline: "Close 23% More Deals This Quarter", body: "Revenue intelligence platform trusted by 500+ sales teams.", cta: "Request Demo", platform: "LinkedIn", size: "1200×627", gradient: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)" },
    { id: 8, headline: "Built for Revenue Leaders", body: "Pipeline visibility, forecast accuracy, deal intelligence. All in one.", cta: "Book a Call", platform: "LinkedIn", size: "1080×1080", gradient: "linear-gradient(135deg, #1e40af 0%, #4f46e5 100%)" },
    { id: 9, headline: "Your Forecast Is Off by 34%", body: "We measured it. We can fix it. Let's talk.", cta: "See How", platform: "Instagram", size: "1080×1080", gradient: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" },
    { id: 10, headline: "Enterprise-Grade. Startup-Speed Setup.", body: "Live in 24 hours. ROI in 30 days. Proof in your pipeline.", cta: "Try Free", platform: "Facebook", size: "1080×1080", gradient: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)" },
    { id: 11, headline: "Before We Had This Tool...", body: "Sales chaos. Missed forecasts. Blind spots everywhere.", cta: "Part 2 →", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" },
    { id: 12, headline: "What If Your Reps Had a Cheat Code?", body: "AI deal coaching at scale. No extra headcount needed.", cta: "Learn More", platform: "LinkedIn", size: "1080×1080", gradient: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)" },
  ],
};

const PLATFORM_STYLE: Record<Platform, { dot: string; badge: string; label: string }> = {
  Instagram: { dot: "#f472b6", badge: "rgba(244,114,182,0.15)", label: "#f9a8d4" },
  Facebook: { dot: "#60a5fa", badge: "rgba(96,165,250,0.15)", label: "#93c5fd" },
  TikTok: { dot: "#22d3ee", badge: "rgba(34,211,238,0.15)", label: "#67e8f9" },
  LinkedIn: { dot: "#38bdf8", badge: "rgba(56,189,248,0.15)", label: "#7dd3fc" },
};

const PHASES = [
  { key: "analyzing" as Phase, label: "Analyzing Campaign Brief", sub: "Parsing tone, audience, and product signals" },
  { key: "generating" as Phase, label: "Generating Ad Copy", sub: "Writing headlines, body, and CTAs per platform" },
  { key: "composing" as Phase, label: "Composing Creatives", sub: "Assembling 12 platform-optimized variations" },
];

const FILTER_TABS: FilterTab[] = ["All", "Instagram", "Facebook", "TikTok", "LinkedIn"];

export default function AdEnginePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [ads, setAds] = useState<AdVariation[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(-1);
  const [drivePhase, setDrivePhase] = useState<DrivePhase>("idle");
  const [exportedCount, setExportedCount] = useState(0);

  const activeCampaign = selectedPreset ?? (customPrompt.trim() || null);
  const isGenerating = phase === "analyzing" || phase === "generating" || phase === "composing";

  const handleGenerate = async () => {
    if (!activeCampaign) return;

    setPhase("analyzing");
    setCurrentPhaseIndex(0);
    await new Promise((r) => setTimeout(r, 2000));

    setPhase("generating");
    setCurrentPhaseIndex(1);
    await new Promise((r) => setTimeout(r, 2000));

    setPhase("composing");
    setCurrentPhaseIndex(2);
    await new Promise((r) => setTimeout(r, 2000));

    const key = selectedPreset && selectedPreset in AD_DATA ? selectedPreset : "Luxury Watches Summer Sale";
    setAds(AD_DATA[key]);
    setPhase("done");
  };

  const handleDriveExport = async () => {
    setExportedCount(0);
    setDrivePhase("connecting");
    await new Promise((r) => setTimeout(r, 1000));
    setDrivePhase("creating");
    await new Promise((r) => setTimeout(r, 1000));
    setDrivePhase("exporting");
    for (let i = 1; i <= 12; i++) {
      await new Promise((r) => setTimeout(r, 220));
      setExportedCount(i);
    }
    setDrivePhase("done");
  };

  const handleReset = () => {
    setPhase("idle");
    setSelectedPreset(null);
    setCustomPrompt("");
    setAds([]);
    setActiveFilter("All");
    setCurrentPhaseIndex(-1);
  };

  const filteredAds = activeFilter === "All" ? ads : ads.filter((a) => a.platform === activeFilter);

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#070709", fontFamily: "'DM Mono', 'IBM Plex Mono', monospace" }}
    >
      {/* Grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Top bar */}
      <header
        className="relative border-b px-8 py-5"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.3)",
              }}
            >
              ⚡
            </div>
            <div>
              <div className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                Upwork Demo
              </div>
              <div className="text-sm font-semibold tracking-tight text-white">AI Ad Creative Engine</div>
            </div>
          </div>
          <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            v2.4.1 — GPT-4o + DALL·E 3
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-8 py-12">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3 leading-tight">
            <span className="text-white">Generate </span>
            <span
              style={{
                background: "linear-gradient(90deg, #a78bfa, #22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              12 Ad Variations
            </span>
          </h1>
          <p className="text-sm max-w-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Describe your campaign and watch AI generate platform-optimized creatives across Instagram, Facebook,
            TikTok, and LinkedIn — in under 10 seconds.
          </p>
        </motion.div>

        {/* Input section */}
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-12"
            >
              {/* Presets */}
              <div className="mb-6">
                <div
                  className="text-[10px] tracking-widest uppercase mb-3"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Quick Start Presets
                </div>
                <div className="flex flex-wrap gap-3">
                  {PRESETS.map((preset) => {
                    const active = selectedPreset === preset;
                    return (
                      <button
                        key={preset}
                        onClick={() => {
                          setSelectedPreset(active ? null : preset);
                          setCustomPrompt("");
                        }}
                        className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
                        style={{
                          background: active ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${active ? "rgba(139,92,246,0.45)" : "rgba(255,255,255,0.08)"}`,
                          color: active ? "#c4b5fd" : "rgba(255,255,255,0.55)",
                        }}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom input */}
              <div className="mb-7">
                <div
                  className="text-[10px] tracking-widest uppercase mb-3"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Or Enter Your Campaign
                </div>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => {
                    setCustomPrompt(e.target.value);
                    setSelectedPreset(null);
                  }}
                  placeholder="e.g. Black Friday sale for noise-cancelling headphones..."
                  className="w-full rounded-xl px-5 py-4 text-sm transition-all duration-200 outline-none"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.9)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(139,92,246,0.45)";
                    e.target.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.08)";
                    e.target.style.background = "rgba(255,255,255,0.04)";
                  }}
                />
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!activeCampaign}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                style={
                  activeCampaign
                    ? {
                        background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                        color: "#fff",
                        boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        color: "rgba(255,255,255,0.25)",
                        cursor: "not-allowed",
                      }
                }
                onMouseEnter={(e) => {
                  if (activeCampaign) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "linear-gradient(135deg, #8b5cf6, #7c3aed)";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 6px 28px rgba(124,58,237,0.45)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCampaign) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "linear-gradient(135deg, #7c3aed, #6d28d9)";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 4px 24px rgba(124,58,237,0.35)";
                  }
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Generate 12 Ads
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase animation */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              key="phases"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="mb-12 rounded-2xl p-8"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-2.5 mb-8">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#8b5cf6" }}
                />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  AI engine running — {activeCampaign}
                </span>
              </div>
              <div className="space-y-6">
                {PHASES.map((p, i) => {
                  const status =
                    i < currentPhaseIndex ? "done" : i === currentPhaseIndex ? "active" : "pending";
                  return (
                    <div key={p.key} className="flex items-start gap-4">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-500"
                        style={{
                          background:
                            status === "done"
                              ? "rgba(139,92,246,0.25)"
                              : status === "active"
                              ? "rgba(139,92,246,0.15)"
                              : "rgba(255,255,255,0.04)",
                          border:
                            status === "done"
                              ? "1px solid rgba(139,92,246,0.5)"
                              : status === "active"
                              ? "1px solid rgba(139,92,246,0.4)"
                              : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {status === "done" ? (
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : status === "active" ? (
                          <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ background: "#8b5cf6" }}
                          />
                        ) : (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: "rgba(255,255,255,0.15)" }}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className="text-sm font-medium transition-colors duration-500"
                          style={{
                            color:
                              status === "done"
                                ? "rgba(255,255,255,0.35)"
                                : status === "active"
                                ? "#fff"
                                : "rgba(255,255,255,0.25)",
                            textDecoration: status === "done" ? "line-through" : "none",
                          }}
                        >
                          {p.label}
                        </div>
                        <div
                          className="text-xs mt-0.5 transition-colors duration-500"
                          style={{
                            color:
                              status === "active"
                                ? "rgba(255,255,255,0.4)"
                                : "rgba(255,255,255,0.2)",
                          }}
                        >
                          {p.sub}
                        </div>
                        {status === "active" && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.85, ease: "linear" }}
                            className="mt-2.5 h-px rounded-full"
                            style={{ background: "linear-gradient(90deg, #8b5cf6, #22d3ee)" }}
                          />
                        )}
                      </div>
                      {status === "done" && (
                        <span className="text-[10px] mt-1" style={{ color: "rgba(167,139,250,0.6)" }}>
                          done
                        </span>
                      )}
                      {status === "active" && (
                        <span
                          className="text-[10px] mt-1 animate-pulse"
                          style={{ color: "#22d3ee" }}
                        >
                          •••
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {phase === "done" && ads.length > 0 && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {/* Stats bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap items-center gap-4 mb-6 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-semibold text-green-400">12 variations in 6.2s</span>
                </div>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Manual: ~4 hours</span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Cost: ~$0.03/variation</span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
                <span style={{ color: "#22d3ee", opacity: 0.75 }}>
                  Campaign: {selectedPreset || customPrompt}
                </span>
              </motion.div>

              {/* Filter tabs + reset */}
              <div className="flex items-center gap-2 mb-8 flex-wrap">
                {FILTER_TABS.map((tab) => {
                  const count = tab === "All" ? ads.length : ads.filter((a) => a.platform === tab).length;
                  const active = activeFilter === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      className="px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        background: active ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${active ? "rgba(139,92,246,0.4)" : "transparent"}`,
                        color: active ? "#c4b5fd" : "rgba(255,255,255,0.45)",
                      }}
                    >
                      {tab}
                      <span
                        className="ml-1.5"
                        style={{ color: active ? "rgba(196,181,253,0.6)" : "rgba(255,255,255,0.25)" }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
                <button
                  onClick={handleDriveExport}
                  className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #1a73e8, #1557b0)",
                    color: "#fff",
                    boxShadow: "0 2px 12px rgba(26,115,232,0.35)",
                  }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.6 10.8L4 15l2 3.46h12l2-3.46-2.6-4.26H6.6zM8.4 6l-2 3.46H3l2 3.46h14l2-3.46h-3.4L15.6 6H8.4zM12 2L9 7.2h6L12 2z" />
                  </svg>
                  Export to Drive
                </button>
                <button
                  onClick={handleReset}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  ↺ Reset
                </button>
              </div>

              {/* Ad grid — 4 columns × 3 rows */}
              <div className="grid grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredAds.map((ad, i) => {
                    const ps = PLATFORM_STYLE[ad.platform];
                    return (
                      <motion.div
                        key={ad.id}
                        layout
                        initial={{ opacity: 0, scale: 0.88, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88 }}
                        transition={{ delay: i * 0.04, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="group relative rounded-xl overflow-hidden cursor-pointer"
                        style={{ minHeight: 220 }}
                      >
                        {/* Gradient background */}
                        <div
                          className="relative flex flex-col justify-between p-5 h-full"
                          style={{ background: ad.gradient, minHeight: 220 }}
                        >
                          {/* Subtle noise overlay */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                              backgroundSize: "160px",
                              opacity: 0.12,
                            }}
                          />

                          {/* Top row: platform + size */}
                          <div className="relative flex items-center justify-between mb-4">
                            <span
                              className="text-[10px] font-semibold px-2 py-1 rounded-md"
                              style={{
                                background: ps.badge,
                                color: ps.label,
                                border: "1px solid rgba(255,255,255,0.1)",
                                backdropFilter: "blur(4px)",
                              }}
                            >
                              {ad.platform}
                            </span>
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                              style={{
                                background: "rgba(0,0,0,0.25)",
                                color: "rgba(255,255,255,0.55)",
                                backdropFilter: "blur(4px)",
                              }}
                            >
                              {ad.size}
                            </span>
                          </div>

                          {/* Ad copy */}
                          <div className="relative flex flex-col gap-2">
                            <div className="text-white font-bold text-sm leading-tight drop-shadow-sm">
                              {ad.headline}
                            </div>
                            <div
                              className="text-[11px] leading-relaxed"
                              style={{ color: "rgba(255,255,255,0.72)" }}
                            >
                              {ad.body}
                            </div>
                            <div className="mt-2">
                              <span
                                className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg"
                                style={{ background: "#fff", color: "#111" }}
                              >
                                {ad.cta}
                                <svg
                                  className="w-2.5 h-2.5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                >
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                  <polyline points="12 5 19 12 12 19" />
                                </svg>
                              </span>
                            </div>
                          </div>

                          {/* Hover overlay */}
                          <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                            style={{ background: "rgba(0,0,0,0.25)" }}
                          >
                            <span
                              className="text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg"
                              style={{ background: "rgba(255,255,255,0.92)", color: "#111" }}
                            >
                              Export Ad →
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Google Drive Export Modal */}
      <AnimatePresence>
        {drivePhase !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
            onClick={() => drivePhase === "done" && setDrivePhase("idle")}
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl w-full max-w-md p-6"
              style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(26,115,232,0.15)", border: "1px solid rgba(26,115,232,0.3)" }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#4a8fef">
                    <path d="M6.6 10.8L4 15l2 3.46h12l2-3.46-2.6-4.26H6.6zM8.4 6l-2 3.46H3l2 3.46h14l2-3.46h-3.4L15.6 6H8.4zM12 2L9 7.2h6L12 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Google Drive Export</div>
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {drivePhase === "done" ? "12 files exported successfully" : "Exporting ad creatives…"}
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3 mb-5">
                {[
                  { key: "connecting", label: "Connecting to Google Drive…" },
                  { key: "creating",   label: "Creating folder: /Ad Campaigns/Summer Sale 2026/" },
                  { key: "exporting",  label: "Exporting 12 creatives" },
                ].map((step) => {
                  const phases: DrivePhase[] = ["connecting", "creating", "exporting", "done"];
                  const stepIdx = phases.indexOf(step.key as DrivePhase);
                  const curIdx  = phases.indexOf(drivePhase);
                  const status  = curIdx > stepIdx ? "done" : curIdx === stepIdx ? "active" : "pending";
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-400"
                        style={{
                          background: status === "done" ? "rgba(26,115,232,0.2)" : status === "active" ? "rgba(26,115,232,0.12)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${status === "pending" ? "rgba(255,255,255,0.08)" : "rgba(26,115,232,0.4)"}`,
                        }}
                      >
                        {status === "done"   ? <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#4a8fef" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        : status === "active" ? <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4a8fef" }} />
                        : <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />}
                      </div>
                      <span className="text-xs transition-colors duration-300" style={{ color: status === "active" ? "#fff" : status === "done" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)" }}>
                        {step.label}
                      </span>
                      {status === "active" && step.key === "exporting" && (
                        <span className="ml-auto text-[11px] font-mono" style={{ color: "#4a8fef" }}>{exportedCount}/12</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress bar during exporting */}
              {(drivePhase === "exporting" || drivePhase === "done") && (
                <div className="mb-5 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #1a73e8, #4a8fef)" }}
                    animate={{ width: `${(exportedCount / 12) * 100}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              )}

              {/* File list (done state) */}
              {drivePhase === "done" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="px-3 py-2 text-[10px] uppercase tracking-widest" style={{ background: "rgba(26,115,232,0.08)", color: "rgba(255,255,255,0.3)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    /Ad Campaigns/Summer Sale 2026/
                  </div>
                  <div className="max-h-44 overflow-y-auto">
                    {ads.map((ad, idx) => (
                      <div key={ad.id} className="flex items-center gap-2.5 px-3 py-2 text-[11px]" style={{ borderBottom: idx < ads.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#4a8fef" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="9 11 12 14 22 4"/></svg>
                        <span className="flex-1 truncate font-mono" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {(selectedPreset || "campaign").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-{ad.platform.toLowerCase()}-{ad.size.replace("×", "x")}-v{idx + 1}.png
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.25)" }}>{(120 + idx * 37).toFixed(0)}KB</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Footer button */}
              <button
                onClick={() => setDrivePhase("idle")}
                className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: drivePhase === "done" ? "linear-gradient(135deg, #1a73e8, #1557b0)" : "rgba(255,255,255,0.05)",
                  color: drivePhase === "done" ? "#fff" : "rgba(255,255,255,0.35)",
                  cursor: drivePhase === "done" ? "pointer" : "default",
                }}
              >
                {drivePhase === "done" ? "Done — Close" : "Please wait…"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
