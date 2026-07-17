import { NextRequest, NextResponse } from "next/server";
import { askGeminiForJSON } from "@/lib/gemini";
import { DISCOVERY_SYSTEM_PROMPT, intakeSummary } from "@/lib/prompts";
import { DiscoveryResult, IntakeState } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const intake: IntakeState = await req.json();

    const result = await askGeminiForJSON<DiscoveryResult>({
      system: DISCOVERY_SYSTEM_PROMPT,
      user: intakeSummary(intake),
      maxTokens: 1200,
    });

    // Safety: ensure questions is never empty
    if (!result.questions || result.questions.length === 0) {
      result.questions = [
        "What specific integrations with existing systems will this project require?",
        "Are there any compliance or security requirements we should plan for?",
        "What does success look like 6 months after launch?",
      ];
    }

    // Ensure completeness has defaults
    if (!result.completeness) {
      result.completeness = {
        businessClarity: 60,
        technicalConfidence: 50,
        scopeCompleteness: 55,
        deliveryRisk: 40,
      };
    }

    if (!result.consultantInsights) {
      result.consultantInsights = [];
    }
    if (!result.riskFlags) {
      result.riskFlags = [];
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("discovery-questions error:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to generate discovery questions" },
      { status: 500 }
    );
  }
}
