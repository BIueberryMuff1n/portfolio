"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────
type Status = "New" | "Contacted" | "Purchased" | "Pass";
type ScrapeStatus = "success" | "failed" | "running" | "pending";

interface Listing {
  id: string;
  title: string;
  category: string;
  askingPrice: number;
  marketValue: number;
  marginEstimate: number;
  pctBelowMarket: number;
  location: string;
  dateAdded: string;
  status: Status;
  notes: string;
  images: number;
  seller: string;
  condition: "Excellent" | "Good" | "Fair";
  priceHistory: { date: string; price: number }[];
}

interface ScrapeJob {
  id: string;
  savedSearch: string;
  runAt: string;
  status: ScrapeStatus;
  listingsFound: number;
  account: string;
  proxy: string;
  error?: string;
  duration: string;
}

// ── Static data ────────────────────────────────────────────────────────────────
const LISTINGS: Listing[] = [
  {
    id: "L001", title: "2021 Trek Domane SL 6 Road Bike — Carbon, 56cm", category: "Cycling", askingPrice: 2200, marketValue: 3850, marginEstimate: 1650, pctBelowMarket: 42.9, location: "Austin, TX", dateAdded: "2026-04-12 09:14", status: "New", notes: "", images: 8, seller: "cyclist_tx", condition: "Excellent",
    priceHistory: [{ date: "Apr 9", price: 2400 }, { date: "Apr 10", price: 2350 }, { date: "Apr 11", price: 2300 }, { date: "Apr 12", price: 2200 }],
  },
  {
    id: "L002", title: "Rolex Submariner Date 116610LN — Box & Papers", category: "Watches", askingPrice: 11500, marketValue: 15200, marginEstimate: 3700, pctBelowMarket: 24.3, location: "Miami, FL", dateAdded: "2026-04-12 08:47", status: "Contacted", notes: "Seller responsive. Wants bank wire.", images: 12, seller: "watch_miami", condition: "Good",
    priceHistory: [{ date: "Apr 8", price: 12000 }, { date: "Apr 10", price: 11800 }, { date: "Apr 12", price: 11500 }],
  },
  {
    id: "L003", title: "DJI Mavic 3 Pro Cine Premium Combo", category: "Electronics", askingPrice: 1850, marketValue: 2800, marginEstimate: 950, pctBelowMarket: 33.9, location: "Seattle, WA", dateAdded: "2026-04-12 07:22", status: "New", notes: "", images: 6, seller: "drone_guy99", condition: "Excellent",
    priceHistory: [{ date: "Apr 11", price: 1900 }, { date: "Apr 12", price: 1850 }],
  },
  {
    id: "L004", title: "Herman Miller Embody Chair — Graphite, Like New", category: "Furniture", askingPrice: 780, marketValue: 1400, marginEstimate: 620, pctBelowMarket: 44.3, location: "Chicago, IL", dateAdded: "2026-04-11 18:55", status: "Purchased", notes: "Picked up April 11. Excellent condition confirmed.", images: 5, seller: "wfh_chicago", condition: "Excellent",
    priceHistory: [{ date: "Apr 10", price: 850 }, { date: "Apr 11", price: 780 }],
  },
  {
    id: "L005", title: "Sony A7R V Mirrorless Camera Body", category: "Photography", askingPrice: 2700, marketValue: 3800, marginEstimate: 1100, pctBelowMarket: 28.9, location: "Los Angeles, CA", dateAdded: "2026-04-11 15:30", status: "New", notes: "", images: 9, seller: "photo_la_pro", condition: "Good",
    priceHistory: [{ date: "Apr 9", price: 2900 }, { date: "Apr 10", price: 2800 }, { date: "Apr 11", price: 2700 }],
  },
  {
    id: "L006", title: "Apple M4 Pro MacBook Pro 16\" — 48GB, 1TB", category: "Electronics", askingPrice: 2400, marketValue: 3200, marginEstimate: 800, pctBelowMarket: 25.0, location: "New York, NY", dateAdded: "2026-04-11 12:10", status: "Pass", notes: "Seller sketchy — declined photo verification.", images: 3, seller: "nyc_tech_sells", condition: "Good",
    priceHistory: [{ date: "Apr 10", price: 2500 }, { date: "Apr 11", price: 2400 }],
  },
  {
    id: "L007", title: "Specialized Turbo Levo SL Expert Carbon eMTB", category: "Cycling", askingPrice: 5400, marketValue: 8500, marginEstimate: 3100, pctBelowMarket: 36.5, location: "Denver, CO", dateAdded: "2026-04-10 21:44", status: "Contacted", notes: "Meeting scheduled April 14.", images: 11, seller: "mtb_denver", condition: "Good",
    priceHistory: [{ date: "Apr 7", price: 5800 }, { date: "Apr 9", price: 5600 }, { date: "Apr 10", price: 5400 }],
  },
];

const SCRAPE_JOBS: ScrapeJob[] = [
  { id: "J018", savedSearch: "Cycling > Road Bikes > $1K", runAt: "2026-04-12 09:00", status: "success", listingsFound: 14, account: "acct_04", proxy: "us-res-07", duration: "38s" },
  { id: "J017", savedSearch: "Watches > Rolex", runAt: "2026-04-12 08:45", status: "success", listingsFound: 7, account: "acct_02", proxy: "us-res-03", duration: "41s" },
  { id: "J016", savedSearch: "Electronics > Cameras", runAt: "2026-04-12 08:30", status: "failed", listingsFound: 0, account: "acct_01", proxy: "us-res-11", error: "Session expired — account rotated", duration: "12s" },
  { id: "J015", savedSearch: "Furniture > Office", runAt: "2026-04-12 08:15", status: "success", listingsFound: 22, account: "acct_03", proxy: "us-res-07", duration: "52s" },
  { id: "J014", savedSearch: "Electronics > Drones", runAt: "2026-04-12 08:00", status: "success", listingsFound: 5, account: "acct_04", proxy: "us-res-09", duration: "34s" },
  { id: "J013", savedSearch: "Cycling > eMTB", runAt: "2026-04-12 07:45", status: "success", listingsFound: 9, account: "acct_02", proxy: "us-res-03", duration: "47s" },
  { id: "J012", savedSearch: "Photography > Sony", runAt: "2026-04-12 07:30", status: "running", listingsFound: 0, account: "acct_01", proxy: "us-res-11", duration: "—" },
];

const STATUS_STYLES: Record<Status, { bg: string; text: string; dot: string }> = {
  New: { bg: "rgba(129,140,248,0.15)", text: "#818cf8", dot: "#818cf8" },
  Contacted: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24", dot: "#fbbf24" },
  Purchased: { bg: "rgba(52,211,153,0.15)", text: "#34d399", dot: "#34d399" },
  Pass: { bg: "rgba(255,255,255,0.06)", text: "rgba(255,255,255,0.3)", dot: "rgba(255,255,255,0.2)" },
};

const SCRAPE_STATUS_STYLES: Record<ScrapeStatus, { color: string; label: string }> = {
  success: { color: "#34d399", label: "Success" },
  failed: { color: "#f87171", label: "Failed" },
  running: { color: "#fbbf24", label: "Running" },
  pending: { color: "rgba(255,255,255,0.3)", label: "Pending" },
};

const CONDITIONS: Record<string, string> = { Excellent: "#34d399", Good: "#fbbf24", Fair: "#f87171" };

function MiniPriceChart({ history }: { history: { date: string; price: number }[] }) {
  const max = Math.max(...history.map(h => h.price));
  const min = Math.min(...history.map(h => h.price));
  const range = max - min || 1;
  const w = 80, h = 28;
  const pts = history.map((h, i) => {
    const x = (i / (history.length - 1)) * w;
    const y = h2 - ((h.price - min) / range) * (h2 - 4);
    return `${x},${y}`;
  }).join(" ");
  const h2 = h;
  const ptsFinal = history.map((hh, i) => {
    const x = (i / (history.length - 1)) * w;
    const y = h2 - ((hh.price - min) / range) * (h2 - 4);
    return `${x},${y}`;
  });
  const polyline = ptsFinal.map(p => p).join(" ");
  const trend = history[history.length - 1].price < history[0].price;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={polyline} fill="none" stroke={trend ? "#34d399" : "#f87171"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {ptsFinal.map((p, i) => {
        const [x, y] = p.split(",").map(Number);
        return <circle key={i} cx={x} cy={y} r="2" fill={trend ? "#34d399" : "#f87171"} />;
      })}
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ListingIntelligenceDashboard() {
  const [view, setView] = useState<"feed" | "monitor">("feed");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [minMargin, setMinMargin] = useState(0);
  const [expandedListing, setExpandedListing] = useState<string | null>(null);
  const [listingStatuses, setListingStatuses] = useState<Record<string, Status>>({});

  const categories = ["All", ...Array.from(new Set(LISTINGS.map(l => l.category)))];

  const filtered = useMemo(() => {
    return LISTINGS
      .filter(l => (statusFilter === "All" || (listingStatuses[l.id] ?? l.status) === statusFilter))
      .filter(l => categoryFilter === "All" || l.category === categoryFilter)
      .filter(l => l.marginEstimate >= minMargin)
      .sort((a, b) => b.pctBelowMarket - a.pctBelowMarket);
  }, [statusFilter, categoryFilter, minMargin, listingStatuses]);

  const stats = {
    total: LISTINGS.length,
    newCount: LISTINGS.filter(l => (listingStatuses[l.id] ?? l.status) === "New").length,
    totalMargin: LISTINGS.filter(l => (listingStatuses[l.id] ?? l.status) !== "Pass").reduce((s, l) => s + l.marginEstimate, 0),
    purchased: LISTINGS.filter(l => (listingStatuses[l.id] ?? l.status) === "Purchased").length,
  };

  const jobSuccessRate = Math.round((SCRAPE_JOBS.filter(j => j.status === "success").length / SCRAPE_JOBS.length) * 100);

  return (
    <div className="min-h-screen bg-[#09090f] text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[10%] h-[400px] w-[400px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #34d399, transparent 70%)" }} />
        <div className="absolute bottom-[10%] left-[5%] h-[350px] w-[350px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, #34d399, #06b6d4)" }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold">Listing Intelligence</div>
              <div className="text-[10px] text-white/30">Marketplace monitoring · 15-min refresh</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Scraper active
            </div>
            <a href="https://portfolio-production-6e88.up.railway.app" target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 hover:bg-white/10 transition-colors">← Portfolio</a>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6">
        {/* Stats bar */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Listings", value: stats.total, sub: "monitored", color: "#818cf8" },
            { label: "New Today", value: stats.newCount, sub: "unreviewed", color: "#fbbf24" },
            { label: "Total Margin", value: `$${stats.totalMargin.toLocaleString()}`, sub: "available", color: "#34d399" },
            { label: "Purchased", value: stats.purchased, sub: "this week", color: "#60a5fa" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <div className="text-xs text-white/30 mb-1">{s.label}</div>
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] text-white/20">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* View tabs */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex gap-1 rounded-xl border border-white/5 bg-white/[0.03] p-1">
            {(["feed", "monitor"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="rounded-lg px-4 py-1.5 text-xs font-medium capitalize transition-all"
                style={{ background: view === v ? "rgba(255,255,255,0.08)" : "transparent", color: view === v ? "white" : "rgba(255,255,255,0.35)" }}>
                {v === "feed" ? "📋 Listing Feed" : "⚙️ Job Monitor"}
              </button>
            ))}
          </div>
          {view === "feed" && (
            <button className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 hover:bg-white/10 transition-colors">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export Excel
            </button>
          )}
        </div>

        {/* Listing Feed view */}
        {view === "feed" && (
          <div className="flex gap-4">
            {/* Filters sidebar */}
            <div className="w-48 shrink-0 space-y-4">
              <div>
                <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/25">Status</div>
                {(["All", "New", "Contacted", "Purchased", "Pass"] as const).map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className="mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-all"
                    style={{ background: statusFilter === s ? "rgba(255,255,255,0.08)" : "transparent", color: statusFilter === s ? "white" : "rgba(255,255,255,0.4)" }}>
                    {s !== "All" && <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_STYLES[s as Status].dot }} />}
                    {s === "All" && <span className="h-1.5 w-1.5 rounded-full bg-white/20" />}
                    {s}
                  </button>
                ))}
              </div>
              <div>
                <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/25">Category</div>
                {categories.map(c => (
                  <button key={c} onClick={() => setCategoryFilter(c)}
                    className="mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-all"
                    style={{ background: categoryFilter === c ? "rgba(255,255,255,0.08)" : "transparent", color: categoryFilter === c ? "white" : "rgba(255,255,255,0.4)" }}>
                    {c}
                  </button>
                ))}
              </div>
              <div>
                <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/25">Min Margin</div>
                {[0, 500, 1000, 2000].map(m => (
                  <button key={m} onClick={() => setMinMargin(m)}
                    className="mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-all"
                    style={{ background: minMargin === m ? "rgba(255,255,255,0.08)" : "transparent", color: minMargin === m ? "white" : "rgba(255,255,255,0.4)" }}>
                    {m === 0 ? "Any" : `$${m.toLocaleString()}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-3">
              {filtered.length === 0 && (
                <div className="py-12 text-center text-white/25 text-sm">No listings match your filters.</div>
              )}
              {filtered.map((listing, i) => {
                const currentStatus = listingStatuses[listing.id] ?? listing.status;
                const ss = STATUS_STYLES[currentStatus];
                const isExpanded = expandedListing === listing.id;

                return (
                  <motion.div key={listing.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div
                      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden cursor-pointer hover:border-white/10 transition-all"
                      onClick={() => setExpandedListing(isExpanded ? null : listing.id)}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Image placeholder */}
                          <div className="h-14 w-14 shrink-0 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-xl">
                            {listing.category === "Cycling" ? "🚲" : listing.category === "Watches" ? "⌚" : listing.category === "Electronics" ? "💻" : listing.category === "Furniture" ? "🪑" : listing.category === "Photography" ? "📷" : "📦"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="mb-1 flex flex-wrap items-start gap-2 justify-between">
                              <h3 className="text-sm font-semibold text-white leading-snug line-clamp-1">{listing.title}</h3>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-bold" style={{ color: "#34d399" }}>
                                  {listing.pctBelowMarket.toFixed(1)}% below
                                </span>
                                <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: ss.bg, color: ss.text }}>
                                  <span className="mr-1" style={{ color: ss.dot }}>●</span>{currentStatus}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-white/35 mb-2">
                              <span>📍 {listing.location}</span>
                              <span>🕒 {listing.dateAdded.split(" ")[0]}</span>
                              <span>🖼️ {listing.images} photos</span>
                              <span style={{ color: CONDITIONS[listing.condition] }}>● {listing.condition}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div>
                                <div className="text-[10px] text-white/25">Asking</div>
                                <div className="text-sm font-bold text-white">${listing.askingPrice.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-white/25">Market</div>
                                <div className="text-sm font-semibold text-white/60">${listing.marketValue.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-white/25">Margin</div>
                                <div className="text-sm font-bold" style={{ color: "#34d399" }}>+${listing.marginEstimate.toLocaleString()}</div>
                              </div>
                              <div className="ml-auto">
                                <MiniPriceChart history={listing.priceHistory} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden border-t border-white/5 bg-white/[0.02] px-4 py-4"
                            onClick={e => e.stopPropagation()}
                          >
                            <div className="flex items-start gap-6">
                              <div className="flex-1 space-y-3">
                                <div>
                                  <div className="text-[10px] text-white/25 uppercase tracking-wider mb-1">Seller</div>
                                  <div className="text-sm text-white/60">{listing.seller}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-white/25 uppercase tracking-wider mb-1">Notes</div>
                                  <div className="text-sm text-white/50 italic">{listing.notes || "No notes yet."}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-white/25 uppercase tracking-wider mb-2">Price History</div>
                                  <div className="flex gap-3">
                                    {listing.priceHistory.map((h, i) => (
                                      <div key={i} className="text-center">
                                        <div className="text-[10px] text-white/25">{h.date}</div>
                                        <div className="text-xs font-semibold text-white/60">${h.price.toLocaleString()}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="shrink-0 space-y-2">
                                <div className="text-[10px] text-white/25 uppercase tracking-wider mb-2">Update Status</div>
                                {(["New", "Contacted", "Purchased", "Pass"] as Status[]).map(s => (
                                  <button
                                    key={s}
                                    onClick={() => setListingStatuses(prev => ({ ...prev, [listing.id]: s }))}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                                    style={{
                                      background: currentStatus === s ? STATUS_STYLES[s].bg : "rgba(255,255,255,0.04)",
                                      color: currentStatus === s ? STATUS_STYLES[s].text : "rgba(255,255,255,0.35)",
                                      border: `1px solid ${currentStatus === s ? STATUS_STYLES[s].text + "40" : "transparent"}`,
                                    }}
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_STYLES[s].dot }} />
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Job Monitor view */}
        {view === "monitor" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Monitor stats */}
            <div className="mb-5 grid grid-cols-3 gap-3">
              {[
                { label: "Jobs run today", value: SCRAPE_JOBS.length, color: "#818cf8" },
                { label: "Success rate", value: `${jobSuccessRate}%`, color: "#34d399" },
                { label: "Listings found", value: SCRAPE_JOBS.reduce((s, j) => s + j.listingsFound, 0), color: "#60a5fa" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center">
                  <div className="text-xs text-white/30 mb-1">{s.label}</div>
                  <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Jobs table */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
              <div className="grid grid-cols-7 gap-2 px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-white/25 border-b border-white/5">
                <span>Job ID</span>
                <span className="col-span-2">Saved Search</span>
                <span>Time</span>
                <span className="text-center">Found</span>
                <span>Account</span>
                <span>Status</span>
              </div>
              {SCRAPE_JOBS.map((job, i) => {
                const ss = SCRAPE_STATUS_STYLES[job.status];
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="grid grid-cols-7 gap-2 px-4 py-3 text-xs border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-white/30 font-mono">{job.id}</span>
                    <span className="col-span-2 text-white/60 truncate">{job.savedSearch}</span>
                    <span className="text-white/30">{job.runAt.split(" ")[1]}</span>
                    <span className="text-center font-semibold" style={{ color: job.listingsFound > 0 ? "#34d399" : "rgba(255,255,255,0.2)" }}>
                      {job.listingsFound > 0 ? job.listingsFound : "—"}
                    </span>
                    <span className="text-white/30 font-mono text-[10px]">{job.account}</span>
                    <div className="flex items-center gap-1.5">
                      {job.status === "running" ? (
                        <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: ss.color }} />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: ss.color }} />
                      )}
                      <span style={{ color: ss.color }}>{ss.label}</span>
                      {job.error && (
                        <span className="ml-1 text-[9px] text-red-400/60 hidden xl:block truncate">{job.error}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <div className="relative z-10 mt-6 border-t border-white/5 py-4 text-center text-[11px] text-white/20">
        Demo built by{" "}
        <a href="https://portfolio-production-6e88.up.railway.app" target="_blank" rel="noreferrer" className="text-white/35 underline underline-offset-2 hover:text-white/50">Anthony</a>
        {" "}· Proof-of-concept for Upwork scraper dashboard gig · Data is simulated
      </div>
    </div>
  );
}
