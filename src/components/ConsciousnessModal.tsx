"use client";

import React, { useState } from "react";

interface ConsciousnessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConnectionMethod = "anonymous" | "dreamer" | "neurallink";

export default function ConsciousnessModal({ isOpen, onClose }: ConsciousnessModalProps) {
  const [method, setMethod] = useState<ConnectionMethod>("anonymous");
  const [dreamerName, setDreamerName] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  if (!isOpen) return null;

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      setTimeout(() => {
        onClose();
        // Reset states
        setConnected(false);
        setDreamerName("");
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-zinc-950/90 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl overflow-hidden text-left">
        {/* Glow behind modal */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-cosmic-purple/20 filter blur-[40px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-cosmic-teal/15 filter blur-[45px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg font-bold text-white tracking-wider">
            CONSCIOUSNESS SYNC
          </h3>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {connected ? (
          /* Connection Success Screen */
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cosmic-purple to-cosmic-teal flex items-center justify-center p-[2px] animate-pulse">
              <div className="w-full h-full rounded-full bg-[#09090b] flex items-center justify-center">
                <svg className="w-8 h-8 text-cosmic-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-white">Synchronization Complete</h4>
              <p className="text-xs text-zinc-500">
                Your coordinates are now connected to the collective subconscious.
              </p>
            </div>
          </div>
        ) : connecting ? (
          /* Connection Loading Screen */
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 relative z-10">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-cosmic-purple/30" />
              <div className="absolute inset-0 rounded-full border-2 border-t-cosmic-teal animate-spin" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-white animate-pulse">Establishing Neural Uplink...</h4>
              <p className="text-xs text-zinc-500">Aligning star-network frequencies...</p>
            </div>
          </div>
        ) : (
          /* Selection Screen */
          <form onSubmit={handleConnect} className="space-y-6 relative z-10">
            {/* Method Selectors */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod("anonymous")}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border text-xxs font-semibold uppercase tracking-wider transition-all duration-300 gap-1.5 ${
                  method === "anonymous"
                    ? "bg-cosmic-purple/10 border-cosmic-purple/40 text-purple-300"
                    : "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Anon Node
              </button>

              <button
                type="button"
                onClick={() => setMethod("dreamer")}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border text-xxs font-semibold uppercase tracking-wider transition-all duration-300 gap-1.5 ${
                  method === "dreamer"
                    ? "bg-cosmic-teal/10 border-cosmic-teal/40 text-cyan-300"
                    : "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Dreamer ID
              </button>

              <button
                type="button"
                onClick={() => setMethod("neurallink")}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border text-xxs font-semibold uppercase tracking-wider transition-all duration-300 gap-1.5 ${
                  method === "neurallink"
                    ? "bg-purple-500/10 border-purple-500/40 text-purple-400"
                    : "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                Neural Link
              </button>
            </div>

            {/* Description Text */}
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              {method === "anonymous" && "Generate an ephemeral, randomized credentials token to map dreams anonymously without tracking."}
              {method === "dreamer" && "Create or log in to a unique consciousness key identity to build your personal constellation timeline."}
              {method === "neurallink" && "Establish direct synchronization with a simulated external EEG or headband device to map brainwaves."}
            </p>

            {/* Form Fields */}
            {method === "dreamer" && (
              <div className="space-y-1">
                <label className="text-xxs font-semibold uppercase tracking-wider text-zinc-400">
                  Dreamer Handle
                </label>
                <input
                  required
                  type="text"
                  value={dreamerName}
                  onChange={(e) => setDreamerName(e.target.value)}
                  placeholder="e.g. LucidWalker_09"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cosmic-teal/50 focus:ring-1 focus:ring-cosmic-teal/20 transition-all duration-300"
                />
              </div>
            )}

            {method === "neurallink" && (
              <div className="space-y-1">
                <label className="text-xxs font-semibold uppercase tracking-wider text-zinc-400">
                  Simulated Link Port
                </label>
                <input
                  disabled
                  type="text"
                  value="neural_link_com_3 (Virtual Interface)"
                  className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-zinc-600 cursor-not-allowed"
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`w-full py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 bg-gradient-to-r ${
                method === "anonymous" ? "from-cosmic-purple to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-cosmic-purple/10" :
                method === "dreamer" ? "from-cosmic-teal to-cyan-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-cosmic-teal/10" :
                "from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
              } border border-white/10 shadow-lg`}
            >
              {method === "anonymous" && "Generate Anon Key"}
              {method === "dreamer" && "Sync Dreamer Identity"}
              {method === "neurallink" && "Initialize Neural Upload"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
