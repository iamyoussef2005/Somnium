import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Fallback mock graph configuration to show a beautiful graph on first install before any logs exist.
const FALLBACK_DATA = {
  nodes: [
    { id: "mock-1", name: "Flying", slug: "flying", weight: 4 },
    { id: "mock-2", name: "Obsidian City", slug: "obsidian-city", weight: 3 },
    { id: "mock-3", name: "Neon Butterfly", slug: "neon-butterfly", weight: 2 },
    { id: "mock-4", name: "Deep Water", slug: "deep-water", weight: 3 },
    { id: "mock-5", name: "Whispering Wind", slug: "whispering-wind", weight: 1 },
    { id: "mock-6", name: "Labyrinth", slug: "labyrinth", weight: 2 },
  ],
  links: [
    { source: "mock-1", target: "mock-2", strength: 3 },
    { source: "mock-2", target: "mock-3", strength: 2 },
    { source: "mock-3", target: "mock-1", strength: 1 },
    { source: "mock-4", target: "mock-6", strength: 2 },
    { source: "mock-6", target: "mock-2", strength: 1 },
    { source: "mock-4", target: "mock-5", strength: 1 },
  ],
};

export async function GET() {
  try {
    // 1. Fetch all themes and join with dreams relation table to get weights
    const themes = await db.theme.findMany({
      include: {
        dreams: true,
      },
    });

    // 2. Fetch all dream-themes relations to compute edge co-occurrences
    const dreamThemes = await db.dreamTheme.findMany();

    // If database is empty, return the beautiful mockup layout
    if (themes.length === 0) {
      console.log("[NETWORK API] Database is empty, serving fallback constellation graph.");
      return NextResponse.json(FALLBACK_DATA);
    }

    // 3. Construct Nodes Array
    const nodes = themes.map((theme: any) => ({
      id: theme.id,
      name: theme.name,
      slug: theme.slug,
      weight: theme.dreams.length,
    }));

    // 4. Construct Links Array (Themes co-occurring inside the same Dream)
    // Group themeIds by their associated dreamId
    const dreamToThemesMap: Record<string, string[]> = {};
    for (const dt of dreamThemes) {
      if (!dreamToThemesMap[dt.dreamId]) {
        dreamToThemesMap[dt.dreamId] = [];
      }
      dreamToThemesMap[dt.dreamId].push(dt.themeId);
    }

    // Calculate frequencies of co-occurring theme pairs
    const linkFrequencyMap: Record<string, { source: string; target: string; strength: number }> = {};

    for (const dreamId in dreamToThemesMap) {
      const associatedThemeIds = dreamToThemesMap[dreamId];
      if (associatedThemeIds.length < 2) continue; // Needs at least 2 themes to form a connection

      // Loop through all unique combinations of theme pairs in the dream
      for (let i = 0; i < associatedThemeIds.length; i++) {
        for (let j = i + 1; j < associatedThemeIds.length; j++) {
          const themeA = associatedThemeIds[i];
          const themeB = associatedThemeIds[j];

          // Enforce consistent ordering to prevent double count (e.g. A-B and B-A)
          const [source, target] = themeA < themeB ? [themeA, themeB] : [themeB, themeA];
          const pairKey = `${source}_${target}`;

          if (!linkFrequencyMap[pairKey]) {
            linkFrequencyMap[pairKey] = { source, target, strength: 0 };
          }
          linkFrequencyMap[pairKey].strength += 1;
        }
      }
    }

    const links = Object.values(linkFrequencyMap);

    return NextResponse.json({ nodes, links });
  } catch (error: any) {
    console.error("[NETWORK API GET ERROR]:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred building the constellation network." },
      { status: 500 }
    );
  }
}
