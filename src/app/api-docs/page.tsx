import React from "react";
import Link from "next/link";

export const metadata = {
  title: "API Documentation — Somnium Subconscious Map",
  description: "Developer API guidelines for interacting with the Somnium subconscious dream network.",
};

export default function ApiDocsPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#09090b] text-[#f4f4f5] overflow-hidden bg-grid-pattern selection:bg-cosmic-purple/30 selection:text-cosmic-teal font-sans">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cosmic-purple/10 mix-blend-screen filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cosmic-teal/5 mix-blend-screen filter blur-[100px] pointer-events-none" />

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

      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-6 py-12 text-left space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight pb-2 bg-gradient-to-r from-cosmic-purple to-cosmic-teal bg-clip-text text-transparent text-glow inline-block font-bold">
            Subconscious Network API
          </h1>
          <p className="text-sm text-zinc-400 font-light leading-relaxed">
            Developers can programmatically query coordinates or submit dream logs to the mapping index using our simple JSON REST endpoints.
          </p>
        </div>

        {/* POST Endpoint */}
        <section className="space-y-4 p-6 rounded-2xl bg-zinc-950/40 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 text-left">
            <span className="text-[10px] font-bold bg-cosmic-purple/10 text-purple-300 border border-cosmic-purple/20 px-2 py-0.5 rounded uppercase">
              POST
            </span>
            <code className="text-xs font-mono text-zinc-300">/api/process-dream</code>
          </div>
          <p className="text-xs text-zinc-400 font-light">
            Submits a new dream log description. The text is parsed by Gemini 2.5 Flash using structured outputs, and the extracted symbols are saved directly into the SQLite database.
          </p>
          <div className="space-y-2 text-left">
            <h4 className="text-xs font-semibold text-white">Payload Parameters</h4>
            <pre className="p-4 rounded-xl bg-black/60 text-xxs font-mono text-cosmic-teal overflow-x-auto">
{`{
  "textContent": "string (Required. The raw memory story)",
  "location": "string (Optional. Sleeper location descriptor)"
}`}
            </pre>
          </div>
        </section>

        {/* GET Endpoint */}
        <section className="space-y-4 p-6 rounded-2xl bg-zinc-950/40 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 text-left">
            <span className="text-[10px] font-bold bg-cosmic-teal/10 text-cyan-300 border border-cosmic-teal/20 px-2 py-0.5 rounded uppercase">
              GET
            </span>
            <code className="text-xs font-mono text-zinc-300">/api/network</code>
          </div>
          <p className="text-xs text-zinc-400 font-light">
            Returns compiled nodes and links mapping the collective constellation. Links calculate co-occurrence frequencies between symbols.
          </p>
          <div className="space-y-2 text-left">
            <h4 className="text-xs font-semibold text-white">Response Structure</h4>
            <pre className="p-4 rounded-xl bg-black/60 text-xxs font-mono text-cosmic-teal overflow-x-auto">
{`{
  "nodes": [
    { "id": "string", "name": "string", "slug": "string", "weight": 4 }
  ],
  "links": [
    { "source": "string (themeId)", "target": "string (themeId)", "strength": 3 }
  ]
}`}
            </pre>
          </div>
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
