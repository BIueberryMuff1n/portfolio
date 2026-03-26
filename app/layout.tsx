import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Anthony Carl — Software Engineer & Innovation Strategist",
  description:
    "Software engineer who builds systems that change how organizations work. Creator of Atlas — a 21-tool internal platform saving $300K+/month.",
  openGraph: {
    title: "Anthony Carl — Software Engineer & Innovation Strategist",
    description:
      "Software engineer who builds systems that change how organizations work.",
    type: "website",
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
        className={`${inter.variable} ${plusJakarta.variable} antialiased bg-background text-text-primary`}
      >
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
