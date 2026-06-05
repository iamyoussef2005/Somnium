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
    <div className="w-full max-w-md bg-zinc-950/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
      {/* Decorative ambient glowing line on top of form */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cosmic-purple/40 to-transparent" />

      <div className="mb-5 text-left">
        <h3 className="text-lg font-semibold text-white tracking-wide">
          Log a Dream
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
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cosmic-purple/50 focus:ring-1 focus:ring-cosmic-purple/20 transition-all duration-300 resize-none"
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
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cosmic-purple/50 focus:ring-1 focus:ring-cosmic-purple/20 transition-all duration-300"
          />
        </div>

        {/* Error/Success Feedbacks */}
        {error && (
          <div className="text-xs text-red-400 bg-red-950/20 border border-red-500/10 rounded-lg p-3">
            {error}
          </div>
        )}
        {success && (
          <div className="text-xs text-cosmic-teal bg-cosmic-teal/5 border border-cosmic-teal/20 rounded-lg p-3 animate-pulse">
            Dream aligned! Synchronizing constellation coordinates...
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !textContent.trim()}
          className={`w-full py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
            loading
              ? "bg-cosmic-purple/20 text-cosmic-purple cursor-not-allowed border border-cosmic-purple/30"
              : "bg-gradient-to-r from-cosmic-purple to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-cosmic-purple/10 hover:shadow-cosmic-purple/25 border border-white/10"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cosmic-teal animate-ping" />
              <span className="animate-pulse">Parsing subconscious symbols...</span>
            </span>
          ) : (
            "Log Subconscious Memory"
          )}
        </button>
      </form>
    </div>
  );
}
