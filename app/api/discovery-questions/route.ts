import { NextRequest, NextResponse } from "next/server";
import { askGeminiForJSON } from "@/lib/gemini";
import { DISCOVERY_SYSTEM_PROMPT, intakeSummary } from "@/lib/prompts";
import { IntakeState } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const intake: IntakeState = await req.json();

    const result = await askGeminiForJSON<{ questions: string[] }>({
      system: DISCOVERY_SYSTEM_PROMPT,
      user: intakeSummary(intake),
      maxTokens: 800,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("discovery-questions error:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to generate discovery questions" },
      { status: 500 }
    );
  }
}
