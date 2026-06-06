import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";

// Standardized list of ~119 dream archetypes to ensure logical consolidation of stars
const ALLOWED_ARCHETYPES = [
  "Abandonment", "Abyss", "Alchemy", "Altar", "Ancestor", "Anchor", "Angel", "Animals",
  "Antiques", "Apple", "Arcade", "Archway", "Armor", "Arrow", "Artist", "Ash",
  "Attic", "Authority", "Avalanche", "Balloon", "Banquet", "Basement", "Battle", "Beacon",
  "Beast", "Bedroom", "Bell", "Bicycle", "Bird", "Birth", "Blindness", "Blizzard",
  "Blood", "Boat", "Bones", "Book", "Boundary", "Bouquet", "Box", "Bridge",
  "Butterfly", "Cage", "Camera", "Campfire", "Canal", "Candle", "Canyon", "Caravan",
  "Carnival", "Carousel", "Castle", "Cat", "Cathedral", "Cave", "Cemetery", "Chain",
  "Chalice", "Chaos", "Chase", "Cherry Blossom", "Chess", "Child", "Chimney", "Chrysalis",
  "Circle", "City", "Classroom", "Cliff", "Climbing", "Cloak", "Clock", "Clothing",
  "Cloud", "Cobweb", "Cocoon", "Companion", "Compass", "Constellation", "Corridor", "Courtroom",
  "Cradle", "Crescent", "Crossroads", "Crowd", "Crown", "Crystal", "Cup", "Current",
  "Curtain", "Dagger", "Dam", "Dance", "Darkness", "Dawn", "Death", "Debt",
  "Deer", "Deluge", "Departure", "Depth", "Desert", "Desertion", "Destination", "Detective",
  "Diamond", "Diary", "Digging", "Disguise", "Doll", "Dome", "Door", "Doppelganger",
  "Dove", "Dragon", "Dreamcatcher", "Driving", "Drowning", "Dust", "Eagle", "Earth",
  "Echo", "Eclipse", "Eldritch", "Elevator", "Ember", "Emerald", "Emperor", "Empress",
  "Enigma", "Envelope", "Escape", "Exam", "Exile", "Eye", "Fairy", "Falcon",
  "Fall", "Falling", "Family", "Father", "Fear", "Feast", "Feather", "Ferry",
  "Fever", "Fire", "Fish", "Flight", "Floating", "Flood", "Flute", "Fog",
  "Fool", "Footprints", "Forest", "Forge", "Forgotten", "Fortress", "Fountain", "Frame",
  "Freeze", "Funeral", "Galaxy", "Gallows", "Garden", "Gate", "Gem", "Ghost",
  "Giant", "Gift", "Glacier", "Glass", "Glow", "Goblet", "Gold", "Golem",
  "Grave", "Greenhouse", "Guide", "Harp", "Harvest", "Hatch", "Hawk", "Healer",
  "Heart", "Heaven", "Helix", "Helmet", "Hermit", "Hive", "Horizon", "Horse",
  "Hospital", "Hourglass", "House", "Hunger", "Ice", "Illness", "Incubator", "Ink",
  "Insect", "Invisibility", "Island", "Ivory", "Ivy", "Jade", "Jail", "Jester",
  "Jewel", "Journal", "Journey", "Joy", "Judge", "Jungle", "Key", "King",
  "Kite", "Knight", "Knot", "Laboratory", "Labyrinth", "Ladder", "Lake", "Lamb",
  "Lamp", "Lantern", "Lava", "Leaf", "Leaping", "Lens", "Letter", "Library",
  "Lifeboat", "Light", "Lighthouse", "Lightning", "Lily", "Lion", "Lizard", "Lock",
  "Locomotive", "Loom", "Lost", "Lotus", "Lover", "Machine", "Magic", "Magician",
  "Magnet", "Map", "Market", "Mask", "Meadow", "Medallion", "Mermaid", "Messenger",
  "Meteor", "Millennium", "Mine", "Mirror", "Mist", "Monarch", "Monastery", "Money",
  "Monolith", "Monster", "Moon", "Mother", "Mountain", "Mourning", "Mud", "Museum",
  "Music", "Mutation", "Nakedness", "Needle", "Nest", "Net", "Nightmare", "Nomad",
  "Oasis", "Obelisk", "Obsidian", "Ocean", "Octopus", "Olympus", "Oracle", "Orchard",
  "Orpheum", "Outcast", "Owl", "Palace", "Panoply", "Paper", "Parallel World", "Paralysis",
  "Parchment", "Passage", "Path", "Peacock"
];

// Programmatic helper to generate clean, URL-friendly slugs
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove all non-word characters except spaces and hyphens
    .replace(/[\s_]+/g, "-")  // Replace spaces and underscores with hyphens
    .replace(/-+/g, "-");     // Remove duplicate hyphens
}

export async function POST(request: Request) {
  try {
    // 0. Authenticate User
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access. Please sync consciousness." },
        { status: 401 }
      );
    }

    // 1. Request Validation
    const body = await request.json().catch(() => ({}));
    const { textContent, location } = body;

    if (!textContent || typeof textContent !== "string" || textContent.trim() === "") {
      return NextResponse.json(
        { error: "Missing or invalid 'textContent' in request body." },
        { status: 400 }
      );
    }

    // 2. Initialize Gemini Client
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[GEMINI ROUTE ERROR] GEMINI_API_KEY environment variable is not defined.");
      return NextResponse.json(
        { error: "AI Parsing service is temporarily misconfigured." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // 3. Structured AI Content Generation
    console.log("[GEMINI ROUTE] Dispatching request to gemini-2.5-flash...");
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: textContent,
      config: {
        systemInstruction:
          `You are an objective dream parser. Analyze the user's raw dream story. Extract up to 3 core underlying symbolic themes or central topics.
          For each extracted theme, select the single most applicable name from the following allowed list of archetypes. You MUST match the name EXACTLY (case-sensitive) from this list:
          ${ALLOWED_ARCHETYPES.join(", ")}
          
          For each theme, provide the selected archetype name (as the 'name' property) and a brief, poetic 1-sentence interpretation of what that symbol represents in the specific context of this dream (as the 'description' property).`,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            themes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                },
                required: ["name", "description"],
              },
            },
          },
          required: ["themes"],
        },
      },
    });

    const responseText = aiResponse.text;
    if (!responseText) {
      throw new Error("Empty response received from Gemini model.");
    }

    // Parse the structured response from Gemini
    const parsedData = JSON.parse(responseText) as {
      themes?: Array<{ name: string; description: string }>;
    };

    const extractedThemes = parsedData.themes || [];
    console.log(`[GEMINI ROUTE] Successfully extracted ${extractedThemes.length} themes.`);

    // 4. Safe Database Transaction using Prisma 7 Client
    const transactionResult = await db.$transaction(async (tx) => {
      // Create the core Dream record
      const dream = await tx.dream.create({
        data: {
          textContent: textContent.trim(),
          location: location && typeof location === "string" ? location.trim() : null,
          userId,
        },
      });

      const processedThemes = [];

      // Link each theme in the transaction
      for (const extractedTheme of extractedThemes) {
        const rawName = extractedTheme.name || "Symbol";
        const rawDescription = extractedTheme.description || "A symbol appearing in the dream.";

        const name = rawName.trim();
        const description = rawDescription.trim();
        const slug = generateSlug(name);

        // Upsert the unique Theme node
        const theme = await tx.theme.upsert({
          where: { slug },
          create: {
            name,
            slug,
            description,
          },
          update: {
            description, // Keep description updated to match the latest context
          },
        });

        // Link Dream and Theme together via the explicit join table
        const dreamTheme = await tx.dreamTheme.create({
          data: {
            dreamId: dream.id,
            themeId: theme.id,
          },
        });

        processedThemes.push({
          id: theme.id,
          name: theme.name,
          slug: theme.slug,
          description: theme.description,
          createdAt: theme.createdAt,
          relationId: dreamTheme.id,
        });
      }

      return { dream, themes: processedThemes };
    });

    // 5. Response
    return NextResponse.json(transactionResult, { status: 201 });
  } catch (error: any) {
    console.error("[GEMINI ROUTE TRANSACTION ERROR]:", error);

    // Differentiate between JSON parsing error or system error
    const status = error instanceof SyntaxError ? 502 : 500;
    const message =
      error instanceof SyntaxError
        ? "Received malformed JSON from the parsing engine."
        : error.message || "An unexpected error occurred during processing.";

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
