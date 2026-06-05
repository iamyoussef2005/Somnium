"use client";

import React, { useState } from "react";

export default function DreamForm() {
  const [textContent, setTextContent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const maxChars = 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/process-dream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textContent,
          location: location.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to process the dream.");
      }

      setSuccess(true);
      setTextContent("");
      setLocation("");
      
      // Trigger a page reload to dynamically re-draw the canvas with the updated SQLite nodes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md glass-panel animated-gradient-border p-7 relative overflow-hidden transition-all duration-500">
      {/* Decorative ambient glowing line — top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cosmic-purple/60 to-transparent" />
      {/* Secondary softer glow underneath */}
      <div className="absolute top-[2px] left-[10%] right-[10%] h-[4px] bg-gradient-to-r from-transparent via-cosmic-teal/20 to-transparent blur-sm" />

      <div className="mb-5 text-left">
        <h3 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
          Log a Dream
          {/* Animated decorative star */}
          <span
            className="text-cosmic-purple text-sm inline-block"
            style={{ animation: "star-pulse-glow 2.5s ease-in-out infinite" }}
          >
            ✦
          </span>
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Record your subconscious memory and let AI extract its core symbols.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Text Area */}
        <div className="space-y-1">
          <label className="text-xxs font-semibold uppercase tracking-wider text-zinc-400">
            Dream Description
          </label>
          <div className="relative">
            <textarea
              required
              rows={4}
              maxLength={maxChars}
              disabled={loading}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="I was running through a field of glowing glass roses..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 shadow-inner shadow-black/20 focus:outline-none focus:border-cosmic-purple/50 focus:ring-1 focus:ring-cosmic-purple/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all duration-300 resize-none"
            />
            {/* Character Counter */}
            <div className="absolute bottom-2 right-3 text-[10px] text-zinc-600">
              {textContent.length} / {maxChars}
            </div>
          </div>
        </div>

        {/* Location Input */}
        <div className="space-y-1">
          <label className="text-xxs font-semibold uppercase tracking-wider text-zinc-400">
            Sleep Location (Optional)
          </label>
          <input
            type="text"
            maxLength={100}
            disabled={loading}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. My Bedroom, Cabin in the woods"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 shadow-inner shadow-black/20 focus:outline-none focus:border-cosmic-purple/50 focus:ring-1 focus:ring-cosmic-purple/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all duration-300"
          />
        </div>

        {/* Error/Success Feedbacks */}
        {error && (
          <div className="text-xs text-red-400 bg-red-950/20 border border-red-500/10 rounded-lg p-3">
            {error}
          </div>
        )}
        {success && (
          <div className="text-xs text-cosmic-teal bg-cosmic-teal/5 border border-cosmic-teal/20 rounded-lg p-3 flex items-center gap-2.5">
            {/* Animated checkmark */}
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cosmic-teal/15 flex-shrink-0"
              style={{ animation: "success-pop 0.5s ease-out forwards" }}
            >
              <svg
                className="w-3 h-3 text-cosmic-teal"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M2 6.5L5 9.5L10 3"
                  style={{
                    strokeDasharray: 24,
                    strokeDashoffset: 0,
                    animation: "checkmark-draw 0.4s ease-out 0.2s both",
                  }}
                />
              </svg>
            </span>
            <span className="animate-pulse">
              Dream aligned! Synchronizing constellation coordinates...
            </span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !textContent.trim()}
          className={`w-full py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative overflow-hidden group ${
            loading
              ? "bg-cosmic-purple/20 text-cosmic-purple cursor-not-allowed border border-cosmic-purple/30"
              : "bg-gradient-to-r from-cosmic-purple to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-cosmic-purple/20 hover:shadow-cosmic-purple/30 border border-white/10"
          }`}
        >
          {/* Shimmer sweep overlay — only visible on hover when not loading */}
          {!loading && (
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              aria-hidden="true"
            >
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ animation: "shimmer-sweep 1.5s ease-in-out infinite" }}
              />
            </span>
          )}

          {loading ? (
            <span className="flex items-center justify-center gap-2.5 relative z-10">
              <span
                className="w-2 h-2 rounded-full bg-cosmic-teal"
                style={{ animation: "cosmic-dot-pulse 1.2s ease-in-out infinite" }}
              />
              <span className="animate-pulse">Parsing subconscious symbols...</span>
            </span>
          ) : (
            <span className="relative z-10">Log Subconscious Memory</span>
          )}
        </button>
      </form>
    </div>
  );
}
