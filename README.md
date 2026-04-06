---
module: portfolio
tier: 2
last_verified: 2026-04-06
verified_by: anthony
doc_score: 22
status: active
---

# Anthony Carl — AI Orchestrator Portfolio

> **Owner**: Anthony Carl
> **Last Verified**: 2026-04-06
> **Status**: Active

A personal portfolio site that positions Anthony as an **AI Orchestrator & Systems Architect**. It showcases real automation work through interactive demos, client case studies, and programmatic SEO artifacts (JSON-LD, dynamic OG images). The site is designed to convert — visitors can operate live demos before reaching out.

## Architecture

Next.js 14 App Router site with six interactive demo applications, three case study pages, one API route (Replicate image generation), and a suite of SEO primitives (structured data, dynamic OG image, per-route metadata). Deployed on Railway via Nixpacks.

## Directory Structure

```
.
├── app/
│   ├── layout.tsx                  # Root layout — fonts, global metadata, JSON-LD injection
│   ├── page.tsx                    # Home page — assembles all marketing sections
│   ├── opengraph-image.tsx         # Edge-rendered OG image (1200×630) served at /opengraph-image
│   ├── json-ld.tsx                 # Schema.org Person structured data (client-side injection)
│   ├── globals.css                 # Tailwind base + custom keyframe animations
│   ├── api/
│   │   └── generate-image/
│   │       └── route.ts            # POST — proxies prompt → Replicate Flux API → imageUrl
│   ├── demos/
│   │   ├── page.tsx                # Demo index — card grid linking all demos
│   │   ├── layout.tsx              # Demo section layout
│   │   ├── budget-tracker/         # Campaign spend pacing dashboard
│   │   ├── creative-matrix/        # 4-agent marketing campaign pipeline
│   │   ├── ppc-auditor/            # 92-checkpoint Google Ads health audit
│   │   ├── proofing-tool/          # Gemini Vision PDF merchant validation
│   │   └── upwork/
│   │       ├── ad-engine/          # Flux AI ad copy + image generator
│   │       └── construction-estimator/ # Australian construction cost calculator
│   └── case-studies/
│       ├── page.tsx                # Case study index
│       ├── atlas-platform/         # 21-tool unified automation platform
│       ├── agency-transformation/  # 3-phase org AI integration
│       └── media-operations/       # Real-time campaign pipeline automation
├── components/
│   ├── Navigation.tsx              # Header with scroll-aware styling
│   ├── Hero.tsx                    # Landing hero with tagline and CTA
│   ├── About.tsx                   # Background narrative section
│   ├── Experience.tsx              # Work history timeline
│   ├── Skills.tsx                  # Skills grid
│   ├── TerminalBlock.tsx           # Animated syntax-styled terminal block
│   ├── Demos.tsx                   # Demo card grid (home page section)
│   ├── CaseStudies.tsx             # Case study card grid (home page section)
│   ├── CaseStudyLayout.tsx         # Reusable case study page wrapper
│   ├── Contact.tsx                 # Contact CTA section
│   └── TutorialOverlay.tsx         # Interactive spotlight tour engine
├── next.config.mjs                 # Minimal Next.js config
├── tailwind.config.ts              # Theme tokens, custom animations
├── railway.json                    # Railway deployment config (Nixpacks + npm start)
├── tsconfig.json                   # TypeScript config
└── package.json                    # Scripts and dependencies
```

## Demo Pages

Each demo is a standalone interactive application — no backend database, all state is local to the session.

| Route | What It Does |
|:------|:-------------|
| `/demos/creative-matrix` | Simulates a 4-agent campaign strategy pipeline (Strategist → Creative → Media → QA). Generates audience segments, platform-specific ad copy, channel allocation, and brand compliance scores for two preset campaigns. |
| `/demos/budget-tracker` | Campaign spend pacing dashboard. Shows 10 sample campaigns across Google/Meta/TikTok/LinkedIn with 14-day trend charts (Recharts), pacing status, and platform-level rollup. |
| `/demos/ppc-auditor` | Runs a simulated 92-checkpoint Google Ads account audit across 10 categories (account structure, bidding, keywords, ad copy, quality score, landing pages, audiences, budget, conversion tracking, competitive). Returns a grade, critical issues, and per-category breakdown. |
| `/demos/proofing-tool` | Demonstrates Gemini Vision + fuzzy matching for PDF mailer validation. Matches merchant logos across pages with confidence scores, flagging missing, unexpected, or low-quality logos. |
| `/demos/upwork/ad-engine` | Generates 12 platform-specific ad variations per campaign brief, then calls `/api/generate-image` to render photorealistic product images via Replicate Flux. Requires `REPLICATE_API_TOKEN`. |
| `/demos/upwork/construction-estimator` | Estimates Australian construction costs. Accepts project type, location (5 cities), quality tier, and floor area. Returns a cost breakdown across 8 categories with regional intelligence. |

## Case Study Pages

| Route | Summary |
|:------|:--------|
| `/case-studies/atlas-platform` | 21-tool unified AI orchestration platform. $300K+/month cost reduction. Covers 4 AI agents, taxonomy enforcement, Gemini Vision proofing, and a self-service tooling layer. |
| `/case-studies/media-operations` | Replaced a 3-day manual campaign launch workflow with a real-time autonomous pipeline. 92 automated checks, $30M+ budget oversight. |
| `/case-studies/agency-transformation` | 3-phase change management: Core Ops (Month 1–2) → AI Modules (Month 3–5) → Culture Shift (Month 6+). Tracks module adoption rates across 8 production tools. |

## Key Concepts

**AI Orchestrator** — The positioning term used throughout. Means the author designs and maintains multi-agent systems where AI models handle deterministic work while humans own judgment calls.

**Tutorial Overlay** — A `TutorialOverlay` component that wraps demo pages with a spotlight-driven step-by-step tour. Uses DOM element IDs as anchor targets, CSS box-shadow for the spotlight effect, and Framer Motion for transitions.

**Upwork demos** — The `/demos/upwork/` namespace contains demos built specifically for client proposals. They are publicly accessible but scoped separately from the main demo suite.

**Programmatic OG image** — `app/opengraph-image.tsx` renders a 1200×630 branded card at the Edge, using Next.js `ImageResponse`. It is auto-discovered by Next.js as the root OG image — no explicit metadata reference needed.

## Environment Variables

| Variable | Required | Description |
|:---------|:--------:|:------------|
| `REPLICATE_API_TOKEN` | Yes (for Ad Engine demo) | API key for Replicate. Used by `/api/generate-image` to call the `black-forest-labs/flux-schnell` model. Obtain from [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens). |

All other demo functionality is purely local — no API keys required to run or build the site.

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev
```

To enable the Ad Engine image generation demo, create a `.env.local` file:

```bash
REPLICATE_API_TOKEN=your_token_here
```

The remaining 5 demos work without any environment variables.

## Deploying to Railway

The project includes a `railway.json` that configures Nixpacks (auto-detects Node.js) with `npm start` as the start command and automatic restarts on failure.

```bash
# One-time: link repo to Railway project in the Railway dashboard
# Set REPLICATE_API_TOKEN in Railway → Variables

# Deploys automatically on push to main
git push origin main
```

Railway's Nixpacks builder runs `npm run build` then `npm start`. No Dockerfile needed.

## API Endpoints

### `POST /api/generate-image`

Proxies a text prompt to the Replicate Flux Schnell model and returns a generated image URL.

**Request body:**
```json
{ "prompt": "A luxury wristwatch on a marble surface, natural lighting" }
```

**Response (200):**
```json
{ "imageUrl": "https://replicate.delivery/..." }
```

**Error responses:**
- `503` — `REPLICATE_API_TOKEN` not configured
- `500` — Replicate API failure or 55-second generation timeout

## Related Modules

- `components/TutorialOverlay.tsx` — Spotlight tour engine used in demo pages
- `components/CaseStudyLayout.tsx` — Shared layout wrapper for all case study pages
- `app/opengraph-image.tsx` — Edge-rendered social card
