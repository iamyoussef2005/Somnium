import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic SEO metadata based on the SQLite Theme records
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug === "%5Bslug%5D" || slug === "[slug]") {
    return {
      title: "Theme Profile — Somnium Collective Subconscious",
    };
  }
  
  const theme = await db.theme.findUnique({
    where: { slug },
  });

  if (!theme) {
    return {
      title: "Theme Not Found — Somnium Collective Subconscious",
    };
  }

  return {
    title: `What does it mean to dream about ${theme.name}? — Somnium Collective Subconscious`,
    description: theme.description || `Explore anonymous dream logs and AI interpretations related to ${theme.name} in the collective subconscious map.`,
  };
}

export default async function ThemePage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug || slug === "%5Bslug%5D" || slug === "[slug]") {
    notFound();
  }

  // Fetch the Theme by slug, including all related dreams
  const theme = await db.theme.findUnique({
    where: { slug },
    include: {
      dreams: {
        include: {
          dream: true,
        },
        orderBy: {
          dream: {
            createdAt: "desc",
          },
        },
      },
    },
  });

  // Trigger 404 page if the slug doesn't exist
  if (!theme) {
    notFound();
  }

  // Format date helper
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#09090b] text-[#f4f4f5] overflow-hidden bg-grid-pattern selection:bg-cosmic-purple/30 selection:text-cosmic-teal">
      
      {/* Ambient Nebula Background */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cosmic-purple/10 mix-blend-screen filter blur-[80px] pointer-events-none animate-nebula-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cosmic-teal/5 mix-blend-screen filter blur-[100px] pointer-events-none animate-nebula-slow" style={{ animationDelay: "-10s" }} />

      {/* Header */}
      <header className="relative w-full z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.03]">
        <Link href="/" className="flex items-center gap-2 group">
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
            Back to Consciousness Map
          </Link>
        </div>
      </header>

      {/* Main Profile Content */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-16">
        
        {/* Symbol Meta & Title */}
        <div className="space-y-6 text-center md:text-left mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-teal/10 border border-cosmic-teal/20 text-xs font-medium text-cyan-300 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cosmic-teal animate-pulse" />
            Symbol Frequency: {theme.dreams.length} dream{theme.dreams.length === 1 ? "" : "s"}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight pb-2 bg-gradient-to-r from-cosmic-purple via-purple-300 to-cosmic-teal bg-clip-text text-transparent text-glow">
            {theme.name}
          </h1>
          
          {/* Poetic AI Quote Interpretation */}
          {theme.description && (
            <div className="relative p-6 rounded-2xl bg-zinc-950/40 border border-white/5 backdrop-blur-md text-left">
              <div className="absolute -top-3 left-6 text-3xl text-cosmic-purple/40 font-serif">“</div>
              <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed italic pl-3">
                {theme.description}
              </p>
              <div className="text-xxs text-zinc-600 font-semibold tracking-wider text-right uppercase mt-4">
                — AI Subconscious Synthesis
              </div>
            </div>
          )}
        </div>

        {/* Dream Logs List */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
            <svg className="w-4 h-4 text-cosmic-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            Anonymous Transmissions
          </h2>

          {theme.dreams.length === 0 ? (
            <p className="text-sm text-zinc-500 italic">No dream logs are currently linked to this constellation coordinate.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {theme.dreams.map(({ dream }) => (
                <div
                  key={dream.id}
                  className="bg-zinc-950/30 border border-white/5 hover:border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 space-y-4 relative group"
                >
                  {/* Subtle hover gradient light */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cosmic-purple/0 via-cosmic-purple/0 to-cosmic-teal/0 group-hover:to-cosmic-teal/[0.015] pointer-events-none transition-all duration-300" />
                  
                  {/* Dream Text */}
                  <p className="text-sm text-zinc-300 leading-relaxed font-light whitespace-pre-wrap select-text">
                    {dream.textContent}
                  </p>
                  
                  {/* Meta (Date + optional Location) */}
                  <div className="flex flex-wrap items-center justify-between text-xxs text-zinc-500 gap-2 border-t border-white/[0.02] pt-3">
                    <div>Logged: {formatDate(dream.createdAt)}</div>
                    
                    {dream.location && (
                      <div className="flex items-center gap-1 text-cosmic-teal/80">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{dream.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 border-t border-white/[0.03] gap-4">
        <div>
          &copy; {new Date().getFullYear()} Somnium Project. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Consciousness Map</Link>
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">API</a>
        </div>
      </footer>
    </div>
  );
}
