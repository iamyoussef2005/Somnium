"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
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
  const [activeHighlight, setActiveHighlight] = useState<"map" | "form" | null>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, section: "map" | "form") => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setActiveHighlight(section);
    setTimeout(() => {
      setActiveHighlight(null);
    }, 1800);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#09090b] text-[#f4f4f5] overflow-hidden bg-grid-pattern selection:bg-cosmic-purple/30 selection:text-cosmic-teal">
      
      {/* Ambient Nebula Background */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cosmic-purple/10 mix-blend-screen filter blur-[80px] pointer-events-none animate-nebula-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cosmic-teal/5 mix-blend-screen filter blur-[100px] pointer-events-none animate-nebula-slow" style={{ animationDelay: "-10s" }} />
      {/* Third nebula blob — center-right, fuchsia/pink tint */}
      <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-fuchsia-500/5 mix-blend-screen filter blur-[90px] pointer-events-none animate-nebula-slow" style={{ animationDelay: "-15s" }} />

      {/* Navigation Header — Floating glass effect */}
      <header className="sticky top-0 w-full z-30 backdrop-blur-md bg-black/20 border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
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
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-medium">
            <button 
              onClick={() => scrollTo(mapRef, "map")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Subconscious Map
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
        </div>
        {/* Subtle bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmic-purple/30 to-transparent" />
      </header>

      {/* Main Dashboard Layout Container */}
      <main className="section-fade relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center py-12 text-center">
        {/* Hero Copy */}
        <div className="section-fade max-w-3xl mx-auto mb-10 space-y-4 relative">
          {/* Decorative floating particles */}
          <div className="absolute -top-8 left-12 w-1.5 h-1.5 rounded-full bg-cosmic-purple/60 animate-float-particle" />
          <div className="absolute top-4 -right-6 w-1 h-1 rounded-full bg-cosmic-teal/50 animate-float-particle" style={{ animationDelay: "-2s" }} />
          <div className="absolute bottom-8 -left-4 w-2 h-2 rounded-full bg-fuchsia-400/40 animate-float-particle" style={{ animationDelay: "-4s" }} />
          <div className="absolute -bottom-2 right-16 w-1 h-1 rounded-full bg-cosmic-purple/40 animate-float-particle" style={{ animationDelay: "-6s" }} />

          {/* Badge above headline */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-cosmic-teal/80">
              ✦ The Collective Dream Network
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight pb-1">
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">Map Your </span>
            <span className="bg-gradient-to-r from-cosmic-purple via-purple-400 to-cosmic-teal bg-clip-text text-transparent text-glow">
              Somnium
            </span>
          </h1>
          <p className="text-base md:text-lg text-zinc-400 font-light max-w-xl mx-auto tracking-wide">
            Explore the hidden threads that connect every dreaming mind.
          </p>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="section-fade-delay w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left">
          {/* Interactive Constellation Canvas Map (2/3 width) */}
          <div 
            ref={mapRef} 
            className={`lg:col-span-2 w-full aspect-[16/9] rounded-2xl bg-zinc-950/40 border-glow overflow-hidden relative p-1 group transition-all duration-700 ${
              activeHighlight === "map"
                ? "ring-2 ring-cosmic-teal/60 shadow-[0_0_40px_rgba(0,242,254,0.3)] scale-[1.006]"
                : ""
            }`}
          >
            {/* Live badge overlay */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/[0.08] text-[10px] font-semibold tracking-widest uppercase text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Live Constellation Map
            </div>
            <ConstellationCanvas />
          </div>

          {/* Dream Submission Form / SignIn (1/3 width) */}
          <div 
            ref={formRef} 
            className={`w-full flex justify-center transition-all duration-700 ${
              activeHighlight === "form"
                ? "ring-2 ring-cosmic-purple/60 shadow-[0_0_40px_rgba(139,92,246,0.3)] scale-[1.015] rounded-2xl"
                : ""
            }`}
          >
            <Show when="signed-in">
              <DreamForm />
            </Show>
            <Show when="signed-out">
              <div className="w-full rounded-2xl bg-zinc-950/60 backdrop-blur-sm animated-gradient-border p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-[0_0_40px_rgba(139,92,246,0.06)]">
                {/* Larger decorative icon */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cosmic-purple/20 to-cosmic-teal/10 border border-cosmic-purple/30 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                  <span className="text-cosmic-purple text-2xl">✦</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white tracking-wide">Sync Consciousness</h3>
                  <p className="text-xs text-zinc-400 max-w-[260px] mx-auto leading-relaxed">
                    To log your dreams and map them onto the collective constellation grid, establish a secure neural synchronization link.
                  </p>
                </div>
                <SignInButton mode="modal">
                  <button className="w-full relative overflow-hidden bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white px-6 py-3 rounded-xl border-glow text-sm font-medium hover:opacity-90 transition-all cursor-pointer group/btn">
                    {/* Shimmer overlay */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%] pointer-events-none" />
                    <span className="relative">Sync Consciousness</span>
                  </button>
                </SignInButton>
                {/* Decorative subtext */}
                <p className="text-[10px] text-zinc-600 tracking-wide">
                  Join 0 dreamers mapping the subconscious
                </p>
              </div>
            </Show>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full z-10">
        {/* Decorative gradient line above footer */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-cosmic-purple/40 via-transparent to-cosmic-teal/40" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Somnium"
              width={16}
              height={16}
              className="rounded-full object-cover opacity-40"
            />
            <span>&copy; {new Date().getFullYear()} Somnium Project. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
            <Link href="/api-docs" className="hover:text-zinc-400 transition-colors">API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
