import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { BRANCH_IDEAS } from "@/content";

const ideaSchema = z.object({
  branch: z.string().min(1),
  interest: z.string().optional().default("AI & Automation"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ideaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Branch is required" },
        { status: 400 }
      );
    }

    const { branch, interest } = parsed.data;

    // Detect branch category
    let branchKey = "Default";
    const lower = branch.toLowerCase();
    if (lower.includes("computer") || lower.includes("cse") || lower.includes("it") || lower.includes("data") || lower.includes("ai")) {
      branchKey = "CSE";
    } else if (lower.includes("electronic") || lower.includes("ece") || lower.includes("communication")) {
      branchKey = "ECE";
    } else if (lower.includes("electrical") || lower.includes("eee")) {
      branchKey = "EEE";
    } else if (lower.includes("mech")) {
      branchKey = "Mech";
    } else if (lower.includes("civil")) {
      branchKey = "Civil";
    }

    const fallbackIdeas = BRANCH_IDEAS[branchKey] || BRANCH_IDEAS["Default"];

    // Check if an LLM key is configured (Gemini or OpenAI)
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4500); // Strict under 5s timeout

        const prompt = `You are a technical mentor for final-year engineering students preparing for placements.
Generate 3 realistic, impressive, 60-minute-scoped AI projects for a ${branch} student interested in "${interest}".
Respond with ONLY valid JSON with this exact schema:
{
  "ideas": [
    {
      "title": "string (concise technical title)",
      "desc": "string (1-2 sentences on what it does and libraries used)",
      "resumeLine": "string (strong resume bullet point: 'Built/Engineered X using Y achieving Z')"
    }
  ]
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.3,
              },
            }),
          }
        );

        clearTimeout(timeout);

        if (res.ok) {
          const geminiData = await res.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsedJson = JSON.parse(rawText);
            if (Array.isArray(parsedJson.ideas) && parsedJson.ideas.length >= 3) {
              return NextResponse.json({
                success: true,
                source: "ai",
                ideas: parsedJson.ideas.slice(0, 3),
              });
            }
          }
        }
      } catch (llmErr) {
        console.warn("LLM generation timed out or failed, utilizing deterministic template fallback:", llmErr);
      }
    }

    // Deterministic fallback (immediate, 100% reliable, zero false claims)
    return NextResponse.json({
      success: true,
      source: "curated_template",
      ideas: fallbackIdeas,
    });
  } catch (err: unknown) {
    console.error("AI Idea generation error:", err);
    return NextResponse.json({
      success: true,
      source: "curated_template",
      ideas: BRANCH_IDEAS["Default"],
    });
  }
}
