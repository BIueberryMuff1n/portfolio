"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "form" | "generating" | "result" | "admin";
type ListingStatus = "pending" | "approved" | "live";

interface Listing {
  id: string;
  address: string;
  rent: number;
  deposit: number;
  available: string;
  beds: number;
  sqft: number;
  description: string;
  status: ListingStatus;
  submitted: string;
  leads: number;
  comparableRent: number;
}

// ─── Simulated AI descriptions ────────────────────────────────────────────────
const AI_DESCRIPTIONS: Record<string, string> = {
  default: `This exceptional rental property offers a seamless blend of comfort and contemporary style. Featuring an open-concept layout with abundant natural light, the home is thoughtfully designed for modern living. Premium finishes throughout include hardwood floors, quartz countertops, and stainless steel appliances. Residents will enjoy the convenience of in-unit laundry, private parking, and easy access to local amenities. A rare opportunity in today's competitive rental market — professionally managed and move-in ready.`,
};

// ─── Mock existing listings ───────────────────────────────────────────────────
const SEED_LISTINGS: Listing[] = [
  {
    id: "L-001",
    address: "4820 Maple Ridge Dr, Dallas TX 75201",
    rent: 2450,
    deposit: 2450,
    available: "May 1, 2026",
    beds: 3,
    sqft: 1640,
    description: "Bright 3BR corner unit with skyline views and private patio.",
    status: "live",
    submitted: "Apr 2, 2026",
    leads: 14,
    comparableRent: 2510,
  },
  {
    id: "L-002",
    address: "112 Westover Ct, Austin TX 78702",
    rent: 1875,
    deposit: 1875,
    available: "Apr 15, 2026",
    beds: 2,
    sqft: 1180,
    description: "Updated 2BR in walkable East Austin — minutes from downtown.",
    status: "approved",
    submitted: "Apr 4, 2026",
    leads: 7,
    comparableRent: 1920,
  },
  {
    id: "L-003",
    address: "990 Harbor View Blvd, Houston TX 77002",
    rent: 3100,
    deposit: 3100,
    available: "May 15, 2026",
    beds: 4,
    sqft: 2200,
    description: "Spacious 4BR with waterfront views and resort-style pool.",
    status: "pending",
    submitted: "Apr 5, 2026",
    leads: 0,
    comparableRent: 3080,
  },
];

const STATUS_COLORS: Record<ListingStatus, string> = {
  pending: "rgba(234,179,8,0.15)",
  approved: "rgba(59,130,246,0.15)",
  live: "rgba(16,185,129,0.15)",
};
const STATUS_TEXT: Record<ListingStatus, string> = {
  pending: "#eab308",
  approved: "#3b82f6",
  live: "#10b981",
};
const STATUS_BORDER: Record<ListingStatus, string> = {
  pending: "rgba(234,179,8,0.3)",
  approved: "rgba(59,130,246,0.3)",
  live: "rgba(16,185,129,0.3)",
};

// ─── Typing effect hook ───────────────────────────────────────────────────────
function useTypingEffect(text: string, active: boolean, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(timer); setDone(true); }
    }, speed);
    return () => clearInterval(timer);
  }, [text, active, speed]);
  return { displayed, done };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PropTechDemo() {
  const [step, setStep] = useState<Step>("form");
  const [listings, setListings] = useState<Listing[]>(SEED_LISTINGS);
  const [generatingPhase, setGeneratingPhase] = useState(0);
  const [newListing, setNewListing] = useState<Listing | null>(null);

  // Form state
  const [address, setAddress] = useState("2341 Lakeview Terrace, Plano TX 75023");
  const [rent, setRent] = useState("2200");
  const [deposit, setDeposit] = useState("2200");
  const [available, setAvailable] = useState("May 1, 2026");
  const [beds, setBeds] = useState("3");
  const [sqft, setSqft] = useState("1520");
  const [hasPets, setHasPets] = useState(false);
  const [customDesc, setCustomDesc] = useState("");

  const descriptionText = AI_DESCRIPTIONS.default;
  const { displayed: typedDesc, done: descDone } = useTypingEffect(
    descriptionText,
    step === "result"
  );

  // Generation phases
  const phaseLabels = [
    "Connecting to Zillow Rental API…",
    "Pulling comparable properties within 1mi…",
    "Analyzing 14 comp listings ($/sqft)…",
    "Generating AI property description…",
    "Validating RESO data structure…",
    "Submitting to syndication queue…",
  ];

  const phaseTimings = [600, 900, 1100, 800, 700, 600];

  useEffect(() => {
    if (step !== "generating") return;
    let cumulative = 0;
    phaseTimings.forEach((ms, i) => {
      cumulative += ms;
      setTimeout(() => setGeneratingPhase(i + 1), cumulative);
    });
    const total = phaseTimings.reduce((a, b) => a + b, 0) + 400;
    setTimeout(() => {
      const nl: Listing = {
        id: `L-00${listings.length + 1}`,
        address,
        rent: parseInt(rent) || 2200,
        deposit: parseInt(deposit) || 2200,
        available,
        beds: parseInt(beds) || 3,
        sqft: parseInt(sqft) || 1500,
        description: descriptionText,
        status: "pending",
        submitted: "Apr 6, 2026",
        leads: 0,
        comparableRent: Math.round((parseInt(rent) || 2200) * 1.024),
      };
      setNewListing(nl);
      setListings((prev) => [...prev, nl]);
      setStep("result");
    }, total);
  }, [step]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingPhase(0);
    setStep("generating");
  };

  const handleReset = () => {
    setStep("form");
    setGeneratingPhase(0);
    setNewListing(null);
    setListings(SEED_LISTINGS);
    setAddress("2341 Lakeview Terrace, Plano TX 75023");
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans">
      {/* Ambient glows */}
      <div
        style={{
          position: "fixed", top: "-10%", left: "-10%",
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
        aria-hidden
      />
      <div
        style={{
          position: "fixed", bottom: "0%", right: "-5%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
        aria-hidden
      />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <Link
            href="/demos"
            style={{ color: "#64748b", fontSize: 12, fontFamily: "monospace", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}
          >
            ← demos
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.12em", color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", padding: "0.25rem 0.75rem", borderRadius: 20 }}>
              PropTech · AI Listing Syndication
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, margin: "0.5rem 0 0.5rem", lineHeight: 1.1 }}>
            Rental Listing{" "}
            <span style={{ background: "linear-gradient(90deg, #10b981, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Automation Engine
            </span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15, maxWidth: 560 }}>
            Submit a property → AI enriches it → syndicates to Zillow, MLS & rental platforms automatically.
          </p>
        </div>

        {/* Tab nav */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
          {(["form", "admin"] as Step[]).map((s) => (
            <button
              key={s}
              onClick={() => { if (s === "admin") setStep("admin"); else if (s === "form") handleReset(); }}
              style={{
                padding: "0.45rem 1.1rem",
                borderRadius: 8,
                border: "1px solid",
                borderColor: step === s || (s === "form" && (step === "generating" || step === "result")) ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.08)",
                background: step === s || (s === "form" && (step === "generating" || step === "result")) ? "rgba(16,185,129,0.1)" : "transparent",
                color: step === s || (s === "form" && (step === "generating" || step === "result")) ? "#10b981" : "#64748b",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "monospace",
              }}
            >
              {s === "form" ? "📋 Submit Listing" : "📊 Admin Dashboard"}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 6px #10b981" }} />
            Live System · Simulated AI
          </div>
        </div>

        {/* ── FORM STEP ──────────────────────────────────────────────────── */}
        {step === "form" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>
            {/* Main form */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "2rem" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: "1.5rem", color: "#f1f5f9" }}>
                Property Submission Form
              </h2>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Property Address *</span>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    style={inputStyle}
                    placeholder="123 Main St, Dallas TX 75201"
                  />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Asking Rent ($/mo) *</span>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>$</span>
                      <input value={rent} onChange={(e) => setRent(e.target.value)} required type="number" style={{ ...inputStyle, paddingLeft: 24 }} />
                    </div>
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Security Deposit</span>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>$</span>
                      <input value={deposit} onChange={(e) => setDeposit(e.target.value)} type="number" style={{ ...inputStyle, paddingLeft: 24 }} />
                    </div>
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Bedrooms</span>
                    <select value={beds} onChange={(e) => setBeds(e.target.value)} style={inputStyle}>
                      {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} BR</option>)}
                    </select>
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Sq Ft</span>
                    <input value={sqft} onChange={(e) => setSqft(e.target.value)} type="number" style={inputStyle} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Available Date</span>
                    <input value={available} onChange={(e) => setAvailable(e.target.value)} style={inputStyle} />
                  </label>
                </div>

                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Description <span style={{ color: "#64748b", fontWeight: 400 }}>(optional — AI will generate if blank)</span></span>
                  <textarea
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                    placeholder="Leave blank for AI-generated description…"
                  />
                </label>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <input type="checkbox" id="pets" checked={hasPets} onChange={(e) => setHasPets(e.target.checked)} style={{ width: 16, height: 16 }} />
                  <label htmlFor="pets" style={{ fontSize: 13, color: "#94a3b8", cursor: "pointer" }}>Pets allowed</label>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.8rem 1.5rem",
                    background: "linear-gradient(135deg, #10b981, #22d3ee)",
                    border: "none",
                    borderRadius: 10,
                    color: "#070709",
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Submit & Syndicate Listing →
                </button>
              </form>
            </div>

            {/* Sidebar: what happens next */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem" }}>What happens after submit:</h3>
                {[
                  { icon: "🔍", label: "Data enrichment via Zillow API" },
                  { icon: "🤖", label: "AI description generation (OpenAI)" },
                  { icon: "📊", label: "Comparable rent analysis" },
                  { icon: "✅", label: "Admin review & approval" },
                  { icon: "📡", label: "Syndication to Zillow + MLS" },
                  { icon: "🔔", label: "Lead routing + CRM capture" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.65rem" }}>
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 16, padding: "1.25rem" }}>
                <div style={{ fontSize: 11, fontFamily: "monospace", color: "#10b981", marginBottom: "0.5rem" }}>LIVE STATS</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {[
                    { label: "Active Listings", value: listings.filter(l => l.status === "live").length },
                    { label: "Pending Review", value: listings.filter(l => l.status === "pending").length },
                    { label: "Total Leads", value: listings.reduce((a, l) => a + l.leads, 0) },
                    { label: "Avg Days to Live", value: "1.4" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#10b981" }}>{stat.value}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── GENERATING STEP ──────────────────────────────────────────────── */}
        {step === "generating" && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "3rem 2rem", textAlign: "center" }}>
            <div style={{ marginBottom: "2rem" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 1.5rem",
                background: "rgba(16,185,129,0.1)",
                border: "2px solid rgba(16,185,129,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "spin 2s linear infinite",
                fontSize: 28,
              }}>
                ⚙️
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: "0.5rem" }}>Processing Your Listing</h2>
              <p style={{ color: "#94a3b8", fontSize: 14 }}>Our automation engine is enriching and syndicating your property…</p>
            </div>

            <div style={{ maxWidth: 440, margin: "0 auto", textAlign: "left" }}>
              {phaseLabels.map((label, i) => {
                const done = generatingPhase > i;
                const active = generatingPhase === i;
                return (
                  <div
                    key={label}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.6rem 1rem",
                      marginBottom: "0.5rem",
                      borderRadius: 8,
                      background: done ? "rgba(16,185,129,0.08)" : active ? "rgba(255,255,255,0.04)" : "transparent",
                      border: done ? "1px solid rgba(16,185,129,0.2)" : "1px solid transparent",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>
                      {done ? "✅" : active ? "⏳" : "⬜"}
                    </span>
                    <span style={{ fontSize: 13, color: done ? "#10b981" : active ? "#f1f5f9" : "#64748b", fontFamily: "monospace" }}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── RESULT STEP ──────────────────────────────────────────────────── */}
        {step === "result" && newListing && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Success banner */}
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: 24 }}>✅</span>
              <div>
                <div style={{ fontWeight: 700, color: "#10b981", marginBottom: 2 }}>Listing Submitted Successfully</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>Queued for admin review. Once approved, it will syndicate to Zillow, Rent Manager, and MLS within 15 minutes.</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* AI Generated description */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: "#8b5cf6", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", padding: "0.2rem 0.6rem", borderRadius: 20 }}>
                    AI Generated
                  </span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>Property Description</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#94a3b8" }}>
                  {typedDesc}
                  {!descDone && <span style={{ borderRight: "2px solid #8b5cf6", marginLeft: 1, animation: "blink 1s step-end infinite" }}></span>}
                </p>
              </div>

              {/* Comp analysis */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem" }}>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: "1rem" }}>COMPARABLE RENT ANALYSIS</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5rem", marginBottom: "1rem" }}>
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9" }}>${newListing.rent.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Your asking rent</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#10b981" }}>${newListing.comparableRent.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Market avg</div>
                    </div>
                  </div>
                  <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8, padding: "0.6rem 0.9rem", fontSize: 12, color: "#10b981" }}>
                    ✓ Priced {newListing.comparableRent > newListing.rent ? "below" : "at"} market — high demand expected
                  </div>
                </div>

                {/* Syndication targets */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem" }}>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: "1rem" }}>SYNDICATION TARGETS</div>
                  {[
                    { name: "Zillow Rental Feed", status: "queued" },
                    { name: "MLS / RESO", status: "queued" },
                    { name: "Rent Manager", status: "queued" },
                    { name: "AppFolio Export", status: "queued" },
                  ].map((t) => (
                    <div key={t.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>{t.name}</span>
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: "#eab308", background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", padding: "0.15rem 0.5rem", borderRadius: 20 }}>
                        pending review
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => setStep("admin")}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "linear-gradient(135deg, #10b981, #22d3ee)",
                  border: "none", borderRadius: 10,
                  color: "#070709", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}
              >
                View Admin Dashboard →
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
                  color: "#94a3b8", fontWeight: 600, fontSize: 14, cursor: "pointer",
                }}
              >
                Submit Another
              </button>
            </div>
          </div>
        )}

        {/* ── ADMIN DASHBOARD ──────────────────────────────────────────────── */}
        {step === "admin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
              {[
                { label: "Total Listings", value: listings.length, color: "#22d3ee" },
                { label: "Live on Market", value: listings.filter(l => l.status === "live").length, color: "#10b981" },
                { label: "Total Leads", value: listings.reduce((a, l) => a + l.leads, 0), color: "#8b5cf6" },
                { label: "Avg Rent", value: `$${Math.round(listings.reduce((a, l) => a + l.rent, 0) / listings.length).toLocaleString()}`, color: "#3b82f6" },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Listings table */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Active Listings</div>
                <div style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>
                  {listings.length} total · {listings.filter(l => l.status === "live").length} live
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                      {["ID", "Address", "Rent", "Beds/Sqft", "Status", "Leads", "Actions"].map((h) => (
                        <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: 11, color: "#64748b", fontWeight: 600, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr
                        key={listing.id}
                        style={{
                          borderTop: "1px solid rgba(255,255,255,0.04)",
                          background: listing.id === newListing?.id ? "rgba(16,185,129,0.04)" : "transparent",
                          transition: "background 0.2s",
                        }}
                      >
                        <td style={{ padding: "0.9rem 1rem", fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>{listing.id}</td>
                        <td style={{ padding: "0.9rem 1rem", fontSize: 13, color: "#f1f5f9", maxWidth: 220 }}>
                          <div style={{ fontWeight: 600 }}>{listing.address.split(",")[0]}</div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>{listing.address.split(",").slice(1).join(",").trim()}</div>
                        </td>
                        <td style={{ padding: "0.9rem 1rem", fontSize: 14, fontWeight: 700, color: "#10b981", whiteSpace: "nowrap" }}>
                          ${listing.rent.toLocaleString()}/mo
                        </td>
                        <td style={{ padding: "0.9rem 1rem", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
                          {listing.beds} BR · {listing.sqft.toLocaleString()} sqft
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <span style={{
                            fontSize: 11, fontFamily: "monospace", fontWeight: 600,
                            padding: "0.2rem 0.65rem", borderRadius: 20,
                            background: STATUS_COLORS[listing.status],
                            color: STATUS_TEXT[listing.status],
                            border: `1px solid ${STATUS_BORDER[listing.status]}`,
                            textTransform: "uppercase", letterSpacing: "0.05em",
                          }}>
                            {listing.status}
                          </span>
                        </td>
                        <td style={{ padding: "0.9rem 1rem", fontSize: 13, color: listing.leads > 0 ? "#8b5cf6" : "#64748b", fontWeight: listing.leads > 0 ? 700 : 400 }}>
                          {listing.leads}
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          {listing.status === "pending" && (
                            <button
                              onClick={() => {
                                setListings((prev) => prev.map((l) => l.id === listing.id ? { ...l, status: "approved" } : l));
                              }}
                              style={{
                                padding: "0.3rem 0.8rem",
                                background: "rgba(59,130,246,0.1)",
                                border: "1px solid rgba(59,130,246,0.3)",
                                borderRadius: 6,
                                color: "#3b82f6",
                                fontSize: 12,
                                cursor: "pointer",
                                fontWeight: 600,
                              }}
                            >
                              Approve
                            </button>
                          )}
                          {listing.status === "approved" && (
                            <button
                              onClick={() => {
                                setListings((prev) => prev.map((l) => l.id === listing.id ? { ...l, status: "live" } : l));
                              }}
                              style={{
                                padding: "0.3rem 0.8rem",
                                background: "rgba(16,185,129,0.1)",
                                border: "1px solid rgba(16,185,129,0.3)",
                                borderRadius: 6,
                                color: "#10b981",
                                fontSize: 12,
                                cursor: "pointer",
                                fontWeight: 600,
                              }}
                            >
                              Publish Live
                            </button>
                          )}
                          {listing.status === "live" && (
                            <span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>syndicated ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={handleReset}
              style={{
                padding: "0.7rem 1.4rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
                color: "#94a3b8", fontWeight: 600, fontSize: 14, cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              ← Submit New Listing
            </button>
          </div>
        )}

        {/* Footer note */}
        <div style={{ marginTop: "3rem", padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>
            Demo · AI responses simulated · Built by Anthony Carl
          </span>
          <Link href="https://portfolio-production-6e88.up.railway.app" style={{ fontSize: 11, fontFamily: "monospace", color: "#10b981", textDecoration: "none" }}>
            portfolio-production-6e88.up.railway.app
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

// ─── Shared input style ───────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  padding: "0.6rem 0.85rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#f1f5f9",
  fontSize: 14,
  width: "100%",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};
