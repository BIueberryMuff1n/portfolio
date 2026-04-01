"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Platform = "Instagram" | "Facebook" | "TikTok" | "LinkedIn";
type Phase = "idle" | "analyzing" | "generating" | "composing" | "visuals" | "done";
type FilterTab = "All" | Platform;

interface AdVariation {
  id: number;
  headline: string;
  body: string;
  cta: string;
  platform: Platform;
  size: string;
  gradient: string;
  imagePrompt: string;
}

const PRESETS = [
  "Luxury Watches Summer Sale",
  "Vegan Protein Launch",
  "B2B SaaS Demo Signup",
] as const;

const AD_DATA: Record<string, AdVariation[]> = {
  "Luxury Watches Summer Sale": [
    { id: 1, headline: "Time Doesn't Wait", body: "Summer's most coveted timepieces, now up to 40% off.", cta: "Shop the Sale", platform: "Instagram", size: "1080×1080", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", imagePrompt: "Professional product photography of luxury Swiss watch on dark marble surface, golden hour lighting, premium advertising style, no text, no people" },
    { id: 2, headline: "Crafted for Eternity", body: "Swiss precision. Limited summer prices. Only while stocks last.", cta: "Explore Collection", platform: "Instagram", size: "1080×1350", gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)", imagePrompt: "Close-up luxury watch face with sapphire crystal on velvet background, dramatic side lighting, jewellery photography style, no text" },
    { id: 3, headline: "The Season Calls for Excellence", body: "Our finest watches. Your best summer yet. Up to 40% off.", cta: "View Deals", platform: "Facebook", size: "1200×628", gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)", imagePrompt: "Elegant wristwatch on a tanned wrist at a summer yacht, ocean background, lifestyle luxury photography, no text" },
    { id: 4, headline: "40% Off Luxury Timepieces", body: "Ends July 31st. Inventory is limited. Don't miss it.", cta: "Grab the Deal", platform: "Facebook", size: "300×250", gradient: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", imagePrompt: "Luxury watch collection displayed on dark stone surface, spotlight product photography, minimalist style, no text" },
    { id: 5, headline: "Watch What Summer Looks Like", body: "Drop-worthy luxury. Iconic designs, limited-time pricing.", cta: "Swipe Up", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", imagePrompt: "Dynamic luxury watch unboxing in sunlit room, lifestyle photography, warm tones, aspirational mood, no text" },
    { id: 6, headline: "POV: Your Summer Just Leveled Up", body: "The watch you've been watching. Now 40% off.", cta: "Get Yours", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)", imagePrompt: "Luxury watch glinting in golden hour sunlight on an outdoor terrace, aspirational lifestyle, no text" },
    { id: 7, headline: "Reward Your Excellence", body: "For professionals who understand precision. Summer luxury event is live.", cta: "Learn More", platform: "LinkedIn", size: "1200×627", gradient: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)", imagePrompt: "Professional businessman in suit adjusting luxury watch, corporate setting, confident pose, clean office background, no text" },
    { id: 8, headline: "Time Is Your Most Valuable Asset", body: "Invest in timepieces that match your ambition. Summer Sale now live.", cta: "Discover More", platform: "LinkedIn", size: "1080×1080", gradient: "linear-gradient(135deg, #334155 0%, #1e293b 100%)", imagePrompt: "Luxury watch on a mahogany desk beside a leather portfolio, executive lifestyle, moody dark tones, no text" },
    { id: 9, headline: "Rarity Meets Summer", body: "Limited-edition colorways. Your wrist, elevated.", cta: "Shop Now", platform: "Instagram", size: "1080×1080", gradient: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)", imagePrompt: "Limited edition colourful watch strap detail on tropical beach background, vibrant summer colours, macro photography, no text" },
    { id: 10, headline: "Legacy Craftsmanship. Summer Savings.", body: "100-year heritage. 40% off for 30 days only.", cta: "Shop Sale", platform: "Facebook", size: "1080×1080", gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)", imagePrompt: "Vintage watchmaking workshop with gears and tools, artisan craftsmanship, warm ambient lighting, no text" },
    { id: 11, headline: "Summer Flex? This Is It ✨", body: "Luxury watches for less. Only this summer.", cta: "Link in Bio", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #c026d3 0%, #9333ea 100%)", imagePrompt: "Young person wearing bold luxury watch at a rooftop party, colourful city lights background, fashion lifestyle photography, no text" },
    { id: 12, headline: "Make Every Second Count", body: "Summer collection, summer prices. Shop before they're gone.", cta: "Discover", platform: "Instagram", size: "1080×1350", gradient: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)", imagePrompt: "Luxury watch surrounded by summer flowers and sunglasses flatlay, warm sunlight, editorial product photography, no text" },
  ],
  "Vegan Protein Launch": [
    { id: 1, headline: "Protein That Gives a Damn", body: "100% plant-based. 100% delicious. 0% compromise.", cta: "Try Now", platform: "Instagram", size: "1080×1080", gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", imagePrompt: "Vibrant green protein shake with fresh fruits and vegetables on white background, bright natural lighting, health and wellness advertising style, no text" },
    { id: 2, headline: "Plants Do It Better", body: "25g protein per scoop. No whey needed. Just results.", cta: "Get Yours", platform: "Instagram", size: "1080×1350", gradient: "linear-gradient(135deg, #65a30d 0%, #16a34a 100%)", imagePrompt: "Protein powder scoop with pea seeds and hemp plants on wooden surface, natural earthy tones, product photography, no text" },
    { id: 3, headline: "The Future of Fitness Is Plant-Based", body: "Science-backed amino profile. Taste-tested by athletes.", cta: "Shop Now", platform: "Facebook", size: "1200×628", gradient: "linear-gradient(135deg, #059669 0%, #0d9488 100%)", imagePrompt: "Fit athlete holding green smoothie after workout in modern gym, athletic lifestyle photography, bright energetic mood, no text" },
    { id: 4, headline: "Launch Price: 30% Off", body: "Introductory offer ends soon. Try risk-free with our guarantee.", cta: "Claim Offer", platform: "Facebook", size: "300×250", gradient: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)", imagePrompt: "Plant protein supplement bag surrounded by leafy greens on kitchen counter, clean minimalist product shot, no text" },
    { id: 5, headline: "Gym Bro, Meet Your New Protein", body: "Yes, it's vegan. Yes, it slaps. Try it.", cta: "Learn More", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #84cc16 0%, #22c55e 100%)", imagePrompt: "Young muscular person blending a green protein shake in a bright apartment kitchen, lifestyle photography, energetic vibe, no text" },
    { id: 6, headline: "We Dared You to Try It", body: "5-star taste. Planet-positive impact. Ship it.", cta: "Order Now", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #22c55e 0%, #84cc16 100%)", imagePrompt: "Colourful smoothie bowl with berries and seeds on a sunny table, vibrant food photography, overhead shot, no text" },
    { id: 7, headline: "Sustainable Nutrition for Peak Performance", body: "Corporate wellness teams choosing plants for real performance gains.", cta: "Request Sample", platform: "LinkedIn", size: "1200×627", gradient: "linear-gradient(135deg, #15803d 0%, #065f46 100%)", imagePrompt: "Corporate team doing yoga outdoors with healthy plant-based meal boxes, wellness at work, natural lighting, no text" },
    { id: 8, headline: "Your Team's New Recovery Stack", body: "Bulk orders for wellness programs. ESG-aligned nutrition at scale.", cta: "Get Quote", platform: "LinkedIn", size: "1080×1080", gradient: "linear-gradient(135deg, #0f766e 0%, #15803d 100%)", imagePrompt: "Healthy meal prep containers with plant protein ingredients arranged neatly, professional food photography, clean aesthetic, no text" },
    { id: 9, headline: "No Animals. All Gains.", body: "Pea + Rice + Hemp. The complete plant protein stack.", cta: "Shop Now", platform: "Instagram", size: "1080×1080", gradient: "linear-gradient(135deg, #a3e635 0%, #4ade80 100%)", imagePrompt: "Flat lay of peas, brown rice, hemp seeds and protein powder on green background, ingredient photography, no text" },
    { id: 10, headline: "30-Day Taste Guarantee", body: "Love it or your money back. Zero risk, all reward.", cta: "Start Trial", platform: "Facebook", size: "1080×1080", gradient: "linear-gradient(135deg, #0d9488 0%, #16a34a 100%)", imagePrompt: "Person enjoying a delicious green smoothie outdoors with a big smile, lifestyle photography, sunny park background, no text" },
    { id: 11, headline: "Plot Twist: This Is Vegan 👀", body: "The protein shake that broke the internet. Now shipping.", cta: "Get It", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #16a34a 0%, #0284c7 100%)", imagePrompt: "Dramatic reveal of vegan protein shake next to traditional whey on marble surface, comparison photography, studio lighting, no text" },
    { id: 12, headline: "Built Different. Grown Differently.", body: "Your protein revolution starts here. Launch pricing active now.", cta: "Join the Wave", platform: "Instagram", size: "1080×1350", gradient: "linear-gradient(135deg, #06b6d4 0%, #16a34a 100%)", imagePrompt: "Hands holding a fresh green protein shake at a farmers market with fresh produce background, community and nature, no text" },
  ],
  "B2B SaaS Demo Signup": [
    { id: 1, headline: "Your Pipeline Is Leaking", body: "See exactly where deals die. Fix it in 30 days.", cta: "Book Demo", platform: "Instagram", size: "1080×1080", gradient: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", imagePrompt: "Futuristic data dashboard on a monitor showing sales pipeline analytics, glowing purple interface, dark office background, no text" },
    { id: 2, headline: "Stop Guessing. Start Closing.", body: "AI-powered deal intelligence. Your reps will thank you.", cta: "Get Started", platform: "Instagram", size: "1080×1350", gradient: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)", imagePrompt: "Sales professional celebrating a closed deal in front of a large dashboard screen with blue data visualisations, office setting, no text" },
    { id: 3, headline: "87% of Teams Who Demo, Stay", body: "See why revenue leaders choose us over the alternative.", cta: "Schedule Demo", platform: "Facebook", size: "1200×628", gradient: "linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)", imagePrompt: "Modern SaaS product dashboard on laptop in bright open-plan office, startup atmosphere, blue and white interface, no text" },
    { id: 4, headline: "Free 30-Day Trial", body: "No credit card. No commitment. Real results in your pipeline.", cta: "Start Free", platform: "Facebook", size: "300×250", gradient: "linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)", imagePrompt: "Clean minimal UI interface wireframe concept on dark screen, indigo glow, software product photography, no text" },
    { id: 5, headline: "This Dashboard Slaps 🔥", body: "See your entire revenue engine in one view. Live demo available.", cta: "Book It", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)", imagePrompt: "Young sales rep excited about data on a glowing monitor showing upward revenue charts, energetic office scene, blue neon tones, no text" },
    { id: 6, headline: "Your CRM Is Lying to You", body: "Real-time signal intelligence. See what's actually happening.", cta: "See Demo", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)", imagePrompt: "Dramatic split screen showing old messy spreadsheet vs clean AI dashboard, contrast visual, dark tech aesthetic, no text" },
    { id: 7, headline: "Close 23% More Deals This Quarter", body: "Revenue intelligence platform trusted by 500+ sales teams.", cta: "Request Demo", platform: "LinkedIn", size: "1200×627", gradient: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)", imagePrompt: "Executive shaking hands on a deal in a glass-walled boardroom, B2B success, professional corporate photography, no text" },
    { id: 8, headline: "Built for Revenue Leaders", body: "Pipeline visibility, forecast accuracy, deal intelligence. All in one.", cta: "Book a Call", platform: "LinkedIn", size: "1080×1080", gradient: "linear-gradient(135deg, #1e40af 0%, #4f46e5 100%)", imagePrompt: "Revenue leader presenting growth chart to team in modern boardroom with city skyline, confident leadership, no text" },
    { id: 9, headline: "Your Forecast Is Off by 34%", body: "We measured it. We can fix it. Let's talk.", cta: "See How", platform: "Instagram", size: "1080×1080", gradient: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)", imagePrompt: "Abstract data visualisation with forecast accuracy graphs on dark background, analytics concept art, purple and blue glow, no text" },
    { id: 10, headline: "Enterprise-Grade. Startup-Speed Setup.", body: "Live in 24 hours. ROI in 30 days. Proof in your pipeline.", cta: "Try Free", platform: "Facebook", size: "1080×1080", gradient: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)", imagePrompt: "Fast server room with speed motion blur and digital transformation concept, enterprise tech photography, dark cool tones, no text" },
    { id: 11, headline: "Before We Had This Tool...", body: "Sales chaos. Missed forecasts. Blind spots everywhere.", cta: "Part 2 →", platform: "TikTok", size: "1080×1920", gradient: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)", imagePrompt: "Stressed sales manager surrounded by messy spreadsheets and sticky notes, chaotic office environment, relatable B2B pain point, no text" },
    { id: 12, headline: "What If Your Reps Had a Cheat Code?", body: "AI deal coaching at scale. No extra headcount needed.", cta: "Learn More", platform: "LinkedIn", size: "1080×1080", gradient: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", imagePrompt: "Sales rep with glowing AI holographic assistant beside them at their workstation, futuristic tech concept, cinematic lighting, no text" },
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
  { key: "visuals" as Phase, label: "Generating Visuals with Flux AI", sub: "Rendering photorealistic images for each ad" },
];

const FILTER_TABS: FilterTab[] = ["All", "Instagram", "Facebook", "TikTok", "LinkedIn"];

async function generateImageForAd(prompt: string): Promise<string> {
  const res = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error('failed');
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.imageUrl as string;
}

export default function AdEnginePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [ads, setAds] = useState<AdVariation[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(-1);
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportDone, setExportDone] = useState(false);
  const [exportingIndex, setExportingIndex] = useState(-1);

  const activeCampaign = selectedPreset ?? (customPrompt.trim() || null);
  const isGenerating = phase === "analyzing" || phase === "generating" || phase === "composing" || phase === "visuals";

  const generateImagesForAds = async (adList: AdVariation[]) => {
    // Group into batches of 3
    const batches: AdVariation[][] = [];
    for (let i = 0; i < adList.length; i += 3) {
      batches.push(adList.slice(i, i + 3));
    }

    for (const batch of batches) {
      setImageLoading((prev) => {
        const next = { ...prev };
        batch.forEach((ad) => { next[ad.id] = true; });
        return next;
      });

      await Promise.all(
        batch.map(async (ad) => {
          const timeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 10_000)
          );
          try {
            const imageUrl = await Promise.race([generateImageForAd(ad.imagePrompt), timeout]);
            setGeneratedImages((prev) => ({ ...prev, [ad.id]: imageUrl }));
          } catch {
            setImageErrors((prev) => ({ ...prev, [ad.id]: true }));
          } finally {
            setImageLoading((prev) => {
              const next = { ...prev };
              delete next[ad.id];
              return next;
            });
          }
        })
      );
    }
  };

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
    const adList = AD_DATA[key];
    setAds(adList);

    // Phase 4: visual generation
    setPhase("visuals");
    setCurrentPhaseIndex(3);
    setGeneratedImages({});
    setImageErrors({});
    setImageLoading({});

    await generateImagesForAds(adList);

    setPhase("done");
  };

  const handleRegenerateImage = async (ad: AdVariation) => {
    setImageErrors((prev) => { const n = { ...prev }; delete n[ad.id]; return n; });
    setImageLoading((prev) => ({ ...prev, [ad.id]: true }));
    setGeneratedImages((prev) => { const n = { ...prev }; delete n[ad.id]; return n; });
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 10_000)
      );
      const imageUrl = await Promise.race([generateImageForAd(ad.imagePrompt), timeout]);
      setGeneratedImages((prev) => ({ ...prev, [ad.id]: imageUrl }));
    } catch {
      setImageErrors((prev) => ({ ...prev, [ad.id]: true }));
    } finally {
      setImageLoading((prev) => { const n = { ...prev }; delete n[ad.id]; return n; });
    }
  };

  const handleReset = () => {
    setPhase("idle");
    setSelectedPreset(null);
    setCustomPrompt("");
    setAds([]);
    setActiveFilter("All");
    setCurrentPhaseIndex(-1);
    setGeneratedImages({});
    setImageErrors({});
    setImageLoading({});
    setShowExportModal(false);
    setExportProgress(0);
    setExportDone(false);
    setExportingIndex(-1);
  };

  const handleExport = async () => {
    setShowExportModal(true);
    setExportProgress(0);
    setExportDone(false);
    setExportingIndex(0);

    for (let i = 0; i < ads.length; i++) {
      setExportingIndex(i);
      await new Promise((r) => setTimeout(r, 320));
      setExportProgress(Math.round(((i + 1) / ads.length) * 100));
    }

    setExportingIndex(-1);
    setExportDone(true);
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
            v2.5.0 — GPT-4o + Flux Schnell
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
            TikTok, and LinkedIn — with real photorealistic visuals from Flux AI.
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
                        {status === "active" && i < 3 && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.85, ease: "linear" }}
                            className="mt-2.5 h-px rounded-full"
                            style={{ background: "linear-gradient(90deg, #8b5cf6, #22d3ee)" }}
                          />
                        )}
                        {status === "active" && i === 3 && (
                          <div className="mt-2.5 h-px rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: "linear-gradient(90deg, #8b5cf6, #22d3ee)" }}
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            />
                          </div>
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
          {(phase === "done" || phase === "visuals") && ads.length > 0 && (
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
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Cost: ~$0.04 for images</span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
                <span style={{ color: "#22d3ee", opacity: 0.75 }}>
                  Campaign: {selectedPreset || customPrompt}
                </span>
                {phase === "done" && (
                  <>
                    <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200"
                      style={{
                        background: "rgba(34,197,94,0.12)",
                        border: "1px solid rgba(34,197,94,0.3)",
                        color: "#4ade80",
                      }}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Export All
                    </button>
                  </>
                )}
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
                  onClick={handleReset}
                  className="ml-auto px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
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
                    const imgUrl = generatedImages[ad.id];
                    const isLoading = imageLoading[ad.id];
                    const hasError = imageErrors[ad.id];
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
                        {/* Gradient background (always present) */}
                        <div
                          className="absolute inset-0"
                          style={{ background: ad.gradient }}
                        />

                        {/* Real generated image (fades in on top) */}
                        {imgUrl && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                            style={{
                              backgroundImage: `url(${imgUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                        )}

                        {/* Dark overlay for text legibility when image present */}
                        {imgUrl && (
                          <div
                            className="absolute inset-0"
                            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.75) 100%)" }}
                          />
                        )}

                        {/* Card content */}
                        <div
                          className="relative flex flex-col justify-between p-5 h-full"
                          style={{ minHeight: 220 }}
                        >
                          {/* Subtle noise overlay */}
                          {!imgUrl && (
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                backgroundImage:
                                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                                backgroundSize: "160px",
                                opacity: 0.12,
                              }}
                            />
                          )}

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
                            <div className="flex items-center gap-1.5">
                              {/* Loading spinner */}
                              {isLoading && (
                                <svg className="w-3 h-3 animate-spin" style={{ color: "#22d3ee" }} viewBox="0 0 24 24" fill="none">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                                </svg>
                              )}
                              {/* Flux badge when image is ready */}
                              {imgUrl && (
                                <span
                                  className="text-[8px] px-1.5 py-0.5 rounded font-mono"
                                  style={{
                                    background: "rgba(34,211,238,0.15)",
                                    color: "#22d3ee",
                                    border: "1px solid rgba(34,211,238,0.25)",
                                  }}
                                >
                                  flux ai
                                </span>
                              )}
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
                          </div>

                          {/* Error fallback message */}
                          {hasError && (
                            <div
                              className="absolute top-10 left-0 right-0 mx-4 text-center text-[9px] py-1 px-2 rounded"
                              style={{
                                background: "rgba(0,0,0,0.4)",
                                color: "rgba(255,255,255,0.4)",
                                backdropFilter: "blur(4px)",
                              }}
                            >
                              Using template
                            </div>
                          )}

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
                            <div className="mt-2 flex items-center gap-2">
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
                              {hasError && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleRegenerateImage(ad); }}
                                  className="text-[9px] px-2 py-1 rounded-full font-semibold transition-all"
                                  style={{
                                    background: "rgba(139,92,246,0.2)",
                                    color: "#c4b5fd",
                                    border: "1px solid rgba(139,92,246,0.35)",
                                  }}
                                >
                                  ↺ Regen
                                </button>
                              )}
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

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={(e) => { if (exportDone && e.target === e.currentTarget) setShowExportModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-8"
              style={{
                background: "#0d0d10",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                  style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}
                >
                  📁
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Export to Google Drive</div>
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {exportDone ? "Export complete" : `Exporting ${ads.length} files...`}
                  </div>
                </div>
                {exportDone && (
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="ml-auto text-xs"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div
                className="h-1.5 rounded-full mb-5 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #22c55e, #16a34a)" }}
                  animate={{ width: `${exportProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* File list */}
              <div className="space-y-1.5 max-h-64 overflow-y-auto mb-5">
                {ads.map((ad, i) => {
                  const platform = ad.platform.toLowerCase();
                  const size = ad.size.replace("×", "x");
                  const filename = `${(selectedPreset || customPrompt || "campaign")
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .slice(0, 20)}-${platform}-${size}-v1.webp`;
                  const isDone = i < exportingIndex || exportDone;
                  const isCurrent = i === exportingIndex && !exportDone;
                  return (
                    <div
                      key={ad.id}
                      className="flex items-center gap-3 py-1.5 px-2 rounded-lg text-xs transition-all duration-200"
                      style={{
                        background: isCurrent ? "rgba(34,197,94,0.06)" : "transparent",
                      }}
                    >
                      <div className="w-4 flex-shrink-0">
                        {isDone ? (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : isCurrent ? (
                          <svg className="w-3.5 h-3.5 animate-spin" style={{ color: "#22c55e" }} viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                          </svg>
                        ) : (
                          <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(255,255,255,0.08)" }} />
                        )}
                      </div>
                      <span
                        className="font-mono truncate flex-1"
                        style={{ color: isDone ? "rgba(255,255,255,0.55)" : isCurrent ? "#fff" : "rgba(255,255,255,0.2)" }}
                      >
                        {filename}
                      </span>
                      {isDone && (
                        <span style={{ color: "rgba(34,197,94,0.6)", fontSize: 9 }}>
                          {Math.round(80 + Math.random() * 200)}KB
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {exportDone && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    color: "#4ade80",
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {ads.length} files exported to Google Drive
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
