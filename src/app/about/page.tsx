import Image from "next/image";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "About Somnium — The Collective Subconscious Map",
  description: "Learn about the mission, architecture, and technology behind mapping the shared symbols and connections in human dreams.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#09090b] text-[#f4f4f5] overflow-hidden bg-grid-pattern selection:bg-cosmic-purple/30 selection:text-cosmic-teal font-sans">
      {/* Nebula Blurs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cosmic-purple/10 mix-blend-screen filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cosmic-teal/5 mix-blend-screen filter blur-[100px] pointer-events-none" />

      {/* Header */}
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

      {/* Main content */}
      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-12 text-left">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight pb-2 bg-gradient-to-r from-cosmic-purple via-purple-300 to-cosmic-teal bg-clip-text text-transparent text-glow inline-block font-bold">
            About Somnium
          </h1>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            Somnium is an open-source decentralized initiative to visualize and navigate the collective subconscious of humanity. By mapping the themes that recur in our sleep, we uncover the hidden threads that connect us all.
          </p>
        </div>

        {/* Narrative sections */}
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-wide">1. The Concept</h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Every night, billions of minds enter a state of vivid creative output, producing complex narratives composed of archetypes and symbols. Somnium aggregates these anonymous dream logs into a single relational graph database, displaying them as a stellar map where stars represent themes and connection lines indicate dreams that share those symbols.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-wide">2. AI-Driven Archetype Parsing</h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              When a user submits a dream log, it is parsed securely in real-time by a Google Gemini large language model. Gemini acts as an objective, symbolic cartographer. It analyzes the raw story, filters personal specifics, extracts up to 3 core underlying symbols, and returns a structured JSON interpretation explaining what each symbol historically represents within human dream archetypes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-wide">3. Dynamic Physics Networks</h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Our front-end constellation map utilizes a custom canvas particle simulation. As database records accumulate, nodes attract or repel one another based on shared connection metrics, clustering naturally into visual "galaxies" of meaning. This provides an organic, responsive interface that feels alive and encourages exploration.
            </p>
          </section>
        </div>

        {/* Technical specs card */}
        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-white/5 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-semibold tracking-wider text-cosmic-teal uppercase">Technical Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light text-zinc-400">
            <div>
              <span className="font-semibold text-zinc-300 block mb-1">Frontend Layer</span>
              Next.js (App Router), Tailwind CSS v4, HTML5 Canvas API
            </div>
            <div>
              <span className="font-semibold text-zinc-300 block mb-1">Data & Analytics</span>
              SQLite relational database, Prisma 7 Client ORM
            </div>
            <div>
              <span className="font-semibold text-zinc-300 block mb-1">Cognitive Pipeline</span>
              Google Gen AI SDK, Gemini 2.5 Flash
            </div>
            <div>
              <span className="font-semibold text-zinc-300 block mb-1">Hosting</span>
              Vercel Serverless Architecture
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
