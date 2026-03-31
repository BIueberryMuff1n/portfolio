import type { Metadata } from "next";
import { Syne, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

const BASE_URL = "https://portfolio-production-6e88.up.railway.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Anthony Carl — AI Orchestrator & Systems Architect",
    template: "%s — Anthony Carl",
  },
  description:
    "I build autonomous systems that compound in value. Creator of Atlas — a 21-tool AI platform saving $300K+/month at Mile Marker Agency. Available for AI systems architecture and multi-agent platform design.",
  openGraph: {
    title: "Anthony Carl — AI Orchestrator & Systems Architect",
    description:
      "I build autonomous systems that compound in value. Multi-agent pipelines. Self-improving loops. Systems that think.",
    type: "website",
    url: BASE_URL,
    siteName: "Anthony Carl Portfolio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Anthony Carl — AI Orchestrator & Systems Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anthony Carl — AI Orchestrator & Systems Architect",
    description:
      "I build autonomous systems that compound in value. Creator of Atlas — a 21-tool AI platform saving $300K+/month.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${ibmPlexSans.variable} ${jetbrainsMono.variable} antialiased bg-background text-text-primary`}
      >
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
