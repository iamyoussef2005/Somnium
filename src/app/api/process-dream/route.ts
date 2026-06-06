import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";

// Standardized list of ~119 dream archetypes to ensure logical consolidation of stars
const ALLOWED_ARCHETYPES = [
  "Abandonment", "Attic", "Ancestor", "Animals", "Authority", "Basement", "Battle", "Bedroom",
  "Birth", "Blindness", "Blood", "Book", "Bridge", "Castle", "Cave", "Chaos", "Chase", "Child",
  "City", "Classroom", "Climbing", "Clock", "Clothing", "Cloud", "Companion", "Courtroom", "Crowd",
  "Darkness", "Death", "Desert", "Doppelganger", "Door", "Dragon", "Driving", "Drowning", "Earth",
  "Eclipse", "Escape", "Exam", "Falling", "Family", "Fear", "Feast", "Fire", "Fish", "Flight",
  "Floating", "Flood", "Forest", "Forgotten", "Funeral", "Garden", "Ghost", "Giant", "Glass",
  "Gold", "Guide", "Horizon", "Hospital", "House", "Hunger", "Illness", "Insect", "Invisibility",
  "Joy", "Key", "Labyrinth", "Light", "Lightning", "Lost", "Lover", "Magic", "Mask", "Mirror",
  "Money", "Monster", "Mountain", "Nakedness", "Ocean", "Parallel World", "Paralysis", "Portal",
  "Prison", "Rain", "Rebirth", "Revelation", "River", "Road", "Ruins", "School", "Search", "Shadow",
  "Snake", "Spider", "Storm", "Stranger", "Swimming", "Sword", "Teacher", "Teeth", "Teleportation",
  "Time", "Tower", "Train", "Transformation", "Trap", "Treasure", "Tree", "Tunnel", "Wall", "War",
  "Water", "Weapon", "Wedding", "Wind", "Witch", "Wolf", "Wound", "Writing"
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
