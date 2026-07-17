import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ProposalPilot AI — Presales Copilot for Software Agencies",
  description:
    "An AI-powered presales assistant that transforms client requirements into professional proposals, scope documents, timelines, and service recommendations in minutes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body bg-ink-950 text-parchment-100 antialiased">
        {children}
      </body>
    </html>
  );
}
