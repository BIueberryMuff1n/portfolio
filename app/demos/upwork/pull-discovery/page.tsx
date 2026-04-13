"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────
type Tab = "All" | "Content" | "People" | "Knowledge" | "Data";
type ResultCard = {
  id: number;
  tab: Tab;
  title: string;
  source: string;
  snippet: string;
  tag: string;
  tagColor: string;
  relevance: number;
  icon: string;
  aiNote?: string;
};

// ── Static result data ─────────────────────────────────────────────────────────
const RESULTS_DB: Record<string, ResultCard[]> = {
  "AI interface trends": [
    { id: 1, tab: "Content", title: "The Rise of Ambient AI: Interfaces That Disappear", source: "Ars Technica", snippet: "Next-gen AI interfaces prioritize invisibility — surfacing answers without explicit queries, adapting to user context in real time.", tag: "Design", tagColor: "#818cf8", relevance: 98, icon: "📰", aiNote: "Highly relevant — discusses the exact discovery-layer concept Pull Discovery is building toward." },
    { id: 2, tab: "Knowledge", title: "Semantic Search vs Keyword Search: A 2025 Guide", source: "Towards Data Science", snippet: "Vector embeddings now outperform BM25 on 87% of real-world retrieval benchmarks, enabling true intent-aware discovery.", tag: "Research", tagColor: "#34d399", relevance: 94, icon: "🧠", aiNote: "Core technical foundation for the RAG layer in this platform." },
    { id: 3, tab: "People", title: "Andrej Karpathy on 'Software 2.0'", source: "Medium", snippet: "Neural nets writing code is the beginning. The real shift is AI as the interface itself — not a tool inside an interface.", tag: "Thought Leader", tagColor: "#f59e0b", relevance: 91, icon: "👤" },
    { id: 4, tab: "Content", title: "How Perplexity Built a $3B Search Engine in 18 Months", source: "The Information", snippet: "The secret: real-time web access + answer synthesis + source attribution. Users trust the source trail.", tag: "Industry", tagColor: "#60a5fa", relevance: 89, icon: "📰" },
    { id: 5, tab: "Data", title: "AI Interface UX Patterns: 2024 User Study", source: "Nielsen Norman Group", snippet: "Conversational search adoption grew 340% in 2024 among knowledge workers. Top feature: context persistence across sessions.", tag: "Dataset", tagColor: "#e879f9", relevance: 86, icon: "📊", aiNote: "Empirical backing for Pull Discovery's UX hypothesis." },
    { id: 6, tab: "Knowledge", title: "RAG Architecture for Live Discovery Systems", source: "LangChain Blog", snippet: "Hybrid retrieval — dense + sparse — reduces hallucination by 61% in open-domain Q&A. The production standard in 2025.", tag: "Technical", tagColor: "#34d399", relevance: 83, icon: "🧠" },
    { id: 7, tab: "People", title: "Lenny Rachitsky on Product Discovery in the AI Era", source: "Lenny's Newsletter", snippet: "The best AI products remove the search step entirely. They surface what you'd search for before you know you need it.", tag: "Product", tagColor: "#f59e0b", relevance: 80, icon: "👤" },
    { id: 8, tab: "Data", title: "Enterprise Search Market: $10.8B by 2028", source: "MarketsandMarkets", snippet: "AI-augmented enterprise search growing at 18.4% CAGR. Driver: employees spend 20% of workday finding information.", tag: "Market Data", tagColor: "#e879f9", relevance: 77, icon: "📊" },
  ],
  "machine learning papers": [
    { id: 1, tab: "Knowledge", title: "Attention Is All You Need — Annotated", source: "Harvard NLP", snippet: "The transformer paper that started everything, annotated line-by-line with implementation notes.", tag: "Paper", tagColor: "#34d399", relevance: 99, icon: "🧠" },
    { id: 2, tab: "Content", title: "GPT-4 Technical Report: What We Learned", source: "OpenAI", snippet: "Multimodal reasoning, RLHF improvements, and the emergent capabilities that surprised even the researchers.", tag: "Research", tagColor: "#818cf8", relevance: 95, icon: "📰" },
    { id: 3, tab: "Data", title: "Papers With Code: 2025 Leaderboards", source: "paperswithcode.com", snippet: "State-of-the-art results across 4,000+ ML tasks, with linked implementations and datasets.", tag: "Dataset", tagColor: "#e879f9", relevance: 90, icon: "📊" },
    { id: 4, tab: "People", title: "Yann LeCun's Position on LLM Limitations", source: "Meta AI Blog", snippet: "LeCCun argues current LLMs lack world models and cannot achieve AGI. His proposed alternative: JEPA architecture.", tag: "Researcher", tagColor: "#f59e0b", relevance: 87, icon: "👤" },
    { id: 5, tab: "Knowledge", title: "LoRA: Low-Rank Adaptation Explained", source: "Hugging Face", snippet: "Fine-tune billion-parameter models with minimal GPU memory by injecting trainable rank-decomposition matrices.", tag: "Technical", tagColor: "#34d399", relevance: 84, icon: "🧠" },
    { id: 6, tab: "Content", title: "The Bitter Lesson — Richard Sutton", source: "incompleteideas.net", snippet: "The most important lesson: general methods that leverage computation always win over hand-crafted knowledge.", tag: "Classic", tagColor: "#818cf8", relevance: 82, icon: "📰" },
  ],
  "startup growth strategies": [
    { id: 1, tab: "Content", title: "How Figma Went From $0 to $20B: The Full Breakdown", source: "Sacra", snippet: "PLG motion, designer-first distribution, and multiplayer as a growth loop — the definitive Figma teardown.", tag: "Case Study", tagColor: "#818cf8", relevance: 96, icon: "📰" },
    { id: 2, tab: "People", title: "Paul Graham: 'Do Things That Don't Scale'", source: "paulgraham.com", snippet: "The most counterintuitive startup advice: obsessive manual effort early creates loyal users who fuel organic growth.", tag: "Founder", tagColor: "#f59e0b", relevance: 93, icon: "👤" },
    { id: 3, tab: "Data", title: "Y Combinator S24 Batch: Funding & Growth Data", source: "Crunchbase", snippet: "Median S24 company raised $2.1M pre-seed. 34% are AI-native. Average time to first dollar: 73 days.", tag: "Market Data", tagColor: "#e879f9", relevance: 89, icon: "📊" },
    { id: 4, tab: "Knowledge", title: "The SaaS Metrics That Actually Predict Survival", source: "Bessemer VP", snippet: "NDR > 110% is the single strongest predictor of SaaS company survival at Series B and beyond.", tag: "Framework", tagColor: "#34d399", relevance: 85, icon: "🧠" },
    { id: 5, tab: "Content", title: "Notion's Horizontal Product Strategy", source: "Every.to", snippet: "How Notion became the 'everything app' for knowledge workers by staying deliberately unopinionated.", tag: "Analysis", tagColor: "#818cf8", relevance: 82, icon: "📰" },
    { id: 6, tab: "People", title: "Sahil Bloom on Building in Public", source: "The Curiosity Chronicle", snippet: "Transparent building creates compounding trust. Sharing the journey is itself a distribution strategy.", tag: "Creator", tagColor: "#f59e0b", relevance: 78, icon: "👤" },
  ],
};

const SUGGESTIONS: Record<string, string[]> = {
  "": ["AI interface trends", "machine learning papers", "startup growth strategies", "vector database comparison", "product-led growth"],
  "AI": ["AI interface trends", "AI product design", "AI startup funding"],
  "machine": ["machine learning papers", "machine learning jobs", "machine perception research"],
  "startup": ["startup growth strategies", "startup pitch decks", "startup valuation methods"],
};

const TAB_COLORS: Record<Tab, string> = {
  All: "#818cf8",
  Content: "#60a5fa",
  People: "#f59e0b",
  Knowledge: "#34d399",
  Data: "#e879f9",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function RelevanceBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-16 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #818cf8, #c084fc)" }}
        />
      </div>
      <span className="text-[10px] text-white/40">{score}%</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-white/5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-white/5" />
          <div className="h-3 w-1/3 rounded bg-white/5" />
          <div className="h-3 w-full rounded bg-white/5 mt-3" />
          <div className="h-3 w-5/6 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PullDiscoveryDemo() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [results, setResults] = useState<ResultCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTIONS[""]);
  const [aiSummary, setAiSummary] = useState("");
  const [summaryTyping, setSummaryTyping] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update suggestions as user types
  useEffect(() => {
    const prefix = Object.keys(SUGGESTIONS).find(k => k && query.toLowerCase().startsWith(k.toLowerCase()));
    setSuggestions(prefix ? SUGGESTIONS[prefix] : SUGGESTIONS[""]);
  }, [query]);

  // Simulate search
  async function runSearch(q: string) {
    if (!q.trim()) return;
    setQuery(q);
    setShowSuggestions(false);
    setLoading(true);
    setSearched(true);
    setResults([]);
    setAiSummary("");
    setActiveTab("All");
    setExpandedCard(null);

    await new Promise(r => setTimeout(r, 900));
    const key = Object.keys(RESULTS_DB).find(k => q.toLowerCase().includes(k.split(" ")[0].toLowerCase())) ?? Object.keys(RESULTS_DB)[0];
    const data = RESULTS_DB[key] ?? RESULTS_DB["AI interface trends"];
    setResults(data);
    setLoading(false);

    // Type AI summary
    const summaries: Record<string, string> = {
      "AI interface trends": "Across 8 sources, a clear consensus emerges: the next frontier of AI interfaces is ambient — systems that surface relevant information before users articulate the query. Pull Discovery is precisely positioned at this inflection. Semantic retrieval is now production-ready (94% relevance boost over keyword search), and enterprise demand is growing at 18.4% CAGR.",
      "machine learning papers": "6 high-signal sources spanning foundational theory to production ML. The transformer paper remains the bedrock; LoRA has become the standard fine-tuning method. LeCun's JEPA critique represents the most credible dissent on LLM ceilings.",
      "startup growth strategies": "6 curated sources reveal a common thread: the best growth strategies are counterintuitive. PLG, building in public, and obsessive early manual effort compound into defensible distribution moats. SaaS survival data points to NDR > 110% as the critical threshold.",
    };
    const sumKey = Object.keys(summaries).find(k => q.toLowerCase().includes(k.split(" ")[0].toLowerCase())) ?? "AI interface trends";
    const fullSummary = summaries[sumKey];

    setSummaryTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setAiSummary(fullSummary.slice(0, i * 4));
      if (i * 4 >= fullSummary.length) {
        setAiSummary(fullSummary);
        setSummaryTyping(false);
        clearInterval(interval);
      }
    }, 18);
  }

  const visibleResults = activeTab === "All" ? results : results.filter(r => r.tab === activeTab);
  const tabs: Tab[] = ["All", "Content", "People", "Knowledge", "Data"];
  const tabCounts: Record<Tab, number> = {
    All: results.length,
    Content: results.filter(r => r.tab === "Content").length,
    People: results.filter(r => r.tab === "People").length,
    Knowledge: results.filter(r => r.tab === "Knowledge").length,
    Data: results.filter(r => r.tab === "Data").length,
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] h-[600px] w-[600px] rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[10%] h-[500px] w-[500px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #c084fc, transparent 70%)" }} />
        <div className="absolute top-[40%] right-[30%] h-[300px] w-[300px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #34d399, transparent 70%)" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, #818cf8, #c084fc)" }}>
              <span className="text-sm font-bold">P</span>
            </div>
            <span className="text-base font-semibold tracking-tight">Pull Discovery</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/40">Demo by Anthony</span>
          </div>
          <nav className="hidden gap-6 text-sm text-white/40 sm:flex">
            <span className="cursor-pointer hover:text-white/70 transition-colors">Explore</span>
            <span className="cursor-pointer hover:text-white/70 transition-colors">Collections</span>
            <span className="cursor-pointer hover:text-white/70 transition-colors text-white/70">Search</span>
          </nav>
          <a
            href="https://portfolio-production-6e88.up.railway.app"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 transition-colors"
          >
            ← Portfolio
          </a>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-10">
        {/* Hero + Search */}
        <motion.div
          animate={{ y: searched ? -10 : 0 }}
          transition={{ duration: 0.5 }}
          className={searched ? "mb-8" : "mb-16 text-center"}
        >
          {!searched && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                AI-native discovery — content, people, knowledge, data
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl" style={{ background: "linear-gradient(135deg, #fff 40%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Discover what you<br />didn't know to search for
              </h1>
              <p className="mx-auto mb-8 max-w-xl text-base text-white/40">
                Pull Discovery is the missing layer between you and information — unifying content, experts, knowledge, and data through a single intelligent interface.
              </p>
            </motion.div>
          )}

          {/* Search bar */}
          <div className="relative mx-auto max-w-2xl">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-white/30">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={e => { if (e.key === "Enter") runSearch(query); }}
                placeholder="What would you like to discover today?"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-4 pl-11 pr-28 text-sm text-white placeholder-white/25 outline-none backdrop-blur-sm transition-all focus:border-indigo-500/50 focus:bg-white/[0.08]"
                style={{ boxShadow: "0 0 0 1px rgba(129,140,248,0.0)" }}
              />
              <button
                onClick={() => runSearch(query)}
                className="absolute right-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #818cf8, #c084fc)" }}
              >
                Discover
              </button>
            </div>

            {/* Suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f1a]/95 backdrop-blur-xl"
                >
                  <div className="px-4 pt-3 pb-1 text-[10px] font-medium uppercase tracking-wider text-white/25">Suggested queries</div>
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={() => runSearch(s)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="shrink-0 text-white/20">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                      </svg>
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick suggestions when not searched */}
          {!searched && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-4 flex flex-wrap justify-center gap-2">
              {["AI interface trends", "machine learning papers", "startup growth strategies"].map(s => (
                <button key={s} onClick={() => runSearch(s)} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/50 transition-all hover:border-white/20 hover:text-white/80">
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Results section */}
        <AnimatePresence>
          {(loading || searched) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* AI Summary box */}
              {(aiSummary || loading) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.07] p-5"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-5 w-5 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #818cf8, #c084fc)" }}>
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" /></svg>
                    </div>
                    <span className="text-xs font-semibold text-indigo-300">AI Synthesis</span>
                    {summaryTyping && <span className="h-1 w-1 rounded-full bg-indigo-400 animate-pulse" />}
                  </div>
                  {loading && !aiSummary ? (
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-white/5 animate-pulse" />
                      <div className="h-3 w-4/5 rounded bg-white/5 animate-pulse" />
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-white/70">{aiSummary}{summaryTyping && <span className="ml-0.5 inline-block h-3.5 w-0.5 bg-indigo-400 animate-pulse align-middle" />}</p>
                  )}
                </motion.div>
              )}

              {/* Tab filter */}
              {!loading && results.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5 flex gap-2 overflow-x-auto pb-1">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all"
                      style={{
                        borderColor: activeTab === tab ? TAB_COLORS[tab] + "50" : "rgba(255,255,255,0.08)",
                        background: activeTab === tab ? TAB_COLORS[tab] + "15" : "transparent",
                        color: activeTab === tab ? TAB_COLORS[tab] : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {tab}
                      {tabCounts[tab] > 0 && (
                        <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ background: activeTab === tab ? TAB_COLORS[tab] + "25" : "rgba(255,255,255,0.06)" }}>
                          {tabCounts[tab]}
                        </span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Result cards */}
              <div className="space-y-3">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                  : visibleResults.map((card, i) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.07 }}
                      onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                      className="group cursor-pointer rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all hover:border-white/10 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-xl">
                          {card.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-white leading-snug">{card.title}</h3>
                            <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: card.tagColor + "20", color: card.tagColor }}>
                              {card.tag}
                            </span>
                          </div>
                          <p className="mb-2 text-xs text-white/35">{card.source}</p>
                          <p className="text-xs leading-relaxed text-white/55">{card.snippet}</p>

                          {/* Expanded AI note */}
                          <AnimatePresence>
                            {expandedCard === card.id && card.aiNote && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 overflow-hidden rounded-xl border border-indigo-500/20 bg-indigo-500/[0.07] p-3"
                              >
                                <p className="text-xs text-indigo-300/80 leading-relaxed">
                                  <span className="font-semibold text-indigo-300">AI Note: </span>{card.aiNote}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className="mt-3 flex items-center justify-between">
                            <RelevanceBar score={card.relevance} />
                            <span className="text-[10px] text-white/25 group-hover:text-white/40 transition-colors">
                              {expandedCard === card.id ? "Collapse ↑" : "AI context ↓"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                }
              </div>

              {/* Empty state */}
              {!loading && visibleResults.length === 0 && (
                <div className="py-12 text-center text-white/30 text-sm">No results in this category.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features strip (pre-search) */}
        {!searched && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: "📰", label: "Content", desc: "Articles, videos, newsletters" },
              { icon: "👤", label: "People", desc: "Experts, authors, researchers" },
              { icon: "🧠", label: "Knowledge", desc: "Frameworks, papers, guides" },
              { icon: "📊", label: "Data", desc: "Datasets, charts, benchmarks" },
            ].map(f => (
              <div key={f.label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <div className="mb-2 text-2xl">{f.icon}</div>
                <div className="text-sm font-semibold text-white/70">{f.label}</div>
                <div className="mt-1 text-xs text-white/30">{f.desc}</div>
              </div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer credit */}
      <div className="relative z-10 border-t border-white/5 py-4 text-center text-[11px] text-white/20">
        Demo built by{" "}
        <a href="https://portfolio-production-6e88.up.railway.app" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white/60 underline underline-offset-2">
          Anthony
        </a>{" "}
        · Proof-of-concept for the Pull Discovery Upwork project · Not affiliated with Pull Discovery
      </div>
    </div>
  );
}
