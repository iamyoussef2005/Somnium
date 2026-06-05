import Image from "next/image";
import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Constellations Directory — Somnium Subconscious Map",
  description: "Browse the full collection of symbolic themes and subconscious constellations logged by dreamers around the world.",
};

export default async function ThemesDirectory() {
  const themes = await db.theme.findMany({
    include: {
      dreams: true,
    },
  });

  // Sort by count of dreams descending
  const sortedThemes = [...themes].sort((a, b) => b.dreams.length - a.dreams.length);

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
            width={32}
            height={32}
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
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-4 text-center md:text-left mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight pb-2 bg-gradient-to-r from-cosmic-purple via-purple-300 to-cosmic-teal bg-clip-text text-transparent text-glow inline-block">
            Subconscious Constellations
          </h1>
          <p className="text-sm text-zinc-400 font-light max-w-xl leading-relaxed">
            Browse the active symbolic coordinates mapped by user submissions. Each theme forms a glowing junction in our collective map.
          </p>
        </div>

        {sortedThemes.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950/20 border border-white/5 rounded-2xl p-8">
            <p className="text-sm text-zinc-500 italic">No dream themes are mapped in the database yet. Log a dream to generate the first coordinate!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedThemes.map((theme) => (
              <Link
                key={theme.id}
                href={`/themes/${theme.slug}`}
                className="bg-zinc-950/30 border border-white/5 hover:border-cosmic-teal/30 hover:bg-zinc-950/50 rounded-2xl p-6 backdrop-blur-sm transition-all duration-500 space-y-4 group relative flex flex-col justify-between"
              >
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-white group-hover:text-cosmic-teal transition-colors duration-300 text-lg line-clamp-1">
                      {theme.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-cosmic-teal/80 bg-cosmic-teal/10 px-2 py-0.5 rounded-full border border-cosmic-teal/20 shrink-0">
                      {theme.dreams.length} dream{theme.dreams.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-3 font-light leading-relaxed">
                    {theme.description || "A symbol mapped in the subconscious graph."}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 text-[10px] font-semibold text-cosmic-purple group-hover:text-cosmic-teal transition-colors duration-300 mt-4 pt-2 border-t border-white/[0.02]">
                  <span>Explore Constellation</span>
                  <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
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
