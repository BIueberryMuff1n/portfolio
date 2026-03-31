"use client";

import { useEffect } from "react";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anthony Carl",
  jobTitle: "AI Orchestrator & Systems Architect",
  url: "https://portfolio-production-6e88.up.railway.app",
  email: "hello@anthonycarl.com",
  sameAs: [
    "https://github.com/BIueberryMuff1n",
    "https://linkedin.com/in/anthonyc",
  ],
  knowsAbout: [
    "AI Orchestration",
    "Multi-Agent Systems",
    "Pipeline Design",
    "Next.js",
    "TypeScript",
    "Google Cloud Platform",
    "Azure",
  ],
};

export function JsonLd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
