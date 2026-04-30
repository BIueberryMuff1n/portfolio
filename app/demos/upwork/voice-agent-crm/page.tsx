"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type RunState = "idle" | "running" | "done";

interface LogEntry {
  time: string;
  node: string;
  message: string;
  type: "info" | "success" | "warn" | "data";
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  business: string;
  intent: "high" | "medium" | "low";
  callDuration: string;
  booked: boolean;
  followUp: string;
  addedAt: string;
}

// ─── Scenario data ────────────────────────────────────────────────────────────
const SCENARIOS = [
  { id: "hvac", label: "🔧 HVAC Company", industry: "HVAC" },
  { id: "dental", label: "🦷 Dental Office", industry: "Dental" },
  { id: "roofing", label: "🏠 Roofing Contractor", industry: "Roofing" },
];

const LEADS_BY_SCENARIO: Record<string, Lead[]> = {
  hvac: [
    { id: "L1", name: "Marcus Webb", phone: "(214) 555-0182", business: "Webb Properties", intent: "high", callDuration: "3m 42s", booked: true, followUp: "Apr 8, 10am", addedAt: "2 min ago" },
    { id: "L2", name: "Sandra Liu", phone: "(972) 555-0034", business: "Liu Rentals", intent: "medium", callDuration: "1m 58s", booked: false, followUp: "Apr 9, SMS", addedAt: "18 min ago" },
    { id: "L3", name: "Derek Nash", phone: "(469) 555-0291", business: "Nash HVAC LLC", intent: "high", callDuration: "4m 15s", booked: true, followUp: "Apr 7, 2pm", addedAt: "1h ago" },
  ],
  dental: [
    { id: "L1", name: "Priya Anand", phone: "(512) 555-0119", business: "Anand Family", intent: "high", callDuration: "2m 30s", booked: true, followUp: "Apr 8, 9am", addedAt: "5 min ago" },
    { id: "L2", name: "Tom Caruso", phone: "(737) 555-0047", business: "Individual", intent: "low", callDuration: "0m 58s", booked: false, followUp: "Apr 12, SMS", addedAt: "32 min ago" },
  ],
  roofing: [
    { id: "L1", name: "Beth Ortega", phone: "(817) 555-0203", business: "Ortega Homes", intent: "high", callDuration: "5m 01s", booked: true, followUp: "Apr 7, 11am", addedAt: "8 min ago" },
    { id: "L2", name: "James Thornton", phone: "(682) 555-0167", business: "Thornton Realty", intent: "medium", callDuration: "2m 44s", booked: false, followUp: "Apr 10, Email", addedAt: "45 min ago" },
    { id: "L3", name: "Carol Pike", phone: "(817) 555-0388", business: "Pike & Sons", intent: "high", callDuration: "3m 22s", booked: true, followUp: "Apr 8, 3pm", addedAt: "2h ago" },
  ],
};

const LOG_SCRIPTS: Record<string, LogEntry[][]> = {
  hvac: [
    [
      { time: "00:00", node: "Retell AI", message: "Inbound call received → +1(214)555-0182", type: "info" },
      { time: "00:01", node: "Retell AI", message: "Voice agent answered: 'Thank you for calling Webb HVAC…'", type: "info" },
    ],
    [
      { time: "00:04", node: "Retell AI", message: "Intent classified: appointment booking (confidence: 0.94)", type: "success" },
      { time: "00:04", node: "n8n", message: "Webhook triggered → workflow: inbound-lead-hvac", type: "info" },
    ],
    [
      { time: "00:05", node: "n8n → GHL", message: "Contact lookup: marcus.webb@email.com — not found", type: "warn" },
      { time: "00:05", node: "n8n → GHL", message: "Creating new contact: Marcus Webb / Webb Properties", type: "data" },
    ],
    [
      { time: "00:06", node: "n8n → Calendly", message: "Checking availability: Apr 8, 9am–11am", type: "info" },
      { time: "00:06", node: "n8n → Calendly", message: "Slot confirmed: Apr 8 @ 10:00am", type: "success" },
    ],
    [
      { time: "00:07", node: "Retell AI", message: "Reading booking confirmation to caller…", type: "info" },
      { time: "00:07", node: "n8n → GHL", message: "Appointment booked in CRM pipeline: 'New Estimates'", type: "success" },
    ],
    [
      { time: "00:08", node: "n8n → Twilio", message: "SMS sent to +1(214)555-0182: 'Hi Marcus — confirmed for Apr 8…'", type: "success" },
      { time: "00:08", node: "n8n → GHL", message: "Follow-up sequence started: 3-touch pre-appointment", type: "data" },
    ],
    [
      { time: "EOD", node: "n8n", message: "Daily report compiled: 3 calls · 2 booked · 1 follow-up", type: "info" },
      { time: "EOD", node: "n8n → Email", message: "Report delivered to ops@company.com", type: "success" },
    ],
  ],
  dental: [
    [
      { time: "00:00", node: "Retell AI", message: "Inbound call received → +1(512)555-0119", type: "info" },
      { time: "00:01", node: "Retell AI", message: "Agent: 'Thank you for calling Smile Dental…'", type: "info" },
    ],
    [
      { time: "00:03", node: "Retell AI", message: "Intent: new patient appointment (confidence: 0.91)", type: "success" },
      { time: "00:03", node: "n8n", message: "Webhook triggered → workflow: dental-new-patient", type: "info" },
    ],
    [
      { time: "00:04", node: "n8n → GHL", message: "Creating contact: Priya Anand — new patient", type: "data" },
      { time: "00:05", node: "n8n → Calendly", message: "Slot confirmed: Apr 8 @ 9:00am", type: "success" },
    ],
    [
      { time: "00:06", node: "Retell AI", message: "Appointment confirmed on call", type: "success" },
      { time: "00:06", node: "n8n → GHL", message: "Pipeline updated: Scheduled → New Patient", type: "data" },
    ],
    [
      { time: "00:07", node: "n8n → Twilio", message: "Confirmation SMS sent to Priya", type: "success" },
      { time: "00:07", node: "n8n → Email", message: "New patient intake form sent", type: "data" },
    ],
    [
      { time: "EOD", node: "n8n", message: "Daily summary: 2 calls · 1 booked · 1 cold", type: "info" },
      { time: "EOD", node: "n8n → Email", message: "Report sent to office@smileDental.com", type: "success" },
    ],
  ],
  roofing: [
    [
      { time: "00:00", node: "Retell AI", message: "Inbound call: +1(817)555-0203 — storm damage inquiry", type: "info" },
      { time: "00:01", node: "Retell AI", message: "Agent qualified: homeowner, confirmed roof damage", type: "info" },
    ],
    [
      { time: "00:03", node: "Retell AI", message: "Intent: estimate request (confidence: 0.97)", type: "success" },
      { time: "00:03", node: "n8n", message: "Webhook triggered → workflow: roofing-estimate", type: "info" },
    ],
    [
      { time: "00:04", node: "n8n → GHL", message: "New contact: Beth Ortega / Ortega Homes", type: "data" },
      { time: "00:05", node: "n8n → Calendly", message: "On-site estimate: Apr 7 @ 11:00am", type: "success" },
    ],
    [
      { time: "00:06", node: "Retell AI", message: "Booking confirmed on call", type: "success" },
      { time: "00:06", node: "n8n → GHL", message: "Tag added: storm-damage, priority-lead", type: "data" },
    ],
    [
      { time: "00:07", node: "n8n → Twilio", message: "Confirmation + pre-visit SMS sent", type: "success" },
      { time: "00:07", node: "n8n → GHL", message: "Pipeline: New → Estimate Scheduled", type: "data" },
    ],
    [
      { time: "EOD", node: "n8n", message: "Storm week summary: 3 calls · 2 booked · 1 follow-up", type: "info" },
      { time: "EOD", node: "n8n → Email", message: "Report + transcript digest delivered", type: "success" },
    ],
  ],
};

const TYPE_COLOR: Record<string, string> = {
  info: "#94a3b8",
  success: "#10b981",
  warn: "#eab308",
  data: "#8b5cf6",
};

const INTENT_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  high: { bg: "rgba(16,185,129,0.12)", color: "#10b981", border: "rgba(16,185,129,0.25)" },
  medium: { bg: "rgba(234,179,8,0.12)", color: "#eab308", border: "rgba(234,179,8,0.25)" },
  low: { bg: "rgba(100,116,139,0.12)", color: "#64748b", border: "rgba(100,116,139,0.25)" },
};

const WORKFLOW_NODES = [
  { id: "call", label: "Inbound Call", sub: "Retell AI", color: "#8b5cf6", icon: "📞" },
  { id: "qualify", label: "Qualify Intent", sub: "Voice Agent", color: "#8b5cf6", icon: "🧠" },
  { id: "n8n", label: "Trigger Workflow", sub: "n8n Webhook", color: "#f97316", icon: "⚡" },
  { id: "crm", label: "Update CRM", sub: "GoHighLevel", color: "#3b82f6", icon: "📋" },
  { id: "cal", label: "Book Appointment", sub: "Calendly", color: "#22d3ee", icon: "📅" },
  { id: "sms", label: "Send Confirmation", sub: "Twilio SMS", color: "#10b981", icon: "✉️" },
  { id: "report", label: "Daily Report", sub: "n8n → Email", color: "#10b981", icon: "📊" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function VoiceAgentCRMDemo() {
  const [scenario, setScenario] = useState("hvac");
  const [runState, setRunState] = useState<RunState>("idle");
  const [activeNode, setActiveNode] = useState(-1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [tab, setTab] = useState<"workflow" | "crm" | "report">("workflow");
  const logRef = useRef<HTMLDivElement>(null);

  const leads = LEADS_BY_SCENARIO[scenario];
  const logScript = LOG_SCRIPTS[scenario];

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const runSimulation = () => {
    if (runState === "running") return;
    setRunState("running");
    setActiveNode(0);
    setLogs([]);

    let step = 0;
    const advance = () => {
      if (step >= logScript.length) {
        setActiveNode(-1);
        setRunState("done");
        return;
      }
      setActiveNode(step);
      const batch = logScript[step];
      batch.forEach((entry, i) => {
        setTimeout(() => {
          setLogs((prev) => [...prev, entry]);
        }, i * 350);
      });
      step++;
      setTimeout(advance, 1400);
    };
    advance();
  };

  const reset = () => {
    setRunState("idle");
    setActiveNode(-1);
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans">
      {/* Ambient */}
      <div style={{ position: "fixed", top: "-10%", right: "-5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)", pointerEvents: "none" }} aria-hidden />
      <div style={{ position: "fixed", bottom: 0, left: "-5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)", pointerEvents: "none" }} aria-hidden />

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/demos" style={{ color: "#64748b", fontSize: 12, fontFamily: "monospace", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
            ← demos
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8b5cf6", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", padding: "0.25rem 0.75rem", borderRadius: 20 }}>
              AI Voice Agent · CRM Automation
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, margin: "0.5rem 0 0.5rem", lineHeight: 1.1 }}>
            Voice Agent{" "}
            <span style={{ background: "linear-gradient(90deg, #8b5cf6, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              → CRM Pipeline
            </span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15, maxWidth: 580 }}>
            Retell AI handles inbound calls → n8n orchestrates enrichment, booking & follow-up → GHL CRM + Twilio SMS, fully automated.
          </p>
        </div>

        {/* Scenario picker */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setScenario(s.id); reset(); }}
              style={{
                padding: "0.45rem 1.1rem", borderRadius: 8, border: "1px solid",
                borderColor: scenario === s.id ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)",
                background: scenario === s.id ? "rgba(139,92,246,0.1)" : "transparent",
                color: scenario === s.id ? "#8b5cf6" : "#64748b",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              {s.label}
            </button>
          ))}

          <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
            <button
              onClick={runState === "idle" || runState === "done" ? runSimulation : undefined}
              style={{
                padding: "0.5rem 1.25rem", borderRadius: 8, border: "none",
                background: runState === "running"
                  ? "rgba(139,92,246,0.2)"
                  : "linear-gradient(135deg, #8b5cf6, #22d3ee)",
                color: runState === "running" ? "#8b5cf6" : "#070709",
                fontWeight: 700, fontSize: 13, cursor: runState === "running" ? "not-allowed" : "pointer",
              }}
            >
              {runState === "idle" ? "▶ Simulate Call" : runState === "running" ? "⏳ Running…" : "✓ Done — Run Again"}
            </button>
            {runState === "done" && (
              <button onClick={reset} style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#64748b", fontSize: 13, cursor: "pointer" }}>
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Tab nav */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {(["workflow", "crm", "report"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "0.4rem 1rem", borderRadius: 8, border: "1px solid",
                borderColor: tab === t ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
                background: tab === t ? "rgba(255,255,255,0.06)" : "transparent",
                color: tab === t ? "#f1f5f9" : "#64748b",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              {t === "workflow" ? "⚡ Workflow" : t === "crm" ? "📋 CRM Leads" : "📊 Daily Report"}
            </button>
          ))}
        </div>

        {/* ── WORKFLOW TAB ── */}
        {tab === "workflow" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
            {/* Node flow */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "2rem 1.5rem" }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: "1.5rem", fontFamily: "monospace" }}>
                AUTOMATION WORKFLOW · {SCENARIOS.find(s => s.id === scenario)?.industry}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {WORKFLOW_NODES.map((node, i) => {
                  const isActive = activeNode === i;
                  const isDone = runState === "done" || activeNode > i;
                  return (
                    <div key={node.id}>
                      <div
                        style={{
                          display: "flex", alignItems: "center", gap: "1rem",
                          padding: "0.85rem 1.2rem", borderRadius: 12,
                          background: isActive ? `rgba(${hexToRgb(node.color)},0.12)` : isDone ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${isActive ? `rgba(${hexToRgb(node.color)},0.4)` : isDone ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)"}`,
                          transition: "all 0.3s ease",
                          transform: isActive ? "translateX(4px)" : "none",
                        }}
                      >
                        <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{node.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? node.color : isDone ? "#f1f5f9" : "#64748b" }}>
                            {node.label}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{node.sub}</div>
                        </div>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: isActive ? node.color : isDone ? "#10b981" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, transition: "all 0.3s" }}>
                          {isDone ? "✓" : isActive ? "●" : ""}
                        </div>
                      </div>
                      {i < WORKFLOW_NODES.length - 1 && (
                        <div style={{ width: 2, height: 12, background: isDone ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)", margin: "0 auto", transition: "all 0.3s" }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live log */}
            <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: runState === "running" ? "#10b981" : "#64748b", boxShadow: runState === "running" ? "0 0 6px #10b981" : "none" }} />
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>automation.log</span>
              </div>
              <div ref={logRef} style={{ flex: 1, overflowY: "auto", padding: "1rem", height: 420, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {logs.length === 0 && (
                  <div style={{ color: "#64748b", fontSize: 12, fontFamily: "monospace", marginTop: "1rem" }}>
                    {">"} Waiting for inbound call…
                  </div>
                )}
                {logs.map((log, i) => (
                  <div key={i} style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.5 }}>
                    <span style={{ color: "#475569" }}>[{log.time}] </span>
                    <span style={{ color: "#64748b" }}>{log.node} → </span>
                    <span style={{ color: TYPE_COLOR[log.type] }}>{log.message}</span>
                  </div>
                ))}
                {runState === "running" && (
                  <div style={{ color: "#64748b", fontSize: 11, fontFamily: "monospace" }}>
                    <span style={{ animation: "blink 1s step-end infinite" }}>_</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CRM TAB ── */}
        {tab === "crm" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
              {[
                { label: "Total Calls", value: leads.length, color: "#8b5cf6" },
                { label: "Appointments", value: leads.filter(l => l.booked).length, color: "#10b981" },
                { label: "High Intent", value: leads.filter(l => l.intent === "high").length, color: "#22d3ee" },
                { label: "Follow-ups", value: leads.filter(l => !l.booked).length, color: "#eab308" },
              ].map((s) => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.1rem" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Leads table */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14, fontWeight: 700 }}>
                GoHighLevel CRM · {SCENARIOS.find(s => s.id === scenario)?.industry} Pipeline
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    {["Contact", "Business", "Intent", "Call Duration", "Appointment", "Follow-up", "Added"].map(h => (
                      <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontSize: 11, color: "#64748b", fontFamily: "monospace", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{lead.name}</div>
                        <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{lead.phone}</div>
                      </td>
                      <td style={{ padding: "0.9rem 1rem", fontSize: 13, color: "#94a3b8" }}>{lead.business}</td>
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <span style={{
                          fontSize: 11, fontFamily: "monospace", fontWeight: 600,
                          padding: "0.2rem 0.65rem", borderRadius: 20, textTransform: "uppercase",
                          background: INTENT_STYLE[lead.intent].bg,
                          color: INTENT_STYLE[lead.intent].color,
                          border: `1px solid ${INTENT_STYLE[lead.intent].border}`,
                        }}>{lead.intent}</span>
                      </td>
                      <td style={{ padding: "0.9rem 1rem", fontSize: 12, fontFamily: "monospace", color: "#94a3b8" }}>{lead.callDuration}</td>
                      <td style={{ padding: "0.9rem 1rem" }}>
                        {lead.booked
                          ? <span style={{ fontSize: 12, color: "#10b981" }}>✓ Booked</span>
                          : <span style={{ fontSize: 12, color: "#64748b" }}>— Not booked</span>}
                      </td>
                      <td style={{ padding: "0.9rem 1rem", fontSize: 12, color: "#94a3b8" }}>{lead.followUp}</td>
                      <td style={{ padding: "0.9rem 1rem", fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{lead.addedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── REPORT TAB ── */}
        {tab === "report" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.75rem" }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b", marginBottom: "1rem" }}>END-OF-DAY REPORT · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}</div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: "1.5rem" }}>
                {SCENARIOS.find(s => s.id === scenario)?.industry} · Daily Summary
              </div>
              {[
                { label: "Total inbound calls", value: leads.length },
                { label: "Appointments booked", value: leads.filter(l => l.booked).length },
                { label: "Booking rate", value: `${Math.round(leads.filter(l => l.booked).length / leads.length * 100)}%` },
                { label: "High-intent leads", value: leads.filter(l => l.intent === "high").length },
                { label: "Follow-up sequences started", value: leads.filter(l => !l.booked).length },
                { label: "Avg call duration", value: "3m 02s" },
                { label: "CRM records created/updated", value: leads.length },
                { label: "SMS confirmations sent", value: leads.filter(l => l.booked).length },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{row.value}</span>
                </div>
              ))}
              <div style={{ marginTop: "1.25rem", padding: "0.75rem 1rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8, fontSize: 12, color: "#10b981" }}>
                ✓ Report delivered to ops@company.com via n8n at 6:00 PM
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem" }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: "1rem" }}>PIPELINE BREAKDOWN</div>
                {[
                  { label: "Estimate Scheduled", count: leads.filter(l => l.booked).length, color: "#10b981" },
                  { label: "Follow-Up Sequence", count: leads.filter(l => !l.booked && l.intent !== "low").length, color: "#eab308" },
                  { label: "Cold / Not Qualified", count: leads.filter(l => l.intent === "low").length, color: "#64748b" },
                ].map((p) => (
                  <div key={p.label} style={{ marginBottom: "0.9rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>{p.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.count}</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(p.count / leads.length) * 100}%`, background: p.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 16, padding: "1.5rem" }}>
                <div style={{ fontSize: 12, color: "#8b5cf6", fontFamily: "monospace", marginBottom: "1rem" }}>AUTOMATION HEALTH</div>
                {[
                  { label: "Retell AI uptime", value: "99.9%", ok: true },
                  { label: "n8n workflow executions", value: `${leads.length} / ${leads.length}`, ok: true },
                  { label: "GHL sync errors", value: "0", ok: true },
                  { label: "Twilio delivery rate", value: "100%", ok: true },
                  { label: "Calendly conflicts", value: "0", ok: true },
                ].map((h) => (
                  <div key={h.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{h.label}</span>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: h.ok ? "#10b981" : "#ef4444", fontWeight: 700 }}>{h.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "3rem", padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>Demo · Simulated workflows · Built by Anthony Carl</span>
          <Link href="https://portfolio-production-6e88.up.railway.app" style={{ fontSize: 11, fontFamily: "monospace", color: "#8b5cf6", textDecoration: "none" }}>
            portfolio-production-6e88.up.railway.app
          </Link>
        </div>
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
