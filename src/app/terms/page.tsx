import Image from "next/image";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Somnium Subconscious Map",
  description: "Read the terms of service governing the usage of the Somnium dream-mapping network.",
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#09090b] text-[#f4f4f5] overflow-hidden bg-grid-pattern selection:bg-cosmic-purple/30 selection:text-cosmic-teal font-sans">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cosmic-purple/10 mix-blend-screen filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cosmic-teal/5 mix-blend-screen filter blur-[100px] pointer-events-none" />

      <header className="relative w-full z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.03]">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Somnium Logo"
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
          <span className="font-semibold text-lg tracking-wider text-white">
            SOMNIUM
          </span>
        </Link>
        <div>
          <Link
            href="/"
            className="px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/[0.08] hover:border-cosmic-teal/50 hover:bg-cosmic-teal/10 text-zinc-200 transition-all duration-300 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Map
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-6 py-12 text-left space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight pb-2 bg-gradient-to-r from-cosmic-purple to-cosmic-teal bg-clip-text text-transparent text-glow inline-block font-bold">
          Terms of Service
        </h1>
        <p className="text-sm text-zinc-400 font-light leading-relaxed">
          Welcome to Somnium, a collective charting project. By interacting with this interface, you agree to these lightweight terms of service.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Prohibited Inputs</h2>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Please do not submit highly identifying personal secrets, credentials, or third-party details. Somnium logs are anonymous, shared, and analyzed by automated LLMs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Open Usage</h2>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            The collective subconscious constellation network data is provided under public domain. Mapped connections and symbols may be shared, exported, and inspected for academic or creative purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Disclaimer</h2>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Somnium offers automatic symbol mapping using creative AI parameters. The generated theme descriptions and interpretations are poetic and objective symbols analysis; they are not intended to serve as medical, psychoanalytical, or therapeutic diagnostics.
          </p>
        </section>
      </main>

      <footer className="relative w-full z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 border-t border-white/[0.03] gap-4">
        <div>
          &copy; {new Date().getFullYear()} Somnium Project. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
          <Link href="/api-docs" className="hover:text-zinc-400 transition-colors">API</Link>
        </div>
      </footer>
    </div>
  );
}
