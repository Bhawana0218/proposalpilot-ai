import { NextRequest, NextResponse } from "next/server";
import { askGroqForJSON } from "@/lib/groq";
import { DISCOVERY_SYSTEM_PROMPT, intakeSummary } from "@/lib/prompts";
import { DiscoveryResult, IntakeState } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const intake: IntakeState = await req.json();

    const result = await askGroqForJSON<DiscoveryResult>({
      system: DISCOVERY_SYSTEM_PROMPT,
      user: intakeSummary(intake),
      maxTokens: 2000,
    });

    // Aggressive safety net: ensure we ALWAYS have meaningful questions
    const fallbackQuestions = [
      "Are there any third-party APIs or existing systems that need to be integrated — and are those APIs documented and stable?",
      "What compliance or regulatory requirements apply to this project (GDPR, SOC2, HIPAA, PCI-DSS)?",
      "What does success look like 6 months after launch — what KPIs or metrics will determine ROI?",
      "Will this need to support mobile, and if so, native apps or responsive web?",
      "Who owns QA and user acceptance testing — NexGeTech or the client's internal team?",
      "What is the expected user count at launch vs. 12 months post-launch?",
    ];

    if (!result.questions || result.questions.length < 2) {
      result.questions = fallbackQuestions.slice(0, 4);
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

    if (!result.consultantInsights || result.consultantInsights.length === 0) {
      result.consultantInsights = [
        "Based on similar projects, authentication and role management often increase scope by 15-20%. This should be planned upfront.",
        "Companies in this industry typically underestimate the effort required for audit logging and compliance — this should be scoped from day one.",
      ];
    }

    if (!result.riskFlags || result.riskFlags.length === 0) {
      result.riskFlags = [
        "No deployment or DevOps ownership mentioned — this can add 2-3 weeks if not pre-planned.",
      ];
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[Groq] discovery-questions error:", err);
    return NextResponse.json(
      {
        success: false,
        provider: "groq",
        error: err.message ?? "AI model temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}
