"use client";

import React, { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import DreamForm from "@/components/DreamForm";

const ConstellationCanvas = dynamic(
  () => import("@/components/ConstellationCanvas"),
  { ssr: false }
);

export default function Home() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#09090b] text-[#f4f4f5] overflow-hidden bg-grid-pattern selection:bg-cosmic-purple/30 selection:text-cosmic-teal">
      
      {/* Ambient Nebula Background */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cosmic-purple/10 mix-blend-screen filter blur-[80px] pointer-events-none animate-nebula-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cosmic-teal/5 mix-blend-screen filter blur-[100px] pointer-events-none animate-nebula-slow" style={{ animationDelay: "-10s" }} />

      {/* Navigation Header */}
      <header className="relative w-full z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.03]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cosmic-purple to-cosmic-teal flex items-center justify-center p-[1px]">
            <div className="w-full h-full rounded-full bg-[#09090b] flex items-center justify-center">
              <span className="text-xs font-semibold text-cosmic-teal">S</span>
            </div>
          </div>
          <span className="font-semibold text-lg tracking-wider text-white">
            SOMNIUM
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-medium">
          <button 
            onClick={() => scrollTo(mapRef)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Subconscious Map
          </button>
          <button 
            onClick={() => scrollTo(formRef)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Dream Log
          </button>
          <Link href="/themes" className="hover:text-white transition-colors">
            Constellations
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
        </nav>
        <div>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button 
                className="px-4 py-2 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.08] hover:border-cosmic-purple/50 hover:bg-cosmic-purple/10 text-zinc-200 transition-all duration-300 cursor-pointer"
              >
                Connect Consciousness
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <div className="flex items-center gap-4">
              <UserButton />
            </div>
          </Show>
        </div>
      </header>

      {/* Main Dashboard Layout Container */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center py-12 text-center">
        {/* Hero Copy */}
        <div className="max-w-3xl mx-auto mb-10 space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight pb-1">
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">Map Your </span>
            <span className="bg-gradient-to-r from-cosmic-purple via-purple-400 to-cosmic-teal bg-clip-text text-transparent text-glow">
              Somnium
            </span>
          </h1>
          <p className="text-base md:text-lg text-zinc-400 font-light max-w-xl mx-auto tracking-wide">
            The Collective Subconscious Map.
          </p>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left">
          {/* Interactive Constellation Canvas Map (2/3 width) */}
          <div ref={mapRef} className="lg:col-span-2 w-full aspect-[16/9] rounded-2xl bg-zinc-950/40 border-glow overflow-hidden relative p-1 group">
            <ConstellationCanvas />
          </div>

          {/* Dream Submission Form / SignIn (1/3 width) */}
          <div ref={formRef} className="w-full flex justify-center">
            <Show when="signed-in">
              <DreamForm />
            </Show>
            <Show when="signed-out">
              <div className="w-full rounded-2xl bg-zinc-950/45 border border-white/[0.05] p-8 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-12 h-12 rounded-full bg-cosmic-purple/15 border border-cosmic-purple/30 flex items-center justify-center">
                  <span className="text-cosmic-purple text-lg">✦</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white tracking-wide">Sync Consciousness</h3>
                  <p className="text-xs text-zinc-400 max-w-[260px] mx-auto leading-relaxed">
                    To log your dreams and map them onto the collective constellation grid, establish a secure neural synchronization link.
                  </p>
                </div>
                <SignInButton mode="modal">
                  <button className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white px-6 py-3 rounded-xl border-glow text-sm font-medium hover:opacity-90 transition-all cursor-pointer">
                    Sync Consciousness
                  </button>
                </SignInButton>
              </div>
            </Show>
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
